"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@nextui-org/input";

import Navbar from "@/components/explorer/navbar";
import { useExplorer } from "@/hooks/useExplorer";
import { useDetectCookie } from "@/hooks/useDetectCookie";

interface FileExplorerProps {
    params: {
        path: string[]
    }
}

export default function Page({ params }: FileExplorerProps) {
    const { path } = params;

    const router = useRouter();
    const explorer = useExplorer();

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
    }, []);

    useDetectCookie();

    return (
        <div className="w-full h-full flex flex-col items-center space-y-3">
            <Input
                className="w-[1000px]"
                classNames={{
                    input: [
                        "px-1",
                    ],
                }}
                label="搜索文件 / 文件夹"
                labelPlacement="outside"/>
            <Navbar className="w-[1000px] px-3"/>

            {/** @todo */}
            <div className="w-[1000px] h-96 flex">
                <div className="flex-1"/>
                <div className="w-[600px]"/>
                <div className="flex-1"/>
            </div>
        </div>
    );
}
