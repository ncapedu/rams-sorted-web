import Link from "next/link";

export const metadata = {
    title: "Privacy Policy | RAMS Sorted",
    description: "Our commitment to protecting your data."
};

export default function PrivacyPage() {
    const lastUpdated = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="pt-24 pb-16 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
                    <p className="text-slate-400">Last updated: {lastUpdated}</p>
                </div>

                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
                    <div className="prose prose-lg prose-invert max-w-none text-slate-300 prose-headings:text-white prose-p:leading-relaxed prose-a:text-blue-400 hover:prose-a:text-blue-300">
                        <p className="text-xl lead text-slate-200">
                            RAMS Sorted ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services.
                        </p>

                        <h3>1. Who We Are</h3>
                        <p>
                            RAMS Sorted is a trading name for the entity providing these services. Legal entity details will be fully updated prior to commercial launch.
                        </p>

                        <h3>2. Information We Collect</h3>
                        <p>We collect the following types of information:</p>
                        <ul>
                            <li><strong className="text-white">Account Information:</strong> Name, email address, username, and business details provided during signup.</li>
                            <li><strong className="text-white">Usage Data:</strong> Information about how you use our platform, including document generation activity and device login history.</li>
                            <li><strong className="text-white">Document Data:</strong> Content you input into RAMS, COSHH, and Toolbox Talk templates.</li>
                            <li><strong className="text-white">Technical Data:</strong> IP address, browser type, device information, and cookies.</li>
                        </ul>

                        <h3>3. How We Use Your Information</h3>
                        <p>We use your data on the following legal bases:</p>
                        <ul>
                            <li><strong className="text-white">Contract Performance:</strong> To provide the document generation services and manage your account.</li>
                            <li><strong className="text-white">Legitimate Interests:</strong> To improve our platform, prevent fraud, and ensure security.</li>
                            <li><strong className="text-white">Legal Compliance:</strong> To meet tax and regulatory obligations.</li>
                        </ul>

                        <h3>4. Data Sharing and Processors</h3>
                        <p>
                            We do not sell your data. We share data only with necessary third-party service providers who assist our operations:
                        </p>
                        <ul>
                            <li><strong className="text-white">Hosting Providers:</strong> To store and serve the application (e.g., Vercel).</li>
                            <li><strong className="text-white">Database Providers:</strong> To securely store your records.</li>
                            <li><strong className="text-white">Authentication Services:</strong> To manage secure logins.</li>
                            <li><strong className="text-white">Analytics Providers:</strong> To understand platform usage.</li>
                        </ul>

                        <h3>5. International Transfers</h3>
                        <p>
                            Some of our service providers may be located outside the UK/EEA. Where transfer occurs, we ensure appropriate safeguards (such as Standard Contractual Clauses) are in place to protect your data.
                        </p>

                        <h3>6. Data Retention</h3>
                        <p>
                            We retain your personal data only as long as necessary to provide our services and comply with legal obligations. Account data is generally retained while your account is active.
                        </p>

                        <h3>7. Your Rights</h3>
                        <p>
                            Under UK GDPR, you have the right to request access, correction, or deletion of your personal data. You may also object to processing or request data portability.
                        </p>

                        <h3>8. Contact Us</h3>
                        <p>
                            If you have questions about this policy or wish to exercise your rights, please contact us via our <Link href="/contact" className="text-blue-400 underline hover:text-blue-300">Support Form</Link>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
