深度优先遍历（Depth First Search，简称 DFS） 与广度优先遍历（Breath First Search，简称 BFS）是图论中两种非常重要的算法，生产上广泛用于拓扑排序、寻路（走迷宫）、搜索引擎、爬虫等。因此，算法面试也经常考察这两种搜索算法。

在本讲，我们将重点介绍面试中常用的 DFS 与 BFS 代码技巧。学完本讲，你将收获：

*   DFS 搜索与剪枝
    
*   BFS 搜索与剪枝
    

让我们马上开始。

### DFS 概述

在玩迷宫游戏的时候，使用的策略就是 DFS，也就是当一条路走不通的时候，我们再尝试换一条路，直到走通为止。

下面我们也从这个游戏展开，一步一步得到常用的 DFS 解题模板。以下图为例，位置 0 表示出发点，然后只能上下左右四个方向移动，我们希望能从圆圈位置出发，最后走到五角星的终点位置。

![Drawing 0.png](https://s0.lgstatic.com/i/image6/M00/34/1A/Cgp9HWBwLIuAe-K4AAThUffhgBs401.png)

比如，刚从入口出发的时候，我们可以走到 1、2 这两个位置。如果用伪代码进表示，可以写出如下代码：

    void 走迷宫(int start) {
      位置1， 位置2 = getNextPos(start); // 拿到后继位置[1, 5]
    
      走迷宫(位置1)
      if success:
          找到出口-> return
    
      走迷宫(位置2出发)
      if success:
          找到出口-> return
    }
    

通过上面这样直白的代码，已经可以清晰地表达我们的思路了。但是还存在一些问题，下面我们一步一步讨论。

#### 问题 1

后面能走的位置只有 2 个的时候，处理起来是比较好写的。但是如果有很多位置都可以走呢？发现这种情况，就是时候**用循环**来改写我们的 DFS 模板了。

    void 走迷宫(int start) {
      for pos in getNextPos(start) {
          走迷宫(pos);
          if success {
              return;
          }
      }
    }
    

#### 问题 2

虽然上述代码中引入了 success 变量，但是并没有讨论什么时候才是 success。不过走迷宫，肯定是找到最终出口，才算是成功。于是我们可以将代码改写如下：

    void 走迷宫(int start) {
      if start == 五角星 { // <-- 成功了，当然不需要再走了
          success = true
          return
      }
      for pos in getNextPos(start) {
          走迷宫(pos);
          if success {
              return;
          }
      }
    }
    

#### 问题 3

另外，我们还需要处理一些重复的问题，比如下图所示的情况：

![Drawing 1.png](https://s0.lgstatic.com/i/image6/M00/34/1A/Cgp9HWBwLJiAVEFMAAPis02Ruvg421.png)

假设一下，当从位置 0 走到位置 2 之后，其代码应该如下：

    void 走迷宫(位置0) {
      [位置1, 位置2] = getNextPos(位置0)
      //.. 
      走迷宫(位置2); 
    }
    void 走迷宫(位置2) {
      [位置0, 位置1, 位置3， 位置4] = getNextPos(位置2)
      //...
      走迷宫(位置0);   // <---- 这里会再次访问位置0
    }
    

但是当路径如下图所示，两个位置存在环的情况时，就会一直在递归里面。

![Drawing 2.png](https://s0.lgstatic.com/i/image6/M00/34/23/CioPOWBwLJ-ATFhdAABKyVvexQk941.png)

那么，有没有什么办法可以处理这种回环问题呢？如果我们能够标记一下已经访问过的结点，就可以破解这个环了。

![Drawing 3.png](https://s0.lgstatic.com/i/image6/M00/34/1A/Cgp9HWBwLKaAD7D0AABYDtLlfjg808.png)

比如，当访问位置 0 之后，将其标记为“已访问”（绿色的叉），再从位置 2 遍历的时候，如果发现位置 0 已经访问过了，就不再访问。经过上述分析，代码可以更新如下：

    void 走迷宫(int start) {
      if start == 五角星 { // <-- 成功了，当然不需要再走了
          success = true
          return
      }
      for pos in getNextPos(start) {
          if (pos 已访问) continue;
          设置pos为已访问
          走迷宫(pos);
          if success {
              return;
          }
      }
    }
    

#### DFS 的模板 1

到这里，我们已经得到了 DFS 的模板伪代码。这里将 opt 设置为每次可以做出的选择，代码如下：

    boolean vis[N];
    void DFS(int start) {
      if start == end {
          success = true
          return
      }
      // 遍历当前可以做出的选择
      for opt in getOptions(start) {
          if (vis[opt]) continue;
          vis[opt] = true;
          dfs(opt);
          if success {
              return;
          }
      }
    }
    

接下来，我们尝试使用上面这个模板解决一些题目。

### DFS 连通域问题

#### 例 1：替换字母

【**题目**】给你一个矩阵 A，里面只包含字母 ‘O’ 和 'X'，如果一个 'O' 上下左右四周都被 'X' 包围，那么这个 'O' 会被替换成 'X'。请你写程序处理一下这个过程。

![Drawing 4.png](https://s0.lgstatic.com/i/image6/M00/34/1A/Cgp9HWBwLLCAcS1NAAA2jBxc2Hc121.png)

**解释**：由于中心的 'O' 四周都被 'X' 包围，所以需要被换成 'X'，而第 A\[0\]\[0\] = 'O' 靠着边，所以不能被替换。

【**分析**】我们曾经在“[第 07 讲｜并查集](https://kaiwu.lagou.com/course/courseInfo.htm?courseId=685#/detail/pc?id=6696&fileGuid=xxQTRXtVcqtHK6j8)”中讲解过这个题目。实际上，这道题还有另外一种思路。可以演示如下：

![1.gif](https://s0.lgstatic.com/i/image6/M00/34/1A/Cgp9HWBwLLmAe45dAAa82spZOiQ958.gif)

因此，这道题目的重点就是遍历每一个边缘的点，以及与之相邻的点。如果把这个问题的求解过程看成走迷宫，那么需要稍微做出两点变动。

*   原始问题中的走迷宫，需要用 vis 专门记录某**个点是否已经被访问过了**而这道题中，我们可以直接在给定的数组上进行标记（visited）。
    
*   原始问题中的走迷宫，需要走到某个具体的位置就结束。而这道题里，我们需要遍历所有相连的结点。
    

【**代码**】到这里，就可以写出如下代码了：

    class Solution {
        private char VIS = 'A';
        private int[][] dir = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};
        private int R, C;
        private void dfs(char[][] A, int r, int c) {
            for (int d = 0; d < 4; d++) {
                final int nr = r + dir[d][0];
                final int nc = c + dir[d][1];
                if (nr < 0 || nr >= R ||
                    nc < 0 || nc >= C) {
                    continue;
                }
                if (A[nr][nc] == 'O') {
                    A[nr][nc] = VIS;
                    dfs(A, nr, nc);
                }
            }
     
        }
        public void solve(char[][] A) {
            if (A == null || A.length == 0) {
                return;
            }
            R = A.length;
            C = A[0].length;
            // Step 1. 从边缘出发，遍历所有与之相邻的点。
            for (int r = 0; r < R; r++) {
                for (int c = 0; c < C; c++) {
                    if (r == 0 || c == 0 || 
                        r == R - 1 || c == C - 1) {
                        if (A[r][c] == 'O') {
                            A[r][c] = VIS;
                            dfs(A, r, c);
                        }
                    }
                }
            }
            // Step 2. 把所有未标记过的点，修改为'X', 并将标记过的点修改为'O'
            for (int r = 0; r < R; r++) {
                for (int c = 0; c < C; c++) {
                    if (A[r][c] != VIS) {
                        A[r][c] = 'X';
                    } else {
                        A[r][c] = 'O';
                    }
                }
            }
        }
    }
    

> 代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/130.%E8%A2%AB%E5%9B%B4%E7%BB%95%E7%9A%84%E5%8C%BA%E5%9F%9F.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/130.%E8%A2%AB%E5%9B%B4%E7%BB%95%E7%9A%84%E5%8C%BA%E5%9F%9F.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/130.%E8%A2%AB%E5%9B%B4%E7%BB%95%E7%9A%84%E5%8C%BA%E5%9F%9F.py?fileGuid=xxQTRXtVcqtHK6j8)

**复杂度分析**：每当一个点被 DFS 函数访问过之后，后面的 DFS 将不会再去访问它。因此整个程序的时间复杂度为 O(N)，其中 N 为点的总数。空间复杂度为递归的深度，最差情况下，递归深度可以达到 O(N) 级别（虽然深度不是 N，但是与 N 是线性函数，所以为 O(N)）。

【**小结**】我们总结一下这道题目，在经典的 DFS 模板的基础上，用 DFS 来求解边缘上的点，以及与之相连通的点。

因此，我们就收获了 DFS 的一个应用：**求解连通域**。你可以和我们之前学习“[第 07 讲｜并查集](https://kaiwu.lagou.com/course/courseInfo.htm?courseId=685#/detail/pc?id=6696&fileGuid=xxQTRXtVcqtHK6j8)”中求解连通域的方法进行比较。这里带你复习已学知识，同时巩固本讲介绍的新方法，我特地给你留了两道关于连通域的练习题，希望你不要偷懒，尝试求解一下。

**练习题 1**：给定一个黑白图像，其中白色像素用 '1' 表示，黑色像素用 '0' 表示。如果把上下左右相邻的白色像素看成一个连通域，给定一幅图（用矩阵表示），请问图中有几个连通域。

输入：A = \[\['1', '1', '0'\], \['0', '1', '0'\]\]

输出：1

**解释**：图中所有的 '1' 都是连在一起的，所以只有一个连通域。

> 代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/200.%E5%B2%9B%E5%B1%BF%E6%95%B0%E9%87%8F.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/200.%E5%B2%9B%E5%B1%BF%E6%95%B0%E9%87%8F.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/200.%E5%B2%9B%E5%B1%BF%E6%95%B0%E9%87%8F.py?fileGuid=xxQTRXtVcqtHK6j8)

**练习题 2**：给定一个图（不是图像）的矩阵，A\[i\]\[j\] = 1 表示点 i 与点 j 相连，求这个图里面连通域的数目。

输入：A = \[\[1,0,0\],\[0,1,0\],\[0,0,1\]\]

输出：3

**解释**：\[0, 1, 2\] 三个点中，每个点都不与其他点相连，所以连通域有 3 个。

> 代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/547.%E7%9C%81%E4%BB%BD%E6%95%B0%E9%87%8F.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/547.%E7%9C%81%E4%BB%BD%E6%95%B0%E9%87%8F.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/547.%E7%9C%81%E4%BB%BD%E6%95%B0%E9%87%8F.py?fileGuid=xxQTRXtVcqtHK6j8)

### DFS 最优解问题

**除了求解连通域之外，还可以利用 DFS 来搜寻最优解**。在一些面试题中，最终需要解决的是：

> 如何从所有可行解中找到最优解？

首先，我们将这些问题放宽，就退化为我们在“[12 | 回溯：我把回溯总结成一个公式，回溯题一出就用它](https://kaiwu.lagou.com/course/courseInfo.htm?courseId=685#/detail/pc?id=6701&fileGuid=xxQTRXtVcqtHK6j8)”介绍过的“回溯问题”。因此，我们需要在回溯的基础上，从所有解中，找到最优解。

![Drawing 6.png](https://s0.lgstatic.com/i/image6/M00/34/1B/Cgp9HWBwLMmAAEXKAADJJpVxkwY674.png)

#### DFS 的模板 2

如果题目中需要求解最优解，那么，DFS 问题就退化为回溯问题，只不过满足约束的条件就变成：“从所有解中找到最优解”。这里我再给出 DFS 的第 2 个模板。

    void dfs(A,
             int start, /* start 表示出发点*/
             vis,  /* 记录每个点是否已经访问 */
             path, /* 路径*/
             answer/*存放最优的答案*/) {
      final int N = A == null ? 0 : A.length;
     
      if (状态满足要求) { // 是更好的解吗？
        if (s better_than ans) {
            ans = s
        }
        return;
      }
    
      for next in {start点的后继点} {
        if !vis[next] {
          path.append(next);
          vis[next] = true;
          dfs(A, next, vis, path, answer);
          path.pop();
          vis[next] = false;
        }
      }
    }
    

注意，调用方的代码，在调用的时候，需要注意这样调用：

    vis[begin] = true;  // ！注意设置初始点为已访问
    path.append(begin); // ! 注意把begin放到path中。
    dfs(A, vis, path, ans)
    return ans;
    

#### 例 2：最短路径

【**题目**】给定一个迷宫，其中 0 表示可能通过的地方，而 1 表示墙壁。请问，从左上角走到右下角的最短路径是什么样的？请依次输出行走的点坐标。

输入：A = \[\[0, 1\], \[0, 0\]\]

输出：ans = \[\[0, 0\], \[1, 0\], \[1,1\]\]

解释：

![Drawing 7.png](https://s0.lgstatic.com/i/image6/M01/34/1B/Cgp9HWBwLNKAT4oJAABZGKVGoYU587.png)

【**分析**】最优路径如上图所示，如果两点在图中可达，那么这两个点肯定是在同一个连通域中。不难得出，这个题一定可以利用 DFS 进行求解。但是注意问题要求的是找到最优解，因此，我们还需要从**所有解**中找到**最优解**。此时就需要使用我们刚学过的 DFS 的模板 2 了。

【**代码**】问题本身已经非常模板化了，因此，我们可以直接写代码如下：

    class Node {
      public int r;
      public int c;
      public Node() {}
      public Node(int a, int b) {
        r = a;
        c = b;
      }
    }
    class Solution {
      private List<Node> shortPath = null;
      private int[][] dir = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};
      // 深度clone一个java list.
      private List<Node> Clone(List<Node> a) {
        List<Node> ans = new ArrayList<Node>();
        for (int i = 0; i < a.size(); i++) {
          Node x = a.get(i);
          ans.add(new Node(x.r, x.c));
        }
        return ans;
      }
      /**
       * @param A     迷宫图
       * @param vis   访问记录
       * @param r     出发点(r, c)
       * @param c
       * @param tmp   走到r,c的路径
       */
      public void dfs(int[][] A, boolean[][] vis, int r, int c, List<Node> tmp) {
        final int R = A.length;
        final int C = A[0].length;
        // 如果已经走到终点
        if (r == R - 1 && c == C - 1) {
          if (shortPath == null || shortPath.size() > tmp.size()) {
            shortPath = Clone(tmp);
          }
          return;
        }
        // 接下来看当前出发点的四个选择
        for (int d = 0; d < 4; d++) {
          final int nr = r + dir[d][0];
          final int nc = c + dir[d][1];
          // 如果是越界的
          if (nr < 0 || nr >= R || nc < 0 || nc >= C) {
            continue;
          }
          // 如果是不能访问的
          // 或者说已经访问过了
          if (A[nr][nc] == 1 || vis[nr][nc] == true) {
            continue;
          }
          vis[nr][nc] = true;
          tmp.add(new Node(nr, nc));
          dfs(A, vis, nr, nc, tmp);
          vis[nr][nc] = false;
          tmp.remove(tmp.size()-1);
        }
      }
      /**
       * @param A     的迷宫图
       * @return      路径的长度，所有的路径会存放在ans
       */
      public List<Node> findMinPath(int[][] A) {
        List<Node> ans = null;
        if (A == null || A[0].length == 0) {
          return ans;
        }
        final int R = A.length;
        final int C = A[0].length;
        boolean[][] vis = new boolean[R][C];
        // 路径最长为遍历所有的点
        List<Node> tmp = new ArrayList<Node>();
        // 出发点[0, 0]
        tmp.add(new Node(0, 0));
        vis[0][0] = true;
        dfs(A, vis, 0, 0, tmp);
        tmp.remove(tmp.size() - 1);
        vis[0][0] = false;
        return shortPath;
      }
    }
    

> 代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/P3984.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/P3984.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/P3984.py?fileGuid=xxQTRXtVcqtHK6j8)

**复杂度分析**：在最差情况下，一个 N x N 的图中，如果没有任何墙，那么所有的行走路径就是一个组合问题，这里可以简单归为 O(N!)，空间复杂度为 O(N)。

【**小结**】在这个简单的题目中，我们尝试使用 DFS + 回溯的思路来求解最优解的问题。有时候，这种一个一个遍历所有解，然后再从里面找到最优解的算法，也被叫作**暴力搜索**。

暴力搜索本质上与回溯的复杂度非常接近。因此，在可能的情况下，我们要尽可能地进行剪枝。所谓**剪枝**，就是通过一些信息，提前判断出当前这条求解路径不可能是最优解，此时就应该及时放弃这条路径。

这里我给出**剪枝 1**：比如，在暴力搜索的时候，我们已经遍历了很多条路径，并且更新了 ans 的情况下。如果发现，当前路径的长度已经 >= ans.size()，那么当前解肯定不能成为最优解，所以我们应该迅速返回，不要再继续寻找下去了。

经过上述分析，代码可以更新如下（代码其他部分仍然一样）：

      public void dfs() {
        // ... 
        // 如果已经走到终点
        if (r == R - 1 && c == C - 1) {
          if (shortPath == null || shortPath.size() > tmp.size()) {
            shortPath = Clone(tmp);
          }
          return;
        }
        // 剪枝1
        if (shortPath != null && tmp.size() >= shortPath.size()) return;
        // 接下来看当前出发点的四个选择
        // ...
    }
    

另外，我们还可以进行如下**剪枝 2**：虽然我们要找出到**终点**的最短路径，在这个过程中，可以把能走到每个位置的最少步数的情况都记录下来，当发现走到的位置的步数已经很大的时候，就可以直接返回。

经过上述分析，代码可以优化如下：

    // 初始化
        // 记录每个点的从出发点走的最小的步数，一开始为 R * C
        for (int r = 0; r < R; r++) {
          for (int c = 0; c < C; c++) {
            step[r][c] = R * C + 1;
          }
        }
    // dfs()
    void dfs() {
        // 如果已经走到终点
        // ....
        // 剪枝1
        if (shortPath != null && tmp.size() >= shortPath.size()) return;
    
        // 剪枝2
        // 如果发现走到step[r][c]比以前用了更多的步数，那么直接返回
        if (tmp.size() - 1 > step[r][c]) {
          return;
        }
        step[r][c] = tmp.size() - 1;
        // 接下来看当前出发点的四个选择
        // ... 
    }
    

> 代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/P3984.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/P3984.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/P3984.py?fileGuid=xxQTRXtVcqtHK6j8)

下面我们再看一个经典的国际象棋“皇后问题”。你可以通过下面这个练习题想一想，如何有效地进行剪枝吗？

**练习题 3**：给定一个 n x n 的棋盘，里面要放置 n 个皇后。使它们不能相互攻击。

输入：n = 4

输出：

\[

\[".Q..", // 解法 1

"...Q",

"Q...",

"..Q."\],

\["..Q.", // 解法 2

"Q...",

"...Q",

".Q.."\]

\]

解释：当棋盘为 4 x 4 的时候，只有这两种解。

> 代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/%E5%85%AB%E7%9A%87%E5%90%8E.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/%E5%85%AB%E7%9A%87%E5%90%8E.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/%E5%85%AB%E7%9A%87%E5%90%8E.py?fileGuid=xxQTRXtVcqtHK6j8)

**练习题 4**：给定一个字符串，需要把这个字符串切分为很多子串，还需满足：每个子串都是回文串。返回所有的切分方式。

输入：s = "aab"

输出: ans = \['a', 'a', 'b'\], \['aa', 'b'\]

> 代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/131.%E5%88%86%E5%89%B2%E5%9B%9E%E6%96%87%E4%B8%B2.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/131.%E5%88%86%E5%89%B2%E5%9B%9E%E6%96%87%E4%B8%B2.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/131.%E5%88%86%E5%89%B2%E5%9B%9E%E6%96%87%E4%B8%B2.py?fileGuid=xxQTRXtVcqtHK6j8)

### DFS 记忆化搜索

关于记忆化搜索，依然从一个简单的例子讲起：斐波那契数列。我们都知道这个数列的通项公式为：

> F(0) = 0, F(1) = 1, F\[n\] = F\[n-1\] + F\[n-2\]

现在要写一个函数求 F(x)。直接根据公式，可以得到递归代码如下（当然，我们也可以认为 DFS 是一种递归）：

    class Solution {
        public int fib(int n) {
            return n <= 1 ? n : fib(n-1) + fib(n-2);
        }
    }
    

但是这个算法存在**重复计算**，导致复杂度极高。比如，如下图所示，我们发现 fib(5) 实际上是会被重复计算的。

![Drawing 8.png](https://s0.lgstatic.com/i/image6/M01/34/23/CioPOWBwLOWAcfi0AABecQ3YNpQ910.png)

为了减少这种重复计算，可以有两种办法：

*   把计算的结果存下来，后面遇到的时候，就直接返回；
    
*   使用动态规划。
    

在这里我们采用的方式是把计算的结果存下来。那么代码可以更新如下：

    class Solution {
        int[] mem = new int[100];
        public int fib(int n) {
            if (n <= 1) {
                return n;
            }
            if (mem[n] > 0) {
                return mem[n];
            }
            return mem[n] = fib(n-1) + fib(n-2);
        }
    }
    

采用“把计算结果存下来”的方法，思路清晰，比较容易想到，代码也比较容易实现。因此，当你遇到有的动态规划的题目无法打开思路的时候，不妨尝试采用这种思路。

#### 例 3：整数拆分

【**题目**】给定一个数组，表示钱的面额，每种面额，你都有无穷多张钱。再给定一个整数 T，你需要用最少的钞票来表示这个整数。无法表示的时候，输出 -1。

输入：A = \[1, 2\], T = 3

输出：2

解释：只需要1 + 2 = 3，所以最少你需要 2 张钞票。

【**分析**】首先，我们可以只考虑 DFS 递归的情况，代码如下：

    int dfs(int []A, int T) { // 在调用dfs的程序里面处理-1的问题
      for (int x: A)
        if (T == x) return 1;
      int ans = INF;
      for (int x: A) {
        if (x <= T) ans = min(ans, dfs(A,T-x) + 1);
      }
      return ans;
    }
    

在给定 A = \[1, 2\]，T= 5 情况下，那么伪代码展开如下：

![Drawing 9.png](https://s0.lgstatic.com/i/image6/M01/34/23/CioPOWBwLO2AJ8fuAACFHV631AQ678.png)

我们可以发现，在不断地求解的过程，总是有很多数会被重复地计算。因此，很容易想到，把一些中间的结果存下来，以便后面使用。

**边界**：这个题的思路本身不是特别难。但是在写代码的时候，要考虑到各种特殊情况，比如：

*   T 小于等于 0
    
*   DFS 返回值的设计
    

【**代码**】根据上面的分析，我们就可以写出如下代码了：

    class Solution {
        private int INF = Integer.MAX_VALUE >> 2;
        private Set<Integer> has = new HashSet<>();
        private Map<Integer, Integer> H = new HashMap<>();
        private void Build(int[] A) {
            for (int x : A) {
                has.add(x);
                H.put(x, 1);
            }
        }
        private int dfs(int[] A, int T) {
            if (T < 0) {
                return INF;
            }
            if (H.containsKey(T)) {
                return H.get(T);
            }
            int ans = INF;
            for (int x : A) {
                ans = Math.min(ans, dfs(A, T - x) + 1);
            }
            H.put(T, ans);
            return ans;
        }
        public int coinChange(int[] A, int T) {
            if (T < 0)
                return -1;
            if (T == 0)
                return 0;
            Build(A);
            int ans = dfs(A, T);
            return ans >= INF ? -1 : ans;
        }
    }
    

> 代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/322.%E9%9B%B6%E9%92%B1%E5%85%91%E6%8D%A2.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/322.%E9%9B%B6%E9%92%B1%E5%85%91%E6%8D%A2.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/322.%E9%9B%B6%E9%92%B1%E5%85%91%E6%8D%A2.py?fileGuid=xxQTRXtVcqtHK6j8)

**复杂度分析**：当给定的数为 T 时，最大递归深度为 T，每次递归需要依次遍历数组 A 的每个元素。因此，时间复杂度为 O(TN)，其中 N 为数组中元素的个数，空间复杂度为 O(T)。

【**小结**】在这里，每次搜索的时候，都要尽可能把相应的结果记录下来。不过在处理的细节上，有以下几点需要注意：

*   优先处理容易返回的路径，比如 T 小于 0，T 等于 0；
    
*   把不能求解的答案也进行了标记；
    
*   DFS 的返回值设置为 INF，在调用方再根据 DFS 的返回值决定是否返回 -1。
    

**练习题 5**：给定一个三角形的整数排列，返回从上往下的路径的最小和。

输入：triangle = \[\[2\],\[3,4\],\[6,5,7\],\[4,1,8,3\]\]

输出：11

请参见如下简图：

![Drawing 10.png](https://s0.lgstatic.com/i/image6/M01/34/1B/Cgp9HWBwLPeAOH86AAAlXdhkCDc684.png)

自顶向下的最小路径和为 11（即 2 + 3 + 5 + 1 = 11）

> 代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/120.%E4%B8%89%E8%A7%92%E5%BD%A2%E6%9C%80%E5%B0%8F%E8%B7%AF%E5%BE%84%E5%92%8C.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/120.%E4%B8%89%E8%A7%92%E5%BD%A2%E6%9C%80%E5%B0%8F%E8%B7%AF%E5%BE%84%E5%92%8C.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/120.%E4%B8%89%E8%A7%92%E5%BD%A2%E6%9C%80%E5%B0%8F%E8%B7%AF%E5%BE%84%E5%92%8C.py?fileGuid=xxQTRXtVcqtHK6j8)

**记忆化搜索是动态规划的基础。如果你发现一些题目考察的是动态规划，但却不容易求解的时候，可以尝试使用记忆化搜索来进行破解**。

### BFS 概述

DFS 可以帮助我们找到最优解。不过在搜索的时候，若想知道一些关于“最近/最快/最少”之类问题的答案，往往采用 BFS 更加适合。

那么，什么是 BFS？搜索时，BFS 与 DFS 又有什么不同？我们可以利用下图表示：

![2.gif](https://s0.lgstatic.com/i/image6/M01/34/1B/Cgp9HWBwLQCALyAGAAJmqIpaing759.gif)

实际上，我们在“[02 | 队列：FIFO 队列与单调队列的深挖与扩展](https://kaiwu.lagou.com/course/courseInfo.htm?courseId=685#/detail/pc?id=6691&fileGuid=xxQTRXtVcqtHK6j8)”介绍队列时，就已经讲过了 BFS，并且介绍了 BFS 的两种方法与模板。为了方便你复习，将新知识与旧知识联系起来，我把“[第 02 讲](https://kaiwu.lagou.com/course/courseInfo.htm?courseId=685#/detail/pc?id=6691&fileGuid=xxQTRXtVcqtHK6j8)”例 1 中介绍的两种方法的代码链接放在这里，你可以再次动手敲一敲。

> 二叉树层次遍历解法 1 代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/02.Queue/01.TreeLevelOrder.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/02.Queue/01.TreeLevelOrder.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/02.Queue/01.TreeLevelOrder.py?fileGuid=xxQTRXtVcqtHK6j8)  
> 二叉树层次遍历解法 2 代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/02.Queue/01.2.TreeLevelOrder.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/02.Queue/01.2.TreeLevelOrder.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/02.Queue/01.2.TreeLevelOrder.py?fileGuid=xxQTRXtVcqtHK6j8)

通过把“[第 02 讲](https://kaiwu.lagou.com/course/courseInfo.htm?courseId=685#/detail/pc?id=6691&fileGuid=xxQTRXtVcqtHK6j8)”的例 1 进行一个归纳，我整理了较为通用的 BFS 的代码模板供你面试时使用，如下所示：

    bfs(s) { // s表示出发点
      q = new queue()
      q.push(s), visited[s] = true // 标记s为已访问
      while (!q.empty()) {
        u = q.pop() // 拿到当前结点 
        for next in getNext(u) { // 拿到u的后继next
          if (!visited[next]) { // 如果next还没有访问过 
            q.push(next)
            visited[next] = true
          }
        }
      }
    }
    

接下来，我们看一些可以利用 BFS 解决的面试的题目。

#### 例 4：最短路径

【**题目**】给定一个矩阵，矩阵中只有 0，1，其中 0 表示可以通行的路径，1 表示墙，请返回从左上角走到右下角的最短路径。（注意：这个题里面有 8 个方向可以走，也就是可以斜着走），如果不存在这样的路径，那么返回 -1。

输入：grid = \[\[0,0,0\],\[1,1,0\],\[1,1,0\]\]

输出：4

解释：行走路线如下图所示，只需要走 4 个格子。（注意有个位置走了斜线）。

![Drawing 12.png](https://s0.lgstatic.com/i/image6/M01/34/24/CioPOWBwLQuAQTCsAACOuVJFPZQ600.png)

【**分析**】用 BFS 求解问题的时候：**只需要注意一个点的选择**。

对于矩阵中的某个点，由于可以斜线走，那么一共有 8 个方向，如下图所示：

![Drawing 13.png](https://s0.lgstatic.com/i/image6/M01/34/24/CioPOWBwLRGAbDsbAABwTsMVzOo426.png)

那么找下一个点的时候，可以这样写代码：

    int[][] dir = {
        {0, 1}  /*右*/,
        {0, -1} /*左*/,
        {1, 0}  /*下*/,
        {-1, 0} /*上*/,
        {-1,-1} /*左上*/,
        {-1,1}  /*右上*/,
        {1,-1}  /*左下*/,
        {1,1}   /*右下*/,
    };
    for(int d = 0;d<8;d++) {
        int nr = r + dir[d][0];
        int nc = c + dir[d][1];
        if (!(nr < 0 || nc < 0 || nr >= R || nc >= C)) {
          // 处理点 (nr, nc)
        }
    }
    

这就轻松解决获取下一个点的问题。此外，我们还需要把已经访问过的点进行标记，以防止重复访问。不过，这里可以采用原地标记的方式，直接将给定的数组里面的 0 改成 1，表示已经访问过了。

【**代码**】再根据前面给定的模板我们可以得到如下的代码：

    class Solution {
        public int shortestPathBinaryMatrix(int[][] A) {
            int[][] dir = {
                {0, 1}  /*右*/,
                {0, -1} /*左*/,
                {1, 0}  /*下*/,
                {-1, 0} /*上*/,
                {-1,-1} /*左上*/,
                {-1,1}  /*右上*/,
                {1,-1}  /*左下*/,
                {1,1}   /*右下*/,
            };
            // 拿到矩阵的Row, Col
            final int R = A == null ? 0 : A.length;
            final int C = R > 0 ? (A[0] == null ? 0 : A[0].length) : 0;
            // 首先处理特殊情况
            // 为空，或者只有一个格子
            if (R <= 1 || C <= 1) {
                return Math.min(R, C);
            }
            // 首先处理起始点
            // 如果起始点或者说终点已经是1
            // 那么返回-1
            if (A[0][0] == 1 || A[R - 1][C - 1] == 1) {
                return -1;
            }
            Queue<int[]> Q = new LinkedList<>();
            int[] cur = new int[2]; // {0,0}
            // 将起始点 入队， 并且标记为已访问
            Q.add(cur);
            A[cur[0]][cur[1]] = 1;
            // 一开始就会占用一个格子
            int ans = 0;
            while (!Q.isEmpty()) {
                ans++;
                // 注意这里类似二叉树层次遍历的做法，取出qSize
                // 可以一层一层的遍历。
                int QSize = Q.size();
                while (QSize-- > 0) {
                    cur = Q.remove();
                    // 如果已经走到了目的地
                    if (cur[0] == (R - 1) && cur[1] == (C - 1)) {
                        return ans;
                    }
                    for (int d = 0; d < 8; d++) {
                        int nr = cur[0] + dir[d][0];
                        int nc = cur[1] + dir[d][1];
                        if (!(nr < 0 || nc < 0 || nr >= R || nc >= C)) {
                            if (A[nr][nc] != 1) {
                                A[nr][nc] = 1;
                                Q.add(new int[] { nr, nc });
                            }
                        }
                    }
                }
            }
            return -1;
        }
    }
    

> 代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/1091.%E4%BA%8C%E8%BF%9B%E5%88%B6%E7%9F%A9%E9%98%B5%E4%B8%AD%E7%9A%84%E6%9C%80%E7%9F%AD%E8%B7%AF%E5%BE%84.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/1091.%E4%BA%8C%E8%BF%9B%E5%88%B6%E7%9F%A9%E9%98%B5%E4%B8%AD%E7%9A%84%E6%9C%80%E7%9F%AD%E8%B7%AF%E5%BE%84.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/1091.%E4%BA%8C%E8%BF%9B%E5%88%B6%E7%9F%A9%E9%98%B5%E4%B8%AD%E7%9A%84%E6%9C%80%E7%9F%AD%E8%B7%AF%E5%BE%84.py?fileGuid=xxQTRXtVcqtHK6j8)

**复杂度分析**：最差情况下，每个点都需要入队出队一次，这里我们使用的是 FIFO 队列，出队入队时间复杂度为 O(1)，如果有 N 个点，时间复杂度为 O(N)。最差情况下所有的点都在队列中，那么空间复杂度为 O(N)。

【**小结**】注意这个题与例 2 的区别在于：例 2 中，每次行走的时候只有 4 个方向，上下左右。而这道题目有 8 个方向可以行走。

这里我们发现了“**最短**”两个关键字，因此，决定使用 BFS 进行搜索。不过实际上，例 2 也可以使用 BFS 来搜索，而例 4 也可以使用 DFS 进行求解。

接下来，我们看另外一类 BFS 可以求解的题目。

#### 例 5：最安全的路径

【**题目**】在一个无向图上，给定点个数 n，编号从 \[0~n\]，再给定边的个数 m。其中每条边由x\[i\], y\[i\], w\[i\] 表示。x\[i\], y\[i\] 分别表示边上两点的编号而 w\[i\] 表示这边条的危险系数。现在我们想找到一条路径从 0~n，使得这条**路径上最大危险系数最小**。（注意：不是路径和最小，而是路径上的最大值最小）。

输入：n = 2, m = 2, x\[\] = \[0, 1\], y\[\] = \[1,2\], w\[\]=\[1,2\]

输出：2

解释：注意两条边的表示：边 1：(x\[0\]=0, y\[0\]=1, w\[0\]=1), 边 2：（x\[1\] = 1, y\[1\] =2, w\[1\]=2)。所以形成了下图：

![Drawing 14.png](https://s0.lgstatic.com/i/image6/M01/34/1C/Cgp9HWBwLR6ABiN2AABX1UDDRPI404.png)

形成的路径为 0 → 1 → 2，路径最大危险系数为 2，所以输出 2。

注意：后面用 <x, y, c> 表示 x 到 y 这条边上的危险系数为 c。

【**分析**】当我们看到“最 X"这样的词语的时候，应该条件反射地想到用 BFS。

![Drawing 15.png](https://s0.lgstatic.com/i/image6/M01/34/1C/Cgp9HWBwLSaAX_SNAAB80QBZWDQ335.png)

不过，在用 BFS 的时候，我们需要先进行一个简单的模拟。

第一轮的时候，如果我们还使用 FIFO 队列。那么有**走法 1**：从 0 出发，走边 <0, 2, 6> 到达 2。

![Drawing 16.png](https://s0.lgstatic.com/i/image6/M01/34/1C/Cgp9HWBwLSyAf36tAACQmcVkKzc136.png)

但实际上，还有**走法 2**：从结点 0 走到结点 1，再从结点 1 走到结点 2，路径为 \[<0,1,1>, <1,2,2>\]。

![Drawing 17.png](https://s0.lgstatic.com/i/image6/M01/34/24/CioPOWBwLTSAWneeAACOornImaQ886.png)

这种走法，危险系数仅为 2。

如果我们在 BFS 的时候，先遍历到**走法 1**，再遍历到**走法 2**。此时，走到结点 2 的危险系数需要更新 2 次。

那么，出现这种反复更新的情况的根本原因为：我们将更差劲的走法安排在了前面。

那么，有没有什么办法可以把更好的走法安排在前面呢？这个时候，就需要使用我们“[03 | 优先级队列：堆与优先级队列，筛选最优元素](https://kaiwu.lagou.com/course/courseInfo.htm?courseId=685#/detail/pc?id=6692&fileGuid=xxQTRXtVcqtHK6j8)”学过的数据结构了：优先级队列。

我们可以把优先级队列想象成一个袋子，每次从袋子里面拿东西的时候，总是从里面拿出优先级最高的结果。

【**代码**】基于这样的思路，可以写出代码如下：

    public class Solution {
      class Node {
        public int node = 0;
        public int risk = 0;
        public Node() {
        }
        public Node(int a, int b) {
          node = a;
          risk = b;
        }
      }
      public int getMinRiskValue(int n, int m,
                                 int[] x, int[] y, int[] w) {
        // 构建图的表示
        List<Node> G[] = new ArrayList[n + 1];
        for (int i = 0; i < n + 1; i++) {
          G[i] = new ArrayList<>();
        }
        for (int i = 0; i < m; i++) {
          final int a = x[i], b = y[i], c = w[i];
          G[a].add(new Node(b, c));
          G[b].add(new Node(a, c));
        }
        int[] risk = new int[n + 1];
        for (int i = 0; i <= n; i++) {
          risk[i] = Integer.MAX_VALUE;
        }
        // java小堆
        Queue<Integer> Q = new PriorityQueue<>(
                    (v1, v2) -> risk[v1] - risk[v2]);
        // 把起始点入堆
        Q.offer(0);
        risk[0] = 0;
        while (!Q.isEmpty()) {
          int cur = Q.poll();
          for (Node next : G[cur]) {
            final int back = next.node;
            final int backRisk = Math.max(risk[cur], next.risk);
            if (backRisk < risk[back]) {
              risk[back] = backRisk;
              Q.offer(back);
            }
          }
        }
        return risk[n];
      }
    }
    

> 代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/783._Minimum_Risk_Path.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/783._Minimum_Risk_Path.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/783._Minimum_Risk_Path.py?fileGuid=xxQTRXtVcqtHK6j8)

**复杂度分析**：最差情况下，一共有 N 个点，所有的结点都需要入队，出队一次。每次出入队的时间复杂度为 O(lgN)，所以整个算法的时间复杂度为 O(NlgN)。

【**小结**】通过这个题，我们可以发现：

*   路径之间，需要**优先处理**的情况，直接用优先级队列替换 FIFO 队列；
    
*   有重复更新的情况，使用优先级队列。
    

为了练习这个技巧，我再给你留了一道练习题，请你尝试自己求解一下。

**练习题 6**：在一个 N x N 的坐标方格 grid 中，每一个方格的值 grid\[i\]\[j\] 表示在位置 (i,j) 的平台高度。现在开始下雨了。当时间为 t 时，此时雨水导致水池中任意位置的水位为 t 。你可以从一个平台游向四周相邻的任意一个平台，但是前提是此时水位必须同时淹没这两个平台。假定你可以瞬间移动无限距离，也就是默认在方格内部游动是不耗时的。当然，在你游泳的时候你必须待在坐标方格里面。你从坐标方格的左上平台 (0，0) 出发。最少耗时多久你才能到达坐标方格的右下平台 (N-1, N-1)？

> 代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/778.%E6%B0%B4%E4%BD%8D%E4%B8%8A%E5%8D%87%E7%9A%84%E6%B3%B3%E6%B1%A0%E4%B8%AD%E6%B8%B8%E6%B3%B3.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/778.%E6%B0%B4%E4%BD%8D%E4%B8%8A%E5%8D%87%E7%9A%84%E6%B3%B3%E6%B1%A0%E4%B8%AD%E6%B8%B8%E6%B3%B3.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/778.%E6%B0%B4%E4%BD%8D%E4%B8%8A%E5%8D%87%E7%9A%84%E6%B3%B3%E6%B1%A0%E4%B8%AD%E6%B8%B8%E6%B3%B3.py?fileGuid=xxQTRXtVcqtHK6j8)

### 总结

在本讲中，介绍了两种搜索：DFS 和 BFS。不过这里我们还没有讲遇到什么样的题目的时候，应该使用什么样的搜索？

这需要你根据不同情况，结合今天所讲的内容综合分析。最后，我凭借一些自己积累的经验，带你总结一下 DFS 和 BFS 这两种搜索的区别，

1.  如果要像回溯似的处理每一种可能性，那么用 DFS 更加方便，也更加节省内存。因为 BFS 相当于是会存储下所有的解，在某些时候，内存占用率会比较可观。
    
2.  一些开放式搜索问题，使用 BFS 则更加方便，比如：在一个无边界的二维平面上，要从某个点 Start 出发，按照一定规则走到另外一个点 End，求最小路径。由于是开放式的边界，那么使用 DFS，会一直递归下去。
    
3.  条件的选择具有优先级的时候，使用 BFS + 优先级队列更加方便。
    
4.  一些类似动态规划的题目，使用 DFS + 记忆化搜索更加方便。
    

为了方便你复习，我将本讲的知识点总结如下：

![Drawing 18.png](https://s0.lgstatic.com/i/image6/M01/34/24/CioPOWBwLT-ABq5WAADkE8e9C7Y414.png)

### 思考题

最后我再给你留一个思考题。

数字`n`代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且**有效的**括号组合。

输入：n = 3

输出：\["((()))","(()())","(())()","()(())","()()()"\]

> DP 解法：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/22.DP/22.%E6%8B%AC%E5%8F%B7%E7%94%9F%E6%88%90.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/22.DP/22.%E6%8B%AC%E5%8F%B7%E7%94%9F%E6%88%90.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/22.DP/22.%E6%8B%AC%E5%8F%B7%E7%94%9F%E6%88%90.py?fileGuid=xxQTRXtVcqtHK6j8)  
> BFS 解法 1：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/22.%E4%B8%A4%E6%AE%B5%E5%87%BB/22.%E6%8B%AC%E5%8F%B7%E7%94%9F%E6%88%90.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/22.%E4%B8%A4%E6%AE%B5%E5%87%BB/22.%E6%8B%AC%E5%8F%B7%E7%94%9F%E6%88%90.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/22.%E4%B8%A4%E6%AE%B5%E5%87%BB/22.%E6%8B%AC%E5%8F%B7%E7%94%9F%E6%88%90.py?fileGuid=xxQTRXtVcqtHK6j8)  
> BFS 解法 2：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/22.%E9%98%9F%E5%88%97/22.%E6%8B%AC%E5%8F%B7%E7%94%9F%E6%88%90.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/22.%E9%98%9F%E5%88%97/22.%E6%8B%AC%E5%8F%B7%E7%94%9F%E6%88%90.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/22.%E9%98%9F%E5%88%97/22.%E6%8B%AC%E5%8F%B7%E7%94%9F%E6%88%90.py?fileGuid=xxQTRXtVcqtHK6j8)  
> DFS 解法：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/22.%E5%9B%9E%E6%BA%AF/22.%E6%8B%AC%E5%8F%B7%E7%94%9F%E6%88%90.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/22.%E5%9B%9E%E6%BA%AF/22.%E6%8B%AC%E5%8F%B7%E7%94%9F%E6%88%90.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/22.%E5%9B%9E%E6%BA%AF/22.%E6%8B%AC%E5%8F%B7%E7%94%9F%E6%88%90.py?fileGuid=xxQTRXtVcqtHK6j8)

关于 DFS 和 BFS 我们就介绍到这里，后面我们将要学习“14 | DP：我是怎么治好“DP 头痛症”的？”。让我们继续前进。

### 附：题目出处和代码汇总

例 1：替换字母

[测试平台](https://leetcode-cn.com/problems/surrounded-regions/?fileGuid=xxQTRXtVcqtHK6j8)

代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/130.%E8%A2%AB%E5%9B%B4%E7%BB%95%E7%9A%84%E5%8C%BA%E5%9F%9F.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/130.%E8%A2%AB%E5%9B%B4%E7%BB%95%E7%9A%84%E5%8C%BA%E5%9F%9F.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/130.%E8%A2%AB%E5%9B%B4%E7%BB%95%E7%9A%84%E5%8C%BA%E5%9F%9F.py?fileGuid=xxQTRXtVcqtHK6j8)

练习题 1

[测试平台](https://leetcode-cn.com/problems/number-of-islands/description/?fileGuid=xxQTRXtVcqtHK6j8)

代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/200.%E5%B2%9B%E5%B1%BF%E6%95%B0%E9%87%8F.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/200.%E5%B2%9B%E5%B1%BF%E6%95%B0%E9%87%8F.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/200.%E5%B2%9B%E5%B1%BF%E6%95%B0%E9%87%8F.py?fileGuid=xxQTRXtVcqtHK6j8)

练习题 2

[测试平台](https://leetcode-cn.com/problems/number-of-provinces/description/?fileGuid=xxQTRXtVcqtHK6j8)

代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/547.%E7%9C%81%E4%BB%BD%E6%95%B0%E9%87%8F.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/547.%E7%9C%81%E4%BB%BD%E6%95%B0%E9%87%8F.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/547.%E7%9C%81%E4%BB%BD%E6%95%B0%E9%87%8F.py?fileGuid=xxQTRXtVcqtHK6j8)

例 2：最短路径

[测试平台](http://poj.org/problem?id=3984&fileGuid=xxQTRXtVcqtHK6j8)

代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/P3984.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/P3984.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/P3984.py?fileGuid=xxQTRXtVcqtHK6j8)

练习题 3：n 皇后

[测试平台](https://leetcode-cn.com/problems/eight-queens-lcci/?fileGuid=xxQTRXtVcqtHK6j8)

代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/%E5%85%AB%E7%9A%87%E5%90%8E.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/%E5%85%AB%E7%9A%87%E5%90%8E.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/%E5%85%AB%E7%9A%87%E5%90%8E.py?fileGuid=xxQTRXtVcqtHK6j8)

练习题 4：分割回文串

[测试平台](https://leetcode-cn.com/problems/palindrome-partitioning/description/?fileGuid=xxQTRXtVcqtHK6j8)

代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/131.%E5%88%86%E5%89%B2%E5%9B%9E%E6%96%87%E4%B8%B2.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/131.%E5%88%86%E5%89%B2%E5%9B%9E%E6%96%87%E4%B8%B2.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/131.%E5%88%86%E5%89%B2%E5%9B%9E%E6%96%87%E4%B8%B2.py?fileGuid=xxQTRXtVcqtHK6j8)

例 3：整数拆分

[测试平台](https://leetcode-cn.com/problems/coin-change/description/?fileGuid=xxQTRXtVcqtHK6j8)

代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/322.%E9%9B%B6%E9%92%B1%E5%85%91%E6%8D%A2.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/322.%E9%9B%B6%E9%92%B1%E5%85%91%E6%8D%A2.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/322.%E9%9B%B6%E9%92%B1%E5%85%91%E6%8D%A2.py?fileGuid=xxQTRXtVcqtHK6j8)

练习题 5：最小路径和

[测试平台](https://leetcode-cn.com/problems/triangle/description/?fileGuid=xxQTRXtVcqtHK6j8)

代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/120.%E4%B8%89%E8%A7%92%E5%BD%A2%E6%9C%80%E5%B0%8F%E8%B7%AF%E5%BE%84%E5%92%8C.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/120.%E4%B8%89%E8%A7%92%E5%BD%A2%E6%9C%80%E5%B0%8F%E8%B7%AF%E5%BE%84%E5%92%8C.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Pytho](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/120.%E4%B8%89%E8%A7%92%E5%BD%A2%E6%9C%80%E5%B0%8F%E8%B7%AF%E5%BE%84%E5%92%8C.py?fileGuid=xxQTRXtVcqtHK6j8)

例 4：最短路径

[测试平台](https://leetcode-cn.com/problems/shortest-path-in-binary-matrix/?fileGuid=xxQTRXtVcqtHK6j8)

代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/1091.%E4%BA%8C%E8%BF%9B%E5%88%B6%E7%9F%A9%E9%98%B5%E4%B8%AD%E7%9A%84%E6%9C%80%E7%9F%AD%E8%B7%AF%E5%BE%84.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/1091.%E4%BA%8C%E8%BF%9B%E5%88%B6%E7%9F%A9%E9%98%B5%E4%B8%AD%E7%9A%84%E6%9C%80%E7%9F%AD%E8%B7%AF%E5%BE%84.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/1091.%E4%BA%8C%E8%BF%9B%E5%88%B6%E7%9F%A9%E9%98%B5%E4%B8%AD%E7%9A%84%E6%9C%80%E7%9F%AD%E8%B7%AF%E5%BE%84.py?fileGuid=xxQTRXtVcqtHK6j8)

例 5：最安全的路径

[测试平台](https://www.lintcode.com/problem/minimum-risk-path/?fileGuid=xxQTRXtVcqtHK6j8)

代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/783._Minimum_Risk_Path.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/783._Minimum_Risk_Path.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/783._Minimum_Risk_Path.py?fileGuid=xxQTRXtVcqtHK6j8)

练习题 6：水位线

[测试平台](https://leetcode-cn.com/problems/swim-in-rising-water/?fileGuid=xxQTRXtVcqtHK6j8)

代码：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/778.%E6%B0%B4%E4%BD%8D%E4%B8%8A%E5%8D%87%E7%9A%84%E6%B3%B3%E6%B1%A0%E4%B8%AD%E6%B8%B8%E6%B3%B3.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/778.%E6%B0%B4%E4%BD%8D%E4%B8%8A%E5%8D%87%E7%9A%84%E6%B3%B3%E6%B1%A0%E4%B8%AD%E6%B8%B8%E6%B3%B3.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/778.%E6%B0%B4%E4%BD%8D%E4%B8%8A%E5%8D%87%E7%9A%84%E6%B3%B3%E6%B1%A0%E4%B8%AD%E6%B8%B8%E6%B3%B3.py?fileGuid=xxQTRXtVcqtHK6j8)

思考题

[测试平台](https://leetcode-cn.com/problems/generate-parentheses/?fileGuid=xxQTRXtVcqtHK6j8)

DP 解法：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/22.DP/22.%E6%8B%AC%E5%8F%B7%E7%94%9F%E6%88%90.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/22.DP/22.%E6%8B%AC%E5%8F%B7%E7%94%9F%E6%88%90.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/22.DP/22.%E6%8B%AC%E5%8F%B7%E7%94%9F%E6%88%90.py?fileGuid=xxQTRXtVcqtHK6j8)  
BFS 解法 1：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/22.%E4%B8%A4%E6%AE%B5%E5%87%BB/22.%E6%8B%AC%E5%8F%B7%E7%94%9F%E6%88%90.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/22.%E4%B8%A4%E6%AE%B5%E5%87%BB/22.%E6%8B%AC%E5%8F%B7%E7%94%9F%E6%88%90.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/22.%E4%B8%A4%E6%AE%B5%E5%87%BB/22.%E6%8B%AC%E5%8F%B7%E7%94%9F%E6%88%90.py?fileGuid=xxQTRXtVcqtHK6j8)  
BFS 解法 2：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/22.%E9%98%9F%E5%88%97/22.%E6%8B%AC%E5%8F%B7%E7%94%9F%E6%88%90.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/22.%E9%98%9F%E5%88%97/22.%E6%8B%AC%E5%8F%B7%E7%94%9F%E6%88%90.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/22.%E9%98%9F%E5%88%97/22.%E6%8B%AC%E5%8F%B7%E7%94%9F%E6%88%90.py?fileGuid=xxQTRXtVcqtHK6j8)  
DFS 解法：[Java](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/22.%E5%9B%9E%E6%BA%AF/22.%E6%8B%AC%E5%8F%B7%E7%94%9F%E6%88%90.java?fileGuid=xxQTRXtVcqtHK6j8)/[C++](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/22.%E5%9B%9E%E6%BA%AF/22.%E6%8B%AC%E5%8F%B7%E7%94%9F%E6%88%90.cpp?fileGuid=xxQTRXtVcqtHK6j8)/[Python](https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/22.%E5%9B%9E%E6%BA%AF/22.%E6%8B%AC%E5%8F%B7%E7%94%9F%E6%88%90.py?fileGuid=xxQTRXtVcqtHK6j8)