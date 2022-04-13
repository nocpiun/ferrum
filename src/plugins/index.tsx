import { FerrumPluginOption } from "../client/types";
import VideoPlugin from "./VideoPlugin";
import PDFPlugin from "./PDFPlugin";

export const plugins: FerrumPluginOption[] = [
    VideoPlugin.option,
    PDFPlugin.option
];
