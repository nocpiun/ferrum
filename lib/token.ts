import md5 from "md5";

import { getPasswordFromEnv } from "./auth";

export function generateToken(password: string): string {
    return password + md5(password);
}

export function validateToken(token: string): boolean {
    const password = getPasswordFromEnv();

    if(!password) throw new Error("No environment variable: `PASSWORD`");

    return token === generateToken(password);
}
