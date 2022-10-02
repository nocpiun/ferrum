import React, { useState, useEffect } from "react";

import Utils from "../../Utils";
import Logger from "../utils/logger";
import BasketballIcon from "../../icons/basketball.png";

const g = 9.8; // Gravity / m/s^2

class Basketball {
    public x: number;
    public y: number;
    private v: number = 0;
    private a: number = g;

    public constructor(x: number, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    public updateFrame(t: number): boolean {
        this.v += this.a * t;
        this.y = this.v * t + (this.a * Math.pow(t, 2)) / 2;
        if(this.y >= (Utils.getElem("easter-canvas") as HTMLCanvasElement).height) {
            return false;
        }
        return true;
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
                var t = 0;

                // Init canvas size
                canvas.width = 2 * canvas.offsetWidth;
                canvas.height = 2 * canvas.offsetHeight;

                // Init basketball icon
                const icon = new Image(10, 10);
                icon.src = BasketballIcon;

                // Init basketball objects
                for(let i = 0; i < 30; i++) {
                    objects.push(new Basketball(Utils.getRandom(0, canvas.width)));
                }

                const update = () => {
                    if(!ctx) return;
                    t += .02; // delta t

                    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

                    objects.forEach((obj) => {
                        if(!ctx) return;
                        if(obj.updateFrame(t)) ctx.drawImage(icon, obj.x, obj.y, 70, 70);
                    });

                    if(Utils.getRandom(0, 1) == 1) objects.push(new Basketball(Utils.getRandom(0, canvas.width)));

                    if(t > 3) {
                        setVisible(false);
                        return;
                    }
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
