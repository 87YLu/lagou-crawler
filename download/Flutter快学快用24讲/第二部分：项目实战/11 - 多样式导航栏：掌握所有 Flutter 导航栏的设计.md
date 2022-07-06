本课时将介绍一些比较通用的导航栏功能，并应用上一课时的知识来实现导航栏跳转对应页面的功能。

### 导航栏样式效果

目前较为常见三种导航栏功能：底部导航栏、顶部导航栏和侧边导航栏。为了更好的界面效果，我在导航栏基础上增加了搜索功能模块的实现，完善了整个界面交互效果。我们先来看看这三种导航栏+搜索功能的运行效果。

![11.gif](https://s0.lgstatic.com/i/image/M00/32/E7/CgqCHl8O3yKAXVpIAAr_4vHP8yw482.gif)  
图 1 底部导航栏+搜索栏

![22.gif](https://s0.lgstatic.com/i/image/M00/32/E7/CgqCHl8O3y6ANmY5ABTLVrhmzuE224.gif)  
图 2 顶部导航栏+搜索栏

![33.gif](https://s0.lgstatic.com/i/image/M00/32/DC/Ciqc1F8O3z-ARRi7ABZtQ8SwZzo652.gif)  
图 3 侧边栏+搜索栏+底部导航栏

![44.gif](https://s0.lgstatic.com/i/image/M00/32/E7/CgqCHl8O30yAND7IABhCW3e0Ytk015.gif)  
图 4 侧边栏+搜索栏+顶部导航栏

上面就是本课时所需要实现的全部导航栏功能，接下来我们就逐个介绍下如何实现该功能。

### 导航栏实现

导航栏功能会涉及 Flutter 中几个核心点，我们使用如下表格的方式来说明，后续内容遇到相应的知识点后，可以直接对照表格 1 。

![image (5).png](https://s0.lgstatic.com/i/image/M00/32/AC/Ciqc1F8Os9eAcJO5AAB1aFqjuhE322.png)

图 1 底部导航栏+搜索栏

可以看到上述导航栏都是 Scaffold 的一个属性，这就类似于一个架子，架子提供了很多模块。如果我们需要某些模块，只需要按照模块的格式插入数据，就可以实现相应功能。这个控件的一些参数应用具体如下。

    const Scaffold({
      Key key,
      this.appBar, // 应用栏，显示在顶部，包括其中的搜索框
      this.body, // 页面的主题显示内容
      this.floatingActionButton, // 设置显示在上层区域的按钮，默认位置位于右下角
      this.floatingActionButtonLocation, // 设置floatingActionButton的位置
      this.floatingActionButtonAnimator, // floatingActionButton动画
      this.persistentFooterButtons, // 在底部导航栏之上的一组操作按钮
      this.drawer, // 左侧导航栏
      this.endDrawer, // 右侧导航栏
      this.bottomNavigationBar, // 底部导航栏
      this.bottomSheet, // 底部可隐藏导航栏
      this.backgroundColor, // 内容区域颜色
      this.resizeToAvoidBottomPadding, // 是否重新布局来避免底部被覆盖了，比如当键盘显示的时候，重新布局避免被键盘盖住内容。默认值为 true。
      this.resizeToAvoidBottomInset, //键盘弹出时是否重新绘制，以避免输入框被遮挡
      this.primary = true, // 是否计算手机顶部状态栏的高度
      this.drawerDragStartBehavior = DragStartBehavior.start, // 拖动的处理
      this.extendBody = false, // 是否延伸body至底部
      this.extendBodyBehindAppBar = false, // 是否延伸body至顶部
      this.drawerScrimColor, // 抽屉遮罩层背景色
      this.drawerEdgeDragWidth, // 滑动拉出抽屉的生效距离
      this.drawerEnableOpenDragGesture = true, // 确定是否可以通过拖动手势打开Scaffold.drawer, 默认情况下，拖动手势处于启用状态
      this.endDrawerEnableOpenDragGesture = true, // 确定是否可以使用拖动手势打开Scaffold.endDrawer，默认情况下，拖动手势处于启用状态。
    })
    

#### 1\. 底部导航栏

根据控件 Scaffold 的说明，其中涉及 bottomNavigationBar 这个属性名，在表格 1 中有说明到该属性对应的是一个 BottomNavigationBar 组件，该组件的属性也比较多，如下所示。

    BottomNavigationBar({
      Key key,
      @required this.items, // 数组，对应于BottomNavigationBarItem这个组件为菜单栏的每一项，其中包含四个属性icon、title、activeIcon和backgroundColor
      this.onTap, // 点击触发逻辑，一般用来触发页面的跳转更新
      this.currentIndex = 0, // 当前所在的 items 数组中的位置
      this.elevation = 8.0, // 设置阴影效果值
      BottomNavigationBarType type, // fixed(固定位置)和shifting(浮动效果)
      Color fixedColor, // 代表选中时候的颜色，不能和selectedItemColor一起使用
      this.backgroundColor, // 背景颜色
      this.iconSize = 24.0, // icon 大小
      Color selectedItemColor, // 代表选中的颜色，不能和selectedItemColor一起使用
      this.unselectedItemColor, // 未选中时颜色
      this.selectedIconTheme = const IconThemeData(), // 当前选中的BottomNavigationBarItem.icon中图标的大小，不透明度和颜色
      this.unselectedIconTheme = const IconThemeData(), // 当前未选中的BottomNavigationBarItem.icon中图标的大小，不透明度和颜色
      this.selectedFontSize = 14.0, // 选中的字体大小
      this.unselectedFontSize = 12.0, // 未选中字体大小
      this.selectedLabelStyle, // 选中字体样式
      this.unselectedLabelStyle, // 未选中字体样式
      this.showSelectedLabels = true, // 是否开启选中的样式
      bool showUnselectedLabels, // 是否开启未选中的样式
    })
    

介绍完一些基础属性以后，我们来尝试实现顶部导航栏功能。基于上一课时我们实现的两个页面功能，现在我们需要使用导航栏的方式来支持页面跳转。底部导航栏需要一个状态属性 indexValue 来控制导航栏显示位置，我们看下具体在 Scaffold 中的代码逻辑。

    return Scaffold(
      appBar: AppBar(
        title: Text('Two You'), // 页面名字
      ),
      body: Stack(
        children: <Widget>[
          _getPagesWidget(0),
          _getPagesWidget(1),
          _getPagesWidget(2)
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.people),
            title: Text('推荐'),
            activeIcon: Icon(Icons.people_outline),
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.favorite),
            title: Text('关注'),
            activeIcon: Icon(Icons.favorite_border),
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            title: Text('我'),
            activeIcon: Icon(Icons.person_outline),
          ),
        ],
        iconSize: 24,
        currentIndex: _indexNum,
        /// 选中后，底部BottomNavigationBar内容的颜色(选中时，默认为主题色)
        /// （仅当type: BottomNavigationBarType.fixed,时生效）
        fixedColor: Colors.lightBlueAccent,
        type: BottomNavigationBarType.fixed,
        onTap: (int index) {
          ///这里根据点击的index来显示，非index的page均隐藏
          if(_indexNum != index){
            setState(() {
              _indexNum = index;
            });
          }
        },
      ),
    );
    

上面代码中，第 5 - 10 行是获取具体的页面信息，并且在 \_getPagesWidget 里会判断当前 index 的值，判断当前索引 \_indexNum 与 index 是否相同，相同则显示页面，不相同则页面隐藏，具体 \_getPagesWidget 代码实现逻辑如下：

    /// 获取页面组件
    Widget _getPagesWidget(int index) {
      List<Widget> widgetList = [
        router.getPageByRouter('homepage'),
        Icon(Icons.directions_transit),
        router.getPageByRouter('userpage')
      ];
      return Offstage(
        offstage: _indexNum != index,
        child: TickerMode(
          enabled: _indexNum == index,
          child: widgetList[index],
        ),
      );
    }
    

上面代码中又使用到了 router 的一个新方法，该方法组件是获取对应 router 名称的组件页面信息，具体代码在 router 中实现，可以参考 github 源码，没有特殊性。

Scaffold 中代码的第 12 行开始实现底部导航栏逻辑，其中使用到了 BottomNavigationBar 控件，配置控件中的 items 属性，该属性注意是导航栏具体每一项数据，iconSize、currentIndex、fixedColor、type 和 onTap，onTap 主要是来切换页面，触发 setState ，然后重新 build 页面结构。

以上就完成了导航栏的设计，运行完以后，就可以正常进行页面切换操作。但是这里存在一些问题，比如在我们上一课时提到的外部拉起 APP 功能，如果拉起的是首页，我们不应该再去 push 一个新的页面，而是打开首页并且根据具体的页面跳转到具体的 tab 下，因此这里需要将 router 中的 push 进行修改。

我们将原来的 push 改为 open，并且对代码做了修改，具体代码如下：

    /// 执行页面跳转
    ///
    /// 需要特别注意以下逻辑
    /// -1 不在首页，则执行跳转
    /// 大于 -1 则为首页，需要在首页进行 tab 切换，而不是进行跳转
    int open(BuildContext context, String url) {
      // 非entrance入口标识
      int notEntrancePageIndex = -1;
      if (url.startsWith('https://') || url.startsWith('http://')) {
        // 打开网页
        Navigator.push(context, MaterialPageRoute(builder: (context) {
          return CommonWebViewPage(url: url);
        }));
        return notEntrancePageIndex;
      }
      Map<String, dynamic> urlParseRet = _parseUrl(url);
      int entranceIndex = routerMapping[urlParseRet['action']].entranceIndex;
      if (entranceIndex > notEntrancePageIndex) {
        // 判断为首页，返回切换的tab信息
        return entranceIndex;
      }
      Navigator.pushNamedAndRemoveUntil(context, urlParseRet['action'].toString(),
          (route) {
        if (route.settings.name == urlParseRet['action'].toString()) {
          return false;
        }
        return true;
      }, arguments: urlParseRet['params']);
      // 执行跳转，非首页
      return notEntrancePageIndex;
    }
    

上面代码与我们之前唯一的不同在于，判断是否在 entrance 页面，如果是则返回相应 tab 的 index，而不是直接进行跳转。如果不是则进行跳转，并返回一个 -1 notEntrancePageIndex。因为返回不一样，因此在 entrance.dart 中也需要对返回的信息做一定的处理，处理部分代码如下。

    /// 跳转页面
    void redirect(String link) {
      if (link == null) {
        return;
      }
      int indexNum = router.open(context, link);
      if (indexNum > -1 && _indexNum != indexNum) {
        setState(() {
          _indexNum = indexNum;
        });
      }
    }
    

代码主要是判断是否返回非 -1 以及两个 index 不相等，这时候就使用 setState 来切换导航栏 tab。

#### 2\. 顶部导航栏

在表格 1 中我们看到顶部导航栏，需要控件 Scaffold 属性 appBar ，在 appBar 中设置 bottom 就可以实现顶部导航栏功能。接下来看下 bottom 的设置方法，代码如下：

    return Scaffold(
      appBar: AppBar(
        title: Text('Two You'), // 页面名字
        bottom: TabBar(
          controller: _controller,
          tabs: <Widget>[
            Tab(
              icon: Icon(Icons.view_list),
              text: '推荐',
            ),
            Tab(
              icon: Icon(Icons.favorite),
              text: '关注',
            ),
            Tab(
              icon: Icon(Icons.person),
              text: '我',
            ),
          ],
        ),
      ),
      body: TabBarView(
        controller: _controller,
        children: [
          router.getPageByRouter('homepage'),
          Icon(Icons.directions_transit),
          router.getPageByRouter('userpage')
        ],
      ),
    );
    

在上面代码中的第 4 到第 21 行是在设置 bottom 的 TabBar 组件。在 TabBar 中，包含了一个控制导航栏的 controller 和具体导航栏的配置信息的 Tabs。在代码第 22 行到第 29 行也是在配置各个 tab 对应的页面内容组件，这里也是通过 controller 来控制显示，具体 controller 控制部分代码如下。

    /// 跳转页面
    void redirect(String link) {
      if (link == null) {
        return;
      }
      int indexNum = router.open(context, link);
      if (indexNum > -1 && _controller.index != indexNum) {
        _controller.animateTo(indexNum);
      }
    }
    

顶部导航栏的跳转逻辑部分和底部导航栏相似，这里是使用状态变量 \_controller 的 animateTo 方法来处理 tab 的切换。其他部分代码改动和底部导航栏都基本一致，具体代码参考 github 源码。

#### 3\. 侧边导航栏

侧边栏在表格 1 中，可以看到使用的是 Scaffold 的 drawer 属性。该属性需要一个 Drawer 对象，因此我们在 Widgets 目录中创建一个 menu 目录，并新增 draw.dart 文件，具体代码如下。

    import 'package:flutter/material.dart';
    import 'package:two_you_friend/router.dart';
    /// 左侧菜单
    class MenuDraw extends StatelessWidget {
      /// 外部跳转
      final Function redirect;
      /// 默认构造函数
      const MenuDraw(this.redirect);
      @override
      Widget build(BuildContext context) {
        return Drawer(
            child: MediaQuery.removePadding(
              context: context,
              child: ListView(
                children: <Widget>[
                  ListTile(
                    leading: Icon(Icons.view_list),
                    title: Text('推荐'),
                    onTap: () {
                      Navigator.pop(context);
                      redirect('tyfapp://homepage');
                    },
                  ),
                  ListTile(
                    leading: Icon(Icons.favorite),
                    title: Text('关注'),
                    onTap: () {
                      Navigator.pop(context);
                      Router().open(context, 'http://www.qq.com');
                    },
                  ),
                  ListTile(
                    leading: Icon(Icons.person),
                    title: Text('我'),
                    onTap: () {
                      Navigator.pop(context);
                      redirect('tyfapp://userpage');
                    },
                  ),
                ],
              ),
            ),
        );
      }
    }
    

前 4 行是导入相应的库，创建 MenuDraw 类，类包含 redirect 方法，该方法就是 entrance 中声明的 tab 导航栏切换的方法，如果非 entrance 的切换则需要使用到 router 跳转，类似上面代码中的第 33 行 。

代码的第 19 行到第 44 行则为相应的左侧导航栏的配置，onTap 为导航栏的跳转逻辑，在点击相应的 Tap 以后，需要使用 Navigator.pop(context) 来关闭左侧导航栏。

实现完成该 MenuDraw 类后，我们需要在控件 Scaffold 中增加 drawer 属性，代码如下。

    return Scaffold(
      appBar: AppBar(
        title: Text('Two You'), // 页面名字
      ),
      drawer: MenuDraw(redirect),
      ...
    );
    

上面代码的第 5 行就是新增 drawer 左侧导航栏。

#### 4\. 搜索功能

为了让功能更完善，我们需要增加一个右侧搜索功能，这里就涉及表格 1 中 AppBar 的 actions 属性，我们可以在 AppBar 中增加如下代码：

    AppBar(
      title: Text('Two You'), // 页面名字
      actions: <Widget>[
        IconButton(
          icon: Icon(Icons.search),
          onPressed: () {
            showSearch(
                context: context,
                delegate: SearchPageCustomDelegate()
            );
          },
        ),
      ],
    )
    

在 actions 中可以添加一组功能按钮，由于这里我们只需要搜索功能按钮，因此在 actions 属性中添加一个 IconButton 即可。IconButton 中需要展示一个搜索 icon ，并且点击以后前往搜索页面。

接下来我们就需要实现 SearchPageCustomDelegate 的页面逻辑，新增 search\_page 页面，并在 search\_page 下新建 custom\_delegate.dart 文件，接下来实现该文件代码。

这个类需要继承 SearchDelegate ，然后必须包含四个方法的实现逻辑，代码如下。

    import 'package:flutter/material.dart';
    /// 搜索框
    class SearchPageCustomDelegate extends SearchDelegate {
      @override
      List<Widget> buildActions(BuildContext context) {
      }
      @override
      Widget buildLeading(BuildContext context) {
      }
      @override
      Widget buildResults(BuildContext context) {
      }
      @override
      Widget buildSuggestions(BuildContext context) {
      }
    }
    

buildActions 为右侧的图标按钮，一般我们可以显示一个清除搜索框内容的功能，我们可以使用如下代码来实现。

    return [
      IconButton(
        tooltip: 'Clear',
        icon: const Icon(Icons.clear),
        onPressed: () {
          query = '';
          showSuggestions(context);
        },
      )
    ];
    

buildLeading 为左侧的按钮一般来触发返回操作，代码实现如下：

    @override
    Widget buildLeading(BuildContext context) {
      return IconButton(
        tooltip: 'Back',
        icon: AnimatedIcon(
          icon: AnimatedIcons.menu_arrow,
          progress: transitionAnimation,
        ),
        onPressed: () {
          close(context, null);
        },
      );
    }
    

关闭当前页面使用 close(context, null) 即可实现。

buildResults 为搜索结果显示列表，buildSuggestions 为搜索提示列表，在这里我们返回一个空 ListView() 就行。

在上面基础上，我们需要修改默认的搜索框的提示，并且需要匹配当前主题的颜色字体等，需要做以下两部分逻辑。

    /// 修改提示框内容
    String get searchFieldLabel => '用户、帖子';
    @override
    ThemeData appBarTheme(BuildContext context) {
      final ThemeData theme = Theme.of(context);
      return theme.copyWith(
          inputDecorationTheme: InputDecorationTheme(),
          primaryColor: theme.primaryColor,
          primaryIconTheme: theme.primaryIconTheme,
          primaryColorBrightness: theme.primaryColorBrightness,
          primaryTextTheme: theme.primaryTextTheme
      );
    }
    

上面代码中第 2 行是修改默认搜索框提示，第 5 至第 17 行则是匹配当前应用主题。完整代码可[参考 github 源码。](https://github.com/love-flutter/flutter-column)

### 总结

本课时介绍了控件 Scaffold 的一些基础用法，着重介绍了其中三个比较常用的属性 bottomNavigationBar、appBar 和 drawer，同时使用这些属性完成了我们顶部导航栏、底部导航栏、侧边导航栏和搜索功能的实现。学完本课时你需要掌握这些基础的导航栏设计的使用方法，其次了解控件 Scaffold 的其他属性的用法。

本课时实现了 App 的基础结构，下一课时我将从内容展示的多样式来实现具体的 App 页面内容。

[点击此链接查看本课时源码](https://github.com/love-flutter/flutter-column)