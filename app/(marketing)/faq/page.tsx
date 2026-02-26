"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import TypewriterText from "@/app/components/marketing/TypewriterText";

const faqs = [
    {
        category: "Legal & Compliance",
        items: [
            {
                question: "Are the documents legally compliant by default?",
                answer: "RAMS Sorted provides structured templates and AI-assisted content to help you draft professional RAMS, COSHH, and toolbox talks. However, every job and site is different. You (or your competent person) must always review, adapt, and approve the documents. Responsibility for final content and legal compliance remains with you, not RAMS Sorted."
            },
            {
                question: "Do I still need to check the documents?",
                answer: "Yes, always. RAMS Sorted speeds things up significantly but doesn't replace a competent review. You must ensure the content matches the specific reality and hazards of your work. Our platform is a tool to assist you, not to replace professional judgement."
            },
            {
                question: "Are the RAMS packs accepted by principal contractors?",
                answer: "The documents follow standard UK industry formats and are designed to meet the expectations of most principal contractors. That said, individual contractors may have their own specific requirements. You can always export to Word and customise further if needed."
            },
        ]
    },
    {
        category: "Pricing & Billing",
        items: [
            {
                question: "How much does it cost?",
                answer: "We offer a 14-day free trial so you can test everything out. After the trial, it's £19/month or £169/year (saving you over £55 compared to monthly). A card is required to start the trial, but you won't be charged until the trial ends."
            },
            {
                question: "Can I cancel my subscription?",
                answer: "Yes, absolutely. There are no long-term contracts. You can cancel anytime from your account settings. If you cancel, you'll keep access until the end of your current billing period — no partial refunds, no surprises."
            },
            {
                question: "What are the fair-use limits?",
                answer: "Both monthly and yearly plans are designed for normal professional use — typically up to 50 document generations per month. If you're generating significantly higher volumes (e.g. as a large consultancy), get in touch and we can discuss your needs."
            },
        ]
    },
    {
        category: "Using the Platform",
        items: [
            {
                question: "Can I edit documents after generation?",
                answer: "Yes. You can edit every word within our platform's built-in editor before finalising. You can also export them as Microsoft Word (.docx) files to make further changes on your computer, or as PDF for immediate site use."
            },
            {
                question: "What document types can I create?",
                answer: "You can create RAMS packs (Risk Assessment & Method Statements), COSHH assessments, and Toolbox Talks. All three are generated using AI based on your project details, then fully editable before export."
            },
            {
                question: "How many devices can I use?",
                answer: "Your account can be accessed from up to 5 devices. This covers your phone, tablet, laptop, and work PC. If you need access on more devices, simply sign out from an older device in your account settings."
            },
        ]
    },
    {
        category: "About RAMS Sorted",
        items: [
            {
                question: "Who is RAMS Sorted for?",
                answer: "We built RAMS Sorted for UK trades and small contractors — electricians, plumbers, builders, roofers, scaffolders, and safety consultants — who need to produce professional health and safety paperwork efficiently."
            },
            {
                question: "Is my data secure?",
                answer: "Yes. All data is encrypted in transit and at rest. Your documents are stored securely in our database and are only accessible by you. We never share your data with third parties."
            },
        ]
    },
];

export default function FaqPage() {
    const [openKey, setOpenKey] = useState<string | null>(null);

    const toggle = (key: string) => {
        setOpenKey(openKey === key ? null : key);
    };

    // JSON-LD schema for SEO
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.flatMap(cat =>
            cat.items.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer,
                }
            }))
        )
    };

    let globalIndex = 0;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
            />
            <div className="py-24 px-6 min-h-screen bg-faq-swirl">
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

                    <div className="space-y-10">
                        {faqs.map((category) => (
                            <div key={category.category}>
                                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 px-1">
                                    {category.category}
                                </h2>
                                <div className="space-y-3">
                                    {category.items.map((faq) => {
                                        const key = `${category.category}-${globalIndex}`;
                                        globalIndex++;
                                        const isOpen = openKey === key;
                                        return (
                                            <div
                                                key={key}
                                                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-white/20 hover:bg-white/8 hover:shadow-xl"
                                            >
                                                <button
                                                    onClick={() => toggle(key)}
                                                    className="w-full flex items-center justify-between p-6 text-left transition-colors group"
                                                    aria-expanded={isOpen}
                                                >
                                                    <span className="font-semibold text-white pr-8 group-hover:text-blue-200 transition-colors">{faq.question}</span>
                                                    <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 group-hover:text-white ${isOpen ? 'rotate-180' : ''}`} />
                                                </button>
                                                <div
                                                    className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                                                >
                                                    <div className="overflow-hidden">
                                                        <div className="px-6 pb-6 text-slate-300 leading-relaxed border-t border-white/5 pt-4">
                                                            {faq.answer}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <p className="text-slate-400 text-sm mb-4">Still have questions?</p>
                        <a
                            href="/contact"
                            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white font-medium px-6 py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Contact Support
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
