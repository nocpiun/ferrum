/* eslint-disable padding-line-between-statements */
"use client";

import type { BaseResponseData, DirectoryItem } from "@/types";

import React, { useState, useEffect } from "react";
import axios, { type AxiosError } from "axios";
import { toast } from "react-toastify";
import { ContextMenuItem, useContextMenu } from "use-context-menu";

import ExplorerListView from "./explorer-list-view";
import ExplorerGridView from "./explorer-grid-view";

import { useExplorer } from "@/hooks/useExplorer";
import { useDialog } from "@/hooks/useDialog";
import { useForceUpdate } from "@/hooks/useForceUpdate";
import { useEmitter } from "@/hooks/useEmitter";
import { getExtname, getFileType } from "@/lib/utils";
import { emitter } from "@/lib/emitter";

interface FolderResponseData extends BaseResponseData {
    items: DirectoryItem[]
}

const Explorer: React.FC = () => {
    const explorer = useExplorer();
    const dialog = useDialog();
    const forceUpdate = useForceUpdate();

    const [items, setItems] = useState<DirectoryItem[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if(explorer.path.length === 0 || explorer.disk.length === 0) return;

        axios.get<FolderResponseData>(`/api/fs/folder?disk=${explorer.disk}&path=${explorer.stringifyPath()}`)
            .then(({ data }) => {
                var list: DirectoryItem[] = [];

                // Classify the directory items
                // And count the amount of image files
                var imageCount = 0;
                data.items.forEach((item) => {
                    if(item.type === "folder") list.push(item);
                });
                data.items.forEach((item) => {
                    if(item.type === "file") {
                        list.push(item);
                        if(getFileType(getExtname(item.name))?.id === "image") {
                            imageCount++;
                        }
                    }
                });

                const defaultDisplayingMode = imageCount >= 5 ? "grid" : "list";
                explorer.displayingMode = defaultDisplayingMode;
                emitter.emit("displaying-mode-change", defaultDisplayingMode);

                setItems(list);
            })
            .catch((err: AxiosError) => {
                const status = err.response?.status ?? 0;

                setItems([]);

                switch(status) {
                    case 400:
                        setError(`该路径无效 (${status})`);
                        return;
                    case 401:
                        toast.error(`未登录 (${status})`);
                        return;
                    case 403:
                        toast.error(`无效的访问token (${status})`);
                        return;
                    case 404:
                        setError(`找不到该路径 (${status})`);
                        return;
                    case 500:
                        toast.error(`服务器内部错误 (${status})`);
                        return;
                }

                throw err;
            });
        
        return () => setError(null);
    }, [explorer]);

    useEmitter([
        ["displaying-mode-change", () => forceUpdate()]
    ]);

    const { contextMenu, onContextMenu } = useContextMenu(
        <>
            <ContextMenuItem onSelect={() => dialog.open("createFolder", { path: explorer.stringifyPath() })}>新建文件夹</ContextMenuItem>
            <ContextMenuItem onSelect={() => dialog.open("createFile", { path: explorer.stringifyPath() })}>新建文件</ContextMenuItem>
            <ContextMenuItem onSelect={() => dialog.open("uploadFile", { path: explorer.stringifyPath() })}>上传文件</ContextMenuItem>
        </>
    );

    return (
        explorer.displayingMode === "list"
        ? <ExplorerListView items={items} error={error} contextMenu={contextMenu} onContextMenu={onContextMenu}/>
        : <ExplorerGridView items={items} error={error} contextMenu={contextMenu} onContextMenu={onContextMenu}/>
    );
}

export default Explorer;
