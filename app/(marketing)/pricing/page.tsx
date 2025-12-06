"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Sparkles } from "lucide-react";
import TypewriterText from "@/app/components/marketing/TypewriterText";


export default function PricingPage() {
    return (
        <div className="py-6 md:py-8 px-6">
            <div className="max-w-7xl mx-auto text-center">
                <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 min-h-[50px]">
                    <TypewriterText text="Simple, transparent pricing" speed={30} cursor />
                </h1>
                <p className="text-base text-slate-600 mb-6 max-w-2xl mx-auto min-h-[25px]">
                    <TypewriterText text="No hidden fees. No long-term contracts. Cancel anytime." speed={5} delay={1000} />
                </p>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Monthly Plan */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-500 flex flex-col group relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-backwards">
                        {/* Logo Blend Effect */}
                        <div className="absolute -bottom-12 -right-12 opacity-5 translate-y-8 translate-x-8 transition-transform duration-700 group-hover:translate-y-0 group-hover:translate-x-0 group-hover:scale-110 pointer-events-none">
                            <Image
                                src="/rams-logo6.png"
                                alt="Logo"
                                width={300}
                                height={300}
                                className="object-contain"
                            />
                        </div>

                        <div className="text-left mb-6 relative z-10">
                            <h3 className="text-lg font-bold text-slate-900 mb-1">Monthly</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-slate-900">£19.99</span>
                                <span className="text-slate-500 text-sm">/month</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Flexible, pay as you go.</p>
                        </div>

                        <ul className="space-y-3 mb-6 text-left flex-1 relative z-10">
                            <li className="flex items-center gap-2 text-slate-700 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" />
                                <span>Unlimited RAMS documents</span>
                            </li>
                            <li className="flex items-center gap-2 text-slate-700 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" />
                                <span>Unlimited COSHH assessments</span>
                            </li>
                            <li className="flex items-center gap-2 text-slate-700 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" />
                                <span>Unlimited Toolbox Talks</span>
                            </li>
                            <li className="flex items-center gap-2 text-slate-700 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" />
                                <span>Word & PDF exports</span>
                            </li>
                            <li className="flex items-center gap-2 text-slate-700 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" />
                                <span>Access from any device</span>
                            </li>
                        </ul>

                        <Link
                            href="/app"
                            className="block w-full py-3 bg-white border-2 border-slate-900 text-slate-900 rounded-xl font-bold hover:bg-slate-50 transition-all active:scale-95 text-center relative z-10 text-sm"
                        >
                            Start 14-day free trial
                        </Link>
                    </div>

                    {/* Yearly Plan */}
                    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-900 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col relative overflow-hidden group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-backwards">
                        {/* Sun Accent */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

                        {/* Logo Blend Effect */}
                        <div className="absolute -bottom-12 -right-12 opacity-10 translate-y-8 translate-x-8 transition-transform duration-700 group-hover:translate-y-0 group-hover:translate-x-0 group-hover:scale-110 pointer-events-none grayscale invert">
                            <Image
                                src="/rams-logo6.png"
                                alt="Logo"
                                width={300}
                                height={300}
                                className="object-contain"
                            />
                        </div>

                        <div className="absolute top-6 right-6 z-20">
                            <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 backdrop-blur-sm">
                                <Sparkles className="w-3 h-3" />
                                BEST VALUE
                            </span>
                        </div>

                        <div className="text-left mb-6 relative z-10">
                            <h3 className="text-lg font-bold text-white mb-1">Yearly</h3>
                            <div className="flex items-baseline gap-1 text-white">
                                <span className="text-3xl font-bold">£149</span>
                                <span className="text-slate-400 text-sm">/year</span>
                            </div>
                            <p className="text-xs text-emerald-400 mt-1 font-medium">Save over £90 per year</p>
                        </div>

                        <ul className="space-y-3 mb-6 text-left flex-1 relative z-10">
                            <li className="flex items-center gap-2 text-slate-300 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>Everything in Monthly</span>
                            </li>
                            <li className="flex items-center gap-2 text-slate-300 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>4 months free vs monthly</span>
                            </li>
                            <li className="flex items-center gap-2 text-slate-300 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>Unlimited access</span>
                            </li>
                            <li className="flex items-center gap-2 text-slate-300 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>Word & PDF exports</span>
                            </li>
                        </ul>

                        <Link
                            href="/app"
                            className="block w-full py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-lg shadow-white/10 active:scale-95 text-center relative z-10 text-sm"
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
