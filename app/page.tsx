"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
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
  User,
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
export default function Home() {
  const [step, setStep] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    officeAddress: "",
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

  // Job omni-search
  const [jobSearch, setJobSearch] = useState("");
  const [jobSearchOpen, setJobSearchOpen] = useState(false);

  // Scroll container for the right (white) panel
  const mainScrollRef = useRef<HTMLDivElement | null>(null);

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

  // Scroll only the main panel to top when step changes
  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step]);

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
      setAnswers([]);
      setAnswers({});
      return;
    }

    setFormData((prev) => ({
      ...prev,
      customDescription:
        formData.jobType === "Other (Custom)"
          ? prev.customDescription || ""
          : clusterData.desc || "",
    }));

    setHazards(clusterData.hazards || []);
    const qs = clusterData.questions || [];
    setQuestions(qs);

    // reset answers, no default Yes/No
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

  const nextStep = () => {
    if (
      step === 1 &&
      (!formData.companyName ||
        !formData.officeAddress ||
        !formData.contactName)
    ) {
      alert(
        "⚠️ Please fill in Company Name, Office Address and Competent Person."
      );
      return;
    }
    if (
      step === 2 &&
      (!formData.clientName || !formData.siteAddress || !formData.jobType)
    ) {
      alert(
        "⚠️ Please fill in Client, Site Address and select a Job Type before continuing."
      );
      return;
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const generateRAMS = async () => {
    if (
      !formData.supervisorName ||
      !formData.firstAider ||
      !formData.hospital ||
      !formData.fireAssembly
    ) {
      alert(
        "⚠️ Please complete Supervisor, First Aider, Hospital and Fire Assembly details (use 'N/A' if unknown)."
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
              formData.jobType ? toTitleCase(formData.jobType) : ""
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

    const scopeRaw =
      apiData.summary ||
      formData.customDescription ||
      "Standard works as per industry guidelines.";
    const scopeText = doc.splitTextToSize(
      sanitizeText(scopeRaw),
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

  // --- UI RENDER ---
  return (
    <div className="h-screen flex overflow-hidden bg-[#f5f4f0] text-slate-900">
      {/* SIDEBAR */}
      <aside
        className={`relative flex flex-col border-r border-black/5 transition-all duration-300 ease-out ${
          sidebarOpen ? "w-64" : "w-14"
        }`}
      >
        <div className="flex h-full flex-col bg-[#c8eee6] text-slate-900">
          {/* Top brand + toggle */}
          <div className="flex items-center justify-between px-3 pt-3 pb-2">
            {sidebarOpen && (
              <div className="flex items-center gap-2">
                {/* Replace src with your own logo path under /public */}
                <div className="relative h-17 w-22">
                  <Image
                    src="/rams-logos.png"
                    alt="RAMS Sorted logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-400/60 bg-[#c8eee6] hover:bg-slate-200/80 transition-colors"
            >
              {sidebarOpen ? (
                <ChevronLeft className="w-4 h-4 text-slate-700" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-700" />
              )}
            </button>
          </div>

          {/* MAIN SIDEBAR CONTENT: SCROLLABLE */}
          <div className="flex-1 overflow-y-auto px-2 pb-2 flex flex-col">
            {/* Push things down slightly */}
            <div className="mt-4">
              {/* New file button */}
              {sidebarOpen ? (
                <button
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-[#0b2040] py-2 text-xs font-semibold text-white hover:bg-black transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>New RAMS file</span>
                </button>
              ) : (
                <div className="flex justify-center">
                  <button className="flex h-9 w-9 items-center justify-center rounded-md bg-[#0b2040] text-white hover:bg-black transition-colors">
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Recent files further down */}
            {sidebarOpen && (
              <div className="mt-6 space-y-1 text-xs text-slate-700">
                <div className="px-2 py-1 font-semibold text-[11px] uppercase tracking-wide text-slate-500">
                  Recent files
                </div>
                <button className="w-full text-left px-2 py-2 rounded-md hover:bg-slate-200/80 text-xs">
                  Example RAMS – wire this to real data later
                </button>
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
      <main className="flex-1 flex flex-col bg-white h-full">
        {/* Header with step indicator */}
        <header className="px-6 pt-4 pb-3 bg-white/90 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold text-slate-900">
                RS Wizard v1.0
              </h1>
              <p className="mt-1 text-xs text-slate-600">
                Build a compliant RAMS pack in three guided steps.
              </p>
            </div>
            <div className="inline-flex items-center rounded-full bg-[#0b2040] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white">
              Step {step} of 3
            </div>
          </div>

          {/* Progress bar full width */}
          <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-[#0b2040] transition-all duration-500 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </header>

        {/* Content area with its own scroll */}
        <section
          className="flex-1 overflow-y-auto"
          ref={mainScrollRef}
        >
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* STEP 1: COMPANY */}
            {step === 1 && (
              <div className="space-y-6">
                {/* WELCOME PANEL */}
                <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-900">
                    Welcome back
                    {formData.contactName
                      ? `, ${formData.contactName}`
                      : ""}
                    .
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    This is{" "}
                    <span className="font-semibold">RS Wizard v1.0</span>. Review
                    your company and project details below, then move through
                    the steps to generate a new RAMS file.
                  </p>
                </div>

                <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#0b2040]" />
                  Company & Project Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                      Company Name<span className="text-red-600 ml-0.5">*</span>
                    </label>
                    <input
                      className="border border-slate-300 p-3 rounded-lg w-full text-sm focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none bg-white"
                      placeholder="e.g. ACME Electrical Ltd"
                      value={formData.companyName}
                      onChange={(e) =>
                        handleInput("companyName", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                      Competent Person<span className="text-red-600 ml-0.5">*</span>
                    </label>
                    <input
                      className="border border-slate-300 p-3 rounded-lg w-full text-sm focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none bg-white"
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
                      Phone Number
                    </label>
                    <input
                      className="border border-slate-300 p-3 rounded-lg w-full text-sm focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none bg-white"
                      placeholder="Contact number for queries"
                      value={formData.contactPhone}
                      onChange={(e) =>
                        handleInput("contactPhone", e.target.value)
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
                        Client Name<span className="text-red-600 ml-0.5">*</span>
                      </label>
                      <input
                        className="border border-slate-300 p-3 rounded-lg w-full text-sm focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none bg-white"
                        placeholder="Who the RAMS are for"
                        value={formData.clientName}
                        onChange={(e) =>
                          handleInput("clientName", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                        Job Ref (Optional)
                      </label>
                      <input
                        className="border border-slate-300 p-3 rounded-lg w-full text-sm focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none bg-white"
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

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={nextStep}
                    className="inline-flex items-center justify-center rounded-lg bg-[#0b2040] px-5 py-2.5 text-sm font-semibold text-white hover:bg-black transition-colors"
                  >
                    Next: Job Scope
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: SCOPE */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#0b2040]" />
                  Job Scope & Pre-Start Checks
                </h2>

                {/* OMNI SEARCH BAR */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700">
                    Quick job search
                  </label>
                  <p className="text-[11px] text-slate-500 mb-1">
                    Start typing (e.g.{" "}
                    <span className="italic">boiler</span>) to jump straight to
                    the right trade &amp; job. You can still use the dropdowns
                    below if you prefer.
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

                        {/* Always offer an 'Other (Custom)' path */}
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
                      onChange={(e) => handleInput("trade", e.target.value)}
                    >
                      {Object.keys(TRADES).map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                      Job Type<span className="text-red-600 ml-0.5">*</span>
                    </label>
                    {/* @ts-ignore */}
                    <select
                      className="border border-slate-300 p-3 rounded-lg w-full text-sm bg-white focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none"
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

                {questions.length > 0 && (
                  <div className="bg-[#e4ecf7] p-4 rounded-xl border border-slate-200">
                    <h4 className="font-semibold text-sm text-slate-900 mb-3">
                      Pre-Start Safety Checks
                    </h4>
                    <p className="text-[11px] text-slate-600 mb-3">
                      Answer each question honestly. Leave as{" "}
                      <span className="font-semibold">N/A</span> in the PDF
                      where not applicable.
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
                                setAnswers({ ...answers, [q.id]: "Yes" })
                              }
                              className={`px-3 py-1 rounded-md text-[11px] font-semibold ${
                                answers[q.id] === "Yes"
                                  ? "bg-[#0b2040] text-white"
                                  : "bg-slate-100 text-slate-800"
                              }`}
                            >
                              Yes
                            </button>
                            <button
                              onClick={() =>
                                setAnswers({ ...answers, [q.id]: "No" })
                              }
                              className={`px-3 py-1 rounded-md text-[11px] font-semibold ${
                                answers[q.id] === "No"
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

                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700">
                    Job Description & Extra Specific Notes
                  </label>
                  <p className="text-[11px] text-slate-500">
                    This feeds the <span className="font-semibold">
                      Scope of Works
                    </span>{" "}
                    in the RAMS. Add any site-specific details or constraints.
                  </p>
                  <textarea
                    className="w-full border border-slate-300 p-3 rounded-lg h-32 text-sm focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none bg-white"
                    value={formData.customDescription}
                    onChange={(e) =>
                      handleInput("customDescription", e.target.value)
                    }
                    placeholder="Describe the task, location, sequence and any special considerations..."
                  />
                </div>

                <div className="flex justify-between gap-3 pt-2">
                  <button
                    onClick={prevStep}
                    className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="inline-flex items-center justify-center rounded-lg bg-[#0b2040] px-5 py-2.5 text-sm font-semibold text-white hover:bg-black transition-colors"
                  >
                    Next: Safety & Hazards
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: HAZARDS */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-[#0b2040]" />
                  Safety, Hazards & Emergency Info
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                      Supervisor Name<span className="text-red-600 ml-0.5">*</span>
                    </label>
                    <input
                      className="border border-slate-300 p-2.5 rounded-lg w-full text-sm focus:ring-2 focus:ring-[#0b2040] focus:border-transparent outline-none bg-white"
                      placeholder="Site supervisor or lead"
                      value={formData.supervisorName}
                      onChange={(e) =>
                        handleInput("supervisorName", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">
                      First Aider<span className="text-red-600 ml-0.5">*</span>
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
                      Nearest Hospital<span className="text-red-600 ml-0.5">*</span>
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
                      Fire Assembly Point<span className="text-red-600 ml-0.5">*</span>
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
                </div>

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
                              className={`text-[11px] py-1.5 px-3 rounded-full border ${
                                hazards.includes(h)
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

                <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between gap-3">
                  <button
                    onClick={prevStep}
                    className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={generateRAMS}
                    disabled={isGenerating}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  >
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                    {isGenerating ? "Generating..." : "Generate PDF Pack"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}