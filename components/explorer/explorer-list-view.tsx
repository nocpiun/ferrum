import type { ViewProps } from "@/types";

import React from "react";
import { cn } from "@nextui-org/theme";
import { Divider } from "@nextui-org/divider";

import ExplorerItem from "./explorer-item";
import ExplorerError from "./explorer-error";

import { scrollbarStyle } from "@/lib/style";

interface ListViewProps extends ViewProps {}

const ExplorerListView: React.FC<ListViewProps> = ({ items, error, contextMenu, onContextMenu }) => {
    return (
        <div className="w-[730px] flex flex-col gap-1">
            <div className="w-full h-6 text-sm flex items-center gap-4 pr-5">
                <div className="w-[2%]"/> {/* placeholder */}
                <span className="flex-[2] cursor-default">名称</span>
                <Divider orientation="vertical"/>
                <span className="flex-1 cursor-default">类型</span>
                <Divider orientation="vertical"/>
                <span className="flex-1 cursor-default">大小</span>
            </div>

            <div
                className={cn("w-full relative flex-1 flex flex-col overflow-y-auto pr-5", scrollbarStyle)}
                onContextMenu={onContextMenu}>
                {
                    !error
                    ? items.map((item, index) => (
                        item.access
                        ? <ExplorerItem {...item} displayingMode="list" key={index}/>
                        : null // To hide inaccessible items
                    ))
                    : <ExplorerError error={error}/>
                }
            </div>

            {contextMenu}
        </div>
    );
}

export default ExplorerListView;
