"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import TypewriterText from "../../components/marketing/TypewriterText";
import { ArrowRight, Check, X } from "lucide-react";

// Password strength utils
const requirements = [
    { re: /.{8,}/, label: "Min 8 characters" },
    { re: /[0-9]/, label: "Includes number" },
    { re: /[a-z]/, label: "Lowercase letter" },
    { re: /[A-Z]/, label: "Uppercase letter" },
];

function SignUpContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const plan = searchParams.get("plan");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Form state
    const [password, setPassword] = useState("");

    const strength = requirements.map(r => r.re.test(password));
    const isStrong = strength.every(Boolean);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const username = formData.get("username") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        if (!isStrong) {
            setError("Please meet all password requirements.");
            setLoading(false);
            return;
        }

        try {
            // 1. Create User
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, username, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to register.");
            }

            // 2. Auto Login
            const loginRes = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (loginRes?.error) {
                router.push("/signin");
            } else {
                router.push("/app");
                router.refresh();
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-auth-swirl flex flex-col justify-center items-center px-4 py-8">
            {/* Card Container */}
            <div className="w-full max-w-[450px] glass-card-animated backdrop-blur-xl bg-white/90 border border-white/60 shadow-2xl shadow-blue-900/10 p-8 rounded-2xl space-y-6 animate-float-up relative z-10">

                <div className="text-center space-y-4">
                    <Link href="/" className="inline-block hover:scale-105 transition-transform duration-300">
                        <Image
                            src="/rams-logo6.png"
                            alt="RAMS Sorted"
                            width={80}
                            height={80}
                            className="w-20 h-20 mx-auto drop-shadow-md"
                        />
                    </Link>
                    <div className="min-h-[36px] flex items-end justify-center">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            <TypewriterText text="Create Your Account" speed={30} cursor />
                        </h1>
                    </div>
                    <p className="text-slate-500 text-sm">
                        {plan === 'yearly' ? 'Start your 14-day free trial on the Yearly plan.' : 'Start creating RAMS in minutes. No credit card required.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700" htmlFor="username">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                minLength={3}
                                className="w-full h-11 px-3.5 rounded-lg border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-400 bg-white shadow-sm hover:border-slate-300 text-sm"
                                placeholder="johndoe"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="w-full h-11 px-3.5 rounded-lg border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-400 bg-white shadow-sm hover:border-slate-300 text-sm"
                                placeholder="name@company.com"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-11 px-3.5 rounded-lg border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all bg-white shadow-sm hover:border-slate-300 text-sm"
                            />
                            {/* Password Strength Meter */}
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {requirements.map((req, i) => (
                                    <div key={i} className={`flex items-center gap-1.5 text-[10px] sm:text-xs font-medium transition-colors ${strength[i] ? 'text-green-600' : 'text-slate-400'}`}>
                                        {strength[i] ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-slate-300" />}
                                        {req.label}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700" htmlFor="confirmPassword">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                className="w-full h-11 px-3.5 rounded-lg border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all bg-white shadow-sm hover:border-slate-300 text-sm"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 text-sm font-medium text-red-600 bg-red-50 rounded-lg border border-red-100 flex items-center justify-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-11 bg-slate-900 text-white font-semibold text-sm rounded-lg hover:bg-slate-800 transition-all hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98] mt-2"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            "Start Free Trial"
                        )}
                    </button>
                </form>

                <div className="pt-4 border-t border-slate-100 flex justify-center">
                    <Link
                        href="/signin"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors group"
                    >
                        Already have an account? Sign in
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
            </div>

            <div className="mt-8 text-white/50 text-[10px] text-center font-medium animate-in fade-in delay-300 duration-700 tracking-wide uppercase">
                © {new Date().getFullYear()} RAMS Sorted. All rights reserved.
            </div>
        </div>
    );
}

export default function SignUpPage() {
    return (
        <Suspense fallback={<div />}>
            <SignUpContent />
        </Suspense>
    );
}
