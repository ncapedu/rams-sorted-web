
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
    const [greeting, setGreeting] = useState("Welcome Back");

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
            <div className="w-full max-w-md bg-white/90 backdrop-blur-sm p-8 sm:p-10 rounded-2xl shadow-xl border border-white/50 space-y-8 rs-fade-slide-in relative z-10" style={{ animationDelay: "0ms" }}>

                <div className="text-center space-y-4">
                    <Link href="/" className="inline-block hover:scale-105 transition-transform duration-300">
                        <Image
                            src="/rams-logo6.png"
                            alt="RAMS Sorted"
                            width={80}
                            height={80}
                            className="w-20 h-20 mx-auto drop-shadow-sm"
                        />
                    </Link>
                    <div className="min-h-[40px] flex items-end justify-center">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            <TypewriterText text={greeting} speed={30} cursor />
                        </h1>
                    </div>
                    <p className="text-slate-600">
                        Enter your details to access your workspace.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 rs-fade-slide-in" style={{ animationDelay: "150ms" }}>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-900" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full h-11 px-4 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all placeholder:text-slate-400 bg-white/80 shadow-sm hover:border-slate-300"
                            placeholder="name@company.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-slate-900" htmlFor="password">
                                Password
                            </label>
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full h-11 px-4 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all bg-white/80 shadow-sm hover:border-slate-300"
                        />
                    </div>

                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-11 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-all hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            "Sign in"
                        )}
                    </button>
                </form>

                <div className="text-center text-sm rs-fade-slide-in" style={{ animationDelay: "300ms" }}>
                    <Link href="/pricing" className="font-medium text-slate-600 hover:text-slate-900 hover:underline transition-colors">
                        View Pricing to create an account
                    </Link>
                </div>
            </div>

            <div className="mt-8 text-slate-500 text-xs text-center rs-fade-slide-in" style={{ animationDelay: "400ms" }}>
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
