"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 
import { Loader2, CheckCircle, HardHat, ShieldCheck, ArrowRight, MapPin, Briefcase, AlertTriangle, Lock, Search, User, Building } from "lucide-react";
import { TRADES, HAZARD_GROUPS } from "./lib/constants";

// --- COMPONENT: ADDRESS SEARCH (Free UK Lookup) ---
function AddressSearch({ label, value, onChange }: any) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const searchAddress = async (text: string) => {
    setQuery(text);
    onChange(text);
    if (text.length > 3) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${text}&countrycodes=gb&limit=5`);
        const data = await res.json();
        setResults(data);
        setShowDropdown(true);
      } catch (e) { console.error(e); }
    } else { setShowDropdown(false); }
  };

  return (
    <div className="relative">
      <label className="block text-sm font-bold mb-1">{label}</label>
      <div className="relative">
        <input className="w-full border rounded-lg p-3 pl-10" placeholder="Start typing address..." value={query} onChange={(e) => searchAddress(e.target.value)} />
        <Search className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
      </div>
      {showDropdown && results.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border rounded-lg shadow-lg mt-1 max-h-60 overflow-auto">
          {results.map((r: any, i) => (
            <li key={i} onClick={() => { setQuery(r.display_name); onChange(r.display_name); setShowDropdown(false); }} className="p-3 hover:bg-gray-100 cursor-pointer text-sm border-b last:border-0">
              {r.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// --- MAIN WIZARD APP ---
export default function Home() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  
  const [company, setCompany] = useState({ name: "", address: "", contact: "" });
  const [job, setJob] = useState({ client: "", clientType: "Direct", siteAddress: "", trade: "Electrician", type: "", desc: "", date: new Date().toISOString().split('T')[0] });
  const [context, setContext] = useState({ occupied: false, outdoor: false, accessCode: "" });
  const [hazards, setHazards] = useState<string[]>([]);

  // Smart Template Auto-Fill
  useEffect(() => {
    // @ts-ignore
    const tradeData = TRADES[job.trade];
    if (tradeData && job.type) {
      const template = tradeData.jobs.find((j: any) => j.name === job.type);
      if (template) {
        setJob(prev => ({ ...prev, desc: template.desc }));
        setHazards(prev => [...new Set([...prev, ...template.hazards])]);
      }
    }
  }, [job.type, job.trade]);

  const generateRAMS = async () => {
    if (context.accessCode !== "PRO2025") return alert("❌ Invalid Access Code.");
    if (!company.name || !job.siteAddress) return alert("⚠️ Missing Details.");
    
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ company, job, hazards, context }),
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
    
    // 1. Header Strip
    doc.setFillColor(20, 20, 20); 
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22); doc.setFont("helvetica", "bold");
    doc.text("RAMS DOCUMENT", 105, 18, { align: "center" });
    doc.setFontSize(10); doc.setFont("helvetica", "normal");
    doc.text("Risk Assessment & Method Statement", 105, 26, { align: "center" });

    doc.setTextColor(0, 0, 0);
    let y = 50;

    // 2. Info Block
    doc.setFont("helvetica", "bold"); doc.text("CONTRACTOR:", 14, y);
    doc.text("PROJECT DETAILS:", 110, y);
    y += 6;
    
    doc.setFontSize(9); doc.setFont("helvetica", "normal");
    doc.text(company.name, 14, y);
    doc.text(`Client: ${job.client}`, 110, y);
    y += 5;
    doc.text(`Contact: ${company.contact}`, 14, y);
    doc.text(`Date: ${job.date}`, 110, y);
    y += 5;
    
    const offAddr = doc.splitTextToSize(`Office: ${company.address}`, 80);
    doc.text(offAddr, 14, y);
    const siteAddr = doc.splitTextToSize(`Site: ${job.siteAddress}`, 80);
    doc.text(siteAddr, 110, y);
    
    y += Math.max(offAddr.length, siteAddr.length) * 5 + 15;

    // 3. Summary
    doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.text("1. Scope of Works", 14, y);
    y += 6; doc.setFontSize(9); doc.setFont("helvetica", "normal");
    const summary = doc.splitTextToSize(data.summary || "", 180);
    doc.text(summary, 14, y);
    y += summary.length * 5 + 10;

    // 4. Risk Table (Grid)
    doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.text("2. Risk Assessment", 14, y);
    y += 5;
    
    autoTable(doc, {
      startY: y,
      head: [['Hazard', 'Risk To', 'Initial', 'Control Measures', 'Residual']],
      body: data.risks ? data.risks.map((r: any) => [r.hazard, r.who, r.initial_risk, r.control, r.residual_risk]) : [],
      theme: 'grid',
      headStyles: { fillColor: [20, 20, 20], fontSize: 8 },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: { 3: { cellWidth: 70 } }
    });
    // @ts-ignore
    y = doc.lastAutoTable.finalY + 15;

    // 5. Method Statement
    if(y > 240) { doc.addPage(); y=20; }
    doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.text("3. Method Statement", 14, y);
    y += 7; doc.setFontSize(9); doc.setFont("helvetica", "normal");
    
    if(data.method_steps) {
        data.method_steps.forEach((step: string, i: number) => {
            if(y > 270) { doc.addPage(); y=20; }
            const text = doc.splitTextToSize(`${i+1}. ${step}`, 180);
            doc.text(text, 14, y);
            y += text.length * 4.5 + 2;
        });
    }

    // 6. PPE & Sign-off
    y += 10; if(y > 250) { doc.addPage(); y=20; }
    doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.text("4. Required PPE", 14, y);
    y += 7; doc.setFontSize(9); doc.setFont("helvetica", "normal");
    if(data.ppe) doc.text(data.ppe.join(", "), 14, y);

    y += 25; if(y > 250) { doc.addPage(); y=20; }
    doc.setDrawColor(150); doc.setLineWidth(0.1);
    doc.rect(14, y, 180, 25);
    doc.text("I confirm I have read and understood this RAMS.", 16, y+6);
    doc.text("Name: __________________  Signature: __________________", 16, y+18);

    doc.save(`RAMS_${company.name.replace(/ /g,'_')}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-black">
      <nav className="bg-white border-b py-4 px-6 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-xl"><ShieldCheck/> RAMS Sorted</div>
        <div className="text-xs font-bold bg-black text-white px-3 py-1 rounded-full">Step {step} of 3</div>
      </nav>

      <main className="max-w-2xl mx-auto py-8 px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          
          {/* STEP 1: COMPANY */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-2xl font-bold flex items-center gap-2"><Briefcase/> Company Profile</h2>
              <div><label className="block text-sm font-bold mb-1">Company Name</label><input className="w-full border rounded-lg p-3" value={company.name} onChange={e => setCompany({...company, name: e.target.value})} /></div>
              <AddressSearch label="Office Address (Legal)" value={company.address} onChange={(val: string) => setCompany({...company, address: val})} />
              <div><label className="block text-sm font-bold mb-1">Competent Person</label><input className="w-full border rounded-lg p-3" value={company.contact} onChange={e => setCompany({...company, contact: e.target.value})} /></div>
              <button onClick={() => setStep(2)} className="w-full bg-black text-white py-3 rounded-lg font-bold mt-4 flex justify-center gap-2">Next <ArrowRight/></button>
            </div>
          )}

          {/* STEP 2: JOB */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-2xl font-bold flex items-center gap-2"><MapPin/> Job Details</h2>
              <div className="flex gap-4 p-1 bg-gray-100 rounded-lg">
                <button onClick={() => setJob({...job, clientType: "Direct"})} className={`flex-1 py-2 rounded-md text-sm font-bold ${job.clientType === "Direct" ? "bg-white shadow-sm" : "text-gray-500"}`}><User className="w-4 h-4 inline"/> Direct Client</button>
                <button onClick={() => setJob({...job, clientType: "Subcontract"})} className={`flex-1 py-2 rounded-md text-sm font-bold ${job.clientType === "Subcontract" ? "bg-white shadow-sm" : "text-gray-500"}`}><Building className="w-4 h-4 inline"/> Contractor</button>
              </div>
              <AddressSearch label="Site Address (Where work is)" value={job.siteAddress} onChange={(val: string) => setJob({...job, siteAddress: val})} />
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <label className="block text-sm font-bold mb-1">Trade Template</label>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                      <select className="border rounded-lg p-3" value={job.trade} onChange={e => setJob({...job, trade: e.target.value, type: ""})}>{Object.keys(TRADES).map(t => <option key={t}>{t}</option>)}</select>
                      {/* @ts-ignore */}
                      <select className="border rounded-lg p-3" value={job.type} onChange={e => setJob({...job, type: e.target.value})}><option value="">-- Select Job --</option>{TRADES[job.trade].jobs.map((j:any) => <option key={j.name}>{j.name}</option>)}</select>
                  </div>
              </div>

              <div><label className="block text-sm font-bold mb-1">Scope of Works</label><textarea className="w-full border rounded-lg p-3 h-24" value={job.desc} onChange={e => setJob({...job, desc: e.target.value})} /></div>
              <div className="flex gap-3 mt-4"><button onClick={() => setStep(1)} className="w-1/3 border py-3 rounded-lg font-bold">Back</button><button onClick={() => setStep(3)} className="w-2/3 bg-black text-white py-3 rounded-lg font-bold">Next <ArrowRight className="inline"/></button></div>
            </div>
          )}

          {/* STEP 3: HAZARDS */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-2xl font-bold flex items-center gap-2"><AlertTriangle/> Risks & Context</h2>
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-100 rounded-lg text-sm font-medium">
                 <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 accent-black" checked={context.occupied} onChange={e => setContext({...context, occupied: e.target.checked})} /> Occupied Property?</label>
                 <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 accent-black" checked={context.outdoor} onChange={e => setContext({...context, outdoor: e.target.checked})} /> Outdoor Work?</label>
              </div>
              <div className="space-y-4">{Object.entries(HAZARD_GROUPS).map(([group, items]) => (<div key={group}><h4 className="text-xs font-bold uppercase text-gray-400 mb-2">{group}</h4><div className="flex flex-wrap gap-2">{items.map(h => (<button key={h} onClick={() => setHazards(prev => prev.includes(h) ? prev.filter(i => i !== h) : [...prev, h])} className={`text-xs py-2 px-3 rounded-lg border transition-all ${hazards.includes(h) ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>{h}</button>))}</div></div>))}</div>
              <div className="pt-6 border-t mt-6"><input type="password" placeholder="PRO2025" className="w-full border rounded-lg p-3 mb-4 font-mono text-center tracking-widest" onChange={e => setContext({...context, accessCode: e.target.value})} /><div className="flex gap-3"><button onClick={() => setStep(2)} className="w-1/3 border py-3 rounded-lg font-bold">Back</button><button onClick={generateRAMS} disabled={loading} className="w-2/3 bg-green-600 text-white py-3 rounded-lg font-bold flex justify-center gap-2 items-center">{loading ? <Loader2 className="animate-spin"/> : <ShieldCheck/>} Generate Document</button></div></div>
              {generated && <div className="bg-green-50 p-4 rounded-lg border border-green-200 flex items-center gap-3 text-green-800"><CheckCircle/> <b>Success!</b> PDF Downloaded.</div>}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}