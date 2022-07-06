之前已经讲解了 Flutter 所有基础的知识点，本课时介绍如何保证组件代码的质量，以此来确保我们在代码开发过程中或者在重构过程中的代码质量。

### 单元测试

单元测试的概念是针对程序中最小单位来进行校验的工作，在 Flutter 中最小的单位是组件。由于我们扩展了一些模块比如 Model（Provider）、Struct（数据结构部分），因此这里也需要介绍下这两部分的单元测试。

#### 目录结构

为了保持一致性，我们在 test 单元测试目录，创建与项目结构目录一致的结构，如图 1 所示。

![image (9).png](https://s0.lgstatic.com/i/image/M00/2B/C9/Ciqc1F7_AHGAJ8__AABUPoaGi10666.png)  
图 1 单元测试目录结构

单元测试目录结构下的测试文件命名也是按照原组件命名方式，但是需要在组件命名后面增加 test 后缀。例如，我们需要对 article\_comments.dart 文件进行单元测试，根据规则将其命名为 article\_comments\_test.dart。

#### 前期准备

首先我们需要在 pubspec.yaml 中增加相应的 flutter\_test 第三库，一般项目初始化后，会自动在 dev\_dependencies 中引入，最后执行 flutter pub get 更新本地第三库即可。目录结构目前还是需要手动创建，在下一课时，我会在脚手架中自动化创建。

### Struct 的单元测试

Struct 的目的是保证数据结构的安全，避免因为动态数据结构而引发客户端的 Crash 问题，因此做好数据结构的单元测试非常必要。Struct 的结构比较简单，只有一个构造函数，在构造函数中存在必须和可选参数，单元测试部分主要是验证这个构造函数即可。

在上一课时中，我们创建了三个 Struct ，这里着重介绍较为复杂的 comment\_info\_struct.dart 的测试用例写法，代码如下。

    import 'package:flutter_test/flutter_test.dart';
    import 'package:two_you/util/struct/comment_info_struct.dart';
    import 'package:two_you/util/struct/user_info_struct.dart';
    void main() {
      final UserInfoStruct userInfo = UserInfoStruct('test', 'http://test.com');
      test('test-userinfo', () {
        final CommentInfoStruct commentInfo =
          CommentInfoStruct(userInfo, 'comment test');
        expect(commentInfo.comment == 'comment test', true);
        expect(commentInfo.userInfo.nickname == 'test', true);
        expect(commentInfo.userInfo.headerImage, 'http://test.com');
      });
    }
    

第 1 行代码引入 flutter\_test 第三方库，第 3 和 4 行引入本次测试需要的 struct 结构库。测试文件的所有测试逻辑都在 main 函数中。在第 7 行中使用 UserInfoStruct 创建 userInfo ，Flutter 中的类以及库测试都是以 test 函数为测试方法，test 包含两个参数，一个是测试的描述，另外一个是测试的核心逻辑。

测试的核心逻辑中有一个 expect 方法，该方法可以在代码前使用一个条件判断语句，例如等于、大于、小于等等，而第二个参数可以是任何数据。如果 expect 的前后两个值相等，则测试用例通过，如果不相等则不通过。

代码完成以后，我们在根目录执行下面的命令。

    flutter test
    

执行完成后，就可以看到以下结果，这表明测试用例已全部通过。

    00:04 +1: All tests passed!
    

### Model 的单元测试

Model 的测试和 Struct 基本一样，不过在 Model 中有较多方法，因此需要增加一些类方法的测试。这里我们使用 like\_num\_model.dart 作为测试文件，在 test 目录下的 model 文件夹中新增测试文件 like\_num\_model\_test.dart ，并在实现如下测试代码。

    import 'package:flutter_test/flutter_test.dart';
    import 'package:two_you/model/like_num_model.dart';
    void main() {
      final LikeNumModel likeNumModel = LikeNumModel();
      test('test like model value', () {
        expect(likeNumModel.value, 0);
      });
      test('test like model like method', () {
        likeNumModel.like();
        expect(likeNumModel.value, 1);
        likeNumModel.like();
        expect(likeNumModel.value, 2);
      });
    }
    

代码中第 1 行和第 3 行都是引入相应的库以及测试库文件，其次以 main 为测试入口，在 main 中调用 LikeNumModel 初始化并获得操作句柄，然后分为两部分，一部分测试状态属性，另一部分测试相应状态属性变更的类方法。

### 组件的单元测试

上面两部分测试代码逻辑较为简单，真正的核心是组件的单元测试。组件测试使用的方法是 testWidgets ，需要将组件放入到 MaterialApp 中，然后在 MaterialApp 中去 find 相应组件中的元素，接下来我们看一个比较简单的无状态组件的测试 。

#### 无状态组件

学习无状态组件的单元测试，我们选择上一课时中 article\_detail 文件下的 article\_content.dart 组件作为例子。在 test/article\_detail 文件夹中创建 article\_content\_test.dart 文件，代码实现如下。

    import 'package:flutter/material.dart';
    import 'package:flutter_test/flutter_test.dart';
    import 'package:two_you/widgets/article_detail/article_content.dart';
    void main() {
      testWidgets('test article content', (WidgetTester tester) async {
        final Widget testWidgets = ArticleContent(content: 'test content');
        await tester.pumpWidget(
            new MaterialApp(
                home: testWidgets
            )
        );
        expect(find.text('test content'), findsOneWidget);
        expect(find.byWidget(testWidgets), findsOneWidget);
      });
    }
    

*   代码的前 2 行引入相应的组件库和测试库，第 4 行引入需要被测试的组件 article\_content ；
    
*   在 main 函数中使用 testWidgets 来测试组件，testWidgets 也有两个参数，第一个是测试描述，第二个是一个执行函数，函数会自带一个组件测试对象 tester ；
    
*   在测试过程中需要将被测试的组件插入到 MaterialApp ，因此这里需要使用到tester.pumpWidget 方法，代码在第 9 行中体现；因为这是一个异步方法，因此需要函数使用 async ，并且这里需要使用 await 来等待执行完成；
    
*   使用 expect 来查询组件，findsOneWidget 来判断是否找到相应的组件。
    

以上就是无状态组件的测试方法，由于上面的 article\_content 内部只有一个 text 组件，因此单元测试比较简单。无状态组件可以验证组件是否存在，并且可以判断组件中的元素是否按照参数传入的值显示。

#### 有状态组件

有状态组件在组件测试部分与无状态组件一样，这里主要是介绍在组件触发更新后，如何保证界面显示正常与否。这里我们使用上一课时的 article\_detail\_like 作为测试例子。因为组件状态管理需要使用 Provider ，因此需要引入该模块。

    import 'package:flutter/material.dart';
    import 'package:flutter_test/flutter_test.dart';
    import 'package:provider/provider.dart';
    import 'package:two_you/model/like_num_model.dart';
    import 'package:two_you/widgets/article_detail/article_detail_like.dart';
    

接下来在 main 函数初始化状态模块 like\_num\_model，代码如下。

    void main() {
      final LikeNumModel likeNumModel = LikeNumModel();
    }
    

然后我们增加单纯的静态组件测试，这部分和无状态组件部分完全一致，代码如下。

    testWidgets('test article like widget', (WidgetTester tester) async {
      final Widget testWidgets = ArticleDetailLike();
      await tester.pumpWidget(
          new Provider<int>.value(
              child: ChangeNotifierProvider.value(
                value: likeNumModel,
                child: MaterialApp(
                    home: testWidgets
                ),
              )
          )
      );
      expect(find.byType(FlatButton), findsOneWidget);
      expect(find.byIcon(Icons.thumb_up), findsOneWidget);
      expect(find.text('0'), findsOneWidget);
    });
    

与无状态组件测试唯一不同的是，我们需要使用 Provider 将 MaterialApp 封装起来。在代码中的第 13 行找 FlatButton 组件，第 14 行寻找 thumb\_up icon ，第 15 行获取组件中的 Text 组件，并判断初始值为 0 。

接下来我们看下比较复杂的事件触发更新的测试部分逻辑。在这个例子的单元测试中，我们需要触发按钮点击操作，并且进行 rebuild 后，重新校验组件的正确性，代码如下。

    testWidgets('test article like widget when like action', (WidgetTester tester) async {
      final Widget testWidgets = ArticleDetailLike();
      await tester.pumpWidget(
          new Provider<int>.value(
              child: ChangeNotifierProvider.value(
                value: likeNumModel,
                child: MaterialApp(
                    home: testWidgets
                ),
              )
          )
      );
      await tester.tap(find.byType(FlatButton));
      await Future.microtask(tester.pump);
      expect(find.text('1'), findsOneWidget);
    });
    

代码中的第 13 行就是找到 FlatButton 并且触发其点击操作，使用的是 tester.tap 方法，在触发后需要等待组件重新更新，因此需要使用 Future.microtask 来触发等待更新完成，完成后再校验组件中的点赞数是否更新，在上面的 17 行中使用 expect 再次判断。

### 综合实践

以上就囊括了所有的单元测试的写法，由于断言 find 的方法还存在其他比较多的用法，这里就不复制过来，具体详细的内容，大家可以前往[官方文档](https://api.flutter.dev/flutter/flutter_test/CommonFinders-class.html)去查询。

接下来大家需要将上一课时的所有的组件使用本课时的知识点，覆盖到所有的单元测试，写完以后大家可以对比或者参考我们 github 上的源码。

这里也补充下，因为涉及图片组件，为了避免图片组件在测试加载过程中的异常问题，这里需要使用第三方库 image\_test\_utils ，下面是一个使用该组件的例子。

    import 'package:flutter/material.dart';
    import 'package:flutter_test/flutter_test.dart';
    import 'package:image_test_utils/image_test_utils.dart';
    
    import 'package:two_you/util/struct/article_summary_struct.dart';
    import 'package:two_you/widgets/home_page/article_summary.dart';
    
    void main() {
      /// 帖子概要描述信息
      final ArticleSummaryStruct articleInfo = ArticleSummaryStruct(
          '你好，交个朋友',
          '我是一个小可爱，很长的一个测试看看效果，会换行吗',
          'https://i.pinimg.com/originals/e0/64/4b/e0644bd2f13db50d0ef6a4df5a756fd9.png',
          20,
          30);
    
      testWidgets('test article summary', (WidgetTester tester) async {
        provideMockedNetworkImages(() async {
          final Widget testWidgets = ArticleSummary(
              title: articleInfo.title,
              summary: articleInfo.summary,
              articleImage: articleInfo.articleImage
          );
          await tester.pumpWidget(
              new MaterialApp(
                  home: testWidgets
              )
          );
    
          expect(find.text('你好，交个朋友'), findsOneWidget);
          expect(find.text('我是一个小可爱，很长的一个测试看看效果，会换行吗'), findsOneWidget);
    
          expect(find.byWidget(testWidgets), findsOneWidget);
        });
      });
    }
    

主要看代码的第 22 行，需要将整个测试代码使用 provideMockedNetworkImages 函数来执行，这样就不会出现异常情况了。

### 总结

以上就是本课时的所有内容，学完本课时你需要掌握 Struct、Model、无状态和有状态组件的单元测试写法。

下一课时我将把我们基础部分的所有基础知识汇总会一个脚手架，规范和统一基础模块。谢谢。

[点击此链接查看本课时源码](https://github.com/love-flutter/flutter-column)