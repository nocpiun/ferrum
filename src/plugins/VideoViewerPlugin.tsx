import { ViewerOption } from "../client/components/Viewer";
import { PluginMetadata } from "../client/types";

export const VideoViewerPlugin: PluginMetadata<ViewerOption> = {
    name: "video-viewer",
    displayName: "Ferrum 视频查看器",
    entry: {
        route: "/video-viewer",
        formats: ["mp4", "avi"],
        render: (dataUrl: string) => <video src={dataUrl.replace("image", "video")} controls></video>
    }
};
