"use client";

import React, { useEffect } from "react";

import { useExplorer } from "@/hooks/useExplorer";
import TextViewer from "@/components/viewers/text-viewer";

function getViewer(type: string): typeof React.Component {
    switch(type) {
        case "text":
            return TextViewer;
        default:
            return TextViewer;
    }
}

export default function Page({ searchParams }: {
    searchParams: { type: string }
}) {
    const explorer = useExplorer();
    const { type } = searchParams;
    const ViewerComponent = getViewer(type);

    useEffect(() => {
        document.title = "文件查看器 - "+ explorer.stringifyPath();
    }, []);

    return <ViewerComponent path={explorer.path + (explorer.currentViewing ?? "")}/>;
}
