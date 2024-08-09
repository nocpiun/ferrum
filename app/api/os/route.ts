/* eslint-disable no-console */
import type { IncomingMessage } from "http";
import type { WebSocket, WebSocketServer } from "ws";
import type { OSWebSocketMessage } from "@/hooks/useOS";

import os from "os";

import si from "systeminformation";
import { cpuModel, usagePercent as cpuPercent } from "node-system-stats";
import cookie from "cookie";

import { error } from "@/lib/packet";
import { isDemo, tokenStorageKey } from "@/lib/global";
import { validateToken } from "@/lib/token";

export function GET() {
    return error(400);
}

export function SOCKET(
    client: WebSocket,
    req: IncomingMessage,
    _server: WebSocketServer,
) {
    if(isDemo) return;

    const token = cookie.parse(req.headers.cookie ?? "")[tokenStorageKey];

    if(!token) {
        client.close(401);
        
        return;
    }
    if(!validateToken(token)) {
        client.close(403);
        
        return;
    }

    console.log("[Server: /api/os] Socket client connected.");

    const handleRequest = async () => {
        const cpu = await si.cpu();
        const cpuTemp = await si.cpuTemperature();
        const mem = await si.mem();
        const memLayout = await si.memLayout();
        const graphics = await si.graphics();
        const battery = await si.battery();
        const disk = await si.fsSize();

        // if(cpuTemp.main === null) {
        //     console.warn("CPU temperature info on Windows requires Administrator privilege.");
        // }

        client.send(JSON.stringify({
            cpu: {
                model: cpuModel,
                totalCores: cpu.cores,
                usage: (await cpuPercent()).percent,
                
                /**
                 * Admin privilege required on Windows
                 * @see https://systeminformation.io/cpu.html
                 */
                temperature: cpuTemp.main
            },
            memory: {
                total: mem.total,
                usage: (mem.used / mem.total) * 100,
                amount: memLayout.length,
                mems: memLayout.map((item) => ({
                    size: item.size,
                    type: item.type,
                    formFactor: item.formFactor
                }))
            },
            gpu: graphics.controllers.map((gpu) => ({
                model: gpu.model,
                vendor: gpu.vendor,
                memoryTotal: gpu.vram,
                memoryUsage: gpu.memoryUsed && gpu.memoryTotal ? ((gpu.memoryUsed / gpu.memoryTotal) * 100) : undefined
            })),
            battery: {
                hasBattery: battery.hasBattery,
                isCharging: battery.isCharging,
                percent: battery.percent
            },
            disk: disk.map((item) => ({
                mount: item.mount,
                type: item.type,
                size: item.size,
                used: item.used
            })),
            os: {
                arch: os.arch(),
                platform: os.platform(),
                release: os.release(),
                version: os.version()
            }
        } as OSWebSocketMessage));
    };

    var timer = setInterval(handleRequest, 5000);

    handleRequest();

    client.on("close", () => {
        clearInterval(timer);

        console.log("[Server: /api/os] Socket client disconnected.");
    });
}
