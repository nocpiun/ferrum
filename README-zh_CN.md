<div align="center">

<img src="./public/icon.png" style="width:82px;image-rendering:pixelated;"/>

# 🌏 Ferrum 文件管理器

[![Author](https://img.shields.io/badge/Author-NriotHrreion-red.svg "Author")](https://github.com/NriotHrreion)
[![LICENSE](https://img.shields.io/badge/license-MIT-green.svg "LICENSE")](./LICENSE)
[![Stars](https://img.shields.io/github/stars/NriotHrreion/ferrum.svg?label=Stars)](https://github.com/NriotHrreion/ferrum/stargazers)
[![test](https://img.shields.io/github/workflow/status/NriotHrreion/ferrum/Run%20Code%20Tests)](https://github.com/NriotHrreion/ferrum/actions/workflows/node.js.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/e6af7829-7b1c-47ed-bf14-deb2b2d9648a/deploy-status)](https://app.netlify.com/sites/resonant-kitsune-43a162/deploys)

> Explore throughout your server

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
netstat -aon | findstr [[here write the port it reported]]
taskkill /f /pid [[here write the PID the above command returned]]
```

**Linux & Mac OS**

```bash
lsof -i:[[here write the port it reported]]
kill -9 [[here write the PID the above command returned]]
```

如果你在Linux环境下遇到`ENOSPC: System limit for number of file watchers reached, watch 'xxx'`, 那么请尝试:

```bash
sudo sysctl fs.inotify.max_user_watches=582222 && sudo sysctl -p
```

## 插件

插件文件夹是`/src/plugins`, 这个文件夹包含了为不同文件类型准备的文件查看器（比如 *.mp4 *.avi）. 有必要说明, 插件系统现在只被用于文件查看器, 我以后或许会再添加更多功能.

如果你打算写一个插件, 你首先需要创建一个`tsx`后缀的文件, 文件名最好要以`Plugin`结尾.

然后你需要为你的插件提供如下的信息.

```tsx
{
    name: "example", // The name of your plugin
    title: "Example", // This will be shown on the top of your plugin's page
    format: [], // The formats that your plugin supports
    route: "/example", // The route of your plugin's page
    self: ExamplePlugin // The class of your plugin
}
```

下面是一个示例插件, 你也可以在`/src/plugins/VideoPlugin.tsx`查看.

```tsx
import { ReactElement } from "react";

import FerrumPlugin from "../client/components/FerrumPlugin";
import { FerrumPluginOption, FerrumPluginProps } from "../client/types";

export default class VideoPlugin extends FerrumPlugin {
    public static option: FerrumPluginOption = { // The info list
        name: "video-viewer",
        title: "Ferrum 视频查看器",
        format: ["mp4", "avi"],
        route: "/video",
        self: VideoPlugin
    };

    public constructor(props: FerrumPluginProps) {
        super(props, VideoPlugin.option);
    }

    public viewerRender(dataUrl: string): ReactElement {
        return (
            <video src={dataUrl.replace("image", "video")} controls></video>
        );
    }
}
```

`viewerRender()`方法返回的React组件会被渲染在整个页面的中央, 传入的参数`dataUrl`是被打开的文件的Data URL (base64), 同时, 你也应注意这个URL的MIME格式类型: _("data:**image/png**;base64,.......")_

```tsx
export default class ExamplePlugin extends FerrumPlugin {
    // ...

    public viewerRender(dataUrl: string): ReactElement {
        return (
            // ...
        );
    }

    // ...
}
```

最后, 在插件列表(`/src/plugins/index.tsx`)中加入你的新插件.

```tsx
export const plugins: FerrumPluginOption[] = [
    VideoPlugin.option,
    MyPlugin.option,
    OtherPlugin.option,
    // ... just add your plugin into it
];
```

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
