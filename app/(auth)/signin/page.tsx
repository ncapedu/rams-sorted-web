"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function SignInPage() {
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
            <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-20 xl:px-24 py-12 bg-white">
                <div className="w-full max-w-sm mx-auto space-y-8">
                    <div className="space-y-2">
                        <Link href="/" className="inline-block mb-4">
                            <Image
                                src="/rams-logo6.png"
                                alt="RAMS Sorted"
                                width={48}
                                height={48}
                                className="w-12 h-12"
                            />
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            Welcome back
                        </h1>
                        <p className="text-slate-600">
                            Enter your details to access your workspace.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
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
                            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-all hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-600">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="font-medium text-slate-900 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right: Visual */}
            <div className="hidden lg:flex bg-slate-50 relative flex-col justify-center items-center p-12 overflow-hidden">
                <div className="flex items-center gap-3 mb-8 relative z-10">
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-emerald-600">
                        RAMS Sorted™
                    </span>
                </div>
                <div className="relative w-full max-w-lg aspect-[4/3] rounded-xl shadow-2xl overflow-hidden border border-slate-200/50 bg-white">
                    <div className="absolute inset-0 bg-slate-100/50" />
                    {/* Abstract UI representation */}
                    <div className="absolute top-6 left-6 right-6 bottom-0 bg-white rounded-t-lg shadow-inner border border-slate-200 p-6">
                        <div className="h-4 w-1/3 bg-slate-100 rounded mb-6" />
                        <div className="space-y-3">
                            <div className="h-2 w-full bg-slate-50 rounded" />
                            <div className="h-2 w-5/6 bg-slate-50 rounded" />
                            <div className="h-2 w-4/6 bg-slate-50 rounded" />
                        </div>
                    </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-teal-100/40 to-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
            </div>
        </div>
    );
}
