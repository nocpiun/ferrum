/* eslint-disable import/order */
import React from "react";
import dynamic from "next/dynamic";

import { ViewerProps } from "@/components/viewers";

// Viewers
import TextViewer from "@/components/viewers/text-viewer";
import ImageViewer from "@/components/viewers/image-viewer";
import VideoViewer from "@/components/viewers/video-viewer";
import AudioViewer from "@/components/viewers/audio-viewer";
/** @see https://github.com/wojtekmaj/react-pdf/issues/1811#issuecomment-2151416080 */
const PDFViewer = dynamic(() => import("@/components/viewers/pdf-viewer"), { ssr: false }) as typeof React.Component<ViewerProps>;

export function getViewer(type: string): typeof React.Component<ViewerProps> | null {
    switch(type) {
        case "text":
        case "command":
        case "config":
        case "git":
        case "npm":
        case "docker":
        case "markdown":
        case "license":
        case "environment":
        case "code":
            return TextViewer;
        case "image":
            return ImageViewer;
        case "audio":
            return AudioViewer;
        case "video":
            return VideoViewer;
        case "pdf":
            return PDFViewer;
        default:
            return null;
    }
}
