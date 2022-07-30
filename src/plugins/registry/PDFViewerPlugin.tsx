import { PluginMetadata } from "../../client/types";

export const PDFViewerPlugin: PluginMetadata = {
    name: "pdf-viewer",
    displayName: "PDF查看器",
    setup({ addViewer }) {
        addViewer({
            id: "pdf-viewer",
            pageTitle: "Ferrum PDF查看器",
            route: "/pdf-viewer",
            formats: ["pdf"],
            render: (dataUrl: string) => <embed src={dataUrl.replace("image", "application")} type="application/pdf"/>
        });
    }
};
