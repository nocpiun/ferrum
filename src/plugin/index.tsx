import PluginLoader from "./PluginLoader";

import { VideoViewerPlugin } from "../../registry/VideoViewerPlugin";
import { PDFViewerPlugin } from "../../registry/PDFViewerPlugin";
import { MusicPlayerPlugin } from "../../registry/MusicPlayerPlugin";

// Native plugins
PluginLoader.get().register(VideoViewerPlugin);
PluginLoader.get().register(PDFViewerPlugin);
PluginLoader.get().register(MusicPlayerPlugin);
