export default function BillingPage() {
    return (
        <div className="space-y-6 max-w-xl">
            <div>
                <h2 className="text-xl font-semibold text-slate-900">Billing & Subscription</h2>
                <p className="text-sm text-slate-500">Manage your subscription plan and payment methods.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center space-y-3">
                <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                </div>
                <h3 className="font-semibold text-slate-900">Free Trial Active</h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto">
                    You are currently on the trial plan. You will be asked to add a payment method when your trial expires.
                </p>
                <div className="pt-4">
                    <button disabled className="px-4 py-2 bg-slate-200 text-slate-500 rounded-lg text-sm font-medium cursor-not-allowed">
                        Manage Subscription
                    </button>
                    <p className="text-[10px] text-slate-400 mt-2">Stripe integration coming soon.</p>
                </div>
            </div>
        </div>
    );
}
