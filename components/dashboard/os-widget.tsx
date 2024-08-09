import type { PropsWithCN } from "@/types";

import React, { useState } from "react";

import DashboardWidget from "./dashboard-widget";
import Info from "./info";

import { type OSInfo, useOS } from "@/hooks/useOS";

const OSWidget: React.FC<PropsWithCN> = (props) => {
    const [osInfo, setOSInfo] = useState<OSInfo | null>(null);

    useOS(({ os }) => {
        setOSInfo(os);
    });

    return (
        <DashboardWidget
            name="系统信息"
            className={props.className}
            insideClassName="space-y-1 [&_span]:text-default-500">
            <Info name="平台" content={`${osInfo?.platform ?? ""} ${osInfo?.arch ?? ""}`}/>
            <Info name="系统" content={osInfo?.version ?? ""}/>
            <Info name="版本" content={osInfo?.release ?? ""}/>
        </DashboardWidget>
    );
}

export default OSWidget;
