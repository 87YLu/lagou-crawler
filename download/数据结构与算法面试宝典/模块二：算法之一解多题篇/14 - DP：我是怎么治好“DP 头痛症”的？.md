动态规划（Dynamic Programming，DP）是求解决策过程最优化的过程，通过把原问题分解为相对简单的子问题的方式求解复杂问题，在数学、管理科学、计算机科学、经济学和生物信息学等领域被广泛使用。

它的基本思想非常简单，若要求解一个给定问题，我们需要求解其不同部分（即**子问题**），再根据**子问题的解得出原问题的解**。

通常许多子问题非常相似，为了减少计算量，**动态规划法试图每个子问题仅解决一次**，一旦算出某个给定**子问题的解，则将其记忆化存储**，以便下次求解同一个子问题解时可以直接查表。因此具有天然剪枝的功能。

### DP 题目的特点

首先我们一起来看一下，什么样的题目可能需要使用动态规划。一般而言（并不绝对），如果题目如出现以下特点，你就可以考虑（有一定概率）使用动态规划。

**特点一：计数**

*   题目问：有**多少种**方法？有**多少种**走法？
    
*   关键字：**多少**！
    

**特点二：最大值/最小值**

*   题目问：某种选择的最大值是什么？完成任务的最小时间是什么？数组的最长子序列是什么？达到目标最少操作多少次等。
    
*   关键字：**最！**
    

**特点三：可能性**

*   题目问：是否有可能出现某种情况？是否有可能在游戏中胜出？是否可以取出 k 个数满足条件？
    
*   关键字：**是否**！
    

通常而言，看到这三类题目，就可以尝试往 DP 解法上靠。

### DP 的 6 步破题法

找到题目的特点，确定可以使用 DP 之后，接下来就可以准备逐步破题了。

下面我们以一道题目为例，详细介绍破解 DP 问题的思考过程与解题步骤。其实这道题不难，我相信你们都见过，不过我还是希望你能跟着我的思维重新再思考一遍。

【**题目**】给定不同面额的硬币 coins 和一个总金额 amount，需要你编写一个函数计算可以凑成总金额所需的最少的硬币个数。如果没有任何一种硬币组合能组成总金额，则返回 -1。你可以认为每种硬币的数量是无限的。

输入：coins = \[1, 2, 5\]，amount = 11

输出：3

解释：11 元可以拆分为 5 + 5 + 1，这是最少的硬币数目。

【**分析**】首先我们看到关键字“**最少**”，因此可以尝试往 DP 上面想。在 DP 问题上，很多人都存在一个思维误区，这里我们称为**误区 1**：

> 利用 DP 求解问题时，一开始就去想第一步具体做什么！

你之所以没有思路，往往是因为采用了一种顺应题意的方法去求解问题。比如题目问：

> 如何求“最少步数”，你就去想“从头开始怎么走”；  
> 如何选择可以“达到最大收益”，你就真的开始去想“怎么选择”。

这恰恰是 DP 题目给你下的一个“套”，这样思考很容易带你陷入暴力求解的方法，找不到优化的思路。因此，**千万不要从第一步开始思考**。就这道题而言，就是不要去想，我的第一个硬币怎么选！

那么我们应该从哪里着手呢？答案是：**最后一步**！

#### 1\. 最后一步

以这道题为例，最后一步指的是：兑换硬币的时候，假设每一步操作总是选择一个硬币，那么我们看一下最后一步如何达到 amount？

以给定的输入为例：

> coins = \[1, 2, 5\], amount = 11

最后一步可以通过以下 3 个选项得到：

*   已经用硬币兑换好了 10 元，再添加 1 个 1 元的硬币，凑成 11 元；
    
*   已经用硬币兑换好了 9 元，再添加 1 个 2 元的硬币，凑成 11 元；
    
*   已经用硬币兑换好了 6 元，再添加 1 个 5 元的硬币，凑成 11 元。
    

接下来，应该立即将以上 3 个选项中的**未知项**展开成**子问题**！

注意：如果你找的最后一步，待处理的问题规模仍然没有减小，那么说明你只找到了**原始问题的等价问题**，并没有找到真正的最后一步。

#### 2\. 子问题

拿到 3 个选项之后，你可能会想：\[10元，9元，6元\] 是如何得到？到此时，一定**不要尝试递归**地去求解 10 元、9 元、6 元，正确的做法是将它们表达为 3 个子问题：

*   如何利用最少的硬币组成 10 元？
    
*   如何利用最少的硬币组成 9 元？
    
*   如何利用最少的硬币组成 6 元？
    

我们原来的问题是，如何用最少的硬币组成 11 元。

不难发现，如果用 f(x) 表示如何利用最少的硬币组成 x 元，就可以用 f(x) 将原问题与 3 个子问题统一起来，得到如下内容：

*   原问题表达为 f(11)；
    
*   3 个子问题分别表达为 f(10)、f(9)、f(6)。
    

接下来我们再利用 f(x) 表示**最后一步**的 3 个选项：

*   f(10) + 1 个 1 元得到 f(11)；
    
*   f(9) + 1 个 2 元得到 f(11)；
    
*   f(6) + 1 个 5 元得到 f(11)。
    

#### 3\. 递推关系

递推关系，一般需要通过**两次替换**得到。

最后一步，可以通过 3 个选项得到。哪一个选项才是最少的步骤呢？这个时候，我们可以采用一个 min 函数来从这 3 个选项中得到最小值。

> f(11) = min(f(11-1), f(11-2), f(11-5)) + 1

接下来，**第一次替换**：只需要将 11 换成一个更普通的值，就可以得到更加通用的递推关系：

> f(x) = min(f(x-1), f(x-2), f(x-5)) + 1

当然，这里 \[1, 2, 5\] 我们依然使用的是输入示例，进行**第二次**替换：

> f(x) = min(f(x-y), y in coins) + 1

写成伪代码就是：

    f(x) = inf
    for y in coins:
        f(x) = min(f(x), f(x-y) + 1)
    

#### 4\. f(x) 的表达

接下来我们要做的就是在写代码的时候，如何表达 f(x)？

这里有一个**小窍门**。

> 直接把 f(x) 当成一个哈希函数。那么 f 就是一个 HashMap。

对于大部分 DP 题目而言，如果用 HashMap 替换 f 函数都是可以工作的。如果遇到 f(x, y) 类似的函数，就需要用 Map<Integer/_x_/, Map<Integer/_y_/, Integer>> 这种嵌套的方式来表达 f(x, y)。

**当然，有时候，用数组作为哈希函数是一种更加简单高效的做法**。具体来说：

*   如果要表达的是一维的信息，就用一维数组 dp\[\] 表示 f(x)；
    
*   如果要表达的是二维的信息，就用二维数组 dp\[\]\[\] 表示 f(x, y)
    

这就是为什么很多 DP 代码里面可以看到很多dp数组的原因。但是，现在你**要知道**：

> 用 dp\[\] 数组并不是求解 DP 问题的核心。

**因为，数组只是信息表达的一种方式。而题目总是千万变化的，有时候可能还需要使用其他数据结构来表达 f(x)、f(x, y) 这些信息**。比如：

> f(x)、f(x, y) 里面的 x, y 都不是整数怎么办？是字符串怎么办？是结构体怎么办？

当然，就这个题而言，可以发现有两个特点：

1）f(x) 中的 x 是一个整数；

2）f(x) 要表达的信息是一维信息。

那么，针对这道题而言言，我们可以使用一维数组，如下所示：

    int[] dp = new int[amount + 1];
    

数组下标 i 表示 x，而数组元素的值 dp\[i\] 就表示 f(x)。

那么递推关系可以表示如下：

    dp[x] = inf;
    for y in coins:
      dp[x] = min(dp[x], dp[x-y] + 1);
    

#### 5\. 初始条件与边界

那么，如何得到初始条件与边界呢？这里我分享一个**小技巧：** 你从问题的起始输入开始调用这个递归函数，如果递归函数出现“**不正确/无法计算/越界**”的情况，那么这就是你需要处理的初始条件和边界。

比如，如果我们去调用以下两个递归函数。

*   coinChange(0)：可以发现给定 0 元的时候，dp\[amount-x\] 会导致数组越界，因此需要**特别处理**dp\[0\]。
    
*   coinChange(-1) 或者 coinChange(-2) 的调用也是会遇到数组越界，说明这些情况都需要做**特别处理**。
    

**那么什么情况作为初始条件**？**什么情况作为边界**？答案就是：

*   如果结果本身的存放不越界，只是计算过程中出现越界，那么应该作为初始条件。比如 dp\[0\]、dp\[1\]；
    
*   如果结果本身的存放是越界的，那么需要作为边界来处理，比如 dp\[-1\]。
    

当然，就这道题而言，初始条件是 dp\[0\] = 0，因为当只有 0 元钱需要兑换的时候，应该是只需 0 个硬币。

#### 6\. 计算顺序

说来有趣，计算顺序最简单，我们只需要在初始条件的基础上使用**正向推导多走两步**可以了。比如：

> 初始条件：dp\[0\] = 0

那么接下来的示例中的输入：coins\[\] = \[1, 2, 5\]。我们已经知道 dp\[0\] = 0，再加上可以做的 3 个选项，那么可以得到：

dp\[1\] = dp\[0\] + 1 元硬币 = 1

dp\[2\] = dp\[0\] + 2 元硬币 = 1

dp\[5\] = dp\[0\] + 5 元硬币 = 1

到这里，递推关系好像还没有用到。那什么时候用呢？我们来看下面两种情况：

*   如下图所示，第一种情况，dp\[5\] 可以直接通过 dp\[0\] 得到，值为 1。
    

![Drawing 0.png](https://s0.lgstatic.com/i/image6/M00/37/60/CioPOWB2zBuAOaffAAB34BpuEyM913.png)

*   如下图所示，第二种，dp\[5\] 可以通过 dp\[3\] 得到，值为 3。
    

![Drawing 1.png](https://s0.lgstatic.com/i/image6/M00/37/60/CioPOWB2zCaAHlLsAAB8MadAE-U569.png)

此时可以发现，判断具体取哪个值时，就需要用到前面的递推关系了。

> f(x) = min(f(x-1), f(x-2), f(x-5)) + 1

我们只需要取较小的值就可以了。

【**代码**】到这里，你应该可以写出 DP 的代码了：

    class Solution
    {
      public int coinChange(int[] coins, int amount)
      {
        // 没有解的时候，设置一个较大的值
        final int INF = Integer.MAX_VALUE / 4;
        int[] dp = new int[amount + 1];
        // 一开始给所有的数设置为不可解。
        for (int i = 1; i <= amount; i++) {
          dp[i] = INF;
        }
        // DP的初始条件
        dp[0] = 0;
        for (int i = 0; i < amount; i++) {
          for (int y : coins) {
            // 注意边界的处理，不要越界
            if (y <= amount && i + y < amount + 1 && i + y >= 0) {
              // 正向推导时的递推公式!
              dp[i + y] = Math.min(dp[i + y], dp[i] + 1);
            }
          }
        }
        return dp[amount] >= INF ? -1 : dp[amount];
      }
    }
    

> 代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/322.%E9%9B%B6%E9%92%B1%E5%85%91%E6%8D%A2.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/322.%E9%9B%B6%E9%92%B1%E5%85%91%E6%8D%A2.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/322.%E9%9B%B6%E9%92%B1%E5%85%91%E6%8D%A2.py?fileGuid=xxQTRXtVcqtHK6j8)

**复杂度分析**：一共两层循环，外层需要循环 O(Amount) 次，内层需要循环 O(N) 次（如果有 N 种硬币）。那么时间复杂度为 O(Amount \* N)。由于申请了数组，那么空间复杂度为 O(Amount)。

这里我利用一个例题，深入地讲解了 DP 的破题法的几个步骤。后面我将利用这个方法带你依次切开每一道难啃的 DP 题。

这里，我再分享一个小技巧，需要注意：

> 当求最小值的时候，我们往往将不可能的情况设置为 Integer.MAX\_VALUE / 4。

因为如果设置为 Integer.MAX\_VALUE，那么一旦涉及加法，立马就溢出了，导致程序出错。所以我们尽量设置一个足够大的数，避免进行加法的时候溢出。

这里我已经将 DP 的思路整理成如下图中展示的 6 步。尽管我现在处理 DP 问题已经很熟练了，但有时候，碰到一些特别难处理的 DP 题目，依然会回到这 6 步分析法，一步一步踏踏实实地分析。

![Drawing 2.png](https://s0.lgstatic.com/i/image6/M01/37/58/Cgp9HWB2zDKAQUFhAADATI1rcXE556.png)

### DP 的分类

经过前面的讨论，我们学会了 DP 的通用解法，不过 DP 实际上还可以分成很多种类别。比如：

*   线性 DP
    
*   区间 DP
    
*   背包 DP
    
*   树形 DP
    
*   状态压缩 DP
    

在练习和准备面试的时候，多看看这些题型，对面试会很有帮助。下面我们一个一个介绍。

#### 线性 DP

我们在读书的时候，遇到的很多 DP 题目，比如最长公共子序列、最长递增子序列等，这类题目实际上都是线性 DP。不过今天我们不再介绍这类经典的 DP 题目，而是介绍一些在面试中经常出现的**线性 DP** 题目。

#### 例 1：打劫

【**题目**】你是一个专业的小偷，计划去沿街的住户家里偷盗。每间房内都藏有一定的现金，影响你偷盗的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。给定一个代表每个房屋存放金额的非负整数数组，要求你计算不触动警报装置的情况下 ，一夜之内能够偷窃到的最高金额。

输入：nums = \[1,2,3,1\]

输出：4

解释：偷窃 nums\[0\] 号房屋 （金额 = 1），然后偷窃 nums\[2\]号房屋（金额 = 3）。偷窃到的最高金额 = 1 + 3 = 4 。

【**分析**】接下来，我们就照着 DP 的 6 步分析法（千万别顺着题意去想要偷那些房间！！）。我们把思维放慢，一步一步分析。

#### 1\. 最后一步

就这道题而言，最后一步就是处理第 N-1 个房间（我们假设一共有 N 个房间，并且从 0 开始）。

那么第 N-1 个房间，有两个选项。

*   偷：如果要偷第 N-1 个房间，那么收益就是处理前 N-3 个房间之后，再偷第 N-1 房间。
    
*   不偷：那么只需要处理到第 N-2 个房间，那么收益就是处理前 N-2 个房间之后的收益。
    

#### 2\. 子问题

最后一步的 2 个选项中都有未知项，我们可以将它们展开为子问题：

*   处理完 \[0, ..., N-3\] 之后，最大收益是多少？
    
*   处理完 \[0, ..., N-2\] 之后，最大收益是多少？
    

下面我们可以统一问题的表示：

> f(x) 表示处理完 \[0, ..., x\] 这些房间之后的**最高收益**。

#### 3\. 递推关系

统一问题的表示之后，首先来表示一下最后一步：

> f(N-1) = max(f(N-2), f(N-3) + nums\[N-1\])

这里需要采用替换法，将 N-1 换为 x。可以得到：

> f(x) = max(f(x-1), f(x-2) + nums\[x\])

#### 4\. f(x) 的表达

这里 x 表示的是原数组 \[0, ..., x\] 这个区间范围。由于所有的 x 表示的区间都是从 0 开始的，所以这个区间的起始点信息没有必要保留，因此只需要保存区间端点 x。我们发现：

*   x 是个整数；
    
*   x 的范围刚好是 nums 数组的长度。
    

尽管 f(x) 可以用哈希来表示，但如果用数组来表达这个函数映射关系，更加直接和高效。因此，我们也用 dp\[\] 数组来表达 f(x)。并且利用元素 i 表示 x，可以让 i 与 nums 数组的下标对应起来。

#### 5\. 初始条件与边界

**初始条件**：首先我们看“**无法计算/越界**”的情况：

    dp[0] = max(dp[0-1], dp[0-2] + nums[0]); // <-- 越界!
    dp[1] = max(dp[1-1], dp[1-2] + nums[1]); // <-- 越界 
    dp[2] = max(dp[2-1], dp[2-2] + nums[2]);
    

我们发现 dp\[0\], dp\[1\] 会在计算过程中出现越界，所以需要优先处理这两项。

*   dp\[0\]：当只有 nums\[0\] 可以偷的时候，其值肯定为 max(0, nums\[0\])。
    

> 注意陷阱，有的题可能会给你的带负数值的情况，不要直接写成 nums\[0\]。

*   dp\[1\]：当有 0 号，1 号房间可以偷的时候，由于不能连续偷盗，那么只需要在 0、nums\[0\]、nums\[1\] 里面选最大值就可以了。所以 dp\[1\] = max(0, nums\[0\], nums\[1\])。
    

**边界**：要保证不能越过数组的边界！

#### 6\. 计算顺序

拿到初始条件与边界之后，只需要再多走两步，就知道代码怎么写了。接下来我们开始求解 dp\[2\], dp\[3\]。

    dp[2] = max(dp[2-1], dp[2-2] + nums[2]);
    dp[3] = max(dp[3-1], dp[3-2] + nums[3]);
    

【**代码**】利用前面分析过的初始条件和递推关系，可以写出如下代码：

    class Solution
    {
      public int rob(int[] nums)
      {
        final int N = nums == null ? 0 : nums.length;
        if (N <= 0) {
          return 0;
        }
        int[] dp = new int[N];
        dp[0] = Math.max(0, nums[0]);
        if (N == 1) {
          return dp[0];
        }
        dp[1] = Math.max(0, Math.max(nums[0], nums[1]));
        for (int i = 2; i < N; i++) {
          dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
        }
        return dp[N - 1];
      }
    }
    

> 代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/198.%E6%89%93%E5%AE%B6%E5%8A%AB%E8%88%8D.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/198.%E6%89%93%E5%AE%B6%E5%8A%AB%E8%88%8D.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/198.%E6%89%93%E5%AE%B6%E5%8A%AB%E8%88%8D.py?fileGuid=xxQTRXtVcqtHK6j8)

**复杂度分析**：时间复杂度 O(N)，空间复杂度 O(N)。

【**小结**】通过 6 步分析法，我们很快就搞定来这道经典的 DP 题目。

这道题还有一个小变形，我想你可以尝试求解下面的练习题 1。

**练习题 1**：你是一个专业的小偷，计划偷窃沿街的房屋，每间房内都藏有一定的现金。这个地方的所有房屋都围成一圈 ，这意味着第一个房屋和最后一个房屋是紧挨着的。同时，相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警 。给定一个代表每个房屋存放金额的非负整数数组，计算你在不触动警报装置的情况下 ，能够偷窃到的最高金额。

输入：nums = \[2,3,2\]

输出：3

解释：你不能先偷窃 nums\[0\] 号房屋（金额 = 2），然后偷窃 nums\[2\] 号房屋（金额 = 2）, 因为他们是相邻的。最大收益是偷取nums\[1\]=3。

> 代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/213.%E6%89%93%E5%AE%B6%E5%8A%AB%E8%88%8D-ii.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/213.%E6%89%93%E5%AE%B6%E5%8A%AB%E8%88%8D-ii.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/213.%E6%89%93%E5%AE%B6%E5%8A%AB%E8%88%8D-ii.py?fileGuid=xxQTRXtVcqtHK6j8)

#### 区间 DP

还有一类 DP 题目，看起来像是一个线性的数组，但是如果仔细分析，就会发现要处理的却是一个一个的子区间。下面我们依然通过一道例题，使用 6 步破题法进行求解。

#### 例 2：扰乱字符串

【**题目**】使用下面描述的算法可以扰乱字符串 s 得到字符串 t 。

Step 1. 如果字符串的长度为 1 ，算法停止。

Step 2. 如果字符串的长度 > 1 ，执行下述步骤：

*   在一个随机下标处将字符串分割成两个**非空**的子字符串。即如果已知字符串 s ，则可以将其分成两个子字符串 x 和 y ，且满足 s = x + y 。
    
*   随机决定是“交换两个子字符串”还是“保持这两个子字符串的顺序不变”。即在执行这一步骤之后，s 可能是 s = x + y 或者 s = y + x 。
    

Step 3. 在 x 和 y 这两个**子字符串**上继续从 Step 1 开始递归执行此算法。

有两个长度相等的字符串 s1 和 s2，判断 s2 是否是 s1 的扰乱字符串。如果是，返回 true ；否则，返回 false 。

输入：s1 = "great", s2 = "rgeat"

输出：true

解释：经过如下操作即可从 s1 得到 s2：

![Drawing 3.png](https://s0.lgstatic.com/i/image6/M01/37/58/Cgp9HWB2zFWABT97AABr3D8VE1U754.png)

【**分析**】当拿到这个题目的时候，我们看到 true/false，可以联想到这应该是个 DP 题的信号。因为题目也没有要求输出具体怎么操作。

因此，你可以由此想到使用 6 步破题法，而不是立马跟着题意开始切分字符串。

#### 1\. 最后一步

首先看最后一步，题目中给定两个字符串 s1，s2，那么 s1 在最后一步操作之后是否可以得到 s2 呢？（假设 s1 的长度为 N，下标从 0 开始）

我们分析一下，s1 在操作的时候，可以有以下步骤：

1）在位置 p 处进行切分，将 s1 切分为 x = \[0, ... p\] 和 y = \[p + 1, N)；

2）然后再分别处理 s1 = x + y 和 s1 = y + x 能否拼成 s2。

其中 p 的取值范围是 \[0 ~ N-2\]，所以一共有 N-1 种选项。

但是这样操作并不能降低处理的数据规模，无法将一个大问题切分为更多的小问题，也就是说我们只是找到了原始问题的一个等价问题。

这说明我们最后一步找得不准！需要重新思考。如果 s1 是 s2 的扰乱字符串，那么在最后一步的时候，存在以下 2 种情况（判断的时候，只需要判断对应颜色相同的部分）：

![Drawing 4.png](https://s0.lgstatic.com/i/image6/M01/37/58/Cgp9HWB2zGaANoGhAAeB2NdVgKc054.png)

Case 1. 找到某个位置，将 s1, s2 都切成两半，其中 s1 = x + y，而 s2 = c + d，那么我们只需要保证 x 是 c 的扰乱字符串，y 是 d 的扰乱字符串。

![Drawing 5.png](https://s0.lgstatic.com/i/image6/M00/37/61/CioPOWB2zGyAOitSAAeBHGBc82w657.png)

Case 2. 找到某个位置，切分后，使得 s1 = x + y，s2 = c + d，并且 x 是 d 的扰乱字符串，而 y 是 c 的扰乱字符串。

我们发现，找准最后一步之后，原始问题的规模减小了很多。

#### 2\. 子问题

起初要求解的问题是：

> 判断 s1 是不是 s2 的扰乱字符串。

经过最后一步的处理之后，需要处理的问题被拆分为两种情况：

*   Case 1. s1 = x + y, s2 = c + d，判断 <x, c> 和 <y,d> 是不是扰乱字符串；
    
*   Case 2. s1 = x + y, s2 = c + d，判断 <x, d> 和 < y, c> 是不是扰乱字符串。
    

到这里，我们可以将原问题表示如下：

> f(s1, s2) = true，表示 s1 是 s2 的扰乱字符串，false 则表示不是。

那么最后一步就可以表示为：

> f(s1, s2) = f(x, c) && f(y, d) || f(x, d) && f(y, c)  
> 其中 s1 = x + y, s2 = c + d

#### 3\. 递推关系式

我们可以用**伪代码表示**一下这个**递推关系式**，代码如下：

    boolean isScramble(s1, s2) {
      N = len(s1)
      f(s1, s2) = false;
      for cutPos in range(0, N) {
        // 第一种切分方式
        // s1 = x + y
        x = s1[0:cutPos]
        y = s1[cutPos+1, N)
        // s2 = c + d
        c = s2[0:cutPos]
        d = s2[cutPos+1,N)
        // 看第一种是否满足条件
        f(s1,s2) = f(x,c) && f(y,d);
        if (f(s1,s2)) break;
        // 第二种切分方式
        c = s2[0:N-cutPos-1]
        d = s2[N-cutPos:N)
        // 看第二种是否满足条件 
        f(s1, s2) = f(x,d) && f(y, c);
        if (f(s1,s2)) break;
      }
    }
    

#### 4\. f(x) 的表示

接下来，我们需要看一下 f(s1, s2) 的表示。

如果简单一点，我们当然可以使用 HashMap<String,HashMap<String, Boolean>> 双层哈希函数来处理（难办一点，可以用 s1+"#"+s2 作为 key，然后只使用一层哈希函数）。

但是就这道题而言，我们还有更好的表达方式。观察题目可以发现：子问题里面的 <x, y> 和 <c, d> 都是原字符串的子串。

        // s1 = x + y
        x = s1[0:cutPos]
        y = s1[cutPos+1, N)
        // s2 = c + d
        c = s2[0:cutPos]
        d = s2[cutPos+1,N)
    

那么可以用起始位置与终止位置来表示：

    f(s1, s2) = f([s1_start, s1_end], [s2_start, s2_end])
    

到这里，我们可以认为信息已经变成了 f(s1\_start, s1\_end, s2\_start, s2\_end)。针对这个 4 维的信息，可以通过建立一个 4 维数组来处理。比如：dp\[s1\_start\]\[s1\_end\]\[s2\_start\]\[s2\_end\]。

但是，如果 s1 字符串要是 s2 字符串的扰动字符串，那么这两者的长度应该是相等的。因此，应该满足如下的关系：

> s1\_end - s1\_start = s2\_end - s2\_start

也就是说，两个字符串的长度总是相等的，那么我们可以把 4 维的信息压缩为 3 维：

*   s1\_start
    
*   s2\_start
    
*   length
    

因为 s1\_end = s1\_start + length，而 s2\_end = s2\_start + length。也就是说，3 维的信息与 4 维的信息完全是等价的。那么，我们可以把原来 4 维的数组 dp，更改为 3 维的数组 dp\[s1\_start\]\[s2\_start\]\[length\]。

#### 5\. 初始条件与边界

虽然有了第 3 步中的递推关系，但是我们很快可以发现，有那么几项需要提前处理，否则无法计算结果。

*   都是空字符串：s1 = empty，s2 = empty。（就本题而言，题目已给定了不会出现空字符串）。
    
*   两个字符串长度都是 1：len(s1) = 1, len(s2) = 1。
    

还有一些可以提前处理的操作，比如 s1 与 s2 的字符串长度不相等，这种直接可以返回 False，因为扰动字符串需要两个字符串长度相等。

#### 6\. 计算顺序

我们在初始条件中，已经处理了长度为 0（空字符串），长度为 1 的子串的情况。如果再**接着走两步**，那么应该再去计算长度为 2 的任意子串是不是相互为扰动字符串。然后再计算长度为 3，长度为 4，直到长度为 N 的子串。

可以肯定，当计算到长度为 N 的时候，我们就能得到最终解。

【**分析**】经过了前面的 DP 分析 6 步法，现在应该可以写出如下代码了（解析在注释里）：

    boolean isScramble(String s1, String s2) {
      final int s1len = s1 == null ? 0 : s1.length();
      final int s2len = s2 == null ? 0 : s2.length();
      if (s1len != slen2) {
        return false;
      }
      // N表示后面字符串的长度
      final int N = s1len;
      boolean[][][] dp = new boolean[N + 1][N + 1][N + 1];
      // 初始条件是长度为1的情况
      for (int s1start = 0; s1start < N; s1start++) {
        for (int s2start = 0; s2start < N; s2start++) {
          dp[s1start][s2start][1] = s1.charAt(s1start) == s2.charAt(s2start);
        }
      }
      // 那么再通过递推公式计算其他长度的情况
      // 子串的截取，这里我们采用开闭原则[start, end)
      // 也就是说，end是可以取到N的。
      for (int len = 2; len <= N; len++) {
        for (int s1start = 0; s1start + len <= N; s1start++) {
          for (int s2start = 0; s2start + len <= N; s2start++) {
            // 现在我们需要计算两个子串
            // X = s1[s1start, s1start+len)
            // Y = s2[s2start, s2start+len)
            // 这两个子串是否是扰动字符串
            // 那么根据递推公式，我们需要找切分点
            // 切分子串的时候
            // X 切分为 X = a + b, 分为左右两半
            // Y 切分为 Y = c + d，同样分为左右两半
            // 左边的长度为leftLen, 右边的长度就是len - leftLen
            for (int leftLen = 1; leftLen < len && !dp[s1start][s2start][len];
                 leftLen++) {
              // 第一种切分，case 1
              // X = a + b, Y = c + d
              // [s1start, s1start + leftLen) <- a
              // [s2start, s2start + leftLen) <- c
              // [s1start + leftLen, s1start + len) <- b
              // [s2start + leftLen, s2start + len) <- d
              boolean c1 =
                // <a, c>
                dp[s1start][s2start][leftLen] &&
                // <b, d>
                dp[s1start + leftLen][s2start + leftLen][len - leftLen];
              // 第2种切分
              // X = a + b, Y = c + d
              // [s1start, s1start + leftLen) <- a
              // [s2start + len - leftLen, s2start + len) <- d
              // [s1start + leftLen, s1start + len) <- b
              // [s2start, s2start + len - leftLen) <- c
              boolean c2 =
                // <a, d>
                dp[s1start][s2start + len - leftLen][leftLen] &&
                // <b, c>
                dp[s1start + leftLen][s2start][len - leftLen];
              dp[s1start][s2start][len] = c1 || c2;
            }
          }
        }
      }
      return dp[0][0][N];
    }
    

> 代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/87.%E6%89%B0%E4%B9%B1%E5%AD%97%E7%AC%A6%E4%B8%B2.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/87.%E6%89%B0%E4%B9%B1%E5%AD%97%E7%AC%A6%E4%B8%B2.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/87.%E6%89%B0%E4%B9%B1%E5%AD%97%E7%AC%A6%E4%B8%B2.py?fileGuid=xxQTRXtVcqtHK6j8)

**复杂度分析**：时间复杂度 O(N4)，空间复杂度O(N3)。

【**小结**】除了前面的 DP 6 步破题法之外，这道题的重点考点在于：

*   最后一步的正确理解与选择——要保证最后一步得到的**子问题是收缩的；**
    
*   哈希函数空间的优化——我们一步一步推导了从哈希函数到 4 维数组，最后到 3 维数组。
    

这道题还可以使用记忆化 DFS 来进行搜索，你可以当作练习题试一下吗？

**练习题 2**：请使用记忆化搜索求解例 2。

> 代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/87.%E6%89%B0%E4%B9%B1%E5%AD%97%E7%AC%A6%E4%B8%B2.rec.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/87.%E6%89%B0%E4%B9%B1%E5%AD%97%E7%AC%A6%E4%B8%B2.rec.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/87.%E6%89%B0%E4%B9%B1%E5%AD%97%E7%AC%A6%E4%B8%B2.rec.py?fileGuid=xxQTRXtVcqtHK6j8)

#### 背包型 DP

背包型 DP，这个称呼实际上是来自一个比较经典的 DP 问题：“背包问题”，在面试中比较出名的是“背包九讲”。但是我个人认为“背包九讲”对于很多只需要参加面试的同学来说，内容有些偏难，并且大部分面试只会涉及 01 背包和完全背包。因此，接下来我会带你用 6 步分析法处理面试中常常出现的高频背包问题。

注意：如果你没有学习过背包问题，甚至从来没有听说过，也不影响你接下来的学习。

#### 例 3：分割等和子集

【**题目**】一个只包含正整数的非空数组。是否可以将这个数组分割成两个子集，使得两个子集的元素和相等。

注意: 1）每个数组中的元素不会超过 100；2）数组的大小不会超过 200

输入：A = \[2, 2\]

输出：true

解释：可以将这个数组分成 \[2\], \[2\] 这两个子集和是相等的。

【**分析**】由于分出来的两个子集和要求是相等的，如果整个数组和为奇数，那么没有讨论的必要。这里我们只讨论 sum(A) = 2 x V 的情况。也就是分出来的两个子集，其和分别为 V。

这个问题，也可以想象成：

> 有一个容量为 V 的背包，给你一些石头，石头的大小放在数组 A\[\] 中，现在需要捡一些石头，刚好装满容量为 V 的背包。（你可以不去考虑填充的时候的缝隙）

那么，在这个场景下，每个石头就只有选和不选两种情况。下面我们具体看一下如何利用6 步分析法处理这个问题。

#### 1\. 最后一步

这个问题里面，比较难以想到的是最后一步，我们先把最后一步的来龙去脉讲清楚。

首先，假设给定的数组 A\[\] = {1, 2, 3}，然后看一下利用这个数组可以组合出哪些数。在一开始，如果我们什么元素都不取，肯定可以走到的点为 0。因此，可以将 0 设置为起点。

![1.gif](https://s0.lgstatic.com/i/image6/M01/37/58/Cgp9HWB2zJmAW8HqAAm_mP67WDc578.gif)

至此，你应该已经分析出最后一步应该如何操作。它依赖两点：

*   已经可以访问到的点集 X（后面我们把可以访问到的数均称为**点集**）；
    
*   A\[n-1\] 元素。
    

最后一步操作可以用伪代码表示如下（解析在注释里）：

    Y = {....}; // 旧有的点集的状态
    Z = new HashSet(Y); // 新的可以访问的点集
    // 生成新的可以访问的点
    for node in Y:
      Z.insert(node + A[n-1])
    // 查看V是否在N点集中
    Z.contains(V) -> true / false
    

两个点集之间的关系可以简略表示如下：

![Drawing 7.png](https://s0.lgstatic.com/i/image6/M00/37/61/CioPOWB2zMOAbGNlAABqNw0YfrM582.png)

#### 2\. 子问题

通过观察最后一步，可以发现它就是在可访问点集 Y 的基础上，通过**加入边**A\[n-1\] ，然后生成点集 Z。如果引入更早一点的可访问点集 X，可以将点集的扩展顺序表示如下：

![Drawing 8.png](https://s0.lgstatic.com/i/image6/M01/37/58/Cgp9HWB2zMuAH3SUAABi4JG4bTk857.png)

那么更进一步，它的子问题就是：

> 在一个可访问点集 X 里面，通过加入A\[i\] 元素之后，  
> 是否可以访问 y1？  
> 是否可以访问 y2？  
> ……  
> 是否可以访问 ym?

#### 3\. 递推关系

如果我们用 f()函数表示这一层关系，可以表示为：

> f(X, A\[n-2\]) => Y  
> f(Y, A\[n-1\]) => Z

需要注意的是， f() 函数并不表示一个数是否可以生成，其输出表示的是一个点集。因此，这个例子告诉我们：有时候，**f(x) 的输出与我们想要的结果并不直接相关**。

比如，在这道题中，我们**最终想要的答案是**：

> 值 V 是否出现在了点集 Z 中？

但是，f() 函数并没有直接回答这个问题，而是通过以下方式来回答最终问题:

    f(Y, A[n-1]) => Z
    return Z.contains(V)
    

#### 4\. f(x) 的表示

在这道题目里面，f() 函数更一般的写法为：f(S, A\[i\])。其中 S 是已知的点集，而这个函数的输出得到的是一个新的点集。

那么，我们在写程序的时候，应该用什么去表达 f() 函数呢？在之前的代码里面，我们要么用数组，要么用哈希函数。但是在这里，S 表示的是可以访问的点集。像这样，如何进行哈希呢？

**优化 1**

不过，如果我们根据前面数组 A\[\] = {1, 2, 3} 给出的示例，可以用 f() 函数表示如下：

    S0 = {0}
    S1 = f(S0, A[0])
    S2 = f(S1, A[1])
    S3 = f(S2, A[2])
    return S3.contains(V)
    

我们发现，这个步骤可以很轻松地写成两个点集迭代的形式：

    old = {0}
    for x in A:
        new = f(old, x)
        old = new
    return old.contains(V)
    

**优化 2**

尽管只用两个点集迭代就可以完成计算过程。但是，我们还有一个条件没用上，就是给定的数组里面的元素都是**正整数**。

这就意味着， f(S, A\[i\]) 在进行迭代的时候，新生成的数，必然会更大。这对于我们的迭代有什么帮助呢？这种递增方向是否可以使我们只使用**一个集合**就完成工作呢？

假设 S = {0, 5}，A\[i\] = 2 现在要原地完成一个集合的迭代，我们从小到大开始迭代，如下图所示：

![2.gif](https://s0.lgstatic.com/i/image6/M00/37/61/CioPOWB2zN2Af9neAAQiPWUjU6c193.gif)

但是，如果按上图这样操作，就会出错。因为 A\[i\] = 2 被使用了两次，而题目要求只能使用一次。

出现这个问题的原因是**我们无法区分旧有的数，新加入的数**。使用另外一个数组标记旧有的数，新生成的数本质上就与两个集合完成迭代没有区别了。那么有什么办法可以帮助我们区分旧有的数和新生成的数呢？

如果我们试试从大往小更新呢？从大往小更新主要是基于这样一个条件：

> 新生成的数总是要更大一些的。如果我们先让大的数加上了 A\[i\]，这些更大的数会放在后面，再次遍历，我们总是不会遇到这些新生成的数。

迭代步骤如下图所示：

![3.gif](https://s0.lgstatic.com/i/image6/M00/37/61/CioPOWB2zPGAEM2YAARohJntves709.gif)

我们发现，如果采用从大往小的方向遍历，就可以利用一个点集完成迭代。

#### 5\. 初始条件与边界

首先，当我们什么都不选的时候，肯定可以得到 0，所以一开始的点集就是 {0}。

其次，我们要得到的数是 V。如果旧有的点集中，已经有数比 V 大了，比如 R，那么可以直接把 R 扔掉。因为在后面的迭代过程中，A\[i\] 都是正数，迭代之后，只会让 R 越来越大，所以保留 R 没有意义。

因此动态规划的边界就是 \[0, V\]。

#### 6\. 计算顺序

有两个计算顺序需要注意：

*   迭代的时候，需要用 A\[0\], A\[1\],…, A\[n-1\] 依次去更新点集；
    
*   当我们更新点集的时候，需要按从大到小的顺序更新。
    

当 f() 函数在整个迭代过程中只需要一个点集，并且这个点集的范围已经是固定 \[0, V\] 的时候，就可以用 boolean 数组来表示这个点集。

【**代码**】经过前面的分析，我们已经可以写出如下代码了（解析在注释里）：

    class Solution {
        public boolean canPartition(int[] A) {
            final int N = A == null ? 0 : A.length;
            if (N <= 0) {
                return true;
            }
            // 数组求和
            int s = 0;
            for (int x : A) {
                s += x;
            }
            // 如果为奇数， 肯定是没有办法切分
            if ((s & 0x01) == 1) {
                return false;
            }
            // 分割为等和，那么相当于要取同值的一半
            final int V = s >> 1;
            // 这个dp表示着一开始可以访问的点集
            // 我们用true表示这个点存在于点集中
            // false表示这个点不存在点集中
            boolean[] dp = new boolean[V + 1];
            // 首先初始集合肯定是s0={0}
            dp[0] = true;
            // 开始利用a[i]来进行推导
            for (int x : A) {
                // 注意这里更新的方向
                for (int node = V; node - x >= 0; node--) {
                    final int newNode = node;
                    final int oldExistsNode = node - x;
                    if (dp[oldExistsNode]) {
                        dp[newNode] = true;
                    }
                }
            }
            return dp[V];
        }
    }
    

> 代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/416.%E5%88%86%E5%89%B2%E7%AD%89%E5%92%8C%E5%AD%90%E9%9B%86.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/416.%E5%88%86%E5%89%B2%E7%AD%89%E5%92%8C%E5%AD%90%E9%9B%86.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/416.%E5%88%86%E5%89%B2%E7%AD%89%E5%92%8C%E5%AD%90%E9%9B%86.py?fileGuid=xxQTRXtVcqtHK6j8)

**复杂度分析**：时间复杂度 O(NV)，空间复杂度 O(V)。

【**小结**】在这道题目里面，我们再次利用 DP 的 6 步分析法求解问题。在求解的过程中，可以发现有两个有意思的地方：

*   利用 A\[i\] 逐步进行迭代；
    
*   dp\[\] 数组的更新方向，需要从大到小更新的根本原因是数组里面面的数都是正整数。
    

这个题目，实际上是一个 01 背包问题的变形。那么真正的 01 背包问题是什么样呢？这里我给你留了一道练习题，你可以尝试求解一下。

**练习题 3**：（0/1 背包）有 N 件物品和一个容量是 V 的背包，每件物品只能使用一次。

第 i 件物品的体积是 vi，价值是 wi。求解将哪些物品装入背包，可使这些物品的总体积不超过背包容量，且总价值最大。输出最大价值。

> 代码:[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/acwing.01.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/acwing.01.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/acwing.01.py?fileGuid=xxQTRXtVcqtHK6j8)

**练习题 4**：有 N 种物品和一个容量是 V 的背包，每种物品都有无限件可用。第 i 种物品的体积是 vi，价值是 wi。求解将哪些物品装入背包，可使这些物品的总体积不超过背包容量，且总价值最大。输出最大价值。

> 代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/acwing.full.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/acwing.full.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/acwing.full.py?fileGuid=xxQTRXtVcqtHK6j8)

**练习题 5**：给定一个非负整数数组，a1, a2,…, an, 和一个目标数 S。现在你有两个符号 + 和 -。对于数组中的任意一个整数，你都可以从 + 或 - 中选择一个符号添加在前面。返回可以使最终数组和为目标数 S 的所有添加符号的方法数。

输入：nums: \[1, 1, 1, 1, 1\], S: 3

输出：5

解释：

\-1+1+1+1+1 = 3

+1-1+1+1+1 = 3

+1+1-1+1+1 = 3

+1+1+1-1+1 = 3

+1+1+1+1-1 = 3

> 解法 1：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/494.%E7%9B%AE%E6%A0%87%E5%92%8C.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/494.%E7%9B%AE%E6%A0%87%E5%92%8C.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/494.%E7%9B%AE%E6%A0%87%E5%92%8C.py?fileGuid=xxQTRXtVcqtHK6j8)  
> 解法 2：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/494.%E7%9B%AE%E6%A0%87%E5%92%8C.backtrace.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/494.%E7%9B%AE%E6%A0%87%E5%92%8C.backtrace.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/494.%E7%9B%AE%E6%A0%87%E5%92%8C.backtrace.py?fileGuid=xxQTRXtVcqtHK6j8)

#### 树型 DP

树型 DP，顾名思义，这一类题目会在一棵二叉树，或者多叉树上进行 DP。虽然看起来是一个二叉树问题，但本质上需要用到 DP 的知识才能求解。不过有了我们的 6 步破解法，这种树型 DP 题目也没有那么难。接下来我们一起通过题目学习一下。

#### 例 4：二叉树抢劫

【**题目**】在上次打劫完一条街道之后和一圈房屋后，小偷又发现一个新的可行窃的地区。这个地区只有一个入口，我们称为“根”。 除了“根”之外，每栋房子有且只有一个“父”房子与之相连。一番侦察之后，聪明的小偷意识到“这个地方的所有房屋的排列类似于一棵二叉树”。 如果两个直接相连的房子在同一天晚上被打劫，房屋将自动报警。计算在不触动警报的情况下，小偷一晚能够盗取的最高金额。

输入：\[3,2,3,null,3,null,1\]

![Drawing 11.png](https://s0.lgstatic.com/i/image6/M01/37/58/Cgp9HWB2zQeANJDtAAAi-wCtZjQ178.png)

输出：7

解释：小偷一晚能够盗取的最高金额 = 3 + 3 + 1 = 7.

【**分析**】我们看到“最高”两字，应该可以想到使用 DP 方法来试一试。首先还是使出我们的绝招，最后一步。

#### 1\. 最后一步

假设小偷在抢劫的时候，总是先抢树的子树，那么最后一步肯定就是二叉树的根结点。根结点只有两种可能：

*   抢根结点
    
*   不抢根结点
    

得到这两种可能之后，我们只需要在这两种情况中取最大值就可以了。

#### 2\. 子问题

如果我们进一步展开根结点的 2 种情况，可以发现：

*   抢根结点，此时**不能**抢左右**两棵子树的根结点**；
    
*   不抢根结点，此时**可以抢**左右**两棵子树的根结点，**也**可以不抢两棵子树的根结点。**
    

我们发现，根结点需要得到两个信息：<抢 root 的最大收益,不抢 root 的最大收益>，并且左右子树也是需要这两个信息。

那么我们可以定义一个函数 f(x)，来描述最后一步的需求，以及子问题的需求：

> f(x) = <抢 x 的最大收益, 不抢 x 的最大收益>

为了后面描述的方便，我们会用到以下缩写表示上述两个维度的信息：

> f(x) = <抢,不抢> = <抢 x 的最大收益, 不抢 x 的最大收益>  
> max(f(x)) = max<f(x).抢,f(x).不抢>

#### 3\. 递推关系

到这里，我们可以根据最后一步和子问题写出递推关系：

> f(root).抢 = root.val + f(root.left).不抢 + f(root.right).不抢  
> f(root).不抢 = max(f(root.left)) + max(f(root.right)))

#### 4\. f(x) 的表示

首先我们看一下 f(x) 的返回值，由于返回值只有两个。这比较好处理，对于 Python 来说，可以直接返回两个值，而对于 Java 来说，可以直接返回 long\[2\] 数组。

然后再看一下 f(x) 的表示。我们从底层开始往上抢的时候，应该只有相邻的两层才会有相互的依赖，如下图所示：

![Drawing 12.png](https://s0.lgstatic.com/i/image6/M00/37/61/CioPOWB2zTyAErOsAACsCnIj2ck114.png)

相隔更远的层间信息不需要保留，所以 f(x) 函数并不需要一个哈希或者数组来记录 \[x\] 的信息。相当于直接使用 DFS，而不需要记忆化 DFS。

#### 5\. 初始条件与边界

当遇到一棵空树的时候，只需要返回 long\[2\] = {0, 0} 就可以了，也就是收益为 0。

#### 6\. 计算顺序

这里我们采用的是先抢树的子树，因此，顺序上需要使用后序遍历。

【**代码**】到这里，我们已经可以写出如下代码了（解析在注释里）：

    class Solution {
        // 返回值是一个pair
        // ans[0]表示抢当前根结点
        // ans[1]表示不能抢当前结点
        private long[] postOrder(TreeNode root) {
            if (root == null) {
                return new long[] { 0, 0 };
            }
            long[] l = postOrder(root.left);
            long[] r = postOrder(root.right);
            // 如果要抢当前结点
            long get = root.val;
            // 那么两个子结点必然不能抢
            get += l[1] + r[1];
            // 如果不抢当前结点
            long skip = 0;
            // 那么两个子结点可以抢，也可以不抢
            skip += Math.max(l[0], l[1]) + Math.max(r[0], r[1]);
            return new long[] { get, skip };
        }
        public int rob(TreeNode root) {
            long[] ans = postOrder(root);
            return (int) Math.max(ans[0], ans[1]);
        }
    }
    

> 代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/337.%E6%89%93%E5%AE%B6%E5%8A%AB%E8%88%8D-iii.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/337.%E6%89%93%E5%AE%B6%E5%8A%AB%E8%88%8D-iii.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/337.%E6%89%93%E5%AE%B6%E5%8A%AB%E8%88%8D-iii.py?fileGuid=xxQTRXtVcqtHK6j8)

**复杂度分析**：时间复杂度，本质上这就是一个后序遍历，所以为 O(N)。算上栈占用的空间，空间复杂度为 O(H)，其中 H 表示树的高度。

【**小结**】最后我们再总结一下这个题目的考点：

*   DP 的 6 步分析法
    
*   后序遍历
    

此外，在处理这道题的最后返回值时，后序遍历的返回值并不是直接返回了我们想要的答案，而是带上了子树的信息，然后留给根结点把这部分信息做整合。你可以联系到我们在“[06 | 树：如何深度运用树的遍历？](https://kaiwu.lagou.com/course/courseInfo.htm?courseId=685#/detail/pc?id=6695&fileGuid=xxQTRXtVcqtHK6j8)”里，学习二叉树的后序遍历时讲过的“项庄舞剑，意在沛公”解法，不难发现，树型 DP 与\*\*后序遍历中“项庄舞剑，意在沛公”\*\*的解法基本上是一样的。

接下来，我给你留了一道练习题，你可以再体会一下树型 DP 方法。

**练习题 6**：给定一棵二叉树，你需要计算它的直径长度。一棵二叉树的直径长度是任意两个结点路径长度中的最大值。这条路径可能穿过也可能不穿过根结点。

示例 :

给定二叉树

1

/ \\

2 3  
/ \\

4 5

返回 3, 它的长度是路径 \[4,2,1,3\] 或者 \[5,2,1,3\]。

> 代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/543.%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E7%9B%B4%E5%BE%84.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/543.%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E7%9B%B4%E5%BE%84.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/543.%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E7%9B%B4%E5%BE%84.py?fileGuid=xxQTRXtVcqtHK6j8)

#### 状态压缩型 DP

状态压缩型 DP 的关键就是如何表达 f(x) 函数。这类题目有几个特点：

*   x 往往表示一个数组，并且这个数组是原始数组 A\[\] 的一个子集：即 A\[\] 数组中的每个元素可以选，也可以不选；
    
*   直接用哈希或者数组表达 f(x) 都不是特别方便；
    
*   原始数组 A\[\] 并不会特别长。
    

基于这样的一个特点，我们在设计 f(x) 函数的时候，就需要根据以下两个点进行破题：

*   A\[i\] 元素可以选，也可以不选；
    
*   原始数组 A\[\] 不会特别长。
    

选和不选，可以用 0/1 来表示，虽然 x 表示的是一个数组，但是我们可以用一个与原始数组等长（或者更长一些）的二进制整数 y 来表示**第 i 个 bit 位：0 表示不选 A\[i\]，1 表示选 A\[i\]**。

这样，就可以通过一个整数 y 表达 x 数组，然后利用数组 dp\[y\] 表达 f(x) 的状态。下面我们看一下例题。这里用了一个非常简单的整数表示一个数组的信息，所以这种 DP 也被叫作状态压缩 DP。

#### 例 5：N 次操作的最大分数和

【**题目**】给你 A\[\] ，它是一个大小为 2 \* n 的正整数数组。你必须对这个数组执行 n 次操作。在第 i 次操作时（操作编号从 1 开始），你需要：

Step 1. 选择两个元素 x 和 y 。

Step 2. 获得分数 i \* gcd(x, y) 。

Step 3. 将 x 和 y 从 A\[\] 中删除。

返回 n 次操作后，请你求解获得的分数和最大为多少。函数 gcd(x, y) 是 x 和 y 的最大公约数。

输入：A = \[3,4,6,8\]

输出：11

解释：最优操作是：

(1 \* gcd(3, 6)) + (2 \* gcd(4, 8)) = 3 + 8 = 11

**注意**：数组最大长度为 14。

【**分析**】当拿到这道题的时候，我们首先进行一下简化，把这个问题转化为一个等价的问题。

虽然题目中给定的是删除操作，我们可以把这个删除之后的元素，放到一个数组 C\[\] 中，操作步骤如下：

> (1 \* gcd(3, 6)) + (2 \* gcd(4, 8)) = 3 + 8 = 11

也可以认为是：

> 第 1 次添加：<3, 6> = 1 \* gcd(3, 6)), C = \[3, 6\]  
> 第 2 次添加：<4, 8> = (2 \* gcd(4, 8), C = \[3, 6, 4, 8\]  
> 最终收益 = 11

题目就可以简化成如下这样。

> 一开始你有一个空数组 C，以及有元素的数组 A\[\]，你需要如下操作：
> 
> 1.  从 A 数组中选择两个数 x,y，然后将这两个数从 A\[\] 中删除；
>     
> 2.  将这两个数放到 C 中；
>     
> 3.  获得分数 len(C) / 2 \* gcd(x, y)。
>     
> 
> > 求如何操作，得到最大分数。

这样**处理的好处**在于：我们不再需要记录步数信息，只需要看当前数组 C 的大小，就可以得到当前是第几步。即步数 = C 数组大小 / 2。

接下来，我们就基于这个稍做改动的等价题目来分析。需要注意两个信息：

*   最大值
    
*   数组本身不会太大
    

我们首先分析第一个信息，求**最大值**，那么这里我们尝试一下 DP。而第二个信息告诉我们，如果进行暴力搜索，其实状态空间也只有 2N 种。并不算特别大。

下面我们看一下如何运用好题意给出的这两个重要信息。

#### 1\. 最后一步

当我们执行到最后一步的时候，数组中肯定只会剩下两个数了。假设这两个数是 <x, y>，那么**最后一步**，得到的收益就是：

> last\_step = len(C) + 2 / 2；  
> last\_income = 形成数组 C\[\] 的最大收益 + last\_step \* gcd(x,y)。

但是，最终余下的两个数 <x, y>，可以是原始数组 A\[\] 的任意的两个数。所以我们可以用伪代码表示如下：

    last_income = 0;
    for (int j = 0; j < N; j++): //  x = a[j]
      for (int k = j + 1; k < N; k++): // y = A[k] 
        // 数组C[], 再加上最后一步加入的<x,y>，那么长度必然与原始数组A一样长
        last_step = len(C) + 2 / 2 即 len(A) / 2
        last_income = max((计算C[]数组的收益 + last_step * gcd(A[j], A[k]), 
                           last_income);
    

#### 2\. 子问题

研究最后一步之后，可以发现，要递归计算的是数组 C\[\] 和数组 A\[\] 的最大收益，那么子问题可以表示如下：

> f(A) 表示数组 A\[\] 的最大收益；  
> f(C) 表示数组 C\[\] 的最大收益。

我们可以统一用 f(x) 表示最终问题与子问题：

> f(x) 表示 x\[\] 数组的最大收益；  
> 其中，x\[\] 是原始数组 A\[ \]的子序列。

#### 3\. 递推关系

我们可以利用伪代码，重新表达一下这个递推关系，代码如下（解析在注释里）：

    int f(x[]) { // 形成数组x[]的最大收益
      ans = 0;
      for (int j = 0; j < N; j++):
        for (int k = j + 1; k < N; k++):
          C[] = x.remove_index_item(j, k)
          L = len(x) / 2; // C[]数组加入<x,y>之后形成x数组
          ans = max((f(C) + L * gcd(A[j], A[k]), ans);
      return ans;
    }
    

#### 4\. f(x) 的表达

由于 x 数组肯定是 A 数组的一个子集，并且 A 数组并不是特别大。那么我们可以用二进制串来表示 A\[i\] 元素是否存在于 x 数组这个关系：

*   1 表示 A\[i\] 存在于 x 数组中；
    
*   0 表示 A\[i\] 不存在于 x 数组中。
    

在这种情况下，我们可以申请一个数组：

    int[] dp = new int[1<<(len(A))];
    

然后用 dp\[i\] 表示 f(x)。其中i这个整数的二进制串表示：A\[\] 数组的子序列 x\[\]。

#### 5\. 初始条件与边界

首先，当数组为空的时候，肯定是没有什么收益的。所以此时 dp\[0\] = 0。并且，由于我们总是成对地添加元素，所以当 dp\[i\] 中的下标 i 里面的 bit 1 的个数为奇数（表示 x\[\] 数组有奇数个元素），这种情况应该是不可能出现的，不需要进行处理。

#### 6\. 计算顺序

当我们使用更改之后的题目进行处理的时候，就可以直接从 dp\[0\] 开始计算了。

【**代码**】得到状态压缩之后，我们可以写出代码如下（解析在注释里）：

    class Solution{
      private int bitCount(int x) {
        int ret = 0;
        while (x != 0) {
          ret += (x & 0x01) == 1 ? 1 : 0;
          x >>= 1;
        }
        return ret;
      }
      private int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }
      public int maxScore(int[] A) {
        final int N = A == null ? 0 : A.length;
        final int total_steps = N >> 1;
        // 一共有N个数
        // 每个数可以表示存在，或者不存在
        // 那么只有两种状态0/1
        // 因此，我们可以用二进制位来进行表示
        // 由于题目中已经说明n <= 7
        // 所以，最多只需要14 bits
        // 那么用一个int位，我们就可以表示了
        // 所以这里我们申请dp[array_size]
        final int array_size = 1 << N;
        int[] dp = new int[array_size];
        // dp[0] = 0
        // 表示当没有任何数的时候，那么收益肯定为0
        // 已经设置过了，这里不用再设置
        // 那么接下来就是从余下两个数的时候开始
        // 往前推导
        for (int i = 3; i < array_size; i++) {
          // 这里利用GCC内置的计算整的二进制中1的个数的函数
          int cnt = bitCount(i);
          // 由于每次需要去掉两个数，当i里面的二进制1的数目为
          // 奇数的时候，没有必要计算!
          if ((cnt & 0x01) == 1) {
            continue;
          }
          // 当前步数
          // 即: 当前我是第几步
          final int cur_step = cnt >>> 1;
          // 那么我们需要从i里面选两个数
          for (int j = 0; j < N; j++) {
            // 如果i中没有A[j]这个数
            if ((i & (1 << j)) == 0)
              continue;
            for (int k = j + 1; k < N; k++) {
              // 如果i中没有A[k]这个数
              if ((i & (1 << k)) == 0)
                continue;
              // 这里我们选择A[j], A[k]
              final int g = gcd(A[j], A[k]);
              // 得分
              final int score = cur_step * g;
              // 得到去掉i,j之后的状态
              final int mask = (1 << j) | (1 << k);
              final int pre_status = i & ~mask;
              final int total = dp[pre_status] + score;
              // 选择最大值dp[i]
              dp[i] = Math.max(dp[i], total);
            }
          }
        }
        return dp[array_size - 1];
      }
    }
    

> 代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/1799.n-%E6%AC%A1%E6%93%8D%E4%BD%9C%E5%90%8E%E7%9A%84%E6%9C%80%E5%A4%A7%E5%88%86%E6%95%B0%E5%92%8C.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/1799.n-%E6%AC%A1%E6%93%8D%E4%BD%9C%E5%90%8E%E7%9A%84%E6%9C%80%E5%A4%A7%E5%88%86%E6%95%B0%E5%92%8C.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/1799.n-%E6%AC%A1%E6%93%8D%E4%BD%9C%E5%90%8E%E7%9A%84%E6%9C%80%E5%A4%A7%E5%88%86%E6%95%B0%E5%92%8C.py?fileGuid=xxQTRXtVcqtHK6j8)

**复杂度分析**：当给定 N 个数的时候，一共需要表达 2N 种状态，而每种状态在处理时候，需要遍历 N x N 次，所以时间复杂度为 O(2N x N x N)，空间复杂度为 O(2N)。虽然看起来很大，但是题目中已经明确说了数组的长度 <= 14（最多只有 7 对数）。

【**小结**】如果你已经掌握了 6 步破解法，相信你可以明白，这道 DP 题目的关键就是 f(x) 的表示。

实际上，所有状态压缩题的核心与关键都是在 f (x) 的表示上。为了让你深入学习这种方法，这里我还给你留了一道练习题，希望你可以尝试思考并动手解答。

**练习题 7**：给你一个 m \* n 的矩阵 seats 表示教室中的座位分布。如果座位是坏的（不可用），就用 '#' 表示；否则，用 '.' 表示。学生可以看到**左侧、右侧、左上、右上**这四个方向上紧邻他的学生的答卷，但是看不到直接坐在他前面或者后面的学生的答卷。请你计算并返回该考场可以容纳的一起参加考试且无法作弊的最大学生人数。学生必须坐在状况良好的座位上。

![Drawing 13.png](https://s0.lgstatic.com/i/image6/M00/37/61/CioPOWB2zYiAaRzEAAAr6bp4N30004.png)

输出：4

解释：教师最多可以让 4 个学生坐在可用的座位上，这样他们就无法在考试中作弊。

> 代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/1349.%E5%8F%82%E5%8A%A0%E8%80%83%E8%AF%95%E7%9A%84%E6%9C%80%E5%A4%A7%E5%AD%A6%E7%94%9F%E6%95%B0.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/1349.%E5%8F%82%E5%8A%A0%E8%80%83%E8%AF%95%E7%9A%84%E6%9C%80%E5%A4%A7%E5%AD%A6%E7%94%9F%E6%95%B0.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/1349.%E5%8F%82%E5%8A%A0%E8%80%83%E8%AF%95%E7%9A%84%E6%9C%80%E5%A4%A7%E5%AD%A6%E7%94%9F%E6%95%B0.py?fileGuid=xxQTRXtVcqtHK6j8)

### 总结

在本讲中，我们介绍了通用的 DP 的 6 步破解法，并且罗列了面试中常出现的几种 DP 型题目。这里我还总结了其他一些类型的 DP 题目，你可以参考下图进行专项练习，逐一击破个类型的DP 问题。

![Drawing 14.png](https://s0.lgstatic.com/i/image6/M00/37/61/CioPOWB2zZ2AJiVSAARePu3Wkh8895.png)

DP 求解的套路基本就是 6 步。不过要熟练运用这种求解方法，你还需要花更多的时间练习。

### 思考题

在这里，我再给你留一道思考题。

**思考题**：爱丽丝参与一个大致基于纸牌游戏 “21 点” 规则的游戏，描述如下：爱丽丝以 0 分开始，并在她的得分少于 K 分时抽取数字。 抽取时，她从 \[1, W\] 的范围中随机获得一个整数作为分数进行累计，其中 W 是整数。 每次抽取都是独立的，其结果具有相同的概率。当爱丽丝获得不少于 K 分时，她就停止抽取数字。 爱丽丝的分数不超过 N 的概率是多少？

输入：N = 10, K = 1, W = 10

输出：1.00000

说明：爱丽丝得到一张卡，然后停止。

> 代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/837.%E6%96%B0-21-%E7%82%B9.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/837.%E6%96%B0-21-%E7%82%B9.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/837.%E6%96%B0-21-%E7%82%B9.py?fileGuid=xxQTRXtVcqtHK6j8)

DP 虽然看起来很难，不过掌握我们的 6 步破解法之后，学习起来是不是要更轻松一点了呢？接下来我们将要学习15 | 字符串查找：为什么我最终选择了 BM 算法？记得按时来探险。

### 附录：题目出处和代码汇总

兑换硬币

[测试平台](https://leetcode-cn.com/problems/coin-change/description/?fileGuid=xxQTRXtVcqtHK6j8)

代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/322.%E9%9B%B6%E9%92%B1%E5%85%91%E6%8D%A2.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/322.%E9%9B%B6%E9%92%B1%E5%85%91%E6%8D%A2.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/322.%E9%9B%B6%E9%92%B1%E5%85%91%E6%8D%A2.py?fileGuid=xxQTRXtVcqtHK6j8)

例 1：打劫

[测试平台](https://leetcode-cn.com/problems/house-robber/description/?fileGuid=xxQTRXtVcqtHK6j8)

代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/198.%E6%89%93%E5%AE%B6%E5%8A%AB%E8%88%8D.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/198.%E6%89%93%E5%AE%B6%E5%8A%AB%E8%88%8D.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/198.%E6%89%93%E5%AE%B6%E5%8A%AB%E8%88%8D.py?fileGuid=xxQTRXtVcqtHK6j8)

练习题 1

[测试平台](https://leetcode-cn.com/problems/house-robber-ii/?fileGuid=xxQTRXtVcqtHK6j8)

代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/213.%E6%89%93%E5%AE%B6%E5%8A%AB%E8%88%8D-ii.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/213.%E6%89%93%E5%AE%B6%E5%8A%AB%E8%88%8D-ii.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/213.%E6%89%93%E5%AE%B6%E5%8A%AB%E8%88%8D-ii.py?fileGuid=xxQTRXtVcqtHK6j8)

例 2：扰乱字符串

[测试平台](https://leetcode-cn.com/problems/scramble-string/description/?fileGuid=xxQTRXtVcqtHK6j8)

解法 1：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/87.%E6%89%B0%E4%B9%B1%E5%AD%97%E7%AC%A6%E4%B8%B2.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/87.%E6%89%B0%E4%B9%B1%E5%AD%97%E7%AC%A6%E4%B8%B2.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/87.%E6%89%B0%E4%B9%B1%E5%AD%97%E7%AC%A6%E4%B8%B2.py?fileGuid=xxQTRXtVcqtHK6j8)  
解法 2：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/87.%E6%89%B0%E4%B9%B1%E5%AD%97%E7%AC%A6%E4%B8%B2.rec.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/87.%E6%89%B0%E4%B9%B1%E5%AD%97%E7%AC%A6%E4%B8%B2.rec.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/87.%E6%89%B0%E4%B9%B1%E5%AD%97%E7%AC%A6%E4%B8%B2.rec.py?fileGuid=xxQTRXtVcqtHK6j8)

练习题 2

[测试平台](https://leetcode-cn.com/problems/scramble-string/description/?fileGuid=xxQTRXtVcqtHK6j8)

代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/87.%E6%89%B0%E4%B9%B1%E5%AD%97%E7%AC%A6%E4%B8%B2.rec.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/87.%E6%89%B0%E4%B9%B1%E5%AD%97%E7%AC%A6%E4%B8%B2.rec.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/87.%E6%89%B0%E4%B9%B1%E5%AD%97%E7%AC%A6%E4%B8%B2.rec.py?fileGuid=xxQTRXtVcqtHK6j8)

例 3

[测试平台](https://www.acwing.com/problem/content/2/?fileGuid=xxQTRXtVcqtHK6j8)

代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/416.%E5%88%86%E5%89%B2%E7%AD%89%E5%92%8C%E5%AD%90%E9%9B%86.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/416.%E5%88%86%E5%89%B2%E7%AD%89%E5%92%8C%E5%AD%90%E9%9B%86.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/416.%E5%88%86%E5%89%B2%E7%AD%89%E5%92%8C%E5%AD%90%E9%9B%86.py?fileGuid=xxQTRXtVcqtHK6j8)

练习题 4

[测试平台](https://www.acwing.com/problem/content/2/?fileGuid=xxQTRXtVcqtHK6j8)

代码:[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/acwing.01.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/acwing.01.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/acwing.01.py?fileGuid=xxQTRXtVcqtHK6j8)

练习题 5

[测试平台](https://www.acwing.com/problem/content/3/?fileGuid=xxQTRXtVcqtHK6j8)

代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/acwing.full.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/acwing.full.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/acwing.full.py?fileGuid=xxQTRXtVcqtHK6j8)

练习题 6

[测试平台](https://leetcode-cn.com/problems/target-sum/description/?fileGuid=xxQTRXtVcqtHK6j8)

解法 1：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/494.%E7%9B%AE%E6%A0%87%E5%92%8C.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/494.%E7%9B%AE%E6%A0%87%E5%92%8C.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/494.%E7%9B%AE%E6%A0%87%E5%92%8C.py?fileGuid=xxQTRXtVcqtHK6j8)  
解法 2：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/494.%E7%9B%AE%E6%A0%87%E5%92%8C.backtrace.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/494.%E7%9B%AE%E6%A0%87%E5%92%8C.backtrace.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/494.%E7%9B%AE%E6%A0%87%E5%92%8C.backtrace.py?fileGuid=xxQTRXtVcqtHK6j8)

例 4

[测试平台](https://leetcode-cn.com/problems/house-robber-iii/?fileGuid=xxQTRXtVcqtHK6j8)

代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/337.%E6%89%93%E5%AE%B6%E5%8A%AB%E8%88%8D-iii.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/337.%E6%89%93%E5%AE%B6%E5%8A%AB%E8%88%8D-iii.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/337.%E6%89%93%E5%AE%B6%E5%8A%AB%E8%88%8D-iii.py?fileGuid=xxQTRXtVcqtHK6j8)

练习题 7

[测试平台](https://leetcode-cn.com/problems/diameter-of-binary-tree/?fileGuid=xxQTRXtVcqtHK6j8)

代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/543.%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E7%9B%B4%E5%BE%84.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/543.%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E7%9B%B4%E5%BE%84.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/543.%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E7%9B%B4%E5%BE%84.py?fileGuid=xxQTRXtVcqtHK6j8)

例 5

[测试平台](https://leetcode-cn.com/problems/maximize-score-after-n-operations/?fileGuid=xxQTRXtVcqtHK6j8)

代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/1799.n-%E6%AC%A1%E6%93%8D%E4%BD%9C%E5%90%8E%E7%9A%84%E6%9C%80%E5%A4%A7%E5%88%86%E6%95%B0%E5%92%8C.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/1799.n-%E6%AC%A1%E6%93%8D%E4%BD%9C%E5%90%8E%E7%9A%84%E6%9C%80%E5%A4%A7%E5%88%86%E6%95%B0%E5%92%8C.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/1799.n-%E6%AC%A1%E6%93%8D%E4%BD%9C%E5%90%8E%E7%9A%84%E6%9C%80%E5%A4%A7%E5%88%86%E6%95%B0%E5%92%8C.py?fileGuid=xxQTRXtVcqtHK6j8)

练习题 8

[测试平台](https://leetcode-cn.com/problems/maximum-students-taking-exam/?fileGuid=xxQTRXtVcqtHK6j8)

代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/1349.%E5%8F%82%E5%8A%A0%E8%80%83%E8%AF%95%E7%9A%84%E6%9C%80%E5%A4%A7%E5%AD%A6%E7%94%9F%E6%95%B0.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/1349.%E5%8F%82%E5%8A%A0%E8%80%83%E8%AF%95%E7%9A%84%E6%9C%80%E5%A4%A7%E5%AD%A6%E7%94%9F%E6%95%B0.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/1349.%E5%8F%82%E5%8A%A0%E8%80%83%E8%AF%95%E7%9A%84%E6%9C%80%E5%A4%A7%E5%AD%A6%E7%94%9F%E6%95%B0.py?fileGuid=xxQTRXtVcqtHK6j8)

思考题

[测试平台](https://leetcode-cn.com/problems/new-21-game/description/?fileGuid=xxQTRXtVcqtHK6j8)

代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/837.%E6%96%B0-21-%E7%82%B9.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/837.%E6%96%B0-21-%E7%82%B9.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/14.DP/837.%E6%96%B0-21-%E7%82%B9.py?fileGuid=xxQTRXtVcqtHK6j8)