"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";

interface BlurFadeProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    yOffset?: number;
    blur?: string;
}

const variants: Variants = {
    hidden: (custom: { yOffset: number; blur: string }) => ({
        opacity: 0,
        y: custom.yOffset,
        filter: `blur(${custom.blur})`,
    }),
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
    },
};

export function BlurFade({
    children,
    className,
    delay = 0,
    duration = 0.6,
    yOffset = 20,
    blur = "10px",
}: BlurFadeProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={{ yOffset, blur }}
            variants={variants}
            transition={{
                duration,
                delay,
                ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
