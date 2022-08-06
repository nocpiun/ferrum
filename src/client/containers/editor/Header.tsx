import React from "react";
import { Button } from "react-bootstrap";

import Utils from "../../../Utils";
import { EditorHeaderProps } from "../../types";

const Header: React.FC<EditorHeaderProps> = (props) => {
    return (
        <header className="header-container">
            <h1>{Utils.$("page.editor.title")}</h1>
            <div className="status-bar">
                <span id="file-path">{Utils.$("global.path")}: {props.path}</span>
            </div>
            <Button className="control-button" onClick={props.onSaveFile}>{Utils.$("page.editor.save")} (S)</Button>
            <Button className="control-button" onClick={props.onUndo}>{Utils.$("page.editor.undo")} (Z)</Button>
        </header>
    );
}

export default Header;
