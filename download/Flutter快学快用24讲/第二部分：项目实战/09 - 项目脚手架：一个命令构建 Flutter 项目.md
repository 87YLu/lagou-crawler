在基础功能部分，我已经讲解了从基础到规范的应用，接下来我们进入项目实战部分。本课时将介绍项目基础框架，并且应用脚手架功能实现轻松的初始化项目。

### 项目基础框架

先看项目基础框架，我们将项目基础框架分为三个部分：核心代码部分、基础工具以及单元测试。

#### 核心代码

核心代码主要是在 lib 目录下，我们将 lib 下的各个功能进行了整理，可以用图 1 来表示各个模块之间的关系。

![image.png](https://s0.lgstatic.com/i/image/M00/2E/C3/Ciqc1F8Flb-AGmmvAADAcKsYMc8004.png)  
图 1 lib 核心目录结构

*   入口文件，main.dart 核心入口文件；
    
*   pages 作为具体的页面结构，可以通过 main.dart 直接加载，大部分还是通过 router.dart 进行跳转，pages 可以按照业务功能划分文件夹；
    
*   pages 下是各个组件组建而成，组件部分可以按照通用、基础和业务来划分；
    
*   组件中包含了样式、交互和数据三个部分，因此分别需要 styles 和 model 文件夹；
    
*   model 大部分数据来自服务端，因此需要一个 api 文件夹来与服务端交互；
    
*   类型校验部分贯穿整个项目，在 pages 、widgets 、 model 和 api 中都可能会被应用到。
    

按照上面的划分，唯一需要注意的是，各个目录下的二级目录需要根据你们自身的业务功能去设计。因为业务模块不一定是一个页面，在项目初期就应该按照业务模块规划好目录结构，后期维护成本会降低很多，同时提升可扩展性。

例如 pages 需要三个页面，一个是首页内容，一个是用户个人信息页面，另外一个则是用户信息修改页面，那么我们可以按照表格 1 这样命名文件以及类。

![image (1).png](https://s0.lgstatic.com/i/image/M00/2E/C3/Ciqc1F8FldOAPQ-gAABVfTIEj5I407.png)  
表格 1 pages 业务划分目录结构

widgets 下则与 pages 目录结构保持一致即可，model 、api 以及 struct 则需要根据的服务端协议的业务功能来定义目录结构。使用上面的目录方式，我们创建出了如图 2 所示的一个结构，提供大家参考。

![image2.png](https://s0.lgstatic.com/i/image/M00/2E/CF/CgqCHl8FleuAcV39AABWvTrY5U8584.png)  
图 2 项目目录结构示例

#### 基础工具

按照我们前面课时所设计的一些基础规范，这里需要两个基础的工具 dartfmt 和 dartanalyzer。将这两个工具整合在一起，一个为 shell 脚本和一个为 bat 脚本，整合后的文件叫作 format\_check.sh 和 format\_check.bat，里面包含以下代码。

format\_check.sh，该脚本主要适用于 Mac 系统和 Linux 系统。

    #!/bin/bash
    # 代码美化
    dartfmt -w --fix lib/
    # 代码规范检查
    dartanalyzer lib
    # 单元测试通过
    flutter test
    

format\_check.bat，该脚本主要适用于 Windows 系统。

    dartfmt -w --fix lib/
    dartanalyzer lib
    flutter test
    

在项目开发阶段只需要通过该命令来运行，就可以确保我们的一些基础规范是满足的，其他逻辑部分还是需要各个团队自身的 Code Review。

#### 单元测试

为了保证代码的健壮性，还需要生成对应的单元测试目录。针对上面的 lib 结构，我们生成对应的目录结构即可，唯一需要去掉的就是 styles 目录，例如，初始化的时候，我们对应生成下图 3 的目录层级结构。

![image (2).png](https://s0.lgstatic.com/i/image/M00/2E/C3/Ciqc1F8Flg2AZvgFAABbTxGj0PU912.png)  
图 3 单元测试目录结构

以上部分就是整个项目框架的基础结构，接下来我们将这个基础的项目结构做成一个框架模版，使用脚手架的方式统一来创建和运行。

### 脚手架应用

为了能够更好地体验，我们可以封装好这些一样的功能，开发出一个脚手架方式。前端同学会比较熟悉，将大部分初始化或者脚本化的功能统一封装成一个脚手架，通过脚手架执行项目的初始化。

#### 环境要求

这里需要使用到 Node.js 和 npm 环境，如果是前端开发，应该已具备。如果是非前端开发或者未安装相应 Node.js 和 npm 环境的可以前往[官网下载安装](https://nodejs.org/en/download/)最新的版本即可。

#### flutter-pro-cli

flutter-pro-cli，该工具可以轻松帮你完成项目框架结构的初始化，在安装完成上面的运行环境后，在命令运行窗口，运行下面的命令。

    npm install -g flutter-pro-cli
    

安装完成后，运行如下命令查看具体包含的功能。

    flutter-pro-cli -h
    

可以看到如下的窗口提示信息。

    Usage: flutter-pro-cli [options] [command]
    Options:
      -h, --help      display help for command
    Commands:
      init|i          Generates new flutter project
      check|c         Check the project lib format
      run|r [check]   Check the project lib format and run
      sync-test|st    Generates new test path base on lib path
      help [command]  display help for command
    

*   **init**，该操作会初始化好目录结构，包含 lib 和 test 目录下，其次会生成一个比较简单的 main.dart 和 router.dart 文件，并将我们需要的 check\_format.sh 、 check\_format.bat 以及 analysis\_options.yaml 这三个文件放在项目根目录下。
    
*   **check**，该操作执行 check\_format.sh 或者 check\_format.bat 文件来美化代码结构，并检查当前项目的代码是否符合我们规范。
    
*   **run**，启动运行项目，可以带 check 参数执行 check\_format.sh 先校验是否符合规范，符合则启动，否则不启动项目。这里的 run 要注意，需要优先打开手机模拟器，不然无法启动。
    
*   **sync-test**，同步测试代码结构，为了减少大家写单元测试的时间，脚手架提供了方法，可以读取你项目代码文件，并且添加了一个最基础的测试，其他部分则需要自己补充。
    

我在实际项目开发过程中发现写测试用例确实挺麻烦，为了节省时间，可以针对性生成一些基础的测试代码用例，例如上面的 sync-test 会为我们创建好相应的目录结构，以及相应的测试代码文件。

#### 脚手架实现

脚手架使用的是 Node.js 来实现的，大家可以参考 [gtihub 源码](https://github.com/love-flutter/flutter-pro-cli)，并在这基础上进行协同开发。由于使用的是 Node.js 来实现，这里就不过多介绍其实现原理，如果大家有兴趣可以进一步在 github 进行交流，希望共同完善这个脚手架。

### 实战初始化

现在我们使用以上脚手架来初始化一个 Flutter 项目。首先第一步是创建项目 two you friend ，需要在 Android Studio 中创建好 Flutter 项目，项目创建完成后，在项目根目录打开命令行窗口，执行以下命令进行初始化。

    flutter-pro-cli init
    

执行完该初始化成功后，打开手机模拟器运行下面的命令检查代码规范，并且启动项目。

    flutter-pro-cli run check
    

为了尝试自动化生成测试代码，我们可以在项目中的 lib/pages/home\_page/ 目录下创建一个 index.dart 。然后再运行下面的命令。

    flutter-pro-cli st
    

运行完后，在相应的 test/pages/home\_page 目录下你将看到 index\_test.dart 文件，里面将包含下面的测试代码。

    import 'package:flutter/material.dart';
    import 'package:flutter_test/flutter_test.dart';
    import 'package:two_you_friend/pages/home_page/index.dart';
    // @todo
    void main() {
      testWidgets('test two_you_friend/pages/home_page/index.dart', (WidgetTester tester) async {
         final Widget testWidgets = HomePageIndex();
          await tester.pumpWidget(
              new MaterialApp(
                  home: testWidgets
              )
          );
          expect(find.byWidget(testWidgets), findsOneWidget);
      });
    }
    

以上就完成了一个项目的初始化，比较简单的三个步骤。后期开发过程中可以使用 run 和 st 命令来提升研发效率。

### 总结

以上就是本课时的主要内容，本课时通过工具化的方式来初始化项目，学完本课时你需要掌握 Flutter 项目基础结构，需要了解 flutter-pro-cli 的一个简单应用，最后希望你使用本课时的工具（或者手动的方式）创建一个 two you friend 项目，后面的课时我会逐步在该项目基础上完善功能。