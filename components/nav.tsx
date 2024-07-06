"use client";

import React, { useState } from "react";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem
} from "@nextui-org/navbar";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";
import { Switch } from "@nextui-org/switch";
import Link from "next/link";
import { Sun, Moon, LogOut, Gauge, Folders, Settings2 } from "lucide-react";
import { useTheme } from "next-themes";
import { redirect, usePathname } from "next/navigation";

type NavPage = "dashboard" | "explorer" | "settings";

const Nav: React.FC = () => {
    const { setTheme, theme } = useTheme();
    const pathname = usePathname();
    const [page, setPage] = useState<NavPage | null>(() => {
        switch(pathname) {
            case "/dashboard":
                return "dashboard";
            case "/settings":
                return "settings";
            default:
                if(/^\/x\S*/.test(pathname)) {
                    return "explorer";
                }

                return null;
        }
    });

    if(!page) return redirect("/");

    const handleSwitchTheme = (value: boolean) => {
        value
        ? setTheme("light")
        : setTheme("dark");
    };

    return (
        <Navbar
            classNames={{
                item: [
                    "px-3",
                    "py-1",
                    "data-[active=true]:bg-primary",
                    "data-[active=true]:text-white",
                    "data-[active=true]:rounded-lg",
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
                        href="/x/"
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
                    <Switch
                        size="md"
                        startContent={<Sun size={13}/>}
                        endContent={<Moon size={13}/>}
                        defaultSelected={theme === "light"}
                        onValueChange={(value) => handleSwitchTheme(value)}/>
                </NavbarItem>
                <NavbarItem>
                    <Button size="sm">
                        登出
                        <LogOut size={15}/>
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}

export default Nav;
