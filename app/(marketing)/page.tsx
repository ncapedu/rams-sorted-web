"use client";

import Link from "next/link";
import Image from "next/image";
import TypewriterText from "@/app/components/marketing/TypewriterText";
import ProductCarousel from "@/app/components/marketing/ProductCarousel";
import {
    FileText,
    Beaker,
    Users
} from "lucide-react";

export default function MarketingHome() {

    return (
        <div className="flex flex-col pb-0 bg-swirl">
            {/* DARK HERO SECTION */}
            <section className="min-h-[100dvh] w-full bg-transparent flex items-center justify-center relative px-6 py-20 lg:py-4">
                <div className="max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

                    {/* Right Column: Browser Window Showcase (Top on Mobile) */}
                    <div className="order-1 lg:order-2 lg:col-span-7 w-full flex items-center justify-center lg:justify-end animate-slide-up opacity-0" style={{ animationDelay: '0.2s' }}>
                        <ProductCarousel />
                    </div>

                    {/* Left Column: Text & CTA (Bottom on Mobile) */}
                    <div className="order-2 lg:order-1 lg:col-span-5 flex flex-col justify-center gap-8 z-10 text-center lg:text-left">
                        <div className="flex flex-col gap-4">
                            <h1 className="text-5xl md:text-6xl xl:text-8xl font-bold text-white tracking-tighter leading-[1]">
                                <TypewriterText text="Brief it. Draft it. Sorted." speed={40} cursor />
                            </h1>
                            <p className="text-lg xl:text-xl text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                                <TypewriterText text="Generate professional RAMS, COSHH assessments, and Toolbox Talks in minutes." speed={20} delay={1500} />
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-[2500ms] fill-mode-backwards">
                            <Link
                                href="/pricing"
                                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-500 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 active:scale-95"
                            >
                                View pricing
                            </Link>
                            <Link
                                href="/documents"
                                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border-2 border-white/20 px-8 py-4 rounded-xl text-lg font-bold hover:bg-white/20 hover:border-white/30 transition-all hover:scale-105 active:scale-95 shadow-lg backdrop-blur-sm"
                            >
                                View Samples
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURE CARDS */}
            <section className="px-6 py-24 relative bg-transparent">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-3xl font-semibold text-white mb-4">Everything you need to get on site</h2>
                        <p className="text-slate-300">
                            Three core tools designed specifically for UK trades. Create compliant documents in minutes.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* RAMS Card */}
                        <div className="bg-[#0f172a] p-8 rounded-2xl border-2 border-slate-800 hover:border-red-400/50 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 group cursor-default relative overflow-hidden shadow-xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-bl-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="w-12 h-12 bg-red-500/10 rounded-xl border border-red-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10">
                                <FileText className="w-6 h-6 text-red-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-4 relative z-10">RAMS Packs</h3>
                            <ul className="space-y-3 text-sm text-slate-400 font-medium relative z-10">
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    Job scope & project details
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    Risk assessment with hazard matrix
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    Step-by-step method statement
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    Sign-off sheets included
                                </li>
                            </ul>
                        </div>

                        {/* COSHH Card */}
                        <div className="bg-[#0f172a] p-8 rounded-2xl border-2 border-slate-800 hover:border-blue-400/50 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 group cursor-default relative overflow-hidden shadow-xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="w-12 h-12 bg-blue-500/10 rounded-xl border border-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10">
                                <Beaker className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-4 relative z-10">COSHH Assessments</h3>
                            <ul className="space-y-3 text-sm text-slate-400 font-medium relative z-10">
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    Substance hazards & exposure limits
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    First aid & fire fighting measures
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    Handling, storage & disposal
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    PPE requirements
                                </li>
                            </ul>
                        </div>

                        {/* Toolbox Talks Card */}
                        <div className="bg-[#0f172a] p-8 rounded-2xl border-2 border-slate-800 hover:border-green-400/50 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 group cursor-default relative overflow-hidden shadow-xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="w-12 h-12 bg-green-500/10 rounded-xl border border-green-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10">
                                <Users className="w-6 h-6 text-green-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-4 relative z-10">Toolbox Talks</h3>
                            <ul className="space-y-3 text-sm text-slate-400 font-medium relative z-10">
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    Topic overview & key points
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    Specific hazards & controls
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    Discussion questions
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    Attendance register
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* VERSION & VISION SECTION */}
            <section className="px-6 pb-24 relative bg-transparent">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-[#0f172a] border-2 border-slate-800 rounded-3xl p-8 md:p-12 relative overflow-hidden group shadow-2xl">
                        {/* Matte Design - No ambient glow */}

                        <div className="relative z-10 flex flex-col items-center text-center">

                            {/* Version Badge - Clean Matte Design */}
                            <div className="inline-flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-full py-2 px-5 mb-8 animate-slide-up opacity-0 hover:border-slate-500 transition-colors duration-300" style={{ animationDelay: '0.1s' }}>
                                <div className="relative w-6 h-6">
                                    <Image
                                        src="/rams-logo6.png"
                                        alt="RAMS Sorted Logo"
                                        fill
                                        className="object-contain opacity-90"
                                    />
                                </div>
                                <span className="text-sm font-bold text-slate-200 tracking-wide">
                                    Current Version <span className="text-blue-500 font-mono">v1.0</span>
                                </span>
                            </div>

                            {/* Headline */}
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-backwards">
                                This is just the beginning.
                            </h2>

                            {/* Mission Text */}
                            <div className="space-y-6 max-w-2xl text-lg text-slate-300 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-backwards">
                                <p>
                                    RAMS Sorted is on a mission to unify compliance for every trade in the UK.
                                    We believe paperwork shouldn't be a barrier to getting on site—it should be a seamless part of your workflow.
                                </p>
                                <p className="text-slate-400 text-base">
                                    Over the coming months, we're rolling out powerful new features, expanded document types, and smarter tools
                                    designed to save you even more time. We're building the future of trade administration, one update at a time.
                                </p>
                            </div>

                            {/* Decorative Elements */}
                            <div className="grid grid-cols-3 gap-8 mt-12 w-full max-w-lg opacity-50">
                                <div className="h-1 w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full animate-pulse"></div>
                                <div className="h-1 w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full animate-pulse delay-300"></div>
                                <div className="h-1 w-full bg-gradient-to-r from-transparent via-red-500 to-transparent rounded-full animate-pulse delay-700"></div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
