import fs from "node:fs";

import { NextRequest } from "next/server";

import { tokenStorageKey } from "@/lib/global";
import { validateToken } from "@/lib/token";
import { packet, error } from "@/lib/packet";

export async function GET(req: NextRequest) {
    const token = req.cookies.get(tokenStorageKey)?.value;

    if(!token) return error(401);
    if(!validateToken(token)) return error(403);

    const { searchParams } = new URL(req.url);
    const targetPath = searchParams.get("path") ?? "/";
    
    try {
        if(!targetPath || !fs.existsSync(targetPath)) return error(404);
    
        const stat = fs.statSync(targetPath);
    
        if(!stat.isFile()) return error(400);
    
        return packet({
            path: targetPath,
            size: stat.size,
            content: fs.readFileSync(targetPath)
        });
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log("[Server: /api/fs/file] "+ err);

        return error(500);
    }
}
