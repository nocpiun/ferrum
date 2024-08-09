import type { PropsWithCN } from "@/types";

import React, { useState } from "react";
import { Progress } from "@nextui-org/progress";
import { cn } from "@nextui-org/theme";

import DashboardWidget from "./dashboard-widget";
import Info from "./info";

import { type GPUInfo, useOS } from "@/hooks/useOS";
import { scrollbarStyle } from "@/lib/style";

const GPUWidget: React.FC<PropsWithCN> = (props) => {
    const [gpuInfo, setGPUInfo] = useState<GPUInfo[] | null>(null);

    useOS(({ gpu }) => {
        setGPUInfo(gpu);
    });

    return (
        <DashboardWidget
            name="GPU 状态"
            className={props.className}
            insideClassName={cn("flex flex-col space-y-4 pr-2 overflow-y-auto", scrollbarStyle)}>
            {
                gpuInfo?.map((gpu, index) => (
                    <div key={index}>
                        <Info name="名称" content={gpu.vendor +" "+ gpu.model}/>
                        {gpu.memoryTotal && <Info name="显存" content={`${gpu.memoryTotal.toFixed(2)} MB`}/>}
                        {gpu.memoryUsage && (
                            <Progress
                                className="mt-2"
                                size="sm"
                                value={gpu.memoryUsage}
                                aria-label={"显存占用"+ gpu.memoryUsage.toFixed(2)}/>
                        )}
                    </div>
                ))
            }
        </DashboardWidget>
    );
}

export default GPUWidget;
