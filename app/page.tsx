"use client";

import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { TRADES, HAZARD_DATA } from "./lib/constants";

// --- TYPES ---
interface FormData {
  trade: keyof typeof TRADES;
  job: string;
  clientName: string;
  siteAddress: string;
  date: string;
  customDescription: string; // The "Method Notes" box
}

export default function Home() {
  // --- STATE ---
  const [step, setStep] = useState(1); // 1 = Client Details, 2 = Job & Safety, 3 = Generate
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState("");

  const [formData, setFormData] = useState<FormData>({
    trade: "Electrician",
    job: "",
    clientName: "",
    siteAddress: "",
    date: new Date().toISOString().split("T")[0],
    customDescription: "",
  });

  // Store Yes/No responses for Safety Checks: { "q1": "Yes", "q2": "No" }
  const [safetyResponses, setSafetyResponses] = useState<Record<string, string>>({});

  // --- EFFECTS ---

  // 1. Auto-select first job when Trade changes
  useEffect(() => {
    const firstJob = TRADES[formData.trade].jobs[0].name;
    setFormData((prev) => ({ ...prev, job: firstJob }));
  }, [formData.trade]);

  // 2. THE FIX: Auto-fill Description & Reset Safety Checks when Job changes
  useEffect(() => {
    if (formData.trade && formData.job) {
      const cluster = TRADES[formData.trade].clusters[formData.job];
      
      // Update Description Box
      if (cluster && cluster.desc) {
        setFormData((prev) => ({ ...prev, customDescription: cluster.desc }));
      } else {
        setFormData((prev) => ({ ...prev, customDescription: "" }));
      }

      // Reset Safety Checks to "Yes" by default (or empty if you prefer)
      const initialChecks: Record<string, string> = {};
      if (cluster && cluster.questions) {
        cluster.questions.forEach(q => {
          initialChecks[q.id] = "Yes";
        });
      }
      setSafetyResponses(initialChecks);
    }
  }, [formData.trade, formData.job]);

  // --- HANDLERS ---

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSafetyToggle = (id: string, value: string) => {
    setSafetyResponses(prev => ({ ...prev, [id]: value }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // --- PDF GENERATION ENGINE ---
  const generatePDF = async () => {
    setIsGenerating(true);
    setStatus("Initializing PDF Engine...");

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const margin = 14;
      let finalY = margin;

      // 1. HEADER
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("RISK ASSESSMENT & METHOD STATEMENT", pageWidth / 2, finalY, { align: "center" });
      finalY += 15;

      // 2. PROJECT DETAILS TABLE
      autoTable(doc, {
        startY: finalY,
        head: [['Project Details', '']],
        body: [
          ['Client Name', formData.clientName],
          ['Site Address', formData.siteAddress],
          ['Contractor', formData.trade],
          ['Task', formData.job],
          ['Date', formData.date],
        ],
        theme: 'plain',
        styles: { lineColor: [0, 0, 0], lineWidth: 0.1, textColor: [0, 0, 0] },
        headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0], fontStyle: 'bold' },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } }
      });

      // @ts-ignore
      finalY = doc.lastAutoTable.finalY + 10;

      // 3. METHOD STATEMENT / SCOPE (Using the Text Area Content)
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("1. Method Statement & Scope of Works", margin, finalY);
      finalY += 6;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const descText = formData.customDescription || "Standard works as per industry guidelines.";
      const wrappedDesc = doc.splitTextToSize(descText, pageWidth - (margin * 2));
      doc.text(wrappedDesc, margin, finalY);
      finalY += (wrappedDesc.length * 5) + 10;

      // 4. RISK ASSESSMENT
      if (finalY > 240) { doc.addPage(); finalY = margin; }
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("2. Risk Assessment", margin, finalY);
      finalY += 6;

      const cluster = TRADES[formData.trade].clusters[formData.job];
      const jobHazards = cluster ? cluster.hazards : [];
      
      const riskBody = jobHazards.map(k => {
        const h = HAZARD_DATA[k];
        return h ? [h.label, h.risk, h.initial_score, h.control, h.residual_score] : null;
      }).filter(Boolean);

      autoTable(doc, {
        startY: finalY,
        head: [['Hazard', 'Risk', 'Rating', 'Controls', 'Resid.']],
        body: riskBody,
        theme: 'grid',
        styles: { fontSize: 8, textColor: [0,0,0], lineColor: [0,0,0], lineWidth: 0.1 },
        headStyles: { fillColor: [50, 50, 50], textColor: [255,255,255] },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 30 }, 3: { cellWidth: 'auto' } }
      });

      // @ts-ignore
      finalY = doc.lastAutoTable.finalY + 10;

      // 5. SAFETY CHECKS (From the UI Toggles)
      if (finalY > 240) { doc.addPage(); finalY = margin; }
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("3. Pre-Start Safety Checks", margin, finalY);
      finalY += 6;

      const questions = cluster ? cluster.questions : [];
      const checkBody = questions.map(q => [
        q.label, 
        safetyResponses[q.id] || "N/A" // Uses the actual Yes/No clicked
      ]);

      if (checkBody.length > 0) {
        autoTable(doc, {
          startY: finalY,
          head: [['Checklist Item', 'Confirmed']],
          body: checkBody,
          theme: 'grid',
          styles: { fontSize: 9, textColor: [0,0,0], lineColor: [0,0,0], lineWidth: 0.1 },
          headStyles: { fillColor: [220, 220, 220], textColor: [0,0,0] },
          columnStyles: { 1: { cellWidth: 30, halign: 'center' } }
        });
      }

      // 6. SIGN OFF
      doc.addPage();
      finalY = margin;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("4. Sign-Off", margin, finalY);
      finalY += 10;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("I confirm I have read and understood this RAMS document.", margin, finalY);
      finalY += 10;

      autoTable(doc, {
        startY: finalY,
        head: [['Print Name', 'Signature', 'Date']],
        body: [['', '', ''], ['', '', ''], ['', '', '']],
        theme: 'grid',
        styles: { minCellHeight: 15, lineColor: [0,0,0], lineWidth: 0.1 }
      });

      doc.save(`RAMS_${formData.clientName.replace(/\s+/g, '_')}.pdf`);
      setStatus("Done!");
      setIsGenerating(false);

    } catch (e) {
      console.error(e);
      setStatus("Error generating PDF");
      setIsGenerating(false);
    }
  };

  // --- RENDER HELPERS ---
  const currentQuestions = formData.trade && formData.job 
    ? TRADES[formData.trade].clusters[formData.job]?.questions || []
    : [];

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        
        {/* HEADER */}
        <div className="bg-white border-b px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-blue-600 text-2xl">🛡️</span>
            <h1 className="text-xl font-bold text-slate-900">RAMS Sorted</h1>
          </div>
          <div className="text-sm font-medium text-slate-500">
            Step {step} of 3
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="w-full bg-gray-100 h-1.5">
          <div 
            className="bg-blue-600 h-1.5 transition-all duration-300" 
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>

        <div className="p-8">
          
          {/* --- STEP 1: CLIENT DETAILS --- */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-lg font-semibold text-slate-900">Project Details</h2>
              
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Client Name</label>
                  <input
                    name="clientName"
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="e.g. Sarah Jones"
                    value={formData.clientName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Site Address</label>
                  <input
                    name="siteAddress"
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. 14 Oak Road, Bristol"
                    value={formData.siteAddress}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Assessment Date</label>
                  <input
                    name="date"
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={nextStep}
                  disabled={!formData.clientName || !formData.siteAddress}
                  className="bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next Step &rarr;
                </button>
              </div>
            </div>
          )}

          {/* --- STEP 2: JOB & SAFETY CHECKS --- */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Job Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Trade</label>
                  <select
                    name="trade"
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.trade}
                    onChange={handleChange}
                  >
                    {Object.keys(TRADES).map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Job Task</label>
                  <select
                    name="job"
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.job}
                    onChange={handleChange}
                  >
                    {TRADES[formData.trade].jobs.map((j) => (
                      <option key={j.name} value={j.name}>{j.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Safety Checks (Interactive) */}
              {currentQuestions.length > 0 && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                  <h3 className="text-blue-900 font-semibold mb-4 flex items-center gap-2">
                    <span>📋</span> Pre-Start Safety Checks
                  </h3>
                  <div className="space-y-4">
                    {currentQuestions.map((q) => (
                      <div key={q.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                        <p className="text-sm text-slate-700 mb-2 sm:mb-0 flex-1 pr-4">{q.label}</p>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleSafetyToggle(q.id, "Yes")}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors border ${
                              safetyResponses[q.id] === "Yes" 
                                ? "bg-green-100 text-green-800 border-green-200" 
                                : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                            }`}
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => handleSafetyToggle(q.id, "No")}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors border ${
                              safetyResponses[q.id] === "No" 
                                ? "bg-red-100 text-red-800 border-red-200" 
                                : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
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

              {/* Description Box (Auto-Filled) */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Specific Site Constraints / Method Notes
                </label>
                <textarea
                  name="customDescription"
                  rows={5}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-600 leading-relaxed"
                  value={formData.customDescription}
                  onChange={handleChange}
                  placeholder="e.g. Access via rear gate only..."
                />
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={prevStep} className="text-slate-500 font-medium hover:text-slate-800">Back</button>
                <button onClick={nextStep} className="bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800">Next &rarr;</button>
              </div>
            </div>
          )}

          {/* --- STEP 3: GENERATE --- */}
          {step === 3 && (
            <div className="text-center py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-6 text-6xl">📄</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Ready to Generate</h2>
              <p className="text-slate-500 mb-8">
                We have all the details needed to create your site-specific RAMS for <strong>{formData.clientName}</strong>.
              </p>
              
              <button
                onClick={generatePDF}
                disabled={isGenerating}
                className="w-full max-w-md mx-auto bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-wait"
              >
                {isGenerating ? "Generating Document..." : "Download Professional PDF"}
              </button>

              {status && <p className="mt-4 text-sm text-slate-500">{status}</p>}

              <button onClick={prevStep} className="mt-8 text-slate-400 hover:text-slate-600 text-sm">
                Go Back and Edit
              </button>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}