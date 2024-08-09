"use client";

import React, { useEffect, useState } from "react";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem
} from "@nextui-org/navbar";
import { Image } from "@nextui-org/image";
import Link from "next/link";
import { Gauge, Folders, Settings2 } from "lucide-react";
import { usePathname } from "next/navigation";

import ThemeSwitch from "./theme-switch";

type NavPage = "dashboard" | "explorer" | "settings";

const Nav: React.FC = () => {
    const pathname = usePathname();
    
    const handlePathnameChange = (changed: string) => {
        switch(changed) {
            case "/dashboard":
                return "dashboard";
            case "/explorer":
            case "/explorer/viewer":
                return "explorer";
            case "/settings":
                return "settings";
            default:
                return null;
        }
    };
    
    const [page, setPage] = useState<NavPage | null>(() => {
        return handlePathnameChange(pathname);
    });

    useEffect(() => {
        setPage(handlePathnameChange(pathname));
    }, [pathname]);

    return (
        <Navbar
            classNames={{
                item: [
                    "p-2",
                    "border-b-1",
                    "border-transparent",
                    "data-[active=true]:text-primary-500",
                    "data-[active=true]:border-primary-500",
                ]
            }}>
            <NavbarBrand className="space-x-2">
                <Image alt="logo" src="/icon.png"/>
                <h1 className="font-semibold text-lg">Ferrum</h1>
            </NavbarBrand>
            <NavbarContent className="space-x-4" justify="center">
                <NavbarItem isActive={page === "dashboard"}>
                    <Link
                        className="flex items-center space-x-2"
                        href="/dashboard"
                        onClick={() => setPage("dashboard")}>
                        <Gauge size={20}/>
                        <span>仪表盘</span>
                    </Link>
                </NavbarItem>
                <NavbarItem isActive={page === "explorer"}>
                    <Link
                        className="flex items-center space-x-2"
                        href="/explorer"
                        onClick={() => setPage("explorer")}>
                        <Folders size={20}/>
                        <span>文件管理器</span>
                    </Link>
                </NavbarItem>
                <NavbarItem isActive={page === "settings"}>
                    <Link
                        className="flex items-center space-x-2"
                        href="/settings"
                        onClick={() => setPage("settings")}>
                        <Settings2 size={20}/>
                        <span>设置</span>
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    {page !== "settings" && <ThemeSwitch />}
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}

export default Nav;
