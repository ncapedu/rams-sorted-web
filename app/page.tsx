"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Loader2, CheckCircle, ShieldCheck, ArrowRight, MapPin, Briefcase, AlertTriangle, Lock, Search, Info, FileText, Users, Ambulance, Flame, FileSignature } from "lucide-react";
import { TRADES, HAZARD_GROUPS, HAZARD_DATA } from "./lib/constants";

// --- UI: TOOLTIP COMPONENT ---
const Tooltip = ({ text }: { text: string }) => (
  <div className="group relative inline-block ml-2">
    <Info className="w-4 h-4 text-gray-400 cursor-help" />
    <div className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-black text-white text-xs rounded-md shadow-lg z-50 text-center leading-relaxed">
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
    if (text.length > 3) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${text}&countrycodes=gb&limit=5`);
        const data = await res.json();
        setResults(data); setShowDropdown(true);
      } catch (e) { console.error(e); }
    } else { setShowDropdown(false); }
  };

  return (
    <div className="relative">
      <label className="flex items-center text-sm font-bold text-gray-700 mb-1">
        {label} {required && <span className="text-red-500 ml-1">*</span>} <Tooltip text={tooltip} />
      </label>
      <div className="relative">
        <input className="w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-black outline-none" placeholder="Start typing address..." value={query} onChange={(e) => searchAddress(e.target.value)} />
        <MapPin className="w-5 h-5 absolute right-3 top-3.5 text-gray-400" />
      </div>
      {showDropdown && results.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border rounded-lg shadow-xl mt-1 max-h-60 overflow-auto">
          {results.map((r: any, i) => (
            <li key={i} onClick={() => { setQuery(r.display_name); onChange(r.display_name); setShowDropdown(false); }} className="p-3 hover:bg-gray-50 cursor-pointer text-sm border-b last:border-0 text-gray-700">
              {r.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// --- MAIN APP ---
export default function Home() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  
  // STATE
  const [formData, setFormData] = useState({
    // Step 1
    companyName: "", officeAddress: "", contactName: "", contactPhone: "",
    // Step 2
    clientName: "", projectRef: "", siteAddress: "", startDate: new Date().toISOString().split('T')[0], duration: "", 
    clientType: "Direct", 
    // Step 3
    operatives: "1", trade: "Electrician", jobType: "", customJobType: "", jobDesc: "",
    // Step 4
    supervisorName: "", firstAider: "", hospital: "", fireAssembly: "Designated point as per site induction", firstAidLoc: "Site Vehicle / Office",
    welfare: "Client WC facilities",
    // Step 5
    extraNotes: "", accessCode: ""
  });
  
  const [hazards, setHazards] = useState<string[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // --- VALIDATION LOGIC ---
  const validateStep = (currentStep: number) => {
    if (currentStep === 1) {
        if (!formData.companyName || !formData.officeAddress || !formData.contactName) {
            alert("⚠️ Please fill in all Company Details to proceed.");
            return false;
        }
    }
    if (currentStep === 2) {
        if (!formData.clientName || !formData.siteAddress || !formData.duration) {
            alert("⚠️ Please fill in Client Name, Site Address, and Duration.");
            return false;
        }
    }
    if (currentStep === 3) {
        if (!formData.jobType || !formData.jobDesc) {
            alert("⚠️ Please select a Job Type and ensure Description is filled.");
            return false;
        }
        if (formData.jobType === "Other (Custom)" && !formData.customJobType) {
            alert("⚠️ Please specify your Custom Job Title.");
            return false;
        }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep(step + 1);
  };

  // --- SMART LOGIC ---
  useEffect(() => {
    // @ts-ignore
    const tradeData = TRADES[formData.trade];
    if (tradeData && formData.jobType) {
      const jobObj = tradeData.jobs.find((j: any) => j.name === formData.jobType);
      if (jobObj) {
        // @ts-ignore
        const clusterData = tradeData.clusters[jobObj.cluster];
        if (clusterData) {
          setFormData(prev => ({ ...prev, jobDesc: prev.jobDesc || "Standard procedures for this task." }));
          setHazards(prev => [...new Set([...prev, ...clusterData.hazards])]);
          setQuestions(clusterData.questions || []);
        }
      }
    }
  }, [formData.jobType, formData.trade]);

  const handleInput = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));
  const toggleHazard = (h: string) => setHazards(prev => prev.includes(h) ? prev.filter(i => i !== h) : [...prev, h]);

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

  const createPDF = (data: any) => {
    const doc = new jsPDF();
    const totalPagesExp = "{total_pages_count_string}";
    
    const drawHeader = (doc: any) => {
        doc.setFillColor(20, 20, 20);
        doc.rect(0, 0, 210, 30, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18); doc.setFont("helvetica", "bold");
        doc.text("RAMS DOCUMENT", 14, 12);
        doc.setFontSize(9); doc.setFont("helvetica", "normal");
        doc.text(`Ref: ${formData.projectRef || "N/A"} | Date: ${formData.startDate}`, 14, 22);
        doc.setFontSize(8); doc.text(formData.companyName.toUpperCase(), 195, 12, { align: 'right' });
    };

    const drawFooter = (doc: any, pageNumber: number) => {
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(8); doc.setTextColor(150);
        doc.text(`RAMS Sorted | Page ${pageNumber}`, 14, pageHeight - 10);
    };

    // --- PAGE 1 ---
    drawHeader(doc);
    doc.setTextColor(0);
    let y = 40;

    // Contacts Table
    doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.text("1. Project Directory", 14, y); y += 6;
    autoTable(doc, {
        startY: y,
        head: [['Role', 'Name', 'Details']],
        body: [
            ['Contractor', formData.companyName, `${formData.officeAddress}\n${formData.contactPhone}`],
            ['Client', formData.clientName, formData.siteAddress],
            ['Competent Person', formData.contactName, 'Site Supervisor'],
            ['Emergency', 'General Services', '999 / 112'],
        ],
        theme: 'grid',
        headStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold' },
        styles: { fontSize: 9 }
    });
    // @ts-ignore
    y = doc.lastAutoTable.finalY + 10;

    // Site Logistics
    doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.text("2. Site Logistics & Emergency", 14, y); y += 6;
    autoTable(doc, {
        startY: y,
        body: [
            ['Work Scope', `${formData.trade} - ${formData.jobType}`],
            ['Location', formData.siteAddress],
            ['Duration', `${formData.startDate} (${formData.duration})`],
            ['Operatives', formData.operatives],
            ['First Aid', `${formData.firstAider} (Loc: ${formData.firstAidLoc})`],
            ['Hospital', formData.hospital],
            ['Fire Assembly', formData.fireAssembly],
            ['Welfare', formData.welfare],
        ],
        theme: 'plain',
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
        styles: { fontSize: 9 }
    });
    // @ts-ignore
    y = doc.lastAutoTable.finalY + 10;

    // Scope Text
    doc.setFont("helvetica", "bold"); doc.text("Scope Description:", 14, y); y+=6;
    doc.setFont("helvetica", "normal"); doc.setFontSize(9);
    const summary = doc.splitTextToSize(data.summary || "", 180);
    doc.text(summary, 14, y);
    y += summary.length * 4 + 10;

    // --- PAGE 2: RISK ASSESSMENT ---
    doc.addPage(); drawHeader(doc); y = 40;
    doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.text("3. Risk Assessment", 14, y); y += 6;
    autoTable(doc, {
        startY: y,
        head: [['Hazard', 'Who', 'Control Measures', 'Risk Rating']],
        body: data.risks ? data.risks.map((r: any) => [r.hazard, r.who, r.control, r.risk_rating]) : [],
        theme: 'grid',
        headStyles: { fillColor: [0, 0, 0], textColor: 255 },
        styles: { fontSize: 8, cellPadding: 3 },
        columnStyles: { 2: { cellWidth: 80 } }
    });
    // @ts-ignore
    y = doc.lastAutoTable.finalY + 10;

    // COSHH (Conditional)
    if (hazards.some(h => ["dust_fumes", "silica_dust", "chemical_coshh", "asbestos", "biological"].includes(h))) {
        if (y > 230) { doc.addPage(); drawHeader(doc); y=40; }
        doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.text("4. COSHH Assessment", 14, y); y+=6;
        autoTable(doc, {
            startY: y,
            head: [['Substance', 'Hazard', 'Control Measures', 'Disposal']],
            body: data.coshh ? data.coshh.map((c:any) => [c.substance, c.risk, c.control, c.disposal]) : [['Dust/Debris', 'Inhalation', 'FFP3 Mask / Damp down', 'Site Skip']],
            theme: 'grid',
            styles: { fontSize: 8 }
        });
        // @ts-ignore
        y = doc.lastAutoTable.finalY + 10;
    }

    // --- PAGE 3: METHOD ---
    doc.addPage(); drawHeader(doc); y = 40;
    doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.text("5. Method Statement", 14, y); y += 8;
    doc.setFontSize(9); doc.setFont("helvetica", "italic");
    doc.text("Requirement: All operatives must receive a toolbox talk based on this RAMS before starting.", 14, y);
    y += 8; doc.setFont("helvetica", "normal");

    if(data.method_steps) {
        data.method_steps.forEach((step: string) => {
            if(y > 270) { doc.addPage(); drawHeader(doc); y=40; }
            const isHeading = step.toUpperCase() === step || step.trim().endsWith(":");
            doc.setFont("helvetica", isHeading ? "bold" : "normal");
            const text = doc.splitTextToSize(step, 180);
            doc.text(text, 14, y);
            y += text.length * 4 + 2;
        });
    }

    // --- PAGE 4: SIGN OFF ---
    doc.addPage(); drawHeader(doc); y = 40;
    doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.text("6. Operative Acceptance & Sign-off", 14, y); y += 10;
    doc.setFontSize(9); doc.setFont("helvetica", "normal");
    doc.text("I have read and understood the risks and method statement provided.", 14, y); y+=10;

    autoTable(doc, {
        startY: y,
        head: [['Print Name', 'Company', 'Signature', 'Date']],
        body: [['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', '']],
        theme: 'grid',
        styles: { minCellHeight: 15 }
    });
    // @ts-ignore
    y = doc.lastAutoTable.finalY + 20;

    doc.setDrawColor(0); doc.setLineWidth(0.3);
    doc.rect(14, y, 180, 30);
    doc.setFont("helvetica", "bold"); doc.text("Authorisation", 16, y+8);
    doc.setFont("helvetica", "normal");
    doc.text(`Prepared By: ${formData.contactName}`, 16, y+18);
    doc.text("Signature: ______________________", 110, y+18);
    doc.text(`Date: ${formData.startDate}`, 170, y+18);

    // Add Page Numbers
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        drawFooter(doc, i);
    }

    doc.save(`RAMS_${formData.companyName.replace(/ /g,'_')}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-black pb-20">
      <nav className="bg-white border-b py-4 px-6 sticky top-0 z-50 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight"><ShieldCheck className="w-7 h-7"/> RAMS Sorted</div>
        <div className="text-xs font-bold bg-black text-white px-4 py-1.5 rounded-full uppercase tracking-wider">Step {step} / 3</div>
      </nav>

      <main className="max-w-4xl mx-auto py-10 px-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          
          {/* STEP 1: COMPANY & CLIENT */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in">
              <div className="border-b pb-4"><h2 className="text-2xl font-bold flex items-center gap-3"><Briefcase className="w-6 h-6"/> Company & Client Details</h2><p className="text-gray-500 mt-1">Enter the legal details for the document header.</p></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-sm font-bold text-gray-700 mb-1">Your Company Name <span className="text-red-500">*</span></label><input className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black outline-none" value={formData.companyName} onChange={e => handleInput("companyName", e.target.value)} /></div>
                <div><label className="block text-sm font-bold text-gray-700 mb-1">Competent Person <span className="text-red-500">*</span></label><input className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black outline-none" value={formData.contactName} onChange={e => handleInput("contactName", e.target.value)} /></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AddressSearch label="Office Address" required={true} tooltip="Your registered business address." value={formData.officeAddress} onChange={(val:string) => handleInput("officeAddress", val)} />
                <div><label className="block text-sm font-bold text-gray-700 mb-1">Contact Phone</label><input className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black outline-none" value={formData.contactPhone} onChange={e => handleInput("contactPhone", e.target.value)} /></div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-bold text-gray-700 mb-1">Client / Contractor Name <span className="text-red-500">*</span></label><input className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black outline-none" value={formData.clientName} onChange={e => handleInput("clientName", e.target.value)} /></div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-1">Project Reference</label><input className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black outline-none" placeholder="e.g. P-1234" value={formData.projectRef} onChange={e => handleInput("projectRef", e.target.value)} /></div>
                  </div>
                  <AddressSearch label="Site Address" required={true} tooltip="The actual location where work is taking place." value={formData.siteAddress} onChange={(val:string) => handleInput("siteAddress", val)} />
              </div>

              <button onClick={nextStep} className="w-full bg-black hover:bg-gray-800 text-white py-4 rounded-xl font-bold text-lg flex justify-center gap-2 items-center transition-all shadow-md">Next Step <ArrowRight className="w-5 h-5"/></button>
            </div>
          )}

          {/* STEP 2: SCOPE */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-2xl font-bold flex items-center gap-3 border-b pb-4"><FileText className="w-6 h-6"/> Scope & Logistics</h2>
              
              <div className="grid grid-cols-3 gap-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Start Date</label><input type="date" className="w-full border border-gray-300 rounded-lg p-3 bg-white" value={formData.startDate} onChange={e => handleInput("startDate", e.target.value)} /></div>
                <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Duration</label><input className="w-full border border-gray-300 rounded-lg p-3 bg-white" placeholder="e.g. 2 Days" value={formData.duration} onChange={e => handleInput("duration", e.target.value)} /></div>
                <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Operatives</label><input type="number" className="w-full border border-gray-300 rounded-lg p-3 bg-white" value={formData.operatives} onChange={e => handleInput("operatives", e.target.value)} /></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-bold text-gray-700 mb-1">Trade</label><select className="w-full border border-gray-300 rounded-lg p-3 bg-white text-lg" value={formData.trade} onChange={e => handleInput("trade", e.target.value)}>{Object.keys(TRADES).map(t => <option key={t}>{t}</option>)}</select></div>
                  {/* @ts-ignore */}
                  <div><label className="block text-sm font-bold text-gray-700 mb-1">Job Type</label><select className="w-full border border-gray-300 rounded-lg p-3 bg-white text-lg" value={formData.jobType} onChange={e => handleInput("jobType", e.target.value)}><option value="">-- Select --</option>{TRADES[formData.trade].jobs.map((j:any) => <option key={j.name}>{j.name}</option>)}</select></div>
              </div>

              {formData.jobType === "Other (Custom)" && (
                <div className="animate-in fade-in"><label className="text-sm font-bold text-black">Custom Job Title</label><input className="w-full border-2 border-black rounded-lg p-3" placeholder="e.g. Jacuzzi Installation" value={formData.customJobType} onChange={e => handleInput("customJobType", e.target.value)} /></div>
              )}

              {/* DYNAMIC QUESTIONS */}
              {questions.length > 0 && (
                  <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                      <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wide mb-4">Safety Checks for this Job</h4>
                      {questions.map((q:any) => (
                          <div key={q.id} className="flex justify-between items-center mb-3 last:mb-0 bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                              <span className="text-sm text-gray-800 font-medium mr-4">{q.label}</span>
                              <div className="flex gap-2">
                                  <button onClick={() => setAnswers({...answers, [q.id]: "Yes"})} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${answers[q.id] === "Yes" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Yes</button>
                                  <button onClick={() => setAnswers({...answers, [q.id]: "No"})} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${answers[q.id] === "No" ? "bg-gray-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>No</button>
                              </div>
                          </div>
                      ))}
                  </div>
              )}

              <div><label className="block text-sm font-bold text-gray-700 mb-1">Detailed Description of Works</label><textarea className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-black outline-none" value={formData.jobDesc} onChange={e => handleInput("jobDesc", e.target.value)} /></div>
              
              <div className="flex gap-4 pt-4">
                  <button onClick={() => setStep(1)} className="w-1/3 border border-gray-300 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-50">Back</button>
                  <button onClick={nextStep} className="w-2/3 bg-black hover:bg-gray-800 text-white py-4 rounded-xl font-bold text-lg flex justify-center gap-2 items-center shadow-md">Next Step <ArrowRight className="w-5 h-5"/></button>
              </div>
            </div>
          )}

          {/* STEP 3: SAFETY */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-2xl font-bold flex items-center gap-3 border-b pb-4"><AlertTriangle className="w-6 h-6"/> Safety & Hazards</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-red-50 p-6 rounded-xl border border-red-100">
                 <div className="col-span-1 md:col-span-2 flex items-center gap-2 text-red-800 font-bold text-sm uppercase tracking-wide"><Ambulance className="w-4 h-4"/> Emergency Arrangements</div>
                 <div><label className="text-xs font-bold uppercase text-gray-500 mb-1">Site Supervisor</label><input className="w-full border border-red-200 rounded-lg p-3 bg-white" placeholder="Name" value={formData.supervisorName} onChange={e => handleInput("supervisorName", e.target.value)} /></div>
                 <div><label className="text-xs font-bold uppercase text-gray-500 mb-1">First Aider</label><input className="w-full border border-red-200 rounded-lg p-3 bg-white" placeholder="Name" value={formData.firstAider} onChange={e => handleInput("firstAider", e.target.value)} /></div>
                 <div><label className="text-xs font-bold uppercase text-gray-500 mb-1">First Aid Kit Location</label><input className="w-full border border-red-200 rounded-lg p-3 bg-white" value={formData.firstAidLoc} onChange={e => handleInput("firstAidLoc", e.target.value)} /></div>
                 <div><label className="text-xs font-bold uppercase text-gray-500 mb-1">Fire Assembly Point</label><input className="w-full border border-red-200 rounded-lg p-3 bg-white" value={formData.fireAssembly} onChange={e => handleInput("fireAssembly", e.target.value)} /></div>
                 <div className="col-span-1 md:col-span-2"><label className="text-xs font-bold uppercase text-gray-500 mb-1">Nearest Hospital (A&E)</label><input className="w-full border border-red-200 rounded-lg p-3 bg-white" placeholder="Hospital Name & Postcode" value={formData.hospital} onChange={e => handleInput("hospital", e.target.value)} /></div>
                 <div className="col-span-1 md:col-span-2"><label className="text-xs font-bold uppercase text-gray-500 mb-1">Welfare Facilities</label><input className="w-full border border-red-200 rounded-lg p-3 bg-white" value={formData.welfare} onChange={e => handleInput("welfare", e.target.value)} /></div>
              </div>

              <div className="space-y-6">
                 {Object.entries(HAZARD_GROUPS).map(([group, items]) => (
                   <div key={group} className="border border-gray-200 rounded-xl p-5 shadow-sm">
                      <h4 className="text-sm font-bold uppercase text-gray-800 mb-3 flex items-center gap-2">
                        {group === "High Risk" && <Flame className="w-4 h-4 text-red-500"/>}
                        {group}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {items.map(h => (
                           <button key={h} onClick={() => toggleHazard(h)} className={`text-xs py-2 px-4 rounded-lg border font-medium transition-all duration-200 ${hazards.includes(h) ? 'bg-black text-white border-black shadow-md transform scale-105' : 'bg-white text-gray-600 hover:bg-gray-100 border-gray-200'}`}>
                             {/* @ts-ignore */}
                             {HAZARD_DATA[h]?.label || h}
                           </button>
                        ))}
                      </div>
                   </div>
                 ))}
              </div>

              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                <label className="text-sm font-bold text-yellow-900 flex items-center gap-2 mb-2"><FileText className="w-4 h-4"/> Specific Site Notes / Restrictions</label>
                <textarea className="w-full border border-yellow-300 rounded-lg p-3 text-sm h-24 bg-white" placeholder="e.g. Access via rear gate only. No noisy works after 3pm." value={formData.extraNotes} onChange={e => handleInput("extraNotes", e.target.value)} />
              </div>

              <div className="pt-6 border-t mt-6">
                 <div className="mb-4 text-center">
                    <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">Enter Pro Access Code</label>
                    <input type="password" placeholder="PRO2025" className="w-40 border border-gray-300 rounded-md p-2 font-mono text-center tracking-widest" value={formData.accessCode} onChange={e => handleInput("accessCode", e.target.value)} />
                 </div>
                 
                 <div className="flex gap-4">
                    <button onClick={() => setStep(2)} className="w-1/3 border border-gray-300 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-50">Back</button>
                    <button onClick={generateRAMS} disabled={loading} className="w-2/3 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold flex justify-center gap-3 items-center shadow-lg text-lg transition-all">
                        {loading ? <Loader2 className="animate-spin w-6 h-6"/> : <ShieldCheck className="w-6 h-6"/>} {loading ? "Generating Document..." : "Create RAMS PDF"}
                    </button>
                 </div>
              </div>

              {generated && (
                <div className="bg-green-50 p-6 rounded-xl border border-green-200 flex items-center gap-4 text-green-900 mt-6 shadow-sm animate-in zoom-in-95 duration-300">
                    <CheckCircle className="w-8 h-8 text-green-600"/> 
                    <div>
                        <p className="font-bold text-lg">Success!</p>
                        <p className="text-sm text-green-700">Your professional RAMS PDF has been downloaded.</p>
                    </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}