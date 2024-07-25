/* eslint-disable padding-line-between-statements */
"use client";

import type { BaseResponseData, DirectoryItem } from "@/types";

import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { Divider } from "@nextui-org/divider";
import { toast } from "react-toastify";

import ExplorerItem from "./explorer-item";
import ExplorerError from "./explorer-error";

import { useExplorer } from "@/hooks/useExplorer";

interface FolderResponseData extends BaseResponseData {
    items: DirectoryItem[]
}

const Explorer: React.FC = () => {
    const explorer = useExplorer();
    const [items, setItems] = useState<DirectoryItem[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if(explorer.path.length === 0 || explorer.disk.length === 0) return;

        axios.get<FolderResponseData>(`/api/fs/folder?disk=${explorer.disk}&path=${explorer.stringifyPath()}`)
            .then(({ data }) => {
                var list: DirectoryItem[] = [];

                data.items.forEach((item) => {
                    if(item.type === "folder") list.push(item);
                });
                data.items.forEach((item) => {
                    if(item.type === "file") list.push(item);
                });

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

    return (
        <div className="w-[730px] flex flex-col gap-1">
            <div className="w-full h-6 text-sm flex items-center gap-4 pr-5">
                <span className="flex-[2] cursor-default">名称</span>
                <Divider orientation="vertical"/>
                <span className="flex-1 cursor-default">类型</span>
                <Divider orientation="vertical"/>
                <span className="flex-1 cursor-default">大小</span>
            </div>

            <div className="w-full relative flex-1 flex flex-col overflow-y-auto pr-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-default-200 hover:scrollbar-thumb-default-300 active:scrollbar-thumb-default-400 scrollbar-thumb-rounded-sm">
                {
                    !error
                    ? items.map((item, index) => (
                        item.access
                        ? <ExplorerItem {...item} key={index}/>
                        : null // To hide inaccessible items
                    ))
                    : <ExplorerError error={error}/>
                }
            </div>
        </div>
    );
}

export default Explorer;
