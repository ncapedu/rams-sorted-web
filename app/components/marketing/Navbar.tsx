"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { href: "/", label: "Product" },
        { href: "/pricing", label: "Pricing" },
        { href: "/faq", label: "FAQ" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
    ];

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo + Wordmark */}
                <Link
                    href="/"
                    className="flex items-center gap-0 group"
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
                    <div className="relative h-40 w-[40rem] -ml-[14rem] mt-2">
                        <Image
                            src="/rams-sorted-text.png"
                            alt="RAMS Sorted"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-slate-600">
                    {navLinks.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`hover:text-slate-900 transition-colors relative py-1 ${
                                isActive(href)
                                    ? "text-slate-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-slate-900 after:rounded-full"
                                    : ""
                            }`}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-3">
                    <Link
                        href="/signin"
                        className="text-slate-600 font-medium text-[15px] px-4 py-2.5 rounded-full hover:bg-slate-100 transition-all duration-200"
                    >
                        Sign in
                    </Link>
                    <Link
                        href="/signup"
                        className="bg-slate-900 text-white px-5 py-2.5 rounded-full font-medium text-[15px] hover:bg-slate-800 transition-all duration-200 hover:shadow-lg active:scale-95"
                    >
                        Get started
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu Panel */}
            {mobileMenuOpen && (
                <nav className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-200 shadow-xl p-6 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
                    {navLinks.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`text-lg font-medium py-3 border-b border-slate-100 transition-colors ${
                                isActive(href) ? "text-slate-900" : "text-slate-700 hover:text-slate-900"
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {label}
                        </Link>
                    ))}
                    <div className="flex flex-col gap-3 mt-4">
                        <Link
                            href="/signin"
                            className="w-full text-center py-3.5 text-slate-600 font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Sign in
                        </Link>
                        <Link
                            href="/signup"
                            className="w-full text-center py-3.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Get started free
                        </Link>
                    </div>
                </nav>
            )}
        </header>
    );
}
