import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, FileText, Zap } from "lucide-react";
import AnimatedTitle from "./components/AnimatedTitle";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900">
            {/* HEADER */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
                            <span className="font-serif italic">R</span>
                        </div>
                        <span>RAMS Sorted</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                        <a href="#features" className="hover:text-black transition-colors">Features</a>
                        <a href="#pricing" className="hover:text-black transition-colors">Pricing</a>
                        <a href="#faq" className="hover:text-black transition-colors">FAQ</a>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/app"
                            className="text-sm font-medium text-slate-600 hover:text-black hidden sm:block"
                        >
                            Log in
                        </Link>
                        <Link
                            href="/app"
                            className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-all hover:scale-105"
                        >
                            Get Started <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* HERO SECTION */}
            <main className="flex-1">
                <section className="pt-24 pb-20 px-6">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-600 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Trusted by 500+ UK Trades
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
                            RAMS, COSHH & <br />
                            <span className="text-slate-400">Toolbox Talks in Minutes.</span>
                        </h1>

                        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both">
                            Generate compliant, professional safety documents without the headache.
                            Built specifically for UK trades and contractors.
                            <span className="block mt-2 text-slate-900 font-medium">No consultant fees. No monthly subscriptions.</span>
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
                            <Link
                                href="/app"
                                className="w-full sm:w-auto px-8 py-4 bg-[#0b2040] text-white rounded-xl font-semibold text-lg hover:bg-black transition-all hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                Start Your First Document <ArrowRight className="w-5 h-5" />
                            </Link>
                            <button className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-lg hover:bg-slate-50 transition-all hover:border-slate-300">
                                View Example PDF
                            </button>
                        </div>

                        <div className="pt-12 flex items-center justify-center gap-8 text-slate-400 grayscale opacity-60 animate-in fade-in duration-1000 delay-500">
                            {/* Simple text placeholders for logos to keep it clean/fast */}
                            <span className="font-bold text-xl">CHAS</span>
                            <span className="font-bold text-xl">SafeContractor</span>
                            <span className="font-bold text-xl">Constructionline</span>
                            <span className="font-bold text-xl">SMAS</span>
                        </div>
                    </div>
                </section>

                {/* FEATURES GRID */}
                <section id="features" className="py-24 bg-slate-50 border-t border-slate-200">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to get on site</h2>
                            <p className="text-slate-500 text-lg">Stop wrestling with Word templates. Our intelligent wizard guides you through every step.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={<FileText className="w-6 h-6 text-blue-600" />}
                                title="Risk Assessments & Method Statements"
                                desc="Create site-specific RAMS in under 10 minutes. Pre-loaded with thousands of trade-specific hazards and controls."
                            />
                            <FeatureCard
                                icon={<Beaker className="w-6 h-6 text-purple-600" />}
                                title="COSHH Assessments"
                                desc="Instant COSHH assessments for common substances. Just search our library and we handle the rest."
                            />
                            <FeatureCard
                                icon={<Users className="w-6 h-6 text-emerald-600" />}
                                title="Toolbox Talks"
                                desc="Keep your team safe and compliant with ready-to-go toolbox talks, complete with attendance sheets."
                            />
                        </div>
                    </div>
                </section>

                {/* SOCIAL PROOF / VALUE */}
                <section className="py-24 px-6 bg-white">
                    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                                Why pay a consultant £500+?
                            </h2>
                            <div className="space-y-6">
                                <ValuePoint text="Pay-as-you-go or unlimited plans" />
                                <ValuePoint text="Professional, branded PDF exports" />
                                <ValuePoint text="Works on mobile, tablet & desktop" />
                                <ValuePoint text="Instant download - no waiting" />
                            </div>
                            <div className="pt-4">
                                <Link
                                    href="/app"
                                    className="inline-flex items-center gap-2 text-[#0b2040] font-semibold hover:underline text-lg"
                                >
                                    Try it for free today <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-3xl transform rotate-3 scale-105 opacity-60"></div>
                            <div className="relative bg-slate-900 rounded-2xl p-8 shadow-2xl text-white transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                                <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-6">
                                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg">Document Generated</div>
                                        <div className="text-slate-400 text-sm">Just now</div>
                                    </div>
                                </div>
                                <div className="space-y-4 opacity-80">
                                    <div className="h-4 bg-white/20 rounded w-3/4"></div>
                                    <div className="h-4 bg-white/20 rounded w-full"></div>
                                    <div className="h-4 bg-white/20 rounded w-5/6"></div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                                    <div className="text-sm text-slate-400">RAMS-Sorted-v1.pdf</div>
                                    <div className="px-3 py-1 bg-white/10 rounded text-xs font-medium">Ready to Download</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="bg-slate-50 border-t border-slate-200 py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                        <div className="w-6 h-6 bg-black rounded flex items-center justify-center text-white text-xs">
                            <span className="font-serif italic">R</span>
                        </div>
                        <span>RAMS Sorted</span>
                    </div>
                    <div className="text-slate-500 text-sm">
                        &copy; {new Date().getFullYear()} RAMS Sorted. All rights reserved.
                    </div>
                    <div className="flex gap-6 text-sm text-slate-500">
                        <a href="#" className="hover:text-black">Privacy</a>
                        <a href="#" className="hover:text-black">Terms</a>
                        <a href="#" className="hover:text-black">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-500 leading-relaxed">{desc}</p>
        </div>
    );
}

function ValuePoint({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-lg text-slate-700">{text}</span>
        </div>
    );
}
