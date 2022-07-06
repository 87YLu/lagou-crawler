本课时将进入 Flutter 开发实践应用。在进入实践应用之前，我先讲解最基础的环境搭建，然后会应用 Dart 语言开发第一个 App — Hello Flutter，最后再讲解一些开发过程中常用的调试方法和工具。

本课时需要一定的实践动手能力，因此在学习的时候建议你打开电脑按照里面的步骤进行学习。

### 第一步：环境搭建

环境构建方法在官网已提供了非常详细的指引，你可以参考官网指引[《起步:安装 Flutter》](https://flutterchina.club/get-started/install/)。这里我先介绍一些共性的问题，然后再分别从 Mac 系统 和 Windows 系统介绍其中比较有代表性的问题。

#### 常见问题

以下是大家很容易忽视的几个问题。

*   **环境要求**，你需要注意 Flutter 的环境要求，很多人都会忽视这一点，导致在安装过程中遇到问题才会回头看环境要求，所以无论自己对配置如何了解，都需要按照官网的指引去检查每个配置项。
    
*   **Flutter 下载**，请尽量下载当前稳定版本，避免因为不稳定版本导致的其他环境要求，导致安装不成功。
    
*   **Android Studio 工具安装**，Flutter 的配置运行需要依赖 Android Studio 来完成，因此在安装之前可以先准备好 Android Studio 的安装配置，并且需要了解其中关于 Flutter 插件和 Dart 插件的安装，这些在 [Flutter 官网](https://flutterchina.club/get-started/install/)有详细的解释说明。
    
*   **Anroid Studio 出现 unable to access android sdk add-on list**，出现这个问题，可以修改 Android Studio 安装目录 bin 下的 idea.properties 文件，在文件最后一行增加如下配置。
    

    disable.android.first.run = true
    

*   **Android Studio 网络代理**，如果你的网络有代理，也需要进行配置，如果没有正确配置，将导致 Andorid Studio 提示 flutter pub upgrade 无法正常更新。
    
*   **Flutter ****D****octor 核心点检查**，需要认真检查其中的每一项，对于其中的问题项，Doctor 一般会提供具体的解决方案。
    
*   **点击 Finish 长久未响应**（或者执行 flutter pub upgrade 未响应），这种情况会出现“This is taking an unexpectedly long time”提示，如果出现这个提示，很大可能是你的镜像配置没有按要求配置。你可以参考以下这段配置，第一个是 Flutter 的命令行工具，第二个则是 Dart 的命令行工具，后面两个镜像配置很关键。
    

    PATH=$PATH:/Users/用户名/Downloads/flutter-main/bin
    PATH=$PATH:/Users/用户名/Downloads/flutter-main/bin/cache/dart-sdk/bin
    PUB_HOSTED_URL=https://pub.flutter-io.cn
    FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn
    

*   **Flutter SDK path not given**，如果在创建 Flutter 项目时候提示“ Flutter SDK path not given“，则点击 Flutter SDK path 路径，然后选择我们前面安装的 Flutter SDK 路径即可。
    

#### Mac 系统上注意的点

Mac 上的安装，我这里主要说明 Xcode 和 Mac 下的环境变量配置。

*   Xcode 要升级到指定版本以上，由于 Flutter 需要应用 iOS 模拟器，因此对 Xcode 版本有一定要求。
    
*   Mac 下设置环境变量，其中涉及一些环境变量的配置，虽然网上有很多方法，官网也有提供，但我推荐大家使用如下方法，永久设置。
    

    sudo vim ~/.bash_profile
    

配置添加 Flutter 的安装路径，一般情况下会安装在你解压后运行的路径下。例如，下面我自己安装后的路径，安装完成后确定具体路径，然后在 bash\_profile 文件中增加这行配置即可。

    PATH=$PATH:/Users/用户名/Downloads/flutter-main/bin
    

最后再运行加载，并运行测试。

    source ~/.bash_profile
    flutter -h
    

#### Windows 系统上注意的点

Widows 系统安装需注意以下几点。

*   环境变量的设置，如果在 cmd 下没有 export 命令，前往系统属性下 -> 环境变量，然后新建，按照变量名为 PUB\_HOSTED\_URL ，变量值为 [https://pub.flutter-io.cn](https://pub.flutter-io.cn) ，以及变量名为 FLUTTER\_STORAGE\_BASE\_URL ，变量值为 [https://storage.flutter-io.cn](https://storage.flutter-io.cn) 进行配置，对应到官方文档如下配置。
    

    export PUB_HOSTED_URL=https://pub.flutter-io.cn
    export FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn
    

*   配置 Flutter 运行环境，下载完成 Flutter SDK ，并放到指定的 C:\\src\\ 下，然后再次配置环境变量，需要在环境变量名为 PATH 的字段后面增加分号分割，并在分号后增加如下路径。
    

    C:\src\flutter\bin
    

*   如果出现安装 Android SDK 时无法勾选 SDK ，需要重新卸载安装。这里需注意，在卸载时需勾选删除当前用户本地 Android Studio 配置，然后重新安装时，选择非 Program Files 目录。
    

### 第二步：创建项目运行

上面的配置安装完成后，我们就开始创建 Flutter 项目，这里我介绍的是 Android Studio IDE 的过程。

1.  选择新建一个 Start a new Flutter Project ，然后选择 Flutter Application ，如图 1。
    

![image](https://s0.lgstatic.com/i/image/M00/21/12/Ciqc1F7pvnuANcQpAACTMSsFoo0714.png)  
图 1 New Flutter Project

2.  然后依次填写相应的 Project name 、Flutter SDK Path（如果配置好了会默认填写上，如果没有可以去重新选择）、Project location （具体的项目保存地址）、Descrition ，填写完成后，点击下一步，然后点击 finish 即可。
    
3.  如果卡在 finish 这个环节，请强制退出，然后再重新打开，检查配置。具体解决办法可参考共性问题中的“点击 finish 长久未响应”问题。
    
4.  创建完成后，会看到如图 2 的项目目录结构。
    

![image](https://s0.lgstatic.com/i/image/M00/21/12/Ciqc1F7pvouAKi3mAAC2vjxyHVc774.png)  
图 2 Flutter 项目目录结构

5.  成功创建后，我们选择一个模拟器，然后在运行入口文件选择 main.dart ，最后点击右侧启动按钮进行编译运行。**如果下拉没有模拟器，Android Studio 会提供指引前往配置**。
    

![image](https://s0.lgstatic.com/i/image/M00/21/1D/CgqCHl7pvrmAKD3eAAAhuRZycV0676.png)  
图 3 运行启动说明

6.  运行成功后，将会打开 iPhone 11 模拟器，然后启动我们的应用，如图 3。
    

![image](https://s0.lgstatic.com/i/image/M00/21/12/Ciqc1F7pvsSAKTXCAAGu5cF8GWk440.png)  
图 4 iPhone 11 模拟器

以上就成功配置了 Flutter 运行环境和开发工具。

### 第三步：实现 Hello Flutter APP

在实现一些编程之前，我先详细介绍工程目录中每个目录的作用，其次介绍如何进行修改代码，实现界面显示 Hello Flutter，最后再介绍三个常见的调试方法。

#### 目录说明

上述图 2 中已有相关工程目录的截图，我现在分别介绍下每个目录的作用。

![image](https://s0.lgstatic.com/i/image/M00/21/1E/CgqCHl7pvuqAfnGbAAC2vjxyHVc400.png)  
图 2 Flutter 项目目录结构

*   **.idea**
    

这个和 Flutter 无关，这里面主要是保留代码的修改历史。

*   **android**
    

这个目录主要是和 Android 原生平台交互的工程代码，其目录结构和原生的 Android 项目基本一致，但是一些配置和代码结构是不同的。

*   **ios**
    

这个目录主要也是和 iOS 原生平台交互的代码。

*   **lib**
    

这个目录下的文件为 Flutter 项目核心代码，其中包含了一个 main.dart 入口文件。

*   **test**
    

这个目录下的文件存放 Flutter 项目相关的测试文件。

*   **pubspec.yaml**
    

该文件为 Flutter 项目配置文件，包括了项目名、项目描述、版本、运行环境以及开发和正式环境的第三方库，该文件与我们熟悉的 package.json 作用是类似的。

*   **pubspec.lock**
    

这是自动生成的文件，里面指明了 pubspec.yaml 等依赖包和项目依赖库的具体版本号，该文件的功能和我们常见的 package.lock.json 作用类似。

*   **.metadata**
    

这是自动生成的文件，里面记录了项目的属性信息。用于切换分支、升级 SDK 使用。

*   **.packages**
    

这里面放置了项目依赖的库，对应在本机电脑上的绝对路径，为自动生成文件。如果项目出错或者无法找到某个库，可以把这个文件删除，重新自动配置即可。

.gitignore、README.md 与前端项目中的文件作用是一致的，这里就不详加说明。

**在开发过程中我们只需要关注三个核心部分，代码开发****放在**** lib 下，test 存放我们的测试文件，项目配置文件****放在**** pubspec.yaml ****下****。**

#### Hello Flutter

分析清楚文件目录后，在 lib 下修改 main.dart ，在该模块中打印 Hello Flutter 实现第一个 Flutter 应用开发。

1.  打开 main.dart ，将文件中 MaterialApp 下的 title 名字修改为 “Two You” ，将 home 下的 title 修改为 “Two You”，相关代码如下所示。
    

    class MyApp extends StatelessWidget {
      // This widget is the root of your application.
      @override
      Widget build(BuildContext context) {
        return MaterialApp(
          title: 'Two You', // app 的title信息 
            primarySwatch: Colors.blue, // 页面的主题颜色
          ),
          home: MyHomePage(title: 'Two You'), // 当前页面的 title 信息
        );
      }
    }
    

2.  将 main.dart 中 Scaffold 下的 body 下的 children 下的第一个 Text 内容修改为 “Hello Flutter”，并去掉下面一个 Text，如下图 5。
    

![image](https://s0.lgstatic.com/i/image/M00/21/1E/CgqCHl7pvyyAAoyEAAGmjIkimiw325.png)  
图 5 修改 main.dart 文件的代码指引

修改完成后，保存文件，然后按照本课时中的”第二步：创建项目运行“运行本程序即可（如果已经运行过，保存文件模拟器会热加载），你将看到如下的结果，如图 6 所示。

![image](https://s0.lgstatic.com/i/image/M00/21/1E/CgqCHl7pvzyAHXDxAAGn0n0MOsU471.png)  
图 6 Hello Flutter 运行结果

上面的代码是基于最开始的 main.dart 进行，如果觉得修改原文件比较麻烦，我们可以简化为如下的代码：

    import 'package:flutter/material.dart';
    void main() => runApp(MyApp());
    class MyApp extends StatelessWidget {
      // This widget is the root of your application.
      @override
      Widget build(BuildContext context) {
        return MaterialApp(
          title: 'Two You', // app 的title信息 
          theme: ThemeData(
            primarySwatch: Colors.blue, // 页面的主题颜色
          ),
          home: Scaffold(
              appBar: AppBar(
                title: Text('Two You'), // 当前页面的 title 信息
              ),
              body:  Center(
                child: Text('Hello Flutter'), // 当前页面的显示的文本信息
              )
          )
        );
      }
    }
    

#### 调试方法

代码运行调试在各种语言中都是比较基本的知识点，在 Flutter 中也应该掌握，这里我只介绍 Flutter 不同于其他语言的调试方法，包含以下几类：

*   **断点调试**
    

这个知识点和大家熟悉的 Chrome 的断点调试基本一致，核心是在断点处查看当前各个数据的状态情况，但是需要使用 debug 模式运行。

*   **debugger 调试**
    

在代码中增加一个断点语法，可以通过条件式的判断来进行断点，同样需要使用 debug 模式运行。

*   **界面调试**
    

为了能够掌握具体的布局问题，在 Web 端，我们可以通过 Chrome 工具进行分析。虽然在 Flutter 中是没有 Chrome 工具，但是 Flutter 提供了可视化的界面调试方法。

上面提到的三点，其实在 Flutter 中提供了一个非常不错的工具。如果你是在 Android Studio 中的话，你可以直接点击下图 7 的按钮，将为你下载相应的组件，然后打开图 8 的界面调试框。如果你使用的是非 Android Studio ，可以使用命令行的方式，参考[官网](https://flutter.cn/docs/development/tools/devtools/cli)方式，首先安装 devtools 工具。

    pub global activate devtools
    

安装完成后，运行以下命令启动运行。

    pub global run devtools
    

![image](https://s0.lgstatic.com/i/image/M00/21/12/Ciqc1F7pv1iADPaQAABwzl3Sgow148.png)  
图 7 Flutter 调试工具按钮指引

![image](https://s0.lgstatic.com/i/image/M00/21/12/Ciqc1F7pv2CAVgmvAAMQ0qCy2Nw964.png)  
图 8 Dart DevTools 工具

该套工具的详细介绍可以参考[开发者工具](https://flutter.cn/docs/development/tools/devtools)。

### 总结

本课时介绍了如何三步开启第一个应用程序 Hello Flutter，包括环境搭建、创建项目以及运行、修改示例代码。学完本课时，你需要掌握环境搭建的方法以及如何创建运行项目。

[点击此链接查看本课时源码](https://github.com/love-flutter/flutter-column)