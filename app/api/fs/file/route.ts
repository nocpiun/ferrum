import fs from "node:fs";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";
import mime from "mime";

import { isDemo, tokenStorageKey } from "@/lib/global";
import { validateToken } from "@/lib/token";
import { packet, error } from "@/lib/packet";
import { streamFile } from "@/lib/stream";
import { getFileType } from "@/lib/utils";
// Demo
import demoFile from "@/lib/demo/file.json";

export async function GET(req: NextRequest) {
    if(isDemo) {
        return packet(demoFile);
    }

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

interface FilePostRequestData {
    newName: string
}

export async function POST(req: NextRequest) {
    if(isDemo) return packet({});

    const token = req.cookies.get(tokenStorageKey)?.value;

    if(!token) return error(401);
    if(!validateToken(token)) return error(403);

    const { searchParams } = new URL(req.url);
    const targetPath = searchParams.get("path") ?? "/";
    const { newName } = await req.json() as FilePostRequestData;
    
    if(!newName || /[\\\/:*?"<>|]/.test(newName.toString())) error(400);
    const newPath = path.join(path.dirname(targetPath), newName?.toString() ?? "");
    
    try {
        if(!targetPath || !fs.existsSync(targetPath)) return error(404);
        if(fs.existsSync(newPath)) return error(409);
        
        const stat = fs.statSync(targetPath);
        
        if(!stat.isFile()) return error(400);
        
        fs.renameSync(targetPath, newPath);
        
        return packet({});
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log("[Server: /api/fs/file] "+ err);
        
        return error(500);
    }
}

interface FilePatchRequestData {
    content: string
}

export async function PATCH(req: NextRequest) {
    if(isDemo) return packet({});

    const token = req.cookies.get(tokenStorageKey)?.value;

    if(!token) return error(401);
    if(!validateToken(token)) return error(403);

    const { searchParams } = new URL(req.url);
    const targetPath = searchParams.get("path") ?? "/";
    const { content } = await req.json() as FilePatchRequestData;

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

export async function DELETE(req: NextRequest) {
    if(isDemo) return packet({});

    const token = req.cookies.get(tokenStorageKey)?.value;

    if(!token) return error(401);
    if(!validateToken(token)) return error(403);

    const { searchParams } = new URL(req.url);
    const targetPath = searchParams.get("path") ?? "/";

    try {
        if(!targetPath || !fs.existsSync(targetPath)) return error(404);

        const stat = fs.statSync(targetPath);
    
        if(!stat.isFile()) return error(400);

        fs.truncateSync(targetPath);
        fs.unlinkSync(targetPath);
        
        return packet({});
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log("[Server: /api/fs/file] "+ err);

        return error(500);
    }
}
