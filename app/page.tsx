"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
    ArrowRight,
    CheckCircle2,
    FileText,
    Beaker,
    Users,
    Menu,
    X,
    Download,
    ChevronDown,
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
    ChevronRight,
} from "lucide-react";

export default function LandingPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"dashboard" | "wizard" | "editor">("dashboard");
    const [isPaused, setIsPaused] = useState(false);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

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

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-[#f5f4f0] font-sans text-slate-900 selection:bg-[#c8eee6] selection:text-[#0b2040]">

            {/* 1. TOP NAVIGATION */}
            <header className="sticky top-0 z-50 bg-[#f5f4f0]/90 backdrop-blur-md border-b border-black/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    {/* Logo + Wordmark */}
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-105">
                            <Image
                                src="/rams-logo6.png"
                                alt="RAMS Sorted Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <span className="font-bold text-2xl tracking-tight text-slate-900">
                            RAMS Sorted
                        </span>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-slate-600">
                        <a href="#services" className="hover:text-[#0b2040] transition-colors">Services</a>
                        <a href="#features" className="hover:text-[#0b2040] transition-colors">Features</a>
                        <a href="#pricing" className="hover:text-[#0b2040] transition-colors">Pricing</a>
                        <a href="#faq" className="hover:text-[#0b2040] transition-colors">FAQ</a>
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href="/app"
                            className="text-[15px] font-medium text-slate-600 hover:text-[#0b2040] transition-colors px-2"
                        >
                            Sign in
                        </Link>
                        <Link
                            href="/app"
                            className="inline-flex items-center gap-2 bg-[#0b2040] text-white px-5 py-2.5 rounded-lg text-[15px] font-medium hover:bg-slate-900 transition-all hover:shadow-lg active:scale-95"
                        >
                            Start free
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu Panel */}
                {mobileMenuOpen && (
                    <div className="md:hidden absolute top-20 left-0 w-full bg-[#f5f4f0] border-b border-black/5 shadow-xl p-6 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
                        <a href="#services" className="text-lg font-medium text-slate-700 py-3 border-b border-black/5" onClick={() => setMobileMenuOpen(false)}>Services</a>
                        <a href="#features" className="text-lg font-medium text-slate-700 py-3 border-b border-black/5" onClick={() => setMobileMenuOpen(false)}>Features</a>
                        <a href="#pricing" className="text-lg font-medium text-slate-700 py-3 border-b border-black/5" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
                        <a href="#faq" className="text-lg font-medium text-slate-700 py-3 border-b border-black/5" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
                        <div className="flex flex-col gap-3 mt-4">
                            <Link href="/app" className="w-full text-center py-3.5 text-slate-600 font-medium border border-black/10 rounded-lg hover:bg-white transition-colors">
                                Sign in
                            </Link>
                            <Link href="/app" className="w-full text-center py-3.5 bg-[#0b2040] text-white font-medium rounded-lg hover:bg-slate-900 transition-colors shadow-md">
                                Start free
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            <main>
                {/* 2. HERO SECTION */}
                <section className="relative pt-20 pb-32 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-black/5 shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-sm font-medium text-slate-600">Now available for all UK trades</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                            RAMS, COSHH & <br />
                            <span className="text-[#0b2040]">Toolbox Talks</span> Sorted.
                        </h1>

                        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                            Create compliant health & safety documents in minutes, not hours.
                            Stop overpaying consultants and get back on the tools.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                            <Link
                                href="/app"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0b2040] text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-slate-900 transition-all hover:shadow-xl active:scale-95"
                            >
                                Start for free
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <p className="text-sm text-slate-500">No credit card required.</p>
                        </div>

                        {/* WORKFLOW TABS */}
                        <div className="flex justify-center mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-backwards">
                            <div className="bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl shadow-sm border border-black/5 inline-flex gap-2">
                                <button
                                    onClick={() => setActiveTab("dashboard")}
                                    className={`relative px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === "dashboard" ? "bg-[#0b2040] text-white shadow-md" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
                                >
                                    Dashboard
                                </button>
                                <button
                                    onClick={() => setActiveTab("wizard")}
                                    className={`relative px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === "wizard" ? "bg-[#0b2040] text-white shadow-md" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
                                >
                                    Input Details
                                </button>
                                <button
                                    onClick={() => setActiveTab("editor")}
                                    className={`relative px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === "editor" ? "bg-[#0b2040] text-white shadow-md" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
                                >
                                    Review & Export
                                </button>
                            </div>
                        </div>

                        {/* CODED UI SHOWCASE */}
                        <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 ease-out">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 via-purple-100 to-blue-100 rounded-[1.5rem] blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-1000"></div>

                                {/* Browser Window */}
                                <div className="relative bg-white rounded-[1.25rem] shadow-2xl border border-slate-200 overflow-hidden ring-1 ring-slate-900/10 flex aspect-video text-left">

                                    {/* SIDEBAR (Common Structure) */}
                                    <div className="w-64 bg-[#f9f9f8] border-r border-slate-200 flex flex-col flex-shrink-0">
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
                                        {activeTab === 'dashboard' && (
                                            <div className="flex-1 flex flex-col items-center justify-center p-12 animate-in fade-in zoom-in-95 duration-300">
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
                                        )}

                                        {/* --- VIEW 2: WIZARD --- */}
                                        {activeTab === 'wizard' && (
                                            <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
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
                                        )}

                                        {/* --- VIEW 3: EDITOR --- */}
                                        {activeTab === 'editor' && (
                                            <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-300 bg-slate-50">
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
                                        )}
                                    </div>
                                </div>

                                {/* Dynamic Text Description */}
                                <div className="mt-12 text-center h-24">
                                    <div className="inline-block relative">
                                        {activeTab === 'dashboard' && (
                                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                                <h3 className="text-xl font-bold text-slate-900 mb-2">Centralized Dashboard</h3>
                                                <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">
                                                    Manage all your safety documents in one central hub. Track progress, access files instantly, and stay organized.
                                                </p>
                                            </div>
                                        )}
                                        {activeTab === 'wizard' && (
                                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                                <h3 className="text-xl font-bold text-slate-900 mb-2">Guided Input Wizard</h3>
                                                <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">
                                                    Step-by-step questions ensure you never miss a critical detail. Built-in compliance checks keep you safe.
                                                </p>
                                            </div>
                                        )}
                                        {activeTab === 'editor' && (
                                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                                <h3 className="text-xl font-bold text-slate-900 mb-2">Professional Editor</h3>
                                                <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">
                                                    Full control to review and edit. Export perfectly formatted PDF and Word documents in seconds.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* 3. SERVICES SECTION */}
                <section id="services" className="py-24 bg-white border-t border-black/5">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to get on site</h2>
                            <p className="text-slate-500 text-lg">
                                Three core tools designed specifically for UK trades.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <ServiceCard
                                icon={<FileText className="w-8 h-8 text-[#0b2040]" />}
                                title="RAMS Packs"
                                desc="Create comprehensive Risk Assessments & Method Statements. Select from pre-loaded hazards and controls, or add your own custom details."
                                badge="Most Popular"
                            />
                            <ServiceCard
                                icon={<Beaker className="w-8 h-8 text-[#0b2040]" />}
                                title="COSHH Assessments"
                                desc="Simple, compliant assessments for hazardous substances. Identify exposure routes, PPE requirements, and emergency procedures in seconds."
                            />
                            <ServiceCard
                                icon={<Users className="w-8 h-8 text-[#0b2040]" />}
                                title="Toolbox Talks"
                                desc="Generate professional safety briefings for your team. Includes key talking points, hazards, and a built-in attendance register."
                            />
                        </div>
                    </div>
                </section>

                {/* 4. EDITING TOOL FEATURE */}
                <section id="features" className="py-24 bg-[#f5f4f0] border-t border-black/5">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row items-center gap-16">
                            <div className="flex-1">
                                <div className="inline-block px-3 py-1 bg-[#c8eee6] text-[#0b2040] text-xs font-bold uppercase tracking-wide rounded-full mb-6">
                                    Flexible Editing
                                </div>
                                <h2 className="text-4xl font-bold text-slate-900 mb-6">Your documents, your way.</h2>
                                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                    We know every job is different. That's why we give you full control over your documents.
                                </p>

                                <ul className="space-y-4">
                                    <FeatureItem text="Download as editable Word (.docx) files" />
                                    <FeatureItem text="Export as professional PDFs" />
                                    <FeatureItem text="Add custom hazards and controls" />
                                </ul>

                                <div className="mt-10">
                                    <Link href="/app" className="text-[#0b2040] font-semibold hover:underline inline-flex items-center gap-2">
                                        Try the editor now <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>

                            <div className="flex-1 relative">
                                <div className="absolute inset-0 bg-[#c8eee6] rounded-full blur-3xl opacity-30"></div>
                                <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-black/5 rotate-2 hover:rotate-0 transition-transform duration-500">
                                    <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
                                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                            <Download className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-900">Export Options</div>
                                            <div className="text-xs text-slate-500">Select your preferred format</div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 cursor-pointer transition-colors">
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-5 h-5 text-blue-600" />
                                                <span className="font-medium text-slate-700">Microsoft Word (.docx)</span>
                                            </div>
                                            <div className="w-4 h-4 rounded-full border border-slate-300"></div>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-red-300 cursor-pointer transition-colors">
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-5 h-5 text-red-600" />
                                                <span className="font-medium text-slate-700">PDF Document (.pdf)</span>
                                            </div>
                                            <div className="w-4 h-4 rounded-full border border-slate-300"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. PRICING */}
                <section id="pricing" className="py-24 bg-white border-t border-black/5">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Simple, transparent pricing</h2>
                        <p className="text-slate-500 mb-12">No hidden fees. Cancel anytime.</p>

                        <div className="max-w-md mx-auto bg-[#f5f4f0] rounded-2xl p-8 border border-black/5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-sm font-semibold text-[#0b2040] uppercase tracking-wider mb-2">Pro Plan</div>
                            <div className="flex items-baseline justify-center gap-1 mb-6">
                                <span className="text-5xl font-bold text-slate-900">£19.99</span>
                                <span className="text-slate-500">/mo</span>
                            </div>

                            <ul className="space-y-4 mb-8 text-left max-w-xs mx-auto">
                                <PricingFeature text="Unlimited RAMS" />
                                <PricingFeature text="Unlimited COSHH" />
                                <PricingFeature text="Unlimited Toolbox Talks" />
                                <PricingFeature text="Word & PDF Downloads" />
                            </ul>

                            <Link
                                href="/app"
                                className="block w-full py-4 bg-[#0b2040] text-white rounded-xl font-semibold hover:bg-slate-900 transition-colors"
                            >
                                Start free trial
                            </Link>
                        </div>
                    </div>
                </section>

                {/* 6. FAQ */}
                <section id="faq" className="py-24 bg-[#f5f4f0] border-t border-black/5">
                    <div className="max-w-3xl mx-auto px-6">
                        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Common Questions</h2>
                        <div className="space-y-4">
                            <FaqItem
                                question="Is this suitable for small contractors?"
                                answer="Yes, absolutely. We built RAMS Sorted specifically for sole traders and small contracting firms who need to get paperwork done quickly without hiring a consultant."
                                isOpen={openFaqIndex === 0}
                                onClick={() => toggleFaq(0)}
                            />
                            <FaqItem
                                question="Can I edit the documents after generating them?"
                                answer="Yes, absolutely. Our AI does the heavy lifting to create the first draft, but you have full control. You can use our built-in editor to tweak any text, add custom hazards, or adjust the method statement. Once you're happy, you can download it as an editable Microsoft Word file (.docx) or a professional PDF."
                                isOpen={openFaqIndex === 1}
                                onClick={() => toggleFaq(1)}
                            />
                            <FaqItem
                                question="Do you guarantee legal compliance?"
                                answer="RAMS Sorted is a tool to assist you, not a replacement for a competent person. We provide high-quality, industry-standard templates and AI-generated content to help you create professional documents quickly. However, you (the user) remain the 'Competent Person' and are responsible for reviewing, editing, and approving the final content to ensure it accurately reflects your specific site conditions and risks."
                                isOpen={openFaqIndex === 2}
                                onClick={() => toggleFaq(2)}
                            />
                        </div>
                    </div>
                </section>

            </main>

            {/* 7. FOOTER */}
            <footer className="bg-white border-t border-black/5 pt-16 pb-8 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        {/* Brand Column */}
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="relative w-8 h-8">
                                    <Image
                                        src="/rams-logo6.png"
                                        alt="RAMS Sorted Logo"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <span className="font-bold text-xl text-slate-900">RAMS Sorted</span>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                The easiest way for UK trades to create professional health & safety documents.
                            </p>
                            <div className="flex gap-4">
                                {/* Social placeholders */}
                                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-[#0b2040] hover:text-white transition-colors cursor-pointer">
                                    <span className="sr-only">Twitter</span>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                                </div>
                                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-[#0b2040] hover:text-white transition-colors cursor-pointer">
                                    <span className="sr-only">LinkedIn</span>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                                </div>
                            </div>
                        </div>

                        {/* Product Column */}
                        <div>
                            <h3 className="font-bold text-slate-900 mb-4">Product</h3>
                            <ul className="space-y-3 text-sm text-slate-500">
                                <li><a href="#features" className="hover:text-[#0b2040] transition-colors">Features</a></li>
                                <li><a href="#pricing" className="hover:text-[#0b2040] transition-colors">Pricing</a></li>
                                <li><a href="#faq" className="hover:text-[#0b2040] transition-colors">FAQ</a></li>
                                <li><Link href="/app" className="hover:text-[#0b2040] transition-colors">Login</Link></li>
                            </ul>
                        </div>

                        {/* Company Column */}
                        <div>
                            <h3 className="font-bold text-slate-900 mb-4">Company</h3>
                            <ul className="space-y-3 text-sm text-slate-500">
                                <li><a href="#" className="hover:text-[#0b2040] transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-[#0b2040] transition-colors">Contact</a></li>
                                <li><a href="#" className="hover:text-[#0b2040] transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-[#0b2040] transition-colors">Careers</a></li>
                            </ul>
                        </div>

                        {/* Legal Column */}
                        <div>
                            <h3 className="font-bold text-slate-900 mb-4">Legal</h3>
                            <ul className="space-y-3 text-sm text-slate-500">
                                <li><a href="#" className="hover:text-[#0b2040] transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-[#0b2040] transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-[#0b2040] transition-colors">Cookie Policy</a></li>
                                <li><a href="#" className="hover:text-[#0b2040] transition-colors">Acceptable Use</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-slate-400 text-sm">
                            &copy; {new Date().getFullYear()} RAMS Sorted. All rights reserved.
                        </div>
                        <div className="flex items-center gap-6 text-sm text-slate-400">
                            <span>Made in the UK 🇬🇧</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div >
    );
}



// --- SUBCOMPONENTS ---

function ServiceCard({ icon, title, desc, badge }: { icon: React.ReactNode, title: string, desc: string, badge?: string }) {
    return (
        <div className="bg-[#f5f4f0] p-8 rounded-2xl border border-black/5 hover:border-[#0b2040]/20 transition-colors group relative">
            {badge && (
                <span className="absolute top-4 right-4 px-2 py-1 bg-[#0b2040] text-white text-[10px] font-bold uppercase tracking-wide rounded">
                    {badge}
                </span>
            )}
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-600 leading-relaxed text-sm">{desc}</p>
        </div>
    );
}

function FeatureItem({ text }: { text: string }) {
    return (
        <li className="flex items-center gap-3 text-slate-700 font-medium">
            <div className="w-6 h-6 rounded-full bg-[#c8eee6] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-[#0b2040]" />
            </div>
            {text}
        </li>
    );
}

function PricingFeature({ text }: { text: string }) {
    return (
        <li className="flex items-center gap-3 text-slate-700">
            <CheckCircle2 className="w-5 h-5 text-[#0b2040] shrink-0" />
            <span>{text}</span>
        </li>
    );
}

function FaqItem({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) {
    return (
        <div className="bg-white rounded-xl border border-black/5 overflow-hidden">
            <button
                onClick={onClick}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
            >
                <span className="font-semibold text-slate-900">{question}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="px-6 pb-6 pt-0 text-slate-600 leading-relaxed text-sm">
                    {answer}
                </div>
            )}
        </div>
    );
}
