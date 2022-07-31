import PluginLoader from "./PluginLoader";

import { VideoViewerPlugin } from "../../registry/VideoViewerPlugin";
import { PDFViewerPlugin } from "../../registry/PDFViewerPlugin";

PluginLoader.get().register(VideoViewerPlugin);
PluginLoader.get().register(PDFViewerPlugin);
