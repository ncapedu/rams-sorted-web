"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Loader2, ShieldCheck, MapPin, Briefcase, AlertTriangle, Info, FileText } from "lucide-react";
// Import the Titan DB constants
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
    // Removed access code check for smoother dev experience, add back if needed
    // if (formData.accessCode !== "PRO2025") return alert("❌ Invalid Access Code.");
    
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, hazards, answers }),
      });
      const data = await res.json();
      // Handle API error if backend fails, but fallback to local data if needed
      // For now we assume success to generate PDF
      createPDF(data.content || data); 
      setGenerated(true);
    } catch (e: any) { 
      console.error(e);
      // Fallback PDF generation if API fails (offline mode)
      createPDF({});
    } 
    finally { setLoading(false); }
  };

  // --- PROFESSIONAL CONSULTANT-GRADE PDF ENGINE ---
  const createPDF = (data: any) => {
    const doc = new jsPDF();
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20; 
    const contentWidth = pageWidth - (margin * 2);
    
    let currentY = margin;

    // --- HELPERS ---
    const checkPageBreak = (needed: number) => {
      if (currentY + needed > pageHeight - margin) {
        doc.addPage();
        currentY = margin + 10; // Extra space after header
        drawHeader(doc); 
        return true;
      }
      return false;
    };

    const toTitleCase = (str: string) => {
        return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    };

    // --- HEADER & FOOTER ---
    const drawHeader = (doc: any) => {
        // Simple, Clean, Legal Header (No Block)
        doc.setDrawColor(0); doc.setLineWidth(0.1);
        doc.setFont("helvetica", "bold"); doc.setFontSize(11);
        doc.text(`${formData.companyName.toUpperCase()} - RAMS DOCUMENT`, margin, 15);
        
        doc.setFontSize(8); doc.setFont("helvetica", "normal");
        const rightText = `Ref: ${formData.projectRef || "N/A"} | Date: ${formData.startDate}`;
        doc.text(rightText, pageWidth - margin, 15, { align: "right" });
        
        doc.line(margin, 18, pageWidth - margin, 18);
    };

    const drawFooter = (doc: any, pageNumber: number) => {
        doc.setFontSize(8); doc.setTextColor(100);
        doc.text(`Site: ${formData.siteAddress}`, margin, pageHeight - 10);
        doc.text(`Page ${pageNumber}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
    };

    // --- PAGE 1 START ---
    drawHeader(doc);
    currentY = 25;
    doc.setTextColor(0);

    // 1. PROJECT DETAILS TABLE (Clean lines, no fills)
    doc.setFontSize(12); doc.setFont("helvetica", "bold"); 
    doc.text("1. PROJECT DETAILS", margin, currentY); currentY += 6;
    
    autoTable(doc, {
        startY: currentY,
        theme: 'grid', // Grid theme for clean lines
        head: [['Attribute', 'Detail']],
        body: [
            ['Contractor', `${formData.companyName}\n${formData.officeAddress}\nLead: ${formData.contactName} (${formData.contactPhone})`],
            ['Client / Site', `${formData.clientName}\n${formData.siteAddress}`],
            ['Work Scope', `${formData.trade} - ${toTitleCase(formData.jobType)}`],
            ['Project Data', `Start: ${formData.startDate}  |  Duration: ${formData.duration}  |  Operatives: ${formData.operatives}`],
            ['Emergency', `First Aider: ${formData.firstAider}\nHospital: ${formData.hospital}\nAssembly: ${formData.fireAssembly}`],
        ],
        styles: { fontSize: 9, cellPadding: 3, textColor: 0, lineColor: 200, lineWidth: 0.1 },
        headStyles: { fillColor: 255, textColor: 0, fontStyle: 'bold', lineWidth: 0.1, lineColor: 0 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } }
    });
    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 10;

    // 2. SCOPE OF WORKS
    doc.setFontSize(12); doc.setFont("helvetica", "bold");
    doc.text("2. SCOPE OF WORKS", margin, currentY); currentY += 6;
    
    doc.setFontSize(10); doc.setFont("helvetica", "normal");
    // Use formData.jobDesc directly if AI data is missing
    const scopeText = doc.splitTextToSize(data.summary || formData.jobDesc || "Standard works as per industry guidelines.", contentWidth);
    doc.text(scopeText, margin, currentY);
    currentY += (scopeText.length * 5) + 10;

    // 3. PRE-START SAFETY CHECKLIST (The Yes/No Table)
    if (questions.length > 0) {
        checkPageBreak(60);
        doc.setFontSize(12); doc.setFont("helvetica", "bold");
        doc.text("3. PRE-START SAFETY CHECKLIST", margin, currentY); currentY += 6;

        const checkRows = questions.map(q => [
            q.label, 
            answers[q.id] === 'Yes' ? 'X' : '', 
            answers[q.id] === 'No' ? 'X' : '', 
            ' '
        ]);

        autoTable(doc, {
            startY: currentY,
            head: [['Safety Check / Question', 'Yes', 'No', 'N/A']],
            body: checkRows,
            theme: 'grid',
            styles: { fontSize: 9, textColor: 0, lineColor: 200, lineWidth: 0.1, cellPadding: 2 },
            headStyles: { fillColor: 240, textColor: 0, fontStyle: 'bold', lineColor: 200 },
            columnStyles: { 1: { halign: 'center', cellWidth: 15 }, 2: { halign: 'center', cellWidth: 15 }, 3: { halign: 'center', cellWidth: 15 } }
        });
        // @ts-ignore
        currentY = doc.lastAutoTable.finalY + 10;
    }

    // 4. RISK ASSESSMENT (Clean Grid)
    checkPageBreak(80);
    doc.setFontSize(12); doc.setFont("helvetica", "bold");
    doc.text("4. RISK ASSESSMENT", margin, currentY); currentY += 6;

    // Parse Hazard Data
    const hazardRows = hazards.map(h => {
        // @ts-ignore
        const lib = HAZARD_DATA[h] || { label: h, risk: "General Risk", control: "Standard site controls applied.", initial_score: "Med", residual_score: "Low" };
        return [lib.label, lib.risk, lib.initial_score, lib.control, lib.residual_score];
    });

    autoTable(doc, {
        startY: currentY,
        head: [['Hazard', 'Risk', 'Init', 'Control Measures', 'Res']],
        body: hazardRows,
        theme: 'grid',
        styles: { fontSize: 9, textColor: 0, lineColor: 0, lineWidth: 0.1, cellPadding: 3, valign: 'top' },
        headStyles: { fillColor: 240, textColor: 0, fontStyle: 'bold', lineWidth: 0.1 },
        columnStyles: { 0: { cellWidth: 30, fontStyle: 'bold' }, 2: { cellWidth: 15, halign: 'center' }, 3: { cellWidth: 65 }, 4: { cellWidth: 15, halign: 'center' } },
        // @ts-ignore
        didDrawPage: (d) => { if(d.cursor) currentY = d.cursor.y; }
    });
    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 10;

    // 5. METHOD STATEMENT
    checkPageBreak(60);
    doc.setFontSize(12); doc.setFont("helvetica", "bold");
    doc.text("5. METHOD STATEMENT", margin, currentY); currentY += 8;
    
    // Fallback method steps if AI fails
    const methodSteps = data.method_steps || [
      "1. Arrive on site and sign in.",
      "2. Review risk assessment and safety checks.",
      "3. Set up exclusion zones and signage.",
      "4. Carry out works as per scope.",
      "5. Clean up and sign out."
    ];

    if(methodSteps) {
        doc.setFontSize(10); doc.setFont("helvetica", "normal");
        let steps: string[] = Array.isArray(methodSteps) ? methodSteps : (typeof methodSteps === 'string' ? methodSteps.split('\n') : []);
        
        steps.forEach((step: string) => {
            if (step.trim().length === 0) return;
            checkPageBreak(15);
            
            // Header Detection
            const isHeader = (step === step.toUpperCase() && step.length > 5) || step.trim().endsWith(":");
            
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

    // 6. COSHH & PPE
    checkPageBreak(60);
    doc.setFontSize(12); doc.setFont("helvetica", "bold");
    doc.text("6. COSHH & PPE", margin, currentY); currentY += 6;
    
    const ppeText = data.ppe ? data.ppe.join(", ") : "Standard Site PPE (Boots, Hi-Vis, Hard Hat, Gloves)";
    doc.setFontSize(10); doc.setFont("helvetica", "normal");
    const splitPPE = doc.splitTextToSize(`Mandatory PPE: ${ppeText}`, contentWidth);
    doc.text(splitPPE, margin, currentY); 
    currentY += (splitPPE.length * 5) + 6;

    const coshhHazards = ["dust_fumes", "silica_dust", "chemical_coshh", "asbestos", "biological", "fumes", "cement"];
    if (hazards.some(h => coshhHazards.includes(h))) {
        autoTable(doc, {
            startY: currentY,
            head: [['Substance', 'Risk', 'Control / PPE', 'Disposal']],
            body: data.coshh ? data.coshh.map((c:any) => [c.substance, c.risk, c.control, c.disposal]) : [['Dust/Debris', 'Inhalation', 'Masks/Ventilation', 'Site Skip']],
            theme: 'grid',
            headStyles: { fillColor: 240, textColor: 0, fontStyle: 'bold' },
            styles: { fontSize: 9, textColor: 0, lineColor: 0, lineWidth: 0.1 }
        });
        // @ts-ignore
        currentY = doc.lastAutoTable.finalY + 10;
    }

    // 7. AUTHORISATION & SIGN-OFF (The Boxes)
    doc.addPage(); drawHeader(doc); currentY = 30; // Start fresh page for signatures
    
    doc.setFontSize(12); doc.setFont("helvetica", "bold"); 
    doc.text("7. AUTHORISATION & SIGN-OFF", margin, currentY); currentY += 10;

    // Box 1: Authorisation
    doc.setDrawColor(0); doc.setLineWidth(0.3);
    doc.rect(margin, currentY, contentWidth, 35);
    
    doc.setFontSize(10); doc.setFont("helvetica", "bold");
    doc.text("AUTHORISATION", margin + 5, currentY + 8);
    
    doc.setFontSize(10); doc.setFont("helvetica", "normal");
    doc.text(`Name:  ${formData.contactName}`, margin + 5, currentY + 18);
    doc.text(`Role:  Competent Person`, margin + 100, currentY + 18);
    doc.text("Signature: __________________________", margin + 5, currentY + 28);
    doc.text(`Date:  ${formData.startDate}`, margin + 100, currentY + 28);
    
    currentY += 45;

    // Box 2: Operative Briefing
    doc.rect(margin, currentY, contentWidth, 120); // Large box for multiple signatures
    doc.setFontSize(10); doc.setFont("helvetica", "bold");
    doc.text("OPERATIVE BRIEFING REGISTER", margin + 5, currentY + 8);
    
    doc.setFontSize(9); doc.setFont("helvetica", "normal");
    doc.text("I confirm I have been briefed on this RAMS, understand the risks, and agree to work safely.", margin + 5, currentY + 15);
    
    let lineY = currentY + 30;
    for(let i=0; i<6; i++) {
        doc.text("Name: _______________________   Signature: _______________________   Date: ___________", margin + 5, lineY);
        lineY += 15;
    }

    // Add Page Numbers
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) { doc.setPage(i); drawFooter(doc, i); }

    doc.save(`RAMS_${formData.companyName.replace(/ /g,'_')}.pdf`);
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
                 {/* Removed Access Code input for easier testing */}
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