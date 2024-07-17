"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@nextui-org/input";
import { Card } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";
import { ArrowLeft, Home } from "lucide-react";
import { to } from "preps";

import Navbar from "@/components/explorer/navbar";
import { useExplorer } from "@/hooks/useExplorer";
import { useDetectCookie } from "@/hooks/useDetectCookie";
import Explorer from "@/components/explorer/explorer";

interface FileExplorerProps {
    params: {
        path: string[]
    }
}

export default function Page({ params }: FileExplorerProps) {
    const { path } = params;

    const router = useRouter();
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

        document.title = "Ferrum - "+ explorer.stringifyPath();

        // Trigger the explorer to fetch the folder info
        setCurrentPath(explorer.stringifyPath());
    }, []);

    useDetectCookie();

    return (
        <div className="w-full h-full pb-10 flex flex-col items-center space-y-3">
            <div className="w-[1000px] flex items-end gap-2">
                <div className="flex">
                    <Tooltip content="返回根目录">
                        <Button
                            isIconOnly
                            className="flex justify-center"
                            variant="light"
                            onClick={() => handleHome()}>
                            <Home size={20}/>
                        </Button>
                    </Tooltip>
                    <Tooltip content="返回上一级">
                        <Button
                            isIconOnly
                            className="flex justify-center"
                            variant="light"
                            onClick={() => handleBack()}>
                            <ArrowLeft size={20}/>
                        </Button>
                    </Tooltip>
                </div>

                <Input
                    className="flex-1"
                    classNames={{
                        input: [
                            "px-1",
                        ],
                    }}
                    label="搜索文件 / 文件夹"
                    labelPlacement="outside"/>
            </div>
            <Navbar className="w-[1000px] px-3"/>

            <div className="w-[1000px] h-full flex gap-7">
                <Card className="flex-1"/>

                <Explorer currentPath={currentPath}/>
            </div>
        </div>
    );
}
