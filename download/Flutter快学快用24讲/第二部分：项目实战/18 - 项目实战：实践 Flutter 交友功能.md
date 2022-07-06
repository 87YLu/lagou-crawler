本课时我会和大家一起来完善 App 的其他功能，其中包括：我的好友、我的消息、系统设置和搜索功能。按照我们之前课时所学的技术点，我们可以通过绘制组件树+布局来实现，在实现过程中也会介绍一些新的知识点，接下来我们就分别看下这几个功能的实现过程。

### 我的好友

我们首先看下要实现的效果图，如图 1 所示。

![Drawing 0.png](https://s0.lgstatic.com/i/image/M00/3E/A7/Ciqc1F8tC1OAa6iOAABaIAPOiu0051.png)

图 1 我的好友效果图

根据图 1 的效果图，我们绘制出组件树+布局，如图 2 所示。

![Drawing 2.png](https://s0.lgstatic.com/i/image/M00/3E/A7/Ciqc1F8tC3SAJma7AACIdJvSfFY733.png)

图 2 组件树

图 2 很清晰地分析出了界面所转化的组件树，由于这里都不涉及动态组件，因此将 Text 和 Image 作为一个 card 组件即可。代码实现逻辑和我们之前介绍的推荐页面和关注页面基本一样，接下来我们看下“我的消息”的实现。

### 我的消息

我们先来看下“我的消息”要实现的界面效果，如图 3 所示。

![Drawing 4.png](https://s0.lgstatic.com/i/image/M00/3E/B2/CgqCHl8tC4CAKYbEAACBTQQFajM318.png)

图 3 我的消息界面效果

根据图 3 的效果图，我们绘制出组件树+布局，如图 4 所示。

![Drawing 6.png](https://s0.lgstatic.com/i/image/M00/3E/B2/CgqCHl8tC4iAA2RQAAGgiSh8hy0630.png)

图 4 我的消息组件树+布局

图 4 就非常清晰地描述了我们整个 UI 构造：

*   图 4 中的 Row-Expanded-1 和 Row-Expanded-5 代表的是使用 flex 布局，左右屏幕占比 1 比 5；
    
*   图 4 中的 first\_line 代表的是图 3 右侧的用户昵称和时间一行；
    
*   图 4 中的 spaceBetween 是 Row 的 mainAxisAlignment 属性，代表的是两端对齐，具体这部分代码如下。
    

    /// 获取右侧的首行 
    Widget _getFirstLine() { 
      return  Row( 
        mainAxisAlignment: MainAxisAlignment.spaceBetween, 
        children: <Widget>[ 
          Text( 
            userMessage.userInfo.nickName, 
            style: TextStyles.commonStyle(0.8, Colors.black), 
          ), 
          _getMessageTimeSection(userMessage.messageTime), 
        ], 
      ); 
    } 
    

由于这里也没有涉及组件的复用和动态组件，因此这里也建议将整个组件内容设计为一个组件叫作 message\_card。为了代码维护性，可以使用类函数来封装小组件，为后续重构抽象为通用组件做准备，例如这里我们将 first\_line 设计为一个类函数，如上代码中的 \_getFirstLine 函数。

### 系统设置

接下来我们来看下“系统设置”这部分界面效果，如图 5 所示。

![Drawing 8.png](https://s0.lgstatic.com/i/image/M00/3E/A7/Ciqc1F8tC5mAb80WAABCUd3CwUc272.png)

图 5 系统设置的效果

看到图 5 的效果后，其实组件设计可能不是关键。这里涉及两个新的知识点：

*   在 Flutter 上怎么处理表单数据；
    
*   怎么保存系统设置的数据。
    

这里具体的组件树+布局就不绘制了，我们可以将实现过程分为四部分：第三方库引入、通用文件存储、model 应用和组件应用。

#### 第三方库

这里我们需要使用到 Flutter 本地存储功能，Flutter 本地存储功能包含三种：[shared\_preferences](https://pub.dev/packages/shared_preferences)、[path\_provider](https://pub.dev/packages/path_provider) 文件存储以及 [sqflite](https://pub.dev/packages/sqflite)。这里只介绍 path\_provider 文件存储的实现，其他两个大家参照官网的介绍尝试即可。使用该 path\_provider 库需要在 pubspec.yaml 中增加库引入，然后更新本地库。

#### 通用文件存储

接下来我们基于 path\_provider 实现一个通用的文件内容存储，[代码在 github 源码中](https://github.com/love-flutter/flutter-column)的 util/tools/local\_storage.dart 中。这里我们主要需要实现两个方法，一个是文件储存内容，一个文件读取内容。

*   文件存储
    

我们先来看下文件存储的逻辑，如下代码：

    /// 将数据保存到文件中 
    static Future<void> save(String content, String filePath) async { 
      final directory = await getApplicationDocumentsDirectory(); 
      File file = new File('${directory.path}/$filePath'); 
      file.writeAsString(content); 
    } 
    

因为是异步获取文件存储路径，因此 save 方法也需要作为异步逻辑，由于无须等待处理结果，因此返回 void。上面代码中使用了 path\_provider 的 getApplicationDocumentsDirectory 的方法获取文件存储目录，使用 dart:io 获取具体文件的操作句柄，最后将内容写入文件，接下来我们看下读取的过程。

*   文件读取
    

读取的过程和写的代码相似，首先是找到文件并获取文件操作句柄，然后再使用文件句柄读取文件具体内容，代码如下：

    /// 获取文件数据内容 
    static Future<String> get(String filePath) async { 
      try { 
        final directory = await getApplicationDocumentsDirectory(); 
        File file = new File('${directory.path}/$filePath'); 
        bool exist = await file.exists(); 
        if(!exist){ // 判断是否存在文件 
          return ''; 
        } 
        return file.readAsString(); 
      } catch(e) { 
        return ''; 
      } 
    } 
    

上面代码增加了一个异常处理，避免读取失败返回错误数据，因此如果这里判断异常，则返回空字符串。在 catch 逻辑中是需要增加上报来监控告警的，后续我们再来介绍这部分内容。

#### model 应用

因为系统配置是一个全局状态，需要在多个页面使用，所以我们需要将系统数据保存在 model 中，因此我们在 model 创建

system\_config\_model.dart 文件。在实现逻辑中，需要先调用 LocalStorage 来获取初始配置，代码如下：

    /// 构造函数 
    SystemConfigModel.init(){ 
      LocalStorage.get('tyfapp.system.config').then((configStr){ 
        Map<String, dynamic> configInfo = {}; 
        if(configStr == null || configStr == '') { // 判断合法性 
          configInfo = { 
            "accessMessage" : true, 
            "tipsDetail" : true, 
            "soundReminder" : true, 
            "vibrationReminder" : true 
          }; 
        } else { 
          try { // 尝试 json 解析，解析失败直接返回 
            configInfo = 
            json.decode(configStr) as Map<String, dynamic>; 
          } catch(e){ 
            return; 
          } 
        } 
        systemConfig = StructSystemConfig.fromJson(configInfo); 
      }); 
    } 
    

上面代码 init 为构造函数，其中第 3 行是异步读取文件，获取到文件后存储在共享状态变量 systemConfig 中。为了异常考虑，如果没有获取到文件内容，则将共享状态变量默认设置打开状态，也就是 true 值。有了初始化部分，再修改 main.dart 增加一个新的状态共享，部分如下代码：

    // 初始化共享状态对象 
    LikeNumModel likeNumModel = LikeNumModel(); 
    NewMessageModel newMessageNum = NewMessageModel(newMessageNum: 0); 
    // 异步数据处理 
    ApiUserInfoMessage.getUnReadMessageNum(newMessageNum); 
    // 异步获取系统配置 
    SystemConfigModel systemConfigModel = SystemConfigModel.init(); 
    return MultiProvider( 
      providers: [ 
        ChangeNotifierProvider(create: (context) => likeNumModel), 
        ChangeNotifierProvider( 
            create: (context) => UserInfoModel(myUserInfo: myUserInfo)), 
        ChangeNotifierProvider(create: (context) => newMessageNum), 
        ChangeNotifierProvider(create: (context) => systemConfigModel), 
      ], 
      child: child, 
    ); 
    

上面代码的第 7 行就是增加了系统变量的初始化，第 15 行就是增加到状态共享中。接下来我们完善下 system\_config\_model.dart 代码，为其增加 get 和 save 方法，代码如下：

    /// 转化为StructSystemConfig结构 
    StructSystemConfig get() { 
      return systemConfig; 
    } 
    /// 转化为StructSystemConfig结构 
    bool getSwitchItem(String switchItem) { 
      if(systemConfig == null) { 
        return false; 
      } 
      Map<String,dynamic> systemConfigJson = 
      StructSystemConfig.toJson(systemConfig); 
      try{ 
        return systemConfigJson[switchItem] as bool; 
      }catch(e){ 
        return false; 
      } 
    } 
    

代码的第 2 到第 18 行中的两个方法 get 和 getSwitchItem ，其作用都是获取系统配置，前者是获取所有配置，后者是获取具体的某个配置。我们继续看下配置保存的两个方法，代码如下。

    /// 保存单个数据 
    void saveOne(String key, bool value) { 
      Map<String,dynamic> systemConfigJson = 
        StructSystemConfig.toJson(systemConfig); 
      if(systemConfigJson[key] == value) { 
        return; 
      } 
      systemConfigJson[key] = value; 
      systemConfig = StructSystemConfig.fromJson(systemConfigJson); 
      print(systemConfigJson); 
      LocalStorage.save(json.encode(systemConfigJson), 'tyfapp.system.config'); 
      notifyListeners(); 
    } 
    
    /// 整体数据保存 
    void save(StructSystemConfig newSystemConfig) { 
      if( 
      systemConfig.accessMessage == newSystemConfig.accessMessage && 
          systemConfig.tipsDetail == newSystemConfig.tipsDetail && 
          systemConfig.soundReminder == newSystemConfig.soundReminder && 
          systemConfig.vibrationReminder == newSystemConfig.vibrationReminder 
      ) { 
        return; 
      } 
      systemConfig = newSystemConfig; 
      LocalStorage.save( 
          json.encode(StructSystemConfig.toJson(systemConfig)), 
          'tyfapp.system.config' 
      ); 
      notifyListeners( 
    

代码 save 和 saveOne，分别对应保存整个系统配置数据和保存单个系统配置数据。在两者实现逻辑中，首先都做了前期数据校验判断，避免不必要的 build 操作。在 save 代码逻辑中，需要将数据存储到本地，通过调用 LocaStorage.save 来实现。

#### 组件应用

组件应用部分较为简单，我们先看下 pages/system\_page/index.dart 的逻辑，如下：

    import 'package:flutter/material.dart'; 
    import 'package:provider/provider.dart'; 
    import 'package:two_you_friend/model/system_config_model.dart'; 
    import 'package:two_you_friend/widgets/system_page/switch_card.dart'; 
    import 'package:two_you_friend/util/struct/system_config.dart'; 
    /// 首页 
    class SystemConfigPageIndex extends StatelessWidget { 
      /// 构造函数 
      const SystemConfigPageIndex(); 
      @override 
      Widget build(BuildContext context) { 
        final systemConfigModel = Provider.of<SystemConfigModel>(context); 
        StructSystemConfig systemConfig = systemConfigModel.get(); 
        return Container( 
          padding: EdgeInsets.all(8), 
          child: Column( 
            children: <Widget>[ 
              SystemPageSwitchCard(itemDesc: '新消息提醒', switchItem: 'accessMessage'), 
              SystemPageSwitchCard(itemDesc: '通知显示详情', switchItem: 'tipsDetail'), 
              SystemPageSwitchCard(itemDesc: '声音', switchItem: 'soundReminder'), 
              SystemPageSwitchCard(itemDesc: '振动', switchItem: 'vibrationReminder') 
             ], 
          ), 
        ); 
      } 
    } 
    

主要逻辑在 build 中，build 中使用了 widgets/system\_page/switch\_card.dart ，我们看下这个子组件的实现，代码如下：

    import 'package:flutter/material.dart'; 
    import 'package:provider/provider.dart'; 
    import 'package:two_you_friend/model/system_config_model.dart'; 
    import 'package:two_you_friend/styles/text_syles.dart'; 
    /// 单个系统配置 
    /// 
    /// [title]为帖子详情内容 
    class SystemPageSwitchCard extends StatelessWidget { 
      /// 传入的帖子标题 
      final String switchItem; 
      /// 消息提醒文字 
      final String itemDesc; 
      /// 构造函数 
      const SystemPageSwitchCard( 
          {Key key, this.itemDesc, this.switchItem} 
          ) : super(key: key); 
      @override 
      Widget build(BuildContext context) { 
        // 获取操作句柄 
        final systemConfigModel = Provider.of<SystemConfigModel>(context); 
        return Row( 
          mainAxisAlignment: MainAxisAlignment.spaceBetween, 
          children: <Widget>[ 
            Text( 
              itemDesc, 
              style: TextStyles.commonStyle(1, Colors.black), 
            ), 
            Switch( // 选择 
                value: systemConfigModel.getSwitchItem(switchItem), 
                activeTrackColor: Colors.lightBlueAccent, 
                materialTapTargetSize: MaterialTapTargetSize.shrinkWrap, 
                onChanged: (newValue) { // 触发状态变化 
                  systemConfigModel.saveOne( 
                      switchItem, 
                      !systemConfigModel.getSwitchItem(switchItem) 
                  ); 
                } 
            ), 
          ], 
        ); 
      } 
    } 
    

代码第 34 行使用了 Switch 这个组件，该组件的 value 是通过 systemConfigModel 状态共享类获取，在点击切换时触发状态改变，并调用 systemConfigModel 中的 saveOne 触发依赖组件状态变化。

以上就实现了系统设置的功能，相对其他组件的实现，这部分逻辑较为复杂，涉及了 Flutter 的本地存储 以及 Provider 的应用技术点。

### 搜索

最后我们来看下搜索功能，前面我们已经实现了一个基本的搜索功能，但是其中的接口部分没有补齐，我们先来看下实际的效果，如图 6 所示。

![Drawing 10.png](https://s0.lgstatic.com/i/image/M00/3E/B2/CgqCHl8tC9yAB1kXAAC_xNdvVn4559.png)

图 6 搜索提示和搜索结果效果

#### 组件树+布局

根据图 6 的页面效果，我们来绘制组件树+布局，搜索提示就是一个列表，这里就不绘制了，搜索结果稍微复杂一些，主要看下这部分，绘制结果如图 7 所示。

![Drawing 13.png](https://s0.lgstatic.com/i/image/M00/3E/B3/CgqCHl8tC-aAConRAADrcMIRoXM555.png)

图 7 搜索结果页面组件树+布局设计

这个组件树的设计，包含了我们布局设计思想中的 8 个过程，竖横、高宽、上下和左右，具体细节就不再赘述。接下来我们看下这两部分逻辑的实现：搜索提示和搜索结果。

#### 搜索提示

搜索提示较为简单，主要逻辑是从服务端拉取搜索提示接口，并返回一个 ListView 列表结果。具体代码如下：

    /// 获取 suggest list组件列表 
    Future<Widget> _getSuggestList() async{ 
      List<String> suggests = await ApiSearchIndex.suggest(query); 
      if(suggests == null || suggests.length < 1){ // 异常处理 
        return Container(); 
      } 
      // 保留前 5 个搜索 
      int subLen = suggests.length > 5 ? 5 : suggests.length; 
      List<String> subSuggests = suggests.sublist(0, subLen); 
      return ListView.builder( 
          scrollDirection: Axis.vertical, 
          shrinkWrap: true, 
          itemCount: subSuggests.length, 
          itemBuilder: (context,index){ 
            return  ListTile( 
                title: RichText( 
                    text: TextSpan( 
                      // 获取搜索框内输入的字符串，设置它的颜色并加粗 
                        text: subSuggests[index], 
                        style: TextStyles.commonStyle() 
                    ) 
                ), 
                onTap: () { 
                  query = subSuggests[index]; 
                  showResults(context); 
                }, 
            ); 
          } 
      ); 
    } 
    

代码中，首先使用 query 关键词获取用户输入，通过 ApiSearchIndex.suggest 方法获取服务端搜索提示结果，接下来做一些数据校验，最后根据搜索提示 build 出相应的组件。其中的第 26 行至第 28 行代码的作用是，通过点击搜索提示触发搜索行为，第 27 行替换搜索提示内容，第 28 行执行搜索并获取搜索结果。

#### 搜索结果

根据图 7 的绘制结果，我们了解到这里需要设计两个组件，组件一是展示搜索到的用户列表内容，组件二是展示搜索到的帖子列表内容。我们这里就使用两个组件函数来实现，主要看下用户部分（帖子部分逻辑相似）。

    /// 获取用户搜索结果组件 
    Widget _getUserListWidget(List<StructUserInfo> userList) { 
      if(userList == null || userList.length < 1){ 
        return Container(); 
      } 
      int subLen = userList.length > 5 ? 5 : userList.length; 
      List<StructUserInfo> subUserList = userList.sublist(0, subLen); 
      return ListView.builder( 
          scrollDirection: Axis.vertical, 
          shrinkWrap: true, 
          itemCount: subUserList.length + 1, 
          itemBuilder: (context,index) { 
            if(index == 0){ 
              return Row( 
                children: <Widget>[ 
                  Padding(padding: EdgeInsets.only(left: 10)), 
                  Text( 
                    '用户', 
                    style: TextStyles.commonStyle(0.9), 
                  ), 
                ], 
              ); 
            } 
            return UserPageCard(userInfo: subUserList[index - 1]); 
          }); 
    } 
    

以上组件代码的实现与我们之前所学习的知识点，没有太大的差异性。核心知识点是应用 ListView.builder 组件，来显示 seaction\_name （也就是上面的 Text 组件）和搜索结果中的用户列表（上面的 UserPageCard 组件）。

以上就完成了搜索部分的逻辑，具体代码[查看 github 中的 pages/search\_page/custom\_delegate.dart 文件。](https://github.com/love-flutter/flutter-column)

### 总结

本课时带领大家实践开发了四个核心页面（我的好友、我的消息、系统设置和搜索）。学完本课时你需要进一步掌握组件树+布局的设计思想，同时掌握 Flutter 本地存储的技术点，进一步巩固 Flutter 编码风格。学完本课时之后，我建议你自行去实现“我的消息”中的私信功能和评论相关的部分（后续会在 github 上提供源码）。

本课时之前，我们对 App 的安全并没有关注太多，可以说完全放任。下一课时我们将通过工具化的方式来上报异常，保证我们 App 的质量，提前发现并解决问题。

[点击此链接查看本课时源码](https://github.com/love-flutter/flutter-column)