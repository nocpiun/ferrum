"use-client";

import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Checkbox } from "@nextui-org/checkbox";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { DialogStore, useDialog } from "@/hooks/useDialog";
import { useExplorer } from "@/hooks/useExplorer";
import { useFolder } from "@/hooks/useFolder";
import { isDemo } from "@/lib/global";

const schema = z.object({
    folderName: z.string().min(1, { message: "请输入文件夹名称" }).optional(),
    enterFolder: z.boolean()
});

interface CreateFolderDialogData {
    path?: string
}

const CreateFolderDialog: React.FC = () => {
    const { type, data, isOpened, close } = useDialog() as DialogStore<CreateFolderDialogData>;
    const explorer = useExplorer();
    const folder = useFolder(data?.path ?? "");

    const isCurrentDialog = isOpened && type === "createFolder";
    
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            folderName: "",
            enterFolder: false
        }
    });
    
    const handleEnter = async ({ folderName, enterFolder }: z.infer<typeof schema>) => {
        if(!folderName || folderName === "") return;
        
        await folder.create(folderName, "folder");
        handleClose();
        
        enterFolder
        ? explorer.enterPath(folderName)
        : explorer.refresh();
    };

    const handleClose = () => {
        form.reset();
        close();
    };

    if(!isCurrentDialog) return <></>;

    return (
        <Modal isOpen={isCurrentDialog} onOpenChange={(isOpened) => (!isOpened && handleClose())}>
            <ModalContent>
                <form onSubmit={form.handleSubmit(handleEnter)}>
                    <ModalHeader>新建文件夹</ModalHeader>
                    <ModalBody>
                        <span>目标路径: <code>{explorer.disk + data?.path}</code></span>

                        <Input
                            {...form.register("folderName")}
                            isRequired
                            label="文件夹名称"
                            labelPlacement="outside"
                            autoComplete="off"/>
                        
                        <Checkbox
                            {...form.register("enterFolder")}
                            isDisabled={isDemo}>
                            创建后进入文件夹
                        </Checkbox>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            size="sm"
                            color="danger"
                            variant="light"
                            onPress={() => handleClose()}>取消</Button>
                        <Button
                            size="sm"
                            color="primary"
                            type="submit">确定</Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}

export default CreateFolderDialog;
