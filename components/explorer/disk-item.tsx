import React from "react";
import { Progress } from "@nextui-org/progress";

import { Drive } from "@/types";
import { formatSize } from "@/lib/utils";

interface DiskItemProps extends Drive {
    
}

const DiskItem: React.FC<DiskItemProps> = (props) => {
    return (
        <div className="w-40 flex flex-col gap-1">
            <div className="flex justify-between items-end">
                <span className="font-semibold overflow-hidden text-ellipsis whitespace-nowrap">{props.mount}</span>
                <span className="text-xs text-default-500">
                    {formatSize(props.used, 1)} / {formatSize(props.size, 1)}
                </span>
            </div>

            <Progress
                size="sm"
                value={props.capacity}
                color={
                    props.capacity <= 90
                    ? "primary"
                    : "danger"
                }
                disableAnimation
                aria-label={"磁盘空间占用："+ props.capacity.toFixed(1) +"%"}/>
        </div>
    );
}

export default DiskItem;
