import React from "react";

import { ExplorerSettingsSectionProps } from "../../types";

const SettingsSection: React.FC<ExplorerSettingsSectionProps> = (props) => {
    return (
        <section className="settings-section" style={props.style}>
            <div className="section-title">
                <h4>{props.title}</h4>
                <div className="section-title-side">
                    {props.sideElem}
                </div>
            </div>
            {props.children}
        </section>
    );
}

export default SettingsSection;
