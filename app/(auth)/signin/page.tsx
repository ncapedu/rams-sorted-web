
"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import TypewriterText from "../../components/marketing/TypewriterText";

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
        <div className="min-h-screen bg-auth-swirl flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
            {/* Card Container - Premium Glass Effect */}
            <div className="w-full max-w-md bg-white/95 backdrop-blur-2xl p-8 sm:p-12 rounded-[2rem] shadow-2xl shadow-blue-900/20 border border-white/60 space-y-8 animate-in fade-in zoom-in-95 duration-700 relative z-10">

                <div className="text-center space-y-6">
                    <Link href="/" className="inline-block hover:scale-105 transition-transform duration-300">
                        <Image
                            src="/rams-logo6.png"
                            alt="RAMS Sorted"
                            width={110}
                            height={110}
                            className="w-28 h-28 mx-auto drop-shadow-xl"
                        />
                    </Link>
                    <div className="min-h-[48px] flex items-end justify-center">
                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                            {greeting && <TypewriterText text={greeting} speed={30} cursor />}
                        </h1>
                    </div>
                    <p className="text-slate-500 font-medium tracking-wide">
                        Enter your details to access your workspace.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full h-14 px-5 rounded-2xl border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all duration-300 placeholder:text-slate-300 bg-slate-50/50 focus:bg-white shadow-sm hover:border-slate-300 font-medium text-lg"
                            placeholder="name@company.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1" htmlFor="password">
                                Password
                            </label>
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full h-14 px-5 rounded-2xl border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all duration-300 bg-slate-50/50 focus:bg-white shadow-sm hover:border-slate-300 font-bold text-lg tracking-widest"
                        />
                    </div>

                    {error && (
                        <div className="p-4 text-sm font-medium text-red-600 bg-red-50 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-2 flex items-center justify-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 bg-slate-900 text-white font-bold text-lg rounded-2xl hover:bg-slate-800 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/20 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98] mt-4"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <div className="pt-4 border-t border-slate-100 flex flex-col gap-4 text-center">
                    <Link
                        href="/pricing"
                        className="w-full py-4 px-6 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-500 hover:text-slate-900 hover:border-slate-900 hover:bg-white transition-all duration-300 active:scale-[0.98] text-sm group"
                    >
                        <span className="group-hover:translate-x-1 inline-block transition-transform duration-300">
                            View Pricing to create an account →
                        </span>
                    </Link>
                </div>
            </div>

            <div className="mt-8 text-white/60 text-xs text-center font-medium animate-in fade-in delay-300 duration-700 tracking-wider">
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
