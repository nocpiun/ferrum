"use client";

import React, { useEffect } from "react";
import { toast } from "react-toastify";

import { parseStringPath, useExplorer } from "@/hooks/useExplorer";
import { concatPath } from "@/lib/utils";
import { diskStorageKey } from "@/lib/global";
import { storage } from "@/lib/storage";
import { getViewer } from "@/lib/viewers";
import { useDetectCookie } from "@/hooks/useDetectCookie";

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

    useDetectCookie();

    if(!ViewerComponent) {
        toast.error("暂不支持打开此类型的文件");

        return <></>;
    }

    if(typeof window === "undefined") {
        // Fuck you ssr
        return <ViewerComponent path={explorer.disk + concatPath(folder, file)} fileName={file}/>;
    }

    return <ViewerComponent path={(explorer.disk || storage.getItem(diskStorageKey, "C:")) + concatPath(folder, file)} fileName={file}/>;
}
