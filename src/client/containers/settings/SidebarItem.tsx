/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";

import Emitter from "../../utils/emitter";
import { ExplorerSettingsSidebarItemProps } from "../../types";

const SidebarItem: React.FC<ExplorerSettingsSidebarItemProps> = (props) => {
    const [isOn, setIsOn] = useState<boolean>(false);

    useEffect(() => {
        if(props.defaultValue) {
            setIsOn(true);
            props.onClick(props.id);
        }

        Emitter.get().on("settingsItemSelect", (id: string) => {
            if(id !== props.id) setIsOn(false);
        });
    }, []);

    return (
        <li
            id={props.id}
            className={isOn ? "on" : ""}
            style={{ listStyleImage: "url("+ props.icon +")" }}
            onClick={() => {
                setIsOn(true);
                props.onClick(props.id);
            }}>
            <span className="sidebar-item-icon"></span>
            <span className="sidebar-item-title">{props.title}</span>
        </li>
    );
};

export default SidebarItem;
