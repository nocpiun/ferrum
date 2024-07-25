import React, { useMemo } from "react";
import { Progress } from "@nextui-org/progress";

import { Drive } from "@/types";
import { formatSize } from "@/lib/utils";

interface DiskItemProps extends Drive {
    
}

const DiskItem: React.FC<DiskItemProps> = (props) => {
    const capacity = useMemo(() => parseFloat(props._capacity), [props._capacity]);

    return (
        <div className="w-40 flex flex-col gap-1">
            <div className="flex justify-between items-end">
                <span className="font-semibold">{props._mounted}</span>
                <span className="text-xs text-default-500">
                    {formatSize(props._used, 1)} / {formatSize(props._blocks, 1)}
                </span>
            </div>

            <Progress
                size="sm"
                value={capacity}
                color={
                    capacity <= 90
                    ? "primary"
                    : "danger"
                }
                disableAnimation/>
        </div>
    );
}

export default DiskItem;
