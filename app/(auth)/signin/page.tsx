"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import TypewriterText from "../../components/marketing/TypewriterText";
import { CheckCircle2 } from "lucide-react";

function SignInContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/app";
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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
        <div className="min-h-screen bg-[#f5f4f0] grid lg:grid-cols-2">
            {/* Left: Form */}
            <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-20 xl:px-24 py-12 bg-white relative z-10">
                <div className="w-full max-w-sm mx-auto space-y-8">
                    <div className="space-y-2 rs-fade-slide-in" style={{ animationDelay: "0ms" }}>
                        <Link href="/" className="inline-block mb-4 hover:scale-105 transition-transform duration-300">
                            <Image
                                src="/rams-logo6.png"
                                alt="RAMS Sorted"
                                width={48}
                                height={48}
                                className="w-12 h-12"
                            />
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            Welcome Back
                        </h1>
                        <p className="text-slate-600">
                            Enter your details to access your workspace.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5 rs-fade-slide-in" style={{ animationDelay: "100ms" }}>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-900" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="w-full h-11 px-4 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all placeholder:text-slate-400 bg-white shadow-sm hover:border-slate-300"
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
                                className="w-full h-11 px-4 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all bg-white shadow-sm hover:border-slate-300"
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

                    <p className="text-center text-sm text-slate-600 rs-fade-slide-in" style={{ animationDelay: "200ms" }}>
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="font-medium text-slate-900 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right: Visual */}
            <div className="hidden lg:flex bg-swirl-product relative flex-col justify-center items-center p-12 overflow-hidden">

                {/* Overlay Gradient for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

                {/* Glass Card */}
                <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl max-w-md w-full text-center group hover:bg-white/10 transition-colors duration-500">
                    <div className="mb-6 flex justify-center">
                        <div className="h-16 w-16 bg-gradient-to-br from-red-600 to-red-900 rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/30">
                            <CheckCircle2 className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-4">
                        RAMS Sorted™
                    </h2>

                    <div className="h-20 flex items-center justify-center">
                        <TypewriterText
                            className="text-lg text-slate-300 font-medium"
                            text="Professional RAMS. COSHH Assessments. Toolbox Talks. All sorted."
                            speed={30}
                            delay={500}
                            cursor
                        />
                    </div>

                    {/* Decorative bottom line */}
                    <div className="absolute bottom-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
                </div>

                <div className="absolute bottom-10 text-slate-500 text-xs z-10">
                    © {new Date().getFullYear()} RAMS Sorted. All rights reserved.
                </div>
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
