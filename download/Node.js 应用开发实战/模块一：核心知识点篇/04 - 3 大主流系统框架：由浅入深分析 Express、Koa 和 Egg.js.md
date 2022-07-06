上一讲我们没有应用任何框架实现了一个简单后台服务，以及一个简单版本的 MSVC 框架。本讲将介绍一些目前主流框架的设计思想，同时介绍其核心代码部分的实现，为后续使用框架优化我们上一讲实现的 MSVC 框架做一定的准备。

### 主流框架介绍

目前比较流行的 Node.js 框架有**Express**、**KOA** 和 **Egg.js**，其次是另外一个正在兴起的与 TypeScript 相关的框架——Nest.js，接下来我们分析三个主流框架之间的关系。

在介绍框架之前，我们先了解一个非常重要的概念——**洋葱模型**，这是一个在 Node.js 中比较重要的面试考点，掌握这个概念，当前各种框架的原理学习都会驾轻就熟。无论是哪个 Node.js 框架，都是基于中间件来实现的，而中间件（可以理解为一个类或者函数模块）的执行方式就需要依据洋葱模型来介绍。Express 和 KOA 之间的区别也在于洋葱模型的执行方式上。

#### 洋葱模型

洋葱我们都知道，一层包裹着一层，层层递进，但是现在不是看其立体的结构，而是需要将洋葱切开来，从切开的平面来看，如图 1 所示。

![Drawing 0.png](https://s0.lgstatic.com/i/image6/M00/17/0C/CioPOWBHM5qAFpsgAA9oKfFNTFM895.png)

图 1 洋葱切面图

可以看到要从洋葱中心点穿过去，就必须先一层层向内穿入洋葱表皮进入中心点，然后再从中心点一层层向外穿出表皮，这里有个特点：进入时穿入了多少层表皮，出去时就必须穿出多少层表皮。先穿入表皮，后穿出表皮，符合我们所说的栈列表，**先进后出**的原则。

然后再回到 Node.js 框架，洋葱的表皮我们可以思考为**中间件**：

*   从外向内的过程是一个关键词 next()；
    
*   而从内向外则是每个中间件执行完毕后，进入下一层中间件，一直到最后一层。
    

#### 中间件执行

为了理解上面的洋葱模型以及其执行过程，我们用 Express 作为框架例子，来实现一个后台服务。在应用 Express 前，需要做一些准备工作，你按照如下步骤初始化项目即可。

    mkdir myapp
    cd myapp
    npm init
    npm install express --save
    touch app.js
    

然后输入以下代码，其中的 app.use 部分的就是 3 个中间件，从上到下代表的是洋葱的从外向内的各个层：**1 是最外层**，**2 是中间层**，**3 是最内层**。

![Drawing 1.png](https://s0.lgstatic.com/i/image6/M00/17/10/Cgp9HWBHM6eAF1p7AAG-YifWNQg212.png)

接下来我们运行如下命令，启动项目。

    node app.js
    

启动成功后，打开浏览器，输入如下浏览地址：

    http://127.0.0.1:3000/
    

然后在命令行窗口，你可以看到打印的信息如下：

    Example app listening on port 3000!
    first
    second
    third
    third end
    second end
    first end
    

这就可以很清晰地验证了我们中间件的执行过程：

*   先执行第一个中间件，输出 first；
    
*   遇到 next() 执行第二个中间件，输出 second；
    
*   再遇到 next() 执行第三个中间件，输出 third；
    
*   中间件都执行完毕后，往外一层层剥离，先输出 third end；
    
*   再输出 second；
    
*   最后输出 first end。
    

以上就是中间件的执行过程，不过 Express 和 KOA 在中间件执行过程中还是存在一些差异的。

#### Express & KOA

Express 框架出来比较久了，它在 Node.js 初期就是一个**热度较高**、**成熟**的 Web 框架，并且包括的**应用场景非常齐全**。同时基于 Express，也诞生了一些场景型的框架，常见的就如上面我们提到的 Nest.js 框架。

随着 Node.js 的不断迭代，出现了以 await/async 为核心的语法糖，Express 原班人马为了实现一个高可用、高性能、更健壮，并且符合当前 Node.js 版本的框架，开发出了 **KOA 框架**。

那么两者存在哪些方面的差异呢：

*   Express 封装、内置了很多中间件，比如 connect 和 router ，而 KOA 则比较轻量，开发者可以根据自身需求**定制框架**；
    
*   Express 是基于 callback 来处理中间件的，而 KOA 则是基于 await/async；
    
*   在异步执行中间件时，Express 并非严格按照洋葱模型执行中间件，而 KOA 则是严格遵循的。
    

为了更清晰地对比两者在中间件上的差异，我们对上面那段代码进行修改，其次用 KOA 来重新实现，看下两者的运行差异。

因为两者在中间件为**异步函数**的时候处理会有不同，因此我们保留原来三个中间件，同时在 2 和 3 之间插入一个新的**异步中间件**，代码如下：

    /**
     * 异步中间件
     */
    app.use(async (req, res, next) => {
        console.log('async');
        await next();
        await new Promise(
            (resolve) => 
                setTimeout(
                    () => {
                        console.log(`wait 1000 ms end`);
                        resolve()
                    }, 
                1000
            )
        );
        console.log('async end');
    });
    

然后将其他中间件修改为 await next() 方式，如下中间件 1 的方式：

    /**
     * 中间件 1
     */
    app.use(async (req, res, next) => {
        console.log('first');
        await next();
        console.log('first end');
    });
    

接下来，我们启动服务：

    node app
    

并打开浏览器访问如下地址：

    http://127.0.0.1:3000/
    

然后再回到打印窗口，你会发现输出如下数据：

    Example app listening on port 3000!
    first
    second
    async
    third
    third end
    second end
    first end
    wait 1000 ms end
    async end
    

可以看出，**从内向外的是正常的**，一层层往里进行调用，**从外向内时则发生了一些变化**，最主要的原因是异步中间件并没有按照顺序输出执行结果。

接下来我们看看 KOA 的效果。在应用 KOA 之前，我们需要参照如下命令进行初始化。

    mkdir -p koa/myapp-async
    cd koa/myapp-async
    npm init
    npm i koa --save
    touch app.js
    

然后我们打开 app.js 添加如下代码，这部分我们只看**中间件 1** 和**异步中间件**即可，其他在 GitHub 源码中，你可以自行查看。

    const Koa = require('koa');
    const app = new Koa();
    /**
     * 中间件 1
     */
    app.use(async (ctx, next) => {
        console.log('first');
        await next();
        console.log('first end');
    });
    /**
     * 异步中间件
     */
    app.use(async (ctx, next) => {
        console.log('async');
        await next();
        await new Promise(
            (resolve) => 
                setTimeout(
                    () => {
                        console.log(`wait 1000 ms end`);
                        resolve()
                    }, 
                1000
            )
        );
        console.log('async end');
    });
    app.use(async ctx => {
        ctx.body = 'Hello World';
      });
    
    app.listen(3000, () => console.log(`Example app listening on port 3000!`));
    

和 express 代码基本没有什么差异，只是将中间件中的 res、req 参数替换为 ctx ，如上面代码的第 6 和 14 行，修改完成以后，我们需要启动服务：

    node app
    

并打开浏览器访问如下地址：

    http://127.0.0.1:3000/
    

然后打开命令行窗口，可以看到如下输出：

    Example app listening on port 3000!
    first
    second
    async
    third
    third end
    wait 1000 ms end
    async end
    second end
    first end
    

你会发现，KOA 严格按照了洋葱模型的执行，从上到下，也就是从洋葱的内部向外部，输出 first、second、async、third；接下来从内向外输出 third end、async end、second end、first end。

因为两者基于的 Node.js 版本不同，所以只是出现的时间点不同而已，并没有孰优孰劣之分。Express 功能较全，发展时间比较长，也经受了不同程度的历练，因此在一些项目上是一个不错的选择。当然你也可以选择 KOA，虽然刚诞生不久，但它是未来的一个趋势。

#### KOA & Egg.js

上面我们说了 KOA 是一个可定制的框架，开发者可以根据自己的需要，定制各种机制，比如多进程处理、路由处理、上下文 context 的处理、异常处理等，非常灵活。而 Egg.js 就是在 KOA 基础上，做了各种比较成熟的中间件和模块，可以说是在 KOA 框架基础上的最佳实践，用以满足开发者开箱即用的特性。

我们说到 KOA 是未来的一个趋势，然后 Egg.js 是目前 KOA 的最佳实践，因此在一些企业级应用后台服务时，可以使用 Egg.js 框架，如果你需要做一些高性能、高定制化的框架也可以在 KOA 基础上扩展出新的框架。本专栏为了实践教学，我们会在 KOA 基础上将上一讲的框架进行优化和扩展。

### 原理实现

以上简单介绍了几个框架的知识点，接下来我们再来看下其核心实现原理，这里只介绍底层的两个框架**Express**和**KOA**，如果你对 Egg.js 有兴趣的话，可以参照我们的方法进行学习。

#### Express

Express 涉及 app 函数、中间件、Router 和视图四个核心部分，这里我们只介绍 app 函数、中间件和 Router 原理，因为视图在后台服务中不是特别关键的部分。

我们先来看一个图，图 2 是 Express 核心代码结构部分：

![Drawing 2.png](https://s0.lgstatic.com/i/image6/M01/17/0D/CioPOWBHM7-AN7gmAABaG7HpWG8493.png)

图 2 Express 核心代码

它涉及的源码不多，其中：

*   middleware 是部分中间件模块；
    
*   router 是 Router 核心代码；
    
*   appliaction.js 就是我们所说的 app 函数核心处理部分；
    
*   express.js 是我们 express() 函数的执行模块，实现比较简单，主要是创建 application 对象，将 application 对象返回；
    
*   request.js 是对 HTTP 请求处理部分；
    
*   response.js 是对 HTTP 响应处理部分；
    
*   utils.js 是一些工具函数；
    
*   view.js 是视图处理部分。
    

**express.js**

在 express 整个代码架构中核心是创建 application 对象，那么我们先来看看这部分的核心实现部分。在 Express 中的例子都是下面这样的：

    const express = require('express')
    const app = express()
    const port = 3000
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
    app.get('/', (req, res) => res.send('Hello World!'))
    

其中我们所说的 app ，就是 express() 函数执行的返回，该 express.js 模块中核心代码是一个叫作 createApplication 函数，代码如下：

    function createApplication() {
    	  var app = function(req, res, next) {
    	    app.handle(req, res, next);
    	  };
    	
    	  mixin(app, EventEmitter.prototype, false);
    	  mixin(app, proto, false);
    	
    	  // expose the prototype that will get set on requests
    	  app.request = Object.create(req, {
    	    app: { configurable: true, enumerable: true, writable: true, value: app }
    	  })
    	
    	  // expose the prototype that will get set on responses
    	  app.response = Object.create(res, {
    	    app: { configurable: true, enumerable: true, writable: true, value: app }
    	  })
    	
    	  app.init();
    	  return app;
    	}
    

代码中最主要的部分是创建了一个 app 函数，并将 application 中的函数继承给 app 。因此 app 包含了 application 中所有的属性和方法，而其中的 app.init() 也是调用了 application.js 中的 app.init 函数。在 application.js 核心代码逻辑中，我们最常用到 app.use 、app.get 以及 app.post 方法，这三个原理都是一样的，我们主要看下 app.use 的代码实现。

**application.js**

**app.use**，用于**中间件以及路由的处理**，是我们常用的一个核心函数。

*   在只传入一个函数参数时，将会匹配所有的请求路径。
    
*   当传递的是具体的路径时，只有匹配到具体路径才会执行该函数。
    

如下代码所示：

    const express = require('express')
    const app = express()
    const port = 3000
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
    app.use((req, res, next) => {
        console.log('first');
        next();
        console.log('first end');
    });
    app.use('/a', (req, res, next) => {
        console.log('a');
        next();
        console.log('a end');
    });
    app.get('/', (req, res) => res.send('Hello World!'))
    app.get('/a', (req, res) => res.send('Hello World! a'))
    

当我们只请求如下端口时，只执行第 6 ~ 10 行的 app.use。

    http://127.0.0.1:3000/
    

而当请求如下端口时，两个中间件都会执行。

    http://127.0.0.1:3000/a
    

再来看下 Express 代码实现，如图 3 所示：

![Drawing 3.png](https://s0.lgstatic.com/i/image6/M01/17/10/Cgp9HWBHM-CAYcukAAFHHQytNag202.png)

图 3 Express app.use 代码实现

当没有传入 path 时，会默认设置 path 为 / ，而 / 则是**匹配任何路径**，最终都是调用 router.use 将 fn 中间件函数传入到 router 中。

接下来我们看下 router.use 的代码实现。

**router/index.js**

这个文件在当前目录 router 下的 index.js 中，有一个方法叫作 proto.use，即 application.js 中调用的 router.use 。

![Drawing 4.png](https://s0.lgstatic.com/i/image6/M01/17/0D/CioPOWBHM-eAT835AAFGYW1HaL0653.png)

图 4 中间件 push 实现

图 4 中的代码经过一系列处理，最终将中间件函数通过 Layer 封装后放到栈列表中。就完成了中间件的处理，最后我们再来看下用户请求时，是如何在栈列表执行的。

所有请求进来后都会调用 application.js 中的 **app.handle** 方法，该方法最终调用的是 router/index.js 中的 **proto.handle** 方法，所以我们主要看下 router.handle 的实现。在这个函数中有一个 next 方法非常关键，用于判断执行**下一层中间件的逻辑**，它的原理是从栈列表中取出一个 layer 对象，判断是否满足当前匹配，如果满足则执行该中间件函数，如图 5 所示。

![Drawing 5.png](https://s0.lgstatic.com/i/image6/M01/17/0D/CioPOWBHM_CAGrfhAAEAXbjYjVU402.png)

图 5 中间件执行逻辑

接下来我们再看看 layer.handle\_request 的代码逻辑，如图 6 所示。

![Drawing 6.png](https://s0.lgstatic.com/i/image6/M01/17/10/Cgp9HWBHM_iAAdIdAACdFAXr7Tg707.png)

图 6 handle\_request 代码实现

图 6 中的代码释放了一个很重要的逻辑，就是在代码 try 部分，会执行 fn 函数，而 fn 中的 next 为下一个中间件，因此中间件栈执行代码，过程如下所示：

    (()=>{ 
        console.log('a'); 
        (()=>{ 
            console.log('b'); 
            (()=>{ 
                console.log('c'); 
                console.log('d'); 
            })();
            console.log('e'); 
        })();
        console.log('f'); 
    })();
    

如果没有异步逻辑，那肯定是 a → b → c → d → e → f 的执行流程，如果这时我们在第二层增加一些异步处理函数时，情况如下代码所示：

    (async ()=>{ 
        console.log('a'); 
        (async ()=>{ 
            console.log('b'); 
            (async ()=>{ 
                console.log('c'); 
                console.log('d'); 
            })();
            await new Promise((resolve) => setTimeout(() => {console.log(`async end`);resolve()}, 1000));
            console.log('e'); 
        })();
        console.log('f'); 
    })();
    

再执行这部分代码时，你会发现整个输出流程就不是原来的模式了，这也印证了 Express 的中间件执行方式并不是完全的洋葱模型。

Express 源码当然不止这些，这里只是介绍了部分核心代码，其他部分建议你按照这种方式自我学习。

#### KOA

和 Express 相似，我们只看 app 函数、中间件和 Router 三个部分的核心代码实现。在 app.use 中的逻辑非常相似，唯一的区别是，在 KOA 中使用的是 await/async 语法，因此需要判断中间件**是否为异步方法**，如果是则使用 koa-convert 将其转化为 Promise 方法，代码如下：

      use(fn) {
        if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
        if (isGeneratorFunction(fn)) {
          deprecate('Support for generators will be removed in v3. ' +
                    'See the documentation for examples of how to convert old middleware ' +
                    'https://github.com/koajs/koa/blob/master/docs/migration.md');
          fn = convert(fn);
        }
        debug('use %s', fn._name || fn.name || '-');
        this.middleware.push(fn);
        return this;
      }
    

最终都是将中间件函数放入中间件的一个数组中。接下来我们再看下 KOA 是如何执行中间件的代码逻辑的，其核心是 koa-compose 模块中的这部分代码：

    return function (context, next) {
        // last called middleware #
        let index = -1
        return dispatch(0)
        function dispatch (i) {
          if (i <= index) return Promise.reject(new Error('next() called multiple times'))
          index = i
          let fn = middleware[i]
          if (i === middleware.length) fn = next
          if (!fn) return Promise.resolve()
          try {
            return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
          } catch (err) {
            return Promise.reject(err)
          }
        }
      }
    

在代码中首先获取第一层级的中间件，也就是数组 middleware 的第一个元素，这里不同点在于使用了 Promise.resolve 来执行中间件，根据上面的代码我们可以假设 KOA 代码逻辑是这样的：

    new Promise(async (resolve, reject) => {
            console.log('a')
            await new Promise(async (resolve, reject) => {
                console.log('b');
                await new Promise((resolve, reject) => {
                    console.log('c');
                    resolve();
                }).then(async () => {
                    await new Promise((resolve) => setTimeout(() => {console.log(`async end`);resolve()}, 1000));
                    console.log('d');
                });
                resolve();
            }).then(() => {
              console.log('e')
            })
            resolve();
        }).then(() => {
            console.log('f')
        })
    

可以看到所有 next() 后面的代码逻辑都包裹在 next() 中间件的 then 逻辑中，这样就可以确保上一个异步函数执行完成后才会执行到 then 的逻辑，也就保证了洋葱模型的先进后出原则，这点是 KOA 和 Express 的本质区别。这里要注意，如果需要确保中间件的执行顺序，必须使用 **await next()**。

Express 和 KOA 的源代码还有很多，这里就不一一分析了，其他的部分你可以自行学习，在学习中，可以进一步提升自己的编码能力，同时改变部分编码陋习。在此过程中有任何问题，都欢迎留言与我交流。

### 总结

本讲先介绍了洋葱模型，其次根据洋葱模型详细分析了 Express 和 KOA 框架的区别和联系，最后介绍了两个核心框架的 app 函数、中间件和 Router 三个部分的核心代码实现。学完本讲，你需要掌握洋葱模型，特别是在面试环节中要着重介绍；能够讲解清楚在 Express 与 KOA 中的洋葱模型差异；以及掌握 Express 和 KOA 中的核心代码实现部分原理；其次了解 Egg.js 框架。

下一讲，我们将会介绍 Node.js 多进程方案，在介绍该方案时，我们还会应用 KOA 框架来优化我们第 03 讲的基础框架，使其成为一个比较通用的框架。

* * *

[![Drawing 2.png](https://s0.lgstatic.com/i/image6/M00/12/FA/CioPOWBBrAKAAod-AASyC72ZqWw233.png)](https://shenceyun.lagou.com/t/mka)

**《大前端高薪训练营》**

对标阿里 P7 技术需求 + 每月大厂内推，6 个月助你斩获名企高薪 Offer。[点击链接](https://shenceyun.lagou.com/t/mka)，快来领取！