/* eslint-disable no-console */
"use-client";

import React, { useRef } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';

import { DialogStore, useDialog } from "@/hooks/useDialog";
import { useExplorer } from "@/hooks/useExplorer";

import "filepond/dist/filepond.min.css";
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import "@/styles/filepond.css";

registerPlugin(FilePondPluginImagePreview);

interface UploadFileDialogData {
    path?: string
}

const UploadFileDialog: React.FC = () => {
    const { type, data, isOpened, close } = useDialog() as DialogStore<UploadFileDialogData>;
    const explorer = useExplorer();
    const pondRef = useRef<FilePond | null>(null);

    const isCurrentDialog = isOpened && type === "uploadFile";

    const handleClose = () => {
        close();
    };

    if(!isCurrentDialog) return <></>;

    return (
        <Modal isOpen={isCurrentDialog} onOpenChange={(isOpened) => (!isOpened && handleClose())}>
            <ModalContent>
                <ModalHeader>上传文件</ModalHeader>
                <ModalBody>
                    <span>目标路径: <code>{explorer.disk + data?.path}</code></span>

                    <FilePond
                        allowMultiple
                        server={`/api/fs/upload?disk=${explorer.disk}&path=${data?.path}`}
                        labelIdle="拖拽 / 选择文件"
                        oninit={() => console.log("Filepond is ready.", pondRef.current)}
                        onprocessfile={() => explorer.refresh()}
                        ref={pondRef}/>
                </ModalBody>
                <ModalFooter>
                    <Button
                        size="sm"
                        color="primary"
                        onPress={() => handleClose()}>完成</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default UploadFileDialog;
