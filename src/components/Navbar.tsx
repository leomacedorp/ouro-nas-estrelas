"use client";

import Link from 'next/link';
import { Sparkles, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/lib/siteConfig';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const navLinks = siteConfig.links.nav;

    return (
        <nav className="fixed w-full z-50 transition-all duration-300 border-b border-white/5 bg-mystic-950/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gold-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                        <Sparkles className="w-6 h-6 text-gold-400 relative z-10" />
                    </div>
                    <span className="font-serif text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gold-200 to-gold-500">
                        {siteConfig.name}
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-slate-300 hover:text-gold-300 transition-colors tracking-wide"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href={siteConfig.whatsapp.url("Gostaria de acessar a Área de Membros")}
                        className="px-6 py-2 rounded-full bg-gold-600/10 border border-gold-500/30 text-gold-300 hover:bg-gold-600 hover:text-white transition-all duration-300"
                    >
                        Área de Membros
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-slate-300 hover:text-gold-400"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-mystic-950 border-b border-white/5 shadow-2xl animate-in slide-in-from-top-5">
                    <div className="flex flex-col p-6 gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-lg font-serif text-slate-300 hover:text-gold-400 py-2 border-b border-white/5"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href={siteConfig.whatsapp.url("Gostaria de acessar a Área de Membros")}
                            className="mt-4 px-6 py-3 rounded-lg text-center bg-gold-600 text-white font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            Área de Membros
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
