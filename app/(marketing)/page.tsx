"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import TypewriterText from "@/app/components/marketing/TypewriterText";
import {
    ArrowRight,
    CheckCircle2,
    FileText,
    Beaker,
    Users,
    LayoutGrid,
    MoreVertical,
    User,
    Settings,
    ArrowLeft,
    Undo,
    Redo,
    Bold,
    Italic,
    Underline,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Printer,
    Search,
    ZoomIn,
    Info,
    ChevronDown,
    Download
} from "lucide-react";

export default function MarketingHome() {
    const [activeTab, setActiveTab] = useState<"dashboard" | "wizard" | "editor">("dashboard");
    const [isPaused, setIsPaused] = useState(false);

    // Auto-play workflow showcase
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setActiveTab((current) => {
                if (current === "dashboard") return "wizard";
                if (current === "wizard") return "editor";
                return "dashboard";
            });
        }, 3500);

        return () => clearInterval(interval);
    }, [isPaused]);

    return (
        <div className="flex flex-col gap-20 pb-20">
            {/* HERO SECTION */}
            <section className="pt-12 md:pt-20 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Left Column: Text */}
                    <div className="flex flex-col gap-6 lg:col-span-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-xs font-semibold w-fit h-7">
                            <TypewriterText text="For UK trades & contractors · RAMS · COSHH · Toolbox Talks" speed={10} />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight leading-[1.1] min-h-[120px]">
                            <TypewriterText text="Generate RAMS, COSHH assessments and toolbox talks in minutes, not hours." speed={50} cursor />
                        </h1>

                        <p className="text-lg text-slate-600 leading-relaxed min-h-[100px]">
                            <TypewriterText text="RAMS Sorted helps UK trades and small contractors produce structured, professional documents without wrestling with Word templates or paying a safety consultant for every job. AI-assisted drafting makes it fast and easy." speed={5} />
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mt-2 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1000 fill-mode-backwards">
                            <Link
                                href="/app"
                                className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-xl text-base font-semibold hover:bg-slate-800 transition-all hover:shadow-lg active:scale-95"
                            >
                                Start 14-day free trial
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
                    <div
                        className="relative lg:col-span-8"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        {/* Carousel Frame */}
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden aspect-[16/9] relative group flex text-left">
                            {/* Scaled Content Wrapper */}
                            <div className="absolute inset-0 w-[125%] h-[125%] origin-top-left scale-[0.8] flex">
                                {/* SIDEBAR (Common Structure) */}
                                <div className="w-64 bg-[#f9f9f8] border-r border-slate-200 flex flex-col flex-shrink-0 hidden md:flex">
                                    {/* Logo Area */}
                                    <div className="p-5 flex items-center justify-between">
                                        <div className="relative w-8 h-8">
                                            <Image
                                                src="/rams-logo6.png"
                                                alt="Logo"
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <div className="w-8 h-8 bg-[#c8eee6] rounded-lg flex items-center justify-center text-[#0b2040]">
                                            <ChevronDown className="w-5 h-5 rotate-90" />
                                        </div>
                                    </div>

                                    {/* RS Hub Button */}
                                    <div className="px-3 mb-6">
                                        <div className={`rounded-lg py-2.5 px-4 flex items-center gap-3 shadow-sm transition-colors ${activeTab === 'dashboard' || activeTab === 'wizard' ? 'bg-[#0b2040] text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
                                            <LayoutGrid className="w-4 h-4" />
                                            <span className="text-sm font-medium">RS Hub</span>
                                        </div>
                                    </div>

                                    {/* My Files List */}
                                    <div className="px-5 flex-1 overflow-y-auto">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">MY FILES</div>
                                        <div className="space-y-1">
                                            {activeTab === 'editor' && (
                                                <div className="flex items-center justify-between py-2 px-3 -mx-3 bg-slate-200/60 rounded-lg group cursor-default">
                                                    <span className="text-sm font-medium text-slate-900">Neo-455</span>
                                                    <MoreVertical className="w-4 h-4 text-slate-500" />
                                                </div>
                                            )}
                                            {[
                                                "PJ-277",
                                                "Y-COSHH-233",
                                                "RAMS-101",
                                                "ToolBox-Talk-3",
                                                "Aynen-Oyle",
                                                "Yapma-Be-Cuz"
                                            ].map((file) => (
                                                <div key={file} className="flex items-center justify-between py-2 group cursor-default">
                                                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{file}</span>
                                                    <MoreVertical className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* User Profile */}
                                    <div className="p-4 border-t border-slate-200 bg-[#f9f9f8]">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#0b2040] flex items-center justify-center text-white">
                                                    <User className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-slate-900">Account</div>
                                                    <div className="text-[10px] text-slate-400">Not signed in</div>
                                                </div>
                                            </div>
                                            <Settings className="w-4 h-4 text-slate-400" />
                                        </div>
                                    </div>
                                </div>

                                {/* MAIN CONTENT AREA - SWITCHES BASED ON TAB */}
                                <div className="flex-1 bg-white flex flex-col relative overflow-hidden">

                                    {/* --- VIEW 1: DASHBOARD --- */}
                                    <div className={`absolute inset-0 flex flex-col transition-all duration-500 ease-in-out ${activeTab === 'dashboard' ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 -translate-x-4 z-0 pointer-events-none'}`}>
                                        <div className="flex-1 flex flex-col items-center justify-center p-12">
                                            <div className="text-center mb-16">
                                                <h1 className="text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                                                    Welcome back<span className="text-red-500 animate-pulse">|</span>
                                                </h1>
                                                <p className="text-xl text-slate-400 font-light">
                                                    How can we help you today?
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-3 gap-6 w-full max-w-4xl">
                                                <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow text-center group cursor-default">
                                                    <div className="w-16 h-16 rounded-full bg-red-50 mx-auto flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                                        <FileText className="w-8 h-8 text-red-500" />
                                                    </div>
                                                    <h3 className="text-lg font-bold text-slate-900 mb-2">New RAMS Document</h3>
                                                    <p className="text-sm text-slate-500 leading-relaxed">Start a full RAMS pack in guided steps.</p>
                                                </div>
                                                <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow text-center group cursor-default">
                                                    <div className="w-16 h-16 rounded-full bg-blue-50 mx-auto flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                                        <Beaker className="w-8 h-8 text-blue-500" />
                                                    </div>
                                                    <h3 className="text-lg font-bold text-slate-900 mb-2">New COSHH Assessment</h3>
                                                    <p className="text-sm text-slate-500 leading-relaxed">Create a standalone COSHH assessment.</p>
                                                </div>
                                                <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow text-center group cursor-default">
                                                    <div className="w-16 h-16 rounded-full bg-green-50 mx-auto flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                                        <Users className="w-8 h-8 text-green-500" />
                                                    </div>
                                                    <h3 className="text-lg font-bold text-slate-900 mb-2">New Toolbox Talk</h3>
                                                    <p className="text-sm text-slate-500 leading-relaxed">Build a ready-to-use toolbox talk.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* --- VIEW 2: WIZARD --- */}
                                    <div className={`absolute inset-0 flex flex-col transition-all duration-500 ease-in-out ${activeTab === 'wizard' ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 translate-x-4 z-0 pointer-events-none'}`}>
                                        <div className="flex-1 flex flex-col">
                                            {/* Wizard Header */}
                                            <div className="px-12 pt-12 pb-6">
                                                <div className="flex items-center gap-2 text-[#0b2040] font-bold text-xl mb-1">
                                                    <div className="w-6 h-6 rounded-full bg-[#0b2040] text-white flex items-center justify-center text-xs">R</div>
                                                    v1.0
                                                </div>
                                                <div className="text-sm font-bold text-slate-900">Step 1 of 5</div>
                                                <div className="h-1.5 w-full bg-slate-100 mt-4 rounded-full overflow-hidden">
                                                    <div className="h-full w-1/5 bg-red-600 rounded-full"></div>
                                                </div>
                                            </div>

                                            {/* Wizard Content */}
                                            <div className="flex-1 overflow-y-auto px-12 pb-12">
                                                <div className="flex items-center gap-4 mb-8">
                                                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                                                        <FileText className="w-5 h-5 text-red-500" />
                                                    </div>
                                                    <h2 className="text-3xl font-bold text-slate-900">Project Details<span className="text-red-500 animate-pulse">|</span></h2>
                                                </div>

                                                <p className="text-xs text-slate-400 mb-6">Fields marked <span className="text-red-500">*</span> are required. Others are optional but help create a more complete RAMS.</p>

                                                <div className="grid grid-cols-2 gap-6 mb-8">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">COMPANY NAME <span className="text-red-500">*</span></label>
                                                        <div className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 shadow-sm">ACME Electrical LTD</div>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">COMPETENT PERSON <span className="text-red-500">*</span></label>
                                                        <div className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 shadow-sm">Dave Smith</div>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">OFFICE ADDRESS <span className="text-red-500">*</span> <Info className="w-3 h-3 text-slate-300" /></label>
                                                        <div className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 shadow-sm">872 New Street Kilmarnock KA23 2XK</div>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">PHONE NUMBER (OPTIONAL)</label>
                                                        <div className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-400 shadow-sm">Contact number for queries</div>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">CONTACT EMAIL (OPTIONAL)</label>
                                                        <div className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 shadow-sm">acme.electrical@amk.com</div>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">PROJECT SUPERVISOR (OPTIONAL)</label>
                                                        <div className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-400 shadow-sm">Overall project supervisor</div>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100">
                                                    <h3 className="text-sm font-bold text-slate-900 mb-4">Project Info</h3>
                                                    <div className="grid grid-cols-2 gap-6">
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">CLIENT NAME <span className="text-red-500">*</span></label>
                                                            <div className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-400 shadow-sm">Who the RAMS are for</div>
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">JOB REF (OPTIONAL)</label>
                                                            <div className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-400 shadow-sm">Internal or client reference</div>
                                                        </div>
                                                        <div className="col-span-2 space-y-1.5">
                                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">SITE ADDRESS <span className="text-red-500">*</span> <Info className="w-3 h-3 text-slate-300" /></label>
                                                            <div className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-400 shadow-sm">Location of works</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* --- VIEW 3: EDITOR --- */}
                                    <div className={`absolute inset-0 flex flex-col bg-slate-50 transition-all duration-500 ease-in-out ${activeTab === 'editor' ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 translate-x-4 z-0 pointer-events-none'}`}>
                                        {/* Toolbar */}
                                        <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium border-r border-slate-200 pr-4">
                                                    <ArrowLeft className="w-4 h-4" />
                                                    Back
                                                </div>
                                                <span className="font-bold text-slate-900 text-sm">Neo-455</span>
                                                <div className="flex items-center gap-1 text-slate-400 border-l border-slate-200 pl-4">
                                                    <Undo className="w-4 h-4 hover:text-slate-600 cursor-pointer" />
                                                    <Redo className="w-4 h-4 hover:text-slate-600 cursor-pointer" />
                                                </div>
                                                <div className="flex items-center gap-1 text-slate-500 border-l border-slate-200 pl-4">
                                                    <div className="p-1 hover:bg-slate-100 rounded"><Bold className="w-4 h-4" /></div>
                                                    <div className="p-1 hover:bg-slate-100 rounded"><Italic className="w-4 h-4" /></div>
                                                    <div className="p-1 hover:bg-slate-100 rounded"><Underline className="w-4 h-4" /></div>
                                                </div>
                                                <div className="flex items-center gap-1 text-slate-500 border-l border-slate-200 pl-4">
                                                    <div className="p-1 hover:bg-slate-100 rounded"><AlignLeft className="w-4 h-4" /></div>
                                                    <div className="p-1 hover:bg-slate-100 rounded"><AlignCenter className="w-4 h-4" /></div>
                                                    <div className="p-1 hover:bg-slate-100 rounded"><AlignRight className="w-4 h-4" /></div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                                                    <div className="p-1.5 bg-white rounded shadow-sm"><LayoutGrid className="w-3.5 h-3.5 text-slate-700" /></div>
                                                    <div className="p-1.5 text-slate-400"><Printer className="w-3.5 h-3.5" /></div>
                                                </div>
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
                                                    <Search className="w-3.5 h-3.5" />
                                                    100%
                                                    <ZoomIn className="w-3.5 h-3.5" />
                                                </div>
                                                <div className="h-4 w-px bg-slate-200 mx-1"></div>
                                                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                                    <FileText className="w-3.5 h-3.5" />
                                                    Word
                                                </button>
                                                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                                    <Download className="w-3.5 h-3.5" />
                                                    PDF
                                                </button>
                                            </div>
                                        </div>

                                        {/* Document Canvas */}
                                        <div className="flex-1 overflow-y-auto p-8 flex justify-center">
                                            <div className="w-[800px] bg-white shadow-sm border border-slate-200 min-h-[1000px] p-12">
                                                <h1 className="text-2xl font-bold text-slate-900 text-center uppercase tracking-wide mb-8 border-b-2 border-slate-900 pb-4">
                                                    RISK ASSESSMENT & METHOD STATEMENT
                                                </h1>

                                                <div className="mb-8">
                                                    <h2 className="text-sm font-bold text-slate-900 uppercase mb-2">1. PROJECT & JOB SCOPE DETAILS</h2>
                                                    <div className="border border-slate-900 text-xs">
                                                        <div className="grid grid-cols-4 border-b border-slate-900">
                                                            <div className="p-2 font-bold bg-slate-50 border-r border-slate-900">Company</div>
                                                            <div className="p-2 border-r border-slate-900">ACME Electrical LTD</div>
                                                            <div className="p-2 font-bold bg-slate-50 border-r border-slate-900">Client</div>
                                                            <div className="p-2">NEO LTD</div>
                                                        </div>
                                                        <div className="grid grid-cols-4 border-b border-slate-900">
                                                            <div className="p-2 font-bold bg-slate-50 border-r border-slate-900">Site Address</div>
                                                            <div className="col-span-3 p-2">80 High Street North West London NW08 5QK</div>
                                                        </div>
                                                        <div className="grid grid-cols-4 border-b border-slate-900">
                                                            <div className="p-2 font-bold bg-slate-50 border-r border-slate-900">Job / Task</div>
                                                            <div className="p-2 border-r border-slate-900">Electrician - Full House Rewire</div>
                                                            <div className="p-2 font-bold bg-slate-50 border-r border-slate-900">Project Ref</div>
                                                            <div className="p-2">NEO-455</div>
                                                        </div>
                                                        <div className="grid grid-cols-4">
                                                            <div className="p-2 font-bold bg-slate-50 border-r border-slate-900">Prepared By</div>
                                                            <div className="p-2 border-r border-slate-900">Dave Smith</div>
                                                            <div className="p-2 font-bold bg-slate-50 border-r border-slate-900">Date</div>
                                                            <div className="p-2">2025-12-04</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h2 className="text-sm font-bold text-slate-900 uppercase mb-2">2. SCOPE OF WORKS</h2>
                                                    <div className="text-xs text-slate-700 space-y-4 leading-relaxed text-justify">
                                                        <p>
                                                            This Site-Specific Risk Assessment & Method Statement (RAMS) pertains to the full house rewire project at 80 High Street, North West London, NW08 5QK, commissioned by NEO LTD. The scope involves the comprehensive replacement of existing electrical wiring to meet current standards. This task requires the removal of obsolete cables, installation of new wiring routes through structural elements, and fitting of new electrical accessories. The project will be executed in phases to minimize disruption to occupants and ensure seamless coordination with concurrent trades.
                                                        </p>
                                                        <p>
                                                            Key hazards identified include exposure to live electricity, manual handling risks, dust and fumes, potential slips and trips, asbestos presence, demolition works, and tasks conducted near water sources. Mitigation measures will include isolating electrical circuits, employing safe manual handling techniques, utilizing dust control systems, and ensuring clear site pathways. Asbestos surveys will be conducted prior to any disturbance, and appropriate PPE will be used based on specific task requirements. Comprehensive testing will be conducted post-installation to verify the safety, continuity, and performance of protective devices. This RAMS document outlines the procedural controls and safety measures necessary to manage these risks effectively, ensuring compliance with health and safety regulations.
                                                        </p>
                                                        <h3 className="font-bold text-slate-900 uppercase pt-2">ACCESS EGRESS</h3>
                                                        <p>
                                                            Access and egress for the full house rewire at 80 High Street North West London NW08 5QK must be meticulously planned to ensure safe entry and exit for all personnel and materials.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Carousel Indicators */}
                        <div className="flex justify-center gap-2 mt-4">
                            <button
                                onClick={() => setActiveTab('dashboard')}
                                className={`w-2 h-2 rounded-full transition-colors ${activeTab === 'dashboard' ? 'bg-slate-800' : 'bg-slate-300'}`}
                            />
                            <button
                                onClick={() => setActiveTab('wizard')}
                                className={`w-2 h-2 rounded-full transition-colors ${activeTab === 'wizard' ? 'bg-slate-800' : 'bg-slate-300'}`}
                            />
                            <button
                                onClick={() => setActiveTab('editor')}
                                className={`w-2 h-2 rounded-full transition-colors ${activeTab === 'editor' ? 'bg-slate-800' : 'bg-slate-300'}`}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* TRUST BADGES */}
            <section className="border-y border-slate-100 bg-slate-50/50 py-8">
                <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-8 md:gap-16 text-sm font-medium text-slate-500">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-slate-400" />
                        Designed for UK trades
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-slate-400" />
                        RAMS · COSHH · Toolbox talks
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-slate-400" />
                        Export to Word & PDF
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
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-200 transition-colors">
                            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-6">
                                <FileText className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-4">RAMS Packs</h3>
                            <ul className="space-y-3 text-sm text-slate-600">
                                <li className="flex gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                    Job scope & project details
                                </li>
                                <li className="flex gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                    Risk assessment with hazard matrix
                                </li>
                                <li className="flex gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                    Step-by-step method statement
                                </li>
                                <li className="flex gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                    Sign-off sheets included
                                </li>
                            </ul>
                        </div>

                        {/* COSHH Card */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-200 transition-colors">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                                <Beaker className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-4">COSHH Assessments</h3>
                            <ul className="space-y-3 text-sm text-slate-600">
                                <li className="flex gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                    Substance hazards & exposure limits
                                </li>
                                <li className="flex gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                    First aid & fire fighting measures
                                </li>
                                <li className="flex gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                    Handling, storage & disposal
                                </li>
                                <li className="flex gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                    PPE requirements
                                </li>
                            </ul>
                        </div>

                        {/* Toolbox Talks Card */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-200 transition-colors">
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-6">
                                <Users className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-4">Toolbox Talks</h3>
                            <ul className="space-y-3 text-sm text-slate-600">
                                <li className="flex gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                    Topic overview & key points
                                </li>
                                <li className="flex gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                    Specific hazards & controls
                                </li>
                                <li className="flex gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                    Discussion questions
                                </li>
                                <li className="flex gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
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
