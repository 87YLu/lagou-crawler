上一课时我们完善了首页推荐功能，本课时将完善个人页面。个人页面涉及红点组件的知识点，因此本课时在完善个人页面的同时，会着重介绍下该功能的实现。

### 实现效果

我们先来看下本课时要完成的一个界面效果，如图 1 动画所示。

![20200712_160246.gif](https://s0.lgstatic.com/i/image/M00/37/AD/Ciqc1F8aewCAIDGrAAocYK2ZqIo350.gif)  
图 1 本课时目标效果

首先在最底部导航栏增加了消息未读数提示，当有新的未读消息时候，会有红点提示。个人界面展示了个人信息以及个人相关的操作栏（我的好友、我的消息和系统设置）。

接下来我们来看下实现该效果需要做哪些前期准备工作。

### 前期准备

基于图 1 的效果，我们首先要实现个人页面。个人页面是一个新页面，对于新页面我们按照第 7 课时的知识去设计页面。由于新增了红点功能，首先在 App 启动时 ，需要一个新的接口拉取服务器未读消息数，然后新增 API 来拉取该数据。其次这个数据状态，需要在多个组件中共享，因此要新增 Model 来管理该状态 。

#### 组件设计

根据图 2 的界面效果，我们将页面拆分图 3 组件树。

![image (9).png](https://s0.lgstatic.com/i/image/M00/37/B9/CgqCHl8aeySAO1UTAAIF-lgAvBA674.png)  
图 2 个人页面效果

![image (10).png](https://s0.lgstatic.com/i/image/M00/37/AD/Ciqc1F8aezCAA5btAACFxGz_UhM158.png)  
图 3 个人页面组件树设计

图 3 组件树中， 左侧为最上面的头像和昵称，右侧为功能列表 。由于是一个有限的列表，因此可以使用 ListView 来封装组件。具体代码编写部分和之前所介绍的没有太大区别，详细代码可[前往 github 参考](https://github.com/love-flutter/flutter-column)。

个人页面开发完成后，我们再来看下红点功能所涉及的 API 和 Model 功能部分。由于用户信息和红点未读消息，都需要状态共享，因此需要创建两个 Model 类 。 这两个 Model 类的代码逻辑基本一致，下面只介绍与红点未读消息有关的部分。

#### API

在 App 启动时就需要拉取未读消息数，因此需要一个接口来获取未读消息内容 。在 api/user\_info 目录下创建 message.dart 来管理消息接口 ，实现该 ApiUserInfoMessage 类，代码如下：

    /// 获取用户消息相关 
    class ApiUserInfoMessage { 
      /// 获取自己的个人信息 
      static int getUnReadMessageNum() { 
        return 18; 
      } 
    }
    

上面就是这个 API 的功能，里面包含一个 getUnReadMessageNum 方法，这里模拟返回一个假数据 18 个未读消息。

#### Model

由于未读消息会被应用在底部导航栏和个人页面两个组件页面，因此需要使用 Provider 来做状态管理，在 model 下创建 new\_message\_model.dart ，并实现下面代码：

    import 'package:flutter/material.dart'; 
    /// name状态管理模块 
    class NewMessageModel with ChangeNotifier { 
      /// 系统未读新消息数 
      int newMessageNum; 
      /// 构造函数 
      NewMessageModel({this.newMessageNum}); 
      /// 获取未读消息 
      int get value => newMessageNum; 
      /// 设置已经阅读消息 
      void readNewMessage() { 
        if(newMessageNum == 0) { 
          return; 
        } 
        newMessageNum = 0; 
        notifyListeners(); 
      } 
    }
    

第 6 行是声明一个未读消息字段，保存未读消息数量。第 9 行是构造函数，第 12 行是设置一个 get 方法，第 14 行是设置已读状态，也可以在此调用服务端，将服务端未读状态清零，同时将本地的未读消息数清零。在写 Model 代码要特别注意，比如上面的第 16 行，目的就是避免没必要的 rebuild，当已经没有未读消息，则不需要处理任何行为。

在完成 API 和 Model 部分代码后，接下来修改入口文件 main.dart，在该入口文件中要多增加一个状态管理模块。

#### Main.dart

由于需求的改变，现在需要多个共享状态类，课时之前只有一个状态 like\_num\_model，现在需要新增一个 new\_message\_model 状态，这里就需要使用到 MultiProvider，避免嵌套多层。需要将 main.dart build 方法修改为下面逻辑：

    @override 
    Widget build(BuildContext context) { 
      return _getProviders( 
        context, 
        MaterialApp( 
            title: 'Two You', // APP 名字 
            debugShowCheckedModeBanner: false, 
            theme: ThemeData( 
              primarySwatch: Colors.blue, // APP 主题 
            ), 
            routes: Router().registerRouter(), 
            home: Entrance()), 
      ); 
    }
    

为了保持代码的整洁，新增了一个 \_getProviders 方法，然后将状态管理相关的逻辑放入 \_getProviders 中，其他组件相关的逻辑还是在 build 中，具体在看下 \_getProviders 中的代码逻辑：

    /// 部分数据需要获取初始值 
    Widget _getProviders(BuildContext context, Widget child) { 
      StructUserInfo myUserInfo = ApiUserInfoIndex.getSelfUserInfo(); 
      if(myUserInfo == null){ 
        return CommonError(); 
      } 
      int unReadMessageNum = ApiUserInfoMessage.getUnReadMessageNum(); 
      return MultiProvider( 
        providers: [ 
          ChangeNotifierProvider(create: (context) => LikeNumModel()), 
          ChangeNotifierProvider( 
              create: (context) => UserInfoModel( 
                myUserInfo: myUserInfo 
              ) 
          ), 
          ChangeNotifierProvider( 
              create: (context) => NewMessageModel( 
                  newMessageNum: unReadMessageNum 
              ) 
          ), 
        ], 
        child: child, 
      ); 
    }
    

代码第 3 到 7 行是从服务端调用未读消息接口，并获得用户信息和用户未读消息数 。第 9 行使用 MultiProvider 来封装所有需要状态管理的代码，其中每一个状态管理的格式按照下面的方式：

    ChangeNotifierProvider(create: (context) => LikeNumModel()),
    

LikeNumModel 为 Model 类，可以为类增加初始赋值，比如上面的 UserInfoModel 和 NewMessageModel。

通过以上方法，我们就将用户信息和未读消息两个状态进行了组件共享，接下来我们看下如何设计红点组件。

### 红点组件

在 App 中红点和消息提醒是非常常见的应用，因此需要将该功能，设计为一个基础通用组件。在 Flutter 中是提供了一个比较通用的库 [badges](https://pub.dev/packages/badges)。如果你觉得不太适用也可以自己来封装，本课时主要是基于这个组件库实现一个二次封装应用，先来具体看下二次封装的红点组件实现部分。

#### 组件实现

根据自身的业务，我们可以设计为两种， 一个是只显示红点，另一个是显示具体未读消息数的，先看下只显示红点的部分。

    import 'package:flutter/material.dart'; 
    import 'package:badges/badges.dart'; 
    /// 通用红点逻辑 
    class CommonRedMessage  { 
      /// 只展示红点，不展示具体消息数 
      static Widget showRedWidget(Widget needRedWidget, int newMessageNum) { 
        if(newMessageNum < 1) { // 小于 1 的消息则无须设置 
          return needRedWidget; 
        } 
        return _getBadge(needRedWidget, ''); 
      } 
    
      /// 获取 badge 组件 
      static Widget _getBadge(Widget needRedWidget, String msgTips) { 
        return Badge( 
          alignment: Alignment.bottomLeft, 
          position: BadgePosition.topRight(), 
          toAnimate: false, 
          badgeContent: Text( 
            '$msgTips', 
            style: TextStyle( 
              color: Colors.white, 
              fontSize: 10.0, 
              letterSpacing: 1, 
              wordSpacing: 2, 
              height: 1, 
            ), 
          ), 
          child: needRedWidget, 
        ); 
      } 
    }
    

代码第 7 行的方法 showRedWidget 就是只显示红点提醒，其调用的是 \_getBadge 方法，该方法主要是应用 Badge 第三方组件，上面代码中的五个参数的作用分别是：

*   alignment，child 组件的展示方式，这里是底部靠左；
    
*   position，红点或者未读消息数的位置，这里是右上角；
    
*   toAnimate，表示动画，这里直接去掉，感觉效果不太好，也没有必要；
    
*   badgeContent，则是红点的样式内容，需要 Text 组件；
    
*   child，就是需要展示红点的组件。
    

未读消息也是使用到 \_getBadge 方法，但这里传入的是具体的消息数，而不是一个空字符，具体代码如下：

    /// 展示消息提醒 
    static Widget showRedNumWidget(Widget needRedWidget, int newMessageNum) { 
      if(newMessageNum < 1) { // 小于1的消息则无须设置 
        return needRedWidget; 
      } 
      // 消息数大于99时，则只显示一个红点即可 
      String msgTips = newMessageNum > 99 ? '99+' : '$newMessageNum'; 
      return _getBadge(needRedWidget, msgTips); 
    }
    

考虑到未读消息数小于 1 不用展示，其次为了避免消息未读数量过大导致 UI 问题，这里在第 7 行代码也加了判断，具体还是根据业务场景来配置。完成基础组件后，我们再来看下该组件的应用部分。

#### 组件应用

组件的应用包含在两部分，一部分是底部导航栏，另外一部分是个人页的“我的消息”按钮。我们先来看下底部导航栏部分，这部分代码在 pages/entrance.dart 中，我们只看修改的部分。

    /// 获取页面内容部分 
    Widget _getScaffold(BuildContext context) { 
      final newMessageModel = Provider.of<NewMessageModel>(context);
    

首先需要通过 Provider 获得 NewMessageModel 的操作句柄。

    BottomNavigationBarItem( 
      icon: CommonRedMessage.showRedWidget( 
          Icon(Icons.person), 
          newMessageModel.value 
      ), 
      title: Text('我'), 
      activeIcon: CommonRedMessage.showRedWidget( 
          Icon(Icons.person_outline), 
          newMessageModel.value 
      ), 
    ),
    

修改底部导航栏的“我”，将其中的 icon 使用红点组件封装，代码在第 2 到 5 行，这里封装在 icon 上界面效果是最好的 ， 这样就在底部导航栏增加了未读消息红点提醒 。

为了演示红点和消息数两种场景，在导航上使用红点来演示效果，个人页面则演示展示具体未读消息数量。再来看下个人页面的代码部分，这部分逻辑在 widgets/user\_page/button\_list.dart 中。

    /// 个人页面的功能列表 
    class UserPageButtonList extends StatelessWidget { 
      @override 
      Widget build(BuildContext context) { 
        final newMessageModel = Provider.of<NewMessageModel>(context); 
        return ListView( 
          children: <Widget>[ 
            ListTile( 
              leading: Icon(Icons.person_pin), 
              title: Text('我的好友'), 
              onTap: () {}, 
            ), 
            ListTile( 
              leading: CommonRedMessage.showRedNumWidget( 
                Icon(Icons.email), 
                newMessageModel.value 
              ), 
              title: Text('我的消息'), 
              onTap: () {}, 
            ), 
            ListTile( 
              leading: Icon(Icons.settings), 
              title: Text('系统设置'), 
              onTap: () {}, 
            ) 
          ], 
        ); 
      } 
    }
    

以上代码中的第 18 行到 21 行，就是将 icon 封装在了红点组件内。未读消息展示已经介绍了，那么我们再来看下如何消除消息红点和未读消息。

#### 消除红点

在 new\_messsage\_model 状态管理类中，有一个 readNewMessage 方法，该方法就是将未读消息设置为 0 ， 然后通知数据监听方，这里我们将点击行为在个人页面的“我的消息”来触发，将 widgets/user\_page/button\_list.dart 修改为下面的部分：

    import 'package:flutter/material.dart'; 
    import 'package:provider/provider.dart'; 
    import 'package:two_you_friend/model/new_message_model.dart'; 
    import 'package:two_you_friend/widgets/common/red_message.dart'; 
    /// 个人页面的功能列表 
    class UserPageButtonList extends StatelessWidget { 
      @override 
      Widget build(BuildContext context) { 
        final newMessageModel = Provider.of<NewMessageModel>(context); 
        return ListView( 
          children: <Widget>[ 
            ListTile( 
              leading: Icon(Icons.person_pin), 
              title: Text('我的好友'), 
              onTap: () {}, 
            ), 
            ListTile( 
              leading: CommonRedMessage.showRedNumWidget( 
                Icon(Icons.email), 
                newMessageModel.value 
              ), 
              title: Text('我的消息'), 
              onTap: () { 
                newMessageModel.readNewMessage(); 
              }, 
            ), 
            ListTile( 
              leading: Icon(Icons.settings), 
              title: Text('系统设置'), 
              onTap: () {}, 
            ) 
          ], 
        ); 
      } 
    }
    

上面代码中的第 28 行就是点击触发消息消除，接下来我们运行看下效果，如图 4 的动效所示。

![20200712_160246 (1).gif](https://s0.lgstatic.com/i/image/M00/37/AE/Ciqc1F8ae4WASR5LAAocYK2ZqIo031.gif)  
图 4 红点效果图

以上就实现了红点组件的设计，并应用红点组件完善了 Two You Friend 的个人页面功能。

### 总结

本课时在实现 App 个人页面的过程中，着重介绍了红点组件的设计和应用，同时介绍到了 Provider 多状态管理的方法。学习完本课时后，你要熟练应用红点组件，并且掌握其业务组件设计的方法，其次需要掌握 Provider 的多状态管理方法 。

在本课时之前，所有的 API 接口都是一个假接口数据，下一课时我们将介绍如何进行网络请求，来完善 API 部分功能。谢谢大家。

[点击此链接查看本课时源码](https://github.com/love-flutter/flutter-column)