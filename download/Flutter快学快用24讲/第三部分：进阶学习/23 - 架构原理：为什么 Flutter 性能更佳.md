本课时将继续深入源码，学习 Flutter 渲染原理，特别是为什么 Flutter 可以保持比较好的性能体验。

### 性能优势

在这之前，业内一直都说 Flutter 的性能优于其他的跨端技术框架，并且基本与原生平台体验几乎一样。那么具体是怎么做到的呢？在了解 Flutter的自渲染原理之前，我们就先来看看原生平台 Android 与 iOS 是如何渲染 UI 的。经过前后对比之后，更能体现出其性能与原生几乎无差异的特点。

#### UI 渲染基本原理

我们先来讲解一个最基础的知识点，日常我们所看到的 UI 交互界面，操作系统是如何实现的，参考下图 1 的渲染过程。

![Drawing 0.png](https://s0.lgstatic.com/i/image/M00/46/CD/CgqCHl9GHCiAcll1AABzhn4c_Mc466.png)

图1 系统 UI 界面绘制原理

从图 1 我们可以看到，一个界面显示出来，首先是经过了 CPU 的数据计算，然后将数据发送给到 GPU， GPU 再根据相应的数据绘制成像素界面，然后放入帧缓存区中，最终显示器定时从帧缓存区获取帧数据显示在显示器上。

在上面的渲染实现过程中，需要进行 CPU 和 GPU 之间的通信。因此，如何调度 GPU 是一个比较关键的点，目前有一套规范叫作 OpenGL，开发者可以通过这套规范，更方便、更高效地调用 GPU进行界面渲染。Android 和iOS 系统都在系统层面实现了这套功能，将其分别封装成 SDK API。而在 Flutter 中也实现了这套规则，也就是应用 OpenGL 规范封装了一套 Dart API，因此 Flutter 的渲染原理和 Android 以及 iOS 是一致的，所以在性能上基本没有区别。

了解了 Flutter 渲染原理以后，我们再来看看目前比较常用的两个跨端框架的渲染原理。

#### 其他跨端技术框架渲染原理

目前比较常见的两个跨端技术框架，分别是 ReactNative 和 Weex。它们在原理上非常相近，因此这里单独介绍 ReactNative 的原理。我们先来看下图 2 的一个技术架构。

![Drawing 2.png](https://s0.lgstatic.com/i/image/M00/46/CD/CgqCHl9GHD6AMhMQAACUmX1O0GA575.png)

图2 ReactNative 技术架构图

从图 2 ，我们可以非常清晰地看到一点，ReactNative 完全是基于原生平台来进行渲染的，而这之间主要是通过 JSbridge 来通信，将需要渲染的数据通过 JSbridge 传递给原生平台。这样的通信方式在 Flutter 中也有，在我们第 20 课时“原生通信：应用原生平台交互扩充 Flutter 基础能力”中有介绍到，这部分和 ReactNative 比较相近。而两者的最大的区别就在于，**Flutter UI 界面是自渲染的，而 ReactNative 则是通过通信的方式告知原生平台，然后原生平台再绘制出界面。**。

我们再回到最原始的跨端技术框架 Hybrid ，它是界面上使用 H5 ，其他功能则使用 JSbridge 来调用原生服务，因此并不会使用原生绘制界面，而仅仅只使用了原生平台能力。

以上就是三种技术框架的对比说明，我们再来总结下三种框架突出解决的问题点，其次也说明当前框架存在的问题点。

*   Hybrid 是在图 2 中仅仅支持了原生能力，例如相机、存储、日历等，而 UI 交互界面则还是H5，因此不管是体验和性能都是相对较差的。
    
*   ReactNative为了解决页面性能问题，同样应用 JSbridge 通信方式，将虚拟 DOM 以及页面渲染相关数据，传递给到原生平台，原生平台则根据虚拟 DOM 以及渲染相关数据，绘制出原生体验的界面，这样用户感知上就是原生的界面，但是这个过程中需要进行 JavaScript的代码解析和运行，然后再与原生平台通信，从而有一定的性能损耗。
    
*   为了解决上述问题，Flutter 进一步优化了这种体验。Flutter 不借助原生的渲染能力，而是自己实现了一套与 Android 和 iOS 一样的渲染原理，从而在性能上与原生平台保持基本一致。不过这里由于目前 Flutter 只是一个 UI 框架，因此在原生功能方面还是需要依赖原生平台，这也是它存在的一些问题。
    

### 渲染原理

在了解了 Flutter 渲染原理的特殊性后，我们再具体看下整个绘制流程是如何实现的。上一课时我介绍了三棵树的转化过程，那么接下来就需要进一步去分析如何将三棵树渲染为 UI 交互界面。在介绍下转化的三棵树怎么绘制成 UI 交互界面之前，我们先来了解 vsync 这个概念。

#### vsync

从图 1 中我们看到视频控制器，会从帧缓存器中获取需要显示的帧数据，并展示在显示器上。显示器有一个刷新频率（比如 60 Hz 或者 120 Hz），代表的意思是显示器会每秒钟获取 60 帧的数据，也就是每隔 1000 ms / 60 = 16.67 ms 从视频控制器中定时获取帧数据。这个就是我们常说的一个概念“**垂直同步信号”（vsync）**。

Flutter 的自渲染模式也遵循这个原则，因此在Flutter的性能要求上，必须是 UI线程处理时间加上 GPU 绘制时间小于 16.67 ms 才不会出现掉帧现象。掌握了这个 vysnc 概念后，我们再来看看 Flutter 内部逻辑是如何实现的。

#### 渲染流程

整个绘制过程所涉及的核心函数流程，如图 3 所示。

![Drawing 3.png](https://s0.lgstatic.com/i/image/M00/46/C2/Ciqc1F9GHHWARkxZAAJL5Wf7xQQ911.png)

图3 绘制整体流程图

在图 3 的流程中会涉及几个比较重要的函数分别是 scheduleWarmUpFrame 、handleDrawFrame、drawFrame 、flushLayout 、 flushCompositingBits 、 markNeedsPaint 、 flushPaint 、 compositeFrame 和 flushSemantics。接下来我们就先来看下这些函数的作用。

#### 重要函数

*   **scheduleWarmUpFrame**，这个函数的核心是调用 handleBeginFrame和 handleDrawFrame 两个方法。
    
*   **handleDrawFrame**，主要是执行\_persistentCallbacks这个回调函数列表，\_persistentCallbacks 中存放了很多执行函数，其中存放了最重要的一个函数 RenderBing 的 drawFrame ，该方法主要是通过 WidgetsFlutterBinding 绑定阶段存放在 \_persistentCallbacks 中。
    
*   **drawFrame**，在函数中主要执行界面的绘制工作，依次会执行 flushLayout 、 flushCompositingBits、 flushPaint 、 compositeFrame 和 flushSemantics 函数。
    
*   **flushLayout**，更新了所有被标记为“dirty”的 RenderObject 的布局信息。主要的动作发生在 node.\_layoutWithoutResize() 方法中，该方法中会调用 performLayout() 进行重新布局计算，请注意这里的 performLayout 会根据不同类型的 RenderObject 调用不同的 performLayout 布局方法。该方法还会调用 markNeedsPaint 标记需要重新绘制的RenderObject，源码如下：
    

    while (_nodesNeedingLayout.isNotEmpty) {
      final List<RenderObject> dirtyNodes = _nodesNeedingLayout;
      _nodesNeedingLayout = <RenderObject>[];
      for (final RenderObject node in dirtyNodes..sort((RenderObject a, RenderObject b) => a.depth - b.depth)) {
        if (node._needsLayout && node.owner == this)
          node._layoutWithoutResize();
      }
    }
    

*   **flushCompositingBits**，主要是循环检查 RenderObject 以及子节点是否需要新建图层，如果需要则 \_needsCompositing 属性标记为 true，其次会循环判断父节点，如果父节点需要新的图层，则该标记位也需要设置为 true，如果图层发生了变化，最终也会调用 markNeedsPaint 来进行重新绘制操作，部分源码如下：
    

    visitChildren((RenderObject child) {
      child._updateCompositingBits();
      if (child.needsCompositing)
        _needsCompositing = true;
    });
    if (isRepaintBoundary || alwaysNeedsCompositing)
      _needsCompositing = true;
    if (oldNeedsCompositing != _needsCompositing)
      markNeedsPaint();
    

*   **markNeedsPaint**，这个方法和 Element 中的 markNeedsBuild 相似，由于当前节点需要重新绘制，因此会循环在父节点上，寻找最近一个 isRepaintBoundary 类型，然后进行绘制，如果父节点一直往上没有找到，则只能绘制当前节点。
    
*   **flushPaint**，循环判断需要更新重绘的 RenderObject 节点，并调用 PaintingContext.repaintCompositedChild 进行重新绘制操作。在repaintCompositedChild中会调用paint 方法，这个方法有点类似 Element 的 update 方法，它会根据不同类型的 RenderObject 调用不同的 paint 方法，比如 custom\_paint.dart 又或者 sliver\_persistent\_header.dart 都实现了自身的 paint 方法，在具体 paint 方法中会调用 canvas api 完成绘制，并递归判断子节点类型，调用不同的 paint 方法完成最终绘制工作，最终生成一棵 Layer Tree，并把绘制指令保存在 Layer 中。
    

    for (final RenderObject node in dirtyNodes..sort((RenderObject a, RenderObject b) => b.depth - a.depth)) {
      assert(node._layer != null);
      if (node._needsPaint && node.owner == this) {
        if (node._layer.attached) {
          PaintingContext.repaintCompositedChild(node);
        } else {
          node._skippedPaintingOnLayer();
        }
      }
    }
    

*   **compositeFrame**，将 canvas 绘制好的 scene 信息，转化为二进制像素信息传递给到 GPU ，完成具体的界面渲染操作；
    
*   **flushSemantics**，将渲染对象的语意发送给操作系统，这与 Flutter 绘制流程关系不大。
    

以上就是非常关键的几个核心函数的介绍，接下来我们看下具体的执行过程。

#### 流程说明

如下是各个过程中所执行的函数，如图 4 所示。

![image (2).png](https://s0.lgstatic.com/i/image/M00/46/E5/CgqCHl9GQHCAKO25AAEzFRZSEzw956.png)

图4 核心绘制流程执行过程

根据图 3 的整体流程，我们知道在绘制过程中涉及 4 个比较重要的函数，图 4 就分别说明了这四个函数在执行过程中所执行的具体逻辑。

*   flushLayout，准备布局相关的处理工作，这里会判断是否需要重新布局，调用 performLayout。由于不同基础组件布局相关实现不一样，因此这里会根据不同组件类型调用不同的 performLayout 从而完成布局相关的准备工作。在 performLayout 处理逻辑的最后，还会调用 markNeedsPaint 来标记需要重新绘制的 RenderObject。在 performLayout 中还会执行 markNeedsLayout 用来标记哪些需要进行重新布局，这个会在具体 layout 函数中使用到。
    
*   flushCompositingBits，准备图层的相关处理逻辑，同样将需要重新绘制的 RenderObject 调用 markNeedsPaint 来标记。
    
*   flushPaint，将需要进行重新绘制的 RenderObject 调用 paint 方法转化为 Layer tree，这里的 paint 中也会根据 RenderObject 类型不同，调用不同的paint方法，最终再调用 canvas 实现界面绘制。
    
*   compositeFrame，根据 canvas绘制好的 Layertree，调用 layer.buildScene 方法将 Layertree 转化为 scene 信息，最终再调用 window 的 render 方法，将界面显示给用户。
    

以上就是绘制的流程说明，基于上述的执行过程，我们再来详细分析下，在编码过程中哪些环节，可以提升性能体验。

### 性能优化方向

以上过程中有两个是比较关键的流程，一个是布局，另外一个是绘制。布局过程中会根据 markNeedsLayout函数执行结果来判断是否需要重新布局，另外一个则是根据 markNeedsPaint 结果来判断是否需要重新绘制。那么在这两个函数中，我们平时编码到底应该要注意哪些细节呢？

#### markNeedsPaint

在图 4 过程中的 markNeedsPaint 是一个非常关键的点，这个标记将直接影响到最终的绘制函数 flushPaint 的执行性能，我们来拆解一步步看这个函数：

    void markNeedsPaint() {
      assert(owner == null || !owner.debugDoingPaint);
      if (_needsPaint)
        return;
      _needsPaint = true;
      /// ...更多代码
    }
    

首先判断是否已经标记了 \_needsPaint 为 true，如果标记了则直接退出。

    _needsPaint = true;
    if (isRepaintBoundary) {
      assert(() {
        if (debugPrintMarkNeedsPaintStacks)
          debugPrintStack(label: 'markNeedsPaint() called for $this');
        return true;
      }());
      // If we always have our own layer, then we can just repaint
      // ourselves without involving any other nodes.
      assert(_layer is OffsetLayer);
      if (owner != null) {
        owner._nodesNeedingPaint.add(this);
        owner.requestVisualUpdate();
      }
    }
    

将该 RenderObject 的 \_needsPaint 标记为 true，然后判断是否为 isRepaintBoundary ，那什么是 isRepaintBoundary 呢？

在 Flutter 中有一个这样的组件 RepaintBoundary ，该组件自带 isRepaintBoundary 属性为 true ，你可以将其他组件使用 RepaintBoundary 来包裹。这个组件代表的是将组件作为一个独立的渲染模块。在上面代码中，如果当前是 isRepaintBoundary 则将当前 RenderObject添加到 nodesNeedingPaint 然后返回即可。

    else if (parent is RenderObject) {
      final RenderObject parent = this.parent as RenderObject;
      parent.markNeedsPaint();
      assert(parent == this.parent);
    }
    

如果当前不是 isRepaintBoundary ，则需要往父节点层层寻找，也层层标记 \_needsPaint ，导致当前节点上的所有父节点都需要进行 \_needsPaint 操作。

因此这里有一点编码性能考量的点，我们可以将那些频繁需要重绘的组件使用 RepaintBoundary 进行封装，减少当前节点的绘制引发的父节点的重绘操作。在 Flutter 中的大部分基础组件都是使用了 RepaintBoundary 进行包裹的，因此如果你单纯修改某部分组件时是不会引起到父组件的重绘，从而影响性能体验。

#### markNeedsLayout

markNeedsLayout 主要是用来标记是否需要重新布局的，里面的逻辑和 markNeedsPaint 非常相似。同样也是存在性能提升的空间，当对一个组件需要频繁的进行布局调整时，比如需要频繁增删元素的组件，需要频繁调整大小的组件，使用 RelayoutBoundary 来封装将会有一定的性能提升空间。

如果是自己在写一个基础组件的时候，就要非常注意这点，对于一些频繁改动的点，或者需要频繁进行布局修改的组件，使用 RepaintBoundary 和 RelayoutBoundary进行封装。其次你在性能分析的时候，特别要留意这两个关键的点，当性能出现问题时，可以尝试从这两个点出发去寻找。

### 总结

本课时从操作系统的渲染原理，分析了 Flutter 在性能体验上，为什么优于其他跨端技术框架的。接下来着重介绍了 Flutter核心渲染原理，并从渲染原理中分析后续在编码过程中需要注意的性能优化方向。学完本课时后，你需要掌握 Flutter 渲染核心流程，并且掌握在编码过程中着重注意 RepaintBoundary 和 RelayoutBoundary的使用。

[点击此链接查看本课时源码](https://github.com/love-flutter/flutter-column)