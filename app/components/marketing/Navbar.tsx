"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo + Wordmark */}
                <Link
                    href="/"
                    className="flex items-center gap-3 group"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    <div className="relative w-16 h-16 transition-transform duration-300 group-hover:scale-105">
                        <Image
                            src="/rams-logo6.png"
                            alt="RAMS Sorted Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <span className="font-archivo font-bold text-4xl tracking-tight italic inline-block bg-clip-text text-transparent bg-[linear-gradient(90deg,#000000,#1d4ed8,#b91c1c,#000000,#1d4ed8,#b91c1c,#000000)] bg-[length:200%_auto] animate-wave pr-2 pb-1">
                        RAMS Sorted
                    </span>
                    <style jsx global>{`
                        @keyframes wave {
                            0% { background-position: 0% 50%; }
                            100% { background-position: 100% 50%; }
                        }
                        .animate-wave {
                            animation: wave 4s linear infinite;
                        }
                    `}</style>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-slate-600">
                    <Link href="/" className="hover:text-slate-900 transition-colors">
                        Product
                    </Link>
                    <Link href="/documents" className="hover:text-slate-900 transition-colors">
                        Documents
                    </Link>
                    <Link href="/pricing" className="hover:text-slate-900 transition-colors">
                        Pricing
                    </Link>
                    <Link href="/faq" className="hover:text-slate-900 transition-colors">
                        FAQ
                    </Link>
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <Link
                        href="/signin"
                        className="text-[15px] font-medium text-slate-600 hover:text-slate-900 transition-colors px-2"
                    >
                        Sign in
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu Panel */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-200 shadow-xl p-6 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
                    <Link
                        href="/"
                        className="text-lg font-medium text-slate-700 py-3 border-b border-slate-100"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Product
                    </Link>
                    <Link
                        href="/documents"
                        className="text-lg font-medium text-slate-700 py-3 border-b border-slate-100"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Documents
                    </Link>
                    <Link
                        href="/pricing"
                        className="text-lg font-medium text-slate-700 py-3 border-b border-slate-100"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Pricing
                    </Link>
                    <Link
                        href="/faq"
                        className="text-lg font-medium text-slate-700 py-3 border-b border-slate-100"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        FAQ
                    </Link>
                    <div className="flex flex-col gap-3 mt-4">
                        <Link
                            href="/signin"
                            className="w-full text-center py-3.5 text-slate-600 font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Sign in
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
