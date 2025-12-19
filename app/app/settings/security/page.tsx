import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { Shield, Key, Smartphone, LogOut } from "lucide-react";
import { sql } from "@vercel/postgres";

export default async function SecurityPage() {
    const session = await auth();
    if (!session?.user) redirect("/signin");

    // Fetch active sessions
    let sessions: any[] = [];
    try {
        const result = await sql`
            SELECT * FROM sessions 
            WHERE user_id = ${session.user.id} 
            ORDER BY created_at DESC
        `;
        sessions = result.rows;
    } catch (e) {
        console.error(e);
    }

    const twoFactorEnabled = false; // Placeholder until DB column confirmed

    return (
        <div className="space-y-8 max-w-2xl">
            <div>
                <h2 className="text-xl font-semibold text-slate-900">Security</h2>
                <p className="text-sm text-slate-500">Manage your password and security settings.</p>
            </div>

            {/* Password Section */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                            <Key className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900">Password</h3>
                            <p className="text-xs text-slate-500">Last changed recently</p>
                        </div>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-slate-500">Current Password</label>
                            <input type="password" className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-slate-500">New Password</label>
                            <input type="password" className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-slate-500">Confirm New Password</label>
                            <input type="password" className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none" />
                        </div>
                    </div>
                    <div className="pt-2">
                        <button className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">Update Password</button>
                    </div>
                </div>
            </div>

            {/* 2FA Section */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900">Two-Factor Authentication</h3>
                            <p className="text-xs text-slate-500">Add an extra layer of security to your account.</p>
                        </div>
                    </div>
                    <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${twoFactorEnabled ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                        {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </div>
                </div>
                <div className="p-6">
                    <p className="text-sm text-slate-600 mb-4">
                        Protect your account with TOTP (Time-based One-Time Password) apps like Google Authenticator or Authy.
                    </p>
                    <button className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
                        Enable 2FA
                    </button>
                </div>
            </div>

            {/* Sessions */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center">
                            <Smartphone className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900">Active Sessions</h3>
                            <p className="text-xs text-slate-500">Devices currently logged into your account.</p>
                        </div>
                    </div>
                </div>
                <div className="divide-y divide-slate-100">
                    {sessions.length === 0 ? (
                        <div className="p-6 text-sm text-slate-500 text-center">No active sessions found (or database error).</div>
                    ) : (
                        sessions.map(s => (
                            <div key={s.id} className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-slate-100 rounded-lg flex items-center justify-center">
                                        <Smartphone className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-slate-900">
                                            {s.user_agent ? (s.user_agent.includes('Chrome') ? 'Chrome' : s.user_agent.includes('Safari') ? 'Safari' : 'Unknown Device') : 'Unknown Device'}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {new Date(s.created_at).toLocaleDateString()} • {s.ip_address || 'Unknown IP'}
                                        </div>
                                    </div>
                                </div>
                                <button className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Revoke Session">
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
