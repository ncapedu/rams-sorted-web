"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Loader2, CheckCircle, ShieldCheck, ArrowRight, MapPin, Briefcase, AlertTriangle, Lock, Search, Info, FileText, Users, Ambulance, Flame, FileSignature } from "lucide-react";
import { TRADES, HAZARD_GROUPS, HAZARD_DATA } from "./lib/constants";

// --- UI: TOOLTIP ---
const Tooltip = ({ text }: { text: string }) => (
  <div className="group relative inline-block ml-2">
    <Info className="w-4 h-4 text-gray-500 cursor-help" />
    <div className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-black text-white text-xs rounded-md shadow-lg z-50 text-center leading-relaxed border border-gray-800">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black"></div>
    </div>
  </div>
);

// --- UI: ADDRESS SEARCH ---
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
          className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all shadow-sm group-hover:border-gray-400" 
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
  const [generated, setGenerated] = useState(false);
  
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
      createPDF(data);
      setGenerated(true);
    } catch (e: any) { alert(e.message); } 
    finally { setLoading(false); }
  };

  // --- PDF ENGINE: STRICT BLACK & WHITE ---
  const createPDF = (data: any) => {
    const doc = new jsPDF();
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20; 
    const contentWidth = pageWidth - (margin * 2);
    
    let currentY = margin;

    const checkPageBreak = (needed: number) => {
      if (currentY + needed > pageHeight - margin) {
        doc.addPage();
        currentY = margin;
        drawHeaderBlock(); 
        return true;
      }
      return false;
    };

    // --- CLEAN HEADER (NO BLOCK, JUST LINES) ---
    const drawHeaderBlock = () => {
      doc.setDrawColor(0); doc.setLineWidth(0.5);
      doc.setFont("helvetica", "bold"); doc.setFontSize(14);
      doc.text("RISK ASSESSMENT & METHOD STATEMENT", margin, currentY + 5);
      
      doc.setFontSize(10); doc.setFont("helvetica", "normal");
      doc.text(formData.companyName.toUpperCase(), pageWidth - margin, currentY + 5, { align: 'right' });
      
      currentY += 10;
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 5;
    };

    const drawFooter = (doc: any, pageNumber: number) => {
        doc.setFontSize(8); doc.setTextColor(100);
        doc.text(`Ref: ${formData.projectRef} | ${formData.siteAddress}`, margin, pageHeight - 10);
        doc.text(`Page ${pageNumber}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
    };

    // --- DOC START ---
    drawHeaderBlock();

    // 1. PROJECT DETAILS TABLE
    doc.setTextColor(0);
    autoTable(doc, {
        startY: currentY,
        theme: 'grid',
        head: [['Project Details', '']],
        body: [
            ['Contractor', `${formData.companyName}\n${formData.officeAddress}`],
            ['Client / Site', `${formData.clientName}\n${formData.siteAddress}`],
            ['Scope', `${formData.trade} - ${formData.jobType}`],
            ['Dates / Duration', `${formData.startDate} (${formData.duration})`],
            ['Supervisor', formData.supervisorName || formData.contactName],
        ],
        styles: { fontSize: 10, cellPadding: 3, textColor: 0, lineColor: 0, lineWidth: 0.1 },
        headStyles: { fillColor: 255, textColor: 0, fontStyle: 'bold', lineWidth: 0.1, lineColor: 0 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } }
    });
    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 10;

    // 2. EMERGENCY INFO
    autoTable(doc, {
        startY: currentY,
        theme: 'grid',
        head: [['Emergency Arrangements', '']],
        body: [
            ['First Aider', `${formData.firstAider} (${formData.firstAidLoc})`],
            ['Nearest Hospital', formData.hospital],
            ['Fire Assembly Point', formData.fireAssembly],
            ['Welfare', formData.welfare],
        ],
        styles: { fontSize: 10, textColor: 0, lineColor: 0, lineWidth: 0.1 },
        headStyles: { fillColor: 255, textColor: 0, fontStyle: 'bold', lineWidth: 0.1 }
    });
    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 10;

    // 3. SCOPE OF WORK
    doc.setFontSize(11); doc.setFont("helvetica", "bold");
    doc.text("1. SCOPE OF WORKS", margin, currentY); currentY += 5;
    doc.setFontSize(10); doc.setFont("helvetica", "normal");
    const scopeText = doc.splitTextToSize(data.summary || formData.jobDesc, contentWidth);
    doc.text(scopeText, margin, currentY);
    currentY += (scopeText.length * 5) + 10;

    // 4. SAFETY CHECKS (The Questions)
    if (questions.length > 0) {
        checkPageBreak(60);
        doc.setFontSize(11); doc.setFont("helvetica", "bold");
        doc.text("2. PRE-START SAFETY CHECKS", margin, currentY); currentY += 5;

        const checkRows = questions.map(q => [q.label, answers[q.id] === 'Yes' ? 'YES' : 'NO']);
        autoTable(doc, {
            startY: currentY,
            head: [['Check / Requirement', 'Status']],
            body: checkRows,
            theme: 'grid',
            styles: { fontSize: 9, textColor: 0, lineColor: 0, lineWidth: 0.1 },
            headStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold' },
            columnStyles: { 1: { cellWidth: 30, halign: 'center', fontStyle: 'bold' } }
        });
        // @ts-ignore
        currentY = doc.lastAutoTable.finalY + 10;
    }

    // 5. RISK ASSESSMENT
    checkPageBreak(80);
    doc.setFontSize(11); doc.setFont("helvetica", "bold");
    doc.text("3. RISK ASSESSMENT", margin, currentY); currentY += 5;

    autoTable(doc, {
        startY: currentY,
        head: [['Hazard', 'Who', 'Control Measures', 'Rating']],
        body: data.risks ? data.risks.map((r: any) => [r.hazard, r.who, r.control, r.risk_rating]) : [],
        theme: 'grid',
        styles: { fontSize: 9, textColor: 0, lineColor: 0, lineWidth: 0.1, cellPadding: 3 },
        headStyles: { fillColor: [50, 50, 50], textColor: 255, fontStyle: 'bold' }, // Dark Grey Header
        columnStyles: { 2: { cellWidth: 90 } },
        // @ts-ignore
        didDrawPage: (d) => { if(d.cursor) currentY = d.cursor.y; }
    });
    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 10;

    // 6. METHOD STATEMENT
    checkPageBreak(60);
    doc.setFontSize(11); doc.setFont("helvetica", "bold");
    doc.text("4. METHOD STATEMENT", margin, currentY); currentY += 8;
    
    if(data.method_steps) {
        doc.setFontSize(10); doc.setFont("helvetica", "normal");
        let steps: string[] = Array.isArray(data.method_steps) ? data.method_steps : (typeof data.method_steps === 'string' ? data.method_steps.split('\n') : []);
        
        steps.forEach((step: string) => {
            if (step.trim().length === 0) return;
            checkPageBreak(15);
            
            // Detect Headers (All Caps or Ends with :)
            const isHeader = step === step.toUpperCase() && step.length > 5 || step.trim().endsWith(":");
            
            if (isHeader) {
                currentY += 4;
                doc.setFont("helvetica", "bold");
                doc.text(step, margin, currentY);
                doc.setFont("helvetica", "normal");
                currentY += 6;
            } else {
                const text = doc.splitTextToSize(step, contentWidth);
                doc.text(text, margin, currentY);
                currentY += (text.length * 5) + 2;
            }
        });
    }
    currentY += 10;

    // 7. NOTES
    if(formData.extraNotes) {
        checkPageBreak(40);
        doc.setFontSize(11); doc.setFont("helvetica", "bold");
        doc.text("5. SPECIFIC SITE NOTES", margin, currentY); currentY += 6;
        doc.setFontSize(10); doc.setFont("helvetica", "normal");
        const notes = doc.splitTextToSize(formData.extraNotes, contentWidth);
        doc.text(notes, margin, currentY);
        currentY += (notes.length * 5) + 10;
    }

    // 8. SIGN-OFF PAGE
    doc.addPage(); drawHeaderBlock(); currentY = 40;
    
    doc.setFontSize(11); doc.setFont("helvetica", "bold");
    doc.text("6. OPERATIVE BRIEFING RECORD", margin, currentY); currentY += 8;
    
    doc.setFontSize(9); doc.setFont("helvetica", "normal");
    doc.text("I confirm I have read and understood this RAMS. I agree to work in accordance with the control measures.", margin, currentY); currentY += 10;

    autoTable(doc, {
        startY: currentY,
        head: [['Name (Print)', 'Company', 'Signature', 'Date']],
        body: [
            ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], 
            ['', '', '', ''], ['', '', '', ''], ['', '', '', '']
        ],
        theme: 'grid',
        headStyles: { fillColor: 255, textColor: 0, lineWidth: 0.1, lineColor: 0 },
        styles: { minCellHeight: 12, lineColor: 0, lineWidth: 0.1 }
    });
    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 20;

    // AUTHORISATION BOX
    doc.setDrawColor(0); doc.setLineWidth(0.2);
    doc.rect(margin, currentY, contentWidth, 35);
    
    doc.setFontSize(10); doc.setFont("helvetica", "bold");
    doc.text("DOCUMENT AUTHORISATION", margin + 5, currentY + 8);
    
    doc.setFontSize(10); doc.setFont("helvetica", "normal");
    doc.text(`Name:  ${formData.contactName}`, margin + 5, currentY + 18);
    doc.text(`Role:  Competent Person`, margin + 90, currentY + 18);
    doc.text("Signature: __________________________", margin + 5, currentY + 28);
    doc.text(`Date:  ${formData.startDate}`, margin + 90, currentY + 28);

    // FOOTERS
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) { doc.setPage(i); drawFooter(doc, i); }

    doc.save(`RAMS_${formData.companyName.replace(/ /g,'_')}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-24">
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