"use client";

import { useState } from "react";
import TypewriterText from "@/app/components/marketing/TypewriterText";

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // In a real app, we would send this to an API route
        console.log("Form submitted");

        setLoading(false);
        setSubmitted(true);
    };

    return (
        <div className="pt-24 pb-16 px-6 min-h-screen bg-contact-swirl">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 min-h-[60px]">
                    <TypewriterText text="Contact Us" speed={50} cursor />
                </h1>
                <div className="animate-slide-up opacity-0 relative z-10" style={{ animationDelay: '0.3s' }}>
                    <p className="text-xl text-slate-300 mb-16 leading-relaxed">
                        Have a question or need support? We're here to help.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Contact Form */}
                    <div className="md:col-span-2 animate-slide-up opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
                        {submitted ? (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-300">
                                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <h3 className="text-2xl font-bold text-emerald-400 mb-2">Message Received</h3>
                                <p className="text-emerald-200/80 mb-4">
                                    Thanks for reaching out! Your reference ID is <span className="font-mono font-bold text-white">#{Math.floor(Math.random() * 100000)}</span>.
                                </p>
                                <p className="text-emerald-200/60 text-sm">
                                    We'll get back to you shortly.
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="mt-6 text-emerald-400 font-medium hover:text-emerald-300 underline"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1.5 focus-within:text-white transition-colors">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            required
                                            className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-3 px-4 transition-all outline-none"
                                            placeholder="Joe Bloggs"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5 focus-within:text-white transition-colors">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            required
                                            className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-3 px-4 transition-all outline-none"
                                            placeholder="joe@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-1.5 focus-within:text-white transition-colors">Subject</label>
                                    <div className="relative">
                                        <select
                                            id="subject"
                                            className="w-full rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-3 px-4 appearance-none transition-all outline-none"
                                        >
                                            <option className="bg-slate-900 text-white">Account Support</option>
                                            <option className="bg-slate-900 text-white">Billing Question</option>
                                            <option className="bg-slate-900 text-white">Feature Request</option>
                                            <option className="bg-slate-900 text-white">Other</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1.5 focus-within:text-white transition-colors">Message</label>
                                    <textarea
                                        id="message"
                                        rows={5}
                                        required
                                        className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-3 px-4 transition-all outline-none resize-none"
                                        placeholder="How can we help?"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </span>
                                    ) : "Send Message"}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Info Side */}
                    <div className="space-y-8 animate-slide-up opacity-0" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-4">Other Ways to Connect</h3>
                            <div className="space-y-6">
                                <a href="mailto:support@ramssorted.com" className="group block bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all">
                                    <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    </div>
                                    <div className="font-semibold text-white mb-1">Email Support</div>
                                    <div className="text-sm text-slate-400 group-hover:text-blue-300 transition-colors">support@ramssorted.com</div>
                                </a>

                                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                                    <div className="w-10 h-10 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center mb-3">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <div className="font-semibold text-white mb-1">Response Time</div>
                                    <div className="text-sm text-slate-400">Usually within 24 hours</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
