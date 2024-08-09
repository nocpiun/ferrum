import type { PropsWithCN } from "@/types";

import React, { useState } from "react";
import { Progress } from "@nextui-org/progress";

import DashboardWidget from "./dashboard-widget";

import { type BatteryInfo, useOS } from "@/hooks/useOS";

const BatteryWidget: React.FC<PropsWithCN> = (props) => {
    const [batteryInfo, setBatteryInfo] = useState<BatteryInfo | null>(null);

    useOS(({ battery }) => {
        setBatteryInfo(battery);
    });

    return (
        <DashboardWidget
            name="电池状态"
            className={props.className}
            insideClassName="flex flex-col justify-between">
            {
                batteryInfo?.hasBattery
                ? (
                    <>
                        <p className="text-green-700 dark:text-green-500">{batteryInfo?.isCharging ? "正在充电" : ""}</p>

                        <div className="flex flex-col gap-4">
                            <span className="text-3xl font-semibold">{batteryInfo?.percent ? `${batteryInfo?.percent}%` : "--%"}</span>

                            <Progress
                                classNames={{ indicator: "bg-green-600 dark:bg-green-500" }}
                                size="sm"
                                value={batteryInfo?.percent}
                                aria-label="电池电量"/>
                        </div>
                    </>
                )
                : <p className="text-default-500">未发现电池</p>
            }
        </DashboardWidget>
    );
}

export default BatteryWidget;
