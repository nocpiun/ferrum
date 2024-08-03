"use client";

import React from "react";
import { Image } from "@nextui-org/image";

import Viewer, { ViewerProps } from ".";

interface ImageViewerProps extends ViewerProps {}

interface ImageViewerState {
    value: string
}

export default class ImageViewer extends Viewer<ImageViewerProps, ImageViewerState> {
    public constructor(props: ImageViewerProps) {
        super(props, "图片查看器");

        this.state = {
            value: "" // image url
        };
    }

    public render(): React.ReactNode {
        return (
            <div className="w-full h-full flex flex-col justify-center items-center">
                <Image
                    className="max-h-[700px]"
                    src={this.state.value}
                    alt={this.props.fileName}/>

                <div className="w-full h-6 mt-2 px-2 flex justify-center items-center">
                    <span className="text-default-400 text-sm ml-2">{this.props.fileName}</span>
                </div>
            </div>
        );
    }

    public async componentDidMount() {
        this.setState({ value: URL.createObjectURL(new Blob([Buffer.from(await this.loadFile())])) });
    }

    public componentWillUnmount() {
        URL.revokeObjectURL(this.state.value);
        this.setState({ value: "" });
    }
}
