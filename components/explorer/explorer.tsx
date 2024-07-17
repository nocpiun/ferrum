"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Divider } from "@nextui-org/divider";

import ExplorerItem from "./explorer-item";

import { BaseResponseData, DirectoryItem } from "@/types";

interface FolderResponseData extends BaseResponseData {
    items: DirectoryItem[]
}

interface ExplorerProps {
    currentPath?: string
}

const Explorer: React.FC<ExplorerProps> = ({ currentPath }) => {
    const [items, setItems] = useState<DirectoryItem[]>([]);
    const currentDisk = "D"; // for dev

    useEffect(() => {
        if(!currentPath || currentPath === "/") return;

        axios.get<FolderResponseData>(`/api/folder?disk=${currentDisk}&path=${currentPath}`)
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
            .catch((err) => {
                setItems([]);
                throw err;
            });
    }, [currentPath]);

    return (
        <div className="w-[730px] flex flex-col gap-2">
            <div className="w-full h-6 text-sm flex items-center gap-4">
                <span className="flex-1 cursor-default">名称</span>
                <Divider orientation="vertical"/>
                <span className="flex-1 cursor-default">类型</span>
                <Divider orientation="vertical"/>
                <span className="flex-1 cursor-default">大小</span>
            </div>

            <div className="w-full flex-1 flex flex-col">
                {items.map((item, index) => (
                    <ExplorerItem {...item} key={index}/>
                ))}
            </div>
        </div>
    );
}

export default Explorer;
