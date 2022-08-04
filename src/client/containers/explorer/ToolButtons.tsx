import React, { useContext } from "react";
import { Button } from "react-bootstrap";

import MainContext from "../../contexts/MainContext";

import Utils from "../../../Utils";
import { hostname } from "../../global";
import { ExplorerToolButtonsProps } from "../../types";

const ToolButtons: React.FC<ExplorerToolButtonsProps> = (props) => {
    const { isDemo } = useContext(MainContext);

    return (
        <div className="toolbuttons-container">
            <div>
                <Button
                    className="left-sided-toolbutton"
                    id="open-file"
                    onClick={props.onOpenFile}>{Utils.$("page.explorer.tool.open")}</Button>
                <Button
                    disabled={isDemo}
                    className="left-sided-toolbutton"
                    id="delete-file"
                    onClick={props.onDeleteFile}
                    variant="danger">{Utils.$("page.explorer.tool.delete")}</Button>
                <Button
                    className="left-sided-toolbutton"
                    id="download-file"
                    onClick={props.onDownloadFile}>{Utils.$("page.explorer.tool.download")}</Button>
                <Button
                    disabled={isDemo}
                    className="left-sided-toolbutton"
                    id="open-terminal"
                    title={Utils.$("page.explorer.tool.terminal.tooltip")}
                    onClick={() => window.location.href = hostname +":3300/terminal"}>
                        {Utils.$("page.explorer.tool.terminal")}
                </Button>
            </div>
            
            <div>
                <Button
                    disabled={isDemo}
                    className="right-sided-toolbutton"
                    id="create-directory"
                    onClick={props.onCreateDirectory}
                    variant="success"
                    // style={{float: "right", marginLeft: "10px", marginRight: "0"}}
                    >{Utils.$("page.explorer.tool.newdir")}</Button>
                <Button
                    disabled={isDemo}
                    className="right-sided-toolbutton"
                    id="create-file"
                    onClick={props.onCreateFile}
                    variant="success"
                    // style={{float: "right", marginRight: "0"}}
                    >{Utils.$("page.explorer.tool.newfile")}</Button>
            </div>
        </div>
    );
}

export default ToolButtons;
