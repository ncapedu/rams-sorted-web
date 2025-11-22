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
      createProfessionalPDF(data);
    } catch (e: any) { alert(e.message); } 
    finally { setLoading(false); }
  };

  // --- THE "TITAN" PDF ENGINE ---
  const createProfessionalPDF = (data: any) => {
    const doc = new jsPDF();
    const totalPagesExp = "{total_pages_count_string}";
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);
    let currentY = margin;

    // -- UTILS --
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
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(formData.companyName.toUpperCase(), margin, 15);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(80, 80, 80);
        const ref = `REF: RAMS-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`;
        doc.text(ref, pageWidth - margin, 15, { align: "right" });
        
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        doc.line(margin, 18, pageWidth - margin, 18);
    };

    const drawFooter = (doc: any, pageNumber: number, totalPages: string) => {
        const str = `Page ${pageNumber} of ${totalPages}`;
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(str, pageWidth - margin, pageHeight - 10, { align: "right" });
        doc.text(`Site: ${formData.siteAddress.substring(0, 50)}...`, margin, pageHeight - 10);
    };

    // -- CONTENT GENERATION --
    
    // 1. COVER PAGE / DOCUMENT CONTROL
    drawHeader(doc);
    currentY = 30;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("RISK ASSESSMENT & METHOD STATEMENT", margin, currentY);
    currentY += 10;

    // Document Control Table
    autoTable(doc, {
        startY: currentY,
        head: [[{ content: 'DOCUMENT CONTROL', colSpan: 2, styles: { halign: 'center', fillColor: [240, 240, 240] } }]],
        body: [
            ['Project / Client', `${formData.clientName}`],
            ['Site Address', `${formData.siteAddress}`],
            ['Work Scope', `${formData.trade} - ${formData.jobType}`],
            ['Prepared By', `${formData.contactName} (Competent Person)`],
            ['Date Prepared', `${formData.startDate}`],
            ['Valid Until', `Completion of works or significant change in scope`],
        ],
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 4, lineColor: [0,0,0], lineWidth: 0.1, textColor: [0,0,0] },
        headStyles: { fontStyle: 'bold', textColor: [0,0,0] },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } }
    });
    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 15;

    // 2. EMERGENCY INFORMATION
    doc.setFontSize(11); doc.setFont("helvetica", "bold");
    doc.text("1. EMERGENCY PROCEDURES", margin, currentY);
    currentY += 5;

    autoTable(doc, {
        startY: currentY,
        body: [
            ['First Aider', formData.firstAider || "N/A", 'Nearest Hospital', formData.hospital || "Use Sat Nav"],
            ['First Aid Kit', formData.firstAidLoc || "Site Vehicle", 'Fire Assembly', formData.fireAssembly || "As Inducted"],
            ['Supervisor', formData.supervisorName || "TBC", 'Welfare', formData.welfare || "Client WC"],
        ],
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 3, lineColor: [0,0,0], lineWidth: 0.1, textColor: [0,0,0] },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 30 }, 2: { fontStyle: 'bold', cellWidth: 30 } }
    });
    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 15;

    // 3. EXECUTIVE SUMMARY / SCOPE
    doc.text("2. SCOPE OF WORKS", margin, currentY);
    currentY += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const splitSummary = doc.splitTextToSize(data.summary || "No summary provided.", contentWidth);
    doc.text(splitSummary, margin, currentY);
    currentY += (splitSummary.length * 4) + 15;

    // 4. PRE-START CHECKS
    if (questions.length > 0) {
        checkSpace(50);
        doc.setFont("helvetica", "bold"); doc.setFontSize(11);
        doc.text("3. SPECIFIC SAFETY CHECKS", margin, currentY);
        currentY += 5;

        const checkRows = questions.map(q => [
            q.label,
            answers[q.id] === "Yes" ? "YES" : "NO/NA"
        ]);

        autoTable(doc, {
            startY: currentY,
            head: [['Checklist Item', 'Status']],
            body: checkRows,
            theme: 'grid',
            styles: { fontSize: 9, cellPadding: 2, lineColor: [200,200,200], lineWidth: 0.1, textColor: [0,0,0] },
            headStyles: { fillColor: [245,245,245], textColor: [0,0,0], fontStyle: 'bold' },
            columnStyles: { 1: { cellWidth: 25, halign: 'center', fontStyle: 'bold' } }
        });
        // @ts-ignore
        currentY = doc.lastAutoTable.finalY + 15;
    }

    // 5. RISK ASSESSMENT (The Big Grid)
    addPageBreak();
    doc.setFont("helvetica", "bold"); doc.setFontSize(11);
    doc.text("4. RISK ASSESSMENT REGISTER", margin, currentY);
    currentY += 5;

    const riskBody = hazards.map(h => {
        // @ts-ignore
        const hData = HAZARD_DATA[h] || { label: h, risk: "General Injury", initial_score: "Med", control: "Standard PPE and vigilance.", residual_score: "Low" };
        return [
            hData.label,
            hData.risk,
            hData.initial_score.toUpperCase(),
            hData.control,
            hData.residual_score.toUpperCase()
        ];
    });

    autoTable(doc, {
        startY: currentY,
        head: [['Hazard', 'Potential Risk', 'Init', 'Control Measures', 'Res']],
        body: riskBody,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 3, lineColor: [0,0,0], lineWidth: 0.1, textColor: [0,0,0], valign: 'middle' },
        headStyles: { fillColor: [230,230,230], textColor: [0,0,0], fontStyle: 'bold', lineWidth: 0.1 },
        columnStyles: {
            0: { cellWidth: 30, fontStyle: 'bold' },
            1: { cellWidth: 30 },
            2: { cellWidth: 10, halign: 'center' },
            3: { cellWidth: 'auto' }, // Controls take remaining space
            4: { cellWidth: 10, halign: 'center' }
        }
    });
    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 15;

    // 6. METHOD STATEMENT
    checkSpace(60);
    doc.setFont("helvetica", "bold"); doc.setFontSize(11);
    doc.text("5. METHOD STATEMENT (SAFE SYSTEM OF WORK)", margin, currentY);
    currentY += 8;

    if(data.method_steps) {
        doc.setFont("helvetica", "normal"); doc.setFontSize(9);
        const steps = Array.isArray(data.method_steps) ? data.method_steps : data.method_steps.split('\n');
        
        steps.forEach((step: string) => {
            if (!step.trim()) return;
            
            // Check for space
            if (checkSpace(20)) {
                doc.setFont("helvetica", "bold"); doc.setFontSize(11);
                doc.text("5. METHOD STATEMENT (CONT.)", margin, currentY);
                currentY += 8;
                doc.setFont("helvetica", "normal"); doc.setFontSize(9);
            }

            // Clean logic for headers vs steps
            const isHeader = step.toUpperCase() === step && step.length > 5;
            
            if (isHeader) {
                currentY += 2;
                doc.setFont("helvetica", "bold");
                doc.text(step, margin, currentY);
                doc.setFont("helvetica", "normal");
                currentY += 5;
            } else {
                const cleanStep = step.replace(/^\d+\.\s*/, ''); // Remove existing numbers if any
                const bullet = "•"; 
                const wrappedText = doc.splitTextToSize(`${bullet}  ${cleanStep}`, contentWidth);
                doc.text(wrappedText, margin, currentY);
                currentY += (wrappedText.length * 4.5) + 2;
            }
        });
    }
    currentY += 10;

    // 7. PPE & COSHH
    checkSpace(60);
    doc.setFont("helvetica", "bold"); doc.setFontSize(11);
    doc.text("6. PPE & COSHH ASSESSMENT", margin, currentY);
    currentY += 5;

    const ppeList = data.ppe ? data.ppe.join(", ") : "Safety Boots, Hi-Vis Vest, Gloves, Eye Protection (as required).";
    
    autoTable(doc, {
        startY: currentY,
        head: [['Mandatory Personal Protective Equipment (PPE)']],
        body: [[ppeList]],
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 3, lineColor: [0,0,0], lineWidth: 0.1, textColor: [0,0,0] },
        headStyles: { fillColor: [240,240,240], textColor: [0,0,0], fontStyle: 'bold' }
    });
    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 10;

    const coshhHazards = ["dust_fumes", "silica_dust", "chemical_coshh", "asbestos", "cement", "fumes"];
    if (hazards.some(h => coshhHazards.includes(h))) {
        doc.setFontSize(9); doc.setFont("helvetica", "bold");
        doc.text("COSHH Assessment (Hazardous Substances)", margin, currentY);
        currentY += 4;

        const coshhBody = data.coshh ? data.coshh.map((c:any) => [c.substance, c.risk, c.control, c.disposal]) : [['General Dust', 'Inhalation', 'P3 Masks / Damp down', 'Bag and skip']];

        autoTable(doc, {
            startY: currentY,
            head: [['Substance', 'Hazard', 'Control Measures', 'Disposal Route']],
            body: coshhBody,
            theme: 'grid',
            styles: { fontSize: 8, cellPadding: 2, lineColor: [0,0,0], lineWidth: 0.1 },
            headStyles: { fillColor: [240,240,240], textColor: [0,0,0] }
        });
    }

    // 8. SIGN OFF REGISTER
    addPageBreak();
    drawHeader(doc);
    currentY = 30;

    doc.setFont("helvetica", "bold"); doc.setFontSize(11);
    doc.text("7. SITE INDUCTION & SIGN-OFF REGISTER", margin, currentY);
    currentY += 8;

    doc.setFont("helvetica", "normal"); doc.setFontSize(9);
    const declaration = "I certify that I have read and understood the contents of this Risk Assessment and Method Statement. I agree to work in accordance with the control measures outlined above and will report any new hazards immediately.";
    const splitDec = doc.splitTextToSize(declaration, contentWidth);
    doc.text(splitDec, margin, currentY);
    currentY += (splitDec.length * 5) + 5;

    // Create a formal grid for signatures
    const signOffRows = [];
    for(let i=0; i<12; i++) {
        signOffRows.push(['', '', '', '']);
    }

    autoTable(doc, {
        startY: currentY,
        head: [['Print Name', 'Company', 'Signature', 'Date']],
        body: signOffRows,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 4, lineColor: [0,0,0], lineWidth: 0.1, minCellHeight: 10 },
        headStyles: { fillColor: [220,220,220], textColor: [0,0,0], fontStyle: 'bold' }
    });

    // -- FINALIZE --
    if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
    }

    // Add headers and footers to all pages
    const pageCount = doc.internal.pages.length - 1; // jsPDF has a 1-based index but includes an empty first element
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        drawHeader(doc); // Redraw header on every page just in case
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