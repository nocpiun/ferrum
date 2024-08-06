/* eslint-disable react-hooks/rules-of-hooks */
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
    FileAudio,
    AppWindow,
    FileDigit,
    FileCode2,
    BookMarked
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useContextMenu, ContextMenuItem, ContextMenuDivider } from "use-context-menu";

import { useExplorer } from "@/hooks/useExplorer";
import { concatPath, formatSize, getFileType, getFileTypeName } from "@/lib/utils";
import { getViewer } from "@/lib/viewers";
import { useDialog } from "@/hooks/useDialog";
import { useFile } from "@/hooks/useFile";
import { useFolder } from "@/hooks/useFolder";

export function getFolderIcon(folderName: string, size: number = 18, color?: string): React.ReactNode {
    const folderNameLowered = folderName.toLowerCase();
    const className = "min-w-[20px]";

    if(folderNameLowered === ".git") return <FolderGit2 size={size} color={color} className={className}/>;
    if(/^\.\S+/.test(folderNameLowered)) return <FolderDot size={size} color={color} className={className}/>;
    if(/^(favo(u?)rite(s?))$/.test(folderNameLowered)) return <FolderHeart size={size} color={color} className={className}/>;
    if(/^(music|song(s?))$/.test(folderNameLowered)) return <Music size={size} color={color} className={className}/>;
    if(/^(picture(s?)|image(s?)|photo(s?))$/.test(folderNameLowered)) return <Images size={size} color={color} className={className}/>;
    if(/^(video(s?)|film(s?)|movie(s?))$/.test(folderNameLowered)) return <Film size={size} color={color} className={className}/>;
    
    return <Folder size={size} color={color} className={className}/>;
}

export function getFileIcon(extname: string, size: number = 18, color?: string): React.ReactNode {
    const fileType = getFileType(extname);
    const className = "min-w-[20px]";

    switch(fileType?.id) {
        case "archive":
            return <FileArchive size={size} color={color} className={className}/>;
        case "audio":
            return <FileAudio size={size} color={color} className={className}/>;
        case "image":
            return <FileImage size={size} color={color} className={className}/>;
        case "video":
            return <FileVideo size={size} color={color} className={className}/>;
        case "document":
            return <FileText size={size} color={color} className={className}/>;
        case "powerpoint":
            return <FilePieChart size={size} color={color} className={className}/>;
        case "excel":
            return <FileSpreadsheet size={size} color={color} className={className}/>;
        case "font":
            return <FileType2 size={size} color={color} className={className}/>;
        case "executable":
            return <AppWindow size={size} color={color} className={className}/>;
        case "binary":
            return <FileDigit size={size} color={color} className={className}/>;
        case "code":
            return <FileCode2 size={size} color={color} className={className}/>;
        case "markdown":
            return <BookMarked size={size} color={color} className={className}/>;
    }

    return <File size={size} color={color} className={className}/>;
}

interface ExplorerItemProps extends DirectoryItem {}

const ExplorerItem: React.FC<ExplorerItemProps> = (props) => {
    const extname = useMemo(() => props.name.split(".").findLast(() => true), [props.name]);
    const size = useMemo(() => formatSize(props.size), [props.size]);
    
    const [selected, setSelected] = useState<boolean>(false);
    
    const dialog = useDialog();
    const explorer = useExplorer();
    const router = useRouter();
    
    const fullPath = useMemo(() => concatPath(explorer.stringifyPath(), props.name), [explorer, props.name]);
    const file = useFile(fullPath);
    const folder = useFolder(fullPath);

    const handleOpen = () => {
        setSelected(false);
        
        if(props.type === "file") {
            const viewerType = getFileType(extname ?? "")?.id;
            
            if(!viewerType || !getViewer(viewerType)) {
                toast.error("暂不支持打开此类型的文件");
                
                return;
            }
            
            explorer.setCurrentViewing(props.name);
            router.push(`/explorer/viewer?type=${viewerType}&folder=${explorer.stringifyPath()}&file=${props.name}`);

            return;
        }

        explorer.enterPath(props.name);
    };

    const handleSelection = () => {
        setSelected((s) => !s);
    };

    const handleDownload = () => {
        if(props.type !== "file") return;

        file.download();
    };

    const handleStar = () => {
        folder.toggleStar();
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

    const { contextMenu, onContextMenu } = useContextMenu(
        <>
            <ContextMenuItem onSelect={() => handleOpen()}>打开</ContextMenuItem>
            <ContextMenuItem onSelect={() => {
                dialog.open(props.type === "folder" ? "renameFolder" : "renameFile", {
                    path: fullPath,
                    oldName: props.name
                });
            }}>重命名</ContextMenuItem>
            {props.type === "file" && <ContextMenuItem onSelect={() => handleDownload()}>下载</ContextMenuItem>}
            {props.type === "folder" && <ContextMenuItem onSelect={() => handleStar()}>
                {
                    folder.getIsStarred()
                    ? "取消星标"
                    : "星标"
                }
            </ContextMenuItem>}
            <ContextMenuDivider />
            <ContextMenuItem onSelect={() => {
                dialog.open(props.type === "folder" ? "removeFolder" : "removeFile", {
                    path: fullPath
                });
            }}>删除</ContextMenuItem>
        </>
    );

    return (
        <div
            className="w-full min-h-8 text-md flex items-center gap-4"
            onClick={() => handleSelection()}
            onKeyDown={({ key }) => {
                key === "Enter" && handleSelection();
            }}
            role="button"
            tabIndex={0}>
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
                    onDoubleClick={() => handleOpen()}
                    onContextMenu={onContextMenu}>
                    {props.name}
                </button>
            </div>

            <Divider orientation="vertical" className="bg-transparent"/>

            <span className="flex-1 text-default-400 text-sm cursor-default">{props.type === "folder" ? "文件夹" : getFileTypeName(extname)}</span>
            
            <Divider orientation="vertical" className="bg-transparent"/>

            <span className="flex-1 text-default-400 text-right text-sm cursor-default">{props.type === "file" ? (size) : ""}</span>
            
            {contextMenu}
        </div>
    );
};

export default ExplorerItem;
