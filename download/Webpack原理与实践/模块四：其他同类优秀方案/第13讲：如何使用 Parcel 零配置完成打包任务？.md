今天我要带你了解一个近两年非常火的打包工具：Parcel。

Parcel 是一款完全零配置的前端打包器，它提供了 “傻瓜式” 的使用体验，我们只需了解它提供的几个简单的命令，就可以直接使用它去构建我们的前端应用程序了。

下面我们直接来看具体如何去使用 Parcel。

### 快速上手

这里我们先创建一个空目录，然后通过 npm init 初始化一个项目中的 package.json 文件。

完成以后我们就可以安装 Parcel 模块了，具体命令如下：

    $ npm install parcel-bundler --save-dev
    

这里需要注意 Parcel 的 npm 模块名称叫作 parcel-bundler，我们同样应该将它安装到项目的开发依赖中。

安装完成过后，parcel-bundler 模块就在 node\_modules/.bin 目录中提供了一个叫作 parcel 的 CLI 程序，后续我们就是使用这个 CLI 程序执行应用打包。

既然是打包应用代码，那我们这里就得先有代码。我们回到项目中创建一些必需的文件，结构如下：

    .
    ├── src
    │   ├── index.html
    │   ├── logger.js
    │   └── main.js
    └── package.json
    

首先在根目录下新建一个 src 目录，用于存放开发阶段编写的源代码，同时创建两个 JS 文件，分别是 logger.js 和 main.js，然后再创建一个 index.html 文件，这个 index.html 文件会将是 Parcel 打包的入口文件。

虽然 Parcel 跟 Webpack 一样都支持以任意类型文件作为打包入口，不过 Parcel 官方还是建议我们使用 HTML 文件作为入口。官方的理由是 HTML 是应用在浏览器端运行时的入口。

那在这个 HTML 入口文件中，我们可以像平时一样去编写代码，也可以正常去引用资源。在它里面引用的资源，最终都会被 Parcel 打包到一起。

我们这里先尝试在 index.html 中引入 main.js 脚本文件，具体代码如下：

    <!-- ./src/index.html -->
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Parcel Tutorials</title>
    </head>
    <body>
      <script src="main.js"></script>
    </body>
    </html>
    

紧接着，在 main.js 中按照 ES Modules 的方式导入 logger.js 中的成员，具体代码如下：

    // ./src/main.js
    import { log } from './logger'
    log('hello parcel')
    // ./src/logger.js
    export const log = msg => {
      console.log('---------- INFO ----------')
      console.log(msg)
    }
    

Parcel 同样支持对 ES Modules 模块的打包。

完成以后，我们打开命令行终端，然后使用 npx 去运行 node\_modules 目录下的 parcel 命令。具体命令如下：

    $ npx parcel src/index.html
    

parcel 命令需要我们传入打包入口文件路径，那我们这里就应该是 src/index.html。

此时如果执行这个命令，Parcel 就会根据这里传入的参数，先找到 index.html，然后在根据 HTML 中的 script 标签，找到 main.js，最后再顺着 import 语句找到 logger.js 模块，从而完成整体打包。

回车执行过后，这里我们发现 Parcel 这个命令不仅仅帮我们打包了应用，而且还同时开启了一个开发服务器，这就跟 Webpack Dev Server 一样。

我们打开这个地址，启动浏览器，然后打开开发人员工具。Parcel 同样支持自动刷新这样的功能。具体效果如下：

![image (3).png](https://s0.lgstatic.com/i/image/M00/15/BE/Ciqc1F7UozCAaPTaAAUS6rk6md0993.png)

以上就是 Parcel 的基本使用，相比于 Webpack，Parcel 在使用上的确简化了很多。

#### 模块热替换

如果你需要的是模块热替换的体验，Parcel 中也可以支持。我们回到 main.js 文件中，这里同样需要使用 HMR 的 API。具体代码如下：

    // ./src/main.js
    import { log } from './logger'
    log('hello parcel')
    // HMR API
    if (module.hot) {
      module.hot.accept(() => {
        console.log('HMR～')
      })
    }
    

我们需要先判断一下 module.hot 对象是否存在，如果存在则证明当前环境可以使用 HMR 的 API，那我们就可以使用 module.hot.accept 方法去处理热替换。

不过这里的 accept 方法与 Webpack 提供的 HMR 有点不太一样，Webpack 中的 accept 方法支持接收两个参数，用来处理指定的模块更新后的逻辑。

而这里 Parcel 提供的 accept 只需要接收一个回调参数，作用就是当前模块更新或者所依赖的模块更新过后自动执行传入的回调函数，这相比于之前 Webpack 中的用法要简单很多。

关于模块更新后的处理逻辑，这里我们就不再过多介绍了，你可以参考我们在 08 课时 Webpack HMR 中的介绍。

#### 自动安装依赖

除了热替换，Parcel 还支持一个非常友好的功能：自动安装依赖。试想一下，你正在开发一个应用的过程中，突然需要使用某个第三方模块，那此时你就需要先停止正在运行的 Dev Server，然后再去安装这个模块，安装完成过后再重新启动 Dev Server。有了自动安装依赖的功能就不必如此麻烦了。

我们回到 main.js 文件中，假设我们这里想要使用一下 jquery。虽然我们并没有安装这个模块，但是因为有了自动安装依赖功能，我们这里只管正常导入，正常使用就好了。具体效果如下：

![1.gif](https://s0.lgstatic.com/i/image/M00/16/00/Ciqc1F7U03qAE1KxADTVBtOwcSs532.gif)

在文件保存过后，Parcel 会自动去安装刚刚导入的模块包，极大程度地避免手动操作。

#### 其他类型资源加载

除此以外，Parcel 同样支持加载其他类型的资源模块，而且相比于其他的打包器，在 Parcel 中加载其他类型的资源模块同样是零配置的。

例如我们这里再来添加一个 style.css 的样式文件，并且在这个文件中添加一些简单的样式，具体如下：

     .
     ├── src
     │   ├── index.html
     │   ├── logger.js
     │   ├── main.js
    +│   └── style.css
     └── package.json
    

然后回到 main.js 中通过 import 导入这个样式文件，具体如下：

    // ./src/main.js
    import { log } from './logger'
    import './style.css'
    log('hello parcel')
    

保存过后，样式文件可以立即生效。效果如下：

![image (4).png](https://s0.lgstatic.com/i/image/M00/15/CA/CgqCHl7Uo1eAHNwFAAVD1HZtuN0096.png)

你会发现，导入样式的操作，整个过程我们并没有停下来做额外的事情。

总之，Parcel 希望给开发者的体验就是想做什么，只管去做，其他额外的事情就交给工具来处理。

#### 动态导入

另外，Parcel 同样支持直接使用动态导入，内部也会自动处理代码拆分，我们也一起来尝试一下。

这里我们先将静态导入的 jQuery 注释掉。然后使用动态导入的方式导入 jQuery 模块。具体代码如下：

    // ./src/main.js
    // import $ from 'jquery'
    import { log } from './logger'
    log('hello parcel')
    import('jquery').then($ => {
      $(document.body).append('<h1>Hello Parcel</h1>')
    })
    

import 函数返回的就是一个 Promise 对象，在这个 Promise 对象 then 方法的回调中，我们就能够拿到导入的模块对象了，然后我们就可以把使用 jQuery 的代码移到这个回调函数中。

保存过后，回到浏览器，找到开发人员工具的 Network 面板，这里就能够看到拆分出来的 jquery 所对应的 bundle 文件请求了。具体效果如下图：

![image (5).png](https://s0.lgstatic.com/i/image/M00/15/BE/Ciqc1F7Uo2WASIAhAAGVL6iiNuQ803.png)

那以上基本上就是 Parcel 最常用的一些特性了，使用上根本没有任何难度，从头到尾我们都只是执行了一个 Parcel 命令。

#### 生产模式打包

接下来我们来看，Parcel 如何以生产模式打包。生产模式打包，具体命令如下：

    $ npx parcel build src/index.html
    

我们只需要执行 parcel build 然后跟上打包入口文件路径，就可以以生产模式运行打包了。

这里补充一点，相同体量的项目打包，Parcel 的构建速度会比 Webpack 快很多。因为 Parcel 内部使用的是多进程同时工作，充分发挥了多核 CPU 的性能。

> P.S. Webpack 中也可以使用一个叫作 [happypack](https://github.com/amireh/happypack) 的插件实现这一点。

那我们这里再来看一下输出的打包结果，具体结果如下：

![image (6).png](https://s0.lgstatic.com/i/image/M00/15/BE/Ciqc1F7Uo3GARoNnAABz_Av9vqc833.png)

此时，dist 目录下就都是本次打包的结果了。这里的输出文件也都会被压缩，而且样式代码也会被单独提取到单个文件中。

那这就是 Parcel 的体验，整体体验下来就是一个感觉：舒服，因为它在使用上真的太简单了。

### 写在最后

Parcel 是 2017 年发布的，出现的原因是因为当时的 Webpack 使用过于烦琐，文档也不是很清晰明了，所以 Parcel 一经推出就迅速被推上风口浪尖。其核心特点就是：

*   真正做到了完全零配置，对项目没有任何的侵入；
*   自动安装依赖，开发过程更专注；
*   构建速度更快，因为内部使用了多进程同时工作，能够充分发挥多核 CPU 的效率。

但是目前看来，如果你去观察开发者的实际使用情况，绝大多数项目的打包还是会选择 Webpack。个人认为原因有两点：

1.  Webpack 生态更好，扩展更丰富，出现问题容易解决；
2.  随着这两年的发展，Webpack 越来越好用，开发者也越来越熟悉。

所以，Parcel 这样的工具对于开发者而言，我们去了解它，也就是为了保持对新鲜技术和工具的敏感度，从而更好地把握技术趋势和走向，仅此而已。