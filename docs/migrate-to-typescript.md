# 将 Gatsby 迁移到 TypeScript

- [将 Gatsby 迁移到 TypeScript](#将-gatsby-迁移到-typescript)
  - [初始化项目](#初始化项目)
  - [TS 配置](#ts-配置)
    - [安装`typescript`](#安装typescript)
    - [添加配置文件`tsconfig.json`](#添加配置文件tsconfigjson)
    - [补全 TS 声明定义](#补全-ts-声明定义)
  - [配置 ESLint 支持 TypeScript](#配置-eslint-支持-typescript)
  - [完善 GraphQL 类型提示](#完善-graphql-类型提示)
    - [安装`vscode-apollo`扩展](#安装vscode-apollo扩展)
    - [方式一: 使用`gatsby-plugin-codegen`](#方式一-使用gatsby-plugin-codegen)
    - [方式二: 使用`gatsby-plugin-typegen`](#方式二-使用gatsby-plugin-typegen)
  - [扩展阅读](#扩展阅读)

> 之前花了些时间将[`gatsby-theme-gitbook`](https://github.com/XYShaoKang/gatsby-theme-gitbook)迁移到 Typescript,以获得在 VSCode 中更好的编程体验.
>
> 整体差不多已经完成迁移,剩下将 Gatsby 的 API 文件也迁移到 TS,这里可以看到 [gatsby#21995](https://github.com/gatsbyjs/gatsby/issues/21995) 官方也在将核心代码库迁移到 Typescript,准备等待官方将核心代码库迁移完成,在迁移 API 文件.
>
> 这篇文章用[XYShaoKang/gatsby-project-config](https://github.com/XYShaoKang/gatsby-project-config),演示如何将 gatsby 迁移到 TypeScript,希望能帮到同样想要在 Gatsby 中使用 TS 的同学.

迁移步骤:

- TS 配置
- 配置 ESLint 支持 TS
- 完善 GraphQL 类型提示

## 初始化项目

```bash
gatsby new gatsby-migrate-to-typescript XYShaoKang/gatsby-project-config
cd gatsby-migrate-to-typescript
yarn develop
```

## TS 配置

- 安装`typescript`
- 添加`typescript.json`配置文件
- 修改 js 文件为 tsx
- 补全 TS 声明定义

### 安装`typescript`

```bash
yarn add -D typescript
```

### 添加配置文件`tsconfig.json`

```json
// https://www.typescriptlang.org/v2/docs/handbook/tsconfig-json.html
{
  "compilerOptions": {
    "target": "esnext", // 编译生成的目标 es 版本,可以根据需要设置
    "module": "commonjs", // 编译生成的目标模块系统
    "lib": ["dom", "es2015", "es2017"], // 配置需要包含的运行环境的类型定义
    "jsx": "react", // 配置 .tsx 文件的输出模式
    "strict": true, // 开启严格模式
    "esModuleInterop": true, // 兼容 CommonJS 和 ES Module
    "noUnusedLocals": true, // 报告未使用的局部变量的错误
    "noUnusedParameters": true, // 报告有关函数中未使用参数的错误
    "experimentalDecorators": true, // 启用装饰器
    "emitDecoratorMetadata": true, // 支持装饰器上生成元数据,用来进行反射之类的操作
    "noEmit": true, // 不输出 js,源映射或声明之类的文件,单纯用来检查错误
    "skipLibCheck": true // 跳过声明文件的类型检查,只会检查已引用的部分
  },
  "exclude": ["./node_modules", "./public", "./.cache"], // 解析时,应该跳过的路晋
  "include": ["src"] // 定义包含的路径,定义在其中的声明文件都会被解析进 vscode 的智能提示
}
```

将`index.js`改成`index.tsx`,重新启动服务,查看效果.

> 其实 Gatsby 内置了[支持 TS](https://github.com/gatsbyjs/gatsby/issues/18983),不用其他配置,只要把`index.js`改成`index.tsx`就可以直接运行.添加 TS 依赖是为了显示管理 TS,而`tsconfig.json`也是这个目的,当我们有需要新的特性以及自定义配置时,可以手动添加.

### 补全 TS 声明定义

打开`index.tsx`,VSCode 会报两个错误,一个是找不到`styled-components`的声明文件,这个可以通过安装`@types/styled-components`来解决.
另外一个错误`绑定元素“data”隐式具有“any”类型。`,这个错误是因为我们在`tsconfig.json`中指定了`"strict": true`,这会开启严格的类型检查,可以通过关闭这个选项来解决,只是我们用 TS 就是要用它的类型检查的,所以正确的做法是给`data`定义类型.
下面来一一修复错误.

安装`styled-components`的声明文件

```bash
yarn add -D @types/styled-components
```

修改`index.tsx`

```tsx
import React, { FC } from 'react'
import styled from 'styled-components'
import { graphql } from 'gatsby'
import { HomeQuery } from './__generated__/HomeQuery'

const Title = styled.h1`
  font-size: 1.5em;
  margin: 0;
  padding: 0.5em 0;
  color: palevioletred;
  background: papayawhip;
`

const Content = styled.div`
  margin-top: 0.5em;
`

interface PageQuery {
  data: {
    allMarkdownRemark: {
      edges: Array<{
        node: {
          frontmatter: {
            title: string
          }
          excerpt: string
        }
      }>
    }
  }
}

const Home: FC<PageQuery> = ({ data }) => {
  const node = data.allMarkdownRemark.edges[0].node

  const title = node.frontmatter?.title
  const excerpt = node.excerpt

  return (
    <>
      <Title>{title}</Title>
      <Content>{excerpt}</Content>
    </>
  )
}

export default Home

export const query = graphql`
  query HomeQuery {
    allMarkdownRemark {
      edges {
        node {
          frontmatter {
            title
          }
          excerpt
        }
      }
    }
  }
`
```

这时候会出现一个新的错误,在`excerpt: string`处提示`Parsing error: Unexpected token`,这是因为 ESLint 还无法识别 TS 的语法,下面来配置 ESLint 支持 TS.

## 配置 ESLint 支持 TypeScript

安装依赖

```bash
yarn add -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

配置`.eslintrc.js`

```js
module.exports = {
  parser: `@typescript-eslint/parser`, // 将解析器从`babel-eslint`替换成`@typescript-eslint/parser`,用以解析 TS 代码
  extends: [
    `google`,
    `eslint:recommended`,
    `plugin:@typescript-eslint/recommended`, // 使用 @typescript-eslint/eslint-plugin 推荐配置
    `plugin:react/recommended`,
    `prettier/@typescript-eslint`, // 禁用 @typescript-eslint/eslint-plugin 中与 prettier 冲突的规则
    `plugin:prettier/recommended`,
  ],
  plugins: [
    `@typescript-eslint`, // 处理 TS 语法规则
    `react`,
    `filenames`,
  ],
  // ...
}
```

在`.vscode/settings.json`中添加配置,让`VSCode`使用`ESLint`扩展格式化`ts`和`tsx`文件

```json
// .vscode/settings.json
{
  "eslint.format.enable": true,
  "[javascript]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "[typescript]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  }
}
```

## 完善 GraphQL 类型提示

```tsx
// index.tsx
import React, { FC } from 'react'
// ...
interface PageQuery {
  data: {
    allMarkdownRemark: {
      edges: Array<{
        node: {
          frontmatter: {
            title: string
          }
          excerpt: string
        }
      }>
    }
  }
}

const Home: FC<PageQuery> = ({ data }) => {
  // ...
}

export default Home

export const query = graphql`
  query HomeQuery {
    allMarkdownRemark {
      edges {
        node {
          frontmatter {
            title
          }
          excerpt
        }
      }
    }
  }
`
```

我们看看`index.tsx`文件,会发现`PropTypes`和`query`结构非常类似,在`Gatsby`运行时,会把`query`查询的结果作为组件`prop.data`传入组件,而`PropTypes`是用来约束`prop`存在的.所以其实`PropTypes`就是根据`query`写出来的.

如果有依据`query`自动生成`PropTypes`的功能就太棒了.
另外一个问题是在`query`中编写`GraphQL`查询时,并没有类型约束,也没有智能提示.

总结以下需要完善的体验包括:

- GraphQL 查询编写时的智能提示,以及错误检查
- 能够从 GraphQL 查询生成对应的 TypeScript 类型.这样能保证类型的唯一事实来源,并消除 TS 中冗余的类型声明.毕竟如果经常需要手动更新两处类型,会更容易出错,而且也并不能保证手动定义类型的正确性.

实现方式:

- 通过生成架构文件,配合`Apollo GraphQL for VS Code`插件,实现智能提示,以及错误检查
- 通过`graphql-code-generator`或者`apollo`生成 TS 类型定义文件

如果自己去配置的话,是挺耗费时间的,需要去了解`graphql-code-generator`的使用,以及`Apollo`的架构等知识.
不过好在社区中已经有对应的 Gatsby 插件集成了上述工具可以直接使用,能让我们不用去深究对应知识的情况下,达到优化 GraphQL 编程的体验.
尝试过以下两个插件能解决上述问题,可以任选其一使用

- [gatsby-plugin-codegen](https://github.com/daugsbi/gatsby-plugin-codegen)
- [gatsby-plugin-typegen](https://github.com/cometkim/gatsby-plugin-typegen)

另外还有一款插件[`gatsby-plugin-graphql-codegen`](https://github.com/d4rekanguok/gatsby-typescript/tree/master/packages/gatsby-plugin-graphql-codegen)也可以生成 TS 类型,不过配置略麻烦,并且上述两个插件都可以满足我现在的需求,所以没有去尝试,感兴趣的可以尝试一下.

**注意点:**

1. `Apollo`不支持匿名查询,需要使用命名查询
2. 第一次生成,需要运行`Gatsby`之后才能生成类型文件
3. 整个项目内不能有[相同命名的查询](https://github.com/apollographql/apollo-tooling/issues/670),不然会因为名字有冲突而生成失败

下面是具体操作

### 安装`vscode-apollo`扩展

在 VSCode 中按 `Ctrl + P` ( MAC 下: `Cmd + P`) 输入以下命令,按回车安装

```bash
ext install apollographql.vscode-apollo
```

### 方式一: 使用`gatsby-plugin-codegen`

`gatsby-plugin-codegen`默认会生成`apollo.config.js`和`schema.json`,配合[`vscode-apollo`](https://marketplace.visualstudio.com/items?itemName=apollographql.vscode-apollo)扩展,可以提供`GraphQL`的类型约束和智能提示.
另外会自动根据`query`中的`GraphQL`查询,生成 TS 类型,放在对应的`tsx`文件同级目录下的`__generated__`文件夹,使用时只需要引入即可.
如果需要在运行时自动生成 TS 类型,需要添加`watch: true`配置.

**安装`gatsby-plugin-codegen`**

```bash
yarn add gatsby-plugin-codegen
```

**配置`gatsby-config.js`**

```js
// gatsby-config.js
module.exports = {
  plugins: [
    // ...
    {
      resolve: `gatsby-plugin-codegen`,
      options: {
        watch: true,
      },
    },
  ],
}
```

**重新运行开发服务生成类型文件**

```bash
yarn develop
```

如果出现以下错误,一般是因为没有为查询命名的缘故,给查询添加命名即可,另外配置正确的话,打开对应的文件,有匿名查询,编辑器会有错误提示.

![fix-anonymous-operations.png](./assets/migrate-to-typescript/images/fix-anonymous-operations.png)

这个命名之后会作为生成的类型名.

**修改`index.tsx`以使用生成的类型**

`gatsby-plugin-codegen`插件会更具查询生成对应的查询名称的类型,保存在对应`tsx`文件同级的`__generated__`目录下.

```tsx
import { HomeQuery } from './__generated__/HomeQuery' // 引入自动生成的类型
// ...

// interface PageQuery {
//   data: {
//     allMarkdownRemark: {
//       edges: Array<{
//         node: {
//           frontmatter: {
//             title: string
//           }
//           excerpt: string
//         }
//       }>
//     }
//   }
// }

interface PageQuery {
  data: HomeQuery // 替换之前手写的类型
}

// ...
```

**将自动生成的文件添加到`.gitignore`中**

> `apollo.config.js`,`schema.json`,`__generated__`能通过运行时生成,所以可以添加到`.gitignore`中,不用提交到 git 中.当然如果有需要也可以选择提交到 git 中.

```
# Generated types by gatsby-plugin-codegen
__generated__
apollo.config.js
schema.json
```

### 方式二: 使用`gatsby-plugin-typegen`

`gatsby-plugin-typegen`通过配置生成`gatsby-schema.graphql`和`gatsby-plugin-documents.graphql`配合手动创建的`apollo.config.js`提供`GraphQL`的类型约束和智能提示.
根据`GraphQL`查询生成`gatsby-types.d.ts`,生成的类型放在命名空间`GatsbyTypes`下,使用时通过`GatsbyTypes.HomeQueryQuery`来引入,`HomeQueryQuery`是由对应的命名查询生成

**安装`gatsby-plugin-typegen`**

```bash
yarn add gatsby-plugin-typegen
```

**配置**

```js
// gatsby-config.js
module.exports = {
  plugins: [
    // ...
    {
      resolve: `gatsby-plugin-typegen`,
      options: {
        outputPath: `src/__generated__/gatsby-types.d.ts`,
        emitSchema: {
          'src/__generated__/gatsby-schema.graphql': true,
        },
        emitPluginDocuments: {
          'src/__generated__/gatsby-plugin-documents.graphql': true,
        },
      },
    },
  ],
}
```

```js
//apollo.config.js
module.exports = {
  client: {
    tagName: `graphql`,
    includes: [
      `./src/**/*.{ts,tsx}`,
      `./src/__generated__/gatsby-plugin-documents.graphql`,
    ],
    service: {
      name: `GatsbyJS`,
      localSchemaFile: `./src/__generated__/gatsby-schema.graphql`,
    },
  },
}
```

**重新运行开发服务生成类型文件**

```bash
yarn develop
```

**修改`index.tsx`以使用生成的类型**

`gatsby-plugin-codegen`插件会更具查询生成对应的查询名称的类型,保存在对应`tsx`文件同级的`__generated__`目录下.

```tsx
// ...

// interface PageQuery {
//   data: {
//     allMarkdownRemark: {
//       edges: Array<{
//         node: {
//           frontmatter: {
//             title: string
//           }
//           excerpt: string
//         }
//       }>
//     }
//   }
// }

interface PageQuery {
  data: GatsbyTypes.HomeQueryQuery // 替换之前手写的类型
}

// ...
```

**将自动生成的文件添加到`.gitignore`中**

> `__generated__`能通过运行时生成,所以可以添加到`.gitignore`中,不用提交到 git 中.当然如果有需要也可以选择提交到 git 中.

```
# Generated types by gatsby-plugin-codegen
__generated__
```

## 扩展阅读

- TypeScript 相关资料
  - [Gatsby Native TypeScript support](https://github.com/gatsbyjs/gatsby/issues/18983)
  - [Function Components](https://github.com/typescript-cheatsheets/react-typescript-cheatsheet#function-components)
  - [tsconfig.json](https://www.typescriptlang.org/v2/docs/handbook/tsconfig-json.html)
  - [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint)
  - [Why the TypeScript team is using Gatsby for its new website](https://www.gatsbyjs.cn/blog/2020-01-23-why-typescript-chose-gatsby/)
- GraphQL 相关资料
  - [Why Gatsby Uses GraphQL](https://www.gatsbyjs.org/docs/why-gatsby-uses-graphql/)
  - [gatsby-plugin-codegen](https://github.com/daugsbi/gatsby-plugin-codegen)
  - [gatsby-plugin-typegen](https://github.com/cometkim/gatsby-plugin-typegen)
  - [gatsby-plugin-graphql-codegen](https://github.com/d4rekanguok/gatsby-typescript/tree/master/packages/gatsby-plugin-graphql-codegen)
  - [graphql-code-generator](https://github.com/dotansimha/graphql-code-generator)
  - [Apollo GraphQL for VS Code](https://marketplace.visualstudio.com/items?itemName=apollographql.vscode-apollo)
  - [Why does codegen:generate require query names to be unique? #670](https://github.com/apollographql/apollo-tooling/issues/670)
- 类似教程
  - [INTRODUCTION: MIGRATING GATSBY SITE TO TYPESCRIPT](https://www.extensive.one/migrating-gatsby-to-typescript-introduction/)
