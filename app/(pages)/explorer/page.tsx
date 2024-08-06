/* eslint-disable padding-line-between-statements */
"use client";

import type { BaseResponseData, SystemPlatform, Drive } from "@/types";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { toast } from "react-toastify";

import Explorer from "@/components/explorer/explorer";
import { useExplorer } from "@/hooks/useExplorer";
import { useDetectCookie } from "@/hooks/useDetectCookie";
import { useFerrum } from "@/hooks/useFerrum";
import { storage } from "@/lib/storage";
import { diskStorageKey } from "@/lib/global";
const Sidebar = dynamic(() => import("@/components/explorer/sidebar"), { ssr: false });

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

        explorer.clearCurrentViewing();
    }, []);

    useDetectCookie();

    return (
        <>
            <Sidebar />
            
            <Explorer />
        </>
    );
}
