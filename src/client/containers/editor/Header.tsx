import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

import Utils from "../../../Utils";
import Emitter from "../../utils/emitter";
import { EditorHeaderProps, EditorHeaderState } from "../../types";

const Header: React.FC<EditorHeaderProps> = (props) => {
    const [state, setState] = useState<EditorHeaderState>({ hasChanged: false });

    useEffect(() => {
        Emitter.get().on("fileStatusChange", (hasChanged: boolean) => {
            setState({ hasChanged });
        });
    });

    return (
        <header className="header-container">
            <h1>{Utils.$("page.editor.title")}</h1>
            <div className="status-bar">
                <span id="file-path">{Utils.$("global.path")}: {props.path}</span>
                <span id="file-edited" style={{display: state.hasChanged ? "inline-block" : "none"}}>(*{Utils.$("page.editor.edited")})</span>
            </div>
            <Button className="control-button" onClick={props.onSaveFile}>{Utils.$("page.editor.save")} (S)</Button>
            <Button className="control-button" onClick={props.onUndo}>{Utils.$("page.editor.undo")} (Z)</Button>
        </header>
    );
}

export default Header;
