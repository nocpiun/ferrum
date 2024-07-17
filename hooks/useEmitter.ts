import { useEffect } from "react";

import Emitter from "@/lib/emitter";

type EmitterInstance = [string, (...args: any[]) => any];

/**
 * Create an event listener with `EventEmitter`
 * 
 * @example
 * ```ts
 * useEmitter([
 *     ["foo", () => console.log("bar")]
 * ]);
 * 
 * // in somewhere...
 * new Emitter().emit("foo"); // bar
 * ```
 */
export default function useEmitter(instances: EmitterInstance[]) {
    useEffect(() => {
        instances.forEach((instance: EmitterInstance) => {
            Emitter.get().on(instance[0], (...args: any[]) => instance[1](...args));
        });
    }, []);
}
