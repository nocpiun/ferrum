<div align="center">

<img src="./public/icon.png" style="width:82px;image-rendering:pixelated;"/>

# 🌏 Ferrum 文件管理器

[![Author](https://img.shields.io/badge/Author-NriotHrreion-red.svg "Author")](https://github.com/NriotHrreion)
[![LICENSE](https://img.shields.io/badge/license-MIT-green.svg "LICENSE")](./LICENSE)
[![Stars](https://img.shields.io/github/stars/NriotHrreion/ferrum.svg?label=Stars)](https://github.com/NriotHrreion/ferrum/stargazers)
[![test](https://img.shields.io/github/workflow/status/NriotHrreion/ferrum/Run%20Code%20Tests)](https://github.com/NriotHrreion/ferrum/actions/workflows/node.js.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/e6af7829-7b1c-47ed-bf14-deb2b2d9648a/deploy-status)](https://app.netlify.com/sites/resonant-kitsune-43a162/deploys)

> Explore throughout your server

[English](./README.md) | 中文

</div>

## 简介

Ferrum 文件管理器是一个基于Web的服务器文件管理器应用.

因为此项目只被我一个人维护, 所以有很多问题和bug. 你可以为此项目题issue来告诉我或者开一个Pull Request来修复它.

#### 为什么它的名字是ferrum?

```
File Explorer -> FE -> Fe (化学元素) -> Ferrum
```

#### 我可以看看它吗?

Demo: https://ferrum-demo.nin.red (密码: `123456`)

## 部署 & 使用

首先, 你需要确保你的服务器（或电脑）已经安装了Nodejs.

1. 下载与安装

```bash
git clone https://github.com/NriotHrreion/ferrum.git
cd ferrum
npm i
```

2. 运行

```bash
npm run start
```

如果你用的是Linux, 你需要在这个命令前面加上`sudo`.

3. 进入 `http://localhost:3300`, 默认密码是`123456`.

### 获取更新

执行下面的命令, 然后再`npm run start`.

```bash
git fetch origin main:temp
git merge temp
npm i
```

如果在`npm i`的时候报错, 可以试试看:

```bash
npm i --legacy-peer-deps
# or
npm i --force
```

### 注意事项

Ferrum 文件管理器需要`3300`与`3301`两个端口来启动. 如果它报错`address already in use :::xxxx`, 那么你就得检查一下是否你已经启动了Ferrum以及其它应用是否在占用这两个端口, 然后看看下面的步骤.

**Windows**

```bash
netstat -aon | findstr [[此处写它返回的端口号]]
taskkill /f /pid [[此处写上面命令返回的PID]]
```

**Linux & Mac OS**

```bash
lsof -i:[[此处写它返回的端口号]]
kill -9 [[此处写上面命令返回的PID]]
```

如果你在Linux环境下遇到`ENOSPC: System limit for number of file watchers reached, watch 'xxx'`, 那么请尝试:

```bash
sudo sysctl fs.inotify.max_user_watches=582222 && sudo sysctl -p
```

## 插件

#### 编写文件查看器插件

如果你打算写一个查看器插件, 你首先需要创建一个`tsx`后缀的文件, 然后你需要为你的插件提供如下的信息. (下面是一个完整的示例).

```js
({
    name: "example-viewer",
    displayName: "Example Viewer",
    setup({ addViewer }) {
        addViewer({
            id: "example-viewer", // 插件ID
            pageTitle: "Example Viewer", // 查看器页面的标题
            route: "/example-viewer", // 查看器页面的路由
            formats: [], // 查看器支持的文件格式
            render: (dataUrl: string) => <div>{dataUrl}</div> // 查看器页面的渲染器 (`dataUrl`是一个base64的data url)
        });
    }
})
```

然后, 在设置中添加你的插件.

## 测试

Ferrum使用Jest来测试代码.

```bash
npm run test
```

## 贡献

欢迎为Ferrum 文件管理器做贡献. 如果你不知道怎么做, 请看: [Creating a Pull Request from a Fork](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork).

我会在我有空的时候检查Pull Request, 但我不敢保证每个Pull Request都会立刻被我看见.

## 运行脚本

一些在`package.json`里的运行脚本.

- **`start`** 在生产模式下启动App
- **`dev`** 在开发模式下启动App
- **`server`** 只启动后端服务器
- **`client`** 只启动客户端
- **`build`** 构建项目（不单独使用）
- **`build:netlify`** 构建项目（Netlify部署专用）
- **`test`** 运行测试代码

## Note

> **Fun Fact:** 此项目向[Takenote](https://github.com/taniarascia/takenote)学习了许多. Takenote也非常牛逼.

## LICENSE

[MIT](./LICENSE)
