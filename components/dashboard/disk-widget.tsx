import type { PropsWithCN } from "@/types";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@nextui-org/theme";
import { HardDrive } from "lucide-react";
import { Progress } from "@nextui-org/progress";
import { Chip } from "@nextui-org/chip";

import DashboardWidget from "./dashboard-widget";

import { type DiskInfo, useOS } from "@/hooks/useOS";
import { scrollbarStyle } from "@/lib/style";
import { formatSize } from "@/lib/utils";
import { useExplorer } from "@/hooks/useExplorer";

const DiskWidget: React.FC<PropsWithCN> = (props) => {
    const [diskInfo, setDiskInfo] = useState<DiskInfo[] | null>(null);
    const explorer = useExplorer();
    const router = useRouter();

    useOS(({ disk }) => {
        setDiskInfo(disk);
    });

    return (
        <DashboardWidget
            name="磁盘状态"
            className={props.className}
            insideClassName={cn("flex flex-col gap-2 pt-2 pr-2 overflow-y-auto", scrollbarStyle)}>
            {
                diskInfo?.map((disk, index) => {
                    const capacity = (disk.used / disk.size) * 100;
                    const size = formatSize(disk.size);
                    const used = formatSize(disk.used);

                    const handleClick = () => {
                        explorer.setDisk(disk.mount);
                        explorer.backToRoot();
                        router.push("/explorer");
                    };

                    return (
                        <div
                            className="flex flex-col gap-2 p-2 rounded-md hover:bg-default-100"
                            onClick={() => handleClick()}
                            onKeyDown={({ key }) => {
                                if(key === "Enter") {
                                    handleClick();
                                }
                            }}
                            role="button"
                            tabIndex={-1}
                            key={index}>
                            <div className="flex-1 pl-2 flex items-center gap-3">
                                <HardDrive size={20} className="stroke-default-400"/>
    
                                <div className="flex-1 flex justify-between items-end">
                                    <span className="text-lg font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
                                        {disk.mount}
                                    </span>
                                    
                                    <div className="flex items-end gap-2">
                                        <span className="text-sm text-default-500">{used +" / "+ size}</span>
                                        <Chip size="sm">{disk.type}</Chip>
                                    </div>
                                </div>
                            </div>
    
                            <Progress
                                size="sm"
                                value={capacity}
                                color={
                                    capacity <= 90
                                    ? "primary"
                                    : "danger"
                                }
                                aria-label={disk.mount +" "+ capacity.toFixed(2)}/>
                        </div>
                    );
                })
            }
        </DashboardWidget>
    );
}

export default DiskWidget;
