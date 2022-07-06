最初的页面开发中，前端实现一个页面只需要在一个文件里完成，包括 HTML/CSS/JavaScript 各种内容。后来，通常将常用的静态资源放置在 CDN，并使用`<link>`和`<script>`的 src 属性引入的方式，来减少页面开发过程中的重复代码编写。

如今前端页面的功能越来越复杂，规模也越来越大。为了提升代码的可读性、项目的可维护性，我们会将一些通用的工具和组件进行抽象，代码被有组织地按照一定规则进行划分，比如按照功能划分为页面、组件、工具库、脚本等。

这个过程便是模块化，而 JavaScript 中的模块规范不止一种。

### JavaScript 模块

在 JavaScript 中，我们常说的模块规范包括 CommonJS/AMD/UMD/ES6 Module 四种。这些模块规范和定义之间的区别常常容易搞混，我们先来分别看一下。

#### CommonJS 规范

CommonJS 规范定义了模块应该怎样进行编写，从而各个模块系统之间可以进行相互操作。

我们来看一个 CommonJS 规范的模块示例：

    var beta = require('beta');
    function verb {
      return beta.verb();
    }
    module.exports = {
      verb: verb
    };
    

在该示例中，使用`require()`载入模块，使用`module.exports`输出模块 。  
一般来说，CommonJS 有以下特点：

*   一个文件就是一个模块；
    
*   使用`require()`载入模块，使用`module.exports`输出模块，因此各个模块间可以进行交互；
    
*   不支持异步加载。
    

或许你已经知道，Node.js 环境使用的便是基于 CommonJS 规范实现的模块系统，而如今我们提到 CommonJS 规范，也基本上认为是 Node.js 系统。

为什么浏览器环境不使用 CommonJS 规范呢？这是因为 CommonJS 不支持异步加载，而前面我们也说过，浏览器环境中同步任务的执行会带来性能问题，但对于异步模块定义（AMD）来说就不存在这样的问题。

#### AMD

顾名思义，异步模块定义（AMD）主要为了解决异步加载模块而提出，它通过指定模块和依赖项的方式来定义模块。

RequireJS 便是基于 AMD 的实现，我们同样可以看一个模块示例：

    define("alpha", ["require", "exports", "beta"], function (
      require,
      exports,
      beta
    ) {
      exports.verb = function () {
        return beta.verb();
        // 或者可以这么写
        return require("beta").verb();
      };
    });
    

在该示例中，导出 ID 为 alpha 的模块，依赖了 ID 为 beta 的模块。

现在我们知道，Node.js 环境中的模块系统基于 CommonJS 规范，而浏览器环境中需要使用 AMD 实现。

那么如果我们有一个模块，需要同时能运行在 Node.js 环境和浏览器环境中，要怎么办？我们可以使用 UMD 模式。

#### UMD

为了兼容 AMD 和 CommonJS 的规范，通用模块定义（UMD）模式被提出，它在兼容两者的同时，也支持了传统的全局变量模式。

我们来看一个 UMD 模式的模块示例：

    (function (root, factory) {
      if (typeof define === "function" && define.amd) {
        // AMD
        define(["jquery"], factory);
      } else if (typeof exports === "object") {
        // CommonJS
        module.exports = factory(require("jquery"));
      } else {
        // 全局变量
        root.returnExports = factory(root.jQuery);
      }
    })(this, function ($) {
      // ...
    });
    

可以看到，UMD 模块头部通常都会有用来判断模块加载器环境的代码，并根据不同的环境提供了不同的方式进行加载。

到这里，似乎不管是 Node.js 环境还是浏览器环境，都有支持的模块规范，也有能相互兼容的模块规范了。那么，ES6 模块又是什么呢？

#### ES6 模块

相比于运行时进行加载的 CommonJS 规范，ES6 模块化主要是为了**在编译阶段就可以确定各个模块之间的依赖关系**。

我们同样来看一个 ES6 模块的示例代码：

    // import 导入
    import BaseTask, { TaskType } from "./BaseTask";
    // export 导出
    export { BaseTask };
    

在该示例中，使用`import`加载模块，使用`export`输出模块。

ES6 模块的特点如下：

*   使用`import`加载和`export`输出；
    
*   一个模块只会加载一次（CommonJS 也是一样）；
    
*   导出的模块为变量引用，因此可以在内存中共享。
    

现在大多数前端项目中都使用 ES6 模块，由于 ES6 模块化目的是编译阶段确定模块间依赖关系，因此我们需要在编译的时候使用 Babel、Webpack 等方式构建依赖关系树。

除此之外，ES6 模块化在各个浏览器里的兼容性差异较大，因此同样需要进行 Babal 编译以及 Webpack 进行打包，这个过程我们称之为代码构建。

我们来总结一下 CommonJS/AMD/UMD/ES6 Module 这四种模块规范：

1.  CommonJS 规范定义了模块应该怎样进行编写，从而各个模块系统之间可以进行相互操作。
    
2.  CommonJS 不支持异步加载，因此异步模块定义（AMD）主要为了解决异步加载模块而提出。
    
3.  通用模块定义（UMD）模式用于兼容 AMD 和 CommonJS 的规范。
    
4.  CommonJS 规范用于运行时进行模块加载，ES6 模块化可以在编译阶段确定各个模块之间的依赖关系。
    

下面，我们一起来看看 Webpack 这个在前端项目中经常出现的工具。

### Webpack 工具都做了些什么

如今前端项目大多数都使用了模块化，而如果想要将多个文件的代码打包成最终可按照预期运行的代码，则需要使用到代码构建工具。

不管项目代码是如何进行组织的，项目中又有多少个文件，最终浏览器依然会从 HTML 内容进行解析和加载，因此我们需要对项目中的代码进行构建（包括编译和打包），生成浏览器可正常解析和加载的内容。

我们先来认识下常见的前端构建相关的工具。

#### 常见的前端构建工具

对于前端开发来说，我们会用到各式各样的构建/打包工具，比如这些。

![图片2.png](https://s0.lgstatic.com/i/image6/M01/3F/7C/Cgp9HWCeSsSAHiJFAALlqT5qxqA460.png)

其中，涉及模块化代码打包的主要有 Grunt/Gulp/Webpack/Rollup。很多同学会搞混这几个工具，这里我简单介绍下它们之间的区别。

1.  Gulp/Grunt 是一种能够优化前端工作流程的工具，比如自动刷新页面、combo、压缩 CSS/JavaScript、编译 Less/Sass 等。
    
2.  Webpack/Rollup 是一个 JavaScript 的模块打包器，用于整合编译成最终的代码。
    
3.  其中，Rollup 通常用来构建库，Webpack 更适合用来构建应用程序。
    

对于业务团队来说，进行代码的模块打包更多情况下会选择 Webpack。那么，下面我们主要围绕 Webpack 工具，来介绍代码模块化打包的过程。

### 认识 Webpack

相信你肯定也认识 Webpack，要了解一个工具，最好的方式就是从如何使用它开始熟悉。

Webpack 的使用中有 4 个核心概念：入口（entry）、输出（output）、Loader、插件（plugins），我们先来分别看看。

#### 入口（entry）

首先便是入口（entry），entry 指向我们前端应用的第一个启动文件。例如，在 Vue 中是`new Vue()`位置所在的文件，在 Angular 中是启动`.bootstrap()`的文件，在 React 中则是`ReactDOM.render()`或者是`React.render()`的启动文件。

    // 将entry指向启动文件即可
    module.exports = {
      entry: "./path/to/my/entry/file.js",
    };
    

或许你会疑惑，入口的一个文件，又是怎样把整个前端项目中的代码关联起来，并进行打包的呢？

实际上， Webpack 会从 entry 开始，通过解析模块间的依赖关系，递归地构建出一个依赖图。我们如果在项目中使用`webpack-bundle-analyzer`插件，也可以看到生成的这样一个依赖图。

![图片4.png](https://s0.lgstatic.com/i/image6/M00/3F/85/CioPOWCeSrqACnYnABLbVfl-Zds569.png)

Webpack 会根据依赖图来对各个模块进行整合，最终打包成一个或多个的文件，来提供给浏览器进行加载。

既然有入口，那当然就有出口，Webpack 中的出口由输出（output）字段来描述。

#### 输出（output）

输出（output）字段用于告诉 Webpack 要将打包后的代码生成的文件名是什么（`filename`），以及将它们放在哪里（`path`）。

    module.exports = {
      output: {
        filename: "bundle.js", // 编译文件的文件名，比如 main.js/bundle.js/index.js
        path: "/home/proj/public/assets", // 对应一个绝对路径，此路径是你希望一次性打包的目录
      },
    };
    

有了 entry 和 output，我们来看看 Webpack 中间的编译过程中，是怎样用到 Loader 和 Plugins 的。

#### Loader

要了解 Loader，你需要知道在 Webpack 中，每个文件(`.css`,`.html`,`.scss`,`.jpg`等) 都会被作为模块处理。如果你看过生成的 bundle.js 代码就会发现，Webpack 将所有的模块打包一起，每个模块添加标记 id，通过这样一个 id 去获取所需模块的代码。

但实际上，Webpack 只理解 JavaScript，因此 Loader 的作用就是把不同的模块和文件（比如 HTML、CSS、JSX、Typescript 等）转换为 JavaScript 模块。

而不同的应用场景需要不同的 Loader，比如我们经常会使用到的 CSS 相关 Loader 和其他资源 Loader。

![图片3.png](https://s0.lgstatic.com/i/image6/M01/3F/7C/Cgp9HWCeSqyAWHwvAAHProznCQc246.png)

前面我们说到，ES6 模块需要依赖 Babel 编译和 Webpack 打包，而 Babel 在 Webpack 中就是使用 Loader 的方式来进行编译的。

babel-loader 将 ES6/ES7 语法编译生成 ES5，其中部分特性还需要 babel-polyfill 支持。这是因为 Babel 默认只转换新的 JavaScript 语法（比如`const/let`），但不会对新的 API（比如`Promise`）进行处理。

Webpack 在编译过程中，支持多个 Loader 通过流水线的方式进行先后编译，编译的顺序为从后往前，最终以 JavaScript 模块的方式输出。

到这里，我们知道 Webpack 以 entry 为入口，链式调用各个 Loader 进行编译生成 JavaScript，最终打包放置在 output 中。其中 Loader 只负责将其他非 JavaScript 模块转换成 JavaScript 模块。

那 Webpack 又是怎样地对这些代码进行组织并生成文件呢？这就是插件 Plugins 负责的事情。

#### 插件（plugins）

插件（plugins）主要负责解决 Loader 无法做到的事情，它可以访问在 Webpack 编译过程中的关键事件，对 Webpack 内部示例的一些数据进行处理，处理完成后回调 Webpack 让其继续。

这样说或许有些抽象，我们直接来看看几个常用的插件就明白了。

*   HtmlwebpackPlugin：可以生成创建 HTML 入口文件，也可以为 HTML 文件中引入的外部资源如 script、link 动态添加每次编译后的哈希值，防止引用缓存的外部文件问题。
    
*   CommonsChunkPlugin：用来提取代码中的公共模块，并将这些公共模块按照预期进行打包生成独立的文件。
    
*   ProvidePlugin：用来定义标识符，当遇到指定标识符的时候自动加载模块，适合引入的全局变量（比如 jQuery）。
    
*   ExtractTextPlugin：可以将样式从 JavaScript 中抽出，生成单独的 .css 样式文件。
    

看到这里你应该已经明白了，**插件可以用来控制最终生成的代码是如何进行组织和输出的，包括对代码的打包优化、压缩，甚至是启用模块热替换、重新定义环境中的变量，等等**。

那么，现在我们已经知道 Webpack 到底对项目代码做了什么。

1.  通过 entry 指定的入口开始，解析各个文件模块间的依赖。
    
2.  根据模块间的依赖关系，开始对各个模块进行编译。
    
3.  编译过程中，根据配置的规则对一些模块使用 Loader 进行编译处理。
    
4.  根据插件的配置，对 Loader 编译后的代码进行封装、优化、分块、压缩等。
    
5.  最终 Webpack 整合各个模块，根据依赖关系将它们打包成最终的一个或者多个文件。
    

这便是 Webpack 做的事情：**让前端项目中模块化的代码能最终在浏览器中进行加载、并正常地工作。**

### 小结

如今几乎大多数框架的代码构建工具（比如 Vue CLI、Create React App 等）底层实现都依赖 Webpack。虽然这些前端框架都提供了完善的脚手架，也提供了丰富的配置功能，但如果想要对自己的项目进行更多优化，我们依然需要自己调整 Webpack 配置，因此对它的掌握也是不可少的。

对于前端来说，自动化工具的出现，大大降低了应用的开发和维护成本，也因此前端生态也日益丰富和完善。善用这些工具来解决开发过程中的痛点，是作为现代前端开发的必备技能。比如，我们可以使用 Webpack 的 Loader 和插件，实现自己的 AST 语法分析和代码处理过程，这也是许多前端框架在做的事情。

如果你要做一个在编译时自动给 Class 类加上指定装饰器的能力，你认为是应该使用 Loader 还是 Plugins 呢？可以在留言区留下你的想法和实现逻辑。