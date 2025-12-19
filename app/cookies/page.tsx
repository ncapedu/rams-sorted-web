import Footer from "../components/marketing/Footer";
import Navbar from "../components/marketing/Navbar";
import Link from "next/link";

export const metadata = {
    title: "Cookie Policy | RAMS Sorted",
    description: "How we use cookies and tracking technologies."
};

export default function CookiesPage() {
    const lastUpdated = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <main className="flex-grow pt-24 pb-16 px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-10 text-center">
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">Cookie Policy</h1>
                        <p className="text-slate-500">Last updated: {lastUpdated}</p>
                    </div>

                    <div className="prose prose-slate max-w-none text-slate-600 prose-headings:text-slate-900">
                        <p className="text-lg">
                            This Cookie Policy explains how RAMS Sorted uses cookies and similar technologies to recognize you when you visit our website.
                        </p>

                        <h3>1. What are Cookies?</h3>
                        <p>
                            Cookies are small data files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide reporting information.
                        </p>

                        <h3>2. How We Use Cookies</h3>
                        <p>
                            We use cookies for the following purposes:
                        </p>
                        <ul>
                            <li><strong>Strictly Necessary Cookies:</strong> These are essential for the website to function (e.g., logging in, security).</li>
                            <li><strong>Fraud Prevention:</strong> We may use identifiers to prevent abuse of free trials and enforce account limits. These are considered strictly necessary for the security of our service.</li>
                            <li><strong>Analytics Cookies:</strong> To help us understand how visitors interact with the site (if enabled).</li>
                        </ul>

                        <h3>3. Cookies We Use</h3>
                        <div className="not-prose mt-6 mb-8 overflow-hidden rounded-lg border border-slate-200">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-3">Category</th>
                                        <th className="px-6 py-3">Purpose</th>
                                        <th className="px-6 py-3">Duration</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    <tr>
                                        <td className="px-6 py-4 font-medium text-slate-900">Essential</td>
                                        <td className="px-6 py-4">Auth Tokens & Session Management (Login)</td>
                                        <td className="px-6 py-4">Session / Persistent</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 font-medium text-slate-900">Security / Fraud</td>
                                        <td className="px-6 py-4">Device Identification (for trial limits)</td>
                                        <td className="px-6 py-4">Persistent (1 year)</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 font-medium text-slate-900">Analytics</td>
                                        <td className="px-6 py-4">Usage metrics (e.g., Vercel Analytics)</td>
                                        <td className="px-6 py-4">Persistent</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <h3>4. Managing Cookies</h3>
                        <p>
                            Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience, and you will not be able to log in to the platform.
                        </p>
                        <p>
                            Fraud prevention cookies cannot be disabled as they are strictly necessary to prevent abuse of our service.
                        </p>

                        <h3>5. Contact</h3>
                        <p>
                            If you have any questions about our use of cookies, please contact us via our <Link href="/contact" className="text-blue-600 underline hover:text-blue-800">Support Form</Link>.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
