"use client";

import type { ViewItemProps } from "@/types";

import React from "react";
import { Checkbox } from "@nextui-org/checkbox";
import { Tooltip } from "@nextui-org/tooltip";

import { getFileIcon, getFolderIcon } from "./explorer-item";

import { concatPath, formatSize, getFileType, getFileTypeName } from "@/lib/utils";
import { useExplorer } from "@/hooks/useExplorer";

interface GridViewItemProps extends ViewItemProps {}

const ExplorerGridViewItem: React.FC<GridViewItemProps> = ({
    extname, size, selected, contextMenu, setSelected, handleSelection, handleOpen, onContextMenu, ...props
}) => {
    const explorer = useExplorer();

    return (
        <div
            className="w-[6.5rem] h-28 flex flex-col items-center overflow-hidden relative"
            onClick={() => handleSelection()}
            onKeyDown={({ key }) => {
                key === "Enter" && handleSelection();
            }}
            role="button"
            tabIndex={0}>
            <div className="absolute top-1 left-1">
                <Checkbox
                    className=""
                    size="sm"
                    isSelected={selected}
                    onValueChange={(value) => setSelected(value)}/>
            </div>

            <Tooltip
                content={
                    <div className="text-left">
                        <p>名称：{props.name}</p>
                        <p>类型：{props.type === "folder" ? "文件夹" : getFileTypeName(extname)}</p>
                        {props.type === "file" && <p>大小：{formatSize(size)}</p>}
                    </div>
                }
                placement="bottom">
                <div
                    className="flex-1 flex justify-center items-center pt-5 cursor-pointer"
                    onDoubleClick={() => handleOpen()}
                    onContextMenu={onContextMenu}>
                    {
                        props.type === "folder"
                        ? getFolderIcon(props.name, 34)
                        : (
                            getFileType(extname ?? "")?.id === "image"
                            ? <img
                                className="max-w-[50px] max-h-16"
                                src={`/api/fs/thumbnail?path=${explorer.disk + concatPath(explorer.stringifyPath(), props.name)}`}
                                alt="thumbnail"/>
                            : getFileIcon(extname ?? "", 34)
                        )
                    }
                </div>
            </Tooltip>
                
            <button
                className="w-full text-center text-sm overflow-hidden whitespace-nowrap text-ellipsis cursor-pointer hover:underline hover:text-primary-500"
                onDoubleClick={() => handleOpen()}
                onContextMenu={onContextMenu}>
                {props.name}
            </button>

            {contextMenu}
        </div>
    );
}

export default ExplorerGridViewItem;
