本课时将介绍 Flutter 的组件，以及组件的生命周期，其次结合上课时的例子实现一个自动更新展示最新时间的 Flutter 应用。

### 组件 Widget

Flutter 中的组件与前端组件的理解和作用基本一致，但是没有一个明确的概念解释 Flutter 组件，这里我借用前端的组件定义来解释 Flutter 组件的概念。

一个 Flutter 组件，包含了组件的模板、样式和交互等内容，外部只要按照组件设定的属性、函数及事件处理等进行调用即可，完全不用考虑组件的内部实现逻辑。其中组件又包括无状态组件和有状态组件。

*   无状态组件
    

无状态组件，可以理解为将外部传入的数据转化为界面展示的内容，只会渲染一次。

*   有状态组件
    

有状态组件，是定义交互逻辑和业务数据，可以理解为具有动态可交互的内容界面，会根据数据的变化进行多次渲染。

### 生命周期

在原生 Android 、原生 iOS 、前端 React 或者 Vue 都存在生命周期的概念，在 Flutter 中一样存在生命周期的概念，其基本概念和作用相似。 Flutter 中说的生命周期，也是指有状态组件，对于无状态组件生命周期只有 build 这个过程，也只会渲染一次，而有状态组件则比较复杂，下面我们就来看看有状态组件的生命周期过程。

#### 生命周期的流转

Flutter 中的生命周期，包含以下几个阶段：

*   **createState** ，该函数为 StatefulWidget 中创建 State 的方法，当 StatefulWidget 被调用时会立即执行 createState 。
    
*   **initState** ，该函数为 State 初始化调用，因此可以在此期间执行 State 各变量的初始赋值，同时也可以在此期间与服务端交互，获取服务端数据后调用 setState 来设置 State。
    
*   **didChangeDependencies** ，该函数是在该组件依赖的 State 发生变化时，这里说的 State 为全局 State ，例如语言或者主题等，类似于前端 Redux 存储的 State 。
    
*   **build** ，主要是返回需要渲染的 Widget ，由于 build 会被调用多次，因此在该函数中只能做返回 Widget 相关逻辑，避免因为执行多次导致状态异常。
    
*   **reassemble** ，主要是提供开发阶段使用，在 debug 模式下，每次热重载都会调用该函数，因此在 debug 阶段可以在此期间增加一些 debug 代码，来检查代码问题。
    
*   **didUpdateWidget** ，该函数主要是在组件重新构建，比如说热重载，父组件发生 build 的情况下，子组件该方法才会被调用，其次该方法调用之后一定会再调用本组件中的 build 方法。
    
*   **deactivate** ，在组件被移除节点后会被调用，如果该组件被移除节点，然后未被插入到其他节点时，则会继续调用 dispose 永久移除。
    
*   **dispose** ，永久移除组件，并释放组件资源。
    

![image (7).png](https://s0.lgstatic.com/i/image/M00/26/D4/CgqCHl7zAM2AFYCOAAFd30sb1Ck089.png)  
图 1 生命周期流程图

整个过程分为四个阶段：

1.  初始化阶段，包括两个生命周期函数 createState 和 initState；
    
2.  组件创建阶段，也可以称组件出生阶段，包括 didChangeDependencies 和 build；
    
3.  触发组件多次 build ，这个阶段有可能是因为 didChangeDependencies、setState 或者 didUpdateWidget 而引发的组件重新 build ，在组件运行过程中会多次被触发，这也是优化过程中需要着重需要注意的点；
    
4.  最后是组件销毁阶段，deactivate 和 dispose。
    

#### 组件首次加载执行过程

我们先实现一段代码，来看下组件在首次创建的执行过程是否是按照图 1 的流程。

1、 在 lib 中 pages 下创建 test\_stateful\_widget.dart ；  
2、 在 test\_stateful\_widget.dart 添加如下代码：

    import 'package:flutter/material.dart';
    /// 创建有状态测试组件
    class TestStatefulWidget extends StatefulWidget {
      @override
      createState() {
        print('create state');
        return TestState();
      }
    }
    /// 创建状态管理类，继承状态测试组件
    class TestState extends State<TestStatefulWidget> {
      /// 定义 state [count] 计算器
      int count = 1;
      /// 定义 state [name] 为当前描述字符串
      String name = 'test';
      @override
      initState() {
        print('init state');
        super.initState();
      }
      @override
      didChangeDependencies() {
        print('did change dependencies');
        super.didChangeDependencies();
      }
      @override
      didUpdateWidget(TestStatefulWidget oldWidget) {
        count++;
        print('did update widget');
        super.didUpdateWidget(oldWidget);
      }
      @override
      deactivate() {
        print('deactivate');
        super.deactivate();
      }
      @override
      dispose() {
        print('dispose');
        super.dispose();
      }
      @override
      reassemble(){
        print('reassemble');
        super.reassemble();
      }
      /// 修改 state name
      void changeName() {
        setState(() {
          print('set state');
          this.name = 'flutter';
        });
      }
      @override
      Widget build(BuildContext context) {
        print('build');
        return Column(
          children: <Widget>[
            FlatButton(
              child: Text('$name $count'), // 使用 Text 组件显示描述字符和当前计算
              onPressed:()=> this.changeName(), // 点击触发修改描述字符 state name
            )
          ],
        );
      }
    }
    

上述代码把有状态组件的一些生命周期函数都进行了重写，并且在执行中都打印了一些字符串标识，目的是可以看到该函数被执行。

3、 然后在 main.dart 中加载该组件，代码如下：

    import 'package:flutter/material.dart';
    import 'package:two_you_friend/pages/test_stateful_widget.dart';
    /// APP 核心入口文件
    void main() => runApp(MyApp());
    /// MyApp 核心入口界面
    class MyApp extends StatelessWidget {
      // This widget is the root of your application.
      @override
      Widget build(BuildContext context) {
        return MaterialApp(
            title: 'Two You', // APP 名字
            theme: ThemeData(
              primarySwatch: Colors.blue, // APP 主题
            ),
            home: Scaffold(
                appBar: AppBar(
                  title: Text('Two You'), // 页面名字
                ),
                body: Center(
                 child:
                  TestStatefulWidget(),
                )
            ));
      }
    }
    

代码修改后，我们打开手机模拟器，然后运行该 App ，在输出控制台可以看到下面的运行打印日志信息。

    flutter: create state
    flutter: init state
    flutter: did change dependencies
    flutter: build
    flutter: reassemble
    flutter: did update widget
    flutter: build
    

运行结果中，打印过程可以看到是按照我们上面图 1 的执行流程在运行的，**但其中最值得关注的是 build 运行了两次**。这是在开发模式下才会执行的过程，在正式环境是不会出现的，因为重新渲染成本非常大，这个问题可以使用打印 build 的调用堆栈即可发现。如果你要关闭两次 build 也可以实现，在 Flutter 框架中搜索 constants.dart 文件，并找到下面这行代码，将 defaultValue 从 false 修改为 true。

    const bool kReleaseMode = bool.fromEnvironment('dart.vm.product', defaultValue: true);
    

其实这里会**触发 didUpdateWidget 函数**，是因为 TestStatefulWidget 组件是 MyApp 组件中的子组件，从而导致 MyApp 函数中的 build 触发子组件 didUpdateWidget 函数的执行，具体会在下面触发组件再次 build 中详细说明。

#### 触发组件再次 build

触发组件再次 build 有三种方式，一个是 setState ，另一个是 didChangeDependencies ，再一个是 didUpdateWidget 。

setState 比较容易理解，在数据状态进行变化时，触发组件 build ，在上面的代码运行后的界面中，点击中间的页面提示如图 2 位置，就可以看到在调用 setState 后，会调用 build 一个方法。

![image (8).png](https://s0.lgstatic.com/i/image/M00/26/D4/CgqCHl7zAQmAWvyUAAE_mgzi5xE933.png)  
图 2 测试组件运行界面

didChangeDependencies ，你可以理解为本组件依赖的全局 state 的值发生了变化，例如前端的 redux 中的数据发生了变化，也会进行 build 操作。一般情况下我们会将一些比较基础的数据放到全局变量中，例如主题颜色、地区语言或者其他通用变量等。如果这些全局 state 发生状态变化则会触发该函数，而该函数之后就会触发 build 操作。

didUpdateWidget 触发 build 我们需要从代码层面来讲解下，现在我们需要设计两个组件，一个是我们刚实现的 TestStatefulWidget ，另外一个则是该组件的子组件，我们命名为SubStatefulWidget 。接下来我们在 TestStatefulWidget 加载该组件，在头部 import 该组件，然后将 build 中的代码修改为下面：

    @override
    Widget build(BuildContext context) {
      print('build');
      return Column(
        children: <Widget>[
          FlatButton(
            child: Text('$name $count'), // 使用 Text 组件显示描述字符和当前计算
            onPressed:()=> this.changeName(), // 点击触发修改描述字符 state name
          ),
          SubStatefulWidget() // 加载子组件
        ],
      );
    }
    

接下来我们实现 SubStatefulWidget 子组件的代码，和父组件基本相似，只是在打印处都加了 sub ，其次 build 实现逻辑也修改了，具体代码如下：

    import 'package:flutter/material.dart';
    /// 创建子组件类
    class SubStatefulWidget extends StatefulWidget {
      @override
      createState() {
        print('sub create state');
        return SubState();
      }
    }
    /// 创建子组件状态管理类
    class SubState extends State<SubStatefulWidget> {
      String name = 'sub test';
      @override
      initState() {
        print('sub init state');
        super.initState();
      }
      @override
      didChangeDependencies() {
        print('sub did change dependencies');
        super.didChangeDependencies();
      }
      @override
      didUpdateWidget(SubStatefulWidget oldWidget) {
        print('sub did update widget');
        super.didUpdateWidget(oldWidget);
      }
      @override
      deactivate() {
        print('sub deactivate');
        super.deactivate();
      }
      @override
      dispose() {
        print('sub dispose');
        super.dispose();
      }
      @override
      reassemble(){
        print('sub reassemble');
        super.reassemble();
      }
      @override
      Widget build(BuildContext context) {
        print('sub build');
        return Text('subname $name'); // 使用Text组件显示当前name state
      }
    }
    

代码实现完成后，我们再重新加载 App ，可以看到如下运行日志信息。

    flutter: create state
    flutter: init state
    flutter: did change dependencies
    flutter: build
    flutter: sub create state
    flutter: sub init state
    flutter: sub did change dependencies
    flutter: sub build
    flutter: reassemble
    flutter: sub reassemble
    flutter: did update widget
    flutter: build
    flutter: sub did update widget
    flutter: sub build
    

*   加载 TestStatefulWidget 组件，四个状态函数 createState、initState、didChangeDependencies 和 build；
    
*   加载 SubStatefulWidget 组件，四个状态函数 createState、initState、didChangeDependencies 和 build；
    
*   TestStatefulWidget 进行二次 build ，因为父组件需要重新 build 触发子组件的 didUpdateWidget ，didUpdateWidget 则触发 build。
    

为了验证上面逻辑，我们现在再次点击图 3 中的红色部分，来触发 TestStatefulWidget 组件的 build ，看下是否会触发子组件的 didUpdateWidget 和 build。

![image (9).png](https://s0.lgstatic.com/i/image/M00/26/D4/CgqCHl7zATCAcLoKAAEryO5AHrk427.png)  
图 3 增加子组件界面点击指示图

在运行日志窗口可以看到增加了下面的日志信息。

    flutter: set state
    flutter: build
    flutter: sub did update widget
    flutter: sub build
    

这就说明了父组件的变化会引发子组件的 build ，虽然子组件没有任何的改动。这点如果是在前端的话，是需要使用 shouldUpdateComponent ，来介绍重新构建，不过在 Flutter 中是没有该功能来减少重新 build 的。

#### 组件销毁触发

在上面的代码基础上，我们直接在 TestStatefulWidget 组件中注释子组件 SubStatefulWidget 的调用，然后**热重载**即可看到下面的日志信息（请注意一定是需要热重载才会有效果，主要目的是一开始加载了该组件，后面再去掉该组件触发）。

    flutter: reassemble
    flutter: sub reassemble
    flutter: build
    flutter: sub deactivate
    flutter: sub dispose
    

### 综合实践

上一课时，只是简单地显示了一个时间，这里需要动态地显示当前的时间。基于我们本课时的学习，我们需要实现以下几点：

1.  使用有状态组件来实现，需要创建两个类 StatefulWidget 和 State ，分别为 HomePage 和 HomePageState 对应到一个文件 home\_page.dart ；
    
2.  定义一个当前时间的 state currentTimeStr ，定义一个获取当前时间的函数 getCurrentTime ，并在 initState 中调用一次该函数当前时间；
    
3.  实现函数 getCurrentTime 获取当前时间；
    
4.  定义并实现一个定时刷新的函数 refreshTimeStr ，在定时函数中使用 Timer 定时使用 setState 来更新 state，并在 initState 中执行该函数；
    
5.  build 中展示当前时间的 state 值，以及一个前缀信息；
    

接下来我们按照上面的步骤来实现代码。

#### 步骤一：创建有状态类

使用有状态组件来实现，在 lib 的 pages 目录下创建 home\_page.dart ，接下来在文件中创建两个类 StatefulWidget 和 State ，分别为 HomePage 和 HomePageState，代码如下。

    import 'package:flutter/material.dart';
    /// App 首页入口
    ///
    /// 本模块函数，加载状态类组件HomePageState
    /// [prefix]是显示在时间之前的一个字符串
    class HomePage extends StatefulWidget {
      @override
      createState() => HomePageState();
    }
    /// 首页有状态组件类
    ///
    /// 主要是获取当前时间，并动态展示当前时间
    class HomePageState extends State<HomePage> {
      /// 有状态类返回组件信息
      @override
      Widget build(BuildContext context) {
      }
    }
    

#### 步骤二：增加状态变量，实现初始化

定义一个当前时间的 state currentTimeStr ，定义一个获取当前时间的函数 getCurrentTime ，并在 initState 中调用一次该函数当前时间，代码如下。

    import 'package:flutter/material.dart';
    /// APP 首页入口
    ///
    /// 本模块函数，加载状态类组件HomePageState
    /// [prefix]是显示在时间之前的一个字符串
    class HomePage extends StatefulWidget {
      @override
      createState() => HomePageState();
    }
    /// 首页有状态组件类
    ///
    /// 主要是获取当前时间，并动态展示当前时间
    class HomePageState extends State<HomePage> {
      /// 展示当前时间字符串
      String currentTimeStr;
      @override
      void initState() {
        super.initState();
        this.currentTimeStr = getCurrentTime();
      }
    
      /// 获取当前时间戳
      ///
      /// 返回一个字符串类型的前缀信息：时间戳
      String getCurrentTime() {
        return '';
      }
      /// 有状态类返回组件信息
      @override
      Widget build(BuildContext context) {
      }
    }
    

#### 步骤三：实现 getCurrentTime 方法

实现函数 getCurrentTime 获取当前时间，代码如下。

    import 'package:flutter/material.dart';
    import 'package:intl/intl.dart'; // 需要在pubspec.yaml增加该模块
    /// APP 首页入口
    ///
    /// 本模块函数，加载状态类组件HomePageState
    /// [prefix]是显示在时间之前的一个字符串
    class HomePage extends StatefulWidget {
      @override
      createState() => HomePageState();
    }
    /// 首页有状态组件类
    ///
    /// 主要是获取当前时间，并动态展示当前时间
    class HomePageState extends State<HomePage> {
      /// 展示当前时间字符串
      String currentTimeStr;
      @override
      void initState() {
        super.initState();
        this.currentTimeStr = getCurrentTime();
      }
      /// 获取当前时间戳
      ///
      /// 返回一个字符串类型的前缀信息：时间戳
      String getCurrentTime() {
        DateTime now = DateTime.now();
        var formatter = DateFormat('yy-MM-dd hh:mm:ss');
        return formatter.format(now);
      }
      /// 有状态类返回组件信息
      @override
      Widget build(BuildContext context) {
      }
    }
    

#### 步骤四：定时 Timer 实现 state 定时更新

定义并实现一个定时刷新的函数 refreshTimeStr ，在定时函数中使用 Timer 定时使用 setState 来更新 state，并在 initState 中执行该函数 ，代码如下。

    import 'dart:async';
    import 'package:flutter/material.dart';
    import 'package:intl/intl.dart'; // 需要在pubspec.yaml增加该模块
    /// APP 首页入口
    ///
    /// 本模块函数，加载状态类组件HomePageState
    /// [prefix]是显示在时间之前的一个字符串
    class HomePage extends StatefulWidget {
      @override
      createState() => HomePageState();
    }
    /// 首页有状态组件类
    ///
    /// 主要是获取当前时间，并动态展示当前时间
    class HomePageState extends State<HomePage> {
      /// 展示当前时间字符串
      String currentTimeStr;
      @override
      void initState() {
        super.initState();
        this.currentTimeStr = getCurrentTime();
        refreshTimeStr();
      }
      /// 更新当前时间字符串 [currentTimeStr]
      ///
      /// 每 500ms 更新一次，使用 Timer
      void refreshTimeStr() {
        const period = Duration(milliseconds: 500);
        // 定时更新当前时间的 currentTimeStr 字符串
        Timer.periodic(period, (timer) {
          setState(() {
            this.currentTimeStr = getCurrentTime();
          });
        });
      }
      /// 获取当前时间戳
      ///
      /// 返回一个字符串类型的前缀信息：时间戳
      String getCurrentTime() {
        DateTime now = DateTime.now();
        var formatter = DateFormat('yy-MM-dd hh:mm:ss');
        return formatter.format(now);
      }
      /// 有状态类返回组件信息
      @override
      Widget build(BuildContext context) {
      }
    }
    

#### 步骤五：build 中显示组件内容

build 中展示当前时间的 state 值，以及一个前缀信息。由于前缀是一个无状态变量，因此我们尽量将该变量放在 StatefulWidget 类中。这里在 build 中使用了一个新的布局组件 Column ，目前你暂时可以不关注这个组件，只需要了解其是布局组件即可，代码如下。

    import 'dart:async';
    import 'package:flutter/material.dart';
    import 'package:intl/intl.dart'; // 需要在 pubspec.yaml 增加该模块
    /// App 首页入口
    ///
    /// 本模块函数，加载状态类组件 HomePageState
    /// [prefix]是显示在时间之前的一个字符串
    class HomePage extends StatefulWidget {
      /// 当前时间显示的前缀信息
      final String prefix = '当前时间';
      @override
      createState() => HomePageState();
    }
    /// 首页有状态组件类
    ///
    /// 主要是获取当前时间，并动态展示当前时间
    class HomePageState extends State<HomePage> {
      /// 展示当前时间字符串
      String currentTimeStr;
      @override
      void initState() {
        super.initState();
        this.currentTimeStr = getCurrentTime();
        refreshTimeStr();
      }
      /// 更新当前时间字符串 [currentTimeStr]
      ///
      /// 每 500ms 更新一次，使用 Timer
      void refreshTimeStr() {
        const period = Duration(milliseconds: 500);
        // 定时更新当前时间的 currentTimeStr 字符串
        Timer.periodic(period, (timer) {
          setState(() {
            this.currentTimeStr = getCurrentTime();
          });
        });
      }
      /// 获取当前时间戳
      ///
      /// 返回一个字符串类型的前缀信息：时间戳
      String getCurrentTime() {
        DateTime now = DateTime.now();
        var formatter = DateFormat('yy-MM-dd hh:mm:ss');
        return formatter.format(now);
      }
      /// 有状态类返回组件信息
      @override
      Widget build(BuildContext context) {
        return Column(
          children: <Widget>[Text(widget.prefix), Text(this.currentTimeStr)],
        );
      }
    }
    

#### 步骤六：main.dart 中加载 HomPage 组件

最后我们需要在 main.dart 中应用该组件，代码如下。

    import 'package:flutter/material.dart';
    import 'package:two_you_friend/pages/home_page.dart';
    /// App 核心入口文件
    void main() => runApp(MyApp());
    /// MyApp 核心入口界面
    class MyApp extends StatelessWidget {
      // This widget is the root of your application.
      @override
      Widget build(BuildContext context) {
        return MaterialApp(
            title: 'Two You', // APP 名字
            theme: ThemeData(
              primarySwatch: Colors.blue, // APP 主题
            ),
            home: Scaffold(
                appBar: AppBar(
                  title: Text('Two You'), // 页面名字
                ),
                body: Column(
                  children: <Widget>[
                    HomePage(),
                  ],
                )
            ));
      }
    }
    

#### 步骤七：代码美化和规范检查，并运行程序

现在我们将代码实现完成了，需要使用我们 04 课时的知识来进行美化代码和检查代码是否规范，我们可以将美化和代码规范检查的两个命令写出一个 shell 脚本，每次只需要运行这个 shell 脚本（ format\_check.sh ）检查即可，代码如下。

    # 代码美化
    dartfmt -w --fix lib/
    # 代码规范检查
    dartanalyzer lib
    

接下来，每次运行前执行该脚本检查。

    sh format_check.sh
    

检查后，如果有问题则修复，没有问题，再选择手机模拟器运行该项目，既可以看到如下图 2 动态效果了。

![20200610_140500-2.gif](https://s0.lgstatic.com/i/image/M00/26/D4/CgqCHl7zAWyAf3hFAAt1uKBbpwY045.gif)  
图 2 增加动态时间显示

### 总结

本课时主要介绍了组件中的有状态组件和无状态组件，关于有状态组件则介绍了其各个生命周期函数的执行场景以及实际触发的应用场景。最后再通过有状态组件优化我们之前的时间展示的小功能。学完本课时后，你需要掌握如何实现有状态组件，并了解有状态组件中各个生命周期函数被触发的时机。

以上就是本课时的主要内容，下一课时介绍有状态组件和无状态组件应用场景，以及如何区分使用有状态组件和无状态组件。

[点击此链接查看本课时源码](https://github.com/love-flutter/flutter-column)