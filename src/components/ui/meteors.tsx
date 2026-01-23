"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface Meteor {
    id: number;
    size: number;
    left: string;
    delay: string;
    duration: string;
}

interface MeteorsProps {
    number?: number;
    className?: string;
}

export function Meteors({ number = 20, className }: MeteorsProps) {
    const [meteors, setMeteors] = useState<Meteor[]>([]);

    useEffect(() => {
        const generatedMeteors = Array.from({ length: number }, (_, idx) => ({
            id: idx,
            size: Math.floor(Math.random() * 2) + 1,
            left: `${Math.floor(Math.random() * 100)}%`,
            delay: `${Math.random() * 5}s`,
            duration: `${Math.floor(Math.random() * 3) + 2}s`,
        }));
        setMeteors(generatedMeteors);
    }, [number]);

    return (
        <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
            {meteors.map((meteor) => (
                <span
                    key={meteor.id}
                    className="meteor"
                    style={{
                        left: meteor.left,
                        width: `${meteor.size}px`,
                        height: `${meteor.size * 60}px`,
                        animationDelay: meteor.delay,
                        animationDuration: meteor.duration,
                    }}
                />
            ))}
        </div>
    );
}
