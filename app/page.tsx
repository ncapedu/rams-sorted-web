"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Loader2, CheckCircle, ShieldCheck, ArrowRight, MapPin, Briefcase, AlertTriangle, Lock, Search, User, Building, Info } from "lucide-react";
import { TRADES, HAZARD_DATA } from "./lib/constants";

// --- ADDRESS SEARCH ---
function AddressSearch({ label, value, onChange }: any) {
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
      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">{label}</label>
      <div className="relative">
        <input className="w-full border rounded-md p-2 text-sm" placeholder="Start typing..." value={query} onChange={(e) => searchAddress(e.target.value)} />
        <MapPin className="w-4 h-4 absolute right-3 top-2.5 text-gray-400" />
      </div>
      {showDropdown && results.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
          {results.map((r: any, i) => (
            <li key={i} onClick={() => { setQuery(r.display_name); onChange(r.display_name); setShowDropdown(false); }} className="p-2 hover:bg-gray-100 cursor-pointer text-xs border-b">
              {r.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Home() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  
  const [formData, setFormData] = useState({
    companyName: "", officeAddress: "", contactName: "", contactPhone: "",
    clientName: "", projectRef: "", siteAddress: "", startDate: new Date().toISOString().split('T')[0], duration: "1 Day",
    operatives: "1", trade: "Electrician", jobType: "", customJobType: "", jobDesc: "",
    firstAider: "", hospital: "", welfare: "Client WC",
    extraNotes: "", accessCode: ""
  });
  
  const [hazards, setHazards] = useState<string[]>([]);

  // --- SMART CLUSTER LOADING ---
  useEffect(() => {
    // @ts-ignore
    const tradeInfo = TRADES[formData.trade];
    if (tradeInfo && formData.jobType) {
      const jobObj = tradeInfo.jobs.find((j:any) => j.name === formData.jobType);
      if (jobObj && jobObj.cluster) {
        // @ts-ignore
        const clusterData = tradeInfo.clusters[jobObj.cluster];
        if (clusterData) {
          setFormData(prev => ({ ...prev, jobDesc: clusterData.method.join("\n") })); // Pre-fill method outline
          // Pre-select hazards from cluster, keeping existing ones
          setHazards(prev => [...new Set([...prev, ...clusterData.hazards])]);
        }
      }
    }
  }, [formData.jobType, formData.trade]);

  const handleInput = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleHazard = (h: string) => {
    setHazards(prev => prev.includes(h) ? prev.filter(i => i !== h) : [...prev, h]);
  };

  const generateRAMS = async () => {
    if (formData.accessCode !== "PRO2025") return alert("❌ Invalid Access Code.");
    if (!formData.companyName || !formData.clientName) return alert("⚠️ Missing Company or Client Name.");
    
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, hazards }),
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
    const margin = 14;
    const pageWidth = 210;
    const maxTextWidth = pageWidth - (margin * 2);
    
    // --- HEADER ---
    // Clean, professional header. No massive block.
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20); doc.setFont("helvetica", "bold"); 
    doc.text("RISK ASSESSMENT & METHOD STATEMENT", margin, 20);
    
    doc.setLineWidth(0.5); doc.setDrawColor(0, 0, 0);
    doc.line(margin, 25, pageWidth - margin, 25);

    let y = 35;

    // --- PROJECT BLOCK ---
    doc.setFontSize(10);
    
    // Left Column (Contractor)
    doc.setFont("helvetica", "bold"); doc.text("CONTRACTOR DETAILS", margin, y);
    doc.setFont("helvetica", "normal"); y += 5;
    doc.text(formData.companyName, margin, y); y += 5;
    const officeAddr = doc.splitTextToSize(formData.officeAddress, 80);
    doc.text(officeAddr, margin, y);
    y += (officeAddr.length * 4) + 2;
    doc.text(`Lead: ${formData.contactName} (${formData.contactPhone})`, margin, y);

    // Right Column (Client/Site) - Calculate Y independently then sync
    let rightY = 35;
    doc.setFont("helvetica", "bold"); doc.text("PROJECT DETAILS", 110, rightY);
    rightY += 5;
    doc.setFont("helvetica", "normal");
    doc.text(`Client: ${formData.clientName}`, 110, rightY); rightY += 5;
    const siteAddr = doc.splitTextToSize(formData.siteAddress, 80);
    doc.text(siteAddr, 110, rightY);
    rightY += (siteAddr.length * 4) + 2;
    doc.text(`Ref: ${formData.projectRef} | Date: ${formData.startDate}`, 110, rightY);

    // Sync Y to lowest point
    y = Math.max(y, rightY) + 10;

    // --- LOGISTICS LINE ---
    doc.setDrawColor(200); doc.line(margin, y, pageWidth - margin, y); y += 6;
    doc.setFont("helvetica", "bold");
    doc.text(`Duration: ${formData.duration}   |   Operatives: ${formData.operatives}   |   First Aider: ${formData.firstAider}`, margin, y);
    y += 10;

    // 1. SCOPE OF WORKS
    doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.text("1. Scope of Works", margin, y);
    y += 6; doc.setFontSize(10); doc.setFont("helvetica", "normal");
    const summary = doc.splitTextToSize(data.summary || "", maxTextWidth);
    doc.text(summary, margin, y);
    y += summary.length * 5 + 10;

    // 2. RISK ASSESSMENT TABLE
    doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.text("2. Risk Assessment", margin, y);
    y += 5;
    autoTable(doc, {
      startY: y,
      head: [['Hazard', 'Who is at Risk', 'Controls', 'Risk Rating']],
      body: data.risks ? data.risks.map((r: any) => [
        r.hazard, 
        r.who, 
        r.control, 
        `${r.initial_risk} -> ${r.residual_risk}`
      ]) : [],
      theme: 'grid',
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.1 },
      styles: { fontSize: 9, textColor: [0, 0, 0], lineColor: [200, 200, 200] },
      columnStyles: { 2: { cellWidth: 80 } } // Wide column for controls
    });
    // @ts-ignore
    y = doc.lastAutoTable.finalY + 15;

    // 3. METHOD STATEMENT
    if(y > 250) { doc.addPage(); y=20; }
    doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.text("3. Method Statement", margin, y);
    y += 8; doc.setFontSize(10); doc.setFont("helvetica", "normal");
    
    if(data.method_steps) {
      data.method_steps.forEach((step: string, i: number) => {
        if(y > 275) { doc.addPage(); y=20; }
        const text = doc.splitTextToSize(`${i+1}. ${step}`, maxTextWidth);
        doc.text(text, margin, y);
        y += text.length * 5 + 3;
      });
    }

    // 4. SITE ARRANGEMENTS (COSHH / EMERGENCY)
    y += 5; if(y > 250) { doc.addPage(); y=20; }
    doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.text("4. Site & Safety Arrangements", margin, y);
    y += 8; doc.setFontSize(10); doc.setFont("helvetica", "normal");
    
    doc.text(`• Nearest Hospital: ${formData.hospital}`, margin, y); y+=6;
    doc.text(`• Welfare: ${formData.welfare}`, margin, y); y+=6;
    
    if (data.ppe) {
        const ppeText = doc.splitTextToSize(`• PPE Required: ${data.ppe.join(", ")}`, maxTextWidth);
        doc.text(ppeText, margin, y);
        y += ppeText.length * 5 + 2;
    }
    
    // Add COSHH note if relevant hazards exist
    if (hazards.some(h => ["dust_fumes", "chemical_coshh", "silica_dust", "asbestos"].includes(h))) {
        const coshhText = doc.splitTextToSize("• COSHH: Relevant COSHH assessments must be attached for all hazardous substances used (e.g., silica dust, solvents, cement).", maxTextWidth);
        doc.text(coshhText, margin, y);
        y += coshhText.length * 5 + 2;
    }

    // 5. SPECIFIC NOTES
    if(formData.extraNotes) {
        y += 5; if(y > 260) { doc.addPage(); y=20; }
        doc.setFont("helvetica", "bold"); doc.text("Specific Site Notes:", margin, y); y+=6;
        doc.setFont("helvetica", "normal");
        const notes = doc.splitTextToSize(formData.extraNotes, maxTextWidth);
        doc.text(notes, margin, y);
        y += notes.length * 5 + 10;
    }

    // SIGN OFF
    y += 10; if(y > 240) { doc.addPage(); y=20; }
    doc.setDrawColor(0); doc.setLineWidth(0.2);
    doc.rect(margin, y, pageWidth - (margin*2), 35);
    
    doc.setFont("helvetica", "bold"); doc.text("Acknowledgement", margin+5, y+8);
    doc.setFont("helvetica", "normal"); doc.setFontSize(9);
    doc.text("I confirm I have read, understood, and will work in accordance with this RAMS.", margin+5, y+14);
    
    doc.text("Name: ________________________", margin+5, y+25);
    doc.text("Signature: ________________________", 110, y+25);
    doc.text("Date: ____________", 170, y+25);

    doc.save(`RAMS_${formData.companyName.replace(/ /g,'_')}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-black pb-20">
      <nav className="bg-white border-b py-4 px-6 sticky top-0 z-50 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 font-bold text-xl"><ShieldCheck className="w-6 h-6"/> RAMS Sorted</div>
        <div className="text-xs font-bold bg-black text-white px-3 py-1 rounded-md">Step {step} / 3</div>
      </nav>

      <main className="max-w-3xl mx-auto py-8 px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-2"><Briefcase className="w-5 h-5"/> Company & Client</h2>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-bold uppercase text-gray-500">Company Name</label><input className="w-full border rounded-md p-2 text-sm" value={formData.companyName} onChange={e => handleInput("companyName", e.target.value)} /></div>
                <div><label className="text-xs font-bold uppercase text-gray-500">Competent Person</label><input className="w-full border rounded-md p-2 text-sm" value={formData.contactName} onChange={e => handleInput("contactName", e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <AddressSearch label="Office Address" value={formData.officeAddress} onChange={(val:string) => handleInput("officeAddress", val)} />
                <div><label className="text-xs font-bold uppercase text-gray-500">Phone</label><input className="w-full border rounded-md p-2 text-sm" value={formData.contactPhone} onChange={e => handleInput("contactPhone", e.target.value)} /></div>
              </div>
              <hr className="border-gray-100"/>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-bold uppercase text-gray-500">Client Name</label><input className="w-full border rounded-md p-2 text-sm" value={formData.clientName} onChange={e => handleInput("clientName", e.target.value)} /></div>
                <div><label className="text-xs font-bold uppercase text-gray-500">Project Ref</label><input className="w-full border rounded-md p-2 text-sm" value={formData.projectRef} onChange={e => handleInput("projectRef", e.target.value)} /></div>
              </div>
              <AddressSearch label="Site Address" value={formData.siteAddress} onChange={(val:string) => handleInput("siteAddress", val)} />
              <button onClick={() => setStep(2)} className="w-full bg-black text-white py-3 rounded-md font-bold mt-4 flex justify-center gap-2">Next Step <ArrowRight/></button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-2"><Briefcase className="w-5 h-5"/> Scope & Logistics</h2>
              <div className="grid grid-cols-3 gap-4 bg-gray-50 p-3 rounded-md border">
                <div><label className="text-xs font-bold uppercase text-gray-500">Start Date</label><input type="date" className="w-full border rounded-md p-2 text-sm bg-white" value={formData.startDate} onChange={e => handleInput("startDate", e.target.value)} /></div>
                <div><label className="text-xs font-bold uppercase text-gray-500">Duration</label><input className="w-full border rounded-md p-2 text-sm bg-white" value={formData.duration} onChange={e => handleInput("duration", e.target.value)} /></div>
                <div><label className="text-xs font-bold uppercase text-gray-500">Operatives</label><input type="number" className="w-full border rounded-md p-2 text-sm bg-white" value={formData.operatives} onChange={e => handleInput("operatives", e.target.value)} /></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-bold uppercase text-gray-500">Trade</label><select className="w-full border rounded-md p-2 text-sm bg-white" value={formData.trade} onChange={e => handleInput("trade", e.target.value)}>{Object.keys(TRADES).map(t => <option key={t}>{t}</option>)}</select></div>
                  {/* @ts-ignore */}
                  <div><label className="text-xs font-bold uppercase text-gray-500">Job Type</label><select className="w-full border rounded-md p-2 text-sm bg-white" value={formData.jobType} onChange={e => handleInput("jobType", e.target.value)}><option value="">-- Select --</option>{TRADES[formData.trade].jobs.map((j:any) => <option key={j.name}>{j.name}</option>)}</select></div>
              </div>

              {formData.jobType === "Other (Custom)" && (
                <div className="animate-in fade-in"><label className="text-xs font-bold uppercase text-black">Custom Job Title</label><input className="w-full border-2 border-black rounded-md p-2 text-sm" placeholder="e.g. Jacuzzi Installation" value={formData.customJobType} onChange={e => handleInput("customJobType", e.target.value)} /></div>
              )}

              <div><label className="text-xs font-bold uppercase text-gray-500">Job Description</label><textarea className="w-full border rounded-md p-2 text-sm h-32" value={formData.jobDesc} onChange={e => handleInput("jobDesc", e.target.value)} /></div>
              <div className="flex gap-3"><button onClick={() => setStep(1)} className="w-1/3 border py-3 rounded-md font-bold">Back</button><button onClick={() => setStep(3)} className="w-2/3 bg-black text-white py-3 rounded-md font-bold">Next <ArrowRight/></button></div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-2"><AlertTriangle className="w-5 h-5"/> Safety & Specifics</h2>
              <div className="grid grid-cols-2 gap-4 bg-red-50 p-4 rounded-md border border-red-100">
                 <div className="col-span-2 flex items-center gap-2 text-red-800 font-bold text-sm"><ShieldCheck className="w-4 h-4"/> Emergency Arrangements</div>
                 <div><label className="text-xs font-bold uppercase text-gray-500">First Aider</label><input className="w-full border rounded-md p-2 text-sm bg-white" value={formData.firstAider} onChange={e => handleInput("firstAider", e.target.value)} /></div>
                 <div><label className="text-xs font-bold uppercase text-gray-500">Nearest A&E</label><input className="w-full border rounded-md p-2 text-sm bg-white" value={formData.hospital} onChange={e => handleInput("hospital", e.target.value)} /></div>
                 <div className="col-span-2"><label className="text-xs font-bold uppercase text-gray-500">Welfare Facilities</label><input className="w-full border rounded-md p-2 text-sm bg-white" value={formData.welfare} onChange={e => handleInput("welfare", e.target.value)} /></div>
              </div>

              <div className="space-y-4">{Object.entries(HAZARD_DATA).map(([key, data]) => (<div key={key} onClick={() => toggleHazard(key)} className={`cursor-pointer p-3 border rounded-md flex items-center gap-3 transition-all ${hazards.includes(key) ? "bg-black text-white border-black" : "bg-white hover:bg-gray-50"}`}><div className={`w-4 h-4 border rounded flex items-center justify-center ${hazards.includes(key) ? "bg-white" : "bg-gray-200"}`}>{hazards.includes(key) && <div className="w-2 h-2 bg-black rounded-full"/>}</div><div><div className="font-bold text-sm">{data.label}</div><div className={`text-xs ${hazards.includes(key) ? "text-gray-300" : "text-gray-500"}`}>{data.risk}</div></div></div>))}</div>

              <div><label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2"><Info className="w-4 h-4"/> Specific Site Notes</label><textarea className="w-full border rounded-md p-2 text-sm h-24" placeholder="e.g. Access via rear gate only. No noisy works after 3pm." value={formData.extraNotes} onChange={e => handleInput("extraNotes", e.target.value)} /></div>

              <div className="pt-4 border-t mt-4"><input type="password" placeholder="PRO2025" className="w-full border rounded-md p-2 mb-4 font-mono text-center tracking-widest" value={formData.accessCode} onChange={e => handleInput("accessCode", e.target.value)} /><div className="flex gap-3"><button onClick={() => setStep(2)} className="w-1/3 border py-3 rounded-md font-bold">Back</button><button onClick={generateRAMS} disabled={loading} className="w-2/3 bg-green-600 text-white py-3 rounded-md font-bold flex justify-center gap-2 items-center">{loading ? <Loader2 className="animate-spin"/> : <ShieldCheck/>} Create Document</button></div></div>
              {generated && <div className="bg-green-50 p-4 rounded-md border border-green-200 flex items-center gap-3 text-green-800 mt-4"><CheckCircle/> <b>Success!</b> PDF Downloaded.</div>}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}