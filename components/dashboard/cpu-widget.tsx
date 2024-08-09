import type { PropsWithCN } from "@/types";

import React, { useState } from "react";
import { Progress } from "@nextui-org/progress";

import DashboardWidget from "./dashboard-widget";

import { type CPUInfo, useOS } from "@/hooks/useOS";

const CPUWidget: React.FC<PropsWithCN> = (props) => {
    const [cpuInfo, setCPUInfo] = useState<CPUInfo | null>(null);

    useOS(({ cpu }) => {
        setCPUInfo(cpu);
    });

    return (
        <DashboardWidget
            name="CPU 占用"
            className={props.className}
            insideClassName="flex flex-col justify-between">
            <p className="text-default-500">{cpuInfo?.model} {cpuInfo?.totalCores ? `（${cpuInfo.totalCores}核）` : ""}</p>

            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-end">
                    <span className="">
                        <span className="text-default-500">温度：</span>
                        {cpuInfo?.temperature ? `${cpuInfo?.temperature.toFixed(2)}°C` : "--°C"}
                    </span>
                    <span className="text-3xl font-semibold">{cpuInfo?.usage ? `${cpuInfo?.usage}%` : "--%"}</span>
                </div>

                <Progress
                    size="sm"
                    value={cpuInfo?.usage}
                    aria-label="CPU 占用"/>
            </div>
        </DashboardWidget>
    );
}

export default CPUWidget;
