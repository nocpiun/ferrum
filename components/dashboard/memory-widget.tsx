import type { PropsWithCN } from "@/types";

import React, { useState } from "react";
import { Progress } from "@nextui-org/progress";

import DashboardWidget from "./dashboard-widget";
import Info from "./info";

import { type MemoryInfo, useOS } from "@/hooks/useOS";
import { formatSize } from "@/lib/utils";

const MemoryWidget: React.FC<PropsWithCN> = (props) => {
    const [memoryInfo, setMemoryInfo] = useState<MemoryInfo | null>(null);

    useOS(({ memory }) => {
        setMemoryInfo(memory);
    });

    return (
        <DashboardWidget
            name="内存占用"
            className={props.className}
            insideClassName="flex flex-col justify-between">
            <Info name="内存条" content={memoryInfo?.amount ? `${memoryInfo?.amount} 个` : ""}/>
            <Info name="容量" content={memoryInfo?.total ? formatSize(memoryInfo.total) : ""}/>
            
            <div className="flex flex-col gap-4">
                <div className="flex justify-end">
                    <span className="text-3xl font-semibold">{memoryInfo?.usage ? `${memoryInfo?.usage.toFixed(2)}%` : "--%"}</span>
                </div>

                <Progress
                    size="sm"
                    value={memoryInfo?.usage ? memoryInfo?.usage : 0}
                    aria-label="内存占用"/>
            </div>
        </DashboardWidget>
    );
}

export default MemoryWidget;
