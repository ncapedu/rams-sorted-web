import Link from "next/link";
import { ArrowRight, Download, Edit3, Cloud, ShieldCheck } from "lucide-react";

export default function ProductPage() {
    return (
        <div className="py-24 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h1 className="text-4xl font-bold text-slate-900 mb-6">Built for the way you work.</h1>
                    <p className="text-lg text-slate-600">
                        RAMS Sorted combines the speed of AI with the control you need.
                        It's not just a template library—it's a complete document creation suite.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-20">
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6">
                            <Edit3 className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Full Control Editor</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Our AI gives you a great first draft, but you're in charge.
                            Edit every word, add custom hazards, or tweak the method statement
                            to match your specific site conditions.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                            <Download className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Word & PDF Export</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Download your documents in the format that works for you.
                            Get a polished PDF ready to email, or an editable Microsoft Word (.docx)
                            file for further customization.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-6">
                            <Cloud className="w-6 h-6 text-amber-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Cloud Storage</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Never lose a document again. All your RAMS, COSHH assessments, and
                            toolbox talks are saved securely in the cloud, accessible from any device, anywhere.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-6">
                            <ShieldCheck className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Compliance First</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Our templates are designed to meet UK health and safety standards.
                            We help you tick the boxes so you can get on site with confidence.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6">Ready to get sorted?</h2>
                        <p className="text-slate-300 mb-8 text-lg">
                            Join thousands of UK tradespeople who are saving time on paperwork.
                        </p>
                        <Link
                            href="/app"
                            className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-slate-100 transition-colors"
                        >
                            Start your free trial <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
