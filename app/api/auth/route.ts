/* eslint-disable no-console */
import { NextRequest, NextResponse } from "next/server";
import md5 from "md5";

import { generateToken } from "@/lib/token";
import { tokenStorageKey } from "@/lib/global";

interface AuthRequestData {
    password: string
}

export async function POST(req: NextRequest) {
    try {
        if(req.cookies.get(tokenStorageKey)) return NextResponse.json({ status: 403 });

        const { password } = await req.json() as AuthRequestData;
    
        if(!password) return NextResponse.json({ status: 400 });
        const md5Password = md5(password);

        if(md5Password !== process.env["PASSWORD"]) return NextResponse.json({ status: 401 });
        const token = generateToken(md5Password);
    
        return NextResponse.json({ status: 200, token });
    } catch (err) {
        console.log("[Server: /api/auth/login] "+ err);

        return NextResponse.json({ status: 500 });
    }
}
