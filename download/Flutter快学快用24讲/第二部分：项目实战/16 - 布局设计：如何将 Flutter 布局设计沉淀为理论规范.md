前面课时只介绍了组件设计，并没有过多涉及布局的讲解，可能你了解一些布局组件，比如 Container、Row、Column、Padding、Center 等，但是对于如何从 UI 稿到组件再到布局，却没有非常清晰的思路。本课时就从我的角度来分析，如何进行组件的布局。

### 常见布局组件

在 Flutter 中可以分为 Single-child layout widgets 和 Multi-child layout widgets ，使用中文来解释就是单个子元素的布局组件和多个子元素的布局组件。

#### Single-child

常见单个子组件的有 Align、Padding、 Expanded 和 Container 。

*   Align 比较好理解，Align 组件的位置左、右、上、下、左上、右下、左下、右上，这两者一般配合 Container 来使用。
    
*   Padding 是一个可以设置上下和左右填充的组件，在布局设计中也非常常见。
    
*   Expanded 是一个可伸缩的容器，可以根据子组件的大小进行动态伸缩，这个需要配合 Row 组件的 flex 布局使用，其次也可以作为动态列表的父组件，避免列表超出界面，引起布局问题。
    
*   Container 是比较常用的，类似一个容器，可以设置容器的大小，然后将子元素包裹在容器中，该组件在超出容器后，会容易引起布局问题。
    

#### Multi-child

常见的多个子组件有 Row、Column 和 Stack。

*   Row 是横排展示子组件。
    
*   Column 是竖排展示子组件。
    
*   Stack 是层叠展示子组件。
    

以上具体每个组件的参数配置，大家可以在[官网](https://flutter.cn/docs/development/ui/widgets/layout)查到，官网还有一些不常用的，但也比较实用的布局组件，这里就不详细列出了。

### 布局思想

将布局的思想总结为八个字：**竖、横、高、宽、上、下、左、右。** 也就是一个页面出来以后，按照这八个字的先后去分析页面的布局。那么我们具体来看下，八个字中会涉及哪些布局组件的应用。

#### 竖和横

根据设计好的组件树，从上往下分析，遇到块状不同内容组，则设计为一个 Column 的子元素。例如图 2 的一个界面，从上往下分析，我们可以得到 6 个 Column 布局组件的子组件（这里为了演示效果，我们把组件也设计为 6 个部分）。

![Drawing 0.png](https://s0.lgstatic.com/i/image/M00/3B/70/CgqCHl8j_LCAP9HUAAHcncNZZmY563.png)

图 1 帖子详情页

分析完成以后，我们再来看下每一行组件中所涉及的子组件。行子组件一般也是基于：Container、Row、Center 等布局组件来实现的，根据图 1 的效果，我们来分析：

*   第一部分是居中的文章标题，可以使用 Center 组件；
    
*   第二部分是一条横线，可以使用 Divider 来绘制一条分割直线；
    
*   第三部分是用户信息，因为横着是有两个组件，所以使用 Row；
    
*   第四部分是文章内容，这里使用 Container 包裹一个 Text 组件；
    
*   第五部分是文章图片，这里也使用 Container 包裹一个 Image 组件；
    
*   第六部分是一个组件，这个组件内部竖看也是两个组件，因此需要使用 Column 组件。
    

根据以上规则我们就可以设计出一个 pages 的页面了，代码如下：

    return Column( 
      children: <Widget>[ 
        ArticleDetailTitle(title: contentDetail.title), 
        Divider(), 
        ArticleDetailUserInfoBar(userInfo: contentDetail.userInfo), 
        ArticleDetailContent(content: contentDetail.detailInfo), 
        ArticleDetailImg(articleImage: contentDetail.articleImage), 
        ArticleDetailLike(articleId: id, likeNum: contentDetail.likeNum) 
      ], 
    );
    

#### 高和宽

接下来我们分析好每个组件所占用的高和宽，这部分可以在组件的 Container 属性中设置，有些组件也自带高和宽属性。例如上面的 Divider 组件我们就需要设置高和宽，代码如下：

    return Column( 
      children: <Widget>[ 
        ArticleDetailTitle(title: contentDetail.title), 
        Divider( 
            height: 1, 
            color: Colors.lightBlueAccent, 
            indent: 75, 
            endIndent: 75 
        ), 
        ArticleDetailUserInfoBar(userInfo: contentDetail.userInfo), 
        ArticleDetailContent(content: contentDetail.detailInfo), 
        ArticleDetailImg(articleImage: contentDetail.articleImage), 
        ArticleDetailLike(articleId: id, likeNum: contentDetail.likeNum), 
        ArticleDetailComments(commentList: []) 
      ], 
    );
    

上面代码的第 5 行就是设置高，第 7 和第 8 行就是设置其宽度。

#### 上和下

设置完每个组件的高和宽后，我们再从上往下看。根据组件树，这里主要看 Column 组件下的所有子组件之间是否需要设置上下，如果需要则应用 Padding 来实现。为了效果，我们在 ArticleDetailContent 和 ArticleDetailUserInfoBar 之间增加一个 Padding 效果，代码如下：

    return Column( 
      children: <Widget>[ 
        ArticleDetailTitle(title: contentDetail.title), 
        Divider( 
            height: 1, 
            color: Colors.lightBlueAccent, 
            indent: 75, 
            endIndent: 75 
        ), 
        ArticleDetailUserInfoBar(userInfo: contentDetail.userInfo), 
        Padding(padding: EdgeInsets.only(top: 2)), 
        ArticleDetailContent(content: contentDetail.detailInfo), 
        ArticleDetailImg(articleImage: contentDetail.articleImage), 
        ArticleDetailLike(articleId: id, likeNum: contentDetail.likeNum), 
        ArticleDetailComments(commentList: []) 
      ], 
    );
    

#### 左和右

整体设置完成后，我们再来看下组件左右的间隔设置。这里主要看 Row 组件下的所有子组件，检查是否需要 Padding 属性。其次判断 Row 子组件是否需要设置左右占比，如果需要则使用到 flex 布局中的 Expanded 组件。比如上面组件中的 ArticleDetailUserInfoBar 需要左右布局设计，因此根据规则我们看下 ArticleDetailUserInfoBar 的代码逻辑。具体代码如下：

    @override 
    Widget build(BuildContext context) { 
      return Container( 
        color: Colors.white, 
        padding: EdgeInsets.all(8), 
        child: Row( 
          mainAxisAlignment: MainAxisAlignment.spaceBetween, 
          children: <Widget>[ 
            Expanded( 
              flex: 4, 
              child: Row(), 
            Expanded( 
              flex: 1, 
              child: Row(), 
          ], 
        ), 
      ); 
    }
    

上面的代码中可以看到该组件使用 Container 包裹，其次使用了 Row 组件，假设我们 UI 稿中的图 3 部分是左右 4 : 1 布局，因此在代码中第 10 行设置前面组件为 4 ，第 13 行设置后面组件为 1。

这样就完成了外部组件的设计，以上 6 个组件就可以写一部分伪代码去实现了。外部组件设计完成后，我们开始通过 8 个过程来进行子组件布局设计，对于其中的 8 个过程，并不是每个组件都需要，因此越到根节点布局设计过程会越少。

根据以上设计原则，我们就实现了帖子详情部分的布局设计。具体代码实现在 github 源码中的 pages/article\_detail/index.dart 中。接下来我将用上面的原则来设计我们 Two You Friend App 的“客人态主页”页面。

### 实践应用

我们先来看下我们需要实现的效果，如图 2 所示。  
![2.png](https://s0.lgstatic.com/i/image/M00/3B/66/Ciqc1F8kAQiAQlZeAAyBiY_2das872.png)

图 2 客人态页面

根据图 2 的界面我们还是先绘制一个组件树，如图 3 所示。  
![3.png](https://s0.lgstatic.com/i/image/M00/3B/72/CgqCHl8kARSAEVsNAAnCRb3Xg8U183.png)

图 3 客人态组件树设计

接下来，我们在图 3 的基础上，应用布局设计的 8 个过程，一步步来优化这个组件树。

#### 竖和横

竖着来看四个组件分别为 guest 的 Column 子组件，因此需要标记为 Column。然后再横着看每个子组件：

*   guest\_header，包含两部分左边为 user\_info 组件（其中又包含 Image 和 Text），右边为 Icon 组件；
    
*   Divider，是一条分割线；
    
*   guest\_bar，包含了三个并列的组件，分别是 Icon、Icon 和 Text；
    
*   content\_list，这个应用 article\_card 子组件即可，该组件已经在前面介绍过具体设计。
    

分析完后，我们将会得到图 4 组件树。

![Drawing 3.png](https://s0.lgstatic.com/i/image/M00/3B/70/CgqCHl8j_UCAYzQpAAC8p58g-Ys713.png)

图 4 组件树+布局设计

从图 4 我们可以看到，在组件与组件之间增加了布局组件的应用 Column 、Row 和 Expanded。

#### 高和宽

上面组件中，有两个组件是需要设置的，一个是 Divider ，一个是 content\_list 。后者需要设置的目的是，因为列表组件超出会引起布局异常。因此 content\_list 是需要使用 Expanded 来包裹，这部分可以不体现在界面中。

#### 上和下

由于图 2 这里就没有需要设置上下的间隔，因此组件图也不需要修改。这里主要看每个 Column 组件下的子节点。

#### 左和右

根据这个规则，我们看下每个 Row 组件下的子节点之间是否需要设置 Padding 。根据 UI 稿分析，我们可以了解到 user\_info 和 guest\_bar 组件的子组件都需要设置左右填充，因此在图 2 基础上，我们增加 Padding 布局设计，并重新绘制组件图，可以最终得到图 5 的一个组件+布局的设计结果。

![Drawing 5.png](https://s0.lgstatic.com/i/image/M00/3B/70/CgqCHl8j_YeAGTGoAADPvQkoceM879.png)

图 5 组件树+布局设计结果

在将组件树和布局设计完成后，我们再去进行组件的代码编写，这部分代码大家可以前往 github 的源码的 pages/user\_page/guest.dart 文件中查看，具体的代码比较相似，这里就不过多介绍了。

### 总结

本课时介绍了几个常用的布局组件和布局设计的思想（8 个过程），最后通过实现“客人态主页“来实践组件树+布局的设计思想。相关页面的知识点就介绍完了，接下来我会在源码中更新其他界面内容，对于比较核心的一些知识点我们还会在 18 课时中介绍，其他重复知识点，就不再介绍了。

下一课时我们将带着现有的 Two You Friend App 代码，教大家如何打包 Android 和 iOS 发布包。

[点击此链接查看本课时源码](https://github.com/love-flutter/flutter-column)