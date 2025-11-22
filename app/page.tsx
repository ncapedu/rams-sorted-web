"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { 
  Loader2, CheckCircle, ShieldCheck, ArrowRight, MapPin, Briefcase, 
  AlertTriangle, Lock, Search, Info, FileText, Users, Ambulance, Flame, 
  FileSignature, ChevronRight, Check, X 
} from "lucide-react";
import { TRADES, HAZARD_GROUPS, HAZARD_DATA } from "./lib/constants";

// --- COMPONENTS ---

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
    // Company
    companyName: "", officeAddress: "", contactName: "", contactPhone: "",
    // Project
    clientName: "", projectRef: "", siteAddress: "", startDate: new Date().toISOString().split('T')[0], duration: "1 Day", 
    // Scope
    operatives: "1", trade: "Electrician", jobType: "", customJobType: "", jobDesc: "",
    // Emergency
    supervisorName: "", firstAider: "", hospital: "", fireAssembly: "Designated point as per site induction", firstAidLoc: "Site Vehicle / Office",
    welfare: "Client WC facilities available", 
    // Misc
    extraNotes: "", accessCode: ""
  });
  
  const [hazards, setHazards] = useState<string[]>([]);
  const [questions, setQuestions] = useState<any[]>([]); // The specific questions for the job
  const [answers, setAnswers] = useState<Record<string, string>>({}); // The user's Yes/No answers

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

  // --- NAVIGATION ---
  const nextStep = () => {
    if (step === 1) {
        if (!formData.companyName || !formData.officeAddress || !formData.contactName) return alert("⚠️ Please fill in all Company Details.");
    }
    if (step === 2) {
        if (!formData.clientName || !formData.siteAddress || !formData.duration) return alert("⚠️ Please fill in Project Details.");
        if (formData.jobType === "Other (Custom)" && !formData.customJobType) return alert("⚠️ Please enter your Custom Job Title.");
        if (!formData.jobDesc) return alert("⚠️ Please enter a Job Description.");
        
        // Validate Questions
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

  // --- THE PROFESSIONAL PDF ENGINE (100% BLACK AND WHITE) ---
  const createPDF = (data: any) => {
    const doc = new jsPDF();
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 14;
    const maxTextWidth = pageWidth - (margin * 2);
    
    // Helper: Check Y and Add Page
    let currentY = 45;
    const checkPageBreak = (heightNeeded: number) => {
      if (currentY + heightNeeded > pageHeight - 20) {
        doc.addPage();
        currentY = 40; // Reset Y
        drawHeader(doc); // Re-draw header
        return true;
      }
      return false;
    };

    const drawHeader = (doc: any) => {
        // SOLID BLACK HEADER BAR
        doc.setFillColor(0, 0, 0); 
        doc.rect(0, 0, 210, 30, 'F');
        
        // TEXT: WHITE
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22); doc.setFont("helvetica", "bold");
        doc.text("RAMS DOCUMENT", 14, 18);
        
        doc.setFontSize(10); doc.setFont("helvetica", "normal");
        doc.text(`Risk Assessment & Method Statement`, 14, 24);
        
        // Reference Info
        doc.setFontSize(9); 
        doc.text(`Ref: ${formData.projectRef || "N/A"}`, 195, 12, { align: 'right' });
        doc.text(`Date: ${formData.startDate}`, 195, 17, { align: 'right' });
        doc.text(formData.companyName.toUpperCase(), 195, 24, { align: 'right' });
    };

    const drawFooter = (doc: any, pageNumber: number) => {
        doc.setFontSize(8); doc.setTextColor(100, 100, 100);
        doc.text(`Generated by RAMS Sorted | Page ${pageNumber}`, 14, pageHeight - 10);
        doc.text(`${formData.companyName} - ${formData.siteAddress}`, 195, pageHeight - 10, { align: 'right' });
    };

    // --- START DOCUMENT ---
    drawHeader(doc);
    doc.setTextColor(0, 0, 0); // Reset to Black
    
    // 1. PROJECT DIRECTORY (Grid)
    doc.setFontSize(12); doc.setFont("helvetica", "bold"); 
    doc.text("1. Project Directory", 14, currentY); currentY += 6;
    
    autoTable(doc, {
        startY: currentY,
        head: [['Role', 'Name', 'Contact / Address']],
        body: [
            ['Contractor', formData.companyName, `${formData.officeAddress}\n${formData.contactPhone}`],
            ['Client / Site', formData.clientName, formData.siteAddress],
            ['Competent Person', formData.contactName, 'Site Supervisor'],
            ['Emergency', 'General Services', '999 / 112'],
        ],
        theme: 'grid',
        headStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold', lineColor: 0, lineWidth: 0.1 },
        styles: { fontSize: 10, cellPadding: 3, lineColor: 0, lineWidth: 0.1, textColor: 0 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 }, 2: { cellWidth: 80 } }
    });
    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 15;

    // 2. SITE LOGISTICS & EMERGENCY
    doc.setFontSize(12); doc.setFont("helvetica", "bold"); 
    doc.text("2. Site Logistics & Emergency Arrangements", 14, currentY); currentY += 6;
    
    autoTable(doc, {
        startY: currentY,
        body: [
            ['Work Scope', formData.jobType === "Other (Custom)" ? formData.customJobType : formData.jobType],
            ['Start Date', `${formData.startDate} (${formData.duration})`],
            ['Operatives on Site', formData.operatives],
            ['First Aider', `${formData.firstAider} (Loc: ${formData.firstAidLoc})`],
            ['Nearest Hospital', formData.hospital],
            ['Fire Assembly Point', formData.fireAssembly],
            ['Welfare Facilities', formData.welfare],
        ],
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 2, textColor: 0 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } }
    });
    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 15;

    // 3. PRE-START SAFETY CHECKS (New Section)
    // This proves the user answered the specific questions
    checkPageBreak(60);
    doc.setFontSize(12); doc.setFont("helvetica", "bold"); 
    doc.text("3. Pre-Start Safety Declarations", 14, currentY); currentY += 6;

    const checkData = Object.keys(answers).map(key => {
        const q = questions.find(q => q.id === key);
        return [q ? q.label : key, answers[key]];
    });

    autoTable(doc, {
        startY: currentY,
        head: [['Safety Check / Requirement', 'Confirmed']],
        body: checkData,
        theme: 'grid',
        headStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold', lineColor: 0, lineWidth: 0.1 },
        styles: { fontSize: 10, textColor: 0, lineColor: 0, lineWidth: 0.1 },
        columnStyles: { 1: { cellWidth: 30, halign: 'center' } }
    });
    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 15;

    // 4. SCOPE OF WORKS
    checkPageBreak(50);
    doc.setFontSize(12); doc.setFont("helvetica", "bold"); 
    doc.text("4. Detailed Scope of Works", 14, currentY); currentY += 7;
    
    doc.setFontSize(10); doc.setFont("helvetica", "normal");
    const scopeText = doc.splitTextToSize(data.summary || "", maxTextWidth);
    doc.text(scopeText, 14, currentY);
    currentY += (scopeText.length * 5) + 15;

    // 5. RISK ASSESSMENT
    checkPageBreak(100);
    doc.setFontSize(12); doc.setFont("helvetica", "bold"); 
    doc.text("5. Risk Assessment", 14, currentY); currentY += 6;
    
    autoTable(doc, {
        startY: currentY,
        head: [['Hazard Identified', 'Persons at Risk', 'Control Measures', 'Risk Rating']],
        body: data.risks ? data.risks.map((r: any) => [r.hazard, r.who, r.control, r.risk_rating]) : [],
        theme: 'grid',
        headStyles: { fillColor: [50, 50, 50], textColor: 255, fontStyle: 'bold' }, // Dark Grey Header
        styles: { fontSize: 9, cellPadding: 3, textColor: 0, lineColor: 0, lineWidth: 0.1, valign: 'top' },
        columnStyles: { 0: { cellWidth: 30, fontStyle: 'bold' }, 2: { cellWidth: 90 } }, // Wide control column
        didDrawPage: (d) => { currentY = d.cursor.y; } // Update Y after table split
    });
    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 15;

    // 6. METHOD STATEMENT (Iterative)
    checkPageBreak(60);
    doc.setFontSize(12); doc.setFont("helvetica", "bold"); 
    doc.text("6. Method Statement / Safe System of Work", 14, currentY); currentY += 10;
    
    doc.setFontSize(10); doc.setFont("helvetica", "normal");
    
    if(data.method_steps) {
        let steps: string[] = [];
        if (Array.isArray(data.method_steps)) steps = data.method_steps;
        else if (typeof data.method_steps === 'string') steps = data.method_steps.split('\n').filter((s: string) => s.trim().length > 0);

        steps.forEach((step: string) => {
            const isHeading = step.toUpperCase() === step || step.trim().endsWith(":");
            
            // Check for space before writing
            checkPageBreak(20);

            if (isHeading) {
                currentY += 4;
                doc.setFont("helvetica", "bold");
                doc.text(step, 14, currentY);
                doc.setFont("helvetica", "normal");
                currentY += 6;
            } else {
                const text = doc.splitTextToSize(step, maxTextWidth);
                doc.text(text, 14, currentY);
                currentY += (text.length * 5) + 3;
            }
        });
    }
    currentY += 10;

    // 7. COSHH (Conditional)
    const coshhHazards = ["dust_fumes", "silica_dust", "chemical_coshh", "asbestos", "biological", "fumes", "cement"];
    const hasCoshh = hazards.some(h => coshhHazards.includes(h));
    
    if (hasCoshh) {
        checkPageBreak(80);
        doc.setFontSize(12); doc.setFont("helvetica", "bold"); 
        doc.text("7. COSHH Assessment (Hazardous Substances)", 14, currentY); currentY += 6;
        
        autoTable(doc, {
            startY: currentY,
            head: [['Substance / Material', 'Hazard Type', 'Control Measures', 'Disposal']],
            body: data.coshh ? data.coshh.map((c:any) => [c.substance, c.risk, c.control, c.disposal]) : [['Generated Dust/Debris', 'Inhalation/Irritant', 'Damp down, FFP3 Masks, Ventilation', 'Site Skip / Sealed Bags']],
            theme: 'grid',
            headStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold', lineColor: 0, lineWidth: 0.1 },
            styles: { fontSize: 9, textColor: 0, lineColor: 0, lineWidth: 0.1 }
        });
        // @ts-ignore
        currentY = doc.lastAutoTable.finalY + 15;
    }

    // 8. PPE REQUIRED
    checkPageBreak(40);
    doc.setFontSize(12); doc.setFont("helvetica", "bold"); 
    doc.text("8. Personal Protective Equipment (PPE)", 14, currentY); currentY += 6;
    doc.setFontSize(10); doc.setFont("helvetica", "normal");
    
    const ppeText = data.ppe ? data.ppe.join(", ") : "Standard Site PPE (Boots, Hi-Vis, Hard Hat)";
    const splitPPE = doc.splitTextToSize(ppeText, maxTextWidth);
    doc.text(splitPPE, 14, currentY);
    currentY += (splitPPE.length * 5) + 15;

    // 9. SPECIFIC NOTES
    if(formData.extraNotes) {
        checkPageBreak(40);
        doc.setFontSize(12); doc.setFont("helvetica", "bold"); 
        doc.text("9. Specific Site Notes / Restrictions", 14, currentY); currentY += 6;
        doc.setFontSize(10); doc.setFont("helvetica", "normal");
        const notes = doc.splitTextToSize(formData.extraNotes, maxTextWidth);
        doc.text(notes, 14, currentY);
        currentY += (notes.length * 5) + 15;
    }

    // 10. WORKER BRIEFING SHEET (The Sign-off Page)
    doc.addPage(); drawHeader(doc); currentY = 40;
    
    doc.setFontSize(12); doc.setFont("helvetica", "bold"); 
    doc.text("10. Operative Acknowledgement & Briefing Register", 14, currentY); currentY += 8;
    
    doc.setFontSize(10); doc.setFont("helvetica", "normal");
    const briefingText = "By signing below, I acknowledge that I have read and understood this Risk Assessment & Method Statement. I agree to work in accordance with the control measures and safe systems of work described herein. I am aware of the emergency procedures for this site.";
    const splitBrief = doc.splitTextToSize(briefingText, maxTextWidth);
    doc.text(splitBrief, 14, currentY);
    currentY += (splitBrief.length * 5) + 10;

    // Sign-off Table
    autoTable(doc, {
        startY: currentY,
        head: [['Print Name', 'Company', 'Signature', 'Date']],
        body: [
            ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], 
            ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', '']
        ],
        theme: 'grid',
        headStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold', lineColor: 0, lineWidth: 0.1 },
        styles: { minCellHeight: 12, lineColor: 0, lineWidth: 0.1, textColor: 0 }
    });
    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 20;

    // FINAL AUTHORISATION BOX
    doc.setDrawColor(0); doc.setLineWidth(0.3);
    doc.rect(14, currentY, 182, 35);
    
    doc.setFontSize(11); doc.setFont("helvetica", "bold"); 
    doc.text("Document Authorisation", 18, currentY+8);
    
    doc.setFontSize(10); doc.setFont("helvetica", "normal");
    doc.text(`Prepared By (Competent Person):  ${formData.contactName}`, 18, currentY+18);
    doc.text("Signature: __________________________", 110, currentY+18);
    doc.text(`Date: ${formData.startDate}`, 18, currentY+28);

    // Add Page Numbers
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) { doc.setPage(i); drawFooter(doc, i); }

    doc.save(`RAMS_${formData.companyName.replace(/ /g,'_')}_${formData.startDate}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-24">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-50 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 font-extrabold text-xl tracking-tight text-blue-900">
          <ShieldCheck className="w-7 h-7 text-blue-700"/> RAMS Sorted
        </div>
        <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs font-medium text-gray-500 uppercase tracking-wide">Professional Edition</span>
            <div className="text-xs font-bold bg-blue-700 text-white px-4 py-1.5 rounded-full shadow-sm">Step {step} / 3</div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          
          {/* PROGRESS BAR */}
          <div className="h-1.5 bg-gray-100 w-full">
            <div className="h-full bg-blue-600 transition-all duration-500 ease-out" style={{ width: `${(step/3)*100}%` }}></div>
          </div>

          <div className="p-8">
          {/* STEP 1: COMPANY */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-900"><Briefcase className="w-6 h-6 text-blue-600"/> Company & Client</h2>
                <p className="text-gray-500 text-sm mt-1 ml-9">Enter the legal details for the document header.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Your Company Name <span className="text-red-500">*</span></label>
                    <input className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-600 outline-none transition-all" value={formData.companyName} onChange={e => handleInput("companyName", e.target.value)} placeholder="e.g. Elite Electrical Ltd" />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Competent Person <span className="text-red-500">*</span></label>
                    <input className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-600 outline-none" value={formData.contactName} onChange={e => handleInput("contactName", e.target.value)} placeholder="Name of signatory" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AddressSearch label="Office Address" required={true} tooltip="Registered business address for the legal header." value={formData.officeAddress} onChange={(val:string) => handleInput("officeAddress", val)} />
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Contact Phone</label>
                    <input className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-600 outline-none" value={formData.contactPhone} onChange={e => handleInput("contactPhone", e.target.value)} placeholder="07700 900..." />
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mt-4 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold uppercase text-blue-800 mb-1.5">Client / Contractor Name <span className="text-red-500">*</span></label>
                        <input className="w-full border border-blue-200 rounded-md p-3 focus:ring-2 focus:ring-blue-600 outline-none" value={formData.clientName} onChange={e => handleInput("clientName", e.target.value)} placeholder="Who are you working for?" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-blue-800 mb-1.5">Project Reference</label>
                        <input className="w-full border border-blue-200 rounded-md p-3 focus:ring-2 focus:ring-blue-600 outline-none" value={formData.projectRef} onChange={e => handleInput("projectRef", e.target.value)} placeholder="e.g. PO-4922" />
                    </div>
                  </div>
                  <AddressSearch label="Site Address" required={true} tooltip="The actual location where work is taking place." value={formData.siteAddress} onChange={(val:string) => handleInput("siteAddress", val)} />
              </div>

              <div className="flex justify-end pt-4">
                  <button onClick={nextStep} className="bg-black hover:bg-gray-800 text-white py-3 px-8 rounded-lg font-bold text-base flex items-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Next Step <ArrowRight className="w-4 h-4"/>
                  </button>
              </div>
            </div>
          )}

          {/* STEP 2: SCOPE */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-900"><FileText className="w-6 h-6 text-blue-600"/> Scope & Logistics</h2>
                <p className="text-gray-500 text-sm mt-1 ml-9">Define the work activities.</p>
              </div>
              
              <div className="grid grid-cols-3 gap-6 bg-gray-50 p-5 rounded-xl border border-gray-200">
                <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Start Date</label><input type="date" className="w-full border border-gray-300 rounded-md p-2.5 bg-white" value={formData.startDate} onChange={e => handleInput("startDate", e.target.value)} /></div>
                <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Duration</label><input className="w-full border border-gray-300 rounded-md p-2.5 bg-white" placeholder="e.g. 2 Days" value={formData.duration} onChange={e => handleInput("duration", e.target.value)} /></div>
                <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Operatives</label><input type="number" className="w-full border border-gray-300 rounded-md p-2.5 bg-white" value={formData.operatives} onChange={e => handleInput("operatives", e.target.value)} /></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Trade</label><select className="w-full border border-gray-300 rounded-md p-3 bg-white text-base" value={formData.trade} onChange={e => handleInput("trade", e.target.value)}>{Object.keys(TRADES).map(t => <option key={t}>{t}</option>)}</select></div>
                  {/* @ts-ignore */}
                  <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Job Type</label><select className="w-full border border-gray-300 rounded-md p-3 bg-white text-base" value={formData.jobType} onChange={e => handleInput("jobType", e.target.value)}><option value="">-- Select --</option>{TRADES[formData.trade].jobs.map((j:any) => <option key={j.name}>{j.name}</option>)}</select></div>
              </div>

              {formData.jobType === "Other (Custom)" && (
                <div className="animate-in fade-in slide-in-from-top-2"><label className="block text-xs font-bold uppercase text-black mb-1.5">Custom Job Title</label><input className="w-full border-2 border-black rounded-md p-3" placeholder="e.g. Jacuzzi Installation" value={formData.customJobType} onChange={e => handleInput("customJobType", e.target.value)} /></div>
              )}

              {/* DYNAMIC QUESTIONS */}
              {questions.length > 0 && (
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 shadow-sm">
                      <h4 className="text-sm font-extrabold text-blue-900 uppercase tracking-wide mb-4 flex items-center gap-2"><CheckCircle className="w-4 h-4"/> Mandatory Safety Checks</h4>
                      <div className="space-y-3">
                      {questions.map((q:any) => (
                          <div key={q.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3 rounded-lg border border-blue-100">
                              <span className="text-sm text-gray-800 font-medium mr-4 mb-2 sm:mb-0">{q.label}</span>
                              <div className="flex gap-2">
                                  <button onClick={() => setAnswers({...answers, [q.id]: "Yes"})} className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-xs font-bold transition-all ${answers[q.id] === "Yes" ? "bg-green-600 text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}><Check className="w-3 h-3 inline mr-1"/>Yes</button>
                                  <button onClick={() => setAnswers({...answers, [q.id]: "No"})} className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-xs font-bold transition-all ${answers[q.id] === "No" ? "bg-red-600 text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}><X className="w-3 h-3 inline mr-1"/>No</button>
                              </div>
                          </div>
                      ))}
                      </div>
                  </div>
              )}

              <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Detailed Description of Works</label><textarea className="w-full border border-gray-300 rounded-md p-4 h-32 focus:ring-2 focus:ring-black outline-none text-sm leading-relaxed" value={formData.jobDesc} onChange={e => handleInput("jobDesc", e.target.value)} /></div>
              
              <div className="flex justify-between pt-4">
                  <button onClick={() => setStep(1)} className="text-gray-500 hover:text-black font-bold px-4 py-2">Back</button>
                  <button onClick={nextStep} className="bg-black hover:bg-gray-800 text-white py-3 px-8 rounded-lg font-bold text-base flex items-center gap-2 transition-all shadow-lg">Next Step <ArrowRight className="w-4 h-4"/></button>
              </div>
            </div>
          )}

          {/* STEP 3: HAZARDS & GENERATE */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-bold flex items-center gap-3 text-red-700"><AlertTriangle className="w-6 h-6"/> Safety & Hazards</h2>
                <p className="text-gray-500 text-sm mt-1 ml-9">Confirm site safety arrangements.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-red-50 p-6 rounded-xl border border-red-100">
                 <div className="col-span-1 md:col-span-2 flex items-center gap-2 text-red-800 font-bold text-sm uppercase tracking-wide"><Ambulance className="w-4 h-4"/> Emergency Arrangements</div>
                 <div><label className="text-xs font-bold uppercase text-gray-500 mb-1">Site Supervisor</label><input className="w-full border border-red-200 rounded-md p-2.5 bg-white focus:border-red-500 outline-none" value={formData.supervisorName} onChange={e => handleInput("supervisorName", e.target.value)} /></div>
                 <div><label className="text-xs font-bold uppercase text-gray-500 mb-1">First Aider</label><input className="w-full border border-red-200 rounded-md p-2.5 bg-white focus:border-red-500 outline-none" value={formData.firstAider} onChange={e => handleInput("firstAider", e.target.value)} /></div>
                 <div><label className="text-xs font-bold uppercase text-gray-500 mb-1">First Aid Kit Loc</label><input className="w-full border border-red-200 rounded-md p-2.5 bg-white focus:border-red-500 outline-none" value={formData.firstAidLoc} onChange={e => handleInput("firstAidLoc", e.target.value)} /></div>
                 <div><label className="text-xs font-bold uppercase text-gray-500 mb-1">Fire Assembly Point</label><input className="w-full border border-red-200 rounded-md p-2.5 bg-white focus:border-red-500 outline-none" value={formData.fireAssembly} onChange={e => handleInput("fireAssembly", e.target.value)} /></div>
                 <div className="col-span-1 md:col-span-2"><label className="text-xs font-bold uppercase text-gray-500 mb-1">Nearest Hospital (A&E)</label><input className="w-full border border-red-200 rounded-md p-2.5 bg-white focus:border-red-500 outline-none" placeholder="Hospital Name & Postcode" value={formData.hospital} onChange={e => handleInput("hospital", e.target.value)} /></div>
              </div>

              <div className="space-y-6">
                 {Object.entries(HAZARD_GROUPS).map(([group, items]) => (
                   <div key={group} className="border border-gray-200 rounded-xl p-5 shadow-sm bg-white">
                      <h4 className="text-sm font-bold uppercase text-gray-800 mb-3 flex items-center gap-2">
                        {group === "High Risk" && <Flame className="w-4 h-4 text-red-500"/>}{group}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {items.map(h => (
                           <button key={h} onClick={() => toggleHazard(h)} className={`text-xs py-2 px-4 rounded-md border font-medium transition-all duration-200 ${hazards.includes(h) ? 'bg-black text-white border-black shadow-md transform scale-105' : 'bg-white text-gray-600 hover:bg-gray-100 border-gray-200'}`}>
                             {/* @ts-ignore */}
                             {HAZARD_DATA[h]?.label || h}
                           </button>
                        ))}
                      </div>
                   </div>
                 ))}
              </div>

              <div className="pt-8 border-t border-gray-200 mt-8">
                 <div className="max-w-xs mx-auto mb-6">
                    <label className="text-xs font-bold uppercase text-gray-400 mb-2 block text-center">Enter Pro Access Code</label>
                    <input type="password" placeholder="PRO2025" className="w-full border-2 border-gray-200 rounded-lg p-3 text-center tracking-widest font-mono text-lg focus:border-black outline-none transition-colors" value={formData.accessCode} onChange={e => handleInput("accessCode", e.target.value)} />
                 </div>
                 
                 <div className="flex justify-between items-center">
                    <button onClick={() => setStep(2)} className="text-gray-500 hover:text-black font-bold px-4">Back</button>
                    <button onClick={generateRAMS} disabled={loading} className="w-full max-w-sm bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold text-lg flex justify-center gap-3 items-center shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-1">
                        {loading ? <Loader2 className="animate-spin w-6 h-6"/> : <FileSignature className="w-6 h-6"/>} 
                        {loading ? "Generating RAMS..." : "Create Document"}
                    </button>
                 </div>
              </div>

              {generated && (
                <div className="bg-green-50 p-6 rounded-xl border border-green-200 flex items-center gap-4 text-green-900 mt-6 shadow-sm animate-in zoom-in-95 duration-300">
                    <div className="bg-green-100 p-2 rounded-full"><CheckCircle className="w-8 h-8 text-green-600"/></div>
                    <div>
                        <p className="font-bold text-lg">Document Ready!</p>
                        <p className="text-sm text-green-700">Your professional PDF has been downloaded.</p>
                    </div>
                </div>
              )}
            </div>
          )}
          
          </div>
        </div>
      </main>
    </div>
  );
}