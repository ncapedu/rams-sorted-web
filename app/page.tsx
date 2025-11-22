"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Loader2, ShieldCheck, MapPin, Briefcase, AlertTriangle, FileText, Info } from "lucide-react";
import { TRADES, HAZARD_GROUPS, HAZARD_DATA } from "./lib/constants";

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
  const [loading, setLoading] = useState(false);
  
  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    companyName: "", officeAddress: "", contactName: "", contactPhone: "",
    clientName: "", projectRef: "", siteAddress: "", startDate: new Date().toISOString().split('T')[0], duration: "1 Day", 
    operatives: "1", trade: "Electrician", jobType: "", customJobType: "", jobDesc: "",
    supervisorName: "", firstAider: "", hospital: "", fireAssembly: "As Inducted", firstAidLoc: "Site Vehicle",
    welfare: "Client WC", extraNotes: "", accessCode: ""
  });
  
  const [hazards, setHazards] = useState<string[]>([]);
  const [questions, setQuestions] = useState<any[]>([]); 
  const [answers, setAnswers] = useState<Record<string, string>>({}); 

  // --- LOGIC: LOAD QUESTIONS ---
  useEffect(() => {
    // @ts-ignore
    const tradeData = TRADES[formData.trade];
    if (tradeData && formData.jobType) {
      if (formData.jobType === "Other (Custom)") {
        setFormData(prev => ({ ...prev, jobDesc: "" })); 
        setQuestions([]);
        setHazards([]);
      } else {
        const jobObj = tradeData.jobs.find((j: any) => j.name === formData.jobType);
        if (jobObj) {
          // @ts-ignore
          const clusterData = tradeData.clusters[jobObj.cluster];
          if (clusterData) {
            setFormData(prev => ({ ...prev, jobDesc: clusterData.desc }));
            setHazards(prev => [...new Set([...prev, ...clusterData.hazards])]);
            setQuestions(clusterData.questions || []);
          }
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
        const unanswered = questions.filter(q => !answers[q.id]);
        if (unanswered.length > 0) return alert(`⚠️ Please answer all safety checks.`);
    }
    setStep(step + 1);
  };

  const generateRAMS = async () => {
    if (formData.accessCode !== "PRO2025") return alert("❌ Invalid Access Code.");
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, hazards, answers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      createGoldMasterPDF(data);
    } catch (e: any) { alert(e.message); } 
    finally { setLoading(false); }
  };

  // --- THE "GOLD MASTER" PDF ENGINE ---
  const createGoldMasterPDF = (data: any) => {
    const doc = new jsPDF();
    const totalPagesExp = "{total_pages_count_string}";
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 15; 
    const contentWidth = pageWidth - (margin * 2);
    let currentY = margin;

    // -- HELPERS --
    const addPageBreak = () => {
        doc.addPage();
        currentY = margin + 10;
    };

    const checkSpace = (needed: number) => {
        if (currentY + needed > pageHeight - margin) {
            addPageBreak();
            return true;
        }
        return false;
    };

    // -- HEADER & FOOTER --
    const drawHeader = (doc: any) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        const headerText = `${formData.companyName.toUpperCase()} – RISK ASSESSMENT & METHOD STATEMENT`;
        doc.text(headerText, margin, 10);
        doc.setLineWidth(0.1);
        doc.line(margin, 12, pageWidth - margin, 12);
    };

    const drawFooter = (doc: any, pageNumber: number, totalPages: string) => {
        const ref = formData.projectRef || `RAMS-${new Date().getFullYear()}-001`;
        const safeAddress = formData.siteAddress.length > 40 ? formData.siteAddress.substring(0, 40) + "..." : formData.siteAddress;
        const str = `Ref: ${ref} | ${safeAddress} | Page ${pageNumber} of ${totalPages}`;
        doc.setFontSize(8);
        doc.setTextColor(80, 80, 80);
        doc.text(str, pageWidth / 2, pageHeight - 10, { align: "center" });
    };

    // --- START DOCUMENT ---
    drawHeader(doc);
    currentY = 20; 

    // 1. PROJECT & JOB DETAILS
    doc.setFont("helvetica", "bold"); doc.setFontSize(12);
    doc.text("1. PROJECT & JOB DETAILS", margin, currentY);
    currentY += 6;

    autoTable(doc, {
        startY: currentY,
        body: [
            ['Company Name', formData.companyName],
            ['Site Address', formData.siteAddress],
            ['Client', formData.clientName],
            ['Job / Task Title', `${formData.trade} - ${formData.jobType}`],
            ['RAMS Reference', formData.projectRef || "TBC"],
            ['Date of RAMS', formData.startDate],
            ['Prepared By', `${formData.contactName} (Competent Person)`],
            ['Operatives', formData.operatives],
        ],
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 3, lineColor: [0,0,0], lineWidth: 0.1, textColor: [0,0,0], valign: 'middle' },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 }, 1: { cellWidth: 'auto' } }
    });
    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 10;

    // 2. SCOPE OF WORKS
    checkSpace(40);
    doc.setFont("helvetica", "bold"); doc.setFontSize(12);
    doc.text("2. SCOPE OF WORKS", margin, currentY);
    currentY += 6;

    doc.setFont("helvetica", "normal"); doc.setFontSize(10);
    const scopeText = data.summary || formData.jobDesc || "Execution of trade works as defined by client instruction.";
    const splitScope = doc.splitTextToSize(scopeText, contentWidth);
    doc.text(splitScope, margin, currentY);
    currentY += (splitScope.length * 5) + 10;

    // 3. PRE-START SAFETY CHECKLIST
    if (questions.length > 0) {
        checkSpace(60);
        doc.setFont("helvetica", "bold"); doc.setFontSize(12);
        doc.text("3. PRE-START SAFETY CHECKLIST", margin, currentY);
        currentY += 6;

        const checkRows = questions.map((q, index) => [
            (index + 1).toString(),
            q.label,
            answers[q.id] === "Yes" ? "Yes" : "",
            answers[q.id] === "No" ? "No" : "",
            "" 
        ]);

        autoTable(doc, {
            startY: currentY,
            head: [['No.', 'Checklist Question', 'YES', 'NO', 'N/A']],
            body: checkRows,
            theme: 'grid',
            styles: { fontSize: 10, cellPadding: 3, lineColor: [0,0,0], lineWidth: 0.1, textColor: [0,0,0] },
            headStyles: { fillColor: [255,255,255], textColor: [0,0,0], fontStyle: 'bold', lineWidth: 0.1, lineColor: [0,0,0] },
            columnStyles: { 
                0: { cellWidth: 12, halign: 'center' },
                1: { cellWidth: 'auto' },
                2: { cellWidth: 15, halign: 'center' }, 
                3: { cellWidth: 15, halign: 'center' },
                4: { cellWidth: 15, halign: 'center' }
            }
        });
        // @ts-ignore
        currentY = doc.lastAutoTable.finalY + 10;
    }

    // 4. RISK ASSESSMENT (Wider Columns)
    addPageBreak(); 
    doc.setFont("helvetica", "bold"); doc.setFontSize(12);
    doc.text("4. RISK ASSESSMENT", margin, currentY);
    currentY += 6;

    const riskRows = hazards.map(h => {
        // @ts-ignore
        const hInfo = HAZARD_DATA[h] || { label: h, risk: "General Injury", initial_score: "Med", control: "Standard site controls.", residual_score: "Low" };
        return [
            hInfo.label,
            hInfo.risk,
            "Operatives / Public",
            hInfo.initial_score.toUpperCase(),
            hInfo.control, 
            hInfo.residual_score.toUpperCase()
        ];
    });

    autoTable(doc, {
        startY: currentY,
        head: [['Hazard', 'Risk / Harm', 'Who', 'Init', 'Control Measures', 'Res']],
        body: riskRows,
        theme: 'grid',
        styles: { 
            fontSize: 8,
            cellPadding: 2, 
            lineColor: [0,0,0], 
            lineWidth: 0.1, 
            textColor: [0,0,0], 
            valign: 'top',
            overflow: 'linebreak'
        },
        headStyles: { fillColor: [255,255,255], textColor: [0,0,0], fontStyle: 'bold', lineWidth: 0.1, lineColor: [0,0,0] },
        columnStyles: {
            0: { cellWidth: 25, fontStyle: 'bold' },
            1: { cellWidth: 30 }, 
            2: { cellWidth: 20 }, 
            3: { cellWidth: 18, halign: 'center' }, // Increased to 18mm for "MEDIUM"
            4: { cellWidth: 'auto' }, 
            5: { cellWidth: 18, halign: 'center' }  // Increased to 18mm
        }
    });
    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 10;

    // 5. METHOD STATEMENT
    checkSpace(60);
    doc.setFont("helvetica", "bold"); doc.setFontSize(12);
    doc.text("5. METHOD STATEMENT", margin, currentY);
    currentY += 8;

    if(data.method_steps) {
        doc.setFont("helvetica", "normal"); doc.setFontSize(10);
        const steps = Array.isArray(data.method_steps) ? data.method_steps : data.method_steps.split('\n');
        let subHeadingCounter = 1;

        steps.forEach((step: string) => {
            if (!step.trim()) return;
            if (checkSpace(15)) {
                doc.setFont("helvetica", "bold"); doc.setFontSize(12);
                doc.text("5. METHOD STATEMENT (Cont.)", margin, currentY);
                currentY += 8;
                doc.setFont("helvetica", "normal"); doc.setFontSize(10);
            }

            const isHeader = step.toUpperCase() === step && step.length > 5;
            
            if (isHeader) {
                currentY += 2;
                doc.setFont("helvetica", "bold");
                doc.text(`5.${subHeadingCounter} ${step.replace(/:/g, '')}`, margin, currentY);
                doc.setFont("helvetica", "normal");
                currentY += 5;
                subHeadingCounter++;
            } else {
                const cleanStep = step.replace(/^\d+\.\s*/, ''); 
                const wrappedText = doc.splitTextToSize(`-  ${cleanStep}`, contentWidth);
                doc.text(wrappedText, margin, currentY);
                currentY += (wrappedText.length * 5) + 2;
            }
        });
    }
    currentY += 10;

    // 6. PPE
    checkSpace(50);
    doc.setFont("helvetica", "bold"); doc.setFontSize(12);
    doc.text("6. PPE REQUIREMENTS", margin, currentY);
    currentY += 6;

    autoTable(doc, {
        startY: currentY,
        head: [['Item', 'Requirement status']],
        body: data.ppe ? data.ppe.map((p:string) => [p, 'Mandatory']) : [['Standard Site PPE', 'Mandatory']],
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 3, lineColor: [0,0,0], lineWidth: 0.1, textColor: [0,0,0] },
        headStyles: { fillColor: [255,255,255], textColor: [0,0,0], fontStyle: 'bold', lineWidth: 0.1, lineColor: [0,0,0] }
    });
    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 10;

    // 7. COSHH
    const coshhHazards = ["dust_fumes", "silica_dust", "chemical_coshh", "asbestos", "cement", "fumes"];
    if (hazards.some(h => coshhHazards.includes(h))) {
        checkSpace(50);
        doc.setFont("helvetica", "bold"); doc.setFontSize(12);
        doc.text("7. COSHH / SUBSTANCES", margin, currentY);
        currentY += 6;

        const coshhRows = data.coshh ? data.coshh.map((c:any) => [c.substance, c.risk, c.control, c.disposal]) : [['Dust', 'Inhalation', 'Mask P3', 'Skip']];

        autoTable(doc, {
            startY: currentY,
            head: [['Substance', 'Risks', 'Controls / PPE', 'Disposal']],
            body: coshhRows,
            theme: 'grid',
            styles: { fontSize: 9, cellPadding: 2, lineColor: [0,0,0], lineWidth: 0.1, textColor: [0,0,0] },
            headStyles: { fillColor: [255,255,255], textColor: [0,0,0], fontStyle: 'bold', lineWidth: 0.1, lineColor: [0,0,0] }
        });
        // @ts-ignore
        currentY = doc.lastAutoTable.finalY + 10;
    } else {
        checkSpace(20);
        doc.setFont("helvetica", "bold"); doc.setFontSize(12);
        doc.text("7. COSHH / SUBSTANCES", margin, currentY);
        currentY += 6;
        doc.setFont("helvetica", "normal"); doc.setFontSize(10);
        doc.text("No significant COSHH substances are expected to be used for this task.", margin, currentY);
        currentY += 10;
    }

    // 8. EMERGENCY
    checkSpace(50);
    doc.setFont("helvetica", "bold"); doc.setFontSize(12);
    doc.text("8. EMERGENCY ARRANGEMENTS", margin, currentY);
    currentY += 6;

    autoTable(doc, {
        startY: currentY,
        body: [
            ['First Aid', `${formData.firstAider || "TBC"} (${formData.firstAidLoc || "Site Office"})`],
            ['Hospital', formData.hospital || "Nearest A&E (Use Sat Nav)"],
            ['Fire Point', formData.fireAssembly || "As per site induction"],
            ['Supervisor', formData.supervisorName || "TBC"]
        ],
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 3, lineColor: [0,0,0], lineWidth: 0.1, textColor: [0,0,0] },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 }, 1: { cellWidth: 'auto' } }
    });
    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 15;

    // 9. REGISTER (Fixed N -> No.)
    addPageBreak();
    doc.setFont("helvetica", "bold"); doc.setFontSize(12);
    doc.text("9. OPERATIVE BRIEFING REGISTER", margin, currentY);
    currentY += 8;

    const registerRows = [];
    for(let i=1; i<=10; i++) { 
        registerRows.push([i.toString(), '', '', '', '']);
    }

    autoTable(doc, {
        startY: currentY,
        head: [['No.', 'Operative Name (Print)', 'Company', 'Signature', 'Date']],
        body: registerRows,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 4, lineColor: [0,0,0], lineWidth: 0.1, minCellHeight: 12, textColor: [0,0,0] },
        headStyles: { fillColor: [255,255,255], textColor: [0,0,0], fontStyle: 'bold', lineWidth: 0.1, lineColor: [0,0,0] },
        columnStyles: { 0: { cellWidth: 12, halign: 'center' } }
    });
    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 15;

    // 10. AUTHORISATION (Extended Height)
    if (currentY + 110 > pageHeight - margin) {
        addPageBreak();
    }

    doc.setFont("helvetica", "bold"); doc.setFontSize(12);
    doc.text("10. AUTHORISATION", margin, currentY);
    currentY += 6;

    // BOX 1: Operative Statement (45mm)
    doc.setDrawColor(0); doc.setLineWidth(0.2);
    doc.rect(margin, currentY, contentWidth, 45); 
    
    doc.setFontSize(10); doc.setFont("helvetica", "normal");
    const declaration = "I confirm I have read and understood this RAMS, attended the briefing, and agree to work in accordance with it.";
    const splitDecl = doc.splitTextToSize(declaration, contentWidth - 10); 
    doc.text(splitDecl, margin + 5, currentY + 8);
    
    doc.setFont("helvetica", "bold");
    doc.text("Lead Operative / Supervisor Sign-off:", margin + 5, currentY + 30);
    doc.setFont("helvetica", "normal");
    doc.text("Name: __________________________   Sig: __________________________   Date: ____________", margin + 5, currentY + 38);
    
    currentY += 50; 

    // BOX 2: Management Approval (55mm)
    doc.rect(margin, currentY, contentWidth, 55);
    doc.setFont("helvetica", "bold");
    doc.text("RAMS Prepared & Approved By (Management):", margin + 5, currentY + 8);
    
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${formData.contactName}`, margin + 5, currentY + 20);
    doc.text("Position: Competent Person", margin + 90, currentY + 20);
    
    doc.text("Signature: __________________________________", margin + 5, currentY + 40);
    doc.text(`Date: ${formData.startDate}`, margin + 110, currentY + 40);

    // -- FINALISE --
    if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
    }

    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        drawHeader(doc);
        drawFooter(doc, i, pageCount.toString());
    }

    doc.save(`RAMS_${formData.companyName.replace(/[^a-z0-9]/gi, '_')}.pdf`);
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

              <textarea className="w-full border p-3 rounded h-32" value={formData.jobDesc} onChange={e => handleInput("jobDesc", e.target.value)} />
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
                 <input type="password" placeholder="PRO2025" className="w-full border p-3 rounded text-center mb-4 tracking-widest font-mono" value={formData.accessCode} onChange={e => handleInput("accessCode", e.target.value)} />
                 <div className="flex gap-4"><button onClick={() => setStep(2)} className="w-1/3 border py-3 rounded">Back</button><button onClick={generateRAMS} disabled={loading} className="w-2/3 bg-green-600 text-white py-3 rounded font-bold flex justify-center items-center gap-2">{loading ? <Loader2 className="animate-spin"/> : <ShieldCheck/>} Generate PDF Pack</button></div>
              </div>
            </div>
          )}
          </div>
        </div>
      </main>
    </div>
  );
}