"use client";

import React from "react";
import { type IAudioMetadata, parseBlob } from "music-metadata";
import { ReactSVG } from "react-svg";

import PlayerProgress from "../player-progress";

import Viewer, { ViewerProps } from ".";

import PlayIcon from "@/styles/icons/play.svg";
import PauseIcon from "@/styles/icons/pause.svg";

interface AudioViewerProps extends ViewerProps {}

interface AudioViewerState {
    isLoading: boolean
    value: string
    metadata: IAudioMetadata | null

    paused: boolean
    duration: number
    currentTime: number
}

export default class AudioViewer extends Viewer<AudioViewerProps, AudioViewerState> {
    private blob: Blob = new Blob();
    private audioRef = React.createRef<HTMLAudioElement>();

    private readonly eventController = new AbortController();

    public constructor(props: AudioViewerProps) {
        super(props, "音频播放器");

        this.state = {
            isLoading: true,
            value: "", // audio url
            metadata: null,
            paused: true,
            duration: 0,
            currentTime: 0
        };
    }

    private handlePlayButtonClick() {
        if(!this.audioRef.current || this.state.isLoading) {
            this.setState({ paused: true });
            
            return;
        }

        if(this.audioRef.current.paused) {
            this.setState({ paused: false });
            this.audioRef.current.play();
        } else {
            this.setState({ paused: true });
            this.audioRef.current.pause();
        }
    }

    private handleTimeChange(time: number) {
        if(!this.audioRef.current) return;

        this.audioRef.current.currentTime = time;
        this.setState({ currentTime: time });
    }

    public render(): React.ReactNode {
        return (
            <div className="w-full h-full flex justify-center pt-44">
                <div className="w-[44rem] h-72 flex gap-10">
                    <style>
                        {`
                            #banner:hover #player-button {
                                display: flex;
                            }
                        `}
                    </style>

                    <div id="banner" className="w-72 h-72 relative">
                        {
                            (this.state.metadata && this.state.metadata.common.picture)
                            ? <img
                                className="w-full h-full rounded-lg"
                                src={
                                    "data:"+ this.state.metadata?.common.picture[0].format +";base64,"+ Buffer.from(this.state.metadata?.common.picture[0].data.buffer).toString("base64")
                                }
                                alt={this.state.metadata?.common.picture[0].description}/>
                            : (
                                <div className="w-full h-full flex justify-center items-center bg-default-100 rounded-lg">
                                    <span className="text-4xl font-bold text-default-400">{this.props.fileName.split(".").findLast(() => true)?.toUpperCase()}</span>
                                </div>
                            )
                        }

                        {
                            !this.state.isLoading && (
                                <button
                                    id="player-button"
                                    className="hidden absolute top-0 left-0 right-0 bottom-0 justify-center items-center z-10"
                                    onClick={() => this.handlePlayButtonClick()}>
                                    <ReactSVG
                                        src={this.state.paused ? PlayIcon["src"] : PauseIcon["src"]}
                                        className="w-14 h-14 [&_svg]:w-full [&_svg]:h-full"/>
                                </button>
                            )
                        }
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                        <div className="flex flex-col gap-2">
                            <span className="text-2xl font-semibold">
                                {
                                    (this.state.metadata && this.state.metadata.common.title)
                                    ? this.state.metadata.common.title
                                    : this.props.fileName
                                }
                            </span>
                            <span className="text-md text-default-400">
                                {
                                    ((this.state.metadata && this.state.metadata.common.artists) ? this.state.metadata.common.artists?.join(", ") : "未知艺术家")
                                    +" - "
                                    + ((this.state.metadata && this.state.metadata.common.album) ? this.state.metadata.common.album : "未知专辑")
                                }
                            </span>
                            <span className="text-md text-default-400">
                                {
                                    ((this.state.metadata && this.state.metadata.common.year) ? this.state.metadata.common.year : "未知年份")
                                    +" "
                                    + ((this.state.metadata && this.state.metadata.common.genre) ? this.state.metadata.common.genre?.join(", ") : "未知流派")
                                }
                            </span>
                        </div>

                        <div className="pb-5">
                            <audio
                                src={this.state.value}
                                onDurationChange={(e) => this.setState({ duration: e.currentTarget.duration })}
                                onTimeUpdate={(e) => this.setState({ currentTime: e.currentTarget.currentTime })}
                                onEnded={() => this.setState({ paused: true })}
                                ref={this.audioRef}>
                                <track kind="captions"/>
                            </audio>
                            
                            <PlayerProgress
                                duration={this.state.duration}
                                current={this.state.currentTime}
                                timePlacement="top"
                                disabled={this.state.isLoading}
                                onTimeChange={(time) => this.handleTimeChange(time)}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    public async componentDidMount() {
        const data = await this.loadFile(true) as ArrayBuffer;
        
        this.blob = new Blob([Buffer.from(data)], { type: "audio/mpeg" });
        this.setState({ isLoading: false });

        const metadata = await parseBlob(this.blob);

        if(!metadata) return;
        this.setState({ metadata });
        
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
