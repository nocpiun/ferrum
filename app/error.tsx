/* eslint-disable no-console */
"use client";

import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function Error({ error, reset }: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error);
        toast.error("页面出错");
    }, []);

    return (
        <div className="w-[100vw] h-[100vh] flex justify-center items-center">
            <Card className="w-[30rem] h-fit p-6 flex flex-col gap-5">
                <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-3">Ferrum 错误</h1>
                    
                    <p className="break-words">
                        <code>{error.message}</code>
                    </p>
                    {error.digest && <p className="text-red-700 float-right">(digest: {error.digest})</p>}
                </div>

                <Button color="primary" onPress={() => reset()}>重试</Button>
            </Card>
        </div>
    );
}
