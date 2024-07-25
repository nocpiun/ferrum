"use client";

import type { DirectoryItem } from "@/types";

import React, { ReactNode, useMemo } from "react";
import { Divider } from "@nextui-org/divider";
import { Checkbox } from "@nextui-org/checkbox";
import { File } from "lucide-react";
import {
    Folder,
    FolderGit2,
    FolderDot,
    FolderHeart,
    Music,
    Images,
    Film
} from "lucide-react";

import { useExplorer } from "@/hooks/useExplorer";
import { formatSize, getFileTypeName } from "@/lib/utils";

export function getIcon(folderName: string, size: number = 18, color?: string): React.ReactNode {
    const folderNameLowered = folderName.toLowerCase();

    if(folderNameLowered === ".git") return <FolderGit2 size={size} color={color}/>;
    if(/^\.\S+/.test(folderNameLowered)) return <FolderDot size={size} color={color}/>;
    if(/^(favo(u?)rite(s?))$/.test(folderNameLowered)) return <FolderHeart size={size} color={color}/>;
    if(/^(music|song(s?))$/.test(folderNameLowered)) return <Music size={size} color={color}/>;
    if(/^(picture(s?)|image(s?)|photo(s?))$/.test(folderNameLowered)) return <Images size={size} color={color}/>;
    if(/^(video(s?)|film(s?)|movie(s?))$/.test(folderNameLowered)) return <Film size={size} color={color}/>;
    
    return <Folder size={size} color={color}/>;
}

interface ExplorerItemProps extends DirectoryItem {}

const ExplorerItem: React.FC<ExplorerItemProps> = (props) => {
    const extname = props.name.split(".").findLast(() => true);
    const size = useMemo(() => formatSize(props.size), [props.size]);
    
    const explorer = useExplorer();

    const handleClick = () => {
        explorer.enterPath(props.name);
    };

    return (
        <div className="w-full min-h-8 text-md flex items-center gap-4">
            <div className="w-[2%] flex items-center">
                <Checkbox
                    className=""
                    size="sm"/>
            </div>

            <div className="flex-[2] min-w-0 flex items-center gap-2">
                {(
                    props.type === "folder" ? getIcon(props.name, 20, "#9e9e9e") : (
                        <File size={20} color="#9e9e9e" className="min-w-[20px]"/>
                    )
                ) as ReactNode}
                <button
                    className="text-ellipsis whitespace-nowrap cursor-pointer overflow-hidden hover:underline hover:text-primary-500"
                    onClick={() => handleClick()}>
                    {props.name}
                </button>
            </div>
            <Divider orientation="vertical" className="bg-transparent"/>
            <span className="flex-1 text-default-400 text-sm cursor-default">{props.type === "folder" ? "文件夹" : getFileTypeName(extname)}</span>
            <Divider orientation="vertical" className="bg-transparent"/>
            <span className="flex-1 text-default-400 text-right text-sm cursor-default">{props.type === "file" ? (size) : ""}</span>
        </div>
    );
};

export default ExplorerItem;