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
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

function getViewer(type: string): typeof React.Component<ViewerProps> | null {
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
        default:
            return null;
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
    const router = useRouter();

    const ViewerComponent = getViewer(type);

    useEffect(() => {
        explorer.setDisk(storage.getItem(diskStorageKey, "C:"));
        explorer.setPath(parseStringPath(folder));
        explorer.setCurrentViewing(file);
    }, []);

    if(!ViewerComponent) {
        toast.error("暂不支持打开此类型的文件");
        router.back();

        return <></>;
    }

    return <ViewerComponent path={(explorer.disk || storage.getItem(diskStorageKey, "C:")) + concatPath(folder, file)} fileName={file}/>;
}
