本课时我主要从 JavaScript 角度来讲解如何学习 Dart。

在学习本课时之前，你需要有一定的 JavaScript 基础，比如基础数据类型、函数、基础运算符、类、异步原理和文件库引入等，这也是 JavaScript 的核心知识点。接下来将通过对比与 JavaScript 的差异点来学习 Dart 语言。

### 基础数据类型

与 JavaScript 相比较，我们整体上看一下图 1 两种语言的对比情况，相似的部分这里就不介绍了，比如 Number 和 String，其使用方式基本一致。下面主要基于两者的差异点逐一讲解，避免混淆或错误使用。

![image (4).png](https://s0.lgstatic.com/i/image/M00/1C/5F/CgqCHl7gWVGAdOndAACK0gUBRW0309.png)

图 1 Dart 与 JavaScript 基础数据类型对比

#### Symbol 的区别

在 JavaScript 中，Symbol 是将基础数据类型转换为唯一标识符，核心应用是可以将复杂引用数据类型转换为对象数据类型的键名。

在 Dart 中，Symbol 是不透明的动态字符串名称，用于反映库中的元数据。用 Symbol 可以获得或引用类的一个镜像，概念比较复杂，但其实和 JavaScript 的用法基本上是一致的。例如，下面代码首先 new 了一个 test 为 Map 数据类型，设置一个属性 #t（Symbol 类型），然后分别打印 test、test 的 #t、test 的 Symbol("t") 和 #t。

    void main() {
      Map test = new Map();
      test[#t] = 'symbol test';
      print(test);
      print(test[#t]);
      print(test[Symbol('t')]);
      print(#t);
    }
    

运行代码结果如下：

    flutter: {Symbol("t"): symbol test}
    flutter: symbol test
    flutter: symbol test
    flutter: Symbol("t")
    

其中，test 包含了一个有 Symbol 为对象的 Key，value 为 symbol test 字符串的对象。test 的 #t 与 Symbol("t") 打印结果一致，#t 则与 Symbol("t') 是同一形式。

在上面的代码示例中，两者的核心在使用上基本是一致的，只是在理解方面相对不一样。**Symbol 在 Dart 中是一种反射概念，而在 JavaScript 中则是创建唯一标识的概念。**

#### Undefined 和 Null

由于 Dart 是静态脚本语言，因此在 Dart 中如果没有定义一个变量是无法通过编译的；而 JavaScript 是动态脚本语言，因此存在脚本在运行期间未定义的情况。所以这一点的不同决定了 Dart 在 Undefined 类型上与 JavaScript 的差异。

null 在 Dart 中是的确存在的，官网上是这样解释的，null 是弱类型 object 的子类型，并非基础数据类型。所有数据类型，如果被初始化后没有赋值的话都将会被赋值 null 类型。

下面的代码，首先定义了一个弱类型 number，其次定义了 int 类型的 num2，number 类型的 num1 以及 double 类型的 num3 ，最后我们打印出这些只定义了未被赋值的值。

    var number;
    int num2;
    num num1;
    double num3;
    print('number is var:$number,num2 is int:$num2,num2 is num:$num1,num3 is double:$num3');
    

可以看到运行结果如下：

    flutter: number is var:null,num2 is int:null,num2 is num:null,num3 is double:null
    

从运行结果我们可以看到，代码中声明了变量，但未赋值的变量在运行时都会被赋值为 null，这就是 Dart 中 null 类型存在的目的。

#### Map 和 List

Map 和 List 与 JavaScript 中的 Array 和 Map 基本一致，但在 JavaScript 中不是基本数据类型，都属于引用数据类型。因此也就是分类不同，但在用法和类型上基本没有太大差异。

#### 弱类型（var、object 和 dynamic）

相对 JavaScript 而言，Dart 也存在弱类型（可以使用 var、object 和 dynamic 来声明），不过在这方面为了避免弱类型导致的客户端（App）Crash 的异常，Dart 还是对弱类型加强了校验。

var 数据类型声明，第一次赋值时，将其数据类型绑定。下面代码使用 var 声明了一个弱类型 t，并赋值 String 类型 123，而接下来又对 t 进行其他类型的赋值。

    var t = '123';
    t = 123;
    

这样的代码在 Dart 编译前就会报错，因为 t 在一次 var 赋值时就已经被绑定为 String 类型了，再进行赋值 Number 类型时就会报错。

    Assign value to new local variable
    

object 可以进行任何赋值，没有约束，这一点类似 JavaScript 中的 var 关键词赋值。在编译期，object 会对数据调用做一定的判断，并且报错。例如，声明时为 String 类型，但是在调用 length 时，编译期就会报错。如果数据来自接口层，则很容易导致运行时报错。因此这个要尽量减少使用，避免运行时报错导致客户端（App）Crash 的异常。

dynamic 也是动态的数据类型，但如果数据类型调用异常，则只会在运行时报错，这点是非常危险的，因此在使用 dynamic 时要非常慎重。

### 基础运算符

两种语言的基础运算符基本都一致。由于 Dart 是强数据类型，因此在 Dart 中没有 “=== ”的运算符。在 Dart 中有一些类型测试运算符，与 JavaScript 中的类型转换和 typeof 有点相似。

这里也介绍一些 Dart 中比较简洁的写法：

*   ?? 运算符，比如，t??'test' 是 t!= null ? t : 'test' 的缩写；
    
*   级联操作，允许对同一对象或者同一函数进行一系列操作，例如下面代码的 testObj 对象中有三个方法 add()、delete() 和 show()，应用级联操作可以依次进行调用。
    

    testObj.add('t')
    ..delete('d')
    ..show()
    

### 函数

从我的理解来说，两者区别不大。箭头函数、函数闭包、匿名函数、高阶函数、参数可选等基本上都一样。在 Dart 中由于是强类型，因此在声明函数的时候可以增加一个返回类型，这点在 TypeScript 中的用法是一致的，对于前端开发人员来说，没有太多的差异点。

### 类

类的概念在各种语言上大部分都是一致的，但在用法上可能存在差异，这里着重介绍一下 Dart 比较特殊的一些用法。

#### 命名构造函数

Dart 支持一个函数有多个构造函数，并且在实例化的时候可以选择不同的构造函数。

下面的代码声明了一个 Dog 类，类中有一个 color 变量属性和两个构造函数。red 构造函数设置 Dog 类的 color 属性为 red，black 构造函数设置 Dog 类的 color 属性为 black。最后在 main 函数中分别用两个构造函数创建两个实例，并分别打印实例的 color 属性。

    class Dog {
      String color;
      Dog.red(){
        this.color = 'red';
      }
    
      Dog.black(){
        this.color = 'black';
      }
    }
    void main(List<String> args) {
      Dog redDog = new Dog.red();
      print(redDog.color);
    
      Dog blackDog = new Dog.black();
      print(blackDog.color);
    }
    

运行代码后输出了两种颜色，即 red 和 black。就代码而言，我们可以应用同一个类不同的构造函数实现类不同场景下的实例化。

#### 访问控制

默认情况下都是 public，如果需要设置为私有属性，则在方法或者属性前使用 “\_”。

#### 抽象类和泛型类

抽象类和其他语言的抽象类概念一样，这里在 JavaScript 中没有这种概念，因此这里稍微提及一下，主要是实现一个类被用于其他子类继承，抽象类是无法实例化的。

下面的代码使用关键词 abstract 声明了一个有攻击性的武器抽象类，包含一个攻击函数和一个伤害力获取函数，Gun 和 BowAndArrow 都是继承抽象类，并需要实现抽象类中的方法。

    abstract class AggressiveArms {
      attack();
      hurt()；
    }
    class Gun extends AggressiveArms {
      attack() {
        print("造成100点伤害");
      }
      hurt() {
        print("可以造成100点伤害");
      }
    }
    class BowAndArrow extends AggressiveArms {
      attack() {
        print("造成20点伤害");
      }
      hurt() {
        print("可以造成20点伤害");
      }
    }
    

泛型类，主要在不确定返回数据结构时使用，这点与 TypeScript 中的泛型概念一样。

在下面的代码中，我们不确定数组中存储的类型是 int 还是 string，又或者是 bool，这时候可以使用泛型 来表示。在使用泛型类的时候可以将设定为自己需要的类型，比如下面的 string 调用和 int 调用。

    class Array<T> {
      List _list = new List<T>();
      Array();
      void add<T>(T value) {
        this._list.add(value);
      }
      get value{
        return this._list;
      }
    }
    void main(List<String> args) {
      Array arr = new Array<String>();
      arr.add('aa');
      arr.add('bb');
      print(arr.value);
    
    
      Array arr2 = new Array<int>();
      arr2.add(1);
      arr2.add(2);
      print(arr2.value);
    }
    

### 库与调用

#### Dart 库管理

Dart 和 JavaScript 一样，有一个库管理资源（[pub.dev](http://pub.dev)）。你可以在这里搜索找到你想要的一些库，接下来只要在 Dart 的配置文件 pubspec.yaml 中增加该库即可。这点类似于在 JavaScript 的 package.json 中增加声明一样，同样也有 dependencies 和 dev\_dependencies。

增加类似的数据配置，如下代码：

    dependencies:
      cupertino_icons: ^0.1.2
      dio: ^3.0.4
      image_test_utils: ^1.0.0
    dev_dependencies:
      flutter_test:
        sdk: flutter
    

#### 开发 Dart 库

Dart 也支持开发者自己开发一些库，并且发布到 pub.dev 上，这点基本上和 npm 管理一致，这里我只介绍 pub.dev 库的基本格式。

    dart_string_manip
    ├── example
    |  └── main.dart
    ├── lib
    |  ├── dart_string_manip.dart
    |  └── src
    |     ├── classes.dart
    |     └── functions.dart
    ├── .gitignore
    ├── .packages
    ├── LICENSE
    ├── README.md
    ├── pubspec.lock
    └── pubspec.yaml
    

对于前端开发人员来说，这个结构和我们所看到的 npm 模块很相似，pubspec 和 package 很相似，核心是 lib 中的库名对应的库文件 .dart，该文件是一个 dart 类。类的概念上面已经介绍过了，将私有方法使用 "\_" 保护，其他就可以被引用该库的模块调用，如果是自身库的一些实现逻辑，可以放在 src 中。

开发完成该库以后，如果需要发布到 pub.dev，则可以参照[官网的说明](https://flutter.dev/docs/development/packages-and-plugins/developing-packages)，按步骤进行即可。

#### Dart 调用库

这里引入库的方式也与 ES6 的 import 语法很相似。先看看下面的一个例子，其目的是引入 pages 下的 homepage.dart 模块。

    import 'package:startup_namer/pages/homepage.dart';
    

在上面的例子中，import 为关键词，package 为协议，可以使用 http 的方式，不过最好使用本地 package 方式，避免性能受影响。接下来的 startup\_namer 为库名或者说是该项目名，pages 为 lib 下的一个文件夹，homepage.dart 则为具体需要引入的库文件名。

当然这里也可以使用相对路径的方式，不过建议使用 package 的方式，以保持整个项目代码的一致性，因为对于第三方模块则必须使用 package 的方式。

### 总结

本课时首先介绍了 Dart 基础数据类型、基础运算符、类以及库与调用。然后通过对比 JavaScript 的一些特殊差异性，来加深前端开发人员对 Dart 语言编程的理解。相信你通过本课时的学习，可以掌握 Dart 的编程，并且能够写一些 Dart 的第三方库。

下一课时，我将介绍 Dart 的事件循环机制，掌握了其核心运行机制原理，才能编写出更高效、更有质量的代码。

点击这里下载本课时源码，Flutter 专栏，源码地址：[https://github.com/love-flutter/flutter-column](https://github.com/love-flutter/flutter-column)