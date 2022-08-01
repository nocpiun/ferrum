import { PluginMetadata } from "../src/client/types";

export const PDFViewerPlugin: PluginMetadata = {
    name: "pdf-viewer",
    displayName: "PDF查看器",
    description: "打开与查看PDF文件",
    setup({ addViewer }) {
        addViewer({
            id: "pdf-viewer",
            pageTitle: "Ferrum PDF查看器",
            route: "/pdf-viewer",
            formats: ["pdf"],
            render: (dataUrl: string) => <embed src={dataUrl} type="application/pdf"/>
        });
    },
    native: true
};
