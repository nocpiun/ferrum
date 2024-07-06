"use client";

import React from "react";
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

const Nav: React.FC = () => {
    const { setTheme, theme } = useTheme();

    const handleSwitchTheme = (value: boolean) => {
        value
        ? setTheme("light")
        : setTheme("dark");
    };

    return (
        <Navbar
            classNames={{
                item: [
                    "data-[active=true]:bg-primary",
                    "data-[active=true]:px-3",
                    "data-[active=true]:py-1",
                    "data-[active=true]:rounded-lg",
                ]
            }}>
            <NavbarBrand className="space-x-2">
                <Image alt="logo" src="/icon.png"/>
                <h1 className="font-semibold text-lg">Ferrum</h1>
            </NavbarBrand>
            <NavbarContent className="space-x-5" justify="center">
                <NavbarItem>
                    <Link className="flex items-center space-x-2" href="/dashboard">
                        <Gauge size={20}/>
                        <span>仪表盘</span>
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link className="flex items-center space-x-2" href="/x/">
                        <Folders size={20}/>
                        <span>文件管理器</span>
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link className="flex items-center space-x-2" href="/settings">
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
