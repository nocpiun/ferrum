"use-client";

import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";

import { DialogStore, useDialog } from "@/hooks/useDialog";
import { useExplorer } from "@/hooks/useExplorer";
import { useFolder } from "@/hooks/useFolder";

interface RemoveFolderDialogData {
    path?: string
}

const RemoveFolderDialog: React.FC = () => {
    const { type, data, isOpened, close } = useDialog() as DialogStore<RemoveFolderDialogData>;
    const explorer = useExplorer();
    const folder = useFolder(data?.path ?? "");

    const isCurrentDialog = isOpened && type === "removeFolder";
    
    const handleEnter = async () => {
        await folder.remove();
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
                <ModalHeader>删除文件夹</ModalHeader>
                <ModalBody>
                    <span>确定删除此文件夹？</span>
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

export default RemoveFolderDialog;
