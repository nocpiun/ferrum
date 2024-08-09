import type { PropsWithCN } from "@/types";

import React from "react";

interface InfoProps extends PropsWithCN {
    name: string
    content: string
}

const Info: React.FC<InfoProps> = (props) => {
    return (
        <p className={props.className}>
            <span className="text-default-500">{props.name}：</span>{props.content}
        </p>
    );
}

export default Info;
