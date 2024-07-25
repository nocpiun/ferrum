import React from "react";

export interface ViewerProps {
    path: string
}

export default abstract class Viewer extends React.Component<ViewerProps, {}> {
    public constructor(props: ViewerProps) {
        super(props);
    }

    public abstract render(): React.ReactNode;

    /** @todo */
    protected async loadFile() {}

    /** @todo */
    protected async saveFile() {}
}
