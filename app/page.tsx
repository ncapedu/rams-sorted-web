"use client";

import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ShieldCheck, Briefcase, AlertTriangle, FileText, Loader2 } from "lucide-react";
// Ensure these are exported from your constants file
import { TRADES, HAZARD_GROUPS, HAZARD_DATA, JobCluster } from "./lib/constants";

// --- TYPES ---
interface FormData {
  trade: keyof typeof TRADES;
  job: string;
  clientName: string;
  siteAddress: string;
  projectRef: string;
  date: string;
  customDescription: string; // "Method Notes"
  contactName: string;
  contactPhone: string;
  companyName: string;
  officeAddress: string;
  startDate: string;
  duration: string;
  operatives: string;
  firstAider: string;
  hospital: string;
  fireAssembly: string;
  supervisorName: string;
}

// Holds the Yes/No state for safety questions
interface SafetyResponses {
  [key: string]: string; 
}

export default function Home() {
  // --- STATE ---
  const [step, setStep] = useState(1); 
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState("");

  const [formData, setFormData] = useState<FormData>({
    trade: "Electrician",
    job: "",
    clientName: "",
    siteAddress: "",
    projectRef: "",
    date: new Date().toISOString().split("T")[0],
    customDescription: "",
    contactName: "",
    contactPhone: "",
    companyName: "",
    officeAddress: "",
    startDate: new Date().toISOString().split("T")[0],
    duration: "1 Day",
    operatives: "1",
    firstAider: "",
    hospital: "",
    fireAssembly: "",
    supervisorName: "",
  });

  const [safetyResponses, setSafetyResponses] = useState<SafetyResponses>({});
  const [hazards, setHazards] = useState<string[]>([]);

  // --- EFFECTS ---

  // 1. Auto-select first job
  useEffect(() => {
    if (TRADES[formData.trade]) {
      const firstJob = TRADES[formData.trade].jobs[0].name;
      setFormData((prev) => ({ ...prev, job: firstJob }));
    }
  }, [formData.trade]);

  // 2. Auto-fill Description, Safety Checks, & Hazards
  useEffect(() => {
    if (!formData.trade || !formData.job) return;

    const currentTradeData = TRADES[formData.trade];
    if (!currentTradeData) return;

    const clusters = currentTradeData.clusters as Record<string, JobCluster>;
    const cluster = clusters[formData.job];

    if (cluster) {
      // Description
      setFormData((prev) => ({ 
        ...prev, 
        customDescription: cluster.desc || "" 
      }));

      // Safety Checks (Reset to Yes)
      const newSafetyState: SafetyResponses = {};
      if (cluster.questions) {
        cluster.questions.forEach((q) => {
          newSafetyState[q.id] = "Yes";
        });
      }
      setSafetyResponses(newSafetyState);

      // Hazards
      setHazards(cluster.hazards || []);
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

  const toggleHazard = (hKey: string) => {
    setHazards((prev) => 
      prev.includes(hKey) ? prev.filter((h) => h !== hKey) : [...prev, hKey]
    );
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.clientName || !formData.siteAddress) {
        alert("Please fill in Client Name and Site Address to proceed.");
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  // --- API & PDF GENERATION ---
  const generateRAMS = async () => {
    setIsGenerating(true);
    setStatus("Consulting AI Model...");

    try {
      // 1. Call API
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            trade: formData.trade,
            jobType: formData.job,
            jobDesc: formData.customDescription, // Standard description
            hazards: hazards,
            clientName: formData.clientName,
            siteAddress: formData.siteAddress,
            customDescription: formData.customDescription // User edits
        }),
      });
      
      let apiData = {};
      if (res.ok) {
        apiData = await res.json();
        setStatus("AI Data Received. Building PDF...");
      } else {
        console.warn("API Failed, using local fallback.");
        setStatus("Using Standard Template...");
      }
      
      // 2. Generate PDF
      createPDF(apiData); 
      
    } catch (e: any) { 
        console.error(e);
        createPDF({}); // Fallback
    } 
    finally { setLoading(false); }
  };

  // --- PROFESSIONAL PDF ENGINE ---
  const createPDF = (apiData: any) => {
    const doc = new jsPDF();
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 14; 
    const contentWidth = pageWidth - (margin * 2);
    
    let currentY = margin;

    // --- HELPER: Header ---
    const drawHeader = (doc: any) => {
        doc.setDrawColor(0); doc.setLineWidth(0.1); doc.setTextColor(0);
        
        // Left Title
        doc.setFont("helvetica", "bold"); doc.setFontSize(11);
        doc.text("RISK ASSESSMENT & METHOD STATEMENT", margin, 12);
        
        // Right Reference
        doc.setFont("helvetica", "normal"); doc.setFontSize(9);
        const refText = `Ref: ${formData.projectRef || "RAMS-001"}`;
        doc.text(refText, pageWidth - margin, 12, { align: "right" });
        
        doc.line(margin, 15, pageWidth - margin, 15);
    };

    // --- HELPER: Footer ---
    const drawFooter = (doc: any, pageNumber: number, totalPages: number) => {
        doc.setFontSize(8); doc.setTextColor(0);
        doc.text(`Site: ${formData.siteAddress}`, margin, pageHeight - 10);
        doc.text(`Page ${pageNumber} of ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
    };

    // --- HELPER: Check Page Break ---
    const checkPageBreak = (needed: number) => {
      if (currentY + needed > pageHeight - margin) {
        doc.addPage();
        currentY = margin + 15; 
        drawHeader(doc); 
        return true;
      }
      return false;
    };

    // ================= START DOCUMENT =================

    // --- PAGE 1 ---
    drawHeader(doc);
    currentY = 25;
    doc.setTextColor(0);

    // 1. PROJECT & JOB DETAILS
    doc.setFontSize(11); doc.setFont("helvetica", "bold"); 
    doc.text("1. PROJECT & JOB DETAILS", margin, currentY); currentY += 6;
    
    autoTable(doc, {
        startY: currentY,
        theme: 'grid',
        body: [
            ['Company Name', formData.companyName || "Your Company"],
            ['Site Address', formData.siteAddress],
            ['Client', formData.clientName],
            ['Job / Task Title', `${formData.trade} - ${formData.job}`],
            ['RAMS Reference', formData.projectRef || "RAMS-001"],
            ['Date of RAMS', formData.date],
            ['Prepared By', formData.contactName || "Competent Person"],
            ['Operatives', formData.operatives],
        ],
        styles: { fontSize: 9, cellPadding: 3, textColor: 0, lineColor: 0, lineWidth: 0.1 },
        headStyles: { fillColor: [230, 230, 230], textColor: 0, fontStyle: 'bold' },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50, fillColor: [245, 245, 245] } }
    });
    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 12;

    // 2. SCOPE OF WORKS
    doc.setFontSize(11); doc.setFont("helvetica", "bold");
    doc.text("2. SCOPE OF WORKS", margin, currentY); currentY += 6;
    
    doc.setFontSize(10); doc.setFont("helvetica", "normal");
    // Use AI summary OR Form Data
    const scopeText = doc.splitTextToSize(apiData.summary || formData.customDescription || "Standard works.", contentWidth);
    doc.text(scopeText, margin, currentY);
    currentY += (scopeText.length * 5) + 12;

    // 3. PRE-START SAFETY CHECKLIST
    const tradeObj = TRADES[formData.trade];
    const clusters = tradeObj.clusters as Record<string, JobCluster>;
    const cluster = clusters[formData.job];
    const questions = cluster ? cluster.questions : [];

    if (questions.length > 0) {
        checkPageBreak(60);
        doc.setFontSize(11); doc.setFont("helvetica", "bold");
        doc.text("3. PRE-START SAFETY CHECKLIST", margin, currentY); currentY += 6;

        const checkRows = questions.map((q, i) => [
            (i + 1).toString(),
            q.label, 
            answers[q.id] === 'Yes' ? 'Yes' : '', 
            answers[q.id] === 'No' ? 'No' : '', 
            ' '
        ]);

        autoTable(doc, {
            startY: currentY,
            head: [['No.', 'Checklist Question', 'YES', 'NO', 'N/A']],
            body: checkRows,
            theme: 'grid',
            styles: { fontSize: 9, textColor: 0, lineColor: 0, lineWidth: 0.1, cellPadding: 2 },
            headStyles: { fillColor: [230, 230, 230], textColor: 0, fontStyle: 'bold', lineColor: 0 },
            columnStyles: { 0: { cellWidth: 10, halign: 'center' }, 2: { halign: 'center', cellWidth: 15 }, 3: { halign: 'center', cellWidth: 15 }, 4: { halign: 'center', cellWidth: 15 } }
        });
        // @ts-ignore
        currentY = doc.lastAutoTable.finalY + 12;
    }

    // 4. RISK ASSESSMENT
    checkPageBreak(80);
    doc.setFontSize(11); doc.setFont("helvetica", "bold");
    doc.text("4. RISK ASSESSMENT", margin, currentY); currentY += 6;

    // Risk Matrix Key
    doc.setFontSize(8); doc.setFont("helvetica", "italic");
    doc.text("Risk Key: High (15-25), Medium (8-12), Low (1-6)", margin, currentY);
    currentY += 4;

    const hazardRows = hazards.map(hKey => {
        const lib = HAZARD_DATA[hKey];
        if (!lib) return null;
        return [
          lib.label, 
          lib.risk, 
          "Operatives / Public", 
          lib.initial_score, 
          lib.control, 
          lib.residual_score
        ];
    }).filter((row): row is string[] => row !== null);

    autoTable(doc, {
        startY: currentY,
        head: [['Hazard', 'Risk / Harm', 'Who', 'Init', 'Control Measures', 'Res']],
        body: hazardRows,
        theme: 'grid',
        styles: { fontSize: 8, textColor: 0, lineColor: 0, lineWidth: 0.1, cellPadding: 3, overflow: 'linebreak' },
        headStyles: { fillColor: [230, 230, 230], textColor: 0, fontStyle: 'bold' },
        columnStyles: { 0: { cellWidth: 25, fontStyle: 'bold' }, 3: { cellWidth: 15, halign: 'center' }, 5: { cellWidth: 15, halign: 'center' } },
        // @ts-ignore
        didDrawPage: (d) => { if(d.cursor) currentY = d.cursor.y; }
    });
    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 12;

    // 5. METHOD STATEMENT
    checkPageBreak(60);
    doc.setFontSize(11); doc.setFont("helvetica", "bold");
    doc.text("5. METHOD STATEMENT", margin, currentY); currentY += 8;
    
    const methodSteps = apiData.method_steps || [
        { t: "5.1 PRE-COMMENCEMENT", d: "Arrive on site, sign in. Review RAMS. Establish exclusion zones." },
        { t: "5.2 SAFE ISOLATION", d: "Isolate services. Lock-Off & Tag-Out (LOTO). Prove dead/empty." },
        { t: "5.3 EXECUTION", d: `Carry out ${formData.job} in accordance with industry standards.` },
        { t: "5.4 COMPLETION", d: "Inspect installation. Perform testing. Tidy area. Handover to client." }
    ];

    const finalMethods = Array.isArray(methodSteps) && typeof methodSteps[0] === 'string' 
       ? methodSteps.map((s: string, i: number) => ({ t: `Step ${i+1}`, d: s }))
       : methodSteps;

    finalMethods.forEach((step: any) => {
        checkPageBreak(30);
        doc.setFont("helvetica", "bold");
        doc.text(step.t || "Step", margin, currentY);
        currentY += 5;
        doc.setFont("helvetica", "normal");
        const text = doc.splitTextToSize(step.d || step, contentWidth);
        doc.text(text, margin, currentY);
        currentY += (text.length * 5) + 5;
    });
    currentY += 5;

    // 6. PPE
    checkPageBreak(60);
    doc.setFontSize(11); doc.setFont("helvetica", "bold");
    doc.text("6. PPE REQUIREMENTS", margin, currentY); currentY += 6;

    autoTable(doc, {
        startY: currentY,
        head: [['Item', 'Requirement Status']],
        body: [
            ['Safety Footwear (BS EN ISO 20345)', 'Mandatory'],
            ['Eye Protection (BS EN 166)', 'Task Dependent'],
            ['Gloves (BS EN 388)', 'Mandatory'],
            ['Hi-Vis Clothing', 'Site Dependent'],
            ['Dust Mask (FFP3)', 'Task Dependent']
        ],
        theme: 'grid',
        headStyles: { fillColor: [230, 230, 230], textColor: 0 },
        styles: { fontSize: 9, textColor: 0, lineColor: 0, lineWidth: 0.1 },
        columnStyles: { 0: { cellWidth: 100 }, 1: { fontStyle: 'bold' } }
    });
    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 12;

    // 7. COSHH
    checkPageBreak(60);
    doc.setFontSize(11); doc.setFont("helvetica", "bold");
    doc.text("7. COSHH / SUBSTANCES", margin, currentY); currentY += 6;

    const coshhRows = apiData.coshh || [
        ['Construction Dust (Silica)', 'Inhalation', 'LEV / FFP3 Mask', 'Bagged & Sealed']
    ];

    autoTable(doc, {
      startY: currentY,
      head: [['Substance', 'Risks', 'Controls/PPE', 'Disposal']],
      body: Array.isArray(coshhRows[0]) ? coshhRows : coshhRows.map((c:any) => [c.substance, c.risk, c.control, c.disposal]),
      theme: 'grid',
      headStyles: { fillColor: [230, 230, 230], textColor: 0 },
      styles: { fontSize: 8, textColor: 0, lineColor: 0, lineWidth: 0.1, overflow: 'linebreak' },
    });
    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 12;

    // 8. EMERGENCY ARRANGEMENTS
    checkPageBreak(50);
    doc.setFontSize(11); doc.setFont("helvetica", "bold");
    doc.text("8. EMERGENCY ARRANGEMENTS", margin, currentY); currentY += 6;

    autoTable(doc, {
      startY: currentY,
      body: [
        ['First Aid', formData.firstAider || 'TBC (Site Vehicle)'],
        ['Hospital', formData.hospital || 'Nearest A&E (Use Sat Nav)'],
        ['Fire Point', formData.fireAssembly || 'As Inducted'],
        ['Supervisor', formData.supervisorName || formData.contactName || "TBC"]
      ],
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3, lineColor: 0, lineWidth: 0.1, textColor: 0 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50, fillColor: [245,245,245] } }
    });
    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 12;

    // 9. OPERATIVE BRIEFING
    doc.addPage(); drawHeader(doc); currentY = 25;
    
    doc.setFontSize(11); doc.setFont("helvetica", "bold"); 
    doc.text("9. OPERATIVE BRIEFING REGISTER", margin, currentY); currentY += 6;

    autoTable(doc, {
        startY: currentY,
        head: [['No.', 'Operative Name (Print)', 'Company', 'Signature', 'Date']],
        body: [
            ['1', '', '', '', ''],
            ['2', '', '', '', ''],
            ['3', '', '', '', ''],
            ['4', '', '', '', ''],
            ['5', '', '', '', ''],
        ],
        theme: 'grid',
        styles: { minCellHeight: 12, lineColor: 0, lineWidth: 0.1, textColor: 0 },
        headStyles: { fillColor: [230, 230, 230], textColor: 0 },
        columnStyles: { 0: { cellWidth: 10, halign: 'center' } }
    });
    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 15;

    // 10. AUTHORISATION
    doc.setFontSize(11); doc.setFont("helvetica", "bold");
    doc.text("10. AUTHORISATION", margin, currentY); currentY += 6;
    
    doc.setFontSize(10); doc.setFont("helvetica", "normal");
    doc.text("I confirm I have read and understood this RAMS, attended the briefing, and agree to work in accordance with it.", margin, currentY);
    currentY += 10;

    // Authorisation Box
    doc.setDrawColor(0); doc.rect(margin, currentY, contentWidth, 45);
    doc.setFont("helvetica", "bold"); doc.text("RAMS Prepared & Approved By (Management):", margin + 5, currentY + 8);
    
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${formData.contactName || "Competent Person"}`, margin + 5, currentY + 18);
    doc.text(`Position: Supervisor / Manager`, margin + 100, currentY + 18);
    
    doc.text("Signature: _________________________", margin + 5, currentY + 35);
    doc.text(`Date: ${formData.date}`, margin + 100, currentY + 35);

    // ADD PAGE NUMBERS
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) { 
        doc.setPage(i); 
        drawFooter(doc, i, pageCount); 
    }

    doc.save(`RAMS_${formData.clientName.replace(/ /g,'_')}.pdf`);
    setIsGenerating(false);
  };

  // --- RENDER HELPERS ---
  const currentTradeObj = TRADES[formData.trade];
  const currentClusters = currentTradeObj ? (currentTradeObj.clusters as Record<string, JobCluster>) : null;
  const currentCluster = currentClusters ? currentClusters[formData.job] : null;
  const currentQuestions = currentCluster ? currentCluster.questions : [];
  const currentHazards = currentCluster ? currentCluster.hazards : [];

  return (
    <main className="min-h-screen bg-gray-50 font-sans text-slate-900">
      
      {/* --- TOP NAVIGATION BAR --- */}
      <div className="bg-white border-b px-6 py-4 shadow-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-md">
              <span className="text-lg font-bold">🛡️</span>
            </div>
            <span className="text-xl font-bold text-slate-800">RAMS Sorted</span>
          </div>
          
          {/* Step Indicator */}
          <div className="flex items-center gap-2">
            <div className={`h-2 w-10 rounded-full transition-colors ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`h-2 w-10 rounded-full transition-colors ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`h-2 w-10 rounded-full transition-colors ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-10 px-4">
        
        {/* --- STEP 1: CLIENT & PROJECT DETAILS --- */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-slate-800">Step 1: Project Details</h2>
              <p className="text-slate-500 text-sm mt-1">Start by entering the client and site information.</p>
            </div>
            
            <div className="p-8 space-y-6">
              {/* Personal Details Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Company Name</label>
                  <input
                    name="companyName"
                    type="text"
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Your Business Name"
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Your Name</label>
                  <input
                    name="contactName"
                    type="text"
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Your Full Name"
                    value={formData.contactName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Client Details Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Client Name</label>
                  <input
                    name="clientName"
                    type="text"
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="e.g. John Smith"
                    value={formData.clientName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Assessment Date</label>
                  <input
                    name="date"
                    type="date"
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
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
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="e.g. 123 High Street, London"
                  value={formData.siteAddress}
                  onChange={handleChange}
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={nextStep}
                  className="bg-slate-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-all shadow-md hover:shadow-lg"
                >
                  Next Step &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- STEP 2: JOB SPECIFICS & SAFETY CHECKS --- */}
        {step === 2 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-slate-800">Step 2: Job Specifics</h2>
              <p className="text-slate-500 text-sm mt-1">Select the task, review hazards, and confirm safety checks.</p>
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

              {/* Included Hazards List (Visual Confirmation) */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Included Hazards & Risks
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentHazards.length > 0 ? (
                    currentHazards.map((hKey) => {
                      const hData = HAZARD_DATA[hKey];
                      return (
                        <span key={hKey} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {hData ? hData.label : hKey}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-sm text-slate-400 italic">No specific hazards mapped for this task.</span>
                  )}
                </div>
              </div>

              {/* Pre-Start Safety Checks (Blue Box) */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                <h3 className="text-blue-900 font-bold text-sm mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" /> Pre-Start Safety Checks
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
                  Next Step &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- STEP 3: GENERATE & DOWNLOAD --- */}
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
                onClick={generateRAMS}
                disabled={isGenerating}
                className={`w-full max-w-sm mx-auto py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1 ${
                  isGenerating 
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-xl"
                }`}
              >
                {isGenerating ? (
                   <span className="flex items-center justify-center gap-2">
                     <Loader2 className="animate-spin w-5 h-5"/> Processing...
                   </span>
                ) : "Download Professional PDF"}
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