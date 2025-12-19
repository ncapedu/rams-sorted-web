import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-0 mb-6">
                            <div className="relative w-8 h-8">
                                <Image
                                    src="/rams-logo6.png"
                                    alt="RAMS Sorted Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="relative h-28 w-[28rem] -ml-[10rem] mt-1">
                                <Image
                                    src="/rams-sorted-text.png"
                                    alt="RAMS Sorted"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </Link>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                            Professional health & safety documents for UK trades. Built to save you time and keep you compliant.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-4">Product</h4>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li><Link href="/" className="hover:text-slate-900 transition-colors">Features</Link></li>
                            <li><Link href="/pricing" className="hover:text-slate-900 transition-colors">Pricing</Link></li>
                            <li><Link href="/documents" className="hover:text-slate-900 transition-colors">Sample Documents</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-4">Company</h4>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li><Link href="/about" className="hover:text-slate-900 transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-slate-900 transition-colors">Contact</Link></li>
                            <li><Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-slate-900 transition-colors">Terms & Conditions</Link></li>
                            <li><Link href="/cookies" className="hover:text-slate-900 transition-colors">Cookies</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
                    <p>© 2025 RAMS Sorted. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/terms" className="hover:text-slate-600 transition-colors">Terms</Link>
                        <Link href="/privacy" className="hover:text-slate-600 transition-colors">Privacy</Link>
                        <Link href="/cookies" className="hover:text-slate-600 transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
