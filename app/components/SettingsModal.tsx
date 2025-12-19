"use client";

import { useState, useEffect } from "react";
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
    ChevronRight
} from "lucide-react";
import Image from "next/image";
import TypewriterText from "./TypewriterText";

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
        } else {
            const timer = setTimeout(() => setMounted(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 300);
    };

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen && !isClosing ? "opacity-100" : "opacity-0"
                    }`}
                onClick={handleClose}
            />

            {/* Modal Container */}
            <div
                className={`relative w-full max-w-4xl h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden flex transform transition-all duration-300 ${isOpen && !isClosing
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 translate-y-4"
                    }`}
            >
                {/* Sidebar - Left Column */}
                <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col">
                    <div className="p-6 border-b border-slate-100">
                        <h2 className="text-xl font-bold text-slate-900">
                            <TypewriterText messages={["Settings"]} loop={false} />
                        </h2>
                    </div>

                    <nav className="flex-1 p-3 space-y-1">
                        <button
                            onClick={() => setActiveTab("general")}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "general"
                                    ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                                }`}
                        >
                            <Settings className="w-4 h-4" />
                            General
                        </button>

                        <button
                            onClick={() => setActiveTab("account")}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "account"
                                    ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                                }`}
                        >
                            <User className="w-4 h-4" />
                            My Account
                        </button>

                        <button
                            onClick={() => setActiveTab("contact")}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "contact"
                                    ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                                }`}
                        >
                            <HelpCircle className="w-4 h-4" />
                            Contact & Help
                        </button>
                    </nav>

                    <div className="p-4 border-t border-slate-200">
                        <div className="flex items-center gap-3 px-2 py-2">
                            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                                {user?.image ? (
                                    <Image src={user.image} alt={user.name || "User"} width={32} height={32} />
                                ) : (
                                    <span className="text-xs font-bold text-slate-500">{user?.name?.[0] || "U"}</span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-slate-900 truncate">{user?.name || "User"}</p>
                                <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content - Right Column */}
                <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
                    <div className="relative flex-1 overflow-y-auto p-8">
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* General Tab */}
                        {activeTab === "general" && (
                            <div className="space-y-8 animate-slide-up">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-1">General Settings</h3>
                                    <p className="text-sm text-slate-500">Customize your application experience.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-sm">
                                                <Sun className="w-5 h-5 text-orange-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">Appearance</p>
                                                <p className="text-xs text-slate-500">Currently set to Light Mode</p>
                                            </div>
                                        </div>
                                        {/* Placeholder toggle - functionality to be added later if needed */}
                                        <div className="flex gap-1 bg-slate-200 p-1 rounded-lg">
                                            <button className="p-1 px-3 rounded-md bg-white text-slate-900 shadow-sm text-xs font-medium">Light</button>
                                            <button className="p-1 px-3 rounded-md text-slate-500 hover:text-slate-900 text-xs font-medium">Dark</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Account Tab */}
                        {activeTab === "account" && (
                            <div className="space-y-8 animate-slide-up">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-1">My Account</h3>
                                    <p className="text-sm text-slate-500">Manage your profile and subscription.</p>
                                </div>

                                <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                                    <div className="h-24 w-24 rounded-full bg-slate-100 ring-4 ring-white shadow-lg flex items-center justify-center overflow-hidden">
                                        {user?.image ? (
                                            <Image src={user.image} alt={user.name || "User"} width={96} height={96} className="object-cover h-full w-full" />
                                        ) : (
                                            <span className="text-3xl font-bold text-slate-400">{user?.name?.[0] || "U"}</span>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-900">{user?.name || "User Name"}</h4>
                                        <p className="text-slate-500">{user?.email || "user@example.com"}</p>
                                        <div className="mt-3 flex gap-2">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                Active Plan
                                            </span>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                                Pro User
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors group cursor-pointer">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                    <CreditCard className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">Manage Subscription</p>
                                                    <p className="text-xs text-slate-500">Update billing or change plan</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100">
                                    <button
                                        onClick={() => window.location.href = '/api/auth/signout'}
                                        className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium px-4 py-2 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign out of account
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Contact Tab */}
                        {activeTab === "contact" && (
                            <div className="space-y-8 animate-slide-up">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-1">Contact & Support</h3>
                                    <p className="text-sm text-slate-500">Get help or get in touch with our team.</p>
                                </div>

                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                                    <div className="flex gap-3">
                                        <div className="flex-shrink-0">
                                            <HelpCircle className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-blue-900">Have a question?</h4>
                                            <p className="text-sm text-blue-700 mt-1 leading-relaxed">
                                                Please check our <a href="/faq" target="_blank" className="underline font-semibold hover:text-blue-800">Frequently Asked Questions (FAQ)</a> page first. most questions about billing, account limits, and features are answered there.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl border border-slate-200">
                                        <h4 className="text-sm font-medium text-slate-900 mb-3">Still need help?</h4>
                                        <a href="mailto:support@ramssorted.com" className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
                                            <div className="p-2 bg-white rounded-full shadow-sm">
                                                <Mail className="w-4 h-4 text-slate-600" />
                                            </div>
                                            <div className="flex-1">
                                                <span className="block text-sm font-medium text-slate-900">Email Support</span>
                                                <span className="block text-xs text-slate-500">support@ramssorted.com</span>
                                            </div>
                                            <ExternalLink className="w-4 h-4 text-slate-400" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Wave Footer (Decorative) */}
                    <div className="h-2 w-full bg-auth-swirl opacity-80" />
                </div>
            </div>
        </div>
    );
}
