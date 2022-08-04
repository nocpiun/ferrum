import React from "react";

import Utils from "../../../Utils";
import { PictureViewerHeaderProps } from "../../types";

const Header: React.FC<PictureViewerHeaderProps> = (props) => {
    return (
        <header className="header-container">
            <h1>{Utils.$("page.pictureviewer.title")}</h1>
            <p>{Utils.$("global.path")}: {props.path}</p>
        </header>
    );
}

export default Header;
