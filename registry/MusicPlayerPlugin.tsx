import { PluginMetadata } from "../src/client/types";

const i18n = {
    "zh-CN": {
        "viewer.music.name": "音乐播放器",
        "viewer.music.description": "打开与播放音乐文件",
        "viewer.music.title": "Ferrum 音乐播放器"
    },
    "zh-TW": {
        "viewer.music.name": "音樂播放器",
        "viewer.music.description": "打開與播放音樂文件",
        "viewer.music.title": "Ferrum 音樂播放器"
    },
    "en": {
        "viewer.music.name": "Music Player",
        "viewer.music.description": "Open and play a music file",
        "viewer.music.title": "Ferrum Music Player"
    }
};

export const MusicPlayerPlugin: PluginMetadata = {
    name: "music-player",
    displayName: "$viewer.music.name",
    description: "$viewer.music.description",
    setup({ addViewer }) {
        addViewer({
            id: "music-player",
            pageTitle: "$viewer.music.title",
            route: "/music-player",
            formats: ["mp3", "ogg"],
            render: (dataUrl: string) => <audio src={dataUrl} controls></audio>
        });
    },
    i18n,
    native: true
};
