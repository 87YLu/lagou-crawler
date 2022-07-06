这一讲，我们将从最基本的语法、原始类型层面的知识点正式开启 TypeScript 学习之旅。“不积跬步，无以至千里”，只有融会贯通、夯实基础，我们才能在后续的学习中厚积薄发。

> **学习建议：** 为了更直观地学习这一讲的内容，请你使用配置好的 VS Code IDE（可以回顾一下“01 | 如何快速搭建 TypeScript 开发环境？”的内容） 亲自尝试编写以下涉及的所有示例，比如新建一个“02.basic.1.ts”。

### TypeScript 简介

TypeScript 其实就是类型化的 JavaScript，它不仅支持 JavaScript 的所有特性，还在 JavaScript 的基础上添加了静态类型注解扩展。

这里我们举个例子来说明一下，比如 JavaScript 中虽然提供了原始数据类型 string、number，但是它无法检测我们是不是按照约定的类型对变量赋值，而 TypeScript 会对赋值及其他所有操作默认做静态类型检测。

因此，从某种意义上来说，**TypeScript 其实就是 JavaScript 的超集**，如下图所示：

![Drawing 1.png](https://s0.lgstatic.com/i/image6/M00/3D/B5/CioPOWCV_xuAZSI_AAdZCdHFgM8072.png)

TypeScript 是 JavaScript 的超集示意图

在 TypeScript 中，我们不仅可以轻易复用 JavaScript 的代码、最新特性，还能使用可选的静态类型进行检查报错，使得编写的代码更健壮、更易于维护。比如在开发阶段，我们通过 TypeScript 代码转译器就能快速消除很多低级错误（如 typo、类型等）。

接下来我们一起看看 TypeScript 的基本语法。

### 基本语法

在语法层面，缺省类型注解的 TypeScript 与 JavaScript 完全一致。因此，我们可以把 TypeScript 代码的编写看作是为 JavaScript 代码添加类型注解。

在 TypeScript 语法中，类型的标注主要通过类型后置语法来实现，下面我们通过一个具体示例进行说明。

    let num = 1;
    

示例中的语法同时符合 JavaScript 语法和 TypeScript 语法。

而 TypeScript 语法与 JavaScript 语法的区别在于，我们可以在 TypeScript 中显式声明变量`num`仅仅是数字类型，也就是说只需在变量`num`后添加`: number`类型注解即可，如下代码所示：

    let num: number = 1;
    

**特殊说明：**`number`表示数字类型，`:`用**来分割变量和类型的分隔符。**

同理，我们也可以把`:`后的`number`换成其他的类型（比如 JavaScript 原始类型：number、string、boolean、null、undefined、symbol 等），此时，num 变量也就拥有了 TypeScript 同名的原始类型定义。

关于 JavaScript 原始数据类型到 TypeScript 类型的映射关系如下表所示：

![Drawing 2.png](https://s0.lgstatic.com/i/image6/M00/3D/B5/CioPOWCV_y2AfRkCAAJ0QW8Nr1k253.png)

接下来，我们详细地了解一下原始类型。

### 原始类型

在 JavaScript 中，原始类型指的是非对象且没有方法的数据类型，它包括 string、number、bigint、boolean、undefined 和 symbol 这六种 **（null 是一个伪原始类型，它在 JavaScript 中实际上是一个对象，且所有的结构化类型都是通过 null 原型链派生而来）**。

在 JavaScript 语言中，原始类型值是最底层的实现，对应到 TypeScript 中同样也是最底层的类型。

为了实现更合理的逻辑边界，本专栏我们把以上原始类型拆分为基础类型和特殊类型这两部分进行讲解。02 讲主要讲解字符串、数字（包括 number 和 bigint）、布尔值、Symbol 这 4 种基础类型，03 讲主要讲解 null 和 undefined 等特殊字符。

#### 字符串

在 JavaScript 中，我们可以使用`string`表示 JavaScript 中任意的字符串（包括模板字符串），具体示例如下所示：

    let firstname: string = 'Captain'; // 字符串字面量
    let familyname: string = String('S'); // 显式类型转换
    let fullname: string = `my name is ${firstname}.${familyname}`; // 模板字符串
    

> **说明：所有 JavaScript 支持的定义字符串的方法，我们都可以直接在 TypeScript 中使用。**

#### 数字

同样，我们可以使用`number`类型表示 JavaScript 已经支持或者即将支持的十进制整数、浮点数，以及二进制数、八进制数、十六进制数，具体的示例如下所示：

    /** 十进制整数 */
    let integer: number = 6;
    /** 十进制整数 */
    let integer2: number = Number(42);
    /** 十进制浮点数 */
    let decimal: number = 3.14;
    /** 二进制整数 */
    let binary: number = 0b1010;
    /** 八进制整数 */
    let octal: number = 0o744;
    /** 十六进制整数 */
    let hex: number = 0xf00d;
    

如果使用较少的大整数，那么我们可以使用`bigint`类型来表示，如下代码所示。

    let big: bigint =  100n;
    

**请注意：虽然**`number`和`bigint`都表示数字，但是这两个类型不兼容。

因此，如果我们在 VS Code IDE 中输入如下示例，问题面板中将会抛出一个类型不兼容的 ts(2322) 错误。

    big = integer;
    integer = big;
    

#### 布尔值

同样，我们可以使用`boolean`表示 True 或者 False，如下代码所示。

    /** TypeScript 真香 为 真 */
    let TypeScriptIsGreat: boolean = true;
     /** TypeScript 太糟糕了 为 否 */
    let TypeScriptIsBad: boolean = false;
    

#### Symbol

自 ECMAScript 6 起，TypeScript 开始支持新的`Symbol`原始类型， 即我们可以通过`Symbol`构造函数，创建一个独一无二的标记；同时，还可以使用`symbol`表示如下代码所示的类型。

    let sym1: symbol = Symbol();
    let sym2: symbol = Symbol('42');
    

**当然，TypeScript 还包含 Number、String、Boolean、Symbol 等类型（注意区分大小写）。**

> **特殊说明：请你千万别将它们和小写格式对应的 number、string、boolean、symbol 进行等价**。不信的话，你可以思考并验证如下所示的示例。

    let sym: symbol = Symbol('a');
    let sym2: Symbol = Symbol('b');
    sym = sym2 // ok or fail?
    sym2 = sym // ok or fail?
    let str: String = new String('a');
    let str2: string = 'a';
    str = str2; // ok or fail?
    str2 = str; // ok or fail?
    

实际上，我们压根使用不到 Number、String、Boolean、Symbol 类型，因为它们并没有什么特殊的用途。这就像我们不必使用 JavaScript Number、String、Boolean 等构造函数 new 一个相应的实例一样。

介绍完这几种原始类型后，你可能会心生疑问：缺省类型注解的有无似乎没有什么明显的作用，就像如下所示的示例一样：

    {
      let mustBeNum = 1;
    }
    {
      let mustBeNum: number = 1;
    }
    

其实，以上这两种写法在 TypeScript 中是等价的，这得益于基于上下文的类型推导（这部分内容我们将在 04 讲中详细说明）。

下面，我们对上面的示例稍做一下修改，如下代码所示：

    {
      let mustBeNum = 'badString';
    }
    {
      let mustBeNum: number = 'badString';
    }
    

此时，我们可以看到 VS Code 的内容和问题面板区域提示了错误（其他 IDE 也会出现类似提示），如下图所示：

![Drawing 4.png](https://s0.lgstatic.com/i/image6/M01/3D/AC/Cgp9HWCV_0GAYFH7AATQLps4G-c499.png)

错误提示效果图

以上就是类型注解作用的直观体现。

如果变量所处的上下文环境特别复杂，在开发阶段就能检测出低级类型错误的能力将显得尤为重要，而这种能力主要来源于 TypeScript 实现的静态类型检测。

### 静态类型检测

在编译时期，静态类型的编程语言即可准确地发现类型错误，这就是静态类型检测的优势。

在编译（转译）时期，TypeScript 编译器将通过对比检测变量接收值的类型与我们显示注解的类型，从而检测类型是否存在错误。如果两个类型完全一致，显示检测通过；如果两个类型不一致，它就会抛出一个编译期错误，告知我们编码错误，具体示例如下代码所示：

    const trueNum: number = 42;
    const fakeNum: number = "42"; // ts(2322) Type 'string' is not assignable to type 'number'.
    

在以上示例中，首先我们声明了一个数字类型的变量`trueNum`，通过编译器检测后，发现接收值是 42，且它的类型是`number`，可见两者类型完全一致。此时，TypeScript 编译器就会显示检测通过。

而如果我们声明了一个`string`类型的变量`fakeNum`，通过编译器检测后，发现接收值为 "42"，且它的类型是`number`，可见两者类型不一致 。此时，TypeScript 编译器就会抛出一个字符串值不能为数字类型变量赋值的ts(2322) 错误，也就是说检测不通过。

实际上，正如 01 讲提到，TypeScript 的语言服务可以和 VS Code 完美集成。**因此，在编写代码的同时，我们可以同步进行静态类型检测（无须等到编译后再做检测），极大地提升了开发体验和效率。**

以上就是 TypeScript 中基本语法和原始类型的介绍。

### 小结

这一讲通过与 JavaScript 的基础类型进行对比，我们得知：TypeScript 其实就是添加了类型注解的 JavaScript，它并没有任何颠覆性的变动。因此，学习并掌握 TypeScript 一定会是一件极其容易的事情。

**插播一个思考题：请举例说明 ts(2322) 是一个什么错误？什么时候会抛出这个错误？欢迎你在留言区进行互动、交流。**

另外，如果你觉得本专栏有价值，欢迎分享给更多好友哦~