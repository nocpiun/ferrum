import { PluginMetadata } from "../src/client/types";

export const MusicPlayerPlugin: PluginMetadata = {
    name: "music-player",
    displayName: "音乐播放器",
    description: "打开与播放音乐文件",
    setup({ addViewer }) {
        addViewer({
            id: "music-player",
            pageTitle: "Ferrum 音乐播放器",
            route: "/music-player",
            formats: ["mp3", "ogg"],
            render: (dataUrl: string) => <audio src={dataUrl.replace("image", "audio")} controls></audio>
        });
    },
    native: true
};
