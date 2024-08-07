"use client";

import { useEffect } from "react";
import axios, { type AxiosError } from "axios";
import md5 from "md5";
import Cookie from "js-cookie";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import ThemeSwitch from "@/components/theme-switch";
import PasswordInput from "@/components/password-input";
import { BaseResponseData } from "@/types";
import { tokenStorageKey } from "@/lib/global";

const schema = z.object({
    password: z.string().min(6, { message: "请输入访问密码" }),
});

interface AuthResponseData extends BaseResponseData {
    token?: string
}

export default function Page() {
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            password: ""
        }
    });

    const handleLogin = async ({ password }: z.infer<typeof schema>) => {
        try {
            const { data } = await axios.post<AuthResponseData>("/api/auth", { password: md5(password) });
            const { status, token } = data;

            if(!token) {
                toast.error("服务器未返回token");

                return;
            }

            if(status === 200) {
                Cookie.set(tokenStorageKey, token);
                toast.success("登录成功");
                router.push("/explorer");
            }
        } catch (_err) {
            const err = _err as AxiosError;
            const status = err.response?.status ?? 0;

            switch(status) {
                case 400:
                    toast.error(`请求无效 (${status})`);
                    break;
                case 401:
                    toast.error(`访问密码错误 (${status})`);
                    break;
                case 403:
                    toast.error(`已登录，无法重复登录 (${status})`);
                    break;
                case 500:
                    toast.error(`服务器内部错误 (${status})`);
                    break;
            }
        }
    };

    useEffect(() => {
        if(Cookie.get(tokenStorageKey)) router.push("/");
    }, []);

    return (
        <div className="h-[100vh] flex flex-col justify-center items-center">
            <Card className="w-[500px] h-fit p-6">
                <div className="my-16 flex flex-col items-center cursor-default">
                    <Image
                        alt="logo"
                        src="/icon.png"
                        className="w-[70px] mb-4"
                        style={{ imageRendering: "pixelated" }}/>
                    <h1 className="font-bold text-2xl mb-2">登录 Ferrum</h1>
                    <p className="text-default-400 text-sm">Explore throughout your server.</p>
                </div>

                <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(handleLogin)}>
                    <PasswordInput
                        {...form.register("password")}
                        isRequired
                        label="访问密码"
                        labelPlacement="outside"/>
                    <Button color="primary" type="submit">
                        访问
                    </Button>
                </form>
            </Card>

            <div className="w-[500px] p-3 flex justify-between">
                <span className="text-default-400 text-sm">Copyright &copy; {new Date().getFullYear()} NoahHrreion</span>

                <ThemeSwitch size="sm"/>
            </div>
        </div>
    );
}
