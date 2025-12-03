"use client";

import { useState, useRef, useEffect } from "react";
import {
    Loader2,
    MapPin,
    Briefcase,
    Info,
    FileText,
    Beaker,
    Shield,
    Clock,
    CheckSquare,
    Trash2
} from "lucide-react";
import TypewriterText from "./TypewriterText";
import { SignStrip } from "./SignStrip";
import { PPE_ICON_MAP, GHS_ICON_MAP, mapStringToPpeType, mapStringToHazardClass } from "../lib/safety-icons";
import { COSHH_LIBRARY, PPE_DEFINITIONS } from "../lib/rams-content";
import Toast, { ToastType } from "./Toast";
import AnimatedTitle from "./AnimatedTitle";
import { RAMSFile } from "./MyFileViewer";
import { generateCOSHHHTML } from "../lib/rams-generation";

// --- SMALL TEXT SANITISER ---
function sanitizeText(input: any): string {
    if (!input || typeof input !== "string") return "";
    return input
        .replace(/\r\n/g, "\n")
        .replace(/\n{2,}/g, "\n")
        .replace(/[ \t]+/g, " ")
        .replace(/ ?([.,;:!?])/g, "$1")
        .trim();
}

// --- UI COMPONENTS ---
const Tooltip = ({ text }: { text: string }) => (
    <div className="group relative inline-block ml-2">
        <Info className="w-4 h-4 text-gray-400 hover:text-black cursor-help transition-colors" />
        <div className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-black text-white text-xs rounded-md shadow-xl z-50 text-center leading-relaxed border border-gray-800">
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black" />
        </div>
    </div>
);

function AddressSearch({
    label,
    value,
    onChange,
    tooltip,
    required,
}: any) {
    const [query, setQuery] = useState(value);
    const [results, setResults] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        setQuery(value);
    }, [value]);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const searchAddress = (text: string) => {
        setQuery(text);
        onChange(text);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        if (text.length > 4) {
            timeoutRef.current = setTimeout(async () => {
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                            text
                        )}&countrycodes=gb&limit=5`,
                        {
                            headers: {
                                "User-Agent": "RAMS-Sorted-Web/1.0",
                            },
                        }
                    );
                    if (!res.ok) throw new Error("Network response was not ok");
                    const data = await res.json();
                    setResults(data);
                    setShowDropdown(true);
                } catch (e) {
                    console.warn("Address search failed:", e);
                    setResults([]);
                }
            }, 500);
        } else {
            setResults([]);
            setShowDropdown(false);
        }
    };

    return (
        <div className="relative group">
            <label className="flex items-center text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                {label}
                {required && <span className="text-red-600 ml-1">*</span>}
                {tooltip && <Tooltip text={tooltip} />}
            </label>
            <div className="relative">
                <input
                    className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none transition-all shadow-sm bg-white"
                    placeholder="Start typing address..."
                    value={query}
                    onChange={(e) => searchAddress(e.target.value)}
                />
                <MapPin className="w-4 h-4 absolute right-3 top-3.5 text-gray-400" />
            </div>
            {showDropdown && results.length > 0 && (
                <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-2xl mt-1 max-h-60 overflow-auto">
                    {results.map((r: any, i: number) => (
                        <li
                            key={i}
                            onClick={() => {
                                setQuery(r.display_name);
                                onChange(r.display_name);
                                setShowDropdown(false);
                            }}
                            className="p-3 hover:bg-gray-50 cursor-pointer text-xs border-b last:border-0 text-gray-700 leading-tight"
                        >
                            {r.display_name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

interface CoshhWizardProps {
    onBack: () => void;
    onSave: (file: RAMSFile) => void;
}

// --- MAIN COSHH WIZARD COMPONENT ---
export default function CoshhWizard({ onBack, onSave }: CoshhWizardProps) {
    const [step, setStep] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);

    const [formData, setFormData] = useState({
        // Step 0: Basics
        documentName: "",
        userType: "" as "company" | "sole_trader" | "",

        // Step 1: Project
        companyName: "",
        assessorName: "",
        clientName: "",
        projectRef: "",
        siteAddress: "",
        assessmentDate: new Date().toISOString().split("T")[0],
        reviewDate: "",

        // Step 2: Substances
        selectedSubstances: [] as { name: string; hazard: string; control: string }[],
        customSubstances: [] as { name: string; hazard: string; control: string }[],

        // Step 3: Context
        workActivity: "",
        exposureDuration: "",
        exposureFrequency: "",
        personsExposed: [] as string[],

        // Step 4: Controls
        ppe: [] as string[],
        emergencyProcedures: "",
        additionalControls: "",
    });

    const [substanceSearch, setSubstanceSearch] = useState("");
    const [substanceSearchOpen, setSubstanceSearchOpen] = useState(false);

    // Flatten COSHH Library for search
    const allSubstances = Object.entries(COSHH_LIBRARY).flatMap(([category, items]) =>
        items.map(item => ({ ...item, category }))
    );

    const filteredSubstances = substanceSearch.trim().length < 2
        ? []
        : allSubstances.filter(s =>
            s.substance.toLowerCase().includes(substanceSearch.toLowerCase())
        ).slice(0, 8);

    const handleInput = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const togglePersonExposed = (person: string) => {
        setFormData(prev => {
            const current = prev.personsExposed;
            return {
                ...prev,
                personsExposed: current.includes(person)
                    ? current.filter(p => p !== person)
                    : [...current, person]
            };
        });
    };

    const togglePPE = (item: string) => {
        setFormData(prev => {
            const current = prev.ppe;
            return {
                ...prev,
                ppe: current.includes(item)
                    ? current.filter(p => p !== item)
                    : [...current, item]
            };
        });
    };

    const addSubstance = (substance: { name: string; hazard: string; control: string }) => {
        if (formData.selectedSubstances.some(s => s.name === substance.name)) return;
        setFormData(prev => ({
            ...prev,
            selectedSubstances: [...prev.selectedSubstances, substance]
        }));
        setSubstanceSearch("");
        setSubstanceSearchOpen(false);
    };

    const removeSubstance = (name: string) => {
        setFormData(prev => ({
            ...prev,
            selectedSubstances: prev.selectedSubstances.filter(s => s.name !== name)
        }));
    };

    const nextStep = () => {
        let errorMsg = "";

        if (step === 0) {
            if (!formData.documentName) {
                errorMsg = "Please enter a document name.";
            } else if (!formData.userType) {
                errorMsg = "Please select whether you are a Business or Sole Trader.";
            }
        } else if (step === 1) {
            if (formData.selectedSubstances.length === 0 && formData.customSubstances.length === 0) {
                errorMsg = "Please select or add at least one substance.";
            }
        } else if (step === 2) {
            if (!formData.projectRef || !formData.clientName) {
                errorMsg = "Please enter the project and client details.";
            }
        } else if (step === 3) {
            if (!formData.workActivity || !formData.exposureDuration || !formData.exposureFrequency) {
                errorMsg = "Please describe the activity, duration, and frequency of exposure.";
            }
        } else if (step === 4) {
            if (formData.ppe.length === 0) {
                errorMsg = "Please select at least one required PPE.";
            } else if (!formData.emergencyProcedures.trim()) {
                errorMsg = "Please enter emergency procedures.";
            }
        }

        if (errorMsg) {
            setToast({ msg: errorMsg, type: "error" });
            return;
        }

        setStep(prev => prev + 1);
    };

    const prevStep = () => setStep(prev => prev - 1);

    const generateCOSHH = async () => {
        setIsGenerating(true);
        try {
            const res = await fetch("/api/generate-coshh", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Generation failed");
            }

            const apiRes = await res.json();
            const htmlContent = await generateCOSHHHTML(apiRes.data);

            const newFile: RAMSFile = {
                id: Date.now().toString(),
                name: formData.documentName || "COSHH Assessment",
                createdAt: new Date().toLocaleString(),
                content: htmlContent,
            };

            onSave(newFile);
        } catch (e: any) {
            console.error("COSHH Generation Error:", e);
            setToast({ msg: e.message || "Failed to generate COSHH", type: "error" });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
            {toast && (
                <Toast
                    message={toast.msg}
                    type={toast.type}
                    onClose={() => setToast(null)}
                    duration={4000}
                />
            )}

            {/* HEADER */}
            {!isGenerating && (
                <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <img src="/favicon.ico" alt="RS" className="w-5 h-5" />
                            <AnimatedTitle text="v1.0" />
                        </h2>
                        <p className="text-sm font-bold text-black mt-0.5">
                            Step {step} of 5
                        </p>
                    </div>
                    {/* Removed top-left Exit Wizard button as requested */}
                </div>
            )}

            {/* PROGRESS BAR */}
            {/* PROGRESS BAR */}
            {!isGenerating && (
                <div className="h-1.5 w-full bg-slate-200">
                    <div
                        className="h-full bg-blue-700 transition-all duration-500 ease-out"
                        style={{ width: `${step === 0 ? 0 : (step / 5) * 100}%` }}
                    />
                </div>
            )}

            {/* MAIN CONTENT */}
            <div className="flex-1 overflow-y-auto">
                {isGenerating ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20"></div>
                            <Loader2 className="w-16 h-16 animate-spin text-blue-700 relative z-10" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-wide text-slate-800 h-8 text-center">
                            <TypewriterText
                                messages={[
                                    "Analyzing substances...",
                                    "Evaluating exposure risks...",
                                    "Determining control measures...",
                                    "Formatting assessment...",
                                    "Finalizing document...",
                                ]}
                                loop={true}
                            />
                        </h2>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto px-6 py-8 rs-fade-slide-in" key={step}>

                        {/* STEP 0: SETUP */}
                        {step === 0 && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                                        <Beaker className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-slate-900">
                                        <TypewriterText messages={["Set Up Your COSHH Assessment"]} loop={false} />
                                    </h2>
                                </div>

                                <div className="space-y-6 max-w-2xl">
                                    {/* Document name */}
                                    <div className="space-y-2">
                                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                                            Assessment Name <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            className="border border-slate-200 p-3 rounded-lg w-full text-sm focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none bg-white shadow-sm hover:border-slate-300 transition-all duration-200"
                                            placeholder="e.g. Paint Stripping - Block A"
                                            value={formData.documentName}
                                            onChange={(e) => handleInput("documentName", e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && nextStep()}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                                            Who are you?
                                        </label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                onClick={() => handleInput("userType", "company")}
                                                className={`p-4 rounded-xl border-2 text-left transition-all ${formData.userType === "company"
                                                    ? "border-blue-700 bg-blue-50/50 ring-1 ring-blue-700"
                                                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                                    }`}
                                            >
                                                <div className={`font-bold text-sm mb-1 ${formData.userType === "company" ? "text-blue-800" : "text-slate-900"}`}>Business</div>
                                                <div className="text-[11px] text-slate-500 leading-tight">
                                                    Company with employees
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => handleInput("userType", "sole_trader")}
                                                className={`p-4 rounded-xl border-2 text-left transition-all ${formData.userType === "sole_trader"
                                                    ? "border-blue-700 bg-blue-50/50 ring-1 ring-blue-700"
                                                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                                    }`}
                                            >
                                                <div className={`font-bold text-sm mb-1 ${formData.userType === "sole_trader" ? "text-blue-800" : "text-slate-900"}`}>Sole Trader</div>
                                                <div className="text-[11px] text-slate-500 leading-tight">
                                                    Independent / Self-employed
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 1: SUBSTANCES */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                                        <Beaker className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-slate-900">
                                        Identify Substances
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700">
                                        Search Library
                                    </label>
                                    <div className="flex gap-2 relative">
                                        <div className="relative flex-1">
                                            <input
                                                className="w-full border border-slate-300 p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                                                placeholder="Search for substances (e.g. dust, cement, adhesive)..."
                                                value={substanceSearch}
                                                onChange={(e) => {
                                                    setSubstanceSearch(e.target.value);
                                                    setSubstanceSearchOpen(true);
                                                }}
                                                onFocus={() => setSubstanceSearchOpen(true)}
                                            />
                                            {substanceSearchOpen && filteredSubstances.length > 0 && (
                                                <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-xl mt-1 max-h-60 overflow-auto">
                                                    {filteredSubstances.map((s, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => addSubstance({ name: s.substance, hazard: s.hazard, control: s.control })}
                                                            className="w-full text-left p-3 hover:bg-blue-50 border-b last:border-0 transition-colors"
                                                        >
                                                            <div className="font-semibold text-sm text-slate-900">{s.substance}</div>
                                                            <div className="text-xs text-slate-500">{s.hazard}</div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="relative">
                                            <button
                                                onClick={() => setSubstanceSearchOpen(!substanceSearchOpen && substanceSearch === "BROWSE_ALL")}
                                                className="h-full px-4 bg-slate-100 border border-slate-300 rounded-lg text-slate-700 font-semibold text-sm hover:bg-slate-200 transition-colors whitespace-nowrap"
                                                onMouseDown={() => {
                                                    if (substanceSearch === "BROWSE_ALL") {
                                                        setSubstanceSearch("");
                                                    } else {
                                                        setSubstanceSearch("BROWSE_ALL");
                                                    }
                                                }}
                                            >
                                                Browse Library
                                            </button>

                                            {substanceSearch === "BROWSE_ALL" && (
                                                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto p-2">
                                                    {Object.entries(COSHH_LIBRARY).map(([category, items]) => (
                                                        <div key={category} className="mb-2 last:mb-0">
                                                            <div className="px-2 py-1.5 bg-slate-50 text-xs font-bold uppercase text-slate-500 rounded-md mb-1 sticky top-0">
                                                                {category.replace(/_/g, " ")}
                                                            </div>
                                                            <div className="space-y-0.5">
                                                                {items.map((item, idx) => (
                                                                    <button
                                                                        key={idx}
                                                                        onClick={() => {
                                                                            addSubstance({ name: item.substance, hazard: item.hazard, control: item.control });
                                                                            setSubstanceSearch("");
                                                                        }}
                                                                        className="w-full text-left px-2 py-1.5 hover:bg-blue-50 rounded text-sm text-slate-700 hover:text-blue-600 transition-colors truncate"
                                                                        title={item.substance}
                                                                    >
                                                                        {item.substance}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Selected Substances */}
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-semibold text-slate-900">Selected Substances:</h3>
                                        {formData.selectedSubstances.length === 0 ? (
                                            <p className="text-sm text-slate-500 italic">No substances selected yet.</p>
                                        ) : (
                                            <div className="grid gap-2">
                                                {formData.selectedSubstances.map((s, i) => (
                                                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                                                        <div>
                                                            <div className="font-medium text-sm text-slate-900">{s.name}</div>
                                                            <div className="text-xs text-slate-500">{s.hazard}</div>
                                                            <SignStrip
                                                                icons={[mapStringToHazardClass(s.hazard)].filter(h => h).map(h => GHS_ICON_MAP[h!])}
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => removeSubstance(s.name)}
                                                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: PROJECT & OWNER */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                                        <Briefcase className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-slate-900">
                                        <TypewriterText messages={["Project & Owner Details"]} loop={false} />
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                                            {formData.userType === "company" ? "Company Name" : "Trading Name"} <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            className="w-full border border-slate-200 p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                                            placeholder={formData.userType === "company" ? "Your Company Ltd" : "John Smith T/A JS Plumbing"}
                                            value={formData.companyName}
                                            onChange={(e) => handleInput("companyName", e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                                            Assessor Name <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            className="w-full border border-slate-200 p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                                            placeholder="Name of Assessor"
                                            value={formData.assessorName}
                                            onChange={(e) => handleInput("assessorName", e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                                            Client Name <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            className="w-full border border-slate-200 p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                                            placeholder="Client Name"
                                            value={formData.clientName}
                                            onChange={(e) => handleInput("clientName", e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                                            Project Ref (Optional)
                                        </label>
                                        <input
                                            className="w-full border border-slate-200 p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                                            placeholder="e.g. PRJ-123"
                                            value={formData.projectRef}
                                            onChange={(e) => handleInput("projectRef", e.target.value)}
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <AddressSearch
                                            label="Site Address"
                                            value={formData.siteAddress}
                                            onChange={(val: string) => handleInput("siteAddress", val)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                                            Assessment Date
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full border border-slate-200 p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                                            value={formData.assessmentDate}
                                            onChange={(e) => handleInput("assessmentDate", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: EXPOSURE & CONTEXT */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-slate-900">
                                        <TypewriterText messages={["Exposure & Work Context"]} loop={false} />
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                                            Work Activity Description <span className="text-red-600">*</span>
                                        </label>
                                        <textarea
                                            className="w-full border border-slate-200 p-3 rounded-lg h-32 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                                            placeholder="Describe how the substances are used..."
                                            value={formData.workActivity}
                                            onChange={(e) => handleInput("workActivity", e.target.value)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                                                Duration of Exposure <span className="text-red-600">*</span>
                                            </label>
                                            <input
                                                className="w-full border border-slate-200 p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                                                placeholder="e.g. 2 hours"
                                                value={formData.exposureDuration}
                                                onChange={(e) => handleInput("exposureDuration", e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                                                Frequency of Exposure <span className="text-red-600">*</span>
                                            </label>
                                            <input
                                                className="w-full border border-slate-200 p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                                                placeholder="e.g. Daily"
                                                value={formData.exposureFrequency}
                                                onChange={(e) => handleInput("exposureFrequency", e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-2">
                                            Persons Exposed
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {["Employees", "Contractors", "Public", "Visitors"].map(p => (
                                                <button
                                                    key={p}
                                                    onClick={() => togglePersonExposed(p)}
                                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${formData.personsExposed.includes(p)
                                                        ? "bg-blue-600 text-white border-blue-600"
                                                        : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                                                        }`}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 4: CONTROLS & PPE */}
                        {step === 4 && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-slate-900">
                                        <TypewriterText messages={["Controls & PPE"]} loop={false} />
                                    </h2>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-2">
                                            Required PPE
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {Object.entries(PPE_DEFINITIONS).map(([key, def]) => (
                                                <button
                                                    key={key}
                                                    onClick={() => togglePPE(def.item)}
                                                    className={`p-3 rounded-lg border text-left transition-all ${formData.ppe.includes(def.item)
                                                        ? "bg-blue-50 border-blue-600 ring-1 ring-blue-600"
                                                        : "bg-white border-slate-200 hover:border-blue-300"
                                                        }`}
                                                >
                                                    <div className="font-semibold text-xs text-slate-900">{def.item}</div>
                                                    <div className="text-[10px] text-slate-500 mt-0.5">{def.reason}</div>
                                                </button>
                                            ))}
                                        </div>
                                        <SignStrip
                                            icons={formData.ppe
                                                .map(p => mapStringToPpeType(p))
                                                .filter((t): t is keyof typeof PPE_ICON_MAP => t !== null)
                                                .map(t => PPE_ICON_MAP[t])
                                            }
                                            label="Mandatory PPE Signs"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                                            Additional Control Measures (Optional but Recommended)
                                        </label>
                                        <textarea
                                            className="w-full border border-slate-200 p-3 rounded-lg h-24 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                                            placeholder="Any specific engineering controls or safe systems of work..."
                                            value={formData.additionalControls}
                                            onChange={(e) => handleInput("additionalControls", e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                                            Emergency Procedures (Optional but Recommended)
                                        </label>
                                        <textarea
                                            className="w-full border border-slate-200 p-3 rounded-lg h-24 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                                            placeholder="First aid, spillage procedures, fire response..."
                                            value={formData.emergencyProcedures}
                                            onChange={(e) => handleInput("emergencyProcedures", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 5: REVIEW */}
                        {step === 5 && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                                        <CheckSquare className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-slate-900">
                                        <TypewriterText messages={["Review & Generate"]} loop={false} />
                                    </h2>
                                </div>

                                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-6">
                                    {/* Project Details */}
                                    <div className="grid grid-cols-2 gap-4 text-sm border-b border-slate-200 pb-4">
                                        <div>
                                            <span className="text-slate-500 block text-xs uppercase tracking-wide mb-1">Document Name</span>
                                            <span className="font-semibold text-slate-900">{formData.documentName}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 block text-xs uppercase tracking-wide mb-1">Company / User</span>
                                            <span className="font-semibold text-slate-900">{formData.companyName} <span className="text-slate-400 font-normal">({formData.userType === "company" ? "Business" : "Sole Trader"})</span></span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 block text-xs uppercase tracking-wide mb-1">Client & Project</span>
                                            <span className="font-semibold text-slate-900">{formData.clientName} {formData.projectRef && <span className="text-slate-500">({formData.projectRef})</span>}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 block text-xs uppercase tracking-wide mb-1">Assessment Date</span>
                                            <span className="font-semibold text-slate-900">{formData.assessmentDate}</span>
                                        </div>
                                    </div>

                                    {/* Substances */}
                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 flex items-center gap-2">
                                            <Beaker className="w-3.5 h-3.5" /> Selected Substances ({formData.selectedSubstances.length})
                                        </h4>
                                        <div className="grid gap-2">
                                            {formData.selectedSubstances.map((s, i) => (
                                                <div key={i} className="bg-white p-2.5 rounded border border-slate-200 text-sm flex justify-between items-center">
                                                    <span className="font-medium text-slate-800">{s.name}</span>
                                                    <span className="text-xs text-slate-500 max-w-[50%] text-right truncate">{s.hazard}</span>
                                                </div>
                                            ))}
                                            {formData.selectedSubstances.length === 0 && <p className="text-sm text-slate-400 italic">No substances selected.</p>}
                                        </div>
                                    </div>

                                    {/* Activity Context */}
                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-slate-500 mb-2 flex items-center gap-2">
                                            <Briefcase className="w-3.5 h-3.5" /> Work Activity
                                        </h4>
                                        <p className="text-sm text-slate-700 bg-white p-3 rounded border border-slate-200 whitespace-pre-wrap">
                                            {formData.workActivity || "No description provided."}
                                        </p>
                                        <div className="flex gap-4 mt-2 text-xs text-slate-600">
                                            <span><strong>Duration:</strong> {formData.exposureDuration}</span>
                                            <span><strong>Frequency:</strong> {formData.exposureFrequency}</span>
                                            <span><strong>Exposed:</strong> {formData.personsExposed.join(", ") || "None selected"}</span>
                                        </div>
                                    </div>

                                    {/* Controls & PPE */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="text-xs font-bold uppercase text-slate-500 mb-2 flex items-center gap-2">
                                                <Shield className="w-3.5 h-3.5" /> PPE Required
                                            </h4>
                                            <div className="flex flex-wrap gap-1.5">
                                                {formData.ppe.length > 0 ? formData.ppe.map(p => (
                                                    <span key={p} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-700">
                                                        {p}
                                                    </span>
                                                )) : <span className="text-sm text-slate-400 italic">No PPE selected</span>}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Additional Controls</h4>
                                            <p className="text-xs text-slate-600 bg-white p-2 rounded border border-slate-200 min-h-[40px]">
                                                {formData.additionalControls || "None specified."}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Emergency */}
                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Emergency Procedures</h4>
                                        <p className="text-xs text-slate-600 bg-white p-2 rounded border border-slate-200 min-h-[40px]">
                                            {formData.emergencyProcedures || "Standard site procedures apply."}
                                        </p>
                                    </div>
                                </div>
                                <SignStrip
                                    icons={formData.ppe
                                        .map(p => mapStringToPpeType(p))
                                        .filter((t): t is keyof typeof PPE_ICON_MAP => t !== null)
                                        .map(t => PPE_ICON_MAP[t])
                                    }
                                    label="Mandatory PPE Signs"
                                />
                            </div>
                        )}

                        {/* NAVIGATION BUTTONS */}
                        <div className="flex justify-between gap-3 pt-4 mt-8">
                            <div className="flex gap-2 pt-2">
                                {step > 0 && (
                                    <button
                                        onClick={prevStep}
                                        className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                                    >
                                        Back
                                    </button>
                                )}
                                <button
                                    onClick={onBack}
                                    className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    {step === 0 ? "Back to RS Hub" : "← Back to RS Hub"}
                                </button>
                            </div>

                            {step < 5 ? (
                                <button
                                    onClick={nextStep}
                                    className="inline-flex items-center justify-center rounded-lg bg-[#0b2040] px-5 py-2.5 text-sm font-semibold text-white hover:bg-black transition-colors"
                                >
                                    Next Step
                                </button>
                            ) : (
                                <button
                                    onClick={generateCOSHH}
                                    disabled={isGenerating}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isGenerating ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <FileText className="w-4 h-4" />
                                    )}
                                    {isGenerating
                                        ? "Generating..."
                                        : "Generate & Open"}
                                </button>
                            )}
                        </div>

                    </div>
                )}

            </div>
        </div >
    );
}
