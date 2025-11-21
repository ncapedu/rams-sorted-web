"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Ensure this is installed
import { Loader2, CheckCircle, HardHat, ShieldCheck, ArrowRight, MapPin, Briefcase, AlertTriangle, Lock } from "lucide-react";
import { TRADES, HAZARD_GROUPS } from "./lib/constants"; // We created this in Step 2

export default function Home() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  
  // Data Models
  const [company, setCompany] = useState({ name: "", address: "", contact: "" });
  const [job, setJob] = useState({ client: "", siteAddress: "", trade: "Electrician", type: "", desc: "", date: new Date().toISOString().split('T')[0] });
  const [context, setContext] = useState({ occupied: false, outdoor: false, accessCode: "" });
  const [hazards, setHazards] = useState<string[]>([]);

  // Smart Template Loader
  useEffect(() => {
    // When Trade or Job Type changes, load the template defaults
    // @ts-ignore
    const tradeData = TRADES[job.trade];
    if (tradeData && job.type) {
      const template = tradeData.jobs.find((j: any) => j.name === job.type);
      if (template) {
        setJob(prev => ({ ...prev, desc: template.desc }));
        setHazards(template.hazards);
      }
    }
  }, [job.type, job.trade]);

  const toggleHazard = (h: string) => {
    setHazards(prev => prev.includes(h) ? prev.filter(i => i !== h) : [...prev, h]);
  };

  const generateRAMS = async () => {
    if (context.accessCode !== "PRO2025") return alert("❌ Invalid Access Code.");
    if (!company.name || !job.client) return alert("⚠️ Please fill in all details.");
    
    setLoading(true);
    setGenerated(false);
    
    try {
      const payload = {
        company: company.name,
        officeAddress: company.address,
        contact: company.contact,
        client: job.client,
        siteAddress: job.siteAddress,
        trade: job.trade,
        job: job.desc,
        hazards,
        context
      };

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      
      createPDF(data);
      setGenerated(true);
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const createPDF = (data: any) => {
    const doc = new jsPDF();
    
    // Header Strip
    doc.setFillColor(17, 24, 39); // Dark Slate
    doc.rect(0, 0, 210, 35, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22); doc.setFont("helvetica", "bold");
    doc.text("RAMS DOCUMENT", 105, 18, { align: "center" });
    doc.setFontSize(10); doc.setFont("helvetica", "normal");
    doc.text("Risk Assessment & Method Statement", 105, 26, { align: "center" });

    // Details Block
    doc.setTextColor(0, 0, 0);
    let y = 50;
    
    // Column 1: Contractor
    doc.setFont("helvetica", "bold"); doc.text("CONTRACTOR:", 14, y);
    doc.setFont("helvetica", "normal"); doc.text(company.name, 14, y+6);
    doc.setFontSize(9); doc.text(company.address, 14, y+11);
    doc.text(`Contact: ${company.contact}`, 14, y+16);
    
    // Column 2: Site
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold"); doc.text("PROJECT SITE:", 120, y);
    doc.setFont("helvetica", "normal"); doc.text(job.client, 120, y+6);
    doc.setFontSize(9); doc.text(job.siteAddress, 120, y+11);
    doc.text(`Date: ${job.date}`, 120, y+16);

    y += 30;

    // 1. Executive Summary
    doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.text("1. Executive Summary", 14, y);
    y += 7; doc.setFontSize(10); doc.setFont("helvetica", "normal");
    const summary = doc.splitTextToSize(data.summary || "Summary not generated.", 180);
    doc.text(summary, 14, y);
    y += summary.length * 5 + 10;

    // 2. Risk Assessment Table
    doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.text("2. Risk Assessment", 14, y);
    y += 5;
    
    autoTable(doc, {
      startY: y,
      head: [['Hazard', 'Who is at Risk', 'Control Measures', 'Rating']],
      body: data.risks ? data.risks.map((r: any) => [r.hazard, r.who, r.control, r.rating]) : [],
      theme: 'grid',
      headStyles: { fillColor: [17, 24, 39] },
      styles: { fontSize: 9 }
    });
    // @ts-ignore
    y = doc.lastAutoTable.finalY + 15;

    // 3. Method Statement
    if(y > 250) { doc.addPage(); y=20; }
    doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.text("3. Method Statement", 14, y);
    y += 7; doc.setFontSize(10); doc.setFont("helvetica", "normal");
    
    if(data.method_steps) {
        data.method_steps.forEach((step: string, i: number) => {
            if(y > 270) { doc.addPage(); y=20; }
            const text = doc.splitTextToSize(`${i+1}. ${step}`, 180);
            doc.text(text, 14, y);
            y += text.length * 5 + 2;
        });
    }

    // 4. PPE
    y += 10;
    if(y > 260) { doc.addPage(); y=20; }
    doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.text("4. Required PPE", 14, y);
    y += 7; doc.setFontSize(10); doc.setFont("helvetica", "normal");
    if(data.ppe) doc.text(data.ppe.join(", "), 14, y);

    doc.save(`RAMS_${company.name.replace(/ /g,'_')}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-black">
      <nav className="bg-white border-b py-4 px-6 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter"><ShieldCheck className="w-6 h-6"/> RAMS Sorted</div>
        <div className="text-xs font-bold bg-black text-white px-3 py-1 rounded-full">Step {step} of 3</div>
      </nav>

      <main className="max-w-2xl mx-auto py-8 px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all">
          
          {/* STEP 1: COMPANY */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-6 border-b pb-4"><h2 className="text-2xl font-bold flex items-center gap-2"><Briefcase/> Company Profile</h2><p className="text-gray-500">Enter your details once.</p></div>
              <div className="space-y-4">
                  <div><label className="block text-sm font-bold mb-1">Company Name</label><input className="w-full border rounded-lg p-3" placeholder="Your Company Ltd" value={company.name} onChange={e => setCompany({...company, name: e.target.value})} /></div>
                  <div><label className="block text-sm font-bold mb-1">Office Address (Correspondence)</label><input className="w-full border rounded-lg p-3" placeholder="123 High St..." value={company.address} onChange={e => setCompany({...company, address: e.target.value})} /></div>
                  <div><label className="block text-sm font-bold mb-1">Competent Person (Sign-off)</label><input className="w-full border rounded-lg p-3" placeholder="Your Name" value={company.contact} onChange={e => setCompany({...company, contact: e.target.value})} /></div>
              </div>
              <button onClick={() => setStep(2)} className="w-full bg-black text-white py-3 rounded-lg font-bold mt-4 flex justify-center gap-2 items-center">Next Step <ArrowRight className="w-4 h-4"/></button>
            </div>
          )}

          {/* STEP 2: JOB */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-6 border-b pb-4"><h2 className="text-2xl font-bold flex items-center gap-2"><MapPin/> Job Details</h2><p className="text-gray-500">What work are you doing?</p></div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div><label className="block text-sm font-bold mb-1">Client Name</label><input className="w-full border rounded-lg p-3" value={job.client} onChange={e => setJob({...job, client: e.target.value})} /></div>
                 <div><label className="block text-sm font-bold mb-1">Date</label><input type="date" className="w-full border rounded-lg p-3" value={job.date} onChange={e => setJob({...job, date: e.target.value})} /></div>
              </div>
              <div><label className="block text-sm font-bold mb-1">Site Address (Where is the work?)</label><input className="w-full border rounded-lg p-3" value={job.siteAddress} onChange={e => setJob({...job, siteAddress: e.target.value})} /></div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <label className="block text-sm font-bold mb-1">Trade</label>
                  <select className="w-full bg-white border rounded-lg p-3 mb-3" value={job.trade} onChange={e => setJob({...job, trade: e.target.value, type: ""})}>
                    {Object.keys(TRADES).map(t => <option key={t}>{t}</option>)}
                  </select>
                  <label className="block text-sm font-bold mb-1">Job Template (Auto-fill)</label>
                  <select className="w-full bg-white border rounded-lg p-3" value={job.type} onChange={e => setJob({...job, type: e.target.value})}>
                    <option value="">-- Select Job Type --</option>
                    {/* @ts-ignore */}
                    {TRADES[job.trade].jobs.map((j:any) => <option key={j.name}>{j.name}</option>)}
                  </select>
              </div>

              <div><label className="block text-sm font-bold mb-1">Scope of Works</label><textarea className="w-full border rounded-lg p-3 h-24" value={job.desc} onChange={e => setJob({...job, desc: e.target.value})} /></div>
              <div className="flex gap-3 mt-4">
                 <button onClick={() => setStep(1)} className="w-1/3 border py-3 rounded-lg font-bold text-gray-600">Back</button>
                 <button onClick={() => setStep(3)} className="w-2/3 bg-black text-white py-3 rounded-lg font-bold flex justify-center gap-2 items-center">Next <ArrowRight className="w-4 h-4"/></button>
              </div>
            </div>
          )}

          {/* STEP 3: RISKS & GENERATE */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="mb-6 border-b pb-4"><h2 className="text-2xl font-bold flex items-center gap-2"><AlertTriangle/> Hazards & Context</h2><p className="text-gray-500">Specific site risks.</p></div>
              
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-100 rounded-lg text-sm font-medium">
                 <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 accent-black" checked={context.occupied} onChange={e => setContext({...context, occupied: e.target.checked})} /> Occupied Property?</label>
                 <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 accent-black" checked={context.outdoor} onChange={e => setContext({...context, outdoor: e.target.checked})} /> Outdoor Work?</label>
              </div>

              <div className="space-y-4">
                 {Object.entries(HAZARD_GROUPS).map(([group, items]) => (
                   <div key={group}>
                      <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">{group}</h4>
                      <div className="flex flex-wrap gap-2">
                        {items.map(h => (
                           <button key={h} onClick={() => toggleHazard(h)} className={`text-xs py-2 px-3 rounded-lg border transition-all ${hazards.includes(h) ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>{h}</button>
                        ))}
                      </div>
                   </div>
                 ))}
              </div>

              <div className="pt-6 border-t mt-6">
                 <label className="block text-xs font-bold uppercase text-gray-500 mb-1 flex items-center gap-1"><Lock className="w-3 h-3"/> Access Code</label>
                 <input type="password" placeholder="PRO2025" className="w-full border rounded-lg p-3 mb-4 font-mono text-center tracking-widest" onChange={e => setContext({...context, accessCode: e.target.value})} />
                 
                 <div className="flex gap-3">
                    <button onClick={() => setStep(2)} className="w-1/3 border py-3 rounded-lg font-bold text-gray-600">Back</button>
                    <button onClick={generateRAMS} disabled={loading} className="w-2/3 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold flex justify-center gap-2 items-center shadow-lg">
                        {loading ? <Loader2 className="animate-spin w-5 h-5"/> : <ShieldCheck className="w-5 h-5"/>} {loading ? "Generating..." : "Generate Document"}
                    </button>
                 </div>
              </div>

              {generated && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 flex items-center gap-3 text-green-800 animate-in zoom-in-95">
                    <CheckCircle className="w-6 h-6"/> <div><p className="font-bold">Success!</p><p className="text-sm">Your PDF has been downloaded.</p></div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}