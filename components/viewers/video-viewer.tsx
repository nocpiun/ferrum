"use client";

import React from "react";
import { ReactSVG } from "react-svg";
import { Maximize } from "lucide-react";
import { cn } from "@nextui-org/theme";
import { CircularProgress } from "@nextui-org/progress";

import PlayerProgress from "../player-progress";

import Viewer, { ViewerProps } from ".";

import PlayIcon from "@/styles/icons/play.svg";
import PauseIcon from "@/styles/icons/pause.svg";

interface VideoViewerProps extends ViewerProps {}

interface VideoViewerState {
    isLoading: boolean
    value: string

    paused: boolean
    duration: number
    currentTime: number
}

export default class VideoViewer extends Viewer<VideoViewerProps, VideoViewerState> {
    private readonly isFlv: boolean;
    private blob: Blob = new Blob();
    private videoRef = React.createRef<HTMLVideoElement>();

    private readonly eventController = new AbortController();

    public constructor(props: VideoViewerProps) {
        super(props, "视频播放器");

        this.state = {
            isLoading: true,
            value: "", // video url
            paused: true,
            duration: 0,
            currentTime: 0
        };

        this.isFlv = this.props.fileName.split(".").findLast(() => true) === "flv";
    }

    private handlePlayButtonClick() {
        if(!this.videoRef.current || this.state.isLoading) {
            this.setState({ paused: true });
            
            return;
        }

        if(this.videoRef.current.paused) {
            this.setState({ paused: false });
            this.videoRef.current.play();
        } else {
            this.setState({ paused: true });
            this.videoRef.current.pause();
        }
    }

    private handleFullScreen() {
        if(!this.videoRef.current) return;

        this.videoRef.current.requestFullscreen();
    }

    private handleTimeChange(time: number) {
        if(!this.videoRef.current) return;

        this.videoRef.current.currentTime = time;
        this.setState({ currentTime: time });
    }

    public render(): React.ReactNode {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <div className="flex flex-col relative">
                    <video
                        src={this.state.value}
                        className={cn("rounded-t-lg relative", this.state.isLoading ? "bg-default-300" : "")}
                        onDurationChange={(e) => this.setState({ duration: e.currentTarget.duration })}
                        onTimeUpdate={(e) => this.setState({ currentTime: e.currentTarget.currentTime })}
                        onEnded={() => this.setState({ paused: true })}
                        ref={this.videoRef}>
                        <track kind="captions"/>
                    </video>

                    {this.state.isLoading && (
                        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
                            <CircularProgress
                                size="sm"
                                classNames={{
                                    indicator: "stroke-default-800"
                                }}/>
                        </div>
                    )}

                    <div className="absolute left-0 right-0 bottom-8 h-10 p-2 flex justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={() => this.handlePlayButtonClick()}
                                disabled={this.state.isLoading}>
                                <ReactSVG
                                    src={this.state.paused ? PlayIcon["src"] : PauseIcon["src"]}
                                    className="w-6 h-6 [&_svg]:w-full [&_svg]:h-full"/>
                            </button>
                        </div>

                        <div className="flex items-center">
                            <button
                                onClick={() => this.handleFullScreen()}
                                disabled={this.state.isLoading}>
                                <Maximize size={22} color="#e8eaed" className="pr-1"/>
                            </button>
                        </div>
                    </div>

                    <PlayerProgress
                        duration={this.state.duration}
                        current={this.state.currentTime}
                        timePlacement="bottom"
                        disabled={this.state.isLoading}
                        onTimeChange={(time) => this.handleTimeChange(time)}/>
                </div>
            </div>
        );
    }

    public async componentDidMount() {
        const data = await this.loadFile(true) as ArrayBuffer;
        
        this.blob = new Blob([Buffer.from(data)], { type: "video/mp4" });
        this.setState({ isLoading: false });
        
        this.setState({ value: URL.createObjectURL(this.blob) });
        this.initEvents();
    }

    public componentWillUnmount() {
        if(!this.blob) return;

        URL.revokeObjectURL(this.state.value);
        this.blob = new Blob();
        this.setState({ value: "" });

        this.eventController.abort();
    }

    private initEvents() {
        document.body.addEventListener("keydown", (e) => {
            if(e.code === "Space") {
                this.handlePlayButtonClick();

                /** @see https://www.codeproject.com/Questions/1044876/one-enter-keypress-runs-event-handler-twice */
                e.stopImmediatePropagation();
            }
        }, { signal: this.eventController.signal });
    }
}
