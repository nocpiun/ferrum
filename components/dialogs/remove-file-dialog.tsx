"use-client";

import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";

import { DialogStore, useDialog } from "@/hooks/useDialog";
import { useExplorer } from "@/hooks/useExplorer";
import { useFile } from "@/hooks/useFile";

interface RemoveFileDialogData {
    path?: string
}

const RemoveFileDialog: React.FC = () => {
    const { type, data, isOpened, close } = useDialog() as DialogStore<RemoveFileDialogData>;
    const explorer = useExplorer();
    const file = useFile(data?.path ?? "");

    const isCurrentDialog = isOpened && type === "removeFile";
    
    const handleEnter = async () => {
        await file.remove();
        handleClose();
        explorer.refresh();
    };

    const handleClose = () => {
        close();
    };

    if(!isCurrentDialog) return <></>;

    return (
        <Modal isOpen={isCurrentDialog} onOpenChange={(isOpened) => (!isOpened && handleClose())}>
            <ModalContent>
                <ModalHeader>删除文件</ModalHeader>
                <ModalBody>
                    <span>确定删除 <code>{explorer.disk + data?.path}</code> ？</span>
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
                        onPress={() => handleEnter()}>确定</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default RemoveFileDialog;
