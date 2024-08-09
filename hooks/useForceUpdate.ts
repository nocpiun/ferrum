import { useState } from "react";

export function useForceUpdate() {
    const [, setCount] = useState(0);

    return () => setCount((prev) => prev + 1);
}
