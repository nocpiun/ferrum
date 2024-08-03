"use client";

import React, { useEffect, useState } from "react";
import { Progress } from "@nextui-org/progress";
import { cn } from "@nextui-org/theme";

import { emitter } from "@/lib/emitter";
import { getCurrentState } from "@/lib/utils";

function secondToTime(second: number): string {
    const h = Math.floor(second / 3600);
    const m = Math.floor((second - h * 3600) / 60);
    const s = Math.floor(second - h * 3600 - m * 60);

    return `${h < 10 ? ("0" + h) : h}:${m < 10 ? ("0" + m) : m}:${s < 10 ? ("0" + s) : s}`;
}

interface PlayerProgressProps {
    duration: number
    current: number
}

const PlayerProgress: React.FC<PlayerProgressProps> = (props) => {
    const currentTime = secondToTime(props.current);
    const duration = secondToTime(props.duration);
    const percent = props.current / props.duration;

    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [draggingValue, setDraggingValue] = useState<number>(-1);

    const handleProgressBarClick = (e: React.MouseEvent) => {
        var progressBar = document.getElementById("progress-bar");

        if(!progressBar) return;

        var x = e.clientX - progressBar.offsetLeft;
        var result = x / progressBar.clientWidth * 100;

        emitter.emit("viewer:audio-player-time-change", result / 100 * props.duration);
    };

    useEffect(() => {
        const controller = new AbortController();

        window.addEventListener("mousemove", async (e) => {
            if(!(await getCurrentState(setIsDragging))) return;

            var progressBar = document.getElementById("progress-bar");

            if(!progressBar) return;
            
            var x = e.clientX - progressBar.offsetLeft;
            var result = x / progressBar.clientWidth * 100;

            if(result < 0) {
                setDraggingValue(0);
            } else if(result > 100) {
                setDraggingValue(100);
            } else {
                setDraggingValue(result);
            }
        });

        return () => controller.abort();
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        window.addEventListener("mouseup", async () => {
            if(!(await getCurrentState(setIsDragging))) return;

            setIsDragging(false);
            emitter.emit("viewer:audio-player-time-change", draggingValue / 100 * props.duration);
            setDraggingValue(-1);
        }, { signal: controller.signal });

        return () => controller.abort();
    }, [draggingValue]);

    return (
        <div className="flex flex-col gap-1">
            <div className="flex justify-between *:text-sm *:text-default-400">
                <span>{currentTime}</span>
                <span>{duration}</span>
            </div>

            <div className="relative h-3 flex items-center" id="progress-bar">
                <Progress
                    classNames={{
                        indicator: "bg-default-800"
                    }}
                    size="sm"
                    value={isDragging ? draggingValue : (percent * 100)}
                    color="default"
                    disableAnimation
                    onClick={(e) => handleProgressBarClick(e)}
                    aria-label="播放器进度条"/>
                
                <div
                    className="h-3 absolute top-0 left-[-3px] flex flex-col items-center box-border"
                    style={{ left: "calc("+ (isDragging ? draggingValue : (percent * 100)) +"% - 3px)" }}>
                    <div
                        role="slider"
                        className="w-2 h-2 hover:w-3 hover:h-3 transition-all mt-[0.125rem] hover:mt-0 bg-default-800 rounded-full"
                        onMouseDown={(e) => {
                            setIsDragging(true);
                            setDraggingValue(percent * 100);

                            /** @see https://stackoverflow.com/questions/9506041/events-mouseup-not-firing-after-mousemove */
                            e.preventDefault();
                        }}
                        tabIndex={-1}
                        aria-valuenow={percent}/>
                    
                    <div className={cn((isDragging ? "block" : "hidden"), "absolute top-3")}>
                        <span className="font-semibold">{secondToTime(draggingValue / 100 * props.duration)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlayerProgress;
