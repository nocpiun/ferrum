import FileViewer from "react-file-viewer";

import { PluginMetadata } from "../src/client/types";

export const DocViewerPlugin: PluginMetadata = {
    name: "doc-viewer",
    displayName: "文档查看器",
    description: "打开与查看文档文件",
    setup({ addViewer }) {
        addViewer({
            id: "doc-viewer",
            pageTitle: "Ferrum 文档查看器",
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
    native: true
};
