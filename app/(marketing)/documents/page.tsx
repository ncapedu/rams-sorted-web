"use client";

import Image from "next/image";
import { FileText, Beaker, Users, CheckCircle2 } from "lucide-react";
import TypewriterText from "@/app/components/marketing/TypewriterText";

export default function DocumentsPage() {
    return (
        <div className="py-24 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 min-h-[60px]">
                        <TypewriterText text="Professional documents, sorted." speed={30} cursor />
                    </h1>
                    <p className="text-lg text-slate-600 min-h-[60px]">
                        <TypewriterText text="Create compliant, industry-standard health and safety documents in minutes. Our templates and AI assistance do the heavy lifting, so you can focus on the job." speed={5} delay={1000} />
                    </p>
                </div>

                <div className="space-y-24">
                    {/* RAMS Section */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-6">
                                <FileText className="w-6 h-6 text-red-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">RAMS Packs</h2>
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                Risk Assessments and Method Statements are the core of site safety.
                                Our RAMS builder guides you through defining the job scope, identifying hazards,
                                and outlining the safe method of work.
                            </p>
                            <ul className="space-y-3 text-sm text-slate-700">
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" />
                                    Job scope summary & project details
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" />
                                    Comprehensive hazard & control tables
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" />
                                    Step-by-step method statement
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" />
                                    PPE and emergency arrangements
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" />
                                    Operatives and supervisor sign-off areas
                                </li>
                            </ul>
                        </div>
                        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 aspect-video flex items-center justify-center shadow-sm">
                            <div className="text-center">
                                <div className="relative w-full max-w-[300px] aspect-[3/4] bg-white shadow-lg border border-slate-200 mx-auto p-4 mb-4">
                                    <div className="w-full h-2 bg-slate-100 mb-2"></div>
                                    <div className="w-2/3 h-2 bg-slate-100 mb-4"></div>
                                    <div className="space-y-2">
                                        <div className="w-full h-1.5 bg-slate-50"></div>
                                        <div className="w-full h-1.5 bg-slate-50"></div>
                                        <div className="w-full h-1.5 bg-slate-50"></div>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-400 font-medium">RAMS Document Preview</p>
                            </div>
                        </div>
                    </div>

                    {/* COSHH Section */}
                    <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
                        <div className="md:order-2">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                                <Beaker className="w-6 h-6 text-blue-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">COSHH Assessments</h2>
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                Control of Substances Hazardous to Health. Quickly generate assessments for
                                any substance you use on site, from adhesives to cleaning agents.
                            </p>
                            <ul className="space-y-3 text-sm text-slate-700">
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" />
                                    Substance information & classification
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" />
                                    Hazards and routes of exposure
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" />
                                    Control measures & PPE
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" />
                                    Storage, disposal & emergency actions
                                </li>
                            </ul>
                        </div>
                        <div className="md:order-1 bg-slate-50 rounded-2xl border border-slate-200 p-8 aspect-video flex items-center justify-center shadow-sm">
                            <div className="text-center">
                                <div className="relative w-full max-w-[300px] aspect-[3/4] bg-white shadow-lg border border-slate-200 mx-auto p-4 mb-4">
                                    <div className="w-full h-2 bg-blue-50 mb-2"></div>
                                    <div className="w-1/2 h-2 bg-slate-100 mb-4"></div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="h-12 bg-slate-50 rounded"></div>
                                        <div className="h-12 bg-slate-50 rounded"></div>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-400 font-medium">COSHH Assessment Preview</p>
                            </div>
                        </div>
                    </div>

                    {/* Toolbox Talks Section */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-6">
                                <Users className="w-6 h-6 text-green-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Toolbox Talks</h2>
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                Keep your team safe and compliant with regular safety briefings.
                                Generate topic-specific talks in seconds, complete with attendance registers.
                            </p>
                            <ul className="space-y-3 text-sm text-slate-700">
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" />
                                    Topic overview & target audience
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" />
                                    Key hazards and control measures
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" />
                                    Talking points & discussion questions
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" />
                                    PPE and emergency info
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" />
                                    Built-in attendance sheet
                                </li>
                            </ul>
                        </div>
                        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 aspect-video flex items-center justify-center shadow-sm">
                            <div className="text-center">
                                <div className="relative w-full max-w-[300px] aspect-[3/4] bg-white shadow-lg border border-slate-200 mx-auto p-4 mb-4">
                                    <div className="w-full h-2 bg-green-50 mb-2"></div>
                                    <div className="space-y-2 mt-4">
                                        <div className="w-full h-1.5 bg-slate-50"></div>
                                        <div className="w-full h-1.5 bg-slate-50"></div>
                                        <div className="w-full h-1.5 bg-slate-50"></div>
                                    </div>
                                    <div className="mt-8 border-t border-slate-100 pt-2">
                                        <div className="w-full h-1.5 bg-slate-50 mb-1"></div>
                                        <div className="w-full h-1.5 bg-slate-50 mb-1"></div>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-400 font-medium">Toolbox Talk Preview</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
