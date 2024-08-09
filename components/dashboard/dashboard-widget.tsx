import type { PropsWithCN } from "@/types";

import React, { type PropsWithChildren } from "react";
import { Card } from "@nextui-org/card";
import { cn } from "@nextui-org/theme";

interface DashboardWidgetProps extends PropsWithCN, PropsWithChildren {
    name: string;
    insideClassName?: string
}

const DashboardWidget: React.FC<DashboardWidgetProps> = (props) => {
    return (
        <Card className={cn("px-5 py-4 flex flex-col gap-2", props.className)}>
            <span className="text-xl font-semibold">{props.name}</span>

            <div className={cn("flex-1", props.insideClassName)}>
                {props.children}
            </div>
        </Card>
    );
}

export default DashboardWidget;
