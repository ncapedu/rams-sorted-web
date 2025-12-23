import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-transparent border-t border-white/10 pt-10 pb-8 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-0 mb-6">
                            <div className="relative w-14 h-14">
                                <Image
                                    src="/rams-logo6.png"
                                    alt="RAMS Sorted Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </Link>
                        <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
                            Professional health & safety documents for UK trades. Built to save you time and keep you compliant.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-3 text-sm">Product</h4>
                        <ul className="space-y-2 text-xs text-slate-400">
                            <li><Link href="/" className="hover:text-white transition-colors">Features</Link></li>
                            <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                            <li><Link href="/documents" className="hover:text-white transition-colors">Sample Documents</Link></li>
                            <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-3 text-sm">Company</h4>
                        <ul className="space-y-2 text-xs text-slate-400">
                            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                            <li><Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-3 text-sm">Contact</h4>
                        <ul className="space-y-2 text-xs text-slate-400">
                            <li>
                                <a href="mailto:support@ramssorted.com" className="hover:text-white transition-colors">
                                    support@ramssorted.com
                                </a>
                            </li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Form</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
                    <p>© {new Date().getFullYear()} RAMS Sorted. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
