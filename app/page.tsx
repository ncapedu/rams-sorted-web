"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";

import {
  TRADES,
  HAZARD_GROUPS,
  HAZARD_DATA,
  JobCluster,
} from "./lib/constants";

// --- SMALL TEXT SANITISER ---
// Cleans AI text before sending into the PDF so we don't get weird spacing etc.
function sanitizeText(input: any): string {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/\r\n/g, "\n")
    .replace(/\n{2,}/g, "\n") // collapse multiple blank lines
    .replace(/[ \t]+/g, " ") // collapse multiple spaces/tabs
    .replace(/ ?([.,;:!?])/g, "$1") // remove space before punctuation
    .trim();
}

// --- UI COMPONENTS ---
const Tooltip = ({ text }: { text: string }) => (
  <div className="group relative inline-block ml-2">
    <Info className="w-4 h-4 text-gray-400 hover:text-black cursor-help transition-colors" />
    <div className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-black text-white text-xs rounded-md shadow-xl z-50 text-center leading-relaxed border border-gray-800">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black"></div>
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
      <label className="flex items-center text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
        {tooltip && <Tooltip text={tooltip} />}
      </label>
      <div className="relative">
        <input
          className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all shadow-sm"
          placeholder="Start typing address..."
          value={query}
          onChange={(e) => searchAddress(e.target.value)}
        />
        <MapPin className="w-4 h-4 absolute right-3 top-3.5 text-gray-400" />
      </div>
      {showDropdown && results.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-2xl mt-1 max-h-60 overflow-auto">
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

  // --- Update hazards/questions when trade/jobType changes ---
  useEffect(() => {
    const currentTrade = TRADES[formData.trade as keyof typeof TRADES];

    if (!currentTrade || !formData.jobType) {
      setQuestions([]);
      setHazards([]);
      return;
    }

    const clusters = currentTrade.clusters as Record<string, JobCluster>;
    const clusterData = clusters[formData.jobType];

    if (!clusterData) {
      setQuestions([]);
      return;
    }

    // For named jobs: use desc from constants
    // For "Other (Custom)": keep whatever user has typed
    setFormData((prev) => ({
      ...prev,
      customDescription:
        prev.jobType === "Other (Custom)"
          ? prev.customDescription
          : clusterData.desc || "",
    }));

    setHazards((prev) => [
      ...new Set([...(prev || []), ...(clusterData.hazards || [])]),
    ]);

    const qs = clusterData.questions || [];
    setQuestions(qs);

    const defaults: Record<string, string> = {};
    qs.forEach((q) => {
      defaults[q.id] = "Yes";
    });
    setAnswers(defaults);
  }, [formData.jobType, formData.trade]);

  const handleInput = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

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
      alert("⚠️ Please fill in Company Details.");
      return;
    }
    if (step === 2 && (!formData.clientName || !formData.siteAddress)) {
      alert("⚠️ Please fill in Project Details.");
      return;
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  // --- API HANDLER ---
  const generateRAMS = async () => {
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
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-24">
      <nav className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-50 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 font-extrabold text-xl tracking-tight text-blue-900">
          <ShieldCheck className="w-7 h-7 text-blue-700" /> RAMS Sorted
        </div>
        <div className="text-xs font-bold bg-blue-700 text-white px-4 py-1.5 rounded-full shadow-sm">
          Step {step} / 3
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="h-1.5 bg-gray-100 w-full">
            <div
              className="h-full bg-blue-600 transition-all duration-500 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          <div className="p-8">
            {/* STEP 1: COMPANY */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" /> Company Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    className="border p-3 rounded w-full"
                    placeholder="Company Name"
                    value={formData.companyName}
                    onChange={(e) =>
                      handleInput("companyName", e.target.value)
                    }
                  />
                  <input
                    className="border p-3 rounded w-full"
                    placeholder="Competent Person Name"
                    value={formData.contactName}
                    onChange={(e) =>
                      handleInput("contactName", e.target.value)
                    }
                  />
                  <AddressSearch
                    label="Office Address"
                    value={formData.officeAddress}
                    onChange={(val: string) =>
                      handleInput("officeAddress", val)
                    }
                  />
                  <input
                    className="border p-3 rounded w-full"
                    placeholder="Phone Number"
                    value={formData.contactPhone}
                    onChange={(e) =>
                      handleInput("contactPhone", e.target.value)
                    }
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded border mt-4 space-y-4">
                  <h3 className="font-bold text-sm">Project Info</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      className="border p-3 rounded w-full"
                      placeholder="Client Name"
                      value={formData.clientName}
                      onChange={(e) =>
                        handleInput("clientName", e.target.value)
                      }
                    />
                    <input
                      className="border p-3 rounded w-full"
                      placeholder="Job Ref (Optional)"
                      value={formData.projectRef}
                      onChange={(e) =>
                        handleInput("projectRef", e.target.value)
                      }
                    />
                  </div>
                  <AddressSearch
                    label="Site Address"
                    value={formData.siteAddress}
                    onChange={(val: string) =>
                      handleInput("siteAddress", val)
                    }
                  />
                </div>

                <button
                  onClick={nextStep}
                  className="bg-black text-white w-full py-3 rounded font-bold mt-4"
                >
                  Next Step
                </button>
              </div>
            )}

            {/* STEP 2: SCOPE */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Job Scope
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    className="border p-3 rounded w-full"
                    value={formData.trade}
                    onChange={(e) => handleInput("trade", e.target.value)}
                  >
                    {Object.keys(TRADES).map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>

                  {/* @ts-ignore */}
                  <select
                    className="border p-3 rounded w-full"
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

                {questions.length > 0 && (
                  <div className="bg-blue-50 p-4 rounded border border-blue-100">
                    <h4 className="font-bold text-sm text-blue-900 mb-3">
                      Pre-Start Safety Checks
                    </h4>
                    {questions.map((q: any) => (
                      <div
                        key={q.id}
                        className="flex justify-between items-center mb-2 bg-white p-2 rounded border"
                      >
                        <span className="text-sm">{q.label}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              setAnswers({ ...answers, [q.id]: "Yes" })
                            }
                            className={`px-3 py-1 rounded text-xs font-bold ${
                              answers[q.id] === "Yes"
                                ? "bg-black text-white"
                                : "bg-gray-100"
                            }`}
                          >
                            Yes
                          </button>
                          <button
                            onClick={() =>
                              setAnswers({ ...answers, [q.id]: "No" })
                            }
                            className={`px-3 py-1 rounded text-xs font-bold ${
                              answers[q.id] === "No"
                                ? "bg-black text-white"
                                : "bg-gray-100"
                            }`}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <textarea
                  className="w-full border p-3 rounded h-32"
                  value={formData.customDescription}
                  onChange={(e) =>
                    handleInput("customDescription", e.target.value)
                  }
                  placeholder="Add any site-specific notes or constraints..."
                />

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="w-1/3 border py-3 rounded"
                  >
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="w-2/3 bg-black text-white py-3 rounded font-bold"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: HAZARDS */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> Safety & Hazards
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded border">
                  <input
                    className="border p-2 rounded"
                    placeholder="Supervisor Name"
                    value={formData.supervisorName}
                    onChange={(e) =>
                      handleInput("supervisorName", e.target.value)
                    }
                  />
                  <input
                    className="border p-2 rounded"
                    placeholder="First Aider"
                    value={formData.firstAider}
                    onChange={(e) =>
                      handleInput("firstAider", e.target.value)
                    }
                  />
                  <input
                    className="border p-2 rounded"
                    placeholder="Nearest Hospital"
                    value={formData.hospital}
                    onChange={(e) =>
                      handleInput("hospital", e.target.value)
                    }
                  />
                  <input
                    className="border p-2 rounded"
                    placeholder="Fire Assembly Point"
                    value={formData.fireAssembly}
                    onChange={(e) =>
                      handleInput("fireAssembly", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-4">
                  {Object.entries(HAZARD_GROUPS).map(
                    ([group, items]: [string, any]) => (
                      <div key={group} className="border p-4 rounded-lg">
                        <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">
                          {group}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {items.map((h: string) => (
                            <button
                              key={h}
                              onClick={() => toggleHazard(h)}
                              className={`text-xs py-1 px-3 rounded border ${
                                hazards.includes(h)
                                  ? "bg-black text-white"
                                  : "bg-white"
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

                <div className="mt-6 pt-6 border-t">
                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(2)}
                      className="w-1/3 border py-3 rounded"
                    >
                      Back
                    </button>
                    <button
                      onClick={generateRAMS}
                      disabled={isGenerating}
                      className="w-2/3 bg-green-600 text-white py-3 rounded font-bold flex justify-center items-center gap-2"
                    >
                      {isGenerating ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <ShieldCheck />
                      )}
                      {isGenerating ? "Generating..." : "Generate PDF Pack"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}