上一讲我们学习了机器部署的一些方案和策略，比如当你要将一个服务部署到多台（2台以上）机时，你会发现为了尽可能地利用资源、避免浪费，更不能在高并发时引起现网问题，每次都要精细地分析每台机器的部署方案，那有没有可以弹性地根据当前负载情况进行自动化的方案呢？

当然有，就是我们这一讲要学习的 Serverless 技术，目前市面上 Serverless 技术的资料非常多（拉勾教育也有一门课 《 玩转 Serverless 架构》，感兴趣可以看一下）。而我们这一讲主要学习的是，Serverless 是怎么帮我们解决 Node.js 的问题点的；以及怎么将课程中的 KOA 框架应用接入到 Serverless 服务中去。

作为 Node.js 后台开发人员，因为一定会涉及服务器资源、服务器的部署分配或者自动化扩容等问题，所以你有必要去仔细学习今天的内容，希望学完这一讲之后，你能从 Serverless 的角度去解决这些问题，为你的企业节省一大笔费用。

### 什么是 Serverless

Serverless 的英文转换过来就是无服务器，简单理解是“摒弃服务器”。但是无服务器不是说真的没有服务器，而是说云服务厂商来帮你动态地规划服务器资源，你只提供源代码给云厂商，云厂商就按照你服务所调度的资源来计费，而不是最原始的租借服务器的方式。

#### 实际场景

按照 18 讲中的多服务部署经验，你要严格地根据服务并发情况分配服务器，并且要按照服务的并发上限来分配服务器。

比如你经过压测分析后，得到结论是需要 4 台 16 核的服务器，那么你在每台服务器上还只能启动 14 或者 15 个进程（避免内核占满，服务器异常无法使用的情况）。我们来计算成本，假设 1 台机器 1 万元/年， 那么 4 台就是 4 万元/年。

也就说不管你用多或者用少，服务器已经分配给你了，这 4 万元/年没法避免，但其实你是无法充分利用服务器资源的，因为我们都是按照最大并发来配置的，所以一定存在服务资源的浪费（极端地说，如果今年的业绩没有达到预期，并没有用到多出来的 4 台机器，就全浪费了）。

#### 解决的问题

在上面的例子中，如果没有 Serverless ，会一直存在这样的问题，没有一个很好的解决方案，所以多少存在资源浪费的问题，那么 Serverless 解决了 Node.js 服务的哪些问题呢？

*   **费用问题：** 假设我还是给你 4 台最大并发的服务器，但是不让你按月缴费，而是根据你调用的次数和流量来计费，这种计费方式下，可以在没有服务调用时不计费，所以大部分情况下都是 Serverless 价格优势更大。
    
*   **扩容更加简单：** 如果你遇到公司大促，只用临时扩容当前的内存占用即可，不用再一步步地去部署服务器环境，再部署 Node.js 服务，最后经过测试验证后才可使用。
    
*   **减少了并发校验的问题：** 根据课程的内容，我们每次都要预估上线后的服务承载能力，并且需要非常细致地规划服务器部署情况，但有了 Serverless 以后，可以不用关心这种情况，专注避免性能问题就行。
    
*   **环境依赖兼容问题更少：** Node.js 对各种库版本都是有要求的，而如果服务器共用，就务必会导致各种 so 库版本不兼容问题，但是 Serverless 是独立的环境运行空间，所以不用担心这类问题，这些都由云服务厂商帮你解决。
    

既然 Severless 可以帮你解决上述问题，那么我们就来尝试将 KOA 框架应用接入到 Serverless 云服务上。

### 如何应用

因为 Serverless 是从线下转到线上的云计算的技术应用，所以我们要依托一家云计算服务来分析演示，比如 AWS 、腾讯云或者阿里云都有一定的免费调用次数。在选择一家免费云测试服务以后，接下来就将现有的业务进行改造，以满足接入要求。

#### KOA 接入

目前各大云计算服务都支持 Node.js 的各种框架接入，比如我们所使用的 KOA ，这里我们选了一家免费的云计算服务来演示接入过程，其中有一个接入指引，你可以去 [GitHub](https://github.com/serverless-components/tencent-koa/tree/master?fileGuid=xxQTRXtVcqtHK6j8) 上了解其接入方案（这里不涉及任何推荐云平台，在测试阶段根据自己的喜好接入，接入方法比较简单）。

**设置配置文件**

无论是哪家云计算服务，一般都会包含一个 Serverless 配置文件，用于保存当前服务的相关启动配置，比如下面我们的一个 Serverless 配置。

    component: koa # (required) name of the component. In that case, it's koa.
    app: koa-tst-4 # (optional) Serverless dashboard app. default is the same as the name property.
    name: koa-tst-4 # (required) name of your koa component instance.
    inputs:
      src:
        src: ./ # (optional) path to the source folder. default is a hello world app.
        exclude:
          - .env
      region: ap-guangzhou
      runtime: Nodejs10.15
      apigatewayConf:
        protocols:
          - http
          - https
        environment: test
    

首先在 component 中申明了框架类型，其次 app 说明了项目名称，name 则为启动的项目实例名称。inputs 就是项目相关的配置，比如 src 表明项目所处的根目录位置，详细的字段说明n你可以参考[GitHub 这个项目](https://github.com/serverless-components/tencent-koa/blob/master/docs/configure.md?fileGuid=xxQTRXtVcqtHK6j8)说明。

**修改 APP 入口文件**

默认情况下 Serverless 的入口文件名为 sls.js ，因此我们将项目中的 app.js 修改为 sls.js ，同时将 sls.js 中的最后一行代码进行修改如下。

    if(process.env.Serverless) {
        module.exports = app 
    } else {
        app.listen(3000) 
    }
    //app.listen(3000, () => console.log(`Example app listening on port 3000!`));
    

首先判断环境类型，如果是 Serverless 的运行环境，就使用 module.exports 导出相应的 app 对象，如果非 Serverless 环境，也就是我们自身环境就使用 listen 来启动服务。

以上就完成了接入，接下来只需要将代码上传到平台即可，上传平台有多种方式，比如命令行的方式。还可以使用代码文件夹上传的方式，或者 GitHub 地址授权引入的方式。

#### 实践测试

在代码上传完成以后，我们可以看到类似图 1 所示的结果。

![Drawing 0.png](https://s0.lgstatic.com/i/image6/M01/3B/F6/Cgp9HWCHw--AIb5jAAEa4Dzd7Bs282.png)

图 1 Serverless 服务

接下来我们只需要访问图 1 的 API 网关的 URL 。

打开地址后，我们就可以看到我们熟悉的框架响应数据了，如下图 2 所示。

![Drawing 1.png](https://s0.lgstatic.com/i/image6/M01/3B/F6/Cgp9HWCHw_aAEDyzAAAmkVZjuso799.png)

图 2 KOA 框架响应

接下来我们访问一个我们正确的路径地址，如下 URL：

    https://service-bnike5yc-1251046496.gz.apigw.tencentcs.com/release/page/index?name=lagou-nodejs
    

这个 URL 访问的就是我们 GitHub 源码中 Page 类的 index 方法，代码如下：

    const Controller = require('../core/controller');
    class Page extends Controller {
        async index() {
            let name = this.getParams('name');
            return this.resApi(true, 'success', {name} );
        }
    }
    module.exports = Page; 
    

代码逻辑比较简单，获取 name 字段，然后将 name 返回给到 API 调用方。因此当访问 page/index?name=lagou-nodejs 后，会响应如下数据，如图 3 示。

![Drawing 2.png](https://s0.lgstatic.com/i/image6/M00/3B/F6/Cgp9HWCHw_6AX42UAAAzwZkU7Fc325.png)

图 3 KOA 正常响应数据

由于需要独立部署项目，所以我们本讲的[GitHub 源码](https://github.com/love-flutter/serverless?fileGuid=xxQTRXtVcqtHK6j8)做了一定的调整，单独启用了一个新项目，你在实践时，可以直接 fork 该项目，然后去尝试接。

以上就完成了接入，后续只需要正常开发提交到自己的 GitHub 项目中，然后在应用平台的自动化工具从 GitHub 直接部署到 Serverless 服务上，部署应用都将非常快捷。

### 总结

本讲核心是介绍了什么是 Serverless 、解决了我们当前 Node.js 服务的问题以及如何接入应用，学完本讲后能够了解 Serverless 的优势，并且可以进行一些简单云服务接入尝试。

由于项目迁移成本不大，因此主要是在项目应用前可以先和团队进行价格分析，从价格入手让团队尝试 Serverless 的应用，帮助团队/老板减少费用占用问题。Serverless 在多方面是可以减少我们项目的维护成本，我们只需要关注服务开发即可，因此是能够大大的节省人力和资源，在小型公司更建议你尝试应用。

到此为止，本专栏的知识点部分已经全部介绍完了，今天给你留的作业是：应用本框架开发一个新的接口，并按照本课时的内容部署到 Serverless 云服务上。