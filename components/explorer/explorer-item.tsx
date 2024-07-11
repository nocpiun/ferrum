"use client";

import React, { ReactNode } from "react";
import { Divider } from "@nextui-org/divider";
import { File } from "lucide-react";
import { useRouter } from "next/navigation";
import mime from "mime";
import {
    Folder,
    FolderGit2,
    FolderDot,
    FolderHeart,
    Music,
    Images,
    Film
} from "lucide-react";

import { DirectoryItem } from "@/types";
import { useExplorer } from "@/hooks/useExplorer";

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
    const type = mime.getExtension(props.name);
    
    const router = useRouter();
    const explorer = useExplorer();

    const handleClick = () => {
        explorer.enterPath(props.name);
        router.push("/x/root"+ explorer.stringifyPath());
    };

    return (
        <div className="w-full h-8 text-md flex items-center gap-4">
            <div className="flex-1 flex items-center gap-2">
                {(
                    props.type === "folder" ? getIcon(props.name, 20, "#9e9e9e") : <File size={20} color="#9e9e9e"/>
                ) as ReactNode}
                <button
                    className="hover:underline hover:text-primary-500 cursor-pointer"
                    onClick={() => handleClick()}>
                    {props.name}
                </button>
            </div>
            <Divider orientation="vertical" className="bg-transparent"/>
            <span className="flex-1 text-default-400 text-sm cursor-default">{props.type === "folder" ? "文件夹" : type}</span>
            <Divider orientation="vertical" className="bg-transparent"/>
            <span className="flex-1 text-default-400 text-sm cursor-default">{props.size.toFixed(2) +" KB"}</span>
        </div>
    );
};

export default ExplorerItem;
