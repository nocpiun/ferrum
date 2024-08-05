import fs from "node:fs";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";
import mime from "mime";

import { tokenStorageKey } from "@/lib/global";
import { validateToken } from "@/lib/token";
import { packet, error } from "@/lib/packet";
import { streamFile } from "@/lib/stream";
import { getFileType } from "@/lib/utils";

export async function GET(req: NextRequest) {
    const token = req.cookies.get(tokenStorageKey)?.value;

    if(!token) return error(401);
    if(!validateToken(token)) return error(403);

    const { searchParams } = new URL(req.url);
    const targetPath = searchParams.get("path") ?? "/";
    const isStream = (searchParams.get("stream") ?? "0") === "1"; // 0 = false, 1 = true
    const fileType = getFileType(path.extname(targetPath).replace(".", ""))?.id;
    
    try {
        if(!targetPath || !fs.existsSync(targetPath)) return error(404);
    
        const stat = fs.statSync(targetPath);
    
        if(!stat.isFile() || ((fileType === "audio" || fileType === "video") && !isStream)) return error(400);

        if(isStream) {
            const stream = fs.createReadStream(targetPath);

            return new NextResponse(streamFile(stream), {
                status: 200,
                headers: {
                    "Content-Disposition": `attachment; filename=streamFile`,
                    "Content-Type": mime.getType(targetPath) ?? "application/octet-stream",
                    "Content-Length": stat.size.toString()
                }
            });
        }
    
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

export async function PATCH(req: NextRequest) {
    const token = req.cookies.get(tokenStorageKey)?.value;

    if(!token) return error(401);
    if(!validateToken(token)) return error(403);

    const { searchParams } = new URL(req.url);
    const targetPath = searchParams.get("path") ?? "/";
    const content = (await req.formData()).get("content");

    if(!content) error(400);

    try {
        if(!targetPath || !fs.existsSync(targetPath)) return error(404);

        const stat = fs.statSync(targetPath);
    
        if(!stat.isFile()) return error(400);

        fs.writeFileSync(targetPath, content?.toString() ?? "");
        
        return packet({});
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log("[Server: /api/fs/file] "+ err);

        return error(500);
    }
}
