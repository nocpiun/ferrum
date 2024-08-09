import React, { type PropsWithChildren } from "react";

interface SettingsItemProps extends PropsWithChildren {
    label: string
    description?: string
}

const SettingsItem: React.FC<SettingsItemProps> = (props) => {
    return (
        <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1" aria-label={props.label}>
                <span>{props.label}</span>
                {props.description && <span className="text-sm text-default-500" aria-label={props.description}>{props.description}</span>}
            </div>

            {props.children}
        </div>
    );
}

export default SettingsItem;
