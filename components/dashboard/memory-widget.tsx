import type { PropsWithCN } from "@/types";

import React, { useState } from "react";
import { Progress } from "@nextui-org/progress";
import { Chip } from "@nextui-org/chip";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

import DashboardWidget from "./dashboard-widget";

import { type MemoryInfo, useOS } from "@/hooks/useOS";
import { formatSize } from "@/lib/utils";

const MemoryWidget: React.FC<PropsWithCN> = (props) => {
    const [memoryInfo, setMemoryInfo] = useState<MemoryInfo | null>(null);

    useOS(({ memory }) => {
        setMemoryInfo(memory);
    });

    return (
        <DashboardWidget
            name="内存状态"
            className={props.className}
            insideClassName="relative">
            <ScrollShadow hideScrollBar className="h-20 space-y-1">
                {
                    memoryInfo?.mems.map((mem, index) => (
                        <div className="flex items-center gap-2" key={index}>
                            <span className="text-default-500">内存条 {index + 1}</span>
                            <span>{formatSize(mem.size)}</span>
                            <Chip size="sm">{mem.type}</Chip>
                            <Chip size="sm">{mem.formFactor}</Chip>
                        </div>
                    ))
                }
            </ScrollShadow>
            
            <div className="absolute left-0 right-0 bottom-0 flex flex-col gap-4">
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
