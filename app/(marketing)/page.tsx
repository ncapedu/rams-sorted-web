"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import TypewriterText from "@/app/components/marketing/TypewriterText";
import ProductCarousel from "@/app/components/marketing/ProductCarousel";
import ScrollReveal from "@/app/components/ui/ScrollReveal";
import {
    FileText,
    Beaker,
    Users
} from "lucide-react";

export default function MarketingHome() {
    const [showFeatures, setShowFeatures] = useState(false);
    const [showVersionContent, setShowVersionContent] = useState(false);

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
                    <ScrollReveal>
                        <div className="text-center max-w-5xl mx-auto mb-16 min-h-[160px]">
                            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                                <TypewriterText
                                    text="Everything you need to get on site"
                                    speed={15}
                                    startWhenVisible
                                    cursor={false}
                                />
                            </h2>
                            <p className="text-slate-200 text-xl md:text-2xl leading-relaxed">
                                <TypewriterText
                                    text="Three core tools designed specifically for UK trades. Create compliant documents in minutes."
                                    speed={10}
                                    delay={1000}
                                    startWhenVisible
                                    cursor={false}
                                    onComplete={() => setShowFeatures(true)}
                                />
                            </p>
                        </div>
                    </ScrollReveal>

                    <div className={`grid md:grid-cols-3 gap-8 transition-all duration-1000 ${showFeatures ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        {/* RAMS Card */}
                        <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-3xl border border-white/50 shadow-[inset_0_0_20px_rgba(255,255,255,0.5)] hover:border-white/80 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 group cursor-default relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-red-500/10 to-transparent rounded-bl-full -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="w-14 h-14 bg-white rounded-2xl border border-red-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm relative z-10">
                                <FileText className="w-7 h-7 text-red-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4 relative z-10">RAMS Packs</h3>
                            <ul className="space-y-4 text-slate-700 font-medium relative z-10 text-base">
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-sm" />
                                    Job scope & project details
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-sm" />
                                    Risk assessment with hazard matrix
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-sm" />
                                    Step-by-step method statement
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-sm" />
                                    Sign-off sheets included
                                </li>
                            </ul>
                        </div>

                        {/* COSHH Card */}
                        <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-3xl border border-white/50 shadow-[inset_0_0_20px_rgba(255,255,255,0.5)] hover:border-white/80 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 group cursor-default relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="w-14 h-14 bg-white rounded-2xl border border-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm relative z-10">
                                <Beaker className="w-7 h-7 text-blue-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4 relative z-10">COSHH Assessments</h3>
                            <ul className="space-y-4 text-slate-700 font-medium relative z-10 text-base">
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm" />
                                    Substance hazards & exposure limits
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm" />
                                    First aid & fire fighting measures
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm" />
                                    Handling, storage & disposal
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm" />
                                    PPE requirements
                                </li>
                            </ul>
                        </div>

                        {/* Toolbox Talks Card */}
                        <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-3xl border border-white/50 shadow-[inset_0_0_20px_rgba(255,255,255,0.5)] hover:border-white/80 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 group cursor-default relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-500/10 to-transparent rounded-bl-full -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="w-14 h-14 bg-white rounded-2xl border border-green-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm relative z-10">
                                <Users className="w-7 h-7 text-green-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4 relative z-10">Toolbox Talks</h3>
                            <ul className="space-y-4 text-slate-700 font-medium relative z-10 text-base">
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm" />
                                    Topic overview & key points
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm" />
                                    Specific hazards & controls
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm" />
                                    Discussion questions
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm" />
                                    Attendance register
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* VERSION & VISION SECTION */}
            <section className="px-6 pb-24 relative bg-transparent">
                <ScrollReveal>
                    <div className="max-w-4xl mx-auto">
                        <div className="backdrop-blur-3xl border border-white/50 rounded-3xl p-8 md:p-12 relative overflow-hidden group shadow-[inset_0_0_40px_rgba(255,255,255,0.7)] bg-liquid-glass">

                            {/* Inner Glass Highlight Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent opacity-80 pointer-events-none"></div>

                            <div className="relative z-10 flex flex-col items-center text-center">

                                {/* Version Badge - Slides down first */}
                                <div className="animate-in fade-in slide-in-from-top-4 duration-1000 delay-300 fill-mode-backwards inline-flex items-center gap-3 bg-white/50 backdrop-blur-md border border-white/60 rounded-full py-2 px-5 mb-8 hover:border-white/80 transition-all shadow-sm">
                                    <div className="relative w-6 h-6">
                                        <Image
                                            src="/rams-logo6.png"
                                            alt="RAMS Sorted Logo"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <span className="text-sm font-bold text-black tracking-wide">
                                        Current Version <span className="text-blue-700 font-mono">v1.0</span>
                                    </span>
                                </div>

                                {/* Headline - Types after badge appears */}
                                <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-black mb-6 tracking-tight drop-shadow-sm">
                                    <TypewriterText
                                        text="This Is Just The Beginning."
                                        speed={20}
                                        delay={800} // Start after badge
                                        startWhenVisible
                                        cursor={false}
                                    />
                                </h2>

                                {/* Mission Text - Types after headline */}
                                <div className="space-y-6 max-w-2xl text-lg md:text-xl text-black leading-relaxed font-medium">
                                    <p>
                                        <TypewriterText
                                            text="RAMS Sorted is on a mission to unify compliance for every trade in the UK. We believe paperwork shouldn't be a barrier to get on site."
                                            speed={15}
                                            delay={2500} // Start after headline roughly finishes
                                            startWhenVisible
                                            cursor={false}
                                            onComplete={() => setShowVersionContent(true)}
                                        />
                                    </p>

                                    {/* Secondary Text - Fades in after mission text */}
                                    <p className={`text-slate-900 text-base transition-all duration-1000 transform ${showVersionContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                        Over the coming months, we're rolling out powerful new features, expanded document types, and smarter tools
                                        designed to save you even more time. We're building the future of trade administration, one update at a time.
                                    </p>
                                </div>

                                {/* Decorative Elements - Fade in last */}
                                <div className={`grid grid-cols-3 gap-8 mt-12 w-full max-w-lg opacity-30 transition-all duration-1000 delay-300 ${showVersionContent ? 'opacity-30 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full animate-pulse"></div>
                                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full animate-pulse delay-300"></div>
                                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-red-500 to-transparent rounded-full animate-pulse delay-700"></div>
                                </div>

                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </section>
        </div>
    );
}
