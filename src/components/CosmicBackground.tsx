"use client";

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface CosmicBackgroundProps {
    intensity?: 'subtle' | 'medium' | 'intense';
    showMeteors?: boolean;
    showStars?: boolean;
    showNebula?: boolean;
}

interface MeteorData {
    top: number;
    left: number;
    duration: number;
    delay: number;
    repeatDelay: number;
}

export default function CosmicBackground({
    intensity = 'medium',
    showMeteors = true,
    showStars = true,
    showNebula = true,
}: CosmicBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [meteors, setMeteors] = useState<MeteorData[]>([]);

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Reduce counts significantly on mobile but keep enough to be visible
    const starCount = isMobile ? 60 : {
        subtle: 50,
        medium: 150,
        intense: 250,
    }[intensity];

    const meteorCount = isMobile && showMeteors ? 6 : {
        subtle: 5,
        medium: 15,
        intense: 25,
    }[intensity];

    // Canvas starfield effect
    useEffect(() => {
        if (!showStars) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: false }); // Optimization: alpha false if possible, but we need overlay. 
        // Actually keep standard context but optimize draw loop
        if (!ctx) return;

        // Set canvas size
        const setCanvasSize = () => {
            if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        };
        setCanvasSize();

        // Debounce resize to avoid thrashing on mobile scroll bar changes
        let resizeTimeout: NodeJS.Timeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(setCanvasSize, 200);
        };
        window.addEventListener('resize', handleResize);

        // Generate stars
        const stars = Array.from({ length: starCount }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * (isMobile ? 1.8 : 2), // Even bigger on mobile
            opacity: Math.random() * 0.5 + (isMobile ? 0.7 : 0.5), // Brighter base on mobile (0.7-1.0)
            twinkleSpeed: Math.random() * 0.02 + 0.01,
        }));

        let animationFrame: number;
        let time = 0;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            time += 0.01;

            // Batch drawing for performance
            ctx.fillStyle = '#FFF';

            stars.forEach((star) => {
                const twinkle = Math.sin(time * star.twinkleSpeed) * 0.3 + 0.7;
                ctx.beginPath();
                ctx.globalAlpha = star.opacity * twinkle;
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrame = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener('resize', handleResize);
        };
    }, [showStars, starCount, isMobile]);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#0a0512_100%)]">
            {/* Ambient Base Glow */}
            <div className="absolute inset-0 bg-indigo-950/10" />

            {/* Canvas Starfield */}
            {showStars && (
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 opacity-80"
                    style={{ mixBlendMode: 'screen' }}
                />
            )}

            {/* Nebulas - Static on mobile for performance, Animated on Desktop */}
            {showNebula && (
                <>
                    <motion.div
                        className="absolute nebula-top-left nebula-size rounded-full bg-indigo-900/30 blur-nebula"
                        initial={{ opacity: 0.4, scale: 1 }}
                        animate={isMobile ? undefined : {
                            scale: [1, 1.1, 1],
                            opacity: [0.4, 0.6, 0.4],
                        }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                    <motion.div
                        className="absolute nebula-bottom-right nebula-size rounded-full bg-purple-900/30 blur-nebula"
                        initial={{ opacity: 0.3, scale: 1 }}
                        animate={isMobile ? undefined : {
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 18,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                    <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 nebula-size-half rounded-full bg-gold-600/10 blur-nebula-sm"
                        initial={{ opacity: 0.2, scale: 1 }}
                        animate={isMobile ? undefined : {
                            scale: [1, 1.3, 1],
                            opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                </>
            )}

            {/* Meteors */}
            {meteors.map((meteor, i) => (
                <motion.div
                    key={i}
                    className="absolute w-32 h-0.5 rounded-full"
                    style={{
                        background: 'linear-gradient(to right, transparent, rgba(245,158,11,0.6), rgba(255,255,255,0.9))',
                        filter: 'drop-shadow(0 0 1px rgba(255,255,255,0.5))',
                        top: `${meteor.top}%`,
                        left: `${meteor.left}%`,
                        transform: 'rotate(20deg)',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{
                        x: ['0vw', '120vw'],
                        y: [0, 600],
                        opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                        duration: meteor.duration,
                        delay: meteor.delay,
                        repeat: Infinity,
                        repeatDelay: meteor.repeatDelay,
                        ease: 'linear',
                    }}
                />
            ))}
        </div>
    );
}
