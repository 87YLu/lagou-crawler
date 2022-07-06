这一讲给你带来了一个**网络调试工具——Wireshark**。Wireshark 是世界上应用最广泛的网络协议分析器，它让我们在微观层面上看到整个网络正在发生的事情。

Wireshark 本身是一个开源项目，所以也得到了很多志愿者的支持。同时，Wireshark 具有丰富的功能集，包括：

1.  深入检查数百个协议，并不断添加更多协议；
    
2.  实时捕获和离线分析；
    
3.  支持 Windows、Linux、macOS、Solaris、FreeBSD、NetBSD，以及许多其他平台；
    
4.  提供 GUI 浏览，也可以通过 TTY；
    
5.  支持 VOIP；
    
6.  支持 Gzip；
    
7.  支持 IPSec。
    
8.  ……
    

是不是觉得Wireshark非常强大？无论你从事哪种开发工作，它都可以帮到你，因此也是面试经常考察的内容。**比如本讲关联的面试题：如何进行 TCP 抓包和调试**？下面请你带着问题，开始今天的学习吧。

_注：你可以到 Wireshark 的主页：_[https://www.wireshark.org/download.html](https://www.wireshark.org/download.html?fileGuid=xxQTRXtVcqtHK6j8)_下载 Wireshark。_

如果你是一个黑客、网络安全工程师，或者你的服务总是不稳定，就需要排查，那么你会如何 hack 这些网络连接、网络接口以及分析网络接口的封包呢？

### 接口列表

Whireshark 可以帮你看到整个网络交通情况，也可以帮你深入了解每个封包。而且 Whireshark 在 macOS、Linux、Windows 上的操作都是一致的，打开 Wireshark 会先看到如下图所示的一个选择网络接口的界面。

![Drawing 0.png](https://s0.lgstatic.com/i/image6/M00/3D/40/Cgp9HWCTpVWAMmCIAACa-Lf3Ezk286.png)

我们要做的第一件事情就是**选择一个网络接口**（**Network Interface**）。Linux 下可以使用`ifconfig`指令看到所有的网络接口，Windows 下则使用 ipconfig。可以看到，上图中有很多网络接口，目前我教学这台机器上，连接路由器的接口是**以太网 2**。另外可以看到，我的机器上还有`VMware`的虚拟网络接口（你的机器可能和我的机器显示的不一样）。

### 开启捕获功能

选择好接口之后，点击左上角的按钮就可以开启捕获，开启后看到的是一个个数据条目。

因为整个网络的数据非常多，大量的应用都在使用网络，你会看到非常多数据条目，每个条目是一次数据的发送或者接收。如下图所示：

![Drawing 1.png](https://s0.lgstatic.com/i/image6/M00/3D/49/CioPOWCTpV-AAY9XAAFmcX9uc-U085.png)

以下是具体捕获到的内容：

![Drawing 2.png](https://s0.lgstatic.com/i/image6/M00/3D/40/Cgp9HWCTpWWAdQPSAAHJ-HWaYz0586.png)

*   序号（No.）是 Wireshark 分配的一个从捕获开始的编号。
    
*   时间（Time）是从捕获开始过去的时间戳，具体可以在视图中设置，比如可以设置成中文的年月日等。这里有很多配置需要你自己摸索一下，我就不详细介绍了。
    
*   源地址和目标地址（Source 和 Destination）是 IP 协议，注意这里有 IPv6 的地址，也有 IPV4 的地址。
    
*   协议可能有很多种，比如 TCP/UDP/ICMP 等，ICMP 是 IP 协议之上搭建的一个消息控制协议（Internet Control Message Protocol），比如 Ping 用的就是 ICMP；还有 ARP 协议（Address Resolution Protocol）用来在局域网广播自己的 MAC 地址。
    
*   Length 是消息的长度（Bytes）。
    
*   Info 是根据不同协议显示的数据，比如你可以看到在TCP 协议上看到Seq 和 ACK。这里的 Seq 和 ACK 已经简化过了，正常情况下是一个大随机数，Whireshark 帮你共同减去了一个初始值。
    

### 观察 TCP 协议

如果你具体选择一个 TCP 协议的捕获，可以看到如下图所示的内容：

![Drawing 3.png](https://s0.lgstatic.com/i/image6/M00/3D/49/CioPOWCTpXCAQhhpAAA9Uqsah2A016.png)

然后在这下面可以观察到详情内容：

![Drawing 4.png](https://s0.lgstatic.com/i/image6/M00/3D/40/Cgp9HWCTpXeAGJAjAADSD8vKBNo956.png)

我们可以从不同的层面来看这次捕获。从传输层看是 TCP 段；从网络层来看是 IP 封包；从链路层来看是 Frame。

点开不同层面观察这个 TCP 段，就可以获得对它更具体的认识，例如下图是从 TCP 层面理解这次捕获：

![Drawing 5.png](https://s0.lgstatic.com/i/image6/M00/3D/40/Cgp9HWCTpYGAGGQaAAE4PBKz5m0260.png)

你可以看到这次捕获是一次 ACK（见 Flags）字段，从端口 58260 发往 443，那么大概率是 HTTPS 客户端给服务器的响应。

### 消息视图

如果你选中一条消息，下面会出现一个消息视图。还有一个二进制视图。二进制视图里面是数据的二进制形式，消息视图是对二进制形式的解读。

Whireshark 追溯的是最底层网卡传输的 Frame（帧），可以追溯到数据链路层。因此对二进制形式的解读，也就是我们的消息视图也要分层。因为对于同样的数据，不同层的解读是不同的。

*   最上面是 Frame 数据，主要是关注数据的收发时间和大小。
    
*   接着是数据链路层数据，关注的是设备间的传递。你可以在这里看到源 MAC 地址和目标 MAC 地址。
    
*   然后是网络层数据，IP 层数据。这里有 IP 地址（源 IP 地址和目标 IP 地址）；也有头部的 Checksum（用来纠错的）。这里就不一一介绍了，你可以回到“[06 | IPv4 协议：路由和寻址的区别是什么？](https://kaiwu.lagou.com/course/courseInfo.htm?courseId=837#/detail/pc?id=7271&fileGuid=xxQTRXtVcqtHK6j8)”复习这块内容。
    
*   最下面是传输层数据。 也就是 TCP 协议。关注的是源端口，目标端口，Seq、ACK 等。
    
*   有的传输层上还有一个 TLS 协议，这是因为用 HTTPS 请求了数据。TLS 也是传输层。TLS 是建立在 TCP 之上，复用了 TCP 的逻辑。
    

### 观察 HTTP 协议

Wireshark 还可以用来观察其他的协议，比如说 HTTP 协议，下图是对 HTTP 协议的一次捕获：

![Drawing 6.png](https://s0.lgstatic.com/i/image6/M00/3D/40/Cgp9HWCTpY2AEOKnAAE6yRKPJBg745.png)

可以看到，Wireshark 不仅仅捕获了应用层，还可以看到这次 HTTP 捕获对应的传输层、网络层和链路层数据。

### 过滤和筛选

Wireshark 还提供了捕获的过滤，我们只需要输入过滤条件，就可以只看符合条件的捕获。

比如我们想分析一次到百度的握手。首先开启捕获，然后在浏览器输入百度的网址，最后通过`ping`指令看下百度的 IP 地址，如下图所示：

![Drawing 7.png](https://s0.lgstatic.com/i/image6/M00/3D/40/Cgp9HWCTpZWAM_ZDAACDEGeqkD4822.png)

看到IP 地址之后，我们在 Wireshark 中输入表达式，如下图所示：

![Drawing 8.png](https://s0.lgstatic.com/i/image6/M00/3D/49/CioPOWCTpZuAdqvyAAJKx2ztVfs457.png)

这样看到的就是和百度关联的所有连接。上图中刚好是一次从建立 TCP 连接（3 次握手），到 HTTPS 协议传输握手的完整过程。你可以只看从`192.168.1.5`到`14.215.177.39`的请求。

首先是从客户端（`192.168.1.5`）发出的 SYN 和百度返回的 SYN-ACK，如下图所示：

![Drawing 9.png](https://s0.lgstatic.com/i/image6/M00/3D/40/Cgp9HWCTpaSAVVd3AACrCY_TI9w061.png)

然后是客户端返回给百度一个 ACK：

![Drawing 10.png](https://s0.lgstatic.com/i/image6/M00/3D/40/Cgp9HWCTpaqAc4GfAAA15zGZlCA421.png)

接下来是 HTTPS 协议开始工作（开始握手）：

![Drawing 11.png](https://s0.lgstatic.com/i/image6/M00/3D/49/CioPOWCTpa-AKOziAABRvFiPr0Q242.png)

可以看到 HTTPS 协议通过 TLSv1.2 发送了 Client Hello 到服务端。接下来是 Server 返回给客户端 ACK，然后再发送给客户端一个 Server Hello：

![Drawing 12.png](https://s0.lgstatic.com/i/image6/M00/3D/49/CioPOWCTpbWARjykAAA7-AoCxcc618.png)  
![Drawing 13.png](https://s0.lgstatic.com/i/image6/M00/3D/40/Cgp9HWCTpbuAcAuCAAA17DK_mn8422.png)

之后百度回传了证书：

![Drawing 14.png](https://s0.lgstatic.com/i/image6/M01/3D/49/CioPOWCTpcCAZ1NdAABB_oCh1OM046.png)

最后开始交换密钥，直到 HTTPS 握手结束：

![Drawing 15.png](https://s0.lgstatic.com/i/image6/M00/3D/40/Cgp9HWCTpcaAEOyoAAD6xEQthA8678.png)

### 报文颜色

在抓包过程中，黑色报文代表各类报文错误；红色代表出现异常；其他颜色代表正常传输。

![Drawing 16.png](https://s0.lgstatic.com/i/image6/M01/3D/40/Cgp9HWCTpcyAFfC8AAHgGuq9ECI016.png)

### 总结

在本讲，我对 Wireshark 做了一次开箱教学，希望你听完我的课程后，在自己的机器中也安装一个这个工具，以备不时之需。

Wireshark 是个强大的工具，支持大量的协议。还有很多关于 Wireshark 的能力，希望你可以进一步探索，如下图中鼠标右键一次捕获，可以看到很多选项，都是可以深挖的。

![Drawing 17.png](https://s0.lgstatic.com/i/image6/M01/3D/49/CioPOWCTpdOATgr1AADfReXfTIc663.png)

那么现在你可以尝试来回答我在本讲开头提出的问题：如何进行 TCP 抓包？

答案就是用工具，例如 Wireshark。

### 思考题

**最后给你留一道实战题目：请你用自己最熟悉的语言，写一个 UDP 连接程序，然后用 Wireshark 抓包**。

我建议你自己真正实际操作一遍，检验一下自己的学习成果。如果你对本次课程有什么建议和疑问，可以在评论区留言。如果你有所收获，也可以推荐给你的朋友。

这一讲就到这里，发现求知的乐趣，我是林䭽。感谢你学习本次课程，下一讲是模块二思考题解答，希望你自己完成题目后再来看答案和分析。再见！