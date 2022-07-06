在前面的课程中，我们学习了 TypeScript 的常见配置、错误及相关实践。从这一讲开始，我们将以项目级实践为例，一起学习 TypeScript 在 Node.js、Web 端开发的经验。

> 学习建议：请按照课程中的操作步骤，实践一个完整的开发流程。

在实际业务中，经常需要使用 Node.js 的场景包括重量级后端应用以及各种 CLI 模块。因此，这一讲我们将引入 TypeScript 开发一个可以指定端口、文件目录、缓存设置等参数的 HTTP 静态文件服务 http-serve CLI NPM 模块。

### 开发 NPM 模块

在开发阶段，我们使用 ts-node 直接运行 TypeScript 源码就行。构建时，我们使用官方转译工具 tsc 将 TypeScript 源码转译为 JavaScript，并使用 TypeScript + Jest 做单元测试。

下面我们先看看如何初始化 NPM 模块。

#### 初始化模块

首先，我们创建一个 http-serve 目录，然后在 VS Code IDE 中打开目录，再使用“ctrl + \`”快捷键打开 IDE 内置命令行工具，并执行“npm init”命令初始化 NPM 模块。

    npm init
    

因为我们编写的仅仅是一个示例性项目，所以在初始化过程中我们只需要使用默认的模块设置一直回车确认就可以。执行完命令后，NPM 会在当前目录下自动创建一个 package.json。

接下来需要划分项目结构，我们可以通过命令行工具或者 IDE 创建 src 目录用来存放所有的 TypeScript 源码。

TypeScript 转译为 JavaScript 后，lib 目录一般不需要手动创建，因为转译工具会自动创建，此时我们只需要修改 tsconfig.json 中相应的配置即可。

此外，我们还需要按照如下命令手动创建单元测试文件目录 \_\_tests\_\_。

    mkdir src; // 创建放 TypeScript 源码的目录
    touch src/cli.ts // CLI 命令入口文件
    touch src/http-serve.ts // CLI 命令入口文件
    mkdir lib; // 转译工具自动创建放 JavaScript 代码的目录
    mkdir __tests__; // 单元测试文件目录
    

这里是 TypeScript 开发模块的一个经典目录结构，极力推荐你使用。

接下来我们可以按照如下命令先行安装项目需要的基本依赖。

    npm install typescript -D;
    npm install ts-node -D;
    npm install jest@24 -D;
    npm install ts-jest@24 -D;
    npm install @types/jest -D;
    

在上述命令中，TypeScript、ts-node、Jest、Jest 类型声明是作为开发依赖 devDependencies 安装的。

安装完依赖后，我们需要把模块的 main/bin 等参数、start/build/test 等命令写入 package.json 中，如下代码所示：

    {
      ...
      "bin": "lib/bin.js",
      "main": "lib/http-serve.js",
      "files": ["lib"],
      "scripts": {
        "build": "tsc -p tsconfig.prod.json",
        "start": "ts-node src/cli.ts",
        "test": "jest --all"
      },
      ...
    }
    

在上述示例第 3 行 bin 参数指定了 CLI 命令可执行文件指向的是转译后的 lib/cli.js；第 4 行 main 参数则指定了模块的主文件是转译后的 lib/http-serve.js；第 5 行指定了发布到 NPM 时包含的文件列表；第 7 行 build 命令则指定了使用 tsc 命令可以基于 tsconfig.prod.json 配置来转译 TypeScript 源码；第 8 行 start 命令则指定了使用 ts-node 可以直接运行 TypeScript 源码；第 9 行 test 命令则表示使用 Jest 可以执行所有单测。

如此配置之后，我们就可以通过以下命令进行构建、开发、单测了。

    npm start; // 开发
    npm run build; // 构建
    npm test; // 单测
    

接下来我们需要初始化 tsconfig 配置。

#### 初始化 tsconfig

如果我们已经安装了全局的 TypeScript，那么就可以直接使用全局的 tsc 命令初始化。

当然，我们也可以直接使用当前模块目录下安装的 TypeScript 来初始化 tsconfig 配置。这里我推荐全局安装 npx，可以更方便地调用安装在当前目录下的各种 CLI 工具，如下代码所示：

    tsc --init; // 使用全局
    npm install npx -g; // 安装 npx
    npx tsc --init; // 或者使用 npx 调用当前目录下 node_modules 目录里安装的 tsc 版本
    

以上命令会在当前目录下创建一个 tsconfig.json 文件用来定制 TypeScript 的行为。

一般来说，我们需要将 declaration、sourceMap 这两个配置设置为 true，这样构建时就会生成类型声明和源码映射文件。此时，即便模块在转译之后被其他项目引用，也能对 TypeScript 类型化和运行环境源码提供调试支持。

此外，一般我们会把 target 参数设置为 es5，module 参数设置为 commonjs，这样转译后模块的代码和格式就可以兼容较低版本的 Node.js 了。

然后，我们需要把 tsc 转译代码的目标目录 outDir 指定为 "./lib"。

除了构建行为相关的配置之外，我们还需要按照如下命令将 esModuleInterop 配置为 true，以便在类型检测层面兼容 CommonJS 和 ES 模块的引用关系，最终适用于 Node.js 开发的 tsconfig。

    {
      "compilerOptions": {
        "target": "es5",
        "module": "commonjs",
        "declaration": true,
        "sourceMap": true,
        "outDir": "./lib",
        "rootDir": "./src",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true
      }
    }
    

下面我们需要手动创建一个 tsconfig.prod.json，告诉 tsc 在转译源码时忽略 \_\_tests\_\_ 目录。当然，我们也可以根据实际情况把其他文件、目录添加到 exclude 配置中，如下代码所示：

    {
      "extends": "./tsconfig.json",
      "exclude": ["__tests__", "lib"]
    }
    

> 注意：在实际项目中，我们并不经常使用 tsc --init 初始化 tsconfig。

出于统一和可控性考虑，我们可以将通用的 tsconfig 配置抽离为单独的 NPM 或直接使用第三方封装的配置，再通过 extends 参数进行复用，比如可以安装[https://www.npmjs.com/package/@tsconfig/node10](https://www.npmjs.com/package/@tsconfig/node10)等，如下代码所示：

    npm install @tsconfig/node10 -D;
    

在当前模块的 tsconfig.json 中，我们只需保留路径相关的配置即可，其他配置可以继承自 node\_modules 中安装的 tsconfig 模块，如下代码所示：

    {
      "extends": "@tsconfig/node10",
      "compilerOptions": {
        "baseUrl": ".",
        "outDir": "./lib"
      }
    } 
    

> 插播一个任务：请将你惯用的 tsconfig 配置抽离为公共可复用的 NPM 模块，然后发布到 NPM 中，并在示例里引入。

接下来，我们需要使用 Node.js 内置的 http 模块和第三方 ecstatic、commander 模块实现 http-serve 静态文件服务器。

#### 接口设计和编码实现

首先，我们需要安装以下相关依赖。

    npm install @types/node -D;
    npm install commander -S;
    npm install ecstatic -S;
    

以上命令第 1 行会把 Node.js 内置模块类型声明文件作为开发依赖安装，第 2 行安装的是 CLI 需要用到的 commander，第 3 行安装的是用来处理静态文件请求的 ecstatic。

不幸的是，ecstatic 并不是一个对 TypeScript 友好的模块，因为它没有内置类型声明文件，也没有第三方贡献的 @types/ecstatic 类型声明模块。因此，**我们需要在项目根目录下新建一个 types.d.ts 用来补齐缺失的类型声明，如下代码所示：**

    // types.d.ts
    declare module 'ecstatic' {
      export default (options?: {
        root?: string;
        baseDir?: string;
        autoIndex?: boolean;
        showDir?: boolean;
        showDotfiles?: boolean;
        humanReadable?: boolean;
        hidePermissions?: boolean;
        si?: boolean;
        cache?: string | number;
        cors?: boolean;
        gzip?: boolean;
        brotli?: boolean;
        defaultExt?: 'html' | string & {};
        handleError?: boolean;
        serverHeader?: boolean;
        contentType?: 'application/octet-stream' | string & {};
        weakEtags?: boolean;
        weakCompare?: boolean;
        handleOptionsMethod?: boolean;
      }) => any;
    }
    

在上述示例中，我们通过 declare module 补齐了 ecstatic 类型声明，这样在引入 ecstatic 的时候就不会再提示一个 ts(2307) 的错误了。同时，IDE 还能自动补全。

很多时候因为类型声明补全的成本较高，所以我们也可以通过一行 “declare module 'ecstatic';”快速绕过 ts(2307) 错误提示。

> 注意：在业务实践中，如果碰到某个模块缺失类型声明文件，则会提示一个 ts(2307) 的错误，此时我们可以先尝试通过 npm i @types/模块名 -D 安装可能存在的第三方补齐类型声明。如果找不到，再通过 declare module 手动补齐。

接下来，我们在**src/http-serve.ts**中实现主逻辑。

首先，我们约定模块接收的参数及需要对外暴露的接口，如下示例：

    export interface IHttpServerOptions {
      /** 静态文件目录，默认是当前目录 */
      root?: string;
      /** 缓存时间 */
      cache?: number;
    }
    /** 对外暴露的方法 */
    export interface IHttpServer {
      /** 启动服务 */
      listen(port: number): void;
      /** 关闭服务 */
      close(): void;
    }
    

因为这里仅仅需要支持设置文件目录、缓存时间这两个配置项，所以示例第 1～6 行中我们定义的接口类型 IHttpServerOptions 即可满足需求。然后，在第 9～14 行，我们约定了实例对外暴露接收端口参数的 listen 和没有参数的 close 两个方法。

以上定义的接口都可以通过 export 关键字对外导出，并基于接口约定实现主逻辑类 HttpServer，如下代码所示：

    export default class HttpServer implements IHttpServer {
      private server: http.Server;
      constructor(options: IHttpServerOptions) {
        const root = options.root || process.cwd();
        this.server = http.createServer(ecstatic({
          root,
          cache: options.cache === undefined ? 3600 : options.cache,
          showDir: true,
          defaultExt: 'html',
          gzip: true,
          contentType: 'application/octet-stream',
        }));
      }
      public listen(port: number) {
        this.server.listen(port);
      }
      public close() {
        this.server.close();
      };
    }
    

在示例中的第 1 行，我们定义了 HttpServer 类，它实现了 IHttpServer 接口约定。在第 15～21 行，我们实现了公共开放的 listen 和 close 方法。在第 2 行，因为 HttpServer 的 server 属性是 http.Server 的实例，并且我们希望它对外不可见，所以被标注为成了 private 属性。

在第 3～13 行，HttpServer 类的构造器函数接收了 IHttpServerOptions 接口约定的参数，并调用 Node.js 原生 http 模块创建了 Server 实例，再赋值给 server 属性。

最后，为了让 TypeScript 代码可以在 ts-node 中顺利跑起来，我们可以在 src/http-serve.ts 引入模块依赖之前，显式地引入手动补齐的缺失的类型声明文件，如下代码所示：

    /// <reference path="../types.d.ts" />
    import http from 'http';
    import ecstatic from 'ecstatic';
    

在示例中的第 1 行，我们通过相对路径引入了前面定义的 types.d.ts 类型声明。

接下来，我们基于上边实现的 http-serve.ts 和 commander 模块编码实现 src/cli.ts，具体示例如下：

    import { program } from 'commander';
    import HttpServer, { IHttpServerOptions } from './http-serve';
    program
      .option('--cache, <cache>', '设置缓存时间，秒数')
      .option('--root, <root>', '静态文件目录')
      .option('-p, --port, <port>', '监听端口', '3000')
      .action((options: Omit<IHttpServerOptions, 'cache'> & { cache?: string; port: string }) => {
        const { root, cache, port } = options;
        const server = new HttpServer({
          root,
          cache: cache && parseInt(cache)
        });
        server.listen(+port);
        console.log(`监听 ${port}`);
      });
    program.parse(process.argv);
    

在示例中的第 5～7 行，首先我们指定了 CLI 支持的参数（commander 的更多用法可以查看其官方文档）。然后，在第 8 行我们通过 Omit 工具类型剔除了 IHttpServerOptions 接口中的 cache 属性，并重新构造 options 参数的类型。最后，在第 10～14 行我们创建了 HttpServer 的实例，并在指定端口启动了服务侦听。

接下来我们可以通过 npm start 直接运行 src/cli.ts 或通过 npm run build 将 TypeScript 代码转译为 JavaScript 代码，并运行 node lib/cli.js 启动静态服务，浏览器访问服务效果图如下：

![Drawing 0.png](https://s0.lgstatic.com/i/image6/M00/49/B6/CioPOWDcIQOAK0rcAAIAVQXojdE355.png)

在实际的开发过程中，我们肯定会碰到各种错误，不可能那么顺利。**因此，在定位错误时，我们除了可以结合之前介绍的 TypeScript 常见错误等实用技能之外，还可以通过 VS Code 免转译直接调试源码。**

**下面我们一起看看如何使用 VS Code 调试源码。**

#### 使用 VS Code 调试

首先，我们需要给当前项目创建一个配置文件，具体操作方法为通过 VS Code 左侧或者顶部菜单 Run 选项添加或在 .vscode 目录中手动添加 launch.json，如图例所示：

![Drawing 1.png](https://s0.lgstatic.com/i/image6/M00/49/AD/Cgp9HWDcIQqAemuKAAwOfFNd21o140.png)

然后，我们将以下配置添加到 launch.json 文件中。

    {
      "version": "0.2.0",
      "configurations": [
        {
          "type": "node",
          "request": "launch",
          "name": "http-serve/cli",
          "runtimeArgs": ["-r", "ts-node/register"],
          "args": ["${workspaceFolder}/src/cli.ts"]
        }
      ]
    }
    

在上述配置中，我们唤起了 node 服务，并通过预载 ts-node/register 模块让 node 可以解析执行 TypeScript 文件（转译过程对使用者完全透明）。

此时，我们可以在源文件中添加断点，并点击 Run 运行调试，如图例所示：

![Drawing 2.png](https://s0.lgstatic.com/i/image6/M00/49/AD/Cgp9HWDcIRKAFCLmAAdLT9Jo0xw822.png)

TypeScript 并不是万能的，虽然它可以帮助我们减少低级错误，但是并不能取代单元测试。因此，我们有必要介绍一个单元测试的内容。

#### 单元测试

一个健壮的项目往往离不开充分的单元测试，接下来我们将学习如何使用 TypeScript + Jest 为 http-serve 模块编写单测。

在前面的步骤中，我们已经安装了 Jest 相关的依赖，并且配置好了 npm run test 命令，此时可以在项目的根目录下通过如下代码新建一个 jest.config.js 配置。

    module.exports = {
      collectCoverageFrom: ['src/**/*.{ts}'],
      setupFiles: ['<rootDir>/__tests__/setup.ts'],
      testMatch: ['<rootDir>/__tests__/**/?(*.)(spec|test).ts'],
      testEnvironment: 'node',
      testURL: 'http://localhost:4444',
      transform: {
        '^.+\\.ts$': 'ts-jest'
      },
      transformIgnorePatterns: [
        '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|ts|tsx)$',
      ],
      moduleNameMapper: {},
      moduleFileExtensions: ['js', 'ts'],
      globals: {
        'ts-jest': {
          tsConfig: require('path').join(process.cwd(), 'tsconfig.test.json'),
        },
      },
    };
    

在配置文件中的第 3 行，我们指定了 setupFiles（需要手动创建 \_\_tests\_\_/setup.ts）初始化单元测试运行环境、加载 polyfill 模块等。在第 4 行，我们指定了查找单测文件的规则。在第 8 行，我们指定了使用 ts-jest 转译 \*.ts 文件。在第 16～18 行，我们配置了 ts-jest 基于项目目录下的 tsconfig.test.json 转译为 TypeScript。

一般来说，运行 Node.js 端的模块转译单测代码使用的 tsconfig.test.json 配置和转译生成代码使用的 tsconfig.prod.json 配置完全一样，因此我们可以直接将 tsconfig.prod.json 复制到 tsconfig.test.json。

> 注意：以上配置文件依赖 jest@24、ts-jest@24 版本。

配置好 Jest 后，我们就可以把 http-serve 模块单元测试编入\\ _\_tests_\_/http-serve.test.ts 中，具体示例如下（更多的 Jest 使用说明，请查看官方文档）：

    import http from 'http';
    import HttpServer from "../src/http-serve";
    describe('http-serve', () => {
      let server: HttpServer;
      beforeEach(() => {
        server = new HttpServer({});
        server.listen(8099);
      });
      afterEach(() => {
        server.close();
      });
      it('should listen port', (done) => {
        http.request({
          method: 'GET',
          hostname: 'localhost',
          port: 8099,
        }).end(() => {
          done();
        })
      });
    });
    

在示例中的第 6～9 行，我们定义了每个 it 单测开始之前，需要先创建一个 HttpServer 实例，并监听 8099 端口。在第 10～12 行，我们定义了每个 it 单测结束后，需要关闭 HttpServer 实例。在第 13～21 行，我们定义了一个单测，它可以通过发起 HTTP 请求来验证 http-serve 模块功能是否符合预期。

> **注意**：源码中使用的路径别名，比如用“@/module”代替“src/sub-directory/module”，这样可以缩短引用路径，这就需要我们调整相应的配置。

下面我们讲解一下啊如何处理路径别名。

#### 处理路径别名

首先，我们需要在 tsconfig.json 中添加如下所示 paths 配置，这样 TypeScript 就可以解析别名模块。

    {
      "compilerOptions": {
        ...,
        "baseUrl": "./",
        "paths": {
          "@/*": ["src/sub-directory/*"]
        },   
        ...
      }
    }
    

> 注意：需要显式设置 baseUrl，不然会提示一个无法解析相对路径的错误。

接下来我们在 jest.config.js 中通过如下代码配置相应的规则，告知 Jest 如何解析别名模块。

    module.exports = {
      ...,
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/sub-directory/$1'
      },
      ...
    }
    

因为 tsc 在转译代码的时候不会把别名替换成真实的路径，所以我们引入额外的工具处理别名。此时我们可以按照如下命令安装 tsc-alias 和 tsconfig-paths 分别供 tsc 和 ts-node 处理别名。

    npm install tsc-alias -D;
    npm install tsconfig-paths -D;
    

最后，我们需要修改 package.json scripts 配置，如下代码所示：

    {
      ...,
      "scripts": {
        "build": "tsc -p tsconfig.prod.json && tsc-alias -p tsconfig.prod.json",
        "start": "node -r tsconfig-paths/register -r ts-node/register src/cli.ts",
        ...
      },
      ...
    }
    

tsc 构建转译之后，第 4 行的 build 命令会使用 tsc-alias 将别名替换成相对路径。在载入 ts-node/register 模块之前，第 5 行会预载 tsconfig-paths/register，这样 ts-node 也可以解析别名了。

当然，除了选择官方工具 tsc 之外，我们也可以选择其他的工具构建 TypeScript 代码，比如说 Rollup、Babel 等，因篇幅有限，这里就不做深入介绍了。

### 小结和预告

以上就是使用 TypeScript 开发一个简单静态文件服务 NPM 模块的全过程，我们充分利用了 TypeScript 生态中的各种工具和特性。

关于如何开发基于 TypeScript 的 Node.js 模块和服务，我在下面也总结了一些建议。

*   export 导出模块内的所有必要的类型定义，可以帮助我们减少 ts(4023) 错误。
    
*   我们可以开启 importHelpers 配置，公用 tslib 替代内联 import 等相关 polyfill 代码，从而大大减小生成代码的体积，配置示例如下：
    

    {
      "extends": "./tsconfig.json",
      "compilerOptions": {
        "importHelpers": true
      },
      "exclude": ["__tests__", "lib"]
    }
    

如以上示例第 4 行，配置 importHelpers 为 true，**此时一定要把 tslib 加入模块依赖中：**

    npm install tslib -S; // 安装 tslib 依赖
    

*   确保 tsconfig.test.json 和 tsconfig.prod.json 中代码转译相关的配置尽可能一致，避免逻辑虽然通过了单测，但是构建之后运行提示错误。
    
*   慎用 import \* as ModuleName，因为较低版本的 tslib 实现的 \_\_importStar 补丁有 bug。如果模块 export 是类的实例，经 \_\_importStar 处理后，会造成实例方法丢失。另外一个建议是避免直接 export 一个类的实例，如下代码所示：
    

    exports = module.exports = new Command(); // bad
    

*   推荐使用完全支持 TypeScript 的 NestJS 框架开发企业级 Node.js 服务端应用。
    

插播一道思考题：请对这一讲中的静态文件服务示例进行改造，并为 HttpServer 类及 CLI 添加更多的可配置项，然后通过 VS Code 源码调试及其他章节的经验解决改造过程中碰到的问题。

19 讲我们将学习 TypeScript 在 Web 端应用开发中的实践，敬请期待。

另外，如果你觉得本专栏有价值，欢迎分享给更多好友。