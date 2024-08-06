"use client";

import React, { type PropsWithChildren } from "react";

interface SidebarWidgetProps extends PropsWithChildren {
    title: string
}

const SidebarWidget: React.FC<SidebarWidgetProps> = (props) => {
    return (
        <section>
            <h2 className="m-2 mt-1 text-md font-semibold">{props.title}</h2>
            
            {props.children}
        </section>
    );
}

export default SidebarWidget;
