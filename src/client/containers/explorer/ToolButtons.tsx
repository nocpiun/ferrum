import React, { useContext } from "react";
import { Button } from "react-bootstrap";

import MainContext from "../../contexts/MainContext";

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
                    onClick={props.onOpenFile}>打开</Button>
                <Button
                    disabled={isDemo}
                    className="left-sided-toolbutton"
                    id="delete-file"
                    onClick={props.onDeleteFile}
                    variant="danger">删除</Button>
                <Button
                    className="left-sided-toolbutton"
                    id="download-file"
                    onClick={props.onDownloadFile}>下载</Button>
                <Button
                    disabled={isDemo}
                    className="left-sided-toolbutton"
                    id="open-terminal"
                    title="使用此功能需要事先在服务器上搭建好ssh服务器"
                    onClick={() => window.location.href = hostname +":3300/terminal"}>打开终端</Button>
            </div>
            
            <div>
                <Button
                    disabled={isDemo}
                    className="right-sided-toolbutton"
                    id="create-directory"
                    onClick={props.onCreateDirectory}
                    variant="success"
                    // style={{float: "right", marginLeft: "10px", marginRight: "0"}}
                    >新建文件夹</Button>
                <Button
                    disabled={isDemo}
                    className="right-sided-toolbutton"
                    id="create-file"
                    onClick={props.onCreateFile}
                    variant="success"
                    // style={{float: "right", marginRight: "0"}}
                    >新建文件</Button>
            </div>
        </div>
    );
}

export default ToolButtons;
