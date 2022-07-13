import { ExplorerSettingsSectionProps } from "../../types";

const SettingsSection: React.FC<ExplorerSettingsSectionProps> = (props) => {
    return (
        <section className="settings-section">
            <h4>{props.title}</h4>
            {props.children}
        </section>
    );
}

export default SettingsSection;
