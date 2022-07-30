import { PluginMetadata } from "../client/types";
import { ViewerOption } from "../client/components/Viewer";
import { VideoViewerPlugin } from "./VideoViewerPlugin";
import { PDFViewerPlugin } from "./PDFViewerPlugin";

const viewers: PluginMetadata<ViewerOption>[] = [
    VideoViewerPlugin,
    PDFViewerPlugin
];

export const plugins: {
    viewers: PluginMetadata<ViewerOption>[]
} = {
    viewers
};
