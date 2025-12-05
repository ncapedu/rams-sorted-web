import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function PricingPage() {
    return (
        <div className="py-24 px-6">
            <div className="max-w-7xl mx-auto text-center">
                <h1 className="text-4xl font-bold text-slate-900 mb-6">Simple, transparent pricing</h1>
                <p className="text-lg text-slate-600 mb-16 max-w-2xl mx-auto">
                    No hidden fees. No long-term contracts. Cancel anytime.
                </p>

                <div className="max-w-md mx-auto bg-white rounded-2xl p-8 border border-slate-200 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-amber-500 to-green-500"></div>

                    <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Pro Plan</div>
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                        <span className="text-5xl font-bold text-slate-900">£20</span>
                        <span className="text-slate-500 font-medium">/month</span>
                    </div>
                    <div className="text-sm text-slate-500 mb-8">
                        or <span className="font-bold text-slate-900">£149</span> / year <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full ml-2">BEST VALUE</span>
                    </div>

                    <ul className="space-y-4 mb-8 text-left max-w-xs mx-auto">
                        <li className="flex items-center gap-3 text-slate-700">
                            <CheckCircle2 className="w-5 h-5 text-slate-900 shrink-0" />
                            <span>Unlimited RAMS documents</span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-700">
                            <CheckCircle2 className="w-5 h-5 text-slate-900 shrink-0" />
                            <span>Unlimited COSHH assessments</span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-700">
                            <CheckCircle2 className="w-5 h-5 text-slate-900 shrink-0" />
                            <span>Unlimited Toolbox Talks</span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-700">
                            <CheckCircle2 className="w-5 h-5 text-slate-900 shrink-0" />
                            <span>Word & PDF exports</span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-700">
                            <CheckCircle2 className="w-5 h-5 text-slate-900 shrink-0" />
                            <span>Access from any device</span>
                        </li>
                    </ul>

                    <Link
                        href="/app"
                        className="block w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all hover:shadow-lg active:scale-95 mb-4"
                    >
                        Start 14-day free trial
                    </Link>

                    <p className="text-xs text-slate-400 leading-relaxed">
                        Card required. 14-day free trial, then £20/month. Cancel anytime before the trial ends to avoid charges.
                    </p>
                </div>
            </div>
        </div>
    );
}
