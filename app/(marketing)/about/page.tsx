
export const metadata = {
    title: "About Us | RAMS Sorted",
    description: "Learn about the mission behind RAMS Sorted - helping UK trades and contractors automate safety documentation."
};

export default function AboutPage() {
    return (
        <div className="pt-24 pb-16 px-6 min-h-screen bg-swirl">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-6">About RAMS Sorted</h1>

                <div className="space-y-8">
                    <p className="text-xl text-slate-300 leading-relaxed">
                        We help UK trades and contractors generate professional RAMS packs without the administrative headache.
                    </p>

                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-white mt-0 mb-4">Our Mission</h2>
                        <p className="text-slate-300 mb-4 leading-relaxed">
                            Safety documentation is critical, but it shouldn&apos;t take hours of your week. We started RAMS Sorted to solve a simple problem:
                            <strong className="text-white"> contractors need to get on site, not get stuck in paperwork.</strong>
                        </p>
                        <p className="text-slate-300 leading-relaxed">
                            Our platform streamlines the creation of Risk Assessments, Method Statements, and COSHH assessments, turning what used to be a generic copy-paste exercise into a specific, compliant, and professional process.
                        </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Who This Is For</h2>
                        <ul className="space-y-3 text-slate-300">
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2.5 shrink-0"></span>
                                <span><strong className="text-white">Electricians, Plumbers, Builders</strong> needing rapid site approval.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2.5 shrink-0"></span>
                                <span><strong className="text-white">SME Contractors</strong> who can&apos;t afford a dedicated H&S manager.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2.5 shrink-0"></span>
                                <span><strong className="text-white">Project Managers</strong> looking for consistency across their supply chain.</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6">Core Values</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all">
                                <h3 className="font-bold text-white mb-2">Speed</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">Generate a full pack in minutes, not hours.</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all">
                                <h3 className="font-bold text-white mb-2">Consistency</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">Uniform, professional formatting every time.</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all">
                                <h3 className="font-bold text-white mb-2">Focus</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">Built specifically for UK construction workflows.</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all">
                                <h3 className="font-bold text-white mb-2">Simplicity</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">No complex jargon, just clear safety steps.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
