"use client";

import { useEffect } from "react";

import { useDetectCookie } from "@/hooks/useDetectCookie";

export default function Page() {
    useEffect(() => {
        document.title = "Ferrum - 设置";
    }, []);
    
    useDetectCookie();
    
    return <></>;
}
