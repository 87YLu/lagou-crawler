### 无/有状态组件

由于无状态组件在执行过程中只有一个 build 阶段，在执行期间只会执行一个 build 函数，没有其他生命周期函数，因此在执行速度和效率方面比有状态组件更好。所以在设计组件时，不要任何组件都使用有状态组件进行开发，要根据实际分析情况使用。

#### Flutter 中基础组件介绍

Flutter 内部包含一些基础的无状态组件，在组件设计的时候，需要对基础组件有一定认识。本课时所使用的 Flutter 基础组件（这里我只简单介绍本课时所使用的组件，更多组件请参考[官网文档](https://flutterchina.club/widgets/)）包括：

*   Text，文本显示组件，里面包含了文本类相关的样式以及排版相关的配置信息；
    
*   Image，图片显示组件，里面包含了图片的来源设置，以及图片的配置；
    
*   Icon，Icon 库，里面是 Flutter 原生支持的一些小的 icon ；
    
*   FlatButton，包含点击动作的组件；
    
*   Row，布局组件，在水平方向上依次排列组件；
    
*   Column，布局组件，在垂直方向上依次排列组件；
    
*   Container，布局组件，容器组件，这点有点类似于前端中的 body ；
    
*   Expanded，可以按比例“扩伸” Row、Column 和 Flex 子组件所占用的空间 ，这点就是前端所介绍的 flex 布局设计；
    
*   Padding，可填充空白区域组件，这点和前端的 padding 功能基本一致；
    
*   ClipRRect，圆角组件，可以让子组件有圆形边角。
    

以上组件的具体使用以及参数配置，在[官网](https://flutterchina.club/widgets/)中有具体说明。

#### 组件组合要点

Flutter 功能的开发，可以总结为将基础组件组合并赋予一些交互行为的过程，因此需要掌握组件组合的一些要点。

由于动态组件和静态组件的特点，因此在组合的时候要非常注意，动态组件下的子组件如果过多，则在组件更新的时候，会导致其子组件的全部更新，从而引发性能问题。因此在组件组合的时候需要有一些避免的规则来参考，下面这几点是我自己整理的一套原则。

1.  尽可能减少动态组件下的静态组件；
    
2.  数据来源相同的部分组合为同一组件；
    
3.  使用行或者列作为合并的条件；
    
4.  功能相同的部分，转化为基础组件；
    
5.  合并后根节点的为 Container。
    

### 组件设计

当 UI 提供一个交互过来以后，我们要用一套标准的流程来设计组件，减少主观上不合理的设计，接下来主要介绍下我整理的那一套原则。

例如我们现在需要设计一个图 1 的主界面，其次可以进行点赞操作，点赞完成后数字增加 1 。

![image (10).png](https://s0.lgstatic.com/i/image/M00/26/C9/Ciqc1F7zAciAV3kHAAsOqdx9yX8344.png)  
图 1 Two You 的首页推荐界面

#### 界面分析

将设计方案分为以下几个过程：

1.  标记所有界面元素（ Flutter 基础组件），按照数字进行标记，请注意明显相似部分不需要标记；
    
2.  记录相应数字对应的组件名称，并命名展示数据的参数名；
    
3.  标记需要交互和数据变化的数据；
    
4.  将数字和数据合成一个最小组件，并标记组件是有或无状态组件；
    
5.  将第 4 步中的最小组件进行合并，组件组合规则，请参照上面介绍到的“组件组合要点”；
    
6.  完成组件合并后，绘制一张组件图，再次分析动态组件下的静态组件是否合理，如果能拆分尽量拆分。
    

按照这 6 个步骤我们就可以实现一个界面的组件分析，接下来我们按照图 1 中的界面以及这 6 个步骤实践组件设计。

#### 实践设计

第一步：**标记界面元素**，标记效果如图 2 所示：

![image (11).png](https://s0.lgstatic.com/i/image/M00/26/C9/Ciqc1F7zAdOAel6TAAtwHZn7wQw909.png)  
图 2 组件标记

第二步：记录**组件名称以及组件数据**，以及**标记动态数据**，我们使用下面的表格 1 来处理，并且将每个小组件命名好。

![image (12).png](https://s0.lgstatic.com/i/image/M00/26/C9/Ciqc1F7zAemAA3hwAACRl_hUd40759.png)  
表格 1 组件标记结果

第三步：**组件合并**，主要是将功能一致的组件进行合并，上面的组件中，5 和 6 属于头像信息合并为一个最小组件，7 和 8 为帖子信息合并，9 和 10 为点赞信息合并。

第四部：**创建组件树**，1 由于是单独的一列，因此我们单独一个组件。2 和 3 以及 4 为同一行组件，因此可以合并为一个 Row 组件。然后 2 和 3 垂直排列，组合为一个 Column 组件。5、6、7、8、9、10 都在同一行，因此合并为一个组件。2、3、4、5、6、7、8、9、10 由于存在重复部分，因此合并为一个大的 Row 组件。根据上面的结论，我们绘制组件树如图 3 所示。

![5.png](https://s0.lgstatic.com/i/image/M00/31/5D/CgqCHl8MPo6AfA-wAACs_VZfuQw592.png)  
图 3 组件树

图 3 中的黄色背景的表示动态组件，由于 9 和 10 组成的是最小组件，因此将 9 和 10 作为一个动态组件。所有的叶子节点上都是我们第一步所标记的基础组件，完成后看是否满足我们的设计规则。可以看到动态组件只有一个，在右下角的 Row 中，而该动态组件下只有最小的组件组合，因此是满足我们的设计要求。但为了减少动态组件 10 因状态改变而影响的范围，我们可以将 5、6、7、8 合 并为一个新的组件，将 9 和 10 单独作为一个组件，如图 4 所示。

![6.png](https://s0.lgstatic.com/i/image/M00/31/5D/CgqCHl8MPp2AZhKfAADFimfXDyg939.png)  
图 4 优化后的组件设计图

这样就完成了组件的分析和设计，按照这种方式，我们再实现其中的组件代码，完成界面效果。接下来我们将组件进行命名，将表格 1 根据上图的设计重新修改下，如表格 2 。

![image (15).png](https://s0.lgstatic.com/i/image/M00/26/C9/Ciqc1F7zAgaAJ59xAABi3IF6Ycw572.png)  
表格 2 最终组件设计结构

接下来我们就使用代码去实现这部分功能。

### 综合实践

根据表格 2 的设计结构，我们先将目录层级结构，以及相应目录下的文件创建好。因为在表格中，组件都已经命名好了，所以创建就比较简单，如图 5 所示的目录结构。图 5 中的 struct 用来做数据结构描述，类似 TypeScript 中的 interface 作用，避免因为数据结构问题导致的异常。

![image (16).png](https://s0.lgstatic.com/i/image/M00/26/C9/Ciqc1F7zAg2AAeVzAACV_ulkeyM179.png)  
图 5 组件目录结构

接下来我先从底层组件依次实现，其次将组件的数据都作为参数传递进来即可。下面的代码，我只介绍核心部分，其他代码大家可以参考 Github 中的 06 课时源码。

#### 基础组件

下面我们主要看几个核心的组件实现。

**article\_like\_bar**

该组件包括点赞数动态变量的声明以及点赞行为（点赞行为中触发的逻辑是，增加点赞数 state 的值）两部分内容，具体代码实现如下：

    import 'package:flutter/material.dart';
    /// 帖子文章的赞组件
    ///
    /// 包括点赞组件 icon ，以及组件点击效果
    /// 需要外部参数[likeNum],点赞数量
    class ArticleLikeBar extends StatefulWidget {
      /// 外部传入参数
      final int likeNum;
      /// 构造函数
      const ArticleLikeBar({Key key, this.likeNum}) : super(key: key);
      @override
      createState() => ArticleLikeBarState();
    }
    /// 帖子d文章的赞组件的状态管理类
    ///
    /// 内部包括组件的点赞效果，点击后触发数字更新操作
    /// [likeNum] 为状态组件可变数据
    class ArticleLikeBarState extends State<ArticleLikeBar> {
      /// 状态 state
      int likeNum;
      @override
      void initState() {
        super.initState();
        likeNum ??= widget.likeNum;
      }
      /// 点赞动作效果，点击后[likeNum]加1
      void like() {
        setState(() {
          likeNum = ++likeNum;
        });
      }
      /// 有状态类返回组件信息
      @override
      Widget build(BuildContext context) {
        return Row(
          children: <Widget>[
            Icon(Icons.thumb_up, color: Colors.grey, size: 18),
            Padding(padding: EdgeInsets.only(left: 10)),
            FlatButton(
              child: Text('$likeNum'),
              onPressed: () => like(),
            ),
          ],
        );
      }
    }
    

学到本课时，除了 build 中的部分代码比较陌生，其他部分的代码应该是非常熟悉的，因此这里简单介绍了 build 中的逻辑。build 中使用了 Row 布局组件，然后包含了三个最基础组件：Icon、Padding 和 FlatButton ，而 FlatButton 中又包含了基础组件 Text ，总结下 build 主要是完成界面组件组合以及增加组件交互行为这两方面的逻辑。

#### 二级组件

上面介绍了一个一级组件的代码，我们再来看一个二级组件 article\_card 的代码实现，在表格 2 中，可以看到其需要引入三个一级组件，因此在头部需要引入代码如下：

    import 'package:flutter/material.dart';
    import 'package:two_you/util/struct/article_summary_struct.dart';
    import 'package:two_you/util/struct/user_info_struct.dart';
    import 'package:two_you/widgets/home_page/article_bottom_bar.dart';
    import 'package:two_you/widgets/home_page/article_like_bar.dart';
    import 'package:two_you/widgets/home_page/article_summary.dart';
    

第 1 行是 Flutter 基础组件，第 3 和 4 行是我们上面介绍的数据结构描述类库，第 6、7 和 8 行 则是三个一级组件的库。

因为 article\_card 是一个静态组件，所以只需要继承 StatelessWidget 。接下来实现 build 方法，由于子组件需要用户信息和帖子信息，所以该组件包含两个参数。

    /// 此为帖子描述类，包括了帖子UI中的所有元素
    class ArticleCard extends StatelessWidget {
      /// 传入的用户信息
      final UserInfoStruct userInfo;
      /// 传入的帖子信息
      final ArticleSummaryStruct articleInfo;
      /// 构造函数
      const ArticleCard({Key key, this.userInfo, this.articleInfo})
          : super(key: key);
      @override
      Widget build(BuildContext context) {
      }
    }
    

上面代码中的第 3 到 10 行是定义无状态类的参数以及构造函数，接下来我们看看 build 函数的实现，代码如下：

    @override
    Widget build(BuildContext context) {
      return Column(
        children: <Widget>[
          ArticleSummary(
              title: articleInfo.title,
              summary: articleInfo.summary,
              articleImage: articleInfo.articleImage),
          Row(
            children: <Widget>[
              ArticleBottomBar(
                  nickname: userInfo.nickname,
                  headerImage: userInfo.headerImage,
                  commentNum: articleInfo.commentNum),
              ArticleLikeBar(likeNum: articleInfo.likeNum),
            ],
          ),
        ],
      );
    }
    

UI 稿中包含两部分内容展示，第一部分是帖子的概要信息，第二部分是帖子的相关作者以及点赞评论信息，因此可以使用垂直组件 Column ，竖着排列这两部分内容。由于在状态栏这一行中又包含有作者信息和评论点赞信息，因此使用 Row 组件包裹两个一级组件 ArticleBottomBar 和 ArticleLikeBar 。这样就完成了该组件无状态类组件的设计，我们看下整个代码实现。

    import 'package:flutter/material.dart';
    import 'package:two_you/util/struct/article_summary_struct.dart';
    import 'package:two_you/util/struct/user_info_struct.dart';
    import 'package:two_you/widgets/home_page/article_bottom_bar.dart';
    import 'package:two_you/widgets/home_page/article_like_bar.dart';
    import 'package:two_you/widgets/home_page/article_summary.dart';
    /// 此为帖子描述类，包括了帖子UI中的所有元素
    class ArticleCard extends StatelessWidget {
      /// 传入的用户信息
      final UserInfoStruct userInfo;
      /// 传入的帖子信息
      final ArticleSummaryStruct articleInfo;
      /// 构造函数
      const ArticleCard({Key key, this.userInfo, this.articleInfo})
          : super(key: key);
      @override
      Widget build(BuildContext context) {
        return Column(
          children: <Widget>[
            ArticleSummary(
                title: articleInfo.title,
                summary: articleInfo.summary,
                articleImage: articleInfo.articleImage),
            Row(
              children: <Widget>[
                ArticleBottomBar(
                    nickname: userInfo.nickname,
                    headerImage: userInfo.headerImage,
                    commentNum: articleInfo.commentNum),
                ArticleLikeBar(likeNum: articleInfo.likeNum),
              ],
            ),
          ],
        );
      }
    }
    

#### 页面组件

其他组件的开发方式按照上面一个无状态组件和一个有状态组件的方式开发即可，最后再看下页面组件 home\_page.dart ，因为这是一个静态组件页面，所以相对较为简单，代码如下：

    import 'package:flutter/material.dart';
    import 'package:two_you/util/struct/article_summary_struct.dart';
    import 'package:two_you/util/struct/user_info_struct.dart';
    import 'package:two_you/widgets/common/banner_info.dart';
    import 'package:two_you/widgets/home_page/article_card.dart';
    /// 首页列表信息
    ///
    /// 展示banner和帖子信息
    class HomePage extends StatelessWidget {
      /// banner 地址信息
      final String bannerImage =
          'https://img.089t.com/content/20200227/osbbw9upeelfqnxnwt0glcht.jpg';
      /// 帖子标题
      final UserInfoStruct userInfo = UserInfoStruct('flutter',
          'https://i.pinimg.com/originals/1f/00/27/1f0027a3a80f470bcfa5de596507f9f4.png');
      /// 帖子概要描述信息
      final ArticleSummaryStruct articleInfo = ArticleSummaryStruct(
          '你好，交个朋友',
          '我是一个小可爱',
          'https://i.pinimg.com/originals/e0/64/4b/e0644bd2f13db50d0ef6a4df5a756fd9.png',
          20,
          30);
      @override
      Widget build(BuildContext context) {
        return Container(
          child: Column(
            children: <Widget>[
              BannerInfo(bannerImage: bannerImage),
              ArticleCard(
                userInfo: userInfo,
                articleInfo: articleInfo,
              ),
            ],
          ),
        );
      }
    }
    

*   import 库，import 库包括 Flutter 基础库，两个数据结构类定义库，以及 banner 组件和 articile\_card 库；
    
*   初始化几个本次测试需要的数据，banner 数据、userInfo 数据和 article 内容数据；
    
*   build 返回组件内容，使用 Column 垂直排列 banner 组件和 article 组件。
    

以上就实现了该组件的所有功能点，首先还是运行代码检查工具，使用下面的运行命令。

    sh format_check.sh
    

确认代码无误后，再打开手机模拟器，运行程序，即可看到图 6 的界面效果。

![image (17).png](https://s0.lgstatic.com/i/image/M00/26/CA/Ciqc1F7zAi6AIamAAAnwMrGReX8255.png)  
图 6 应用运行效果

### 总结

本课时介绍了有无状态组件的一些特点以及在组件设计选择的时候需要注意的规则，接下来实践了组件设计的方法。学完本课时你应该掌握界面的组件设计思想，并根据组件设计实现具体的交互界面。

以上就是本课时的所有内容，下一课时我将介绍 Flutter 中有状态组件的状态管理，学完本课时以及下一课时，你将可以掌握复杂的交互界面开发技巧。

[点击此链接查看本课时源码](https://github.com/love-flutter/flutter-column)