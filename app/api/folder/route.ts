import fs from "node:fs";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";

import { tokenStorageKey } from "@/lib/global";

export async function GET(req: NextRequest) {
    if(!req.cookies.get(tokenStorageKey)) return NextResponse.json({ status: 401 });

    const { searchParams } = new URL(req.url);
    const targetDisk = searchParams.get("disk");
    const targetPath = path.join((targetDisk ?? "C") +":", searchParams.get("path") ?? "/");
    
    try {
        if(!targetPath || !fs.existsSync(targetPath)) return NextResponse.json({ status: 404 });
    
        const stat = fs.statSync(targetPath);
    
        if(!stat.isDirectory()) return NextResponse.json({ status: 400 });
    
        return NextResponse.json({
            status: 200,
            items: fs.readdirSync(targetPath).map((itemName) => {
                const item = fs.statSync(path.join(targetPath, itemName));
    
                return {
                    name: itemName,
                    type: item.isDirectory() ? "folder" : "file",
                    size: item.size
                };
            })
        });
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log("[Server: /api/folder] "+ err);

        return NextResponse.json({ status: 500 });
    }
}
