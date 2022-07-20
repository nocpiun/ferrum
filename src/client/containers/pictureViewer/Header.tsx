import React from "react";

import { PictureViewerHeaderProps } from "../../types";

const Header: React.FC<PictureViewerHeaderProps> = (props) => {
    return (
        <header className="header-container">
            <h1>Ferrum 图片查看器</h1>
            <p>路径: {props.path}</p>
        </header>
    );
}

export default Header;
