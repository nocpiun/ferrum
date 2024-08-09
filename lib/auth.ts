import fs from "fs";
import path from "path";

import { isDemo } from "./global";

const envPath = path.join(process.cwd(), ".pwd");
const defaultPwd = "14e1b600b1fd579f47433b88e8d85291"; // 123456

export function getPasswordFromEnv(): string {
    if(isDemo) return defaultPwd;
    
    const env = fs.readFileSync(envPath, "utf-8");

    return env.replace("PASSWORD=", "");
}

export function setPasswordToEnv(password: string) {
    if(isDemo) return;

    fs.writeFileSync(envPath, `PASSWORD=${password}`, "utf-8");
}
