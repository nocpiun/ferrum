import fs from "node:fs";

import { NextRequest, NextResponse } from "next/server";
import mime from "mime";

import { isDemo, tokenStorageKey } from "@/lib/global";
import { validateToken } from "@/lib/token";
import { error, packet } from "@/lib/packet";
import { getExtname, getFileType } from "@/lib/utils";
import { streamFile } from "@/lib/stream";

export async function GET(req: NextRequest) {
    if(isDemo) return packet({});

    const token = req.cookies.get(tokenStorageKey)?.value;

    if(!token) return error(401);
    if(!validateToken(token)) return error(403);

    const { searchParams } = new URL(req.url);
    const targetPath = searchParams.get("path") ?? "/";

    try {
        if(!targetPath || !fs.existsSync(targetPath)) return error(404);

        const stat = fs.statSync(targetPath);
    
        if(!stat.isFile() || getFileType(getExtname(targetPath))?.id !== "image") return error(400);

        const stream = fs.createReadStream(targetPath);
        
        return new NextResponse(streamFile(stream), {
            status: 200,
            headers: {
                "Content-Disposition": `attachment; filename=thumbnail`,
                "Content-Type": mime.getType(targetPath) ?? "application/octet-stream",
                "Content-Length": stat.size.toString()
            }
        });
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log("[Server: /api/fs/thumbnail] "+ err);

        return error(500);
    }
}
