"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Sparkles } from "lucide-react";
import TypewriterText from "@/app/components/marketing/TypewriterText";


export default function PricingPage() {
    return (
        <div className="min-h-screen py-12 md:py-24 px-6 bg-pricing-swirl">
            <div className="max-w-7xl mx-auto text-center">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 min-h-[50px] drop-shadow-md">
                    <TypewriterText text="Simple, transparent pricing" speed={30} cursor />
                </h1>
                <p className="text-base text-slate-200 mb-6 max-w-2xl mx-auto min-h-[25px] font-medium drop-shadow-sm">
                    <TypewriterText text="No hidden fees. No long-term contracts. Cancel anytime." speed={5} delay={1000} />
                </p>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto overflow-hidden p-4">
                    {/* Monthly Plan - Slide In From Left */}
                    <div className="bg-[#0f172a] rounded-2xl p-6 border-2 border-slate-800 shadow-xl hover:border-slate-700 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex flex-col group relative overflow-hidden animate-slide-left opacity-0" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
                        {/* Logo Blend Effect (Matte Style) - Increased Opacity */}
                        <div className="absolute -bottom-12 -right-12 opacity-10 translate-y-8 translate-x-8 transition-transform duration-700 group-hover:translate-y-0 group-hover:translate-x-0 group-hover:scale-110 pointer-events-none group-hover:opacity-20">
                            <Image
                                src="/rams-logo6.png"
                                alt="Logo"
                                width={300}
                                height={300}
                                className="object-contain inverted-logo-brightness"
                            />
                        </div>

                        <div className="text-left mb-6 relative z-10">
                            <h3 className="text-lg font-bold text-white mb-1">Monthly</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-white">£19</span>
                                <span className="text-slate-400 text-sm">/month</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 font-medium">Flexible, cancel anytime.</p>
                        </div>

                        <ul className="space-y-3 mb-6 text-left flex-1 relative z-10">
                            <li className="flex items-start gap-2 text-slate-300 text-sm font-medium">
                                <CheckCircle2 className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                                <span>High-volume RAMS packs <span className="text-slate-500 text-xs block font-normal">(fair-use limits, no per-pack fees)</span></span>
                            </li>
                            <li className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                                <CheckCircle2 className="w-4 h-4 text-slate-500 shrink-0" />
                                <span>High-volume COSHH assessments</span>
                            </li>
                            <li className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                                <CheckCircle2 className="w-4 h-4 text-slate-500 shrink-0" />
                                <span>High-volume Toolbox Talks</span>
                            </li>
                            <li className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                                <CheckCircle2 className="w-4 h-4 text-slate-500 shrink-0" />
                                <span>Word & PDF exports</span>
                            </li>
                            <li className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                                <CheckCircle2 className="w-4 h-4 text-slate-500 shrink-0" />
                                <span>Secure access from any device</span>
                            </li>
                        </ul>

                        <Link
                            href="/signup?plan=monthly"
                            className="block w-full py-3 bg-slate-800 text-white border-2 border-slate-700 rounded-xl font-bold hover:bg-slate-700 hover:border-slate-600 hover:scale-105 hover:shadow-xl transition-all duration-300 active:scale-95 text-center relative z-10 text-sm"
                        >
                            Start 14-day free trial
                        </Link>
                    </div>

                    {/* Yearly Plan - Slide In From Right */}
                    <div className="bg-[#0f172a] rounded-2xl p-6 border-2 border-blue-600 shadow-2xl hover:border-blue-500 hover:shadow-blue-900/20 hover:scale-[1.02] transition-all duration-300 flex flex-col relative overflow-hidden group animate-slide-right opacity-0" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
                        {/* Matte Accent */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-bl-full pointer-events-none group-hover:bg-blue-600/20 transition-colors"></div>

                        {/* Logo Blend Effect - Increased Opacity */}
                        <div className="absolute -bottom-12 -right-12 opacity-15 translate-y-8 translate-x-8 transition-transform duration-700 group-hover:translate-y-0 group-hover:translate-x-0 group-hover:scale-110 pointer-events-none grayscale invert group-hover:opacity-25">
                            <Image
                                src="/rams-logo6.png"
                                alt="Logo"
                                width={300}
                                height={300}
                                className="object-contain"
                            />
                        </div>

                        <div className="absolute top-6 right-6 z-20">
                            <span className="inline-flex items-center gap-1 bg-blue-600/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-500/30">
                                <Sparkles className="w-3 h-3" />
                                BEST VALUE
                            </span>
                        </div>

                        <div className="text-left mb-6 relative z-10">
                            <h3 className="text-lg font-bold text-white mb-1">Yearly</h3>
                            <div className="flex items-baseline gap-1 text-white">
                                <span className="text-3xl font-bold">£169</span>
                                <span className="text-slate-400 text-sm">/year</span>
                            </div>
                            <p className="text-xs text-blue-400 mt-1 font-bold">Save over £55 per year (3 months free vs monthly)</p>
                        </div>

                        <ul className="space-y-3 mb-6 text-left flex-1 relative z-10">
                            <li className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                                <span>Everything in Monthly</span>
                            </li>
                            <li className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                                <span>3 months free vs paying monthly</span>
                            </li>
                            <li className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                                <span>Higher fair-use limits for heavy users</span>
                            </li>
                            <li className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                                <span>Word & PDF exports</span>
                            </li>
                        </ul>

                        <Link
                            href="/signup?plan=yearly"
                            className="block w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 active:scale-95 text-center relative z-10 text-sm"
                        >
                            Start 14-day free trial
                        </Link>
                    </div>
                </div>

                <p className="text-xs text-slate-400 mt-8 opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-forwards">
                    Prices exclude VAT. 14-day free trial requires card details. Cancel anytime.
                </p>
            </div>
        </div>
    );
}
