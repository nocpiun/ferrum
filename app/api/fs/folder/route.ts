import type { DirectoryItem } from "@/types";

import fs from "node:fs";
import path from "node:path";

import { NextRequest } from "next/server";

import { tokenStorageKey } from "@/lib/global";
import { validateToken } from "@/lib/token";
import { packet, error } from "@/lib/packet";

export async function GET(req: NextRequest) {
    const token = req.cookies.get(tokenStorageKey)?.value;

    if(!token) return error(401);
    if(!validateToken(token)) return error(403);

    const { searchParams } = new URL(req.url);
    const targetDisk = searchParams.get("disk");
    const targetPath = path.join(targetDisk ?? "C:", searchParams.get("path") ?? "/");
    
    try {
        if(!targetPath || !fs.existsSync(targetPath)) return error(404);
    
        const stat = fs.statSync(targetPath);
    
        if(!stat.isDirectory()) return error(400);
    
        return packet({
            items: fs.readdirSync(targetPath).map<DirectoryItem>((itemName) => {
                const itemPath = path.join(targetPath, itemName);

                if(!fs.existsSync(itemPath)) {
                    return {
                        name: itemName,
                        type: "file",
                        size: 0,
                        access: false
                    };
                }

                const item = fs.statSync(itemPath);
    
                return {
                    name: itemName,
                    type: item.isDirectory() ? "folder" : "file",
                    size: item.size,
                    access: true
                };
            })
        });
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log("[Server: /api/fs/folder] "+ err);

        return error(500);
    }
}

export async function POST(req: NextRequest) {
    const token = req.cookies.get(tokenStorageKey)?.value;

    if(!token) return error(401);
    if(!validateToken(token)) return error(403);
    
    const { searchParams } = new URL(req.url);
    const targetDisk = searchParams.get("disk");
    const targetPath = path.join(targetDisk ?? "C:", searchParams.get("path") ?? "/");
    const newName = (await req.formData()).get("newName");
    
    if(!newName) error(400);
    const newPath = path.join(path.dirname(targetPath), newName?.toString() ?? "");
    
    try {
        if(!targetPath || !fs.existsSync(targetPath)) return error(404);
        if(fs.existsSync(newPath)) return error(409);
        
        const stat = fs.statSync(targetPath);
        
        if(!stat.isDirectory()) return error(400);
        
        fs.renameSync(targetPath, newPath);
        
        return packet({});
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log("[Server: /api/fs/folder] "+ err);
        
        return error(500);
    }
}

export async function DELETE(req: NextRequest) {
    const token = req.cookies.get(tokenStorageKey)?.value;

    if(!token) return error(401);
    if(!validateToken(token)) return error(403);

    const { searchParams } = new URL(req.url);
    const targetDisk = searchParams.get("disk");
    const targetPath = path.join(targetDisk ?? "C:", searchParams.get("path") ?? "/");

    try {
        if(!targetPath || !fs.existsSync(targetPath)) return error(404);

        const stat = fs.statSync(targetPath);
    
        if(!stat.isDirectory()) return error(400);

        fs.rmSync(targetPath, { recursive: true, force: true });
        
        return packet({});
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log("[Server: /api/fs/folder] "+ err);

        return error(500);
    }
}
