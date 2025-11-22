// app/lib/constants.ts

// ==========================================
// 1. TYPE DEFINITIONS
// ==========================================

export type HazardKey = string;

export interface HazardDef {
  label: string;
  risk: string;
  control: string;
  initial_score: string; 
  residual_score: string; 
}

export interface QuestionDef {
  id: string;
  label: string;
  type?: "yesno" | "text";
}

export interface JobCluster {
  desc: string;
  hazards: string[];
  questions: QuestionDef[];
  ppe?: string[];
  method_outline?: string[]; 
}

// ==========================================
// 2. MASTER HAZARD DATABASE
// ==========================================

export const HAZARD_DATA: Record<string, HazardDef> = {
  live_electricity: { label: "Live Electricity", risk: "Electrocution, burns, fire, fatal injury.", control: "Safe isolation (LOTO), calibrated voltage indicator, insulated tools, RCD protection.", initial_score: "High (20)", residual_score: "Low (4)" },
  gas: { label: "Gas Supply", risk: "Explosion, asphyxiation, carbon monoxide poisoning.", control: "Gas Safe registered engineer, leak detection fluid, adequate ventilation, isolation.", initial_score: "High (25)", residual_score: "Low (5)" },
  work_at_height: { label: "Working at Height", risk: "Falls from height, falling objects, serious injury.", control: "Scaffold/tower preferred, ladder tied off (3-points of contact), exclusion zones below.", initial_score: "High (20)", residual_score: "Low (5)" },
  manual_handling: { label: "Manual Handling", risk: "Musculoskeletal injury, strains, drops.", control: "Mechanical aids (trolleys), team lifting, load assessment, gloves/boots.", initial_score: "Medium (12)", residual_score: "Low (4)" },
  dust_fumes: { label: "Dust & Fumes", risk: "Respiratory issues, eye irritation, asthma.", control: "Local exhaust ventilation (LEV), water suppression, FFP3 masks, eye protection.", initial_score: "Medium (12)", residual_score: "Low (4)" },
  noise_vibration: { label: "Noise & Vibration", risk: "Hearing loss, tinnitus, HAVS.", control: "Ear defenders/plugs, limited trigger time, rotation of tasks, low-vibration tools.", initial_score: "Medium (12)", residual_score: "Low (4)" },
  hot_work: { label: "Hot Works / Fire", risk: "Ignition of materials, burns, smoke inhalation.", control: "Hot work permit, extinguisher nearby, 1-hour fire watch, removal of combustibles.", initial_score: "High (16)", residual_score: "Medium (8)" },
  silica_dust: { label: "Silica Dust", risk: "Silicosis, lung disease, cancer.", control: "On-tool extraction, wet cutting, FFP3 respiratory protection (Face Fit tested).", initial_score: "High (20)", residual_score: "Low (5)" },
  asbestos: { label: "Asbestos Risk", risk: "Lung disease, asbestosis, mesothelioma.", control: "Asbestos survey review, stop work immediately if suspected, licensed contractor only.", initial_score: "High (25)", residual_score: "Low (5)" },
  chemical_coshh: { label: "Chemicals / COSHH", risk: "Skin burns, dermatitis, inhalation, poisoning.", control: "COSHH assessment read, specific PPE (gloves/goggles), ventilation, spill kit availability.", initial_score: "Medium (12)", residual_score: "Low (4)" },
  slips_trips: { label: "Slips, Trips & Falls", risk: "Impact injury, fractures, bruising.", control: "Good housekeeping, cable management, adequate lighting, clear walkways.", initial_score: "Medium (9)", residual_score: "Low (3)" },
  moving_vehicles: { label: "Moving Vehicles", risk: "Crushing, impact, fatal injury.", control: "Traffic management plan, banksman, high-vis clothing, segregated pedestrian routes.", initial_score: "High (20)", residual_score: "Low (5)" },
  public_interface: { label: "Public / Occupants", risk: "Injury to third parties, unauthorized access.", control: "Barriers, signage, tool supervision, safe access routes, exclusion zones.", initial_score: "High (15)", residual_score: "Low (5)" },
  lone_working: { label: "Lone Working", risk: "Unable to summon help, increased vulnerability.", control: "Check-in procedure, charged mobile phone, no high-risk tasks alone.", initial_score: "Medium (12)", residual_score: "Low (6)" },
  confined_space: { label: "Confined Space", risk: "Asphyxiation, toxic gas, entrapment.", control: "Gas monitoring, top man, rescue plan, permit to work, breathing apparatus.", initial_score: "High (25)", residual_score: "Medium (10)" },
  structural_collapse: { label: "Structural Instability", risk: "Crushing, burial, collapse.", control: "Temporary supports (acrows), structural engineer design, method statement.", initial_score: "High (25)", residual_score: "Low (5)" },
  excavation: { label: "Excavation", risk: "Trench collapse, striking services, falling in.", control: "CAT scan, trench support (shoring), barriers, safe access/egress (ladder).", initial_score: "High (20)", residual_score: "Low (5)" },
  plant_machinery: { label: "Plant & Machinery", risk: "Entanglement, crushing, noise.", control: "Trained operators (CPCS), guards in place, isolation keys removed when unattended.", initial_score: "High (20)", residual_score: "Low (5)" },
  environmental_weather: { label: "Weather / Environment", risk: "Cold/Heat stress, slippery surfaces, wind.", control: "Monitor forecast, appropriate clothing, stop work in high winds.", initial_score: "Medium (10)", residual_score: "Low (4)" },
  fire_explosion: { label: "Fire & Explosion", risk: "Burns, smoke inhalation, property damage.", control: "Fire extinguishers, clear exit routes, control of ignition sources.", initial_score: "High (20)", residual_score: "Medium (8)" },
  biological: { label: "Biological Hazards", risk: "Infection, Weil's disease, sickness.", control: "Good hygiene, gloves, cover wounds, welfare facilities.", initial_score: "High (15)", residual_score: "Low (5)" },
  falling_objects: { label: "Falling Objects", risk: "Head injury, impact.", control: "Hard hats, toe boards, exclusion zones, tool lanyards.", initial_score: "High (15)", residual_score: "Low (3)" },
  underground_services: { label: "Underground Services", risk: "Electrocution, gas strike, explosion.", control: "CAT scan, safe digging practice, review utility plans.", initial_score: "High (25)", residual_score: "Low (5)" },
  fragile_surfaces: { label: "Fragile Surfaces", risk: "Falls through roof/skylights.", control: "Crawling boards, harnesses, nets.", initial_score: "High (25)", residual_score: "Medium (10)" },
  water_ingress: { label: "Water Ingress", risk: "Property damage, electrical short circuits, slips.", control: "Temporary sheeting, pump availability, isolation of water.", initial_score: "Medium (9)", residual_score: "Low (3)" },
  sharp_objects: { label: "Sharp Objects", risk: "Cuts, lacerations.", control: "Kevlar gloves, safe disposal of blades/sharps.", initial_score: "Medium (9)", residual_score: "Low (3)" },
  poor_lighting: { label: "Poor Lighting", risk: "Trips, mistakes, eye strain.", control: "Temporary task lighting provided. Torches carried by operatives.", initial_score: "Medium (8)", residual_score: "Low (3)" },
  lead_exposure: { label: "Lead Exposure", risk: "Poisoning.", control: "Gloves, hygiene, cold cutting.", initial_score: "Medium (10)", residual_score: "Low (3)" },
  stored_energy: { label: "Stored Energy", risk: "Shock.", control: "Discharge time.", initial_score: "Medium (12)", residual_score: "Low (4)" },
  scaffold_safety: { label: "Scaffold Safety", risk: "Collapse, falls.", control: "Handover certificate, weekly inspections (Scafftag), load limits respected.", initial_score: "High (20)", residual_score: "Low (5)" },
  glass_sharps: { label: "Glass & Glazing", risk: "Cuts, severance.", control: "Suction lifters, handling gloves, safety glass.", initial_score: "Medium (12)", residual_score: "Low (4)" },
  cement: { label: "Wet Cement/Concrete", risk: "Burns, dermatitis.", control: "Impervious gloves, washing facilities, barrier cream.", initial_score: "Medium (10)", residual_score: "Low (3)" },
  damp_proofing: { label: "Damp Proofing Chemicals", risk: "Inhalation, skin burns.", control: "Ventilation, specific PPE, COSHH data sheet compliance.", initial_score: "Medium (12)", residual_score: "Low (4)" },
  security_risk: { label: "Security", risk: "Theft, unauthorized entry.", control: "Secure site perimeter, lockable storage, removal of valuables.", initial_score: "Medium (9)", residual_score: "Low (3)" },
  heavy_plant: { label: "Heavy Plant", risk: "Crushing, impact.", control: "Banksman, exclusion zones, certified operators.", initial_score: "High (20)", residual_score: "Low (5)" },
  structural_alteration: { label: "Structural Alteration", risk: "Collapse, movement.", control: "Propping, engineering design, sequence of work.", initial_score: "High (25)", residual_score: "Low (5)" },
  power_tools: { label: "Power Tools", risk: "Cuts, vibration, noise.", control: "Guards in place, PAT tested, PPE used.", initial_score: "Medium (12)", residual_score: "Low (4)" },
  services_isolation: { label: "Services Isolation", risk: "Electrocution, flood, gas leak.", control: "LOTO, identification, proving dead.", initial_score: "High (20)", residual_score: "Low (4)" }
};

export const HAZARD_GROUPS = {
  "High Risk": ["live_electricity", "gas", "work_at_height", "confined_space", "structural_collapse", "fire_explosion", "excavation", "asbestos", "scaffold_safety", "heavy_plant"],
  "Health": ["dust_fumes", "silica_dust", "noise_vibration", "chemical_coshh", "biological", "lead_exposure", "cement", "damp_proofing"],
  "Site": ["slips_trips", "moving_vehicles", "public_interface", "lone_working", "environmental_weather", "water_ingress", "poor_lighting", "falling_objects", "security_risk"],
  "Physical": ["manual_handling", "plant_machinery", "underground_services", "sharp_objects", "stored_energy", "glass_sharps", "power_tools", "services_isolation"]
};

// ==========================================
// 3. JOB CLUSTERS (ELECTRICIAN)
// ==========================================

const ELECTRICIAN_CLUSTERS: Record<string, JobCluster> = {
  "Consumer unit/fuse board replacement": {
    desc: "Consumer unit/fuse board replacement involves working on the main electrical distribution equipment that feeds multiple circuits. The task typically includes isolating the incoming supply, safely removing covers, and replacing or modifying protective devices and terminations. Care must be taken to maintain correct circuit identification, earthing, and segregation of conductors. On completion, all affected circuits are tested and the documentation updated to reflect the new arrangement.",
    hazards: ["live_electricity", "manual_handling", "fire_explosion", "public_interface"],
    questions: [
      { id: "q1", label: "Will the consumer unit/fuse board replacement require full isolation of the main incoming supply before any covers are removed?" },
      { id: "q2", label: "Is the area around the consumer unit/fuse board replacement free from stored materials, clutter and other obstructions that could hinder safe access?" },
      { id: "q3", label: "Have you confirmed that all circuits affected by the consumer unit/fuse board replacement are clearly identified and labelled beforehand?" },
      { id: "q4", label: "Is there adequate lighting at the location of the consumer unit/fuse board replacement to safely work inside the enclosure?" },
      { id: "q5", label: "Will test results and circuit schedules be updated immediately after the consumer unit/fuse board replacement is completed?" }
    ]
  },
  "Full house rewire": {
    desc: "Full house rewire involves replacing existing wiring within part or all of a property to bring the installation up to current standards. This usually includes stripping out obsolete cables, installing new routes in walls, floors or ceilings, and fitting new accessories. The work is often phased to keep disruption manageable for occupants and coordinated with other trades. A full set of tests is carried out at the end to verify safety, continuity and protective device performance.",
    hazards: ["live_electricity", "manual_handling", "dust_fumes", "slips_trips", "asbestos"],
    questions: [
      { id: "q1", label: "Will the full house rewire be carried out in phases to minimise disruption to occupants and services?" },
      { id: "q2", label: "Have you checked for possible asbestos-containing materials before starting any chasing or drilling for the full house rewire?" },
      { id: "q3", label: "Is there a clear plan to separate and safely isolate all old wiring during the full house rewire?" },
      { id: "q4", label: "Will you ensure that new cable routes installed during the full house rewire follow recognised safe zones?" },
      { id: "q5", label: "Are arrangements in place to keep escape routes usable while the full house rewire is underway?" }
    ]
  },
  "Partial rewire": {
    desc: "Partial rewire involves replacing existing wiring within part or all of a property to bring the installation up to current standards. This usually includes stripping out obsolete cables, installing new routes in walls, floors or ceilings, and fitting new accessories. The work is often phased to keep disruption manageable for occupants and coordinated with other trades. A full set of tests is carried out at the end to verify safety, continuity and protective device performance.",
    hazards: ["live_electricity", "manual_handling", "dust_fumes", "slips_trips"],
    questions: [
      { id: "q1", label: "Will the partial rewire be carried out in phases to minimise disruption to occupants and services?" },
      { id: "q2", label: "Have you checked for possible asbestos-containing materials before starting any chasing or drilling for the partial rewire?" },
      { id: "q3", label: "Is there a clear plan to separate and safely isolate all old wiring during the partial rewire?" },
      { id: "q4", label: "Will you ensure that new cable routes installed during the partial rewire follow recognised safe zones?" },
      { id: "q5", label: "Are arrangements in place to keep escape routes usable while the partial rewire is underway?" }
    ]
  },
  "New circuit installation": {
    desc: "New circuit installation is carried out within a domestic or small commercial environment to add or alter final circuits. The work typically involves isolating the relevant circuit at the consumer unit, removing any redundant accessories, and installing new cable routes and terminations. Attention is given to routing cables in safe zones, maintaining adequate mechanical protection and ensuring correct circuit ratings. The circuit is then tested for continuity, insulation resistance and earth fault loop impedance before being put back into service.",
    hazards: ["live_electricity", "manual_handling", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you identified and locked off the correct circuit at the consumer unit before starting the new circuit installation?" },
      { id: "q2", label: "Will you confirm with the occupier which rooms or areas will be affected by the new circuit installation in advance?" },
      { id: "q3", label: "Are you planning safe cable routes and fixing methods for the new circuit installation to avoid future damage from screws or nails?" },
      { id: "q4", label: "Is suitable test equipment available and calibrated to verify the safety of the new circuit installation on completion?" },
      { id: "q5", label: "Will all accessories involved in the new circuit installation be checked for secure mounting and correct polarity before energising?" }
    ]
  },
  "Additional sockets install": {
    desc: "Additional sockets install is carried out within a domestic or small commercial environment to add or alter final circuits. The work typically involves isolating the relevant circuit at the consumer unit, removing any redundant accessories, and installing new cable routes and terminations. Attention is given to routing cables in safe zones, maintaining adequate mechanical protection and ensuring correct circuit ratings. The circuit is then tested for continuity, insulation resistance and earth fault loop impedance before being put back into service.",
    hazards: ["live_electricity", "manual_handling", "dust_fumes"],
    questions: [
      { id: "q1", label: "Have you identified and locked off the correct circuit at the consumer unit before starting the additional sockets install?" },
      { id: "q2", label: "Will you confirm with the occupier which rooms or areas will be affected by the additional sockets install in advance?" },
      { id: "q3", label: "Are you planning safe cable routes and fixing methods for the additional sockets install to avoid future damage from screws or nails?" },
      { id: "q4", label: "Is suitable test equipment available and calibrated to verify the safety of the additional sockets install on completion?" },
      { id: "q5", label: "Will all accessories involved in the additional sockets install be checked for secure mounting and correct polarity before energising?" }
    ]
  },
  "Indoor lighting upgrade/replacement": {
    desc: "Indoor lighting upgrade/replacement is carried out within a domestic or small commercial environment to add or alter final circuits. The work typically involves isolating the relevant circuit at the consumer unit, removing any redundant accessories, and installing new cable routes and terminations. Attention is given to routing cables in safe zones, maintaining adequate mechanical protection and ensuring correct circuit ratings. The circuit is then tested for continuity, insulation resistance and earth fault loop impedance before being put back into service.",
    hazards: ["live_electricity", "work_at_height", "manual_handling"],
    questions: [
      { id: "q1", label: "Have you identified and locked off the correct circuit at the consumer unit before starting the indoor lighting upgrade/replacement?" },
      { id: "q2", label: "Will you confirm with the occupier which rooms or areas will be affected by the indoor lighting upgrade/replacement in advance?" },
      { id: "q3", label: "Are you planning safe cable routes and fixing methods for the indoor lighting upgrade/replacement to avoid future damage from screws or nails?" },
      { id: "q4", label: "Is suitable test equipment available and calibrated to verify the safety of the indoor lighting upgrade/replacement on completion?" },
      { id: "q5", label: "Will all accessories involved in the indoor lighting upgrade/replacement be checked for secure mounting and correct polarity before energising?" }
    ]
  },
  "Outdoor/garden lighting install": {
    desc: "Outdoor/garden lighting install focuses on installing or upgrading external luminaires around a property or site. The work includes selecting suitable IP-rated fittings, running cables through appropriate containment or burial depths, and ensuring mechanical protection against damage. Special attention is paid to weatherproof connections, correct earthing and RCD protection for outdoor equipment. Once installed, the lighting is tested for safe operation and aimed or configured to meet the client's requirements.",
    hazards: ["live_electricity", "work_at_height", "environmental_weather", "underground_services"],
    questions: [
      { id: "q1", label: "Will the outdoor/garden lighting install require the use of ladders or other access equipment on uneven or soft ground?" },
      { id: "q2", label: "Have you selected fittings for the outdoor/garden lighting install with an IP rating appropriate for the exposure and environment?" },
      { id: "q3", label: "Are burial depths or protective conduits for any buried cables associated with the outdoor/garden lighting install in line with guidance?" },
      { id: "q4", label: "Will RCD protection be provided or confirmed for the circuits supplying the outdoor/garden lighting install?" },
      { id: "q5", label: "Is there a plan to test the outdoor/garden lighting install after dark or simulate night-time conditions to verify coverage and operation?" }
    ]
  },
  "Fault finding & diagnostics": {
    desc: "Fault finding & diagnostics is a diagnostic task aimed at identifying and rectifying faults within an electrical installation or equipment. It involves gathering information from the client, visually inspecting the system and using test instruments to narrow down the fault location. Repairs may include replacing damaged components, tightening terminations or correcting wiring errors. After the fault is cleared, verification tests are performed to ensure the system is safe and operating normally.",
    hazards: ["live_electricity", "lone_working", "slips_trips"],
    questions: [
      { id: "q1", label: "Will the fault finding & diagnostics begin with confirming the reported symptoms and recent changes to the installation?" },
      { id: "q2", label: "Are you planning to carry out the fault finding & diagnostics using safe isolation wherever live testing is not essential?" },
      { id: "q3", label: "Do you have access to up-to-date drawings or circuit schedules to assist with the fault finding & diagnostics?" },
      { id: "q4", label: "Is there a clear agreement with the client about what level of intrusive work is acceptable during the fault finding & diagnostics?" },
      { id: "q5", label: "Will you document the cause and remedy identified during the fault finding & diagnostics for future reference?" }
    ]
  },
  "EV charger installation": {
    desc: "EV charger installation involves installing or modifying equipment that interfaces with the electrical supply to deliver vehicle charging, renewable generation or standby power. The task typically includes assessing supply capacity, routing suitably sized cabling, and mounting specialist equipment such as charge points, inverters, batteries or generators. Coordination with the Distribution Network Operator and adherence to relevant standards is often required. Commissioning checks confirm correct operation, safe disconnection arrangements and integration with the existing installation.",
    hazards: ["live_electricity", "work_at_height", "manual_handling", "fire_explosion"],
    questions: [
      { id: "q1", label: "Has the existing supply capacity been assessed to confirm it can support the ev charger installation safely?" },
      { id: "q2", label: "Have you checked whether any notification or approval to the Distribution Network Operator is required for the ev charger installation?" },
      { id: "q3", label: "Will the equipment used in the ev charger installation be installed in locations with adequate ventilation and protection from damage?" },
      { id: "q4", label: "Are appropriate means of isolation clearly provided for both AC and DC sides where relevant to the ev charger installation?" },
      { id: "q5", label: "Will manufacturer commissioning procedures for the ev charger installation be followed and documented on completion?" }
    ]
  },
  "EICR testing (domestic)": {
    desc: "EICR testing (domestic) is a primarily inspection-and-testing based task that evaluates the safety and condition of an existing electrical installation. The work generally combines visual checks with instrument tests such as continuity, insulation resistance, polarity, loop impedance and RCD operation. Depending on the environment, circuits may be isolated in sequence to minimise disruption while still obtaining accurate results. Findings are recorded in a formal report, with observations coded and recommendations made where remedial work is required.",
    hazards: ["live_electricity", "slips_trips", "lone_working"],
    questions: [
      { id: "q1", label: "Will you inform the client in advance about any power interruptions required to carry out the eicr testing (domestic)?" },
      { id: "q2", label: "Is access available to all distribution boards and isolation points needed for the eicr testing (domestic)?" },
      { id: "q3", label: "Are test instruments for the eicr testing (domestic) within calibration and suitable for the system voltage and fault levels?" },
      { id: "q4", label: "Will you record all findings from the eicr testing (domestic) using the appropriate report or certificate format?" },
      { id: "q5", label: "Have you arranged a safe system to prevent re-energisation of circuits under test during the eicr testing (domestic)?" }
    ]
  },
  "EICR testing (commercial)": {
    desc: "EICR testing (commercial) is a primarily inspection-and-testing based task that evaluates the safety and condition of an existing electrical installation. The work generally combines visual checks with instrument tests such as continuity, insulation resistance, polarity, loop impedance and RCD operation. Depending on the environment, circuits may be isolated in sequence to minimise disruption while still obtaining accurate results. Findings are recorded in a formal report, with observations coded and recommendations made where remedial work is required.",
    hazards: ["live_electricity", "slips_trips", "lone_working", "public_interface"],
    questions: [
      { id: "q1", label: "Will you inform the client in advance about any power interruptions required to carry out the eicr testing (commercial)?" },
      { id: "q2", label: "Is access available to all distribution boards and isolation points needed for the eicr testing (commercial)?" },
      { id: "q3", label: "Are test instruments for the eicr testing (commercial) within calibration and suitable for the system voltage and fault levels?" },
      { id: "q4", label: "Will you record all findings from the eicr testing (commercial) using the appropriate report or certificate format?" },
      { id: "q5", label: "Have you arranged a safe system to prevent re-energisation of circuits under test during the eicr testing (commercial)?" }
    ]
  },
  "Smoke/heat alarm installation": {
    desc: "Smoke/heat alarm installation relates to low-voltage control, communication or safety systems rather than standard power circuits. The work usually involves running data or signal cables, installing devices such as detectors, cameras or user interfaces, and configuring control equipment. Care is taken to segregate extra-low-voltage wiring from mains circuits, follow manufacturer instructions and maintain network integrity. After installation, functional testing confirms that all devices operate correctly and that any alarms or notifications are delivered as intended.",
    hazards: ["live_electricity", "work_at_height", "manual_handling"],
    questions: [
      { id: "q1", label: "Have you confirmed segregation between mains cabling and the extra-low-voltage wiring used for the smoke/heat alarm installation?" },
      { id: "q2", label: "Will the smoke/heat alarm installation require coordination with IT or security personnel for network access or configuration?" },
      { id: "q3", label: "Are mounting positions for devices associated with the smoke/heat alarm installation chosen to avoid tampering and environmental damage?" },
      { id: "q4", label: "Is provision made for labelling all key components and cables linked to the smoke/heat alarm installation?" },
      { id: "q5", label: "Will a functional test of the smoke/heat alarm installation be carried out with the client present to verify performance and coverage?" }
    ]
  },
  "Fire alarm system installation": {
    desc: "Fire alarm system installation relates to low-voltage control, communication or safety systems rather than standard power circuits. The work usually involves running data or signal cables, installing devices such as detectors, cameras or user interfaces, and configuring control equipment. Care is taken to segregate extra-low-voltage wiring from mains circuits, follow manufacturer instructions and maintain network integrity. After installation, functional testing confirms that all devices operate correctly and that any alarms or notifications are delivered as intended.",
    hazards: ["live_electricity", "work_at_height", "manual_handling", "public_interface"],
    questions: [
      { id: "q1", label: "Have you confirmed segregation between mains cabling and the extra-low-voltage wiring used for the fire alarm system installation?" },
      { id: "q2", label: "Will the fire alarm system installation require coordination with IT or security personnel for network access or configuration?" },
      { id: "q3", label: "Are mounting positions for devices associated with the fire alarm system installation chosen to avoid tampering and environmental damage?" },
      { id: "q4", label: "Is provision made for labelling all key components and cables linked to the fire alarm system installation?" },
      { id: "q5", label: "Will a functional test of the fire alarm system installation be carried out with the client present to verify performance and coverage?" }
    ]
  },
  "Emergency lighting installation": {
    desc: "Emergency lighting installation relates to low-voltage control, communication or safety systems rather than standard power circuits. The work usually involves running data or signal cables, installing devices such as detectors, cameras or user interfaces, and configuring control equipment. Care is taken to segregate extra-low-voltage wiring from mains circuits, follow manufacturer instructions and maintain network integrity. After installation, functional testing confirms that all devices operate correctly and that any alarms or notifications are delivered as intended.",
    hazards: ["live_electricity", "work_at_height", "manual_handling"],
    questions: [
      { id: "q1", label: "Have you confirmed segregation between mains cabling and the extra-low-voltage wiring used for the emergency lighting installation?" },
      { id: "q2", label: "Will the emergency lighting installation require coordination with IT or security personnel for network access or configuration?" },
      { id: "q3", label: "Are mounting positions for devices associated with the emergency lighting installation chosen to avoid tampering and environmental damage?" },
      { id: "q4", label: "Is provision made for labelling all key components and cables linked to the emergency lighting installation?" },
      { id: "q5", label: "Will a functional test of the emergency lighting installation be carried out with the client present to verify performance and coverage?" }
    ]
  },
  "Data cabling / ethernet": {
    desc: "Data cabling / ethernet relates to low-voltage control, communication or safety systems rather than standard power circuits. The work usually involves running data or signal cables, installing devices such as detectors, cameras or user interfaces, and configuring control equipment. Care is taken to segregate extra-low-voltage wiring from mains circuits, follow manufacturer instructions and maintain network integrity. After installation, functional testing confirms that all devices operate correctly and that any alarms or notifications are delivered as intended.",
    hazards: ["live_electricity", "work_at_height", "manual_handling"],
    questions: [
      { id: "q1", label: "Have you confirmed segregation between mains cabling and the extra-low-voltage wiring used for the data cabling / ethernet?" },
      { id: "q2", label: "Will the data cabling / ethernet require coordination with IT or security personnel for network access or configuration?" },
      { id: "q3", label: "Are mounting positions for devices associated with the data cabling / ethernet chosen to avoid tampering and environmental damage?" },
      { id: "q4", label: "Is provision made for labelling all key components and cables linked to the data cabling / ethernet?" },
      { id: "q5", label: "Will a functional test of the data cabling / ethernet be carried out with the client present to verify performance and coverage?" }
    ]
  },
  "CCTV system installation": {
    desc: "CCTV system installation relates to low-voltage control, communication or safety systems rather than standard power circuits. The work usually involves running data or signal cables, installing devices such as detectors, cameras or user interfaces, and configuring control equipment. Care is taken to segregate extra-low-voltage wiring from mains circuits, follow manufacturer instructions and maintain network integrity. After installation, functional testing confirms that all devices operate correctly and that any alarms or notifications are delivered as intended.",
    hazards: ["live_electricity", "work_at_height", "manual_handling", "public_interface"],
    questions: [
      { id: "q1", label: "Have you confirmed segregation between mains cabling and the extra-low-voltage wiring used for the cctv system installation?" },
      { id: "q2", label: "Will the cctv system installation require coordination with IT or security personnel for network access or configuration?" },
      { id: "q3", label: "Are mounting positions for devices associated with the cctv system installation chosen to avoid tampering and environmental damage?" },
      { id: "q4", label: "Is provision made for labelling all key components and cables linked to the cctv system installation?" },
      { id: "q5", label: "Will a functional test of the cctv system installation be carried out with the client present to verify performance and coverage?" }
    ]
  },
  "Door entry/Intercom system": {
    desc: "Door entry/Intercom system relates to low-voltage control, communication or safety systems rather than standard power circuits. The work usually involves running data or signal cables, installing devices such as detectors, cameras or user interfaces, and configuring control equipment. Care is taken to segregate extra-low-voltage wiring from mains circuits, follow manufacturer instructions and maintain network integrity. After installation, functional testing confirms that all devices operate correctly and that any alarms or notifications are delivered as intended.",
    hazards: ["live_electricity", "manual_handling", "public_interface"],
    questions: [
      { id: "q1", label: "Have you confirmed segregation between mains cabling and the extra-low-voltage wiring used for the door entry/intercom system?" },
      { id: "q2", label: "Will the door entry/intercom system require coordination with IT or security personnel for network access or configuration?" },
      { id: "q3", label: "Are mounting positions for devices associated with the door entry/intercom system chosen to avoid tampering and environmental damage?" },
      { id: "q4", label: "Is provision made for labelling all key components and cables linked to the door entry/intercom system?" },
      { id: "q5", label: "Will a functional test of the door entry/intercom system be carried out with the client present to verify performance and coverage?" }
    ]
  },
  "Solar PV installation": {
    desc: "Solar PV installation involves installing or modifying equipment that interfaces with the electrical supply to deliver vehicle charging, renewable generation or standby power. The task typically includes assessing supply capacity, routing suitably sized cabling, and mounting specialist equipment such as charge points, inverters, batteries or generators. Coordination with the Distribution Network Operator and adherence to relevant standards is often required. Commissioning checks confirm correct operation, safe disconnection arrangements and integration with the existing installation.",
    hazards: ["live_electricity", "work_at_height", "manual_handling", "fire_explosion", "environmental_weather", "falling_objects"],
    questions: [
      { id: "q1", label: "Has the existing supply capacity been assessed to confirm it can support the solar pv installation safely?" },
      { id: "q2", label: "Have you checked whether any notification or approval to the Distribution Network Operator is required for the solar pv installation?" },
      { id: "q3", label: "Will the equipment used in the solar pv installation be installed in locations with adequate ventilation and protection from damage?" },
      { id: "q4", label: "Are appropriate means of isolation clearly provided for both AC and DC sides where relevant to the solar pv installation?" },
      { id: "q5", label: "Will manufacturer commissioning procedures for the solar pv installation be followed and documented on completion?" }
    ]
  },
  "Battery storage system installation": {
    desc: "Battery storage system installation involves installing or modifying equipment that interfaces with the electrical supply to deliver vehicle charging, renewable generation or standby power. The task typically includes assessing supply capacity, routing suitably sized cabling, and mounting specialist equipment such as charge points, inverters, batteries or generators. Coordination with the Distribution Network Operator and adherence to relevant standards is often required. Commissioning checks confirm correct operation, safe disconnection arrangements and integration with the existing installation.",
    hazards: ["live_electricity", "manual_handling", "fire_explosion", "stored_energy", "chemical_coshh"],
    questions: [
      { id: "q1", label: "Has the existing supply capacity been assessed to confirm it can support the battery storage system installation safely?" },
      { id: "q2", label: "Have you checked whether any notification or approval to the Distribution Network Operator is required for the battery storage system installation?" },
      { id: "q3", label: "Will the equipment used in the battery storage system installation be installed in locations with adequate ventilation and protection from damage?" },
      { id: "q4", label: "Are appropriate means of isolation clearly provided for both AC and DC sides where relevant to the battery storage system installation?" },
      { id: "q5", label: "Will manufacturer commissioning procedures for the battery storage system installation be followed and documented on completion?" }
    ]
  },
  "Generator installation": {
    desc: "Generator installation (backup power) involves installing or modifying equipment that interfaces with the electrical supply to deliver vehicle charging, renewable generation or standby power. The task typically includes assessing supply capacity, routing suitably sized cabling, and mounting specialist equipment such as charge points, inverters, batteries or generators. Coordination with the Distribution Network Operator and adherence to relevant standards is often required. Commissioning checks confirm correct operation, safe disconnection arrangements and integration with the existing installation.",
    hazards: ["live_electricity", "manual_handling", "fire_explosion", "noise_vibration", "dust_fumes"],
    questions: [
      { id: "q1", label: "Has the existing supply capacity been assessed to confirm it can support the generator installation (backup power) safely?" },
      { id: "q2", label: "Have you checked whether any notification or approval to the Distribution Network Operator is required for the generator installation (backup power)?" },
      { id: "q3", label: "Will the equipment used in the generator installation (backup power) be installed in locations with adequate ventilation and protection from damage?" },
      { id: "q4", label: "Are appropriate means of isolation clearly provided for both AC and DC sides where relevant to the generator installation (backup power)?" },
      { id: "q5", label: "Will manufacturer commissioning procedures for the generator installation (backup power) be followed and documented on completion?" }
    ]
  },
  "Temporary site electrics": {
    desc: "Temporary site electrics involves setting up temporary electrical supplies to support construction or maintenance activities on a site. The task includes installing site distribution boards, routing flexible cables to work areas and providing protected outlets for tools and equipment. The system must be robust enough to withstand site conditions while still allowing safe disconnection and inspection. Regular checks are required to ensure continued safety as the site layout and loading change over time.",
    hazards: ["live_electricity", "slips_trips", "manual_handling", "public_interface"],
    questions: [
      { id: "q1", label: "Have you agreed the loading and number of outlets required for the temporary site electrics with site management?" },
      { id: "q2", label: "Will all distribution boards installed as part of the temporary site electrics be mounted securely and protected from impact and weather?" },
      { id: "q3", label: "Are flexible leads used in the temporary site electrics routed to minimise trip hazards and mechanical damage?" },
      { id: "q4", label: "Is there a plan to carry out regular inspection and testing of the temporary site electrics while the site remains active?" },
      { id: "q5", label: "Have you identified a safe point to isolate the entire temporary site electrics in case of emergency or fault?" }
    ]
  },
  "Cooker/oven/hob wiring": {
    desc: "Cooker/oven/hob wiring is carried out within a domestic or small commercial environment to add or alter final circuits. The work typically involves isolating the relevant circuit at the consumer unit, removing any redundant accessories, and installing new cable routes and terminations. Attention is given to routing cables in safe zones, maintaining adequate mechanical protection and ensuring correct circuit ratings. The circuit is then tested for continuity, insulation resistance and earth fault loop impedance before being put back into service.",
    hazards: ["live_electricity", "manual_handling", "dust_fumes"],
    questions: [
      { id: "q1", label: "Have you identified and locked off the correct circuit at the consumer unit before starting the cooker/oven/hob wiring?" },
      { id: "q2", label: "Will you confirm with the occupier which rooms or areas will be affected by the cooker/oven/hob wiring in advance?" },
      { id: "q3", label: "Are you planning safe cable routes and fixing methods for the cooker/oven/hob wiring to avoid future damage from screws or nails?" },
      { id: "q4", label: "Is suitable test equipment available and calibrated to verify the safety of the cooker/oven/hob wiring on completion?" },
      { id: "q5", label: "Will all accessories involved in the cooker/oven/hob wiring be checked for secure mounting and correct polarity before energising?" }
    ]
  },
  "Electric shower circuit installation": {
    desc: "Electric shower circuit installation is carried out within a domestic or small commercial environment to add or alter final circuits. The work typically involves isolating the relevant circuit at the consumer unit, removing any redundant accessories, and installing new cable routes and terminations. Attention is given to routing cables in safe zones, maintaining adequate mechanical protection and ensuring correct circuit ratings. The circuit is then tested for continuity, insulation resistance and earth fault loop impedance before being put back into service.",
    hazards: ["live_electricity", "water_ingress", "manual_handling", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you identified and locked off the correct circuit at the consumer unit before starting the electric shower circuit installation?" },
      { id: "q2", label: "Will you confirm with the occupier which rooms or areas will be affected by the electric shower circuit installation in advance?" },
      { id: "q3", label: "Are you planning safe cable routes and fixing methods for the electric shower circuit installation to avoid future damage from screws or nails?" },
      { id: "q4", label: "Is suitable test equipment available and calibrated to verify the safety of the electric shower circuit installation on completion?" },
      { id: "q5", label: "Will all accessories involved in the electric shower circuit installation be checked for secure mounting and correct polarity before energising?" }
    ]
  },
  "Loft wiring install": {
    desc: "Loft wiring install is carried out within a domestic or small commercial environment to add or alter final circuits. The work typically involves isolating the relevant circuit at the consumer unit, removing any redundant accessories, and installing new cable routes and terminations. Attention is given to routing cables in safe zones, maintaining adequate mechanical protection and ensuring correct circuit ratings. The circuit is then tested for continuity, insulation resistance and earth fault loop impedance before being put back into service.",
    hazards: ["live_electricity", "work_at_height", "manual_handling", "dust_fumes", "confined_space"],
    questions: [
      { id: "q1", label: "Have you identified and locked off the correct circuit at the consumer unit before starting the loft wiring install?" },
      { id: "q2", label: "Will you confirm with the occupier which rooms or areas will be affected by the loft wiring install in advance?" },
      { id: "q3", label: "Are you planning safe cable routes and fixing methods for the loft wiring install to avoid future damage from screws or nails?" },
      { id: "q4", label: "Is suitable test equipment available and calibrated to verify the safety of the loft wiring install on completion?" },
      { id: "q5", label: "Will all accessories involved in the loft wiring install be checked for secure mounting and correct polarity before energising?" }
    ]
  },
  "Garage/outhouse electrics": {
    desc: "Garage/outhouse electrics is carried out within a domestic or small commercial environment to add or alter final circuits. The work typically involves isolating the relevant circuit at the consumer unit, removing any redundant accessories, and installing new cable routes and terminations. Attention is given to routing cables in safe zones, maintaining adequate mechanical protection and ensuring correct circuit ratings. The circuit is then tested for continuity, insulation resistance and earth fault loop impedance before being put back into service.",
    hazards: ["live_electricity", "manual_handling", "slips_trips", "environmental_weather"],
    questions: [
      { id: "q1", label: "Have you identified and locked off the correct circuit at the consumer unit before starting the garage/outhouse electrics?" },
      { id: "q2", label: "Will you confirm with the occupier which rooms or areas will be affected by the garage/outhouse electrics in advance?" },
      { id: "q3", label: "Are you planning safe cable routes and fixing methods for the garage/outhouse electrics to avoid future damage from screws or nails?" },
      { id: "q4", label: "Is suitable test equipment available and calibrated to verify the safety of the garage/outhouse electrics on completion?" },
      { id: "q5", label: "Will all accessories involved in the garage/outhouse electrics be checked for secure mounting and correct polarity before energising?" }
    ]
  },
  "Extension/renovation first fix": {
    desc: "Extension/renovation first fix is carried out within a domestic or small commercial environment to add or alter final circuits. The work typically involves isolating the relevant circuit at the consumer unit, removing any redundant accessories, and installing new cable routes and terminations. Attention is given to routing cables in safe zones, maintaining adequate mechanical protection and ensuring correct circuit ratings. The circuit is then tested for continuity, insulation resistance and earth fault loop impedance before being put back into service.",
    hazards: ["live_electricity", "manual_handling", "dust_fumes", "slips_trips", "work_at_height"],
    questions: [
      { id: "q1", label: "Have you identified and locked off the correct circuit at the consumer unit before starting the extension/renovation first fix?" },
      { id: "q2", label: "Will you confirm with the occupier which rooms or areas will be affected by the extension/renovation first fix in advance?" },
      { id: "q3", label: "Are you planning safe cable routes and fixing methods for the extension/renovation first fix to avoid future damage from screws or nails?" },
      { id: "q4", label: "Is suitable test equipment available and calibrated to verify the safety of the extension/renovation first fix on completion?" },
      { id: "q5", label: "Will all accessories involved in the extension/renovation first fix be checked for secure mounting and correct polarity before energising?" }
    ]
  },
  "Extension/renovation second fix": {
    desc: "Extension/renovation second fix is carried out within a domestic or small commercial environment to add or alter final circuits. The work typically involves isolating the relevant circuit at the consumer unit, removing any redundant accessories, and installing new cable routes and terminations. Attention is given to routing cables in safe zones, maintaining adequate mechanical protection and ensuring correct circuit ratings. The circuit is then tested for continuity, insulation resistance and earth fault loop impedance before being put back into service.",
    hazards: ["live_electricity", "manual_handling", "dust_fumes", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you identified and locked off the correct circuit at the consumer unit before starting the extension/renovation second fix?" },
      { id: "q2", label: "Will you confirm with the occupier which rooms or areas will be affected by the extension/renovation second fix in advance?" },
      { id: "q3", label: "Are you planning safe cable routes and fixing methods for the extension/renovation second fix to avoid future damage from screws or nails?" },
      { id: "q4", label: "Is suitable test equipment available and calibrated to verify the safety of the extension/renovation second fix on completion?" },
      { id: "q5", label: "Will all accessories involved in the extension/renovation second fix be checked for secure mounting and correct polarity before energising?" }
    ]
  },
  "LED retrofit upgrade": {
    desc: "LED retrofit upgrade focuses on installing or upgrading lighting within commercial or industrial spaces such as offices, shops, warehouses or car parks. The work often involves working at height to access fittings, using appropriate access equipment and coordinating around ongoing operations. Load calculations, emergency coverage and lighting levels must be considered as part of the design. Once complete, the system is tested and any control gear or emergency functions are verified.",
    hazards: ["live_electricity", "work_at_height", "manual_handling"],
    questions: [
      { id: "q1", label: "Will the led retrofit upgrade require work at height using steps, towers or MEWPs in occupied areas?" },
      { id: "q2", label: "Have lighting levels and emergency coverage requirements been reviewed with the client for the led retrofit upgrade?" },
      { id: "q3", label: "Are suitable isolation points identified for the circuits being modified during the led retrofit upgrade?" },
      { id: "q4", label: "Will waste lamps and control gear from the led retrofit upgrade be disposed of in line with WEEE or local regulations?" },
      { id: "q5", label: "Have you scheduled the led retrofit upgrade to minimise disruption to building users and other trades?" }
    ]
  },
  "Commercial lighting upgrade": {
    desc: "Commercial lighting upgrade focuses on installing or upgrading lighting within commercial or industrial spaces such as offices, shops, warehouses or car parks. The work often involves working at height to access fittings, using appropriate access equipment and coordinating around ongoing operations. Load calculations, emergency coverage and lighting levels must be considered as part of the design. Once complete, the system is tested and any control gear or emergency functions are verified.",
    hazards: ["live_electricity", "work_at_height", "manual_handling", "public_interface"],
    questions: [
      { id: "q1", label: "Will the commercial lighting upgrade require work at height using steps, towers or MEWPs in occupied areas?" },
      { id: "q2", label: "Have lighting levels and emergency coverage requirements been reviewed with the client for the commercial lighting upgrade?" },
      { id: "q3", label: "Are suitable isolation points identified for the circuits being modified during the commercial lighting upgrade?" },
      { id: "q4", label: "Will waste lamps and control gear from the commercial lighting upgrade be disposed of in line with WEEE or local regulations?" },
      { id: "q5", label: "Have you scheduled the commercial lighting upgrade to minimise disruption to building users and other trades?" }
    ]
  },
  "Warehouse high-bay lighting": {
    desc: "Warehouse high-bay lighting focuses on installing or upgrading lighting within commercial or industrial spaces such as offices, shops, warehouses or car parks. The work often involves working at height to access fittings, using appropriate access equipment and coordinating around ongoing operations. Load calculations, emergency coverage and lighting levels must be considered as part of the design. Once complete, the system is tested and any control gear or emergency functions are verified.",
    hazards: ["live_electricity", "work_at_height", "manual_handling", "plant_machinery"],
    questions: [
      { id: "q1", label: "Will the warehouse high-bay lighting require work at height using steps, towers or MEWPs in occupied areas?" },
      { id: "q2", label: "Have lighting levels and emergency coverage requirements been reviewed with the client for the warehouse high-bay lighting?" },
      { id: "q3", label: "Are suitable isolation points identified for the circuits being modified during the warehouse high-bay lighting?" },
      { id: "q4", label: "Will waste lamps and control gear from the warehouse high-bay lighting be disposed of in line with WEEE or local regulations?" },
      { id: "q5", label: "Have you scheduled the warehouse high-bay lighting to minimise disruption to building users and other trades?" }
    ]
  },
  "PAT testing": {
    desc: "PAT testing is a primarily inspection-and-testing based task that evaluates the safety and condition of an existing electrical installation. The work generally combines visual checks with instrument tests such as continuity, insulation resistance, polarity, loop impedance and RCD operation. Depending on the environment, circuits may be isolated in sequence to minimise disruption while still obtaining accurate results. Findings are recorded in a formal report, with observations coded and recommendations made where remedial work is required.",
    hazards: ["live_electricity", "slips_trips", "manual_handling"],
    questions: [
      { id: "q1", label: "Will you inform the client in advance about any power interruptions required to carry out the pat testing?" },
      { id: "q2", label: "Is access available to all distribution boards and isolation points needed for the pat testing?" },
      { id: "q3", label: "Are test instruments for the pat testing within calibration and suitable for the system voltage and fault levels?" },
      { id: "q4", label: "Will you record all findings from the pat testing using the appropriate report or certificate format?" },
      { id: "q5", label: "Have you arranged a safe system to prevent re-energisation of circuits under test during the pat testing?" }
    ]
  },
  "Landlord electrical safety pack": {
    desc: "Landlord electrical safety pack is a primarily inspection-and-testing based task that evaluates the safety and condition of an existing electrical installation. The work generally combines visual checks with instrument tests such as continuity, insulation resistance, polarity, loop impedance and RCD operation. Depending on the environment, circuits may be isolated in sequence to minimise disruption while still obtaining accurate results. Findings are recorded in a formal report, with observations coded and recommendations made where remedial work is required.",
    hazards: ["live_electricity", "slips_trips", "lone_working"],
    questions: [
      { id: "q1", label: "Will you inform the client in advance about any power interruptions required to carry out the landlord electrical safety pack?" },
      { id: "q2", label: "Is access available to all distribution boards and isolation points needed for the landlord electrical safety pack?" },
      { id: "q3", label: "Are test instruments for the landlord electrical safety pack within calibration and suitable for the system voltage and fault levels?" },
      { id: "q4", label: "Will you record all findings from the landlord electrical safety pack using the appropriate report or certificate format?" },
      { id: "q5", label: "Have you arranged a safe system to prevent re-energisation of circuits under test during the landlord electrical safety pack?" }
    ]
  },
  "RCD replacement/upgrade": {
    desc: "RCD replacement/upgrade involves working on the main electrical distribution equipment that feeds multiple circuits. The task typically includes isolating the incoming supply, safely removing covers, and replacing or modifying protective devices and terminations. Care must be taken to maintain correct circuit identification, earthing, and segregation of conductors. On completion, all affected circuits are tested and the documentation updated to reflect the new arrangement.",
    hazards: ["live_electricity", "manual_handling", "fire_explosion"],
    questions: [
      { id: "q1", label: "Will the rcd replacement/upgrade require full isolation of the main incoming supply before any covers are removed?" },
      { id: "q2", label: "Is the area around the rcd replacement/upgrade free from stored materials, clutter and other obstructions that could hinder safe access?" },
      { id: "q3", label: "Have you confirmed that all circuits affected by the rcd replacement/upgrade are clearly identified and labelled beforehand?" },
      { id: "q4", label: "Is there adequate lighting at the location of the rcd replacement/upgrade to safely work inside the enclosure?" },
      { id: "q5", label: "Will test results and circuit schedules be updated immediately after the rcd replacement/upgrade is completed?" }
    ]
  },
  "Fuse/breaker fault repair": {
    desc: "Fuse/breaker fault repair involves working on the main electrical distribution equipment that feeds multiple circuits. The task typically includes isolating the incoming supply, safely removing covers, and replacing or modifying protective devices and terminations. Care must be taken to maintain correct circuit identification, earthing, and segregation of conductors. On completion, all affected circuits are tested and the documentation updated to reflect the new arrangement.",
    hazards: ["live_electricity", "manual_handling", "fire_explosion"],
    questions: [
      { id: "q1", label: "Will the fuse/breaker fault repair require full isolation of the main incoming supply before any covers are removed?" },
      { id: "q2", label: "Is the area around the fuse/breaker fault repair free from stored materials, clutter and other obstructions that could hinder safe access?" },
      { id: "q3", label: "Have you confirmed that all circuits affected by the fuse/breaker fault repair are clearly identified and labelled beforehand?" },
      { id: "q4", label: "Is there adequate lighting at the location of the fuse/breaker fault repair to safely work inside the enclosure?" },
      { id: "q5", label: "Will test results and circuit schedules be updated immediately after the fuse/breaker fault repair is completed?" }
    ]
  },
  "Electrical heating system installation": {
    desc: "Electrical heating system installation involves installing or maintaining electric space heating equipment, often integrated within floors or fixed appliances. The work includes routing heating elements or cables, connecting them to dedicated circuits and fitting appropriate controls such as thermostats and timers. Special care is taken to prevent damage to elements during installation and to follow manufacturer limitations on coverings and insulation. Testing ensures correct resistance values, earth continuity and safe operation before the system is handed over.",
    hazards: ["live_electricity", "manual_handling", "slips_trips", "hot_work"],
    questions: [
      { id: "q1", label: "Have you checked the floor or structure is suitable for the electrical heating system installation in terms of insulation and coverings?" },
      { id: "q2", label: "Will the electrical heating system installation be installed on a dedicated circuit with appropriate protective devices?" },
      { id: "q3", label: "Are measures in place during the electrical heating system installation to prevent damage to heating elements or mats before final finishes go down?" },
      { id: "q4", label: "Have you confirmed that the controls for the electrical heating system installation are located where they can be easily and safely accessed?" },
      { id: "q5", label: "Will resistance and insulation readings for the electrical heating system installation be recorded before and after covering the elements?" }
    ]
  },
  "Underfloor electric heating install": {
    desc: "Underfloor electric heating install involves installing or maintaining electric space heating equipment, often integrated within floors or fixed appliances. The work includes routing heating elements or cables, connecting them to dedicated circuits and fitting appropriate controls such as thermostats and timers. Special care is taken to prevent damage to elements during installation and to follow manufacturer limitations on coverings and insulation. Testing ensures correct resistance values, earth continuity and safe operation before the system is handed over.",
    hazards: ["live_electricity", "manual_handling", "slips_trips", "hot_work"],
    questions: [
      { id: "q1", label: "Have you checked the floor or structure is suitable for the underfloor electric heating install in terms of insulation and coverings?" },
      { id: "q2", label: "Will the underfloor electric heating install be installed on a dedicated circuit with appropriate protective devices?" },
      { id: "q3", label: "Are measures in place during the underfloor electric heating install to prevent damage to heating elements or mats before final finishes go down?" },
      { id: "q4", label: "Have you confirmed that the controls for the underfloor electric heating install are located where they can be easily and safely accessed?" },
      { id: "q5", label: "Will resistance and insulation readings for the underfloor electric heating install be recorded before and after covering the elements?" }
    ]
  },
  "Immersion heater install/repair": {
    desc: "Immersion heater install/repair is carried out within a domestic or small commercial environment to add or alter final circuits. The work typically involves isolating the relevant circuit at the consumer unit, removing any redundant accessories, and installing new cable routes and terminations. Attention is given to routing cables in safe zones, maintaining adequate mechanical protection and ensuring correct circuit ratings. The circuit is then tested for continuity, insulation resistance and earth fault loop impedance before being put back into service.",
    hazards: ["live_electricity", "manual_handling", "hot_work", "water_ingress"],
    questions: [
      { id: "q1", label: "Have you identified and locked off the correct circuit at the consumer unit before starting the immersion heater install/repair?" },
      { id: "q2", label: "Will you confirm with the occupier which rooms or areas will be affected by the immersion heater install/repair in advance?" },
      { id: "q3", label: "Are you planning safe cable routes and fixing methods for the immersion heater install/repair to avoid future damage from screws or nails?" },
      { id: "q4", label: "Is suitable test equipment available and calibrated to verify the safety of the immersion heater install/repair on completion?" },
      { id: "q5", label: "Will all accessories involved in the immersion heater install/repair be checked for secure mounting and correct polarity before energising?" }
    ]
  },
  "Security lighting installation": {
    desc: "Security lighting installation focuses on installing or upgrading external luminaires around a property or site. The work includes selecting suitable IP-rated fittings, running cables through appropriate containment or burial depths, and ensuring mechanical protection against damage. Special attention is paid to weatherproof connections, correct earthing and RCD protection for outdoor equipment. Once installed, the lighting is tested for safe operation and aimed or configured to meet the client's requirements.",
    hazards: ["live_electricity", "work_at_height", "environmental_weather", "slips_trips"],
    questions: [
      { id: "q1", label: "Will the security lighting installation require the use of ladders or other access equipment on uneven or soft ground?" },
      { id: "q2", label: "Have you selected fittings for the security lighting installation with an IP rating appropriate for the exposure and environment?" },
      { id: "q3", label: "Are burial depths or protective conduits for any buried cables associated with the security lighting installation in line with guidance?" },
      { id: "q4", label: "Will RCD protection be provided or confirmed for the circuits supplying the security lighting installation?" },
      { id: "q5", label: "Is there a plan to test the security lighting installation after dark or simulate night-time conditions to verify coverage and operation?" }
    ]
  },
  "Floodlight installation": {
    desc: "Floodlight installation focuses on installing or upgrading external luminaires around a property or site. The work includes selecting suitable IP-rated fittings, running cables through appropriate containment or burial depths, and ensuring mechanical protection against damage. Special attention is paid to weatherproof connections, correct earthing and RCD protection for outdoor equipment. Once installed, the lighting is tested for safe operation and aimed or configured to meet the client's requirements.",
    hazards: ["live_electricity", "work_at_height", "environmental_weather", "slips_trips"],
    questions: [
      { id: "q1", label: "Will the floodlight installation require the use of ladders or other access equipment on uneven or soft ground?" },
      { id: "q2", label: "Have you selected fittings for the floodlight installation with an IP rating appropriate for the exposure and environment?" },
      { id: "q3", label: "Are burial depths or protective conduits for any buried cables associated with the floodlight installation in line with guidance?" },
      { id: "q4", label: "Will RCD protection be provided or confirmed for the circuits supplying the floodlight installation?" },
      { id: "q5", label: "Is there a plan to test the floodlight installation after dark or simulate night-time conditions to verify coverage and operation?" }
    ]
  },
  "Smart home automation system": {
    desc: "Smart home automation system relates to low-voltage control, communication or safety systems rather than standard power circuits. The work usually involves running data or signal cables, installing devices such as detectors, cameras or user interfaces, and configuring control equipment. Care is taken to segregate extra-low-voltage wiring from mains circuits, follow manufacturer instructions and maintain network integrity. After installation, functional testing confirms that all devices operate correctly and that any alarms or notifications are delivered as intended.",
    hazards: ["live_electricity", "manual_handling", "dust_fumes"],
    questions: [
      { id: "q1", label: "Have you confirmed segregation between mains cabling and the extra-low-voltage wiring used for the smart home automation system?" },
      { id: "q2", label: "Will the smart home automation system require coordination with IT or security personnel for network access or configuration?" },
      { id: "q3", label: "Are mounting positions for devices associated with the smart home automation system chosen to avoid tampering and environmental damage?" },
      { id: "q4", label: "Is provision made for labelling all key components and cables linked to the smart home automation system?" },
      { id: "q5", label: "Will a functional test of the smart home automation system be carried out with the client present to verify performance and coverage?" }
    ]
  },
  "Thermostat installation (wired)": {
    desc: "Thermostat installation (wired) is carried out within a domestic or small commercial environment to add or alter final circuits. The work typically involves isolating the relevant circuit at the consumer unit, removing any redundant accessories, and installing new cable routes and terminations. Attention is given to routing cables in safe zones, maintaining adequate mechanical protection and ensuring correct circuit ratings. The circuit is then tested for continuity, insulation resistance and earth fault loop impedance before being put back into service.",
    hazards: ["live_electricity", "manual_handling", "dust_fumes"],
    questions: [
      { id: "q1", label: "Have you identified and locked off the correct circuit at the consumer unit before starting the thermostat installation (wired)?" },
      { id: "q2", label: "Will you confirm with the occupier which rooms or areas will be affected by the thermostat installation (wired) in advance?" },
      { id: "q3", label: "Are you planning safe cable routes and fixing methods for the thermostat installation (wired) to avoid future damage from screws or nails?" },
      { id: "q4", label: "Is suitable test equipment available and calibrated to verify the safety of the thermostat installation (wired) on completion?" },
      { id: "q5", label: "Will all accessories involved in the thermostat installation (wired) be checked for secure mounting and correct polarity before energising?" }
    ]
  },
  "Car park lighting installation": {
    desc: "Car park lighting installation focuses on installing or upgrading lighting within commercial or industrial spaces such as offices, shops, warehouses or car parks. The work often involves working at height to access fittings, using appropriate access equipment and coordinating around ongoing operations. Load calculations, emergency coverage and lighting levels must be considered as part of the design. Once complete, the system is tested and any control gear or emergency functions are verified.",
    hazards: ["live_electricity", "work_at_height", "moving_vehicles", "environmental_weather"],
    questions: [
      { id: "q1", label: "Will the car park lighting installation require work at height using steps, towers or MEWPs in occupied areas?" },
      { id: "q2", label: "Have lighting levels and emergency coverage requirements been reviewed with the client for the car park lighting installation?" },
      { id: "q3", label: "Are suitable isolation points identified for the circuits being modified during the car park lighting installation?" },
      { id: "q4", label: "Will waste lamps and control gear from the car park lighting installation be disposed of in line with WEEE or local regulations?" },
      { id: "q5", label: "Have you scheduled the car park lighting installation to minimise disruption to building users and other trades?" }
    ]
  },
  "Shop fit-out electrical works": {
    desc: "Shop fit-out electrical works focuses on installing or upgrading lighting within commercial or industrial spaces such as offices, shops, warehouses or car parks. The work often involves working at height to access fittings, using appropriate access equipment and coordinating around ongoing operations. Load calculations, emergency coverage and lighting levels must be considered as part of the design. Once complete, the system is tested and any control gear or emergency functions are verified.",
    hazards: ["live_electricity", "work_at_height", "manual_handling", "public_interface"],
    questions: [
      { id: "q1", label: "Will the shop fit-out electrical works require work at height using steps, towers or MEWPs in occupied areas?" },
      { id: "q2", label: "Have lighting levels and emergency coverage requirements been reviewed with the client for the shop fit-out electrical works?" },
      { id: "q3", label: "Are suitable isolation points identified for the circuits being modified during the shop fit-out electrical works?" },
      { id: "q4", label: "Will waste lamps and control gear from the shop fit-out electrical works be disposed of in line with WEEE or local regulations?" },
      { id: "q5", label: "Have you scheduled the shop fit-out electrical works to minimise disruption to building users and other trades?" }
    ]
  },
  "Electrical containment install": {
    desc: "Electrical containment install (trunking/conduit/trays) is focused on providing or improving the physical containment and management of electrical cables. This can include installing trunking, conduit, cable tray or basket systems, and reorganising existing wiring to reduce strain and improve safety. Proper support spacing, segregation and fixings are essential to achieve a neat and compliant installation. Once the work is completed, cables are labelled where appropriate and visually checked for damage or undue stress.",
    hazards: ["live_electricity", "work_at_height", "manual_handling", "dust_fumes", "sharp_objects"],
    questions: [
      { id: "q1", label: "Have you planned the routes for the electrical containment install (trunking/conduit/trays) to avoid clashes with other building services?" },
      { id: "q2", label: "Will supports and fixings used in the electrical containment install (trunking/conduit/trays) be suitable for the substrate and load of the cables?" },
      { id: "q3", label: "Are you maintaining separation within the electrical containment install (trunking/conduit/trays) between mains, data and fire alarm cabling where required?" },
      { id: "q4", label: "Will any existing live circuits be adequately protected while undertaking the electrical containment install (trunking/conduit/trays)?" },
      { id: "q5", label: "Is there a final visual inspection step in the electrical containment install (trunking/conduit/trays) to confirm cables are tidy, undamaged and correctly labelled?" }
    ]
  },
  "Cable management upgrade": {
    desc: "Cable management upgrade is focused on providing or improving the physical containment and management of electrical cables. This can include installing trunking, conduit, cable tray or basket systems, and reorganising existing wiring to reduce strain and improve safety. Proper support spacing, segregation and fixings are essential to achieve a neat and compliant installation. Once the work is completed, cables are labelled where appropriate and visually checked for damage or undue stress.",
    hazards: ["live_electricity", "work_at_height", "manual_handling", "dust_fumes", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you planned the routes for the cable management upgrade to avoid clashes with other building services?" },
      { id: "q2", label: "Will supports and fixings used in the cable management upgrade be suitable for the substrate and load of the cables?" },
      { id: "q3", label: "Are you maintaining separation within the cable management upgrade between mains, data and fire alarm cabling where required?" },
      { id: "q4", label: "Will any existing live circuits be adequately protected while undertaking the cable management upgrade?" },
      { id: "q5", label: "Is there a final visual inspection step in the cable management upgrade to confirm cables are tidy, undamaged and correctly labelled?" }
    ]
  },
  "Meter relocation": {
    desc: "Meter relocation (non-DNO) involves working on the main electrical distribution equipment that feeds multiple circuits. The task typically includes isolating the incoming supply, safely removing covers, and replacing or modifying protective devices and terminations. Care must be taken to maintain correct circuit identification, earthing, and segregation of conductors. On completion, all affected circuits are tested and the documentation updated to reflect the new arrangement.",
    hazards: ["live_electricity", "manual_handling", "fire_explosion"],
    questions: [
      { id: "q1", label: "Will the meter relocation (non-dno) require full isolation of the main incoming supply before any covers are removed?" },
      { id: "q2", label: "Is the area around the meter relocation (non-dno) free from stored materials, clutter and other obstructions that could hinder safe access?" },
      { id: "q3", label: "Have you confirmed that all circuits affected by the meter relocation (non-dno) are clearly identified and labelled beforehand?" },
      { id: "q4", label: "Is there adequate lighting at the location of the meter relocation (non-dno) to safely work inside the enclosure?" },
      { id: "q5", label: "Will test results and circuit schedules be updated immediately after the meter relocation (non-dno) is completed?" }
    ]
  },
  "Sub-main installation": {
    desc: "Sub-main installation involves working on the main electrical distribution equipment that feeds multiple circuits. The task typically includes isolating the incoming supply, safely removing covers, and replacing or modifying protective devices and terminations. Care must be taken to maintain correct circuit identification, earthing, and segregation of conductors. On completion, all affected circuits are tested and the documentation updated to reflect the new arrangement.",
    hazards: ["live_electricity", "manual_handling", "fire_explosion", "dust_fumes"],
    questions: [
      { id: "q1", label: "Will the sub-main installation require full isolation of the main incoming supply before any covers are removed?" },
      { id: "q2", label: "Is the area around the sub-main installation free from stored materials, clutter and other obstructions that could hinder safe access?" },
      { id: "q3", label: "Have you confirmed that all circuits affected by the sub-main installation are clearly identified and labelled beforehand?" },
      { id: "q4", label: "Is there adequate lighting at the location of the sub-main installation to safely work inside the enclosure?" },
      { id: "q5", label: "Will test results and circuit schedules be updated immediately after the sub-main installation is completed?" }
    ]
  },
  "Machinery wiring": {
    desc: "Small plant/machinery wiring involves providing electrical supplies to fixed or portable machinery in industrial or agricultural environments. The task may include installing new circuits, control gear, isolators and connection points rated for the duty and environmental conditions. Consideration is given to mechanical protection, emergency stop arrangements and coordination with mechanical installation teams. Final testing confirms correct rotation, control function and protective device performance.",
    hazards: ["live_electricity", "plant_machinery", "manual_handling", "noise_vibration"],
    questions: [
      { id: "q1", label: "Have machine-specific manuals been reviewed before starting the small plant/machinery wiring?" },
      { id: "q2", label: "Will the small plant/machinery wiring require lockout-tagout procedures to isolate mechanical and electrical energy sources?" },
      { id: "q3", label: "Are cable types and glands chosen for the small plant/machinery wiring suitable for vibration, moisture and chemical exposure?" },
      { id: "q4", label: "Is it necessary to coordinate the small plant/machinery wiring with production schedules to avoid unplanned downtime?" },
      { id: "q5", label: "Will functional testing after the small plant/machinery wiring include verifying emergency stops and interlocks operate correctly? " }
    ]
  },
  "Agricultural electrics": {
    desc: "Agricultural/warehouse electrics involves providing electrical supplies to fixed or portable machinery in industrial or agricultural environments. The task may include installing new circuits, control gear, isolators and connection points rated for the duty and environmental conditions. Consideration is given to mechanical protection, emergency stop arrangements and coordination with mechanical installation teams. Final testing confirms correct rotation, control function and protective device performance.",
    hazards: ["live_electricity", "environmental_weather", "biological", "plant_machinery"],
    questions: [
      { id: "q1", label: "Have machine-specific manuals been reviewed before starting the agricultural/warehouse electrics?" },
      { id: "q2", label: "Will the agricultural/warehouse electrics require lockout-tagout procedures to isolate mechanical and electrical energy sources?" },
      { id: "q3", label: "Are cable types and glands chosen for the agricultural/warehouse electrics suitable for vibration, moisture and chemical exposure?" },
      { id: "q4", label: "Is it necessary to coordinate the agricultural/warehouse electrics with production schedules to avoid unplanned downtime?" },
      { id: "q5", label: "Will functional testing after the agricultural/warehouse electrics include verifying emergency stops and interlocks operate correctly?" }
    ]
  },
  "EV charging infrastructure (multi-bay)": {
    desc: "EV charging infrastructure (multi-bay) involves installing or modifying equipment that interfaces with the electrical supply to deliver vehicle charging, renewable generation or standby power. The task typically includes assessing supply capacity, routing suitably sized cabling, and mounting specialist equipment such as charge points, inverters, batteries or generators. Coordination with the Distribution Network Operator and adherence to relevant standards is often required. Commissioning checks confirm correct operation, safe disconnection arrangements and integration with the existing installation.",
    hazards: ["live_electricity", "work_at_height", "manual_handling", "fire_explosion", "moving_vehicles"],
    questions: [
      { id: "q1", label: "Has the existing supply capacity been assessed to confirm it can support the ev charging infrastructure (multi-bay) safely?" },
      { id: "q2", label: "Have you checked whether any notification or approval to the Distribution Network Operator is required for the ev charging infrastructure (multi-bay)?" },
      { id: "q3", label: "Will the equipment used in the ev charging infrastructure (multi-bay) be installed in locations with adequate ventilation and protection from damage?" },
      { id: "q4", label: "Are appropriate means of isolation clearly provided for both AC and DC sides where relevant to the ev charging infrastructure (multi-bay)?" },
      { id: "q5", label: "Will manufacturer commissioning procedures for the ev charging infrastructure (multi-bay) be followed and documented on completion?" }
    ]
  },
  "Other (Custom)": {
    desc: "",
    hazards: [],
    questions: [
      { id: "q1", label: "Have you identified all specific hazards associated with this custom task?" },
      { id: "q2", label: "Do you have the correct tools and equipment for this specific work?" },
      { id: "q3", label: "Has a dynamic risk assessment been carried out?" },
      { id: "q4", label: "Are you competent to undertake this specific custom task?" },
      { id: "q5", label: "Have you agreed the scope fully with the client?" }
    ]
  }
};

// app/lib/constants.ts - PART 2 OF 4

// --- 3. PLUMBER CLUSTERS (FULL 50 JOBS) ---
const PLUMBER_CLUSTERS = {
  "Boiler installation (gas)": {
    desc: "Boiler installation (gas) involves working on domestic wet heating systems to provide reliable space and water heating. The task typically includes isolating gas, water and electrical supplies, removing or modifying existing appliances or components, and connecting new equipment in line with design requirements. Flue routes, ventilation and condensate disposal must be checked to ensure they comply with current standards. On completion, the system is filled, purged and commissioned, with safety checks and settings documented for the householder.",
    hazards: ["gas", "hot_work", "manual_handling", "chemical_coshh", "dust_fumes"],
    questions: [
      { id: "q1", label: "Have you confirmed that the existing flue and ventilation arrangements are suitable for the boiler installation (gas)?" },
      { id: "q2", label: "Will the gas, water and electrical supplies all be safely isolated before starting the boiler installation (gas)?" },
      { id: "q3", label: "Is there adequate space around the appliance location to carry out the boiler installation (gas) without creating access hazards?" },
      { id: "q4", label: "Have you planned how you will flush, fill and vent the system after completing the boiler installation (gas)?" },
      { id: "q5", label: "Will the homeowner be shown how to operate controls and isolate the system following the boiler installation (gas)?" }
    ]
  },
  "Combi boiler swap": {
    desc: "Combi boiler swap involves working on domestic wet heating systems to provide reliable space and water heating. The task typically includes isolating gas, water and electrical supplies, removing or modifying existing appliances or components, and connecting new equipment in line with design requirements. Flue routes, ventilation and condensate disposal must be checked to ensure they comply with current standards. On completion, the system is filled, purged and commissioned, with safety checks and settings documented for the householder.",
    hazards: ["gas", "hot_work", "manual_handling", "chemical_coshh", "dust_fumes"],
    questions: [
      { id: "q1", label: "Have you confirmed that the existing flue and ventilation arrangements are suitable for the combi boiler swap?" },
      { id: "q2", label: "Will the gas, water and electrical supplies all be safely isolated before starting the combi boiler swap?" },
      { id: "q3", label: "Is there adequate space around the appliance location to carry out the combi boiler swap without creating access hazards?" },
      { id: "q4", label: "Have you planned how you will flush, fill and vent the system after completing the combi boiler swap?" },
      { id: "q5", label: "Will the homeowner be shown how to operate controls and isolate the system following the combi boiler swap?" }
    ]
  },
  "Boiler service": {
    desc: "Boiler service involves working on domestic wet heating systems to provide reliable space and water heating. The task typically includes isolating gas, water and electrical supplies, removing or modifying existing appliances or components, and connecting new equipment in line with design requirements. Flue routes, ventilation and condensate disposal must be checked to ensure they comply with current standards. On completion, the system is filled, purged and commissioned, with safety checks and settings documented for the householder.",
    hazards: ["gas", "hot_work", "manual_handling", "chemical_coshh", "dust_fumes"],
    questions: [
      { id: "q1", label: "Have you confirmed that the existing flue and ventilation arrangements are suitable for the boiler service?" },
      { id: "q2", label: "Will the gas, water and electrical supplies all be safely isolated before starting the boiler service?" },
      { id: "q3", label: "Is there adequate space around the appliance location to carry out the boiler service without creating access hazards?" },
      { id: "q4", label: "Have you planned how you will flush, fill and vent the system after completing the boiler service?" },
      { id: "q5", label: "Will the homeowner be shown how to operate controls and isolate the system following the boiler service?" }
    ]
  },
  "Boiler repair": {
    desc: "Boiler repair involves working on domestic wet heating systems to provide reliable space and water heating. The task typically includes isolating gas, water and electrical supplies, removing or modifying existing appliances or components, and connecting new equipment in line with design requirements. Flue routes, ventilation and condensate disposal must be checked to ensure they comply with current standards. On completion, the system is filled, purged and commissioned, with safety checks and settings documented for the householder.",
    hazards: ["gas", "hot_work", "manual_handling", "chemical_coshh", "dust_fumes"],
    questions: [
      { id: "q1", label: "Have you confirmed that the existing flue and ventilation arrangements are suitable for the boiler repair?" },
      { id: "q2", label: "Will the gas, water and electrical supplies all be safely isolated before starting the boiler repair?" },
      { id: "q3", label: "Is there adequate space around the appliance location to carry out the boiler repair without creating access hazards?" },
      { id: "q4", label: "Have you planned how you will flush, fill and vent the system after completing the boiler repair?" },
      { id: "q5", label: "Will the homeowner be shown how to operate controls and isolate the system following the boiler repair?" }
    ]
  },
  "Gas leak detection": {
    desc: "Gas leak detection focuses specifically on gas pipework and appliances, rather than the wider heating or plumbing system. It usually involves isolating the gas supply, exposing the relevant sections of pipework or appliance connections, and carrying out testing, repair or alteration. Tightness testing, purging and combustion checks are critical to confirm that all work has left the installation safe. Accurate labelling and updating of any gas safety records are completed before handing back to the client.",
    hazards: ["gas", "fire_explosion", "confined_space", "public_interface"],
    questions: [
      { id: "q1", label: "Will a tightness test be carried out before and after the gas leak detection in line with gas industry procedures?" },
      { id: "q2", label: "Have you identified all appliances and branches that could be affected by the gas leak detection?" },
      { id: "q3", label: "Is suitable ventilation available in the area where the gas leak detection will be performed?" },
      { id: "q4", label: "Are you carrying appropriate detection equipment to verify the absence of leaks during the gas leak detection?" },
      { id: "q5", label: "Will records or labels be updated to reflect any changes made during the gas leak detection?" }
    ]
  },
  "Gas pipe rerouting": {
    desc: "Gas pipe rerouting focuses specifically on gas pipework and appliances, rather than the wider heating or plumbing system. It usually involves isolating the gas supply, exposing the relevant sections of pipework or appliance connections, and carrying out testing, repair or alteration. Tightness testing, purging and combustion checks are critical to confirm that all work has left the installation safe. Accurate labelling and updating of any gas safety records are completed before handing back to the client.",
    hazards: ["gas", "fire_explosion", "manual_handling", "hot_work"],
    questions: [
      { id: "q1", label: "Will a tightness test be carried out before and after the gas pipe rerouting in line with gas industry procedures?" },
      { id: "q2", label: "Have you identified all appliances and branches that could be affected by the gas pipe rerouting?" },
      { id: "q3", label: "Is suitable ventilation available in the area where the gas pipe rerouting will be performed?" },
      { id: "q4", label: "Are you carrying appropriate detection equipment to verify the absence of leaks during the gas pipe rerouting?" },
      { id: "q5", label: "Will records or labels be updated to reflect any changes made during the gas pipe rerouting?" }
    ]
  },
  "Gas hob/cooker install": {
    desc: "Gas hob/cooker install focuses specifically on gas pipework and appliances, rather than the wider heating or plumbing system. It usually involves isolating the gas supply, exposing the relevant sections of pipework or appliance connections, and carrying out testing, repair or alteration. Tightness testing, purging and combustion checks are critical to confirm that all work has left the installation safe. Accurate labelling and updating of any gas safety records are completed before handing back to the client.",
    hazards: ["gas", "fire_explosion", "manual_handling"],
    questions: [
      { id: "q1", label: "Will a tightness test be carried out before and after the gas hob/cooker install in line with gas industry procedures?" },
      { id: "q2", label: "Have you identified all appliances and branches that could be affected by the gas hob/cooker install?" },
      { id: "q3", label: "Is suitable ventilation available in the area where the gas hob/cooker install will be performed?" },
      { id: "q4", label: "Are you carrying appropriate detection equipment to verify the absence of leaks during the gas hob/cooker install?" },
      { id: "q5", label: "Will records or labels be updated to reflect any changes made during the gas hob/cooker install?" }
    ]
  },
  "Full central heating install": {
    desc: "Full central heating install involves working on domestic wet heating systems to provide reliable space and water heating. The task typically includes isolating gas, water and electrical supplies, removing or modifying existing appliances or components, and connecting new equipment in line with design requirements. Flue routes, ventilation and condensate disposal must be checked to ensure they comply with current standards. On completion, the system is filled, purged and commissioned, with safety checks and settings documented for the householder.",
    hazards: ["gas", "hot_work", "manual_handling", "chemical_coshh", "slips_trips", "water_ingress"],
    questions: [
      { id: "q1", label: "Have you confirmed that the existing flue and ventilation arrangements are suitable for the full central heating install?" },
      { id: "q2", label: "Will the gas, water and electrical supplies all be safely isolated before starting the full central heating install?" },
      { id: "q3", label: "Is there adequate space around the appliance location to carry out the full central heating install without creating access hazards?" },
      { id: "q4", label: "Have you planned how you will flush, fill and vent the system after completing the full central heating install?" },
      { id: "q5", label: "Will the homeowner be shown how to operate controls and isolate the system following the full central heating install?" }
    ]
  },
  "Radiator installation": {
    desc: "Radiator installation involves working on domestic wet heating systems to provide reliable space and water heating. The task typically includes isolating gas, water and electrical supplies, removing or modifying existing appliances or components, and connecting new equipment in line with design requirements. Flue routes, ventilation and condensate disposal must be checked to ensure they comply with current standards. On completion, the system is filled, purged and commissioned, with safety checks and settings documented for the householder.",
    hazards: ["manual_handling", "water_ingress", "hot_work", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you confirmed that the existing flue and ventilation arrangements are suitable for the radiator installation?" },
      { id: "q2", label: "Will the gas, water and electrical supplies all be safely isolated before starting the radiator installation?" },
      { id: "q3", label: "Is there adequate space around the appliance location to carry out the radiator installation without creating access hazards?" },
      { id: "q4", label: "Have you planned how you will flush, fill and vent the system after completing the radiator installation?" },
      { id: "q5", label: "Will the homeowner be shown how to operate controls and isolate the system following the radiator installation?" }
    ]
  },
  "Radiator relocation": {
    desc: "Radiator relocation involves working on domestic wet heating systems to provide reliable space and water heating. The task typically includes isolating gas, water and electrical supplies, removing or modifying existing appliances or components, and connecting new equipment in line with design requirements. Flue routes, ventilation and condensate disposal must be checked to ensure they comply with current standards. On completion, the system is filled, purged and commissioned, with safety checks and settings documented for the householder.",
    hazards: ["manual_handling", "water_ingress", "hot_work", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you confirmed that the existing flue and ventilation arrangements are suitable for the radiator relocation?" },
      { id: "q2", label: "Will the gas, water and electrical supplies all be safely isolated before starting the radiator relocation?" },
      { id: "q3", label: "Is there adequate space around the appliance location to carry out the radiator relocation without creating access hazards?" },
      { id: "q4", label: "Have you planned how you will flush, fill and vent the system after completing the radiator relocation?" },
      { id: "q5", label: "Will the homeowner be shown how to operate controls and isolate the system following the radiator relocation?" }
    ]
  },
  "Underfloor heating installation": {
    desc: "Underfloor heating installation is centred on installing or maintaining warm water or electric underfloor heating systems. The work includes positioning manifolds or control centres, routing circuits through floor zones and integrating the system with boilers, heat pumps or power circuits. Care must be taken to avoid damage to heating elements or pipework during floor construction and finishing. Balancing, commissioning and control setup are carried out so that the system delivers even, efficient heating to the occupied spaces.",
    hazards: ["manual_handling", "slips_trips", "chemical_coshh", "water_ingress"],
    questions: [
      { id: "q1", label: "Has the floor construction been confirmed as compatible with the underfloor heating installation, including insulation and coverings?" },
      { id: "q2", label: "Will the underfloor heating installation be installed with clear zoning to allow separate control of different areas?" },
      { id: "q3", label: "Are you protecting heating pipes or cables during other trades' work while the underfloor heating installation is in progress?" },
      { id: "q4", label: "Have you planned pressure or resistance tests during the underfloor heating installation before screeds or finishes are applied?" },
      { id: "q5", label: "Will commissioning of the underfloor heating installation follow the manufacturer's recommended heat-up and cool-down cycles?" }
    ]
  },
  "Hot water cylinder (vented) install": {
    desc: "Hot water cylinder (vented) install involves hot water storage equipment such as vented or unvented cylinders and immersion heaters. Typical tasks include draining down the system, removing existing units, installing new vessels or components, and connecting associated pipework, valves and controls. Temperature, pressure relief and discharge arrangements must meet regulatory requirements, particularly for unvented systems. Once installed, the system is refilled, tested for leaks and commissioned to provide safe, consistent hot water delivery.",
    hazards: ["manual_handling", "water_ingress", "hot_work"],
    questions: [
      { id: "q1", label: "Will the hot water cylinder (vented) install include checking that all safety valves and discharge pipework are correctly sized and terminated?" },
      { id: "q2", label: "Have you confirmed that structural support is adequate for the weight of the cylinder involved in the hot water cylinder (vented) install?" },
      { id: "q3", label: "Is there a safe means to drain and dispose of the contents of the system before starting the hot water cylinder (vented) install?" },
      { id: "q4", label: "Are all electrical connections associated with the hot water cylinder (vented) install safely isolated and verified dead before work?" },
      { id: "q5", label: "Will operating temperatures and pressures be checked and recorded when the hot water cylinder (vented) install is complete?" }
    ]
  },
  "Unvented cylinder install": {
    desc: "Unvented cylinder install involves hot water storage equipment such as vented or unvented cylinders and immersion heaters. Typical tasks include draining down the system, removing existing units, installing new vessels or components, and connecting associated pipework, valves and controls. Temperature, pressure relief and discharge arrangements must meet regulatory requirements, particularly for unvented systems. Once installed, the system is refilled, tested for leaks and commissioned to provide safe, consistent hot water delivery.",
    hazards: ["manual_handling", "water_ingress", "hot_work", "stored_energy"],
    questions: [
      { id: "q1", label: "Will the unvented cylinder install include checking that all safety valves and discharge pipework are correctly sized and terminated?" },
      { id: "q2", label: "Have you confirmed that structural support is adequate for the weight of the cylinder involved in the unvented cylinder install?" },
      { id: "q3", label: "Is there a safe means to drain and dispose of the contents of the system before starting the unvented cylinder install?" },
      { id: "q4", label: "Are all electrical connections associated with the unvented cylinder install safely isolated and verified dead before work?" },
      { id: "q5", label: "Will operating temperatures and pressures be checked and recorded when the unvented cylinder install is complete?" }
    ]
  },
  "Immersion heater repair": {
    desc: "Immersion heater repair involves hot water storage equipment such as vented or unvented cylinders and immersion heaters. Typical tasks include draining down the system, removing existing units, installing new vessels or components, and connecting associated pipework, valves and controls. Temperature, pressure relief and discharge arrangements must meet regulatory requirements, particularly for unvented systems. Once installed, the system is refilled, tested for leaks and commissioned to provide safe, consistent hot water delivery.",
    hazards: ["live_electricity", "hot_work", "water_ingress", "manual_handling"],
    questions: [
      { id: "q1", label: "Will the immersion heater repair include checking that all safety valves and discharge pipework are correctly sized and terminated?" },
      { id: "q2", label: "Have you confirmed that structural support is adequate for the weight of the cylinder involved in the immersion heater repair?" },
      { id: "q3", label: "Is there a safe means to drain and dispose of the contents of the system before starting the immersion heater repair?" },
      { id: "q4", label: "Are all electrical connections associated with the immersion heater repair safely isolated and verified dead before work?" },
      { id: "q5", label: "Will operating temperatures and pressures be checked and recorded when the immersion heater repair is complete?" }
    ]
  },
  "Bathroom installation": {
    desc: "Bathroom installation is focused on installing or upgrading sanitaryware and fittings within bathrooms, cloakrooms or kitchens. The task typically includes isolating local supplies, removing old fixtures, adjusting pipework and fixing new units securely in place. Waste connections, seals and waterproofing details must be carefully executed to avoid future leaks or water damage. Final checks confirm that all outlets drain freely, operate correctly and meet the client's expectations for appearance and function.",
    hazards: ["manual_handling", "dust_fumes", "water_ingress", "silica_dust", "biological"],
    questions: [
      { id: "q1", label: "Have you identified all isolation points needed to safely undertake the bathroom installation?" },
      { id: "q2", label: "Will surfaces and finishes around the work area be protected from damage and water ingress during the bathroom installation?" },
      { id: "q3", label: "Are new fixtures and fittings for the bathroom installation compatible with existing pipe sizes and pressures?" },
      { id: "q4", label: "Have you planned how to test for leaks and adequate drainage at the end of the bathroom installation?" },
      { id: "q5", label: "Will any sealants or adhesives used in the bathroom installation be allowed sufficient curing time before use?" }
    ]
  },
  "Shower installation": {
    desc: "Shower installation is focused on installing or upgrading sanitaryware and fittings within bathrooms, cloakrooms or kitchens. The task typically includes isolating local supplies, removing old fixtures, adjusting pipework and fixing new units securely in place. Waste connections, seals and waterproofing details must be carefully executed to avoid future leaks or water damage. Final checks confirm that all outlets drain freely, operate correctly and meet the client's expectations for appearance and function.",
    hazards: ["manual_handling", "water_ingress", "silica_dust", "biological", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you identified all isolation points needed to safely undertake the shower installation?" },
      { id: "q2", label: "Will surfaces and finishes around the work area be protected from damage and water ingress during the shower installation?" },
      { id: "q3", label: "Are new fixtures and fittings for the shower installation compatible with existing pipe sizes and pressures?" },
      { id: "q4", label: "Have you planned how to test for leaks and adequate drainage at the end of the shower installation?" },
      { id: "q5", label: "Will any sealants or adhesives used in the shower installation be allowed sufficient curing time before use?" }
    ]
  },
  "Toilet repair/replacement": {
    desc: "Toilet repair/replacement is focused on installing or upgrading sanitaryware and fittings within bathrooms, cloakrooms or kitchens. The task typically includes isolating local supplies, removing old fixtures, adjusting pipework and fixing new units securely in place. Waste connections, seals and waterproofing details must be carefully executed to avoid future leaks or water damage. Final checks confirm that all outlets drain freely, operate correctly and meet the client's expectations for appearance and function.",
    hazards: ["manual_handling", "water_ingress", "biological", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you identified all isolation points needed to safely undertake the toilet repair/replacement?" },
      { id: "q2", label: "Will surfaces and finishes around the work area be protected from damage and water ingress during the toilet repair/replacement?" },
      { id: "q3", label: "Are new fixtures and fittings for the toilet repair/replacement compatible with existing pipe sizes and pressures?" },
      { id: "q4", label: "Have you planned how to test for leaks and adequate drainage at the end of the toilet repair/replacement?" },
      { id: "q5", label: "Will any sealants or adhesives used in the toilet repair/replacement be allowed sufficient curing time before use?" }
    ]
  },
  "Sink/vanity install": {
    desc: "Sink/vanity install is focused on installing or upgrading sanitaryware and fittings within bathrooms, cloakrooms or kitchens. The task typically includes isolating local supplies, removing old fixtures, adjusting pipework and fixing new units securely in place. Waste connections, seals and waterproofing details must be carefully executed to avoid future leaks or water damage. Final checks confirm that all outlets drain freely, operate correctly and meet the client's expectations for appearance and function.",
    hazards: ["manual_handling", "water_ingress", "silica_dust", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you identified all isolation points needed to safely undertake the sink/vanity install?" },
      { id: "q2", label: "Will surfaces and finishes around the work area be protected from damage and water ingress during the sink/vanity install?" },
      { id: "q3", label: "Are new fixtures and fittings for the sink/vanity install compatible with existing pipe sizes and pressures?" },
      { id: "q4", label: "Have you planned how to test for leaks and adequate drainage at the end of the sink/vanity install?" },
      { id: "q5", label: "Will any sealants or adhesives used in the sink/vanity install be allowed sufficient curing time before use?" }
    ]
  },
  "Mixer tap replacement": {
    desc: "Mixer tap replacement is focused on installing or upgrading sanitaryware and fittings within bathrooms, cloakrooms or kitchens. The task typically includes isolating local supplies, removing old fixtures, adjusting pipework and fixing new units securely in place. Waste connections, seals and waterproofing details must be carefully executed to avoid future leaks or water damage. Final checks confirm that all outlets drain freely, operate correctly and meet the client's expectations for appearance and function.",
    hazards: ["manual_handling", "water_ingress", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you identified all isolation points needed to safely undertake the mixer tap replacement?" },
      { id: "q2", label: "Will surfaces and finishes around the work area be protected from damage and water ingress during the mixer tap replacement?" },
      { id: "q3", label: "Are new fixtures and fittings for the mixer tap replacement compatible with existing pipe sizes and pressures?" },
      { id: "q4", label: "Have you planned how to test for leaks and adequate drainage at the end of the mixer tap replacement?" },
      { id: "q5", label: "Will any sealants or adhesives used in the mixer tap replacement be allowed sufficient curing time before use?" }
    ]
  },
  "Thermostatic valve install": {
    desc: "Thermostatic valve install relates to fitting or altering devices that regulate the performance of heating systems. The work may involve draining sections of pipework, swapping out valves or actuators, and connecting electrical control wiring. Correct positioning and calibration of controls is essential to achieve accurate temperature regulation and system efficiency. After installation, the controls are tested through a range of operating conditions to confirm they respond as intended.",
    hazards: ["manual_handling", "water_ingress", "hot_work", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you confirmed the electrical isolation points for any controls affected by the thermostatic valve install?" },
      { id: "q2", label: "Will the thermostatic valve install require changes to wiring centres or control circuits that need updated schematics?" },
      { id: "q3", label: "Are valve bodies and actuators being installed during the thermostatic valve install positioned to allow future servicing?" },
      { id: "q4", label: "Have you planned a full functional test of all heating zones once the thermostatic valve install is complete?" },
      { id: "q5", label: "Will control settings established during the thermostatic valve install be documented for the client or maintenance team?" }
    ]
  },
  "Burst pipe repair": {
    desc: "Burst pipe repair is reactive work that tackles water losses or system failures within domestic or commercial pipework. The process generally starts with locating the source of the problem, which may involve inspection, testing or opening up building fabric. Once identified, the defective section is isolated, repaired or replaced using appropriate materials and techniques. The system is then reinstated and monitored to ensure the repair is sound and no further damage is occurring.",
    hazards: ["water_ingress", "manual_handling", "slips_trips", "biological"],
    questions: [
      { id: "q1", label: "Will you carry out the burst pipe repair with suitable measures in place to protect surrounding finishes and belongings?" },
      { id: "q2", label: "Have you located and tested all isolation valves needed for the burst pipe repair?" },
      { id: "q3", label: "Are you prepared for the possibility of additional defects becoming apparent while the burst pipe repair is underway?" },
      { id: "q4", label: "Is there a plan to dry out affected areas after the burst pipe repair to reduce the risk of mould or further damage?" },
      { id: "q5", label: "Will you confirm system pressures and operation following completion of the burst pipe repair?" }
    ]
  },
  "Leak trace & repair": {
    desc: "Leak trace & repair is reactive work that tackles water losses or system failures within domestic or commercial pipework. The process generally starts with locating the source of the problem, which may involve inspection, testing or opening up building fabric. Once identified, the defective section is isolated, repaired or replaced using appropriate materials and techniques. The system is then reinstated and monitored to ensure the repair is sound and no further damage is occurring.",
    hazards: ["water_ingress", "manual_handling", "slips_trips"],
    questions: [
      { id: "q1", label: "Will you carry out the leak trace & repair with suitable measures in place to protect surrounding finishes and belongings?" },
      { id: "q2", label: "Have you located and tested all isolation valves needed for the leak trace & repair?" },
      { id: "q3", label: "Are you prepared for the possibility of additional defects becoming apparent while the leak trace & repair is underway?" },
      { id: "q4", label: "Is there a plan to dry out affected areas after the leak trace & repair to reduce the risk of mould or further damage?" },
      { id: "q5", label: "Will you confirm system pressures and operation following completion of the leak trace & repair?" }
    ]
  },
  "Drain unblocking": {
    desc: "Drain unblocking concerns below-ground or external above-ground drainage systems carrying foul or surface water. Tasks often include lifting access covers, clearing blockages, replacing defective sections of pipework and checking gradients or connections. Safe working methods are required around open excavations, confined spaces and possible biological contamination. Completion involves testing flows, reinstating surfaces and leaving the drainage system functioning correctly and safely.",
    hazards: ["biological", "confined_space", "manual_handling", "slips_trips", "public_interface"],
    questions: [
      { id: "q1", label: "Have you checked for underground services that could be disturbed during the drain unblocking?" },
      { id: "q2", label: "Will barriers or covers be used to protect the public from open access points created for the drain unblocking?" },
      { id: "q3", label: "Are you equipped with appropriate PPE for potential biological hazards during the drain unblocking?" },
      { id: "q4", label: "Is there a safe means of access and egress if the drain unblocking involves work in a confined space?" },
      { id: "q5", label: "Will the flow and self-cleansing of the system be verified once the drain unblocking is completed?" }
    ]
  },
  "Drain CCTV survey": {
    desc: "Drain CCTV survey concerns below-ground or external above-ground drainage systems carrying foul or surface water. Tasks often include lifting access covers, clearing blockages, replacing defective sections of pipework and checking gradients or connections. Safe working methods are required around open excavations, confined spaces and possible biological contamination. Completion involves testing flows, reinstating surfaces and leaving the drainage system functioning correctly and safely.",
    hazards: ["biological", "confined_space", "slips_trips", "public_interface"],
    questions: [
      { id: "q1", label: "Have you checked for underground services that could be disturbed during the drain cctv survey?" },
      { id: "q2", label: "Will barriers or covers be used to protect the public from open access points created for the drain cctv survey?" },
      { id: "q3", label: "Are you equipped with appropriate PPE for potential biological hazards during the drain cctv survey?" },
      { id: "q4", label: "Is there a safe means of access and egress if the drain cctv survey involves work in a confined space?" },
      { id: "q5", label: "Will the flow and self-cleansing of the system be verified once the drain cctv survey is completed?" }
    ]
  },
  "Soil stack repair/replacement": {
    desc: "Soil stack repair/replacement concerns below-ground or external above-ground drainage systems carrying foul or surface water. Tasks often include lifting access covers, clearing blockages, replacing defective sections of pipework and checking gradients or connections. Safe working methods are required around open excavations, confined spaces and possible biological contamination. Completion involves testing flows, reinstating surfaces and leaving the drainage system functioning correctly and safely.",
    hazards: ["biological", "work_at_height", "manual_handling", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you checked for underground services that could be disturbed during the soil stack repair/replacement?" },
      { id: "q2", label: "Will barriers or covers be used to protect the public from open access points created for the soil stack repair/replacement?" },
      { id: "q3", label: "Are you equipped with appropriate PPE for potential biological hazards during the soil stack repair/replacement?" },
      { id: "q4", label: "Is there a safe means of access and egress if the soil stack repair/replacement involves work in a confined space?" },
      { id: "q5", label: "Will the flow and self-cleansing of the system be verified once the soil stack repair/replacement is completed?" }
    ]
  },
  "Guttering/downpipe repair": {
    desc: "Guttering/downpipe repair focuses on the collection and controlled discharge of rainwater from roofs and external surfaces. Typical activities include removing damaged gutters or downpipes, fixing new components to correct falls, and ensuring outlets connect adequately to drainage or soakaways. Work is often at height and may require ladders or scaffold, with care taken to prevent falls and material dropping. On completion, the system is checked during a water test or rainfall to confirm that water is being managed as intended.",
    hazards: ["work_at_height", "manual_handling", "environmental_weather", "public_interface"],
    questions: [
      { id: "q1", label: "Have you planned safe access arrangements for working at height during the guttering/downpipe repair?" },
      { id: "q2", label: "Will the guttering/downpipe repair ensure that rainwater discharges away from the building without causing erosion or nuisance?" },
      { id: "q3", label: "Are brackets and fixings for the guttering/downpipe repair suitable for the substrate and expected loads?" },
      { id: "q4", label: "Is there a risk of contact with overhead lines near the work area for the guttering/downpipe repair?" },
      { id: "q5", label: "Will water testing be carried out to confirm falls and joints are satisfactory after the guttering/downpipe repair?" }
    ]
  },
  "Kitchen plumbing first fix": {
    desc: "Kitchen plumbing first fix takes place at an early stage of a kitchen project, before units and finishes are installed. It involves routing hot, cold and waste pipework to predetermined locations, allowing enough tolerance for final connections. Coordination with electricians, joiners and designers is important to avoid clashes with other services and fixtures. Pipework is pressure-tested and securely supported so that it remains reliable when walls, floors and cabinets are completed.",
    hazards: ["manual_handling", "dust_fumes", "hot_work", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you coordinated the kitchen plumbing first fix with the kitchen layout, appliance schedule and electrical plans?" },
      { id: "q2", label: "Will all pipe runs installed during the kitchen plumbing first fix be adequately clipped and protected before closing walls or floors?" },
      { id: "q3", label: "Are you avoiding installing dead legs or unnecessary tees in the pipework during the kitchen plumbing first fix?" },
      { id: "q4", label: "Have you arranged pressure testing of the pipework before other trades cover it following the kitchen plumbing first fix?" },
      { id: "q5", label: "Will clear photographs or drawings of routes installed during the kitchen plumbing first fix be retained for future reference?" }
    ]
  },
  "Kitchen plumbing second fix": {
    desc: "Kitchen plumbing second fix involves making final connections to appliances, taps and wastes after kitchen units and worktops are in place. The plumber carefully cuts into units where necessary, fits valves and flexible connectors, and connects traps and wastes. Care is taken to avoid damaging new finishes and to route pipework in a neat, accessible manner. A full functional test is carried out to confirm all appliances and outlets fill, drain and shut off properly.",
    hazards: ["manual_handling", "water_ingress", "slips_trips"],
    questions: [
      { id: "q1", label: "Will you verify that worktops and cabinets are securely fixed before starting the kitchen plumbing second fix?" },
      { id: "q2", label: "Are flexible connectors used in the kitchen plumbing second fix being installed within their length and bend-radius limitations?" },
      { id: "q3", label: "Have you checked that waste outlets and traps are accessible for future cleaning after the kitchen plumbing second fix?" },
      { id: "q4", label: "Will you run and observe all connected appliances during the kitchen plumbing second fix to confirm correct operation?" },
      { id: "q5", label: "Is there a plan to brief the occupier on isolation points and maintenance for items fitted during the kitchen plumbing second fix?" }
    ]
  },
  "Dishwasher plumbing": {
    desc: "Dishwasher plumbing involves making final connections to appliances, taps and wastes after kitchen units and worktops are in place. The plumber carefully cuts into units where necessary, fits valves and flexible connectors, and connects traps and wastes. Care is taken to avoid damaging new finishes and to route pipework in a neat, accessible manner. A full functional test is carried out to confirm all appliances and outlets fill, drain and shut off properly.",
    hazards: ["manual_handling", "water_ingress", "slips_trips"],
    questions: [
      { id: "q1", label: "Will you verify that worktops and cabinets are securely fixed before starting the dishwasher plumbing?" },
      { id: "q2", label: "Are flexible connectors used in the dishwasher plumbing being installed within their length and bend-radius limitations?" },
      { id: "q3", label: "Have you checked that waste outlets and traps are accessible for future cleaning after the dishwasher plumbing?" },
      { id: "q4", label: "Will you run and observe all connected appliances during the dishwasher plumbing to confirm correct operation?" },
      { id: "q5", label: "Is there a plan to brief the occupier on isolation points and maintenance for items fitted during the dishwasher plumbing?" }
    ]
  },
  "Washing machine plumbing": {
    desc: "Washing machine plumbing involves making final connections to appliances, taps and wastes after kitchen units and worktops are in place. The plumber carefully cuts into units where necessary, fits valves and flexible connectors, and connects traps and wastes. Care is taken to avoid damaging new finishes and to route pipework in a neat, accessible manner. A full functional test is carried out to confirm all appliances and outlets fill, drain and shut off properly.",
    hazards: ["manual_handling", "water_ingress", "slips_trips"],
    questions: [
      { id: "q1", label: "Will you verify that worktops and cabinets are securely fixed before starting the washing machine plumbing?" },
      { id: "q2", label: "Are flexible connectors used in the washing machine plumbing being installed within their length and bend-radius limitations?" },
      { id: "q3", label: "Have you checked that waste outlets and traps are accessible for future cleaning after the washing machine plumbing?" },
      { id: "q4", label: "Will you run and observe all connected appliances during the washing machine plumbing to confirm correct operation?" },
      { id: "q5", label: "Is there a plan to brief the occupier on isolation points and maintenance for items fitted during the washing machine plumbing?" }
    ]
  },
  "Outdoor tap installation": {
    desc: "Outdoor tap installation provides a localised water supply on the outside of a building for gardening, cleaning or general use. The work includes taking a suitable feed from the internal plumbing, routing pipework through the wall and fixing a frost-resistant tap externally. Backflow prevention and isolation valves must be included to protect the internal water supply. Once complete, the tap is tested for leaks and safe operation in both normal and cold-weather conditions.",
    hazards: ["manual_handling", "water_ingress", "slips_trips", "drilling", "dust_fumes"],
    questions: [
      { id: "q1", label: "Will you fit a double check valve or other backflow protection as part of the outdoor tap installation?" },
      { id: "q2", label: "Are you using suitable insulation or frost-proof fittings to reduce freezing risk for the outdoor tap installation?" },
      { id: "q3", label: "Have you confirmed the external wall construction so that fixings for the outdoor tap installation will be secure?" },
      { id: "q4", label: "Is there an internal isolation valve accessible for the user once the outdoor tap installation is complete?" },
      { id: "q5", label: "Will the pipework for the outdoor tap installation be routed to minimise the risk of accidental damage?" }
    ]
  },
  "Water softener installation": {
    desc: "Water softener installation is centred on equipment that changes the characteristics of incoming water, such as softeners or filtration units. The plumber identifies a suitable installation location, incorporates bypass and isolation valves, and connects the unit into the supply. Drainage and overflow routes are provided where required by the manufacturer’s instructions. The system is then commissioned and the user is briefed on routine maintenance, such as salt or cartridge replacement.",
    hazards: ["manual_handling", "water_ingress", "slips_trips", "chemical_coshh"],
    questions: [
      { id: "q1", label: "Have you verified the incoming water pressure and quality before starting the water softener installation?" },
      { id: "q2", label: "Will bypass and isolation valves be installed as part of the water softener installation for maintenance and emergencies?" },
      { id: "q3", label: "Are discharge or drain connections needed for the water softener installation being run to appropriate locations?" },
      { id: "q4", label: "Is there adequate space and access for the ongoing servicing requirements of equipment fitted during the water softener installation?" },
      { id: "q5", label: "Will you provide the user with clear instructions on routine tasks associated with the water softener installation?" }
    ]
  },
  "Rainwater harvesting setup": {
    desc: "Rainwater harvesting setup is centred on equipment that changes the characteristics of incoming water, such as softeners or filtration units. The plumber identifies a suitable installation location, incorporates bypass and isolation valves, and connects the unit into the supply. Drainage and overflow routes are provided where required by the manufacturer’s instructions. The system is then commissioned and the user is briefed on routine maintenance, such as salt or cartridge replacement.",
    hazards: ["manual_handling", "water_ingress", "slips_trips", "confined_space", "biological"],
    questions: [
      { id: "q1", label: "Have you verified the incoming water pressure and quality before starting the rainwater harvesting setup?" },
      { id: "q2", label: "Will bypass and isolation valves be installed as part of the rainwater harvesting setup for maintenance and emergencies?" },
      { id: "q3", label: "Are discharge or drain connections needed for the rainwater harvesting setup being run to appropriate locations?" },
      { id: "q4", label: "Is there adequate space and access for the ongoing servicing requirements of equipment fitted during the rainwater harvesting setup?" },
      { id: "q5", label: "Will you provide the user with clear instructions on routine tasks associated with the rainwater harvesting setup?" }
    ]
  },
  "Sump pump installation": {
    desc: "Sump pump installation involves installing or maintaining pumps that move water or waste from one level or location to another. This can include sump pumps, lifting stations or shower pumps, often in confined or low-level spaces. Pipework, non-return valves and electrical supplies must be configured correctly to ensure reliable, safe operation. After installation, the pump is tested under realistic flow conditions to verify performance and automatic control functions.",
    hazards: ["manual_handling", "water_ingress", "slips_trips", "biological", "live_electricity"],
    questions: [
      { id: "q1", label: "Have you assessed the required duty and head to select the correct pump for the sump pump installation?" },
      { id: "q2", label: "Will non-return valves and isolation valves be incorporated into the pipework for the sump pump installation?" },
      { id: "q3", label: "Are you ensuring that electrical supplies and controls for the sump pump installation are installed by a competent person?" },
      { id: "q4", label: "Is the location for pump equipment in the sump pump installation adequately ventilated and protected from flooding?" },
      { id: "q5", label: "Will you test the sump pump installation under realistic operating conditions and verify automatic starting and stopping?" }
    ]
  },
  "Pumped shower installation": {
    desc: "Pumped shower installation involves installing or maintaining pumps that move water or waste from one level or location to another. This can include sump pumps, lifting stations or shower pumps, often in confined or low-level spaces. Pipework, non-return valves and electrical supplies must be configured correctly to ensure reliable, safe operation. After installation, the pump is tested under realistic flow conditions to verify performance and automatic control functions.",
    hazards: ["manual_handling", "water_ingress", "slips_trips", "live_electricity"],
    questions: [
      { id: "q1", label: "Have you assessed the required duty and head to select the correct pump for the pumped shower installation?" },
      { id: "q2", label: "Will non-return valves and isolation valves be incorporated into the pipework for the pumped shower installation?" },
      { id: "q3", label: "Are you ensuring that electrical supplies and controls for the pumped shower installation are installed by a competent person?" },
      { id: "q4", label: "Is the location for pump equipment in the pumped shower installation adequately ventilated and protected from flooding?" },
      { id: "q5", label: "Will you test the pumped shower installation under realistic operating conditions and verify automatic starting and stopping?" }
    ]
  },
  "Macerator toilet installation": {
    desc: "Macerator toilet installation is focused on installing or upgrading sanitaryware and fittings within bathrooms, cloakrooms or kitchens. The task typically includes isolating local supplies, removing old fixtures, adjusting pipework and fixing new units securely in place. Waste connections, seals and waterproofing details must be carefully executed to avoid future leaks or water damage. Final checks confirm that all outlets drain freely, operate correctly and meet the client’s expectations for appearance and function.",
    hazards: ["manual_handling", "water_ingress", "slips_trips", "biological", "live_electricity"],
    questions: [
      { id: "q1", label: "Have you identified all isolation points needed to safely undertake the macerator toilet installation?" },
      { id: "q2", label: "Will surfaces and finishes around the work area be protected from damage and water ingress during the macerator toilet installation?" },
      { id: "q3", label: "Are new fixtures and fittings for the macerator toilet installation compatible with existing pipe sizes and pressures?" },
      { id: "q4", label: "Have you planned how to test for leaks and adequate drainage at the end of the macerator toilet installation?" },
      { id: "q5", label: "Will any sealants or adhesives used in the macerator toilet installation be allowed sufficient curing time before use?" }
    ]
  },
  "Commercial boiler installation": {
    desc: "Commercial boiler installation deals with larger-scale boilers or multi-boiler systems serving commercial or multi-occupancy premises. The work is more complex than typical domestic tasks and may involve flue systems, pressurisation units, header arrangements and BMS integration. Strict adherence to manufacturer requirements, local regulations and any site-specific permits is essential. Thorough commissioning, documentation and coordination with building managers form a key part of project completion.",
    hazards: ["gas", "hot_work", "manual_handling", "chemical_coshh", "fumes", "public_interface"],
    questions: [
      { id: "q1", label: "Have you agreed method statements and permits required for the commercial boiler installation with the building management?" },
      { id: "q2", label: "Will the commercial boiler installation involve working on live systems that require phased isolation to maintain essential services?" },
      { id: "q3", label: "Are you coordinating the commercial boiler installation with other contractors or BMS specialists on site?" },
      { id: "q4", label: "Is all lifting and handling equipment for plant involved in the commercial boiler installation suitable and certified?" },
      { id: "q5", label: "Will detailed commissioning records and logbook entries be completed for the commercial boiler installation?" }
    ]
  },
  "Plant room works": {
    desc: "Plant room works deals with larger-scale boilers or multi-boiler systems serving commercial or multi-occupancy premises. The work is more complex than typical domestic tasks and may involve flue systems, pressurisation units, header arrangements and BMS integration. Strict adherence to manufacturer requirements, local regulations and any site-specific permits is essential. Thorough commissioning, documentation and coordination with building managers form a key part of project completion.",
    hazards: ["gas", "hot_work", "manual_handling", "chemical_coshh", "fumes", "confined_space", "noise_vibration"],
    questions: [
      { id: "q1", label: "Have you agreed method statements and permits required for the plant room works with the building management?" },
      { id: "q2", label: "Will the plant room works involve working on live systems that require phased isolation to maintain essential services?" },
      { id: "q3", label: "Are you coordinating the plant room works with other contractors or BMS specialists on site?" },
      { id: "q4", label: "Is all lifting and handling equipment for plant involved in the plant room works suitable and certified?" },
      { id: "q5", label: "Will detailed commissioning records and logbook entries be completed for the plant room works?" }
    ]
  },
  "Pressurised system testing": {
    desc: "Pressurised system testing focuses on verifying that pipework or systems can safely withstand their design pressures without leaking. Water or air is introduced to the system under controlled conditions and held for a defined period while joints and fittings are inspected. Test media, pressures and durations are selected in line with relevant standards and manufacturer recommendations. Results are recorded and any failures are investigated and rectified before the system is put into service.",
    hazards: ["stored_energy", "manual_handling", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you selected the correct test medium and pressure for the pressurised system testing according to standards and manufacturer guidance?" },
      { id: "q2", label: "Will the area around the system under test for the pressurised system testing be restricted to essential personnel only?" },
      { id: "q3", label: "Are pressure gauges and test equipment for the pressurised system testing calibrated and in good condition?" },
      { id: "q4", label: "Is there a clear procedure for safely releasing test pressure at the end of the pressurised system testing?" },
      { id: "q5", label: "Will detailed test results from the pressurised system testing be recorded and retained with project documentation?" }
    ]
  },
  "Pipe insulation installation": {
    desc: "Pipe insulation installation aims to reduce heat loss, prevent freezing or control surface temperatures by applying insulation to pipework. The plumber assesses which runs need treating and selects appropriate insulation thickness and coverings for the environment. Joints, valves and fittings are detailed so that they remain accessible while still gaining some protection. The finished work is inspected to confirm continuity of insulation and protection against moisture or mechanical damage.",
    hazards: ["manual_handling", "work_at_height", "dust_fumes", "chemical_coshh"],
    questions: [
      { id: "q1", label: "Have you identified all sections of pipework that require treatment as part of the pipe insulation installation?" },
      { id: "q2", label: "Will the insulation materials used in the pipe insulation installation be suitable for the operating temperatures and environment?" },
      { id: "q3", label: "Are you planning to insulate valves and flanges in a way that still allows maintenance after the pipe insulation installation?" },
      { id: "q4", label: "Is there any risk of condensation on cold surfaces that should be addressed during the pipe insulation installation?" },
      { id: "q5", label: "Will a final check be carried out after the pipe insulation installation to ensure there are no gaps or exposed lengths?" }
    ]
  },
  "Heating pump replacement": {
    desc: "Heating pump replacement involves working on domestic wet heating systems to provide reliable space and water heating. The task typically includes isolating gas, water and electrical supplies, removing or modifying existing appliances or components, and connecting new equipment in line with design requirements. Flue routes, ventilation and condensate disposal must be checked to ensure they comply with current standards. On completion, the system is filled, purged and commissioned, with safety checks and settings documented for the householder.",
    hazards: ["manual_handling", "water_ingress", "live_electricity"],
    questions: [
      { id: "q1", label: "Have you confirmed that the existing flue and ventilation arrangements are suitable for the heating pump replacement?" },
      { id: "q2", label: "Will the gas, water and electrical supplies all be safely isolated before starting the heating pump replacement?" },
      { id: "q3", label: "Is there adequate space around the appliance location to carry out the heating pump replacement without creating access hazards?" },
      { id: "q4", label: "Have you planned how you will flush, fill and vent the system after completing the heating pump replacement?" },
      { id: "q5", label: "Will the homeowner be shown how to operate controls and isolate the system following the heating pump replacement?" }
    ]
  },
  "Expansion vessel replacement": {
    desc: "Expansion vessel replacement involves working on domestic wet heating systems to provide reliable space and water heating. The task typically includes isolating gas, water and electrical supplies, removing or modifying existing appliances or components, and connecting new equipment in line with design requirements. Flue routes, ventilation and condensate disposal must be checked to ensure they comply with current standards. On completion, the system is filled, purged and commissioned, with safety checks and settings documented for the householder.",
    hazards: ["manual_handling", "water_ingress", "stored_energy"],
    questions: [
      { id: "q1", label: "Have you confirmed that the existing flue and ventilation arrangements are suitable for the expansion vessel replacement?" },
      { id: "q2", label: "Will the gas, water and electrical supplies all be safely isolated before starting the expansion vessel replacement?" },
      { id: "q3", label: "Is there adequate space around the appliance location to carry out the expansion vessel replacement without creating access hazards?" },
      { id: "q4", label: "Have you planned how you will flush, fill and vent the system after completing the expansion vessel replacement?" },
      { id: "q5", label: "Will the homeowner be shown how to operate controls and isolate the system following the expansion vessel replacement?" }
    ]
  },
  "Hot & cold pipe rerouting": {
    desc: "Hot & cold pipe rerouting involves altering existing pipe routes to accommodate layout changes, extensions or new equipment. Sections of pipework are isolated, drained and cut, then new routes are installed using suitable fittings and support methods. Consideration is given to air locking, drainage, access for maintenance and the avoidance of dead legs. On completion, the modified system is refilled, vented and checked thoroughly for leaks and satisfactory operation.",
    hazards: ["manual_handling", "hot_work", "water_ingress", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you planned all isolation and drain-down points required to safely perform the hot & cold pipe rerouting?" },
      { id: "q2", label: "Will supports and brackets added during the hot & cold pipe rerouting maintain adequate falls and alignment of pipework?" },
      { id: "q3", label: "Are potential air locks being considered and vent points included as part of the hot & cold pipe rerouting?" },
      { id: "q4", label: "Is there any risk of creating dead legs or stagnation zones through the hot & cold pipe rerouting?" },
      { id: "q5", label: "Will you test all modified sections of pipework for leaks and performance after the hot & cold pipe rerouting?" }
    ]
  },
  "Wet room plumbing install": {
    desc: "Wet room plumbing install is focused on installing or upgrading sanitaryware and fittings within bathrooms, cloakrooms or kitchens. The task typically includes isolating local supplies, removing old fixtures, adjusting pipework and fixing new units securely in place. Waste connections, seals and waterproofing details must be carefully executed to avoid future leaks or water damage. Final checks confirm that all outlets drain freely, operate correctly and meet the client’s expectations for appearance and function.",
    hazards: ["manual_handling", "water_ingress", "slips_trips", "silica_dust", "chemical_coshh"],
    questions: [
      { id: "q1", label: "Have you identified all isolation points needed to safely undertake the wet room plumbing install?" },
      { id: "q2", label: "Will surfaces and finishes around the work area be protected from damage and water ingress during the wet room plumbing install?" },
      { id: "q3", label: "Are new fixtures and fittings for the wet room plumbing install compatible with existing pipe sizes and pressures?" },
      { id: "q4", label: "Have you planned how to test for leaks and adequate drainage at the end of the wet room plumbing install?" },
      { id: "q5", label: "Will any sealants or adhesives used in the wet room plumbing install be allowed sufficient curing time before use?" }
    ]
  },
  "Grey water system installation": {
    desc: "Grey water system installation is centred on equipment that changes the characteristics of incoming water, such as softeners or filtration units. The plumber identifies a suitable installation location, incorporates bypass and isolation valves, and connects the unit into the supply. Drainage and overflow routes are provided where required by the manufacturer’s instructions. The system is then commissioned and the user is briefed on routine maintenance, such as salt or cartridge replacement.",
    hazards: ["manual_handling", "water_ingress", "biological", "chemical_coshh"],
    questions: [
      { id: "q1", label: "Have you verified the incoming water pressure and quality before starting the grey water system installation?" },
      { id: "q2", label: "Will bypass and isolation valves be installed as part of the grey water system installation for maintenance and emergencies?" },
      { id: "q3", label: "Are discharge or drain connections needed for the grey water system installation being run to appropriate locations?" },
      { id: "q4", label: "Is there adequate space and access for the ongoing servicing requirements of equipment fitted during the grey water system installation?" },
      { id: "q5", label: "Will you provide the user with clear instructions on routine tasks associated with the grey water system installation?" }
    ]
  },
  "Septic tank connection work": {
    desc: "Septic tank connection work concerns below-ground or external above-ground drainage systems carrying foul or surface water. Tasks often include lifting access covers, clearing blockages, replacing defective sections of pipework and checking gradients or connections. Safe working methods are required around open excavations, confined spaces and possible biological contamination. Completion involves testing flows, reinstating surfaces and leaving the drainage system functioning correctly and safely.",
    hazards: ["biological", "confined_space", "excavation", "manual_handling"],
    questions: [
      { id: "q1", label: "Have you checked for underground services that could be disturbed during the septic tank connection work?" },
      { id: "q2", label: "Will barriers or covers be used to protect the public from open access points created for the septic tank connection work?" },
      { id: "q3", label: "Are you equipped with appropriate PPE for potential biological hazards during the septic tank connection work?" },
      { id: "q4", label: "Is there a safe means of access and egress if the septic tank connection work involves work in a confined space?" },
      { id: "q5", label: "Will the flow and self-cleansing of the system be verified once the septic tank connection work is completed?" }
    ]
  },
  "Manhole replacement": {
    desc: "Manhole replacement concerns below-ground or external above-ground drainage systems carrying foul or surface water. Tasks often include lifting access covers, clearing blockages, replacing defective sections of pipework and checking gradients or connections. Safe working methods are required around open excavations, confined spaces and possible biological contamination. Completion involves testing flows, reinstating surfaces and leaving the drainage system functioning correctly and safely.",
    hazards: ["biological", "confined_space", "excavation", "manual_handling"],
    questions: [
      { id: "q1", label: "Have you checked for underground services that could be disturbed during the manhole replacement?" },
      { id: "q2", label: "Will barriers or covers be used to protect the public from open access points created for the manhole replacement?" },
      { id: "q3", label: "Are you equipped with appropriate PPE for potential biological hazards during the manhole replacement?" },
      { id: "q4", label: "Is there a safe means of access and egress if the manhole replacement involves work in a confined space?" },
      { id: "q5", label: "Will the flow and self-cleansing of the system be verified once the manhole replacement is completed?" }
    ]
  },
  "Bathroom rip-out & refit": {
    desc: "Bathroom rip-out & refit is focused on installing or upgrading sanitaryware and fittings within bathrooms, cloakrooms or kitchens. The task typically includes isolating local supplies, removing old fixtures, adjusting pipework and fixing new units securely in place. Waste connections, seals and waterproofing details must be carefully executed to avoid future leaks or water damage. Final checks confirm that all outlets drain freely, operate correctly and meet the client’s expectations for appearance and function.",
    hazards: ["manual_handling", "dust_fumes", "water_ingress", "silica_dust"],
    questions: [
      { id: "q1", label: "Have you identified all isolation points needed to safely undertake the bathroom rip-out & refit?" },
      { id: "q2", label: "Will surfaces and finishes around the work area be protected from damage and water ingress during the bathroom rip-out & refit?" },
      { id: "q3", label: "Are new fixtures and fittings for the bathroom rip-out & refit compatible with existing pipe sizes and pressures?" },
      { id: "q4", label: "Have you planned how to test for leaks and adequate drainage at the end of the bathroom rip-out & refit?" },
      { id: "q5", label: "Will any sealants or adhesives used in the bathroom rip-out & refit be allowed sufficient curing time before use?" }
    ]
  },
  "Radiator power flushing": {
    desc: "Radiator power flushing involves working on domestic wet heating systems to provide reliable space and water heating. The task typically includes isolating gas, water and electrical supplies, removing or modifying existing appliances or components, and connecting new equipment in line with design requirements. Flue routes, ventilation and condensate disposal must be checked to ensure they comply with current standards. On completion, the system is filled, purged and commissioned, with safety checks and settings documented for the householder.",
    hazards: ["manual_handling", "water_ingress", "slips_trips", "chemical_coshh"],
    questions: [
      { id: "q1", label: "Have you confirmed that the existing flue and ventilation arrangements are suitable for the radiator power flushing?" },
      { id: "q2", label: "Will the gas, water and electrical supplies all be safely isolated before starting the radiator power flushing?" },
      { id: "q3", label: "Is there adequate space around the appliance location to carry out the radiator power flushing without creating access hazards?" },
      { id: "q4", label: "Have you planned how you will flush, fill and vent the system after completing the radiator power flushing?" },
      { id: "q5", label: "Will the homeowner be shown how to operate controls and isolate the system following the radiator power flushing?" }
    ]
  },
  "Commercial toilet/urinal install": {
    desc: "Commercial toilet/urinal install covers the installation or modification of sanitaryware in commercial or public washrooms. The plumber works with higher usage patterns, potentially vandal-resistant fixtures and sometimes more complex flushing systems. Supply and waste pipework must be sized and routed to handle peak demand and cleaning requirements. Commissioning ensures that all fittings operate reliably and comply with relevant accessibility and hygiene standards.",
    hazards: ["manual_handling", "water_ingress", "biological", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you reviewed any site-specific hygiene or accessibility requirements that apply to the commercial toilet/urinal install?" },
      { id: "q2", label: "Will the commercial toilet/urinal install require work outside of normal hours to minimise disruption to building users?" },
      { id: "q3", label: "Are pipe sizes and fixtures used in the commercial toilet/urinal install adequate for peak demand in a commercial setting?" },
      { id: "q4", label: "Is there suitable access for cleaning and maintenance of fittings installed during the commercial toilet/urinal install?" },
      { id: "q5", label: "Will you coordinate the commercial toilet/urinal install with other trades such as tilers, partition installers and electricians?" }
    ]
  },
   "Other (Custom)": {
    desc: "",
    hazards: [],
    questions: [
      { id: "q1", label: "Have you identified all specific hazards associated with this custom task?" },
      { id: "q2", label: "Do you have the correct tools and equipment for this specific work?" },
      { id: "q3", label: "Has a dynamic risk assessment been carried out?" },
      { id: "q4", label: "Are you competent to undertake this specific custom task?" },
      { id: "q5", label: "Have you agreed the scope fully with the client?" }
    ]
  }
};


// app/lib/constants.ts - PART 3 OF 4

// --- 4. ROOFER CLUSTERS (FULL 50 JOBS) ---
const ROOFER_CLUSTERS: Record<string, JobCluster> = {
  "Pitched roof re-tile": {
    desc: "Pitched roof re-tile involves large-scale work on a pitched roof covering, often renewing all or most of the existing tiles or slates. The task typically includes stripping the old coverings, inspecting and repairing battens and underlay, and fixing new materials in accordance with manufacturer guidance. Careful setting-out and fixing patterns are required to ensure weather tightness and a uniform appearance. The work is normally carried out from scaffold or other fixed access with appropriate edge protection in place throughout.",
    hazards: ["work_at_height", "falling_objects", "manual_handling", "fragile_surfaces", "dust_fumes"],
    questions: [
      { id: "q1", label: "Has full scaffold with suitable edge protection been installed for the pitched roof re-tile?" },
      { id: "q2", label: "Will all existing roof coverings be assessed for safe removal before starting the pitched roof re-tile?" },
      { id: "q3", label: "Have you confirmed that replacement materials for the pitched roof re-tile are compatible in weight and fixing with the existing structure?" },
      { id: "q4", label: "Is there a plan for controlled waste removal and chute use during the pitched roof re-tile?" },
      { id: "q5", label: "Will temporary weatherproofing be available if the pitched roof re-tile cannot be completed in one phase?" }
    ]
  },
  "Slate roof installation": {
    desc: "Slate roof installation involves large-scale work on a pitched roof covering, often renewing all or most of the existing tiles or slates. The task typically includes stripping the old coverings, inspecting and repairing battens and underlay, and fixing new materials in accordance with manufacturer guidance. Careful setting-out and fixing patterns are required to ensure weather tightness and a uniform appearance. The work is normally carried out from scaffold or other fixed access with appropriate edge protection in place throughout.",
    hazards: ["work_at_height", "falling_objects", "manual_handling", "silica_dust", "fragile_surfaces"],
    questions: [
      { id: "q1", label: "Has full scaffold with suitable edge protection been installed for the slate roof installation?" },
      { id: "q2", label: "Will all existing roof coverings be assessed for safe removal before starting the slate roof installation?" },
      { id: "q3", label: "Have you confirmed that replacement materials for the slate roof installation are compatible in weight and fixing with the existing structure?" },
      { id: "q4", label: "Is there a plan for controlled waste removal and chute use during the slate roof installation?" },
      { id: "q5", label: "Will temporary weatherproofing be available if the slate roof installation cannot be completed in one phase?" }
    ]
  },
  "Flat roof (felt) install": {
    desc: "Flat roof (felt) install is centred on installing or fully renewing a flat roof waterproofing system using materials such as felt, GRP or EPDM. The process usually involves stripping existing coverings where necessary, preparing the deck, and applying insulation and membranes in layers to create a continuous weatherproof surface. Upstands, penetrations and edge details are formed carefully to prevent water ingress and meet fire and wind-uplift requirements. Safe access, hot works controls where relevant and weather monitoring are essential parts of planning this work.",
    hazards: ["work_at_height", "hot_work", "fire_explosion", "dust_fumes", "manual_handling"],
    questions: [
      { id: "q1", label: "Have you assessed the existing deck condition and load capacity prior to the flat roof (felt) install?" },
      { id: "q2", label: "Is a hot works permit required for any operations involved in the flat roof (felt) install?" },
      { id: "q3", label: "Will edge protection or fall restraint be provided around all exposed sides during the flat roof (felt) install?" },
      { id: "q4", label: "Are weather forecasts being monitored to avoid starting the flat roof (felt) install in unsuitable conditions?" },
      { id: "q5", label: "Will outlets and falls be checked and adjusted where feasible as part of the flat roof (felt) install?" }
    ]
  },
  "Flat roof (GRP) install": {
    desc: "Flat roof (GRP) install is centred on installing or fully renewing a flat roof waterproofing system using materials such as felt, GRP or EPDM. The process usually involves stripping existing coverings where necessary, preparing the deck, and applying insulation and membranes in layers to create a continuous weatherproof surface. Upstands, penetrations and edge details are formed carefully to prevent water ingress and meet fire and wind-uplift requirements. Safe access, hot works controls where relevant and weather monitoring are essential parts of planning this work.",
    hazards: ["work_at_height", "chemical_coshh", "dust_fumes", "manual_handling", "fire_explosion"],
    questions: [
      { id: "q1", label: "Have you assessed the existing deck condition and load capacity prior to the flat roof (grp) install?" },
      { id: "q2", label: "Is a hot works permit required for any operations involved in the flat roof (grp) install?" },
      { id: "q3", label: "Will edge protection or fall restraint be provided around all exposed sides during the flat roof (grp) install?" },
      { id: "q4", label: "Are weather forecasts being monitored to avoid starting the flat roof (grp) install in unsuitable conditions?" },
      { id: "q5", label: "Will outlets and falls be checked and adjusted where feasible as part of the flat roof (grp) install?" }
    ]
  },
  "Flat roof (EPDM) install": {
    desc: "Flat roof (EPDM) install is centred on installing or fully renewing a flat roof waterproofing system using materials such as felt, GRP or EPDM. The process usually involves stripping existing coverings where necessary, preparing the deck, and applying insulation and membranes in layers to create a continuous weatherproof surface. Upstands, penetrations and edge details are formed carefully to prevent water ingress and meet fire and wind-uplift requirements. Safe access, hot works controls where relevant and weather monitoring are essential parts of planning this work.",
    hazards: ["work_at_height", "chemical_coshh", "manual_handling", "slips_trips", "dust_fumes"],
    questions: [
      { id: "q1", label: "Have you assessed the existing deck condition and load capacity prior to the flat roof (epdm) install?" },
      { id: "q2", label: "Is a hot works permit required for any operations involved in the flat roof (epdm) install?" },
      { id: "q3", label: "Will edge protection or fall restraint be provided around all exposed sides during the flat roof (epdm) install?" },
      { id: "q4", label: "Are weather forecasts being monitored to avoid starting the flat roof (epdm) install in unsuitable conditions?" },
      { id: "q5", label: "Will outlets and falls be checked and adjusted where feasible as part of the flat roof (epdm) install?" }
    ]
  },
  "Lead flashing replacement": {
    desc: "Lead flashing replacement involves installing, adjusting or renewing lead or similar flashings at junctions between roof coverings and walls, chimneys, abutments or roof windows. The work includes cutting or chasing into masonry where required, forming soakers or aprons, and dressing the lead to shed water correctly. Consideration is given to thermal movement, jointing and fixing methods to avoid premature fatigue or failure. All debris is cleared from gutters and surfaces, and any exposed chases or fixings are sealed to maintain weathertightness.",
    hazards: ["work_at_height", "lead_exposure", "manual_handling", "dust_fumes", "silica_dust"],
    questions: [
      { id: "q1", label: "Have you confirmed that any masonry chasing required for the lead flashing replacement will not compromise structural stability?" },
      { id: "q2", label: "Will lead used in the lead flashing replacement be sized and detailed in accordance with current codes of practice?" },
      { id: "q3", label: "Are appropriate tools and PPE available to safely cut, dress and fix lead during the lead flashing replacement?" },
      { id: "q4", label: "Will existing flashings disturbed by the lead flashing replacement be either reinstated properly or fully renewed?" },
      { id: "q5", label: "Is sealant use in the lead flashing replacement limited to appropriate locations rather than as a substitute for proper detailing?" }
    ]
  },
  "Lead welding/leadwork": {
    desc: "Lead welding/leadwork involves installing, adjusting or renewing lead or similar flashings at junctions between roof coverings and walls, chimneys, abutments or roof windows. The work includes cutting or chasing into masonry where required, forming soakers or aprons, and dressing the lead to shed water correctly. Consideration is given to thermal movement, jointing and fixing methods to avoid premature fatigue or failure. All debris is cleared from gutters and surfaces, and any exposed chases or fixings are sealed to maintain weathertightness.",
    hazards: ["work_at_height", "hot_work", "lead_exposure", "dust_fumes", "manual_handling"],
    questions: [
      { id: "q1", label: "Have you confirmed that any masonry chasing required for the lead welding/leadwork will not compromise structural stability?" },
      { id: "q2", label: "Will lead used in the lead welding/leadwork be sized and detailed in accordance with current codes of practice?" },
      { id: "q3", label: "Are appropriate tools and PPE available to safely cut, dress and fix lead during the lead welding/leadwork?" },
      { id: "q4", label: "Will existing flashings disturbed by the lead welding/leadwork be either reinstated properly or fully renewed?" },
      { id: "q5", label: "Is sealant use in the lead welding/leadwork limited to appropriate locations rather than as a substitute for proper detailing?" }
    ]
  },
  "Gutter installation": {
    desc: "Gutter installation is focused on the roof edge components that collect and direct water away from the building envelope. Typical tasks include installing, repairing or replacing gutters, downpipes, fascias, soffits or bargeboards along eaves and verges. Work is often carried out at height, requiring stable access and measures to prevent falling objects. Once completed, the alignment, joints and fixings are checked and water is run through the system where possible to confirm proper flow.",
    hazards: ["work_at_height", "manual_handling", "slips_trips", "public_interface", "falling_objects"],
    questions: [
      { id: "q1", label: "Is the gutter installation being planned with stable working platforms or properly footed ladders?" },
      { id: "q2", label: "Will all old fixings and debris from the gutter installation be safely removed rather than left in gutters or on the ground?" },
      { id: "q3", label: "Have you checked that falls and outlet positions for the gutter installation will allow water to drain without standing?" },
      { id: "q4", label: "Are joints and connectors used in the gutter installation suitable for the materials and expected movement?" },
      { id: "q5", label: "Will any adjacent roof coverings disturbed by the gutter installation be checked and made good?" }
    ]
  },
  "Gutter repair": {
    desc: "Gutter repair is focused on the roof edge components that collect and direct water away from the building envelope. Typical tasks include installing, repairing or replacing gutters, downpipes, fascias, soffits or bargeboards along eaves and verges. Work is often carried out at height, requiring stable access and measures to prevent falling objects. Once completed, the alignment, joints and fixings are checked and water is run through the system where possible to confirm proper flow.",
    hazards: ["work_at_height", "manual_handling", "slips_trips", "biological", "falling_objects"],
    questions: [
      { id: "q1", label: "Is the gutter repair being planned with stable working platforms or properly footed ladders?" },
      { id: "q2", label: "Will all old fixings and debris from the gutter repair be safely removed rather than left in gutters or on the ground?" },
      { id: "q3", label: "Have you checked that falls and outlet positions for the gutter repair will allow water to drain without standing?" },
      { id: "q4", label: "Are joints and connectors used in the gutter repair suitable for the materials and expected movement?" },
      { id: "q5", label: "Will any adjacent roof coverings disturbed by the gutter repair be checked and made good?" }
    ]
  },
  "Fascia & soffit replacement": {
    desc: "Fascia & soffit replacement is focused on the roof edge components that collect and direct water away from the building envelope. Typical tasks include installing, repairing or replacing gutters, downpipes, fascias, soffits or bargeboards along eaves and verges. Work is often carried out at height, requiring stable access and measures to prevent falling objects. Once completed, the alignment, joints and fixings are checked and water is run through the system where possible to confirm proper flow.",
    hazards: ["work_at_height", "manual_handling", "asbestos", "dust_fumes", "falling_objects"],
    questions: [
      { id: "q1", label: "Is the fascia & soffit replacement being planned with stable working platforms or properly footed ladders?" },
      { id: "q2", label: "Will all old fixings and debris from the fascia & soffit replacement be safely removed rather than left in gutters or on the ground?" },
      { id: "q3", label: "Have you checked that falls and outlet positions for the fascia & soffit replacement will allow water to drain without standing?" },
      { id: "q4", label: "Are joints and connectors used in the fascia & soffit replacement suitable for the materials and expected movement?" },
      { id: "q5", label: "Will any adjacent roof coverings disturbed by the fascia & soffit replacement be checked and made good?" }
    ]
  },
  "Chimney repointing": {
    desc: "Chimney repointing relates to the structural and weathering elements of a chimney above the roof line. Activities can range from localised repointing to full rebuilds or removals, including working with brickwork, flaunching, pots and associated flashings. Stability of the stack must be assessed and maintained throughout the work, with suitable propping or staged dismantling where required. On completion, the chimney area is left in a condition that is both structurally sound and weathertight, with all loose material removed from the roof.",
    hazards: ["work_at_height", "falling_objects", "dust_fumes", "structural_collapse", "manual_handling"],
    questions: [
      { id: "q1", label: "Has the stability of the chimney been assessed before commencing the chimney repointing?" },
      { id: "q2", label: "Will the chimney repointing require temporary supports or staged dismantling to prevent collapse?" },
      { id: "q3", label: "Is access for the chimney repointing designed to allow safe handling of bricks, pots and mortar at height?" },
      { id: "q4", label: "Have flues associated with the chimney repointing been isolated or protected from falling debris?" },
      { id: "q5", label: "Will final inspections after the chimney repointing confirm both structural soundness and weather tightness?" }
    ]
  },
  "Chimney rebuild": {
    desc: "Chimney rebuild relates to the structural and weathering elements of a chimney above the roof line. Activities can range from localised repointing to full rebuilds or removals, including working with brickwork, flaunching, pots and associated flashings. Stability of the stack must be assessed and maintained throughout the work, with suitable propping or staged dismantling where required. On completion, the chimney area is left in a condition that is both structurally sound and weathertight, with all loose material removed from the roof.",
    hazards: ["work_at_height", "falling_objects", "dust_fumes", "structural_collapse", "manual_handling"],
    questions: [
      { id: "q1", label: "Has the stability of the chimney been assessed before commencing the chimney rebuild?" },
      { id: "q2", label: "Will the chimney rebuild require temporary supports or staged dismantling to prevent collapse?" },
      { id: "q3", label: "Is access for the chimney rebuild designed to allow safe handling of bricks, pots and mortar at height?" },
      { id: "q4", label: "Have flues associated with the chimney rebuild been isolated or protected from falling debris?" },
      { id: "q5", label: "Will final inspections after the chimney rebuild confirm both structural soundness and weather tightness?" }
    ]
  },
  "Chimney removal": {
    desc: "Chimney removal relates to the structural and weathering elements of a chimney above the roof line. Activities can range from localised repointing to full rebuilds or removals, including working with brickwork, flaunching, pots and associated flashings. Stability of the stack must be assessed and maintained throughout the work, with suitable propping or staged dismantling where required. On completion, the chimney area is left in a condition that is both structurally sound and weathertight, with all loose material removed from the roof.",
    hazards: ["work_at_height", "falling_objects", "structural_collapse", "dust_fumes", "manual_handling"],
    questions: [
      { id: "q1", label: "Has the stability of the chimney been assessed before commencing the chimney removal?" },
      { id: "q2", label: "Will the chimney removal require temporary supports or staged dismantling to prevent collapse?" },
      { id: "q3", label: "Is access for the chimney removal designed to allow safe handling of bricks, pots and mortar at height?" },
      { id: "q4", label: "Have flues associated with the chimney removal been isolated or protected from falling debris?" },
      { id: "q5", label: "Will final inspections after the chimney removal confirm both structural soundness and weather tightness?" }
    ]
  },
  "Roof leak investigation": {
    desc: "Roof leak investigation focuses on identifying the cause and extent of water ingress affecting a roof or internal areas. The work involves visual inspection, tracing signs of staining or damp, and carefully checking likely weak points such as junctions, penetrations and gutters. Access may be required both internally and externally, sometimes under adverse weather indications. Findings are used to plan either immediate temporary measures or subsequent permanent repairs.",
    hazards: ["work_at_height", "slips_trips", "fragile_surfaces", "environmental_weather"],
    questions: [
      { id: "q1", label: "Will you inspect both internal and external areas as part of the roof leak investigation?" },
      { id: "q2", label: "Are you planning to carry out the roof leak investigation under or after rainfall where this helps trace leaks?" },
      { id: "q3", label: "Have you made arrangements to access all roof slopes and junctions relevant to the roof leak investigation?" },
      { id: "q4", label: "Is there a process to record findings and suspected causes identified during the roof leak investigation?" },
      { id: "q5", label: "Will any urgent safety issues discovered during the roof leak investigation be addressed immediately or made safe?" }
    ]
  },
  "Emergency leak repair": {
    desc: "Emergency leak repair focuses on identifying the cause and extent of water ingress affecting a roof or internal areas. The work involves visual inspection, tracing signs of staining or damp, and carefully checking likely weak points such as junctions, penetrations and gutters. Access may be required both internally and externally, sometimes under adverse weather indications. Findings are used to plan either immediate temporary measures or subsequent permanent repairs.",
    hazards: ["work_at_height", "slips_trips", "fragile_surfaces", "environmental_weather"],
    questions: [
      { id: "q1", label: "Will you inspect both internal and external areas as part of the emergency leak repair?" },
      { id: "q2", label: "Are you planning to carry out the emergency leak repair under or after rainfall where this helps trace leaks?" },
      { id: "q3", label: "Have you made arrangements to access all roof slopes and junctions relevant to the emergency leak repair?" },
      { id: "q4", label: "Is there a process to record findings and suspected causes identified during the emergency leak repair?" },
      { id: "q5", label: "Will any urgent safety issues discovered during the emergency leak repair be addressed immediately or made safe?" }
    ]
  },
  "Moss removal": {
    desc: "Moss removal consists of removing organic growth, debris or surface contamination from roof coverings and associated components. Typical processes include manual scraping, brushing or controlled cleaning methods, taking care not to damage tiles, slates, membranes or fixings. Attention is given to protecting gutters, downpipes and surrounding areas from dislodged material. Once complete, the roof can be more easily inspected and continues to shed water as designed.",
    hazards: ["work_at_height", "slips_trips", "environmental_weather", "biological", "falling_objects"],
    questions: [
      { id: "q1", label: "Are you avoiding the use of high-pressure washing directly onto vulnerable coverings during the moss removal?" },
      { id: "q2", label: "Will the moss removal include measures to prevent dislodged material blocking gutters and downpipes?" },
      { id: "q3", label: "Have you selected cleaning methods and chemicals for the moss removal that are compatible with the roof materials?" },
      { id: "q4", label: "Is safe access and footing assured on all areas to be treated during the moss removal?" },
      { id: "q5", label: "Will you visually inspect for any damage or defects revealed by the moss removal once cleaning is complete?" }
    ]
  },
  "Roof cleaning": {
    desc: "Roof cleaning consists of removing organic growth, debris or surface contamination from roof coverings and associated components. Typical processes include manual scraping, brushing or controlled cleaning methods, taking care not to damage tiles, slates, membranes or fixings. Attention is given to protecting gutters, downpipes and surrounding areas from dislodged material. Once complete, the roof can be more easily inspected and continues to shed water as designed.",
    hazards: ["work_at_height", "slips_trips", "environmental_weather", "biological", "chemical_coshh"],
    questions: [
      { id: "q1", label: "Are you avoiding the use of high-pressure washing directly onto vulnerable coverings during the roof cleaning?" },
      { id: "q2", label: "Will the roof cleaning include measures to prevent dislodged material blocking gutters and downpipes?" },
      { id: "q3", label: "Have you selected cleaning methods and chemicals for the roof cleaning that are compatible with the roof materials?" },
      { id: "q4", label: "Is safe access and footing assured on all areas to be treated during the roof cleaning?" },
      { id: "q5", label: "Will you visually inspect for any damage or defects revealed by the roof cleaning once cleaning is complete?" }
    ]
  },
  "Ridge tile repointing": {
    desc: "Ridge tile repointing focuses on localised adjustments or renewals to limited areas of a pitched roof. Activities may include lifting and relaying small sections of tiles or slates, addressing minor defects in bedding or fixings, and tying in repairs with the surrounding roof. Attention is paid to matching existing materials and maintaining correct overlaps and water shedding. Access is usually from scaffold, towers or ladders, with debris managed to prevent hazards to people below.",
    hazards: ["work_at_height", "falling_objects", "manual_handling", "dust_fumes", "slips_trips"],
    questions: [
      { id: "q1", label: "Is access for the ridge tile repointing being arranged in a way that avoids overreaching from ladders?" },
      { id: "q2", label: "Have you checked that localised areas affected by the ridge tile repointing are structurally sound before stepping on them?" },
      { id: "q3", label: "Will all loose or cracked tiles identified during the ridge tile repointing be either secured or replaced?" },
      { id: "q4", label: "Are you protecting gutters and lower roofs from falling debris while the ridge tile repointing is in progress?" },
      { id: "q5", label: "Will photographs be taken before and after the ridge tile repointing to document the repair region?" }
    ]
  },
  "Valley replacement": {
    desc: "Valley replacement focuses on localised adjustments or renewals to limited areas of a pitched roof. Activities may include lifting and relaying small sections of tiles or slates, addressing minor defects in bedding or fixings, and tying in repairs with the surrounding roof. Attention is paid to matching existing materials and maintaining correct overlaps and water shedding. Access is usually from scaffold, towers or ladders, with debris managed to prevent hazards to people below.",
    hazards: ["work_at_height", "falling_objects", "manual_handling", "water_ingress", "slips_trips"],
    questions: [
      { id: "q1", label: "Is access for the valley replacement being arranged in a way that avoids overreaching from ladders?" },
      { id: "q2", label: "Have you checked that localised areas affected by the valley replacement are structurally sound before stepping on them?" },
      { id: "q3", label: "Will all loose or cracked tiles identified during the valley replacement be either secured or replaced?" },
      { id: "q4", label: "Are you protecting gutters and lower roofs from falling debris while the valley replacement is in progress?" },
      { id: "q5", label: "Will photographs be taken before and after the valley replacement to document the repair region?" }
    ]
  },
  "Roof ventilation installation": {
    desc: "Roof ventilation installation addresses the provision or improvement of ventilation to roof spaces or coverings to manage condensation and moisture. The work can include fitting new vents at eaves, ridges or through the roof, and cutting or adapting roof coverings and linings accordingly. Care is taken to maintain weathering integrity while creating airflow paths in accordance with design guidance. After installation, the routes are checked to ensure they are unobstructed and compatible with insulation and other systems.",
    hazards: ["work_at_height", "dust_fumes", "manual_handling", "environmental_weather", "sharp_objects"],
    questions: [
      { id: "q1", label: "Have you checked for existing vents and their effectiveness before starting the roof ventilation installation?" },
      { id: "q2", label: "Will the roof ventilation installation maintain required levels of weather tightness while adding airflow paths?" },
      { id: "q3", label: "Are cutting tools and methods for the roof ventilation installation chosen to minimise dust and damage to finishes?" },
      { id: "q4", label: "Is there a risk that insulation may block vents installed as part of the roof ventilation installation?" },
      { id: "q5", label: "Will the location and number of vents used in the roof ventilation installation follow design or manufacturer recommendations?" }
    ]
  },
  "Roof window / Velux installation": {
    desc: "Roof window / Velux installation involves creating or modifying openings in a roof to accommodate roof windows, skylights or similar glazed units. The task includes trimming existing structure, installing frames, integrating flashings and making good internal linings. Structural support and weathering around the opening must be carefully detailed to prevent movement and leaks. Final checks confirm smooth operation of the unit and effective drainage of water away from the junctions.",
    hazards: ["work_at_height", "falling_objects", "structural_collapse", "manual_handling", "water_ingress"],
    questions: [
      { id: "q1", label: "Have you confirmed structural trimmers and supports needed for the roof window / velux installation are correctly sized?" },
      { id: "q2", label: "Will the roof window / velux installation be carried out with the opening temporarily weathered if works span multiple days?" },
      { id: "q3", label: "Are flashing kits and accessories for the roof window / velux installation matched to both the roof covering and the window type?" },
      { id: "q4", label: "Is internal fall protection arranged beneath the opening during the roof window / velux installation to prevent debris hazards?" },
      { id: "q5", label: "Will you test operation and check for water ingress around the new opening after the roof window / velux installation?" }
    ]
  },
  "Dormer construction": {
    desc: "Dormer construction covers constructing or waterproofing dormer structures that project from the main roof slope. Tasks may include framing, sheathing, installing windows, applying coverings and integrating flashings with the main roof. Structural support, thermal performance and weather tightness all need careful coordination at junctions. The finished dormer should provide durable accommodation while shedding water safely onto the surrounding roof.",
    hazards: ["work_at_height", "structural_collapse", "manual_handling", "falling_objects", "environmental_weather"],
    questions: [
      { id: "q1", label: "Have structural alterations required for the dormer construction been designed or approved by an engineer?" },
      { id: "q2", label: "Will the dormer construction maintain adequate support for the existing roof around the dormer opening?" },
      { id: "q3", label: "Are junctions between dormer cheeks, roof coverings and walls being carefully detailed in the dormer construction?" },
      { id: "q4", label: "Is temporary weather protection planned if the dormer construction cannot be fully completed in one sequence?" },
      { id: "q5", label: "Will internal finishes and insulation around the dormer from the dormer construction meet thermal and moisture requirements?" }
    ]
  },
  "Skylight replacement": {
    desc: "Skylight replacement involves creating or modifying openings in a roof to accommodate roof windows, skylights or similar glazed units. The task includes trimming existing structure, installing frames, integrating flashings and making good internal linings. Structural support and weathering around the opening must be carefully detailed to prevent movement and leaks. Final checks confirm smooth operation of the unit and effective drainage of water away from the junctions.",
    hazards: ["work_at_height", "falling_objects", "fragile_surfaces", "manual_handling", "water_ingress"],
    questions: [
      { id: "q1", label: "Have you confirmed structural trimmers and supports needed for the skylight replacement are correctly sized?" },
      { id: "q2", label: "Will the skylight replacement be carried out with the opening temporarily weathered if works span multiple days?" },
      { id: "q3", label: "Are flashing kits and accessories for the skylight replacement matched to both the roof covering and the window type?" },
      { id: "q4", label: "Is internal fall protection arranged beneath the opening during the skylight replacement to prevent debris hazards?" },
      { id: "q5", label: "Will you test operation and check for water ingress around the new opening after the skylight replacement?" }
    ]
  },
  "Soffit ventilation upgrade": {
    desc: "Soffit ventilation upgrade addresses the provision or improvement of ventilation to roof spaces or coverings to manage condensation and moisture. The work can include fitting new vents at eaves, ridges or through the roof, and cutting or adapting roof coverings and linings accordingly. Care is taken to maintain weathering integrity while creating airflow paths in accordance with design guidance. After installation, the routes are checked to ensure they are unobstructed and compatible with insulation and other systems.",
    hazards: ["work_at_height", "dust_fumes", "manual_handling", "environmental_weather", "asbestos"],
    questions: [
      { id: "q1", label: "Have you checked for existing vents and their effectiveness before starting the soffit ventilation upgrade?" },
      { id: "q2", label: "Will the soffit ventilation upgrade maintain required levels of weather tightness while adding airflow paths?" },
      { id: "q3", label: "Are cutting tools and methods for the soffit ventilation upgrade chosen to minimise dust and damage to finishes?" },
      { id: "q4", label: "Is there a risk that insulation may block vents installed as part of the soffit ventilation upgrade?" },
      { id: "q5", label: "Will the location and number of vents used in the soffit ventilation upgrade follow design or manufacturer recommendations?" }
    ]
  },
  "Roof insulation install": {
    desc: "Roof insulation install is focused on improving the thermal performance of the roof or loft area by installing insulation materials. This can include placing insulation between and over rafters, or laying quilts or boards at ceiling level in roof voids. Ventilation openings, downlight clearances and access routes must be maintained to avoid condensation and overheating risks. On completion, the insulation is left evenly distributed and any hatches or walkways are reinstated safely.",
    hazards: ["work_at_height", "dust_fumes", "confined_space", "heat_stress", "manual_handling"],
    questions: [
      { id: "q1", label: "Have you confirmed the type and thickness of insulation to be used in the roof insulation install in line with design or regulations?" },
      { id: "q2", label: "Will the roof insulation install ensure that ventilation paths are maintained and not blocked by new materials?" },
      { id: "q3", label: "Are you protecting downlights, flues and other heat sources from contact with insulation during the roof insulation install?" },
      { id: "q4", label: "Is access for maintenance or storage in loft areas being considered as part of the roof insulation install?" },
      { id: "q5", label: "Will you check for and address any signs of existing condensation problems during the roof insulation install?" }
    ]
  },
  "Loft insulation": {
    desc: "Loft insulation is focused on improving the thermal performance of the roof or loft area by installing insulation materials. This can include placing insulation between and over rafters, or laying quilts or boards at ceiling level in roof voids. Ventilation openings, downlight clearances and access routes must be maintained to avoid condensation and overheating risks. On completion, the insulation is left evenly distributed and any hatches or walkways are reinstated safely.",
    hazards: ["confined_space", "dust_fumes", "manual_handling", "heat_stress", "fragile_surfaces"],
    questions: [
      { id: "q1", label: "Have you confirmed the type and thickness of insulation to be used in the loft insulation in line with design or regulations?" },
      { id: "q2", label: "Will the loft insulation ensure that ventilation paths are maintained and not blocked by new materials?" },
      { id: "q3", label: "Are you protecting downlights, flues and other heat sources from contact with insulation during the loft insulation?" },
      { id: "q4", label: "Is access for maintenance or storage in loft areas being considered as part of the loft insulation?" },
      { id: "q5", label: "Will you check for and address any signs of existing condensation problems during the loft insulation?" }
    ]
  },
  "Flat-to-pitched roof conversion": {
    desc: "Flat-to-pitched roof conversion involves large-scale work on a pitched roof covering, often renewing all or most of the existing tiles or slates. The task typically includes stripping the old coverings, inspecting and repairing battens and underlay, and fixing new materials in accordance with manufacturer guidance. Careful setting-out and fixing patterns are required to ensure weather tightness and a uniform appearance. The work is normally carried out from scaffold or other fixed access with appropriate edge protection in place throughout.",
    hazards: ["work_at_height", "structural_collapse", "manual_handling", "falling_objects", "environmental_weather"],
    questions: [
      { id: "q1", label: "Has full scaffold with suitable edge protection been installed for the flat-to-pitched roof conversion?" },
      { id: "q2", label: "Will all existing roof coverings be assessed for safe removal before starting the flat-to-pitched roof conversion?" },
      { id: "q3", label: "Have you confirmed that replacement materials for the flat-to-pitched roof conversion are compatible in weight and fixing with the existing structure?" },
      { id: "q4", label: "Is there a plan for controlled waste removal and chute use during the flat-to-pitched roof conversion?" },
      { id: "q5", label: "Will temporary weatherproofing be available if the flat-to-pitched roof conversion cannot be completed in one phase?" }
    ]
  },
  "Re-bedding ridge tiles": {
    desc: "Re-bedding ridge tiles focuses on localised adjustments or renewals to limited areas of a pitched roof. Activities may include lifting and relaying small sections of tiles or slates, addressing minor defects in bedding or fixings, and tying in repairs with the surrounding roof. Attention is paid to matching existing materials and maintaining correct overlaps and water shedding. Access is usually from scaffold, towers or ladders, with debris managed to prevent hazards to people below.",
    hazards: ["work_at_height", "falling_objects", "manual_handling", "dust_fumes", "environmental_weather"],
    questions: [
      { id: "q1", label: "Is access for the re-bedding ridge tiles being arranged in a way that avoids overreaching from ladders?" },
      { id: "q2", label: "Have you checked that localised areas affected by the re-bedding ridge tiles are structurally sound before stepping on them?" },
      { id: "q3", label: "Will all loose or cracked tiles identified during the re-bedding ridge tiles be either secured or replaced?" },
      { id: "q4", label: "Are you protecting gutters and lower roofs from falling debris while the re-bedding ridge tiles is in progress?" },
      { id: "q5", label: "Will photographs be taken before and after the re-bedding ridge tiles to document the repair region?" }
    ]
  },
  "Soffit repair": {
    desc: "Soffit repair is focused on the roof edge components that collect and direct water away from the building envelope. Typical tasks include installing, repairing or replacing gutters, downpipes, fascias, soffits or bargeboards along eaves and verges. Work is often carried out at height, requiring stable access and measures to prevent falling objects. Once completed, the alignment, joints and fixings are checked and water is run through the system where possible to confirm proper flow.",
    hazards: ["work_at_height", "manual_handling", "dust_fumes", "asbestos", "falling_objects"],
    questions: [
      { id: "q1", label: "Is the soffit repair being planned with stable working platforms or properly footed ladders?" },
      { id: "q2", label: "Will all old fixings and debris from the soffit repair be safely removed rather than left in gutters or on the ground?" },
      { id: "q3", label: "Have you checked that falls and outlet positions for the soffit repair will allow water to drain without standing?" },
      { id: "q4", label: "Are joints and connectors used in the soffit repair suitable for the materials and expected movement?" },
      { id: "q5", label: "Will any adjacent roof coverings disturbed by the soffit repair be checked and made good?" }
    ]
  },
  "Roof coating/sealant": {
    desc: "Roof coating/sealant involves applying surface treatments to roof coverings to enhance weather resistance, extend service life or change appearance. The process normally starts with cleaning and preparing the roof, followed by application of liquid or film-forming products in accordance with manufacturer recommendations. Adjacent surfaces, gutters and ground areas must be protected from overspray or spills. Weather conditions are monitored to ensure that curing or drying occurs correctly and safely.",
    hazards: ["work_at_height", "chemical_coshh", "dust_fumes", "slips_trips", "environmental_weather"],
    questions: [
      { id: "q1", label: "Is the roof surface being properly cleaned and prepared before applying products for the roof coating/sealant?" },
      { id: "q2", label: "Have you checked that weather conditions during and after the roof coating/sealant are suitable for curing?" },
      { id: "q3", label: "Are all adjacent surfaces adequately masked or protected from overspray during the roof coating/sealant?" },
      { id: "q4", label: "Is the roof coating/sealant using coatings compatible with the existing roof substrate and details?" },
      { id: "q5", label: "Will the roof be re-inspected after the roof coating/sealant to ensure full and defect-free coverage?" }
    ]
  },
  "EPDM patch repair": {
    desc: "EPDM patch repair deals with targeted repairs to existing flat roof systems to rectify leaks or damage without full replacement. It often involves locating the source of water ingress, preparing the surrounding area and applying compatible patch materials or detailing. Surfaces must be cleaned and dried, and edges of the repair securely sealed to integrate with the original system. The success of the work is typically confirmed through visual checks and observation during subsequent rainfall.",
    hazards: ["work_at_height", "chemical_coshh", "manual_handling", "slips_trips", "water_ingress"],
    questions: [
      { id: "q1", label: "Have you identified the probable source area of water ingress before commencing the epdm patch repair?" },
      { id: "q2", label: "Is the roof surface for the epdm patch repair dry and clean enough to allow effective adhesion of repair materials?" },
      { id: "q3", label: "Are compatible products being used for the epdm patch repair so that they bond correctly to the existing system?" },
      { id: "q4", label: "Will you check for trapped moisture around the repair area during the epdm patch repair?" },
      { id: "q5", label: "Is there a plan to revisit the site after rainfall to confirm the epdm patch repair has resolved the leak?" }
    ]
  },
  "GRP patch repair": {
    desc: "GRP patch repair deals with targeted repairs to existing flat roof systems to rectify leaks or damage without full replacement. It often involves locating the source of water ingress, preparing the surrounding area and applying compatible patch materials or detailing. Surfaces must be cleaned and dried, and edges of the repair securely sealed to integrate with the original system. The success of the work is typically confirmed through visual checks and observation during subsequent rainfall.",
    hazards: ["work_at_height", "chemical_coshh", "dust_fumes", "manual_handling", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you identified the probable source area of water ingress before commencing the grp patch repair?" },
      { id: "q2", label: "Is the roof surface for the grp patch repair dry and clean enough to allow effective adhesion of repair materials?" },
      { id: "q3", label: "Are compatible products being used for the grp patch repair so that they bond correctly to the existing system?" },
      { id: "q4", label: "Will you check for trapped moisture around the repair area during the grp patch repair?" },
      { id: "q5", label: "Is there a plan to revisit the site after rainfall to confirm the grp patch repair has resolved the leak?" }
    ]
  },
  "Pitched roof underlay replacement": {
    desc: "Pitched roof underlay replacement involves large-scale work on a pitched roof covering, often renewing all or most of the existing tiles or slates. The task typically includes stripping the old coverings, inspecting and repairing battens and underlay, and fixing new materials in accordance with manufacturer guidance. Careful setting-out and fixing patterns are required to ensure weather tightness and a uniform appearance. The work is normally carried out from scaffold or other fixed access with appropriate edge protection in place throughout.",
    hazards: ["work_at_height", "falling_objects", "manual_handling", "fragile_surfaces", "environmental_weather"],
    questions: [
      { id: "q1", label: "Has full scaffold with suitable edge protection been installed for the pitched roof underlay replacement?" },
      { id: "q2", label: "Will all existing roof coverings be assessed for safe removal before starting the pitched roof underlay replacement?" },
      { id: "q3", label: "Have you confirmed that replacement materials for the pitched roof underlay replacement are compatible in weight and fixing with the existing structure?" },
      { id: "q4", label: "Is there a plan for controlled waste removal and chute use during the pitched roof underlay replacement?" },
      { id: "q5", label: "Will temporary weatherproofing be available if the pitched roof underlay replacement cannot be completed in one phase?" }
    ]
  },
  "Tile/Slate replacement (minor)": {
    desc: "Tile/Slate replacement (minor) focuses on localised adjustments or renewals to limited areas of a pitched roof. Activities may include lifting and relaying small sections of tiles or slates, addressing minor defects in bedding or fixings, and tying in repairs with the surrounding roof. Attention is paid to matching existing materials and maintaining correct overlaps and water shedding. Access is usually from scaffold, towers or ladders, with debris managed to prevent hazards to people below.",
    hazards: ["work_at_height", "falling_objects", "manual_handling", "environmental_weather", "slips_trips"],
    questions: [
      { id: "q1", label: "Is access for the tile/slate replacement (minor) being arranged in a way that avoids overreaching from ladders?" },
      { id: "q2", label: "Have you checked that localised areas affected by the tile/slate replacement (minor) are structurally sound before stepping on them?" },
      { id: "q3", label: "Will all loose or cracked tiles identified during the tile/slate replacement (minor) be either secured or replaced?" },
      { id: "q4", label: "Are you protecting gutters and lower roofs from falling debris while the tile/slate replacement (minor) is in progress?" },
      { id: "q5", label: "Will photographs be taken before and after the tile/slate replacement (minor) to document the repair region?" }
    ]
  },
  "Roofline repair (bargeboards)": {
    desc: "Roofline repair (bargeboards) is focused on the roof edge components that collect and direct water away from the building envelope. Typical tasks include installing, repairing or replacing gutters, downpipes, fascias, soffits or bargeboards along eaves and verges. Work is often carried out at height, requiring stable access and measures to prevent falling objects. Once completed, the alignment, joints and fixings are checked and water is run through the system where possible to confirm proper flow.",
    hazards: ["work_at_height", "manual_handling", "asbestos", "slips_trips", "falling_objects"],
    questions: [
      { id: "q1", label: "Is the roofline repair (bargeboards) being planned with stable working platforms or properly footed ladders?" },
      { id: "q2", label: "Will all old fixings and debris from the roofline repair (bargeboards) be safely removed rather than left in gutters or on the ground?" },
      { id: "q3", label: "Have you checked that falls and outlet positions for the roofline repair (bargeboards) will allow water to drain without standing?" },
      { id: "q4", label: "Are joints and connectors used in the roofline repair (bargeboards) suitable for the materials and expected movement?" },
      { id: "q5", label: "Will any adjacent roof coverings disturbed by the roofline repair (bargeboards) be checked and made good?" }
    ]
  },
  "Verge repair/reconstruction": {
    desc: "Verge repair/reconstruction focuses on localised adjustments or renewals to limited areas of a pitched roof. Activities may include lifting and relaying small sections of tiles or slates, addressing minor defects in bedding or fixings, and tying in repairs with the surrounding roof. Attention is paid to matching existing materials and maintaining correct overlaps and water shedding. Access is usually from scaffold, towers or ladders, with debris managed to prevent hazards to people below.",
    hazards: ["work_at_height", "falling_objects", "manual_handling", "environmental_weather", "cement"],
    questions: [
      { id: "q1", label: "Is access for the verge repair/reconstruction being arranged in a way that avoids overreaching from ladders?" },
      { id: "q2", label: "Have you checked that localised areas affected by the verge repair/reconstruction are structurally sound before stepping on them?" },
      { id: "q3", label: "Will all loose or cracked tiles identified during the verge repair/reconstruction be either secured or replaced?" },
      { id: "q4", label: "Are you protecting gutters and lower roofs from falling debris while the verge repair/reconstruction is in progress?" },
      { id: "q5", label: "Will photographs be taken before and after the verge repair/reconstruction to document the repair region?" }
    ]
  },
  "Chimney cowl installation": {
    desc: "Chimney cowl installation relates to the structural and weathering elements of a chimney above the roof line. Activities can range from localised repointing to full rebuilds or removals, including working with brickwork, flaunching, pots and associated flashings. Stability of the stack must be assessed and maintained throughout the work, with suitable propping or staged dismantling where required. On completion, the chimney area is left in a condition that is both structurally sound and weathertight, with all loose material removed from the roof.",
    hazards: ["work_at_height", "falling_objects", "manual_handling", "environmental_weather"],
    questions: [
      { id: "q1", label: "Has the stability of the chimney been assessed before commencing the chimney cowl installation?" },
      { id: "q2", label: "Will the chimney cowl installation require temporary supports or staged dismantling to prevent collapse?" },
      { id: "q3", label: "Is access for the chimney cowl installation designed to allow safe handling of bricks, pots and mortar at height?" },
      { id: "q4", label: "Have flues associated with the chimney cowl installation been isolated or protected from falling debris?" },
      { id: "q5", label: "Will final inspections after the chimney cowl installation confirm both structural soundness and weather tightness?" }
    ]
  },
  "Bird proofing work": {
    desc: "Bird proofing work deals with installing systems to discourage birds from nesting or roosting on roofs, ledges or around chimney and solar installations. It may include fitting spikes, nets, mesh or bespoke barriers, often at exposed or awkward positions. The design must balance effectiveness with minimal impact on the building fabric and drainage paths. All fixings and materials are checked to ensure they are secure and do not introduce new hazards or maintenance issues.",
    hazards: ["work_at_height", "biological", "manual_handling", "sharp_objects", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you assessed routes and methods for safe access to all locations involved in the bird proofing work?" },
      { id: "q2", label: "Is the bird proofing work designed to avoid trapping birds or other wildlife rather than just deterring them?" },
      { id: "q3", label: "Are fixings for the bird proofing work selected to prevent damage to the roof fabric or cladding?" },
      { id: "q4", label: "Will netting or barriers installed during the bird proofing work be tensioned and supported to prevent sagging?" },
      { id: "q5", label: "Is there a plan for future inspection and maintenance of systems fitted during the bird proofing work?" }
    ]
  },
  "Solar panel roof mounting prep": {
    desc: "Solar panel roof mounting prep is associated with solar panel systems mounted on or above roof coverings, either preparing for or working around existing installations. The tasks can include fitting support rails, adjusting fixings, or temporarily removing and refitting panels to allow roof repairs. Coordination with electrical specialists is important, particularly in relation to live DC circuits and inverter equipment. All penetrations and fixings must be detailed so that the roof remains watertight once the work is finished.",
    hazards: ["work_at_height", "manual_handling", "live_electricity", "falling_objects", "slips_trips"],
    questions: [
      { id: "q1", label: "Have electrical isolation procedures been agreed with a competent person before the solar panel roof mounting prep?" },
      { id: "q2", label: "Will the solar panel roof mounting prep involve working around live DC circuits that require additional precautions?" },
      { id: "q3", label: "Are mounting systems used in the solar panel roof mounting prep compatible with the roof covering and structure?" },
      { id: "q4", label: "Is there a strategy to prevent damage to roof coverings when removing or reinstating panels as part of the solar panel roof mounting prep?" },
      { id: "q5", label: "Will you confirm that drainage paths and access routes remain acceptable after completing the solar panel roof mounting prep?" }
    ]
  },
  "Solar panel removal & reinstatement": {
    desc: "Solar panel removal & reinstatement is associated with solar panel systems mounted on or above roof coverings, either preparing for or working around existing installations. The tasks can include fitting support rails, adjusting fixings, or temporarily removing and refitting panels to allow roof repairs. Coordination with electrical specialists is important, particularly in relation to live DC circuits and inverter equipment. All penetrations and fixings must be detailed so that the roof remains watertight once the work is finished.",
    hazards: ["work_at_height", "manual_handling", "live_electricity", "falling_objects", "slips_trips"],
    questions: [
      { id: "q1", label: "Have electrical isolation procedures been agreed with a competent person before the solar panel removal & reinstatement?" },
      { id: "q2", label: "Will the solar panel removal & reinstatement involve working around live DC circuits that require additional precautions?" },
      { id: "q3", label: "Are mounting systems used in the solar panel removal & reinstatement compatible with the roof covering and structure?" },
      { id: "q4", label: "Is there a strategy to prevent damage to roof coverings when removing or reinstating panels as part of the solar panel removal & reinstatement?" },
      { id: "q5", label: "Will you confirm that drainage paths and access routes remain acceptable after completing the solar panel removal & reinstatement?" }
    ]
  },
  "Parapet wall repair": {
    desc: "Parapet wall repair relates to the repair or improvement of parapet walls and their interfaces with adjacent roof coverings. Work often includes rebuilding damaged sections, renewing copings and improving flashings or upstands. Careful attention is paid to managing water runoff so that it does not pond or penetrate at the junctions. The completed parapet must be structurally sound and compatible with any membranes or coverings below.",
    hazards: ["work_at_height", "falling_objects", "manual_handling", "environmental_weather", "dust_fumes"],
    questions: [
      { id: "q1", label: "Have you planned temporary edge protection or barriers for the parapet wall repair where parapet integrity is reduced?" },
      { id: "q2", label: "Will all coping and capping details disturbed by the parapet wall repair be reinstated or upgraded for improved weathering?" },
      { id: "q3", label: "Are there any signs of water tracking through the parapet that need addressing during the parapet wall repair?" },
      { id: "q4", label: "Is the parapet wall repair designed to maintain or improve the interface between parapet walls and roof membranes?" },
      { id: "q5", label: "Will the parapet be inspected from both sides after the parapet wall repair to confirm stability and finish quality?" }
    ]
  },
  "Flashing upgrade for roof windows": {
    desc: "Flashing upgrade for roof windows involves installing, adjusting or renewing lead or similar flashings at junctions between roof coverings and walls, chimneys, abutments or roof windows. The work includes cutting or chasing into masonry where required, forming soakers or aprons, and dressing the lead to shed water correctly. Consideration is given to thermal movement, jointing and fixing methods to avoid premature fatigue or failure. All debris is cleared from gutters and surfaces, and any exposed chases or fixings are sealed to maintain weathertightness.",
    hazards: ["work_at_height", "manual_handling", "falling_objects", "water_ingress", "lead_exposure"],
    questions: [
      { id: "q1", label: "Have you confirmed that any masonry chasing required for the flashing upgrade for roof windows will not compromise structural stability?" },
      { id: "q2", label: "Will lead used in the flashing upgrade for roof windows be sized and detailed in accordance with current codes of practice?" },
      { id: "q3", label: "Are appropriate tools and PPE available to safely cut, dress and fix lead during the flashing upgrade for roof windows?" },
      { id: "q4", label: "Will existing flashings disturbed by the flashing upgrade for roof windows be either reinstated properly or fully renewed?" },
      { id: "q5", label: "Is sealant use in the flashing upgrade for roof windows limited to appropriate locations rather than as a substitute for proper detailing?" }
    ]
  },
  "Slate hangers installation": {
    desc: "Slate hangers installation focuses on localised adjustments or renewals to limited areas of a pitched roof. Activities may include lifting and relaying small sections of tiles or slates, addressing minor defects in bedding or fixings, and tying in repairs with the surrounding roof. Attention is paid to matching existing materials and maintaining correct overlaps and water shedding. Access is usually from scaffold, towers or ladders, with debris managed to prevent hazards to people below.",
    hazards: ["work_at_height", "falling_objects", "manual_handling", "environmental_weather", "slips_trips"],
    questions: [
      { id: "q1", label: "Is access for the slate hangers installation being arranged in a way that avoids overreaching from ladders?" },
      { id: "q2", label: "Have you checked that localised areas affected by the slate hangers installation are structurally sound before stepping on them?" },
      { id: "q3", label: "Will all loose or cracked tiles identified during the slate hangers installation be either secured or replaced?" },
      { id: "q4", label: "Are you protecting gutters and lower roofs from falling debris while the slate hangers installation is in progress?" },
      { id: "q5", label: "Will photographs be taken before and after the slate hangers installation to document the repair region?" }
    ]
  },
  "Metal roofing installation": {
    desc: "Metal roofing installation involves installing or repairing metal sheet roofing systems, which may be profiled or standing seam. The work includes fixing sheets to sub-structures, detailing joints, laps and penetrations, and managing thermal movement. Noise, condensation control and compatibility with supporting structures are considered during design and installation. On completion, fixings and seals are inspected and any swarf or debris is removed to prevent corrosion.",
    hazards: ["work_at_height", "manual_handling", "sharp_objects", "environmental_weather", "slips_trips"],
    questions: [
      { id: "q1", label: "Have slip resistance and fall protection measures been considered for walking on sheets during the metal roofing installation?" },
      { id: "q2", label: "Will the metal roofing installation use fixings and sealants approved for the specific metal roofing system?" },
      { id: "q3", label: "Are expansion joints or sliding fixings allowed for thermal movement in the metal roofing installation?" },
      { id: "q4", label: "Is attention being paid to cutting methods during the metal roofing installation to minimise hot swarf and edge damage?" },
      { id: "q5", label: "Will gutters and lower roofs be checked and cleaned of any swarf after the metal roofing installation?" }
    ]
  },
  "Asbestos corrugated sheet removal": {
    desc: "Asbestos corrugated sheet removal addresses asbestos-containing roof sheets, typically in older industrial or agricultural buildings. The work must follow strict procedures to minimise fibre release, including controlled removal, damping down and using appropriate respiratory protection. Materials are handled carefully to avoid breakage and are packaged and labelled for disposal as hazardous waste. Only trained and appropriately equipped personnel should undertake this work, in accordance with relevant regulations.",
    hazards: ["work_at_height", "asbestos", "manual_handling", "environmental_weather", "chemical_coshh"],
    questions: [
      { id: "q1", label: "Has an asbestos survey or sampling confirmed the presence and type of material for the asbestos corrugated sheet removal?" },
      { id: "q2", label: "Are only trained and appropriately equipped personnel carrying out the asbestos corrugated sheet removal?" },
      { id: "q3", label: "Will wet methods and minimal breakage techniques be used to control dust during the asbestos corrugated sheet removal?" },
      { id: "q4", label: "Is there an agreed route and method for removing and storing waste generated by the asbestos corrugated sheet removal?" },
      { id: "q5", label: "Have notifications and regulatory requirements been satisfied prior to commencing the asbestos corrugated sheet removal?" }
    ]
  },
  "Roof access system installation": {
    desc: "Roof access system installation is focused on installing or upgrading fixed access systems that allow safe repeated access to roof areas. This can include ladders, guardrails, walkways, anchor points or step systems designed to integrate with the roof structure. The design takes into account fall protection, loadings and routes used by maintenance staff. Once installed, the system is inspected, labelled and, where necessary, certified for ongoing safe use.",
    hazards: ["work_at_height", "manual_handling", "falling_objects", "structural_collapse"],
    questions: [
      { id: "q1", label: "Has a design or specification been produced for the roof access system installation by a competent person?" },
      { id: "q2", label: "Will anchor points or guardrails installed during the roof access system installation be tested or certified as required?" },
      { id: "q3", label: "Are fixings for the roof access system installation chosen to suit the roof structure and loading conditions?" },
      { id: "q4", label: "Is there a plan to provide users with instructions or training on systems installed during the roof access system installation?" },
      { id: "q5", label: "Will inspection and re-certification intervals for equipment from the roof access system installation be clearly stated?" }
    ]
  },
  "Dormer roof waterproofing": {
    desc: "Dormer roof waterproofing covers constructing or waterproofing dormer structures that project from the main roof slope. Tasks may include framing, sheathing, installing windows, applying coverings and integrating flashings with the main roof. Structural support, thermal performance and weather tightness all need careful coordination at junctions. The finished dormer should provide durable accommodation while shedding water safely onto the surrounding roof.",
    hazards: ["work_at_height", "manual_handling", "hot_work", "chemical_coshh", "dust_fumes"],
    questions: [
      { id: "q1", label: "Have structural alterations required for the dormer roof waterproofing been designed or approved by an engineer?" },
      { id: "q2", label: "Will the dormer roof waterproofing maintain adequate support for the existing roof around the dormer opening?" },
      { id: "q3", label: "Are junctions between dormer cheeks, roof coverings and walls being carefully detailed in the dormer roof waterproofing?" },
      { id: "q4", label: "Is temporary weather protection planned if the dormer roof waterproofing cannot be fully completed in one sequence?" },
      { id: "q5", label: "Will internal finishes and insulation around the dormer from the dormer roof waterproofing meet thermal and moisture requirements?" }
    ]
  },
  "Green roof installation": {
    desc: "Green roof installation involves creating or maintaining green roof systems that support vegetation above a waterproofing layer. The build-up typically includes root barriers, drainage layers, growing medium and planting selected for the roof environment. Loadings, irrigation, drainage and edge restraint must all be designed and implemented in line with guidance. Ongoing maintenance access and safe working arrangements are important to preserve both the roof and the planting over time.",
    hazards: ["work_at_height", "manual_handling", "slips_trips", "biological", "heavy_plant"],
    questions: [
      { id: "q1", label: "Has the structural capacity of the roof been checked for the saturated load associated with the green roof installation?" },
      { id: "q2", label: "Will the green roof installation include a root barrier and appropriate drainage layers above the waterproofing?" },
      { id: "q3", label: "Are edge restraints and upstands being detailed in the green roof installation to prevent substrate slippage?" },
      { id: "q4", label: "Is there a plan for irrigation or drought management as part of the green roof installation?" },
      { id: "q5", label: "Will safe access for future maintenance of the green areas created by the green roof installation be provided?" }
    ]
  },
  "Gutter guard installation": {
    desc: "Gutter guard installation is focused on the roof edge components that collect and direct water away from the building envelope. Typical tasks include installing, repairing or replacing gutters, downpipes, fascias, soffits or bargeboards along eaves and verges. Work is often carried out at height, requiring stable access and measures to prevent falling objects. Once completed, the alignment, joints and fixings are checked and water is run through the system where possible to confirm proper flow.",
    hazards: ["work_at_height", "manual_handling", "slips_trips", "falling_objects"],
    questions: [
      { id: "q1", label: "Is the gutter guard installation being planned with stable working platforms or properly footed ladders?" },
      { id: "q2", label: "Will all old fixings and debris from the gutter guard installation be safely removed rather than left in gutters or on the ground?" },
      { id: "q3", label: "Have you checked that falls and outlet positions for the gutter guard installation will allow water to drain without standing?" },
      { id: "q4", label: "Are joints and connectors used in the gutter guard installation suitable for the materials and expected movement?" },
      { id: "q5", label: "Will any adjacent roof coverings disturbed by the gutter guard installation be checked and made good?" }
    ]
  },
  "Roof membrane installation": {
    desc: "Roof membrane installation is centred on installing or fully renewing a flat roof waterproofing system using materials such as felt, GRP or EPDM. The process usually involves stripping existing coverings where necessary, preparing the deck, and applying insulation and membranes in layers to create a continuous weatherproof surface. Upstands, penetrations and edge details are formed carefully to prevent water ingress and meet fire and wind-uplift requirements. Safe access, hot works controls where relevant and weather monitoring are essential parts of planning this work.",
    hazards: ["work_at_height", "hot_work", "chemical_coshh", "manual_handling", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you assessed the existing deck condition and load capacity prior to the roof membrane installation?" },
      { id: "q2", label: "Is a hot works permit required for any operations involved in the roof membrane installation?" },
      { id: "q3", label: "Will edge protection or fall restraint be provided around all exposed sides during the roof membrane installation?" },
      { id: "q4", label: "Are weather forecasts being monitored to avoid starting the roof membrane installation in unsuitable conditions?" },
      { id: "q5", label: "Will outlets and falls be checked and adjusted where feasible as part of the roof membrane installation?" }
    ]
  },
   "Other (Custom)": {
    desc: "",
    hazards: [],
    questions: [
      { id: "q1", label: "Have you identified all specific hazards associated with this custom task?" },
      { id: "q2", label: "Do you have the correct tools and equipment for this specific work?" },
      { id: "q3", label: "Has a dynamic risk assessment been carried out?" },
      { id: "q4", label: "Are you competent to undertake this specific custom task?" },
      { id: "q5", label: "Have you agreed the scope fully with the client?" }
    ]
  }
};

// app/lib/constants.ts - PART 4 OF 4

// --- 5. BUILDER CLUSTERS (FULL 50 JOBS) ---
const BUILDER_CLUSTERS: Record<string, JobCluster> = {
  "Structural knock-through between rooms": {
    desc: "Structural knock-through between rooms involves altering or supporting parts of a building's primary structure, such as walls, beams or floors. The work typically follows an engineer's design, with temporary supports installed before any load-bearing elements are removed or modified. Close control of sequence, propping and load transfer is required to prevent unintended movement or collapse. On completion, new structural members are secured, checked and left ready for inspection and subsequent finishes.",
    hazards: ["structural_collapse", "dust_fumes", "noise_vibration", "manual_handling", "plant_machinery"],
    questions: [
      { id: "q1", label: "Has a structural engineer's design or written instruction been obtained for the structural knock-through between rooms?" },
      { id: "q2", label: "Will suitable temporary supports be installed and checked before any load-bearing elements are removed during the structural knock-through between rooms?" },
      { id: "q3", label: "Have you confirmed that all areas affected by the structural knock-through between rooms are accessible and cleared of non-essential occupants?" },
      { id: "q4", label: "Is there a plan to monitor for unexpected movement or cracking while the structural knock-through between rooms is in progress?" },
      { id: "q5", label: "Will the works from the structural knock-through between rooms be inspected before they are concealed by finishes?" }
    ]
  },
  "RSJ/steel beam installation": {
    desc: "RSJ/steel beam installation involves altering or supporting parts of a building's primary structure, such as walls, beams or floors. The work typically follows an engineer's design, with temporary supports installed before any load-bearing elements are removed or modified. Close control of sequence, propping and load transfer is required to prevent unintended movement or collapse. On completion, new structural members are secured, checked and left ready for inspection and subsequent finishes.",
    hazards: ["structural_collapse", "manual_handling", "plant_machinery", "falling_objects"],
    questions: [
      { id: "q1", label: "Has a structural engineer's design or written instruction been obtained for the rsj/steel beam installation?" },
      { id: "q2", label: "Will suitable temporary supports be installed and checked before any load-bearing elements are removed during the rsj/steel beam installation?" },
      { id: "q3", label: "Have you confirmed that all areas affected by the rsj/steel beam installation are accessible and cleared of non-essential occupants?" },
      { id: "q4", label: "Is there a plan to monitor for unexpected movement or cracking while the rsj/steel beam installation is in progress?" },
      { id: "q5", label: "Will the works from the rsj/steel beam installation be inspected before they are concealed by finishes?" }
    ]
  },
  "Single-storey rear extension build": {
    desc: "Single-storey rear extension build focuses on constructing new structural elements that enlarge or add to an existing building. The task usually includes excavation, foundations, walls, floors, roof structures and integration with the existing property. Services, insulation, damp-proofing and weathering details must all be coordinated to meet design and regulatory requirements. The area is progressively built up from groundworks through to a weathertight shell ready for internal fit-out.",
    hazards: ["excavation", "work_at_height", "manual_handling", "dust_fumes", "plant_machinery"],
    questions: [
      { id: "q1", label: "Have you obtained and reviewed all drawings and specifications relevant to the single-storey rear extension build?" },
      { id: "q2", label: "Will ground conditions be assessed and any variations reported before foundation work proceeds in the single-storey rear extension build?" },
      { id: "q3", label: "Are measures in place to segregate the single-storey rear extension build from public access and protect neighbouring properties?" },
      { id: "q4", label: "Is there a clear sequence for structural, weatherproofing and service installation during the single-storey rear extension build?" },
      { id: "q5", label: "Will the single-storey rear extension build include checks to ensure levels, dimensions and alignments match the design before moving on?" }
    ]
  },
  "Double-storey extension build": {
    desc: "Double-storey extension build focuses on constructing new structural elements that enlarge or add to an existing building. The task usually includes excavation, foundations, walls, floors, roof structures and integration with the existing property. Services, insulation, damp-proofing and weathering details must all be coordinated to meet design and regulatory requirements. The area is progressively built up from groundworks through to a weathertight shell ready for internal fit-out.",
    hazards: ["excavation", "work_at_height", "structural_collapse", "falling_objects", "scaffold_safety"],
    questions: [
      { id: "q1", label: "Have you obtained and reviewed all drawings and specifications relevant to the double-storey extension build?" },
      { id: "q2", label: "Will ground conditions be assessed and any variations reported before foundation work proceeds in the double-storey extension build?" },
      { id: "q3", label: "Are measures in place to segregate the double-storey extension build from public access and protect neighbouring properties?" },
      { id: "q4", label: "Is there a clear sequence for structural, weatherproofing and service installation during the double-storey extension build?" },
      { id: "q5", label: "Will the double-storey extension build include checks to ensure levels, dimensions and alignments match the design before moving on?" }
    ]
  },
  "Loft conversion with dormer": {
    desc: "Loft conversion with dormer involves altering or supporting parts of a building's primary structure, such as walls, beams or floors. The work typically follows an engineer's design, with temporary supports installed before any load-bearing elements are removed or modified. Close control of sequence, propping and load transfer is required to prevent unintended movement or collapse. On completion, new structural members are secured, checked and left ready for inspection and subsequent finishes.",
    hazards: ["work_at_height", "structural_collapse", "dust_fumes", "manual_handling", "fire_explosion"],
    questions: [
      { id: "q1", label: "Has a structural engineer's design or written instruction been obtained for the loft conversion with dormer?" },
      { id: "q2", label: "Will suitable temporary supports be installed and checked before any load-bearing elements are removed during the loft conversion with dormer?" },
      { id: "q3", label: "Have you confirmed that all areas affected by the loft conversion with dormer are accessible and cleared of non-essential occupants?" },
      { id: "q4", label: "Is there a plan to monitor for unexpected movement or cracking while the loft conversion with dormer is in progress?" },
      { id: "q5", label: "Will the works from the loft conversion with dormer be inspected before they are concealed by finishes?" }
    ]
  },
  "Garage conversion to habitable room": {
    desc: "Garage conversion to habitable room involves altering or supporting parts of a building's primary structure, such as walls, beams or floors. The work typically follows an engineer's design, with temporary supports installed before any load-bearing elements are removed or modified. Close control of sequence, propping and load transfer is required to prevent unintended movement or collapse. On completion, new structural members are secured, checked and left ready for inspection and subsequent finishes.",
    hazards: ["dust_fumes", "manual_handling", "structural_collapse", "damp_proofing", "insulation"],
    questions: [
      { id: "q1", label: "Has a structural engineer's design or written instruction been obtained for the garage conversion to habitable room?" },
      { id: "q2", label: "Will suitable temporary supports be installed and checked before any load-bearing elements are removed during the garage conversion to habitable room?" },
      { id: "q3", label: "Have you confirmed that all areas affected by the garage conversion to habitable room are accessible and cleared of non-essential occupants?" },
      { id: "q4", label: "Is there a plan to monitor for unexpected movement or cracking while the garage conversion to habitable room is in progress?" },
      { id: "q5", label: "Will the works from the garage conversion to habitable room be inspected before they are concealed by finishes?" }
    ]
  },
  "Internal load-bearing wall removal": {
    desc: "Internal load-bearing wall removal involves altering or supporting parts of a building's primary structure, such as walls, beams or floors. The work typically follows an engineer's design, with temporary supports installed before any load-bearing elements are removed or modified. Close control of sequence, propping and load transfer is required to prevent unintended movement or collapse. On completion, new structural members are secured, checked and left ready for inspection and subsequent finishes.",
    hazards: ["structural_collapse", "dust_fumes", "manual_handling", "noise_vibration"],
    questions: [
      { id: "q1", label: "Has a structural engineer's design or written instruction been obtained for the internal load-bearing wall removal?" },
      { id: "q2", label: "Will suitable temporary supports be installed and checked before any load-bearing elements are removed during the internal load-bearing wall removal?" },
      { id: "q3", label: "Have you confirmed that all areas affected by the internal load-bearing wall removal are accessible and cleared of non-essential occupants?" },
      { id: "q4", label: "Is there a plan to monitor for unexpected movement or cracking while the internal load-bearing wall removal is in progress?" },
      { id: "q5", label: "Will the works from the internal load-bearing wall removal be inspected before they are concealed by finishes?" }
    ]
  },
  "New partition wall installation": {
    desc: "New partition wall installation concerns the internal fabric of the building, including non-structural walls, linings and finishes. Work may involve installing or adjusting stud frameworks, fixing boards, applying plaster or creating new room layouts. Services such as electrical and plumbing routes are often coordinated within or behind the new construction. The finished surfaces are left plumb, level and ready for decoration or further fit-out.",
    hazards: ["manual_handling", "dust_fumes", "sharp_objects", "work_at_height"],
    questions: [
      { id: "q1", label: "Have you confirmed that no load-bearing elements are being altered as part of the new partition wall installation?" },
      { id: "q2", label: "Will the new partition wall installation allow for service routes, access panels and fixings needed for other trades?" },
      { id: "q3", label: "Are you controlling dust and debris from the new partition wall installation to protect adjacent areas and occupants?" },
      { id: "q4", label: "Is adequate drying or curing time allowed for wet trades involved in the new partition wall installation?" },
      { id: "q5", label: "Will you check that finished surfaces from the new partition wall installation are plumb, level and free from significant defects?" }
    ]
  },
  "Stud wall and plasterboard installation": {
    desc: "Stud wall and plasterboard installation concerns the internal fabric of the building, including non-structural walls, linings and finishes. Work may involve installing or adjusting stud frameworks, fixing boards, applying plaster or creating new room layouts. Services such as electrical and plumbing routes are often coordinated within or behind the new construction. The finished surfaces are left plumb, level and ready for decoration or further fit-out.",
    hazards: ["manual_handling", "dust_fumes", "sharp_objects"],
    questions: [
      { id: "q1", label: "Have you confirmed that no load-bearing elements are being altered as part of the stud wall and plasterboard installation?" },
      { id: "q2", label: "Will the stud wall and plasterboard installation allow for service routes, access panels and fixings needed for other trades?" },
      { id: "q3", label: "Are you controlling dust and debris from the stud wall and plasterboard installation to protect adjacent areas and occupants?" },
      { id: "q4", label: "Is adequate drying or curing time allowed for wet trades involved in the stud wall and plasterboard installation?" },
      { id: "q5", label: "Will you check that finished surfaces from the stud wall and plasterboard installation are plumb, level and free from significant defects?" }
    ]
  },
  "Internal plastering and skim coat": {
    desc: "Internal plastering and skim coat concerns the internal fabric of the building, including non-structural walls, linings and finishes. Work may involve installing or adjusting stud frameworks, fixing boards, applying plaster or creating new room layouts. Services such as electrical and plumbing routes are often coordinated within or behind the new construction. The finished surfaces are left plumb, level and ready for decoration or further fit-out.",
    hazards: ["slips_trips", "manual_handling", "dust_fumes", "work_at_height"],
    questions: [
      { id: "q1", label: "Have you confirmed that no load-bearing elements are being altered as part of the internal plastering and skim coat?" },
      { id: "q2", label: "Will the internal plastering and skim coat allow for service routes, access panels and fixings needed for other trades?" },
      { id: "q3", label: "Are you controlling dust and debris from the internal plastering and skim coat to protect adjacent areas and occupants?" },
      { id: "q4", label: "Is adequate drying or curing time allowed for wet trades involved in the internal plastering and skim coat?" },
      { id: "q5", label: "Will you check that finished surfaces from the internal plastering and skim coat are plumb, level and free from significant defects?" }
    ]
  },
  "External sand and cement rendering": {
    desc: "External sand and cement rendering concerns the internal fabric of the building, including non-structural walls, linings and finishes. Work may involve installing or adjusting stud frameworks, fixing boards, applying plaster or creating new room layouts. Services such as electrical and plumbing routes are often coordinated within or behind the new construction. The finished surfaces are left plumb, level and ready for decoration or further fit-out.",
    hazards: ["work_at_height", "cement", "dust_fumes", "manual_handling"],
    questions: [
      { id: "q1", label: "Have you confirmed that no load-bearing elements are being altered as part of the external sand and cement rendering?" },
      { id: "q2", label: "Will the external sand and cement rendering allow for service routes, access panels and fixings needed for other trades?" },
      { id: "q3", label: "Are you controlling dust and debris from the external sand and cement rendering to protect adjacent areas and occupants?" },
      { id: "q4", label: "Is adequate drying or curing time allowed for wet trades involved in the external sand and cement rendering?" },
      { id: "q5", label: "Will you check that finished surfaces from the external sand and cement rendering are plumb, level and free from significant defects?" }
    ]
  },
  "Dot-and-dab plasterboard lining": {
    desc: "Dot-and-dab plasterboard lining concerns the internal fabric of the building, including non-structural walls, linings and finishes. Work may involve installing or adjusting stud frameworks, fixing boards, applying plaster or creating new room layouts. Services such as electrical and plumbing routes are often coordinated within or behind the new construction. The finished surfaces are left plumb, level and ready for decoration or further fit-out.",
    hazards: ["manual_handling", "dust_fumes", "chemical_coshh"],
    questions: [
      { id: "q1", label: "Have you confirmed that no load-bearing elements are being altered as part of the dot-and-dab plasterboard lining?" },
      { id: "q2", label: "Will the dot-and-dab plasterboard lining allow for service routes, access panels and fixings needed for other trades?" },
      { id: "q3", label: "Are you controlling dust and debris from the dot-and-dab plasterboard lining to protect adjacent areas and occupants?" },
      { id: "q4", label: "Is adequate drying or curing time allowed for wet trades involved in the dot-and-dab plasterboard lining?" },
      { id: "q5", label: "Will you check that finished surfaces from the dot-and-dab plasterboard lining are plumb, level and free from significant defects?" }
    ]
  },
  "Ceiling replacement (plasterboard)": {
    desc: "Ceiling replacement (plasterboard) concerns the internal fabric of the building, including non-structural walls, linings and finishes. Work may involve installing or adjusting stud frameworks, fixing boards, applying plaster or creating new room layouts. Services such as electrical and plumbing routes are often coordinated within or behind the new construction. The finished surfaces are left plumb, level and ready for decoration or further fit-out.",
    hazards: ["work_at_height", "manual_handling", "dust_fumes", "falling_objects"],
    questions: [
      { id: "q1", label: "Have you confirmed that no load-bearing elements are being altered as part of the ceiling replacement (plasterboard)?" },
      { id: "q2", label: "Will the ceiling replacement (plasterboard) allow for service routes, access panels and fixings needed for other trades?" },
      { id: "q3", label: "Are you controlling dust and debris from the ceiling replacement (plasterboard) to protect adjacent areas and occupants?" },
      { id: "q4", label: "Is adequate drying or curing time allowed for wet trades involved in the ceiling replacement (plasterboard)?" },
      { id: "q5", label: "Will you check that finished surfaces from the ceiling replacement (plasterboard) are plumb, level and free from significant defects?" }
    ]
  },
  "Suspended ceiling installation": {
    desc: "Suspended ceiling installation concerns the internal fabric of the building, including non-structural walls, linings and finishes. Work may involve installing or adjusting stud frameworks, fixing boards, applying plaster or creating new room layouts. Services such as electrical and plumbing routes are often coordinated within or behind the new construction. The finished surfaces are left plumb, level and ready for decoration or further fit-out.",
    hazards: ["work_at_height", "manual_handling", "dust_fumes", "sharp_objects"],
    questions: [
      { id: "q1", label: "Have you confirmed that no load-bearing elements are being altered as part of the suspended ceiling installation?" },
      { id: "q2", label: "Will the suspended ceiling installation allow for service routes, access panels and fixings needed for other trades?" },
      { id: "q3", label: "Are you controlling dust and debris from the suspended ceiling installation to protect adjacent areas and occupants?" },
      { id: "q4", label: "Is adequate drying or curing time allowed for wet trades involved in the suspended ceiling installation?" },
      { id: "q5", label: "Will you check that finished surfaces from the suspended ceiling installation are plumb, level and free from significant defects?" }
    ]
  },
  "Concrete slab pour (ground floor)": {
    desc: "Concrete slab pour (ground floor) is centred on earthworks, external levels, hardstandings and subsurface drainage outside the main building envelope. Typical activities include excavation, compaction of sub-bases, laying pipes or channels, and installing paving or concrete finishes. Existing services, access routes and neighbouring properties must be protected throughout the work. Completed groundworks are left stable, properly drained and suitable for their intended use.",
    hazards: ["chemical_coshh", "manual_handling", "slips_trips", "plant_machinery"],
    questions: [
      { id: "q1", label: "Have underground services been located and marked out before starting the concrete slab pour (ground floor)?" },
      { id: "q2", label: "Will excavations created during the concrete slab pour (ground floor) be supported, battered back or fenced to prevent collapse and falls?" },
      { id: "q3", label: "Are appropriate compaction methods and materials being specified for sub-bases in the concrete slab pour (ground floor)?" },
      { id: "q4", label: "Is surface water drainage from the concrete slab pour (ground floor) designed to fall away from buildings and avoid creating slip hazards?" },
      { id: "q5", label: "Will finished levels and falls achieved in the concrete slab pour (ground floor) be checked against drawings before handover?" }
    ]
  },
  "Foundations and footings excavation and pour": {
    desc: "Foundations and footings excavation and pour is centred on earthworks, external levels, hardstandings and subsurface drainage outside the main building envelope. Typical activities include excavation, compaction of sub-bases, laying pipes or channels, and installing paving or concrete finishes. Existing services, access routes and neighbouring properties must be protected throughout the work. Completed groundworks are left stable, properly drained and suitable for their intended use.",
    hazards: ["excavation", "underground_services", "plant_machinery", "structural_collapse", "manual_handling"],
    questions: [
      { id: "q1", label: "Have underground services been located and marked out before starting the foundations and footings excavation and pour?" },
      { id: "q2", label: "Will excavations created during the foundations and footings excavation and pour be supported, battered back or fenced to prevent collapse and falls?" },
      { id: "q3", label: "Are appropriate compaction methods and materials being specified for sub-bases in the foundations and footings excavation and pour?" },
      { id: "q4", label: "Is surface water drainage from the foundations and footings excavation and pour designed to fall away from buildings and avoid creating slip hazards?" },
      { id: "q5", label: "Will finished levels and falls achieved in the foundations and footings excavation and pour be checked against drawings before handover?" }
    ]
  },
  "Brick/block cavity wall construction": {
    desc: "Brick/block cavity wall construction focuses on constructing new structural elements that enlarge or add to an existing building. The task usually includes excavation, foundations, walls, floors, roof structures and integration with the existing property. Services, insulation, damp-proofing and weathering details must all be coordinated to meet design and regulatory requirements. The area is progressively built up from groundworks through to a weathertight shell ready for internal fit-out.",
    hazards: ["manual_handling", "dust_fumes", "work_at_height", "chemical_coshh"],
    questions: [
      { id: "q1", label: "Have you obtained and reviewed all drawings and specifications relevant to the brick/block cavity wall construction?" },
      { id: "q2", label: "Will ground conditions be assessed and any variations reported before foundation work proceeds in the brick/block cavity wall construction?" },
      { id: "q3", label: "Are measures in place to segregate the brick/block cavity wall construction from public access and protect neighbouring properties?" },
      { id: "q4", label: "Is there a clear sequence for structural, weatherproofing and service installation during the brick/block cavity wall construction?" },
      { id: "q5", label: "Will the brick/block cavity wall construction include checks to ensure levels, dimensions and alignments match the design before moving on?" }
    ]
  },
  "Retaining wall construction": {
    desc: "Retaining wall construction focuses on constructing new structural elements that enlarge or add to an existing building. The task usually includes excavation, foundations, walls, floors, roof structures and integration with the existing property. Services, insulation, damp-proofing and weathering details must all be coordinated to meet design and regulatory requirements. The area is progressively built up from groundworks through to a weathertight shell ready for internal fit-out.",
    hazards: ["structural_collapse", "excavation", "manual_handling", "plant_machinery"],
    questions: [
      { id: "q1", label: "Have you obtained and reviewed all drawings and specifications relevant to the retaining wall construction?" },
      { id: "q2", label: "Will ground conditions be assessed and any variations reported before foundation work proceeds in the retaining wall construction?" },
      { id: "q3", label: "Are measures in place to segregate the retaining wall construction from public access and protect neighbouring properties?" },
      { id: "q4", label: "Is there a clear sequence for structural, weatherproofing and service installation during the retaining wall construction?" },
      { id: "q5", label: "Will the retaining wall construction include checks to ensure levels, dimensions and alignments match the design before moving on?" }
    ]
  },
  "Garden boundary wall build": {
    desc: "Garden boundary wall build focuses on constructing new structural elements that enlarge or add to an existing building. The task usually includes excavation, foundations, walls, floors, roof structures and integration with the existing property. Services, insulation, damp-proofing and weathering details must all be coordinated to meet design and regulatory requirements. The area is progressively built up from groundworks through to a weathertight shell ready for internal fit-out.",
    hazards: ["manual_handling", "chemical_coshh", "excavation", "public_interface"],
    questions: [
      { id: "q1", label: "Have you obtained and reviewed all drawings and specifications relevant to the garden boundary wall build?" },
      { id: "q2", label: "Will ground conditions be assessed and any variations reported before foundation work proceeds in the garden boundary wall build?" },
      { id: "q3", label: "Are measures in place to segregate the garden boundary wall build from public access and protect neighbouring properties?" },
      { id: "q4", label: "Is there a clear sequence for structural, weatherproofing and service installation during the garden boundary wall build?" },
      { id: "q5", label: "Will the garden boundary wall build include checks to ensure levels, dimensions and alignments match the design before moving on?" }
    ]
  },
  "Patio paving installation": {
    desc: "Patio paving installation is centred on earthworks, external levels, hardstandings and subsurface drainage outside the main building envelope. Typical activities include excavation, compaction of sub-bases, laying pipes or channels, and installing paving or concrete finishes. Existing services, access routes and neighbouring properties must be protected throughout the work. Completed groundworks are left stable, properly drained and suitable for their intended use.",
    hazards: ["manual_handling", "dust_fumes", "noise_vibration", "slips_trips"],
    questions: [
      { id: "q1", label: "Have underground services been located and marked out before starting the patio paving installation?" },
      { id: "q2", label: "Will excavations created during the patio paving installation be supported, battered back or fenced to prevent collapse and falls?" },
      { id: "q3", label: "Are appropriate compaction methods and materials being specified for sub-bases in the patio paving installation?" },
      { id: "q4", label: "Is surface water drainage from the patio paving installation designed to fall away from buildings and avoid creating slip hazards?" },
      { id: "q5", label: "Will finished levels and falls achieved in the patio paving installation be checked against drawings before handover?" }
    ]
  },
  "Block paved driveway installation": {
    desc: "Block paved driveway installation is centred on earthworks, external levels, hardstandings and subsurface drainage outside the main building envelope. Typical activities include excavation, compaction of sub-bases, laying pipes or channels, and installing paving or concrete finishes. Existing services, access routes and neighbouring properties must be protected throughout the work. Completed groundworks are left stable, properly drained and suitable for their intended use.",
    hazards: ["manual_handling", "dust_fumes", "noise_vibration", "plant_machinery", "public_interface"],
    questions: [
      { id: "q1", label: "Have underground services been located and marked out before starting the block paved driveway installation?" },
      { id: "q2", label: "Will excavations created during the block paved driveway installation be supported, battered back or fenced to prevent collapse and falls?" },
      { id: "q3", label: "Are appropriate compaction methods and materials being specified for sub-bases in the block paved driveway installation?" },
      { id: "q4", label: "Is surface water drainage from the block paved driveway installation designed to fall away from buildings and avoid creating slip hazards?" },
      { id: "q5", label: "Will finished levels and falls achieved in the block paved driveway installation be checked against drawings before handover?" }
    ]
  },
  "Concrete driveway installation": {
    desc: "Concrete driveway installation is centred on earthworks, external levels, hardstandings and subsurface drainage outside the main building envelope. Typical activities include excavation, compaction of sub-bases, laying pipes or channels, and installing paving or concrete finishes. Existing services, access routes and neighbouring properties must be protected throughout the work. Completed groundworks are left stable, properly drained and suitable for their intended use.",
    hazards: ["chemical_coshh", "manual_handling", "slips_trips", "plant_machinery"],
    questions: [
      { id: "q1", label: "Have underground services been located and marked out before starting the concrete driveway installation?" },
      { id: "q2", label: "Will excavations created during the concrete driveway installation be supported, battered back or fenced to prevent collapse and falls?" },
      { id: "q3", label: "Are appropriate compaction methods and materials being specified for sub-bases in the concrete driveway installation?" },
      { id: "q4", label: "Is surface water drainage from the concrete driveway installation designed to fall away from buildings and avoid creating slip hazards?" },
      { id: "q5", label: "Will finished levels and falls achieved in the concrete driveway installation be checked against drawings before handover?" }
    ]
  },
  "Drainage trench excavation and pipe laying": {
    desc: "Drainage trench excavation and pipe laying is centred on earthworks, external levels, hardstandings and subsurface drainage outside the main building envelope. Typical activities include excavation, compaction of sub-bases, laying pipes or channels, and installing paving or concrete finishes. Existing services, access routes and neighbouring properties must be protected throughout the work. Completed groundworks are left stable, properly drained and suitable for their intended use.",
    hazards: ["excavation", "confined_space", "biological", "underground_services"],
    questions: [
      { id: "q1", label: "Have underground services been located and marked out before starting the drainage trench excavation and pipe laying?" },
      { id: "q2", label: "Will excavations created during the drainage trench excavation and pipe laying be supported, battered back or fenced to prevent collapse and falls?" },
      { id: "q3", label: "Are appropriate compaction methods and materials being specified for sub-bases in the drainage trench excavation and pipe laying?" },
      { id: "q4", label: "Is surface water drainage from the drainage trench excavation and pipe laying designed to fall away from buildings and avoid creating slip hazards?" },
      { id: "q5", label: "Will finished levels and falls achieved in the drainage trench excavation and pipe laying be checked against drawings before handover?" }
    ]
  },
  "Soakaway installation": {
    desc: "Soakaway installation is centred on earthworks, external levels, hardstandings and subsurface drainage outside the main building envelope. Typical activities include excavation, compaction of sub-bases, laying pipes or channels, and installing paving or concrete finishes. Existing services, access routes and neighbouring properties must be protected throughout the work. Completed groundworks are left stable, properly drained and suitable for their intended use.",
    hazards: ["excavation", "underground_services", "confined_space", "manual_handling"],
    questions: [
      { id: "q1", label: "Have underground services been located and marked out before starting the soakaway installation?" },
      { id: "q2", label: "Will excavations created during the soakaway installation be supported, battered back or fenced to prevent collapse and falls?" },
      { id: "q3", label: "Are appropriate compaction methods and materials being specified for sub-bases in the soakaway installation?" },
      { id: "q4", label: "Is surface water drainage from the soakaway installation designed to fall away from buildings and avoid creating slip hazards?" },
      { id: "q5", label: "Will finished levels and falls achieved in the soakaway installation be checked against drawings before handover?" }
    ]
  },
  "Manhole construction or alteration": {
    desc: "Manhole construction or alteration is centred on earthworks, external levels, hardstandings and subsurface drainage outside the main building envelope. Typical activities include excavation, compaction of sub-bases, laying pipes or channels, and installing paving or concrete finishes. Existing services, access routes and neighbouring properties must be protected throughout the work. Completed groundworks are left stable, properly drained and suitable for their intended use.",
    hazards: ["confined_space", "biological", "manual_handling", "slips_trips"],
    questions: [
      { id: "q1", label: "Have underground services been located and marked out before starting the manhole construction or alteration?" },
      { id: "q2", label: "Will excavations created during the manhole construction or alteration be supported, battered back or fenced to prevent collapse and falls?" },
      { id: "q3", label: "Are appropriate compaction methods and materials being specified for sub-bases in the manhole construction or alteration?" },
      { id: "q4", label: "Is surface water drainage from the manhole construction or alteration designed to fall away from buildings and avoid creating slip hazards?" },
      { id: "q5", label: "Will finished levels and falls achieved in the manhole construction or alteration be checked against drawings before handover?" }
    ]
  },
  "Landscaping and garden regrading": {
    desc: "Landscaping and garden regrading is centred on earthworks, external levels, hardstandings and subsurface drainage outside the main building envelope. Typical activities include excavation, compaction of sub-bases, laying pipes or channels, and installing paving or concrete finishes. Existing services, access routes and neighbouring properties must be protected throughout the work. Completed groundworks are left stable, properly drained and suitable for their intended use.",
    hazards: ["plant_machinery", "manual_handling", "dust_fumes", "slips_trips"],
    questions: [
      { id: "q1", label: "Have underground services been located and marked out before starting the landscaping and garden regrading?" },
      { id: "q2", label: "Will excavations created during the landscaping and garden regrading be supported, battered back or fenced to prevent collapse and falls?" },
      { id: "q3", label: "Are appropriate compaction methods and materials being specified for sub-bases in the landscaping and garden regrading?" },
      { id: "q4", label: "Is surface water drainage from the landscaping and garden regrading designed to fall away from buildings and avoid creating slip hazards?" },
      { id: "q5", label: "Will finished levels and falls achieved in the landscaping and garden regrading be checked against drawings before handover?" }
    ]
  },
  "External steps and access construction": {
    desc: "External steps and access construction is centred on earthworks, external levels, hardstandings and subsurface drainage outside the main building envelope. Typical activities include excavation, compaction of sub-bases, laying pipes or channels, and installing paving or concrete finishes. Existing services, access routes and neighbouring properties must be protected throughout the work. Completed groundworks are left stable, properly drained and suitable for their intended use.",
    hazards: ["manual_handling", "slips_trips", "cement", "dust_fumes"],
    questions: [
      { id: "q1", label: "Have underground services been located and marked out before starting the external steps and access construction?" },
      { id: "q2", label: "Will excavations created during the external steps and access construction be supported, battered back or fenced to prevent collapse and falls?" },
      { id: "q3", label: "Are appropriate compaction methods and materials being specified for sub-bases in the external steps and access construction?" },
      { id: "q4", label: "Is surface water drainage from the external steps and access construction designed to fall away from buildings and avoid creating slip hazards?" },
      { id: "q5", label: "Will finished levels and falls achieved in the external steps and access construction be checked against drawings before handover?" }
    ]
  },
  "Internal staircase installation or replacement": {
    desc: "Internal staircase installation or replacement is centred on earthworks, external levels, hardstandings and subsurface drainage outside the main building envelope. Typical activities include excavation, compaction of sub-bases, laying pipes or channels, and installing paving or concrete finishes. Existing services, access routes and neighbouring properties must be protected throughout the work. Completed groundworks are left stable, properly drained and suitable for their intended use.",
    hazards: ["manual_handling", "work_at_height", "dust_fumes", "slips_trips"],
    questions: [
      { id: "q1", label: "Have underground services been located and marked out before starting the internal staircase installation or replacement?" },
      { id: "q2", label: "Will excavations created during the internal staircase installation or replacement be supported, battered back or fenced to prevent collapse and falls?" },
      { id: "q3", label: "Are appropriate compaction methods and materials being specified for sub-bases in the internal staircase installation or replacement?" },
      { id: "q4", label: "Is surface water drainage from the internal staircase installation or replacement designed to fall away from buildings and avoid creating slip hazards?" },
      { id: "q5", label: "Will finished levels and falls achieved in the internal staircase installation or replacement be checked against drawings before handover?" }
    ]
  },
  "Creation of new window opening": {
    desc: "Creation of new window opening involves altering or supporting parts of a building's primary structure, such as walls, beams or floors. The work typically follows an engineer's design, with temporary supports installed before any load-bearing elements are removed or modified. Close control of sequence, propping and load transfer is required to prevent unintended movement or collapse. On completion, new structural members are secured, checked and left ready for inspection and subsequent finishes.",
    hazards: ["structural_collapse", "dust_fumes", "manual_handling", "noise_vibration"],
    questions: [
      { id: "q1", label: "Has a structural engineer's design or written instruction been obtained for the creation of new window opening?" },
      { id: "q2", label: "Will suitable temporary supports be installed and checked before any load-bearing elements are removed during the creation of new window opening?" },
      { id: "q3", label: "Have you confirmed that all areas affected by the creation of new window opening are accessible and cleared of non-essential occupants?" },
      { id: "q4", label: "Is there a plan to monitor for unexpected movement or cracking while the creation of new window opening is in progress?" },
      { id: "q5", label: "Will the works from the creation of new window opening be inspected before they are concealed by finishes?" }
    ]
  },
  "Creation of new door opening": {
    desc: "Creation of new door opening involves altering or supporting parts of a building's primary structure, such as walls, beams or floors. The work typically follows an engineer's design, with temporary supports installed before any load-bearing elements are removed or modified. Close control of sequence, propping and load transfer is required to prevent unintended movement or collapse. On completion, new structural members are secured, checked and left ready for inspection and subsequent finishes.",
    hazards: ["structural_collapse", "dust_fumes", "manual_handling", "noise_vibration"],
    questions: [
      { id: "q1", label: "Has a structural engineer's design or written instruction been obtained for the creation of new door opening?" },
      { id: "q2", label: "Will suitable temporary supports be installed and checked before any load-bearing elements are removed during the creation of new door opening?" },
      { id: "q3", label: "Have you confirmed that all areas affected by the creation of new door opening are accessible and cleared of non-essential occupants?" },
      { id: "q4", label: "Is there a plan to monitor for unexpected movement or cracking while the creation of new door opening is in progress?" },
      { id: "q5", label: "Will the works from the creation of new door opening be inspected before they are concealed by finishes?" }
    ]
  },
  "Lintel replacement over existing opening": {
    desc: "Lintel replacement over existing opening involves altering or supporting parts of a building's primary structure, such as walls, beams or floors. The work typically follows an engineer's design, with temporary supports installed before any load-bearing elements are removed or modified. Close control of sequence, propping and load transfer is required to prevent unintended movement or collapse. On completion, new structural members are secured, checked and left ready for inspection and subsequent finishes.",
    hazards: ["structural_collapse", "manual_handling", "dust_fumes", "work_at_height"],
    questions: [
      { id: "q1", label: "Has a structural engineer's design or written instruction been obtained for the lintel replacement over existing opening?" },
      { id: "q2", label: "Will suitable temporary supports be installed and checked before any load-bearing elements are removed during the lintel replacement over existing opening?" },
      { id: "q3", label: "Have you confirmed that all areas affected by the lintel replacement over existing opening are accessible and cleared of non-essential occupants?" },
      { id: "q4", label: "Is there a plan to monitor for unexpected movement or cracking while the lintel replacement over existing opening is in progress?" },
      { id: "q5", label: "Will the works from the lintel replacement over existing opening be inspected before they are concealed by finishes?" }
    ]
  },
  "uPVC window installation": {
    desc: "uPVC window installation deals with the internal fit-out or refurbishment of spaces, often in existing buildings. Tasks typically include removing old fixtures, installing new joinery, adjusting openings and making good surrounding finishes. Coordination with other trades is important so that services, finishes and fittings align with the design. The result is a functional, finished area that meets the client's layout and aesthetic requirements.",
    hazards: ["manual_handling", "glass_sharps", "work_at_height", "dust_fumes"],
    questions: [
      { id: "q1", label: "Have you agreed with the client which existing elements are to be removed or retained for the upvc window installation?" },
      { id: "q2", label: "Will you isolate or protect any services that could be damaged during the upvc window installation?" },
      { id: "q3", label: "Are fixings, anchors and adhesives selected for the upvc window installation suitable for the substrates involved?" },
      { id: "q4", label: "Is there a plan to manage noise and dust from the upvc window installation where the building remains occupied?" },
      { id: "q5", label: "Will all new components installed during the upvc window installation be checked for alignment, operation and finish quality?" }
    ]
  },
  "External door installation": {
    desc: "External door installation deals with the internal fit-out or refurbishment of spaces, often in existing buildings. Tasks typically include removing old fixtures, installing new joinery, adjusting openings and making good surrounding finishes. Coordination with other trades is important so that services, finishes and fittings align with the design. The result is a functional, finished area that meets the client's layout and aesthetic requirements.",
    hazards: ["manual_handling", "security_risk", "weather_exposure", "dust_fumes"],
    questions: [
      { id: "q1", label: "Have you agreed with the client which existing elements are to be removed or retained for the external door installation?" },
      { id: "q2", label: "Will you isolate or protect any services that could be damaged during the external door installation?" },
      { id: "q3", label: "Are fixings, anchors and adhesives selected for the external door installation suitable for the substrates involved?" },
      { id: "q4", label: "Is there a plan to manage noise and dust from the external door installation where the building remains occupied?" },
      { id: "q5", label: "Will all new components installed during the external door installation be checked for alignment, operation and finish quality?" }
    ]
  },
  "Bi-fold or sliding patio door installation": {
    desc: "Bi-fold or sliding patio door installation deals with the internal fit-out or refurbishment of spaces, often in existing buildings. Tasks typically include removing old fixtures, installing new joinery, adjusting openings and making good surrounding finishes. Coordination with other trades is important so that services, finishes and fittings align with the design. The result is a functional, finished area that meets the client's layout and aesthetic requirements.",
    hazards: ["manual_handling", "glass_sharps", "structural_alteration", "dust_fumes"],
    questions: [
      { id: "q1", label: "Have you agreed with the client which existing elements are to be removed or retained for the bi-fold or sliding patio door installation?" },
      { id: "q2", label: "Will you isolate or protect any services that could be damaged during the bi-fold or sliding patio door installation?" },
      { id: "q3", label: "Are fixings, anchors and adhesives selected for the bi-fold or sliding patio door installation suitable for the substrates involved?" },
      { id: "q4", label: "Is there a plan to manage noise and dust from the bi-fold or sliding patio door installation where the building remains occupied?" },
      { id: "q5", label: "Will all new components installed during the bi-fold or sliding patio door installation be checked for alignment, operation and finish quality?" }
    ]
  },
  "Kitchen rip-out and structural preparation": {
    desc: "Kitchen rip-out and structural preparation deals with the internal fit-out or refurbishment of spaces, often in existing buildings. Tasks typically include removing old fixtures, installing new joinery, adjusting openings and making good surrounding finishes. Coordination with other trades is important so that services, finishes and fittings align with the design. The result is a functional, finished area that meets the client's layout and aesthetic requirements.",
    hazards: ["manual_handling", "sharp_objects", "dust_fumes", "services_isolation"],
    questions: [
      { id: "q1", label: "Have you agreed with the client which existing elements are to be removed or retained for the kitchen rip-out and structural preparation?" },
      { id: "q2", label: "Will you isolate or protect any services that could be damaged during the kitchen rip-out and structural preparation?" },
      { id: "q3", label: "Are fixings, anchors and adhesives selected for the kitchen rip-out and structural preparation suitable for the substrates involved?" },
      { id: "q4", label: "Is there a plan to manage noise and dust from the kitchen rip-out and structural preparation where the building remains occupied?" },
      { id: "q5", label: "Will all new components installed during the kitchen rip-out and structural preparation be checked for alignment, operation and finish quality?" }
    ]
  },
  "Kitchen refit (units, worktops, making good)": {
    desc: "Kitchen refit (units, worktops, making good) deals with the internal fit-out or refurbishment of spaces, often in existing buildings. Tasks typically include removing old fixtures, installing new joinery, adjusting openings and making good surrounding finishes. Coordination with other trades is important so that services, finishes and fittings align with the design. The result is a functional, finished area that meets the client's layout and aesthetic requirements.",
    hazards: ["manual_handling", "sharp_objects", "dust_fumes", "power_tools"],
    questions: [
      { id: "q1", label: "Have you agreed with the client which existing elements are to be removed or retained for the kitchen refit (units, worktops, making good)?" },
      { id: "q2", label: "Will you isolate or protect any services that could be damaged during the kitchen refit (units, worktops, making good)?" },
      { id: "q3", label: "Are fixings, anchors and adhesives selected for the kitchen refit (units, worktops, making good) suitable for the substrates involved?" },
      { id: "q4", label: "Is there a plan to manage noise and dust from the kitchen refit (units, worktops, making good) where the building remains occupied?" },
      { id: "q5", label: "Will all new components installed during the kitchen refit (units, worktops, making good) be checked for alignment, operation and finish quality?" }
    ]
  },
  "Bathroom rip-out and structural preparation": {
    desc: "Bathroom rip-out and structural preparation deals with the internal fit-out or refurbishment of spaces, often in existing buildings. Tasks typically include removing old fixtures, installing new joinery, adjusting openings and making good surrounding finishes. Coordination with other trades is important so that services, finishes and fittings align with the design. The result is a functional, finished area that meets the client's layout and aesthetic requirements.",
    hazards: ["manual_handling", "sharp_objects", "biological", "water_ingress"],
    questions: [
      { id: "q1", label: "Have you agreed with the client which existing elements are to be removed or retained for the bathroom rip-out and structural preparation?" },
      { id: "q2", label: "Will you isolate or protect any services that could be damaged during the bathroom rip-out and structural preparation?" },
      { id: "q3", label: "Are fixings, anchors and adhesives selected for the bathroom rip-out and structural preparation suitable for the substrates involved?" },
      { id: "q4", label: "Is there a plan to manage noise and dust from the bathroom rip-out and structural preparation where the building remains occupied?" },
      { id: "q5", label: "Will all new components installed during the bathroom rip-out and structural preparation be checked for alignment, operation and finish quality?" }
    ]
  },
  "Floor screed installation": {
    desc: "Floor screed installation is centred on earthworks, external levels, hardstandings and subsurface drainage outside the main building envelope. Typical activities include excavation, compaction of sub-bases, laying pipes or channels, and installing paving or concrete finishes. Existing services, access routes and neighbouring properties must be protected throughout the work. Completed groundworks are left stable, properly drained and suitable for their intended use.",
    hazards: ["chemical_coshh", "manual_handling", "slips_trips", "damp_proofing"],
    questions: [
      { id: "q1", label: "Have underground services been located and marked out before starting the floor screed installation?" },
      { id: "q2", label: "Will excavations created during the floor screed installation be supported, battered back or fenced to prevent collapse and falls?" },
      { id: "q3", label: "Are appropriate compaction methods and materials being specified for sub-bases in the floor screed installation?" },
      { id: "q4", label: "Is surface water drainage from the floor screed installation designed to fall away from buildings and avoid creating slip hazards?" },
      { id: "q5", label: "Will finished levels and falls achieved in the floor screed installation be checked against drawings before handover?" }
    ]
  },
  "Timber floor joist repair or replacement": {
    desc: "Timber floor joist repair or replacement involves altering or supporting parts of a building's primary structure, such as walls, beams or floors. The work typically follows an engineer's design, with temporary supports installed before any load-bearing elements are removed or modified. Close control of sequence, propping and load transfer is required to prevent unintended movement or collapse. On completion, new structural members are secured, checked and left ready for inspection and subsequent finishes.",
    hazards: ["structural_collapse", "work_at_height", "manual_handling", "dust_fumes"],
    questions: [
      { id: "q1", label: "Has a structural engineer's design or written instruction been obtained for the timber floor joist repair or replacement?" },
      { id: "q2", label: "Will suitable temporary supports be installed and checked before any load-bearing elements are removed during the timber floor joist repair or replacement?" },
      { id: "q3", label: "Have you confirmed that all areas affected by the timber floor joist repair or replacement are accessible and cleared of non-essential occupants?" },
      { id: "q4", label: "Is there a plan to monitor for unexpected movement or cracking while the timber floor joist repair or replacement is in progress?" },
      { id: "q5", label: "Will the works from the timber floor joist repair or replacement be inspected before they are concealed by finishes?" }
    ]
  },
  "Roof structure alteration (rafters, purlins)": {
    desc: "Roof structure alteration (rafters, purlins) involves altering or supporting parts of a building's primary structure, such as walls, beams or floors. The work typically follows an engineer's design, with temporary supports installed before any load-bearing elements are removed or modified. Close control of sequence, propping and load transfer is required to prevent unintended movement or collapse. On completion, new structural members are secured, checked and left ready for inspection and subsequent finishes.",
    hazards: ["structural_collapse", "work_at_height", "falling_objects", "manual_handling"],
    questions: [
      { id: "q1", label: "Has a structural engineer's design or written instruction been obtained for the roof structure alteration (rafters, purlins)?" },
      { id: "q2", label: "Will suitable temporary supports be installed and checked before any load-bearing elements are removed during the roof structure alteration (rafters, purlins)?" },
      { id: "q3", label: "Have you confirmed that all areas affected by the roof structure alteration (rafters, purlins) are accessible and cleared of non-essential occupants?" },
      { id: "q4", label: "Is there a plan to monitor for unexpected movement or cracking while the roof structure alteration (rafters, purlins) is in progress?" },
      { id: "q5", label: "Will the works from the roof structure alteration (rafters, purlins) be inspected before they are concealed by finishes?" }
    ]
  },
  "Porch construction": {
    desc: "Porch construction focuses on constructing new structural elements that enlarge or add to an existing building. The task usually includes excavation, foundations, walls, floors, roof structures and integration with the existing property. Services, insulation, damp-proofing and weathering details must all be coordinated to meet design and regulatory requirements. The area is progressively built up from groundworks through to a weathertight shell ready for internal fit-out.",
    hazards: ["excavation", "manual_handling", "work_at_height", "dust_fumes"],
    questions: [
      { id: "q1", label: "Have you obtained and reviewed all drawings and specifications relevant to the porch construction?" },
      { id: "q2", label: "Will ground conditions be assessed and any variations reported before foundation work proceeds in the porch construction?" },
      { id: "q3", label: "Are measures in place to segregate the porch construction from public access and protect neighbouring properties?" },
      { id: "q4", label: "Is there a clear sequence for structural, weatherproofing and service installation during the porch construction?" },
      { id: "q5", label: "Will the porch construction include checks to ensure levels, dimensions and alignments match the design before moving on?" }
    ]
  },
  "Conservatory base and dwarf walls construction": {
    desc: "Conservatory base and dwarf walls construction focuses on constructing new structural elements that enlarge or add to an existing building. The task usually includes excavation, foundations, walls, floors, roof structures and integration with the existing property. Services, insulation, damp-proofing and weathering details must all be coordinated to meet design and regulatory requirements. The area is progressively built up from groundworks through to a weathertight shell ready for internal fit-out.",
    hazards: ["excavation", "manual_handling", "cement", "glass_sharps"],
    questions: [
      { id: "q1", label: "Have you obtained and reviewed all drawings and specifications relevant to the conservatory base and dwarf walls construction?" },
      { id: "q2", label: "Will ground conditions be assessed and any variations reported before foundation work proceeds in the conservatory base and dwarf walls construction?" },
      { id: "q3", label: "Are measures in place to segregate the conservatory base and dwarf walls construction from public access and protect neighbouring properties?" },
      { id: "q4", label: "Is there a clear sequence for structural, weatherproofing and service installation during the conservatory base and dwarf walls construction?" },
      { id: "q5", label: "Will the conservatory base and dwarf walls construction include checks to ensure levels, dimensions and alignments match the design before moving on?" }
    ]
  },
  "Shop fit-out joinery and carpentry works": {
    desc: "Shop fit-out joinery and carpentry works deals with the internal fit-out or refurbishment of spaces, often in existing buildings. Tasks typically include removing old fixtures, installing new joinery, adjusting openings and making good surrounding finishes. Coordination with other trades is important so that services, finishes and fittings align with the design. The result is a functional, finished area that meets the client's layout and aesthetic requirements.",
    hazards: ["manual_handling", "dust_fumes", "noise_vibration", "public_interface"],
    questions: [
      { id: "q1", label: "Have you agreed with the client which existing elements are to be removed or retained for the shop fit-out joinery and carpentry works?" },
      { id: "q2", label: "Will you isolate or protect any services that could be damaged during the shop fit-out joinery and carpentry works?" },
      { id: "q3", label: "Are fixings, anchors and adhesives selected for the shop fit-out joinery and carpentry works suitable for the substrates involved?" },
      { id: "q4", label: "Is there a plan to manage noise and dust from the shop fit-out joinery and carpentry works where the building remains occupied?" },
      { id: "q5", label: "Will all new components installed during the shop fit-out joinery and carpentry works be checked for alignment, operation and finish quality?" }
    ]
  },
  "Office fit-out (stud partitions and ceilings)": {
    desc: "Office fit-out (stud partitions and ceilings) concerns the internal fabric of the building, including non-structural walls, linings and finishes. Work may involve installing or adjusting stud frameworks, fixing boards, applying plaster or creating new room layouts. Services such as electrical and plumbing routes are often coordinated within or behind the new construction. The finished surfaces are left plumb, level and ready for decoration or further fit-out.",
    hazards: ["manual_handling", "work_at_height", "dust_fumes", "fire_explosion"],
    questions: [
      { id: "q1", label: "Have you confirmed that no load-bearing elements are being altered as part of the office fit-out (stud partitions and ceilings)?" },
      { id: "q2", label: "Will the office fit-out (stud partitions and ceilings) allow for service routes, access panels and fixings needed for other trades?" },
      { id: "q3", label: "Are you controlling dust and debris from the office fit-out (stud partitions and ceilings) to protect adjacent areas and occupants?" },
      { id: "q4", label: "Is adequate drying or curing time allowed for wet trades involved in the office fit-out (stud partitions and ceilings)?" },
      { id: "q5", label: "Will you check that finished surfaces from the office fit-out (stud partitions and ceilings) are plumb, level and free from significant defects?" }
    ]
  },
  "Fire door installation and upgrades": {
    desc: "Fire door installation and upgrades concerns the internal fabric of the building, including non-structural walls, linings and finishes. Work may involve installing or adjusting stud frameworks, fixing boards, applying plaster or creating new room layouts. Services such as electrical and plumbing routes are often coordinated within or behind the new construction. The finished surfaces are left plumb, level and ready for decoration or further fit-out.",
    hazards: ["manual_handling", "fire_explosion", "dust_fumes", "heavy_plant"],
    questions: [
      { id: "q1", label: "Have you confirmed that no load-bearing elements are being altered as part of the fire door installation and upgrades?" },
      { id: "q2", label: "Will the fire door installation and upgrades allow for service routes, access panels and fixings needed for other trades?" },
      { id: "q3", label: "Are you controlling dust and debris from the fire door installation and upgrades to protect adjacent areas and occupants?" },
      { id: "q4", label: "Is adequate drying or curing time allowed for wet trades involved in the fire door installation and upgrades?" },
      { id: "q5", label: "Will you check that finished surfaces from the fire door installation and upgrades are plumb, level and free from significant defects?" }
    ]
  },
  "Fire-stopping and compartmentation works": {
    desc: "Fire-stopping and compartmentation works involves altering or supporting parts of a building's primary structure, such as walls, beams or floors. The work typically follows an engineer's design, with temporary supports installed before any load-bearing elements are removed or modified. Close control of sequence, propping and load transfer is required to prevent unintended movement or collapse. On completion, new structural members are secured, checked and left ready for inspection and subsequent finishes.",
    hazards: ["dust_fumes", "chemical_coshh", "work_at_height", "confined_space"],
    questions: [
      { id: "q1", label: "Has a structural engineer's design or written instruction been obtained for the fire-stopping and compartmentation works?" },
      { id: "q2", label: "Will suitable temporary supports be installed and checked before any load-bearing elements are removed during the fire-stopping and compartmentation works?" },
      { id: "q3", label: "Have you confirmed that all areas affected by the fire-stopping and compartmentation works are accessible and cleared of non-essential occupants?" },
      { id: "q4", label: "Is there a plan to monitor for unexpected movement or cracking while the fire-stopping and compartmentation works is in progress?" },
      { id: "q5", label: "Will the works from the fire-stopping and compartmentation works be inspected before they are concealed by finishes?" }
    ]
  },
  "Acoustic/soundproofing wall and ceiling linings": {
    desc: "Acoustic/soundproofing wall and ceiling linings involves altering or supporting parts of a building's primary structure, such as walls, beams or floors. The work typically follows an engineer's design, with temporary supports installed before any load-bearing elements are removed or modified. Close control of sequence, propping and load transfer is required to prevent unintended movement or collapse. On completion, new structural members are secured, checked and left ready for inspection and subsequent finishes.",
    hazards: ["manual_handling", "dust_fumes", "noise_vibration", "heavy_plant"],
    questions: [
      { id: "q1", label: "Has a structural engineer's design or written instruction been obtained for the acoustic/soundproofing wall and ceiling linings?" },
      { id: "q2", label: "Will suitable temporary supports be installed and checked before any load-bearing elements are removed during the acoustic/soundproofing wall and ceiling linings?" },
      { id: "q3", label: "Have you confirmed that all areas affected by the acoustic/soundproofing wall and ceiling linings are accessible and cleared of non-essential occupants?" },
      { id: "q4", label: "Is there a plan to monitor for unexpected movement or cracking while the acoustic/soundproofing wall and ceiling linings is in progress?" },
      { id: "q5", label: "Will the works from the acoustic/soundproofing wall and ceiling linings be inspected before they are concealed by finishes?" }
    ]
  },
  "Chimney breast removal (ground and first floor)": {
    desc: "Chimney breast removal (ground and first floor) involves removing existing building elements, finishes or fixtures in a controlled manner. The work may include soft strip of non-structural items as well as demolition of selected partitions, ceilings or built-in fittings. Sequence and methods must be planned to avoid damage to retained fabric and to manage dust, noise and waste safely. Once complete, the area is left clear, stable and ready for subsequent construction activities.",
    hazards: ["structural_collapse", "dust_fumes", "manual_handling", "work_at_height"],
    questions: [
      { id: "q1", label: "Have you confirmed which elements are structural and must not be removed during the chimney breast removal (ground and first floor)?" },
      { id: "q2", label: "Will the chimney breast removal (ground and first floor) use a defined sequence to prevent overloading or destabilising remaining structure?" },
      { id: "q3", label: "Are waste routes and skips arranged so debris from the chimney breast removal (ground and first floor) can be removed safely and efficiently?" },
      { id: "q4", label: "Is there suitable dust suppression and ventilation planned for the chimney breast removal (ground and first floor)?" },
      { id: "q5", label: "Will you carry out a final check after the chimney breast removal (ground and first floor) to ensure all hazards from exposed edges, nails or debris are removed?" }
    ]
  },
  "Demolition and internal strip-out works": {
    desc: "Demolition and internal strip-out works involves removing existing building elements, finishes or fixtures in a controlled manner. The work may include soft strip of non-structural items as well as demolition of selected partitions, ceilings or built-in fittings. Sequence and methods must be planned to avoid damage to retained fabric and to manage dust, noise and waste safely. Once complete, the area is left clear, stable and ready for subsequent construction activities.",
    hazards: ["dust_fumes", "sharp_objects", "manual_handling", "asbestos", "noise_vibration"],
    questions: [
      { id: "q1", label: "Have you confirmed which elements are structural and must not be removed during the demolition and internal strip-out works?" },
      { id: "q2", label: "Will the demolition and internal strip-out works use a defined sequence to prevent overloading or destabilising remaining structure?" },
      { id: "q3", label: "Are waste routes and skips arranged so debris from the demolition and internal strip-out works can be removed safely and efficiently?" },
      { id: "q4", label: "Is there suitable dust suppression and ventilation planned for the demolition and internal strip-out works?" },
      { id: "q5", label: "Will you carry out a final check after the demolition and internal strip-out works to ensure all hazards from exposed edges, nails or debris are removed?" }
    ]
  },
  "Site clearance and builders' waste removal": {
    desc: "Site clearance and builders' waste removal involves removing existing building elements, finishes or fixtures in a controlled manner. The work may include soft strip of non-structural items as well as demolition of selected partitions, ceilings or built-in fittings. Sequence and methods must be planned to avoid damage to retained fabric and to manage dust, noise and waste safely. Once complete, the area is left clear, stable and ready for subsequent construction activities.",
    hazards: ["manual_handling", "plant_machinery", "dust_fumes", "biological"],
    questions: [
      { id: "q1", label: "Have you confirmed which elements are structural and must not be removed during the site clearance and builders' waste removal?" },
      { id: "q2", label: "Will the site clearance and builders' waste removal use a defined sequence to prevent overloading or destabilising remaining structure?" },
      { id: "q3", label: "Are waste routes and skips arranged so debris from the site clearance and builders' waste removal can be removed safely and efficiently?" },
      { id: "q4", label: "Is there suitable dust suppression and ventilation planned for the site clearance and builders' waste removal?" },
      { id: "q5", label: "Will you carry out a final check after the site clearance and builders' waste removal to ensure all hazards from exposed edges, nails or debris are removed?" }
    ]
  },
  "Other (Custom)": {
    desc: "",
    hazards: [],
    questions: [
      { id: "q1", label: "Have you identified all specific hazards associated with this custom task?" },
      { id: "q2", label: "Do you have the correct tools and equipment for this specific work?" },
      { id: "q3", label: "Has a dynamic risk assessment been carried out?" },
      { id: "q4", label: "Are you competent to undertake this specific custom task?" },
      { id: "q5", label: "Have you agreed the scope fully with the client?" }
    ]
  }
};

// --- 6. TRADES EXPORT (The Glue) ---
export const TRADES = {
  Electrician: {
    clusters: ELECTRICIAN_CLUSTERS,
    jobs: Object.keys(ELECTRICIAN_CLUSTERS).map(key => ({ name: key, cluster: key }))
  },
  Plumber: {
    clusters: PLUMBER_CLUSTERS,
    jobs: Object.keys(PLUMBER_CLUSTERS).map(key => ({ name: key, cluster: key }))
  },
  Roofer: {
    clusters: ROOFER_CLUSTERS,
    jobs: Object.keys(ROOFER_CLUSTERS).map(key => ({ name: key, cluster: key }))
  },
  Builder: {
    clusters: BUILDER_CLUSTERS,
    jobs: Object.keys(BUILDER_CLUSTERS).map(key => ({ name: key, cluster: key }))
  }
};