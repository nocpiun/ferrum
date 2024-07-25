/* eslint-disable padding-line-between-statements */
"use client";

import type { BaseResponseData, SystemPlatform, Drive } from "@/types";

import { useEffect } from "react";
import { Card } from "@nextui-org/card";
import axios from "axios";
import { toast } from "react-toastify";

import Navbar from "@/components/explorer/navbar";
import Explorer from "@/components/explorer/explorer";
import { useExplorer } from "@/hooks/useExplorer";
import { useDetectCookie } from "@/hooks/useDetectCookie";
import { useFerrum } from "@/hooks/useFerrum";
import { storage } from "@/lib/storage";
import { diskStorageKey } from "@/lib/global";

interface DisksResponseData extends BaseResponseData {
    system: SystemPlatform
    disks: Drive[]
}

export default function Page() {
    const ferrum = useFerrum();
    const explorer = useExplorer();

    const { path } = explorer;

    useEffect(() => {
        if(
            !path ||
            path.length === 0 ||
            path[0] !== "root"
        ) {
            explorer.backToRoot();
            
            return;
        }

        axios.get<DisksResponseData>("/api/fs/disks")
            .then(({ data }) => {
                ferrum.setDisks(data.disks);

                if(storage.has(diskStorageKey)) {
                    explorer.setDisk(storage.getItem(diskStorageKey, "C:"));
                    return;
                }

                /** @todo */
                if(data.system === "linux") {
                    explorer.setDisk("/");
                } else if(data.system === "win32") {
                    explorer.setDisk("C:");
                }
            })
            .catch((err) => {
                const status = err.response?.status ?? 0;

                switch(status) {
                    case 401:
                        toast.error(`未登录 (${status})`);
                        return;
                    case 403:
                        toast.error(`无效的访问token (${status})`);
                        return;
                    case 500:
                        toast.error(`服务器内部错误 (${status})`);
                        return;
                }

                throw err;
            });

        document.title = "Ferrum - "+ explorer.stringifyPath();
    }, []);

    useDetectCookie();

    return (
        <div className="w-full h-full pb-10 flex flex-col items-center space-y-3">
            <Navbar />

            <div className="w-[1000px] h-[78vh] flex gap-7">
                <Card className="flex-1 dark:bg-[#111]"/>

                <Explorer />
            </div>
        </div>
    );
}