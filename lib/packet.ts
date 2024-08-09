import { NextResponse } from "next/server";

export function packet(body: any, status: number = 200) {
    return NextResponse.json({ status, ...body }, { status });
}

export function error(status: number) {
    return packet({}, status);
}
