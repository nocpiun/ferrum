import { NextRequest, NextResponse } from "next/server";
import diskinfo from "node-disk-info";

import { tokenStorageKey } from "@/lib/global";
import { validateToken } from "@/lib/token";

export async function GET(req: NextRequest) {
    const token = req.cookies.get(tokenStorageKey)?.value;

    if(!token) return NextResponse.json({ status: 401 });
    if(!validateToken(token)) return NextResponse.json({ status: 403 });

    return NextResponse.json({
        status: 200,
        disks: diskinfo.getDiskInfoSync()
    });
}
