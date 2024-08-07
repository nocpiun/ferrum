"use client";

import type { ViewProps } from "@/types";

import React from "react";
import { cn } from "@nextui-org/theme";

import ExplorerItem from "./explorer-item";
import ExplorerError from "./explorer-error";

import { scrollbarStyle } from "@/lib/style";

interface GridViewProps extends ViewProps {}

const ExplorerGridView: React.FC<GridViewProps> = ({ items, error, contextMenu, onContextMenu }) => {
    return (
        <div className="w-[730px] flex mt-2">
            <div
                className={cn("w-full flex-1 grid grid-rows-[repeat(auto-fill,7rem)] grid-cols-[repeat(auto-fill,6.5rem)] gap-4 overflow-y-auto pr-2", scrollbarStyle)}
                onContextMenu={onContextMenu}>
                {
                    !error
                    ? items.map((item, index) => (
                        item.access
                        ? <ExplorerItem {...item} displayingMode="grid" key={index}/>
                        : null // To hide inaccessible items
                    ))
                    : <ExplorerError error={error}/>
                }
            </div>

            {contextMenu}
        </div>
    );
}

export default ExplorerGridView;
