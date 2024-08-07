"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@nextui-org/theme";
import { Button } from "@nextui-org/button";
import { Switch } from "@nextui-org/switch";
import { Select, SelectItem } from "@nextui-org/select";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { List, LayoutGrid, LogOut } from "lucide-react";

import { useDetectCookie } from "@/hooks/useDetectCookie";
import SettingsSection from "@/components/settings/settings-section";
import SettingsItem from "@/components/settings/settings-item";
import ThemeSwitch from "@/components/theme-switch";
import { tokenStorageKey } from "@/lib/global";
import { scrollbarStyle } from "@/lib/style";
import { useWithSettings } from "@/hooks/useWithSettings";
import { useDialog } from "@/hooks/useDialog";

export default function Page() {
    const router = useRouter();
    const dialog = useDialog();
    const { settings, set } = useWithSettings();

    const handleLogout = () => {
        Cookies.remove(tokenStorageKey);
        toast.success("登出成功");
        router.refresh();
    };

    const handleSelectionChange = (key: string, selectedKeys: Set<string>) => {
        const value = Array.from(selectedKeys)[0];

        if(!value) return;
        set(key, value);
    };
    
    useEffect(() => {
        document.title = "Ferrum - 设置";
    }, []);
    
    useDetectCookie();

    if(!settings) return <></>;
    
    return (
        <div className={cn("w-[800px] min-h-0 mx-auto mb-9 px-5 py-5 overflow-y-auto flex flex-col gap-10", scrollbarStyle)}>
            <SettingsSection title="通用">
                <SettingsItem label="Ace Editor 自动换行" description="文本编辑器自动换行">
                    <Switch
                        isSelected={settings["general.ace-wrap"]}
                        onValueChange={(value) => set("general.ace-wrap", value)}/>
                </SettingsItem>

                <SettingsItem label="Ace Editor 代码提示" description="文本编辑器代码提示与自动填充">
                    <Switch
                        isSelected={settings["general.ace-auto-completion"]}
                        onValueChange={(value) => set("general.ace-auto-completion", value)}/>
                </SettingsItem>

                <SettingsItem label="Ace Editor 代码高亮（暂不支持）" description="文本编辑器自动识别代码语言并高亮代码">
                    <Switch isDisabled/>
                </SettingsItem>
            </SettingsSection>

            <SettingsSection title="视图">
                <SettingsItem label="文件管理器默认视图">
                    <Select
                        className="w-48"
                        selectionMode="single"
                        selectedKeys={[settings["view.default-displaying-mode"]]}
                        aria-label="文件管理器默认视图"
                        onSelectionChange={(keys) => handleSelectionChange("view.default-displaying-mode", keys)}>
                        <SelectItem
                            key="list"
                            startContent={<List size={17}/>}
                            aria-label="列表视图">列表视图</SelectItem>
                        <SelectItem
                            key="grid"
                            startContent={<LayoutGrid size={17}/>}
                            aria-label="网格视图">网格视图</SelectItem>
                    </Select>
                </SettingsItem>

                <SettingsItem label="网格图片瀑布流" description="在网格视图下，开启图片文件缩略图预览（可能消耗性能）">
                    <Switch
                        isSelected={settings["view.show-image-thumbnail-preview"]}
                        onValueChange={(value) => set("view.show-image-thumbnail-preview", value)}/>
                </SettingsItem>
            </SettingsSection>

            <SettingsSection title="外观">
                <SettingsItem label="深色 / 浅色模式">
                    <ThemeSwitch />
                </SettingsItem>

                <SettingsItem label="Ace Editor 主题" description="文本编辑器外观主题">
                    <Select
                        className="w-48"
                        selectionMode="single"
                        selectedKeys={[settings["appearance.ace-theme"]]}
                        aria-label="Ace Editor 主题"
                        onSelectionChange={(keys) => handleSelectionChange("appearance.ace-theme", keys)}>
                        <SelectItem key="ambiance" aria-label="ambiance">Ambiance</SelectItem>
                    </Select>
                </SettingsItem>
            </SettingsSection>

            <SettingsSection title="安全">
                <SettingsItem label="设置访问密码">
                    <Button color="primary" onPress={() => dialog.open("changePassword")}>开始设置</Button>
                </SettingsItem>

                <SettingsItem label="登出 Ferrum" description="退出Ferrum 并清除token信息">
                    <Button color="danger" onClick={() => handleLogout()}>
                        登出
                        <LogOut size={15}/>
                    </Button>
                </SettingsItem>
            </SettingsSection>
        </div>
    );
}
