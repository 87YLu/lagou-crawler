上一课时之前，我们的接口都是在代码中模拟假数据，并没有从服务端获取数据，但是在实际开发中，必须与服务端进行交互。本课时主要介绍在 Flutter 中常见的网络传输协议序列化方式，并对其中比较常用的协议进行简单实践，最后再通过 JSON 协议来完善本课时的 api 部分的代码。

### 常见的 APP 网络传输协议序列化方式

常见的传输协议有三种：XML 、JSON 和 Protocol Buffer。我们先来对比下这三种协议，我会分别从 Flutter 中的实现、序列化后的数据长度、Flutter 中反序列化性能三个方面来讲解。我先将本课时中的一段基础的数据格式用来做效果演示，测试数据如下：

    nickName = 'test-pb'; 
    uid = '3001'; 
    headerUrl = 'http://image.biaobaiju.com/uploads/20180211/00/1518279967-IAnVyPiRLK.jpg';
    

上面的是用户信息接口，接下来我们使用这三种方式来实现这个接口。

#### XML

XML 指可扩展标记语言（eXtensible Markup Language）是一种通用的重量级数据交换格式，以文本结构存储。

在 Flutter 中有一个解析 XML 的第三方库 [xml2json](https://pub.dev/packages/xml2json)，将服务端的 XML 解析为 JSON 格式，因为是第三方库，因此需要在 pubspec.yaml 中增加该库的依赖，然后更新本地库。接下来我们实现具体的代码，在 lib 目录下新建 api\_xml ，然后在目录下创建 api\_xml/user\_info/index.dart 。创建完成后，我们来实现 user\_info/index.dart 的逻辑。

首先需要增加第三方库的引用。

    import 'dart:convert'; 
    import 'package:two_you_friend/util/struct/user_info.dart'; 
    import 'package:xml2json/xml2json.dart';
    

接下来实现 ApiXmlUserInfoIndex 类中的 getSelfUserInfo 方法，后续 getSelfUserInfo 会是一个异步网络请求方法，因此将返回类型修改为 Future`<StructUserInfo>`，具体实现逻辑如下：

    /// 获取自己的个人信息 
    static Future<StructUserInfo> getSelfUserInfo() async{ 
      // 模拟xml假数据 
      final userInfoXml = '''<?xml version="1.0"?> 
      <userInfo> 
        <nickName>test</nickName> 
        <uid>3001</uid> 
        <headerUrl>http://image.biaobaiju.com/uploads/20180211/00/1518279967-IAnVyPiRLK.jpg</headerUrl> 
      </userInfo>'''; 
    
      // 记录当前时间 
      int currentTime = new DateTime.now().microsecondsSinceEpoch; 
      Xml2Json xml2json = Xml2Json(); 
      xml2json.parse(userInfoXml); 
      // 转化xml数据 
      final userInfoStr = xml2json.toGData(); 
      print('xml length'); 
      print(userInfoStr.length); 
    
      int jsonStartTime = new DateTime.now().microsecondsSinceEpoch; 
      final userInfo = json.decode(userInfoStr); 
      // 打印解析json时间 
      print('json decode time'); 
      print(new DateTime.now().microsecondsSinceEpoch - jsonStartTime); 
    
      // 打印整体解析时间 
      print('xml decode time'); 
      print(new DateTime.now().microsecondsSinceEpoch - currentTime); 
      return StructUserInfo( 
          userInfo['userInfo']['uid']['\$t'] as String, 
          userInfo['userInfo']['nickName']['\$t'] as String, 
          userInfo['userInfo']['headerUrl']['\$t'] as String 
      ); 
    }
    

上述代码首先在第 4 行模拟一个 XML 数据，在第 12 行记录开始解析时间，第 28 行打印整体 XML 解析时间，在第 24 行打印 JSON 的解析时间。XML 的解析过程是先将 XML 转化为一个 JSON 字符串，然后再通过 convert 转化为 JSON。在 main.dart 中引入该文件，并调用 getSelfUserInfo 方法，可以看到如下的打印信息。

    flutter: xml length 
    flutter: 180 
    flutter: json decode time 
    flutter: 200 
    flutter: xml decode time 
    flutter: 2000
    

从解析过程来看，XML 的解析性能肯定是比较差的，因为最终还是需要将 XML 转化为 JSON 来处理，接下来我们看下 JSON 的解析实现方式。

#### JSON

JSON（JavaScript Object Notation）是一种轻量级的数据交换格式。 易于人阅读和编写，同时也易于机器解析和生成。 它是基于 JavaScript Programming Language, Standard ECMA-262 3rd Edition - December 1999 的一个子集。

在 Flutter 中，JSON 解析有专门的 dart 原生库支持——dart:convert。同样我们去实现 XML 例子中的 user\_info/index.dart，我们以 api/user\_info/index.dart 为例子来实现，在原来代码基础上，我们增加打印解析时间和 JSON 长度，具体代码如下：

    /// 获取自己的个人信息 
      static Future<StructUserInfo> getSelfUserInfo() async{ 
        String jsonStr = '{"nickName":"test","uid":"3001","headerUrl":"http://image.biaobaiju.com/uploads/20180211/00/1518279967-IAnVyPiRLK.jpg"}'; 
        print('json length'); 
        print(jsonStr.length); 
        int currentTime = new DateTime.now().microsecondsSinceEpoch; 
        final jsonInfo = json.decode(jsonStr) as Map<String, dynamic>; 
        print('json parse time'); 
        print(new DateTime.now().microsecondsSinceEpoch - currentTime); 
        return StructUserInfo.fromJson(jsonInfo); 
      }
    

上面代码较 XML 简单一些，第 3 行创建假数据，然后在第 7 行进行解析。在代码第 5 行，打印 JSON 长度，第 9 行打印具体的解析时间，在 main.dart 执行该函数，可以看到如下打印数据。

    flutter: json length 
    flutter: 119 
    flutter: json parse time 
    flutter: 420
    

与 XML 对比，从解析时间和传递数据长度来看，都是较优的，接下来我们看下 Protocol Buffer 的实现、相关解析时长和具体的数据长度。

#### Protocol Buffer

Protocol Buffer 是一种轻便高效的结构化数据存储格式，可以用于结构化数据串行化，或者说序列化。它很适合做数据存储或 RPC 数据交换格式，可用于通信协议、数据存储等领域的语言无关、平台无关、可扩展的序列化结构数据格式。

在 Flutter 中应用 Protocol Buffer 需要下面几个过程。

1.**安装 Protocol Buffer 工具**，在 Mac 应用如下命令。

    brew install protobuf
    

如果是在 Windows 或者 Linux 上，则前往（ [https://github.com/protocolbuffers/protobuf/releases?after=v3.5.0](https://github.com/protocolbuffers/protobuf/releases?after=v3.5.0)）解压安装即可。

2.**安装 protoc\_plugin 插件**，在 Mac 或者 Linux 应用如下命令安装。

    pub global activate protoc_plugin
    

如果在 Windows 上没有这个支持，你在 Windows 上只能通过虚拟机的方式。

3.**在 lib 同级目录下创建 protos** 用来存放所需要的 Protocol Buffer 文件，这里我们创建了一个 user\_info.proto ，然后添加下面的代码：

    syntax = "proto3"; 
    option java_package = "pro.two_you_friend"; 
    message UserInfoRsp { 
        string nickName = 1; 
        string headerUrl = 2; 
        string uid = 3; 
    }
    

上面的代码就是创建一个 Protocol Buffer 协议，该协议数据结构就是一个 UserInfo 的结构，具体关于 Protocol Buffer 的协议，可以[参考官网](https://developers.google.com/protocol-buffers/docs/proto3)。

4.创建完成 Protocol Buffer 协议后，我们再**将 Protocol Buffer 文件转化为 Dart 文件**，在项目根目录，也就是 lib 同级目录，运行下面命令。

    protoc --dart_out=./lib ./protos/* --plugin=protoc-gen-dart=$HOME/.pub-cache/bin/protoc-gen-dart
    

其中 dart\_out 就是转化后的 dart 文件存放路径，会默认带上原有 protos 目录。--plugin 就是需要使用到的插件，这里的路径就是第二步安装的插件位置。

5.运行成功后，**会在 lib 目录下创建 protos 目录**，并生成如图 1 的目录结构；

![image (14).png](https://s0.lgstatic.com/i/image/M00/3A/39/Ciqc1F8hN7qARIvYAACMRuwnLuo133.png)

图 1 生成的 Protocol Buffer 目录结构

生成完成以后，这时候是会提示报错的，因为在 user\_info.pb.dart 中引用了 package:protobuf/protobuf.dart 这个库。接下来我们就需要去修改 pubspec.yaml ，添加 Protocol Buffer（ protobuf: ^1.0.1 ）第三方库的依赖，添加完成后更新本地库。

以上就完成了整个 Protocol Buffer 的创建到转化，接下来我们看下如何在 Flutter 应用，同样和 XML 以及 JSON 一样，我们继续在 lib 目录下新建一个 api\_pb 文件夹，用来存放 Protocol Buffer 相关的 API 协议，这里为了演示，只创建 api\_pb/user\_info/index.dart 。接下来我们看下具体的代码逻辑。

先引入相应的库文件，其中第 2 行就是相应的 Protocol Buffer 文件。

    import 'package:two_you_friend/util/struct/user_info.dart'; 
    import 'package:two_you_friend/protos/user_info.pb.dart';
    

接下来我们看下 ApiPbUserInfoIndex 类中创建 Protocol Buffer 的代码部分，这部分逻辑放在 createUserInfo 函数中，具体代码如下：

    /// 生成二进制内容，测试文件 
    static List<int> createUserInfo() { 
      UserInfoRsp userInfoRsp = UserInfoRsp(); 
      userInfoRsp.nickName = 'test'; 
      userInfoRsp.uid = '3001'; 
      userInfoRsp.headerUrl = 'http://image.biaobaiju.com/uploads/20180211/00/1518279967-IAnVyPiRLK.jpg'; 
      List<int> retInfo = userInfoRsp.writeToBuffer(); 
      return retInfo; 
    }
    

代码的第 2 行就是创建 Protocol Buffer 中的 Message 类，也就是我们的 UserInfo 数据结构，然后根据其数据结构，设置具体的字段值，最后调用 writeToBuffer 转化为二进制数据。

应用上面生成的二进制数据，我们再来实现 getSelfUserInfo 方法，具体代码如下：

    /// 获取自己的个人信息 
    static Future<StructUserInfo> getSelfUserInfo() async{ 
      // 该数据涞源createUserInfo函数 
      int currentTime = new DateTime.now().microsecondsSinceEpoch; 
      UserInfoRsp userInfoRsp = UserInfoRsp.fromBuffer( 
          [ 
            10, 4, 116, 101, 115, 116, 18, 72, 104, 116, 
            116, 112, 58, 47, 47, 105, 109, 97, 103, 101, 
            46, 98, 105, 97, 111, 98, 97, 105, 106, 117, 
            46, 99, 111, 109, 47, 117, 112, 108, 111, 97, 
            100, 115, 47, 50, 48, 49, 56, 48, 50, 49, 49, 
            47, 48, 48, 47, 49, 53, 49, 56, 50, 55, 57, 
            57, 54, 55, 45, 73, 65, 110, 86, 121, 80, 
            105, 82, 76, 75, 46, 106, 112, 103, 26, 
            4, 51, 48, 48, 49 
          ] 
      ); 
      print('pb length'); 
      print(userInfoRsp.toString().length); 
      int dfTime = new DateTime.now().microsecondsSinceEpoch - currentTime; 
      print('pb decode time'); 
      print(dfTime); 
      return StructUserInfo( 
        userInfoRsp.uid, 
        userInfoRsp.nickName, 
        userInfoRsp.headerUrl 
      ); 
    }
    

代码第 5 行是应用 createUserInfo 生成的二进制数据，利用该二进制数据调用 fromBuffer 转化为 Protocol Buffer 对象，返回的对象可以直接获取到 StructUserInfo 的相应字段： uid、nickName 和 headerUrl，具体代码在第 25 到第 28行。第 18 行打印字符串长度，第 23 行打印反序列化时间。运行上面的代码，可以看到如下打印数据：

    flutter: pb length 
    flutter: 109 
    flutter: pb decode time 
    flutter: 383
    

长度和解析时长相对 JSON 协议又减少了一些，因此在带宽和解析性能方面都是优于 JSON 和 XML。由于本课时中还没有实现服务端代码，我们只能借助第三方 Mock 平台来实现网络调用，因此这里会以 JSON 协议为参考来实践本课时的 api 层代码逻辑。在实际应用中，我更倾向大家使用 Protocol Buffer 。

以上就是三种协议在 Flutter 中的应用尝试和对比，基于数据长度和解析性能对比（由于跑的数据总量不够大，因此单次运行会存在样本误差），XML 是最差的，JSON 相对较好，Protocol Buffer 是最优的，不过可读性最差，具体对比看下表格 1。

![image (15).png](https://s0.lgstatic.com/i/image/M00/3A/45/CgqCHl8hN_CAHkTmAABBGfUbGT4406.png)

表格 1 整体数据对比情况

### 代码实践

介绍完常见的网络传输协议序列化方式，接下来就使用 JSON 的传输协议来完善我们 api 逻辑。这里会应用到一个第三方的 Mock 平台。主要是 Mock 以下几个接口协议，如图 2 所示的结构列表。

![image (16).png](https://s0.lgstatic.com/i/image/M00/3A/3A/Ciqc1F8hOAmAc5eCAAH87tkUVJM571.png)

图 2 Mock 协议列表

有了具体协议 Mock 协议后，我们再来实现 Flutter 中的代码。首先我们需要创建一个通用的网络请求的类，这个类我们存放在 util/tools 目录下，命名为 call\_server.dart 。Flutter 中的网络协议需要使用到 [dio](https://pub.dev/packages/dio) 这个第三方库，同样还是需要在 pubspec.yaml 增加依赖，然后更新本地库文件。接下来我们看下 call\_server.dart 的代码实现。

#### 通用网络请求类实现

该通用网络请求类，文件存放在源码中的 lib/util/tools/call\_server.dart ，接下来我们看下它的实现逻辑。

首先还是引入相应的库文件

    import 'dart:convert'; 
    import 'package:dio/dio.dart'; 
    import 'package:two_you_friend/util/tools/json_config.dart';
    

第 1 个库是数据转化类的原生库，第 2 个库是网络请求库，第 3 个库是我们自己实现的一个工具库，该库的作用是读取一个 JSON 配置文件。

接下来我们实现 CallServer 类，在类中新增一个 get 方法，这里需要注意因为 dio 网络请求是一个异步方法，因此这里需要将 get 设计为一个 async 的方法，并返回的是一个 Future 类型，具体代码如下：

    /// 统一调用API接口 
    class CallServer { 
      /// get 方法 
      static Future<Map<String, dynamic>> get 
      } 
    }
    

因为网络请求异步返回的是一个 JSON 协议，因此需要设置返回的数据结构为 Map<String, dynamic> 。接下来我们看下具体的函数代码逻辑。

    // 根据类型，获取api具体信息 
    Map<String, dynamic> apis = await JsonConfig.getConfig('api'); 
    if(apis == null) { 
      return {"ret" : false}; 
    } 
    String callApi = apis[apiName]['apiUrl'] as String; 
    // 处理异常情况 
    if(callApi == null) { 
      return {"ret" : false}; 
    } 
    // 处理参数替换 
    if(params != null) { 
      params.forEach((k, v) => callApi = callApi.replaceAll('{$k}', '$v')); 
    } 
    // 调用服务端接口获取返回数据 
    try { 
      Response response = await Dio().get( 
          callApi, 
          options: Options(responseType: ResponseType.json) 
      ); 
      Map<String, dynamic> retInfo = 
        json.decode(response.toString()) as Map<String, dynamic>; 
      return retInfo; 
    } catch (e) { 
      return {"ret" : false}; 
    }
    

第 2 行读取配置文件中的 api.json 数据（配置文件需要在 pubspec.yaml 中引入，具体查看源码中的第 55 和第 56 行），该 api.json 的部分数据如下：

    { 
      "recommendList" : { 
        "method" : "get", 
        "apiUrl" : "https://www.fastmock.site/mock/978685eaf6950d1e2f0790f85cfdacaa/cgi-bin/recommend_list", 
        "params" : null 
      } 
    }
    

其中 JSON 部分就包括了协议名称，以及协议的请求方式和协议的 URL 以及具体的参数。  
在 get 方法中，获取到 api.json 数据后，再根据协议名称，获取到协议的 URL 。接下来经过一定的数据判断和参数处理，应用 dio 模块发起 get 网络请求。最后再使用 convert 库，将结构转化为 JSON 数据结构，并返回给到调用方。

#### ApiContentIndex 实现

通用网络请求实现后，我们再看下具体的接口调用方的实现逻辑。接下来我们修改 ApiContentIndex 中的 getRecommendList 的代码，将原来的假数据转化为网络请求。因为是异步方法，因此还是需要使用 Future 和 async ，函数代码如下：

    import 'package:two_you_friend/util/struct/api_ret_info.dart'; 
    import 'package:two_you_friend/util/struct/content_detail.dart'; 
    import 'package:two_you_friend/util/tools/call_server.dart'; 
    /// 获取内容详情接口 
    class ApiContentIndex { 
      /// 拉取用户内容推荐帖子列表 
      Future<StructApiContentListRetInfo> getRecommendList([lastId = null]) async { 
    
      } 
    }
    

代码第一部分还是引入相应的库，第二部分创建 ApiContentIndex 类，并创建 getRecommendList 函数，该函数异步返回 StructApiContentListRetInfo 数据结构，支持可选参数 lastId ，有 lastId 则拉取下一页，没有则拉取首页内容。接下来看下 getRecommendList 函数的具体逻辑，代码如下。

    /// 拉取用户内容推荐帖子列表 
    Future<StructApiContentListRetInfo> getRecommendList([lastId = null]) async { 
      if (lastId != null) { 
        Map<String, dynamic> retJson = 
          await CallServer.get('recommendListNext', {lastId: lastId}); 
        return StructApiContentListRetInfo.fromJson(retJson); 
      } else { 
        Map<String, dynamic> retJson = 
        await CallServer.get('recommendList'); 
        return StructApiContentListRetInfo.fromJson(retJson); 
      } 
    }
    

以上代码就比较简洁了，先根据 lastId 判断拉取首页还是拉取下一页，如果拉取首页，则调用 recommendList 协议，如果拉取下一页，则调用 recommendListNext 协议。使用 CallServer.get 方法与服务端交互，得到返回数据结构后，调用 StructApiContentListRetInfo.fromJson 转化为 StructApiContentListRetInfo 数据结构，这样就实现了具体的 API 协议，最后我们再来看下在页面中调用 api 的使用方法。

#### HomePageIndex

因为 ApiContentIndex 协议是在 HomePageIndex 这个类中调用，我们就来看下这块的处理逻辑，相同部分我们就不过多介绍。

    /// 处理首次拉取和刷新数据获取动作 
    void setFirstPage() { 
      ApiContentIndex().getRecommendList().then((retInfo){ 
        if (retInfo.ret != 0) { 
          // 判断返回是否正确 
          error = true; 
          return; 
        } 
        setState(() { 
          error = false; 
          contentList = retInfo.data; 
          hasMore = retInfo.hasMore; 
          isLoading = false; 
          lastId = retInfo.lastId; 
        }); 
      }); 
    }
    

在 setFirstPage 中调用类 ApiContentIndex 中的异步方法 getRecommendList ，在 getRecommendList 回调中成功获取数据后使用 setState 更新页面状态。由于网络请求有时间延迟，因此在页面刚加载时，需要使用 loading 组件，需要更改原来的 build 方法，修改部分如下：

    if (error) { 
      return CommonError(action: this.setFirstPage); 
    } 
    if(contentList == null){ 
      return Loading(); 
    }
    

主要是第 4 行，增加了对数据的判断，如果为空则显示 loading 组件内容，具体效果如下图 3 所示。

![20200717_233752.gif](https://s0.lgstatic.com/i/image/M00/3A/45/CgqCHl8hOHuANKsHACSrYreWeyI011.gif)

图 3 网络请求 loading 效果

以上就完成了 ApiContentIndex 部分的 getRecommendList 逻辑，其他代码逻辑基本相似，具体大家可以参考 github 上的源码。

### 总结

本课时介绍了 APP 常用的三种网络传输协议序列化方式，其次介绍了 Flutter 与服务端的网络通信方法，并且通过传输协议与服务端进行交互获取数据。学完本课时后要着重掌握 JSON 和 Protocol Buffer 的使用方法，其次掌握网络请求库 CallServer 的实现原理。

下一课时我们将整理我们在 Two You APP 研发过程中所涉及的布局逻辑，介绍在 Flutter 中常见的一些布局原理和思想，并用此理论来完善我们 APP 内的“客人态页面” 的功能。

[点击此链接查看本课时源码](https://github.com/love-flutter/flutter-column)