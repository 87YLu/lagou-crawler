本课时，我将在导航栏基础上，设计一个 APP 首页推荐列表，以此来讲解 Flutter 中内容多样式的展示方式。

列表的多样式包含内容+缩略图、图片九宫格以及单图信息流。接下来我将逐一讲解这三种类型的设计和实现原理。

### 前期准备

本课时中的列表多样式会涉及 Flutter 控件 ListView ，该控件包含了多个构造函数，比如：默认构造函数、builder、separated 和 custom。

#### ListView

ListView 下四种构造函数的使用场景都不相同，比如：

*   ListView 默认构造函数，适用于有限的小列表内容展示，一次性创建所有项目；
    
*   ListView.builder 构造函数用于处理包含大量数据的列表，其次它会在列表项滚动到屏幕上时创建该列表项；
    
*   ListView.separated 相比 ListView.builder 多了一个分隔符，其次更适用于固定项列表；
    
*   ListView.custom 可以自定义列表结构，使用场景不多，但是 ListView.builder 与 ListView.separated 都是基于 ListView.custom 来实现的。
    

本课时因为是一个固定有限的列表，更适用于 ListView.separated ，因此本课时基于 ListView.separated 来讲解，这里我介绍下该控件的参数列表。

    ListView.separated({
      Key key,
      Axis scrollDirection = Axis.vertical, // 滑动方向，垂直
      bool reverse = false, // 是否倒序
      ScrollController controller, // 控制滚动和监听滚动事件变化
      bool primary, // false内容不足不滚动，true一直可滚动
      ScrollPhysics physics, // 列表滚动方式设置
      bool shrinkWrap = false, // item高度适配
      EdgeInsetsGeometry padding, // padding设置
      @required IndexedWidgetBuilder itemBuilder, // 设置列表内容
      @required IndexedWidgetBuilder separatorBuilder, // 设置分割内容
      @required int itemCount, // 总数量
      bool addAutomaticKeepAlives = true,  // 该属性表示是否将列表项（子组件）包裹在AutomaticKeepAlive 组件中，主要是为了避免被垃圾回收
      bool addRepaintBoundaries = true, // 该属性表示是否将列表项（子组件）包裹在addRepaintBoundaries 组件中，为了避免重绘
      bool addSemanticIndexes = true, // 该属性表示是否将列表项（子组件）包裹在addSemanticIndexes 组件中，用来提供无障碍语义
      double cacheExtent, // 设置预加载区域
    })
    

根据以上的配置信息，我们设置了一个比较通用的配置，如下。

    ListView.separated(
      scrollDirection: Axis.vertical,
      shrinkWrap: true,
      itemCount: contentList.length,
      itemBuilder: (BuildContext context, int position) {
        return (Widget);
      },
      separatorBuilder: (context, index) {
        return Divider(
          height: .5,
          //indent: 75,
          color: Color(0xFFDDDDDD),
        );
      },
    )
    

上面代码配置中，scrollDirection 设置为垂直滚动，shrinkWrap 设置为高度适配，separatorBuilder 使用灰色线条分割每列数据。

以上就是 ListView 控件的一些基本知识，介绍完基本的知识点后，我们还需要做一些编码方面的前期准备。由于该交友 APP，在列表展示的是推荐帖子，因此需要使用到相应的帖子内容相关的数据结构。根据交友 APP 的数据需要，我们设计交友帖子对应的数据结构模块 Struct 、相应获取推荐帖子内容的 API 接口以及需要状态共享的 Model。

#### Struct

首页推荐的交友帖子数据，涉及三个具体内容：用户信息部分、交友帖子数据、帖子的评论信息。因此需要创建好三个对应的 Struct 文件。

1.user\_info.dart，对应为 StructUserInfo 类，其数据结果如下。

    /// 用户信息
    ///
    /// {
    ///   "nickname" : "string",
    ///   "headerUrl" : "string",
    ///   "uid" : "string"
    /// }
    class StructUserInfo {
      /// 标题
      final String nickName;
      /// 简要
      final String headerUrl;
      /// 主要内容
      final String uid;
      /// 默认构造函数
      const StructUserInfo(
          this.uid,
          this.nickName,
          this.headerUrl
          );
    }
    

2.content\_detail.dart，对应为 StructContentDetail 类，其数据结构比较长，我们这里只是给个 JSON 的例子，代码如下。

    {
       "id" : "string",
       "title" : "string",
       "summary" : "string",
       "detailInfo" : "string",
       "uid" : "string",
       "userInfo" : "StructUserInfo",
       "articleImage" : "string",
       "likeNum" : "int",
       "commentNum" : "int"
    }
    

3.comment\_info.dart，对应为 StructCommentInfo 类，代码如下。

    import 'package:two_you_friend/util/struct/user_info.dart';
    /// 用户信息
    ///
    /// {
    ///   "userInfo" : "StructUserInfo",
    ///   "comment" : "string"
    /// }
    class StructCommentInfo {
      /// 用户的昵称
      final StructUserInfo userInfo;
      /// 用户头像信息
      final String comment;
      /// 构造函数
      const StructCommentInfo(this.userInfo, this.comment);
    }
    

#### API

有了以上基础的数据结构后，我们再来开发对应具体的 API，通过 API 部分拉取具体的首页推荐的帖子列表。在 API 文件夹中创建一个 content 文件夹，并且在 content 文件夹中创建 index.dart API 文件类，在该类中创建三个方法（这里使用的是假数据，未真正的调用服务端）。

1.getOneById，根据内容 ID 拉取内容详情

    /// 根据内容id拉取内容详情
    StructContentDetail getOneById(String id) {
       StructContentDetail detailInfo = StructContentDetail(
          '1001',
          'hello test',
          'summary',
          'detail info ${id}',
          '1001',
          1,
          2,
          'https://i.pinimg.com/originals/e0/64/4b/e0644bd2f13db50d0ef6a4df5a756fd9.png'
       );
       StructUserInfo userInfo = ApiUserInfoIndex.getOneById(detailInfo.uid);
       return StructContentDetail(
           detailInfo.uid, detailInfo.title,
           detailInfo.summary, detailInfo.detailInfo,
           detailInfo.uid, detailInfo.likeNum,detailInfo.commentNum,
           detailInfo.articleImage, userInfo: userInfo
       );
    }
    

上面代码获取到初始的单条内容，然后基于用户信息的 API 补全用户信息部分，返回 StructContentDetail 数据结构。

2.getRecommendList，获取首页推荐的内容列表

    List<StructContentDetail> getRecommendList() {
      return [
       StructContentDetail(...),
       StructContentDetail(...),
      ]
    }
    

这部分代码就比较简单，获取具体的推荐内容列表，并返回 List`<StructContentDetail>` 列表数据。

3.getFollowList，获取关注人的内容列表

这部分和 getRecommendList 方法实现完全一样，其中拉取的只是关注人的帖子列表。

#### Model

这里只涉及我们第 07 课时所演示例子的知识点——应用 Provider 来实现状态管理。实现原理一样，唯一不同点是这里需要保存多个帖子的点赞数量，因此需要将这个状态变量设计为一个 Map，其次需要将 get 方法进行修改，使用帖子 id 作为键名。下面为部分代码，其他部分代码请查看 github 源码。

    import 'package:flutter/material.dart';
    /// name状态管理模块
    class LikeNumModel with ChangeNotifier {
      /// 声明私有变量
      Map<String, int> _likeInfo;
      /// 设置get方法
      int getLikeNum(String articleId, [int likeNum = 0]) {
        if(_likeInfo == null){
          _likeInfo = {};
        }
        if(articleId == null){
          return likeNum;
        }
        if(_likeInfo[articleId] == null) {
          _likeInfo[articleId] = likeNum;
        }
    
        return _likeInfo[articleId];
      }
    }
    

接下来我们就具体看下这三种列表样式的实现原理。

### 内容+缩略图

这种样式的列表内容较为常见，每一条信息包含帖子的标题和简要信息，右侧为一个缩略图，底部栏为头像、点赞和评论相关内容，具体效果截图如下图 1。

![图片1.png](https://s0.lgstatic.com/i/image/M00/33/F0/CgqCHl8RIO-AVjCIAANJnR6nMPc935.png)

#### 组件设计

按照我们 06 课时的知识点，我们需要将界面的组件进行拆解分析，由于这部分我们在 06 课时也分析过，因此这里比较快速地分析出下面的一个组件树，如图 2 所示。

![图片2.png](https://s0.lgstatic.com/i/image/M00/33/F0/CgqCHl8RIPyAE8_gAALBPW0-Bj0112.png)

#### 实现原理

组件部分的实现逻辑，我们在 06 课时已经详细介绍过，这里就不一一细讲。接下来我们主要说下列表部分的实现，核心代码在 home\_page/index.dart 中，首先还是 import 对应需要的库和组件库。

    import 'package:flutter/material.dart';
    import 'package:two_you_friend/api/content/index.dart';
    import 'package:two_you_friend/widgets/home_page/article_card.dart';
    import 'package:two_you_friend/util/struct/content_detail.dart';
    

其中的 API 为我们拉取内容的接口， article\_card 为我们每条展示的内容的组件， content\_detail 则为 Struct 类。

为了后续动态内容的需要，这里将该类设计为一个有状态类。

    /// 首页
    class HomePageIndex extends StatefulWidget {
      /// 构造函数
      const HomePageIndex({Key, key});
      @override
      createState() => HomePageIndexState();
    }
    /// 具体的state类
    class HomePageIndexState extends State<HomePageIndex> {
      /// 首页推荐帖子列表
      List<StructContentDetail> contentList;
      @override
      void initState() {
        super.initState();
        // 拉取推荐内容
        setState(() {
          contentList = ApiContentIndex().getRecommendList();
        });
      }
      @override
      Widget build(BuildContext context) {
      }
    }
    

上面代码中的第 20 行就是通过 API 去拉取具体的推荐内容列表，并使用 setState 来触发界面更新。接下来再看下 build 逻辑，在列表展示部分，我们需要使用到 ListView.separated 控件，下面看下这部分的核心代码。

    @override
    Widget build(BuildContext context) {
      return ListView.separated(
        scrollDirection: Axis.vertical,
        shrinkWrap: true,
        itemCount: contentList.length,
        itemBuilder: (BuildContext context, int position) {
          return ArticleCard(articleInfo: this.contentList[position]);
        },
        separatorBuilder: (context, index) {
          return Divider(
            height: .5,
            //indent: 75,
            color: Color(0xFFDDDDDD),
          );
        },
      );
    }
    

其他部分与我们一开始介绍的 ListView.separated 标准部分相同，唯一不同的就是在 itemBuilder 做了组件的插入，这里针对每个数组元素所进行的操作，都是返回一个 article\_card 组件。

以上就完成了一个内容+缩略图组件的设计，接下来我们看下大图列表的设计。

### 大图列表

大图列表是一个大小图穿插的功能，可以分为三个一行插入，奇数行显示大小图组合，偶数行显示三小图组合。其中在大小图组合中，大图位置随机为第一个或者最后一个，具体效果如图 3 所示。

![图片3.png](https://s0.lgstatic.com/i/image/M00/33/E5/Ciqc1F8RIRaAUc1mAAfclNZgPPA347.png)

#### 组件设计

根据上面的规则，我们将三个图片分为一组，则存在 2 种组件组合规则，如图 4 所示的左右图的两个组合规则。图 4 左边为三小图并列组合规则，图 4 右侧为大小图组合规则，其次这部分还可能出现两种情况，第一种是第一个为大图，第二种是最后一个为大图，也就是“大小小”和“小小大”组件组合规则。

![图片4.png](https://s0.lgstatic.com/i/image/M00/33/E5/Ciqc1F8RISOAdHsLAAHLoId25k8599.png)

#### 实现原理

我们创建 home\_page/img\_flow.dart 来表示这个大图列表组件的页面。然后为这个页面增加一个跳转入口，修改 11 课时中的左侧菜单栏文件 draw.dart ，将菜单名称修改为图片流，并且跳转到 tyfapp://imgflow 这个地址（这里需要去 router 中注册 imgflow 路由，注册方法如下代码的第 10 行）。

    /// 路由配置信息
    /// widget 为组件
    /// entranceIndex 为首页位置，如果非首页则为-1
    /// params 为组件需要的参数数组
    const Map<String, StructRouter> routerMapping = {
      'homepage': StructRouter(HomePageIndex(), 0, null),
      'userpage': StructRouter(UserPageIndex(), 2, ['userId']),
      'contentpage': StructRouter(ArticleDetailIndex(), -1, ['articleId']),
      'default': StructRouter(HomePageIndex(), 0, null),
      'imgflow': StructRouter(HomePageImgFlow(), -1, null),
      'singlepage': StructRouter(HomePageSingle(), -1, null)
    };
    

接下来实现 HomePageImgFlow 这个类，首先还是导入相应的组件库、 Struct 以及 API 接口，代码如下：

    import 'package:flutter/material.dart';
    import 'package:two_you_friend/api/content/index.dart';
    import 'package:two_you_friend/util/struct/content_detail.dart';
    import 'package:two_you_friend/widgets/home_page/img_card.dart';
    

然后开始创建有状态类 HomePageImgFlow ，并在 initState 中拉取接口数据。

    /// 九宫格首页
    class HomePageImgFlow extends StatefulWidget {
      /// 构造函数
      const HomePageImgFlow({Key, key});
      @override
      createState() => HomePageImgFlowState();
    }
    /// 具体的state类
    class HomePageImgFlowState extends State<HomePageImgFlow> {
      /// 首页推荐帖子列表
      List<StructContentDetail> contentList;
      @override
      void initState() {
        super.initState();
        // 拉取推荐内容
        setState(() {
          contentList = ApiContentIndex().getRecommendList();
        });
      }
      @override
      Widget build(BuildContext context) {
      }
    }
    

上面代码和第一部分内容+缩略图的实现原理基本一致，在 build 方法中，除了 itemBuilder 逻辑不一样，其他实现均一样，所以我们主要看下 itemBuilder 代码。

    @override
    Widget build(BuildContext context) {
      List<StructContentDetail> tmpList = [];
      return ListView.separated(
        scrollDirection: Axis.vertical,
        shrinkWrap: true,
        itemCount: contentList.length,
        itemBuilder: (BuildContext context, int position) {
          if (position % 3 == 0) {
            // 起始位置初始赋值
            tmpList = [this.contentList[position]];
          } else {
            // 非初始则插入列表
            tmpList.add(this.contentList[position]);
          }
          // 判断数据插入时机，如果最后一组或者满足三个一组则插入
          if (position == contentList.length - 1 || (position + 1) % 3 == 0) {
            return ImgCard(
                position: position,
                articleInfoList: tmpList,
                // 确认是否为最后数据，最后数据无须处理大小图问题
                isLast: position == contentList.length - 1);
          }
          return Container();
        },
        separatorBuilder: (context, index) {
          return Divider(
            height: .1,
            //indent: 75,
            color: Color(0xFFDDDDDD),
          );
        },
      );
    }
    

上面代码第 3 行，初始化定义了一个临时数组，该数组用来保存临时需要插入的列表，代码的第 10 行判断是否为 3 的倍数位置，例如第 0 、3 、6，对于这些位置需要将 tmpList 重新赋值，如果非这些位置，则往 tmpList 插入。

代码第 19 行则判断 tmpList 是否满足 3 个，或者是否为最后一组，如果满足两个条件的任意一个则返回 ImgCard 组件，如果不是则返回一个空元素控件。

接下来我们来看下 ImgCard 中的 build 代码。

    @override
    Widget build(BuildContext context) {
      if (isLast) {
        return withSmallPic(context);
      }
      if ((position + 1) % 6 == 3) {
        return withBigPic(context);
      } else {
        return withSmallPic(context);
      }
    }
    

上面代码中的第 3 行是判断是否为最后一组，最后一组则使用小图模式，如果是奇数组则使用大图模式，是偶数组则使用小图模式。小图模式的实现比较简单，使用 flex 布局，并列显示三个即可。这里我们看下实现大图模式的代码。

    return Row(
      children: <Widget>[
        Expanded(
          flex: 6,
          child: getFlatImg(context, articleInfoList[0], 200),
        ),
        Expanded(
          flex: 3,
          child: Column(
            children: <Widget>[
              getFlatImg(context, articleInfoList[1]),
              Padding(padding: EdgeInsets.only(top: 2)),
              getFlatImg(context, articleInfoList[2]),
            ],
          ),
        ),
      ],
    );
    

这个组件布局也是使用 flex 来实现，大图占 6 小图占 3，其次小图使用 Column 控件来列表显示。  
以上就完成了大图列表的实现方式，接下来我们再看下单信息流模式。

### 单信息流

单信息流模式有点类似于目前比较流行的短视频应用，在这里我们用简单的方式来介绍下实现原理。单信息流模式使用图片作为背景，右侧为头像、评论和点赞信息，最底部显示帖子的标题和摘要部分，效果如图 5 所示。

![图片5.png](https://s0.lgstatic.com/i/image/M00/33/E5/Ciqc1F8RIUWAJaWRAAQ7AhPuYYY687.png)

#### 组件设计

根据图 5 的效果图，我们按照 06 课时的知识点，绘制出图 6 的一个组件树。

![图片6.png](https://s0.lgstatic.com/i/image/M00/33/E5/Ciqc1F8RIVKAZyj1AAJ_M5lRbOU489.png)

完成组件设计后，我们再根据组件树创建相应组件，以及实现相应组件代码。

#### 实现原理

我们创建 home\_page/single.dart 来表示这个单信息流组件的页面，然后修改最开始的左侧菜单栏文件 draw.dart ，再修改第二个菜单为单图片信息，并且跳转到 tyfapp://singlepage 这个地址（这里需要去 router 中注册 singlepage 路由，具体注册的代码部分，在上面大图列表中已经说明）。

接下来实现 HomePageSingle 这个类，首先还是导入相应的组件库、 Struct 以及 API 接口，代码如下：

    import 'package:flutter/material.dart';
    import 'package:two_you_friend/api/content/index.dart';
    import 'package:two_you_friend/widgets/home_page/single_bottom_summary.dart';
    import 'package:two_you_friend/widgets/home_page/single_like_bar.dart';
    import 'package:two_you_friend/widgets/home_page/single_right_bar.dart';
    import 'package:two_you_friend/util/struct/content_detail.dart';
    

接下来创建有状态类组件，并且在 initState 中获取接口数据，并初始化赋值。

    /// 单个内容首页
    class HomePageSingle extends StatefulWidget {
      /// 构造函数
      const HomePageSingle({Key, key});
      @override
      createState() => HomePageSingleState();
    }
    /// 具体的state类
    class HomePageSingleState extends State<HomePageSingle> {
      /// index position
      int indexPos;
      /// 首页推荐帖子列表
      List<StructContentDetail> contentList;
      @override
      void initState() {
        super.initState();
        indexPos = 0;
        // 拉取推荐内容
        setState(() {
          contentList = ApiContentIndex().getRecommendList();
        });
      }
      @override
      Widget build(BuildContext context) {
      }
    

代码中的 indexPos 代表当前展示的内容位置，我们主要看下 build 逻辑的代码。

    return Container(
      height: MediaQuery.of(context).size.height,
      width: MediaQuery.of(context).size.width,
      decoration: BoxDecoration(
          image: DecorationImage(
              image: NetworkImage(contentList[indexPos].articleImage),
              fit: BoxFit.contain)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: <Widget>[
          SingleRightBar(
              nickname: contentList[indexPos].userInfo.nickName,
              headerImage: contentList[indexPos].userInfo.headerUrl,
              commentNum: contentList[indexPos].commentNum),
          SingleLikeBar(
              articleId: contentList[indexPos].id,
              likeNum: contentList[indexPos].likeNum),
          SingleBottomSummary(
            articleId: contentList[indexPos].id,
            title: contentList[indexPos].title,
            summary: contentList[indexPos].summary,
          ),
        ],
      ),
    );
    

代码中的第 4 行就是为了设置背景图片，代码第 11 到第 22 行就是加载我们图 6 中的三个组件。三个组件中我们就只看 single\_like\_bar 组件的实现，其他两个组件实现原理较为简单，这个组件由于涉及状态管理，因此稍微复杂一些，所以着重说明下。接下来我们看下具体的逻辑实现过程。

第一步导入相应的组件库和第三方库。

    import 'package:flutter/material.dart';
    import 'package:provider/provider.dart';
    import 'package:two_you_friend/model/like_num_model.dart';
    import 'package:two_you_friend/styles/text_syles.dart';
    

第二步创建 SingleLikeBar 并且定义其初始化需要的参数，代码如下。

    /// 帖子文章的赞组件
    ///
    /// 包括点赞组件 icon ，以及组件点击效果
    /// 需要外部参数[likeNum],点赞数量
    /// [articleId] 帖子的内容
    class SingleLikeBar extends StatelessWidget {
      /// 帖子id
      final String articleId;
      /// like num
      final int likeNum;
      /// 构造函数
      const SingleLikeBar({Key key, this.articleId, this.likeNum})
          : super(key: key);
      /// 返回组件信息
      @override
      Widget build(BuildContext context) {
      }
    }
    

最后看一下 build 逻辑的代码实现，基本和原来没有太大区别，只是在 Icon 和 Text 展示上从 Row 控件修改为 Column 控件。

    /// 返回组件信息
    @override
    Widget build(BuildContext context) {
      final likeNumModel = Provider.of<LikeNumModel>(context);
      return Container(
        width: 50,
        child: FlatButton(
          padding: EdgeInsets.only(top: 10),
          child: Column(
            children: <Widget>[
              Icon(Icons.thumb_up, color: Colors.grey, size: 36),
              Padding(padding: EdgeInsets.only(top: 2)),
              Text(
                '${likeNumModel.getLikeNum(articleId, likeNum)}',
                style: TextStyles.commonStyle(),
              ),
            ],
          ),
          onPressed: () => likeNumModel.like(articleId),
        ),
      );
    }
    

上述代码是 07 课时已经详细介绍过的部分，其中没有太大的区别，这里需要介绍下 Container 的目的是限制 FlatButton 的大小，避免 FlatButton 产生一些 margin 引起布局问题。以上就完成了单信息流组件的一个设计。

### 总结

以上就是本课时的所有内容，学完本课时，你要掌握 ListView.separated 的应用，并且了解 ListView 其他构造函数的使用。你要熟练应用 ListView.separated 实现三种内容展示的样式实现方法，并且能进一步熟悉界面效果转化组件设计的实践方法。

本课时已经完成了首页推荐内容，但是还缺乏内容的更新机制，下一课时我将介绍下拉刷新当前数据以及上拉更新列表数据的功能。谢谢。

[点击此链接查看本课时源码](https://github.com/love-flutter/flutter-column)