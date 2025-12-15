
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
        <div className="min-h-screen bg-auth-swirl flex flex-col justify-center items-center px-4">
            {/* Card Container - Professional & Sharp & Liquid & Floating Entry */}
            <div className="w-full max-w-[400px] glass-card-animated backdrop-blur-xl bg-white/90 border border-white/60 shadow-2xl shadow-blue-900/10 p-8 rounded-2xl space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-700 ease-out relative z-10">

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
                            {greeting && <TypewriterText text={greeting} speed={30} cursor />}
                        </h1>
                    </div>
                    <p className="text-slate-500 text-sm">
                        Enter your details to access your workspace.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-slate-700" htmlFor="password">
                                Password
                            </label>
                            {/* Optional: Forgot password link could go here */}
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full h-11 px-3.5 rounded-lg border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all bg-white shadow-sm hover:border-slate-300 text-sm"
                        />
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
                            "Sign In"
                        )}
                    </button>
                </form>

                <div className="pt-4 border-t border-slate-100 flex justify-center">
                    <Link
                        href="/pricing"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors group"
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
