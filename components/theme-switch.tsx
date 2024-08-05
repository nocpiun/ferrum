"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Switch } from "@nextui-org/switch";
import { Sun, Moon } from "lucide-react";

interface ThemeSwitchProps {
    size?: "sm" | "md" | "lg"
}

const ThemeSwitch: React.FC<ThemeSwitchProps> = ({ size }) => {
    const { setTheme, theme } = useTheme();
    const [mouted, setMouted] = useState<boolean>(false);

    const handleSwitchTheme = (value: boolean) => {
        value
        ? setTheme("light")
        : setTheme("dark");
    };

    useEffect(() => {
        setMouted(true);
    }, []);

    if(!mouted) return <></>;

    return <Switch
        size={size ?? "md"}
        startContent={<Sun size={13}/>}
        endContent={<Moon size={13}/>}
        defaultSelected={theme === "light"}
        onValueChange={(value) => handleSwitchTheme(value)}/>;
}

export default ThemeSwitch;
