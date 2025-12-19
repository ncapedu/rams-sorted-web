"use client";

import { useState } from "react";
import Footer from "../components/marketing/Footer";
import Navbar from "../components/marketing/Navbar";

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
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <main className="flex-grow pt-24 pb-16 px-6">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Contact Us</h1>
                    <p className="text-xl text-slate-600 mb-12">
                        Have a question or need support? We're here to help.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Contact Form */}
                        <div className="md:col-span-2">
                            {submitted ? (
                                <div className="bg-green-50 border border-green-100 rounded-lg p-8 text-center animate-in fade-in zoom-in duration-300">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-green-900 mb-2">Message Received</h3>
                                    <p className="text-green-700 mb-4">
                                        Thanks for reaching out! Your reference ID is <span className="font-mono font-bold">#{Math.floor(Math.random() * 100000)}</span>.
                                    </p>
                                    <p className="text-green-600 text-sm">
                                        We'll get back to you shortly.
                                    </p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="mt-6 text-green-700 font-medium hover:text-green-900 underline"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                            <input
                                                type="text"
                                                id="name"
                                                required
                                                className="w-full rounded-md border-slate-300 shadow-sm focus:border-red-500 focus:ring-red-500 py-3 px-4 border"
                                                placeholder="Joe Bloggs"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                required
                                                className="w-full rounded-md border-slate-300 shadow-sm focus:border-red-500 focus:ring-red-500 py-3 px-4 border"
                                                placeholder="joe@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                                        <select
                                            id="subject"
                                            className="w-full rounded-md border-slate-300 shadow-sm focus:border-red-500 focus:ring-red-500 py-3 px-4 border bg-white"
                                        >
                                            <option>Account Support</option>
                                            <option>Billing Question</option>
                                            <option>Feature Request</option>
                                            <option>Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                                        <textarea
                                            id="message"
                                            rows={5}
                                            required
                                            className="w-full rounded-md border-slate-300 shadow-sm focus:border-red-500 focus:ring-red-500 py-3 px-4 border"
                                            placeholder="How can we help?"
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-[#390404] text-white font-semibold py-3 px-6 rounded-md hover:bg-black transition-colors disabled:opacity-70 flex justify-center items-center"
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
                        <div className="bg-slate-50 p-6 rounded-lg h-fit border border-slate-100">
                            <h3 className="font-bold text-slate-900 mb-4 text-lg">Common Questions</h3>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-medium text-slate-900 text-sm">Response Time</h4>
                                    <p className="text-sm text-slate-600 mt-1">
                                        We aim to respond to all inquiries as quickly as possible. Please allow a standard business day for a reply.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-medium text-slate-900 text-sm">Office Hours</h4>
                                    <p className="text-sm text-slate-600 mt-1">
                                        Monday - Friday<br />
                                        9:00 AM - 5:00 PM (UK Time)
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-medium text-slate-900 text-sm">Direct Email</h4>
                                    <p className="text-sm text-slate-600 mt-1 italic">
                                        For faster routing, please use the form on this page.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
