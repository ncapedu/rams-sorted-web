import Navbar from "@/app/components/marketing/Navbar";
import Footer from "@/app/components/marketing/Footer";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-swirl font-sans text-slate-200 selection:bg-blue-500/30 selection:text-white flex flex-col relative overflow-x-hidden">
            <Navbar />
            <main className="flex-grow relative z-10">
                {children}
            </main>
            <Footer />
        </div>
    );
}
