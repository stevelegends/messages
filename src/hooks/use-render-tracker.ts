import { useRef } from "react";

const colors = [
    "\x1b[0m",
    "\x1b[1m",
    "\x1b[2m",
    "\x1b[4m",
    "\x1b[5m",
    "\x1b[7m",
    "\x1b[30m",
    "\x1b[31m",
    "\x1b[32m",
    "\x1b[33m",
    "\x1b[35m",
    "\x1b[36m",
    "\x1b[37m",
    "\x1b[90m",
    "\x1b[40m",
    "\x1b[41m",
    "\x1b[42m",
    "\x1b[43m",
    "\x1b[44m",
    "\x1b[45m",
    "\x1b[46m",
    "\x1b[47m",
    "\x1b[100m"
];
const useRenderTracker = (tag = ["useRenderTracker"]) => {
    if (__DEV__) {
        const randomColor = useRef(colors[Math.floor(Math.random() * colors.length)]);
        const render = useRef(0);
        render.current = render.current + 1;
        console.log(randomColor.current + "%s\x1b[0m", tag.join(" - "), render.current);
    }
};

export default useRenderTracker;
