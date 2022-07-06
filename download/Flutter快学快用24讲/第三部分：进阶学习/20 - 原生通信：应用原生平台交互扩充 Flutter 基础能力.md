本课时介绍 Flutter 如何与原生平台进行通信交互方式，让 Flutter 支持各种原生平台的基础能力。

### 使用场景

由于 Flutter 是一个跨平台 UI 库，因此不支持原生系统的功能，例如：

*   系统通知；
    
*   系统感应、相机、电量、LBS、声音、语音识别；
    
*   分享、打开其他 App 或者打开自身 App；
    
*   设备信息、本地存储。
    

以上只列举了部分，其实主要是和系统服务调用相关的功能，大部分都不支持。这时候就需要原生平台提供一些基础服务给 Flutter 来调用。我们先来看下 Flutter 与 Android 和 iOS 是怎么进行消息传递和接收的。

### 交互原理

在 Flutter 中存在三种与原生平台进行交互的方法： MethodChannel 、BasicMessageChannel 和 EventChannel 。这三者在底层是没有区别的，都是基于 binaryMessenger 来实现。不过在应用层中的使用场景有所区别。

*   MethodChannel ，该方法需要创建一个消息通道句柄，然后再利用其中的 invokeMethod 来调用原生平台，原生平台根据传递的方法和参数，执行并获得具体的异步响应结果。该方法支持两个参数，一个是方法名，一个是方法参数，因此更适合去调用原生客户端的函数方法；
    
*   BasicMessageChannel ，该方法需要创建一个消息通道句柄，然后再利用其中的 send 方法发送数据给到原生平台.原生平台接收到数据后，可以针对接收数据响应返回，也可以在接收数据后，不做任何返回。因此该方法更适合向原生平台传递数据，而不是功能调用；
    
*   EventChannel ，该方法是数据流传递，适用于大文件或者数据流媒体等的应用。发送方不会有响应，但是它会通过调用 MethodChannel 来通知原生平台，比如开始监听数据接收会发送 listen ，取消了数据接收会发送 cancel。
    

在实际应用中三种方法都是有一定场景，大部分情况下还是基于 MethodChannel 来实现，比如前面我们所应用到的插件：FlutterWebviewPlugin 和 PathProviderPlugin ，当然其中也涉及 EventChannel 的应用，比如 UniLinksPlugin 插件。接下来我们具体看下整个消息交互的流转过程。

#### 交互实现过程

根据官网的知识以及我自己的一个理解，可以将整个过程总结为下图 1 。

![Drawing 0.png](https://s0.lgstatic.com/i/image/M00/41/CC/Ciqc1F82QdiASdHvAAGbIVp4bfI196.png)

图 1 消息交互流程图

从图 1 中我们可以看到，所有的消息都是通过 binaryMessenger 来传递，Flutter 的底层是 C 和 C++ 实现的，binaryMessenger 就是通过 C++ 底层库来调用平台相关的功能，数据返回也是原路处理返回。上面的调用过程，就是 Flutter 官网三层架构（如图 2 所示）的一个典型例子。

![image (8).png](https://s0.lgstatic.com/i/image/M00/41/E1/CgqCHl82ToiAUS0SAAGny7Ud86w285.png)

图 2 Flutter 三层架构

### 应用示例

原理分析清晰后，我们再基于我们当前 Two You Friend App 项目实践一下这个功能。主要需求就是能够在 Flutter 中查看当前电量信息，具体效果如如图 3 所示。

![image (7).png](https://s0.lgstatic.com/i/image/M00/41/D6/Ciqc1F82TpCAKE8oAAExi3g6bqk260.png)

图 3 获取电量界面效果图

从图中我们可以看到在 Android 中是可以正常获取到当前电量信息，但是在 iOS 中是无法获取（主要原因是在虚拟机上 iOS 不支持 device.batteryState 方法）。接下来我们看下具体的代码实现逻辑。

#### 增加测试页面

在项目中的 lib/pages 下创建一个 test\_page 文件夹，在文件夹中创建 index.dart 。因为需要使用到 MethodChannel ，所以在头部增加两个库的引入，代码如下：

    import 'package:flutter/material.dart'; 
    import 'package:flutter/services.dart';
    

接下来实现 TestPageIndex 这个类，并在该类中应用 MethodChannel 创建一个消息句柄，代码如下：

    /// 测试页面 
    class TestPageIndex extends StatelessWidget { 
      /// 构造函数 
      const TestPageIndex(); 
      /// 创建数据传输句柄 
      static const platform = MethodChannel('com.example.two_you_friend'); 
      @override 
      Widget build(BuildContext context) { 
        return Container(); // @todo
      } 
    }
    

上面代码创建了一个唯一的消息名句柄，为了避免重复性，这里最好的方式就是使用包的名称加上功能。接下来我们实现 build 逻辑。由于调用原生的 invokeMethod 是一个异步消息返回的方法，因此这里需要使用 FutureBuilder`<Widget>` 来实现，具体代码如下：

    @override 
    Widget build(BuildContext context) { 
      return FutureBuilder<Widget>( 
          future: _getBatteryLevel(), 
          builder: (BuildContext context, AsyncSnapshot<Widget> snapshot) { 
            if(snapshot.error != null) { 
              return Container( 
                child: CommonError(), 
              ); 
            } 
            return Container( 
              child: snapshot.data, 
            ); 
          }); 
    }
    

上面的代码调用了一个异步函数 \_getBatteryLevel ，正确返回则显示相应的组件，异常则显示通用报错页面，最后再来看下 \_getBatteryLevel 的实现逻辑。

    Future<Widget> _getBatteryLevel() async { 
      String batteryLevel; 
      try { 
        final int result = await platform.invokeMethod('getBatteryLevel'); 
        batteryLevel = 'Battery level at $result % .'; 
        print(batteryLevel); 
      } on PlatformException catch (e) { 
        print(e.message); 
        batteryLevel = "Failed to get battery level: '${e.message}'."; 
      } 
      return Center( 
        child: Text(batteryLevel), 
      ); 
    }
    

创建一个空字符串，然后通过 platform.invokeMethod 发送给原生平台，原生平台异步返回消息得到 result 结果，由于 invokeMethod 是一个范型，因此可以将结果设置为 int 类型。这里使用 try catch 的目的是避免因为原生平台不支持导致的异常，比如 iOS 就不支持在虚拟机上调用该 API 。

#### 增加页面跳转

页面实现完成后，我们再去 router 中增加该页面的配置。首先使用 import 引入该页面，然后再修改 lib/router.dart 在 routerMapping 中增加一项。

    'test': StructRouter(TestPageIndex(), -1, null, true),
    

完成路由配置后，再前往 lib/widgets/menu/draw.dart 文件，在 ListView 下的 children 中增加一个新的菜单，代码配置如下：

    ListTile( 
      leading: Icon(Icons.person), 
      title: Text('原生测试'), 
      onTap: () { 
        Navigator.pop(context); 
        redirect('tyfapp://test'); 
      }, 
    ),
    

以上就完成了在 Flutter 中的代码逻辑。运行程序后，我们是可以正常打开该页面的，只是没有正确的响应数据，接下来我们就分平台实现获取平台电量的代码。

#### Android 代码

在项目根目录，我们有一个 android 的目录文件夹，使用 Android Studio 打开该项目，然后在 app/java 下创建一个 com.example.two\_you\_friend 这样的包名（在 Android Studio 是叫作 Package ），如果你不想再打开一个项目，也可以在当前项目的 android/app/src/main/java 目录下创建 com.example.two\_you\_friend 包，然后在该目录下新建一个 MainActivity.java 文件。接下来我们看下具体的代码实现。

第一步还是 import 我们需要的库文件。

    package com.example.two_you_friend; 
    import android.content.ContextWrapper; 
    import android.content.Intent; 
    import android.content.IntentFilter; 
    import android.os.BatteryManager; 
    import android.os.Build.VERSION; 
    import android.os.Build.VERSION_CODES; 
    import androidx.annotation.NonNull; 
    import io.flutter.embedding.android.FlutterActivity; 
    import io.flutter.embedding.engine.FlutterEngine; 
    import io.flutter.plugin.common.MethodChannel; 
    import io.flutter.plugins.GeneratedPluginRegistrant;
    

接下来创建 MainActivity 来继承 FlutterActivity ，创建一个与 Flutter 中对应的消息名字，并创建两个未实现的方法 configureFlutterEngine 和 getBatteryLevel 。

    public class MainActivity extends FlutterActivity { 
        private static final String CHANNEL = "com.example.two_you_friend"; 
        @Override 
        public void configureFlutterEngine(@NonNull FlutterEngine flutterEngine) { 
        } 
    
        /** 
         * 获取电量信息 
         * @return string 
         */ 
        private int getBatteryLevel() { 
        } 
    }
    

configureFlutterEngine 重写的父类方法，主要是用来处理 MethodChannel 发送过来的数据。getBatteryLevel 获取当前电量信息。我们先来看下 configureFlutterEngine 代码：

    @Override 
    public void configureFlutterEngine(@NonNull FlutterEngine flutterEngine) { 
        GeneratedPluginRegistrant.registerWith(flutterEngine); 
        new MethodChannel(flutterEngine.getDartExecutor().getBinaryMessenger(), CHANNEL) 
                .setMethodCallHandler( 
                        (call, result) -> { 
                            if (call.method.equals("getBatteryLevel")) { 
                                int batteryLevel = getBatteryLevel(); 
                                if (batteryLevel != -1) { 
                                    result.success(batteryLevel); 
                                } else { 
                                    result.error("UNAVAILABLE", "Battery level not available.", null); 
                                } 
                            } else { 
                                result.notImplemented(); 
                            } 
                        } 
                ); 
    }
    

上面代码核心部分是在 call.method.equals ，判断 Flutter 需要调用的方法，根据不同的数据调用不同的函数，比如 getBatteryLevel 则调用 getBatteryLevel() 。最后我们再来看下电量获取部分的代码：

    /** 
     * 获取电量信息 
     * @return string 
     */ 
    private int getBatteryLevel() { 
        int batteryLevel = -1; 
        if (VERSION.SDK_INT >= VERSION_CODES.LOLLIPOP) { 
            BatteryManager batteryManager = (BatteryManager) getSystemService(BATTERY_SERVICE); 
            batteryLevel = batteryManager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY); 
        } else { 
            Intent intent = new ContextWrapper(getApplicationContext()). 
                    registerReceiver(null, new IntentFilter(Intent.ACTION_BATTERY_CHANGED)); 
            batteryLevel = (intent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) * 100) / 
                    intent.getIntExtra(BatteryManager.EXTRA_SCALE, -1); 
        } 
        return batteryLevel; 
    }
    

由于是 Java 代码，我了解的也较少，也非本课时的知识点，具体大家参考下了解就可以。  
以上就完成了整个开发过程，不过这里有一个非常大的坑，在 Flutter 项目创建完成后，app 目录下的 src/main/kotlin 目录中也会存在另外一个 MainActivity 类，这样会导致 Android 项目编译失败，可以将 src/main/kotlin 下的 MainActivity 类改一个名字即可，需要时再将 java 和 kotlin 中的两个类名修改回来。

开发完成后，就可以使用 Android 虚拟机来测试了。接下来我们看下 iOS 代码。

#### iOS 代码

iOS 也支持两种语言 Object-C 和 Swift ，这里我们使用 Swift 来演示。直接在 Android Studio 中打开 ios/Runner 目录下的 .swift 文件。添加下以下部分代码，由于是 Swift 代码，我就不过多介绍如何实现的细节了。

    import UIKit 
    import Flutter 
    @UIApplicationMain 
    @objc class AppDelegate: FlutterAppDelegate { 
     override func application( 
      _ application: UIApplication, 
      didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool { 
      let controller : FlutterViewController = window?.rootViewController as! FlutterViewController 
      let batteryChannel = FlutterMethodChannel(name: "com.example.two_you_friend", 
                           binaryMessenger: controller.binaryMessenger) 
      batteryChannel.setMethodCallHandler({ 
       [weak self] (call: FlutterMethodCall, result: FlutterResult) -> Void in 
       // Note: this method is invoked on the UI thread. 
       guard call.method == "getBatteryLevel" else { 
        result(FlutterMethodNotImplemented) 
        return 
       } 
       self?.receiveBatteryLevel(result: result) 
      }) 
      GeneratedPluginRegistrant.register(with: self) 
      return super.application(application, didFinishLaunchingWithOptions: launchOptions) 
     } 
      private func receiveBatteryLevel(result: FlutterResult) { 
       let device = UIDevice.current 
       device.isBatteryMonitoringEnabled = true 
       if device.batteryState == UIDevice.BatteryState.unknown { 
        result(FlutterError(code: "UNAVAILABLE", 
                  message: "Battery info unavailable", 
                  details: nil)) 
       } else { 
        result(Int(device.batteryLevel * 100)) 
       } 
      } 
    }
    

代码完成后，使用 iOS 模拟器运行项目就可以看到图 3 所示的一个效果了。

### Flutter 插件

学习掌握与原生通信原理后，我们就可以利用该功能做一些跨平台原生 Flutter 插件，通过插件的方式来屏蔽平台特性。具体大家可以尝试创建一个试试：

1.在 Android Studio 创建一个新的项目，项目类型选择 Flutter Plugin ，或者使用下面的命令行；

    flutter create --org com.example --template=plugin plugin_name
    

2.创建完成后，里面会包含相应的测试代码，以及会准备好最基础的代码部分，只需要在模版代码上增加我们应用示例的代码；

3.创建完成后，在不修改示例的基础上运行，可以看到如图 4 所示的一个效果。

![image (9).png](https://s0.lgstatic.com/i/image/M00/41/E1/CgqCHl82TqCAWzXCAAAwHz1zoOw595.png)

图 4 Flutter Plugin 效果

4.开发完成插件后，如果需要使用该插件，方法还是在 pubspec.yaml 增加依赖，例如下面的配置。

    dependencies: 
      flutter: 
        sdk: flutter 
      battery: 
        # When depending on this package from a real application you should use: 
        #   battery2: ^x.y.z 
        # See https://dart.dev/tools/pub/dependencies#version-constraints 
        # The example app is bundled with the plugin so we use a path dependency on 
        # the parent directory to use the current plugin's version.
        path: ../
    

battery 是我们测试的插件名称，path 是一个相对路径，指向插件的项目根目录即可。

以上就是原生插件的开发过程，需要有一定的原生平台开发能力，这也是我一开始介绍到的后面大前端的一个方向，跨端团队作为业务支撑，而 Android 、 iOS 以及 Web 作为平台底层支持跨端的团队。

### 总结

本课时核心是介绍了如何在 Flutter 中与原生平台进行通信，从而扩充 Flutter 基础功能，这部分还是需要有一定的原生编程能力。在掌握通信机制后，也顺便介绍了如何创建 Flutter plugin ，从而将多平台代码作为插件进行开发，而在 Flutter 端屏蔽多终端的问题。学完本课时以后，需要掌握 Flutter 与原生平台的通信方式，并且了解 Flutter plugin 的开发过程。

下一课时我将介绍 Flutter 中的性能监控和分析，并利用性能分析来优化我们当前 Two You APP 项目。

[点击此链接查看本课时源码](https://github.com/love-flutter/flutter-column)