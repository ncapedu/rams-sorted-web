"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FaqPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "Are these documents legally compliant by default?",
            answer: "RAMS Sorted provides structured templates and AI-assisted content to help you draft professional RAMS, COSHH, and toolbox talks. However, every job and site is different. You (or your competent person) must always review, adapt, and approve the documents. Responsibility for final content and legal compliance remains with you, not RAMS Sorted."
        },
        {
            question: "Do I still need to check the documents?",
            answer: "Yes, always. While we make the process faster and easier by providing a solid starting point, the final review is your responsibility to ensure it matches the specific reality of your work."
        },
        {
            question: "Do I need a card for the trial?",
            answer: "Yes, a card is required to start the 14-day free trial. You will not be charged until the trial ends. If you cancel before the 14 days are up, you won't be charged a penny."
        },
        {
            question: "Can I cancel anytime?",
            answer: "Yes, absolutely. You can cancel your subscription at any time from your account settings. If you cancel, you'll keep access until the end of your current billing period."
        },
        {
            question: "Can I edit the documents after generating them?",
            answer: "Yes. You can edit them within our platform's editor, or download them as Microsoft Word (.docx) files to make further changes on your computer."
        },
        {
            question: "Who is RAMS Sorted for?",
            answer: "We built RAMS Sorted for UK trades and small contractors—electricians, plumbers, builders, roofers, etc.—who need to produce professional health and safety paperwork without the cost of a consultant."
        }
    ];

    return (
        <div className="py-24 px-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-slate-900 mb-6 text-center">Frequently Asked Questions</h1>
                <p className="text-lg text-slate-600 mb-16 text-center">
                    Everything you need to know about RAMS Sorted.
                </p>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                            >
                                <span className="font-semibold text-slate-900">{faq.question}</span>
                                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`} />
                            </button>
                            {openIndex === index && (
                                <div className="px-6 pb-6 text-slate-600 leading-relaxed animate-in slide-in-from-top-2 duration-200">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
