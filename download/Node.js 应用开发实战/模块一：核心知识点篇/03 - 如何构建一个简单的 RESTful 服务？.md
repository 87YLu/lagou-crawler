前面几讲都是一些知识点的阐述，本讲将应用前面讲到的知识点，来实现一个简单版本的 RESTful 系统架构，并在此架构上实现一些简单的应用。

### 基础技术点

在学习本讲时会涉及一些技术知识点：

*   什么是 RESTful 规范；
    
*   数据库的读写处理过程；
    
*   目前常用的 MVC 架构模式，以及后续本专栏所应用的一套新的、独创的架构模式——MSVC 架构模式。
    

#### RESTful

RESTful（Representational State Transfer）是一种架构的**约束条件**和**规则**。在倡导前后端分离后，该架构规范的应用愈加广泛。具体知识点，[你可以参考这里进行学习](https://github.com/aisuhua/restful-api-design-references)。

#### MongoDB

由于本讲涉及数据库的操作，本专栏主要使用**非关系型数据库**——MongoDB，因此这里需要先了解下 MongoDB 的相关操作，以及安装配置方法，你可以参考[官网的文档来安装](https://www.runoob.com/mongodb/mongodb-osx-install.html)，这里就不细讲。为了使用便利，我们可以直接在官网创建 MongoDB 云服务远程连接，具体请参照[官网](https://cloud.mongodb.com/)，以及 [API 文档请参考这里](https://mongodb.github.io/node-mongodb-native/2.0/api/index.html)。

#### MVC→MSVC

我们应该都比较熟知 MVC 架构，它在前后端分离中起到了非常重要的作用，我们先来看下传统的 MVC 架构的模式，如图 1 所示。

![图片 2.png](https://s0.lgstatic.com/i/image6/M00/17/08/CioPOWBHMl-ASR4aAAAg3opNISU640.png)

此模式中：

*   M（Model）层处理数据库相关的操作（只有数据库操作时）；
    
*   C（Controller）层处理业务逻辑；
    
*   V（View）层则是页面显示和交互（本讲不涉及）。
    

但是在目前服务划分较细的情况下，M 层不仅仅是数据库操作，因此这种架构模式显得有些力不从心，导致开发的数据以及业务逻辑有时候在 M 层，有时候却在 C 层。出现这类情况的核心原因是 C 与 C 之间无法进行复用，如果需要复用则需要放到 M 层，那么业务逻辑就会冗余在 M，代码会显得非常繁杂，如图 2 所示。

![图片 4.png](https://s0.lgstatic.com/i/image6/M00/17/0C/Cgp9HWBHMnaAG42WAAA3-AZ5WeM867.png)

图 2 MVC 模式问题

为了解决以上问题，在经过一些实践后，我在研发过程中提出了一套新的架构模式，当然也有他人提到过（比如 Eggjs 框架中的模式）。这种模式也会应用在本专栏的整个架构体系中，我们暂且叫作 MSVC（Model、Service、View、Controller）。

我们先来看下 MSVC 的架构模式，如图 3 所示。

![图片 6.png](https://s0.lgstatic.com/i/image6/M00/17/09/CioPOWBHMomAfpfmAABDDmUKgC4829.png)

将所有数据相关的操作都集中于 M 层，而 M 层复用的业务逻辑则转到新的 S 层，C 层则负责核心业务处理，可以调用 M 和 S 层。以上是相关知识点，接下来我们进行架构的实践设计。

### 系统实践

我们先实现一个简单版本的 RESTful 服务，其次为了能够更清晰地了解 MVC 架构和 MSVC 架构的优缺点，我们也会分别实现两个版本的 RESTful 服务。

我们要实现的是一个**获取用户发帖的列表信息 API**，该 API 列表的内容包含两部分，一部分是从数据库获取的发帖内容，但是这部分只包含用户 ID，另外一部分则是需要通过 ID 批量拉取用户信息。

我们先来设计 RESTful API，由于是拉取列表内容接口，因此这里设计为一个 GET 接口，根据 RESTful 约束规则设计为：GET /v1/contents；另外还需要设计一个独立的服务用来获取用户信息，将接口设计为：GET /v1/userinfos。

为了更清晰些，我绘制了一个时序图来表示，如图 4 所示。

![图片 7.png](https://s0.lgstatic.com/i/image6/M00/17/0C/Cgp9HWBHMpOASLZ7AACJ0Un2XOA103.png)

图 4 例子系统时序图

在图 4 中详细的过程是：

*   用户先调用 /v1/contents API 拉取 restful server 的内容；
    
*   restful server 会首先去 MongoDB 中获取 contents；
    
*   拿到 contents 后解析出其中的 userIds；
    
*   然后再通过 /v1/userinfos API 调用 API server 的服务获取用户信息列表；
    
*   API server 同样需要和 MongoDB 交互查询到所需要的 userinfos；
    
*   拿到 userinfos 后通过 addUserinfo 将用户信息整合到 contents 中去；
    
*   最后将 contents 返回给到调用方。
    

在不考虑任何架构模式的情况下，我们来实现一个简单版本的 restful 服务，上面分析了需要实现 2 个 server，这里分别叫作 **API server** 和 **restful server**。

#### API server

server 包含 2 个部分：**解析请求路径**和**解析请求参数**，在 Node.js 中我们可以用以下代码来解析：

    /**
     * 
     * 创建 http 服务，简单返回
     */
    const server = http.createServer(async (req, res) => {
        // 获取 get 参数
        const pathname = url.parse(req.url).pathname;
        paramStr = url.parse(req.url).query,
        param = querystring.parse(paramStr);
        // 过滤非拉取用户信息请求
        if('/v1/userinfos' != pathname) {
          return setResInfo(res, false, 'path not found');
        }
        // 参数校验，没有包含参数时返回错误
        if(!param || !param['user_ids']) {
          return setResInfo(res, false, 'params error');
        }
    });
    

上面代码中使用 Node.js 的 url 模块来获取请求路径和 GET 字符串，拿到 GET 的字符串后还需要使用 Node.js 的 querystring 将字符串解析为参数的 JSON 对象。

参数和请求路径解析成功后，再进行路径的判断和校验，如果不满足我们当前的要求，调用 setResInfo 报错返回相应的数据给到前端。setResInfo 这个函数实现比较简单，使用 res 对象来设置返回的数据，具体你可以前往 [GitHub 源码](https://github.com/love-flutter/nodejs-column)中查看。

路径和参数解析成功后，我们再根据当前参数查询 MongoDB 中的 userinfo 数据，具体代码如下：

    const baseMongo = require('./lib/baseMongodb')();
    const server = http.createServer(async (req, res) => {
        // ...省略上面部分代码
        // 从 db 查询数据，并获取，有可能返回空数据
        const userInfo = await queryData({'id' : { $in : param['user_ids'].split(',')}});
        return setResInfo(res, true, 'success', userInfo);
    });
    /**
     * 
     * @description db 数据查询
     * @param object queryOption 
     */
    async function queryData(queryOption) {
      const client = await baseMongo.getClient();
      const collection = client.db("nodejs_cloumn").collection("user");
      const queryArr = await collection.find(queryOption).toArray();
      return queryArr;
    }
    

这一代码中使用了 baseMongodb 这个自己封装的库，该库主要基于 mongo 的基础库进行了本地封装处理。在 queryData 中通过 mongo 来查询 nodejs\_cloumn 库中的 user 表，并带上查询条件，查询语法你可以参考 [API 文档](https://mongodb.github.io/node-mongodb-native/2.0/api/index.html)。

> 注意上面代码中，find 查询返回的数据需要使用 toArray 进行转化处理。拿到 MongoDB 查询结果后，再调用 setResInfo 返回查询结果给到前端。

接下来我们继续实现 restful server。

#### restful server

和 API server 相似，前面 2 个过程是解析请求路径和请求参数，解析成功后，根据时序图先从 MongoDB 中拉取 10 条 content 数据，代码如下：

    const server = http.createServer(async (req, res) => {
        // 获取 get 参数
        const pathname = url.parse(req.url).pathname;
        paramStr = url.parse(req.url).query,
        param = querystring.parse(paramStr);
        // 过滤非拉取用户信息请求
        if('/v1/contents' != pathname) {
          return setResInfo(res, false, 'path not found', null, '404');
        }
        // 从 db 查询数据，并获取，有可能返回空数据
        let contents = await queryData({}, {limit: 10});
    
        contents = await filterUserinfo(contents);
        return setResInfo(res, true, 'success', contents);
    });
    

在 MongoDB 中查询到具体的 contents 后，再调用 filterUserinfo 这个函数将 contents 中的 user\_id 转化为 userinfo，具体代码如图 5 所示（为了代码简洁，我使用了截图，源代码请参考 [GitHub](https://github.com/love-flutter/nodejs-column) 上的）：

![图片 8.png](https://s0.lgstatic.com/i/image6/M01/17/09/CioPOWBHMqSAeQfTAAF5ba4WuFA603.png)

图 5 filterUserinfo 代码实现

在上面代码中的第 52 行是调用 API server 将用户的 userIds 转化为 userinfos，最后在 64 行，将获取的 userinfos 添加到 contents 中。

最后我们打开两个命令行窗口，分别进入到两个 server 下，运行如下命令启动服务。

    node index
    

运行成功后，我们在浏览器中打开如下地址：

    http://127.0.0.1:5000/v1/userinfos?user_ids=1001,1002
    

你将会看到一个 JSON 的返回结构，如图 6 所示。

![图片 9.png](https://s0.lgstatic.com/i/image6/M00/17/0D/Cgp9HWBHMqyAFEfxAACiD747m4U810.png)

图 6 API server 返回信息

接下来我们访问如下地址，并且打开 chrome 的控制台的 network 状态栏。

    http://127.0.0.1:5000/v1/test
    

你将会看到返回的状态码是 404，如图 7 所示，这也是 restful 的规范之一，即正确地使用 http 状态码。

![图片 10.png](https://s0.lgstatic.com/i/image6/M01/17/0D/Cgp9HWBHMrWAHu5_AAFIdt9MME4795.png)

图 7 异常响应返回

接下来我们请求 restful server 的 API，同样使用浏览器打开如下接口地址：

    http://127.0.0.1:4000/v1/contents
    

你将会看到如图 8 所示的响应结果。

![图片 11.png](https://s0.lgstatic.com/i/image6/M01/17/0D/Cgp9HWBHMr-AKdSMAAFW1ay8vPI075.png)

图 8 contents 响应结果

以上就实现了一个简单 restful 服务的功能，你可以看到代码都堆积在 index.js 中，并且代码逻辑还比较简单，如果稍微复杂一些，这种架构模式根本没法进行团队合作，或者后期维护，因此就需要 MVC 和 MVCS 架构模式来优化这种场景。

接下来我们先来看看使用 MVC 来优化。

### 进阶实现

没有架构模式虽然也能按照需求满足接口要求，但是代码是**不可维护**的。而 MVC 已经被实践证明是非常好的架构模式，但是在现阶段也存在一些问题，接下来我们就逐步进行优化，让我们的架构和代码更加优秀。

#### MVC

既然是 M 和 C，我们就先思考下，上面的 restful server 中哪些是 M 层的逻辑，哪些是 C 层的逻辑。

![图片 12.png](https://s0.lgstatic.com/i/image6/M01/17/0D/Cgp9HWBHMsyAF-PaAAB-xAx-32s648.png)

以上是所有的逻辑，根据表格，我们首先创建两个目录分别是 **model** 和 **Controller**：

*   在 model 中创建一个 content.js 用来处理 content model 逻辑；
    
*   在 Controller 中也创建一个 content.js 用来处理 content 的 Controller 逻辑。
    

在源代码中有一个 index.js 文件，在没有架构模式时，基本上处理了所有的业务，但是根据当前架构模式，如表 1 所示，只适合处理 url 路径解析、路由判断及转发，因此需要简化原来的逻辑，和第一部分代码一样，我们就不再列举了，主要看路由判断。首先需要根据 restful url 路由配置一份路由转发逻辑，配置如下：

    const routerMapping = {
        '/v1/contents' : {
            'Controller' : 'content',
            'method' : 'list'
        },
        '/v1/test' : {
            'Controller' : 'content',
            'method' : 'test'
        }
    };
    

上面代码的意思是：

*   如果请求路径是 /v1/contents 就转发到 content.js 这个 Controller，并且调用其 list 方法；
    
*   如果是 /v1/test 则也转发到 content.js 这个 Controller，但调用的是 test 方法。
    

> 注意：其中 test 是一个同步方法，list 是一个异步方法。

路由配置完成以后，就需要根据路由配置，将请求路径、转发到处理相应功能的模块或者类、函数中去，代码如图 9 所示。

![图片 13.png](https://s0.lgstatic.com/i/image6/M01/17/0D/Cgp9HWBHMtiAAs7YAAJNxih_ssE949.png)

图 9 index 核心逻辑

*   第一个红色框内的部分，判断的是路由是否在配置内，不存在则返回 404；
    
*   第二个红色框内的部分，加载对应的 Controller 模块；
    
*   第三个红色框内的部分，表示判断所调用的方法类型是异步还是同步，如果是异步使用 await 来获取执行结果，如果是同步则直接调用获取返回结果。
    

> 注意：这里使用 try catch 的目的是确保调用安全，避免 crash 问题。

接下来我们实现一个 Controller，为了合理性，我们先实现一个基类，然后让每个 Controller 继承这个基类：

*   在项目根目录下我们创建一个 core 文件夹，并创建一个 Controller.js 作为基类；
    
*   然后我们把一些相同的功能放入这个基类，比如 res 和 req 的赋值，以及通用返回处理，还有 url 参数解析等。
    

我们来看下这部分代码，如图 10 所示。

![图片 14.png](https://s0.lgstatic.com/i/image6/M01/17/0B/CioPOWBHMxSAAxc8AAF_MvEbU10031.png)

图 10 Controller 基类

功能还是比较简单的，只是提炼了一些 Controller 共同的部分。接下来我们再来实现 content.js 这个 Controller，代码如图 11 所示：

![图片 15.png](https://s0.lgstatic.com/i/image6/M01/17/0E/Cgp9HWBHMwaAMQK8AAD-onTOdVQ611.png)

图 11 content.js Controller

我们在初次实现时，可以不关注图 11 中的第 2 和 3 行，实现红色框内的代码即可。可以将 list 暂时设置为空，实现完成后，我们在根目录运行以下命令，启动服务。

    node index
    

接下来打开浏览器访问：

    http://127.0.0.1:3000/v1/test
    

你就可以看到响应了一个 JSON 数据，这样就实现了 Controller 部分了。如下代码所示：

    {
      ret: 0,
      message: "good",
      data: { }
    }
    

接下来我们再来实现 Model 层部分，和 Controller 类似，我们也需要一个基类来处理 Model 层相似的逻辑，然后其他 Model 来继承这个基类，这部分如图 12 所示。

![图片 16.png](https://s0.lgstatic.com/i/image6/M00/17/0B/CioPOWBHMx2AHsKzAAEYhjLBhO4974.png)

图 12 Model 基类

这个基类首先设置了 db 名称，其次定义了一个 GET 方法来获取表的操作句柄，这部分代码与上面简单 restful 服务的类似。完成基类后，我们再来完善 model 中的 content.js 逻辑。

![图片 17.png](https://s0.lgstatic.com/i/image6/M01/17/0E/Cgp9HWBHMyeAPElfAAEk45BmKsI006.png)

图 13 model content.js 代码实现

这部分代码主要方法是 **getList**，原理和简单 restful server 中的查询类似，在第 11 行通过父类的 GET 方法获取表 content 的操作句柄，再调用 MongoDB 的 find 方法查询 contents。有了 model content 后，我们再回去完善 content.js Controller 中的 list 函数部分逻辑，代码封装的比较简洁，如下所示：

        async list() {
            let contentList = await new ContentModel().getList();
            contentList = await this._filterUserinfo(contentList);
    
            return this.resAPI(true, 'success', contentList);
        }
    

上面代码中的第 4 行，只能在当前 Controller 下实现一个私有方法 \_filterUserinfo 来处理用户信息部分，这部分逻辑也和简单 restful 服务的一样。

这样就实现了一个 MVC 的架构，将原来的复杂不可扩展性的代码，转化为**可扩展**、**易维护**的代码，这部分核心代码可以参考 [GitHub 源码](https://github.com/love-flutter/nodejs-column)。

#### MVCS

在上面的代码中存在一个问题，就是 \_filterUserinfo 是放在 Controller 来处理，这个方法又会涉及调用 API server 的逻辑，看起来也是数据处理部分，从原理上说这部分不适合放在 Controller。其次在其他 Controller 也需要 \_filterUserinfo 时，这时候就比较懵逼了，比如我们现在有另外一个 Controller 叫作 recommend.js，这里面也是拉取推荐的 content，也需要这个 \_filterUserinfo 方法，如图 14 所示。

![图片 18.png](https://s0.lgstatic.com/i/image6/M00/17/0B/CioPOWBHMzCANv2nAAFcFfow9m4167.png)

图 14 MVC 复用性问题例子

其中左边是存在的矛盾，因为 \_filterUserinfo 在 Controller 是私有方法，recommend Controller 调用不到，那么为了复用，我们只能将该方法封装到 content-model 中，并且将数据也集中在 Model 层去。

虽然解决了问题，但是你会发现：

*   Model 层不干净了，它现在既要负责数据处理，又要负责业务逻辑；
    
*   Controller 层的业务减少了，但是分层不明确了，有些业务放在 Model，有些又在 Controller 层，对于后期代码的维护或者扩展都非常困难了。
    

为了解决这个问题，有一个新的概念——Service 层，具体如图 15 所示。

![图片 19.png](https://s0.lgstatic.com/i/image6/M00/17/0E/Cgp9HWBHMzqAc1JJAAFspSJGcu8417.png)

图 15 MSVC 优化效果

*   图中的浅红色框内，就是新架构模式的 M 层；
    
*   两个绿色框内为 C 层；
    
*   最上面的浅蓝色框则为 Service 层。
    

这样就可以复用 \_filterUserinfo，并解决 M 与 C 层不明确的问题。接下来我们来实践这部分代码：

*   首先我们需要创建一个文件夹 service 来存放相应的 Service 层代码；
    
*   然后创建一个 content.js 来表示 content-service 这个模块；
    
*   再将原来代码中的 \_filterUserinfo 逻辑转到 content-service 中去；
    
*   最后修改 Controller 代码。
    

如下代码所示：

     async list() {
            let contentList = await new ContentModel().getList();
            contentList = await contentService.filterUserinfo(contentList);
    
            return this.resAPI(true, 'success', contentList);
        }
    

注意代码中的第 4 行，从原来调用本类的方法，修改为调用 contentService 的 filterUserinfo。

### 总结

本讲最开始介绍了一些技术知识点，这些是你开始学习本专栏必需巩固的技术，接下来根据实践开发了一个微型的 restful 服务，由于代码的不可维护性以及不可扩展性，我们接下来就应用了 MVC 架构设计模式进行了优化，最后由于 MVC 的缺陷，进而提出了使用 MSVC 来解决 MVC 中 M 和 C 业务界定不清晰的问题。

学完本讲后，你就能自己写一个 restful API 了，并且能够掌握 MVC 和 MSVC 的架构原理，同时能够开发出轻量版本的框架。在实践过程中有任何问题或者心得，都可以在留言区留言。

讲解完我们自身设计的简版框架后，在下一讲要介绍 Node.js 目前业界使用最广的三个框架，并且进行深入对比分析其优缺点。

* * *

[![Drawing 2.png](https://s0.lgstatic.com/i/image6/M00/12/FA/CioPOWBBrAKAAod-AASyC72ZqWw233.png)](https://shenceyun.lagou.com/t/mka)

**《大前端高薪训练营》**

对标阿里 P7 技术需求 + 每月大厂内推，6 个月助你斩获名企高薪 Offer。[点击链接](https://shenceyun.lagou.com/t/mka)，快来领取！