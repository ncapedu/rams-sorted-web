"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
    X,
    User,
    Settings,
    HelpCircle,
    ExternalLink,
    LogOut,
    Moon,
    Sun,
    CreditCard,
    Mail,
    ChevronRight,
    Shield,
    Smartphone
} from "lucide-react";
import Image from "next/image";

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        username?: string | null;
    };
}

type Tab = "general" | "account" | "contact";

export default function SettingsModal({ isOpen, onClose, user }: SettingsModalProps) {
    const [activeTab, setActiveTab] = useState<Tab>("general");
    const [isClosing, setIsClosing] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Handle mounting animation
    useEffect(() => {
        if (isOpen) {
            setMounted(true);
            document.body.style.overflow = "hidden"; // Prevent background scrolling
        } else {
            const timer = setTimeout(() => {
                setMounted(false);
                document.body.style.overflow = ""; // Restore scrolling
            }, 300);
            return () => {
                clearTimeout(timer);
                document.body.style.overflow = "";
            };
        }
    }, [isOpen]);

    // Handle ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 300);
    };

    if (!mounted) return null;

    // Safety check for development
    if (process.env.NODE_ENV === 'development') {
        console.log("Settings panel rendering. isOpen:", isOpen);
    }

    return createPortal(
        <div className="fixed inset-0 z-[9999] font-sans text-slate-900 pointer-events-none">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto ${isOpen && !isClosing ? "opacity-100" : "opacity-0"
                    }`}
                onClick={handleClose}
            />

            {/* Slide-over Panel */}
            <div
                className={`absolute inset-y-0 right-0 w-full max-w-[480px] bg-white shadow-2xl transform transition-transform duration-300 ease-out pointer-events-auto flex flex-col ${isOpen && !isClosing
                    ? "translate-x-0"
                    : "translate-x-full"
                    }`}
                role="dialog"
                aria-modal="true"
                aria-label="Settings"
                tabIndex={-1}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        Settings
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 -mr-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
                        aria-label="Close settings"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="px-6 pt-4 pb-2 border-b border-slate-100 overflow-x-auto scrollbar-hide">
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setActiveTab("general")}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "general"
                                ? "bg-slate-900 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                        >
                            General
                        </button>
                        <button
                            onClick={() => setActiveTab("account")}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "account"
                                ? "bg-slate-900 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                        >
                            Account & Billing
                        </button>
                        <button
                            onClick={() => setActiveTab("contact")}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "contact"
                                ? "bg-slate-900 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                        >
                            Support
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 scroll-smooth">

                    {/* General Tab */}
                    {activeTab === "general" && (
                        <div className="space-y-8 animate-fade-in-up">
                            {/* Security Section (Moved to General/Main for visibility) */}
                            <section>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Security</h3>
                                <div className="space-y-3">
                                    <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                                                    <Shield className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">Password</p>
                                                    <p className="text-xs text-slate-500">Last changed 30 days ago</p>
                                                </div>
                                            </div>
                                            <button className="text-xs font-semibold text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                                                Update
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                                                    <Smartphone className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">Two-Factor Auth</p>
                                                    <p className="text-xs text-slate-500">Not enabled</p>
                                                </div>
                                            </div>
                                            <button className="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 bg-slate-200">
                                                <span className="sr-only">Use setting</span>
                                                <span className="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-0" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Appearance</h3>
                                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                                                <Sun className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">Theme</p>
                                                <p className="text-xs text-slate-500">Light mode is active</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                                            <button className="px-3 py-1 rounded-md bg-white text-slate-900 shadow-sm text-xs font-semibold">Light</button>
                                            <button className="px-3 py-1 rounded-md text-slate-500 hover:text-slate-900 text-xs font-medium">Dark</button>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* Account Tab */}
                    {activeTab === "account" && (
                        <div className="space-y-8 animate-fade-in-up">
                            {/* Profile Header */}
                            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div className="h-16 w-16 rounded-full bg-white ring-2 ring-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                                    {user?.image ? (
                                        <Image src={user.image} alt={user.name || "User"} width={64} height={64} className="object-cover h-full w-full" />
                                    ) : (
                                        <span className="text-2xl font-bold text-slate-400">{(user?.name?.[0] || user?.email?.[0] || "U").toUpperCase()}</span>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-lg font-bold text-slate-900 truncate">{user?.name || "User Name"}</h4>
                                    <p className="text-sm text-slate-500 truncate">{user?.email || "user@example.com"}</p>
                                    <div className="mt-2 flex gap-2">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800 tracking-wide">
                                            Pro Plan
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Subscription Section */}
                            <section>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Subscription</h3>
                                <div className="p-5 rounded-xl border border-blue-100 bg-blue-50/50">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">RAMS Sorted Pro</p>
                                            <p className="text-xs text-slate-500 mt-1">Renews on Jan 12, 2026</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-slate-900">£15.00</p>
                                            <p className="text-xs text-slate-500">/ month</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-blue-100/50 flex gap-3">
                                        <button className="flex-1 text-xs font-semibold text-slate-900 bg-white border border-slate-200 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                                            Manage Billing
                                        </button>
                                        <button className="text-xs font-semibold text-blue-700 hover:text-blue-800 px-3 py-2 transition-colors">
                                            View Invoices
                                        </button>
                                    </div>
                                </div>
                            </section>

                            <div className="pt-6 border-t border-slate-100">
                                <button
                                    onClick={() => window.location.href = '/api/auth/signout'}
                                    className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 text-sm font-semibold px-4 py-3 rounded-xl transition-all border border-transparent hover:border-red-100"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign out of account
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Contact Tab */}
                    {activeTab === "contact" && (
                        <div className="space-y-6 animate-fade-in-up">
                            <section>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Success Center</h3>

                                <a href="/faq" target="_blank" className="block p-4 mb-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <HelpCircle className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900">Help & FAQ</h4>
                                            <p className="text-xs text-slate-500 mt-1">Guides, tutorials, and common questions.</p>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-slate-300 ml-auto group-hover:text-slate-900" />
                                    </div>
                                </a>

                                <a href="mailto:support@ramssorted.com" className="block p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-slate-50 rounded-lg text-slate-600 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                                            <Mail className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900">Email Support</h4>
                                            <p className="text-xs text-slate-500 mt-1">Get in touch with our team.</p>
                                        </div>
                                    </div>
                                </a>
                            </section>

                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <p className="text-xs text-center text-slate-400">
                                    RAMS Sorted v1.0.0
                                    <br />
                                    &copy; {new Date().getFullYear()}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
