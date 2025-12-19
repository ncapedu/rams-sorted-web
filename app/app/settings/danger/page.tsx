export default function DangerPage() {
    return (
        <div className="space-y-6 max-w-xl">
            <div>
                <h2 className="text-xl font-semibold text-red-600">Danger Zone</h2>
                <p className="text-sm text-slate-500">Irreversible actions for your account.</p>
            </div>

            <div className="border border-red-200 bg-red-50/50 rounded-xl p-6">
                <h3 className="font-semibold text-red-900 text-sm mb-1">Delete Account</h3>
                <p className="text-sm text-red-700/80 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                </p>
                <button className="px-4 py-2 bg-red-600 border border-red-700 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-sm">
                    Delete Account
                </button>
            </div>
        </div>
    );
}
