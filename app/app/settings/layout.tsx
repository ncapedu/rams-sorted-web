"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Shield, CreditCard, AlertTriangle } from "lucide-react";

const tabs = [
    { name: "Profile", href: "/app/settings/profile", icon: User },
    { name: "Security", href: "/app/settings/security", icon: Shield },
    { name: "Billing", href: "/app/settings/billing", icon: CreditCard },
    { name: "Danger Zone", href: "/app/settings/danger", icon: AlertTriangle },
];

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-[#f5f4f0] p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
                    <p className="text-slate-500 mt-2">Manage your account preferences and security.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Settings Sidebar */}
                    <aside className="w-full md:w-64 flex-shrink-0 space-y-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = pathname.startsWith(tab.href);
                            return (
                                <Link
                                    key={tab.name}
                                    href={tab.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                            ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                                            : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                                    {tab.name}
                                </Link>
                            );
                        })}
                    </aside>

                    {/* Main Content Area */}
                    <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 min-h-[500px]">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
