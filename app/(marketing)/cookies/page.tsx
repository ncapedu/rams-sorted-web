import Link from "next/link";

export const metadata = {
    title: "Cookie Policy | RAMS Sorted",
    description: "How we use cookies and tracking technologies."
};

export default function CookiesPage() {
    const lastUpdated = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="pt-24 pb-16 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Cookie Policy</h1>
                    <p className="text-slate-400">Last updated: {lastUpdated}</p>
                </div>

                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
                    <div className="prose prose-lg prose-invert max-w-none text-slate-300 prose-headings:text-white prose-p:leading-relaxed prose-a:text-blue-400 hover:prose-a:text-blue-300">
                        <p className="text-xl lead text-slate-200">
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
                            <li><strong className="text-white">Strictly Necessary Cookies:</strong> These are essential for the website to function (e.g., logging in, security).</li>
                            <li><strong className="text-white">Fraud Prevention:</strong> We may use identifiers to prevent abuse of free trials and enforce account limits. These are considered strictly necessary for the security of our service.</li>
                            <li><strong className="text-white">Analytics Cookies:</strong> To help us understand how visitors interact with the site (if enabled).</li>
                        </ul>

                        <h3>3. Cookies We Use</h3>
                        <div className="not-prose mt-8 mb-10 overflow-hidden rounded-xl border border-white/10">
                            <table className="w-full text-left text-sm text-slate-300">
                                <thead className="bg-white/10 text-white font-semibold border-b border-white/10">
                                    <tr>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Purpose</th>
                                        <th className="px-6 py-4">Duration</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10 bg-white/5">
                                    <tr>
                                        <td className="px-6 py-4 font-medium text-white">Essential</td>
                                        <td className="px-6 py-4">Auth Tokens & Session Management (Login)</td>
                                        <td className="px-6 py-4">Session / Persistent</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 font-medium text-white">Security / Fraud</td>
                                        <td className="px-6 py-4">Device Identification (for trial limits)</td>
                                        <td className="px-6 py-4">Persistent (1 year)</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 font-medium text-white">Analytics</td>
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
                            If you have questions about our use of cookies, please contact us via our <Link href="/contact" className="text-blue-400 underline hover:text-blue-300">Support Form</Link>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
