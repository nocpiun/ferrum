import os from "node:os";

import { NextRequest } from "next/server";
import si from "systeminformation";

import { tokenStorageKey } from "@/lib/global";
import { validateToken } from "@/lib/token";
import { packet, error } from "@/lib/packet";

export async function GET(req: NextRequest) {
    const token = req.cookies.get(tokenStorageKey)?.value;

    if(!token) return error(401);
    if(!validateToken(token)) return error(403);

    try {
        const disk = await si.fsSize();
        
        return packet({
            status: 200,
            system: os.platform(),
            disks: disk.map((item) => ({
                used: item.used,
                size: item.size,
                capacity: (item.used / item.size) * 100,
                mount: item.mount
            }))
        });
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log("[Server: /api/fs/disks] "+ err);
        
        return error(500);
    }
}
