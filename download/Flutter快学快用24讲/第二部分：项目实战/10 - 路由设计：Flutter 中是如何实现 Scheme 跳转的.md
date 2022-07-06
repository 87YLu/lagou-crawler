上一课时我们已经创建好了项目的基础框架结构，其中有一个 router.dart 文件，该文件的作用是实现 App 内的一个路由管理和跳转。本课时是基于该功能模块，着重介绍如何实现 App 内外的路由跳转。

### Scheme

在介绍路由跳转实现之前，我们先来了解下 Scheme 的概念，Scheme 是一种 App 内跳转协议，通过 Scheme 协议在 APP 内实现一些页面的互相跳转。一般可以使用以下格式协议。

    [scheme]://[host]/[path]?[query]
    

这种格式不仅可以使用在 App 内部实现可跳转，还可以适用于外部拉起 App 指定页面的功能。内部跳转类似于前端的页面路由，只不过前端的页面路由是直接用链接来处理，在 App 中是无法像前端一样能够使用链接实现路由管理。外部跳转则需要分别从 Android 和 iOS 来介绍，其中主要的不同点是一些平台配置，下面我们先来看看内部如何实现路由跳转。

### 内部跳转

按照上面的协议规则，我们将 Scheme 设置为项目 App 名字 tyfApp ，由于是 App 跳转 host 可以不设置，path 为具体的 pages 页面，query 则为 pages 需要的参数，举例如下。

    tyfapp://userPageIndex?userId=1001
    

#### 基础版本

根据这个规则，实现 router.dart 逻辑。首先需要 import 相应的 pages 页面，例如这里我们需要两个页面的跳转和一个 Web 页面。

    import 'package:two_you_friend/pages/common/web_view_page.dart';
    import 'package:two_you_friend/pages/home_page/index.dart';
    import 'package:two_you_friend/pages/user_page/index.dart';
    

web\_view\_page.dart 使用第三方库，在遇到 http 或者 https 的协议时，使用该页面去打开，具体代码如下：

    import 'package:flutter/material.dart';
    import 'package:flutter_webview_plugin/flutter_webview_plugin.dart';
    /// 通用跳转逻辑
    class CommonWebViewPage extends StatelessWidget {
      /// url 地址
      final String url;
      /// 构造函数
      CommonWebViewPage({Key key, this.url}) : super(key: key);
      @override
      Widget build(BuildContext context) {
        return WebviewScaffold(
          url: url,
          appBar: AppBar(
            backgroundColor: Colors.blue,
          ),
        );
      }
    }
    

使用第三方库 flutter\_webview\_plugin 来打开具体的网页地址，该组件一个是 url 具体的网址，一个是 appBar 包含 title 和主题信息。如果非网页地址，并符合页面规范的协议时，我们需要解析出跳转的页面以及页面需要的参数。

    /// 解析跳转的url，并且分析其内部参数
    Map<String, dynamic> _parseUrl(String url) {
      if(url.startsWith(appScheme)) {
        url = url.substring(9);
      }
      int placeIndex = url.indexOf('?');
      if(url == '' || url == null) {
        return {'action': '/', 'params': null};
      }
      if (placeIndex < 0) {
        return {'action': url, 'params': null};
      }
      String action = url.substring(0, placeIndex);
      String paramStr = url.substring(placeIndex + 1);
      if (paramStr == null) {
        return {'action': action, 'params': null};
      }
      Map params = {};
      List<String> paramsStrArr = paramStr.split('&');
      for (String singleParamsStr in paramsStrArr) {
        List<String> singleParamsArr = singleParamsStr.split('=');
        params[singleParamsArr[0]] = singleParamsArr[1];
      }
      return {'action': action, 'params': params};
    }
    

上面这段代码和前端解析 url 的代码逻辑完全一致，使用 ? 来分割 path 和参数两部分，再使用 & 来获取参数的 key 和 value。解析出 path 和页面参数后，我们需要根据具体的 path 来跳转到相应的组件页面，并将解析出来的页面参数带入到组件中，代码如下。

    /// 根据url处理获得需要跳转的action页面以及需要携带的参数
    Widget _getPage(String url, Map<String, dynamic> urlParseRet) {
      if (url.startsWith('https://') || url.startsWith('http://')) {
        return CommonWebViewPage(url: url);
      } else if(url.startsWith(appScheme)) {
        // 判断是否解析出 path action，并且能否在路由配置中找到
        String pathAction = urlParseRet['action'].toString();
        switch (pathAction) {
          case "homepage": {
            return _buildPage(HomePageIndex());
          }
          case "userpage": {
            // 必要性检查，如果没有参数则不做任何处理
            if(urlParseRet['params']['user_id'].toString() == null) {
              return null;
            }
            return _buildPage(
                UserPageIndex(
                    userId: urlParseRet['params']['user_id'].toString()
                )
            );
          }
          default: {
            return _buildPage(HomePageIndex());
          }
        }
      }
      return null;
    }
    

首先就是判断是否以 http 和 https 开头，如果是则使用网页打开，如果不是则继续判断是否符合 App Scheme 信息，符合则解析出相应的 path 和参数信息，并且根据 path 调用对应的页面组件，打开相应的页面信息。如果匹配不到或者不符合 App Scheme 则不做任何处理。

最后为该 Router 类添加一个可外部调用的函数，执行页面跳转，代码如下。

    /// 执行页面跳转
    void push(BuildContext context, String url) {
      Map<String, dynamic> urlParseRet = _parseUrl(url);
      // 不同页面，则跳转
      Navigator.push(context, MaterialPageRoute(builder: (context) {
        return _getPage(url, urlParseRet);
      }));
    }
    

上面逻辑会存在一些问题，主要问题是没有考虑到当前页面，无论什么情况下都会打开一个新的页面，这样会很耗费机器资源，接下来我就介绍下如何优化这块逻辑。

#### 进阶版本

进阶版本的目的是判断当前是否有打开页面，如果打开了页面则替换和刷新旧页面，如果没有则打开新的页面。分为以下两点来分析：

1.  了解页面标识，具体打开的页面路由名称；
    
2.  判断当前打开的页面，如果已经打开则更新，未打开则新建窗口；
    

首先，我们需要使用到 Flutter 路由注册功能，我们需要修改 main.dart 中的代码，在 build MaterialApp 组件中增加两个函数，代码如下：

    return MaterialApp(
        title: 'Two You', // APP 名字
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          primarySwatch: Colors.blue, // APP 主题
        ),
        routes: Router().registerRouter(),
        home: Scaffold(
            appBar: AppBar(
              title: Text('Two You'), // 页面名字
            ),
            body: Center(
              child: Entrance(),
            )));
    

上面代码中的第 7 行是注册路由名字，我们看下 Router 中的实现。

    /// 注册路由事件
    Map<String, Widget Function(BuildContext)> registerRouter () {
      return {
        'homepage' : (context) => _buildPage(HomePageIndex()),
        'userpage' : (context) => _buildPage(UserPageIndex())
      };
    }
    

按照这个方式注册其他的页面信息即可，接下来我们着重看下 push 的方法。

    /// 执行页面跳转
    void push(BuildContext context, String url) {
      Map<String, dynamic> urlParseRet = _parseUrl(url);
      Navigator.pushNamedAndRemoveUntil(
          context,
          urlParseRet['action'].toString(), (route) {
                if(route.settings.name ==
                    urlParseRet['action'].toString()) {
                  return false;
                }
                return true;
              }, arguments: urlParseRet['params']);
      }
    }
    

在原来的基础上我们修改了方法，使用到了 pushNamedAndRemoveUntil 方法，并且在第二个回调参数中判断是否为当前页面，如果是则返回 false，否则返回 true。这种方式有个缺点就是在具体的 pages 页面中不能直接通过构造函数去获取参数，必须使用下面的方式。

    @override
    Widget build(BuildContext context) {
      Map dataInfo = JsonConfig.objectToMap(
          ModalRoute.of(context).settings.arguments
      );
      // TODO: implement build
      return Text('I am use page ${dataInfo['userId']}');
    }
    

获取的方式是第 3 到 5 行，这段逻辑还必须在 build 中，存在一定缺陷，现阶段还没有找到其他的解决方案，后续有解决方案再通过源码进行更新。

以上就是整个 router.dart 的实现逻辑，这样就可以在 APP 内的页面实现跳转，接下来我们看看如何在 App 外也能使用这个 Scheme，拉起 App。

### 外部跳转

该功能的实现，需要使用 [uni\_links](https://pub.dev/packages/uni_links) 第三方库来协助完成外部页面的 Scheme，在 pubspec.yaml 中增加依赖，然后更新本地库文件。由于 Android 和 iOS 在配置上会有点区别，因此这里分别来介绍。

#### Android 流程

在项目中找到这个路径下的文件

    android/app/src/main/AndroidManifest.xml
    

在配置的 application 下的 activity 内增加如下配置：

    <intent-filter>
        <action android:name="android.intent.action.VIEW"/>
        <category android:name="android.intent.category.DEFAULT"/>
        <category android:name="android.intent.category.BROWSABLE"/>
        <data
            android:scheme="tyfapp"/>
    </intent-filter>
    

第 6 行代码就是声明这个 App 的 Scheme 的协议。

#### iOS 流程

在项目中找到这个路径下的文件

    ios/Runner/info.plist
    

在 dict 内增加下面的配置：

    <key>CFBundleURLTypes</key>
    <array>
      <dict>
        <key>CFBundleTypeRole</key>
        <string>Editor</string>
        <key>CFBundleURLName</key>
        <string>Two You</string>
        <key>CFBundleURLSchemes</key>
        <array>
          <string>tyfapp</string>
        </array>
      </dict>
    </array>
    

其中的第 9 行声明 App 的 Scheme。  
以上就完成了基础的配置，接下来我们就使用 uni\_links 来实现 Scheme 的监听。

#### Uni\_links 实现外部跳转

首先我们在 pages 目录下新建一个主入口文件 entrance.dart ，该文件需要设计为一个有状态类组件。在组件中最关键的是监听获取到打开 App 的链接地址，实现的方式如下代码。

    /// 使用[String]链接实现
    Future<void> initPlatformStateForStringUniLinks() async {
      String initialLink;
      // Platform messages may fail, so we use a try/catch PlatformException.
      try {
        initialLink = await getInitialLink();
        if (initialLink != null) {
          //  跳转到指定页面
          router.push(context, initialLink);
        }
      } on PlatformException {
        initialLink = 'Failed to get initial link.';
      } on FormatException {
        initialLink = 'Failed to parse the initial link as Uri.';
      }
      // Attach a listener to the links stream
      _sub = getLinksStream().listen((String link) {
        if (!mounted || link == null) return;
        //  跳转到指定页面
        router.push(context, link);
      }, onError: (Object err) {
        if (!mounted) return;
      });
    

其中第 6 行是处理在外部直接拉起 App 的业务逻辑，第 17 行则表示当前 App 处于打开状态，监听外部拉起事件，监听变化后处理相应的跳转逻辑。由于组件中有一个监听事件，为了避免组件被销毁后还在监听，因此需要在组件销毁阶段移除监听事件，代码如下：

    @override
    void dispose() {
      super.dispose();
      if (_sub != null) _sub.cancel();
    }
    

为了验证效果，使用了一个 [github 上创建的测试页面](https://love-flutter.github.io/test-page/index.html)。接下来我们运行下程序，然后在手机模拟器中打开测试页面，可以看到如图 1 所示的效果。

![1.gif](https://s0.lgstatic.com/i/image/M00/2F/E1/Ciqc1F8IDbaAIpJ7AESu3z7EomU793.gif)

图 1 Scheme 实现运行效果

以上就实现了 Scheme 可以直接在内外部使用的跳转逻辑。不过 Scheme 在 App 外部存在一些体验方面的问题，比如：

*   当需要被拉起的 App 没有被安装时，这个链接就不会生效；
    
*   在大部分 App 内 Scheme 是被禁用的，因此在用户体验的时候会非常差；
    
*   注册的 Scheme 相同导致冲突；
    

为了解决上述问题，Andorid 和 iOS 都提供了一套解决方案，在 Android 叫作 App link / Deep links ，在 iOS 叫作 Universal Links / Custom URL schemes。解决的方案就是在未安装 App 时可提供网页跳转，其次可以使用 https 和 http 域名链接的方式来进一步提升唯一性。

**App link / Deep links**

应用链接仅适用于 https 方案，并且需要指定的主机以及托管文件 assetlinks.json，该配置文件可参考如下：

    [{
          "relation": ["delegate_permission/common.handle_all_urls"],
          "target": {
            "namespace": "android_app",
            "package_name": "com.example",
            "sha256_cert_fingerprints":
            ["14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5"]
          }
        }]
    

*   package\_name，在应用的 build.gradle 文件中声明的应用 ID；
    
*   sha256\_cert\_fingerprints：应用签名证书的 SHA256 指纹，你可以利用 Java 密钥工具。
    

配置好该文件后，同样是修改下面路径下的文件。

    android/app/src/main/AndroidManifest.xml
    

在配置的 application 下的 activity 内增加如下配置：

    <!-- App Links -->
          <intent-filter android:autoVerify="true">
            <action android:name="android.intent.action.VIEW" />
            <category android:name="android.intent.category.DEFAULT" />
            <category android:name="android.intent.category.BROWSABLE" />
            <!-- Accepts URIs that begin with https://YOUR_HOST -->
            <data
              android:scheme="https"
              android:host="[YOUR_HOST]" />
          </intent-filter>
    

具体的过程，你可以在线上项目开发过程中尝试应用。

**Universal Links / Custom URL schemes**

该方法也是需要一个主机域名来启动应用，因此需要服务的一个在线配置，例如：[https://www.example.test](https://www.example.test)/apple-app-site-association 获取 apple-app-site-association 的配置文件如下。

    {
        "applinks": {
            "apps": [],
            "details": [
                {
                    "appID": "8LX3M43WHV.me.gexiao.me",
                    "paths": [ "/*" ]
                }
            ]
        }
    }
    

同样我们需要修改下面路径的文件。

    ios/Runner/info.plist
    

在 dict 内增加下面的配置：

     <key>com.apple.developer.associated-domains</key>
     <array>
       <string>applinks:[YOUR_HOST]</string>
     </array>
    

以上就是外部跳转的实现方案，实现外部跳转的 App Links 和 Universal Link 功能，由于需要域名部署，我这里就没有实际应用，具体你可以在项目开发中尝试。

### 总结

本课时介绍了在 Flutter 中路由跳转以及外部 Scheme 启动 App 的方法，最后简单介绍了 App Links 和 Universal Link 的知识点。学完本课时你需要掌握开发 Flutter 路由跳转基础技巧，并且能够应用 uni\_links 库实现外部 Scheme 启动 App 功能。

下一课时我将介绍 Flutter 中各种导航栏的设计，我会在本课时的基础上增加导航栏功能，其次我也会实现首页和个人页面的代码逻辑。

[点击链接，查看本课时源码。](https://github.com/love-flutter/flutter-column)