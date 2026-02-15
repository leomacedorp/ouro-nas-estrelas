"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ShimmerButtonProps {
    children: React.ReactNode;
    className?: string;
    shimmerColor?: string;
    shimmerSize?: string;
    shimmerDuration?: string;
    onClick?: () => void;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
}

export function ShimmerButton({
    children,
    className,
    shimmerColor = "rgba(255, 255, 255, 0.1)",
    shimmerSize = "0.1em",
    shimmerDuration = "2s",
    onClick,
    disabled,
    type = 'button',
}: ShimmerButtonProps) {
    return (
        <motion.button
            type={type}
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            whileHover={disabled ? undefined : { scale: 1.02 }}
            whileTap={disabled ? undefined : { scale: 0.98 }}
            className={cn(
                "group relative inline-flex items-center justify-center overflow-hidden rounded-full",
                "px-8 py-4 font-bold text-lg transition-all duration-300",
                "bg-gradient-to-r from-gold-600 to-gold-500",
                "text-white shadow-[0_0_20px_rgba(245,158,11,0.3)]",
                "hover:shadow-[0_0_40px_rgba(245,158,11,0.5)]",
                disabled ? "opacity-60 cursor-not-allowed" : "",
                className
            )}
            style={{
                "--shimmer-color": shimmerColor,
                "--shimmer-size": shimmerSize,
                "--shimmer-duration": shimmerDuration,
            } as React.CSSProperties}
        >
            {/* Shimmer effect */}
            <span className="absolute inset-0 overflow-hidden rounded-full">
                <span className="shimmer-effect absolute inset-0" />
            </span>

            {/* Content */}
            <span className="relative z-10 flex items-center gap-2">
                {children}
            </span>
        </motion.button>
    );
}
