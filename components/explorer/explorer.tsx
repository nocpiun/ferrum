"use client";

import React, { useEffect } from "react";
import axios from "axios";
import { Divider } from "@nextui-org/divider";

import ExplorerItem from "./explorer-item";

import { BaseResponseData, DirectoryItem } from "@/types";

interface FolderResponseData extends BaseResponseData {
    items: DirectoryItem[]
}

var cache: React.ReactNode[];

/** @see https://dev.to/tusharshahi/using-suspense-with-react-without-a-3rd-party-library-3i2b */
function fetchFolderData(path: string): React.ReactNode[] {
    if(cache) return cache;

    const promise = axios.get<FolderResponseData>(`/api/folder?path=${path}`)
        .then(({ data }) => {
            return data.items.map((item, index) => (
                <ExplorerItem {...item} key={index}/>
            ));
        })
        .then((nodes) => {
            cache = nodes;

            return nodes;
        });
    
    throw promise;
}

interface ExplorerProps {
    currentPath: string
}

const Explorer: React.FC<ExplorerProps> = ({ currentPath }) => {
    const nodes = fetchFolderData(currentPath);

    useEffect(() => {
        /**
         * I can't figure it out that why the browser
         * just cannot stop loading the page after
         * fetching the folder data...
         * 
         * So the only thing I can do is stop it from
         * loading manually by `window.stop()`
         * 
         * This can't be a perfect way to fix this,
         * but I think it's ok.
         */
        window.stop(); // fuck
    }, []);

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
                {nodes}
            </div>
        </div>
    );
}

export default Explorer;
