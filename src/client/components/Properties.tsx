import React, { useState, useRef, useContext, useEffect } from "react";
import Axios from "axios";
import { Form } from "react-bootstrap";

import MainContext from "../contexts/MainContext";
import Utils from "../../Utils";
import Emitter from "../utils/emitter";
import { DirectoryItem, PropertiesProps } from "../types";
import { apiUrl } from "../global";

import FileIcon from "../../icons/file.svg";
import FolderIcon from "../../icons/folder_rate.svg";

const Properties: React.FC<PropertiesProps> = (props) => {
    const [content, setContent] = useState<DirectoryItem | null>(null);
    const { isDemo } = useContext(MainContext);
    const renameBox = useRef<HTMLInputElement | null>(null);

    const renameFile = (newName: string) => {
        if(isDemo || !content) return;
        
        Axios.post(apiUrl +"/renameFile", {
            path: (props.path +"/"+ content.fullName).replaceAll("/", "\\"),
            newName
        }).then(() => {
            Emitter.get().emit("fileListUpdate");
        });
    };

    useEffect(() => {
        Emitter.get().on("openProperties", (info: DirectoryItem) => {
            setContent(info);
        });
    }, []);

    useEffect(() => {
        if(renameBox.current && content) renameBox.current.value = content.fullName;
    }, [content]);

    return (
        <div className="properties-dialog">
            <div className="properties-main">
                <Form.Control
                    ref={renameBox}
                    type="text"
                    onKeyDown={(e) => {
                        if(e.key === "Enter" && content) {
                            const newName = (e.target as HTMLInputElement).value;
                            var oldContent = content;
                            oldContent.fullName = newName;

                            renameFile(newName);
                            setContent(oldContent);
                        }
                    }}/>
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
                            <span>{Utils.formatFloat(content.size / 1024, 1) +"KB ("+ content.size +")"}</span>
                        </li>
                        : null
                    }
                </ul>
            </div>
            <div className="properties-icon">
                <img src={content?.isFile ? FileIcon : FolderIcon} alt=""/>
            </div>
        </div>
    );
}

export default Properties;
