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

export default function Page() {
    const router = useRouter();

    const handleLogout = () => {
        Cookies.remove(tokenStorageKey);
        toast.success("登出成功");
        router.refresh();
    };
    
    useEffect(() => {
        document.title = "Ferrum - 设置";
    }, []);
    
    useDetectCookie();
    
    return (
        <div className={cn("w-[800px] min-h-0 mx-auto mb-9 px-5 py-5 overflow-y-auto flex flex-col gap-10", scrollbarStyle)}>
            <SettingsSection title="通用">
                <SettingsItem label="文件批量上传数量上限">
                    <Select
                        className="w-48"
                        selectionMode="single"
                        defaultSelectedKeys={["infinite"]}
                        aria-label="文件批量上传数量上限">
                        <SelectItem key="infinite" aria-label="无限">无限</SelectItem>
                        {
                            new Array(6).fill(0).map((_value, index) => {
                                const n = (5 * (index + 1)).toString()

                                return (
                                    <SelectItem key={n} aria-label={n}>{n}</SelectItem>
                                );
                            }) as any
                        }
                    </Select>
                </SettingsItem>
                <SettingsItem label="Ace Editor 自动换行" description="文本编辑器自动换行">
                    <Switch />
                </SettingsItem>
                <SettingsItem label="Ace Editor 代码提示" description="文本编辑器代码提示与自动填充">
                    <Switch />
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
                        defaultSelectedKeys={["list"]}
                        aria-label="文件管理器默认视图">
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
                    <Switch />
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
                        defaultSelectedKeys={["ambiance"]}
                        aria-label="Ace Editor 主题">
                        <SelectItem key="ambiance" aria-label="ambiance">Ambiance</SelectItem>
                    </Select>
                </SettingsItem>
            </SettingsSection>

            <SettingsSection title="安全">
                <SettingsItem label="设置访问密码">
                    <Button color="primary">开始设置</Button>
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
