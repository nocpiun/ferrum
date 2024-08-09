import fs from "node:fs";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";
import mime from "mime";

import { isDemo, tokenStorageKey } from "@/lib/global";
import { validateToken } from "@/lib/token";
import { error } from "@/lib/packet";
import { streamFile } from "@/lib/stream";
// Demo
import demoFile from "@/lib/demo/file.json";

export async function GET(req: NextRequest) {
    if(isDemo) {
        return new NextResponse(demoFile.content, {
            status: 200,
            headers: {
                "Content-Disposition": `attachment; filename=hello.txt`,
                "Content-Type": "text/plain",
                "Content-Length": demoFile.size.toString()
            }
        });
    }

    const token = req.cookies.get(tokenStorageKey)?.value;

    if(!token) return error(401);
    if(!validateToken(token)) return error(403);

    const { searchParams } = new URL(req.url);
    const targetPath = searchParams.get("path") ?? "C:/";
    
    try {
        if(!targetPath || !fs.existsSync(targetPath)) return error(404);
    
        const stat = fs.statSync(targetPath);
    
        if(!stat.isFile()) return error(400);

        const stream = fs.createReadStream(targetPath);

        return new NextResponse(streamFile(stream), {
            status: 200,
            headers: {
                "Content-Disposition": `attachment; filename=${encodeURIComponent(path.basename(targetPath))}`,
                "Content-Type": mime.getType(targetPath) ?? "application/octet-stream",
                "Content-Length": stat.size.toString()
            }
        });
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log("[Server: /api/fs/download] "+ err);

        return error(500);
    }
}
