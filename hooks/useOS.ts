import React, { useContext, useEffect } from "react";

interface WebSocketContextType {
    ws: WebSocket | null;
}

export const WebSocketContext = React.createContext<WebSocketContextType>({ ws: null });

export interface CPUInfo {
    model: string
    totalCores: number
    usage: number
    temperature: number
}

export interface MemoryInfo {
    total: number
    usage: number
    amount: number
}

export interface GPUInfo {
    vendor: string
    model: string
    memoryTotal?: number
    memoryUsage?: number
}

export interface BatteryInfo {
    hasBattery: boolean
    isCharging: boolean
    percent: number
}

export interface DiskInfo {
    mount: string
    type: string
    size: number
    used: number
}

export interface OSInfo {
    arch: string
    platform: NodeJS.Platform
    release: string
    version: string
}

export interface OSWebSocketMessage {
    cpu: CPUInfo
    memory: MemoryInfo
    gpu: GPUInfo[]
    battery: BatteryInfo
    disk: DiskInfo[]
    os: OSInfo
}

/** Used by dashboard widgets to fetch os info from the ws interface (`/api/os`). */
export function useOS(listener: (msg: OSWebSocketMessage) => void) {
    const { ws } = useContext(WebSocketContext);

    useEffect(() => {
        const controller = new AbortController();

        ws?.addEventListener("message", (e) => {
            const msg = JSON.parse(e.data) as OSWebSocketMessage;

            listener(msg);
        }, { signal: controller.signal });

        return () => controller.abort();
    }, [ws]);
}
