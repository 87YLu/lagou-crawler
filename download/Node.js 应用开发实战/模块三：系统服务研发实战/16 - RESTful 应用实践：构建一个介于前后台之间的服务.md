在学习了 Node.js 相关的知识以后，我们怎么才能在实际工作中将这些知识应用起来呢？在这之前，我们应该思考，是完全应用 Node.js 改造原来的后台，还是与现有后台技术，进行兼容。

这一讲，我就带你掌握如何快速地在项目中尝试应用 Node.js ，构建一个介入前后台之间的服务，逐步替换部分线上后台服务。

### 架构设计

以当时的团队情况为例，当时，我们的团队有 30 多人，具备后台服务，但为了尝试 Node.js 的应用，以便可以更高效地进行应用服务，我们需要尝试 Node.js 接入方案，当时有几种选择，比如：

*   重新将原来后台改造为 Node.js 的方式（不过该方式在项目已经进行很长时间，或者代码结构很大的情况下并不适合）。
    
*   兼容原来的后台，部分请求转发到 Node.js 服务和后台服务，另外一些请求则可以经过 Node.js 处理后再透传到后台服务。
    

#### 兼容方案设计

现实情况下，大部分是第二种方案，在此基础上我们绘制了一个简单的架构图：

![Drawing 0.png](https://s0.lgstatic.com/i/image6/M00/39/F3/Cgp9HWB9T6WALOD3AAESrBDsph0977.png)

图 1 Node.js 与后台兼容方案

由于我在该课程测试过程中没有非 Node.js 的后台服务，所以我们需要模拟使用 Node.js 来模拟一个后台服务。

图 1 中，我假设 15 课时的代码为后台服务，15 课时分别有 2 个启动文件：

*   app.js 会以 3002 端口启动 Node.js 服务；
    
*   app-3003.js 会以 3003 端口启动 Node.js 服务。
    

接着，我们假设 16 课时的代码为 Node.js 服务，16 课时同样有 2 个启动文件：

*   app.js 会以 3000 端口启动 Node.js 服务；
    
*   app-3001.js 会以 3001 端口启动 Node.js 服务。
    

假设我们服务的域名是 lagou-nodejs.com ，从该域名的请求会经过 Nginx 作为负载均衡的处理模块，然后根据请求路径进行转发。

/music/info/index 为一个透传服务，因为该路径请求时会经过 Node.js 服务，经过部分处理后，再透传给后台服务；/test/index 为一个 Node.js 服务，该路径请求时会直接在 Node.js 服务中处理完成。其他的路径都是请求到后台服务中，也就是 3002 端口和 3003 端口。

接下来我就带你看一看怎么搭建图 15 所示的前后台服务。

### 实现方案

实现该系统需要做这样几个工作：

1.  Nginx 搭建，并配置路由转发；
    
2.  16 课时实现接口透传方式，将未能处理的接口转发到后台服务；
    
3.  转发时需要根据名字服务，随机地将请求转发到后台的多个服务中，进行负载均衡；
    
4.  Node.js 16 课时实现 /test/index 方法；
    
5.  Node.js 16 课时多端口启动服务，并设置 2 个子进程；
    
6.  Node.js 15 课时（后台服务），实现 /music/info/index 和 /activity/info/index 两个方法；
    
7.  Node.js 15 课时口启动服务，分别启动 1 个子进程；
    
8.  配置本地 host 并测试；
    

接下来我们将上面的 8 个步骤融合为 5 个过程来实践讲解，分别是： Nginx 搭建和配置、透传转发和名字服务、实现 Node.js 服务、实现后台服务和配置本地 host 测试。

#### Nginx 搭建和配置

作为后台开发，搭建和掌握 Nginx 配置非常基础，安装和配置方法你完全可以去参考[官网中文文档](https://www.nginx.cn/doc/?fileGuid=xxQTRXtVcqtHK6j8)教学。这里我已经配置好了 Nginx ，重点强调一下其中的配置方法：在 Nginx 安装目录下会有一个 nginx.conf 配置文件，在最下面一行一般都会有一个下面的配置，如果没有则在 http 中最后一行，增加下面这段代码：

    include servers/*;
    

接下来，在 Nginx 根目录创建 servers 文件夹，并在 servers 中创建 lagou-nodejs.conf 配置文件（文件在[GitHub](https://github.com/love-flutter/nodejs-column?fileGuid=xxQTRXtVcqtHK6j8)中项目根目录下的 src/config 文件夹中），首先配置两个 upstream 用来随机转发，其中 lagou-nodejs 为 Node.js 服务，lagou-backend 为后台服务。

    upstream lagou-nodejs {
            server 127.0.0.1:3000;
            server 127.0.0.1:3001;
    }
    upstream lagou-backend {
        server 127.0.0.1:3002;
        server 127.0.0.1:3003;
    }
    

接下来就是在 Nginx 中配置不同路径的转发规则，我们先看下 /test/index 和 /music/info/index 的配置：

![Drawing 1.png](https://s0.lgstatic.com/i/image6/M00/39/F3/Cgp9HWB9T7aAdPm4AAGL6gtb52U583.png)

图 2 lagou-nodejs Nginx 配置

图 2 中 /test/index 转发到[http://lagou-nodejs](http://lagou-nodejs?fileGuid=xxQTRXtVcqtHK6j8)虚拟 host 下（以 music 开头的也是一样的配置），而其他的都是转发到[http://lagou-backend](http://lagou-backend?fileGuid=xxQTRXtVcqtHK6j8)下。注意所有 Nginx 配置修改，都需要使用 nginx -s reload 进行重启。

这样一来，我们就完成了 Nginx 的配置，第二步就是透传转发和名字服务。

#### 透传转发和名字服务

透传转发和名字服务要结合使用，所以我们把二者放在一起来学习。

首先你肯定要知道在 Node.js 服务中是否有相应的路径处理服务，所以要修改 router.js 中的代码，在匹配到具体的 Controller 逻辑时，在 ctx 中标记已匹配服务，而如果没有匹配到相应的 Controller 时则不做任何标记，如图 3 中红色框部分逻辑：

![Drawing 2.png](https://s0.lgstatic.com/i/image6/M00/39/FB/CioPOWB9T8CARhfuAAJXX2CAbd0870.png)

图 3 router.js 标记匹配到服务

接下来我们在 routerMiddleware 中间件下增加一个新的中间件 backendRouter，用来处理转发到后台服务的功能：

    const proxy = require('koa-better-http-proxy');
    const nameService = require('../lib/nameService');
    module.exports = function () {
        return function ( ctx, next ) {
            if(ctx.currentExist){
                return;
            }
            /// 转发相应的数据到指定服务，并且记录下系统日志
            const newService = nameService.get('poxyBackendServer');
            ctx.log.add('info', 'system', `current server do not find the ${ctx.pathname} path, forward the request to ${newService}`);
            
            return proxy(newService)(ctx, next);
        }
    }
    

代码中应用了 2 个比较重要的模块：

*   [koa-better-http-proxy](https://github.com/nsimmons/koa-better-http-proxy#readme?fileGuid=xxQTRXtVcqtHK6j8)，它是一个第三方 koa 的 http-proxy 服务；
    
*   我们内部实现的 nameService ，用来做负载均衡转发后台服务。来看第 6 行代码，首先我们要判断路由是否在 Node.js 业务中处理，如果已经处理则直接跳出，如果没有处理，则需要获取到一个待转发的后台服务地址，通过 proxy 将当前请求转发到相应的后台服务中。
    

nameService 相关的代码如下：

    const serviceMapping = {
        'poxyBackendServer' : [
            '127.0.0.1:3002',
            '127.0.0.1:3003',
        ]
    };
    class NameService {
        static get(name) {
            if(!serviceMapping[name] || serviceMapping[name].length < 1){
                return false;
            }
            const serviceList = serviceMapping[name];
            return serviceList[Math.floor(Math.random()*serviceList.length)];
        }
    }
    module.exports = NameService;
    

这里是一个简版的路径，在实际开发中你可以单独实现一个本地服务来做名字服务，如果没有这类服务也可以参考这种方法来实现。

#### 实现 Node.js 服务

上面我们已经为 Node.js 服务做了一些基础工作，接下来我们就来实现这个 Node.js 相关的业务功能。在 Controller 中增加一个 test.js 类，并在类中增加 index 方法，这部分比较简单，和原来的 Controller 相比也没太大区别。为了让大家了解如何在单个服务中启用多个端口，我主要说一下怎么在一个项目中启动多个端口服务。

复制一个 app.js 为 app-3001.js 文件，然后将其中的 3000 端口修改为 3001 （包括里面的 console.log 中的 3000，避免误解），其次修改 pm2.config.js 在配置文件中的 apps 数组中增加一项启动配置，两个数组元素的配置差异就是启动文件和进程名，改动如下图 4 所示：

![Drawing 3.png](https://s0.lgstatic.com/i/image6/M00/39/F3/Cgp9HWB9T8yAUpkWAAHVHZ00FDk139.png)

图 4 pm2.config.js 文件配置

以上修改完成后，我们使用下面的命令来启动服务：

    pm2 start pm2.config.js
    

启动以后，可以看到有 4 个进程，分别对应 3000 和 3001 端口的服务，这时候我们访问如下地址：

    http://127.0.0.1:3000/test/index
    http://127.0.0.1:3001/test/index
    http://127.0.0.1:3000/music/info/index
    http://127.0.0.1:3001/activity/info/index
    

你可以看到，前 2 个都是正常响应的，但是后面 2 个都会提示服务器内部错误的信息，主要是我们透传给 3002 和 3003 了，但是无响应，接下来我们就需要去实现 15 课时的 3002 和 3003 的响应处理。

#### 实现后台服务

15 课时的 3002 和 3003 服务与 16 课时的核心业务逻辑实现逻辑相似，先复制 app.js 为 app-3003.js ，然后修改 pm2.config.js 文件增加一项，主要是修改其中的 name 和 script ，修改完成后，在 15 课时的根目录，使用下面命令启动服务：

    pm2 start pm2.config.js
    

启动成功后，我们使用下面命令查看当前所有进程：

    pm2 list
    

可以看到图 5 所示。

![Drawing 4.png](https://s0.lgstatic.com/i/image6/M00/39/FB/CioPOWB9T9WAPFx3AAFhIzbGogw453.png)

图 5 当前 PM2 进程列表

接下来我们再次访问下面 4 个连接：

    http://127.0.0.1:3000/test/index
    http://127.0.0.1:3001/test/index
    http://127.0.0.1:3000/music/info/index
    http://127.0.0.1:3001/activity/info/index
    

你会发现都可以正常响应了，并且在 16 课时的根目录 log/system.log 文件中，可以看到如下的日志信息：

    2021-04-05 10:46:01 info    current server do not find the /activity/info/index path, forward the request to 127.0.0.1:3002
    2021-04-05 10:46:04 info    current server do not find the /activity/info/index path, forward the request to 127.0.0.1:3002
    2021-04-05 10:46:58 info    current server do not find the /activity/info/index path, forward the request to 127.0.0.1:3002
    2021-04-05 10:47:18 info    current server do not find the /music/info/index path, forward the request to 127.0.0.1:3002
    2021-04-05 10:47:54 info    current server do not find the /music/info/index path, forward the request to 127.0.0.1:3003
    

这样一来，就实现了透传请求，接下来我们使用域名来访问。

#### 配置 host 测试

因为我们做的是一个测试虚拟域名，所以在本地配置一个 host ，如果你是在 Mac 或者 Linux 可以直接修改 /etc/hosts 文件，增加下面一行：

    127.0.0.1 lagou-nodejs.com
    

如果你是在 Windows 下则需要去 C:\\Windows\\System32\\drivers\\etc 这个路径下修改 host 文件。修改以后，我们再将上面的 IP 访问方式修改为域名访问方式：

    http://lagou-nodejs.com/test/index
    http://lagou-nodejs.com/music/info/index
    http://lagou-nodejs.com/activity/info/index
    

再次访问以上地址时，还是正常响应，只是唯一的区别在于 /activity/info/index 不会再经过 Node.js 服务，而 /music/info/index 则还是会在 log/system.log 中打印转发信息。

以上就完成了一个比较通用的介于前后台的 Node.js 服务，这样可以前期进行一些尝试，慢慢地接入后台的服务。同时也满足我们后台的基本高性能特性，比如负载均衡和多机器快速扩容方案。

### 总结

这一讲，我主要带你实践学习了实现一套引入 Node.js 兼容后台的方案，在尝试应用 Node.js 作为后台服务的过程中肯定会存在一些细节问题，比如业务了解不清晰导致的业务问题，或者由于原来服务并发较大，没有充分考虑并发问题，也可能导致现网事故。因此希望你可以在后台服务中拆分出部分非核心模块，依照我们本讲的实践知识进行接入，比较成熟后可以考虑透传的方式，最后再慢慢将所有服务接入，特殊部分则转发到后台服务即可。

除此之外，学完这一讲内容之后，希望你可以在自己项目中进行一些简单尝试，比如一些新的后台服务类的需求，可以主动的要求，使用 Node.js 来实现一个技术方案，并做一些 demo 演示给你们团队，在应用 Node.js 来实现技术方案时，多从高效开发、可扩展性、后期维护性以及高性能方面来体现其优势。

接下来，我们将实现一个通用抢票系统，下一讲见。