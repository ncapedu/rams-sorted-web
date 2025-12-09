"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function SignUpPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;


        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            setLoading(false);
            return;
        }

        try {
            // 1. Create User
            // We need an API route to create the user since NextAuth doesn't do sign-up automatically with credentials
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
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
                // Should not happen if registration worked, but handle it
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
                            Create account
                        </h1>
                        <p className="text-slate-600">
                            Start creating RAMS in minutes. No credit card required.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
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
                            <label className="text-sm font-medium text-slate-900" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={8}
                                className="w-full h-11 px-4 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all bg-white shadow-sm hover:border-slate-300"
                                placeholder="Min 8 characters"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-900" htmlFor="confirmPassword">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                minLength={8}
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
                            className="w-full h-11 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-all hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                "Get started free"
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-600">
                        Already have an account?{" "}
                        <Link href="/signin" className="font-medium text-slate-900 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right: Visual */}
            <div className="hidden lg:flex bg-[#f5f4f0] relative flex-col justify-center items-center p-12 overflow-hidden">
                <div className="flex flex-col gap-6 max-w-lg">
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900">Professional RAMS</h3>
                                <p className="text-sm text-slate-500">Generated in seconds</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-2 w-full bg-slate-100 rounded" />
                            <div className="h-2 w-full bg-slate-100 rounded" />
                            <div className="h-2 w-2/3 bg-slate-100 rounded" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 translate-x-12">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900">COSHH Included</h3>
                                <p className="text-sm text-slate-500">Compliant & Safe</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-2 w-full bg-slate-100 rounded" />
                            <div className="h-2 w-5/6 bg-slate-100 rounded" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
