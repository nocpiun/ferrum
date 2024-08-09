import path from "path";

import React from "react";
import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";
import { ContextMenuItem, useContextMenu } from "use-context-menu";

import { getFolderIcon } from "./explorer-item";

import { parseStringPath, useExplorer } from "@/hooks/useExplorer";
import { useFolder } from "@/hooks/useFolder";

interface StarredItemProps {
    itemPath: string
}

const StarredItem: React.FC<StarredItemProps> = ({ itemPath }) => {
    const explorer = useExplorer();
    const itemName = path.basename(itemPath);
    const folder = useFolder(itemPath.replace(explorer.disk, ""));

    const handleOpen = () => {
        explorer.setDisk(itemPath.split("/")[0]);
        explorer.setPath(parseStringPath(itemPath));
    };

    const handleUnstar = () => {
        folder.toggleStar();
    };

    const { contextMenu, onContextMenu } = useContextMenu(
        <>
            <ContextMenuItem onSelect={() => handleOpen()}>打开</ContextMenuItem>
            <ContextMenuItem onSelect={() => handleUnstar()}>取消星标</ContextMenuItem>
        </>
    );

    return (
        <div
            className="inline-block m-1"
            aria-label={itemName}>
            <Tooltip content={itemPath}>
                <Button
                    color="default"
                    variant="flat"
                    size="sm"
                    onPress={() => handleOpen()}
                    onContextMenu={onContextMenu}>
                    {getFolderIcon(itemName)}
                    {itemName}
                </Button>
            </Tooltip>
            
            {contextMenu}
        </div>
    );
}

export default StarredItem;
