# Gatsby 项目配置

- [Gatsby 项目配置](#gatsby-项目配置)
  - [初始化](#初始化)
  - [Prettier 配置](#prettier-配置)
    - [安装 VSCode 扩展](#安装-vscode-扩展)
    - [安装依赖](#安装依赖)
    - [Prettier 配置文件`.prettierrc.js`](#prettier-配置文件prettierrcjs)
  - [ESLint 配置](#eslint-配置)
    - [安装 VSCode 扩展](#安装-vscode-扩展-1)
    - [安装 ESLint 依赖](#安装-eslint-依赖)
    - [ESLint 配置文件`.eslintrc.js`](#eslint-配置文件eslintrcjs)
  - [解决 Prettier ESLint 规则冲突](#解决-prettier-eslint-规则冲突)
  - [VSCode 中 Prettier 和 ESLint 协作](#vscode-中-prettier-和-eslint-协作)
    - [方式一:使用 ESLint 扩展来格式化代码](#方式一使用-eslint-扩展来格式化代码)
    - [方式二:使用 Prettier 扩展来格式化代码](#方式二使用-prettier-扩展来格式化代码)
    - [旧版`prettier-vscode`的配置方式](#旧版prettier-vscode的配置方式)
  - [调试 Gatsby 配置](#调试-gatsby-配置)
    - [调试构建过程](#调试构建过程)
    - [调试客户端](#调试客户端)

## 初始化

> 使用 https://github.com/XYShaoKang/gatsby-hello-world 作为基础模板

```sh
gatsby new gatsby-project-config https://github.com/XYShaoKang/gatsby-hello-world
```

## Prettier 配置

### 安装 VSCode 扩展

按 Ctrl + P (MAC 下: Cmd + P) 输入以下命令,按回车安装

```sh
ext install esbenp.prettier-vscode
```

### 安装依赖

```sh
yarn add -D prettier
```

### Prettier 配置文件`.prettierrc.js`

```js
// .prettierrc.js
module.exports = {
  trailingComma: 'es5',
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  endOfLine: 'lf',
  printWidth: 50,
  arrowParens: 'avoid',
}
```

## ESLint 配置

### 安装 VSCode 扩展

按 Ctrl + P (MAC 下: Cmd + P) 输入以下命令,按回车安装

```sh
ext install dbaeumer.vscode-eslint
```

### 安装 ESLint 依赖

```sh
yarn add -D eslint babel-eslint eslint-config-google eslint-plugin-react eslint-plugin-filenames
```

### ESLint 配置文件`.eslintrc.js`

使用官方仓库的配置,之后在根据需要修改

```js
// https://github.com/gatsbyjs/gatsby/blob/master/.eslintrc.js
// .eslintrc.js
module.exports = {
  parser: 'babel-eslint',
  extends: ['google', 'eslint:recommended', 'plugin:react/recommended'],
  plugins: ['react', 'filenames'],
  parserOptions: {
    ecmaVersion: 2016,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  globals: {
    before: true,
    after: true,
    spyOn: true,
    __PATH_PREFIX__: true,
    __BASE_PATH__: true,
    __ASSET_PREFIX__: true,
  },
  rules: {
    'arrow-body-style': [
      'error',
      'as-needed',
      { requireReturnForObjectLiteral: true },
    ],
    'no-unused-expressions': [
      'error',
      {
        allowTaggedTemplates: true,
      },
    ],
    'consistent-return': ['error'],
    'filenames/match-regex': ['error', '^[a-z-\\d\\.]+$', true],
    'no-console': 'off',
    'no-inner-declarations': 'off',
    quotes: ['error', 'backtick'],
    'react/display-name': 'off',
    'react/jsx-key': 'warn',
    'react/no-unescaped-entities': 'off',
    'react/prop-types': 'off',
    'require-jsdoc': 'off',
    'valid-jsdoc': 'off',
  },
  settings: {
    react: {
      version: '16.4.2',
    },
  },
}
```

## 解决 Prettier ESLint 规则冲突

[推荐配置](https://prettier.io/docs/en/integrating-with-linters.html#recommended-configuration)

安装依赖

```sh
yarn add -D eslint-config-prettier eslint-plugin-prettier
```

在`.eslintrc.js`中的`extends`添加`'plugin:prettier/recommended'`

```js
module.exports = {
  extends: ['plugin:prettier/recommended'],
}
```

## VSCode 中 Prettier 和 ESLint 协作

### 方式一:使用 ESLint 扩展来格式化代码

配置`.vscode/settings.json`

```json
// .vscode/settings.json
{
  "eslint.format.enable": true,
  "[javascript]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  }
}
```

ESLint 扩展会默认忽略`.`开头的文件,比如`.eslintrc.js`
如果需要格式化`.`开头的文件,可以在`.eslintignore`中[添加一个否定忽略](https://github.com/eslint/eslint/issues/8429#issuecomment-355967308)来启用对应文件的格式化功能.

```sh
!.eslintrc.js
```

或者直接使用`!.*`,这样可以开启所有点文件的格式化功能

### 方式二:使用 Prettier 扩展来格式化代码

在最新版[`prettier-vscode@v5.0.0`](https://github.com/prettier/prettier-vscode/releases/tag/v5.0.0)中已经[删除了直接对`linter`的集成](https://github.com/prettier/prettier-vscode/commit/1cc04c9d0415c0913f02a252efb31c204597bb13),所以最新版没法像之前那样,通过`prettier-eslint`来集成`ESLint`的修复了(一定要这样用的话,可以通过降级到`prettier-vscode@4`来使用了).如果要使用`Prettier`来格式化的话,就只能按照官方指南中的说的[集成方法](https://github.com/prettier/prettier-vscode#disable-formatting-rules-in-the-linter),让`Prettier`来处理格式,通过配置在保存时使用`ESlint`自动修复代码.只是这样必须要保存文件时,才能触发`ESLint`的修复了.

配置 VSCode 使用 Prettier 来格式化 js 和 jsx 文件
在项目中新建文件`.vscode/settings.json`

```json
// .vscode/settings.json
{
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

> 说实话这个体验很糟糕,之前直接一键格式化代码并且修复 ESLint 错误,可以对比格式化之前和格式化之后的代码,如果感觉不对可以直接撤销更改就好了.现在必须要通过保存,才能触发修复 ESlint 错误.而在开发过程中,通过监听文件改变来触发热加载或者重新编译是很常见的操作.这样之后每次想要去修复 ESLint 错误,还是只是想看看修复错误之后的样子,都必须要去触发热加载或重新编译,这样每次操作的成本就太高了.
> 我更推荐第一种方式使用 ESLint 扩展来对代码进行格式化.

### 旧版`prettier-vscode`的配置方式

> 需要安装依赖
>
> ```sh
> yarn add -D prettier-eslint@10.1.0
> ```
>
> > Prettier 扩展会使用`prettier-eslint`调用`eslint --fix`来修复代码
> >
> > `prettier-eslint@10.1.1`中移除了`core-js`的依赖,但是在生产代码中还是会导入`core-js`,会导致一个[导入错误](https://github.com/prettier/> prettier-eslint/issues/348),所以先使用`10.1.0`,等之后修复再使用最新版本
>
> 配置 VSCode 使用 Prettier 来格式化 js 和 jsx 文件
> 在项目中新建文件`.vscode/settings.json`
>
> ```json
> // .vscode/settings.json
> {
>   "[javascript]": {
>     "editor.defaultFormatter": "esbenp.prettier-vscode"
>   },
>   "[javascriptreact]": {
>     "editor.defaultFormatter": "esbenp.prettier-vscode"
>   }
> }
> ```

## 调试 Gatsby 配置

### 调试构建过程

添加配置文件`.vscode/launch.json`

```json
// .vscode/launch.json
{
  // 使用 IntelliSense 了解相关属性。
  // 悬停以查看现有属性的描述。
  // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Gatsby develop",
      "type": "node",
      "request": "launch",
      "protocol": "inspector",
      "program": "${workspaceRoot}/node_modules/gatsby/dist/bin/gatsby",
      "args": ["develop"],
      "stopOnEntry": false,
      "runtimeArgs": ["--nolazy"],
      "sourceMaps": false,
      "outputCapture": "std"
    }
  ]
}
```

> 最新的`gatsby@2.22.*`版本中[调试不能进到断点](https://github.com/gatsbyjs/gatsby/issues/24349),解决办法是降级到`2.21.*`,`yarn add gatsby@2.21.40`,等待官方修复再使用最新版本的

### 调试客户端

需要安装 [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) 扩展

```sh
ext install msjsdiag.debugger-for-chrome
```

添加配置文件`.vscode/launch.json`

```json
// .vscode/launch.json
{
  // 使用 IntelliSense 了解相关属性。
  // 悬停以查看现有属性的描述。
  // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Gatsby Client Debug",
      "url": "http://localhost:8000",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

先启动 Gatsby,`yarn develop`,然后按 F5 开始调试.
