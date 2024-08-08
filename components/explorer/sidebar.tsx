"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";
import { FilePlus2, FileUp, FolderPlus, Star } from "lucide-react";

import SidebarWidget from "./sidebar-widget";
import StarredItem from "./starred-item";

import { useExplorer } from "@/hooks/useExplorer";
import { useDialog } from "@/hooks/useDialog";
import { useFolder } from "@/hooks/useFolder";
import { useEmitter } from "@/hooks/useEmitter";
import { useForceUpdate } from "@/hooks/useForceUpdate";
import { storage } from "@/lib/storage";
import { starListStorageKey } from "@/lib/global";

const Sidebar: React.FC = () => {
    const explorer = useExplorer();
    const dialog = useDialog();
    const folder = useFolder(explorer.stringifyPath());

    const [starred, setStarred] = useState(folder.getIsStarred());
    const forceUpdate = useForceUpdate();

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

    useEmitter([
        ["star-list-change", () => forceUpdate()]
    ]);

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

            <Card className="flex-1 p-2 space-y-1 dark:bg-[#111]">
                <SidebarWidget title="星标项目">
                    <div>
                        {
                            (JSON.parse(storage.getItem(starListStorageKey, JSON.stringify([]))) as string[]).map((item, index) => (
                                <StarredItem itemPath={item} key={index}/>
                            ))
                        }
                    </div>
                </SidebarWidget>
            </Card>
        </div>
    );
}

export default Sidebar;
