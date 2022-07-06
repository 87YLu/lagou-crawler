本课时主要介绍如何将 Two You App 项目，打包成 apk 和 ipa 文件。在打包前，我们首先需要将 App 的名称和图标进行修改，其次增加一些功能授权，确保我们打包后的文件安装是可用的。

### 基础配置

在打包之前我们需要修改 App 的名字和图标，Android 和 iOS 的修改方式有点不同，我们先来看下在 Android 中的修改方式。

#### Android

我们打开项目路径下的 android/app/src/main/AndroidMainfest.xml 文件，在该文件中找到下面两个字段：

*   android:label，为应用展示在手机中的名字，这里我们修改为 Two You；
    
*   android:icon，为应用展示在手机中的图标，可以修改图片的名字，具体图标文件存储在 android/app/src/main/res 中。
    

其次需要增加网络访问权限，在 manifest（application 配置下面）中增加下面四行配置：

    <uses-permission android:name="android.permission.READ_PHONE_STATE" /> 
    <uses-permission android:name="android.permission.INTERNET" /> 
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" /> 
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" /> 
    

这样就将打包所需要的配置信息处理完了，接下来我们看下 iOS 的配置。

#### iOS

我们打开项目路径下的 ios/Runner/info.plist 文件，在文件中找到 CFBundleName 的 key，然后修改该 key 对应的值，修改为下面的配置：

    <key>CFBundleName</key>  
    <string>Two You</string> 
    

图标的配置在 ios/Runner/Assets.xcassets/AppIcon.appiconset/Content.json 文件中，具体需要根据不同的机型做不同的配置。

请注意，如果需要申请其他权限，例如本地存储都需要在 AndroidMainfest.xml 和 info.plist 中增加相应的配置，不然可能会导致异常或者 Crash。具体权限配置查询，[Android 请参考这里](https://developer.android.com/guide/topics/manifest/manifest-intro.html)，[iOS 请参考这里](https://pub.dev/packages/flutter_permissions)。

如上配置修改完成后，我们可以在虚拟机上重新构建 App，构建完成后你可以在虚拟机上看到图标和名称的效果，接下来我们开始介绍打包过程。

### 打包发布

打包发布过程在官网都有比较详细的说明文档，不过这里我还是会针对过程中的每一步进行阐述，减少你在打包发布过程中的问题。由于目前没有私人的苹果开发者账号，因此这里只说明 Android 中的打包问题，iOS 部分会详细介绍下流程。

#### Android

按照如下步骤，一步步操作。在每个步骤中，我会详细说明需要注意的细节点，请认真阅读每个过程，以免出现一些不必要的问题。

1.**keytool 是否安装**。一般情况下，如果安装了 Android Studio ，keytool 是会默认安装，如果你安装了 Java ，在 Java 的 bin 目录也可以找到该工具，没有安装 Java 的话可以前往 [这里安装 Java](https://java.com/en/download/help/download_options.xml)；

2.**创建 keystore**，有了 keytool 工具后，运行如下命令：

    keytool -genkey -v -keystore ~/key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias key 
    

其中 genkey 是生成一个密钥对，keystore 是密钥库的名称（可以根据你自己的实际情况修改），keyalg 是加密算法，keysize 是大小，validity 为有效期天数，alias 为别名。在上面的配置信息中， alias 的 key 是比较关键的，如果大家需要修改需要记住该 alias。  
输入该命令后，需要你填写各种信息，其中涉及一个密码比较关键（请记住该密码），其他的信息按照你的想法输入就行。执行完成后会提示下面的信息，代表成功创建。

    [正在存储/Users/xxx/key.jks] 
    

这里请记住该 keystore 的目录地址。

3.**引用 keystore 生成 key.properties**，在项目的 android 目录下创建一个 key.properties 文件，该文件包含如下配置信息：

    storePassword=刚才输入的密码 
    keyPassword=刚才输入的密码 
    keyAlias=刚才设置的别名 
    storeFile=生成的 keystore 文件地址路径 
    

这四个数据一定要配置正确，不然会在打包时会报错，报错会提示相应的数据错误。

4.**配置签名**，具体需要打开 android/app/build.gradle 该文件，在该文件中找到下面信息

    android { 
    

修改为下面的配置，主要是增加了对 key.properties 文件引入。

    def keystorePropertiesFile = rootProject.file("key.properties") 
    def keystoreProperties = new Properties() 
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile)) 
    android { 
    

然后找到下面配置。

    buildTypes { 
        release { 
            // TODO: Add your own signing config for the release build. 
            // Signing with the debug keys for now, so `flutter run --release` works. 
            signingConfig signingConfigs.debug 
        } 
    } 
    

替换为下面这份配置。

    signingConfigs { 
        release { 
            keyAlias keystoreProperties['keyAlias'] 
            keyPassword keystoreProperties['keyPassword'] 
            storeFile file(keystoreProperties['storeFile']) 
            storePassword keystoreProperties['storePassword'] 
        } 
    } 
    buildTypes { 
        release { 
            signingConfig signingConfigs.release 
            minifyEnabled true 
            useProguard true 
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro' 
        } 
    } 
    

5.**混淆代码包**，这点类似于前端所说的 JS 压缩，主要是缩减代码，并达到不可阅读的目的。完成混淆功能，需要创建 lib/android/app/proguard-rule 文件，具体可以按照如下的方式配置：

    #Flutter Wrapper 
    -keep class io.flutter.app.** { *; } 
    -keep class io.flutter.plugin.**  { *; } 
    -keep class io.flutter.util.**  { *; } 
    -keep class io.flutter.view.**  { *; } 
    -keep class io.flutter.**  { *; } 
    -keep class io.flutter.plugins.**  { *; } 
    

上述配置只混淆了 Flutter 引擎库，其他的库或者项目中的库也可以使用这种方式，具体的配置规则大家可以搜索 Proguard 的常用规则。

增加需要混淆压缩的配置文件后，需要在 lib/android/app/build.gradle 中打开混淆压缩的逻辑，在 android 中增加下面一段配置。

    buildTypes { 
            release { 
                signingConfig signingConfigs.release 
                minifyEnabled true 
                useProguard true 
                proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro' 
            } 
        } 
    

其中 minifyEnabled 和 useProguard 配合使用都为 true 才会开启压缩混淆，如果只是 minifyEnabled 为 true 只会打开压缩，并不会混淆。

以上完成后，我们在项目根目录，运行下面命令启动打包 apk。

    flutter build apk 
    

执行成功后，会提示具体 apk 保存的位置，然后将该 apk 发送到 Android 手机，就可以在手机上看到我们的具体效果了。

**可能出现的问题**（后续有出现其他的，可以评论，我会尽量帮大家解答，解答完成后再更新到这里）：

1.**Execution failed for task ':flutter\_webview\_plugin:verifyReleaseResources'. > A failure occurred while executing com.android.build.gradle.internal.tasks.Workers$ActionFacade.**

原因：我们使用了一个 flutter\_webview\_plugin: ^0.3.0+2 的包，会导致在打包的时候无法找到。

解决：你先将这个包的版本修改为 flutter\_webview\_plugin: ^0.3.0 这个，其次删掉 pubspec.lock 文件，依次等待执行下面几个命令即可：

    flutter clean 
    flutter pub get 
    

2.**在虚拟机上运行正常，在实体机上运行出现各种奇怪问题，比如一打开直接黑屏。**

原因：实体机上各种权限都是需要申请，比如说网络权限、相机权限等，如果没有申请会导致网络请求失败超时。我们 App 中首次需要等待用户信息返回数据，因此可能会导致的就是黑屏。

解决：对于黑屏，上面已经说明了需要增加网络授权。关于这类问题的话，你可以使用排除法，例如只展示一个简单 Text 组件，看下打包后是否正常，然后慢慢地增加组件。经过这个过程，你会发现到具体的问题原因。还有一种方法就是外接设备进行调试。

其他问题欢迎大家评论补充，接下来我们看下 iOS 的打包过程。

#### iOS

完成 iOS 的打包和发布，需要几个先决条件：

1.  Xcode，如果你是非 Mac 系统，需要先安装虚拟机，然后安装 Mac 系统，具体的流程你可以去搜索安装；
    
2.  苹果开发者账户，这个需要下载苹果的开发者 App，然后在 App 上认证支付，认证完成后创建项目，并设置一个 Bundle Id。
    

接下来我们看下具体的打包步骤：

1.**打开 Xcode**，并打开 Flutter 中的 ios 目录；  
2.打开后，**点击左侧项目的 Runner**，然后选择右侧的 Singing & Capabilites，修改 Bundle Id 为对应在苹果开发者中创建的项目 Bundle Id，接下来选择 Team，登录开发者账户，自动查询相应的项目信息，如图 1 截图指引所示；

![image (7).png](https://s0.lgstatic.com/i/image/M00/3D/C7/Ciqc1F8qoliAHwU5AALSnCYSZPg629.png)

图 1 Xcode 配置指引

3.回到项目根目录中运行下面命令并**执行 Flutter 的命令创建 relase 版本**；

    flutter build ios 
    

4.在 Xcode 中，\*\*配置应用程序版本并构建一个可测试的 App 版本，\*\*步骤如下。

*   首先选择 Product > Scheme > Runner，然后选择 Product > Destination > Generic iOS Device。
    
*   **选中左侧的 Runner**，并打开右侧的 General ，然后配置 Identity 中的版本号 Version 和 Build，如图 2 所示。
    

![image (8).png](https://s0.lgstatic.com/i/image/M00/3D/D3/CgqCHl8qopOARENrAAaU0YGW44c040.png)

图 2 配置指引

*   **选择 Product > Archive 以生成构建文件。**
    
*   在 Xcode Organizer 窗口的边栏中，选择 iOS 应用程序，然后**选中刚刚构建的文件。**
    
*   点击 Validate… 按钮，然后 **Upload to App Store**，然后你就可以在开发者官网中查看构建情况。
    

以上就完成了构建过程，构建成功后会有相应的邮件提醒，然后就可以发布到 TestFlight 进行安装测试了。如果你还需要发布到 App Store，则按照苹果的审核要求提交审核即可。

### 总结

本课时着重介绍了如何打包发布我们的 App，其中大部分都是实践操作，只要你根据步骤去实践即可。学完本课时你需要掌握 Android 和 iOS 两个平台的打包发布流程。

下一课时，我将完善我们 App 的整体代码逻辑，其中包括：我的消息、系统设置、搜索等功能。我会通过演示界面效果和绘制组件树来介绍整体代码逻辑，对于其中特殊的点会进一步说明。谢谢。

[点击此链接查看本课时源码](https://github.com/love-flutter/flutter-column)