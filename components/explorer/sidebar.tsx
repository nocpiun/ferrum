"use-client";
import path from "path";

import React, { useEffect, useState } from "react";
import { Card } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";
import { FilePlus2, FileUp, FolderPlus, Star } from "lucide-react";

import { getFolderIcon } from "./explorer-item";
import SidebarWidget from "./sidebar-widget";

import { parseStringPath, useExplorer } from "@/hooks/useExplorer";
import { useDialog } from "@/hooks/useDialog";
import { useFolder } from "@/hooks/useFolder";
import { storage } from "@/lib/storage";
import { starListStorageKey } from "@/lib/global";

const Sidebar: React.FC = () => {
    const explorer = useExplorer();
    const dialog = useDialog();
    const folder = useFolder(explorer.stringifyPath());

    const [starred, setStarred] = useState(folder.getIsStarred());

    const handleCreateFolder = () => {
        dialog.open("createFolder", { path: explorer.stringifyPath() });
    };

    const handleCreateFile = () => {
        dialog.open("createFile", { path: explorer.stringifyPath() });
    };

    const handleUploadFile = () => {
        dialog.open("uploadFile", { path: explorer.stringifyPath() });
    };

    const handleStar = () => {
        folder.toggleStar();
        setStarred((current) => !current);
    };

    useEffect(() => {
        setStarred(folder.getIsStarred());
    });

    return (
        <div className="flex-1 flex flex-col gap-2">
            <div className="flex justify-between">
                <div className="flex gap-1">
                    <Tooltip content="新建文件夹">
                        <Button variant="light" size="sm" isIconOnly onPress={() => handleCreateFolder()}>
                            <FolderPlus size={17}/>
                        </Button>
                    </Tooltip>
                    <Tooltip content="新建文件">
                        <Button variant="light" size="sm" isIconOnly onPress={() => handleCreateFile()}>
                            <FilePlus2 size={17}/>
                        </Button>
                    </Tooltip>
                    <Tooltip content="上传文件">
                        <Button variant="light" size="sm" isIconOnly onPress={() => handleUploadFile()}>
                            <FileUp size={17}/>
                        </Button>
                    </Tooltip>
                </div>

                <div className="flex gap-1">
                    <Tooltip content="星标">
                        <Button variant="light" size="sm" isIconOnly onPress={() => handleStar()} isDisabled={explorer.path.length === 1}>
                            {
                                starred
                                ? <Star size={17} fill="currentColor"/>
                                : <Star size={17}/>
                            }
                        </Button>
                    </Tooltip>
                </div>
            </div>

            <Card className="flex-1 p-2 space-y-1">
                <SidebarWidget title="星标项目">
                    <div>
                        {
                            (JSON.parse(storage.getItem(starListStorageKey, JSON.stringify([]))) as string[]).map((item, index) => {
                                const itemName = path.basename(item);

                                return (
                                    <div
                                        className="inline-block m-1"
                                        aria-label={itemName}
                                        key={index}>
                                        <Tooltip content={item}>
                                            <Button color="default" variant="flat" size="sm" onPress={() => explorer.setPath(parseStringPath(item))}>
                                                {getFolderIcon(itemName)}
                                                {itemName}
                                            </Button>
                                        </Tooltip>
                                    </div>
                                );
                            })
                        }
                    </div>
                </SidebarWidget>
            </Card>
        </div>
    );
}

export default Sidebar;
