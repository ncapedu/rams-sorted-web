"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import TypewriterText from "@/app/components/marketing/TypewriterText";

export default function FaqPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "Are the documents legally compliant by default?",
            answer: "RAMS Sorted provides structured templates and AI-assisted content to help you draft professional RAMS, COSHH, and toolbox talks. However, every job and site is different. You (or your competent person) must always review, adapt, and approve the documents. Responsibility for final content and legal compliance remains with you, not RAMS Sorted."
        },
        {
            question: "Do I still need to check the documents?",
            answer: "Yes, always. RAMS Sorted speeds things up significantly but doesn't replace a competent review. You must ensure the content matches the specific reality and hazards of your work."
        },
        {
            question: "Do I get a free plan?",
            answer: "We don't offer a permanent free plan. Instead, we offer a 14-day free trial so you can test everything out. A card is required to start the trial, but you won't be charged until the trial ends. It's then £20/month or £149/year unless you cancel."
        },
        {
            question: "Can I cancel my subscription?",
            answer: "Yes, absolutely. There are no long-term contracts. You can cancel anytime from your account settings. If you cancel, you'll keep access until the end of your current billing period."
        },
        {
            question: "Can I edit documents after generation?",
            answer: "Yes. You can edit every word within our platform's editor before finalizing. You can also export them as Microsoft Word (.docx) files to make further changes on your computer."
        },
        {
            question: "Who is RAMS Sorted for?",
            answer: "We built RAMS Sorted for UK trades and small contractors—electricians, plumbers, builders, roofers, and safety consultants—who need to produce professional health and safety paperwork efficiently."
        }
    ];

    return (
        <div className="py-24 px-6 min-h-screen bg-swirl">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-white mb-6 min-h-[50px] drop-shadow-md">
                        <TypewriterText text="Frequently asked questions" speed={30} cursor />
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto rounded-full mb-6"></div>
                    <p className="text-lg text-slate-200 font-medium drop-shadow-sm">
                        Everything you need to know about getting sorted.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-[#0f172a] border-2 border-slate-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-slate-700 hover:shadow-lg hover:bg-[#1e293b]"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full flex items-center justify-between p-6 text-left transition-colors group"
                            >
                                <span className="font-semibold text-white pr-8 group-hover:text-blue-200 transition-colors">{faq.question}</span>
                                <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 group-hover:text-white ${openIndex === index ? 'rotate-180' : ''}`} />
                            </button>
                            <div
                                className={`grid transition-all duration-300 ease-in-out ${openIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                            >
                                <div className="overflow-hidden">
                                    <div className="px-6 pb-6 text-slate-300 leading-relaxed border-t border-white/5 pt-4 mt-2">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
