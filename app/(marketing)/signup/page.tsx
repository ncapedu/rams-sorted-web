import Link from "next/link";

export default function SignUpPage() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Start your free trial</h1>
            <p className="text-slate-600 mb-8 text-center max-w-md">
                Create your account to start generating professional RAMS, COSHH assessments, and toolbox talks.
            </p>
            <Link
                href="/app"
                className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
            >
                Create Account
            </Link>
        </div>
    );
}
