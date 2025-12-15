
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
            {/* Card Container - Single entry animation */}
            <div className="w-full max-w-md bg-white/90 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/50 space-y-8 animate-in fade-in zoom-in-95 duration-500 relative z-10">

                <div className="text-center space-y-4">
                    <Link href="/" className="inline-block hover:scale-105 transition-transform duration-300">
                        <Image
                            src="/rams-logo6.png"
                            alt="RAMS Sorted"
                            width={100}
                            height={100}
                            className="w-24 h-24 mx-auto drop-shadow-md"
                        />
                    </Link>
                    <div className="min-h-[40px] flex items-end justify-center">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            {greeting && <TypewriterText text={greeting} speed={30} cursor />}
                        </h1>
                    </div>
                    <p className="text-slate-600 font-medium">
                        Enter your details to access your workspace.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all placeholder:text-slate-400 bg-white/80 shadow-sm hover:border-slate-300 font-medium"
                            placeholder="name@company.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-slate-700 ml-1" htmlFor="password">
                                Password
                            </label>
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all bg-white/80 shadow-sm hover:border-slate-300 font-medium"
                        />
                    </div>

                    {error && (
                        <div className="p-4 text-sm font-medium text-red-600 bg-red-50 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98] mt-2"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <div className="pt-2 border-t border-slate-100 flex flex-col gap-4 text-center">
                    <Link
                        href="/pricing"
                        className="w-full py-3 px-4 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md active:scale-[0.98] text-sm"
                    >
                        View Pricing to create an account
                    </Link>
                </div>
            </div>

            <div className="mt-8 text-slate-400 text-xs text-center font-medium animate-in fade-in delay-300 duration-700">
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
