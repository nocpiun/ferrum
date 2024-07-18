/* eslint-disable padding-line-between-statements */
"use client";

import type { BaseResponseData, SystemPlatform, Drive } from "@/types";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@nextui-org/input";
import { Card } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";
import { Dropdown, DropdownMenu, DropdownTrigger, DropdownItem } from "@nextui-org/dropdown";
import { ArrowLeft, HardDrive, Home } from "lucide-react";
import { to } from "preps";
import axios from "axios";
import { toast } from "react-toastify";

import Navbar from "@/components/explorer/navbar";
import Explorer from "@/components/explorer/explorer";
import { useExplorer } from "@/hooks/useExplorer";
import { useDetectCookie } from "@/hooks/useDetectCookie";
import { useFerrum } from "@/hooks/useFerrum";

interface DisksResponseData extends BaseResponseData {
    system: SystemPlatform
    disks: Drive[]
}

interface FileExplorerProps {
    params: {
        path: string[]
    }
}

export default function Page({ params }: FileExplorerProps) {
    const { path } = params;

    const router = useRouter();
    const ferrum = useFerrum();
    const explorer = useExplorer();
    const [currentPath, setCurrentPath] = useState<string>();

    const handleHome = () => {
        explorer.setPath(["root"]);
        router.push("/x/root");
    }

    const handleBack = () => {
        explorer.back();
        router.push("/x/root"+ explorer.stringifyPath());
    };

    useExplorer.subscribe((state, prevState) => {
        if(to(state.path).is(prevState.path)) return;

        setCurrentPath(state.stringifyPath());
    });

    useEffect(() => {
        if(
            !path ||
            path.length === 0 ||
            path[0] !== "root" ||
            !explorer.setPath(path) // set path while checking whether it is valid
        ) {
            router.push("/x/root");
            
            return;
        }

        axios.get<DisksResponseData>("/api/fs/disks")
            .then(({ data }) => {
                switch(data.status) {
                    case 401:
                        toast.error(`未登录 (${data.status})`);
                        return;
                    case 403:
                        toast.error(`无效的访问token (${data.status})`);
                        return;
                    case 500:
                        toast.error(`服务器内部错误 (${data.status})`);
                        return;
                }

                ferrum.setDisks(data.disks);

                if(data.system === "linux") {
                    explorer.setDisk("/");
                } else if(data.system === "win32") {
                    explorer.setDisk("C:");
                }
            })
            .catch((err) => {
                toast.error(err);
                throw err;
            });

        document.title = "Ferrum - "+ explorer.stringifyPath();

        // Trigger the explorer to fetch the folder info
        setCurrentPath(explorer.stringifyPath());
    }, []);

    useDetectCookie();

    return (
        <div className="w-full h-full pb-10 flex flex-col items-center space-y-3">
            <div className="w-[1000px] flex items-end gap-2">
                <div className="flex gap-1">
                    <Tooltip content="返回根目录">
                        <Button
                            isIconOnly
                            className="flex justify-center"
                            variant="light"
                            onClick={() => handleHome()}
                            isDisabled={explorer.path.length === 1}>
                            <Home size={20}/>
                        </Button>
                    </Tooltip>
                    <Tooltip content="返回上一级">
                        <Button
                            isIconOnly
                            className="flex justify-center"
                            variant="light"
                            onClick={() => handleBack()}
                            isDisabled={explorer.path.length === 1}>
                            <ArrowLeft size={20}/>
                        </Button>
                    </Tooltip>
                </div>

                <Input
                    className="flex-1 !mt-6"
                    classNames={{
                        input: [
                            "px-1",
                        ],
                        label: [
                            "text-sm"
                        ]
                    }}
                    label="搜索文件 / 文件夹"
                    labelPlacement="outside"/>
                
                <Dropdown>
                    <Tooltip content="选择磁盘">
                        <div>
                            <DropdownTrigger>
                                <Button
                                    className="flex justify-center"
                                    variant="light">
                                    <HardDrive size={20}/>
                                    {explorer.disk}
                                </Button>
                            </DropdownTrigger>
                        </div>
                    </Tooltip>
                    <DropdownMenu
                        disallowEmptySelection
                        selectionMode="single"
                        selectedKeys={[explorer.disk]}
                        onSelectionChange={(keys) => explorer.setDisk(Array.from(keys)[0] as string)}>
                        {
                            ferrum.getMountedList().map((mountedName) => (
                                <DropdownItem key={mountedName}>{mountedName}</DropdownItem>
                            ))
                        }
                    </DropdownMenu>
                </Dropdown>
            </div>
            <Navbar className="w-[1000px] px-3"/>

            <div className="w-[1000px] h-[78vh] flex gap-7">
                <Card className="flex-1"/>

                <Explorer currentPath={currentPath}/>
            </div>
        </div>
    );
}
