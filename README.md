<div align="center">

<img src="./public/icon.png" style="width:82px;image-rendering:pixelated;"/>

# Ferrum Explorer

[![Author](https://img.shields.io/badge/Author-NriotHrreion-red.svg "Author")](https://github.com/NriotHrreion)
[![LICENSE](https://img.shields.io/badge/license-MIT-green.svg "LICENSE")](./LICENSE)
[![Using React](https://img.shields.io/badge/Using-React-blue.svg "Using React")](https://reactjs.org)
[![issues](https://img.shields.io/codeclimate/issues/NriotHrreion/ferrum "issues")](./issues)

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

## LICENSE

[MIT](./LICENSE)
