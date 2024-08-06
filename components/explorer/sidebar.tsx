"use-client";

import React from "react";
import { Card } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";
import { FilePlus2, FileUp, FolderPlus, Star } from "lucide-react";

import { useExplorer } from "@/hooks/useExplorer";
import { useDialog } from "@/hooks/useDialog";

const Sidebar: React.FC = () => {
    const explorer = useExplorer();
    const dialog = useDialog();

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

    };

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
                    <Tooltip content="为当前文件夹加星">
                        <Button variant="light" size="sm" isIconOnly onPress={() => handleStar()}>
                            <Star size={17}/>
                            {/* <Star size={17} fill="currentColor"/> */}
                        </Button>
                    </Tooltip>
                </div>
            </div>

            <Card className="flex-1">
                <></>
            </Card>
        </div>
    );
}

export default Sidebar;
