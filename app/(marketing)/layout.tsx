import Navbar from "@/app/components/marketing/Navbar";
import Footer from "@/app/components/marketing/Footer";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#fcfcfc] font-sans text-slate-900 selection:bg-blue-100 selection:text-slate-900 flex flex-col">
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}
