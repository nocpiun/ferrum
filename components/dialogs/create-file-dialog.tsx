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
    fileName: z.string().min(1, { message: "请输入文件名称" }).optional(),
});

interface CreateFileDialogData {
    path?: string
}

const CreateFileDialog: React.FC = () => {
    const { type, data, isOpened, close } = useDialog() as DialogStore<CreateFileDialogData>;
    const explorer = useExplorer();
    const folder = useFolder(data?.path ?? "");

    const isCurrentDialog = isOpened && type === "createFile";
    
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            fileName: ""
        }
    });
    
    const handleEnter = async ({ fileName }: z.infer<typeof schema>) => {
        if(!fileName || fileName === "") return;
        
        await folder.create(fileName, "file");
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
                    <ModalHeader>新建文件</ModalHeader>
                    <ModalBody>
                        <span>目标路径: <code>{explorer.disk + data?.path}</code></span>

                        <Input
                            {...form.register("fileName")}
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

export default CreateFileDialog;
