"use client";

import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// We import JobCluster to help TypeScript understand the data structure
import { TRADES, HAZARD_DATA, JobCluster } from "./lib/constants";

// --- 1. TYPES & INTERFACES ---

interface FormData {
  trade: keyof typeof TRADES;
  job: string;
  clientName: string;
  siteAddress: string;
  date: string;
  customDescription: string; // This feeds the "Method Notes" box
}

// Holds the Yes/No state for safety questions. Key = question ID, Value = "Yes" | "No"
interface SafetyResponses {
  [key: string]: string; 
}

export default function Home() {
  // --- 2. STATE MANAGEMENT ---

  // Controls which Wizard Step is visible (1, 2, or 3)
  const [step, setStep] = useState(1); 
  
  // Loading & Status indicators for PDF generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState("");

  // Main Data State
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

  // Effect B: THE CRITICAL FIX - Auto-fill Description & Reset Safety Checks
  // This runs whenever Trade or Job changes to pull data from the Titan DB.
  useEffect(() => {
    // 1. Guard clauses
    if (!formData.trade || !formData.job) return;
    const currentTradeData = TRADES[formData.trade];
    if (!currentTradeData) return;

    // 2. TYPE ASSERTION FIX: Tell TypeScript this object uses string keys
    const clusters = currentTradeData.clusters as Record<string, JobCluster>;
    const cluster = clusters[formData.job];

    if (cluster) {
      // 3. Update the Description Box with Titan text
      setFormData((prev) => ({ 
        ...prev, 
        customDescription: cluster.desc || "" 
      }));

      // 4. Reset Safety Checks to default (usually 'Yes')
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
    // Validation for Step 1
    if (step === 1) {
      if (!formData.clientName || !formData.siteAddress) {
        alert("Please fill in the Client Name and Site Address to proceed.");
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
      // --- A. Document Setup ---
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 14;
      let finalY = margin;

      // --- B. Header Section ---
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("RISK ASSESSMENT & METHOD STATEMENT", pageWidth / 2, finalY, { align: "center" });
      
      finalY += 15;

      // --- C. Project Details Table ---
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
        styles: { 
          lineColor: [0, 0, 0], 
          lineWidth: 0.1, 
          textColor: [0, 0, 0],
          fontSize: 10
        },
        headStyles: { 
          fillColor: [220, 220, 220], 
          textColor: [0, 0, 0],
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 50 },
        }
      });

      // @ts-ignore (AutoTable types hack)
      finalY = doc.lastAutoTable.finalY + 12;

      // --- D. Method Statement (Scope of Works) ---
      // We use the text explicitly from the text area (which was pre-filled)
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("1. Method Statement & Scope of Works", margin, finalY);
      finalY += 6;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      
      const textToPrint = formData.customDescription || "Standard works to be carried out in accordance with industry guidelines and best practice.";
      
      // Split text to ensure it fits within margins
      const wrappedText = doc.splitTextToSize(textToPrint, pageWidth - (margin * 2));
      doc.text(wrappedText, margin, finalY);
      
      // Calculate new Y position based on lines of text
      finalY += (wrappedText.length * 5) + 10;

      // --- E. Risk Assessment Table ---
      // Check if we need a page break
      if (finalY > 200) { doc.addPage(); finalY = margin; }

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("2. Risk Assessment", margin, finalY);
      finalY += 6;

      // Retrieve Hazards from Database with TYPE ASSERTION
      const tradeObj = TRADES[formData.trade];
      const clusters = tradeObj.clusters as Record<string, JobCluster>;
      const cluster = clusters[formData.job];
      const jobHazards = cluster ? cluster.hazards : [];

      // Build table rows
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
      }).filter(Boolean); // Filter out any nulls

      autoTable(doc, {
        startY: finalY,
        head: [['Hazard', 'Risk / Consequence', 'Rating', 'Control Measures', 'Resid.']],
        body: riskTableBody,
        theme: 'grid',
        styles: { 
          fontSize: 8, 
          textColor: [0, 0, 0], 
          lineColor: [0, 0, 0], 
          lineWidth: 0.1,
          cellPadding: 2
        },
        headStyles: { 
          fillColor: [50, 50, 50], 
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { cellWidth: 30, fontStyle: 'bold' }, // Hazard Name
          1: { cellWidth: 40 }, // Risk
          2: { cellWidth: 15, halign: 'center' }, // Rating
          3: { cellWidth: 'auto' }, // Controls
          4: { cellWidth: 15, halign: 'center' } // Residual
        }
      });

      // @ts-ignore
      finalY = doc.lastAutoTable.finalY + 12;

      // --- F. Pre-Start Safety Checks Table ---
      if (finalY > 220) { doc.addPage(); finalY = margin; }

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("3. Pre-Start Safety Checks", margin, finalY);
      finalY += 6;

      const questions = cluster ? cluster.questions : [];
      
      // Map questions to the user's responses
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
          styles: { 
            fontSize: 9, 
            textColor: [0,0,0], 
            lineColor: [0,0,0], 
            lineWidth: 0.1 
          },
          headStyles: { 
            fillColor: [220, 220, 220], 
            textColor: [0,0,0] 
          },
          columnStyles: {
            1: { cellWidth: 30, halign: 'center', fontStyle: 'bold' }
          }
        });
      } else {
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text("No specific safety checks required for this task.", margin, finalY);
        finalY += 10;
      }

      // --- G. Sign Off Section ---
      doc.addPage();
      finalY = margin;

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("4. Operative Acknowledgement & Sign-Off", margin, finalY);
      finalY += 10;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(
        "By signing below, I confirm I have read and understood the method statement and risk assessment above. I agree to work in accordance with the control measures outlined and permit safe working practices at all times.",
        margin,
        finalY,
        { maxWidth: pageWidth - (margin * 2) }
      );
      finalY += 15;

      autoTable(doc, {
        startY: finalY,
        head: [['Print Name', 'Signature', 'Date']],
        body: [
          ['', '', ''],
          ['', '', ''],
          ['', '', ''],
          ['', '', ''],
          ['', '', ''],
        ],
        theme: 'grid',
        styles: { minCellHeight: 15, lineColor: [0,0,0], lineWidth: 0.1 },
        headStyles: { fillColor: [220, 220, 220], textColor: [0,0,0] }
      });

      // --- H. Save File ---
      const cleanClientName = formData.clientName.replace(/[^a-z0-9]/gi, '_');
      doc.save(`RAMS_${cleanClientName}.pdf`);
      
      setStatus("Done!");
      setIsGenerating(false);

    } catch (error) {
      console.error("PDF Generation Error:", error);
      setStatus("Error generating PDF. Please check inputs.");
      setIsGenerating(false);
    }
  };

  // --- 6. RENDER HELPERS ---
  
  // Helper to safely get questions for the current view
  // Uses Type Assertion to avoid build errors
  const currentTradeObj = TRADES[formData.trade];
  const currentClusters = currentTradeObj ? (currentTradeObj.clusters as Record<string, JobCluster>) : null;
  const currentCluster = currentClusters ? currentClusters[formData.job] : null;
  const currentQuestions = currentCluster ? currentCluster.questions : [];

  return (
    <main className="min-h-screen bg-gray-50 font-sans text-slate-900">
      
      {/* --- TOP NAVIGATION BAR --- */}
      <div className="bg-white border-b px-6 py-4 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-md">
              <span className="text-lg font-bold">🛡️</span>
            </div>
            <span className="text-xl font-bold text-slate-800">RAMS Sorted</span>
          </div>
          
          {/* Step Indicator */}
          <div className="flex items-center gap-2">
            <div className={`h-2 w-8 rounded-full transition-colors ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`h-2 w-8 rounded-full transition-colors ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`h-2 w-8 rounded-full transition-colors ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto py-10 px-4">
        
        {/* --- STEP 1: CLIENT & PROJECT DETAILS --- */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-slate-800">Project Details</h2>
              <p className="text-slate-500 text-sm mt-1">Start by entering the client and site information.</p>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Client Name</label>
                  <input
                    name="clientName"
                    type="text"
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g. 14 Oak Road, Bristol, BS1 1AA"
                  value={formData.siteAddress}
                  onChange={handleChange}
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={nextStep}
                  className="bg-slate-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-all shadow-md hover:shadow-lg"
                >
                  Next Step
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- STEP 2: JOB SPECIFICS & SAFETY CHECKS --- */}
        {step === 2 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-slate-800">Job Specifics</h2>
              <p className="text-slate-500 text-sm mt-1">Select the task, review method statement, and confirm safety checks.</p>
            </div>

            <div className="p-8 space-y-8">
              
              {/* Trade & Job Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Trade</label>
                  <select
                    name="trade"
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
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
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                    value={formData.job}
                    onChange={handleChange}
                  >
                    {TRADES[formData.trade].jobs.map((j) => (
                      <option key={j.name} value={j.name}>{j.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pre-Start Safety Checks (Blue Box) */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                <h3 className="text-blue-900 font-bold text-sm mb-4 flex items-center gap-2">
                  <span>📋</span> Pre-Start Safety Checks
                </h3>
                
                {currentQuestions.length === 0 ? (
                  <p className="text-sm text-blue-700 italic">No specific safety checks for this task.</p>
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
                                ? "bg-green-100 text-green-800 border-green-300"
                                : "bg-white text-slate-500 border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => handleSafetyToggle(q.id, "No")}
                            className={`px-4 py-1.5 rounded-md text-xs font-bold border transition-all ${
                              safetyResponses[q.id] === "No"
                                ? "bg-red-100 text-red-800 border-red-300"
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

              {/* Method Statement Description Box */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Specific Site Constraints / Method Notes
                </label>
                <textarea
                  name="customDescription"
                  rows={5}
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-600 leading-relaxed resize-y"
                  value={formData.customDescription}
                  onChange={handleChange}
                  placeholder="e.g. Access via rear gate only. No noisy works between 1-2pm."
                />
                <p className="text-xs text-slate-400 mt-2">
                  This text is automatically pre-filled based on the selected task. Feel free to edit it.
                </p>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4 border-t border-gray-100">
                <button 
                  onClick={prevStep}
                  className="text-slate-500 font-semibold px-6 py-3 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="bg-slate-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-all shadow-md hover:shadow-lg"
                >
                  Next Step
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- STEP 3: GENERATE & DOWNLOAD --- */}
        {step === 3 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-slate-800">Ready to Generate</h2>
            </div>
            
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-100">
                <span className="text-4xl">📄</span>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-2">RAMS Ready</h3>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">
                We have captured the details for <strong>{formData.clientName}</strong> and configured the specific risks for <strong>{formData.job}</strong>.
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
                {isGenerating ? "Generating Document..." : "Download Professional PDF"}
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
                  <span>←</span> Need to change something? Go Back
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}