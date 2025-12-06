
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
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
    Download,
    FileText,
    Beaker,
    Users,
    CheckCircle2,
    Zap,
    Lock,
    ChevronRight,
    Plus,
    AlertTriangle
} from "lucide-react";
import TypewriterText from "@/app/components/marketing/TypewriterText";

export default function ProductCarousel() {
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
        }, 5000);

        return () => clearInterval(interval);
    }, [isPaused]);

    return (
        <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
            {/* BROWSER WINDOW (Visuals) */}
            <div
                className="relative w-full aspect-[16/10] bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-700/50 flex flex-col group ring-1 ring-white/5"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Browser Header */}
                <div className="h-6 md:h-10 bg-slate-800 flex items-center px-4 gap-2 border-b border-slate-700/50 shrink-0">
                    <div className="flex gap-1.5 md:gap-2">
                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/80"></div>
                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/80"></div>
                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className="ml-4 flex-1 max-w-md h-4 md:h-6 bg-slate-900/50 rounded-md flex items-center justify-center text-[8px] md:text-[10px] text-slate-500 font-medium font-mono">
                        app.ramssorted.co.uk
                    </div>
                </div>

                {/* Browser Content (Light Background) */}
                <div className="flex-1 bg-[#f9f9f8] relative overflow-hidden flex flex-col">

                    {/* HTML CONTENT (Active for ALL tabs now - Dashboard view recreated below) */}
                    <div className="absolute inset-0 w-[125%] h-[125%] origin-top-left scale-[0.8] flex">
                        {/* SIDEBAR (Recreated from Screenshot) */}
                        <div className="w-64 bg-[#f9f9f8] border-r border-slate-200 flex flex-col flex-shrink-0 hidden md:flex">
                            {/* Logo Area */}
                            <div className="p-4 flex items-center justify-between">
                                <div className="relative w-28 h-8">
                                    <Image
                                        src="/rams-logo6.png"
                                        alt="Logo"
                                        fill
                                        className="object-contain object-left"
                                    />
                                </div>
                                <div className="w-6 h-6 bg-[#c8eee6] rounded flex items-center justify-center text-[#0b2040] cursor-pointer">
                                    <ChevronDown className="w-4 h-4 rotate-90" />
                                </div>
                            </div>

                            {/* RS Hub Button */}
                            <div className="px-3 mb-6">
                                <div className="bg-[#0b2040] text-white rounded-md py-2 px-3 flex items-center gap-3 shadow-sm cursor-pointer hover:bg-slate-800 transition-colors">
                                    <LayoutGrid className="w-4 h-4" />
                                    <span className="text-xs font-bold">RS Hub</span>
                                </div>
                            </div>

                            {/* MY FILES Section */}
                            <div className="px-3 flex-1 overflow-y-auto">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">MY FILES</div>
                                <div className="space-y-0.5">
                                    {[
                                        "PJ-277",
                                        "Y-COSHH-233",
                                        "RAMS-101",
                                        "ToolBox-Talk-3",
                                        "Aynen-Oyle",
                                        "Yapma-Be-Cuz"
                                    ].map((file, i) => (
                                        <div key={i} className="group flex items-center justify-between py-1.5 px-3 rounded hover:bg-slate-100 cursor-pointer transition-colors text-slate-700">
                                            <span className="text-xs font-bold truncate">{file}</span>
                                            <MoreVertical className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer - Account */}
                            <div className="p-3 mt-auto border-t border-slate-200 bg-[#f9f9f8]">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#0b2040] flex items-center justify-center">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs font-bold text-slate-900 truncate">Account</div>
                                        <div className="text-[10px] text-slate-500 truncate">Not signed in</div>
                                    </div>
                                    <Settings className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600" />
                                </div>
                            </div>
                        </div>

                        {/* MAIN CONTENT AREA - SWITCHES BASED ON TAB */}
                        <div className="flex-1 bg-white flex flex-col relative overflow-hidden">

                            {/* --- VIEW 1: DASHBOARD (Recreated in HTML) --- */}
                            <div className={`absolute inset-0 bg-[#ffffff] flex flex-col transition-all duration-500 ease-in-out ${activeTab === 'dashboard' ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0 pointer-events-none'}`}>
                                {/* Main Content - Centered */}
                                <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
                                    {/* Welcome Message */}
                                    <div className="text-center mb-16">
                                        <h1 className="text-4xl font-bold text-[#0b2040] mb-4">
                                            Welcome back<span className="text-red-500 animate-pulse">|</span>
                                        </h1>
                                        <p className="text-slate-400 text-lg">How can we help you today?</p>
                                    </div>

                                    {/* Action Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl px-4">
                                        {/* RAMS Card */}
                                        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-lg transition-shadow cursor-pointer flex flex-col items-center text-center group">
                                            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                                <FileText className="w-8 h-8 text-red-500" />
                                            </div>
                                            <h3 className="font-bold text-slate-900 text-lg mb-3">New RAMS Document</h3>
                                            <p className="text-slate-500 text-sm leading-relaxed">Start a full RAMS pack in guided steps.</p>
                                        </div>

                                        {/* COSHH Card */}
                                        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-lg transition-shadow cursor-pointer flex flex-col items-center text-center group">
                                            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                                <Beaker className="w-8 h-8 text-blue-500" />
                                            </div>
                                            <h3 className="font-bold text-slate-900 text-lg mb-3">New COSHH Assessment</h3>
                                            <p className="text-slate-500 text-sm leading-relaxed">Create a standalone COSHH assessment.</p>
                                        </div>

                                        {/* Toolbox Talk Card */}
                                        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-lg transition-shadow cursor-pointer flex flex-col items-center text-center group">
                                            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                                <Users className="w-8 h-8 text-green-500" />
                                            </div>
                                            <h3 className="font-bold text-slate-900 text-lg mb-3">New Toolbox Talk</h3>
                                            <p className="text-slate-500 text-sm leading-relaxed">Build a ready-to-use toolbox talk.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* --- VIEW 2: WIZARD --- */}
                            <div className={`absolute inset-0 flex flex-col transition-all duration-500 ease-in-out ${activeTab === 'wizard' ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0 pointer-events-none'}`}>
                                <div className="flex-1 flex flex-col">
                                    {/* Wizard Header */}
                                    <div className="px-12 pt-12 pb-6">
                                        <div className="flex items-center gap-2 text-[#0b2040] font-bold text-xl mb-1">
                                            <div className="relative w-6 h-6">
                                                <Image
                                                    src="/rams-logo6.png"
                                                    alt="Logo"
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
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
                            <div className={`absolute inset-0 flex flex-col bg-slate-50 transition-all duration-500 ease-in-out ${activeTab === 'editor' ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0 pointer-events-none'}`}>
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
                                        {/* Formatting Tools (Truncated for brevity in replaced content block) */}
                                        <div className="flex items-center gap-1 text-slate-500 border-l border-slate-200 pl-4">
                                            <div className="p-1 hover:bg-slate-100 rounded"><Bold className="w-4 h-4" /></div>
                                            <div className="p-1 hover:bg-slate-100 rounded"><Italic className="w-4 h-4" /></div>
                                            <div className="p-1 hover:bg-slate-100 rounded"><Underline className="w-4 h-4" /></div>
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
                                        </div>
                                    </div>
                                </div>

                                {/* Document Canvas */}
                                <div className="flex-1 overflow-hidden p-8 flex justify-center">
                                    <div className="w-[800px] bg-white shadow-sm border border-slate-200 min-h-[1000px] p-12">
                                        <h1 className="text-2xl font-bold text-slate-900 text-center uppercase tracking-wide mb-8 border-b-2 border-slate-900 pb-4">
                                            RISK ASSESSMENT & METHOD STATEMENT
                                        </h1>

                                        <div className="mb-8">
                                            <h2 className="text-sm font-bold text-slate-900 uppercase mb-2">1. PROJECT & JOB SCOPE DETAILS</h2>
                                            <div className="border border-slate-900 text-xs">
                                                {/* Table Content (Simplified) */}
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
            </div>

            {/* Carousel Text & Dots - ON DARK BACKGROUND */}
            <div className="flex flex-col items-center gap-4 mt-6 pb-4">
                {/* Text Description */}
                <div className="h-8 text-lg md:text-xl font-bold text-white text-center drop-shadow-md">
                    {activeTab === 'dashboard' && (
                        <TypewriterText key="desc-dash" text="Manage all your projects and documents in one central hub." speed={15} />
                    )}
                    {activeTab === 'wizard' && (
                        <TypewriterText key="desc-wiz" text="Step-by-step guidance ensures you never miss a critical detail." speed={15} />
                    )}
                    {activeTab === 'editor' && (
                        <TypewriterText key="desc-edit" text="Review and customize your documents with a full-featured editor." speed={15} />
                    )}
                </div>

                {/* Dots */}
                <div className="flex justify-center gap-3">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`transition-all duration-300 ${activeTab === 'dashboard' ? 'w-8 bg-white' : 'w-2 bg-slate-500 hover:bg-slate-400'} h-2 rounded-full`}
                    />
                    <button
                        onClick={() => setActiveTab('wizard')}
                        className={`transition-all duration-300 ${activeTab === 'wizard' ? 'w-8 bg-white' : 'w-2 bg-slate-500 hover:bg-slate-400'} h-2 rounded-full`}
                    />
                    <button
                        onClick={() => setActiveTab('editor')}
                        className={`transition-all duration-300 ${activeTab === 'editor' ? 'w-8 bg-white' : 'w-2 bg-slate-500 hover:bg-slate-400'} h-2 rounded-full`}
                    />
                </div>
            </div>
        </div>
    );
}
