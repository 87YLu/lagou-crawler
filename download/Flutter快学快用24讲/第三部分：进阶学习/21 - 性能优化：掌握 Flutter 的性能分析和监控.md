本课时主要带你学习 Flutter 中的性能分析工具 —— devTools 的使用，以及掌握 Flutter 性能分析思路和方法。其次也会介绍到在 Flutter 中如何上报性能相关的数据，从服务端数据出发分析 App 用户体验数据。

### devTools 的使用

devTools 是官方出的一套 Dart 和 Flutter 的性能调试工具，其核心是帮开发者定位 UI 或者 GPU 线程问题，从而协助开发者解决 Flutter App 的性能问题。在应用该工具之前，需要启动 App 调试功能。

打开我们的 Two You App，如果是在 Android Studio IDE 中，可以直接点击如下图所示的红色圈部分。

![Drawing 0.png](https://s0.lgstatic.com/i/image/M00/43/EA/Ciqc1F886IyANVraAABwZCwQP1s839.png)

打开 devTools 指引

如果不是在 Android Studio 中，需要按照下面的四个步骤启动 devTools 工具。

1.使用下面命令启动 devTools 工具。

    flutter pub global run devtools
    

2.运行成功后，会提示 devTools 访问的地址。打开访问地址后，可以看到如下图的界面，界面中需要输入一个 Flutter App 的监听地址。

![Drawing 1.png](https://s0.lgstatic.com/i/image/M00/43/F5/CgqCHl886JiAFj7bAABf4KvYysQ626.png)

devTools 主界面

3.接下来需要获取 Flutter 运行的 WS 地址，重新运行项目（请注意不是热启动，需要停止运行，然后点击重新运行），启动成功后，在运行栏可以看到如下图所示的信息。

![Drawing 2.png](https://s0.lgstatic.com/i/image/M00/43/EA/Ciqc1F886KuAF95mAACDP4U2o5I743.png)

调试提示

4.将其中的 listening on 的地址输入到刚才 devTools 页面就可以了，打开页面后，可以看到下图所示的功能。

![Drawing 3.png](https://s0.lgstatic.com/i/image/M00/43/F5/CgqCHl886LeAHz3YAAEP13-CfMA452.png)

devTools 功能

接下来我介绍下 devTools 功能，即上图中每个工具的作用。

*   **Flutter Inspector**，可以查看组件的布局信息，类似于前端的 Chrome 工具的 CSS 布局查看器，应用该功能可以快速定位布局问题。
    
*   **Timeline**，时间线事件图表，跟踪显示来自应用程序的所有事件。监听 Flutter App 在构建 UI 树，绘制界面以及其他（例如 HTTP 流量）事件等，并将监听到的事件所花费的时间，显示在时间轴上。
    
*   **Memory**，使用时间线的方式，展示 Flutter App 的内存变化，通过该工具可以定位内存泄漏的问题。
    
*   **Performance**，性能分析工具，可以通过录制界面操作，获取界面性能数据。该工具的主要用途还是在定位某个功能卡顿问题，例如我们发现主界面很卡顿，这时候就可以通过该工具录制首页加载过程，然后分析出具体性能异常逻辑。
    
*   **Debugger**，断点调试功能，和 IDE 上的断点调试是一样的。
    
*   **Network**，可以抓取网络请求，并分析返回数据，类似于前端 Chrome 的 Network 工具。
    
*   **Logging**，运行期间的日志显示。日志中包含：Dart 运行时的垃圾回收事件、Flutter 框架事件，比如创建帧的事件、应用的 stdout 和 stderr 和应用的自定义日志事件。
    

介绍完以上功能后，我们着重介绍 Timeline 工具，应用该工具来做性能分析和优化。

#### Timeline

Timeline 会记录每一帧的绘制，每一帧绘制又包括 UI 线程构建图形树和 GPU 线程绘制图像两个过程。在应用开发完成后，我们可以使用 Timeline 工具来走一遍 App 所有页面，记录每一帧的性能耗时。请注意该功能最好是在外接实体机上进行测试，不然会出现数据相差较大。我们分为以下七个步骤来进行实践。

1.连接实体调试机器，然后运行 flutter run --profile 启动 App。  
2.打开 devTools 工具，点击 Timeline 工具，点击 Clear 清空旧数据。  
3.可以在某个页面上进行一系列的基础操作，操作完成后，回到 devTools 中，点击 Refresh，这时候会有一个短暂的分析过程，分析完成后，你会看到下图所示的内容。

![Drawing 4.png](https://s0.lgstatic.com/i/image/M00/43/EA/Ciqc1F886MKAXHUJAADEduC9Pvw266.png)

Timeline 性能柱状图

4.在界面中，你会看到浅蓝（ UI 线程耗时，小于 16.67ms）、深蓝（ GPU 耗时，小于 16.67 ms）、橘黄（ UI 线程耗时，大于 16.67 ms）和深红（ GPU 耗时，大于 16.67 ms）的柱状数据，浅蓝和橘黄都代表 UI 线程耗时，深蓝和深红都代表 GPU 耗时，在 UI 线程耗时和 GPU 耗时都小于 16.67 ms 时显示浅蓝和深蓝，而当 UI 线程耗时或者 GPU 耗时任意一个大于 16.67 ms 时，则显示橘黄和深红。

5.当发现有橘黄和深红的柱状图时，则需要进行具体的分析，这时候只需要点击这部分柱状图，就可以看到下图所示的一个效果。

![Drawing 5.png](https://s0.lgstatic.com/i/image/M00/43/EA/Ciqc1F886NuAOv4lAAMBs3hz5KY064.png)

Timeline 单个数据分析图

6.如果 UI 线程耗时比较长，点击具体较长的柱状图，可以看到具体的火焰图。如下图所示，其中的宽度就代表执行的时间长度，宽度越长表明性能损耗越大，而这就是性能优化的部分。

![Drawing 6.png](https://s0.lgstatic.com/i/image/M00/43/EA/Ciqc1F886OOABOHtAAOrn9ZoZMo713.png)

UI 线程耗时分析

7.如果 GPU 耗时较长，则可以往下拉查看 GPU 页面绘制问题，如下图所示。

![Drawing 7.png](https://s0.lgstatic.com/i/image/M00/43/F5/CgqCHl886OqAdQZ0AAJb7VYSQsA920.png)

GPU 耗时分析

接下来我们就分别从 UI 线程问题和 GPU （ Raster ）来分析具体的性能问题。

#### UI 线程问题实践分析

如果出现橘黄色和深红色的柱状图时，我们需要单独分析这块的性能问题。大部分情况是因为在 Dart 中执行了比较耗时的函数，或者在组件树设计上没有注意性能导致的问题。这里介绍下可能会提升或者影响性能的几个关键点。

*   不会发生任何变化的组件，使用 const ，减少绘制，例如我们的通用 loading 组件。
    
*   减少组件绘制，这点就是我们之前提到的尽量减少有状态组件下的子组件，或者通过状态管理模块 Provider 来辅助管理状态。
    
*   复杂业务 build 函数在代码逻辑中，避免复杂业务在 build 逻辑中去执行。例如我们代码中的 user\_page/guest.dart 这个页面，这个页面逻辑是相当复杂的，首先需要使用 JSON 的方式获取参数，其次还需要进行接口拉取，这块是比较耗费性能的。
    

例如这里我们需要分析 guest.dart 页面的问题。首先我们连接真机调试，然后启动程序，可以看到如下图的界面，并选择 Track Widget Builds 统计（该工具会显示具体的组件名字，以方便我们查看问题）。

![Drawing 8.png](https://s0.lgstatic.com/i/image/M00/43/F5/CgqCHl886PKAA9UrAAFt4lddgwk448.png)

Timeline 调试主页

接下来在真机上，点击某个人的头像，进入用户页面，也就是访问我们的 user\_page/guest.dart 。访问完成后，点击 Timeline 工具中的 Refresh ，就可以看到如下图的界面。

![Drawing 9.png](https://s0.lgstatic.com/i/image/M00/43/F5/CgqCHl886PiAccZGAADxVxH-wTs542.png)

Refresh 性能检测结果

从上面，我们可以很明显地看到几条橘黄色的柱状图，我们随便选择一个去分析，点击后，可以在界面中看到下图的 UI 构建耗时分布的火焰图。

![Drawing 10.png](https://s0.lgstatic.com/i/image/M00/43/EA/Ciqc1F886QKAFvlNAAHmvu171ZY675.png)

UI 耗时火焰图

接下来我们就可以看到 build 逻辑调用的各个组件的耗时情况，也可以看到这其中构建了多少个组件，其次通过这张图也可以快速地定位到哪些组件没有更新。在上面图中，我们可以看到 BottomNavigationBar 相对其他组件来说，耗时就非常大。那我们就具体来看看，到底是什么原因导致的。

我们在 guest.dart 中并没有应用 BottomNavigationBar 组件，那么怎么会产生调用呢？接下来我们就使用 debug 功能，在 guest.dart 的 build 逻辑加上断点，然后使用 debug 模式运行。

这个问题最终发现是因为 Navigator.push 引发 Scaffold 的更新，而 Scaffold 是 BottomNavigationBar 和 AppBar 的父组件，从而又引发了这个组件的下的子组件发生 rebuild 行为。之前官方有修复一个 bug 就是在 Navigator.push 会引起前面的页面 rebuild 操作，但是这个问题好像没有发现并引起重视。关于这个问题我已经提交 [github issue](https://github.com/flutter/flutter/issues/63312) ，如果有进展或者你有解决方案，也帮忙在此评论下。

其他问题寻找方式也是类似的，只要按照上面的过程去分析。

#### GPU（ Raster ）

一般情况下都是较复杂的图片绘制产生的问题，比如说复杂的动效或者复杂的图片资源。上面的工具也不能完全帮你定位到异常的问题。需要根据实际的代码逻辑来分析，这点是比较困难的，只能排除法步步寻找问题点。Timeline 图只能协助我们去找到 GPU 存在性问题。

你在遇到 GPU 问题时，可以在 devTools 中的 Timeline 打开 Performance Overlay 工具，打开后在真机或者虚拟机上就可以看到效果，当出现 GPU 性能问题时，会出现红色线条。

![Drawing 11.png](https://s0.lgstatic.com/i/image/M00/43/F5/CgqCHl886Q6AUmANAAEEvCCE5Hg305.png)

Performance Overlay

以上就是 devTools 的工具使用，通过这个工具可以大大提升我们定位问题的效率。以上是在开发中或者上线前所需要做的一些前期性能分析准备，那么在上线后我们应该如何来分析性能呢？

### 性能上报

为了能够更好地分析和判断性能问题，我们有时候需要采集现网运行期间的一些性能数据，例如我们需要主要的两个指标：Crash 率和 FPS 数据。接下来我们主要介绍下如何计算和采集这两个数据的方法。

由于这部分肯定会影响主线程的性能，因此我们将该计算和上报过程放入到一个新的线程去处理，避免影响主线程。

#### Isolate 线程

这部分知识点，在之前的课时中已经有介绍到了，这部分代码在 lib/util/tools/isolate\_handle.dart 中。代码中唯一的不同点是需要进行双向的通信，该原理的实现思想是：在新线程回调函数中，向主线程发送一个回包，回包的内容就是自身接收信息句柄，然后主线程可以应用该句柄发送消息给到新线程。主线程代码如下：

    var receivePort = ReceivePort(); 
    if(isolate == null ) { 
      isolate = await Isolate.spawn(otherIsolate, receivePort.sendPort); 
    } 
    Map dataInfo = { 
      'fun' : callFun, 
      'routerFrames' : routerFrames, 
      'deviceInfo' : deviceInfo, 
      'routerName' : routerName 
    }; 
    if(sendPort != null){ // 如果已经连接成功，则直接使用 sendPort 发送消息 
      sendPort.send(dataInfo); 
    } 
    receivePort.listen((data) { 
      if (data is SendPort) { // 创建初始连接 
        sendPort = data; 
        return; 
      } 
      sendPort.send(dataInfo); 
    });
    

为了避免创建太多的线程，我们需要将线程连接保存起来，下次可以直接发送消息。再看下新线程的处理逻辑。

    /// 其他线程，处理计算和上报 
    static void otherIsolate(SendPort sendPort) async { 
      var receivePort = ReceivePort(); 
      receivePort.listen((data) { 
        if(data['fun'] == 'calculateFps') { 
          isolateCalculateFps( 
              data['routerFrames'] as ListQueue<FrameTiming>, 
              data['routerName'] as String, 
              data['deviceInfo'] as String 
          ); 
        } 
        if(data['fun'] == 'reportPv') { 
          isolateReportPv( 
              data['routerName'] as String, 
              data['deviceInfo'] as String 
          ); 
        } 
      }); 
      // 首先需要回句柄，创建通信连接 
      sendPort.send(receivePort.sendPort); 
      // 再发送回包，处理具体的信息 
      sendPort.send('success'); 
    }
    

代码的第 22 行首先回第一个包执行连接成功，然后再发送一个回包，用来告诉主线程已经连接成功。连接成功后就可以发送具体的消息实体，让新线程来处理了。以上就是双向通信的实现，[详细代码大家请参考 Github 源码](https://github.com/love-flutter/flutter-column)。接下来我们看下两个指标的实现逻辑。

#### Crash 率

异常率的计算方法是需要根据手机机型和手机版本来进行分析，我们先制定如下数据指标：

*   机型的 Crash 率 = 机型的 Crash 量 / 该机型页面访问量
    
*   版本的 Crash 率 = 版本的 Crash 量 / 该版本页面的访问量
    
*   版本机型的 Crash 率 = 机型版本的 Crash 量 / 该机型特定版本的访问量
    

根据上面的计算方式，我们需要增加一些数据上报，主要包括：机型、版本、页面名称、Crash 情况。之前我们已经介绍了 Sentry 平台上报异常的方法，这里只需要补充上页面的 PV 就可以了。

在上面的计算公式中，需要获取设备和版本信息，这部分可以使用通用类来实现，这里我们将代码临时也放在 IsolateHandle 类中，具体代码如下：

    /// 获取设备信息 
    static Future<String> getDeviceInfo() async{ 
      String deviceName = ''; 
      /// 获取设备插件句柄 
      DeviceInfoPlugin deviceInfo = DeviceInfoPlugin(); 
      if(Platform.isAndroid) { // 判断平台 
        AndroidDeviceInfo androidInfo = await deviceInfo.androidInfo; 
        deviceName = androidInfo.model; 
      } else if (Platform.isIOS) { // 判断平台 
        IosDeviceInfo iosInfo = await deviceInfo.iosInfo; 
        deviceName = iosInfo.utsname.machine; 
      } 
      // 获取当前客户端版本信息 
      PackageInfo packageInfo = await PackageInfo.fromPlatform(); 
      String version = packageInfo.version; 
      return '${deviceName}\t${version}'; 
    }
    

上面代码中应用到了两个第三方库，package\_info 获取版本相关信息，device\_info 获取设备相关信息。

    import 'package:package_info/package_info.dart'; 
    import 'package:device_info/device_info.dart';
    

获取到设备后，我们只需要在每次打开页面时进行数据上报就可以了，代码如下：

    /// 这里上报 pv 数据 
    static void isolateReportPv(String routerName, String deviceInfo) async { 
      print('${deviceInfo}\t${routerName}'); 
      /// @todo report to server 
    }
    

#### FPS

计算 FPS 的逻辑相对来说较复杂一些，首先需要使用 Flutter 的 SchedulerBinding.instance.addTimingsCallback 函数来获取每一帧耗时，这段代码主要是在 Flutter 绘制完成每一帧后都会进行回调处理，通过回调的方式可以采集到每一帧的耗时信息，具体代码逻辑如下：

    /// 启动监听数据 
    static void start() async{ 
      deviceInfo = await IsolateHandle.getDeviceInfo(); 
      SchedulerBinding.instance.addTimingsCallback( 
          Report.onReportTimings 
      ); 
    }
    

然后在 onReportTimings 中将每一帧数据分别保存到 frames 和 routerFrames ，代码如下：

    /// 数据处理 
    static void onReportTimings(List<FrameTiming> timings) { 
      for (FrameTiming timing in timings) { 
        frames.addFirst(timing); 
        routerFrames.addFirst(timing); 
      } 
    }
    

routerFrames 为当前页面路由的帧耗时的队列，frames 为所有帧耗时的队列。有了绘制的每一帧数据后，我们再将数据传递到其他线程进行计算，这里会传递到 IsolateHandle 的 calculateFps 方法，我们具体看下这个方法的计算逻辑。

    /// 计算当个页面的 fps 
    static void isolateCalculateFps( 
        ListQueue<FrameTiming> calculateList, 
        String routerName, 
        String deviceInfo 
        ) { 
      if(calculateList == null){ 
        return; 
      } 
      String fpsStr = 60.toStringAsFixed(3); 
      int lostNum = 0; 
      // flutter 标准渲染频率 
      double standardFps = 1000/60; 
      // 计算多少出现掉帧情况，请注意如果是 33秒，其掉帧为2，用34/16。67下取整。 
      calculateList.forEach((frame) { 
        if(frame.totalSpan.inMilliseconds > standardFps) { // 超出 16ms 的帧 
          lostNum = lostNum + ( 
              frame.totalSpan.inMilliseconds/standardFps 
          ).floor(); 
        } 
      }); 
      if(calculateList.length + lostNum > 0) { // 尽量避免分母为0情况 
        double fps = ( 60 * calculateList.length ) / 
            ( calculateList.length + lostNum ); 
        fpsStr = fps.toStringAsFixed(3); 
      } 
      print('${deviceInfo}\t${fpsStr}'); 
    }
    

上述代码中，首先获取标准的一帧绘制时间 16.67 ms（目前这部分是hardcode 60 HZ，后续需要匹配 120 HZ），然后分别计算每一帧的渲染耗时情况，并与 16.67 ms 进行对比，得到掉帧数量。计算掉帧的方式是，用耗时时间除以 16.67 ms 下取整就代表掉帧数量。比如耗时 34 ms，代表掉帧了 2 帧，因为 34 / 16.67 = 2.039。最后用以下公式来计算 FPS 。

    ( list.length * 60 ) / ( list.length + lostNum )
    

FPS 和 PV 一样将数据上报到服务端，后续在服务端进行分析。

以上就完成了所有的性能上报功能，接下来我们在某个页面进行尝试，这里选择之前侧边栏的“单图片信息”。

#### 应用

在该类中的 initState 中上报 PV ，并在页面开始加载前，将帧放入到具体的 routerFrames 中，代码如下：

    @override 
    void initState() { 
      super.initState(); 
      /// 开始记录fps 
      Report.startRecord('${this.runtimeType}'); 
      indexPos = 0; 
      // 拉取推荐内容 
      ApiContentIndex.getRecommendList().then((retInfo) { 
        if (retInfo.ret != 0) { 
          // 判断返回是否正确 
          return; 
        } 
        setState(() { 
          contentList = retInfo.data; 
        }); 
      }); 
    }
    

其中的第 5 行就是上报 PV ，并开始记录 routerFrames ，这里通过 this.runtimeType 可以获得具体的类名。FPS 则在页面最后一帧加载完成后回调，然后在回调中计算 FPS 相关数据。在 Flutter 提供了接收帧绘制完成后回调的方法，需要在 build 逻辑中增加下面的代码。

    WidgetsBinding.instance.addPostFrameCallback( 
            (_) => Report.endRecord('${this.runtimeType}') 
    );
    

然后在 Report.endRecord 调用其他线程函数，计算 FPS，并需要清空 routerFrames 。

    /// 结束并显示数据 
    static void endRecord(String routerName) { 
      IsolateHandle.calculateFps(routerFrames, routerName, deviceInfo); 
      routerFrames.clear(); 
    }
    

完成后就可以在虚拟机或者真机上进行模拟测试了，不过这里的 FPS 数据不一定完全准确，后续会进一步再优化更新到[Github 源码](https://github.com/love-flutter/flutter-column)中。

### 总结

本课时着重介绍了 devTools 中的 Timeline 工具的使用，并且应用该工具带领大家实践分析性能问题，其次也简单介绍了 GPU 的问题，不过 GPU 问题需要根据实际情况来分析。最后通过多线程的方式来计算和上报页面相关的性能数据。

学完本课时，你需要掌握 Timeline 分析 UI 性能问题的方法，并且了解如何捕获 Flutter 页面的绘制耗时数据，以及如何简单计算 FPS。

[点击链接查看本课时代码](https://github.com/love-flutter/flutter-column)