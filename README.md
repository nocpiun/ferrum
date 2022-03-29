<div align="center">

<img src="./public/icon.png" style="width:82px;image-rendering:pixelated;"/>

# Ferrum Explorer

[![Author](https://img.shields.io/badge/Author-NriotHrreion-red.svg "Author")](https://github.com/NriotHrreion)
[![LICENSE](https://img.shields.io/badge/license-MIT-green.svg "LICENSE")](./LICENSE)
[![Using React](https://img.shields.io/badge/Using-React-blue.svg "Using React")](https://reactjs.org)
[![issues](https://img.shields.io/codeclimate/issues/NriotHrreion/ferrum "issues")](https://github.com/NriotHrreion/ferrum/issues)

</div>

> This project hasn't completed yet...

## Description

Ferrum Explorer is a web-based file explorer app for servers.
Because it's only maintained by me, so it has many problems and bugs. You can create a issue or pull request to tell me or fix it.

#### Why its name is Ferrum?

```
File Explorer -> FE -> Fe (Chemical Element) -> Ferrum
```

## Deploy & Use

First, you need to make sure that your server (or computer) has installed Nodejs.

1. Download and install

```bash
git clone https://github.com/NriotHrreion/ferrum.git
cd ferrum
npm i
```

2. Run the app

```bash
npm run start
```

3. Enter `http://localhost:3300` (Usually, this step will be done automatically by the system. You just need to do the second step and wait a second.)

#### Something to notice

Ferrum Explorer requires ports `3300` `3301` to launch. If you see it reports `address already in use :::xxxx`, you should have a check to whether you've launched Ferrum Explorer and whether other apps are using the ports. And see the following steps.

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

## Plugin

There is a plugin folder `/src/plugins`. Under the folder, there are plugins (although it's only one now) which are viewers for different kinds of file formats (e.g. *.mp4 *.avi).

It's necessary to explain that the plugins are only used as viewers now. I might add more feature to it in the future.

Viewer is a page that is shown when the user opens a file. The viewer's page will be shown when the user opens the file format(s) the viewer's option has specified. For example, a video viewer, its page will be shown when the user open a `.mp4` file.

To write a plugin, you need to create a new `tsx` file first. The name of the file had better end with `Plugin`.

And a info list of the plugin is needed.

```tsx
{
    name: "example", // The name of your plugin
    title: "Example", // This will be shown on the top of your plugin's page
    format: [], // The formats that your plugin supports
    route: "/example", // The route of your plugin's page
    self: ExamplePlugin // The class of your plugin
}
```

This is an example plugin. Also be in (`/src/plugins/VideoPlugin.tsx`).

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

The components in the method `viewerRender()` will be rendered at the center of the whole page. And the param `dataUrl` is the data url (base64) of file that opened. It can be used directory in `src`, but you should pay attention to the mime type of the url _("data:**image/png**;base64,.......")_

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

Last, you should add your new plugin into the plugin list (`/src/plugins/index.tsx`).

```tsx
export const plugins: FerrumPluginOption[] = [
    VideoPlugin.option,
    MyPlugin.option,
    OtherPlugin.option,
    // ... just add your plugin into it
];
```

## Testing

Ferrum Explorer is using Jest to test code.

```bash
npm run test
```

## Contributing

Contributions to Ferrum Explorer are welcomed. You can fork this project and start your contributing. If you don't know how to do, please follow the instruction [Creating a Pull Request from a Fork](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork).

I'll check the Pull Request list in my spare time. I can't make sure that every Pull Request will be seen by me at once.

## Scripts

An explanation of the `package.json` scripts.

- **`start`** Launch the client and server at the same time
- **`server`** Only launch the server
- **`client`** Only launch the client
- **`build`** Create a production build (Not support)
- **`test`** Run tests

## Note

**Some features haven't completed yet.** I'll try my best to complete them.

> **Fun Fact:** This project learnt a lot from [Takenote](https://github.com/taniarascia/takenote). Takenote is also awesome.

## LICENSE

[MIT](./LICENSE)
