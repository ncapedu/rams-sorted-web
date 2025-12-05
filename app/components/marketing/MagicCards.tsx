"use client";

import { CheckCircle2 } from "lucide-react";

export default function MagicCards() {
    return (
        <div className="relative w-full max-w-3xl mx-auto h-24 flex items-center justify-center group perspective-1000">
            {/* Card 1: Left */}
            <div className="absolute top-0 w-64 p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-xl transition-all duration-500 ease-out transform origin-bottom-right group-hover:-rotate-6 group-hover:-translate-x-32 group-hover:scale-105 z-10">
                <div className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-300">Designed for UK trades</span>
                </div>
            </div>

            {/* Card 2: Center (Top) */}
            <div className="absolute top-0 w-64 p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-xl transition-all duration-500 ease-out transform group-hover:-translate-y-4 group-hover:scale-110 z-30">
                <div className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-300">RAMS · COSHH · Toolbox</span>
                </div>
            </div>

            {/* Card 3: Right */}
            <div className="absolute top-0 w-64 p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-xl transition-all duration-500 ease-out transform origin-bottom-left group-hover:rotate-6 group-hover:translate-x-32 group-hover:scale-105 z-20">
                <div className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-300">Export to Word & PDF</span>
                </div>
            </div>
        </div>
    );
}
