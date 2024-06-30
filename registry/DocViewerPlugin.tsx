import FileViewer from "react-file-viewer";

import { PluginMetadata } from "../src/client/types";

const i18n = {
    "zh-CN": {
        "viewer.doc.name": "文档查看器",
        "viewer.doc.description": "打开与查看文档文件",
        "viewer.doc.title": "Ferrum 文档查看器"
    },
    "zh-TW": {
        "viewer.doc.name": "文檔查看器",
        "viewer.doc.description": "打開與查看文檔文件",
        "viewer.doc.title": "Ferrum 文檔查看器"
    },
    "en": {
        "viewer.doc.name": "Doc Viewer",
        "viewer.doc.description": "Open and view a document",
        "viewer.doc.title": "Ferrum Doc Viewer"
    }
};

export const DocViewerPlugin: PluginMetadata = {
    name: "doc-viewer",
    displayName: "$viewer.doc.name",
    description: "$viewer.doc.description",
    setup({ addViewer }) {
        addViewer({
            id: "doc-viewer",
            pageTitle: "$viewer.doc.title",
            route: "/doc-viewer",
            formats: ["pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx"],
            render: (dataUrl: string, type: string) => {
                return (
                    <FileViewer
                        fileType={type}
                        filePath={dataUrl}/>
                );
            }
        });
    },
    i18n,
    native: true
};
