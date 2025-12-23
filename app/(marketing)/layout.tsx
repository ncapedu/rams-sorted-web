"use client";

import Navbar from "@/app/components/marketing/Navbar";
import Footer from "@/app/components/marketing/Footer";
import { usePathname } from "next/navigation";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isHome = pathname === "/";

    // If home, use Blue/Slate (bg-home-swirl) as the underlying layout/footer color
    // Else use the default Red/Slate (bg-swirl)
    const bgClass = isHome ? "bg-home-swirl" : "bg-swirl";

    return (
        <div className={`min-h-screen ${bgClass} font-sans text-slate-200 selection:bg-blue-500/30 selection:text-white flex flex-col relative overflow-x-hidden transition-colors duration-700`}>
            <Navbar />
            <main className="flex-grow relative z-10">
                {children}
            </main>
            <Footer />
        </div>
    );
}
