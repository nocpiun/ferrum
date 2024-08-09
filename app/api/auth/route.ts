/* eslint-disable no-console */
import { NextRequest } from "next/server";
import md5 from "md5";

import { generateToken, validateToken } from "@/lib/token";
import { tokenStorageKey } from "@/lib/global";
import { packet, error } from "@/lib/packet";
import { getPasswordFromEnv, setPasswordToEnv } from "@/lib/auth";

interface AuthPostRequestData {
    password: string
}

export async function POST(req: NextRequest) {
    try {
        if(req.cookies.get(tokenStorageKey)) return error(403);

        const { password } = await req.json() as AuthPostRequestData;
    
        if(!password) return error(400);
        const md5Password = md5(password);

        if(md5Password !== getPasswordFromEnv()) return error(401);
        const token = generateToken(md5Password);
    
        return packet({ token });
    } catch (err) {
        console.log("[Server: /api/auth] "+ err);

        return error(500);
    }
}

interface AuthPatchRequestData {
    newPassword: string
    oldPassword: string
}

export async function PATCH(req: NextRequest) {
    const token = req.cookies.get(tokenStorageKey)?.value;

    if(!token) return error(401);
    if(!validateToken(token)) return error(403);

    try {
        const { oldPassword, newPassword } = await req.json() as AuthPatchRequestData;
    
        if(!oldPassword) return error(400);
        const md5OldPassword = md5(oldPassword);

        if(md5OldPassword !== getPasswordFromEnv()) return error(401);

        const md5NewPassword = md5(newPassword);

        setPasswordToEnv(md5NewPassword);
        
        return packet({});
    } catch (err) {
        console.log("[Server: /api/auth] "+ err);

        return error(500);
    }
}
