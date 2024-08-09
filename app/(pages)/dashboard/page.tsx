/* eslint-disable padding-line-between-statements */
"use client";

import React, { useState, useEffect } from "react";

import { useDetectCookie } from "@/hooks/useDetectCookie";
// Widgets
import CPUWidget from "@/components/dashboard/cpu-widget";
import DiskWidget from "@/components/dashboard/disk-widget";
import MemoryWidget from "@/components/dashboard/memory-widget";
import GPUWidget from "@/components/dashboard/gpu-widget";
import BatteryWidget from "@/components/dashboard/battery-widget";
import OSWidget from "@/components/dashboard/os-widget";
import { WebSocketContext } from "@/hooks/useOS";
import { isDemo } from "@/lib/global";

export default function Page() {
    const [mounted, setMounted] = useState<boolean>(false);
    const [ws, setWebSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        setMounted(true);

        document.title = "Ferrum - 仪表盘";

        var _ws: WebSocket;
        if(!isDemo) {
            _ws = new WebSocket(`ws://${window.location.host}/api/os`);
            setWebSocket(_ws);
        }

        return () => _ws?.close();
    }, []);

    useEffect(() => {
        return () => ws?.close();
    }, [ws]);

    useDetectCookie();

    if(!mounted) return <></>;

    return (
        <WebSocketContext.Provider value={{ ws }}>
            <div className="w-[1000px] h-[600px] mx-auto b-15 p-5 grid grid-cols-4 grid-rows-3 gap-4">
                <CPUWidget className="col-span-2"/>
                <DiskWidget className="col-span-2 row-span-2"/>
                <MemoryWidget className="col-span-2"/>
                <GPUWidget className="col-span-2"/>
                <BatteryWidget />
                <OSWidget />
            </div>
        </WebSocketContext.Provider>
    );
}
