import { PluginMetadata } from "../src/client/types";

export const VideoViewerPlugin: PluginMetadata = {
    name: "video-viewer",
    displayName: "视频查看器",
    description: "打开与查看视频文件",
    setup({ addViewer }) {
        addViewer({
            id: "video-viewer",
            pageTitle: "Ferrum 视频查看器",
            route: "/video-viewer",
            formats: ["mp4", "avi"],
            render: (dataUrl: string) => <video src={dataUrl.replace("image", "video")} controls></video>
        });
    },
    native: true
};
