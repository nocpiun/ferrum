/* eslint-disable react/display-name */
"use client";

import React, { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input, InputProps } from "@nextui-org/input";

const PasswordInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

    return (
        <Input
            endContent={
                <button className="outline-none" type="button" onClick={() => setPasswordVisible((current) => !current)}>
                    {
                        passwordVisible
                        ? <EyeOff className="pointer-events-none"/>
                        : <Eye className="pointer-events-none"/>
                    }
                </button>
            }
            type={passwordVisible ? "text" : "password"}
            autoComplete="password"
            ref={ref}
            {...props}/>
    );
})

export default PasswordInput;
