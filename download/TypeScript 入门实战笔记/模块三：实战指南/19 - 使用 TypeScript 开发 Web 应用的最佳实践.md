18 讲我们学习了如何使用 TypeScript 开发运行 Node.js 端的静态文件服务模块，然而对于大多数的前端人而言，Web 端可能才是主战场。因此，这一讲我们将从 DOM 原生操作和 React 框架这两个方面学习 Web + TypeScript 开发实践。

> 学习建议：请按照这一讲中的操作步骤，实践一个完整的开发流程。

### DOM 原生操作

无论我们使用前端框架与否，都免不了需要使用原生操作接口，因此将 TypeScript 与 DOM 原生操作组合起来进行学习很有必要。

接下来，我们通过手写一个简单的待办管理应用来熟悉常见的操作接口。

#### 配置项目

首先，我们可以参照 18 讲中初始化 Node.js 模块的步骤创建一个 todo-web 项目，并安装 TypeScript 依赖。

然后，我们可以按需调整 lib 和 alwaysStrict 参数配置 tsconfig，如下所示：

    {
      "compilerOptions": {
        ...,
        "target": "es5",
        "lib": ["ESNext", "DOM"],                
        "strict": true,                       
        "alwaysStrict": false,
        ...           
      }
    }
    

在以上配置的第 4 行，我们设置了 tagert 参数是“es5”。在第 5 行，我们设置了 lib 参数为 "ESNext" 和 "DOM"。这样，我们就可以在 TypeScript 中使用最新的语言特性了（比如 Promise.any 等）。

> **注意**：因为设置了 target es5，所以这里我们还需要手动引入 ts-polyfill 为新特性打补丁，以兼容较低版本的浏览器。

此外，如果我们想在函数中使用 this，则可以把 alwaysStrict 设置为 false，这样生成的代码中就不会有“use strict”（关闭严格模式）了。

配置好项目后，我们开始进行编码实现。

#### 编码实现

首先我们可以创建一个模型 src/model.ts，用来维护待办数据层的增删操作，具体示例如下：

    class TodoModel {
      private gid: number = 0;
      public add = () => this.gid++;
      public remove = (id: number) => void 0
    }
    declare var todoModel: TodoModel;
    todoModel = new TodoModel;
    

在上述示例中，我们定义了模型 TodoModel（示例中仅仅实现了架子，你可以按需丰富这个示例），并在第 7~8 行把模型实例赋值给了全局变量 todoModel。

接下来我们开始实现 src/view.ts，用来维护视图层操作 Dom 逻辑，具体示例如下：

    const list = document.getElementById('todo') as HTMLUListElement | null;
    const addButton = document.querySelector<HTMLButtonElement>('#add');
    addButton?.addEventListener('click', add);
    function remove(this: HTMLButtonElement, id: number) {
      const todo = this.parentElement;
      todo && list?.removeChild(todo) && todoModel.remove(id);
    }
    function add() {
      const id = todoModel.add();
      const todoEle = document.createElement('li');
      todoEle.innerHTML = `待办 ${id} <button>删除</button>`;
      const button = todoEle.getElementsByTagName('button')[0];
      button.style.color = 'red';
      if (button) {
        button.onclick = remove.bind(button, id);
      }
      list?.appendChild(todoEle);
    }
    

上述示例中，我们在 tsconfig 的 lib 参数中添加了 DOM（如果 lib 参数缺省，则默认包含了 DOM；如果显式设置了 lib 参数，那么一定要添加 DOM），TypeScript 便会自动引入内置的 DOM 类型声明（node\_modules/typescript/lib/lib.dom.d.ts），这样所有的 DOM 原生操作都将支持静态类型检测。

在第 1 行，我们把通过 id 获取 HTMLElement | null 类型的元素断言为 HTMLUListElement | null，这是因为 HTMLUListElement 是 HTMLElement 的子类型。同样，第 6 行、12 行、14 行的相关元素都也有明确类型。尤其是第 12 行的 createElement、第 14 行的 getElementsByTagName，它们都可以根据标签名返回更确切的元素类型 HTMLLIElement、HTMLButtonElement。

然后，在第 2 行我们通过给 querySelector 指定了明确的类型入参，其获取的元素类型也就变成了更明确的 HTMLButtonElement。

此外，因为 DOM 元素的 style 属性也支持静态类型检测，所以我们在第 15 行可以把字符串 'red' 赋值给 color。但是，如果我们把数字 1 赋值给 color，则会提示一个 ts(2322) 错误。

接下来，我们就可以转译代码，并新建一个 index.html 引入转译后的 lib/model.js、lib/view.js 中，再使用 19 讲中开发的 http-serve CLI 启动服务预览页面。

通过这个简单的例子，我们感受到了 TypeScript 对 DOM 强大的支持，并且官方也根据 JavaScript 的发展十分及时地补齐了新语法特性。因此，即便开发原生应用，TypeScript 也会是一个不错的选择。

接下来，我们将学习 TypeScript 与前端主流框架 React 的搭配使用。

### React 框架

React 作为目前非常流行的前端框架，TypeScript 对其支持也是超级完善。在 1.6 版本中，TypeScript 官方专门实现了对 React JSX 语法的静态类型支持，并在 tsconfig 中新增了一个 jsx 参数用来定制 JSX 的转译规则。

而且，React 官方及周边生态对 TypeScript 的支持也越来越完善，比如 create-react-app 支持 TypeScript 模板、babel 支持转译 TypeScript。要知道，在 2018 年我们还需要手动搭建 TypeScript 开发环境，现在通过以下命令即可快速创建 TypeScript 应用，并且还不用过分关心 tsconfig 和开发构建相关的配置，只需把重心放在 React 和 TypeScript 的使用上（坏处则是修改默认配置会比较麻烦）。

    npm i create-react-app -g;
    create-react-app my-ts-app --template typescript;
    cd my-ts-app;
    npm start; // 或者 yarn start
    

接下来我们将分别从 Service、Component、状态管理这三个分层介绍 TypeScript 在 React App 开发中的实践。

#### Service 类型化

首先我们介绍的是 TypeScript 在 Service 层的应用，称之为 Service 类型化，实际就是把 JavaScript 编写的接口调用代码使用 TypeScript 实现。

举个例子， 以下是使用 JavaScript 编写的 getUserById 方法：

    export const getUserById = id => fetch(`/api/get/user/by/${id}`, { method: 'GET' });
    

在这个示例中，除了知道参数名 id 以外，我们对该方法接收参数、返回数据的类型和格式一无所知。

以上示例换成 TypeScript 实现后效果如下：

    export const getUserById = (id: number): Promise<{ id: number; name: string }> =>
      fetch(`/api/get/user/by/${id}`, { method: 'GET' }).then(res => res.json());
    async function test() {
      const { id2, name } = await getUserById('string'); // ts(2339) ts(2345)
    } 
    

在使用 TypeScript 的示例中，我们可以清楚地知道 getUserById 方法接收了一个不可缺省、number 类型的参数 id，返回的数据是一个异步的包含数字类型属性 id 和字符串类型属性 name 的对象。而且如果我们错误地调用该方法，比如第 5 行解构了一个不存在的属性 id2，就提示了一个 ts(2339) 错误，入参 'string' 类型不匹配也提示了一个 ts(2345) 错误。

通过两个示例的对比，Service 类型化的优势十分明显。

但是，在实际项目中，我们需要调用的接口少则数十个，多则成百上千，如果想通过手写 TypeScript 代码的方式定义清楚参数和返回值的类型结构，肯定不是一件轻松的事情。此时，我们可以借助一些工具，并基于格式化的接口文档自动生成 TypeScript 接口调用代码。

在业务实践中，前后端需要约定统一的接口规范，并使用格式化的 Swagger 或者 YAPI 等方式定义接口格式，然后自动生成 TypeScript 接口调用代码。目前，这块已经有很多成熟、开源的技术方案，例如[Swagger Codegen](https://swagger.io/tools/swagger-codegen/)、[swagger-typescript-api](https://github.com/acacode/swagger-typescript-api)、[Autos](https://gogoyqj.github.io/auto-service/)、[yapi-to-typescript](https://github.com/fjc0k/yapi-to-typescript)。

此外，对于前后端使用 GraphQL 交互的业务场景，我们也可以使用[GraphQL Code Generator](https://graphql-code-generator.com/)等工具生成 TypeScript 接口调用代码。你可以通过官方文档了解这些自动化工具的更多信息，这里就不做深入介绍了。

**以上提到的 Service 类型化其实并未与 React 深度耦合，因此我们也可以在 Vue 或者其他框架中使用 TypeScript 手写或者基于工具生成接口调用代码。**

接下来我们将学习 TypeScript 在 React Component 中的应用，将其称之为 Component 类型化。

#### Component 类型化

Component 类型化的本质在于清晰地表达组件的属性、状态以及 JSX 元素的类型和结构。

> 注意：TypeScript 中有专门的 .tsx 文件用来编写 React 组件，并且不能使用与 JSX 语法冲突的尖括号类型断言（“<类型>”）。此外，我们还需要确保安装了 @types/react、@types/react-dom 类型声明，里边定义了 React 和 ReactDOM 模块所有的接口和类型。

我们首先了解一下最常用的几个接口和类型。

**（1）class 组件**

所有的 class 组件都是基于\*\*\*\*React.Component 和 React.PureComponent 基类创建的，下面我们看一个具体示例：

    interface IEProps {
      Cp?: React.ComponentClass<{ id?: number }>;
    }
    interface IEState { id: number; }
    const ClassCp: React.ComponentClass<IEProps, IEState> = class ClassCp extends React.Component<IEProps, IEState> {
      public state: IEState = { id: 1 };
      render() {
        const { Cp } = this.props as Required<IEProps>;
        return <Cp id={`${this.state.id}`} />; // ts(2322)
      }
      static defaultProps: Partial<IEProps> = {
        Cp: class extends React.Component { render = () => null }
      }
    }
    

在示例中的第 5~14 行，因为 React.Component 基类接收了 IEProps 和 IEState 两个类型入参，并且类型化了 class 组件 E 的 props、state 和 defaultProps 属性，所以如果我们错误地调用了组件 props 中 Cp 属性，第 9 行就会提示一个 ts(2322) 错误。

然后我们可以使用接口类型 React.ComponentClass 来指代所有 class 组件的类型。例如在第 5 行，我们可以把 class 组件 ClassCp 赋值给 React.ComponentClass 类型的变量 ClassCp。

但在业务实践中，我们往往只使用 React.ComponentClass 来描述外部组件或者高阶组件属性的类型。比如在示例中的第 2 行，我们使用了 React.ComponentClass 描述 class 组件 E 的 Cp 属性，而不会像第 5 行那样，把定义好的 class 组件赋值给一个 React.ComponentClass 类型的变量。

此外，在定义 class 组件时，使用 public/private 控制属性/方法的可见性，以及使用Readonly 标记 state、props 为只读，都是特别推荐的实践经验。

下面我们看一个具体的示例：

    class ClassCpWithModifier extends React.Component<Readonly<IEProps>, Readonly<IEState>> {
      private gid: number = 1;
      public state: Readonly<IEState> = { id: 1 };
      render() { return this.state.id = 2; } // ts(2540)
    }
    

在示例中的第 2 行，如果我们不希望对外暴露 gid 属性，就可以把它标记为 private 私有。

如果我们想禁止直接修改 state、props 属性，则可以在第 1 行中使用 Readonly 包裹 IEProps、IEState。此时，如果我们在第 4 行直接给 state id 属性赋值，就会提示一个 ts(2540) 错误。

**函数组件**

我们可以使用类型 React.FunctionComponent（简写为 React.FC）描述函数组件的类型。因为函数组件没有 state 属性，所以我们只需要类型化 props。

下面我们看一个具体的示例：

    interface IEProps { id?: number; }
    const ExplicitFC: React.FC<IEProps> = props => <>{props.id}</>; // ok
    ExplicitFC.defaultProps = { id: 1 } // ok id must be number
    const ExplicitFCEle = <ExplicitFC id={1} />; // ok id must be number
    const ExplicitFCWithError: React.FC<IEProps> = props => <>{props.id2}</>; // ts(2399)
    ExplicitFCWithError.defaultProps = { id2: 1 } // ts(2332)
    const thisIsJSX2 = <ExplicitFCWithError id2={2} />; // ts(2332)
    

在上述示例中，因为我们定义了类型是 React.FC`<IEProps>` 的组件 ExplicitFC、ExplicitFCWithError，且类型入参 IEProps 可以同时约束 props 参数和 defaultProps 属性的类型，所以第 2~4 行把 number 类型值赋予接口中已定义的 id 属性可以通过静态类型检测。但是，在第 5~7 行，因为操作了未定义的属性 id2，所以提示了 ts(2399)、 ts(2332) 错误。

> 注意：函数组件返回值类型必须是 React.Element（稍后会详细介绍） 或者 null，反过来如果函数返回值类型是 React.Element 或者 null，即便未显式声明类型，函数也是合法的函数组件。

如以下示例中，因为我们定义了未显式声明类型、返回值分别是 null 和 JSX 的函数 ImplicitFCReturnNull、ImplicitFCReturnJSX，所以第 3 行、第 6 行的这两个组件都可以用来创建 JSX。但是，因为第 8 行定义的返回值类型是 number 的函数 NotAFC，所以被用来创建 JSX 时会在第 9 行提示一个 ts(2786) 错误。

    function ImplicitFCReturnNull() { return null; }
    ImplicitFCReturnNull.defaultProps = { id: 1 }
    const ImplicitFCReturnNullEle = <ImplicitFCReturnNull id={1} />; // ok id must be number
    const ImplicitFCReturnJSX = () => <></>;
    ImplicitFCReturnJSX.defaultProps = { id2: 1 }
    const ImplicitFCReturnJSXEle = <ImplicitFCReturnJSX id2={2} />; // ok
    /** 分界线 **/
    const NotAFC = () => 1; // 
    const WithError = <NotAFC />; // ts(2786)
    

对于编写函数组件而言，显式注解类型是一个好的实践，另外一个好的实践是用 props 解构代替定义 defaultProps 来指定默认属性的值。

此外，组件和泛型 class、函数一样，也是可以定义成接收若干个入参的泛型组件。

以列表组件为例，**我们希望可以根据列表里渲染条目的类型（比如说“User”或“Todo”），分别使用不同的视图组件渲染条目，这个时候就需要使用泛型来约束表示条目类型的入参和视图渲染组件之间的类型关系。**

下面看一个具体的示例：

    export interface IUserItem {
      username: string;
    }
    export function RenderUser(props: IUserItem): React.ReactElement {
      return <>{props.username}</>
    }
    export interface ITodoItem {
      taskName: string;
    }
    export function RenderTodo(props: ITodoItem): React.ReactElement {
      return <>{props.taskName}</>
    }
    export function ListCp<Item extends {}>(props: { Cp: React.ComponentType<Item> }): React.ReactElement {
      return <></>;
    }
    const UserList = <ListCp<IUserItem> Cp={RenderUser} />; // ok
    const TodoList = <ListCp<ITodoItem> Cp={RenderTodo} />; // ok
    const UserListError = <ListCp<ITodoItem> Cp={RenderUser} />; // ts(2322)
    const TodoListError = <ListCp<IUserItem> Cp={RenderTodo} />; // ts(2322)
    

在示例中的第 13 行，定义的泛型组件 ListCp 通过类型入参 Item 约束接收了 props 的 Cp 属性的具体类型。在第 16 行、第 17 行，因为类型入参 IUserItem、ITodoItem 和 Cp 属性 RenderUser、RenderTodo 类型一一对应，所以可以通过静态类型检测。但是，在第 18 行、第 19 行，因为对应关系不正确，所以提示了一个 ts(2322) 错误。

**class 组件和函数组件类型组成的联合类型被称之为组件类型 React.ComponentType，组件类型一般用来定义高阶组件的属性**，如下代码所示：

    React.ComponentType<P> = React.ComponentClass<P> | React.FunctionComponent<P>;
    

最后介绍几个常用类型：

*   **元素类型 React.ElementType**：指的是所有可以通过 JSX 语法创建元素的类型组合，包括html 原生标签（比如 div、a 等）和 React.ComponentType，元素类型可以接收一个表示 props 的类型入参；
    
*   **元素节点类型 React.ReactElement**：指的是元素类型通过 JSX 语法创建的节点类型，它可以接收两个分别表示 props 和元素类型的类型入参；
    
*   **节点类型 React.ReactNode**：指的是由 string、number、boolean、undefined、null、React.ReactElement 和元素类型是 React.ReactElement 的数组类型组成的联合类型，合法的 class 组件 render 方法返回值类型必须是 React.ReactNode；
    
*   **JSX 元素类型 JSX.Element**：指的是元素类型通过 JSX 语法创建的节点类型，JSX.Element 等于 React.ReactElement<any, any>。
    

以上就是 React Component 相关的类型及简单的类型化。

在实际业务中，因为组件接收的 props 数据可能来自路由、Redux，所以我们还需要对类型进行更明确的分解。

下面我们看一个具体的示例：

    import React from 'react'; 
    import { bindActionCreators, Dispatch } from "redux";
    import { connect } from "react-redux";
    import { RouteComponentProps } from 'react-router-dom';
    /** 路由 Props */
    type RouteProps = RouteComponentProps<{ routeId: string }>;
    /** Redux Store Props */
    type StateProps = ReturnType<typeof mapStateToProps>;
    function mapStateToProps(state: {}) {
      return {
        reduxId: 1
      };
    }
    /** Redux Actions Props */
    type DispatchProps = ReturnType<typeof mapDispatchToProps>;
    function mapDispatchToProps(dispatch: Dispatch) {
      return {
        actions: bindActionCreators({
          doSomething: () => void 0
        }, dispatch),
      };
    }
    /** 组件属性 */
    interface IOwnProps {
      ownId: number;
    }
    /** 最终 Props */
    type CpProps = IOwnProps & RouteProps & StateProps & DispatchProps;
    const OriginalCp = (props: CpProps) => {
      const {
        match: { params: { routeId } }, // 路由 Props
        reduxId, // Redux Props
        ownId, // 组件 Props
        actions: {
          doSomething // Action Props
        },
      } = props;
      return null;
    };
    const ConnectedCp = connect<StateProps, DispatchProps, IOwnProps>(mapStateToProps, mapDispatchToProps)(OriginalCp as React.ComponentType<IOwnProps>);
    const ConnectedCpJSX = <ConnectedCp ownId={1} />; // ok
    

在第 7 行，我们定义了 RouteProps，描述的是从路由中获取的属性。在第 9 行获取了 mapStateToProps 函数返回值类型 StateProps，描述的是从 Redux Store 中获取的属性。

在第 16 行，我们获取了 mapDispatchToProps 函数返回值类型 DispatchProps，描述的是 Redux Actions 属性。在第 25 行，我们定义的是组件自有的属性，所以最终组件 OriginalCp 的属性类型 CpProps 是 RouteProps、StateProps、DispatchProps 和 IOwnProps 四个类型的交叉类型。在第 31~38 行，我们解构了 props 中不同来源的属性、方法，并且可以通过静态类型检测。

**这里插播一道思考题：以上示例会提示一个缺少 react-redux、react-router-dom 类型声明的错误，应该如何解决呢？**

> 注意：在示例中的第 41 行，connect 之前，我们把组件 OriginalCp 断言为 React.ComponentType 类型，这样在第 42 行使用组件的时候，就只需要传入 IOwnProps 中定义的属性（因为 RouteProps、StateProps、DispatchProps 属性可以通过路由或者 connect 自动注入）。

这里使用的类型断言是开发 HOC 高阶组件（上边示例中 connect(mapStateToProps, mapDispatchToProps) 返回的是一个高阶组件）的一个惯用技巧，一般我们可以通过划分 HOCProps、IOwnProps 或 Omit 来剔除高阶组件注入的属性，如下示例中的第 4 行、第 5 行。

    interface IHOCProps { injectId: number; }
    interface IOwnProps { ownId: number; }
    const hoc = <C extends React.ComponentType<any>>(cp: C) => cp;
    const InjectedCp1 = hoc(OriginalCp as React.ComponentType<IOwnProps>);
    const InjectedCp2 = hoc(OriginalCp as React.ComponentType<Omit<IHOCProps & IOwnProps, 'injectId'>>); 
    

组件类型化还涉及 Hooks 等知识点，限于篇幅，本文就不继续展开了。

接下来我们简单了解一下使用 Redux 进行状态管理技术方案的类型化，将其称之为 Redux 类型化。

#### Redux 类型化

Redux 类型化涉及 state、action、reducer 三要素类型化，具体示例如下：

    // src/redux/user.ts
    // state
    interface IUserInfoState {
      userid?: number;
      username?: string;
    }
    export const initialState: IUserInfoState = {};
    // action
    interface LoginAction {
      type: 'userinfo/login';
      payload: Required<IUserInfoState>;
    }
    interface LogoutAction {
      type: 'userinfo/logout';
    }
    export function doLogin(): LoginAction {
      return {
        type: 'userinfo/login',
        payload: {
          userid: 101,
          username: '乾元亨利贞'
        }
      };
    }
    export function doLogout(): LogoutAction {
      return {
        type: 'userinfo/logout'
      };
    }
    // reducer
    export function applyUserInfo(state = initialState, action: LoginAction | LogoutAction): IUserInfoState {
      switch (action.type) {
        case 'userinfo/login':
          return {
            ...action.payload
          };
        case 'userinfo/logout':
          return {};
      }
    }
    

在示例中的第 2~7 行，我们定义了 state 的详细类型，并在第 8~29 行分别定义了表示登入、登出的 action 类型和函数，还在第 30~40 行定义了处理前边定义的 action 的 reducer 函数。

然后，我们就将类型化后的 state、action、reducer 合并到 redux store，再通过 react-redux 关联 React，这样组件在 connect 之后，就能和 Redux 交互了。

不过，因为 state、action、reducer 分别类型化的形式写起来十分复杂，所以我们可以借助 typesafe-actions、redux-actions、rematch、dvajs、@ekit/model 等工具更清晰、高效地组织 Redux 代码。限于篇幅，这里就不做深入介绍了，你可以自行到[https://www.npmjs.com/](https://www.npmjs.com/)上查看更多信息。

#### 单元测试

我们可以选择 Jest + Enzyme + jsdom + ReactTestUtils 作为 React + TypeScript 应用的单元测试技术方案，不过麻烦的地方在于需要手动配置 Jest、Enzyme。因此，我更推荐选择[react-testing-library](https://github.com/testing-library/react-testing-library)这个方案，这也是 create-react-app 默认内置的单元测试方案。

如下示例，我们为前边定义的 RenderUser 组件编写了单元测试。

    import React from 'react';
    import { render, screen } from '@testing-library/react';
    import { RenderUser } from './Cp';
    test('renders learn react link', () => {
      render(<RenderUser username={'乾元亨利贞'} />);
      const linkElement = screen.getByText(/乾元亨利贞/i);
      expect(linkElement).toBeInTheDocument();
    });
    

> 注意：以上介绍的单测执行环境是 Node.js，TypeScript 会被转译成 CommonJS 格式，而在浏览器端运行时，则会被转译成 ES 格式。因此，不同模块之间存在循环依赖时，转译后代码在浏览器端可以正确运行，而在 Node.js 端运行时可能会出现引入的其他模块成员未定义（undefined）的错误。

### 小结和预告

以上就是 TypeScript 和 Dom 原生操作及结合 React 框架在 Web 侧开发的实践建议，其核心在于类型化 Dom API 和 React 组件、Redux 和 Service。

插播一道思考题：类型化 React 组件的要义是什么？欢迎你在留言区进行互动、交流。

20 讲我们将学习如何从 JavaScript 迁移到 TypeScript，敬请期待。

另外，如果你觉得本专栏有价值，欢迎分享给更多好友~