上节课介绍了 Dart 基础数据类型、基础运算符、类以及库与调用。本课时着重通过实践带你掌握 Dart 的运行原理。

### Dart 单线程

单线程在流畅性方面有一定安全保障，这点在 JavaScript 中存在类似的机制原理，其核心是分为主线程、微任务和宏任务。主线程执行主业务逻辑，网络 I/O 、本地文件 I/O 、异步事件等相关任务事件，应用事件驱动方式来执行。在 Dart 中同样是单线程执行，其次也包含了两个事件队列，一个是微任务事件队列，一个是事件队列。

*   微任务队列
    

微任务队列包含有 Dart 内部的微任务，主要是通过 scheduleMicrotask 来调度。

*   事件队列
    

事件队列包含外部事件，例如 I/O 、 Timer ，绘制事件等等。

#### 事件循环

既然 Dart 包含了微任务和事件任务，那么这两个任务之间是如何进行循环执行的呢？我们可以先看下 Dart 执行的逻辑过程（如图 1）：

1.  首先是执行 main 函数，并生产两个相应的微任务和事件任务队列；
    
2.  判断是否存在微任务，有则执行，执行完成后再继续判断是否还存在微任务，无则判断是否存在事件任务；
    
3.  如果没有可执行的微任务，则判断是否存在事件任务，有则执行，无则继续返回判断是否还存在微任务；
    
4.  在微任务和事件任务执行过程中，同样会产生微任务和事件任务，因此需要再次判断是否需要插入微任务队列和事件任务队列。
    

![Drawing 0.png](https://s0.lgstatic.com/i/image/M00/1D/7D/Ciqc1F7h_D2ARi2aAAJ2G36y8Ng725.png)

图 1 Dart 事件循环机制

为了验证上面的运行原理，我实现了下面的示例代码，首先 import async 库，然后在 main 函数中首先打印 flow start ，接下来执行一个微任务事件，再执行一个事件任务，最后再打印 flow end 。

    import 'dart:async';
    void main() {
    	print('flow start'); // 执行打印开始 
    	// 执行判断为事件任务，添加到事件任务队列
    	Timer.run((){ 
           print('event'); // 执行事件任务，打印标记
       	});
       	// 执行判断为微任务，添加到微任务队列 
    	scheduleMicrotask((){ 
            print('microtask'); // 执行微任务，打印标记
        });
    	print('flow end'); // 打印结束标记
    }
    

使用 Dart 运行如上命令。

    dart flow.dart
    

代码的实际运行过程如下：

*   首先主线程逻辑，执行打印 start ；
    
*   执行 Timer，为事件任务，将其增加到事件任务队列中；
    
*   执行 scheduleMicrotask，为微任务队列，将其增加到微任务队列中；
    
*   执行打印 flow end；
    
*   判断是否存在微任务队列，存在则执行微任务队列，打印 mcrotask；
    
*   判断是否还存在微任务队列，无则判断是否存在事件任务队列，存在执行事件任务队列，打印 event。
    

    flow start
    flow end
    microtask
    event
    

为了更清晰描述，可以我们使用图 2 动画来演示。

![flutter-flow-new.gif](https://s0.lgstatic.com/i/image/M00/1D/8A/CgqCHl7h_RmAFXa9AAnXFc-CvdQ552.gif)

图 2 Dart 主线程运行逻辑

介绍完 Dart 的运行原理，你可能会产生以下疑问。

**疑问1，为什么事件任务都执行完成了，还需要继续再循环判断是否有微任务？**

核心解释是：微任务在执行过程中，也会产生新的事件任务，事件任务在执行过程中也会产生新的微任务。产生的新微任务，按照执行流程，需要根据队列方式插入到任务队列最后。

我们通过代码来看下该过程。下面一段代码， import async 库，第一步打印 start ， 然后执行一个事件任务，在事件任务中打印 event 。接下来增加了一个微任务事件，在微任务事件中打印 microtask in event 。第二步执行微任务事件，在微任务事件中打印 microtask ，并且在其中增加事件任务队列，事件任务队列中打印 event in microtask ，最后再打印 flow end 。

    import 'dart:async';
    void main() {
    	print('flow start'); // 执行打印开始
        // 执行判断为事件任务，添加到事件任务队列
    	Timer.run((){ 
           	print('event'); // 执行事件任务，打印事件任务标记
            // 执行判断为微任务，添加到微任务队列 
           	scheduleMicrotask((){ 
            	print('microtask in event'); // 执行微任务，打印微任务标记
        	});
       	});
      // 执行判断为微任务，添加到微任务队列 
    	scheduleMicrotask((){ 
            print('microtask'); // 执行微任务，打印微任务执行标记
            // 执行判断为事件任务，添加到事件任务队列 
            Timer.run((){ 
            	print('event in microtask'); // 执行事件任务，打印事件任务标记
            });
        });
    	print('flow end'); // 打印结束标记
    }
    

使用 Dart 运行如上命令。

    dart event_with_microtask.dart
    

代码的实际运行过程如下：

*   首先还是依次执行打印 flow start ；
    
*   执行 Timer 为事件任务，添加事件任务队列中；
    
*   执行 scheduleMicrotask 为微任务，添加到微任务队列中；
    
*   打印 end ；
    
*   执行微任务队列，打印 microtask ，其中包括了事件任务，将事件任务插入到事件任务中；
    
*   执行事件任务队列，打印 event ，其中包括了微任务，将微任务插入到微任务队列中；
    
*   微任务队列存在微任务，执行微任务队列，打印 microtask in event；
    
*   微任务队列为空，存在事件任务队列，执行事件任务队列，打印 event in microtask；
    

根据如上的运行过程，我们可以得出以下的一个运行结果，这点可以通过运行 Dart 命令得到实际的验证。

    flow start
    flow end
    microtask
    event
    microtask in event
    event in microtask
    

为了更形象来描述，我使用图 3 动画来演示。

![image](https://s0.lgstatic.com/i/image/M00/21/33/Ciqc1F7p3BCAAutpABeCx2dZvOo916.gif)

图 3 多微任务和事件任务执行流程

一句话概括上面的实践运行结果：每次运行完一个事件后，都会判断微任务和事件任务，在两者都存在时，优先执行完微任务，只有微任务队列没有其他的任务了才会执行事件任务。

**疑问2，Dart 运行过程中是否会被事件运行卡住？**

答案是会，比如在运行某个微任务，该微任务非常的耗时，会导致其他微任务和事件任务卡住，从而影响到一些实际运行，这里我们可以看如下例子：

    import 'dart:async';
    void main() {
    	print('flow start');  // 执行打印开始
      // 执行判断为事件任务，添加到事件任务队列
    	Timer.run((){ 
            for(int i=0; i<1000000000; i++){ // 大循环，为了卡住事件任务执行时间，检查是否会卡住其他任务执行
              if(i == 1000000){
                // 执行判断为微任务，添加到微任务队列
                scheduleMicrotask((){ 
                    print('microtask in event'); // 执行微任务，打印微任务标记
                });
              }
            }
            print('event'); // 执行完事件任务，打印执行完事件任务标记
       	});
      // 执行判断为微任务，添加到微任务队列
    	scheduleMicrotask((){ 
            print('microtask'); // 执行微任务，打印微任务标记
            // 执行判断为事件任务，添加到事件任务队列
            Timer.run((){
            	print('event in microtask'); // 执行事件任务，打印事件任务标记
            });
        });
    	print('flow end'); // 打印结束标记
    }
    

上面这段代码和之前的唯一不同点是在执行第一个事件任务的时候，使用了一个大的 for 循环，从运行结果会看到 event in microtask 和 microtask in event 打印的时间会被 event 的执行所 block 住。从结果分析来看 Dart 中事件运行是会被卡住的，因此在日常编程的时候要特别注意，避免因为某个事件任务密集计算，导致较差的用户操作体验。

### Isolate 多线程

上面我们介绍了 Dart 是单线程的，这里说的 Dart 的单线程，其实和操作系统的线程概念是存在一定区别的， Dart 的单线程叫作 isolate 线程，**每个 isolate 线程之间是不共享内存的，通过消息机制通信。**

我们看个例子，例子是利用 Dart 的 isolate 实现多线程的方式。

    import 'dart:async';
    import 'dart:isolate';
    Isolate isolate;
    String name = 'dart';
    void main() {
    	// 执行新线程创建函数
     	isolateServer();
    }
    /// 多线程函数
    void isolateServer()async{
    	// 创建新的线程，并且执行回调 changName 
    	final receive = ReceivePort();
    	isolate = await Isolate.spawn(changName, receive.sendPort);
    	// 监听线程返回信息 
    	receive.listen((data){
    		print("Myname is $data"); // 打印线程返回的数据
    		print("Myname is $name"); // 打印全局 name 的数据
    	});
    }
    /// 线程回调处理函数
    void changName(SendPort port){
    	name = 'dart isloate'; // 修改当前全局 name 属性
    	port.send(name); // 将当前name发送给监听方
    	print("Myname is $name in isloate"); // 打印当前线程中的 name
    }
    

使用 Dart 运行如上命令。

    dart isolate.dart
    

以上代码的执行运行流程如下：

*   import 对应的库；
    
*   声明两个变量，一个是 isolate 对象，一个是字符串类型的 name；
    
*   执行 main 函数，main 函数中执行 isolateServer 异步函数；
    
*   isolateServer 中创建了一个 isolate 线程，创建线程时候，可以传递接受回调的函数 changName；
    
*   在 changName 中修改当前的全局变量 name ，并且发送消息给到接收的端口，并且打印该线程中的 name 属性；
    
*   isolateServer 接收消息，接收消息后打印返回的数据和当前 name 变量。
    

根据如上执行过程，可以得出如下的运行结果。

    Myname is dart isolate in isolate
    Myname is dart isolate
    Myname is dart
    

从运行结果中，可以看到新的线程修改了全局的 name，并且通过消息发送返回到主线程中。而主线程的 name 属性并没有因为创建的新线程中的 name 属性的修改而发生改变，这也印证了内存隔离这点。

### 综合示例

了解完以上知识点后，我再从一个实际的例子进行综合的分析，让你进一步巩固对 Dart 运行原理的掌握。

假设一个项目，需要 2 个团队去完成，团队中包含多项任务。可以分为 2 个高优先级任务（高优先级的其中，会产生 2 个任务，一个是紧急一个是不紧急），和 2 个非高优先级任务（非高优先级的其中，会产生有 2 个任务，一个是紧急一个是不紧急）。其中还有一个是必须依赖其他团队去做的，因为本团队没有那方面的资源，第三方也会产生一个高优先级任务和一个低优先级任务。

根据以上假设，我们可以用表 1 任务划分来表示：

**主任务**

**高优先级任务（微任务）**

**低优先级任务（事件任务）**

**第三方任务（isolate）**

H1

h1-1

l1-1

否

H2

h2-1

l2-1

否

L3

h3-1

l3-1

否

L4

h4-1

l4-1

否

C5

ch5-1

cl5-1

是

表1 项目任务划分详情

然后我们按照 Dart 语言执行方式去安排这个项目的开发工作，我们看看安排的工作到底会是怎么样执行流程，代码实现方式如下。

    import 'dart:async';
    import 'dart:isolate';
    Isolate isolate;
    void main() {
    	print('project start'); // 打印项目启动标记
    	ctask(); // 分配并执行 C 任务
    	// 大循环，等待
    	//for(int i=0; i<1000000000; i++){
    	//}
    	// 执行判断为微任务，添加到微任务队列
    	scheduleMicrotask((){
    		// 执行判断为微任务，添加到微任务队列
    		scheduleMicrotask((){
    			print('h1-1 task complete'); // 执行微任务，并打印微任务优先级h1-1
    		});
    		// 执行判断为事件任务，添加到事件任务队列
    		Timer.run((){
            	print('l1-1 task complete'); // 执行事件任务，并打印事件任务优先级l1-1
            });
            print('H1 task complete'); // 打印H1微任务执行标记
    	});
    	// 执行判断为微任务，添加到微任务队列
    	scheduleMicrotask((){
    		// 执行判断为微任务，添加到微任务队列
    		scheduleMicrotask((){
    			print('h2-1 task complete'); // 执行微任务，并打印微任务优先级h2-1
    		});
    		// 执行判断为事件任务，添加到事件任务队列
    		Timer.run((){
            	print('l2-1 task complete'); // 执行事件任务，并打印事件任务优先级l2-1
            });
            print('H2 task complete'); // 打印H2微任务执行标记
    	});
    	// 执行判断为事件任务，添加到事件任务队列
    	Timer.run((){
    		// 执行判断为微任务，添加到微任务队列
    		scheduleMicrotask((){
    			print('h3-1 task complete'); // 执行微任务，并打印微任务优先级h3-1
    		});
    		// 执行判断为事件任务，添加到事件任务队列
    		Timer.run((){
            	print('l3-1 task complete'); // 执行事件任务，并打印事件任务优先级l3-1
            });
    		print('L3 task complete'); // 打印L3事件任务执行标记
        });
    	
    	// 执行判断为事件任务，添加到事件任务队列
    	Timer.run((){
    		// 执行判断为微任务，添加到微任务队列
    		scheduleMicrotask((){
    			print('h4-1 task complete'); // 执行微任务，并打印微任务优先级h4-1
    		});
    		// 执行判断为事件任务，添加到事件任务队列
    		Timer.run((){
            	print('l4-1 task complete'); // 执行事件任务，并打印事件任务优先级l4-1
            });
    		print('L4 task complete'); // 打印L4事件任务执行标记
        });
    }
    /// C 任务具体代码，创建新的线程，并监听线程返回数据 
    void ctask()async{
    	final receive = ReceivePort();
    	isolate = await Isolate.spawn(doCtask, receive.sendPort);
    	receive.listen((data){
            print(data);
    	});
    }
    /// 创建的新线程，具体执行的任务代码
    void doCtask(SendPort port){
    	// 执行判断为微任务，添加到微任务队列
    	scheduleMicrotask((){
    		print('ch5-1 task complete'); // 执行微任务，并打印微任务优先级ch5-1 
    	});
    	// 执行判断为事件任务，添加到事件任务队列
    	Timer.run((){
            print('cl5-1 task complete'); // 打印cl5-1事件任务执行标记
        });
    	port.send('C1 task complete'); // 打印 C 任务执行标记
    }
    

使用 Dart 运行如上命令。

    dart isolate.dart
    

我们先来看下，上面代码的运行结果。

    project start
    H1 task complete
    H2 task complete
    h1-1 task complete
    h2-1 task complete
    L3 task complete
    h3-1 task complete
    L4 task complete
    h4-1 task complete
    l1-1 task complete
    l2-1 task complete
    l3-1 task complete
    l4-1 task complete
    ch5-1 task complete
    cl5-1 task complete
    C1 task complete
    

H 和 L 的运行原理，希望你用上面我所讲到的知识点，去一步步分析，可以像我们图 2 或者图 3 的方法，画两个队列，然后逐步去分析。  
上面的运行结果中，非 C 任务的运行原理留给你自己去分析，这里我着重介绍下为什么 C 的任务一直在最后才完成。

由于 C 任务是由其他线程执行，因此这里存在一定的时间去创建线程。创建线程完成后，才会进行回调，回调后才会将相应的回调事件插入到事件任务队列中。因此 C1 task complete 会在最后的一个事件任务中执行。而 ch5-1 task complete 和 cl5-1 task complete 由于需要等线程创建完成才能执行，因此执行也在后面。为了验证上面的结论，我们在 ctask() 后面增加一段耗 CPU 计算的代码，让新的线程执行快于当前的主线程。

        print('project start');
    	ctask();
    	for(int i=0; i<1000000000; i++){
    	}
    

在运行代码后，你将看到这样的结果：

    project start
    ch5-1 task complete
    cl5-1 task complete
    H1 task complete
    H2 task complete
    h1-1 task complete
    h2-1 task complete
    C1 task complete
    L3 task complete
    h3-1 task complete
    L4 task complete
    h4-1 task complete
    l1-1 task complete
    l2-1 task complete
    l3-1 task complete
    l4-1 task complete
    

首先就输出了 C 线程中的微任务和事件任务，C 任务完成后，向主线程的事件任务中插入事件任务。由于主线程还没有运行结束，接下来运行后会产生微任务和事件任务，由于 C 回调的事件任务最先插入，因此在事件任务中最先执行，但是会慢于微任务事件的执行。

### 总结

本课时首先介绍了 Dart 中单线程两个概念微任务事件队列和事件任务队列，并通过实践代码运行来介绍 Dart 事件循环方式。其次介绍了在 Dart 中应用 isolate 实现多线程的方式。最后使用一个实际的例子，来练习掌握 Dart 运行原理。在综合例子里还涉及了多线程中微任务和事件任务的调度方式。

学完本课时，你需要掌握其单线程中微任务队列和事件任务队列的调度方式，其次知道线程创建需要处理时间，以及线程事件执行完成后的回调是一个事件任务，这样就可以掌握其整体的运行原理了。如果你还有其他困惑，可以在下方留言或加入学习交流群。

以上就是本课时的主要内容，下一课时，我将用“三步法”带你掌握 Flutter ，并开始你的第一个应用，这也是我们即将开始实际的代码编程的第一步。

点击这里下载本课时源码，Flutter 专栏，源码地址：[https://github.com/love-flutter/flutter-column](https://github.com/love-flutter/flutter-column)