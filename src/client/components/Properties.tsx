import React, { useState, useEffect } from "react";

import Utils from "../../Utils";
import Emitter from "../utils/emitter";
import { DirectoryItem, PropertiesProps } from "../types";

import FileIcon from "../../icons/file.svg";
import FolderIcon from "../../icons/folder_rate.svg";

const Properties: React.FC<PropertiesProps> = (props) => {
    const [content, setContent] = useState<DirectoryItem | null>(null);

    useEffect(() => {
        Emitter.get().on("openProperties", (info: DirectoryItem) => {
            setContent(info);
        });
    }, []);

    return (
        <div className="properties-dialog">
            <ul>
                <li>
                    <b>{Utils.$("page.explorer.list.properties.name")}:</b>
                    <span>{content?.fullName}</span>
                </li>
                <li>
                    <b>{Utils.$("page.explorer.list.properties.format")}:</b>
                    <span>
                        {
                            content?.isFile
                            ? content.format +" "+ Utils.$("page.explorer.list.file")
                            : Utils.$("page.explorer.list.folder")
                        }
                    </span>
                </li>
                <li>
                    <b>{Utils.$("page.explorer.list.properties.path")}:</b>
                    <span>{props.path +"/"+ content?.fullName}</span>
                </li>
                {
                    content?.isFile && content.size
                    ? <li>
                        <b>{Utils.$("page.explorer.list.properties.size")}:</b>
                        <span>{Utils.formatFloat(content.size / 1024, 1) +"KB"}</span>
                    </li>
                    : null
                }
            </ul>
            <div className="properties-icon">
                <img src={content?.isFile ? FileIcon : FolderIcon} alt=""/>
            </div>
        </div>
    );
}

export default Properties;
