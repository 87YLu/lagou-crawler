在实践编程之前，我们先来掌握代码规范，毕竟优秀的编程代码从规范开始。

### 命名规范

命名规范中包括了文件以及文件夹的命名规范，常量和变量的命名规范，类的命令规范。Dart 中只包含这三种命名标识。

*   AaBb 类规范，首字母大写驼峰命名法，例如 IsClassName，常用于类的命名。
    
*   aaBb 类规范，首字母小写驼峰命名法，例如 isParameterName，常用于常量以及变量命名。
    
*   aa\_bb 类规范，小写字母下划线连接法，例如 is\_a\_flutter\_file\_name，常用于文件及文件夹命名。
    

### 注释规范

注释的目的是生成我们需要的文档，从而增强项目的可维护性。

#### 单行注释

单行注释主要是“ // ”这类标示的注释方法，这类注释与其他各类语言使用的规范一致。单行注释主要对于单行代码逻辑进行解释，为了避免过多注释，主要是在一些理解较为复杂的代码逻辑上进行注释。

比如，下面这段代码没有注释，虽然你看上下文也会知道这里表示的是二元一次方程的 ∆ ，但是却不知道如果 ∆ 大于 0 ，为什么 x 会等于 2。

    if ( b * b - 4 * a * c > 0 ) {
      x = 2;
    }
    

如果加上注释则显得逻辑清晰容易理解，修改后如下所示。

    // 当∆大于0则表示方程x个解，x则为2
    if ( b * b - 4 * a * c > 0 ) {
      x = 2;
    }
    

虽然单行注释大家都比较了解，但我这里还是多解释了下如何应用，主要是希望大家规范化使用，减少不必要的代码注释。

#### 多行注释

在 Dart 中由于历史原因（前后对多行注释方式进行了修改）有两种注释方式，一种是 /// ，另外一种则是 / \*\*......\* / 或者 /\*......\*/ ，这两种都可以使用。/\*\*......\*/ 和 /\*......\*/ 这种块级注释方式在其他语言（比如 JavaScript ）中是比较常用的，但是在 Dart 中我们更倾向于使用 /// ，后续我们所有的代码都按照这个规范来注释。

多行注释涉及类的注释和函数的注释。两者在注释方法上一致。首先是用一句话来解释该类或者函数的作用，其次使用空行将注释和详细注释进行分离，在空行后进行详细的说明。如果是类，在详细注释中，补充该类作用，其次应该介绍返回出去的对象功能，或者该类的核心方法。如果是函数，则在详细注释中，补充函数中的参数以及返回的数据对象。

假设有一个 App 首页的库文件，其中包含类 HomePage ， HomePage 中包含两个方法，一个是 getCurrentTime ，另一个是 build 方法，代码注释如下（未实现其他部分代码）。

    import 'package:flutter/material.dart';
    /// APP 首页入口
    /// 
    /// 本模块函数，加载状态类组件HomePageState
    class HomePage extends StatefulWidget {
      @override
      createState() => new HomePageState();
    }
    /// 首页有状态组件类
    ///
    /// 主要是获取当前时间，并动态展示当前时间
    class HomePageState extends State<HomePage> {
      /// 获取当前时间戳
      ///
      /// [prefix]需要传入一个前缀信息
      /// 返回一个字符串类型的前缀信息：时间戳
      String getCurrentTime(String prefix) {
      }
      /// 有状态类返回组件信息
      @override
      Widget build(BuildContext context) {
      }
    }
    

#### 注释文档生成

根据上面的代码注释内容，我们利用一个官方工具来将当前项目中的注释转化为文档。该工具的执行命令在 Dart 执行命令的同一个目录下，如果你在课时 03 中已经添加了 dart 命令行工具，那么该工具就可以直接使用了，如果没有则需要按照 03 课时中的方法，重新配置 dart 的运行命令的环境变量，这里主要演示下通过规范化的代码注释生成的文档。

打开命令行工具进入当前项目，或者在 Android Studio 点击界面上的 Terminal 打开命令行窗口，运行如下命令。

    dartdoc
    

运行结束后，会在当前项目目录生成一个 doc 的文件夹。在生成文件夹中，可以直接打开 doc/api/index.html 文件，你就会看到如图 1 所示的文档界面。

![image (7).png](https://s0.lgstatic.com/i/image/M00/22/66/Ciqc1F7sNjeAE5ykAAFKDSwqzfU381.png)  
图 1 生成文档的整体界面结构

接下来我们打开 HomePageState 类，可以看到如图 2 中的效果。

![image (8).png](https://s0.lgstatic.com/i/image/M00/22/72/CgqCHl7sNkGAMQRQAADbY3c-XN8695.png)  
图 2 HomePageState 的注释文档

其次再打开函数 getCurrentTime 可以看到图 3 的效果。从效果看，我们的文档已经生成了，而且效果很好。

![image (9).png](https://s0.lgstatic.com/i/image/M00/22/72/CgqCHl7sNkiAYZqRAAGMc2znMSs481.png)  
图 3 getCurrentTime 的注释文档

以上是使用标准的代码注释生成的文档，利用这种方式将大大提升项目的可维护性，希望大家在项目初期就要做好此类规范。

### 库引入规范

Dart 为了保持代码的整洁，规范了 import 库的顺序。将 import 库分为了几个部分，每个部分使用空行分割。分为 dart 库、package 库和其他的未带协议头（例如下面中的 util.dart ）的库。其次相同部分按照模块的首字母的顺序来排列，例如下面的代码示例：

    import 'dart:developer';
    import 'package:flutter/material.dart';
    import 'package:two_you_friend/pages/home_page.dart';
    import 'util.dart';
    

### 代码美化

在 Dart 中同样有和前端一样的工具 pritter ，在 Dart 中叫作 dartfmt ，该工具和 dartdoc 一样，已经包含在 Dart SDK 中，因此可以直接运行如下命令检查是否生效。

    dartfmt -h
    

既然有此类工具，我们就来看下如何应用工具来规范和美化我们的代码结构。

#### dartfmt

dartfmt 工具的规范包括了以下几点：

*   使用空格而不是 tab；
    
*   在一个完整的代码逻辑后面使用空行区分；
    
*   二元或者三元运算符之间使用空格；
    
*   在关键词 , 和 ; 之后使用空格；
    
*   一元运算符后请勿使用空格；
    
*   在流控制关键词，例如 for 和 while 后，使用空格区分；
    
*   在 ( \[ { } \] ) 符号后请勿使用空格；
    
*   在 { 后前使用空格；
    
*   使用 . 操作符，从第二个 . 符号后每次都使用新的一行。
    

其他规范可以参考 [dartfmt](https://github.com/dart-lang/dart_style/wiki/Formatting-Rules) 的官网。了解完以上规范后，我们现在将上面的 home\_page.dart 进行修改，将部分代码修改为不按照上面规范的结构，代码修改如下：

    import 'package:flutter/material.dart';
    /// APP 首页入口
    ///
    /// 本模块函数，加载状态类组件HomePageState
    class HomePage extends StatefulWidget{
      @override
      createState() => new HomePageState();
    }
    /// 首页有状态组件类
    ///
    /// 主要是获取当前时间，并动态展示当前时间
    class HomePageState extends State<HomePage> {
      /// 获取当前时间戳
      ///
      /// [prefix]需要传入一个前缀信息
      /// 返回一个字符串类型的前缀信息：时间戳
      String getCurrentTime( String prefix ) {
      }
      /// 有状态类返回组件信息
      @override
      Widget build(BuildContext context) {
      }
    }
    

上面 getCurrentTime 的参数和 { 没有按照 dartfmt 规范来处理，在当前目录下打开 Terminal，然后先运行以下命令来修复当前的代码规范：

     dartfmt -w --fix lib/
    

运行成功后，你将看到当前 home\_page.dart 修改为如下代码：

    import 'package:flutter/material.dart';
    /// APP 首页入口
    ///
    /// 本模块函数，加载状态类组件HomePageState
    class HomePage extends StatefulWidget {
      @override
      createState() => HomePageState();
    }
    /// 首页有状态组件类
    ///
    /// 主要是获取当前时间，并动态展示当前时间
    class HomePageState extends State<HomePage> {
      /// 获取当前时间戳
      ///
      /// [prefix]需要传入一个前缀信息
      /// 返回一个字符串类型的前缀信息：时间戳
      String getCurrentTime(String prefix) {}
      /// 有状态类返回组件信息
      @override
      Widget build(BuildContext context) {}
    }
    

可以看到两处不符合规范的被修复了，{ 前无空格问题，和 getCurrentTime 参数空格问题。

### 工具化

上面介绍了这些规范，在 Dart 中同样存在和 eslint 一样的工具 dartanalyzer 来保证代码质量。

该工具（ dartanalyzer ）已经集成在 Dart SDK ，你只需要在 Dart 项目根目录下新增analysis\_options.yaml 文件，然后在文件中按照规范填写你需要执行的规则检查即可，目前现有的检查规则可以参考 [Dart linter rules](https://dart-lang.github.io/linter/lints/) 规范。

为了方便，我们可以使用现成已经配置好的规范模版，这里有两个库 [pedantic](https://s0pub0dev.icopy.site/packages/pedantic) 和 [effective\_dart](https://s0dart0dev.icopy.site/guides/language/effective-dart) 可以参照使用。如果我们需要在项目中，使用它们两者之一，可以在项目配置文件（ pubspec.yaml ）中新增如下两行配置：

    dependencies:
      flutter:
        sdk: flutter
      pedantic: ^1.8.0
      # The following adds the Cupertino Icons font to your application.
      # Use with the CupertinoIcons class for iOS style icons.
      cupertino_icons: ^0.1.2
    dev_dependencies:
      flutter_test:
        sdk: flutter
      pedantic: ^1.8.0
    

配置完成以后，在当前项目路径下运行 flutter pub upgrade 。接下来在本地新增的 analysis\_options.yaml 文件中新增如下配置：

    include: package:pedantic/analysis_options.1.8.0.yaml
    

如果我们认为 pedantic 不满足我们的要求，我们再根据 [Dart linter rules](https://dart-lang.github.io/linter/lints/) 规范，前往选择自己需要的规范配置，修改下面的配置：

    include: package:pedantic/analysis_options.1.8.0.yaml
    analyzer:
      strong-mode:
        implicit-casts: false
    linter:
      rules:
        # STYLE
        - camel_case_types
        - camel_case_extensions
        - file_names
        - non_constant_identifier_names
        - constant_identifier_names # prefer
        - directives_ordering
        - lines_longer_than_80_chars # avoid
        # DOCUMENTATION
        - package_api_docs # prefer
        - public_member_api_docs # prefer
    

我在 pedantic 的基础上又增加了一些对于样式和文档的规范，增加完成以上配置后，运行如下命令可进行检查。

    dartanalyzer lib
    

运行完成以后，你可以看到一些提示、警告或者报错信息，具体提示如图 4 的问题：

![image (10).png](https://s0.lgstatic.com/i/image/M00/22/72/CgqCHl7sNqmAMpqEAAESy_g_9Ag796.png)  
图 4 dartanalyzer 规则检查运行结果

图 4 中的一些问题已经非常详细，包括以下几点：

*   没有为 main 类中的 public 方法增加文档说明；
    
*   在 main 类中 import 了developer 库，但是未使用；
    
*   在 main 类中 import 了 home\_page.dart 库，但是未使用；
    
*   在 home\_page.dart 中的 getCurrentTime 使用了 String 返回类型，但是未返回相应类型；
    
*   在 home\_page.dart 中的 build 方法 使用了 Widaget 返回类型，但是未返回相应类型。
    

这些问题非常清晰地说明了我们目前代码存在的问题，有了以上工具化的校验检查，我们在做团队代码规范的时候，就非常简单。

### 综合实践

学完本课时，我们按照以上的标准来实践一下。在上一课时中，我已经教大家怎么去实现一个比较简单的 Hello Flutter ，现在我希望实现一个显示当前时间的功能 APP 。

以下是我的开发步骤，这里就涉及了上面所有的命名规范：

1.  在 lib 下创建一个 pages 目录;
    
2.  在 pages 下创建一个类为 home\_page.dart 文件;
    
3.  在 home\_page.dart 文件中创建两个类，一个是 HomePage，另一个是 HomePageState；
    
4.  在 HomePageState 类创建两个方法，一个是带返回 String 类型的 getCurrentTime 方法，另一个是带返回 Widget 类型的 build 方法（类似于 React 中的 render 方法）；
    
5.  实现两个方法，具体可以查看以下代码；
    
6.  在 main 函数中引入 home\_page.dart 模块，并调用 HomePage 类。
    

具体 main.dart 和 home\_page.dart 代码分别如下：

*   main.dart
    

    import 'package:flutter/material.dart';
    import 'package:two_you_friend/pages/home_page.dart';
    /// APP 核心入口文件
    void main() => runApp(MyApp());
    /// MyApp 核心入口界面
    class MyApp extends StatelessWidget {
      // This widget is the root of your application.
      @override
      Widget build(BuildContext context) {
        return MaterialApp(
            title: 'Two You',
            theme: ThemeData(
              primarySwatch: Colors.blue,
            ),
            home: Scaffold(
                appBar: AppBar(
                  title: Text('Two You'),
                ),
                body: Center(
                  child: HomePage(),
                )));
      }
    }
    

*   home\_page.dart
    

    import 'package:flutter/material.dart';
    import 'package:intl/intl.dart'; // 需要在pubspec.yaml增加该模块
    
    /// APP 首页入口
    ///
    /// 本模块函数，加载状态类组件HomePageState
    class HomePage extends StatefulWidget {
      @override
      createState() => HomePageState();
    }
    /// 首页有状态组件类
    ///
    /// 主要是获取当前时间，并动态展示当前时间
    class HomePageState extends State<HomePage> {
      /// 获取当前时间戳
      ///
      /// [prefix]需要传入一个前缀信息
      /// 返回一个字符串类型的前缀信息：时间戳
      String getCurrentTime(String prefix) {
        DateTime now = DateTime.now();
        var formatter = DateFormat('yy-mm-dd H:m:s');
        String nowTime = formatter.format(now);
        return '$prefix $nowTime';
      }
      /// 有状态类返回组件信息
      @override
      Widget build(BuildContext context) {
        return Text(
          getCurrentTime('当前时间')
        );
      }
    }
    

然后我们再运行 dartfmt 来美化代码结构，其次运行 dartanalyzer 工具来校验是否按照规范进行开发。上面代码已经是标准规范，因此你不会发现任何问题，如果你自己开发过程中有问题，则按照提示进行修改即可。如果规范检查完成以后，都没有任何问题后，我们再运行当前程序，结果如图 5 所示的效果。

![image (11).png](https://s0.lgstatic.com/i/image/M00/22/67/Ciqc1F7sNr-AAZloAAFNQgKibbk184.png)  
图 5 home\_page 页面效果

### 总结

本课时主要介绍了命名规范、注释规范以及文档生成、库引入规范、代码美化，最后利用 dartanalyzer 来进行工具化校验保证项目代码质量。学完本课时以后，你需要掌握这些基础规范，其次特别需要掌握 dartfmt 和 dartanalyzer 工具的使用。

为了上面演示效果更佳，我们可以将时间变成自动更新的方式，这里就会涉及 05 课时的生命周期内容。具体实现效果以及原理，我会在接下来的 05 课时生命周期以及 06 课时有/无状态组件中详细说明。

[点击此链接查看本课时源码](https://github.com/love-flutter/flutter-column)