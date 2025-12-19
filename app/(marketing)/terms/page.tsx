import Link from "next/link";

export const metadata = {
    title: "Terms & Conditions | RAMS Sorted",
    description: "Terms of service for RAMS Sorted."
};

export default function TermsPage() {
    const lastUpdated = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="pt-24 pb-16 px-6">
            <div className="max-w-3xl mx-auto">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Terms & Conditions</h1>
                    <p className="text-slate-500">Last updated: {lastUpdated}</p>
                </div>

                <div className="prose prose-slate max-w-none text-slate-600 prose-headings:text-slate-900">
                    <p className="text-lg">
                        Welcome to RAMS Sorted. By accessing or using our platform, you agree to comply with and be bound by these Terms and Conditions.
                    </p>

                    <h3>1. The Service</h3>
                    <p>
                        RAMS Sorted provides software tools to assist in the generation of Risk Assessments, Method Statements, COSHH assessments, and Toolbox Talks.
                    </p>

                    <h3>2. User Responsibilities</h3>
                    <p>
                        <strong>You remain solely responsible for the content of your documents.</strong> While our tool provides templates and suggested content, you must verify that all outputs are suitable for your specific site conditions, work activities, and local regulations. RAMS Sorted does not provide legal or professional health and safety advice.
                    </p>

                    <h3>3. Account Security</h3>
                    <p>
                        You are responsible for maintaining the confidentiality of your login credentials. You must notify us immediately of any unauthorized use of your account. We reserve the right to suspend accounts that exhibit suspicious activity or violate these terms.
                    </p>

                    <h3>4. Subscriptions and Billing</h3>
                    <p>
                        Access to premium features may require a paid subscription.
                    </p>
                    <ul>
                        <li><strong>Free Trials:</strong> We may offer free trials at our discretion. We reserve the right to limit trial eligibility to prevent abuse (e.g., one trial per device).</li>
                        <li><strong>Payments:</strong> If paid plans are enabled, fees are billed in advance. All payments are non-refundable unless otherwise required by law.</li>
                    </ul>

                    <h3>5. Acceptable Use</h3>
                    <p>
                        You agree not to:
                    </p>
                    <ul>
                        <li>Use the platform for any illegal purpose.</li>
                        <li>Attempt to reverse engineer or compromise the system security.</li>
                        <li>Create multiple accounts to bypass trial limits or usage restrictions.</li>
                    </ul>

                    <h3>6. Limitation of Liability</h3>
                    <p>
                        To the maximum extent permitted by law, RAMS Sorted shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service. Our total liability for any claim shall not exceed the amount paid by you for the service in the 12 months preceding the claim.
                    </p>

                    <h3>7. Termination</h3>
                    <p>
                        We may terminate or suspend your access immediately, without prior notice, if you breach these Terms. Upon termination, your right to use the Service will cease immediately.
                    </p>

                    <h3>8. Governing Law</h3>
                    <p>
                        These Terms shall be governed by and construed in accordance with the laws of the United Kingdom. Any disputes shall be subject to the exclusive jurisdiction of the courts of the United Kingdom.
                    </p>

                    <h3>9. Contact</h3>
                    <p>
                        If you have any questions about these Terms, please contact us via our <Link href="/contact" className="text-blue-600 underline hover:text-blue-800">Support Form</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}
