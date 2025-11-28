"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Loader2,
  MapPin,
  Briefcase,
  AlertTriangle,
  Info,
  FileText,
  User,
  Settings,
  ChevronRight,
  LayoutDashboard,
  MoreVertical,
  Edit2,
  Trash2,
} from "lucide-react";

import {
  TRADES,
  HAZARD_GROUPS,
  HAZARD_DATA,
  JobCluster,
} from "./lib/constants";

import MyFileViewer, { RAMSFile } from "./components/MyFileViewer";
import { generateRAMSHTML, RAMSData } from "./lib/rams-generation";
import Toast, { ToastType } from "./components/Toast";
import ConfirmationModal from "./components/ConfirmationModal";

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

// Single greeting – no rotation
const BASE_GREETING = "Welcome back";

const TITLE_COLORS = ["text-[#0b2040]", "text-red-700", "text-black"];

// --- TYPED TEXT COMPONENT ---
const TypedText = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    setDisplay("");
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setDisplay(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [text]);

  return <span className={className}>{display}</span>;
};

// --- CLICK OUTSIDE HOOK ---
function useClickOutside(action: () => void) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      action();
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [action]);
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

  const searchAddress = async (text: string) => {
    setQuery(text);
    onChange(text);
    if (text.length > 4) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            text
          )}&countrycodes=gb&limit=5`
        );
        const data = await res.json();
        setResults(data);
        setShowDropdown(true);
      } catch (e) {
        console.error(e);
      }
    } else {
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

// --- MAIN APPLICATION ---
function Page() {
  const [mode, setMode] = useState<"landing" | "wizard" | "viewer">("landing");
  // 0 = pre-step (name doc), 1–5 = wizard steps
  const [step, setStep] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; fileId: string | null; fileName: string } | null>(null);
  const [warningsShown, setWarningsShown] = useState<number[]>([]);

  const [documentName, setDocumentName] = useState("");

  const [formData, setFormData] = useState({
    companyName: "",
    officeAddress: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    projectSupervisor: "",
    clientName: "",
    projectRef: "",
    siteAddress: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    expectedEndDate: "",
    duration: "1 Day",
    operatives: "1",
    trade: "Electrician",
    jobType: "",
    customJobType: "",
    jobDesc: "",
    supervisorName: "",
    firstAider: "",
    hospital: "",
    fireAssembly: "",
    firstAidLoc: "",
    welfare: "",
    extraNotes: "",
    accessCode: "",
    customDescription: "",
    customJobTitle: "",
    customJobDescription: "",
    // Branding for future PDF styling if needed
    brandPrimaryColor: "black",
    brandSecondaryColor: "white",
    extraData: {} as Record<string, string>,
  });

  const [hazards, setHazards] = useState<string[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Job omni-search
  const [jobSearch, setJobSearch] = useState("");
  const [jobSearchOpen, setJobSearchOpen] = useState(false);

  // Greeting typing (no rotation)
  const [typedGreeting, setTypedGreeting] = useState("");

  // Title color rotation
  const [titleColorIndex, setTitleColorIndex] = useState(0);

  // Scroll container for the right (white) panel
  const mainScrollRef = useRef<HTMLDivElement | null>(null);

  // Files (locally persisted)
  const [recentFiles, setRecentFiles] = useState<RAMSFile[]>([]);
  const [activeFile, setActiveFile] = useState<RAMSFile | null>(null);
  const [fileMenuOpenId, setFileMenuOpenId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = () => setFileMenuOpenId(null);
    if (fileMenuOpenId) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [fileMenuOpenId]);

  // Precomputed full list of jobs for search
  const allJobs = Object.entries(TRADES).flatMap(
    ([tradeName, tradeData]: [string, any]) =>
      (tradeData.jobs || []).map((j: any) => ({
        trade: tradeName,
        name: j.name as string,
      }))
  );

  const filteredJobs =
    jobSearch.trim().length < 2
      ? []
      : allJobs
        .filter((j) =>
          j.name.toLowerCase().includes(jobSearch.toLowerCase())
        )
        .slice(0, 8);

  // Load files from localStorage
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined"
        ? window.localStorage.getItem("rams-files-v1")
        : null;
      if (raw) {
        const parsed = JSON.parse(raw) as RAMSFile[];
        if (Array.isArray(parsed)) {
          setRecentFiles(parsed);
        }
      }
    } catch (err) {
      console.error("Failed to load RAMS files from localStorage", err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Persist files to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "rams-files-v1",
          JSON.stringify(recentFiles)
        );
      }
    } catch (err) {
      console.error("Failed to save RAMS files to localStorage", err);
    }
  }, [recentFiles, isLoaded]);

  // Close file context menu on outside click
  useEffect(() => {
    const handler = () => setFileMenuOpenId(null);
    if (typeof window !== "undefined") {
      window.addEventListener("click", handler);
      return () => window.removeEventListener("click", handler);
    }
  }, []);

  // Scroll only the main panel to top when step changes (wizard only)
  useEffect(() => {
    if (mainScrollRef.current && mode === "wizard") {
      mainScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step, mode]);

  // Type-out effect for greeting once whenever we return to landing
  useEffect(() => {
    if (mode !== "landing") return;
    const full = BASE_GREETING;
    setTypedGreeting("");
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTypedGreeting(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(id);
      }
    }, 45);
    return () => clearInterval(id);
  }, [mode]);

  // Rotate color of "RS Wizard v1.0" while in wizard mode
  useEffect(() => {
    if (mode !== "wizard") return;
    const id = setInterval(() => {
      setTitleColorIndex((prev) => (prev + 1) % TITLE_COLORS.length);
    }, 1200);
    return () => clearInterval(id);
  }, [mode]);

  // Update hazards/questions when trade/jobType changes
  useEffect(() => {
    const currentTrade = TRADES[formData.trade as keyof typeof TRADES];

    if (!currentTrade || !formData.jobType) {
      setQuestions([]);
      setHazards([]);
      setAnswers({});
      return;
    }

    const clusters = currentTrade.clusters as Record<string, JobCluster>;
    const clusterData = clusters[formData.jobType];

    if (!clusterData) {
      setQuestions([]);
      setHazards([]);
      setAnswers({});
      return;
    }

    setFormData((prev) => ({
      ...prev,
      customDescription:
        formData.jobType === "Other (Custom)"
          ? ""
          : clusterData.desc || "",
      extraData: {},
    }));

    setHazards(clusterData.hazards || []);
    const qs = clusterData.questions || [];
    setQuestions(qs);
    setAnswers({});
  }, [formData.jobType, formData.trade]);

  const handleInput = (field: string, value: string) => {
    setFormData((prev) => {
      if (field === "trade") {
        return {
          ...prev,
          trade: value,
          jobType: "",
          customDescription: "",
        };
      }
      if (field === "jobType") {
        return {
          ...prev,
          jobType: value,
          customDescription:
            value === "Other (Custom)" ? "" : prev.customDescription,
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const toggleHazard = (h: string) =>
    setHazards((prev) =>
      prev.includes(h) ? prev.filter((i) => i !== h) : [...prev, h]
    );

  const confirmDelete = () => {
    if (!deleteModal?.fileId) return;
    setRecentFiles((prev) => prev.filter((f) => f.id !== deleteModal.fileId));
    if (activeFile?.id === deleteModal.fileId) {
      setActiveFile(null);
      setMode("landing");
    }
    setDeleteModal(null);
    setFileMenuOpenId(null);
  };

  const nextStep = () => {
    if (step === 0) return;

    let errorMsg = "";
    if (
      step === 1 &&
      (!formData.companyName ||
        !formData.officeAddress ||
        !formData.contactName)
    ) {
      errorMsg = "Please fill in Company Name, Office Address and Competent Person.";
    } else if (
      step === 2 &&
      (!formData.clientName || !formData.siteAddress || !formData.jobType)
    ) {
      errorMsg = "Please fill in Client, Site Address and select a Job Type.";
    }

    if (errorMsg) {
      // Warn once logic
      if (!warningsShown.includes(step)) {
        setToast({
          msg: errorMsg,
          type: "error",
        });
        setWarningsShown((prev) => [...prev, step]);
        return; // Block first time
      }
      // If warning already shown, allow proceed (user ignores warning)
    }

    if (step >= 5) return;
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (step === 1) {
      setStep(0);
      return;
    }
    setStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  // Build Scope of Works string from current form fields
  const buildScopeFromForm = () => {
    if (formData.jobType === "Other (Custom)") {
      const parts: string[] = [];
      const title = formData.customJobTitle?.trim();
      const desc = formData.customJobDescription?.trim();
      const extra = formData.extraNotes?.trim();

      if (title) parts.push(title);
      if (desc) parts.push(desc);
      if (extra) parts.push(`Additional notes: ${extra}`);

      return parts.join("\n\n");
    } else {
      const base = formData.customDescription?.trim()
        ? formData.customDescription.trim()
        : "";
      const extra = formData.extraNotes?.trim()
        ? formData.extraNotes.trim()
        : "";

      if (base && extra)
        return `${base}\n\nAdditional notes: ${extra}`;
      if (base) return base;
      if (extra) return `Additional notes: ${extra}`;
      return "";
    }
  };

  const generateRAMS = async () => {
    // Hard validation on critical safety bits
    if (
      !formData.supervisorName ||
      !formData.firstAider ||
      !formData.hospital ||
      !formData.fireAssembly
    ) {
      if (!warningsShown.includes(99)) {
        setToast({
          msg: "Please complete Supervisor, First Aider, Hospital and Fire Assembly details.",
          type: "error",
        });
        setWarningsShown((prev) => [...prev, 99]);
        return;
      }
      // Allow proceed on second attempt
    }

    const composedScope = buildScopeFromForm();

    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          hazards,
          answers,
          customDescription: composedScope,
          extraData: formData.extraData,
        }),
      });

      let apiData: any = {};
      if (res.ok) {
        apiData = await res.json();
      } else {
        const errorBody = await res.json().catch(() => ({} as any));
        console.error("API Failed:", res.status, errorBody);
        alert(
          `AI API error (${res.status}): ${(errorBody as any)?.error ||
          (errorBody as any)?.message ||
          "Check browser console and Vercel logs."
          }`
        );
      }

      const safeCompany =
        formData.companyName?.trim().length > 0
          ? formData.companyName.replace(/ /g, "_")
          : "RAMS";

      const safeDocName = documentName.trim().length
        ? documentName.trim().replace(/\s+/g, "_")
        : `RAMS_${safeCompany}`;

      const ramsData: RAMSData = {
        companyName: formData.companyName,
        clientName: formData.clientName,
        siteAddress: formData.siteAddress,
        projectRef: formData.projectRef,
        contactName: formData.contactName,
        startDate: formData.startDate,
        trade: formData.trade,
        jobType: formData.jobType,
        supervisorName: formData.supervisorName,
        firstAider: formData.firstAider,
        hospital: formData.hospital,
        fireAssembly: formData.fireAssembly,
        firstAidLoc: formData.firstAidLoc,
        welfare: formData.welfare,
        scopeText: sanitizeText(
          apiData.summary ||
          composedScope ||
          "Standard works as per industry guidelines."
        ),
        checklist: questions.map((q: any) => ({
          label: q.label,
          answer: answers[q.id] || "N/A",
        })),
        hazards: hazards,
        methodSteps: apiData.method_steps || [
          "5.1 PRE-START: Arrive on site and verify conditions.",
          "5.2 SAFETY: Set up safe system of work.",
          `5.3 EXECUTION: Carry out ${formData.jobType || "the works"}.`,
          "5.4 COMPLETION: Test, tidy and hand over.",
        ],
        coshh: apiData.coshh || [],
        documentName: documentName || safeDocName,
        ppe: TRADES[formData.trade]?.clusters[formData.jobType]?.ppe || [],
        operatives: formData.operatives,
      };

      const htmlContent = generateRAMSHTML(ramsData);

      const now = new Date();
      const newFile: RAMSFile = {
        id: now.getTime().toString(),
        name: safeDocName,
        createdAt: now.toLocaleString(),
        content: htmlContent,
      };

      setRecentFiles((prev) => [newFile, ...prev].slice(0, 20));
      setActiveFile(newFile);
      setMode("viewer");
    } catch (e: any) {
      console.error("Frontend fetch error:", e);
      setToast({
        msg: `Frontend fetch error: ${e.message || e}`,
        type: "error",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // --- UI RENDER ---
  const hazardPreviewLabels = hazards.map(
    (h) => (HAZARD_DATA as any)[h]?.label || h
  );

  return (
    <>
      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={5000}
        />
      )}
      {deleteModal && (
        <ConfirmationModal
          isOpen={deleteModal.isOpen}
          title="Delete File?"
          message={`Are you sure you want to delete "${deleteModal.fileName}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteModal(null)}
          confirmText="Delete"
          isDangerous={true}
        />
      )}
      <div className="h-screen w-full flex overflow-hidden bg-[#f5f4f0] text-slate-900">
        {/* SIDEBAR */}
        <aside
          className={`relative flex flex-col border-r border-black/5 transition-all duration-300 ease-out ${sidebarOpen ? "w-56" : "w-14"
            }`}
        >
          <div className="flex h-full flex-col bg-[#FAF9F6] text-slate-900">
            {/* Top brand + toggle */}
            <div className="flex items-center justify-between px-3 pt-3 pb-2">
              <div
                className={`flex items-center gap-2 transition-all ${sidebarOpen
                  ? "opacity-100 w-auto"
                  : "opacity-0 w-0 overflow-hidden"
                  }`}
              >
                <div className="relative h-[50px] w-[80px]">
                  <Image
                    src="/rams-logo1.png"
                    alt="RAMS Sorted logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-400/60 bg-[#c8eee6] hover:bg-slate-200/80 transition-colors"
              >
                {sidebarOpen ? (
                  <ChevronRight className="w-4 h-4 text-slate-700 rotate-180" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-700" />
                )}
              </button>
            </div>

            {/* MAIN SIDEBAR CONTENT */}
            <div className="flex-1 overflow-y-auto px-2 pb-2 flex flex-col">
              <div className="mt-4">
                {sidebarOpen ? (
                  <button
                    onClick={() => {
                      setMode("landing");
                      setStep(1);
                      setActiveFile(null);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-[#0b2040] py-2 text-xs font-semibold text-white hover:bg-black transition-colors"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>RS Hub</span>
                  </button>
                ) : (
                  <div className="flex justify-center">
                    <button
                      onClick={() => {
                        setMode("landing");
                        setStep(1);
                        setActiveFile(null);
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-md bg-[#0b2040] text-white hover:bg-black transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* My files – only when open */}
              {sidebarOpen && (
                <div className="mt-6 space-y-1 text-xs text-slate-700">
                  <div className="px-2 py-1 font-semibold text-[11px] uppercase tracking-wide text-slate-500">
                    My files
                  </div>
                  {recentFiles.length === 0 ? (
                    <div className="px-2 py-2 text-[11px] text-slate-500">
                      Generated RAMS documents will appear here.
                    </div>
                  ) : (
                    recentFiles.map((file) => (
                      <div
                        key={file.id}
                        className="w-full px-2 py-1 rounded-md hover:bg-slate-200/80"
                        onClick={() => {
                          setActiveFile(file);
                          setMode("viewer");
                        }}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-slate-900 truncate text-[13px]">
                              <TypedText
                                text={file.name}
                                key={file.id + file.name}
                              />
                            </div>
                            <div className="text-[11px] text-slate-500 truncate">
                              {file.createdAt}
                            </div>
                          </div>
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setFileMenuOpenId(
                                  fileMenuOpenId === file.id ? null : file.id
                                );
                              }}
                              className="p-1 rounded-md hover:bg-slate-300/60"
                            >
                              <MoreVertical className="w-3.5 h-3.5 text-slate-600" />
                            </button>
                            {fileMenuOpenId === file.id && (
                              <div
                                className="absolute right-0 mt-1 w-36 rounded-md bg-white shadow-lg border border-slate-200 z-20"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={() => {
                                    const newName = window.prompt(
                                      "Rename file",
                                      file.name
                                    );
                                    if (!newName || !newName.trim()) return;
                                    const updated: RAMSFile = {
                                      ...file,
                                      name: newName.trim(),
                                    };
                                    setRecentFiles((prev) =>
                                      prev.map((f) =>
                                        f.id === file.id ? updated : f
                                      )
                                    );
                                    if (activeFile?.id === file.id) {
                                      setActiveFile(updated);
                                    }
                                    setFileMenuOpenId(null);
                                  }}
                                  className="flex items-center gap-2 w-full px-3 py-1.5 text-[12px] hover:bg-slate-100"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                  Rename
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteModal({
                                      isOpen: true,
                                      fileId: file.id,
                                      fileName: file.name,
                                    });
                                  }}
                                  className="flex items-center gap-2 w-full px-3 py-1.5 text-[12px] text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Bottom: profile / settings (fixed) */}
            <div className="mt-auto border-t border-black/5 px-2 py-3">
              <div className="flex items-center justify-between gap-2 text-xs text-slate-800">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white">
                    <User className="w-4 h-4" />
                  </div>
                  {sidebarOpen && (
                    <div className="flex flex-col leading-tight">
                      <span className="text-xs font-semibold">Account</span>
                      <span className="text-[11px] text-slate-600">
                        Not signed in
                      </span>
                    </div>
                  )}
                </div>
                {sidebarOpen && (
                  <button className="rounded-md p-1.5 hover:bg-slate-200/80">
                    <Settings className="w-4 h-4 text-slate-700" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN PANEL */}
        <main className={`flex-1 flex flex-col h-full overflow-hidden ${mode === "viewer" ? "bg-white" : "bg-[#f5f4f0]"}`}>
          {mode === "viewer" ? (
            <section className="flex-1 h-full overflow-hidden flex flex-col">
              <MyFileViewer
                file={activeFile}
                onBack={() => {
                  setMode("landing");
                  setActiveFile(null);
                }}
                onUpdateFile={(updated) => {
                  setActiveFile(updated);
                  setRecentFiles((prev) =>
                    prev.map((f) => (f.id === updated.id ? updated : f))
                  );
                }}
              />
            </section>
          ) : mode === "landing" ? (
            // LANDING / HUB SCREEN
            <div className="flex-1 flex items-center justify-center px-6 rs-fade-slide-in bg-white">
              <div className="max-w-xl w-full text-center">
                <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 mb-3">
                  {typedGreeting}
                </h1>
                <p className="text-slate-500 mb-8 text-lg">
                  Create, manage and export your RAMS documents efficiently.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setMode("wizard");
                      setStep(0);
                    }}
                    className="group flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
                  >
                    <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="font-semibold text-slate-900">
                      New Document
                    </span>
                    <span className="text-xs text-slate-500 mt-1">
                      Start from scratch
                    </span>
                  </button>

                  <button
                    disabled
                    className="group flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-200 rounded-xl shadow-sm transition-all cursor-not-allowed opacity-60"
                  >
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 grayscale">
                      <Briefcase className="w-6 h-6 text-slate-400" />
                    </div>
                    <span className="font-semibold text-slate-500">
                      New Feature Coming Soon
                    </span>
                    <span className="text-xs text-slate-400 mt-1">
                      Stay tuned
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // WIZARD
            <section
              ref={mainScrollRef}
              className="flex-1 overflow-y-auto bg-white"
            >
              {/* Wizard Header */}
              <div className="sticky top-0 z-10 bg-[#f5f4f0] border-b border-slate-200 px-8 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <span className={TITLE_COLORS[titleColorIndex]}>
                      RS v1.0
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Step {step} of 5
                  </p>
                </div>
                {step > 0 && (
                  <div className="flex gap-2">
                    {/* Back button removed as per user request */}
                  </div>
                )}
              </div>

              {step > 0 && (
                <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-[#0b2040] transition-all duration-500 ease-out"
                    style={{ width: `${(step / 5) * 100}%` }}
                  />
                </div>
              )}

              {/* Content area with its own scroll */}
              <div
                key={step}
                className="max-w-4xl mx-auto px-6 py-8 rs-fade-slide-in"
              >
                {/* STEP 0: NAME DOCUMENT + BRANDING */}
                {step === 0 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-slate-900">
                      <TypedText text="Name Your RAMS Document" />
                    </h2>

                    <div className="space-y-4 max-w-2xl">
                      {/* Document name */}
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                          Document name
                          <span className="text-red-600 ml-0.5">*</span>
                        </label>
                        <input
                          className="border border-slate-200 p-3 rounded-lg w-full text-sm focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none bg-white shadow-sm hover:border-slate-300 transition-all duration-200"
                          placeholder="e.g. ACME – Boiler replacement RAMS"
                          value={documentName}
                          onChange={(e) =>
                            setDocumentName(e.target.value)
                          }
                        />
                      </div>

                      {/* Branding & appearance – kept for future PDF styling */}
                      <div className="space-y-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <h3 className="text-sm font-semibold text-slate-900">
                          Branding &amp; appearance (optional)
                        </h3>
                        <p className="text-xs text-slate-600">
                          Choose a primary and secondary colour and add your
                          logo so the PDF looks like it came from your
                          company.
                        </p>

                        <div className="space-y-2">
                          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                            Primary colour
                          </label>
                          <select
                            className="border border-slate-300 p-2.5 rounded-lg w-full text-sm bg-white focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none"
                            value={formData.brandPrimaryColor}
                            onChange={(e) =>
                              handleInput("brandPrimaryColor", e.target.value)
                            }
                          >
                            <option value="black">Black</option>
                            <option value="white">White</option>
                            <option value="navy">Navy</option>
                            <option value="red">Red</option>
                            <option value="blue">Blue</option>
                            <option value="green">Green</option>
                            <option value="orange">Orange</option>
                            <option value="yellow">Yellow</option>
                            <option value="grey">Grey</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                            Secondary colour
                          </label>
                          <select
                            className="border border-slate-300 p-2.5 rounded-lg w-full text-sm bg-white focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none"
                            value={formData.brandSecondaryColor}
                            onChange={(e) =>
                              handleInput(
                                "brandSecondaryColor",
                                e.target.value
                              )
                            }
                          >
                            <option value="white">White</option>
                            <option value="black">Black</option>
                            <option value="navy">Navy</option>
                            <option value="red">Red</option>
                            <option value="blue">Blue</option>
                            <option value="green">Green</option>
                            <option value="orange">Orange</option>
                            <option value="yellow">Yellow</option>
                            <option value="grey">Grey</option>
                          </select>
                          <p className="text-xs text-slate-500">
                            Used mainly for table headers and accents.
                            Default is black on white.
                          </p>
                        </div>

                        {/* Logo input removed as per user request */}
                      </div>
                    </div>

                    <div className="flex justify-between gap-3 pt-4">
                      <button
                        onClick={() => {
                          setMode("landing");
                          setStep(1);
                          setActiveFile(null);
                        }}
                        className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                      >
                        Back to RS Hub
                      </button>
                      <button
                        onClick={() => {
                          if (!documentName.trim()) {
                            alert(
                              "⚠️ Please enter a document name before continuing."
                            );
                            return;
                          }
                          setStep(1);
                        }}
                        className="inline-flex items-center justify-center rounded-lg bg-[#0b2040] px-5 py-2.5 text-sm font-semibold text-white hover:bg-black transition-colors"
                      >
                        Continue to Step 1
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 1: COMPANY & PROJECT */}
                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-[#0b2040]" />
                      <TypedText text="Company & Project Details" />
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Fields marked <span className="text-red-600">*</span>{" "}
                      are required. Others are optional but help create a more
                      complete RAMS.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                          Company Name
                          <span className="text-red-600 ml-0.5">*</span>
                        </label>
                        <input
                          className="border border-slate-200 p-3 rounded-lg w-full text-sm focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none bg-white shadow-sm hover:border-slate-300 transition-all duration-200"
                          placeholder="e.g. ACME Electrical Ltd"
                          value={formData.companyName}
                          onChange={(e) =>
                            handleInput("companyName", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                          Competent Person
                          <span className="text-red-600 ml-0.5">*</span>
                        </label>
                        <input
                          className="border border-slate-200 p-3 rounded-lg w-full text-sm focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none bg-white shadow-sm hover:border-slate-300 transition-all duration-200"
                          placeholder="Person preparing RAMS"
                          value={formData.contactName}
                          onChange={(e) =>
                            handleInput("contactName", e.target.value)
                          }
                        />
                      </div>

                      <AddressSearch
                        label="Office Address"
                        required
                        value={formData.officeAddress}
                        onChange={(val: string) =>
                          handleInput("officeAddress", val)
                        }
                        tooltip="Registered or main business address."
                      />

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                          Phone Number (optional)
                        </label>
                        <input
                          className="border border-slate-200 p-3 rounded-lg w-full text-sm focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none bg-white shadow-sm hover:border-slate-300 transition-all duration-200"
                          placeholder="Contact number for queries"
                          value={formData.contactPhone}
                          onChange={(e) =>
                            handleInput("contactPhone", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                          Contact Email (optional)
                        </label>
                        <input
                          className="border border-slate-200 p-3 rounded-lg w-full text-sm focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none bg-white shadow-sm hover:border-slate-300 transition-all duration-200"
                          placeholder="RAMS contact email"
                          value={formData.contactEmail}
                          onChange={(e) =>
                            handleInput("contactEmail", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                          Project Supervisor (optional)
                        </label>
                        <input
                          className="border border-slate-200 p-3 rounded-lg w-full text-sm focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none bg-white shadow-sm hover:border-slate-300 transition-all duration-200"
                          placeholder="Overall project supervisor"
                          value={formData.projectSupervisor}
                          onChange={(e) =>
                            handleInput(
                              "projectSupervisor",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                      <h3 className="font-semibold text-sm text-slate-900">
                        Project Info
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                            Client Name
                            <span className="text-red-600 ml-0.5">*</span>
                          </label>
                          <input
                            className="border border-slate-200 p-3 rounded-lg w-full text-sm focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none bg-white shadow-sm hover:border-slate-300 transition-all duration-200"
                            placeholder="Who the RAMS are for"
                            value={formData.clientName}
                            onChange={(e) =>
                              handleInput("clientName", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                            Job Ref (optional)
                          </label>
                          <input
                            className="border border-slate-200 p-3 rounded-lg w-full text-sm focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none bg-white shadow-sm hover:border-slate-300 transition-all duration-200"
                            placeholder="Internal or client reference"
                            value={formData.projectRef}
                            onChange={(e) =>
                              handleInput("projectRef", e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <AddressSearch
                        label="Site Address"
                        required
                        value={formData.siteAddress}
                        onChange={(val: string) =>
                          handleInput("siteAddress", val)
                        }
                        tooltip="Location where the works are being carried out."
                      />
                    </div>

                    <div className="flex justify-between gap-3 pt-2">
                      <div className="flex gap-2">
                        <button
                          onClick={prevStep}
                          className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMode("landing");
                            setStep(1);
                            setActiveFile(null);
                          }}
                          className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          ← Back to RS Hub
                        </button>
                      </div>
                      <button
                        onClick={nextStep}
                        className="inline-flex items-center justify-center rounded-lg bg-[#0b2040] px-5 py-2.5 text-sm font-semibold text-white hover:bg-black transition-colors"
                      >
                        Next: Job Scope
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: JOB SCOPE & PRE-START */}
                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#0b2040]" />
                      <TypedText text="Job Scope & Pre-Start Checks" />
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Fields marked <span className="text-red-600">*</span>{" "}
                      are required. Use the search or dropdowns to lock in the
                      right task.
                    </p>

                    {/* OMNI SEARCH BAR */}
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700">
                        Quick job search (optional)
                      </label>
                      <p className="text-xs text-slate-500 mb-1">
                        Start typing (e.g.{" "}
                        <span className="italic">boiler</span>) to jump
                        straight to the right trade &amp; job. You can still
                        use the dropdowns below if you prefer.
                      </p>
                      <div className="relative">
                        <input
                          className="w-full border border-slate-300 p-3 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none"
                          placeholder="Search all job types..."
                          value={jobSearch}
                          onChange={(e) => {
                            setJobSearch(e.target.value);
                            setJobSearchOpen(true);
                          }}
                          onFocus={() => setJobSearchOpen(true)}
                        />

                        {jobSearchOpen && filteredJobs.length > 0 && (
                          <div className="absolute z-40 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg max-h-64 overflow-auto">
                            {filteredJobs.map((j, idx) => (
                              <button
                                key={j.trade + j.name + idx}
                                type="button"
                                onClick={() => {
                                  handleInput("trade", j.trade);
                                  handleInput("jobType", j.name);
                                  setJobSearch(j.name);
                                  setJobSearchOpen(false);
                                }}
                                className="w-full px-3 py-2 text-left text-xs hover:bg-slate-50"
                              >
                                <div className="font-semibold text-slate-900">
                                  {j.name}
                                </div>
                                <div className="text-[11px] text-slate-500">
                                  {j.trade}
                                </div>
                              </button>
                            ))}

                            <button
                              type="button"
                              onClick={() => {
                                const tradeToUse =
                                  formData.trade ||
                                  filteredJobs[0]?.trade ||
                                  "Electrician";
                                handleInput("trade", tradeToUse);
                                handleInput("jobType", "Other (Custom)");
                                setJobSearch("Other (Custom)");
                                setJobSearchOpen(false);
                              }}
                              className="w-full px-3 py-2 text-left text-xs border-t border-slate-100 bg-slate-50 hover:bg-slate-100"
                            >
                              <div className="font-semibold text-slate-900">
                                Other (Custom)
                              </div>
                              <div className="text-[11px] text-slate-500">
                                For custom or non-standard tasks.
                              </div>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                          Trade
                        </label>
                        <select
                          className="border border-slate-300 p-3 rounded-lg w-full text-sm bg-white focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none"
                          value={formData.trade}
                          onChange={(e) =>
                            handleInput("trade", e.target.value)
                          }
                        >
                          {Object.keys(TRADES).map((t) => (
                            <option key={t}>{t}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                          Job Type
                          <span className="text-red-600 ml-0.5">*</span>
                        </label>
                        {/* @ts-ignore */}
                        <select
                          className="border border-slate-300 p-3 rounded-lg w-full text-sm bg-white focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none"
                          value={formData.jobType}
                          onChange={(e) =>
                            handleInput("jobType", e.target.value)
                          }
                        >
                          <option value="">Select Job Type</option>
                          {
                            // @ts-ignore
                            TRADES[formData.trade].jobs.map((j: any) => (
                              <option key={j.name}>{j.name}</option>
                            ))
                          }
                        </select>
                      </div>
                    </div>

                    {/* Schedule & workforce */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                      <h3 className="font-semibold text-sm text-slate-900">
                        Schedule &amp; Workforce (optional – but useful)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                            Start Date
                          </label>
                          <input
                            type="date"
                            className="border border-slate-200 p-3 rounded-lg w-full text-sm focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none bg-white shadow-sm hover:border-slate-300 transition-all duration-200"
                            value={formData.startDate}
                            onChange={(e) =>
                              handleInput("startDate", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                            End Date
                          </label>
                          <input
                            type="date"
                            className="border border-slate-200 p-3 rounded-lg w-full text-sm focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none bg-white shadow-sm hover:border-slate-300 transition-all duration-200"
                            value={formData.endDate}
                            onChange={(e) =>
                              handleInput("endDate", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                            Expected End Date
                          </label>
                          <input
                            type="date"
                            className="border border-slate-200 p-3 rounded-lg w-full text-sm focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none bg-white shadow-sm hover:border-slate-300 transition-all duration-200"
                            value={formData.expectedEndDate}
                            onChange={(e) =>
                              handleInput(
                                "expectedEndDate",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                            Number of operatives
                          </label>
                          <input
                            type="number"
                            min={1}
                            className="border border-slate-200 p-3 rounded-lg w-full text-sm focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none bg-white shadow-sm hover:border-slate-300 transition-all duration-200"
                            value={formData.operatives}
                            onChange={(e) =>
                              handleInput("operatives", e.target.value)
                            }
                          />
                          <p className="text-xs text-slate-500 mt-1">
                            Optional – if left blank, we&apos;ll assume 1 in
                            the document.
                          </p>
                        </div>
                      </div>
                    </div>

                    {questions.length > 0 && (
                      <div className="bg-[#e4ecf7] p-4 rounded-xl border border-slate-200">
                        <h4 className="font-semibold text-sm text-slate-900 mb-3">
                          Pre-Start Safety Checks (optional responses)
                        </h4>
                        <p className="text-xs text-slate-600 mb-3">
                          Answer each question honestly. Where you leave it
                          blank here, the document will show N/A.
                        </p>
                        <div className="space-y-2">
                          {questions.map((q: any) => (
                            <div
                              key={q.id}
                              className="flex justify-between items-center gap-4 bg-white p-2.5 rounded-lg border border-slate-200"
                            >
                              <span className="text-sm text-slate-900">
                                {q.label}
                              </span>
                              <div className="flex gap-2 shrink-0">
                                <button
                                  onClick={() =>
                                    setAnswers({
                                      ...answers,
                                      [q.id]: "Yes",
                                    })
                                  }
                                  className={`px-3 py-1 rounded-md text-[11px] font-semibold ${answers[q.id] === "Yes"
                                    ? "bg-[#0b2040] text-white"
                                    : "bg-slate-100 text-slate-800"
                                    }`}
                                >
                                  Yes
                                </button>
                                <button
                                  onClick={() =>
                                    setAnswers({
                                      ...answers,
                                      [q.id]: "No",
                                    })
                                  }
                                  className={`px-3 py-1 rounded-md text-[11px] font-semibold ${answers[q.id] === "No"
                                    ? "bg-[#0b2040] text-white"
                                    : "bg-slate-100 text-slate-800"
                                    }`}
                                >
                                  No
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* JOB DESCRIPTION + EXTRA NOTES */}
                    {formData.jobType === "Other (Custom)" ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                            Custom job title (optional)
                          </label>
                          <input
                            className="w-full border border-slate-300 p-3 rounded-lg text-sm focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none bg-white"
                            value={formData.customJobTitle}
                            onChange={(e) =>
                              handleInput(
                                "customJobTitle",
                                e.target.value
                              )
                            }
                            placeholder="e.g. Bespoke maintenance task, one-off works, etc."
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700">
                            Job description (optional)
                          </label>
                          <p className="text-xs text-slate-500 mb-1">
                            Describe exactly what will be done, where, and in
                            what sequence.
                          </p>
                          <textarea
                            className="w-full border border-slate-200 p-3 rounded-lg h-32 text-sm focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none bg-white shadow-sm hover:border-slate-300 transition-all duration-200"
                            value={formData.customJobDescription}
                            onChange={(e) =>
                              handleInput(
                                "customJobDescription",
                                e.target.value
                              )
                            }
                            placeholder="Describe the task, key stages, and any critical constraints..."
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700">
                            Extra specific notes (optional)
                          </label>
                          <p className="text-xs text-slate-500 mb-1">
                            Anything else the RAMS should capture for this
                            particular job or site.
                          </p>
                          <textarea
                            className="w-full border border-slate-200 p-3 rounded-lg h-24 text-sm focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none bg-white shadow-sm hover:border-slate-300 transition-all duration-200"
                            value={formData.extraNotes}
                            onChange={(e) =>
                              handleInput("extraNotes", e.target.value)
                            }
                            placeholder="Access limitations, client instructions, special tools, out-of-hours work, etc."
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700">
                            Job description (optional)
                          </label>
                          <p className="text-xs text-slate-500 mb-1">
                            This is pre-filled from our library where
                            available. Adjust it if needed to match the actual
                            scope.
                          </p>
                          <textarea
                            className="w-full border border-slate-200 p-3 rounded-lg h-32 text-sm focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none bg-white shadow-sm hover:border-slate-300 transition-all duration-200"
                            value={formData.customDescription}
                            onChange={(e) =>
                              handleInput(
                                "customDescription",
                                e.target.value
                              )
                            }
                            placeholder="Describe the task, location, sequence and any special considerations..."
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700">
                            Extra specific notes (optional)
                          </label>
                          <p className="text-xs text-slate-500 mb-1">
                            Add anything unique to this site, client or job
                            that the standard description doesn&apos;t cover.
                          </p>
                          <textarea
                            className="w-full border border-slate-200 p-3 rounded-lg h-24 text-sm focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none bg-white shadow-sm hover:border-slate-300 transition-all duration-200"
                            value={formData.extraNotes}
                            onChange={(e) =>
                              handleInput("extraNotes", e.target.value)
                            }
                            placeholder="E.g. out-of-hours working, shared access routes, client housekeeping rules..."
                          />
                        </div>
                      </div>

                    )}

                    {/* Dynamic Extra Sections */}
                    {TRADES[formData.trade]?.clusters[formData.jobType]?.extraSections &&
                      TRADES[formData.trade].clusters[formData.jobType].extraSections!.length > 0 && (
                        <div className="space-y-4 mt-6 pt-6 border-t border-slate-200">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                            <h4 className="font-semibold text-sm text-slate-900">
                              High Complexity Job - Additional Details Required
                            </h4>
                          </div>
                          <p className="text-xs text-slate-600 mb-4">
                            This job type requires specific details for a complete safety plan.
                          </p>
                          {TRADES[formData.trade].clusters[formData.jobType].extraSections!.map((section) => (
                            <div key={section}>
                              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                                {section.replace(/_/g, " ")}
                              </label>
                              <textarea
                                className="w-full border border-slate-200 p-3 rounded-lg h-24 text-sm focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none bg-white shadow-sm hover:border-slate-300 transition-all duration-200"
                                value={formData.extraData[section] || ""}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    extraData: {
                                      ...prev.extraData,
                                      [section]: e.target.value,
                                    },
                                  }))
                                }
                                placeholder={`Enter specific details for ${section.replace(/_/g, " ")}...`}
                              />
                            </div>
                          ))}
                        </div>
                      )}

                    <div className="flex justify-between gap-3 pt-2">
                      <div className="flex gap-2">
                        <button
                          onClick={prevStep}
                          className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMode("landing");
                            setStep(1);
                            setActiveFile(null);
                          }}
                          className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          ← Back to RS Hub
                        </button>
                      </div>
                      <button
                        onClick={nextStep}
                        className="inline-flex items-center justify-center rounded-lg bg-[#0b2040] px-5 py-2.5 text-sm font-semibold text-white hover:bg-black transition-colors"
                      >
                        Next: Safety Info
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: SAFETY & EMERGENCY INFO */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-[#0b2040]" />
                      <TypedText text="Safety & Emergency Information" />
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Fields marked <span className="text-red-600">*</span>{" "}
                      are required. Use{" "}
                      <span className="font-semibold">N/A</span> where details
                      are genuinely not available.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                          Supervisor Name
                          <span className="text-red-600 ml-0.5">*</span>
                        </label>
                        <input
                          className="border border-slate-300 p-2.5 rounded-lg w-full text-sm focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none bg-white"
                          placeholder="Site supervisor or lead"
                          value={formData.supervisorName}
                          onChange={(e) =>
                            handleInput(
                              "supervisorName",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                          First Aider
                          <span className="text-red-600 ml-0.5">*</span>
                        </label>
                        <input
                          className="border border-slate-300 p-2.5 rounded-lg w-full text-sm focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none bg-white"
                          placeholder="Appointed person"
                          value={formData.firstAider}
                          onChange={(e) =>
                            handleInput("firstAider", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                          Nearest Hospital
                          <span className="text-red-600 ml-0.5">*</span>
                        </label>
                        <input
                          className="border border-slate-300 p-2.5 rounded-lg w-full text-sm focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none bg-white"
                          placeholder="e.g. Nearest A&E (N/A if unknown)"
                          value={formData.hospital}
                          onChange={(e) =>
                            handleInput("hospital", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                          Fire Assembly Point
                          <span className="text-red-600 ml-0.5">*</span>
                        </label>
                        <input
                          className="border border-slate-300 p-2.5 rounded-lg w-full text-sm focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none bg-white"
                          placeholder="As briefed in induction (or N/A)"
                          value={formData.fireAssembly}
                          onChange={(e) =>
                            handleInput("fireAssembly", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                          First aid kit location (optional)
                        </label>
                        <input
                          className="border border-slate-300 p-2.5 rounded-lg w-full text-sm focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none bg-white"
                          placeholder="e.g. Site vehicle, reception, welfare cabin"
                          value={formData.firstAidLoc}
                          onChange={(e) =>
                            handleInput("firstAidLoc", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                          Welfare / facilities (optional)
                        </label>
                        <input
                          className="border border-slate-300 p-2.5 rounded-lg w-full text-sm focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none bg-white"
                          placeholder="Toilets, wash stations, canteen, etc."
                          value={formData.welfare}
                          onChange={(e) =>
                            handleInput("welfare", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="flex justify-between gap-3 pt-2">
                      <div className="flex gap-2">
                        <button
                          onClick={prevStep}
                          className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMode("landing");
                            setStep(1);
                            setActiveFile(null);
                          }}
                          className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          ← Back to RS Hub
                        </button>
                      </div>
                      <button
                        onClick={nextStep}
                        className="inline-flex items-center justify-center rounded-lg bg-[#0b2040] px-5 py-2.5 text-sm font-semibold text-white hover:bg-black transition-colors"
                      >
                        Next: Hazards
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: HAZARDS */}
                {step === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-[#0b2040]" />
                      <TypedText text="Hazards & Risk Controls" />
                    </h2>

                    <p className="text-lg font-semibold text-red-700">
                      <TypedText text="Please ensure you select all relevant hazards for this job – this is critical for a compliant RAMS." />
                    </p>

                    <div className="space-y-4">
                      {Object.entries(HAZARD_GROUPS).map(
                        ([group, items]: [string, any]) => (
                          <div
                            key={group}
                            className="border border-slate-200 rounded-xl p-4"
                          >
                            <h4 className="text-xs font-semibold uppercase text-slate-500 mb-2">
                              {group}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {items.map((h: string) => (
                                <button
                                  key={h}
                                  onClick={() => toggleHazard(h)}
                                  className={`text-[11px] py-1.5 px-3 rounded-full border ${hazards.includes(h)
                                    ? "bg-[#0b2040] text-white border-[#0b2040]"
                                    : "bg-white text-slate-800 border-slate-300"
                                    }`}
                                >
                                  {(HAZARD_DATA as any)[h]?.label || h}
                                </button>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    <div className="flex justify-between gap-3 pt-4 border-t border-slate-200">
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={prevStep}
                          className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMode("landing");
                            setStep(1);
                            setActiveFile(null);
                          }}
                          className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          ← Back to RS Hub
                        </button>
                      </div>
                      <button
                        onClick={nextStep}
                        className="inline-flex items-center justify-center rounded-lg bg-[#0b2040] px-5 py-2.5 text-sm font-semibold text-white hover:bg-black transition-colors"
                      >
                        Next: Review &amp; Generate
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 5: REVIEW & GENERATE */}
                {step === 5 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#0b2040]" />
                      <TypedText text="Review & Generate" />
                    </h2>
                    <p className="text-sm text-slate-600">
                      Final sense-check before you generate. If anything looks
                      off, go back and adjust the relevant step.
                    </p>

                    {/* Single review panel */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-3">
                      <h3 className="text-sm font-semibold text-slate-900 mb-1">
                        Summary
                      </h3>

                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <div>
                            <span className="font-semibold">Document:</span>{" "}
                            {documentName || "Untitled RAMS"}
                          </div>
                          <div>
                            <span className="font-semibold">Company:</span>{" "}
                            {formData.companyName || "Not set"}
                          </div>
                          <div>
                            <span className="font-semibold">Client:</span>{" "}
                            {formData.clientName || "Not set"}
                          </div>
                          <div>
                            <span className="font-semibold">Site:</span>{" "}
                            {formData.siteAddress || "Not set"}
                          </div>
                          <div>
                            <span className="font-semibold">Job Ref:</span>{" "}
                            {formData.projectRef || "—"}
                          </div>
                          <div>
                            <span className="font-semibold">
                              Prepared by:
                            </span>{" "}
                            {formData.contactName || "Not set"}
                          </div>
                          <div>
                            <span className="font-semibold">Email:</span>{" "}
                            {formData.contactEmail || "—"}
                          </div>
                          <div>
                            <span className="font-semibold">Phone:</span>{" "}
                            {formData.contactPhone || "—"}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div>
                            <span className="font-semibold">Trade:</span>{" "}
                            {formData.trade}
                          </div>
                          <div>
                            <span className="font-semibold">Job type:</span>{" "}
                            {formData.jobType || "Not selected"}
                          </div>
                          <div>
                            <span className="font-semibold">Start:</span>{" "}
                            {formData.startDate || "—"}
                          </div>
                          <div>
                            <span className="font-semibold">End:</span>{" "}
                            {formData.endDate || "—"}
                          </div>
                          <div>
                            <span className="font-semibold">
                              Expected end:
                            </span>{" "}
                            {formData.expectedEndDate || "—"}
                          </div>
                          <div>
                            <span className="font-semibold">
                              Operatives:
                            </span>{" "}
                            {formData.operatives || "1 (assumed)"}
                          </div>
                          <div>
                            <span className="font-semibold">
                              Supervisor:
                            </span>{" "}
                            {formData.supervisorName || "Not set"}
                          </div>
                          <div>
                            <span className="font-semibold">
                              First aider:
                            </span>{" "}
                            {formData.firstAider || "Not set"}
                          </div>
                          <div>
                            <span className="font-semibold">Hospital:</span>{" "}
                            {formData.hospital || "Not set"}
                          </div>
                          <div>
                            <span className="font-semibold">
                              Fire assembly:
                            </span>{" "}
                            {formData.fireAssembly || "Not set"}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200 space-y-2">
                        <div>
                          <span className="font-semibold">
                            Job description:
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-700 whitespace-pre-wrap">
                          {buildScopeFromForm() || "—"}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200 space-y-1">
                        <div>
                          <span className="font-semibold">
                            Hazards selected:
                          </span>{" "}
                          {hazards.length}
                        </div>
                        <div>
                          {hazards.length === 0 ? (
                            <span className="text-[11px] text-red-700">
                              No hazards selected – you should add some
                              before generating.
                            </span>
                          ) : (
                            <ul className="list-disc list-inside text-[11px] text-slate-700 space-y-0.5">
                              {hazardPreviewLabels.slice(0, 12).map((h) => (
                                <li key={h}>{h}</li>
                              ))}
                              {hazards.length > 12 && <li>…and more</li>}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between gap-3 pt-4 border-t border-slate-200">
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={prevStep}
                          className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMode("landing");
                            setStep(1);
                            setActiveFile(null);
                          }}
                          className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          ← Back to RS Hub
                        </button>
                      </div>
                      <button
                        onClick={generateRAMS}
                        disabled={isGenerating}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                      >
                        {isGenerating ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                        {isGenerating
                          ? "Generating..."
                          : "Generate & Open in Editor"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </main>
      </div>

      {/* global animation for swipe/fade transitions */}
      <style jsx global>{`
        @keyframes rsFadeSlideIn {
          from {
            opacity: 0;
            transform: translateX(16px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .rs-fade-slide-in {
          animation: rsFadeSlideIn 0.35s ease-out;
        }
      `}</style>
    </>
  );
}

export default Page;