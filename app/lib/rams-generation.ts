import { HAZARD_DATA, TRADES } from "./constants";
import { METHOD_STATEMENTS, PPE_DEFINITIONS, COSHH_LIBRARY } from "./rams-content";

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
function generatePPE(hazards: string[], trade: string): string[] {
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

export function generateRAMSHTML(data: RAMSData): string {
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
  const coshh = generateCOSHH(hazards);

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
        <th>Project Ref</th>
        <td>${sanitizeText(projectRef || "—")}</td>
      </tr>
      <tr>
        <th>Prepared By</th>
        <td>${sanitizeText(contactName)}</td>
        <th>Date</th>
        <td>${startDate}</td>
      </tr>
    </table>
  `;

  // 3. Scope of Works & Extra Details
  const extraDetails = extraData && Object.keys(extraData).length > 0
    ? Object.entries(extraData).map(([key, value]) => `
      <h3>${key.replace(/_/g, " ")}</h3>
      <p>${sanitizeText(value)}</p>
    `).join("")
    : "";

  const scopeSection = `
    <h2>2. Scope of Works</h2>
    <div style="margin-bottom: 15px;">
      ${sanitizeText(scope).split('\n').map(line => `<p>${line}</p>`).join('')}
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
      <h2>3. Pre-Start Safety Checklist</h2>
      <table>
        <tr>
          <th>#</th>
          <th>Check / Question</th>
          <th>Status</th>
        </tr>
        ${checklistRows}
      </table>
    `;
  }

  // 5. Hazards
  const hazardRows = hazards.map((hKey: string) => {
    // @ts-ignore
    const h = HAZARD_DATA[hKey];
    if (!h) return "";

    let scoreClass = "risk-low";
    if (h.initial_score.includes("High")) scoreClass = "risk-high";
    else if (h.initial_score.includes("Medium")) scoreClass = "risk-med";

    return `
      <tr>
        <td width="20%" class="bold">${h.label}</td>
        <td width="25%">${h.risk}</td>
        <td width="30%">${h.control}</td>
        <td width="10%" class="risk-score ${scoreClass}">${h.initial_score}</td>
        <td width="15%" class="risk-score risk-low">${h.residual_score}</td>
      </tr>
    `;
  }).join("");

  const hazardsHTML = `
    <h2>4. Risk Assessment (Hazards & Controls)</h2>
    <p>The following hazards have been identified. Control measures must be implemented before work starts.</p>
    
    <div style="margin-bottom: 10px; font-size: 8pt; border: 1px solid #ccc; padding: 5px;">
      <strong>Risk Index Legend:</strong> 
      <span class="risk-score risk-low" style="padding: 2px 5px;">Low (1-5)</span>
      <span class="risk-score risk-med" style="padding: 2px 5px;">Medium (6-12)</span>
      <span class="risk-score risk-high" style="padding: 2px 5px;">High (15-25)</span>
    </div>

    <table>
      <tr>
        <th>Hazard</th>
        <th>Risk / Consequence</th>
        <th>Control Measures</th>
        <th>Initial Risk</th>
        <th>Residual Risk</th>
      </tr>
      ${hazardRows}
    </table>
  `;

  // 6. Method Statement
  const methodRows = methodSteps.map((step: string, index: number) => `
    <div style="margin-bottom: 8px; page-break-inside: avoid;">
      <p><strong>Step ${index + 1}:</strong> ${step}</p>
    </div>
  `).join("");

  const methodHTML = `
    <h2>5. Method Statement</h2>
    ${methodRows}
  `;

  // 7. COSHH
  const coshhRows = coshh.map((c: any) => `
    <tr>
      <td class="bold">${c.substance}</td>
      <td>${c.hazard}</td>
      <td>${c.control}</td>
    </tr>
  `).join("");

  const coshhHTML = coshh.length > 0 ? `
    <h2>6. COSHH Assessment</h2>
    <table>
      <tr>
        <th>Substance</th>
        <th>Hazard</th>
        <th>Control Measures</th>
      </tr>
      ${coshhRows}
    </table>
  ` : "";

  // 8. PPE
  const ppeList = ppe.map((item: string) => `
    <div style="display: inline-block; border: 1px solid #ccc; padding: 8px 12px; margin: 4px; border-radius: 4px; font-size: 9pt; text-align: center; min-width: 80px;">
      <strong>${item}</strong>
    </div>
  `).join("");

  const ppeHTML = `
    <h2>7. PPE Requirements</h2>
    <div style="margin-bottom: 15px;">
      ${ppeList}
    </div>
  `;

  // 9. Emergency & Operatives
  const operativesHTML = `
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

    <div style="page-break-before: always;"></div>
    <h2>9. Operative Acknowledgement</h2>
    <p>By signing below, ${terms.we.toLowerCase()} confirm ${terms.we.toLowerCase()} have read and understood this RAMS and will work in accordance with the control measures and method statement.</p>
    
    <table>
      <tr>
        <th width="30%">Name</th>
        <th width="20%">Role</th>
        <th width="20%">Date</th>
        <th width="30%">Signature</th>
      </tr>
      ${Array.from({ length: Math.max(1, Number(operatives) || 1) }).map(() => `
        <tr>
          <td style="height: 50px;"></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      `).join("")}
    </table>
  `;

  // 10. Authorization
  const authorizationHTML = `
    <div style="page-break-inside: avoid; margin-top: 30px; border: 1px solid #000; padding: 20px;">
      <h3 style="margin-top: 0; text-align: center; border-bottom: 1px solid #000; padding-bottom: 10px;">10. Authorization & Approval</h3>
      
      <div style="margin-top: 20px;">
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

      <div style="margin-top: 20px; border-top: 1px dashed #ccc; padding-top: 20px;">
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
        ${operativesHTML}
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
    .rams-content {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 10pt;
      line-height: 1.4;
      color: #111;
      margin: 0;
      padding: 0;
      width: 100%;
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
      margin-top: 25px;
      margin-bottom: 10px;
      border-bottom: 1px solid #000;
      padding-bottom: 5px;
      page-break-after: avoid;
      width: 100%;
    }
    h3 {
      font-size: 11pt;
      font-weight: bold;
      margin-top: 15px;
      margin-bottom: 5px;
      text-transform: uppercase;
      color: #333;
    }
    p {
      margin-bottom: 8px;
      text-align: justify;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 15px;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #000;
      padding: 8px;
      vertical-align: top;
      text-align: left;
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
    
    /* Print specific */
    @media print {
      .rams-content { padding: 0; }
      .no-break { page-break-inside: avoid; }
      h2 { page-break-after: avoid; }
    }
`;
