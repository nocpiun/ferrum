import React, { useState, useEffect } from "react";

import Utils from "../../Utils";
import Logger from "../utils/logger";
import BasketballIcon from "../../icons/basketball.png";

const g = 0.98; // Gravity
const f = 0.6; // Resistance
const radius = 35;

class Basketball {
    private readonly screenHeight = (Utils.getElem("easter-canvas") as HTMLCanvasElement).height;

    public x: number;
    public y: number;
    private v: number = 0;

    public constructor(x: number, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    public updateFrame(): void {
        if(this.y >= this.screenHeight - (radius / 2)) {
            this.v = -this.v;
            this.v *= f;
        } else {
            this.v += g;
        }
        this.y += this.v;
    }
}

const Easter: React.FC = () => {
    const [visible, setVisible] = useState<boolean>(false);

    useEffect(() => {
        document.addEventListener("keydown", (e: KeyboardEvent) => {
            if(e.ctrlKey && e.key == "m") {
                setVisible(true);
                Logger.log({ value: "%c你干嘛~~哈哈~哎哟~~~~" }, "font-weight:bold;font-size:17pt;color:yellow")

                const canvas = Utils.getElem("easter-canvas") as HTMLCanvasElement;
                var ctx = canvas.getContext("2d");
                var objects: Basketball[] = [];

                // Init canvas size
                canvas.width = 2 * canvas.offsetWidth;
                canvas.height = 2 * canvas.offsetHeight;

                // Init basketball icon
                const icon = new Image(10, 10);
                icon.src = BasketballIcon;

                const update = () => {
                    if(!ctx) return;
                    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

                    objects.forEach((obj) => {
                        if(!ctx) return;
                        obj.updateFrame();
                        ctx.drawImage(icon, obj.x, obj.y, 2 * radius, 2 * radius);
                    });

                    if(Utils.getRandom(0, 3) == 1) objects.push(new Basketball(Utils.getRandom(0, canvas.width)));

                    window.requestAnimationFrame(update); // Next frame
                };

                update();
            }
        });
    }, []);

    return <canvas
        className="easter"
        id="easter-canvas"
        style={{ display: visible ? "block" : "none" }}></canvas>;
}

export default Easter;
