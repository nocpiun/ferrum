import type { ViewItemProps } from "@/types";

import React from "react";
import { Checkbox } from "@nextui-org/checkbox";
import { Divider } from "@nextui-org/divider";

import { getFileIcon, getFolderIcon } from "./explorer-item";

import { formatSize, getFileTypeName } from "@/lib/utils";

interface ListViewItemProps extends ViewItemProps {}

const ExplorerListViewItem: React.FC<ListViewItemProps> = ({
    extname, selected, contextMenu, setSelected, handleSelection, handleOpen, onContextMenu, ...props
}) => {
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

            <span className="flex-1 text-default-400 text-right text-sm cursor-default">{props.type === "file" ? formatSize(props.size) : ""}</span>
            
            {contextMenu}
        </div>
    );
}

export default ExplorerListViewItem;
