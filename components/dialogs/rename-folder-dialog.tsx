"use-client";

import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { DialogStore, useDialog } from "@/hooks/useDialog";
import { useExplorer } from "@/hooks/useExplorer";
import { useFolder } from "@/hooks/useFolder";

const schema = z.object({
    folderName: z.string().min(1, { message: "请输入文件夹名称" }).optional(),
});

interface RenameFolderDialogData {
    path?: string
    oldName?: string
}

const RenameFolderDialog: React.FC = () => {
    const { type, data, isOpened, close } = useDialog() as DialogStore<RenameFolderDialogData>;
    const explorer = useExplorer();
    const folder = useFolder(data?.path ?? "");

    const isCurrentDialog = isOpened && type === "renameFolder";
    
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            folderName: data?.oldName
        }
    });
    
    const handleEnter = async ({ folderName }: z.infer<typeof schema>) => {
        if(folderName === data?.oldName || !folderName) return;
        
        await folder.rename(folderName);
        handleClose();
        explorer.refresh();
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
                    <ModalHeader>重命名文件夹</ModalHeader>
                    <ModalBody>
                        <Input
                            {...form.register("folderName", { value: data?.oldName })}
                            isRequired
                            label="文件夹名称"
                            labelPlacement="outside"
                            autoComplete="off"/>
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

export default RenameFolderDialog;
