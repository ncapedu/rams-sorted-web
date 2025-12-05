import Link from "next/link";

export default function SignInPage() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Sign In</h1>
            <p className="text-slate-600 mb-8 text-center max-w-md">
                Access your RAMS Sorted dashboard to manage your documents.
            </p>
            <Link
                href="/app"
                className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
            >
                Go to Dashboard
            </Link>
        </div>
    );
}
