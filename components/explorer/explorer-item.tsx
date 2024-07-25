"use client";

import type { DirectoryItem } from "@/types";

import React, { useState, useMemo, useEffect } from "react";
import { Divider } from "@nextui-org/divider";
import { Checkbox } from "@nextui-org/checkbox";
import {
    Folder,
    FolderGit2,
    FolderDot,
    FolderHeart,
    Music,
    Film,
    File,
    FileArchive,
    FileText,
    FilePieChart,
    FileSpreadsheet,
    FileType2,
    FileImage,
    Images,
    FileVideo,
    FileAudio
} from "lucide-react";

import { useExplorer } from "@/hooks/useExplorer";
import { formatSize, getFileTypeName } from "@/lib/utils";

export function getFolderIcon(folderName: string, size: number = 18, color?: string): React.ReactNode {
    const folderNameLowered = folderName.toLowerCase();

    if(folderNameLowered === ".git") return <FolderGit2 size={size} color={color}/>;
    if(/^\.\S+/.test(folderNameLowered)) return <FolderDot size={size} color={color}/>;
    if(/^(favo(u?)rite(s?))$/.test(folderNameLowered)) return <FolderHeart size={size} color={color}/>;
    if(/^(music|song(s?))$/.test(folderNameLowered)) return <Music size={size} color={color}/>;
    if(/^(picture(s?)|image(s?)|photo(s?))$/.test(folderNameLowered)) return <Images size={size} color={color}/>;
    if(/^(video(s?)|film(s?)|movie(s?))$/.test(folderNameLowered)) return <Film size={size} color={color}/>;
    
    return <Folder size={size} color={color}/>;
}

export function getFileIcon(extname: string, size: number = 18, color?: string): React.ReactNode {
    const extnameLowered = extname.toLowerCase();
    const className = "min-w-[20px]";

    if(
        extnameLowered === "zip" ||
        extnameLowered === "rar" ||
        extnameLowered === "tar" ||
        extnameLowered === "7z" ||
        extnameLowered === "gz" ||
        extnameLowered === "bz2" ||
        extnameLowered === "xz"
    ) return <FileArchive size={size} color={color} className={className}/>
    if(
        extnameLowered === "mp3" ||
        extnameLowered === "wav" ||
        extnameLowered === "ogg" ||
        extnameLowered === "flac"
    ) return <FileAudio size={size} color={color} className={className}/>
    if(
        extnameLowered === "jpg" ||
        extnameLowered === "jpeg" ||
        extnameLowered === "png" ||
        extnameLowered === "gif" ||
        extnameLowered === "bmp" ||
        extnameLowered === "webp" ||
        extnameLowered === "svg" ||
        extnameLowered === "ico"
    ) return <FileImage size={size} color={color} className={className}/>
    if(
        extnameLowered == "mp4" ||
        extnameLowered == "mkv" ||
        extnameLowered == "avi" ||
        extnameLowered == "mov" ||
        extnameLowered == "mpg" ||
        extnameLowered == "mpeg" ||
        extnameLowered == "wmv" ||
        extnameLowered == "webm" ||
        extnameLowered == "flv"
    ) return <FileVideo size={size} color={color} className={className}/>
    if(extnameLowered === "doc" || extnameLowered === "docx") return <FileText size={size} color={color} className={className}/>
    if(extnameLowered === "ppt" || extnameLowered === "pptx") return <FilePieChart size={size} color={color} className={className}/>
    if(extnameLowered === "xls" || extnameLowered === "xlsx") return <FileSpreadsheet size={size} color={color} className={className}/>
    if(
        extnameLowered === "ttf" ||
        extnameLowered === "otf" ||
        extnameLowered === "woff" ||
        extnameLowered === "woff2"
    ) return <FileType2 size={size} color={color} className={className}/>

    return <File size={size} color={color} className={className}/>;
}

interface ExplorerItemProps extends DirectoryItem {}

const ExplorerItem: React.FC<ExplorerItemProps> = (props) => {
    const extname = useMemo(() => props.name.split(".").findLast(() => true), [props.name]);
    const size = useMemo(() => formatSize(props.size), [props.size]);

    const [selected, setSelected] = useState<boolean>(false);
    
    const explorer = useExplorer();

    const handleClick = (e: React.MouseEvent) => {
        setSelected(false);
        explorer.enterPath(props.name);

        // To prevent the click event of the parent element
        // which will select the checkbox of the item
        e.stopPropagation();
    };

    useEffect(() => {
        setSelected(false);
    }, [explorer.path]);

    useEffect(() => {
        document.body.addEventListener("keydown", (e) => {
            if(e.key === "a" && e.ctrlKey) {
                e.preventDefault();
                setSelected(true);
            }
        });
    }, []);

    return (
        <div className="w-full min-h-8 text-md flex items-center gap-4" onClick={() => setSelected((s) => !s)}>
            <div className="w-[2%] flex items-center">
                <Checkbox
                    className=""
                    size="sm"
                    isSelected={selected}
                    onValueChange={(value) => setSelected(value)}/>
            </div>

            <div className="flex-[2] min-w-0 flex items-center gap-2">
                {(
                    props.type === "folder" ? getFolderIcon(props.name, 20, "#9e9e9e") : getFileIcon(extname ?? "txt", 20, "#9e9e9e")
                ) as React.ReactNode}
                <button
                    className="text-ellipsis whitespace-nowrap cursor-pointer overflow-hidden hover:underline hover:text-primary-500"
                    onClick={(e) => handleClick(e)}>
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
