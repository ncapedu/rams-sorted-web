"use client";

import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// Ensure JobCluster is imported to satisfy TypeScript
import { TRADES, HAZARD_DATA, JobCluster } from "./lib/constants";

// --- 1. TYPES & INTERFACES ---

interface FormData {
  trade: keyof typeof TRADES;
  job: string;
  clientName: string;
  siteAddress: string;
  date: string;
  customDescription: string; // The "Method Notes" box text
}

// Holds the Yes/No state for safety questions
interface SafetyResponses {
  [key: string]: string; 
}

export default function Home() {
  // --- 2. STATE MANAGEMENT ---

  // Controls Wizard Step (1=Client, 2=Job/Safety, 3=Generate)
  const [step, setStep] = useState(1); 
  
  // Loading state for PDF generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState("");

  // Main Form Data
  const [formData, setFormData] = useState<FormData>({
    trade: "Electrician", // Default start
    job: "",
    clientName: "",
    siteAddress: "",
    date: new Date().toISOString().split("T")[0],
    customDescription: "",
  });

  // Safety Check State
  const [safetyResponses, setSafetyResponses] = useState<SafetyResponses>({});

  // --- 3. LOGIC & EFFECTS ---

  // Effect A: Auto-select the first job when the Trade changes
  useEffect(() => {
    if (TRADES[formData.trade]) {
      const firstJob = TRADES[formData.trade].jobs[0].name;
      setFormData((prev) => ({ ...prev, job: firstJob }));
    }
  }, [formData.trade]);

  // Effect B: Auto-fill Description & Reset Safety Checks
  // This ensures the "Specific Site Constraints" box is never empty
  useEffect(() => {
    if (!formData.trade || !formData.job) return;

    const currentTradeData = TRADES[formData.trade];
    if (!currentTradeData) return;

    // STRICT TYPE CASTING: Tell TypeScript to treat clusters as a string-keyed record
    const clusters = currentTradeData.clusters as Record<string, JobCluster>;
    const cluster = clusters[formData.job];

    if (cluster) {
      // 1. Fill the Description Box from Database
      setFormData((prev) => ({ 
        ...prev, 
        customDescription: cluster.desc || "" 
      }));

      // 2. Reset Safety Checks to default 'Yes'
      const newSafetyState: SafetyResponses = {};
      if (cluster.questions) {
        cluster.questions.forEach((q) => {
          newSafetyState[q.id] = "Yes";
        });
      }
      setSafetyResponses(newSafetyState);
    }
  }, [formData.trade, formData.job]);

  // --- 4. EVENT HANDLERS ---

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSafetyToggle = (id: string, value: string) => {
    setSafetyResponses((prev) => ({ ...prev, [id]: value }));
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.clientName || !formData.siteAddress) {
        alert("Please enter Client Name and Site Address.");
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  // --- 5. PDF GENERATION ENGINE ---
  const generatePDF = async () => {
    setIsGenerating(true);
    setStatus("Initializing PDF Engine...");

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const margin = 14;
      let finalY = margin;

      // --- Header ---
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("RISK ASSESSMENT & METHOD STATEMENT", pageWidth / 2, finalY, { align: "center" });
      finalY += 15;

      // --- Project Details Table ---
      autoTable(doc, {
        startY: finalY,
        head: [['Project Details', '']],
        body: [
          ['Client Name', formData.clientName],
          ['Site Address', formData.siteAddress],
          ['Contractor Trade', formData.trade],
          ['Task / Activity', formData.job],
          ['Assessment Date', formData.date],
        ],
        theme: 'plain',
        styles: { lineColor: [0, 0, 0], lineWidth: 0.1, textColor: [0, 0, 0], fontSize: 10 },
        headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0], fontStyle: 'bold' },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } }
      });

      // @ts-ignore
      finalY = doc.lastAutoTable.finalY + 12;

      // --- Method Statement (From UI Text Box) ---
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("1. Method Statement & Scope of Works", margin, finalY);
      finalY += 6;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const textToPrint = formData.customDescription || "Standard works to be carried out in accordance with industry guidelines.";
      const wrappedText = doc.splitTextToSize(textToPrint, pageWidth - (margin * 2));
      doc.text(wrappedText, margin, finalY);
      
      finalY += (wrappedText.length * 5) + 10;

      // --- Risk Assessment Table ---
      if (finalY > 200) { doc.addPage(); finalY = margin; }
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("2. Risk Assessment", margin, finalY);
      finalY += 6;

      // Get Hazards from Titan Database
      const tradeObj = TRADES[formData.trade];
      const clusters = tradeObj.clusters as Record<string, JobCluster>;
      const cluster = clusters[formData.job];
      const jobHazards = cluster ? cluster.hazards : [];

      // Build Rows (with Type Predicate for Build Safety)
      const riskTableBody = jobHazards.map((hKey) => {
        const hDef = HAZARD_DATA[hKey];
        if (!hDef) return null;
        return [
          hDef.label,
          hDef.risk,
          hDef.initial_score,
          hDef.control,
          hDef.residual_score
        ];
      }).filter((row): row is string[] => row !== null);

      autoTable(doc, {
        startY: finalY,
        head: [['Hazard', 'Risk / Consequence', 'Rating', 'Control Measures', 'Resid.']],
        body: riskTableBody,
        theme: 'grid',
        styles: { fontSize: 8, textColor: [0,0,0], lineColor: [0,0,0], lineWidth: 0.1, cellPadding: 2 },
        headStyles: { fillColor: [50, 50, 50], textColor: [255, 255, 255], fontStyle: 'bold' },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 30 }, 3: { cellWidth: 'auto' } }
      });

      // @ts-ignore
      finalY = doc.lastAutoTable.finalY + 12;

      // --- Safety Checks Table ---
      if (finalY > 220) { doc.addPage(); finalY = margin; }
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("3. Pre-Start Safety Checks", margin, finalY);
      finalY += 6;

      const questions = cluster ? cluster.questions : [];
      const safetyTableBody = questions.map((q) => [
        q.label,
        safetyResponses[q.id] || "N/A"
      ]);

      if (safetyTableBody.length > 0) {
        autoTable(doc, {
          startY: finalY,
          head: [['Checklist Item', 'Confirmation']],
          body: safetyTableBody,
          theme: 'grid',
          styles: { fontSize: 9, textColor: [0,0,0], lineColor: [0,0,0], lineWidth: 0.1 },
          headStyles: { fillColor: [220, 220, 220], textColor: [0,0,0] },
          columnStyles: { 1: { cellWidth: 30, halign: 'center', fontStyle: 'bold' } }
        });
      } else {
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text("No specific safety checks required.", margin, finalY);
      }

      // --- Sign Off ---
      doc.addPage();
      finalY = margin;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("4. Operative Sign-Off", margin, finalY);
      finalY += 10;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("By signing below, I confirm I have read and understood this RAMS document.", margin, finalY);
      finalY += 15;

      autoTable(doc, {
        startY: finalY,
        head: [['Print Name', 'Signature', 'Date']],
        body: [['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', '']],
        theme: 'grid',
        styles: { minCellHeight: 15, lineColor: [0,0,0], lineWidth: 0.1 },
        headStyles: { fillColor: [220, 220, 220], textColor: [0,0,0] }
      });

      // Save
      doc.save(`RAMS_${formData.clientName.replace(/[^a-z0-9]/gi, '_')}.pdf`);
      setStatus("Done!");
      setIsGenerating(false);

    } catch (error) {
      console.error("PDF Error:", error);
      setStatus("Error generating PDF.");
      setIsGenerating(false);
    }
  };

  // --- 6. RENDER HELPERS ---
  const currentTradeObj = TRADES[formData.trade];
  const currentClusters = currentTradeObj ? (currentTradeObj.clusters as Record<string, JobCluster>) : null;
  const currentCluster = currentClusters ? currentClusters[formData.job] : null;
  
  // Get Questions for UI
  const currentQuestions = currentCluster ? currentCluster.questions : [];
  
  // Get Hazards for UI (The "Checklist" you missed)
  const currentHazards = currentCluster ? currentCluster.hazards : [];

  return (
    <main className="min-h-screen bg-gray-50 font-sans text-slate-900">
      
      {/* --- TOP BAR --- */}
      <div className="bg-white border-b px-6 py-4 shadow-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-md">
              <span className="text-lg font-bold">🛡️</span>
            </div>
            <span className="text-xl font-bold text-slate-800">RAMS Sorted</span>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center gap-2">
            <div className={`h-2 w-10 rounded-full transition-colors ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`h-2 w-10 rounded-full transition-colors ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`h-2 w-10 rounded-full transition-colors ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-10 px-4">
        
        {/* --- STEP 1: PROJECT DETAILS --- */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-slate-800">Step 1: Project Details</h2>
              <p className="text-slate-500 text-sm mt-1">Who is this document for?</p>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Client Name</label>
                  <input
                    name="clientName"
                    type="text"
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Sarah Jones"
                    value={formData.clientName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Assessment Date</label>
                  <input
                    name="date"
                    type="date"
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Site Address</label>
                <input
                  name="siteAddress"
                  type="text"
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. 14 Oak Road, Bristol, BS1 1AA"
                  value={formData.siteAddress}
                  onChange={handleChange}
                />
              </div>
              <div className="pt-4 flex justify-end">
                <button onClick={nextStep} className="bg-slate-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-800 shadow-md transition-all">
                  Next Step &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- STEP 2: JOB & HAZARDS (THE MAIN DASHBOARD) --- */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* A. Job Selection Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-slate-800">Step 2: Job Specifics</h2>
                <p className="text-slate-500 text-sm mt-1">Select the task to auto-load hazards and method statements.</p>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Trade</label>
                  <select
                    name="trade"
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.trade}
                    onChange={handleChange}
                  >
                    {Object.keys(TRADES).map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Job Task</label>
                  <select
                    name="job"
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.job}
                    onChange={handleChange}
                  >
                    {TRADES[formData.trade].jobs.map((j) => (
                      <option key={j.name} value={j.name}>{j.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* B. Active Hazards Display (The "Checklist" Visualization) */}
            {/* This shows the user EXACTLY what risks are being covered */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-8">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                Included Hazards & Risks
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentHazards.length > 0 ? (
                  currentHazards.map((hKey) => {
                    const hData = HAZARD_DATA[hKey];
                    return (
                      <span key={hKey} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-800 border border-yellow-200">
                        ⚠️ {hData ? hData.label : hKey}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-sm text-slate-400 italic">No specific hazards mapped for this task.</span>
                )}
              </div>
            </div>

            {/* C. Safety Checks (Interactive) */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
              <h3 className="text-blue-900 font-bold text-sm mb-4 flex items-center gap-2">
                <span>📋</span> Pre-Start Safety Checks (Yes/No)
              </h3>
              {currentQuestions.length === 0 ? (
                <p className="text-sm text-blue-700 italic">No specific safety checks required.</p>
              ) : (
                <div className="space-y-3">
                  {currentQuestions.map((q) => (
                    <div key={q.id} className="flex flex-col md:flex-row md:items-center justify-between bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                      <span className="text-sm text-slate-700 font-medium flex-1 pr-4 leading-relaxed">{q.label}</span>
                      <div className="flex gap-2 mt-2 md:mt-0 shrink-0">
                        <button
                          onClick={() => handleSafetyToggle(q.id, "Yes")}
                          className={`px-4 py-1.5 rounded-md text-xs font-bold border transition-all ${
                            safetyResponses[q.id] === "Yes"
                              ? "bg-green-100 text-green-800 border-green-300 shadow-sm"
                              : "bg-white text-slate-500 border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => handleSafetyToggle(q.id, "No")}
                          className={`px-4 py-1.5 rounded-md text-xs font-bold border transition-all ${
                            safetyResponses[q.id] === "No"
                              ? "bg-red-100 text-red-800 border-red-300 shadow-sm"
                              : "bg-white text-slate-500 border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* D. Method Statement Description Box */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-8">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Specific Site Constraints / Method Notes
              </label>
              <p className="text-xs text-slate-500 mb-3">
                This text has been pre-filled based on the selected job. You can edit it to add site-specific details (e.g., "Parking in Bay 4", "Water shut-off under sink").
              </p>
              <textarea
                name="customDescription"
                rows={6}
                className="w-full p-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-700 leading-relaxed font-mono"
                value={formData.customDescription}
                onChange={handleChange}
              />
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <button onClick={prevStep} className="text-slate-500 font-semibold px-6 py-3 hover:bg-gray-100 rounded-lg transition-colors">
                Back
              </button>
              <button onClick={nextStep} className="bg-slate-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-800 shadow-md transition-all">
                Generate Preview &rarr;
              </button>
            </div>
          </div>
        )}

        {/* --- STEP 3: DOWNLOAD --- */}
        {step === 3 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 text-center">
              <h2 className="text-xl font-bold text-slate-800">Ready to Generate</h2>
            </div>
            <div className="p-12 text-center">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100">
                <span className="text-5xl">✅</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Configuration Complete</h3>
              <p className="text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
                We have configured the RAMS for <strong>{formData.clientName}</strong>.<br/>
                Job: <strong>{formData.job}</strong><br/>
                Hazards Identified: <strong>{currentHazards.length}</strong>
              </p>

              <button
                onClick={generatePDF}
                disabled={isGenerating}
                className={`w-full max-w-sm mx-auto py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1 ${
                  isGenerating 
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-xl"
                }`}
              >
                {isGenerating ? "Generating PDF..." : "Download RAMS PDF"}
              </button>

              {status && (
                <p className="mt-6 text-sm font-medium text-blue-600 animate-pulse">
                  {status}
                </p>
              )}

              <div className="mt-10 pt-6 border-t border-gray-100">
                <button 
                  onClick={prevStep} 
                  className="text-sm text-slate-400 hover:text-slate-600 font-medium flex items-center justify-center gap-2 mx-auto"
                >
                  <span>←</span> Make Changes
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}