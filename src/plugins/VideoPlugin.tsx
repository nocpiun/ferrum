import { ReactElement } from "react";

import FerrumPlugin from "../client/components/FerrumPlugin";
import { FerrumPluginOption, FerrumPluginProps, MainContextType } from "../client/types";

export default class VideoPlugin extends FerrumPlugin {
    public static option: FerrumPluginOption = {
        name: "video-viewer",
        title: "Ferrum 视频查看器",
        format: ["mp4", "avi"],
        route: "/video",
        self: VideoPlugin
    };

    public constructor(props: FerrumPluginProps, context: MainContextType) {
        super(props, context, VideoPlugin.option);
    }

    public viewerRender(dataUrl: string): ReactElement {
        return (
            <video src={dataUrl.replace("image", "video")} controls></video>
        );
    }
}
