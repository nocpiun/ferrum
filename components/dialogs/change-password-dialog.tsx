"use-client";

import React from "react";
import { useRouter } from "next/navigation";
import md5 from "md5";
import axios, { type AxiosError } from "axios";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

import { DialogStore, useDialog } from "@/hooks/useDialog";
import { tokenStorageKey } from "@/lib/global";

const schema = z.object({
    oldPassword: z.string().min(6, { message: "请输入当前密码" }),
    newPassword: z.string().min(6, { message: "请输入新密码，且密码长度应至少6位" }),
});

const ChangePasswordDialog: React.FC = () => {
    const { type, isOpened, close } = useDialog() as DialogStore<{}>;
    const router = useRouter();

    const isCurrentDialog = isOpened && type === "changePassword";
    
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            oldPassword: "",
            newPassword: ""
        }
    });
    
    const handleEnter = async ({ oldPassword, newPassword }: z.infer<typeof schema>) => {
        if(oldPassword === newPassword) {
            toast.warn("新密码不可与当前密码一致");

            return;
        }

        if(newPassword.length < 6) {
            toast.warn("密码长度应至少为6位");

            return;
        }

        try {
            const { status } = await axios.patch("/api/auth", {
                oldPassword: md5(oldPassword),
                newPassword: md5(newPassword)
            });

            if(status === 200) {
                toast.success("密码修改成功");
                handleClose();

                // Logout
                Cookies.remove(tokenStorageKey);
                router.refresh();
            }
        } catch (_err) {
            const err = _err as AxiosError;
            const status = err.response?.status ?? 0;

            switch(status) {
                case 400:
                    toast.error(`请求无效 (${status})`);
                    break;
                case 401:
                    toast.error(`访问密码错误 (${status})`);
                    break;
                case 403:
                    toast.error(`无效的访问token (${status})`);
                    break;
                case 500:
                    toast.error(`服务器内部错误 (${status})`);
                    break;
            }
        }
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
                    <ModalHeader>设置访问密码</ModalHeader>
                    <ModalBody>
                        <Input
                            {...form.register("oldPassword")}
                            isRequired
                            isInvalid={form.formState.errors.oldPassword !== undefined}
                            label="当前密码"
                            type="password"
                            labelPlacement="outside"
                            autoComplete="off"
                            errorMessage={form.formState.errors.oldPassword?.message}/>
                        <Input
                            {...form.register("newPassword")}
                            isRequired
                            isInvalid={form.formState.errors.newPassword !== undefined}
                            label="新密码"
                            type="password"
                            labelPlacement="outside"
                            autoComplete="off"
                            errorMessage={form.formState.errors.newPassword?.message}/>
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

export default ChangePasswordDialog;
