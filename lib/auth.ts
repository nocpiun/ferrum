import fs from "fs";
import path from "path";

const envPath = path.join(process.cwd(), ".pwd");

export function getPasswordFromEnv(): string {
    const env = fs.readFileSync(envPath, "utf-8");

    return env.replace("PASSWORD=", "");
}

export function setPasswordToEnv(password: string) {
    fs.writeFileSync(envPath, `PASSWORD=${password}`, "utf-8");
}
