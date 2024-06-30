import { PluginMetadata } from "../src/client/types";

const i18n = {
    "zh-CN": {
        "viewer.video.name": "视频查看器",
        "viewer.video.description": "打开与查看视频文件",
        "viewer.video.title": "Ferrum 视频查看器"
    },
    "zh-TW": {
        "viewer.video.name": "視頻查看器",
        "viewer.video.description": "打開與查看視頻文件",
        "viewer.video.title": "Ferrum 視頻查看器"
    },
    "en": {
        "viewer.video.name": "Video Viewer",
        "viewer.video.description": "Open and view a video file",
        "viewer.video.title": "Ferrum Video Viewer"
    }
};

export const VideoViewerPlugin: PluginMetadata = {
    name: "video-viewer",
    displayName: "$viewer.video.name",
    description: "$viewer.video.description",
    setup({ addViewer }) {
        addViewer({
            id: "video-viewer",
            pageTitle: "$viewer.video.title",
            route: "/video-viewer",
            formats: ["mp4", "avi"],
            render: (dataUrl: string) => <video src={dataUrl} controls></video>
        });
    },
    i18n,
    native: true
};
