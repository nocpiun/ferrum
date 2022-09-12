/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";

import { SashProps } from "../types";
import Utils from "../../Utils";

type ContainerRefType = HTMLElement | null;
type SashType = React.ForwardRefExoticComponent<SashProps & React.RefAttributes<ContainerRefType>>;

const Sash: SashType = React.forwardRef<ContainerRefType, SashProps>((props, containerRef) => {
    const [width, setWidth] = useState(props.defaultWidth);
    const sash = useRef<HTMLDivElement | null>(null);

    const resizeWidth = (newWidth: number) => {
        setWidth(newWidth);
        props.onResize(newWidth);
    };

    useEffect(() => {
        if(!sash.current || containerRef instanceof Function || !containerRef?.current) return;
        const sashElem = sash.current;
        const containerElem = containerRef.current;

        const minW = props.min;
        const maxW = props.max;

        var isHovered = false;
        var isResizing = false;

        // The moving direction of the mouse
        enum Dir {
            LEFT = 0, RIGHT = 1
        }

        // Sash style
        // When the mouse enter the sash div, after half a second, the sash will turn into blue
        sashElem.addEventListener("mouseover", async () => {
            isHovered = true;

            await Utils.sleep(500);
            if(isHovered) sashElem.classList.add("hover");
        });
        sashElem.addEventListener("mouseleave", () => {
            isHovered = false;
            if(isResizing) return;
            sashElem.classList.remove("hover");
        });

        /** @see https://blog.csdn.net/fandyvon/article/details/88718914 */
        containerElem.addEventListener("mousedown", (eOrigin: MouseEvent) => {
            if(!containerElem || !isHovered) return;

            isResizing = true
            
            const oW = containerElem.offsetWidth;
            const oX = eOrigin.clientX;

            var direction: Dir;

            // If the mouse exceeds the right side of the sidebar 10px,
            // then the moving direction is right, and vice versa.
            if(oX > oW - 10) {
                direction = props.position == "right" ? Dir.RIGHT : Dir.LEFT;
            } else if(oX < oW + 10) {
                direction = props.position == "right" ? Dir.LEFT : Dir.RIGHT;
            }

            document.body.addEventListener("mousemove", (eMove: MouseEvent) => {
                if(!isResizing) return;
                var curW;

                switch(direction) {
                    case Dir.LEFT:
                        curW = oW - (eMove.clientX - oX);
                        break;
                    case Dir.RIGHT:
                        curW = oW + (eMove.clientX - oX);
                        break;
                }

                resizeWidth(Math.max(minW, Math.min(maxW, curW))); // minW <= curW <= maxW
            });

            document.body.addEventListener("mouseup", () => {
                if(!isResizing) return;

                isResizing = false;
                if(!isHovered) sashElem.classList.remove("hover");

                containerElem.style.transition = "width .3s"; // Turn on the transition when resizing finished
            });
        });
    }, []);

    useEffect(() => {
        if(containerRef instanceof Function || !containerRef?.current) return;
        const containerElem = containerRef.current;

        containerElem.style.transition = "none"; // Turn off the transition when resizing
    }, [width]);

    return (
        <>
            {props.children}
            <div className="sash" style={
                props.position == "left"
                ? { right: width +"px" }
                : { left: width +"px" }
            } ref={sash}></div>
        </>
    );
})

export default Sash;
