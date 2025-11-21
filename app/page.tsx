"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Loader2, CheckCircle, ShieldCheck, ArrowRight, MapPin, Briefcase, AlertTriangle, User, Clock, Users, Ambulance, FileText } from "lucide-react";
import { TRADES, HAZARD_GROUPS } from "./lib/constants";

// --- ADDRESS SEARCH COMPONENT (UNCHANGED) ---
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
  
  // --- COMPREHENSIVE DATA STATE ---
  const [formData, setFormData] = useState({
    // Step 1: Company
    companyName: "", officeAddress: "", contactName: "", contactPhone: "",
    // Step 2: Job
    clientName: "", projectRef: "", siteAddress: "", startDate: new Date().toISOString().split('T')[0], duration: "1 Day",
    // Step 3: Logistics
    operatives: "1", trade: "Electrician", jobType: "", customJobType: "", jobDesc: "",
    // Step 4: Emergency
    firstAider: "", hospital: "", welfare: "Client WC",
    // Step 5: Specifics
    extraNotes: "", accessCode: ""
  });
  
  const [hazards, setHazards] = useState<string[]>([]);

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
    
    // HEADER
    doc.setFillColor(0, 0, 0); doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22); doc.setFont("helvetica", "bold"); doc.text("RAMS DOCUMENT", 14, 18);
    doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.text("Risk Assessment & Method Statement", 14, 25);
    
    // INFO GRID
    doc.setTextColor(0, 0, 0);
    let y = 50;
    
    // Row 1: Parties
    doc.setFont("helvetica", "bold"); doc.text("CONTRACTOR", 14, y); doc.text("CLIENT / PROJECT", 110, y);
    y += 5;
    doc.setFont("helvetica", "normal"); doc.setFontSize(9);
    doc.text(`${formData.companyName}`, 14, y); doc.text(`${formData.clientName}`, 110, y);
    y += 5;
    doc.text(`Lead: ${formData.contactName} (${formData.contactPhone})`, 14, y); doc.text(`Ref: ${formData.projectRef}`, 110, y);
    y += 5;
    
    const offAddr = doc.splitTextToSize(formData.officeAddress, 80);
    doc.text(offAddr, 14, y);
    const siteAddr = doc.splitTextToSize(formData.siteAddress, 80);
    doc.text(siteAddr, 110, y);
    y += Math.max(offAddr.length, siteAddr.length) * 4 + 10;

    // Row 2: Logistics Line
    doc.setDrawColor(200); doc.line(14, y, 196, y); y += 5;
    doc.setFont("helvetica", "bold");
    doc.text(`Start Date: ${formData.startDate}`, 14, y);
    doc.text(`Duration: ${formData.duration}`, 60, y);
    doc.text(`Operatives: ${formData.operatives}`, 110, y);
    doc.text(`First Aider: ${formData.firstAider}`, 150, y);
    y += 10;

    // 1. SCOPE
    doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.text("1. Scope of Works", 14, y);
    y += 6; doc.setFontSize(9); doc.setFont("helvetica", "normal");
    const summary = doc.splitTextToSize(data.summary || "", 180);
    doc.text(summary, 14, y);
    y += summary.length * 4 + 10;

    // 2. RISK TABLE
    doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.text("2. Risk Assessment", 14, y);
    y += 5;
    autoTable(doc, {
      startY: y,
      head: [['Hazard', 'Who', 'Init Risk', 'Controls', 'Res Risk']],
      body: data.risks ? data.risks.map((r: any) => [r.hazard, r.who, r.initial_risk, r.control, r.residual_risk]) : [],
      theme: 'grid',
      headStyles: { fillColor: [0, 0, 0], fontSize: 8 },
      styles: { fontSize: 8 },
      columnStyles: { 3: { cellWidth: 70 } }
    });
    // @ts-ignore
    y = doc.lastAutoTable.finalY + 15;

    // 3. METHOD
    if(y > 250) { doc.addPage(); y=20; }
    doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.text("3. Method Statement", 14, y);
    y += 7; doc.setFontSize(9); doc.setFont("helvetica", "normal");
    if(data.method_steps) {
      data.method_steps.forEach((step: string, i: number) => {
        if(y > 270) { doc.addPage(); y=20; }
        const text = doc.splitTextToSize(`${i+1}. ${step}`, 180);
        doc.text(text, 14, y);
        y += text.length * 4 + 2;
      });
    }

    // 4. EMERGENCY & PPE
    y += 10; if(y > 250) { doc.addPage(); y=20; }
    doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.text("4. Site Arrangements", 14, y);
    y += 6; doc.setFontSize(9); doc.setFont("helvetica", "normal");
    doc.text(`Nearest Hospital: ${formData.hospital}`, 14, y); y+=5;
    doc.text(`Welfare Facilities: ${formData.welfare}`, 14, y); y+=5;
    doc.text(`PPE Required: ${data.ppe ? data.ppe.join(", ") : "Standard PPE"}`, 14, y); y+=10;

    // 5. EXTRA NOTES
    if(formData.extraNotes) {
        doc.setFont("helvetica", "bold"); doc.text("5. Specific Site Notes", 14, y); y+=6;
        doc.setFont("helvetica", "normal");
        const notes = doc.splitTextToSize(formData.extraNotes, 180);
        doc.text(notes, 14, y);
        y += notes.length * 4 + 10;
    }

    // SIGN OFF
    if(y > 250) { doc.addPage(); y=20; }
    doc.setDrawColor(0); doc.setLineWidth(0.5);
    doc.rect(14, y, 180, 30);
    doc.text("I confirm I have read and understood the method statement and risks above.", 16, y+8);
    doc.text("Operative Name: __________________   Signature: __________________   Date: ________", 16, y+22);

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
          
          {/* --- STEP 1: THE BASICS --- */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-2"><Briefcase className="w-5 h-5"/> Company & Client</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Your Company</label><input className="w-full border rounded-md p-2 text-sm" value={formData.companyName} onChange={e => handleInput("companyName", e.target.value)} /></div>
                <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Competent Person</label><input className="w-full border rounded-md p-2 text-sm" value={formData.contactName} onChange={e => handleInput("contactName", e.target.value)} /></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <AddressSearch label="Your Office Address" value={formData.officeAddress} onChange={(val:string) => handleInput("officeAddress", val)} />
                <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Contact Phone</label><input className="w-full border rounded-md p-2 text-sm" value={formData.contactPhone} onChange={e => handleInput("contactPhone", e.target.value)} /></div>
              </div>

              <hr className="border-gray-100"/>

              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Client Name</label><input className="w-full border rounded-md p-2 text-sm" value={formData.clientName} onChange={e => handleInput("clientName", e.target.value)} /></div>
                <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Project Ref</label><input className="w-full border rounded-md p-2 text-sm" value={formData.projectRef} onChange={e => handleInput("projectRef", e.target.value)} /></div>
              </div>
              <AddressSearch label="Site Address (Where works happen)" value={formData.siteAddress} onChange={(val:string) => handleInput("siteAddress", val)} />

              <button onClick={() => setStep(2)} className="w-full bg-black text-white py-3 rounded-md font-bold mt-4 flex justify-center gap-2">Next Step <ArrowRight/></button>
            </div>
          )}

          {/* --- STEP 2: LOGISTICS & SCOPE --- */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-2"><Clock className="w-5 h-5"/> Logistics & Scope</h2>
              
              <div className="grid grid-cols-3 gap-4 bg-blue-50 p-4 rounded-md border border-blue-100">
                <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Start Date</label><input type="date" className="w-full border rounded-md p-2 text-sm bg-white" value={formData.startDate} onChange={e => handleInput("startDate", e.target.value)} /></div>
                <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Duration</label><input className="w-full border rounded-md p-2 text-sm bg-white" placeholder="e.g. 3 Days" value={formData.duration} onChange={e => handleInput("duration", e.target.value)} /></div>
                <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Operatives</label><input type="number" className="w-full border rounded-md p-2 text-sm bg-white" value={formData.operatives} onChange={e => handleInput("operatives", e.target.value)} /></div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Trade</label>
                <select className="w-full border rounded-md p-2 text-sm bg-white" value={formData.trade} onChange={e => handleInput("trade", e.target.value)}>
                  {Object.keys(TRADES).map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Job Type</label>
                <select className="w-full border rounded-md p-2 text-sm bg-white" value={formData.jobType} onChange={e => handleInput("jobType", e.target.value)}>
                  <option value="">-- Select --</option>
                  {/* @ts-ignore */}
                  {TRADES[formData.trade].jobs.map((j:string) => <option key={j}>{j}</option>)}
                </select>
              </div>

              {/* THE "OTHER" BOX */}
              {formData.jobType === "Other" && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="block text-xs font-bold uppercase text-black mb-1">Custom Job Title</label>
                  <input className="w-full border-2 border-black rounded-md p-2 text-sm" placeholder="Type specific job title..." value={formData.customJobType} onChange={e => handleInput("customJobType", e.target.value)} />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Detailed Description</label>
                <textarea className="w-full border rounded-md p-2 text-sm h-24" placeholder="Describe the exact works..." value={formData.jobDesc} onChange={e => handleInput("jobDesc", e.target.value)} />
              </div>

              <div className="flex gap-3"><button onClick={() => setStep(1)} className="w-1/3 border py-3 rounded-md font-bold">Back</button><button onClick={() => setStep(3)} className="w-2/3 bg-black text-white py-3 rounded-md font-bold flex justify-center gap-2">Next <ArrowRight/></button></div>
            </div>
          )}

          {/* --- STEP 3: SAFETY & FILTERS --- */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-2"><AlertTriangle className="w-5 h-5"/> Safety & Specifics</h2>
              
              {/* Emergency Section */}
              <div className="grid grid-cols-2 gap-4 bg-red-50 p-4 rounded-md border border-red-100">
                 <div className="col-span-2 flex items-center gap-2 text-red-800 font-bold text-sm"><Ambulance className="w-4 h-4"/> Emergency Arrangements</div>
                 <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">First Aider Name</label><input className="w-full border rounded-md p-2 text-sm bg-white" value={formData.firstAider} onChange={e => handleInput("firstAider", e.target.value)} /></div>
                 <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Nearest A&E / Hospital</label><input className="w-full border rounded-md p-2 text-sm bg-white" placeholder="Hospital Name & Postcode" value={formData.hospital} onChange={e => handleInput("hospital", e.target.value)} /></div>
                 <div className="col-span-2"><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Welfare Facilities</label><input className="w-full border rounded-md p-2 text-sm bg-white" value={formData.welfare} onChange={e => handleInput("welfare", e.target.value)} /></div>
              </div>

              {/* Hazards Accordion */}
              <div className="space-y-4">
                 {Object.entries(HAZARD_GROUPS).map(([group, items]) => (
                   <div key={group} className="border rounded-md p-3">
                      <h4 className="text-xs font-bold uppercase text-black mb-2">{group}</h4>
                      <div className="flex flex-wrap gap-2">
                        {items.map(h => (
                           <button key={h} onClick={() => toggleHazard(h)} className={`text-xs py-1.5 px-3 rounded-md border transition-all ${hazards.includes(h) ? 'bg-black text-white border-black' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>{h}</button>
                        ))}
                      </div>
                   </div>
                 ))}
              </div>

              {/* Extra Details Box */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1 flex items-center gap-2"><FileText className="w-4 h-4"/> Specific Site Notes / Restrictions</label>
                <textarea className="w-full border rounded-md p-2 text-sm h-20" placeholder="e.g. Access via rear alley only. No noisy works between 12-2pm." value={formData.extraNotes} onChange={e => handleInput("extraNotes", e.target.value)} />
              </div>

              <div className="pt-4 border-t mt-4">
                 <input type="password" placeholder="PRO2025" className="w-full border rounded-md p-2 mb-4 font-mono text-center tracking-widest" value={formData.accessCode} onChange={e => handleInput("accessCode", e.target.value)} />
                 <div className="flex gap-3">
                    <button onClick={() => setStep(2)} className="w-1/3 border py-3 rounded-md font-bold">Back</button>
                    <button onClick={generateRAMS} disabled={loading} className="w-2/3 bg-green-600 text-white py-3 rounded-md font-bold flex justify-center gap-2 items-center">
                        {loading ? <Loader2 className="animate-spin"/> : <ShieldCheck/>} Create Document
                    </button>
                 </div>
              </div>

              {generated && <div className="bg-green-50 p-4 rounded-md border border-green-200 flex items-center gap-3 text-green-800 mt-4"><CheckCircle/> <b>Success!</b> PDF Downloaded.</div>}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}