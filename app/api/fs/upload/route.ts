import fs from "node:fs";
import path from "node:path";

import { NextRequest } from "next/server";

import { tokenStorageKey } from "@/lib/global";
import { validateToken } from "@/lib/token";
import { packet, error } from "@/lib/packet";

export async function POST(req: NextRequest) {
    const token = req.cookies.get(tokenStorageKey)?.value;

    if(!token) return error(401);
    if(!validateToken(token)) return error(403);

    const { searchParams } = new URL(req.url);
    const targetDisk = searchParams.get("disk");
    const targetPath = path.join(targetDisk ?? "C:", searchParams.get("path") ?? "/");

    try {
        const file = (await req.formData()).getAll("filepond")[1] as File;
        const newFilePath = path.join(targetPath, file.name);
        
        const buffer = Buffer.from(await file.arrayBuffer());
        const writeStream = fs.createWriteStream(newFilePath, "utf-8");

        writeStream.write(buffer);
        writeStream.close();

        return packet({});
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log("[Server: /api/fs/folder] "+ err);

        return error(500);
    }
}
