import React from "react";

import Viewer, { ViewerProps } from "./viewer";

export default class TextViewer extends Viewer {
    public constructor(props: ViewerProps) {
        super(props);
    }

    public render(): React.ReactNode {
        return (
            <div>{/** @todo */}</div>
        );
    }
}
