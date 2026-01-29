"use client";

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { ZODIAC_SIGNS } from '@/lib/constants';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.06,
            delayChildren: 0.2,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 12,
        },
    },
};

export default function ZodiacGrid() {
    return (
        <section className="py-24 relative overflow-hidden bg-mystic-950">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-100 mb-4 text-glow">
                        Escolha seu Signo
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Selecione seu signo solar para descobrir o que os astros revelam sobre o seu dia, semana e mês.
                    </p>
                </motion.div>

                {/* Grid */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {ZODIAC_SIGNS.map((sign) => (
                        <motion.div
                            key={sign.slug}
                            variants={itemVariants}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Link
                                href={`/signos/${sign.slug}`}
                                className="group relative block p-6 md:p-8 rounded-2xl glass cursor-pointer overflow-hidden"
                            >
                                {/* Hover Gradient Overlay */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold-500/0 via-gold-500/0 to-gold-500/0 group-hover:from-gold-500/5 group-hover:via-gold-500/10 group-hover:to-gold-500/15 transition-all duration-500" />

                                {/* Border Glow */}
                                <div className="absolute inset-0 rounded-2xl border border-white/5 group-hover:border-gold-500/30 transition-colors duration-300" />

                                {/* Content */}
                                <div className="relative z-10 flex flex-col items-center text-center">
                                    {/* Symbol */}
                                    <span className="text-4xl md:text-5xl mb-4 drop-shadow-gold group-hover:scale-110 transition-transform duration-300">
                                        {sign.symbol}
                                    </span>

                                    {/* Name */}
                                    <h3 className="text-lg md:text-xl font-serif font-bold text-gold-400 mb-1 group-hover:text-gold-300 transition-colors duration-300">
                                        {sign.name}
                                    </h3>

                                    {/* Date Range */}
                                    <span className="text-xs md:text-sm text-slate-500 mb-3 font-medium">
                                        {sign.dates}
                                    </span>

                                    {/* Description */}
                                    <p className="text-xs text-slate-400 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                                        {sign.description}
                                    </p>

                                    {/* Arrow indicator on hover */}
                                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="text-gold-500 text-sm flex items-center gap-1">
                                            Ver horóscopo
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
