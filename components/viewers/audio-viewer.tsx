"use client";

import React from "react";
import { type IAudioMetadata, parseBlob } from "music-metadata";
import { ReactSVG } from "react-svg";
import { LrcParser } from "@xiaohuohumax/lrc-parser";
import { Button } from "@nextui-org/button";
import { cn } from "@nextui-org/theme";

import PlayerProgress from "../player-progress";

import Viewer, { ViewerProps } from ".";

import { scrollbarStyle } from "@/lib/style";
import PlayIcon from "@/styles/icons/play.svg";
import PauseIcon from "@/styles/icons/pause.svg";
import StopIcon from "@/styles/icons/stop.svg";

interface Lyric {
    time: number
    text: string
}

interface AudioViewerProps extends ViewerProps {}

interface AudioViewerState {
    isLoading: boolean
    value: string
    metadata: IAudioMetadata | null
    lyrics: Lyric[]

    paused: boolean
    duration: number
    currentTime: number
    currentLyricLine: number
}

export default class AudioViewer extends Viewer<AudioViewerProps, AudioViewerState> {
    private blob: Blob = new Blob();
    private audioRef = React.createRef<HTMLAudioElement>();
    private lyricsRef = React.createRef<HTMLDivElement>();

    private eventController = new AbortController();

    public constructor(props: AudioViewerProps) {
        super(props, "音频播放器");

        this.state = {
            isLoading: true,
            value: "", // audio url
            metadata: null,
            lyrics: [],
            paused: true,
            duration: 0,
            currentTime: 0,
            currentLyricLine: -1
        };
    }

    private getCurrentLyricLine(): number {
        for(let i = 0; i < this.state.lyrics.length; i++) {
            if(
                this.state.currentTime >= this.state.lyrics[i].time &&
                (
                    (i + 1 < this.state.lyrics.length && this.state.currentTime < this.state.lyrics[i + 1].time) ||
                    i + 1 === this.state.lyrics.length
                )
            ) {
                return i;
            }
        }

        return -1;
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

    private handleStop() {
        if(!this.audioRef.current || !this.lyricsRef.current) return;

        this.audioRef.current.pause();
        this.audioRef.current.currentTime = 0;
        this.lyricsRef.current.scrollTop = 0;
        this.setState({ paused: true, currentTime: 0, currentLyricLine: -1 });
    }

    private handleTimeChange(time: number) {
        if(!this.audioRef.current) return;

        this.audioRef.current.currentTime = time;
        this.setState({ currentTime: time });
    }

    public render(): React.ReactNode {
        return (
            <div className="w-full h-full flex flex-col items-center pt-44">
                <div className="w-[44rem] h-72 flex gap-10">
                    <div id="banner" className="min-w-72 max-w-72 h-72">
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
                    </div>

                    <div className="flex-1 h-full flex flex-col">
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

                        {
                            this.state.lyrics.length > 0 && (
                                <div
                                    className={cn("flex-1 flex flex-col items-center gap-3 mt-2 pr-3 overflow-y-auto scroll-smooth *:transition-all *:text-default-500 *:text-center", scrollbarStyle)}
                                    ref={this.lyricsRef}>
                                    <div className="sticky top-0 left-0 right-0 w-full min-h-5 bg-gradient-to-b from-background to-transparent"/>
                                    {
                                        this.state.lyrics.map(({ text }, index) => (
                                            <span
                                                className="data-[is-current=true]:text-default-800 data-[is-current=true]:font-bold"
                                                data-is-current={index === this.getCurrentLyricLine()}
                                                key={index}>
                                                {text}
                                            </span>
                                        ))
                                    }
                                    <div className="sticky left-0 right-0 bottom-0 w-full min-h-5 bg-gradient-to-t from-background to-transparent"/>
                                </div>
                            )
                        }
                    </div>
                </div>

                <div className="w-[44rem] pt-4">
                    <audio
                        src={this.state.value}
                        onDurationChange={(e) => this.setState({ duration: e.currentTarget.duration })}
                        onTimeUpdate={(e) => this.setState({ currentTime: e.currentTarget.currentTime })}
                        onEnded={() => this.setState({ paused: true })}
                        ref={this.audioRef}>
                        <track kind="captions"/>
                    </audio>

                    <div className="flex justify-between items-center mb-2">
                        <Button
                            variant="light"
                            size="sm"
                            isIconOnly
                            isDisabled={this.state.isLoading}
                            onClick={() => this.handlePlayButtonClick()}>
                            <ReactSVG
                                src={this.state.paused ? PlayIcon["src"] : PauseIcon["src"]}
                                className="w-5 h-5 *:fill-default-800 [&_svg]:w-full [&_svg]:h-full"/>
                        </Button>
                        <Button
                            variant="light"
                            size="sm"
                            isIconOnly
                            isDisabled={this.state.isLoading || this.state.currentTime === 0}
                            onClick={() => this.handleStop()}>
                            <ReactSVG
                                src={StopIcon["src"]}
                                className="w-5 h-5 *:fill-default-800 [&_svg]:w-full [&_svg]:h-full"/>
                        </Button>
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
        // Load audio file
        const data = await this.loadFile(true) as ArrayBuffer;
        
        this.blob = new Blob([Buffer.from(data)], { type: "audio/mpeg" });
        this.setState({ isLoading: false });

        // Read metadata
        const metadata = await parseBlob(this.blob);

        if(!metadata) return;
        this.setState({ metadata });

        // Parse lyrics
        var lyrics: Lyric[] = [];

        if(metadata.common.lyrics && metadata.common.lyrics[0].text) {
            new LrcParser().parser(metadata.common.lyrics[0].text).lyrics.forEach(({ start, lyric }) => {
                lyrics.push({ time: start / 1000, text: lyric });
            });
        }
        this.setState({ lyrics });
        
        // Prepare audio player
        this.setState({ value: URL.createObjectURL(this.blob) });
        this.initEvents();
    }

    public componentDidUpdate(): void {
        if(!this.lyricsRef.current) return;
        
        const current = this.getCurrentLyricLine();
        
        if(current === this.state.currentLyricLine) return;
        const lyricElem = this.lyricsRef.current.children[current] as HTMLSpanElement;
        
        if(!lyricElem) return;
        
        // Scroll the lyrics
        this.lyricsRef.current.scrollTop = lyricElem.offsetTop - this.lyricsRef.current.offsetTop - this.lyricsRef.current.offsetHeight / 4 + (lyricElem.offsetHeight / 2);
        this.setState({ currentLyricLine: current });
    }

    public componentWillUnmount() {
        if(!this.blob) return;

        URL.revokeObjectURL(this.state.value);
        this.blob = new Blob();
        this.setState({ value: "" });

        this.eventController.abort();
        this.eventController = new AbortController();
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
