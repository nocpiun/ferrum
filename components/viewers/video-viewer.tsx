"use client";

import React from "react";

import Viewer, { ViewerProps } from ".";

interface VideoViewerProps extends ViewerProps {}

interface VideoViewerState {
    value: string
}

export default class VideoViewer extends Viewer<VideoViewerProps, VideoViewerState> {
    public constructor(props: VideoViewerProps) {
        super(props, "视频播放器");

        this.state = {
            value: "" // video url
        };
    }

    public render(): React.ReactNode {
        return (
            <div className="w-full h-full flex flex-col items-center">
                <video
                    className="max-h-[700px]"
                    src={this.state.value}
                    controls>
                    <track kind="captions"/>
                </video>

                <div className="w-full h-6 mt-2 px-2 flex justify-center items-center">
                    <span className="text-default-400 text-sm ml-2">{this.props.fileName}</span>
                </div>
            </div>
        );
    }

    public async componentDidMount() {
        /** @todo */
        // this.setState({ value: URL.createObjectURL(new Blob([Buffer.from(await this.loadFile())])) });
    }

    public componentWillUnmount() {
        URL.revokeObjectURL(this.state.value);
        this.setState({ value: "" });
    }
}
