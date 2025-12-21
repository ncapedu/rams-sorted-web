
"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import TypewriterText from "../../components/marketing/TypewriterText";
import { ArrowRight } from "lucide-react";

const GREETINGS = [
    "Welcome Back",
    "Hello There",
    "Glad To See You",
    "Good To Have You Here",
    "Nice To See You Again",
    "Let’s Get Things Moving",
    "Ready To Get Started?",
    "We’re Glad You’re Here",
    "Hope You’re Doing Well",
    "Let’s Get To Work",
];

function SignInContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/app";
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [greeting, setGreeting] = useState("");

    useEffect(() => {
        setGreeting(GREETINGS[Math.floor(Math.random() * GREETINGS.length)]);
    }, []);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("Invalid email or password.");
                setLoading(false);
            } else {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-swirl flex flex-col justify-center items-center px-4">
            {/* Card Container - Professional & Sharp & Liquid & Floating Entry */}
            {/* Card Container - Matte Dark & Sharp & Liquid & Floating Entry */}
            <div className="w-full max-w-[420px] bg-[#0f172a] border border-slate-700 shadow-2xl shadow-black/50 p-10 rounded-3xl space-y-8 animate-float-up relative z-10">

                <div className="text-center space-y-4">
                    <Link href="/" className="inline-block hover:scale-105 transition-transform duration-300">
                        <Image
                            src="/rams-logo6.png"
                            alt="RAMS Sorted"
                            width={90}
                            height={90}
                            className="w-24 h-24 mx-auto drop-shadow-lg"
                        />
                    </Link>
                    <div className="min-h-[36px] flex items-end justify-center">
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            {greeting && <TypewriterText text={greeting} speed={30} cursor />}
                        </h1>
                    </div>
                    <p className="text-slate-400 text-base font-medium">
                        Enter your details to access your workspace.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-300 ml-1" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full h-12 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm hover:border-slate-600 text-base"
                            placeholder="name@company.com"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-slate-300 ml-1" htmlFor="password">
                                Password
                            </label>
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full h-12 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm hover:border-slate-600 text-base"
                        />
                    </div>

                    {error && (
                        <div className="p-4 text-sm font-medium text-red-600 bg-red-50 rounded-xl border border-red-100 flex items-center justify-center animate-in fade-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-blue-600 text-white font-bold text-base rounded-xl hover:bg-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98] mt-2"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <div className="pt-4 border-t border-slate-800 flex justify-center">
                    <Link
                        href="/pricing"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-blue-400 transition-colors group"
                    >
                        View Pricing to create an account
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

export default function SignInPage() {
    return (
        <Suspense fallback={<div />}>
            <SignInContent />
        </Suspense>
    );
}
