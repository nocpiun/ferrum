import { ViewerOption } from "../client/components/Viewer";
import { PluginMetadata } from "../client/types";

export const PDFViewerPlugin: PluginMetadata<ViewerOption> = {
    name: "pdf-viewer",
    displayName: "Ferrum PDF查看器",
    entry: {
        route: "/pdf-viewer",
        formats: ["pdf"],
        render: (dataUrl: string) => <embed src={dataUrl.replace("image", "application")} type="application/pdf"/>
    }
};
