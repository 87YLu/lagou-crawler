经过前面课程的学习，你已经掌握了 TypeScript 的基本知识，并了解了如何利用 TypeScript 的基本知识实现一些高级类型和特性。这一讲我将介绍一些平时在开发过程中常见但在官方文档甚少提及的 TypeScript 类型错误，并教你如何给 TypeScript 代码编写单元测试。

### 常见错误

TypeScript 错误信息由错误码和详细信息组成。其中，错误码是以“TS”开头 + 数字（一般是 4 位数字）结尾这样的格式组成的字符串，用来作为特定类型错误的专属代号。如果你想查看所有的错误信息和错误码，可以点击[TypeScript 源码仓库](https://github.com/Microsoft/TypeScript/blob/master/src/compiler/diagnosticMessages.json)。当然，随着 TypeScript 版本的更新，也会逐渐增加更多新的类型错误。

下面我们看一下那些常见但在官方文档甚少提及的类型错误。

#### TS2456

首先是由于类型别名循环引用了自身造成的 TS2456 类型错误，如下示例：

    // TS2456: Type alias 'T' circularly references itself.
    type T = Readonly<T>;
    

在上述示例中，对于 T 这个类型别名，如果 TypeScript 编译器想知道 T 类型是什么，就需要展开类型别名赋值的 Readonly`<T>`。而为了确定 Readonly`<T>` 的类型，TypeScript 编译器需要继续判断类型入参 T 的类型，这就形成了一个循环引用。类似函数循环调用自己，如果没有正确的终止条件，就会一直处于无限循环的状态。

当然，如果在类型别名的定义中设定了正确的终止条件，我们就可以使用循环引用的特殊数据结构，如下示例：

    type JSON = string | number | boolean | null | JSON[] | { [key: string]: JSON };
    ​
    const json1: JSON = 'json';
    const json2: JSON = ['str', 1, true, null];
    const json3: JSON = { key: 'value' };
    

在上面的例子中，我们定义了 JSON 数据结构的 TypeScript 类型。其中，就有对类型别名 JSON 自身的循环引用，即示例中出现的 JSON\[\] | { \[key: string\]: JSON }。与第 1 个例子不同的是，这里的引用最终可以具体展开为 string | number | boolean | null 类型，所以不会出现无限循环的情况。

> **注意：第 2 个例子只能在 TypeScript 3.7 以上的版本使用，如果版本小于 3.7 仍会提示 TS2456 错误。**

#### TS2554

另外，我们需要介绍的是比较常见的一个 TS2554 错误，它是由于形参和实参个数不匹配造成的，如下示例：

    function toString(x: number | undefined): string {
      if (x === undefined) {
        return '';
      }
      return x.toString();
    }
    ​
    toString(); // TS2554: Expected 1 arguments, but got 0.
    toString(undefined);
    toString(1);
    

上面例子报错的原因是，在 TypeScript 中，undefined 是一个特殊的类型。由于类型为 undefined，并不代表可缺省，因此示例中的第 8 行提示了 TS2554 错误。

而可选参数是一种特殊的类型，虽然在代码执行层面上，最终参数类型是 undefined 和参数可选的函数，接收到的入参的值都可以是 undefined，但是在 TypeScript 的代码检查中，undefined 类型的参数和可选参数都会被当作不同的类型来对待，如下示例：

    function toString(x?: number): string {
      if (x === undefined) {
        return '';
      }
      return x.toString();
    }
    ​
    function toString(x = ''): string {
      return x.toString();
    }
    

因此，如果在编程的过程中函数的参数是可选的，我们最好使用可选参数的语法，这样就可以避免手动传入 undefined 的值，并顺利通过 TypeScript 的检查。

值得一提的是，在 TypeScript 4.1 大版本的更新中，Promise 构造的 resolve 参数不再是默认可选的了，所以如以下示例第 2 行所示，在未指定入参的情况下，调用 resolve 会提示类型错误 **（注意：为了以示区分，官方使用了 TS2794 错误码指代这个错误）**。

    new Promise((resolve) => {
      resolve(); // TS2794: Expected 1 arguments, but got 0. Did you forget to include 'void' in your type argument to 'Promise'? 
    });
    

如果我们不需要参数，只需要给 Promise 的泛型参数传入 void 即可，如下示例：

    new Promise<void>((resolve) => {
      resolve();
    });
    

在上述示例中，因为我们在第 1 行给泛型类 Promise 指定了 void 类型入参（注意是 void 而不是 undefined），所以在第 3 行调用 resolve 时无须指定入参。

#### TS1169

接下来是 TS1169 类型错误，它是在接口类型定义中由于使用了非字面量或者非唯一 symbol 类型作为属性名造成的，如下示例：

    interface Obj {
      [key in 'id' | 'name']: any; // TS1169: A computed property name in an interface must refer to an expression whose type is a literal type or a 'unique symbol' type.
    };
    

在上述示例中，因为interface 类型的属性必须是字面量类型(string、number) 或者是 unique symbol 类型，所以在第 2 行提示了 TS1169 错误。

关于接口类型支持的用法如下示例：

    const symbol: unique symbol = Symbol();
    ​
    interface Obj {
      [key: string]: any;
      [key: number]: any;
      [symbol]: any;
    }
    

在上述示例中的第 4~6 行，我们使用了 string、number 和 symbol 作为接口属性，所以不会提示类型错误。

但是，在 type 关键字声明的类型别名中，我们却可以使用映射类型定义属性，如下示例：

    type Obj = {
      [key in 'id' | 'name']: any;
    };
    

在示例中的第 2 行，我们定义了一个包含 id 和 name 属性的类型别名 Obj。

#### TS2345

接下来我们介绍一下非常常见的 TS2345 类型错误，它是在传参时由于类型不兼容造成的，如下示例：

    enum A {
      x = 'x',
      y = 'y',
      z = 'z',
    }
    enum B {
      x = 'x',
      y = 'y',
      z = 'z',
    }
    ​
    function fn(val: A) {}
    fn(B.x); // TS2345: Argument of type 'B.x' is not assignable to parameter of type 'A'.
    

如上面的例子所示，函数 fn 参数的 val 类型是枚举 A，在 13 行我们传入了与枚举 A 类似的枚举 B 的值，此时 TypeScript 提示了类型不匹配的错误。这是因为枚举是在运行时真正存在的对象，因此 TypeScript 并不会判断两个枚举是否可以互相兼容。

此时解决这个错误的方式也很简单，我们只需要让这两个枚举类型互相兼容就行，比如使用类型断言绕过 TypeScript 的类型检查，如下示例：

    function fn(val: A) {}
    fn((B.x as unknown) as A);
    

在示例中的第 2 行，我们使用了 as 双重类型断言让枚举 B.x 兼容枚举类型 A，从而不再提示类型错误。

#### TS2589

接下来我们介绍 TS2589 类型错误，它是由泛型实例化递归嵌套过深造成的，如下示例：

    type RepeatX<N extends number, T extends any[] = []> = T['length'] extends N
      ? T
      : RepeatX<N, [...T, 'X']>;
    type T1 = RepeatX<5>; // => ["X", "X", "X", "X", "X"]
    // TS2589: Type instantiation is excessively deep and possibly infinite.
    type T2 = RepeatX<50>; // => any
    

在上面的例子中，因为第 1 行的泛型 RepeatX 接收了一个数字类型入参 N，并返回了一个长度为 N、元素都是 'X' 的数组类型，所以第 4 行的类型 T1 包含了 5 个 "X" 的数组类型；但是第 6 行的类型 T2 的类型却是 any，并且提示了 TS2589 类型错误。这是因为 TypeScript 在处理递归类型的时候，最多实例化 50 层，如果超出了递归层数的限制，TypeScript 便不会继续实例化，并且类型会变为 top 类型 any。

对于上面的错误，我们使用 @ts-ignore 注释忽略即可。

#### TS2322

接下来需要介绍的是一个常见的字符串字面量类型的 TS2322 错误，如下示例：

    interface CSSProperties {
      display: 'block' | 'flex' | 'grid';
    }
    const style = {
      display: 'flex',
    };
    // TS2322: Type '{ display: string; }' is not assignable to type 'CSSProperties'.
    //  Types of property 'display' are incompatible.
    //   Type 'string' is not assignable to type '"block" | "flex" | "grid"'.
    const cssStyle: CSSProperties = style;
    

在上面的例子中，CSSProperties 的 display 属性的类型是字符串字面量类型 'block' | 'flex' | 'grid'，虽然变量 style 的 display 属性看起来与 CSSProperties 类型完全兼容，但是 TypeScript 提示了 TS2322 类型不兼容的错误。这是因为变量 style 的类型被自动推断成了 { display: string }，string 类型自然无法兼容字符串字面量类型 'block' | 'flex' | 'grid'，所以变量 style 不能赋值给 cssStyle。

如下我提供了两种解决这个错误的方法。

    // 方法 1
    const style: CSSProperties = {
      display: 'flex',
    };
    // 方法 2
    const style = {
      display: 'flex' as 'flex',
    };
    // typeof style = { display: 'flex' }
    

在方法 1 中，我们显式声明了 style 类型为 CSSProperties，因此变量 style 类型与 cssStyle 期望的类型兼容。在方法 2 中，我们使用了类型断言声明 display 属性的值为字符串字面量类型 'flex'，因此 style 的类型被自动推断成了 { display: 'flex' }，与 CSSProperties 类型兼容。

#### TS2352

接下来我要介绍的是一个 TypeScript 类型收缩特性的 TS2352 类型错误，如下示例：

    let x: string | undefined;
    if (x) {
      x.trim();
      setTimeout(() => {
        x.trim(); // TS2532: Object is possibly 'undefined'.
      });
    }
    class Person {
      greet() {}
    }
    let person: Person | string;
    if (person instanceof Person) {
      person.greet();
      const innerFn = () => {
        person.greet(); // TS2532: Object is possibly 'undefined'.
      };
    }
    

在上述示例中的第 1 行，变量 x 的类型是 sting | undefined。在第 3 行的 if 语句中，变量 x 的类型按照之前讲的类型收缩特性应该是 string，可以看到第 4 行的代码可以通过类型检查，而第 6 行的代码报错 x 类型可能是 undefined（因为 setTimeout 的类型守卫失效，所以 x 的类型不会缩小为 string）。

同样，对于第 10 行的变量 person ，我们可以使用 instanceof 将它的类型收缩为 Person，因此第 16 行的代码通过了类型检查，而第 18 行则提示了 TS2352 错误。这是因为函数中对捕获的变量不会使用类型收缩的结果，因为编译器不知道回调函数什么时候被执行，也就无法使用之前类型收缩的结果。

针对这种错误的处理方式也很简单，将类型收缩的代码放入函数体内部即可，如下示例：

    let x: string | undefined;
    setTimeout(() => {
      if (x) {
        x.trim(); // OK
      }
    });
    class Person {
      greet() {}
    }
    let person: Person | undefined;
    const innerFn = () => {
      if (person instanceof Person) {
        person.greet(); // Ok
      }
    };
    

### 单元测试

在单元测试中，我们需要测试的是函数的输出与预计的输出是否相等。在 TypeScript 的类型测试中，我们需要测试的是编写的工具函数转换后的类型与预计的类型是否一致。

我们知道当赋值、传参的类型与预期不一致，TypeScript 就会抛出类型错误，如下示例：

    const x: string = 1; // TS2322: Type 'number' is not assignable to type 'string'.
    

在上述示例中可以看到，把数字字面量 1 赋值给 string 类型变量 x 时，会提示 TS2322 错误。

因此，我们可以通过泛型限定需要测试的类型。只有需要测试的类型与预期类型一致时，才可以通过 TypeScript 编译器的检查，如下示例：

    type ExpectTrue<T extends true> = T;
    type T1 = ExpectTrue<true>;
    type T2 = ExpectTrue<null>; // TS2344: Type 'null' does not satisfy the constraint 'true'.
    

在上面 ExpectTrue 的测试方法中，因为第 1 行预期的类型是 true，所以第 2 行的入参为 true 时不会出现错误提示。但是，因为第 3 行的入参是 null ，所以会提示类型错误。

自 TS 3.9 版本起，官方支持了与 @ts-ignore 注释相反功能的 @ts-expect-error 注释。使用 @ts-expect-error 注释，我们可以标记代码中应该有类型错误的部分。

与 ts-ignore 不同的是，如果下一行代码中没有错误，则会提示 TS2578 的错误，如下示例：

    // @ts-expect-error
    const x: number = '42';
    // TS2578: Unused '@ts-expect-error' directive.
    // @ts-expect-error
    const y: number = 42;
    

在上述示例的第 2 行代码处并不会提示类型不兼容的错误，这是因为 @ts-expect-error 注释命令表示下一行应当有类型错误，符合预期。而第 6 行的代码会提示 TS2578 未使用的 @ts-expect-error 命令，这是因为第 6 行的代码没有类型错误。

> **备注**：`@ts-expect-error`注释命令在编写预期失败的单元测试中很有用处。

### 小结与预告

这一讲我们介绍了一些 TypeScript 开发中可能遇到的错误码，并分析解析了错误的原因，同时介绍了如何为之前学习的工具类型、自定义函数编写单元测试。

18 讲我们将正式进入实践环节，教你如何使用 TypeScript 开发类型安全的 HTTP 静态文件服务，敬请期待！

另外，如果你觉得本专栏有价值，欢迎分享给更多好友。