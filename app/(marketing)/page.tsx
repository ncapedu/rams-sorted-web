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
        <div className="flex flex-col gap-20 pb-20">
            {/* HERO SECTION */}
            <section className="pt-4 md:pt-8 px-6 min-h-[calc(100vh-80px)] flex flex-col justify-center">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    {/* Left Column: Text */}
                    <div className="flex flex-col gap-3 lg:col-span-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-xs font-semibold w-fit h-7">
                            <TypewriterText text="For UK trades & contractors · RAMS · COSHH · Toolbox Talks" speed={10} />
                        </div>

                        <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight leading-[1.1] min-h-[90px]">
                            <TypewriterText text="Generate RAMS, COSHH assessments and toolbox talks in minutes, not hours." speed={30} cursor />
                        </h1>

                        <p className="text-base text-slate-600 leading-relaxed min-h-[72px]">
                            <TypewriterText text="RAMS Sorted helps UK trades and small contractors produce structured, professional documents without wrestling with Word templates or paying a safety consultant for every job. AI-assisted drafting makes it fast and easy." speed={5} />
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mt-2 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1000 fill-mode-backwards">
                            <Link
                                href="/pricing"
                                className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-xl text-base font-semibold hover:bg-slate-800 transition-all hover:shadow-lg active:scale-95"
                            >
                                View our pricing
                            </Link>
                            <Link
                                href="/documents"
                                className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-6 py-3.5 rounded-xl text-base font-semibold hover:bg-slate-50 transition-colors"
                            >
                                View sample documents
                            </Link>
                        </div>

                        <p className="text-xs text-slate-500 font-medium h-4">
                            <TypewriterText text="Card required · then £20/month or £149/year" speed={10} />
                        </p>
                    </div>

                    {/* Right Column: Carousel */}
                    <div className="lg:col-span-8">
                        <ProductCarousel />
                    </div>
                </div>
            </section>

            {/* FEATURE CARDS */}
            <section className="px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-3xl font-semibold text-slate-900 mb-4">Everything you need to get on site</h2>
                        <p className="text-slate-600">
                            Three core tools designed specifically for UK trades. Create compliant documents in minutes.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* RAMS Card */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-red-400 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 group cursor-default relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10">
                                <FileText className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-4 relative z-10">RAMS Packs</h3>
                            <ul className="space-y-3 text-sm text-slate-600 relative z-10">
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
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 group cursor-default relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10">
                                <Beaker className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-4 relative z-10">COSHH Assessments</h3>
                            <ul className="space-y-3 text-sm text-slate-600 relative z-10">
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
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-green-400 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 group cursor-default relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10">
                                <Users className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-4 relative z-10">Toolbox Talks</h3>
                            <ul className="space-y-3 text-sm text-slate-600 relative z-10">
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
        </div>
    );
}
