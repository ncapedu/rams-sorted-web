"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Imports the table engine
import { Loader2, CheckCircle, HardHat, ShieldCheck, Lock, MapPin, FileText } from "lucide-react";

// Type definition for the PDF library to recognize autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => void;
  }
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  
  // New Extended Form Data
  const [formData, setFormData] = useState({
    trade: "Electrician",
    company: "",
    address: "", // NEW: Location
    job: "",
    extraDetails: "", // NEW: Extra info
    accessCode: "",
  });
  const [hazards, setHazards] = useState<string[]>([]);

  const handleHazardToggle = (hazard: string) => {
    setHazards((prev) =>
      prev.includes(hazard) ? prev.filter((h) => h !== hazard) : [...prev, hazard]
    );
  };

  const generateRAMS = async () => {
    if (formData.accessCode !== "PRO2025") {
      alert("❌ Invalid Access Code.");
      return;
    }
    if (!formData.company || !formData.job || !formData.address) {
      alert("⚠️ Please fill in Company, Address, and Job Description.");
      return;
    }

    setLoading(true);
    setGenerated(false);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ ...formData, hazards }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Generation Failed");
      
      // Pass the JSON data to the PDF creator
      createProfessionalPDF(data);
      setGenerated(true);

    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 📄 THE PROFESSIONAL PDF ENGINE
  const createProfessionalPDF = (data: any) => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString('en-GB');

    // 1. HEADER
    doc.setFillColor(17, 24, 39); // Dark Black/Blue
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("RAMS DOCUMENT", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text("Risk Assessment & Method Statement", 105, 28, { align: "center" });

    // 2. PROJECT DETAILS GRID
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    
    const startY = 50;
    doc.text(`Company: ${formData.company}`, 14, startY);
    doc.text(`Trade: ${formData.trade}`, 14, startY + 6);
    doc.text(`Date: ${date}`, 14, startY + 12);
    
    doc.text(`Site Address:`, 120, startY);
    doc.setFont("helvetica", "normal");
    const splitAddress = doc.splitTextToSize(formData.address, 80);
    doc.text(splitAddress, 120, startY + 6);

    // 3. EXECUTIVE SUMMARY
    let currentY = startY + 30;
    doc.setFont("helvetica", "bold");
    doc.text("1. Project Summary & Compliance", 14, currentY);
    doc.setFont("helvetica", "normal");
    currentY += 6;
    const splitSummary = doc.splitTextToSize(data.summary, 180);
    doc.text(splitSummary, 14, currentY);
    currentY += splitSummary.length * 5 + 10;

    // 4. RISK ASSESSMENT TABLE (The Magic Part)
    doc.setFont("helvetica", "bold");
    doc.text("2. Risk Assessment", 14, currentY);
    currentY += 4;

    doc.autoTable({
      startY: currentY,
      head: [['Hazard Identified', 'Who is at Risk', 'Control Measures', 'Rating']],
      body: data.risks.map((r: any) => [r.hazard, r.who, r.control, r.rating]),
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: { 2: { cellWidth: 80 } }, // Make Control Measure column wider
    });

    // Update Y position after table
    currentY = (doc as any).lastAutoTable.finalY + 15;

    // 5. METHOD STATEMENT
    doc.setFont("helvetica", "bold");
    doc.text("3. Method Statement", 14, currentY);
    currentY += 6;
    
    data.method_steps.forEach((step: string, index: number) => {
      if (currentY > 280) { doc.addPage(); currentY = 20; } // Auto page break
      doc.setFont("helvetica", "normal");
      const splitStep = doc.splitTextToSize(`${index + 1}. ${step}`, 180);
      doc.text(splitStep, 14, currentY);
      currentY += splitStep.length * 5 + 2;
    });

    // 6. PPE
    currentY += 10;
    if (currentY > 260) { doc.addPage(); currentY = 20; }
    doc.setFont("helvetica", "bold");
    doc.text("4. PPE Required", 14, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(data.ppe.join(", "), 14, currentY + 6);

    // Save
    doc.save(`RAMS_${formData.company.replace(/ /g, "_")}.pdf`);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      {/* Header */}
      <nav className="border-b border-gray-200 py-4 px-6 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
          <ShieldCheck className="w-6 h-6" /> RAMS Sorted
        </div>
        <div className="text-xs font-bold bg-black text-white px-3 py-1 rounded-full">PRO EDITION</div>
      </nav>

      <main className="max-w-3xl mx-auto py-12 px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Compliance. Sorted.</h1>
          <p className="text-gray-500 text-lg">Professional Site Documentation.</p>
        </div>

        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 shadow-lg">
          {/* Login */}
          <div className="mb-8 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              <Lock className="w-3 h-3" /> Pro Access Code
            </label>
            <input type="password" placeholder="PRO2025" className="w-full outline-none font-mono" onChange={(e) => setFormData({ ...formData, accessCode: e.target.value })} />
          </div>

          <div className="space-y-6">
            {/* Row 1 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Trade</label>
                <select className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 outline-none" onChange={(e) => setFormData({ ...formData, trade: e.target.value })}>
                  <option>Electrician</option><option>Plumber</option><option>Roofer</option><option>Builder</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Company Name</label>
                <input type="text" className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 outline-none" placeholder="Your Company Ltd" onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
              </div>
            </div>

            {/* Location Row */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold mb-2">
                <MapPin className="w-4 h-4" /> Site Address / Location
              </label>
              <input type="text" className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 outline-none" placeholder="e.g. 10 Downing Street, London, SW1A 2AA" onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            </div>

            {/* Job Desc */}
            <div>
              <label className="block text-sm font-bold mb-2">Job Description</label>
              <textarea className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 outline-none h-24 resize-none" placeholder="Describe the work..." onChange={(e) => setFormData({ ...formData, job: e.target.value })}></textarea>
            </div>

            {/* Extra Details */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold mb-2">
                <FileText className="w-4 h-4" /> Extra Details / Specific Notes
              </label>
              <textarea className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 outline-none h-20 resize-none" placeholder="e.g. Parking is around the back, Key code is 1234..." onChange={(e) => setFormData({ ...formData, extraDetails: e.target.value })}></textarea>
            </div>

            {/* Hazards */}
            <div>
              <label className="block text-sm font-bold mb-3">Hazards</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {["Height Work", "Live Electricity", "Dust/Fumes", "Power Tools", "Manual Handling", "Asbestos", "Hot Work", "Confined Space", "Slips/Trips"].map((h) => (
                  <button key={h} onClick={() => handleHazardToggle(h)} className={`text-sm py-2 px-3 rounded-lg border transition-all ${hazards.includes(h) ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}>{h}</button>
                ))}
              </div>
            </div>

            <button onClick={generateRAMS} disabled={loading} className="w-full bg-black text-white font-bold text-lg py-4 rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" /> : <HardHat />} {loading ? "Generating Pro Documents..." : "Generate RAMS"}
            </button>
            
            {generated && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4 text-green-800">
                <CheckCircle className="w-8 h-8" /> <div><p className="font-bold">Success!</p><p className="text-sm">Your professional PDF has downloaded.</p></div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}