/* eslint-disable no-console */
import { NextRequest } from "next/server";
import md5 from "md5";

import { generateToken } from "@/lib/token";
import { tokenStorageKey } from "@/lib/global";
import { packet, error } from "@/lib/packet";

interface AuthRequestData {
    password: string
}

export async function POST(req: NextRequest) {
    try {
        if(req.cookies.get(tokenStorageKey)) return error(403);

        const { password } = await req.json() as AuthRequestData;
    
        if(!password) return error(400);
        const md5Password = md5(password);

        if(md5Password !== process.env["PASSWORD"]) return error(401);
        const token = generateToken(md5Password);
    
        return packet({ token });
    } catch (err) {
        console.log("[Server: /api/auth/login] "+ err);

        return error(500);
    }
}
