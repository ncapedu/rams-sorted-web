"use client";

import { useState } from "react";

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
        <div className="pt-24 pb-16 px-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">Contact Us</h1>
                <p className="text-xl text-slate-300 mb-16 leading-relaxed">
                    Have a question or need support? We're here to help.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Contact Form */}
                    <div className="md:col-span-2">
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
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 flex justify-center items-center"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

                    {/* FAQ Sidebar */}
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl h-fit">
                        <h3 className="font-bold text-white mb-6 text-lg">Common Questions</h3>

                        <div className="space-y-8">
                            <div>
                                <h4 className="font-medium text-blue-400 text-sm mb-2">Response Time</h4>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    We aim to respond to all inquiries as quickly as possible. Please allow a standard business day for a reply.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-medium text-blue-400 text-sm mb-2">Office Hours</h4>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Monday - Friday<br />
                                    9:00 AM - 5:00 PM (UK Time)
                                </p>
                            </div>

                            <div>
                                <h4 className="font-medium text-blue-400 text-sm mb-2">Direct Email</h4>
                                <p className="text-sm text-slate-400 leading-relaxed italic">
                                    For faster routing, please use the form on this page.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
