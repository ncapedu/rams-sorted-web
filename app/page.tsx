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
    Settings,
} from "lucide-react";

export default function LandingPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"dashboard" | "wizard" | "editor">("dashboard");
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Auto-play workflow tabs
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setActiveTab((current) => {
                if (current === "dashboard") return "wizard";
                if (current === "wizard") return "editor";
                return "dashboard";
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const handleTabClick = (tab: "dashboard" | "wizard" | "editor") => {
        setActiveTab(tab);
        setIsAutoPlaying(false); // Stop auto-play if user interacts
    };

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

            <main className="flex-1">

                {/* 2. HERO SECTION */}
                <section className="pt-20 pb-24 px-6 relative overflow-hidden">
                    <div className="max-w-6xl mx-auto text-center relative z-10">

                        {/* Headline */}
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            Professional Safety <br className="hidden md:block" />
                            Documents in Minutes.
                        </h1>

                        {/* Subhead */}
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 font-light">
                            Stop wrestling with Word templates. Generate compliant RAMS, COSHH, and Toolbox Talks instantly.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                            <Link
                                href="/app"
                                className="w-full sm:w-auto px-8 py-4 bg-[#0b2040] text-white rounded-xl font-semibold text-lg hover:bg-slate-900 transition-all hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
                            >
                                Start free <ArrowRight className="w-5 h-5" />
                            </Link>
                            <p className="text-sm text-slate-500">No credit card required.</p>
                        </div>

                        {/* WORKFLOW TABS */}
                        <div className="flex justify-center gap-2 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                            {[
                                { id: 'dashboard', label: '1. Start Project' },
                                { id: 'wizard', label: '2. Input Details' },
                                { id: 'editor', label: '3. Review & Export' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabClick(tab.id as any)}
                                    className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === tab.id
                                        ? 'bg-[#0b2040] text-white shadow-lg scale-105 ring-2 ring-offset-2 ring-[#0b2040]'
                                        : 'bg-white text-slate-500 hover:bg-slate-50 border border-black/5'
                                        }`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && isAutoPlaying && (
                                        <span className="absolute bottom-0 left-0 h-0.5 bg-white/30 animate-[width_5s_linear_infinite]" style={{ width: '100%' }}></span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* APP INTERFACE VISUALIZATION */}
                        <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 ease-out">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 via-purple-100 to-blue-100 rounded-[1.5rem] blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-1000"></div>

                                {/* Browser Window */}
                                <div className="relative bg-white rounded-[1.25rem] shadow-2xl border border-black/10 overflow-hidden ring-1 ring-slate-900/5">
                                    {/* Window Controls */}
                                    <div className="bg-[#FAF9F6] border-b border-black/5 px-4 py-3 flex items-center gap-2">
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                                        </div>
                                        <div className="mx-auto bg-white border border-black/5 px-3 py-1 rounded-md text-[10px] text-slate-400 font-medium flex items-center gap-2 w-64 justify-center">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            app.ramssorted.co.uk
                                        </div>
                                    </div>

                                    {/* App Layout Container */}
                                    <div className="h-[600px] bg-[#f5f4f0] text-left overflow-hidden relative transition-all duration-500 font-sans">

                                        {/* --- VIEW 1: DASHBOARD --- */}
                                        <div className={`absolute inset-0 flex transition-opacity duration-700 ${activeTab === 'dashboard' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                                            {/* Sidebar (Matches Screenshot) */}
                                            <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
                                                <div className="p-4">
                                                    {/* Logo Area */}
                                                    <div className="flex items-center gap-2 mb-6">
                                                        <div className="w-8 h-8 bg-[#0b2040] rounded-full flex items-center justify-center">
                                                            <div className="w-4 h-4 text-white">
                                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center ml-auto cursor-pointer">
                                                            <ChevronDown className="w-4 h-4 text-slate-600 -rotate-90" />
                                                        </div>
                                                    </div>

                                                    {/* RS Hub Button */}
                                                    <div className="bg-[#0b2040] text-white rounded-lg py-2 px-4 flex items-center justify-center gap-2 text-sm font-medium mb-8 shadow-sm">
                                                        <div className="grid grid-cols-2 gap-0.5">
                                                            <div className="w-1 h-1 bg-white/70"></div>
                                                            <div className="w-1 h-1 bg-white/70"></div>
                                                            <div className="w-1 h-1 bg-white/70"></div>
                                                            <div className="w-1 h-1 bg-white/70"></div>
                                                        </div>
                                                        RS Hub
                                                    </div>

                                                    {/* My Files List */}
                                                    <div className="mb-2">
                                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">MY FILES</h4>
                                                        <div className="space-y-3">
                                                            {[
                                                                { name: "eeee", date: "12/2/2025, 9:17:57 PM" },
                                                                { name: "oeme", date: "12/1/2025, 8:29:43 PM" },
                                                                { name: "jj", date: "12/1/2025, 8:06:30 PM" },
                                                                { name: "h", date: "12/1/2025, 7:53:32 PM" },
                                                                { name: "eee", date: "12/1/2025, 7:50:09 PM" },
                                                                { name: "3", date: "12/1/2025, 7:36:19 PM" },
                                                            ].map((file, i) => (
                                                                <div key={i} className="group flex items-start justify-between cursor-pointer hover:bg-slate-50 p-1 rounded">
                                                                    <div>
                                                                        <div className="text-xs font-semibold text-slate-700 mb-0.5">{file.name}</div>
                                                                        <div className="text-[9px] text-slate-400">{file.date}</div>
                                                                    </div>
                                                                    <div className="text-slate-300 group-hover:text-slate-500">
                                                                        <div className="flex flex-col gap-0.5">
                                                                            <div className="w-0.5 h-0.5 bg-current rounded-full"></div>
                                                                            <div className="w-0.5 h-0.5 bg-current rounded-full"></div>
                                                                            <div className="w-0.5 h-0.5 bg-current rounded-full"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* User Profile (Bottom) */}
                                                <div className="mt-auto p-4 border-t border-slate-100">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">N</div>
                                                        <div>
                                                            <div className="text-xs font-bold text-slate-900">Account</div>
                                                            <div className="text-[10px] text-slate-400">Not signed in</div>
                                                        </div>
                                                        <Settings className="w-4 h-4 text-slate-400 ml-auto" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Main Content Area */}
                                            <div className="flex-1 bg-white p-12 flex flex-col items-center pt-20">
                                                <h3 className="text-4xl font-bold text-slate-900 mb-2">
                                                    Welcome back<span className="text-red-500">|</span>
                                                </h3>
                                                <p className="text-slate-400 text-lg mb-16">How can we help you today?</p>

                                                <div className="grid grid-cols-3 gap-6 w-full max-w-5xl">
                                                    {/* Card 1: RAMS */}
                                                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all cursor-pointer group flex flex-col items-center text-center h-64 justify-center">
                                                        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                                            <FileText className="w-7 h-7 text-red-500" />
                                                        </div>
                                                        <div className="font-bold text-slate-900 text-lg mb-2">New RAMS Document</div>
                                                        <div className="text-xs text-slate-400 max-w-[180px]">Start a full RAMS pack in guided steps.</div>
                                                    </div>

                                                    {/* Card 2: COSHH */}
                                                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all cursor-pointer group flex flex-col items-center text-center h-64 justify-center">
                                                        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                                            <Beaker className="w-7 h-7 text-blue-500" />
                                                        </div>
                                                        <div className="font-bold text-slate-900 text-lg mb-2">New COSHH Assessment</div>
                                                        <div className="text-xs text-slate-400 max-w-[180px]">Create a standalone COSHH assessment.</div>
                                                    </div>

                                                    {/* Card 3: Toolbox Talk */}
                                                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all cursor-pointer group flex flex-col items-center text-center h-64 justify-center">
                                                        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                                            <Users className="w-7 h-7 text-green-500" />
                                                        </div>
                                                        <div className="font-bold text-slate-900 text-lg mb-2">New Toolbox Talk</div>
                                                        <div className="text-xs text-slate-400 max-w-[180px]">Build a ready-to-use toolbox talk.</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* --- VIEW 2: WIZARD --- */}
                                        <div className={`absolute inset-0 flex transition-opacity duration-700 ${activeTab === 'wizard' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                                            {/* Sidebar (Matches Dashboard Style) */}
                                            <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
                                                <div className="p-4">
                                                    {/* Logo Area */}
                                                    <div className="flex items-center gap-2 mb-6">
                                                        <div className="w-8 h-8 bg-[#0b2040] rounded-full flex items-center justify-center">
                                                            <div className="w-4 h-4 text-white">
                                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center ml-auto">
                                                            <ChevronDown className="w-4 h-4 text-slate-600 -rotate-90" />
                                                        </div>
                                                    </div>

                                                    {/* Wizard Progress */}
                                                    <div className="mb-8">
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">PROGRESS</div>
                                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
                                                            <div className="h-full w-[40%] bg-[#0b2040] rounded-full"></div>
                                                        </div>
                                                        <div className="text-[10px] text-slate-500 text-right">Step 2 of 5</div>
                                                    </div>

                                                    {/* Steps List */}
                                                    <div className="space-y-1">
                                                        {['Project Details', 'Hazards & Risks', 'Method Statement', 'Review'].map((item, i) => (
                                                            <div key={i} className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-3 ${i === 0 ? 'bg-[#f5f4f0] text-[#0b2040]' : 'text-slate-500'}`}>
                                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${i === 0 ? 'bg-[#0b2040] text-white' : 'bg-slate-200 text-slate-500'}`}>{i + 1}</div>
                                                                {item}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* User Profile (Bottom) */}
                                                <div className="mt-auto p-4 border-t border-slate-100">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">N</div>
                                                        <div>
                                                            <div className="text-xs font-bold text-slate-900">Account</div>
                                                            <div className="text-[10px] text-slate-400">Not signed in</div>
                                                        </div>
                                                        <Settings className="w-4 h-4 text-slate-400 ml-auto" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Form Area */}
                                            <div className="flex-1 bg-white p-12 overflow-y-auto">
                                                <div className="max-w-2xl mx-auto">
                                                    <div className="mb-8 text-center">
                                                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Project Details</h3>
                                                        <p className="text-slate-400 text-sm">Enter the key information for this project.</p>
                                                    </div>

                                                    <div className="space-y-6">
                                                        <div className="grid grid-cols-2 gap-6">
                                                            <div className="space-y-2">
                                                                <label className="text-xs font-bold text-slate-700">Project Reference</label>
                                                                <div className="h-10 w-full bg-slate-50 border border-slate-200 rounded-lg px-3 flex items-center text-sm text-slate-900">REF-2024-001</div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="text-xs font-bold text-slate-700">Start Date</label>
                                                                <div className="h-10 w-full bg-white border border-slate-200 rounded-lg px-3 flex items-center text-sm text-slate-500 justify-between">
                                                                    <span>Select date</span>
                                                                    <ChevronDown className="w-4 h-4" />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <label className="text-xs font-bold text-slate-700">Site Address</label>
                                                            <div className="h-10 w-full bg-white border border-blue-500 ring-4 ring-blue-500/10 rounded-lg px-3 flex items-center text-sm text-slate-900">
                                                                123 Construction Way, London...
                                                                <span className="w-0.5 h-4 bg-blue-500 ml-1 animate-pulse"></span>
                                                            </div>
                                                        </div>

                                                        <div className="pt-8 flex items-center justify-between">
                                                            <button className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-900">Cancel</button>
                                                            <button className="px-8 py-2.5 bg-[#0b2040] text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-900/10 hover:bg-slate-900 transition-colors">
                                                                Continue
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* --- VIEW 3: EDITOR --- */}
                                        <div className={`absolute inset-0 flex flex-col bg-[#525659] transition-opacity duration-700 ${activeTab === 'editor' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                                            {/* Toolbar */}
                                            <div className="bg-[#2b2b2b] px-4 py-3 flex items-center justify-between shrink-0 shadow-md z-20">
                                                <div className="flex items-center gap-4">
                                                    <div className="text-white/80 hover:text-white cursor-pointer"><ArrowRight className="w-5 h-5 rotate-180" /></div>
                                                    <div className="h-6 w-px bg-white/20"></div>
                                                    <div className="font-medium text-white text-sm">RAMS-Final-Draft.pdf</div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium flex items-center gap-2 hover:bg-blue-500 transition-colors cursor-pointer shadow-lg">
                                                        <Download className="w-3 h-3" /> Download
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Document Area */}
                                            <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-[#525659]">
                                                <div className="w-[500px] bg-white shadow-2xl min-h-[700px] p-10 text-[8px] relative animate-in zoom-in-95 duration-500">
                                                    {/* Header */}
                                                    <div className="flex justify-between items-start border-b-2 border-[#0b2040] pb-4 mb-6">
                                                        <div>
                                                            <h1 className="text-lg font-bold text-[#0b2040] uppercase tracking-tight">Risk Assessment</h1>
                                                            <div className="text-slate-500 mt-1">Method Statement & Risk Assessment</div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-bold text-slate-900">John Smith Electrical</div>
                                                            <div className="text-slate-500">Ref: RAMS-001</div>
                                                        </div>
                                                    </div>

                                                    {/* Content Mockup */}
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h2 className="font-bold text-[#0b2040] mb-2 border-b border-slate-200 pb-1">1. Scope of Works</h2>
                                                            <p className="text-slate-600 leading-relaxed text-justify">
                                                                The scope of this project involves the complete electrical installation for Unit 4. This includes first fix containment, second fix wiring, and final termination of all accessories. All work will be carried out in accordance with BS7671 18th Edition wiring regulations.
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <h2 className="font-bold text-[#0b2040] mb-2 border-b border-slate-200 pb-1">2. PPE Requirements</h2>
                                                            <div className="flex gap-2">
                                                                {['Safety Boots', 'Hi-Vis Vest', 'Hard Hat', 'Gloves', 'Goggles'].map((ppe, i) => (
                                                                    <div key={i} className="flex flex-col items-center gap-1 p-2 border border-slate-200 rounded bg-slate-50 w-16">
                                                                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-[8px]">✓</div>
                                                                        <span className="text-[6px] text-center font-medium text-slate-700 leading-tight">{ppe}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <h2 className="font-bold text-[#0b2040] mb-2 border-b border-slate-200 pb-1">3. Risk Assessment Matrix</h2>
                                                            <div className="border border-slate-200 rounded overflow-hidden">
                                                                <div className="grid grid-cols-4 bg-slate-100 border-b border-slate-200 font-bold p-2">
                                                                    <div>Hazard</div>
                                                                    <div>Risk</div>
                                                                    <div>Control Measure</div>
                                                                    <div>Residual</div>
                                                                </div>
                                                                <div className="grid grid-cols-4 p-2 border-b border-slate-100 items-center">
                                                                    <div className="font-medium">Live Electricity</div>
                                                                    <div className="text-red-600 font-bold">High</div>
                                                                    <div>Isolate supply & lock off</div>
                                                                    <div className="text-green-600 font-bold">Low</div>
                                                                </div>
                                                                <div className="grid grid-cols-4 p-2 items-center">
                                                                    <div className="font-medium">Working at Height</div>
                                                                    <div className="text-orange-600 font-bold">Med</div>
                                                                    <div>Use podium steps</div>
                                                                    <div className="text-green-600 font-bold">Low</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Footer */}
                                                    <div className="absolute bottom-8 left-10 right-10 border-t border-slate-200 pt-4 flex justify-between text-slate-400">
                                                        <div>Page 1 of 12</div>
                                                        <div>Generated by RAMS Sorted</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

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
            <footer className="bg-white border-t border-black/5 py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="relative w-6 h-6 grayscale opacity-50">
                            <Image
                                src="/rams-logo6.png"
                                alt="RAMS Sorted Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="font-semibold text-slate-500">RAMS Sorted</span>
                    </div>
                    <div className="text-slate-400 text-sm">
                        &copy; {new Date().getFullYear()} RAMS Sorted.
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
