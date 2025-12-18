"use client";

import Image from "next/image";
import { FileText, Beaker, Users, CheckCircle2 } from "lucide-react";
import TypewriterText from "@/app/components/marketing/TypewriterText";

export default function DocumentsPage() {
    return (
        <div className="py-24 px-6 min-h-screen bg-documents-swirl">
            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 min-h-[60px] drop-shadow-md">
                        <TypewriterText text="Professional documents, sorted." speed={30} cursor />
                    </h1>
                    <p className="text-lg text-slate-200 min-h-[60px] font-medium drop-shadow-sm">
                        <TypewriterText text="Create compliant, industry-standard health and safety documents in minutes. Our templates and AI assistance do the heavy lifting, so you can focus on the job." speed={5} delay={1000} />
                    </p>
                </div>

                <div className="space-y-24">
                    {/* RAMS Section */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1 animate-slide-left opacity-0" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
                            <div className="w-12 h-12 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
                                <FileText className="w-6 h-6 text-red-400" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4">RAMS Packs</h2>
                            <p className="text-slate-300 mb-6 leading-relaxed">
                                Risk Assessments and Method Statements are the core of site safety.
                                Our RAMS builder guides you through defining the job scope, identifying hazards,
                                and outlining the safe method of work.
                            </p>
                            <ul className="space-y-3 text-sm text-slate-300">
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-red-400 shrink-0" />
                                    Job scope summary & project details
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-red-400 shrink-0" />
                                    Comprehensive hazard & control tables
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-red-400 shrink-0" />
                                    Step-by-step method statement
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-red-400 shrink-0" />
                                    PPE and emergency arrangements
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-red-400 shrink-0" />
                                    Operatives and supervisor sign-off areas
                                </li>
                            </ul>
                        </div>
                        <div className="order-1 md:order-2 bg-[#0f172a] border-2 border-slate-800 rounded-2xl p-8 aspect-video flex items-center justify-center shadow-xl relative overflow-hidden group hover:border-slate-700 transition-colors animate-slide-right opacity-0" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
                            {/* Decorative Glow (Reduced) */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-red-500/10 transition-all duration-700"></div>

                            <div className="text-center relative z-10">
                                <div className="relative w-full max-w-[300px] aspect-[3/4] bg-slate-800 border border-slate-700 mx-auto p-4 mb-4 shadow-xl rotate-1 group-hover:rotate-0 transition-transform duration-500">
                                    <div className="w-full h-2 bg-slate-700 mb-2"></div>
                                    <div className="w-2/3 h-2 bg-slate-700 mb-4"></div>
                                    <div className="space-y-2 opacity-50">
                                        <div className="w-full h-1.5 bg-slate-700"></div>
                                        <div className="w-full h-1.5 bg-slate-700"></div>
                                        <div className="w-full h-1.5 bg-slate-700"></div>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500 font-medium group-hover:text-slate-400 transition-colors">RAMS Pack Preview</p>
                            </div>
                        </div>
                    </div>

                    {/* COSHH Section */}
                    <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
                        <div className="md:order-2 animate-slide-right opacity-0" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
                            <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
                                <Beaker className="w-6 h-6 text-blue-400" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4">COSHH Assessments</h2>
                            <p className="text-slate-300 mb-6 leading-relaxed">
                                Control of Substances Hazardous to Health. Quickly generate assessments for
                                any substance you use on site, from adhesives to cleaning agents.
                            </p>
                            <ul className="space-y-3 text-sm text-slate-300">
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                                    Substance information & classification
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                                    Hazards and routes of exposure
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                                    Control measures & PPE
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                                    Storage, disposal & emergency actions
                                </li>
                            </ul>
                        </div>
                        <div className="md:order-1 bg-[#0f172a] border-2 border-slate-800 rounded-2xl p-8 aspect-video flex items-center justify-center shadow-xl relative overflow-hidden group hover:border-slate-700 transition-colors animate-slide-left opacity-0" style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}>
                            {/* Decorative Glow (Reduced) */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/10 transition-all duration-700"></div>

                            <div className="text-center relative z-10">
                                <div className="relative w-full max-w-[300px] aspect-[3/4] bg-slate-800 border border-slate-700 mx-auto p-4 mb-4 shadow-xl -rotate-1 group-hover:rotate-0 transition-transform duration-500">
                                    <div className="w-full h-2 bg-blue-500/20 mb-2"></div>
                                    <div className="w-1/2 h-2 bg-slate-700 mb-4"></div>
                                    <div className="grid grid-cols-2 gap-2 opacity-50">
                                        <div className="h-12 bg-slate-700 rounded"></div>
                                        <div className="h-12 bg-slate-700 rounded"></div>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500 font-medium group-hover:text-slate-400 transition-colors">COSHH Assessment Preview</p>
                            </div>
                        </div>
                    </div>

                    {/* Toolbox Talks Section */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="animate-slide-left opacity-0" style={{ animationDelay: '900ms', animationFillMode: 'forwards' }}>
                            <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
                                <Users className="w-6 h-6 text-green-400" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4">Toolbox Talks</h2>
                            <p className="text-slate-300 mb-6 leading-relaxed">
                                Keep your team safe and compliant with regular safety briefings.
                                Generate topic-specific talks in seconds, complete with attendance registers.
                            </p>
                            <ul className="space-y-3 text-sm text-slate-300">
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                                    Topic overview & target audience
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                                    Key hazards and control measures
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                                    Talking points & discussion questions
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                                    PPE and emergency info
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                                    Built-in attendance sheet
                                </li>
                            </ul>
                        </div>
                        <div className="bg-[#0f172a] border-2 border-slate-800 rounded-2xl p-8 aspect-video flex items-center justify-center shadow-xl relative overflow-hidden group hover:border-slate-700 transition-colors animate-slide-right opacity-0" style={{ animationDelay: '1100ms', animationFillMode: 'forwards' }}>
                            {/* Decorative Glow (Reduced) */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-green-500/10 transition-all duration-700"></div>

                            <div className="text-center relative z-10">
                                <div className="relative w-full max-w-[300px] aspect-[3/4] bg-slate-800 border border-slate-700 mx-auto p-4 mb-4 shadow-xl rotate-1 group-hover:rotate-0 transition-transform duration-500">
                                    <div className="w-full h-2 bg-green-500/20 mb-2"></div>
                                    <div className="space-y-2 mt-4 opacity-50">
                                        <div className="w-full h-1.5 bg-slate-700"></div>
                                        <div className="w-full h-1.5 bg-slate-700"></div>
                                        <div className="w-full h-1.5 bg-slate-700"></div>
                                    </div>
                                    <div className="mt-8 border-t border-slate-700 pt-2 opacity-30">
                                        <div className="w-full h-1.5 bg-slate-700 mb-1"></div>
                                        <div className="w-full h-1.5 bg-slate-700 mb-1"></div>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500 font-medium group-hover:text-slate-400 transition-colors">Toolbox Talk Preview</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
