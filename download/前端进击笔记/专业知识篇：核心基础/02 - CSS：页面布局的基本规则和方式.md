前端页面的布局和样式编写是传统技能，但页面样式的实现大多数情况下都无法速成，需要通过不断练习、反复地调试才能熟练掌握，因此有一些同学常常会感到疑惑，比如：

1.  一个元素总宽高为`50px`，要怎么在调整边框大小的时候，不需要重新计算和设置`width/height`呢？
    
2.  为什么给一些元素设置宽高，但是却不生效？
    
3.  如何将一个元素固定在页面的某个位置，具体怎么做？
    
4.  为什么将某个元素`z-index`设置为`9999999`，但是它依然被其他元素遮挡住了呢？
    
5.  为什么将某个元素里面的元素设置为`float`之后，这个元素的高度就歪了呢？
    
6.  让一个元素进行垂直和水平居中，有多少种实现方式？
    

这些问题产生的根本，是对页面布局规则和常见页面布局方式没掌握透彻。今天我就帮你重新梳理下页面布局的基本规则和布局方式，让以上问题迎刃而解。

### 页面布局的基本规则

我们在调试页面样式的时候，如果你不了解页面布局规则，会经常遇到“这里为什么歪了”“这里为什么又好了”这样的困惑。其实页面的布局不只是“碰运气”似的调整样式，浏览器的页面布局会有一些规则，包括：

*   盒模型计算；
    
*   内联元素与块状元素布局规则；
    
*   文档流布局；
    
*   元素堆叠。
    

下面我们可以结合问题逐一来看。

#### 盒模型计算

问题 1：一个元素总宽高为`30px`，要怎么在调整边框大小的时候，不需要重新计算和设置`width/height`呢？

这个问题涉及浏览器布局中的盒模型计算。什么是盒模型？浏览器对文档进行布局的时候，会将每个元素都表示为这样一个盒子。

![Drawing 1.png](https://s0.lgstatic.com/i/image6/M00/33/F7/Cgp9HWBwBrWAfuU6AANyH4P_TXw391.png)

这就是 CSS 基础盒模型，也就是我们常说的盒模型。盒模型主要用来描述元素所占空间的内容，它由四个部分组成：

*   外边框边界`margin`（橙色部分）
    
*   边框边界`border`（黄色部分）
    
*   内边距边界`padding`（绿色部分）
    
*   内容边界`content`（蓝色部分）
    

盒模型是根据元素的样式来进行计算的，我们可以通过调整元素的样式来改变盒模型。上图中的盒模型来自下面这个`<div>`元素，我们给这个元素设置了`margin`、`padding`和`border`：

    <style>
      .box-model-sample {
        margin: 10px;
        padding: 10px;
        border: solid 2px #000;
      }
    </style>
    <div class="box-model-sample">这是一个div</div>
    

在上述代码中，我们通过使用 CSS 样式来控制盒模型的大小和属性。盒模型还常用来控制元素的尺寸、属性（颜色、背景、边框等）和位置，当我们在调试样式的时，比较容易遇到以下这些场景。

**1**. 盒模型会发生`margin`外边距叠加，叠加后的值会以最大边距为准。比如，我们给两个相邻的`<div>`元素分别设置了不同的`margin`外边距：

    <style>
      .box-model-sample {
        margin: 10px;
        padding: 10px;
        border: solid 2px #000;
      }
      .large-margin {
        margin: 20px;
      }
    </style>
    <div class="box-model-sample">这是一个div</div>
    <div class="box-model-sample">这是另一个div</div>
    <div class="box-model-sample large-margin">这是一个margin大一点的div</div>
    

这段代码在浏览器中运行时，我们可以看到，两个`<div>`元素之间发生了`margin`外边距叠加，它们被合并成单个边距。

![Drawing 3.png](https://s0.lgstatic.com/i/image6/M00/34/00/CioPOWBwBsGATe5fAACdV1B5j8s079.png)

如果两个元素的外边距不一样，叠加的值大小是各个边距中的最大值，比如上面第二个和第三个矩形之间的外边距值，使用的是第三个边框的外边距值 20 px。

![Drawing 5.png](https://s0.lgstatic.com/i/image6/M00/34/00/CioPOWBwBseATZypAACnWIPJ5fU407.png)  
需要注意的是，并不是所有情况下都会发生外边距叠加，比如行内框、浮动框或绝对定位框之间的外边距不会叠加。

**2**. 盒模型计算效果有多种，比如元素宽高是否包括了边框。我们可以通过`box-sizing`属性进行设置盒模型的计算方式，正常的盒模型默认值是`content-box`。

使用`box-sizing`属性可以解决问题 1（调整元素的边框时，不影响元素的宽高），我们可以将元素的`box-sizing`属性设置为`border-box`：

    <style>
      .box-model-sample {
        height: 50px;
        margin: 10px;
        padding: 5px;
        border: solid 2px #000;
      }
      .border-box {
        box-sizing: border-box;
      }
    </style>
    <div class="box-model-sample">这是一个div(content-box)</div>
    <div class="box-model-sample border-box">这是另一个div(border-box)</div>
    

对于默认`content-box`的元素来说，元素所占的总宽高为设置的元素宽高(`width`/`height`)等于：`content + padding + border`，因此这里该元素总高度为`50 + 5 * 2 + 2 * 2 = 64px`。

![Drawing 7.png](https://s0.lgstatic.com/i/image6/M00/34/00/CioPOWBwBtmAHIF5AAC8NdjpmFw307.png)

当我们设置为`border-box`之后，元素所占的总宽高为设置的元素宽高(`width`/`height`)，因此，此时高度为`50px`：

![Drawing 9.png](https://s0.lgstatic.com/i/image6/M00/34/00/CioPOWBwBuCAPnYtAADeCHGecrY299.png)

也就是说，如果我们在调整元素边框的时候，不影响元素的宽高，可以给元素的`box-sizing`属性设置为`border-box`，这便是问题 1 的答案。通过这种方式，我们可以精确地控制元素的空间占位，同时还能灵活地调整元素边框和内边距。

虽然我们可以通过盒模型设置元素的占位情况，但是有些时候我们给元素设置宽高却不生效（见问题 2），这是因为元素本身的性质也做了区分，我们来看一下。

#### 内联元素与块状元素

在浏览器中，元素可分为内联元素和块状元素。比如，`<a>`元素为内联元素，`<div>`元素为块状元素，我们分别给它们设置宽高：

    <style>
      a,
      div {
        width: 100px;
        height: 20px;
      }
    </style>
    <a>a-123</a><a>a-456</a><a>a-789</a>
    <div>div-123</div>
    <div>div-456</div>
    <div>div-789</div>
    

在浏览器中的效果如下图所示：

![Drawing 10.png](https://s0.lgstatic.com/i/image6/M01/33/F8/Cgp9HWBwB1OAfXNsAAFw2Bp-aVw496.png)

可以看到，`<a>`元素和`<div>`元素最主要的区别在于：

*   `<a>`元素（内联元素）可以和其他内联元素位于同一行，且宽高设置无效；
    
*   `<div>`元素（块状元素）不可和其他元素位于同一行，且宽高设置有效。
    

所以问题 2 的答案是，当我们给某个元素设置宽高不生效，是因为该元素为内联元素。那么有没有办法解决这个问题呢？

我们可以通过设置`display`的值来对元素进行调整。

*   设置为`block`块状元素，此时可以设置宽度`width`和高度`height`。
    
*   设置为`inline`内联元素，此时宽度高度不起作用。
    
*   设置为`inline-block`，可以理解为块状元素和内联元素的结合，布局规则包括：
    
    *   位于块状元素或者其他内联元素内；
        
    *   可容纳其他块状元素或内联元素；
        
    *   宽度高度起作用。
        

除了内联元素和块状元素，我们还可以将元素设置为`inline-block`，`inline-block`可以很方便解决一些问题：使元素居中、给`inline`元素（`<a>`/`<span>`）设置宽高、将多个块状元素放在一行等。

#### 文档流和元素定位

接下来，我们来看问题 3：将一个元素固定在页面的某个位置，可以怎么做？这个问题涉及文档流的布局和元素定位的样式设置。

什么是文档流呢？正常的文档流在 HTML 里面为从上到下，从左到右的排版布局。

文档流布局方式可以使用`position`样式进行调整，包括：`static`（默认值）、`inherit`（继承父元素）、`relative`（相对定位）、`absolute`（相对非`static`父元素绝对定位）、`fixed`（相对浏览器窗口进行绝对定位）。

我们来分别看下这些`position`样式设置效果。

**1**. 元素`position`样式属性值为`static`(默认值)时，元素会忽略`top`/`bottom`/`left`/`right`或者`z-index`声明，比如我们给部分元素设置`position: static`的样式以及`left`和`top`定位 ：

    a, p, div {
      border: solid 1px red;
    }
    .static {
      position: static;
      left: 100px;
      top: 100px;
    }
    

在[浏览器](https://about-position-1255459943.file.myqcloud.com/position-static.html?fileGuid=xxQTRXtVcqtHK6j8)中，我们可以看到给`position: static`的元素添加定位`left: 100px; top: 100px;`是无效的。

![Drawing 12.png](https://s0.lgstatic.com/i/image6/M01/33/F8/Cgp9HWBwB2yAK13GAAEoSLhXiR0106.png)

（static 元素的定位设置无效果）

**2**. 元素`position`样式属性值为`relative`时，元素会保持原有文档流，但相对本身的原始位置发生位移，且会占用空间，比如我们给部分元素设置`position: relative`样式以及`left`和`top`定位：

    a, p, div {
      border: solid 1px red;
    }
    .relative {
      position: relative;
      left: 100px;
      top: 100px;
    }
    

在[浏览器](https://about-position-1255459943.file.myqcloud.com/position-relative.html?fileGuid=xxQTRXtVcqtHK6j8)中，我们可以看到`position: relative`的元素相对于其正常位置进行定位，元素占有原本位置（文档流中占有的位置与其原本位置相同），因此下一个元素会排到该元素后方。

![Drawing 14.png](https://s0.lgstatic.com/i/image6/M01/33/F8/Cgp9HWBwB3mAFFqSAADs-8Jl61g905.png)

(relative 定位的元素，定位设置可生效)

这里有个需要注意的地方：虽然`relative`元素占位与`static`相同，但会溢出父元素，撑开整个页面。如下图所示，我们能看到[浏览器中](https://about-position-1255459943.file.myqcloud.com/position-relative-occupation.html?fileGuid=xxQTRXtVcqtHK6j8)`relative`元素撑开父元素看到页面底部有滚动条。

![Drawing 16.png](https://s0.lgstatic.com/i/image6/M01/33/F8/Cgp9HWBwB5-ANcUmAAC64A1Pkhk727.png)

(relative 定位的元素，可撑开父元素)

此时给父元素设置`overflow: hidden;`则可以隐藏溢出部分。

![Drawing 18.png](https://s0.lgstatic.com/i/image6/M00/33/F8/Cgp9HWBwB6iARwZZAABrqdhMZGc561.png)

（通过设置`overflow: hidden`可隐藏溢出部分元素）

**3**. 元素`position`样式属性值为`absolute`、且设置了定位（`top`/`bottom`/`left`/`right`）时，元素会脱离文档流，相对于其包含块来定位，且不占位，比如我们给`position: absolute`的元素设置`left`和`top`定位 ：

    .parent {
      border: solid 1px blue;
      width: 300px;
    }
    .parent > div {
      border: solid 1px red;
      height: 100px;
      width: 300px;
    }
    .absolute {
      position: absolute;
      left: 100px;
      height: 100px;
    }
    

在[浏览器](https://about-position-1255459943.file.myqcloud.com/position-absolute.html?fileGuid=xxQTRXtVcqtHK6j8)中，我们可以看到`position: absolute`的元素不占位，因此下一个符合普通流的元素会略过`absolute`元素排到其上一个元素的后方。

![Drawing 20.png](https://s0.lgstatic.com/i/image6/M01/33/F8/Cgp9HWBwB7KARvTaAABaLe2qI4k309.png)

（absolute 元素不占位）

**4**. 元素`position`样式属性值为`fixed`时，元素脱离文档流、且不占位，此时看上去与`absolute`相似。但当我们进行[页面](https://about-position-1255459943.file.myqcloud.com/position-fixed-absolute.html?fileGuid=xxQTRXtVcqtHK6j8)滚动的时候，会发现`fixed`元素位置没有发生变化。

![Drawing 22.png](https://s0.lgstatic.com/i/image6/M01/33/F8/Cgp9HWBwB7uAbshiAADWWsHZghM208.png)

（fixed 元素同样不占位）

这是因为`fixed`元素相对于浏览器窗口进行定位，而`absolute`元素只有在满足“无`static`定位以外的父元素”的时候，才会相对于`document`进行定位。

回到问题 3，将一个元素固定在页面的某个位置，可以通过给元素或是其父类元素添加`position: fixed`或者`position: absolute`将其固定在浏览器窗口或是文档页面中。

使用元素定位可以将某个元素固定，那么同一个位置中存在多个元素的时候，就会发生元素的堆叠。

#### 元素堆叠 z-index

元素的堆叠方式和顺序，除了与`position`定位有关，也与`z-index`有关。通过设置`z-index`值，我们可以设置元素的堆叠顺序，比如我们给同级的元素添加`z-index值`：

![Drawing 24.png](https://s0.lgstatic.com/i/image6/M00/33/F8/Cgp9HWBwB9GAVImUAAC4RJoX2o8350.png)

（z-index 可改变元素堆叠顺序）

在[浏览器](https://about-position-1255459943.file.myqcloud.com/position-z-index-same-level.html?fileGuid=xxQTRXtVcqtHK6j8)中，我们可以看到：

*   当同级元素不设置`z-index`或者`z-index`相等时，后面的元素会叠在前面的元素上方；
    
*   当同级元素`z-index`不同时，`z-index`大的元素会叠在`z-index`小的元素上方。
    

`z-index`样式属性比较常用于多个元素层级控制的时候，比如弹窗一般需要在最上层，就可以通过设置较大的`z-index`值来控制。

那么，我们来看问题 4： 为什么将某个元素`z-index`设置为`9999999`，但是它依然被其他元素遮挡住了呢？

这是因为除了同级元素以外，`z-index`值的设置效果还会受到父元素的`z-index`值的影响。`z-index`值的设置只决定同一父元素中的同级子元素的堆叠顺序。因此，即使将某个元素`z-index`设置为`9999999`，它依然可能因为父元素的`z-index`值小于其他父元素同级的元素，而导致该元素依然被其他元素遮挡。

现在，我们解答了问题 1~4，同时还学习了关于 CSS 页面布局的核心规则，包括：

*   盒模型主要用来描述元素所占空间的内容；
    
*   一个元素属于内联元素还是块状元素，会影响它是否可以和其他元素位于同一行、宽高设置是否有效；
    
*   正常的文档流在 HTML 里面为从上到下、从左到右的排版布局，使用`position`属性可以使元素脱离正常的文档流；
    
*   使用`z-index`属性可以设置元素的堆叠顺序。
    

掌握了这些页面布局的规则，可以解决我们日常页面中单个元素样式调整中的大多数问题。对于进行整体的页面布局，比如设置元素居中、排版、区域划分等，涉及多个元素的布局，这种情况下常常会用到 Flex、Grid 这样的页面布局方式。下面我们一起来看看。

### 常见页面布局方式

在我们的日常工作中，实现页面的 UI 样式除了会遇到单个元素的样式调整外，还需要对整个页面进行结构布局，比如将页面划分为左中右、上中下模块，实现某些模块的居中对齐，实现页面的响应式布局，等等。

要实现对页面的排版布局，需要使用到一些页面布局方式。目前来说，比较常见的布局方式主要有三种：

*   传统布局方式；
    
*   Flex 布局方式；
    
*   Grid 布局方式。
    

#### 传统布局

传统布局方式基本上使用上面介绍的布局规则，结合`display`/`position`/`float`属性以及一些边距、x/y 轴距离等方式来进行布局。

除了使用`position: fixed`或者`position: absolute`时，会使元素脱离文档流，使用`float`属性同样会导致元素脱离文档流。

这就涉及问题 5：为什么将某个元素里面的元素设置为`float`之后，这个元素的高度就歪了呢？

这是因为当我们给元素的`float`属性赋值后，元素会脱离文档流，进行左右浮动，比如这里我们将其中一个`<div>`元素添加了`float`属性 ：

    <style>
      div {
        border: solid 1px red;
        width: 50px;
        height: 50px;
      }
      .float {
        float: left;
      }
    </style>
    <div>1</div>
    <div class="float">2</div>
    <div class="float">3</div>
    <div>4</div>
    <div>5</div>
    <div class="float">6</div>
    

我们可以在[浏览器](https://about-position-1255459943.file.myqcloud.com/display-float.html?fileGuid=xxQTRXtVcqtHK6j8)中看到，`float`元素会紧贴着父元素或者是上一个同级同浮动元素的边框：

![Drawing 26.png](https://s0.lgstatic.com/i/image6/M01/33/F8/Cgp9HWBwB-SAZahpAABKURkJ8hE997.png)

可以看到当元素设置为`float`之后，它就脱离文档流，同时也不再占据原本的空间。

因此，问题 5 的答案为：本属于普通流中的元素浮动之后，父元素内部如果不存在其他普通流元素了，就会表现出高度为 0，又称为高度塌陷。

在这样的情况下，我们可以使用以下方法撑开父元素：

*   父元素使用`overflow: hidden`（此时高度为`auto`）；
    
*   使父元素也成为浮动`float`元素；
    
*   使用`clear`清除浮动。
    

除了 `clear` 清除浮动之外，这些方法为什么可以达到撑开父元素的效果呢，这是因为 BFC（Block Formatting Context，块格式化上下文）的特性。BFC 是 Web 页面的可视 CSS 渲染的一部分，是块盒子的布局过程发生的区域，也是浮动元素与其他元素交互的区域，详情大家可以私下了解下。

传统方式布局的优势在于兼容性较好，在一些版本较低的浏览器上也能给到用户较友好的体验。但传统布局需要掌握的知识较多也相对复杂，对于整个页面的布局和排版实现，常常是基于盒模型、使用`display`属性+`position`属性+`float`属性的方式来进行，这个过程比较烦琐，因此更多时候我们都会使用开源库（比如 bootstrap）来完成页面布局。

后来 W3C 提出了新的布局方式，可以快速、简便地实现页面的排版布局，新的布局方式包括 Flex 布局和 Grid 布局。

#### 使用 Flex 布局

Flex 布局（又称为 flexbox）是一种一维的布局模型。在使用此布局时，需掌握几个概念。

1.  flexbox 的两根轴线。其中，主轴由`flex-direction`定义，交叉轴则垂直于主轴。
    
2.  在 flexbox 中，使用起始和终止来描述布局方向。
    
3.  认识 flex 容器和 flex 元素。
    

想熟练使用 Flex 布局，我们需要了解什么是 flex 容器和 flex 元素。比如我们给一个父元素`div`设置`display: flex;`：

    <style>
      div {
        border: solid 1px #000;
        margin: 10px;
      }
      .box {
        display: flex;
      }
    </style>
    <div class="box">
      <div>1</div>
      <div>2</div>
      <div>3 <br />有其他 <br />内容</div>
    </div>
    

在浏览器中的效果就会如图所示：

![Drawing 28.png](https://s0.lgstatic.com/i/image6/M01/34/01/CioPOWBwB_WAR3CJAAAti6zxREI918.png)

其中，flex 容器为`<div class="box">`元素及其内部区域，而容器的直系子元素（1、2、3 这 3 个`<div>`）为 flex 元素。

在掌握了 flex 容器和 flex 元素之后，我们就可以通过调整 flexbox 轴线方向、排列方向和对齐方式的方式，实现需要的页面效果。

Flex 布局种常用的方式包括：

*   通过`flex-direction`调整 Flex 元素的排列方向（主轴的方向）；
    
*   用`flex-wrap`实现多行 Flex 容器如何换行；
    
*   使用`justify-content`调整 Flex 元素在主轴上的对齐方式；
    
*   使用`align-items`调整 Flex 元素在交叉轴上如何对齐；
    
*   使用`align-content`调整多根轴线的对齐方式。
    

Flex 布局给`flexbox`的子元素之间提供了强大的空间分布和对齐能力，我们可以方便地使用 Flex 布局来实现垂直和水平居中，比如通过将元素设置为`display: flex;`，并配合使用`align-items: center;`、`justify-content: center;`：

    <style>
      div {
        border: solid 1px #000;
      }
      .box {
        display: flex;
        width: 200px;
        height: 200px;
        align-items: center;
        justify-content: center;
      }
      .in-box {
        width: 80px;
        height: 80px;
      }
    </style>
    <div class="box">
      <div class="in-box">我想要垂直水平居中</div>
    </div>
    

就可以将一个元素设置为垂直和水平居中：

![Drawing 30.png](https://s0.lgstatic.com/i/image6/M01/34/01/CioPOWBwCA-Ad4tQAAA-HOY2i2w574.png)

对于传统的布局方式来说，要实现上述垂直水平居中，常常需要依赖绝对定位+元素偏移的方式来实现，该实现方式不够灵活（在调整元素大小时需要调整定位）、难以维护。

Flex 布局的出现，解决了很多前端开发居中、排版的一些痛点，尤其是垂直居中，因此现在几乎成为主流的布局方式。除此之外，还可以对 Flex 元素设置排列顺序、放大比例、缩小比例等。

如果说 Flex 布局是一维布局，那么 Grid 布局则是一种二维布局的方式。

#### Grid 布局

Grid 布局又称为网格布局，它将一个页面划分为几个主要区域，以及定义这些区域的大小、位置、层次等关系。

我们知道 Flex 布局是基于轴线布局，与之相对，Grid 布局则是将容器划分成行和列，可以像表格一样按行或列来对齐元素。

对于 Grid 布局，同样需要理解几个概念：网格轨道与行列、网格线、网格容器等。其实 Grid 布局很多概念跟 Flex 布局还挺相似的，因此这里不再赘述。

使用 Grid 布局可以：

*   实现网页的响应式布局；
    
*   实现灵活的 12 列布局（类似于 Bootstrap 的 CSS 布局方式）；
    
*   与其他布局方式结合，与 css 其他部分协同合作。
    

通过 Grid 布局我们能实现任意组合不同布局，其设计可称得上目前最强大的布局方式，它与 Flex 布局是未来的趋势。其中，Grid 布局适用于较大规模的布局，Flex 布局则适合页面中的组件和较小规模布局。

### 小结

今天我带大家学习了页面布局中比较核心的一些规则，包括盒模型计算、内联元素与块状元素布局规则、文档流布局和元素堆叠顺序。我们在写 CSS 过程中会遇到很多的“神奇”现象，而要理解这些现象并解决问题，掌握这些页面布局的原理逻辑和规则很重要。

除了页面布局规则之外，我还带大家认识了常见的页面布局方式，包括传统布局方式、FleX 布局和 Grid 布局。

细心的你或许也发现了，我们还遗留了问题 6 没有给出具体的答案：让一个元素进行垂直和水平居中，有多少种实现方式？

这个问题，我希望你可以自己进行解答，欢迎你将答案写在留言区～