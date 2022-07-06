“工欲善其事，必先利其器。”因此，在正式讲解 TypeScript 之前，我们有必要先掌握 TypeScript 开发环境的搭建及相关注意事项。

### IDE for TypeScript

在搭建 TypeScript 环境之前，我们需要先认识几款适合 TypeScript 的 IDE。只有这样，在开发时我们才能根据实际情况选择合适的 IDE 进行安装，从而提升工作效率。

#### VS Code

如果让我推荐一款 IDE 的话，我会首推微软的“亲儿子”——开源编辑器 VS Code（Visual Studio Code），因为它具备以下 4 点优势：

1.  在传统语法高亮、自动补全功能的基础上拓展了基于变量类型、函数定义，以及引入模块的智能补全；
    
2.  支持在编辑器上直接运行和调试应用；
    
3.  内置了 Git Comands，能大幅提升使用 Git 及其他 SCM 管理工具的协同开发效率；
    
4.  基于 Electron 开发，具备超强的扩展性和定制性。
    

下面请你[点击这里打开官方网站，并下载安装包进行安装](https://code.visualstudio.com/?fileGuid=xxQTRXtVcqtHK6j8)。安装好后，我们点击启动图标即可启动 VS Code。

在 Mac 电脑上，如果你习惯使用命令行，可以将 VS Code bin 目录添加到环境变量 PATH 中，以便更方便地唤起它，如下代码所示：

    export PATH="$PATH:/Applications/Visual Studio Code.app/Contents/Resources/app/bin"
    

然后，在 Mac 命令行工具中，我们使用 Vim 编辑“source ~/.bash\_profile”即可让配置的环境变量生效。

    source ~/.bash_profile
    

Vim 保存退出后，输入“code 应用路径”（如下所示），我们就可以快速打开和编辑指定路径下的应用了。

     code 应用路径
    

因为 VS Code 中内置了特定版本的 TypeScript 语言服务，所以它天然支持 TypeScript 语法解析和类型检测，且这个内置的服务与手动安装的 TypeScript 完全隔离。因此，**VS Code 支持在内置和手动安装版本之间动态切换语言服务，从而实现对不同版本的 TypeScript 的支持**。

如果当前应用目录中安装了与内置服务不同版本的 TypeScript，我们就可以点击 VS Code 底部工具栏的版本号信息，从而实现 “use VS Code's Version” 和 “use Workspace's Version” 两者之间的随意切换。

设置当前窗口使用的 TypeScript 版本的具体操作，如下图所示：

![versions.gif](https://s0.lgstatic.com/i/image6/M01/3D/AB/Cgp9HWCV_ZaAcBb0ACrQ7VCdLNg442.gif)

可随意切换 TypeScript 版本窗口图

我们也可以在当前应用目录下的 “.VS Code/settings.json” 内添加命令（如下所示）配置 VS Code 默认使用应用目录下安装的 TypeScript 版本，以便提供语法解析和类型检测服务。

    {
      "typescript.tsdk": "node_modules/typescript/lib"
    }
    

在实际编写 TypeScript 代码时，我们可以使用“Shift + Command + M”快捷键打开问题面板查看所有的类型错误信息概览，如下图所示：

![problems.gif](https://s0.lgstatic.com/i/image6/M01/3D/B4/CioPOWCV_aiANRthACtpGH2EbVM328.gif)

查看所有的类型错误信息概览图

**这里请注意：不同操作系统、不同 VS Code 版本的默认快捷键可能不一致，我们可以点击菜单栏中的“视图（View）| 问题（Problems）” 查看具体快捷键。**

当然，VS Code 也基于 TypeScript 语言服务提供了准确的代码自动补全功能，并显示详细的类型定义信息，如下图所示：

![Drawing 3.png](https://s0.lgstatic.com/i/image6/M01/3D/AB/Cgp9HWCV_bqAahbtAASBXpVdoSk110.png)

自动智能补全功能效果图

除了类型定义之外，TypeScript 语言服务还能将使用 JSDoc 语法编写的结构化注释信息提供给 VS Code，而这些信息将在对应的变量或者类型中通过 hover 展示出来，极大地提升了代码的可读性和开发效率，如下图所示：

![hover.gif](https://s0.lgstatic.com/i/image6/M01/3D/B4/CioPOWCV_c-AUMxiACJEAc_XkjE624.gif)

JSDoc 信息提示图

我们还可以通过 “Ctrl + \`” 快捷键打开 VS Code 内置的命令行工具，以便在当前应用路径下执行各种操作，如下图所示：

![Drawing 6.png](https://s0.lgstatic.com/i/image6/M01/3D/AC/Cgp9HWCV_dqAK7K-AALYUhjm47c225.png)

VS Code 内置的命令行工具图

以上就是 VS Code 编辑器的基本介绍了，此时有没有蠢蠢欲动的感觉？

对于 VS Code 这款 IDE 而言，它比较大众化、开放化，已经能满足我们绝大多数的功能诉求。即便有些需求不能满足，我们也可以通过丰富的插件市场进行实现。

而 VS Code 唯一的不足就是需要我们自己手动选择合适的插件拓展功能，对于选择困难症的人来说简直抓狂。

#### WebStorm

另外一款值得推荐的 TypeScript 开发利器是 WebStorm，**它具备开箱即用、无须做任何针对性的配置即可开发、执行和调试 TypeScript 源码这两大优势。**

下面请[点击这里打开官方网站，并下载安装包进行安装](https://www.jetbrains.com/webstorm/?fileGuid=xxQTRXtVcqtHK6j8)。

WebStorm 也是基于标准的 TypeScript Language Service 来支持 TypeScript 的各种特性，与其他 IDE 在类型检测结果、自动完成提示上没有任何差异。

比如，它同样可以准确地进行代码自动补全，如下图所示：

![Drawing 8.png](https://s0.lgstatic.com/i/image6/M01/3D/AC/Cgp9HWCV_eqAU4ipAAUcTPGzEyU020.png)

代码自动补全效果图

再比如，它同样支持 hover 提示类型及 JSDoc 注释，如下图所示：

![Drawing 10.png](https://s0.lgstatic.com/i/image6/M01/3D/AC/Cgp9HWCV_fyAO4ZRAASrHcWWn8Y686.png)

提示类型及注释效果图

因为 WebStorm 毕竟是一款商业化（收钱的）软件，所以它还集成了很多强大的 TypeScript 开发功能，具体内容你[可点击这里查看](https://www.jetbrains.com/zh-cn/webstorm/features/?fileGuid=xxQTRXtVcqtHK6j8)。

WebStorm 与 VS Code 相比，最大的**优势在于开箱即用**，这点可谓是选择困难症患者的福音。不过，它对电脑配置要求较高，对于 Mac 用户来说比较适合。

#### Playground

官方也提供了一个在线开发 TypeScript 的云环境——Playground。

基于它，我们无须在本地安装环境，只需要一个浏览器即可随时学习和编写 TypeScript，同时还可以方便地选择 TypeScript 版本、配置 tsconfig，并对 TypeScript 实时静态类型检测、转译输出 JavaScript 和在线执行。

而且在体验上，它也一点儿不逊色于任何本地的 IDE，对于刚刚学习 TypeScript 的我们来说，算是一个不错的选择。

*   [点击查看中文版地址](https://www.typescriptlang.org/zh/play?target=1&module=1&ts=3.9.7#code/Q&fileGuid=xxQTRXtVcqtHK6j8)（如下图所示）
    
*   [点击查看英文版地址](https://www.typescriptlang.org/play?alwaysStrict=false&target=1&module=1&ts=3.9.7#code/Q&fileGuid=xxQTRXtVcqtHK6j8)
    

![Drawing 12.png](https://s0.lgstatic.com/i/image6/M01/3D/AC/Cgp9HWCV_gmAJ3BOAAOjOVbf4SY600.png)

中文版的 TypeScript Playground 效果图

Playground 还为我们提供了分享的功能，比如我们可以把学习成果、遇到的难点通过 URL 的形式分享给他人。

不过，**在实际开发业务应用中，我们还是极力推荐使用 VS Code**，毕竟它是微软的“亲儿子”，与 TypeScript 集成得更好,拥有极其完善的插件体系，更重要的是还完全免费。

因此，接下来课程中的**所有示例，我们都将使用 VS Code 进行开发和演示。**

### 安装 TypeScript

接下来，我们继续了解如何基于 VS Code 完善 TypeScript 开发、转译环境。

因为 VS Code 只集成了 TypeScript 语言服务，不包含转译器，所以我们还需要单独安装 TypeScript。

为了方便快速完成一个入门小示例，这里我们推荐通过命令行工具使用 npm 全局安装 TypeScript。

具体操作：使用“Ctrl + \`”快捷键打开 VS Code 内置命令行工具，然后输入如下所示代码：

    npm i -g typescript
    

**注意：因为本课程使用示例都是基于 TypeScript 3.9.\* 版本，所以建议你在尝试操作时也安装本课程使用的 TypeScript 版本（比如 3.9.2、3.9.3……3.9.7）**，如下代码所示：

    npm i -g typescript@3.9.*
    

TypeScript 安装完成后，我们输入如下所示命令即可查看当前安装的 TypeScript 版本。

    tsc -v
    

然后，我们可能会看到输出了我们安装的版本信息：

    Version 3.9.2
    

我们也可以通过安装在 Terminal 命令行中直接支持运行 TypeScript 代码（Node.js 侧代码）的 ts-node 来获得较好的开发体验。

通过 npm 全局安装 ts-node 的操作如下代码所示：

    npm i -g ts-node
    

如果你是 Mac 或者 Linux 用户，就极有可能在 npm i -g typescript 中遭遇 “EACCES: permission denied” 错误，此时我们可以通过以下 4 种办法进行解决：

*   使用 nvm 重新安装 npm
    
*   修改 npm 默认安装目录
    
*   执行 sudo npm i -g xx
    
*   执行 sudo chown -R \[user\]:\[user\] /usr/local/lib/node\_modules
    

[你可以点击这里了解更多相关建议](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally?fileGuid=xxQTRXtVcqtHK6j8)。

最后，我们创建了一个 ts-course 的应用目录用来记录学习过程中的各种练习例子，然后使用 VS Code 即可打开这个应用。

### 编写 Hello World

我们可以在练习目录下输入“tsc --init”命令快速创建一个 tsconfig.json 文件，或者在 VS Code 应用窗口新建一个空的 tsconfg.json**配置 TypeScript 的行为。**

    tsc --init
    

为了让 TypeScript 的行为更加严格、简单易懂，降低学习的心理负担，这就要求我们在 tsconfig.json 中开启如下所示设置，该设置将决定了 VS Code 语言服务如何对当前应用下的 TypeScript 代码进行类型检测。**（说明：本课程中涉及的所有示例都是基于如下所示的统一配置编写。）**

    {
      "compilerOptions": {
        /* Strict Type-Checking Options */
        "strict": true,                           /* Enable all strict type-checking options. */
        "noImplicitAny": true,                 /* Raise error on expressions and declarations with an implied 'any' type. */
        "strictNullChecks": true,              /* Enable strict null checks. */
        "strictFunctionTypes": true,           /* Enable strict checking of function types. */
        "strictBindCallApply": true,           /* Enable strict 'bind', 'call', and 'apply' methods on functions. */
        "strictPropertyInitialization": true,  /* Enable strict checking of property initialization in classes. */
        "noImplicitThis": true,                /* Raise error on 'this' expressions with an implied 'any' type. */
        "alwaysStrict": false,                  /* Parse in strict mode and emit "use strict" for each source file. */
      }
    }
    

然后，我们输入如下所示代码即可新建一个 HelloWorld.ts 文件：

    function say(word: string) {
      console.log(word);
    }
    say('Hello, World');
    

在以上代码中，word 函数参数后边多出来的 “: string” 注解直观地告诉我们，这个变量的类型就是 string。如果你之前使用过其他强类型的语言（比如 Java），就能快速理解 TypeScript 语法。

当然，在当前目录下，我们也可以通过如下代码创建一个同名的 HelloWorld.js 文件，而这个文件中抹掉了类型注解的 TypeScript 代码。

    function say(word) {
      console.log(word);
    }
    say('Hello, World');
    

这里我们可以看到，TypeScript 代码和我们熟悉的 JavaScript 相比，并没有明显的差异。

.ts 文件创建完成后，我们就可以使用 tsc（TypeScript Compiler） 命令将 .ts 文件转译为 .js 文件。

**注意：指定转译的目标文件后，tsc 将忽略当前应用路径下的 tsconfig.json 配置，因此我们需要通过显式设定如下所示的参数，让 tsc 以严格模式检测并转译 TypeScript 代码。**

    tsc HelloWorld.ts --strict --alwaysStrict false
    

同时，我们可以给 tsc 设定一个 watch 参数监听文件内容变更，实时进行类型检测和代码转译，如下代码所示：

    tsc HelloWorld.ts --strict --alwaysStrict false --watch
    

![Drawing 14.png](https://s0.lgstatic.com/i/image6/M00/3D/AC/Cgp9HWCV_iGAYMjOAAVsTWlXVIk512.png)

tsc 转译监听模式效果图

我们也可以直接使用 ts-node 运行 HelloWorld.ts，如下代码所示：

    ts-node HelloWorld.ts
    

运行成功后，ts-node 就会输出如下所示内容：

    Hello, World
    

当然，我们也可以唤起“直接运行”（本质上是先自动进行转译，再运行）TypeScript 的 ts-node 命令行来编写代码，这就跟我们在 Node.js 命令行或者浏览器中调试工具一样。

然后，我们再回车立即执行如下所示代码：

    > ts-node
    > function say(word: string) {
    >   console.log(word);
    > }
    > say('Hello, World');
    Hello, World
    undefined
    

**这里请注意：TypeScript 的类型注解旨在约束函数或者变量，在上面的例子中，我们就是通过约束一个示例函数来接收一个字符串类型（string）的参数。**

在接下来演示的例子中，我们将故意犯一个低级错误，先传递一个数字类型的参数给如下所示函数：

    function say(word: string) {
      console.log(word);
    }
    say(1);
    

然后 VS Code 会标红这个错误，并在问题（Problems）面板中显示错误信息，如下图所示：

![Drawing 16.png](https://s0.lgstatic.com/i/image6/M00/3D/AC/Cgp9HWCV_jOAXmPNAAXOxhMuaTs987.png)

VS Code 问题面板显示效果图

最后，通过 tsc 转译或者 ts-node 运行这个示例，我们会看到如下所示的报错信息。

    error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.
    

这是因为函数 say 限定了形参的类型是 string，而我们调用 say 时传递的实参类型是 number，所以转译阶段抛出了这个错误。

### 小结与预告

VS Code 让我们获得一种较为理想的开发体验，不必等到转译阶段，在编码时就能快速检测、抛出类型错误，极大地提升了 TypeScript 开发体验和效率。

特别需要注意的是，VS Code 默认使用自身内置的 TypeScript 语言服务版本，而在应用构建过程中，构建工具使用的却是应用路径下 node\_modules/typescript 里的 TypeScript 版本。如果两个版本之间存在不兼容的特性，就会造成开发阶段和构建阶段静态类型检测结论不一致的情况，因此，我们务必将 VS Code 语言服务配置成使用当前工作区的 TypeScript 版本。

**插播一个思考题：如何选择和设置 VS Code 语言服务需要使用的 TypeScript 版本？欢迎你在留言区与我互动、交流。另外，如果你觉得本专栏有价值，欢迎分享给更多好友哦~**

到这里，TypeScript 开发环境就已经搭建好了，万事已具备。接下来我们的 TypeScript 学习开发班车就要发车了，你准备好迎接新的技能和新的挑战了吗？