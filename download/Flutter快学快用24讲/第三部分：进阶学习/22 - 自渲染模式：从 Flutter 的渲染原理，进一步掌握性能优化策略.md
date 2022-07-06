在自渲染模式中，Flutter 三棵树是一个比较关键的知识点。本课时将带你学习 Flutter 自渲染模式的三棵树，然后从三棵树的绘制过程中了解 Flutter 是如何做性能优化和如何进行 Flutter App 的性能提升。

### 三棵树

在 Flutter 中存在三棵树，分别是 Widget 、Element 和 RenderObject。

*   Widget，是用来描述 UI 界面的，里面主要包含了一些基础的 UI 渲染的配置信息。
    
*   Element，类似于前端的虚拟 Dom，介于 Widget 和 RenderObject 之间。
    
*   RenderObject，则是实际上需要渲染的树，渲染引擎会根据 RenderObject 来进行界面渲染。
    

在 Flutter 中经过一系列处理后，将会生成一份这样的配置信息，如图 1 所示（你可以使用 debug 模式得到这份渲染树的结构信息）。

![Drawing 0.png](https://s0.lgstatic.com/i/image/M00/44/E0/Ciqc1F8_i_CAfmbFAAJQmkbVhaU299.png)

图 1 渲染树结构

在图 1 中比较关键的是 3 个属性：

*   \_widget 就是我们所说的 Widget 树；
    
*   \_chilid 就是我们所说的 Element 树；
    
*   而 \_renderObject 就是 RenderObject 树。
    

以上的渲染树结构对于我们所看到的 Widget 是一份非常简单的配置，如下：

    void main() {
      runApp(MaterialApp(
        title: 'Navigation Basics',
        home: FirstRoute(),
      ));
    }
    class FirstRoute extends StatelessWidget {
      @override
      Widget build(BuildContext context) {
        return Center(
          child: Text('flutter test'),
        );
      }
    }
    

上面代码描述的是一个简单的页面组件，不过在这个简单页面组件背后是一个非常复杂的树型结构，具体看看渲染的 Element 树到底是个什么样子，如图 2 所示。

![Drawing 1.png](https://s0.lgstatic.com/i/image/M00/44/E0/Ciqc1F8_i_uAHvbgAAFqAXyCe9s498.png)

图 2 Element 树结构

你有没有发现就一个非常简单的 Widget ，在 Flutter 中实际生成的 Element 树结构图是如此的复杂。你有没有发现在树的最底层才是我们使用的组件 FirstRoute->Center->Text->RichText（如图 2 中红色的部分）。了解完三棵树结构后，我们再来看下三棵树是如何进行转化的。

### 三棵树对应关系

在 Flutter 中，Widget 和 Element 树是一一对应的，但是与 RenderObject 不是一一对应的。因为有些 Widget 是不需要渲染的，比如我们上面测试代码中的 FirstRoute 就是不需要渲染的 Widget。最终只有 RenderObjectWidget 相关的 Widget 才会转化为 RenderObject，也只有这种类型才需要进行渲染。可以看下表格 1 所展示的三棵树部分类型的对应关系。

![Drawing 2.png](https://s0.lgstatic.com/i/image/M00/44/E0/Ciqc1F8_jAWASaH5AABxjuioTcw001.png)

表格 1 Widget 、 Element 和 RenderObject 对应关系

接下来我们看下三者是如何进行转化的。

### 三棵树转化流程

Flutter 运行中的一部分核心逻辑就是在处理这三棵树的转化，所有的界面交互和事件处理，最终都反应在这三棵树上的操作结果。一般情况下，我们都是这样去运行 Flutter 项目的。

    void main() {
      runApp(MaterialApp(
        title: 'Navigation Basics',
        home: FirstRoute(),
      ));
    }
    

其中的 MaterialApp 就是我们所描述的一个 Widget ，Flutter 会经过 scheduleAttachRootWidget 、 attachRootWidget 、attachToRenderTree 调用到 RenderObjectToWidgetElement 的 mount 方法。在过程中会涉及相当多的源码函数，这里我们选择几个比较重要的函数介绍下。

#### 重要函数说明

在介绍函数之前我们先来看下整体的架构流程图，如图 3 所示。

![Drawing 3.png](https://s0.lgstatic.com/i/image/M00/44/E0/Ciqc1F8_jBaAPZtCAADE5IavI9E126.png)

图 3 Flutter 树转化图

上述图比较复杂，你可以先简单了解下，等下我们会详细拆分来讲解。我们先来看下这几个关键函数的作用。

*   **scheduleAttachRootWidget**，创建根 widget ，并且从根 widget 向子节点递归创建元素Element，对子节点为 RenderObjectWidget 的小部件创建 RenderObject 树节点，从而创建出 View 的渲染树，这里源代码中使用 Timer.run 事件任务的方式来运行，目的是避免影响到微任务的执行。
    

    void scheduleAttachRootWidget(Widget rootWidget) {
      Timer.run(() {
        attachRootWidget(rootWidget);
      });
    }
    

*   **attachRootWidget** 与 scheduleAttachRootWidget 作用一致，首先是创建根节点，然后调用 attachToRenderTree 循环创建子节点。
    

    void attachRootWidget(Widget rootWidget) {
      _readyToProduceFrames = true;
      _renderViewElement = RenderObjectToWidgetAdapter<RenderBox>(
        container: renderView,
        debugShortDescription: '[root]',
        child: rootWidget,
      ).attachToRenderTree(buildOwner, renderViewElement as RenderObjectToWidgetElement<RenderBox>);
    }
    

*   **attachToRenderTree**，该方法中有两个比较关键的调用，我只举例出核心代码部分，这里会先执行 buildScope ，但是在 buildScope 中会优先调用第二个参数（回调函数，也就是 element.mount ），而 mount 就会循环创建子节点，并在创建的过程中将需要更新的数据标记为 dirty。
    

    owner.buildScope(element, () {
      element.mount(null, null);
    });
    

*   **buildScope**，如果首次渲染 dirty 是空的列表，因此首次渲染在该函数中是没有任何执行流程的，该函数的核心还是在第二次渲染或者 setState 后，有标记 dirty 的 Element 时才会起作用，该函数的目的也是循环 dirty 数组，如果 Element 有 child 则会递归判断子元素，并进行子元素的 build ，创建新的 Element 或者修改 Element 或者创建 RenderObject。
    
*   **updateChild**，该方法非常重要，所有子节点的处理都是经过该函数，在该函数中 Flutter 会处理 Element 与 RenderObject 的转化逻辑，通过 Element 树的中间状态来减少对 RenderObject 树的影响，从而提升性能。具体这个函数的代码逻辑，我们拆解来分析。该函数的输入参数，包括三个参数：Element child、Widget newWidget、dynamic newSlot 。child 为当前节点的 Element 信息， newWidget 为 Widget 树的新节点，newSlot 为节点的新位置。在了解参数后接下来看下核心逻辑，首先判断是否有新的 Widget 节点。
    

    if (newWidget == null) {
      if (child != null)
        deactivateChild(child);
      return null;
    }
    

如果不存在，则将当前节点的 Element 直接销毁，如果 Widget 存在该节点，并且 Element 中也存在该节点，那么就首先判断两个节点是否一致，如代码第一行，如果一致只是位置不同，则更新位置即可。其他情况下判断是否可更新子节点，如果可以则更新，如果不可以则销毁原来的 Element 子节点，并重新创建一个。

    if (hasSameSuperclass && child.widget == newWidget) {
      if (child.slot != newSlot)
        updateSlotForChild(child, newSlot);
      newChild = child;
    } else if (hasSameSuperclass && Widget.canUpdate(child.widget, newWidget)) {
      if (child.slot != newSlot)
        updateSlotForChild(child, newSlot);
      child.update(newWidget);
      assert(child.widget == newWidget);
      assert(() {
        child.owner._debugElementWasRebuilt(child);
        return true;
      }());
      newChild = child;
    } else {
      deactivateChild(child);
      assert(child._parent == null);
      newChild = inflateWidget(newWidget, newSlot);
    }
    

上面代码的第 8 行非常关键，在 child.update 函数逻辑里面，会根据当前节点的类型，调用不同的 update ，可参考图 3 中的 update 下的流程，每一个流程也都会递归调用子节点，并循环返回到 updateChild 中。有以下三个核心的函数会重新进入 updateChild 流程中，分别是 performRebuild、inflateWidget 和 markNeedsBuild，接下来我们看下这三个函数具体的作用。

*   **performRebuild**是非常关键的一个代码，这部分就是我们在组件中写的 build 逻辑函数，StatelessWidget 和 StatefulWidget 的 build 函数都是在此执行，执行完成后将作为该节点的子节点，并进入 updateChild 递归函数中。
    
*   **inflateWidget**创建一个新的节点，在创建完成后会根据当前 Element 类型，判断是 RenderObjectElement 或者 ComponentElement 。根据两者类型的不同，调用不同 mount 挂载到当前节点上，在两种类型的 mount 中又会循环子节点，调用 updateChild 重新进入子节点更新流程。这里还有一点，当为 RenderObjectElement 的时候会去创建 RenderObject 。
    
*   **markNeedsBuild**，标记为 dirty ，并且调用 scheduleBuildFor 等待下一次 buildScope 操作。
    

以上就是比较关键的几个函数，其他函数你可以自己查看官网的文档。下面结合图 3 的流程图，我结合两个流程来讲解：首次 build 的流程和 setState 的流程。

#### 首次 build

当我们首次加载一个页面组件的时候，由于所有节点都是不存在的，因此这时候的流程大部分情况下都是创建新的节点，流程会如图 4 所示。

![Drawing 4.png](https://s0.lgstatic.com/i/image/M00/44/E0/Ciqc1F8_jEiAbM-GAAFJbtV_XLo642.png)

图 4 首次 build 流程

runApp 到 RenderObjectToWidgetElement(mount) 逻辑都是一样的，在 \_rebuild 中会调用 updateChild 更新节点，由于节点是不存在的，因此这时候就调用 inflateWidget 来创建 Element。

当 **Element 为 Component** 时，会调用 Component.mount ，在 Component.mount 中会创建 Element 并挂载到当前节点上，其次会调用 \_firstBuild 进行子组件的 build ，build 完成后则将 build 好的组件作为子组件，进入 updateChild 的子组件更新。

当 **Element 为 RenderObjectElement** 时，则会调用 RenderObjectElement.mount，在 RenderObjectElement.mount 中会创建 RenderObjectElement 并且调用 createRenderObject 创建 RenderObject，并将该 RenderObject 和 RenderObjectElement 分别挂载到当前节点的 Element 树和 RenderObject 树，最后同样会调用 updateChild 来递归创建子节点。

以上就是首次 build 的逻辑，单独来看还是非常清晰的，接下来我们看下 setState 的逻辑。

#### setState

当我们调用 setState 后，我们实际上调用的是组件的 markNeedsBuild ，而这个函数上面已经介绍到是将组件设置为 dirty ，并且添加下一次 buildScope 的逻辑，等待下一次 rebuild 循环。如图 5 流程。buildScope 会调用 rebuild 然后进入 build 操作，从而进入 updateChild 的循环体系。

![Drawing 6.png](https://s0.lgstatic.com/i/image/M00/44/E0/Ciqc1F8_jJGATAlDAAFF3eMI6D8595.png)

图 5 setState 流程

在图 5 中，我们就可以了解到，在 Flutter 中，如果父节点更新以后，也就是 setState 调用必定会引起子节点的递归循环判断 build 逻辑，虽然不一定会进行 RenderObject 树的创建（因为可能子节点没有变化，因此没有改变），但还是存在一定的性能影响。

以上就是三棵树的转化过程，其中我省略了部分非核心流程函数，大家如果感兴趣，可以在[Flutter 官网的 Github](https://github.com/flutter/flutter/tree/master/packages) 上进行学习。在掌握了整体的流程，我们接下来就要从这个转化过程中，提炼出可以提升我们 Flutter APP 性能的关键点。

### 性能提升要点

在图 3 的整体流程中，我们要特别注意的就是 updateChild 这个函数，这也是 Flutter 从 Widget 到 Element 再到 RenderObject 性能提升的关键点。这个函数的作用在上面已经有介绍到了，关键点就是在 Widget 转化为 Element，然后 Element 转化 RenderObject 过程中做的一些细节的判断优化，这些细节处理包括以下这五点。

*   新节点被删除了，则直接删除 Element 节点。
    
*   节点存在，组件类型相同，并且组件相等时，则更新节点位置。
    
*   节点存在，组件类型相同，组件不相同，并且组件可进行更新时，则更新组件，由于当前组件更新了，因此需要更新当前组件的子节点，所以调用 update 来更新子节点列表，在此过程中也会对节点的 RenderObject 的子节点进行更新。
    
*   节点存在，组件类型相同，组件不相同，其次也无法进行组件更新时，则创建节点，同时在创建过程中判断是否为 RenderObject ，如果是则创建 RenderObject ，并循环判断子节点。
    
*   节点不存在，则同样走创建流程。
    

通过这种方式就可以减少 Widget 对 RenderObject 的影响，只有需要创建和更新的节点才会反映到 RenderObject 树中。从这个树节点的转化过程，我们可以提炼出以下四个关键点，从而提升我们 APP 的性能。

#### const

上面提到了父组件更新，导致子组件都需要进行 rebuild 操作，一种办法就是减少有状态组件下的子组件，还有一种办法就是尽量多用 const 组件，这样即使父组件更新了，子组件也不会重新 rebuild 操作。这里就是在上面的判断逻辑，节点存在，组件类型相同，并且组件相等时的处理逻辑。

这点在我们项目的源代码中，也有一些实践优化的点，特别是一些长期不修改的组件，例如通用报错组件和通用 loading 组件等，当然只能针对不带变量的组件返回，例如下面这部分代码。

    if (error) {
        return CommonError(action: this.setFirstPage);
      }
      if (contentList == null) {
        return const Loading();
      }
    }
    

第 2 行代码中有一个变量 action ，因此是不能设置为 const 的，下面的 Loading 由于没有携带变量，因此是可以设置为 const 的。其他代码可以同样进行修改，对性能提升还是有一定的帮助的，特别是在组件设计不合理的过程中。

#### canUpdate

在 updateChild 上面流程中，有一个执行函数 canUpdate ，这个也是一个性能提升的关键点，特别是在需要对多个元素进行调整时，可以看下具体的逻辑实现。

    static bool canUpdate(Widget oldWidget, Widget newWidget) {
      return oldWidget.runtimeType == newWidget.runtimeType
          && oldWidget.key == newWidget.key;
    }
    

主要是判断运行时的类是否相同，同时判断 key 是否一样，如果都一样，则可直接更新组件 Element 位置，提升性能，因此在组件设计时，尽量减少组件的 key 的变化，可以默认设置为空。

其次在如果需要频繁地对组件进行排序、删除或者新增处理时，最好要将组件增加上 key ，以提升性能。这里要非常注意，由于 StatefulWidget 的 state 是保存在 Element 中，因此如果希望区分两个相同类名（ runtimeType ）的 Widget 时，必须携带不同的 key ，不然无法区分新旧 Widget 的变化，特别是在一个列表数据，每个列表都是一个有状态类，如果需要切换列表中项目列表时，则必须设置 key，不然会导致顺序切换失效。了解更多关于这点的，可以参考这篇[英文的文章](https://medium.com/flutter/keys-what-are-they-good-for-13cb51742e7d)。

#### inflateWidget

在 updateChild 中的 inflateWidget 执行函数也是一个比较关键的性能提升点，这个函数在创建之前会检查 key 是否为 GlobalKey ，如果是则表明 Element 存在，那么这时候直接启用即可，如果不存在则需要重新创建，这就类似与组件缓存，只能说减少组件的 build 成本，看下如下这部分代码。

    final Key key = newWidget.key;
    if (key is GlobalKey) {
      final Element newChild = _retakeInactiveElement(key, newWidget);
      if (newChild != null) {
        assert(newChild._parent == null);
        assert(() {
          _debugCheckForCycles(newChild);
          return true;
        }());
        newChild._activateWithParent(this, newSlot);
        final Element updatedChild = updateChild(newChild, newWidget, newSlot);
        assert(newChild == updatedChild);
        return updatedChild;
      }
    }
    final Element newChild = newWidget.createElement();
    

但是这部分也是非常损耗内存的，因为它会将组件缓存到内存中，导致垃圾内容无法进行回收，因此在使用 GlobalKey 要非常注意，尽量应用在复用性高且 build 业务复杂的组件上。

#### setState

在图 3 中的 setState 被触发后，当前组件会进行 rebuild 操作，由于当前组件的 build ，会引起当前组件下的所有子组件发生 rebuild 行为，因此在设计时，**尽量减少有状态组件下的无状态组件**，从而减少没必要的 build 逻辑。这也是我们之前提到的一些组件设计要点，虽然说 Flutter 构建 Widget 和 Element 是比较快的，但是为了性能考虑，还是尽量减少这部分没必要的损耗。其次也注意减少 build 中的业务逻辑，因为 Flutter 中的 build 是会经常被触发，特别是有状态组件。

### 总结

本课时着重介绍了 Flutter 自渲染中的三棵树知识，从 Flutter 的三棵树概念到三棵树对应关系，其中着重介绍了三棵树的转化流程，并在流程中总结出性能优化需要着重注意的点。

学完本课时后，你需要掌握 Flutter 的三棵树概念，并非常清晰的了解三棵树的转化过程，通过对转化过程中性能优化知识的学习，从而在编码过程中养成一个非常好的编码习惯。

[点击链接，查看本课时源码](https://github.com/love-flutter/flutter-column)