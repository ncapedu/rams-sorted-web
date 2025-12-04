import { HAZARD_DATA, TRADES } from "./constants";
import { METHOD_STATEMENTS, PPE_DEFINITIONS, COSHH_LIBRARY } from "./rams-content";
import { GHS_ICON_MAP, PPE_ICON_MAP, mapStringToHazardClass, mapStringToPpeType, svgToPngDataUri } from "./safety-icons";

export interface RAMSData {
  userType: "company" | "sole_trader";
  companyName: string;
  clientName: string;
  siteAddress: string;
  projectRef: string;
  contactName: string;
  startDate: string;
  trade: string;
  jobType: string;
  supervisorName: string;
  firstAider: string;
  hospital: string;
  fireAssembly: string;
  firstAidLoc: string;
  welfare: string;
  scopeText?: string; // Legacy support
  customDescription?: string;
  checklist?: { label: string; answer: string }[];
  hazards: string[];
  coshh: any[];
  documentName: string;
  ppe: string[];
  operatives?: string | number;
  extraData?: Record<string, string>;
  answers?: Record<string, string>;
  methodSteps?: string[];
}

function sanitizeText(input: any): string {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/\r\n/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/ ?([.,;:!?])/g, "$1")
    .trim();
}

function isFilled(input: any): boolean {
  if (Array.isArray(input)) return input.length > 0;
  return !!input && typeof input === "string" && input.trim().length > 0;
}

// Helper to get terminology based on user type
function getTerminology(userType: "company" | "sole_trader") {
  return userType === "sole_trader"
    ? {
      we: "I",
      our: "My",
      us: "Me",
      company: "The Contractor",
      manager: "Manager/Proprietor",
    }
    : {
      we: "We",
      our: "Our",
      us: "Us",
      company: "The Company",
      manager: "Supervisor/Manager",
    };
}

// Helper to generate method statement
function generateMethodStatement(trade: string, jobType: string, userType: "company" | "sole_trader"): string[] {
  const terms = getTerminology(userType);

  // Try to find specific steps
  let steps = METHOD_STATEMENTS[trade]?.[jobType];

  // Fallback to trade default
  if (!steps) {
    steps = METHOD_STATEMENTS[trade]?.["default"];
  }

  // Fallback to generic default
  if (!steps) {
    steps = METHOD_STATEMENTS["default"]["default"];
  }

  // Process steps to replace placeholders or adjust grammar if needed
  // For now, simple replacement if we had placeholders.
  // But the steps are written in imperative "Arrive...", "Isolate..." which works for both.
  // "We will..." vs "I will..." -> The steps are "Arrive...", "Isolate...".
  // So they are neutral.

  return steps;
}

// Helper to generate PPE
export function generatePPE(hazards: string[], trade: string): string[] {
  const ppeList: Set<string> = new Set();

  // Always add basics
  ppeList.add("Safety Footwear (Steel Toe/Midsole)");
  ppeList.add("Hi-Visibility Vest/Jacket");

  // Add based on hazards
  hazards.forEach(h => {
    const def = PPE_DEFINITIONS[h];
    if (def) {
      ppeList.add(def.item);
    }
  });

  return Array.from(ppeList);
}

// Helper to generate COSHH
function generateCOSHH(hazards: string[]): { substance: string; hazard: string; control: string }[] {
  const coshhList: { substance: string; hazard: string; control: string }[] = [];

  hazards.forEach(h => {
    const entries = COSHH_LIBRARY[h];
    if (entries) {
      entries.forEach(entry => coshhList.push(entry));
    }
  });

  return coshhList;
}

export async function generateRAMSHTML(data: RAMSData): Promise<string> {
  const {
    userType = "company", // Default to company
    companyName,
    clientName,
    siteAddress,
    projectRef,
    contactName,
    startDate,
    trade,
    jobType,
    supervisorName,
    firstAider,
    hospital,
    fireAssembly,
    firstAidLoc,
    welfare,
    customDescription,
    scopeText,
    checklist, // This comes as array from page.tsx? No, page.tsx sends "answers".
    // I need to map "answers" to checklist format if needed.
    // page.tsx sends "answers": { q1: "Yes", q2: "No" ... }
    // The previous code expected "checklist": { label, answer }[]
    // I should handle both or check API route.
    // Let's assume the API route does the mapping.
    // If not, I'll need to do it here.
    // I'll assume data passed to this function is already formatted by the API route.
    hazards,
    documentName,
    operatives,
    extraData,
    answers
  } = data;

  const terms = getTerminology(userType);
  const scope = customDescription || scopeText || "";

  // Generate dynamic content
  const rawSteps = (data.methodSteps && data.methodSteps.length > 0)
    ? data.methodSteps
    : generateMethodStatement(trade, jobType, userType);

  const methodSteps = (Array.isArray(rawSteps) ? rawSteps : []).slice(0, 4);
  const ppe = generatePPE(hazards, trade);

  // Use AI-generated COSHH if available, otherwise fallback to static library
  const coshh = (data.coshh && data.coshh.length > 0)
    ? data.coshh
    : generateCOSHH(hazards);

  // Derive checklist if not provided but answers are present
  let finalChecklist = checklist || [];
  if (finalChecklist.length === 0 && answers && trade && jobType) {
    const cluster = TRADES[trade]?.clusters?.[jobType];
    if (cluster && cluster.questions) {
      finalChecklist = cluster.questions.map(q => ({
        label: q.label,
        answer: answers[q.id] || "N/A"
      }));
    }
  }

  const toTitleCase = (str: string) =>
    str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

  const jobTitle = `${trade} - ${jobType ? toTitleCase(jobType) : ""}`;

  // 1. Header
  const header = `
    <div class="header-line">
      <h1>Risk Assessment & Method Statement</h1>
    </div>
  `;

  // 2. Project Details
  const projectDetails = `
    <div class="section-block keep-together">
      <h2>1. Project & Job Scope Details</h2>
      <table>
        <tr>
          <th width="20%">${userType === "company" ? "Company" : "Contractor"}</th>
          <td width="30%">${sanitizeText(companyName)}</td>
          <th width="20%">Client</th>
          <td width="30%">${sanitizeText(clientName)}</td>
        </tr>
        <tr>
          <th>Site Address</th>
          <td colspan="3">${sanitizeText(siteAddress)}</td>
        </tr>
        <tr>
          <th>Job / Task</th>
          <td>${sanitizeText(jobTitle)}</td>
          ${isFilled(projectRef) ? `<th>Project Ref</th><td>${sanitizeText(projectRef)}</td>` : `<th></th><td></td>`}
        </tr>
        <tr>
          <th>Prepared By</th>
          <td>${sanitizeText(contactName)}</td>
          <th>Date</th>
          <td>${startDate}</td>
        </tr>
      </table>
    </div>
  `;

  // 3. Scope of Works & Extra Details
  const extraDetails = extraData && Object.keys(extraData).length > 0
    ? Object.entries(extraData).map(([key, value]) => `
      <div class="section-block">
        <h3>${key.replace(/_/g, " ")}</h3>
        <p>${sanitizeText(value)}</p>
      </div>
    `).join("")
    : "";

  const scopeSection = `
    <div class="section-block">
      <h2>2. Scope of Works</h2>
      <div style="margin-bottom: 15px;">
        ${sanitizeText(scope).split('\n').map(line => `<p>${line}</p>`).join('')}
      </div>
    </div>
    ${extraDetails}
  `;

  // 4. Pre-Start Checklist
  // Handle checklist if it exists, otherwise skip
  let checklistHTML = "";
  if (finalChecklist.length > 0) {
    const checklistRows = finalChecklist.map((item: any, i: number) => `
      <tr>
        <td width="5%">${i + 1}</td>
        <td width="80%">${item.label}</td>
        <td width="15%" class="text-center bold">${item.answer}</td>
      </tr>
    `).join("");

    checklistHTML = `
      <div class="section-block">
        <h2>3. Pre-Start Safety Checklist</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Check / Question</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${checklistRows}
          </tbody>
        </table>
      </div>
    `;
  }

  // 5. Hazards
  // Pre-convert hazard icons to PNG
  const hazardRowsPromises = hazards.map(async (hKey: string) => {
    // @ts-ignore
    const h = HAZARD_DATA[hKey];
    if (!h) return "";

    let scoreClass = "risk-low";
    if (h.initial_score.includes("High")) scoreClass = "risk-high";
    else if (h.initial_score.includes("Medium")) scoreClass = "risk-med";

    const hazardClass = mapStringToHazardClass(h.label);
    const iconSrcSvg = hazardClass ? GHS_ICON_MAP[hazardClass] : null;

    // Convert to PNG if icon exists
    const iconSrc = iconSrcSvg ? await svgToPngDataUri(iconSrcSvg, 64, 64) : null;

    const iconHtml = iconSrc ? `<img src="${iconSrc}" width="24" height="24" style="width: 24px; height: 24px; vertical-align: middle; margin-right: 8px;" />` : "";

    return `
      <tr>
        <td width="20%" class="bold">${iconHtml}${h.label}</td>
        <td width="25%">${h.risk}</td>
        <td width="30%">${h.control}</td>
        <td width="10%" class="risk-score ${scoreClass}">${h.initial_score}</td>
        <td width="15%" class="risk-score risk-low">${h.residual_score}</td>
      </tr>
    `;
  });

  const hazardRows = (await Promise.all(hazardRowsPromises)).join("");

  const hazardsHTML = `
    <div class="section-block">
      <h2>4. Risk Assessment (Hazards & Controls)</h2>
      <p>The following hazards have been identified. Control measures must be implemented before work starts.</p>
      
      <div style="margin-bottom: 10px; font-size: 8pt; border: 1px solid #ccc; padding: 5px;">
        <strong>Risk Index Legend:</strong> 
        <span class="risk-score risk-low" style="padding: 2px 5px;">Low (1-5)</span>
        <span class="risk-score risk-med" style="padding: 2px 5px;">Medium (6-12)</span>
        <span class="risk-score risk-high" style="padding: 2px 5px;">High (15-25)</span>
      </div>

      <table>
        <thead>
          <tr>
            <th>Hazard</th>
            <th>Risk / Consequence</th>
            <th>Control Measures</th>
            <th>Initial Risk</th>
            <th>Residual Risk</th>
          </tr>
        </thead>
        <tbody>
          ${hazardRows}
        </tbody>
      </table>
    </div>
  `;

  // 6. Method Statement
  const methodRows = methodSteps.map((step: string, index: number) => `
    <div style="margin-bottom: 8px;">
      <p><strong>Step ${index + 1}:</strong> ${step}</p>
    </div>
  `).join("");

  const methodHTML = `
    <div class="section-block">
      <h2>5. Method Statement</h2>
      ${methodRows}
    </div>
  `;

  // 7. COSHH
  const coshhRows = coshh.map((c: any) => `
    <tr>
      <td class="bold">${c.substance || ""}</td>
      <td>${c.hazard || ""}</td>
      <td>${c.control || ""}</td>
    </tr>
  `).join("");

  const coshhHTML = `
    <div class="section-block">
      <h2>6. COSHH Assessment</h2>
      <table>
        <thead>
          <tr>
            <th>Substance</th>
            <th>Hazard</th>
            <th>Control Measures</th>
          </tr>
        </thead>
        <tbody>
          ${coshhRows}
        </tbody>
      </table>
    </div>
  `;

  // 8. PPE
  // Pre-convert PPE icons to PNG
  const ppeListPromises = ppe.map(async (item: string) => {
    const ppeType = mapStringToPpeType(item);
    const iconSrcSvg = ppeType ? PPE_ICON_MAP[ppeType] : null;

    // Convert to PNG if icon exists
    const iconSrc = iconSrcSvg ? await svgToPngDataUri(iconSrcSvg, 64, 64) : null;

    const iconHtml = iconSrc ? `<img src="${iconSrc}" width="32" height="32" style="width: 32px; height: 32px; display: block; margin: 0 auto 4px auto;" />` : "";

    return `
      <div style="display: inline-block; border: 1px solid #ccc; padding: 8px 12px; margin: 4px; border-radius: 4px; font-size: 9pt; text-align: center; min-width: 80px; vertical-align: top;">
        ${iconHtml}
        <strong>${item}</strong>
      </div>
    `;
  });

  const ppeList = (await Promise.all(ppeListPromises)).join("");

  const ppeHTML = `
    <div class="section-block">
      <h2>7. PPE Requirements</h2>
      <div style="margin-bottom: 15px;">
        ${ppeList}
      </div>
    </div>
  `;

  // 9. Emergency & Operatives
  const emergencyHTML = `
    <div class="section-block">
      <h2>8. Emergency Arrangements</h2>
      <table>
        <tr>
          <th width="25%">Supervisor</th>
          <td width="25%">${sanitizeText(supervisorName)}</td>
          <th width="25%">First Aider</th>
          <td width="25%">${sanitizeText(firstAider)}</td>
        </tr>
        <tr>
          <th>Hospital</th>
          <td>${sanitizeText(hospital)}</td>
          <th>Fire Assembly</th>
          <td>${sanitizeText(fireAssembly)}</td>
        </tr>
        <tr>
          <th>First Aid Kit</th>
          <td>${sanitizeText(firstAidLoc)}</td>
          <th>Welfare</th>
          <td>${sanitizeText(welfare)}</td>
        </tr>
      </table>
    </div>
  `;

  const signoffHTML = `
    <div class="section-block">
      <h2>9. Operative Acknowledgement</h2>
      <p>By signing below, ${terms.we.toLowerCase()} confirm ${terms.we.toLowerCase()} have read and understood this RAMS and will work in accordance with the control measures and method statement.</p>

      <table>
        <thead>
          <tr>
            <th width="30%">Name</th>
            <th width="20%">Role</th>
            <th width="20%">Date</th>
            <th width="30%">Signature</th>
          </tr>
        </thead>
        <tbody>
          ${Array.from({ length: Math.max(1, Number(operatives) || 1) }).map(() => `
            <tr>
              <td style="height: 50px;"></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;

  // 10. Authorization
  const authorizationHTML = `
    <div class="signature-block">
      <h3 style="margin-top: 0; text-align: center; border-bottom: 1px solid #000; padding-bottom: 10px;">10. Authorization & Approval</h3>
      
      <div class="signature-section" style="margin-top: 15px;">
        <p><strong>${terms.manager} Sign-off:</strong></p>
        <p>I confirm that the above method statement and risk assessment is suitable and sufficient for the task.</p>
        <table style="border: none;">
          <tr style="border: none;">
            <td style="border: none; padding: 10px 0;"><strong>Name:</strong> ${sanitizeText(supervisorName)}</td>
            <td style="border: none; padding: 10px 0;"><strong>Signature:</strong> ____________________</td>
            <td style="border: none; padding: 10px 0;"><strong>Date:</strong> ${startDate}</td>
          </tr>
        </table>
      </div>

      <div class="signature-section" style="margin-top: 15px; border-top: 1px dashed #ccc; padding-top: 15px;">
        <p><strong>Client / Principal Contractor Acceptance (Optional):</strong></p>
        <table style="border: none;">
          <tr style="border: none;">
            <td style="border: none; padding: 10px 0;"><strong>Name:</strong> ____________________</td>
            <td style="border: none; padding: 10px 0;"><strong>Signature:</strong> ____________________</td>
            <td style="border: none; padding: 10px 0;"><strong>Date:</strong> ____________________</td>
          </tr>
        </table>
      </div>
    </div>
  `;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${sanitizeText(documentName)}</title>
      <style>
        ${RAMS_STYLES}
      </style>
    </head>
    <body>
      <div class="rams-content">
        ${header}
        ${projectDetails}
        ${scopeSection}
        ${checklistHTML}
        ${hazardsHTML}
        ${methodHTML}
        ${coshhHTML}
        ${ppeHTML}
        ${emergencyHTML}
        ${signoffHTML}
        ${authorizationHTML}
      </div>
    </body>
    </html>
  `;
}

export const RAMS_STYLES = `
  @page {
    size: A4;
    margin: 15mm;
  }
  *, *:before, *:after {
    box-sizing: border-box;
  }
  html, body {
    height: auto;
    width: 100%;
    margin: 0;
    padding: 0;
  }
  .rams-content {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 10pt;
    line-height: 1.3;
    color: #111;
    width: 100%;
  }

  /* Semantic Blocks for Pagination */
  .section-block {
    margin-bottom: 10px;
    page-break-inside: auto;
    break-inside: auto;
  }
  .keep-together {
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .signature-block {
    margin-top: 20px;
    page-break-inside: auto;
    break-inside: auto;
    border: 1px solid #000;
    padding: 15px;
  }
  .signature-section {
    page-break-inside: avoid;
    break-inside: avoid;
    margin-bottom: 15px;
  }

  h1 {
    font-size: 16pt;
    font-weight: bold;
    text-transform: uppercase;
    margin: 0 0 10px 0;
    text-align: center;
    letter-spacing: 1px;
    border-bottom: 2px solid #000;
    padding-bottom: 10px;
  }
  h2 {
    font-size: 12pt;
    font-weight: bold;
    text-transform: uppercase;
    margin-top: 0;
    margin-bottom: 8px;
    border-bottom: 1px solid #000;
    padding-bottom: 4px;
    page-break-after: avoid;
    break-after: avoid;
    width: 100%;
  }
  h3 {
    font-size: 11pt;
    font-weight: bold;
    margin-top: 12px;
    margin-bottom: 4px;
    text-transform: uppercase;
    color: #333;
    page-break-after: avoid;
    break-after: avoid;
  }
  p {
    margin-bottom: 6px;
    text-align: justify;
    orphans: 2;
    widows: 2;
  }

  /* Table Pagination Rules */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 0;
    page-break-inside: auto;
    break-inside: auto;
  }
  tr {
    page-break-inside: avoid;
    break-inside: avoid;
  }
  th, td {
    border: 1px solid #000;
    padding: 8px;
    vertical-align: top;
    text-align: left;
  }
  thead {
    display: table-header-group; /* Repeat header on new page */
  }
  th {
    background-color: #f8f9fa;
    font-weight: bold;
    font-size: 9pt;
    color: #000;
  }
  td {
    font-size: 9.5pt;
  }
    
  .text-center { text-align: center; }
  .text-right { text-align: right; }
  .bold { font-weight: bold; }
  .small { font-size: 8pt; color: #555; }
  .header-line {
    margin-bottom: 30px;
  }
  .risk-score {
    font-weight: bold;
    text-align: center;
  }
  .risk-high { background-color: #ffebee; color: #c62828; }
  .risk-med { background-color: #fff3e0; color: #ef6c00; }
  .risk-low { background-color: #e8f5e9; color: #2e7d32; }

  /* Word Specifics */
  @media print {
    .rams-content { padding: 0; }
    .no-break { page-break-inside: avoid; break-inside: avoid; }

    /* Tighten spacing for print */
    .section-block {
      margin-bottom: 0.25rem!important;
      break-inside: auto!important;
      page-break-inside: auto!important;
    }
    /* Override method step spacing */
    .section-block div {
      margin-bottom: 0.25rem!important;
    }
    h1 {
      margin-bottom: 0.5rem!important;
      padding-bottom: 0.25rem!important;
    }
    h2 {
      margin-top: 0.5rem!important;
      margin-bottom: 0.25rem!important;
      break-after: auto!important;
      page-break-after: auto!important;
    }
    h3 {
      margin-top: 0.5rem!important;
      margin-bottom: 0.25rem!important;
      break-after: auto!important;
      page-break-after: auto!important;
    }
    p {
      margin-bottom: 0.25rem!important;
      break-inside: auto!important;
      page-break-inside: auto!important;
    }

    /* Critical Elements */
    table {
      break-inside: auto!important;
      page-break-inside: auto!important;
    }
    tr {
      break-inside: auto!important;
      page-break-inside: auto!important;
    }
    /* Only keep signatures together as they are small and look bad if split */
    .signature-section {
      break-inside: avoid!important;
      page-break-inside: avoid!important;
    }

    /* Reset forced breaks */
    h2, h3, .section-block, table, tr {
      break-before: auto!important;
      page-break-before: auto!important;
    }
  }

  /* PDF Sign Styles */
  .pdf-sign-strip {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 4px;
  }
  .pdf-sign {
    width: 24px;
    height: 24px;
    object-fit: contain;
    vertical-align: middle;
  }
  .pdf-sign-large {
    width: 32px;
    height: 32px;
    object-fit: contain;
    display: block;
    margin: 0 auto 4px auto;
  }
  `;

import { ToolboxTalkData } from "../components/MyFileViewer";

export async function generateToolboxHTML(data: ToolboxTalkData): Promise<string> {
  const {
    topic,
    date,
    location,
    supervisorName,
    audience,
    hazards,
    keyMessages,
    ppe,
    emergencyArrangements,
    attendanceConfig,
    aiContent
  } = data;

  // Fallback if AI content is missing
  const content = aiContent || {
    title: topic,
    headerInfo: { topic, date, location, presenter: supervisorName },
    introduction: "This toolbox talk covers essential safety information regarding " + topic + ".",
    hazardsSection: hazards.map(h => ({ hazard: h, description: "Potential risk associated with " + h })),
    controlsSection: [{ title: "General Controls", description: "Follow standard site safety rules." }],
    emergencySection: emergencyArrangements || "Follow site emergency procedures.",
    keyMessagesSection: keyMessages ? keyMessages.split("\n") : ["Work safely."],
    attendeeNote: "I confirm that I have attended this briefing and understand the points discussed."
  };

  const header = `
    <div class="header-line" style="border-bottom: 3px solid #000;">
      <h1 style="color: #000; border-bottom: none;">Toolbox Talk Record</h1>
    </div>
  `;

  const infoTable = `
    <div class="section-block">
      <table style="border: 1px solid #000;">
        <tr>
          <th width="20%" style="background-color: #f8fafc; color: #000;">Topic</th>
          <td width="30%">${content.headerInfo.topic}</td>
          <th width="20%" style="background-color: #f8fafc; color: #000;">Date</th>
          <td width="30%">${content.headerInfo.date}</td>
        </tr>
        <tr>
          <th style="background-color: #f8fafc; color: #000;">Location</th>
          <td>${content.headerInfo.location}</td>
          <th style="background-color: #f8fafc; color: #000;">Presenter</th>
          <td>${content.headerInfo.presenter}</td>
        </tr>
        <tr>
          <th style="background-color: #f8fafc; color: #000;">Audience</th>
          <td colspan="3">${audience || "General Site Personnel"}</td>
        </tr>
      </table>
    </div>
  `;

  const introSection = `
    <div class="section-block">
      <h2 style="color: #000; border-bottom-color: #000;">1. Introduction</h2>
      <p>${content.introduction}</p>
    </div>
  `;

  const hazardsSection = `
    <div class="section-block">
      <h2 style="color: #000; border-bottom-color: #000;">2. Key Hazards</h2>
      <ul>
        ${content.hazardsSection.map((h: any) => `
          <li style="margin-bottom: 8px;">
            <strong>${h.hazard}:</strong> ${h.description}
          </li>
        `).join("")}
      </ul>
    </div>
  `;

  const controlsSection = `
    <div class="section-block">
      <h2 style="color: #000; border-bottom-color: #000;">3. Control Measures</h2>
      <ul>
        ${content.controlsSection.map((c: any) => `
          <li style="margin-bottom: 8px;">
            <strong>${c.title}:</strong> ${c.description}
          </li>
        `).join("")}
      </ul>
    </div>
  `;

  const keyMessagesSection = `
    <div class="section-block">
      <h2 style="color: #000; border-bottom-color: #000;">4. Key Messages</h2>
      <ul>
        ${content.keyMessagesSection.map((m: string) => `<li>${m}</li>`).join("")}
      </ul>
    </div>
  `;

  const ppeSection = `
    <div class="section-block">
      <h2 style="color: #000; border-bottom-color: #000;">5. PPE Required</h2>
      <p>The following PPE is mandatory for this task:</p>
      <p><strong>${ppe.join(", ")}</strong></p>
    </div>
  `;

  const emergencySection = `
    <div class="section-block">
      <h2 style="color: #000; border-bottom-color: #000;">6. Emergency Procedures</h2>
      <p>${content.emergencySection}</p>
    </div>
  `;

  let attendanceHTML = "";
  if (attendanceConfig.include) {
    const rows = Math.max(10, Number(attendanceConfig.expectedAttendees) || 10);

    attendanceHTML = `
      <div class="section-block keep-together" style="margin-top: 20px;">
        <h2 style="color: #000; border-bottom-color: #000;">7. Attendee Acknowledgement</h2>
        <p><em>"${content.attendeeNote}"</em></p>
        ${attendanceConfig.notes ? `<p><strong>Note:</strong> ${attendanceConfig.notes}</p>` : ""}

        <table style="margin-top: 10px; border: 1px solid #000;">
          <thead>
            <tr>
              <th width="30%" style="background-color: #f8fafc; color: #000;">Name (Print)</th>
              <th width="25%" style="background-color: #f8fafc; color: #000;">Company</th>
              <th width="25%" style="background-color: #f8fafc; color: #000;">Signature</th>
              <th width="20%" style="background-color: #f8fafc; color: #000;">Date</th>
            </tr>
          </thead>
          <tbody>
            ${Array.from({ length: rows }).map(() => `
              <tr>
                <td style="height: 40px;"></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${data.topic} - Toolbox Talk</title>
      <style>
        ${RAMS_STYLES}
      </style>
    </head>
    <body>
      <div class="rams-content">
        ${header}
        ${infoTable}
        ${introSection}
        ${hazardsSection}
        ${controlsSection}
        ${keyMessagesSection}
        ${ppeSection}
        ${emergencySection}
        ${attendanceHTML}
      </div>
    </body>
    </html>
  `;
}

export interface COSHHData {
  documentName: string;
  companyName: string;
  assessorName: string;
  clientName: string;
  projectRef: string;
  siteAddress: string;
  assessmentDate: string;
  reviewDate?: string;

  selectedSubstances: { name: string; hazard: string; control: string; exposureRoutes?: string; storage?: string; riskLevel?: string }[];
  customSubstances: { name: string; hazard: string; control: string; exposureRoutes?: string; storage?: string; riskLevel?: string }[];

  workActivity: string;
  exposureDuration: string;
  exposureFrequency: string;
  personsExposed: string[];

  ppe: string[];
  emergencyProcedures: string;
  additionalControls: string;
}

export async function generateCOSHHHTML(data: COSHHData): Promise<string> {
  const {
    documentName,
    companyName,
    assessorName,
    clientName,
    projectRef,
    siteAddress,
    assessmentDate,
    selectedSubstances,
    customSubstances,
    workActivity,
    exposureDuration,
    exposureFrequency,
    personsExposed,
    ppe,
    emergencyProcedures,
    additionalControls
  } = data;

  const allSubstances = [...selectedSubstances, ...customSubstances];

  // Helper functions
  const getRiskLevel = (hazard: string) => {
    if (hazard.includes("Toxic") || hazard.includes("Carcinogen")) return "High";
    if (hazard.includes("Corrosive") || hazard.includes("Irritant")) return "Medium";
    return "Low";
  };

  const getExposureRoutes = (hazard: string) => {
    const routes = [];
    if (hazard.includes("Inhalation") || hazard.includes("Respiratory")) routes.push("Inhalation");
    if (hazard.includes("Skin") || hazard.includes("Contact")) routes.push("Skin Contact");
    if (hazard.includes("Ingestion")) routes.push("Ingestion");
    if (hazard.includes("Eye")) routes.push("Eye Contact");
    return routes.length > 0 ? routes.join(", ") : "Inhalation, Skin Contact";
  };

  const getStorage = (name: string) => {
    if (name.toLowerCase().includes("flammable")) return "Fire resistant cabinet";
    return "Cool, dry place, secure container";
  };

  // Split PPE
  const coshhPPEKeywords = ["glove", "mask", "goggle", "glass", "eye", "shield", "respirator", "rpe", "apron", "suit", "coverall", "cream"];
  const coshhPPE = ppe.filter(p => coshhPPEKeywords.some(k => p.toLowerCase().includes(k)));
  const generalPPE = ppe.filter(p => !coshhPPEKeywords.some(k => p.toLowerCase().includes(k)));

  const header = `
    <div class="header-line">
      <h1>COSHH Assessment</h1>
    </div>
  `;

  const projectDetails = `
    <div class="section-block keep-together">
      <h2>1. Assessment Details</h2>
      <table>
        <tr>
          <th width="20%">Company</th>
          <td width="30%">${sanitizeText(companyName)}</td>
          <th width="20%">Client</th>
          <td width="30%">${sanitizeText(clientName)}</td>
        </tr>
        <tr>
          <th>Site Address</th>
          <td colspan="3">${sanitizeText(siteAddress)}</td>
        </tr>
        <tr>
          <th>Assessor</th>
          <td>${sanitizeText(assessorName)}</td>
          <th>Date</th>
          <td>${assessmentDate}</td>
        </tr>
        <tr>
          <th>Project Ref</th>
          <td>${sanitizeText(projectRef)}</td>
          <th>Review Date</th>
          <td>${sanitizeText(data.reviewDate || "")}</td>
        </tr>
      </table>
    </div>
  `;

  const substanceRowsPromises = allSubstances.map(async s => {
    // @ts-ignore
    const libEntry = COSHH_LIBRARY[s.name];
    const substanceData = (libEntry && libEntry[0]) ? { ...s, ...libEntry[0] } : s;

    const risk = substanceData.riskLevel || getRiskLevel(substanceData.hazard);
    const riskClass = risk === "High" ? "risk-high" : risk === "Medium" ? "risk-med" : "risk-low";
    const ghsType = mapStringToHazardClass(substanceData.hazard);
    const ghsIconSvg = ghsType ? GHS_ICON_MAP[ghsType] : null;

    // Convert to PNG if icon exists
    const ghsIcon = ghsIconSvg ? await svgToPngDataUri(ghsIconSvg, 64, 64) : null;

    return `
      <tr>
        <td width="20%" class="bold">${sanitizeText(substanceData.name)}</td>
        <td width="20%">
          ${ghsIcon ? `<img src="${ghsIcon}" width="24" height="24" class="pdf-sign" style="width: 24px; height: 24px; margin-right: 5px;" />` : ""}
          ${sanitizeText(substanceData.hazard)}
        </td>
        <td width="15%" class="small">${substanceData.exposureRoutes || getExposureRoutes(substanceData.hazard)}</td>
        <td width="25%">${sanitizeText(substanceData.control)}</td>
        <td width="15%" class="small">${substanceData.storage || getStorage(substanceData.name)}</td>
        <td width="5%" class="risk-score ${riskClass}">${risk}</td>
      </tr>
    `;
  });

  const substanceRows = (await Promise.all(substanceRowsPromises)).join("");

  const substancesHTML = `
    <div class="section-block">
      <h2>2. Hazardous Substances</h2>
      <table>
        <thead>
          <tr>
            <th>Substance / Product</th>
            <th>Hazards / Health Effects</th>
            <th>Exposure Routes</th>
            <th>Control Measures</th>
            <th>Storage & Disposal</th>
            <th>Risk</th>
          </tr>
        </thead>
        <tbody>
          ${substanceRows.length > 0 ? substanceRows : "<tr><td colspan='6'>No specific substances listed.</td></tr>"}
        </tbody>
      </table>
    </div>
  `;

  const contextHTML = `
    <div class="section-block">
      <h2>3. Exposure & Work Context</h2>
      <div style="border: 1px solid #000; padding: 10px;">
        <ul style="margin: 0; padding-left: 20px;">
          <li style="margin-bottom: 6px;"><strong>Work Activity:</strong> ${sanitizeText(workActivity)}</li>
          <li style="margin-bottom: 6px;"><strong>Location / Environment:</strong> ${sanitizeText(siteAddress)}</li>
          <li style="margin-bottom: 6px;"><strong>Duration of Exposure:</strong> ${sanitizeText(exposureDuration)}</li>
          <li style="margin-bottom: 6px;"><strong>Frequency of Exposure:</strong> ${sanitizeText(exposureFrequency)}</li>
          <li style="margin-bottom: 6px;"><strong>Persons Exposed:</strong> ${personsExposed.join(", ") || "Operatives only"}</li>
        </ul>
      </div>
    </div>
  `;

  const coshhPPEHTMLPromises = coshhPPE.map(async item => {
    const type = mapStringToPpeType(item);
    const iconSvg = type ? PPE_ICON_MAP[type] : null;

    // Convert to PNG if icon exists
    const icon = iconSvg ? await svgToPngDataUri(iconSvg, 64, 64) : null;

    return `
      <div style="display: inline-block; border: 1px solid #0b2040; background-color: #f0f9ff; padding: 6px 10px; margin: 4px; border-radius: 4px; font-size: 9pt; text-align: center; min-width: 80px; vertical-align: top;">
        ${icon ? `<img src="${icon}" width="32" height="32" class="pdf-sign-large" style="width: 32px; height: 32px;" />` : ""}
        <strong>${item}</strong>
      </div>
    `;
  });

  const coshhPPEHTML = (await Promise.all(coshhPPEHTMLPromises)).join("");

  const generalPPEHTMLPromises = generalPPE.map(async item => {
    const type = mapStringToPpeType(item);
    const iconSvg = type ? PPE_ICON_MAP[type] : null;

    // Convert to PNG if icon exists
    const icon = iconSvg ? await svgToPngDataUri(iconSvg, 64, 64) : null;

    return `
      <div style="display: inline-block; border: 1px solid #ccc; padding: 6px 10px; margin: 4px; border-radius: 4px; font-size: 9pt; text-align: center; min-width: 80px; vertical-align: top;">
        ${icon ? `<img src="${icon}" width="32" height="32" class="pdf-sign-large" style="width: 32px; height: 32px;" />` : ""}
        <strong>${item}</strong>
      </div>
    `;
  });

  const generalPPEHTML = (await Promise.all(generalPPEHTMLPromises)).join("");

  const ppeHTML = `
    <div class="section-block">
      <h2>4. PPE Requirements</h2>
      
      <div style="margin-bottom: 10px;">
        <h3 style="font-size: 10pt; margin-bottom: 5px;">COSHH Specific PPE (Mandatory for these substances)</h3>
        ${coshhPPEHTML.length > 0 ? coshhPPEHTML : "<p>No specific COSHH PPE identified (Standard site PPE applies).</p>"}
      </div>

      <div>
        <h3 style="font-size: 10pt; margin-bottom: 5px;">General Site PPE</h3>
        ${generalPPEHTML.length > 0 ? generalPPEHTML : "<p>Standard site PPE.</p>"}
      </div>
    </div>
  `;

  const controlsHTML = `
    <div class="section-block">
      <h2>5. Additional Control Measures</h2>
      <div style="padding: 5px;">
        ${sanitizeText(additionalControls).split('\n').map(line => line.trim() ? `<p>• ${line}</p>` : '').join('')}
      </div>
    </div>
  `;

  const emergencyHTML = `
    <div class="section-block">
      <h2>6. Emergency Procedures</h2>
      <div style="padding: 5px;">
        ${sanitizeText(emergencyProcedures).split('\n').map(line => line.trim() ? `<p>• ${line}</p>` : '').join('')}
      </div>
    </div>
  `;

  const signatureHTML = `
    <div class="signature-block keep-together">
      <h3 style="margin-top: 0; text-align: center; border-bottom: 1px solid #000; padding-bottom: 10px;">7. Assessment Authorization</h3>
      
      <div class="signature-section" style="margin-top: 15px;">
        <p><strong>Assessor Sign-off:</strong> I confirm that this assessment is suitable and sufficient.</p>
        <table style="border: none;">
          <tr style="border: none;">
            <td style="border: none; padding: 10px 0;"><strong>Name:</strong> ${sanitizeText(assessorName)}</td>
            <td style="border: none; padding: 10px 0;"><strong>Signature:</strong> ____________________</td>
            <td style="border: none; padding: 10px 0;"><strong>Date:</strong> ${assessmentDate}</td>
          </tr>
        </table>
      </div>

      <div class="signature-section" style="margin-top: 15px; border-top: 1px dashed #ccc; padding-top: 15px;">
        <p><strong>Operative Acknowledgement:</strong> I have read and understood this COSHH assessment.</p>
        <table style="border: none; margin-top: 10px;">
          <tr style="border: none;">
            <td style="border: none; width: 50%;"><strong>Name:</strong> ____________________</td>
            <td style="border: none; width: 50%;"><strong>Signature:</strong> ____________________</td>
          </tr>
          <tr style="border: none;">
            <td style="border: none; width: 50%;"><strong>Name:</strong> ____________________</td>
            <td style="border: none; width: 50%;"><strong>Signature:</strong> ____________________</td>
          </tr>
        </table>
      </div>
    </div>
  `;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${sanitizeText(documentName)}</title>
      <style>
        ${RAMS_STYLES}
      </style>
    </head>
    <body>
      <div class="rams-content">
        ${header}
        ${projectDetails}
        ${substancesHTML}
        ${contextHTML}
        ${ppeHTML}
        ${controlsHTML}
        ${emergencyHTML}
        ${signatureHTML}
      </div>
    </body>
    </html>
  `;
}
