import os from "node:os";

import { NextRequest } from "next/server";
import diskinfo from "node-disk-info";

import { tokenStorageKey } from "@/lib/global";
import { validateToken } from "@/lib/token";
import { packet, error } from "@/lib/packet";

export async function GET(req: NextRequest) {
    const token = req.cookies.get(tokenStorageKey)?.value;

    if(!token) return error(401);
    if(!validateToken(token)) return error(403);

    try {
        return packet({
            status: 200,
            system: os.platform(),
            disks: diskinfo.getDiskInfoSync()
        });
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log("[Server: /api/fs/disks] "+ err);
        
        return error(500);
    }
}
