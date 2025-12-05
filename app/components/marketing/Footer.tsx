import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200 py-12 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-slate-500 text-sm">
                    &copy; {new Date().getFullYear()} RAMS Sorted. All rights reserved.
                </div>

                <div className="flex items-center gap-8 text-sm text-slate-500">
                    <Link href="/privacy" className="hover:text-slate-900 transition-colors">
                        Privacy Policy
                    </Link>
                    <Link href="/terms" className="hover:text-slate-900 transition-colors">
                        Terms of Use
                    </Link>
                    <a href="mailto:support@ramssorted.co.uk" className="hover:text-slate-900 transition-colors">
                        Contact Support
                    </a>
                </div>
            </div>
        </footer>
    );
}
