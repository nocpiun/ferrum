/* eslint-disable padding-line-between-statements */
"use client";

import type { BaseResponseData, DirectoryItem } from "@/types";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Divider } from "@nextui-org/divider";
import { toast } from "react-toastify";

import ExplorerItem from "./explorer-item";

import { useExplorer } from "@/hooks/useExplorer";

interface FolderResponseData extends BaseResponseData {
    items: DirectoryItem[]
}

interface ExplorerProps {
    currentPath?: string
}

const Explorer: React.FC<ExplorerProps> = ({ currentPath }) => {
    const explorer = useExplorer();
    const [items, setItems] = useState<DirectoryItem[]>([]);

    useEffect(() => {
        if(!currentPath || explorer.disk.length === 0) return;

        axios.get<FolderResponseData>(`/api/fs/folder?disk=${useExplorer.getState().disk}&path=${currentPath}`)
            .then(({ data }) => {
                var list: DirectoryItem[] = [];

                switch(data.status) {
                    case 400:
                        toast.error(`该路径无效 (${data.status})`);
                        return;
                    case 401:
                        toast.error(`未登录 (${data.status})`);
                        return;
                    case 403:
                        toast.error(`无效的访问token (${data.status})`);
                        return;
                    case 404:
                        toast.error(`该路径不存在 (${data.status})`);
                        return;
                    case 500:
                        toast.error(`服务器内部错误 (${data.status})`);
                        return;
                }

                data.items.forEach((item) => {
                    if(item.type === "folder") list.push(item);
                });
                data.items.forEach((item) => {
                    if(item.type === "file") list.push(item);
                });

                setItems(list);
            })
            .catch((err) => {
                setItems([]);
                toast.error(err);
                throw err;
            });
    }, [currentPath, explorer.disk]);

    return (
        <div className="w-[730px] flex flex-col gap-1">
            <div className="w-full h-6 text-sm flex items-center gap-4 pr-5">
                <span className="flex-[2] cursor-default">名称</span>
                <Divider orientation="vertical"/>
                <span className="flex-1 cursor-default">类型</span>
                <Divider orientation="vertical"/>
                <span className="flex-1 cursor-default">大小</span>
            </div>

            <div className="w-full flex-1 flex flex-col overflow-y-auto pr-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-default-200 hover:scrollbar-thumb-default-300 active:scrollbar-thumb-default-400 scrollbar-thumb-rounded-sm">
                {items.map((item, index) => (
                    item.access
                    ? <ExplorerItem {...item} key={index}/>
                    : null
                ))}
            </div>
        </div>
    );
}

export default Explorer;
