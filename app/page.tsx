"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Loader2, ShieldCheck, MapPin, Briefcase, AlertTriangle, Info, FileText } from "lucide-react";
// Ensure these are exported from your constants file
import { TRADES, HAZARD_GROUPS, HAZARD_DATA, JobCluster } from "./lib/constants";

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

function AddressSearch({ label, value, onChange, tooltip, required }: any) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const searchAddress = async (text: string) => {
    setQuery(text); onChange(text);
    if (text.length > 4) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${text}&countrycodes=gb&limit=5`);
        const data = await res.json();
        setResults(data); setShowDropdown(true);
      } catch (e) { console.error(e); }
    } else { setShowDropdown(false); }
  };

  return (
    <div className="relative group">
      <label className="flex items-center text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-600 ml-1">*</span>} <Tooltip text={tooltip} />
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
          {results.map((r: any, i) => (
            <li key={i} onClick={() => { setQuery(r.display_name); onChange(r.display_name); setShowDropdown(false); }} className="p-3 hover:bg-gray-50 cursor-pointer text-xs border-b last:border-0 text-gray-700 leading-tight">
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
  const [isGenerating, setIsGenerating] = useState(false); // Corrected State Name
  const [generated, setGenerated] = useState(false);
  
  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    companyName: "", officeAddress: "", contactName: "", contactPhone: "",
    clientName: "", projectRef: "", siteAddress: "", startDate: new Date().toISOString().split('T')[0], duration: "1 Day", 
    operatives: "1", trade: "Electrician", jobType: "", customJobType: "", jobDesc: "",
    supervisorName: "", firstAider: "", hospital: "", fireAssembly: "As Inducted", firstAidLoc: "Site Vehicle",
    welfare: "Client WC", extraNotes: "", accessCode: "", customDescription: ""
  });
  
  const [hazards, setHazards] = useState<string[]>([]);
  const [questions, setQuestions] = useState<any[]>([]); 
  const [answers, setAnswers] = useState<Record<string, string>>({}); 

  // --- LOGIC: LOAD QUESTIONS ---
  useEffect(() => {
    // Type Safe Lookup
    const currentTrade = TRADES[formData.trade as keyof typeof TRADES];
    
    if (currentTrade && formData.jobType) {
      if (formData.jobType === "Other (Custom)") {
        if (!formData.customDescription) setFormData(prev => ({ ...prev, customDescription: "" })); 
        setQuestions([]);
        setHazards([]);
      } else {
        // Safe Cluster Lookup
        const clusters = currentTrade.clusters as Record<string, JobCluster>;
        const clusterData = clusters[formData.jobType];

        if (clusterData) {
          // Pre-fill description
          setFormData(prev => ({ ...prev, customDescription: clusterData.desc || "" }));
          // Add Hazards
          setHazards(prev => [...new Set([...prev, ...clusterData.hazards])]);
          // Set Questions
          setQuestions(clusterData.questions || []);
          
          // Pre-set answers to Yes
          const defaults: Record<string, string> = {};
          if(clusterData.questions) {
            clusterData.questions.forEach(q => defaults[q.id] = "Yes");
          }
          setAnswers(defaults);
        }
      }
    }
  }, [formData.jobType, formData.trade]);

  const handleInput = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));
  const toggleHazard = (h: string) => setHazards(prev => prev.includes(h) ? prev.filter(i => i !== h) : [...prev, h]);

  const nextStep = () => {
    if (step === 1 && (!formData.companyName || !formData.officeAddress || !formData.contactName)) return alert("⚠️ Please fill in Company Details.");
    if (step === 2) {
        if (!formData.clientName || !formData.siteAddress) return alert("⚠️ Please fill in Project Details.");
    }
    setStep(step + 1);
  };

  // --- API HANDLER ---
  const generateRAMS = async () => {
    setIsGenerating(true);
    try {
      // 1. Call API
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            ...formData, 
            hazards, 
            answers,
            // Send correct description field
            customDescription: formData.customDescription 
        }),
      });
      
      let apiData = {};
      if (res.ok) {
        apiData = await res.json();
      } else {
        console.warn("API Error, using local fallback");
      }
      
      // 2. Generate PDF
      createPDF(apiData); 
      setGenerated(true);
      
    } catch (e: any) { 
        console.error(e);
        createPDF({}); // Fallback
    } 
    finally { setIsGenerating(false); }
  };

  // --- PROFESSIONAL PDF ENGINE (FIXED WIDTHS & 10 SECTIONS) ---
  const createPDF = (apiData: any) => {
    const doc = new jsPDF();
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 14; 
    const contentWidth = pageWidth - (margin * 2);
    
    let currentY = margin;

    // --- HELPERS ---
    const checkPageBreak = (needed: number) => {
      if (currentY + needed > pageHeight - margin) {
        doc.addPage();
        currentY = margin + 15; 
        drawHeader(doc); 
        return true;
      }
      return false;
    };

    const toTitleCase = (str: string) => {
        return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    };

    // --- HEADER ---
    const drawHeader = (doc: any) => {
        doc.setDrawColor(0); doc.setLineWidth(0.1);
        doc.setFont("helvetica", "bold"); doc.setFontSize(11);
        doc.text("RISK ASSESSMENT & METHOD STATEMENT", margin, 12);
        
        doc.setFontSize(9); doc.setFont("helvetica", "normal");
        const rightText = `Ref: ${formData.projectRef || "N/A"} | Date: ${formData.startDate}`;
        doc.text(rightText, pageWidth - margin, 12, { align: "right" });
        
        doc.line(margin, 15, pageWidth - margin, 15);
    };

    const drawFooter = (doc: any, pageNumber: number, totalPages: number) => {
        doc.setFontSize(8); doc.setTextColor(0);
        doc.text(`Site: ${formData.siteAddress}`, margin, pageHeight - 10);
        doc.text(`Page ${pageNumber} of ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
    };

    // --- PAGE 1 START ---
    drawHeader(doc);
    currentY = 25;
    doc.setTextColor(0);

    // 1. PROJECT DETAILS
    doc.setFontSize(11); doc.setFont("helvetica", "bold"); 
    doc.text("1. PROJECT & JOB DETAILS", margin, currentY); currentY += 6;
    
    autoTable(doc, {
        startY: currentY,
        theme: 'grid',
        body: [
            ['Company Name', formData.companyName],
            ['Site Address', formData.siteAddress],
            ['Client', formData.clientName],
            ['Job / Task Title', `${formData.trade} - ${toTitleCase(formData.jobType)}`],
            ['RAMS Reference', formData.projectRef || `${formData.clientName.substring(0,3).toUpperCase()}-001`],
            ['Date of RAMS', formData.startDate],
            ['Prepared By', `${formData.contactName} (Competent Person)`],
            ['Operatives', formData.operatives],
        ],
        styles: { fontSize: 9, cellPadding: 3, textColor: 0, lineColor: 0, lineWidth: 0.1, overflow: 'linebreak' },
        headStyles: { fillColor: [230, 230, 230], textColor: 0, fontStyle: 'bold' },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50, fillColor: [245, 245, 245] }, 1: { cellWidth: 'auto' } }
    });
    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 12;

    // 2. SCOPE
    doc.setFontSize(11); doc.setFont("helvetica", "bold");
    doc.text("2. SCOPE OF WORKS", margin, currentY); currentY += 6;
    
    doc.setFontSize(10); doc.setFont("helvetica", "normal");
    // Prefer API summary, then custom desc, then fallback
    const scopeText = doc.splitTextToSize(apiData.summary || formData.customDescription || "Standard works as per industry guidelines.", contentWidth);
    doc.text(scopeText, margin, currentY);
    currentY += (scopeText.length * 5) + 12;

    // 3. SAFETY CHECKS
    if (questions.length > 0) {
        checkPageBreak(60);
        doc.setFontSize(11); doc.setFont("helvetica", "bold");
        doc.text("3. PRE-START SAFETY CHECKLIST", margin, currentY); currentY += 6;

        const checkRows = questions.map((q, i) => [
            (i+1).toString(),
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
            styles: { fontSize: 9, textColor: 0, lineColor: 0, lineWidth: 0.1, cellPadding: 2, overflow: 'linebreak' },
            headStyles: { fillColor: [230, 230, 230], textColor: 0, fontStyle: 'bold', lineColor: 0 },
            columnStyles: { 0: { cellWidth: 10, halign: 'center' }, 2: { halign: 'center', cellWidth: 15 }, 3: { halign: 'center', cellWidth: 15 }, 4: { halign: 'center', cellWidth: 15 } }
        });
        // @ts-ignore
        currentY = doc.lastAutoTable.finalY + 12;
    }

    // 4. RISK ASSESSMENT (Wider columns for scores)
    checkPageBreak(80);
    doc.setFontSize(11); doc.setFont("helvetica", "bold");
    doc.text("4. RISK ASSESSMENT", margin, currentY); currentY += 6;

    doc.setFontSize(8); doc.setFont("helvetica", "italic");
    doc.text("Risk Key: High (15-25), Medium (8-12), Low (1-6)", margin, currentY);
    currentY += 4;

    const hazardRows = hazards.map(hKey => {
        const lib = HAZARD_DATA[hKey];
        if (!lib) return null;
        return [
          lib.label, 
          lib.risk, 
          "Ops/Public", 
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
        styles: { 
            fontSize: 8, 
            textColor: 0, 
            lineColor: 0, 
            lineWidth: 0.1, 
            cellPadding: 2, // Reduced padding
            valign: 'top', 
            overflow: 'linebreak' 
        },
        headStyles: { fillColor: [230, 230, 230], textColor: 0, fontStyle: 'bold' },
        columnStyles: { 
            0: { cellWidth: 25, fontStyle: 'bold' }, 
            1: { cellWidth: 35 }, 
            2: { cellWidth: 20 }, 
            // Increased width to 20 to fit "MEDIUM (12)"
            3: { cellWidth: 20, halign: 'center' }, 
            4: { cellWidth: 'auto' }, 
            // Increased width to 20 to fit "LOW (4)"
            5: { cellWidth: 20, halign: 'center' } 
        },
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
        { t: "5.1 PRE-COMMENCEMENT", d: "Arrive on site, sign in, and conduct a dynamic risk assessment. Establish exclusion zones." },
        { t: "5.2 SAFE ISOLATION", d: "Identify circuits/pipes. Isolate at source. Lock-Off & Tag-Out (LOTO). Prove dead/empty." },
        { t: "5.3 EXECUTION", d: `Carry out works in accordance with the scope defined in Section 2.\n${formData.extraNotes || ''}` },
        { t: "5.4 COMPLETION", d: "Inspect installation. Perform testing. Tidy area. Handover to client." }
    ];

    const finalMethods = Array.isArray(methodSteps) && typeof methodSteps[0] === 'string' 
       ? methodSteps.map((s: string, i: number) => ({ t: `Step ${i+1}`, d: s }))
       : methodSteps;

    finalMethods.forEach((step: any) => {
        checkPageBreak(25); 
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
        ['Construction Dust (Silica)', 'Inhalation/Irritation', 'LEV / FFP3 Mask', 'Bagged & Sealed']
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

    // 8. EMERGENCY
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

    // 9. BRIEFING
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
    doc.text(`Name: ${formData.contactName}`, margin + 5, currentY + 18);
    doc.text(`Position: Competent Person`, margin + 100, currentY + 18);
    
    doc.text("Signature: _________________________", margin + 5, currentY + 35);
    doc.text(`Date: ${formData.startDate}`, margin + 100, currentY + 35);

    // ADD PAGE NUMBERS
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) { 
        doc.setPage(i); 
        drawFooter(doc, i, pageCount); 
    }

    doc.save(`RAMS_${formData.companyName.replace(/ /g,'_')}.pdf`);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-24">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-50 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 font-extrabold text-xl tracking-tight text-blue-900">
          <ShieldCheck className="w-7 h-7 text-blue-700"/> RAMS Sorted
        </div>
        <div className="text-xs font-bold bg-blue-700 text-white px-4 py-1.5 rounded-full shadow-sm">Step {step} / 3</div>
      </nav>

      <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="h-1.5 bg-gray-100 w-full">
            <div className="h-full bg-blue-600 transition-all duration-500 ease-out" style={{ width: `${(step/3)*100}%` }}></div>
          </div>

          <div className="p-8">
          {/* STEP 1: COMPANY */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Briefcase className="w-5 h-5"/> Company Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="border p-3 rounded w-full" placeholder="Company Name" value={formData.companyName} onChange={e => handleInput("companyName", e.target.value)} />
                <input className="border p-3 rounded w-full" placeholder="Competent Person Name" value={formData.contactName} onChange={e => handleInput("contactName", e.target.value)} />
                <AddressSearch label="Office Address" value={formData.officeAddress} onChange={(val:string) => handleInput("officeAddress", val)} />
                <input className="border p-3 rounded w-full" placeholder="Phone Number" value={formData.contactPhone} onChange={e => handleInput("contactPhone", e.target.value)} />
              </div>
              <div className="bg-gray-50 p-4 rounded border mt-4 space-y-4">
                 <h3 className="font-bold text-sm">Project Info</h3>
                 <div className="grid grid-cols-2 gap-4">
                    <input className="border p-3 rounded w-full" placeholder="Client Name" value={formData.clientName} onChange={e => handleInput("clientName", e.target.value)} />
                    <input className="border p-3 rounded w-full" placeholder="Job Ref (Optional)" value={formData.projectRef} onChange={e => handleInput("projectRef", e.target.value)} />
                 </div>
                 <AddressSearch label="Site Address" value={formData.siteAddress} onChange={(val:string) => handleInput("siteAddress", val)} />
              </div>
              <button onClick={nextStep} className="bg-black text-white w-full py-3 rounded font-bold mt-4">Next Step</button>
            </div>
          )}

          {/* STEP 2: SCOPE */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><FileText className="w-5 h-5"/> Job Scope</h2>
              <div className="grid grid-cols-2 gap-4">
                 <select className="border p-3 rounded w-full" value={formData.trade} onChange={e => handleInput("trade", e.target.value)}>{Object.keys(TRADES).map(t => <option key={t}>{t}</option>)}</select>
                 {/* @ts-ignore */}
                 <select className="border p-3 rounded w-full" value={formData.jobType} onChange={e => handleInput("jobType", e.target.value)}><option value="">Select Job Type</option>{TRADES[formData.trade].jobs.map((j:any) => <option key={j.name}>{j.name}</option>)}</select>
              </div>
              
              {/* DYNAMIC QUESTIONS */}
              {questions.length > 0 && (
                  <div className="bg-blue-50 p-4 rounded border border-blue-100">
                      <h4 className="font-bold text-sm text-blue-900 mb-3">Pre-Start Safety Checks</h4>
                      {questions.map((q:any) => (
                          <div key={q.id} className="flex justify-between items-center mb-2 bg-white p-2 rounded border">
                              <span className="text-sm">{q.label}</span>
                              <div className="flex gap-2">
                                  <button onClick={() => setAnswers({...answers, [q.id]: "Yes"})} className={`px-3 py-1 rounded text-xs font-bold ${answers[q.id] === "Yes" ? "bg-black text-white" : "bg-gray-100"}`}>Yes</button>
                                  <button onClick={() => setAnswers({...answers, [q.id]: "No"})} className={`px-3 py-1 rounded text-xs font-bold ${answers[q.id] === "No" ? "bg-black text-white" : "bg-gray-100"}`}>No</button>
                              </div>
                          </div>
                      ))}
                  </div>
              )}

              <textarea className="w-full border p-3 rounded h-32" value={formData.customDescription} onChange={e => handleInput("customDescription", e.target.value)} />
              <div className="flex gap-4"><button onClick={() => setStep(1)} className="w-1/3 border py-3 rounded">Back</button><button onClick={nextStep} className="w-2/3 bg-black text-white py-3 rounded font-bold">Next</button></div>
            </div>
          )}

          {/* STEP 3: HAZARDS */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Safety & Hazards</h2>
              
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded border">
                 <input className="border p-2 rounded" placeholder="Supervisor Name" value={formData.supervisorName} onChange={e => handleInput("supervisorName", e.target.value)} />
                 <input className="border p-2 rounded" placeholder="First Aider" value={formData.firstAider} onChange={e => handleInput("firstAider", e.target.value)} />
                 <input className="border p-2 rounded" placeholder="Nearest Hospital" value={formData.hospital} onChange={e => handleInput("hospital", e.target.value)} />
                 <input className="border p-2 rounded" placeholder="Fire Assembly Point" value={formData.fireAssembly} onChange={e => handleInput("fireAssembly", e.target.value)} />
              </div>

              <div className="space-y-4">
                 {Object.entries(HAZARD_GROUPS).map(([group, items]) => (
                   <div key={group} className="border p-4 rounded-lg">
                      <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">{group}</h4>
                      <div className="flex flex-wrap gap-2">
                        {items.map(h => (
                           <button key={h} onClick={() => toggleHazard(h)} className={`text-xs py-1 px-3 rounded border ${hazards.includes(h) ? 'bg-black text-white' : 'bg-white'}`}>
                             {/* @ts-ignore */}
                             {HAZARD_DATA[h]?.label || h}
                           </button>
                        ))}
                      </div>
                   </div>
                 ))}
              </div>
              
              <div className="mt-6 pt-6 border-t">
                 <div className="flex gap-4"><button onClick={() => setStep(2)} className="w-1/3 border py-3 rounded">Back</button><button onClick={generateRAMS} disabled={isGenerating} className="w-2/3 bg-green-600 text-white py-3 rounded font-bold flex justify-center items-center gap-2">{isGenerating ? <Loader2 className="animate-spin"/> : <ShieldCheck/>} Generate PDF Pack</button></div>
              </div>
            </div>
          )}
          </div>
        </div>
      </main>
    </div>
  );
}