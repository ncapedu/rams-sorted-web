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
    CreditCard,
    Mail,
    ChevronRight,
    Shield,
    Smartphone,
    CheckCircle2,
    AlertTriangle
} from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        username?: string | null;
        passwordLastUpdated?: string | null;
    };
}

type Tab = "general" | "account" | "contact";

export default function SettingsModal({ isOpen, onClose, user }: SettingsModalProps) {
    const [activeTab, setActiveTab] = useState<Tab>("account");
    const [isClosing, setIsClosing] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Password Update State
    const [isPasswordEditing, setIsPasswordEditing] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ current: "", new: "" });
    const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);

    // Initialize with prop value
    const [passwordLastUpdated, setPasswordLastUpdated] = useState<string | null>(user?.passwordLastUpdated || null);

    // Close Account State
    const [isCloseAccountConfirmOpen, setIsCloseAccountConfirmOpen] = useState(false);
    const [shutdownPassword, setShutdownPassword] = useState("");
    const [closeAccountError, setCloseAccountError] = useState("");
    const [isClosingAccount, setIsClosingAccount] = useState(false);

    const handleCloseAccount = async () => {
        if (!shutdownPassword) {
            setCloseAccountError("Password is required");
            return;
        }
        setIsClosingAccount(true);
        setCloseAccountError("");
        try {
            const res = await fetch("/api/user/close", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: shutdownPassword }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to close account");

            // Sign out and redirect
            await signOut({ callbackUrl: '/' });
        } catch (err: any) {
            setCloseAccountError(err.message);
            setIsClosingAccount(false);
        }
    };

    const handlePasswordUpdate = async () => {
        if (!passwordForm.new || passwordForm.new.length < 6) {
            setPasswordMessage({ type: "error", text: "Password must be at least 6 characters" });
            return;
        }

        setIsPasswordLoading(true);
        setPasswordMessage({ type: "", text: "" });

        try {
            const res = await fetch("/api/user/password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: passwordForm.current,
                    newPassword: passwordForm.new,
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to update");

            setPasswordMessage({ type: "success", text: "Password updated successfully" });
            setPasswordForm({ current: "", new: "" });
            setIsPasswordEditing(false);
            setPasswordLastUpdated(new Date().toISOString());
        } catch (err: any) {
            setPasswordMessage({ type: "error", text: err.message });
        } finally {
            setIsPasswordLoading(false);
        }
    };

    // Handle mounting animation
    useEffect(() => {
        if (isOpen) {
            setMounted(true);
            document.body.style.overflow = "hidden"; // Prevent background scrolling
            // Reset sub-modals when opening (just in case)
            setIsCloseAccountConfirmOpen(false);
        } else {
            const timer = setTimeout(() => {
                setMounted(false);
                document.body.style.overflow = ""; // Restore scrolling
                // Reset sub-modals when closing
                setIsCloseAccountConfirmOpen(false);
                setActiveTab("account"); // Optional: reset tab to default? User might prefer persistence. Keeping logic for sub-modal only.
            }, 400); // Slightly longer for smooth exit
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
            setIsCloseAccountConfirmOpen(false); // Ensure it's closed
            onClose();
        }, 400);
    };

    if (!mounted) return null;

    // Safety check for development
    if (process.env.NODE_ENV === 'development') {
        console.log("Settings panel rendering. isOpen:", isOpen);
    }

    return createPortal(
        <div className="fixed inset-0 z-[9999] font-sans pointer-events-none">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] transition-all duration-400 ease-in-out pointer-events-auto ${isOpen && !isClosing ? "opacity-100" : "opacity-0"
                    }`}
                onClick={handleClose}
            />

            {/* Slide-over Panel */}
            <div
                className={`absolute inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl transform transition-transform duration-400 cubic-bezier(0.16, 1, 0.3, 1) pointer-events-auto flex flex-col ${isOpen && !isClosing
                    ? "translate-x-0"
                    : "translate-x-full"
                    }`}
                style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
                role="dialog"
                aria-modal="true"
                aria-label="Settings"
                tabIndex={-1}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100/80 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                        Settings
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 -mr-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors duration-200"
                        aria-label="Close settings"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Vertical Sidebar Layout (Desktop-like feel inside panel) */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Navigation Sidebar */}
                    <div className="w-[160px] bg-slate-50/50 border-r border-slate-100 flex-shrink-0 py-6 px-3 space-y-1 hidden sm:block">
                        <NavButton
                            active={activeTab === "account"}
                            onClick={() => setActiveTab("account")}
                            icon={<User className="w-4 h-4" />}
                            label="Account"
                        />
                        <NavButton
                            active={activeTab === "general"}
                            onClick={() => setActiveTab("general")}
                            icon={<Settings className="w-4 h-4" />}
                            label="General"
                        />
                        <NavButton
                            active={activeTab === "contact"}
                            onClick={() => setActiveTab("contact")}
                            icon={<HelpCircle className="w-4 h-4" />}
                            label="Support"
                        />
                    </div>

                    {/* Mobile Tabs (Visible only on very small screens if sidebar is hidden) */}
                    <div className="sm:hidden w-full px-6 py-2 border-b border-slate-100 flex space-x-4 overflow-x-auto">
                        {/* Mobile tab implementation left simplified for now, assuming panel width > sm breakpoint usually */}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-8 scroll-smooth bg-white">

                        {/* General Tab */}
                        {activeTab === "general" && (
                            <div className="space-y-10 animate-fade-in-up">
                                <section>
                                    <div className="mb-6">
                                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Security</h3>
                                        <p className="text-sm text-slate-500 mt-1">Manage your password and authentication methods.</p>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Password Row */}
                                        <div className="p-4 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                                                        <Shield className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900">Password</p>
                                                        <p className="text-xs text-slate-500">
                                                            {passwordLastUpdated
                                                                ? `Last updated ${new Date(passwordLastUpdated).toLocaleDateString()}`
                                                                : "Password set since account creation"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setIsPasswordEditing(!isPasswordEditing)}
                                                    className="text-xs font-semibold text-slate-900 border border-slate-200 px-3 py-1.5 rounded bg-white hover:bg-slate-50 transition-colors"
                                                >
                                                    {isPasswordEditing ? "Cancel" : "Update"}
                                                </button>
                                            </div>

                                            {/* Password Edit Form */}
                                            {isPasswordEditing && (
                                                <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password</label>
                                                        <input
                                                            type="password"
                                                            value={passwordForm.current}
                                                            onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                                                            className="w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
                                                            placeholder="Enter current password"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
                                                        <input
                                                            type="password"
                                                            value={passwordForm.new}
                                                            onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                                                            className="w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
                                                            placeholder="Enter new password"
                                                        />
                                                        <p className="text-[10px] text-slate-400 mt-1">Must be at least 6 characters long.</p>
                                                    </div>
                                                    {passwordMessage.text && (
                                                        <p className={`text-xs font-medium ${passwordMessage.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                                                            {passwordMessage.text}
                                                        </p>
                                                    )}
                                                    <div className="flex justify-end pt-1">
                                                        <button
                                                            onClick={handlePasswordUpdate}
                                                            disabled={isPasswordLoading}
                                                            className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-md hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                        >
                                                            {isPasswordLoading ? "Updating..." : "Save New Password"}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* 2FA Row */}
                                        <div className="group flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all duration-200 bg-white">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2.5 rounded-full bg-slate-50 text-slate-600 group-hover:scale-105 transition-transform">
                                                    <Smartphone className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">Two-Factor Authentication</p>
                                                    <p className="text-xs text-slate-500 mt-0.5">Add an extra layer of security</p>
                                                </div>
                                            </div>
                                            {/* Toggle Switch */}
                                            <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-slate-200 hover:bg-slate-300">
                                                <span className="sr-only">Enable 2FA</span>
                                                <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-0" />
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}

                        {/* Account Tab */}
                        {activeTab === "account" && (
                            <div className="space-y-10 animate-fade-in-up">
                                {/* Profile Details */}
                                <section className="space-y-6">
                                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">Profile Details</h3>

                                    <div className="flex items-start gap-5 p-4 border border-slate-200 rounded-lg bg-white">
                                        <div className="relative h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200">
                                            {user?.image ? (
                                                <Image src={user.image} alt={user.name || "User"} width={64} height={64} className="object-cover h-full w-full" />
                                            ) : (
                                                <span className="text-xl font-bold text-slate-400">{(user?.name?.[0] || user?.email?.[0] || "U").toUpperCase()}</span>
                                            )}
                                        </div>
                                        <div className="space-y-1 pt-1">
                                            <h4 className="text-lg font-bold text-slate-900 leading-none">{user?.name || "User Name"}</h4>
                                            <p className="text-sm text-slate-500 font-medium">{user?.email || "user@example.com"}</p>
                                            <div className="flex gap-2 mt-2">
                                                <Badge color="blue" label="Pro User" />
                                                <Badge color="green" label="Active" />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <hr className="border-slate-100" />

                                {/* Subscription Section */}
                                <section>
                                    <div className="mb-5 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Subscription</h3>
                                            <p className="text-sm text-slate-500 mt-1">Manage plan details and billing.</p>
                                        </div>
                                    </div>

                                    {/* Premium Card UI */}
                                    <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                                        {/* Decorative gradient top */}
                                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                                        <CreditCard className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 uppercase tracking-wide">RAMS Sorted Pro</p>
                                                        <p className="text-xs text-slate-500 font-medium mt-0.5">Renews Jan 12, 2026</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-2xl font-bold text-slate-900 tracking-tight">£15</span>
                                                    <span className="text-sm text-slate-500 font-medium">/mo</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-md transition-all shadow-sm active:scale-[0.98]">
                                                    Manage Billing
                                                </button>
                                                <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-md transition-all shadow-sm active:scale-[0.98]">
                                                    Invoices
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <hr className="border-slate-100" />

                                <div className="pt-2">
                                    <button
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                        className="w-full flex items-center justify-center gap-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-sm font-semibold px-4 py-3 rounded-md transition-all border border-slate-200 bg-white shadow-sm"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign out of account
                                    </button>
                                </div>

                                {/* Danger Zone */}
                                <section className="pt-6 border-t border-slate-100">
                                    <h3 className="text-sm font-bold text-red-600 uppercase tracking-widest mb-4">Danger Zone</h3>
                                    <div className="rounded-lg border border-red-100 bg-red-50/50 p-4 flex items-center justify-between">
                                        <div className="max-w-[70%]">
                                            <h4 className="text-sm font-bold text-slate-900">Close Account</h4>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Permanently delete your account and all associated data. This action cannot be undone.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setIsCloseAccountConfirmOpen(true)}
                                            className="px-4 py-2 bg-white border border-red-200 text-red-600 text-xs font-bold rounded-md hover:bg-red-50 transition-colors shadow-sm"
                                        >
                                            Close Account
                                        </button>
                                    </div>
                                </section>
                            </div>
                        )}

                        {/* Contact Tab */}
                        {activeTab === "contact" && (
                            <div className="space-y-8 animate-fade-in-up">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">Success Center</h3>
                                    <p className="text-sm text-slate-500 mt-1">We’re here to help you get the most out of RAMS Sorted.</p>
                                </div>

                                <div className="grid gap-4">
                                    <a
                                        href="/faq"
                                        target="_blank"
                                        className="group block p-5 rounded-lg border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all duration-300 relative overflow-hidden"
                                    >
                                        <div className="relative z-10 flex items-start gap-4">
                                            <div className="p-3 bg-blue-50 rounded-lg text-blue-600 group-hover:scale-110 transition-transform duration-300">
                                                <HelpCircle className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-base font-bold text-slate-900">Help & FAQ</h4>
                                                    <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                                                </div>
                                                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                                    Instant answers to common questions about billing, account limits, and features.
                                                </p>
                                            </div>
                                        </div>
                                    </a>

                                    <a
                                        href="mailto:support@ramssorted.com"
                                        className="group block p-5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all duration-300"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-slate-50 rounded-lg text-slate-600 group-hover:scale-110 transition-transform duration-300">
                                                <Mail className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-base font-bold text-slate-900">Email Support</h4>
                                                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                                    Can’t find what you need? Our team is ready to assist you.
                                                </p>
                                                <p className="text-xs font-semibold text-slate-400 mt-3 group-hover:text-slate-600 transition-colors">
                                                    support@ramssorted.com
                                                </p>
                                            </div>
                                        </div>
                                    </a>
                                </div>

                                <div className="p-6 mt-8 rounded-lg bg-slate-50 border border-slate-100 text-center">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                                        Version 1.0.0
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        &copy; {new Date().getFullYear()} RAMS Sorted
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Close Account Confirmation Modal */}
            {isCloseAccountConfirmOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-auto">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsCloseAccountConfirmOpen(false);
                        }}
                    />
                    <div className="relative w-full max-w-md bg-white rounded-lg shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-4 mb-4 text-red-600">
                            <div className="p-3 bg-red-50 rounded-full">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Close Account?</h3>
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Are you sure you want to permanently close your account?
                            </p>
                            <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-sm text-red-800 space-y-2">
                                <p className="font-semibold flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" /> This action cannot be undone.
                                </p>
                                <ul className="list-disc list-inside space-y-1 opacity-90 pl-1">
                                    <li>Your profile and data will be deleted.</li>
                                    <li>Active subscriptions will be cancelled.</li>
                                    <li>You will lose access to all generated documents.</li>
                                </ul>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Enter password to confirm
                                </label>
                                <input
                                    type="password"
                                    value={shutdownPassword}
                                    onChange={(e) => setShutdownPassword(e.target.value)}
                                    placeholder="Your password"
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                                />
                                {closeAccountError && (
                                    <p className="text-xs text-red-600 font-medium mt-2">{closeAccountError}</p>
                                )}
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsCloseAccountConfirmOpen(false);
                                    }}
                                    disabled={isClosingAccount}
                                    type="button"
                                    className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCloseAccount}
                                    disabled={isClosingAccount || !shutdownPassword}
                                    type="button"
                                    className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isClosingAccount ? "Closing..." : "Close Account"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div >,
        document.body
    );
}

// --- SUBCOMPONENTS ---

function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-md text-sm font-medium transition-all duration-200 group ${active
                ? "bg-white text-slate-900 shadow-sm ring-1 ring-black/5"
                : "text-slate-500 hover:text-slate-900 hover:bg-white/60"
                }`}
        >
            <span className={`transition-colors duration-200 ${active ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"}`}>
                {icon}
            </span>
            {label}
            {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />}
        </button>
    );
}

function Badge({ color, label }: { color: "blue" | "green" | "slate"; label: string }) {
    const styles = {
        blue: "bg-blue-50 text-blue-700 border-blue-100",
        green: "bg-emerald-50 text-emerald-700 border-emerald-100",
        slate: "bg-slate-50 text-slate-700 border-slate-100",
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wide border ${styles[color]}`}>
            {label}
        </span>
    );
}

