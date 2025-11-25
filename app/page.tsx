"use client";

import { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Loader2,
  ShieldCheck,
  MapPin,
  Briefcase,
  AlertTriangle,
  Info,
  FileText,
  Search,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  TRADES,
  HAZARD_GROUPS,
  HAZARD_DATA,
  JobCluster,
} from "./lib/constants";

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
    <Info className="w-4 h-4 text-slate-400 hover:text-slate-900 cursor-help transition-colors" />
    <div className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-md shadow-xl z-50 text-center leading-relaxed border border-slate-700">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
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
      <label className="flex items-center text-xs font-semibold uppercase tracking-[0.12em] text-slate-600 mb-1.5">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
        {tooltip && <Tooltip text={tooltip} />}
      </label>
      <div className="relative">
        <input
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent shadow-sm"
          placeholder="Start typing address..."
          value={query}
          onChange={(e) => searchAddress(e.target.value)}
        />
        <MapPin className="w-4 h-4 absolute right-3 top-3.5 text-slate-400" />
      </div>
      {showDropdown && results.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-slate-200 rounded-lg shadow-2xl mt-1 max-h-60 overflow-auto text-xs">
          {results.map((r: any, i: number) => (
            <li
              key={i}
              onClick={() => {
                setQuery(r.display_name);
                onChange(r.display_name);
                setShowDropdown(false);
              }}
              className="p-3 hover:bg-slate-50 cursor-pointer border-b last:border-0 text-slate-700 leading-tight"
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
export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const mainRef = useRef<HTMLDivElement | null>(null);

  const [formData, setFormData] = useState({
    companyName: "",
    officeAddress: "",
    email: "",
    contactName: "",
    contactPhone: "",
    clientName: "",
    projectRef: "",
    siteAddress: "",
    startDate: new Date().toISOString().split("T")[0],
    duration: "1 Day",
    operatives: "1",
    trade: "Electrician",
    jobType: "",
    customJobType: "",
    jobDesc: "",
    supervisorName: "",
    firstAider: "",
    hospital: "",
    fireAssembly: "As Inducted",
    firstAidLoc: "Site Vehicle",
    welfare: "Client WC",
    extraNotes: "",
    accessCode: "",
    customDescription: "",
  });

  const [hazards, setHazards] = useState<string[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Scroll main panel to top when step changes
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step]);

  // --- Update hazards/questions when trade/jobType changes ---
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

    // Set description: for "Other (Custom)" start blank, otherwise use library desc
    setFormData((prev) => ({
      ...prev,
      customDescription:
        formData.jobType === "Other (Custom)"
          ? ""
          : clusterData.desc || "",
    }));

    // Replace hazards with just this job's hazards
    setHazards(clusterData.hazards || []);

    // Replace questions; no default "Yes" anymore
    const qs = clusterData.questions || [];
    setQuestions(qs);
    setAnswers({});
  }, [formData.jobType, formData.trade]);

  const handleInput = (field: string, value: string) => {
    if (field === "trade") {
      setFormData((prev) => ({
        ...prev,
        trade: value,
        jobType: "",
        customJobType: "",
        customDescription: "",
      }));
      setQuestions([]);
      setHazards([]);
      setAnswers({});
      return;
    }

    if (field === "jobType") {
      setFormData((prev) => ({
        ...prev,
        jobType: value,
        ...(value !== "Other (Custom)" ? { customJobType: "" } : {}),
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleHazard = (h: string) =>
    setHazards((prev) =>
      prev.includes(h) ? prev.filter((i) => i !== h) : [...prev, h]
    );

  const nextStep = () => {
    if (
      step === 1 &&
      (!formData.companyName ||
        !formData.officeAddress ||
        !formData.contactName)
    ) {
      alert("⚠️ Please fill in Company Name, Office Address and Competent Person Name.");
      return;
    }
    if (step === 2 && (!formData.clientName || !formData.siteAddress)) {
      alert("⚠️ Please fill in Client Name and Site Address.");
      return;
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  // --- API HANDLER ---
  const generateRAMS = async () => {
    if (
      !formData.supervisorName ||
      !formData.firstAider ||
      !formData.hospital ||
      !formData.fireAssembly
    ) {
      alert(
        "⚠️ Please complete the emergency details (Supervisor, First Aider, Nearest Hospital, Fire Assembly Point). If something is not known, enter 'N/A'."
      );
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          hazards,
          answers,
          customDescription: formData.customDescription,
          extraNotes: formData.extraNotes,
        }),
      });

      let apiData: any = {};

      if (res.ok) {
        apiData = await res.json();
      } else {
        const errorBody = await res.json().catch(() => ({}));
        console.error("API Failed:", res.status, errorBody);
        alert(
          `AI API error (${res.status}): ${
            (errorBody as any)?.error ||
            (errorBody as any)?.message ||
            "Check browser console and Vercel logs."
          }`
        );
      }

      createPDF(apiData || {});
    } catch (e: any) {
      console.error("Frontend fetch error:", e);
      alert(`Frontend fetch error: ${e.message || e}`);
      createPDF({});
    } finally {
      setIsGenerating(false);
    }
  };

  // --- PDF ENGINE ---
  const createPDF = (apiData: any) => {
    const doc = new jsPDF();
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;
    let currentY = margin;

    const checkPageBreak = (needed: number) => {
      if (currentY + needed > pageHeight - margin) {
        doc.addPage();
        currentY = margin + 15;
        drawHeader(doc);
        return true;
      }
      return false;
    };

    const toTitleCase = (str: string) =>
      str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });

    const drawHeader = (docInstance: any) => {
      docInstance.setDrawColor(0);
      docInstance.setLineWidth(0.1);
      docInstance.setFont("helvetica", "bold");
      docInstance.setFontSize(11);
      docInstance.text(
        "RISK ASSESSMENT & METHOD STATEMENT",
        margin,
        12
      );
      docInstance.setFontSize(9);
      docInstance.setFont("helvetica", "normal");
      docInstance.text(
        `Ref: ${formData.projectRef || "N/A"} | Date: ${
          formData.startDate
        }`,
        pageWidth - margin,
        12,
        { align: "right" }
      );
      docInstance.line(margin, 15, pageWidth - margin, 15);
    };

    const drawFooter = (docInstance: any, i: number, total: number) => {
      docInstance.setFontSize(8);
      docInstance.setTextColor(0);
      docInstance.text(
        `Site: ${formData.siteAddress}`,
        margin,
        pageHeight - 10
      );
      docInstance.text(
        `Page ${i} of ${total}`,
        pageWidth - margin,
        pageHeight - 10,
        { align: "right" }
      );
    };

    // 1. PROJECT & JOB DETAILS
    drawHeader(doc);
    currentY = 25;
    doc.setTextColor(0);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("1. PROJECT & JOB DETAILS", margin, currentY);
    currentY += 6;

    autoTable(doc, {
      startY: currentY,
      theme: "grid",
      body: [
        ["Company Name", sanitizeText(formData.companyName)],
        ["Site Address", sanitizeText(formData.siteAddress)],
        ["Client", sanitizeText(formData.clientName)],
        [
          "Job / Task Title",
          sanitizeText(
            `${formData.trade} - ${
              formData.jobType
                ? toTitleCase(
                    formData.jobType === "Other (Custom)" &&
                    formData.customJobType.trim().length > 0
                      ? formData.customJobType
                      : formData.jobType
                  )
                : ""
            }`
          ),
        ],
        ["Date of RAMS", sanitizeText(formData.startDate)],
        [
          "Prepared By",
          sanitizeText(`${formData.contactName} (Competent Person)`),
        ],
        ["Operatives", sanitizeText(formData.operatives)],
      ],
      styles: {
        fontSize: 9,
        cellPadding: 3,
        textColor: 0,
        lineColor: 0,
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [245, 245, 245],
        textColor: 0,
        fontStyle: "bold",
      },
      columnStyles: {
        0: {
          fontStyle: "bold",
          cellWidth: 50,
          fillColor: [245, 245, 245],
        },
        1: { cellWidth: "auto" },
      },
    } as any);
    // @ts-ignore
    currentY = (doc as any).lastAutoTable.finalY + 12;

    // 2. SCOPE OF WORKS
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("2. SCOPE OF WORKS", margin, currentY);
    currentY += 6;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const scopeBase =
      apiData.summary ||
      formData.customDescription ||
      "Standard works as per industry guidelines.";
    const extra =
      formData.extraNotes && formData.extraNotes.trim().length > 0
        ? `\n\nAdditional site-specific notes: ${formData.extraNotes}`
        : "";
    const scopeText = doc.splitTextToSize(
      sanitizeText(scopeBase + extra),
      contentWidth
    );
    doc.text(scopeText, margin, currentY);
    currentY += scopeText.length * 5 + 12;

    // 3. PRE-START SAFETY CHECKLIST
    if (questions.length > 0) {
      checkPageBreak(60);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("3. PRE-START SAFETY CHECKLIST", margin, currentY);
      currentY += 6;

      const checkRows = questions.map((q, i) => [
        (i + 1).toString(),
        sanitizeText(q.label),
        answers[q.id] === "Yes" ? "Yes" : "",
        answers[q.id] === "No" ? "No" : "",
        " ",
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [["No.", "Checklist Question", "YES", "NO", "N/A"]],
        body: checkRows,
        theme: "grid",
        styles: {
          fontSize: 9,
          textColor: 0,
          lineColor: 0,
          lineWidth: 0.1,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [240, 240, 240],
          textColor: 0,
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: 10, halign: "center" },
          2: { halign: "center", cellWidth: 15 },
          3: { halign: "center", cellWidth: 15 },
          4: { halign: "center", cellWidth: 15 },
        },
      } as any);

      // @ts-ignore
      currentY = (doc as any).lastAutoTable.finalY + 12;
    }

    // 4. RISK ASSESSMENT
    checkPageBreak(80);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("4. RISK ASSESSMENT", margin, currentY);
    currentY += 6;
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text(
      "Risk Key: High (15-25), Medium (8-12), Low (1-6)",
      margin,
      currentY
    );
    currentY += 4;

    const hazardRows = hazards
      .map((hKey) => {
        const lib = (HAZARD_DATA as any)[hKey];
        if (!lib) return null;
        return [
          sanitizeText(lib.label),
          sanitizeText(lib.risk),
          "Ops/Public",
          sanitizeText(String(lib.initial_score)),
          sanitizeText(lib.control),
          sanitizeText(String(lib.residual_score)),
        ];
      })
      .filter((row): row is string[] => row !== null);

    autoTable(doc, {
      startY: currentY,
      head: [["Hazard", "Risk / Harm", "Who", "Init", "Control Measures", "Res"]],
      body: hazardRows,
      theme: "grid",
      styles: {
        fontSize: 8,
        textColor: 0,
        lineColor: 0,
        lineWidth: 0.1,
        cellPadding: 2,
        valign: "top",
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [230, 230, 230],
        textColor: 0,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 25, fontStyle: "bold" },
        1: { cellWidth: 35 },
        2: { cellWidth: 20 },
        3: { cellWidth: 25, halign: "center" },
        4: { cellWidth: "auto" },
        5: { cellWidth: 25, halign: "center" },
      },
    } as any);
    // @ts-ignore
    currentY = (doc as any).lastAutoTable.finalY + 12;

    // 5. METHOD STATEMENT
    checkPageBreak(60);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("5. METHOD STATEMENT", margin, currentY);
    currentY += 8;

    const methodSteps =
      apiData.method_steps ||
      [
        "5.1 PRE-START: Arrive on site and verify conditions.",
        "5.2 SAFETY: Set up safe system of work.",
        `5.3 EXECUTION: Carry out ${formData.jobType}.`,
        "5.4 COMPLETION: Test, tidy and hand over.",
      ];

    const finalMethods =
      Array.isArray(methodSteps) && typeof methodSteps[0] === "string"
        ? methodSteps.map((s: string) => {
            const cleaned = sanitizeText(s);
            const titleMatch = cleaned.match(/^(\d+\.\d+[^:]*:)/);
            const title = titleMatch ? titleMatch[1] : "Step";
            const text = titleMatch
              ? cleaned.replace(titleMatch[1], "").trim()
              : cleaned;
            return {
              t: title,
              d: text,
            };
          })
        : (methodSteps as any[]);

    finalMethods.forEach((stepObj: any) => {
      checkPageBreak(25);
      doc.setFont("helvetica", "bold");
      doc.text(sanitizeText(stepObj.t || "Step"), margin, currentY);
      currentY += 5;
      doc.setFont("helvetica", "normal");
      const textLines = doc.splitTextToSize(
        sanitizeText(stepObj.d || stepObj),
        contentWidth
      );
      doc.text(textLines, margin, currentY);
      currentY += textLines.length * 5 + 5;
    });
    currentY += 5;

    // 6. PPE REQUIREMENTS
    checkPageBreak(60);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("6. PPE REQUIREMENTS", margin, currentY);
    currentY += 6;

    autoTable(doc, {
      startY: currentY,
      head: [["Item", "Requirement Status"]],
      body: [
        ["Safety Boots", "Mandatory"],
        ["Gloves", "Mandatory"],
        ["Eye Protection", "Task Dependent"],
      ],
      theme: "grid",
      headStyles: { fillColor: [230, 230, 230], textColor: 0 },
      styles: { fontSize: 9, lineColor: 0, lineWidth: 0.1 },
    } as any);
    // @ts-ignore
    currentY = (doc as any).lastAutoTable.finalY + 10;

    // 7. COSHH / SUBSTANCES
    checkPageBreak(60);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("7. COSHH / SUBSTANCES", margin, currentY);
    currentY += 6;

    const coshhRaw =
      apiData.coshh ||
      [["Construction Dust", "Inhalation", "LEV / Mask", "Bagged & Sealed"]];

    const coshhBody = Array.isArray(coshhRaw[0])
      ? coshhRaw
      : coshhRaw.map((c: any) => [
          sanitizeText(c.substance),
          sanitizeText(c.risk),
          sanitizeText(c.control),
          sanitizeText(c.disposal),
        ]);

    autoTable(doc, {
      startY: currentY,
      head: [["Substance", "Risks", "Controls", "Disposal"]],
      body: coshhBody,
      theme: "grid",
      headStyles: { fillColor: [230, 230, 230], textColor: 0 },
      styles: {
        fontSize: 8,
        textColor: 0,
        lineColor: 0,
        lineWidth: 0.1,
        overflow: "linebreak",
      },
    } as any);
    // @ts-ignore
    currentY = (doc as any).lastAutoTable.finalY + 10;

    // 8. EMERGENCY ARRANGEMENTS
    checkPageBreak(50);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("8. EMERGENCY ARRANGEMENTS", margin, currentY);
    currentY += 6;

    autoTable(doc, {
      startY: currentY,
      body: [
        ["First Aid", sanitizeText(formData.firstAider || "TBC")],
        ["Hospital", sanitizeText(formData.hospital || "Nearest A&E")],
        ["Fire Point", sanitizeText(formData.fireAssembly || "As Inducted")],
        ["Supervisor", sanitizeText(formData.supervisorName || "TBC")],
      ],
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineColor: 0,
        lineWidth: 0.1,
      },
      columnStyles: {
        0: {
          fontStyle: "bold",
          cellWidth: 50,
          fillColor: [245, 245, 245],
        },
      },
    } as any);
    // @ts-ignore
    currentY = (doc as any).lastAutoTable.finalY + 12;

    // 9. OPERATIVE BRIEFING REGISTER
    doc.addPage();
    drawHeader(doc);
    currentY = 25;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("9. OPERATIVE BRIEFING REGISTER", margin, currentY);
    currentY += 6;

    autoTable(doc, {
      startY: currentY,
      head: [["No.", "Operative Name", "Signature", "Date"]],
      body: [
        ["1", "", "", ""],
        ["2", "", "", ""],
        ["3", "", "", ""],
      ],
      theme: "grid",
      styles: {
        minCellHeight: 12,
        lineColor: 0,
        lineWidth: 0.1,
      },
      headStyles: { fillColor: [230, 230, 230], textColor: 0 },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
      },
    } as any);
    // @ts-ignore
    currentY = (doc as any).lastAutoTable.finalY + 15;

    // 10. AUTHORISATION
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("10. AUTHORISATION", margin, currentY);
    currentY += 6;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("I confirm I have read this RAMS.", margin, currentY);
    currentY += 10;

    doc.setDrawColor(0);
    doc.rect(margin, currentY, contentWidth, 40);
    doc.text(
      "Signed: __________________________",
      margin + 5,
      currentY + 30
    );

    const pageCount = (doc as any).internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      drawFooter(doc, i, pageCount);
    }

    const safeName =
      formData.companyName?.trim().length > 0
        ? formData.companyName.replace(/ /g, "_")
        : "RAMS";
    doc.save(`RAMS_${safeName}.pdf`);
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent shadow-sm placeholder:text-slate-400";

  // --- UI RENDER ---
  return (
    <div className="h-screen flex bg-slate-200 text-slate-900 font-sans">
      {/* SIDEBAR */}
      <aside
        className={`flex flex-col h-full border-r border-slate-300 transition-all duration-300 ease-out ${
          sidebarOpen ? "w-72 bg-slate-200" : "w-14 bg-white"
        }`}
      >
        {sidebarOpen ? (
          <>
            {/* Header with title + collapse */}
            <div className="flex items-center justify-between px-4 pt-4 pb-3">
              <div className="text-[11px] font-semibold tracking-[0.22em] uppercase text-slate-700">
                RAMS Builder
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-800 text-white hover:bg-blue-700 shadow-md"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <div className="px-4 pb-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  className="w-full rounded-full bg-white border border-slate-200 pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
                  placeholder="Search history (coming soon)"
                  disabled
                />
              </div>
            </div>

            {/* History section with its own scroll */}
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 mb-2">
                History
              </div>
              <div className="text-xs text-slate-400 bg-white border border-dashed border-slate-200 rounded-lg px-3 py-3">
                No RAMS generated yet.
              </div>
            </div>

            {/* Account footer */}
            <div className="px-4 py-3 border-t border-slate-300 flex items-center justify-between">
              <button className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-blue-800 text-[11px] font-semibold text-white flex items-center justify-center">
                  N
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-slate-800">
                    Account
                  </div>
                  <div className="text-[11px] text-slate-500">
                    RAMS Sorted
                  </div>
                </div>
              </button>
              <button className="h-8 w-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          // Collapsed sidebar
          <div className="flex flex-col h-full items-center justify-between py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-800 text-white hover:bg-blue-700 shadow-md"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="mb-2 flex flex-col items-center gap-3">
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-800 text-[10px] font-semibold text-white">
                N
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* MAIN WIZARD PANEL */}
      <main
        ref={mainRef}
        className="flex-1 bg-white overflow-y-auto"
      >
        <div className="w-full px-5 sm:px-10 py-6 sm:py-7">
          {/* Header + progress */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-slate-500">
              <FileText className="w-4 h-4 text-slate-400" />
              RAMS Wizard
            </div>
            <div className="text-[11px] font-medium text-slate-500">
              Step {step} of 3
            </div>
          </div>

          <div className="h-1.5 rounded-full bg-slate-100 mb-6">
            <div
              className="h-full rounded-full bg-blue-800 transition-all duration-500 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          {/* STEP 1: COMPANY */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-slate-900" />
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Company Details
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    These details feed directly into the header of your RAMS
                    document.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 mb-1.5">
                      Company Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      className={inputClass}
                      placeholder="Your company name"
                      value={formData.companyName}
                      onChange={(e) =>
                        handleInput("companyName", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 mb-1.5">
                      Competent Person Name{" "}
                      <span className="text-red-600">*</span>
                    </label>
                    <input
                      className={inputClass}
                      placeholder="Who is preparing this RAMS?"
                      value={formData.contactName}
                      onChange={(e) =>
                        handleInput("contactName", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AddressSearch
                    label="Office Address"
                    required
                    value={formData.officeAddress}
                    onChange={(val: string) =>
                      handleInput("officeAddress", val)
                    }
                  />
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 mb-1.5">
                      Phone Number{" "}
                      <span className="text-slate-400 font-normal">
                        (optional)
                      </span>
                    </label>
                    <input
                      className={inputClass}
                      placeholder="Optional"
                      value={formData.contactPhone}
                      onChange={(e) =>
                        handleInput("contactPhone", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 mb-1.5">
                      Email{" "}
                      <span className="text-slate-400 font-normal">
                        (optional)
                      </span>
                    </label>
                    <input
                      className={inputClass}
                      placeholder="Optional"
                      value={formData.email}
                      onChange={(e) =>
                        handleInput("email", e.target.value)
                      }
                    />
                  </div>
                  <div />
                </div>

                <div className="mt-1 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 space-y-4">
                  <h3 className="text-sm font-semibold text-slate-800">
                    Project Info
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 mb-1.5">
                        Client Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        className={inputClass}
                        placeholder="Client name"
                        value={formData.clientName}
                        onChange={(e) =>
                          handleInput("clientName", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 mb-1.5">
                        Job Ref{" "}
                        <span className="text-slate-400 font-normal">
                          (optional)
                        </span>
                      </label>
                      <input
                        className={inputClass}
                        placeholder="Optional"
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
                  />
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={nextStep}
                  className="w-full md:w-auto px-6 py-3 rounded-full bg-blue-800 text-white text-sm font-semibold shadow-sm hover:bg-blue-700"
                >
                  Next: Job Scope
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SCOPE */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-900" />
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Job Scope
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Choose the trade and job type. We auto-fill a description
                    you can refine.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 mb-1.5">
                      Trade
                    </label>
                    <select
                      className={inputClass}
                      value={formData.trade}
                      onChange={(e) => handleInput("trade", e.target.value)}
                    >
                      {Object.keys(TRADES).map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 mb-1.5">
                      Job Type
                    </label>
                    {/* @ts-ignore */}
                    <select
                      className={inputClass}
                      value={formData.jobType}
                      onChange={(e) => handleInput("jobType", e.target.value)}
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

                {formData.jobType === "Other (Custom)" && (
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 mb-1.5">
                      Custom Job Title
                    </label>
                    <input
                      className={inputClass}
                      placeholder="e.g. Safe isolation before works"
                      value={formData.customJobType}
                      onChange={(e) =>
                        handleInput("customJobType", e.target.value)
                      }
                    />
                  </div>
                )}

                {questions.length > 0 && (
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-sm text-slate-900">
                        Pre-Start Safety Checks
                      </h4>
                      <span className="text-[11px] text-slate-500">
                        Select Yes / No for each – leave blank if not
                        applicable.
                      </span>
                    </div>
                    {questions.map((q: any) => (
                      <div
                        key={q.id}
                        className="flex justify-between items-center mb-2 bg-white p-2.5 rounded-lg border border-slate-100"
                      >
                        <span className="text-sm text-slate-800 pr-4">
                          {q.label}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              setAnswers({ ...answers, [q.id]: "Yes" })
                            }
                            className={`px-3 py-1 rounded-full text-[11px] font-semibold ${
                              answers[q.id] === "Yes"
                                ? "bg-blue-800 text-white"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            Yes
                          </button>
                          <button
                            onClick={() =>
                              setAnswers({ ...answers, [q.id]: "No" })
                            }
                            className={`px-3 py-1 rounded-full text-[11px] font-semibold ${
                              answers[q.id] === "No"
                                ? "bg-blue-800 text-white"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 mb-1.5">
                      Job Description
                    </label>
                    <textarea
                      className={`${inputClass} h-32 resize-none`}
                      value={formData.customDescription}
                      onChange={(e) =>
                        handleInput("customDescription", e.target.value)
                      }
                      placeholder={
                        formData.jobType
                          ? "Describe the works to be carried out..."
                          : "Select a job type first..."
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 mb-1.5">
                      Extra site-specific notes{" "}
                      <span className="text-slate-400 font-normal">
                        (optional)
                      </span>
                    </label>
                    <textarea
                      className={`${inputClass} h-24 resize-none`}
                      value={formData.extraNotes}
                      onChange={(e) =>
                        handleInput("extraNotes", e.target.value)
                      }
                      placeholder="Any specific constraints, client instructions or unusual risks…"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={prevStep}
                  className="w-1/3 md:w-auto px-4 py-2.5 rounded-full border border-slate-200 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="flex-1 md:flex-none md:w-auto bg-blue-800 text-white py-2.5 px-6 rounded-full text-sm font-semibold shadow-sm hover:bg-blue-700"
                >
                  Next: Safety & Hazards
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: HAZARDS */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-slate-900" />
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Safety & Hazards
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Confirm key emergency details and select the hazards that
                    apply to this job.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 mb-1.5">
                    Supervisor Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    className={inputClass}
                    placeholder="Supervisor on site"
                    value={formData.supervisorName}
                    onChange={(e) =>
                      handleInput("supervisorName", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 mb-1.5">
                    First Aider <span className="text-red-600">*</span>
                  </label>
                  <input
                    className={inputClass}
                    placeholder="Designated first aider"
                    value={formData.firstAider}
                    onChange={(e) =>
                      handleInput("firstAider", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 mb-1.5">
                    Nearest Hospital <span className="text-red-600">*</span>
                  </label>
                  <input
                    className={inputClass}
                    placeholder="Nearest A&E"
                    value={formData.hospital}
                    onChange={(e) =>
                      handleInput("hospital", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 mb-1.5">
                    Fire Assembly Point <span className="text-red-600">*</span>
                  </label>
                  <input
                    className={inputClass}
                    placeholder="As inducted / site plan"
                    value={formData.fireAssembly}
                    onChange={(e) =>
                      handleInput("fireAssembly", e.target.value)
                    }
                  />
                </div>
                <p className="md:col-span-2 text-[11px] text-slate-500">
                  If you genuinely don’t know something at this stage, type{" "}
                  <span className="font-semibold">“N/A”</span> – but this should
                  be agreed with the client or site management before works
                  start.
                </p>
              </div>

              <div className="space-y-4">
                {Object.entries(HAZARD_GROUPS).map(
                  ([group, items]: [string, any]) => (
                    <div
                      key={group}
                      className="border border-slate-100 p-4 rounded-2xl"
                    >
                      <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 mb-2">
                        {group}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {items.map((h: string) => (
                          <button
                            key={h}
                            onClick={() => toggleHazard(h)}
                            className={`text-xs py-1.5 px-3 rounded-full border ${
                              hazards.includes(h)
                                ? "bg-blue-800 text-white border-blue-800"
                                : "bg-white text-slate-800 border-slate-200"
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

              <div className="mt-6 pt-4 border-t border-slate-100 flex gap-4">
                <button
                  onClick={prevStep}
                  className="w-1/3 md:w-auto border border-slate-200 py-2.5 px-4 rounded-full text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  onClick={generateRAMS}
                  disabled={isGenerating}
                  className="flex-1 md:flex-none md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-6 rounded-full text-sm font-semibold flex justify-center items-center gap-2 shadow-sm disabled:opacity-70"
                >
                  {isGenerating ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                  {isGenerating ? "Generating..." : "Generate PDF Pack"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}