import React from "react";

import { ExplorerSettingsSectionProps } from "../../types";

const SettingsSection: React.FC<ExplorerSettingsSectionProps> = (props) => {
    return (
        <section className="settings-section">
            <div className="section-title">
                <span className="section-icon" style={{ backgroundImage: "url("+ props.icon +")" }}></span>
                <h4>{props.title}</h4>
            </div>
            {props.children}
        </section>
    );
}

export default SettingsSection;
