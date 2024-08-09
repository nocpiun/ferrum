import { useEffect, useState } from "react";

import { storage } from "@/lib/storage";
import { settingsStorageKey } from "@/lib/global";

export type ConfigDataType = { [key: string]: any };

const defaultSettings: ConfigDataType = {
    "general.ace-wrap": true,
    "general.ace-auto-completion": true,

    "view.default-displaying-mode": "list",
    "view.show-image-thumbnail-preview": true,

    "appearance.ace-theme": "ambiance"
};

export function useWithSettings() {
    const [config, setConfig] = useState<ConfigDataType | null>(null);

    const read = () => {
        return JSON.parse(storage.getItem(settingsStorageKey, JSON.stringify(defaultSettings)));
    };

    useEffect(() => {
        setConfig(read());
    }, []);

    return {
        settings: config,
        set: (key: string, value: any) => {
            const config = read();

            config[key] = value;

            storage.setItem(settingsStorageKey, JSON.stringify(config));
            setConfig(config);
        }
    };
}
