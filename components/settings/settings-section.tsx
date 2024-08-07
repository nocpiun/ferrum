"use client";

import React, { type PropsWithChildren } from "react";
import { Card } from "@nextui-org/card";

interface SettingsSectionProps extends PropsWithChildren {
    title: string
}

const SettingsSection: React.FC<SettingsSectionProps> = (props) => {
    return (
        <section className="flex flex-col gap-4">
            <h2 className="px-3 text-2xl font-bold">{props.title}</h2>

            <Card className="px-6 py-4 flex flex-col gap-5 dark:bg-[#111]">
                {props.children}
            </Card>
        </section>
    );
}

export default SettingsSection;
