import { Component, ReactElement } from "react";

import { PictureViewerHeaderProps } from "../../types";

export default class Header extends Component<PictureViewerHeaderProps, {}> {
    public constructor(props: PictureViewerHeaderProps) {
        super(props);
    }

    public render(): ReactElement {
        return (
            <div className="header-container">
                <h1>Ferrum 图片查看器</h1>
                <p>路径: {this.props.path}</p>
            </div>
        );
    }
}
