"use client";

import { useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    ChevronRight,
    Clipboard,
    FileText,
    AlertTriangle,
    Users,
    Mic,
    Shield,
    CheckSquare,
    Loader2,
    Info
} from "lucide-react";
import AnimatedTitle from "./AnimatedTitle";
import TypewriterText from "./TypewriterText";
import { ToolboxTalkData } from "./MyFileViewer";
import Toast from "./Toast";

interface ToolboxWizardProps {
    onBack: () => void;
    onComplete: (data: any) => void;
}

const TOOLBOX_TOPICS = [
    "Working at Height",
    "Manual Handling",
    "Slips, Trips & Falls",
    "Electrical Safety",
    "Fire Safety",
    "PPE Requirements",
    "COSHH Awareness",
    "Asbestos Awareness",
    "Noise & Vibration",
    "Excavations",
    "Confined Spaces",
    "Hot Works",
    "Housekeeping",
    "Vehicle & Plant Safety",
    "Hand Arm Vibration",
    "Dust Control",
    "Lifting Operations",
    "Other (Custom)"
];

const COMMON_HAZARDS = [
    "Falls from height",
    "Manual handling injuries",
    "Slips, trips, and falls",
    "Electrical shock / arc flash",
    "Fire / explosion",
    "Hazardous substances (COSHH)",
    "Noise and vibration",
    "Plant and vehicle movements",
    "Confined spaces",
    "Lone working",
    "Poor housekeeping",
    "PPE non-compliance",
    "Falling objects",
    "Sharp edges / cuts",
    "Other hazard"
];

const AUDIENCES = [
    "General Operatives",
    "Electricians",
    "Plumbers",
    "Carpenters",
    "Roofers",
    "Scaffolders",
    "Groundworkers",
    "Painters & Decorators",
    "Site Supervisors",
    "All Site Personnel"
];

export default function ToolboxWizard({ onBack, onComplete }: ToolboxWizardProps) {
    const [step, setStep] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    // Form Data
    const [formData, setFormData] = useState<ToolboxTalkData>({
        topic: "",
        date: new Date().toISOString().split("T")[0],
        location: "",
        supervisorName: "",
        companyName: "",
        audience: "",
        hazards: [],
        keyMessages: "",
        ppe: [],
        emergencyArrangements: "",
        attendanceConfig: {
            include: true,
            expectedAttendees: "",
            notes: ""
        }
    });

    const [documentName, setDocumentName] = useState("");
    const [customTopic, setCustomTopic] = useState("");
    const [customHazard, setCustomHazard] = useState("");

    // Helper to update form data
    const updateForm = (field: keyof ToolboxTalkData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Navigation
    const nextStep = () => {
        if (step === 0) {
            if (!documentName.trim()) {
                setToast({ message: "Please enter a document name.", type: "error" });
                return;
            }
        }
        if (step === 1) {
            if (!formData.topic) {
                setToast({ message: "Please select a topic.", type: "error" });
                return;
            }
            if (formData.topic === "Other (Custom)" && !customTopic.trim()) {
                setToast({ message: "Please enter your custom topic.", type: "error" });
                return;
            }
            if (!formData.supervisorName) {
                setToast({ message: "Please enter who is delivering the talk.", type: "error" });
                return;
            }
            if (!formData.companyName) {
                setToast({ message: "Please enter the company name.", type: "error" });
                return;
            }
            if (!formData.date) {
                setToast({ message: "Please select a date.", type: "error" });
                return;
            }
            if (!formData.location.trim()) {
                setToast({ message: "Please enter the location.", type: "error" });
                return;
            }
            if (!formData.audience) {
                setToast({ message: "Please select an audience.", type: "error" });
                return;
            }
        }

        if (step === 2) {
            if (formData.hazards.length === 0) {
                setToast({ message: "Please select at least one hazard.", type: "error" });
                return;
            }
            // Key messages might be optional, but user said "hazards and key points... it doesn't give warnings".
            // Let's make key messages mandatory too if that's the implication, or at least hazards.
            // User said: "required things that we have to fill in... for the hazards and key points, it doesn't."
            // I'll make key messages mandatory as well to be safe and "advanced".
            if (!formData.keyMessages.trim()) {
                setToast({ message: "Please enter at least one key message.", type: "error" });
                return;
            }
            if (formData.ppe.length === 0) {
                setToast({ message: "Please select at least one required PPE.", type: "error" });
                return;
            }
            if (!formData.emergencyArrangements.trim()) {
                setToast({ message: "Please enter emergency arrangements.", type: "error" });
                return;
            }
        }

        if (step === 3) {
            if (formData.attendanceConfig.include) {
                if (!formData.attendanceConfig.expectedAttendees?.trim()) {
                    setToast({ message: "Please enter expected attendees.", type: "error" });
                    return;
                }
                if (!formData.attendanceConfig.notes?.trim()) {
                    setToast({ message: "Please enter notes for attendees.", type: "error" });
                    return;
                }
            }
        }

        setStep(prev => prev + 1);
    };

    const prevStep = () => {
        if (step === 0) {
            onBack();
        } else {
            setStep(prev => prev - 1);
        }
    };

    // Handlers
    const toggleHazard = (h: string) => {
        setFormData(prev => {
            const exists = prev.hazards.includes(h);
            return {
                ...prev,
                hazards: exists
                    ? prev.hazards.filter(i => i !== h)
                    : [...prev.hazards, h]
            };
        });
    };

    const addCustomHazard = () => {
        if (customHazard.trim()) {
            toggleHazard(customHazard.trim());
            setCustomHazard("");
        }
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            // Prepare final data
            const finalTopic = formData.topic === "Other (Custom)" ? customTopic : formData.topic;

            const payload = {
                ...formData,
                topic: finalTopic,
                documentName
            };

            const res = await fetch("/api/generate-toolbox", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Generation failed");

            const aiData = await res.json();

            onComplete({
                ...payload,
                aiContent: aiData
            });

        } catch (error) {
            console.error("Toolbox generation error:", error);
            setToast({ message: "Failed to generate Toolbox Talk. Please try again.", type: "error" });
        } finally {
            setIsGenerating(false);
        }
    };

    // Loading Animation
    if (isGenerating) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-white animate-in fade-in duration-500">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-slate-200 rounded-full animate-ping opacity-20"></div>
                    <Loader2 className="w-16 h-16 animate-spin text-slate-900 relative z-10" />
                </div>
                <h2 className="text-2xl font-bold tracking-wide text-slate-800 h-8 text-center">
                    <TypewriterText
                        messages={[
                            "Structuring safety points...",
                            "Analyzing hazards...",
                            "Drafting control measures...",
                            ...(formData.attendanceConfig.include ? ["Preparing attendance sheet..."] : [])
                        ]}
                    />
                </h2>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white relative">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* HEADER */}
            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back to RS Hub
                    </button>
                </div>
                <div>
                    <h2 className="text-sm font-bold text-slate-500 flex items-center gap-2 uppercase tracking-wider justify-end">
                        <div className="w-6 h-6 rounded bg-emerald-100 flex items-center justify-center border border-emerald-200">
                            <Users className="w-3.5 h-3.5 text-emerald-700" />
                        </div>
                        Toolbox Talk
                    </h2>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5 text-right">
                        Step {step} of 4
                    </p>
                </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="h-1 w-full bg-slate-100">
                <div
                    className="h-full bg-emerald-600 shadow-sm transition-all duration-500 ease-in-out"
                    style={{ width: `${step === 0 ? 5 : (step / 4) * 100}%` }}
                />
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto space-y-8 pb-20 rs-fade-slide-in" key={step}>

                    {/* STEP 0: SETUP */}
                    {step === 0 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
                                    <Clipboard className="w-5 h-5 text-emerald-600" />
                                </div>
                                <h2 className="text-2xl font-semibold text-slate-900">
                                    <TypewriterText messages={["Set Up Your Toolbox Talk File"]} loop={false} />
                                </h2>
                            </div>

                            <div className="space-y-6 max-w-2xl">
                                <div className="space-y-2">
                                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                                        Toolbox Talk Name <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        className="border border-slate-200 px-4 py-3 rounded-lg w-full text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none bg-white shadow-sm hover:border-slate-300 transition-all duration-200"
                                        placeholder="e.g. Working at Height - March 2024"
                                        value={documentName}
                                        onChange={(e) => setDocumentName(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && nextStep()}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 1: TOPIC & SESSION */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
                                    <Mic className="w-5 h-5 text-emerald-600" />
                                </div>
                                <h2 className="text-2xl font-semibold text-slate-900">
                                    <TypewriterText messages={["Topic & Session Details"]} loop={false} />
                                </h2>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Topic */}
                                    <div className="col-span-2">
                                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                                            Talk Topic <span className="text-red-600">*</span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                className="w-full border border-slate-200 px-4 py-3 rounded-xl text-base focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 outline-none bg-white shadow-sm hover:border-slate-300 transition-all appearance-none"
                                                value={formData.topic}
                                                onChange={(e) => updateForm("topic", e.target.value)}
                                            >
                                                <option value="">Select a topic...</option>
                                                {TOOLBOX_TOPICS.map(t => (
                                                    <option key={t} value={t}>{t}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                <ChevronRight className="w-4 h-4 rotate-90" />
                                            </div>
                                        </div>
                                        {formData.topic === "Other (Custom)" && (
                                            <input
                                                className="mt-3 w-full border border-slate-200 px-4 py-3 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none bg-white shadow-sm hover:border-slate-300 transition-all"
                                                placeholder="Enter custom topic..."
                                                value={customTopic}
                                                onChange={(e) => setCustomTopic(e.target.value)}
                                            />
                                        )}
                                    </div>

                                    {/* Date */}
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                                            Date <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full border border-slate-200 px-4 py-3 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none bg-white shadow-sm hover:border-slate-300 transition-all"
                                            value={formData.date}
                                            onChange={(e) => updateForm("date", e.target.value)}
                                        />
                                    </div>

                                    {/* Location */}
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                                            Location <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            className="w-full border border-slate-200 px-4 py-3 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none bg-white shadow-sm hover:border-slate-300 transition-all"
                                            placeholder="e.g. Site Office / Zone A"
                                            value={formData.location}
                                            onChange={(e) => updateForm("location", e.target.value)}
                                        />
                                    </div>

                                    {/* Supervisor */}
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                                            Delivered By <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            className="w-full border border-slate-200 px-4 py-3 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none bg-white shadow-sm hover:border-slate-300 transition-all"
                                            placeholder="Name of presenter"
                                            value={formData.supervisorName}
                                            onChange={(e) => updateForm("supervisorName", e.target.value)}
                                        />
                                    </div>

                                    {/* Company Name */}
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                                            Company Name <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            className="w-full border border-slate-200 px-4 py-3 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none bg-white shadow-sm hover:border-slate-300 transition-all"
                                            placeholder="e.g. Acme Construction Ltd"
                                            value={formData.companyName}
                                            onChange={(e) => updateForm("companyName", e.target.value)}
                                        />
                                    </div>

                                    {/* Audience */}
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                                            Audience / Trade <span className="text-red-600">*</span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                className="w-full border border-slate-200 px-4 py-3 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none bg-white shadow-sm hover:border-slate-300 transition-all appearance-none"
                                                value={formData.audience}
                                                onChange={(e) => updateForm("audience", e.target.value)}
                                            >
                                                <option value="">Select audience...</option>
                                                {AUDIENCES.map(a => (
                                                    <option key={a} value={a}>{a}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                <ChevronRight className="w-4 h-4 rotate-90" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: HAZARDS & KEY POINTS */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-slate-900" />
                                </div>
                                <h2 className="text-2xl font-semibold text-slate-900">
                                    <TypewriterText messages={["Hazards & Key Points"]} loop={false} />
                                </h2>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
                                {/* Hazards */}
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-3">
                                        Key Hazards Discussed
                                    </label>
                                    <div className="grid grid-cols-2 gap-2 mb-3">
                                        {COMMON_HAZARDS.map(h => (
                                            h === "Other hazard" ? (
                                                <div key={h} className="col-span-2 flex gap-2 mt-2">
                                                    <input
                                                        className="flex-1 border border-slate-200 px-4 py-3 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none bg-white shadow-sm hover:border-slate-300 transition-all"
                                                        placeholder="Add custom hazard..."
                                                        value={customHazard}
                                                        onChange={(e) => setCustomHazard(e.target.value)}
                                                        onKeyDown={(e) => e.key === "Enter" && addCustomHazard()}
                                                    />
                                                    <button
                                                        onClick={addCustomHazard}
                                                        className="px-5 py-3 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 shadow-sm transition-all"
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    key={h}
                                                    onClick={() => toggleHazard(h)}
                                                    className={`text-left px-4 py-3 rounded-xl text-sm border transition-all ${formData.hazards.includes(h)
                                                        ? "bg-slate-900 border-slate-900 text-white font-medium shadow-md"
                                                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                                                        }`}
                                                >
                                                    {h}
                                                </button>
                                            )
                                        ))}
                                    </div>
                                </div>

                                {/* Key Messages */}
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                                        Key Messages / Talking Points
                                    </label>
                                    <textarea
                                        className="w-full border border-slate-200 px-4 py-3 rounded-xl min-h-[120px] text-base focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 outline-none bg-white shadow-sm hover:border-slate-300 transition-all"
                                        placeholder="- Emphasise correct use of harnesses&#10;- Discuss recent near-miss&#10;- Reminder about housekeeping"
                                        value={formData.keyMessages}
                                        onChange={(e) => updateForm("keyMessages", e.target.value)}
                                    />
                                </div>

                                {/* PPE */}
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                                        PPE Required <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        className="w-full border border-slate-200 px-4 py-3 rounded-xl text-base focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 outline-none bg-white shadow-sm hover:border-slate-300 transition-all"
                                        placeholder="e.g. Helmets, Hi-Vis, Gloves, Eye Protection"
                                        value={formData.ppe.join(", ")}
                                        onChange={(e) => updateForm("ppe", e.target.value.split(",").map(s => s.trim()))}
                                    />
                                </div>

                                {/* Emergency */}
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                                        Emergency Arrangements <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        className="w-full border border-slate-200 px-4 py-3 rounded-xl text-base focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 outline-none bg-white shadow-sm hover:border-slate-300 transition-all"
                                        placeholder="e.g. Muster point at Gate A, First Aider is John Doe"
                                        value={formData.emergencyArrangements}
                                        onChange={(e) => updateForm("emergencyArrangements", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: ATTENDANCE */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                                    <Users className="w-5 h-5 text-slate-900" />
                                </div>
                                <h2 className="text-2xl font-semibold text-slate-900">
                                    <TypewriterText messages={["Attendance & Sign-off"]} loop={false} />
                                </h2>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <div>
                                        <h4 className="font-medium text-slate-900">Include Attendance Sheet?</h4>
                                        <p className="text-sm text-slate-500">Adds a signature table to the end of the document.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={formData.attendanceConfig.include}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                attendanceConfig: { ...prev.attendanceConfig, include: e.target.checked }
                                            }))}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                    </label>
                                </div>

                                {formData.attendanceConfig.include && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                                                Expected Attendees <span className="text-red-600">*</span>
                                            </label>
                                            <input
                                                className="w-full border border-slate-200 px-4 py-3 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none bg-white shadow-sm hover:border-slate-300 transition-all"
                                                placeholder="e.g. 10"
                                                value={formData.attendanceConfig.expectedAttendees}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    attendanceConfig: { ...prev.attendanceConfig, expectedAttendees: e.target.value }
                                                }))}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                                                Notes for Attendees <span className="text-red-600">*</span>
                                            </label>
                                            <textarea
                                                className="w-full border border-slate-200 px-4 py-3 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none bg-white shadow-sm hover:border-slate-300 transition-all min-h-[80px]"
                                                placeholder="e.g. Please sign to confirm you have understood the briefing."
                                                value={formData.attendanceConfig.notes}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    attendanceConfig: { ...prev.attendanceConfig, notes: e.target.value }
                                                }))}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* STEP 4: REVIEW */}
                    {step === 4 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                                    <CheckSquare className="w-5 h-5 text-slate-900" />
                                </div>
                                <h2 className="text-2xl font-semibold text-slate-900">
                                    <TypewriterText messages={["Review & Generate"]} loop={false} />
                                </h2>
                            </div>
                            <p className="text-sm text-slate-600">
                                Final sense-check before you generate. If anything looks off, go back and adjust the relevant step.
                            </p>

                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-xs space-y-4">
                                <h3 className="text-sm font-semibold text-slate-900 mb-1">
                                    Summary
                                </h3>
                                {/* Summary Card */}
                                <div className="grid grid-cols-2 gap-4 text-sm border-b border-slate-200 pb-4">
                                    <div>
                                        <span className="text-slate-500 block text-xs uppercase tracking-wide mb-1">Document Name</span>
                                        <span className="font-semibold text-slate-900">{documentName}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block text-xs uppercase tracking-wide mb-1">Topic</span>
                                        <span className="font-semibold text-slate-900">
                                            {formData.topic === "Other (Custom)" ? customTopic : formData.topic}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block text-xs uppercase tracking-wide mb-1">Date & Location</span>
                                        <span className="font-semibold text-slate-900">{formData.date} @ {formData.location || "N/A"}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block text-xs uppercase tracking-wide mb-1">Delivered By</span>
                                        <span className="font-semibold text-slate-900">{formData.supervisorName}</span>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Hazards Identified</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.hazards.length > 0 ? formData.hazards.map(h => (
                                            <span key={h} className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-medium border border-red-100">
                                                {h}
                                            </span>
                                        )) : <span className="text-slate-400 italic text-sm">No specific hazards selected.</span>}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Key Messages</h4>
                                    <p className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 p-3 rounded border border-slate-200">
                                        {formData.keyMessages || "No specific key messages added."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">PPE Required</h4>
                                        <p className="text-sm text-slate-700">{formData.ppe.join(", ") || "None specified"}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Emergency</h4>
                                        <p className="text-sm text-slate-700">{formData.emergencyArrangements || "Standard site procedures"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* FOOTER ACTIONS - INLINE */}
                    <div className="flex justify-between gap-3 pt-6 border-t border-slate-200 mt-8">
                        <div className="flex gap-2">
                            {step > 0 && (
                                <button
                                    onClick={prevStep}
                                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
                                >
                                    Back
                                </button>
                            )}
                            <button
                                onClick={onBack}
                                className="inline-flex items-center justify-center rounded-xl border border-transparent px-4 py-3 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                            >
                                {step === 0 ? "Cancel" : "Cancel Wizard"}
                            </button>
                        </div>

                        {step < 4 ? (
                            <button
                                onClick={nextStep}
                                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-8 py-3 text-sm font-bold text-white hover:bg-black shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                            >
                                Next Step
                            </button>
                        ) : (
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-8 py-3 text-sm font-bold text-white hover:bg-black shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                            >
                                {isGenerating ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <CheckSquare className="w-4 h-4" />
                                )}
                                {isGenerating ? "Generating..." : "Generate & Open"}
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
