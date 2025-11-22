"use client";

import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { TRADES, HAZARD_DATA, JobCluster } from "./lib/constants";

// --- TYPES ---
interface FormData {
  trade: keyof typeof TRADES;
  job: string;
  clientName: string;
  siteAddress: string;
  date: string;
  customDescription: string; 
}

interface SafetyResponses {
  [key: string]: string; 
}

export default function Home() {
  // --- STATE ---
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

  const [safetyResponses, setSafetyResponses] = useState<SafetyResponses>({});

  // --- EFFECTS ---

  // 1. Auto-select first job
  useEffect(() => {
    if (TRADES[formData.trade]) {
      const firstJob = TRADES[formData.trade].jobs[0].name;
      setFormData((prev) => ({ ...prev, job: firstJob }));
    }
  }, [formData.trade]);

  // 2. Auto-fill Description & Reset Safety Checks
  useEffect(() => {
    if (!formData.trade || !formData.job) return;

    const currentTradeData = TRADES[formData.trade];
    if (!currentTradeData) return;

    const clusters = currentTradeData.clusters as Record<string, JobCluster>;
    const cluster = clusters[formData.job];

    if (cluster) {
      setFormData((prev) => ({ 
        ...prev, 
        customDescription: cluster.desc || "" 
      }));

      const newSafetyState: SafetyResponses = {};
      if (cluster.questions) {
        cluster.questions.forEach((q) => {
          newSafetyState[q.id] = "Yes";
        });
      }
      setSafetyResponses(newSafetyState);
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
    setSafetyResponses((prev) => ({ ...prev, [id]: value }));
  };

  // --- PDF ENGINE (FIXED & MATCHING STRUCTURE) ---
  const generatePDF = async () => {
    setIsGenerating(true);
    setStatus("Initializing PDF Engine...");

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 14;
      let finalY = margin;

      // --- Helper: Header & Title ---
      const drawTitle = () => {
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("E-RISK ASSESSMENT & METHOD STATEMENT", pageWidth / 2, 15, { align: "center" });
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
      };

      drawTitle();
      finalY += 15;

      // --- SECTION 1: PROJECT & JOB DETAILS ---
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("1. PROJECT & JOB DETAILS", margin, finalY);
      finalY += 5;

      autoTable(doc, {
        startY: finalY,
        body: [
          ['Company Name', 'Your Company Name'], 
          ['Site Address', formData.siteAddress],
          ['Client', formData.clientName],
          ['Job / Task Title', `${formData.trade} - ${formData.job}`],
          ['Date of RAMS', formData.date],
          ['Prepared By', 'Competent Person'],
          ['Operatives', '1 (TBC)'],
        ],
        theme: 'grid',
        styles: { 
          fontSize: 9, 
          cellPadding: 3, 
          lineColor: [0, 0, 0], 
          lineWidth: 0.1,
          textColor: [0,0,0]
        },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 50, fillColor: [245, 245, 245] },
          1: { cellWidth: 'auto' }
        }
      });

      // @ts-ignore
      finalY = doc.lastAutoTable.finalY + 10;

      // --- SECTION 2: SCOPE OF WORKS ---
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("2. SCOPE OF WORKS", margin, finalY);
      finalY += 5;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const scopeText = formData.customDescription || "Standard works to be carried out in accordance with industry guidelines.";
      const wrappedScope = doc.splitTextToSize(scopeText, pageWidth - (margin * 2));
      doc.text(wrappedScope, margin, finalY);
      
      finalY += (wrappedScope.length * 5) + 10;

      // --- SECTION 3: PRE-START SAFETY CHECKLIST ---
      if (finalY > pageHeight - 50) { doc.addPage(); drawTitle(); finalY = 25; }

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("3. PRE-START SAFETY CHECKLIST", margin, finalY);
      finalY += 5;

      const tradeObj = TRADES[formData.trade];
      const clusters = tradeObj.clusters as Record<string, JobCluster>;
      const cluster = clusters[formData.job];
      const questions = cluster ? cluster.questions : [];

      const checklistBody = questions.map((q, index) => [
        (index + 1).toString(),
        q.label,
        safetyResponses[q.id] === "Yes" ? "Yes" : "",
        safetyResponses[q.id] === "No" ? "No" : "",
        safetyResponses[q.id] === "N/A" ? "N/A" : ""
      ]);

      if (checklistBody.length === 0) {
        checklistBody.push(['-', 'No specific safety checks defined for this task.', '-', '-', '-']);
      }

      autoTable(doc, {
        startY: finalY,
        head: [['No.', 'Checklist Question', 'YES', 'NO', 'N/A']],
        body: checklistBody,
        theme: 'grid',
        headStyles: { fillColor: [50, 50, 50], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 3, lineColor: [0,0,0], lineWidth: 0.1, textColor: [0,0,0] },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' },
          2: { cellWidth: 15, halign: 'center' },
          3: { cellWidth: 15, halign: 'center' },
          4: { cellWidth: 15, halign: 'center' }
        }
      });

      // @ts-ignore
      finalY = doc.lastAutoTable.finalY + 10;

      // --- SECTION 4: RISK ASSESSMENT ---
      if (finalY > pageHeight - 60) { doc.addPage(); drawTitle(); finalY = 25; }

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("4. RISK ASSESSMENT", margin, finalY);
      finalY += 5;

      const jobHazards = cluster ? cluster.hazards : [];
      const riskBody = jobHazards.map(hKey => {
        const h = HAZARD_DATA[hKey];
        if (!h) return null;
        return [
          h.label,
          h.risk,
          "Operatives / Public",
          h.initial_score,
          h.control,
          h.residual_score
        ];
      }).filter((row): row is string[] => row !== null);

      autoTable(doc, {
        startY: finalY,
        head: [['Hazard', 'Risk / Harm', 'Who', 'Init', 'Control Measures', 'Res']],
        body: riskBody,
        theme: 'grid',
        headStyles: { fillColor: [50, 50, 50], textColor: 255, fontStyle: 'bold' },
        styles: { 
          fontSize: 8, 
          cellPadding: 3, 
          lineColor: [0,0,0], 
          lineWidth: 0.1,
          textColor: [0,0,0],
          overflow: 'linebreak' 
        },
        columnStyles: {
          0: { cellWidth: 25, fontStyle: 'bold' },
          1: { cellWidth: 35 },
          2: { cellWidth: 20 },
          3: { cellWidth: 15, halign: 'center' },
          4: { cellWidth: 'auto' },
          5: { cellWidth: 15, halign: 'center' }
        }
      });

      // @ts-ignore
      finalY = doc.lastAutoTable.finalY + 10;

      // --- SECTION 5: METHOD STATEMENT ---
      if (finalY > pageHeight - 50) { doc.addPage(); drawTitle(); finalY = 25; }

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("5. METHOD STATEMENT", margin, finalY);
      finalY += 6;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      const methodSteps = [
        { title: "5.1 PRE-COMMENCEMENT & SITE SETUP", text: "Arrive on site, complete induction, and sign in. Review the RAMS and confirm understanding with all operatives. Conduct a dynamic risk assessment of the immediate work area. Establish a segregated and clearly demarcated work area using barriers and safety signage. Inspect all plant, tools, and test equipment." },
        { title: "5.2 SAFE ISOLATION (if applicable)", text: "Identify all circuits to be modified. Safely isolate the required circuits at the main protective device. Secure the isolation using a dedicated lock and apply a 'Caution: Do Not Operate' tag (LOTO). Prove circuits are dead at the point of work using a calibrated voltage indicator." },
        { title: "5.3 EXECUTION OF WORKS", text: `Create routes and install components as per the specific task: ${formData.job}. Ensure all manual handling tasks are assessed. Manage all trailing leads and cables to prevent trip hazards. Ensure all terminations are mechanically and electrically sound.` },
        { title: "5.4 COMPLETION & HANDOVER", text: "Conduct a thorough visual inspection. Perform necessary tests (e.g., Dead Tests, Live Tests) as required by regulations. Tidy the work area, removing all tools and waste. Demonstrate the work to the client/site manager, sign out, and formally hand over." }
      ];

      methodSteps.forEach(step => {
        if (finalY > pageHeight - 30) { doc.addPage(); drawTitle(); finalY = 25; }
        
        doc.setFont("helvetica", "bold");
        doc.text(step.title, margin, finalY);
        finalY += 5;
        
        doc.setFont("helvetica", "normal");
        const text = doc.splitTextToSize(step.text, pageWidth - (margin * 2));
        doc.text(text, margin, finalY);
        finalY += (text.length * 5) + 5;
      });

      // --- SECTION 6: PPE REQUIREMENTS ---
      if (finalY > pageHeight - 60) { doc.addPage(); drawTitle(); finalY = 25; }
      
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("6. PPE REQUIREMENTS", margin, finalY);
      finalY += 5;

      autoTable(doc, {
        startY: finalY,
        head: [['Item', 'Requirement Status']],
        body: [
          ['Safety Footwear (BS EN ISO 20345)', 'Mandatory'],
          ['Eye Protection (BS EN 166)', 'Task Dependent'],
          ['Gloves (BS EN 388)', 'Mandatory'],
          ['Hi-Vis Clothing', 'Site Dependent'],
          ['Dust Mask (FFP3)', 'Task Dependent']
        ],
        theme: 'grid',
        headStyles: { fillColor: [50, 50, 50] },
        styles: { fontSize: 9, cellPadding: 2, lineColor: [0,0,0], lineWidth: 0.1 },
        columnStyles: { 0: { cellWidth: 100 }, 1: { fontStyle: 'bold' } }
      });

      // @ts-ignore
      finalY = doc.lastAutoTable.finalY + 10;

      // --- SECTION 7: COSHH ---
      if (finalY > pageHeight - 50) { doc.addPage(); drawTitle(); finalY = 25; }

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("7. COSHH / SUBSTANCES", margin, finalY);
      finalY += 5;

      autoTable(doc, {
        startY: finalY,
        head: [['Substance', 'Risks', 'Controls / PPE', 'Disposal']],
        body: [
          [
            'Construction Dust (Silica, Wood)', 
            'Inhalation can cause lung disease (Silicosis, COPD). Irritation to eyes.',
            'On-tool extraction (LEV). Water suppression. FFP3 Masks. Eye protection.',
            'Seal in heavy-duty bags. Dispose of as construction waste.'
          ]
        ],
        theme: 'grid',
        headStyles: { fillColor: [50, 50, 50] },
        styles: { fontSize: 8, cellPadding: 3, lineColor: [0,0,0], lineWidth: 0.1 },
      });

      // @ts-ignore
      finalY = doc.lastAutoTable.finalY + 10;

      // --- SECTION 8: EMERGENCY ---
      if (finalY > pageHeight - 50) { doc.addPage(); drawTitle(); finalY = 25; }

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("8. EMERGENCY ARRANGEMENTS", margin, finalY);
      finalY += 5;

      autoTable(doc, {
        startY: finalY,
        body: [
          ['First Aid', 'TBC (Site Vehicle)'],
          ['Hospital', 'Nearest A&E (Use Sat Nav)'],
          ['Fire Point', 'As Inducted'],
          ['Supervisor', 'TBC']
        ],
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 3, lineColor: [0,0,0], lineWidth: 0.1 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40, fillColor: [245,245,245] } }
      });

      // @ts-ignore
      finalY = doc.lastAutoTable.finalY + 10;

      // --- SECTION 9: OPERATIVE BRIEFING ---
      doc.addPage();
      drawTitle();
      finalY = 25;

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("9. OPERATIVE BRIEFING REGISTER", margin, finalY);
      finalY += 5;

      autoTable(doc, {
        startY: finalY,
        head: [['No.', 'Operative Name (Print)', 'Company', 'Signature', 'Date']],
        body: [
          ['1', '', '', '', ''],
          ['2', '', '', '', ''],
          ['3', '', '', '', ''],
          ['4', '', '', '', ''],
          ['5', '', '', '', '']
        ],
        theme: 'grid',
        styles: { minCellHeight: 12, lineColor: [0,0,0], lineWidth: 0.1 },
        headStyles: { fillColor: [50, 50, 50] },
        columnStyles: { 0: { cellWidth: 10, halign: 'center' } }
      });

      // @ts-ignore
      finalY = doc.lastAutoTable.finalY + 15;

      // --- SECTION 10: AUTHORISATION ---
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("10. AUTHORISATION", margin, finalY);
      finalY += 6;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("I confirm I have read and understood this RAMS, attended the briefing, and agree to work in accordance with it.", margin, finalY);
      finalY += 10;

      doc.setDrawColor(0);
      doc.rect(margin, finalY, pageWidth - (margin*2), 40);
      
      doc.setFont("helvetica", "bold");
      doc.text("RAMS Prepared & Approved By (Management):", margin + 5, finalY + 8);
      
      doc.setFont("helvetica", "normal");
      doc.text(`Name: Competent Person`, margin + 5, finalY + 18);
      doc.text(`Position: Manager / Supervisor`, margin + 100, finalY + 18);
      
      doc.text("Signature: _________________________", margin + 5, finalY + 32);
      doc.text(`Date: ${formData.date}`, margin + 100, finalY + 32);

      // --- FOOTER (Page Numbers) - FIXED HERE ---
      const pageCount = doc.internal.pages.length - 1; // The fix for your error
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Ref: ${formData.clientName.substring(0, 5).toUpperCase()} | Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: "right" });
        doc.text(`Date: ${formData.date}`, margin, pageHeight - 10);
      }

      // --- SAVE ---
      doc.save(`RAMS_${formData.clientName.replace(/[^a-z0-9]/gi, '_')}.pdf`);
      setStatus("Done!");
      setIsGenerating(false);

    } catch (e) {
      console.error(e);
      setStatus("Error generating PDF");
      setIsGenerating(false);
    }
  };

  // --- HELPERS ---
  const currentTradeObj = TRADES[formData.trade];
  const currentClusters = currentTradeObj ? (currentTradeObj.clusters as Record<string, JobCluster>) : null;
  const currentCluster = currentClusters ? currentClusters[formData.job] : null;
  const currentQuestions = currentCluster ? currentCluster.questions : [];

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-white border-b py-6 px-8">
          <div className="flex items-center gap-2">
            <span className="text-blue-700 text-xl">🛡️</span>
            <h1 className="text-2xl font-bold text-slate-900">RAMS Sorted</h1>
          </div>
        </div>

        {/* Form */}
        <div className="p-8 space-y-8">
          
          {/* 1. Client Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
              <input
                name="clientName"
                type="text"
                className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="e.g. John Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                name="date"
                type="date"
                className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site Address</label>
            <input
              name="siteAddress"
              type="text"
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
              value={formData.siteAddress}
              onChange={handleChange}
              placeholder="e.g. 123 High Street, London"
            />
          </div>

          <div className="border-t border-gray-200"></div>

          {/* 2. Job Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trade</label>
              <select
                name="trade"
                className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
                value={formData.trade}
                onChange={handleChange}
              >
                {Object.keys(TRADES).map((trade) => (
                  <option key={trade} value={trade}>{trade}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Task</label>
              <select
                name="job"
                className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
                value={formData.job}
                onChange={handleChange}
              >
                {TRADES[formData.trade].jobs.map((j) => (
                  <option key={j.name} value={j.name}>{j.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Pre-Start Safety Checks (Interactive) */}
          {currentQuestions.length > 0 && (
            <div className="bg-blue-50 p-6 rounded-md border border-blue-100">
              <h3 className="text-sm font-bold text-blue-900 mb-4">Pre-Start Safety Checks</h3>
              <div className="space-y-3">
                {currentQuestions.map((q) => (
                  <div key={q.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3 rounded border border-blue-200">
                    <p className="text-sm text-gray-700 mb-2 sm:mb-0 pr-4">{q.label}</p>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleSafetyToggle(q.id, "Yes")}
                        className={`px-3 py-1 rounded text-xs font-bold border ${
                          safetyResponses[q.id] === "Yes" 
                            ? "bg-slate-800 text-white border-slate-800" 
                            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => handleSafetyToggle(q.id, "No")}
                        className={`px-3 py-1 rounded text-xs font-bold border ${
                          safetyResponses[q.id] === "No" 
                            ? "bg-slate-800 text-white border-slate-800" 
                            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
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

          {/* 4. Method Statement Description */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1">
              Specific Site Constraints / Method Notes
            </label>
            <textarea
              name="customDescription"
              rows={5}
              className="w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-600"
              value={formData.customDescription}
              onChange={handleChange}
              placeholder="e.g. Access via rear gate only. No noisy works between 1-2pm."
            />
          </div>

          {/* Generate Button */}
          <div className="pt-4 flex flex-col items-center">
            <button
              onClick={generatePDF}
              disabled={isGenerating || !formData.clientName || !formData.siteAddress}
              className={`w-full max-w-md flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-base font-bold text-white 
                ${isGenerating || !formData.clientName || !formData.siteAddress 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-black hover:bg-slate-800'
                } transition-colors duration-200`}
            >
              {isGenerating ? "Generating Document..." : "Next"}
            </button>

            {status && (
              <p className="text-center text-sm text-gray-600 mt-3 animate-pulse">{status}</p>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}