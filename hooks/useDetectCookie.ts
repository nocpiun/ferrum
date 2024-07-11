import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import { tokenStorageKey } from "@/lib/global";

export function useDetectCookie() {
    const router = useRouter();

    useEffect(() => {
        if(!Cookies.get(tokenStorageKey)) router.push("/");
    });
}
