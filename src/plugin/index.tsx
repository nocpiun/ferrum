import PluginLoader from "./PluginLoader";

import { VideoViewerPlugin } from "../../registry/VideoViewerPlugin";
import { MusicPlayerPlugin } from "../../registry/MusicPlayerPlugin";
import { SVGViewerPlugin } from "../../registry/SVGViewerPlugin";
import { DocViewerPlugin } from "../../registry/DocViewerPlugin";

// Native plugins
PluginLoader.get().register(VideoViewerPlugin);
PluginLoader.get().register(MusicPlayerPlugin);
PluginLoader.get().register(SVGViewerPlugin);
PluginLoader.get().register(DocViewerPlugin);
