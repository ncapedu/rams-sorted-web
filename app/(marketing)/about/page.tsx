
export const metadata = {
    title: "About Us | RAMS Sorted",
    description: "Learn about the mission behind RAMS Sorted - helping UK trades and contractors automate safety documentation."
};

export default function AboutPage() {
    return (
        <div className="pt-24 pb-16 px-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-slate-900 mb-6">About RAMS Sorted</h1>

                <div className="prose prose-slate lg:prose-lg">
                    <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                        We help UK trades and contractors generate professional RAMS packs without the administrative headache.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Our Mission</h2>
                    <p className="text-slate-600 mb-6">
                        Safety documentation is critical, but it shouldn't take hours of your week. We started RAMS Sorted to solve a simple problem:
                        <strong> contractors need to get on site, not get stuck in paperwork.</strong>
                    </p>
                    <p className="text-slate-600 mb-6">
                        Our platform streamlines the creation of Risk Assessments, Method Statements, and COSHH assessments, turning what used to be a generic copy-paste exercise into a specific, compliant, and professional process.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Who This Is For</h2>
                    <ul className="list-disc pl-5 space-y-2 text-slate-600 mb-6">
                        <li><strong>Electricians, Plumbers, Builders</strong> needing rapid site approval.</li>
                        <li><strong>SME Contractors</strong> who can't afford a dedicated H&S manager.</li>
                        <li><strong>Project Managers</strong> looking for consistency across their supply chain.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Core Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                            <h3 className="font-bold text-slate-900 mb-2">Speed</h3>
                            <p className="text-sm text-slate-600">Generate a full pack in minutes, not hours.</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                            <h3 className="font-bold text-slate-900 mb-2">Consistency</h3>
                            <p className="text-sm text-slate-600">Uniform, professional formatting every time.</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                            <h3 className="font-bold text-slate-900 mb-2">Focus</h3>
                            <p className="text-sm text-slate-600">Built specifically for UK construction workflows.</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                            <h3 className="font-bold text-slate-900 mb-2">Simplicity</h3>
                            <p className="text-sm text-slate-600">No complex jargon, just clear safety steps.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
