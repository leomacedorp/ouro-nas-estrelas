"use client";

import { motion } from "framer-motion";
import { ZODIAC_SIGNS } from "@/lib/constants";
import Link from "next/link";

export default function CelestialWheel() {
    return (
        <div className="relative w-full max-w-[800px] aspect-square mx-auto flex items-center justify-center">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gold-500/5 rounded-full blur-3xl" />

            {/* Rotating Container */}
            <motion.div
                className="relative w-full h-full"
                animate={{ rotate: 360 }}
                transition={{
                    duration: 180,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            >
                {/* Orbital Circles */}
                <div className="absolute top-[10%] left-[10%] w-[80%] h-[80%] rounded-full border border-white/5" />
                <div className="absolute top-[15%] left-[15%] w-[70%] h-[70%] rounded-full border border-white/10" />

                {/* Zodiac Signs */}
                {ZODIAC_SIGNS.map((sign, index) => {
                    const angleDeg = index * 30; // 12 signs = 30 degrees each
                    const angleRad = ((angleDeg - 90) * Math.PI) / 180; // -90 to start at top

                    const radius = 42; // % from center
                    const x = 50 + radius * Math.cos(angleRad);
                    const y = 50 + radius * Math.sin(angleRad);

                    return (
                        <Link key={sign.slug} href={`/signos/${sign.slug}`}>
                            <motion.div
                                className="absolute w-12 h-12 flex items-center justify-center cursor-pointer group"
                                style={{
                                    left: `${x}%`,
                                    top: `${y}%`,
                                    marginLeft: '-24px',
                                    marginTop: '-24px',
                                }}
                                animate={{ rotate: -360 }}
                                transition={{
                                    duration: 180,
                                    repeat: Infinity,
                                    ease: 'linear',
                                }}
                                whileHover={{ scale: 1.3 }}
                            >
                                <div className="relative flex items-center justify-center">
                                    <span className="text-4xl text-slate-500 group-hover:text-gold-400 transition-colors duration-300"
                                        style={{
                                            filter: 'drop-shadow(0 0 0px rgba(245,158,11,0))',
                                            transition: 'filter 0.3s',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.filter = 'drop-shadow(0 0 15px rgba(245,158,11,0.6))';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.filter = 'drop-shadow(0 0 0px rgba(245,158,11,0))';
                                        }}
                                    >
                                        {sign.symbol}
                                    </span>

                                    {/* Tooltip */}
                                    <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 top-full mt-2 left-1/2 -translate-x-1/2 bg-mystic-900/90 px-3 py-1 rounded-full border border-gold-500/20 whitespace-nowrap z-50 pointer-events-none">
                                        <span className="text-xs text-gold-200 font-medium uppercase tracking-widest">
                                            {sign.name}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    );
                })}
            </motion.div>

            {/* Centerpiece */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10">
                <motion.div
                    className="w-32 h-32 rounded-full bg-gradient-to-b from-indigo-950/80 to-mystic-950/80 backdrop-blur-md border border-gold-500/20 flex items-center justify-center"
                    animate={{
                        boxShadow: [
                            '0 0 30px rgba(245,158,11,0.2)',
                            '0 0 60px rgba(245,158,11,0.4)',
                            '0 0 30px rgba(245,158,11,0.2)',
                        ],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    <span className="text-gold-400">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                fill="currentColor"
                            />
                        </svg>
                    </span>
                </motion.div>
            </div>
        </div>
    );
}
