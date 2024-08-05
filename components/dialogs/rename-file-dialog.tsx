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
import { useFile } from "@/hooks/useFile";

const schema = z.object({
    fileName: z.string().min(1, { message: "请输入文件名称" }).optional(),
});

interface RenameFileDialogData {
    path?: string
    oldName?: string
}

const RenameFileDialog: React.FC = () => {
    const { type, data, isOpened, close } = useDialog() as DialogStore<RenameFileDialogData>;
    const explorer = useExplorer();
    const file = useFile(data?.path ?? "");

    const isCurrentDialog = isOpened && type === "renameFile";
    
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            fileName: data?.oldName
        }
    });
    
    const handleEnter = async ({ fileName }: z.infer<typeof schema>) => {
        if(fileName === data?.oldName || !fileName) return;
        
        await file.rename(fileName);
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
                    <ModalHeader>重命名文件</ModalHeader>
                    <ModalBody>
                        <Input
                            {...form.register("fileName", { value: data?.oldName })}
                            isRequired
                            label="文件名称"
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

export default RenameFileDialog;
