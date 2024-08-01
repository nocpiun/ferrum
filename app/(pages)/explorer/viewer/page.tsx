/* eslint-disable import/order */
"use client";

import React, { useEffect } from "react";

import { parseStringPath, useExplorer } from "@/hooks/useExplorer";
import { concatPath } from "@/lib/utils";
import { ViewerProps } from "@/components/viewers";
import { diskStorageKey } from "@/lib/global";
import { storage } from "@/lib/storage";

// Viewers
import TextViewer from "@/components/viewers/text-viewer";
import ImageViewer from "@/components/viewers/image-viewer";
import VideoViewer from "@/components/viewers/video-viewer";
import AudioViewer from "@/components/viewers/audio-viewer";

function getViewer(type: string): typeof React.Component<ViewerProps> {
    switch(type) {
        case "image":
            return ImageViewer;
        case "audio":
            return AudioViewer;
        case "video":
            return VideoViewer;
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
        default:
            return TextViewer;
    }
}

export default function Page({ searchParams }: {
    searchParams: {
        type: string
        folder: string
        file: string
    }
}) {
    const { type, folder, file } = searchParams;
    const explorer = useExplorer();
    const ViewerComponent = getViewer(type);

    useEffect(() => {
        explorer.setDisk(storage.getItem(diskStorageKey, "C:"));
        explorer.setPath(parseStringPath(folder));
        explorer.setCurrentViewing(file);
    }, []);

    return <ViewerComponent path={(explorer.disk || storage.getItem(diskStorageKey, "C:")) + concatPath(folder, file)} fileName={file}/>;
}
