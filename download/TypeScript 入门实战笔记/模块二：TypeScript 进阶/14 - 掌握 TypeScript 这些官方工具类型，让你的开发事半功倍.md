在 13 讲中我们学习了如何增强 TypeScript 类型系统，这一讲将继续深入了解 TypeScript 官方提供的全局工具类型。

在 TypeScript 中提供了许多自带的工具类型，因为这些类型都是全局可用的，所以无须导入即可直接使用。了解了基础的工具类型后，我们不仅知道 TypeScript 如何利用前几讲介绍的基础类型知识实现这些工具类型，还知道如何更好地利用这些基础类型，以免重复造轮子，并能通过这些工具类型实现更复杂的类型。

根据使用范围，我们可以将工具类型划分为操作接口类型、联合类型、函数类型、字符串类型这 4 个方向，下面一一介绍。

### 操作接口类型

#### Partial

Partial 工具类型可以将一个类型的所有属性变为可选的，且该工具类型返回的类型是给定类型的所有子集，下面我们看一个具体的示例：

    type Partial<T> = {
      [P in keyof T]?: T[P];
    };
    interface Person {
      name: string;
      age?: number;
      weight?: number;
    }
    type PartialPerson = Partial<Person>;
    // 相当于
    interface PartialPerson {
      name?: string;
      age?: number;
      weight?: number;
    }
    

在上述示例中，我们使用映射类型取出了传入类型的所有键值，并将其值设定为可选的。

#### Required

与 Partial 工具类型相反，Required 工具类型可以将给定类型的所有属性变为必填的，下面我们看一个具体示例。

    type Required<T> = {
      [P in keyof T]-?: T[P];
    };
    type RequiredPerson = Required<Person>;
    // 相当于
    interface RequiredPerson {
      name: string;
      age: number;
      weight: number;
    }
    

在上述示例中，映射类型在键值的后面使用了一个 - 符号，- 与 ? 组合起来表示去除类型的可选属性，因此给定类型的所有属性都变为了必填。

#### Readonly

Readonly 工具类型可以将给定类型的所有属性设为只读，这意味着给定类型的属性不可以被重新赋值，下面我们看一个具体的示例。

    type Readonly<T> = {
      readonly [P in keyof T]: T[P];
    };
    type ReadonlyPerson = Readonly<Person>;
    // 相当于
    interface ReadonlyPerson {
      readonly name: string;
      readonly age?: number;
      readonly weight?: number;
    }
    

在上述示例中，经过 Readonly 处理后，ReadonlyPerson 的 name、age、weight 等属性都变成了 readonly 只读。

#### Pick

Pick 工具类型可以从给定的类型中选取出指定的键值，然后组成一个新的类型，下面我们看一个具体的示例。

    type Pick<T, K extends keyof T> = {
      [P in K]: T[P];
    };
    type NewPerson = Pick<Person, 'name' | 'age'>;
    // 相当于
    interface NewPerson {
      name: string;
      age?: number;
    }
    

在上述示例中，Pick工具类型接收了两个泛型参数，第一个 T 为给定的参数类型，而第二个参数为需要提取的键值 key。有了参数类型和需要提取的键值 key，我们就可以通过映射类型很容易地实现 Pick 工具类型的功能。

#### Omit

与 Pick 类型相反，Omit 工具类型的功能是返回去除指定的键值之后返回的新类型，下面我们看一个具体的示例：

    type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
    type NewPerson = Omit<Person, 'weight'>;
    // 相当于
    interface NewPerson {
      name: string;
      age?: number;
    }
    

在上述示例中，Omit 类型的实现使用了前面介绍的 Pick 类型。我们知道 Pick 类型的作用是选取给定类型的指定属性，那么这里的 Omit 的作用应该是选取除了指定属性之外的属性，而 Exclude 工具类型的作用就是从入参 T 属性的联合类型中排除入参 K 指定的若干属性。

> **Tips**：操作接口类型这一小节所介绍的工具类型都使用了映射类型。通过映射类型，我们可以对原类型的属性进行重新映射，从而组成想要的类型。

### 联合类型

#### Exclude

在介绍 Omit 类型的实现中，我们使用了 Exclude 类型。通过使用 Exclude 类型，我们从接口的所有属性中去除了指定属性，因此，Exclude 的作用就是从联合类型中去除指定的类型。

下面我们看一个具体的示例：

    type Exclude<T, U> = T extends U ? never : T;
    type T = Exclude<'a' | 'b' | 'c', 'a'>; // => 'b' | 'c'
    type NewPerson = Omit<Person, 'weight'>;
    // 相当于
    type NewPerson = Pick<Person, Exclude<keyof Person, 'weight'>>;
    // 其中
    type ExcludeKeys = Exclude<keyof Person, 'weight'>; // => 'name' | 'age'
    

在上述示例中，Exclude 的实现使用了条件类型。如果类型 T 可被分配给类型 U ，则不返回类型 T，否则返回此类型 T ，这样我们就从联合类型中去除了指定的类型。

再回看之前的 NewPerson 类型的例子，我们也就很明白了。在 ExcludeKeys 中，如果 Person 类型的属性是我们要去除的属性，则不返回该属性，否则返回其类型。

#### Extract

Extract 类型的作用与 Exclude 正好相反，Extract 主要用来从联合类型中提取指定的类型，类似于操作接口类型中的 Pick 类型。

下面我们看一个具体的示例：

    type Extract<T, U> = T extends U ? T : never;
    type T = Extract<'a' | 'b' | 'c', 'a'>; // => 'a'
    

通过上述示例，我们发现 Extract 类型相当于取出两个联合类型的交集。

此外，我们还可以基于 Extract 实现一个获取接口类型交集的工具类型，如下示例：

    type Intersect<T, U> = {
      [K in Extract<keyof T, keyof U>]: T[K];
    };
    interface Person {
      name: string;
      age?: number;
      weight?: number;
    }
    interface NewPerson {
      name: string;
      age?: number;
    }
    type T = Intersect<Person, NewPerson>;
    // 相当于
    type T = {
      name: string;
      age?: number;
    };
    

在上述的例子中，我们使用了 Extract 类型来提取两个接口类型属性的交集，并使用映射类型生成了一个新的类型。

#### NonNullable

NonNullable 的作用是从联合类型中去除 null 或者 undefined 的类型。如果你对条件类型已经很熟悉了，那么应该知道如何实现 NonNullable 类型了。

下面看一个具体的示例：

    type NonNullable<T> = T extends null | undefined ? never : T;
    // 等同于使用 Exclude
    type NonNullable<T> = Exclude<T, null | undefined>;
    type T = NonNullable<string | number | undefined | null>; // => string | number
    

在上述示例中，如果 NonNullable 传入的类型可以被分配给 null 或是 undefined ，则不返回该类型，否则返回其具体类型。

#### Record

Record 的作用是生成接口类型，然后我们使用传入的泛型参数分别作为接口类型的属性和值。

下面我们看一个具体的示例：

    type Record<K extends keyof any, T> = {
      [P in K]: T;
    };
    type MenuKey = 'home' | 'about' | 'more';
    interface Menu {
      label: string;
      hidden?: boolean;
    }
    const menus: Record<MenuKey, Menu> = {
      about: { label: '关于' },
      home: { label: '主页' },
      more: { label: '更多', hidden: true },
    };
    

在上述示例中，Record 类型接收了两个泛型参数：第一个参数作为接口类型的属性，第二个参数作为接口类型的属性值。

> **需要注意：这里的实现限定了第一个泛型参数继承自**`keyof any`。

在 TypeScript 中，keyof any 指代可以作为对象键的属性，如下示例：

    type T = keyof any; // => string | number | symbol
    

> **说明**：目前，JavaScript 仅支持`string`、`number`、`symbol`作为对象的键值。

### 函数类型

#### ConstructorParameters

ConstructorParameters 可以用来获取构造函数的构造参数，而 ConstructorParameters 类型的实现则需要使用 infer 关键字推断构造参数的类型。

关于 infer 关键字，我们可以把它当成简单的模式匹配来看待。如果真实的参数类型和 infer 匹配的一致，那么就返回匹配到的这个类型。

下面看一个具体的示例：

    type ConstructorParameters<T extends new (...args: any) => any> = T extends new (
      ...args: infer P
    ) => any
      ? P
      : never;
    class Person {
      constructor(name: string, age?: number) {}
    }
    type T = ConstructorParameters<typeof Person>; // [name: string, age?: number]
    

在上述示例中，ConstructorParameters 泛型接收了一个参数，并且限制了这个参数需要实现构造函数。于是，我们通过 infer 关键字匹配了构造函数内的构造参数，并返回了这些参数。因此，可以看到第 11 行匹配了 Person 构造函数的两个参数，并返回了一个元组类型 \[string, number\] 给类型别名 T。

#### Parameters

Parameters 的作用与 ConstructorParameters 类似，Parameters 可以用来获取函数的参数并返回序对，如下示例：

    type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
    type T0 = Parameters<() => void>; // []
    type T1 = Parameters<(x: number, y?: string) => void>; // [x: number, y?: string]
    

在上述示例中，Parameters 的泛型参数限制了传入的类型需要满足函数类型。

#### ReturnType

ReturnType 的作用是用来获取函数的返回类型，下面我们看一个具体的示例：

    type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
    type T0 = ReturnType<() => void>; // => void
    type T1 = ReturnType<() => string>; // => string
    

在上述示例中，`ReturnType`的泛型参数限制了传入的类型需要满足函数类型。

#### ThisParameterType

ThisParameterType 可以用来获取函数的 this 参数类型。

关于函数的 this 参数，我们在 05 讲函数类型中介绍过，下面看一个具体的示例：

    type ThisParameterType<T> = T extends (this: infer U, ...args: any[]) => any ? U : unknown;
    type T = ThisParameterType<(this: Number, x: number) => void>; // Number
    

在上述示例的第 1 行中，因为函数类型的第一个参数声明的是 this 参数类型，所以我们可以直接使用 infer 关键字进行匹配并获取 this 参数类型。在示例的第 3 行，类型别名 T 得到的类型就是 Number。

#### ThisType

ThisType 的作用是可以在对象字面量中指定 this 的类型。ThisType 不返回转换后的类型，而是通过 ThisType 的泛型参数指定 this 的类型，下面看一个具体的示例：

> 注意：如果你想使用这个工具类型，那么需要开启`noImplicitThis`的 TypeScript 配置。

    type ObjectDescriptor<D, M> = {
      data?: D;
      methods?: M & ThisType<D & M>; // methods 中 this 的类型是 D & M
    };
    function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
      let data: object = desc.data || {};
      let methods: object = desc.methods || {};
      return { ...data, ...methods } as D & M;
    }
    const obj = makeObject({
      data: { x: 0, y: 0 },
      methods: {
        moveBy(dx: number, dy: number) {
          this.x += dx; // this => D & M
          this.y += dy; // this => D & M
        },
      },
    });
    obj.x = 10;
    obj.y = 20;
    obj.moveBy(5, 5);
    

在上述示例子中，methods 属性的 this 类型为 D & M，在上下文中指代 { x: number, y: number } & { moveBy(dx: number, dy: number): void }。

ThisType 工具类型只是提供了一个空的泛型接口，仅可以在对象字面量上下文中被 TypeScript 识别，如下所示：

    interface ThisType<T> {}
    

也就是说该类型的作用相当于任意空接口。

#### OmitThisParameter

OmitThisParameter 工具类型主要用来去除函数类型中的 this 类型。如果传入的函数类型没有显式声明 this 类型，那么返回的仍是原来的函数类型。

下面看一个具体的示例：

    type OmitThisParameter<T> = unknown extends ThisParameterType<T>
      ? T
      : T extends (...args: infer A) => infer R
      ? (...args: A) => R
      : T;
    type T = OmitThisParameter<(this: Number, x: number) => string>; // (x: number) => string
    

在上述示例中， ThisParameterType 类型的实现如果传入的泛型参数无法推断 this 的类型，则会返回 unknown 类型。在OmitThisParameter 的实现中，第一个条件语句如果传入的函数参数没有 this 类型，则返回原类型；否则通过 infer 分别获取函数参数和返回值的类型构造一个新的没有 this 的函数类型，并返回这个函数类型。

### 字符串类型

#### 模板字符串

TypeScript 自 4.1版本起开始支持模板字符串字面量类型。为此，TypeScript 也提供了 Uppercase、Lowercase、Capitalize、Uncapitalize这 4 种内置的操作字符串的类型，如下示例：

    // 转换字符串字面量到大写字母
    type Uppercase<S extends string> = intrinsic;
    // 转换字符串字面量到小写字母
    type Lowercase<S extends string> = intrinsic;
    // 转换字符串字面量的第一个字母为大写字母
    type Capitalize<S extends string> = intrinsic;
    // 转换字符串字面量的第一个字母为小写字母
    type Uncapitalize<S extends string> = intrinsic;
    type T0 = Uppercase<'Hello'>; // => 'HELLO'
    type T1 = Lowercase<T0>; // => 'hello'
    type T2 = Capitalize<T1>; // => 'Hello'
    type T3 = Uncapitalize<T2>; // => 'hello'
    

在上述示例中，这 4 种操作字符串字面量工具类型的实现都是使用 JavaScript 运行时的字符串操作函数计算出来的，且不支持语言区域设置。以下代码是这 4 种字符串工具类型的实际实现。

    function applyStringMapping(symbol: Symbol, str: string) {
      switch (intrinsicTypeKinds.get(symbol.escapedName as string)) {
        case IntrinsicTypeKind.Uppercase:
          return str.toUpperCase();
        case IntrinsicTypeKind.Lowercase:
          return str.toLowerCase();
        case IntrinsicTypeKind.Capitalize:
          return str.charAt(0).toUpperCase() + str.slice(1);
        case IntrinsicTypeKind.Uncapitalize:
          return str.charAt(0).toLowerCase() + str.slice(1);
      }
      return str;
    }
    

在上述代码中可以看到，字符串的转换使用了 JavaScript 中字符串的 toUpperCase 和 toLowerCase 方法，而不是 toLocaleUpperCase 和 toLocaleLowerCase。其中 toUpperCase 和 toLowerCase 采用的是 Unicode 编码默认的大小写转换规则。

### 小结与预告

这一讲我们学习了操作接口类型、联合类型、函数、字符串的工具类。

在学习这些工具类型的实现时，我们发现它们都是基于映射类型、条件类型、infer 推断实现的。可以说掌握了这 3 种类型操作的技巧，我们就可以自由地组合更多的工具类型了。

插播一道思考题：基于 Exclude 工具类型的代码实现，请你分析一下为什么它可以从联合类型中排除掉指定成员？欢迎你在留言区与我互动/交流。

当然，这道题涉及的知识点大概率超纲了，在 15 讲编写自定义工具类型中我们将更详细地分析。请你保持好奇心，敬请期待吧！

如果你觉得本专栏有价值，欢迎分享给更多好友！