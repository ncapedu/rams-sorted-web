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

const CARPENTER_JOINER_CLUSTERS: Record<string, JobCluster> = {
  "First fix carpentry (domestic)": {
    desc: "First fix carpentry (domestic) covers structural and concealed timber works carried out before plastering, including fitting door linings, stud walls, floor joists, noggins and basic framing. The work is often carried out in partially completed shells with other trades present and changing levels of access. Materials are typically moved manually and cut to length on site using power saws and hand tools. Care is needed to maintain structural integrity, protect temporary supports and keep escape routes clear throughout.",
    hazards: ["manual_handling", "work_at_height", "power_tools", "dust_fumes", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you agreed a clear sequence of work with other trades before starting the first fix carpentry (domestic)?" },
      { id: "q2", label: "Are all saws and power tools used for the first fix carpentry (domestic) in good condition, PAT tested where required and fitted with appropriate guards?" },
      { id: "q3", label: "Is there a plan to keep walkways and escape routes clear of offcuts and materials during the first fix carpentry (domestic)?" },
      { id: "q4", label: "Will any work at height for the first fix carpentry (domestic) be carried out using suitable access equipment rather than makeshift platforms?" },
      { id: "q5", label: "Have you confirmed that structural elements installed as part of the first fix carpentry (domestic) are fixed in line with drawings or manufacturer guidance?" }
    ]
  },

  "Second fix carpentry (domestic)": {
    desc: "Second fix carpentry (domestic) involves installing visible finish carpentry such as doors, skirting, architraves, window boards and ironmongery after plastering is complete. The work is carried out in finished or nearly finished spaces where surfaces and furnishings must be protected from damage. Tasks require accurate measuring, cutting and fixing to achieve a neat visual finish. Good housekeeping is essential to avoid damage to floor finishes and to control dust from minor trimming and drilling.",
    hazards: ["manual_handling", "power_tools", "sharp_objects", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you put down suitable floor and surface protection before starting the second fix carpentry (domestic)?" },
      { id: "q2", label: "Are all mitre saws and hand tools for the second fix carpentry (domestic) set up in a designated cutting area away from occupied spaces where possible?" },
      { id: "q3", label: "Will offcuts, packaging and fixings from the second fix carpentry (domestic) be regularly cleared to prevent slips and trips?" },
      { id: "q4", label: "Have you confirmed hinge positions, door swing and ironmongery requirements with the client before fixing items during the second fix carpentry (domestic)?" },
      { id: "q5", label: "Is suitable extraction or local dust control in place if sanding or trimming is required during the second fix carpentry (domestic)?" }
    ]
  },

  "Roof truss installation": {
    desc: "Roof truss installation involves lifting, positioning and fixing prefabricated trussed rafters to form the primary roof structure. The work is usually carried out at height, often over open floor voids or scaffolds, and may involve working with cranes or mechanical lifting aids. Temporary bracing is required during installation to maintain stability until permanent restraint is in place. Close coordination with the site manager and scaffold contractor is needed to ensure safe access and edge protection.",
    hazards: ["work_at_height", "manual_handling", "plant_machinery", "falling_objects", "environmental_weather"],
    questions: [
      { id: "q1", label: "Has a lifting and handling plan been agreed for the roof truss installation including use of crane or mechanical aids where necessary?" },
      { id: "q2", label: "Is suitable scaffold or edge protection in place before starting the roof truss installation?" },
      { id: "q3", label: "Have you confirmed the bracing and restraint requirements from the truss manufacturer for the roof truss installation?" },
      { id: "q4", label: "Will exclusion zones be set up beneath the work area during the roof truss installation to protect people from falling objects?" },
      { id: "q5", label: "Have you checked the forecast and agreed to suspend the roof truss installation if wind speeds or weather conditions become unsafe?" }
    ]
  },

  "Cut roof construction": {
    desc: "Cut roof construction involves forming a roof structure on site from loose timber including rafters, purlins, ridges and associated bracing. The work is highly technical, often carried out at height and may be undertaken over partially completed structures. Accurate setting out and marking is required to ensure correct pitches and bearing on walls or steels. Safe access and a clear work platform are critical due to the presence of open edges and temporary conditions.",
    hazards: ["work_at_height", "manual_handling", "power_tools", "falling_objects", "environmental_weather"],
    questions: [
      { id: "q1", label: "Is there a safe working platform with edge protection in place before starting the cut roof construction?" },
      { id: "q2", label: "Have the spans, loads and bearing details for the cut roof construction been confirmed against drawings or engineering information?" },
      { id: "q3", label: "Are saws and cutting stations for the cut roof construction set up in a stable, well-lit area away from leading edges?" },
      { id: "q4", label: "Will temporary bracing and noggins be installed progressively during the cut roof construction to prevent instability?" },
      { id: "q5", label: "Have you briefed operatives on safe movement and material stacking on the structure during the cut roof construction?" }
    ]
  },

  "Joist and floor boarding installation": {
    desc: "Joist and floor boarding installation involves fixing floor joists, noggins and deck sheets to form new floor structures or strengthen existing ones. The work may be carried out over open voids or existing occupied areas that need protection from falling materials. Accurate levels and spacing are required to support finishes and meet load requirements. Good coordination with other trades is needed to allow for service penetrations and avoid clashes with pipework or cabling.",
    hazards: ["work_at_height", "manual_handling", "slips_trips", "falling_objects"],
    questions: [
      { id: "q1", label: "Have you installed temporary guarding or fall prevention under and around open areas before starting the joist and floor boarding installation?" },
      { id: "q2", label: "Is there a plan for safe material stacking so that joists and boards used in the joist and floor boarding installation do not overload local areas?" },
      { id: "q3", label: "Have you coordinated with mechanical and electrical trades regarding penetrations before fixing boards in the joist and floor boarding installation?" },
      { id: "q4", label: "Will cut-outs and openings created during the joist and floor boarding installation be protected or clearly marked to prevent falls?" },
      { id: "q5", label: "Have you checked that fixings and joist hangers selected for the joist and floor boarding installation are compatible with the structure and specification?" }
    ]
  },

  "Timber stud partition installation": {
    desc: "Timber stud partition installation involves setting out, erecting and fixing internal non-loadbearing walls using timber studs, head and sole plates. The work is often carried out in partially finished spaces with other trades present and requires accurate measurement for doors, services and linings. Cutting and fixing generate noise and dust which must be controlled in occupied buildings. Partitions may form fire or acoustic barriers, so correct spacing, fixings and linings are essential.",
    hazards: ["manual_handling", "power_tools", "dust_fumes", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you confirmed the locations, thicknesses and heights for the timber stud partition installation before starting?" },
      { id: "q2", label: "Is a clear route available for moving timber and plasterboard to the work area for the timber stud partition installation?" },
      { id: "q3", label: "Are suitable dust controls in place when cutting timber during the timber stud partition installation, especially in occupied areas?" },
      { id: "q4", label: "Will fixings and centres used in the timber stud partition installation meet the required fire and acoustic performance?" },
      { id: "q5", label: "Have you agreed how to protect adjacent finishes and existing services while carrying out the timber stud partition installation?" }
    ]
  },

  "Door lining and frame installation": {
    desc: "Door lining and frame installation involves fixing timber linings or pre-formed frames into prepared openings to receive doors and ironmongery. The work must achieve plumb, level and square frames to allow correct door operation and clearances. Fixing is usually into masonry or studwork using mechanical fixings and packers. Protection of installed linings is important to prevent damage before second fix is complete.",
    hazards: ["manual_handling", "power_tools", "sharp_objects", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you checked that structural openings are suitable and correctly sized before starting the door lining and frame installation?" },
      { id: "q2", label: "Are appropriate fixings and packers available for the substrate used in the door lining and frame installation?" },
      { id: "q3", label: "Is there a plan to protect finished linings from damage after the door lining and frame installation is complete?" },
      { id: "q4", label: "Will cutting and trimming for the door lining and frame installation be done at a designated cutting area to control dust and noise?" },
      { id: "q5", label: "Have you confirmed the required door swing direction and ironmongery positions before fixing during the door lining and frame installation?" }
    ]
  },

  "Internal door hanging": {
    desc: "Internal door hanging covers fitting new or replacement internal doors to prepared linings or frames, including trimming, hinging and fitting latches and handles. The work requires precise measuring and controlled cutting to achieve even gaps and smooth operation. Doors can be heavy and awkward to manoeuvre in confined spaces, especially on upper floors. Care is needed to avoid damage to finished floors, walls and existing decorations.",
    hazards: ["manual_handling", "sharp_objects", "power_tools", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you assessed the weight and size of doors for the internal door hanging and arranged team lifts where necessary?" },
      { id: "q2", label: "Is there adequate space and protection in place to set up a cutting bench for the internal door hanging?" },
      { id: "q3", label: "Will you check for services or hidden fixings before drilling or screwing into existing frames during the internal door hanging?" },
      { id: "q4", label: "Have you selected appropriate hinges and fixings for the door type and usage in the internal door hanging?" },
      { id: "q5", label: "Will you keep the work area clear of offcuts, screws and tools while carrying out the internal door hanging to avoid trips and puncture injuries?" }
    ]
  },

  "Fire door installation (FD30/FD60)": {
    desc: "Fire door installation (FD30/FD60) involves fitting certified fire-resisting door sets in accordance with manufacturers' instructions and fire strategy requirements. The work must strictly control clearances, intumescent seals, hinges and closers to maintain fire performance. Survey and preparation of openings may be required to achieve suitable substrates and frame fixings. Accurate labelling and documentation are essential to demonstrate compliance and allow future inspection.",
    hazards: ["manual_handling", "power_tools", "sharp_objects", "fire_explosion"],
    questions: [
      { id: "q1", label: "Have you confirmed the specification and certification details for the fire door installation (FD30/FD60) with reference to the fire strategy?" },
      { id: "q2", label: "Are manufacturers' installation instructions available on site for the fire door installation (FD30/FD60) and understood by operatives?" },
      { id: "q3", label: "Will any trimming of leaves or frames during the fire door installation (FD30/FD60) remain within the permitted tolerances?" },
      { id: "q4", label: "Have you checked that intumescent seals, hinges, closers and ironmongery used in the fire door installation (FD30/FD60) are all compatible and correctly rated?" },
      { id: "q5", label: "Is a process in place to label and record each opening completed as part of the fire door installation (FD30/FD60) for future inspection?" }
    ]
  },

  "External door and frame installation": {
    desc: "External door and frame installation covers fitting timber or composite door sets to external openings, often involving weather seals, thresholds and security ironmongery. The work is exposed to weather and may involve working at steps or platforms to access the opening. Accurate fitting is necessary to maintain security, weather tightness and smooth operation. Surrounding finishes and glazing units need to be protected during removal and installation.",
    hazards: ["manual_handling", "work_at_height", "environmental_weather", "sharp_objects"],
    questions: [
      { id: "q1", label: "Have you assessed the access and any need for steps or platforms before starting the external door and frame installation?" },
      { id: "q2", label: "Is there a plan to protect glazing, brickwork and internal finishes from damage during the external door and frame installation?" },
      { id: "q3", label: "Will adequate temporary security be maintained if the external door and frame installation extends overnight?" },
      { id: "q4", label: "Have you confirmed threshold levels and weathering details to prevent water ingress after the external door and frame installation?" },
      { id: "q5", label: "Are all locks, cylinders and ironmongery for the external door and frame installation suitable for the security requirements agreed with the client?" }
    ]
  },

  "Skirting board installation": {
    desc: "Skirting board installation involves fixing skirting profiles to the base of walls to protect finishes and provide a neat junction with the floor. It requires accurate measuring, mitring and scribing around corners and features such as door frames. The work is usually undertaken in finished or nearly finished spaces where floors and decorations must be protected. Cutting and fixing is typically done using saws, nail guns or hand tools.",
    hazards: ["manual_handling", "sharp_objects", "power_tools", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you put suitable protection in place for floor finishes before starting the skirting board installation?" },
      { id: "q2", label: "Are cutting and nailing tools for the skirting board installation set up safely with cables routed to avoid trip hazards?" },
      { id: "q3", label: "Will waste pieces and fixings from the skirting board installation be regularly cleared from walkways?" },
      { id: "q4", label: "Have you identified any services in walls that could be hit by fixings during the skirting board installation?" },
      { id: "q5", label: "Is appropriate eye and hearing protection available if nail guns or power saws are used during the skirting board installation?" }
    ]
  },

  "Architrave installation": {
    desc: "Architrave installation consists of fixing decorative trims around door and window openings to cover junctions between frames and walls. The work requires careful marking, mitring and nailing to achieve tight joints and consistent reveals. It is normally carried out in completed or nearly completed rooms where floors, decorations and frames must be protected. Power tools and sharp hand tools are used for cutting and fixing.",
    hazards: ["manual_handling", "sharp_objects", "power_tools", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you protected door linings and finished surfaces before starting the architrave installation?" },
      { id: "q2", label: "Is there an agreed cutting area for the architrave installation with adequate lighting and stable work supports?" },
      { id: "q3", label: "Will cables and hoses for tools used during the architrave installation be routed so they do not create trip hazards?" },
      { id: "q4", label: "Have you checked wall flatness and frame alignment to minimise the need for excessive packing during the architrave installation?" },
      { id: "q5", label: "Are suitable fixings and adhesives available for the substrate being fixed to during the architrave installation?" }
    ]
  },

  "Window board and reveal finishing": {
    desc: "Window board and reveal finishing involves fitting timber boards and trims to the internal bases and sides of window openings. The work must allow for movement, moisture and any heating elements beneath while achieving a neat seal to frames and plaster. Boards may need to be cut around radiators, pipes or other obstructions. Protection of existing glazing, sills and floor finishes is important during cutting and fixing.",
    hazards: ["manual_handling", "sharp_objects", "power_tools", "dust_fumes"],
    questions: [
      { id: "q1", label: "Have you protected existing windows, glass and floor finishes before starting the window board and reveal finishing?" },
      { id: "q2", label: "Is there a safe cutting area set up for trimming boards during the window board and reveal finishing?" },
      { id: "q3", label: "Will you inspect for hidden services before drilling or fixing during the window board and reveal finishing?" },
      { id: "q4", label: "Have you considered expansion gaps and moisture risks when detailing joints for the window board and reveal finishing?" },
      { id: "q5", label: "Are appropriate sealants and fixings available to complete the window board and reveal finishing to the specified standard?" }
    ]
  },

  "Kitchen base and wall unit installation": {
    desc: "Kitchen base and wall unit installation covers setting out, levelling, fixing and aligning cabinet carcasses within a kitchen area. The work includes securing units to walls and floors, allowing for services, appliances and worktops. Accurate coordination with plumbing and electrical trades is essential to avoid clashes and to maintain clearances. Protection of new units and existing finishes is required throughout the installation.",
    hazards: ["manual_handling", "power_tools", "sharp_objects", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you checked the kitchen layout, services positions and appliance sizes before starting the kitchen base and wall unit installation?" },
      { id: "q2", label: "Is there a plan for safe manual handling of units and tall larders during the kitchen base and wall unit installation?" },
      { id: "q3", label: "Will fixings used in the kitchen base and wall unit installation be appropriate for the wall construction and loading?" },
      { id: "q4", label: "Have you protected worktops, flooring and new units from damage while carrying out the kitchen base and wall unit installation?" },
      { id: "q5", label: "Is waste packaging and offcut material from the kitchen base and wall unit installation being cleared regularly to keep routes safe?" }
    ]
  },

  "Kitchen worktop fitting and joining": {
    desc: "Kitchen worktop fitting and joining involves cutting, scribing and fixing laminate, timber or composite worktops to kitchen units. The task can involve heavy, awkward lifts and precision jointing using specialist jigs and routers. Dust and noise levels can be high when cutting and edging. Cut-outs for sinks and hobs must be accurately positioned and sealed to prevent future water damage.",
    hazards: ["manual_handling", "power_tools", "dust_fumes", "sharp_objects"],
    questions: [
      { id: "q1", label: "Have you planned safe lifting methods and team assistance for handling long or heavy tops during the kitchen worktop fitting and joining?" },
      { id: "q2", label: "Is the router and jig setup for the kitchen worktop fitting and joining stable, well lit and correctly guarded?" },
      { id: "q3", label: "Are dust extraction or respiratory controls in place while cutting tops during the kitchen worktop fitting and joining?" },
      { id: "q4", label: "Have you confirmed sink, hob and appliance positions before making cut-outs as part of the kitchen worktop fitting and joining?" },
      { id: "q5", label: "Will all exposed edges and joints created during the kitchen worktop fitting and joining be sealed to prevent moisture ingress?" }
    ]
  },

  "Flat-pack and built-in furniture assembly": {
    desc: "Flat-pack and built-in furniture assembly covers constructing and fixing wardrobes, units and storage furniture supplied in kit or modular form. The work may be carried out in confined bedrooms or living areas with limited space to lay out components. Heavy panels, tall units and mirrors require careful handling and fixing to walls to prevent tipping. Packaging and offcuts must be controlled to avoid clutter and trip hazards.",
    hazards: ["manual_handling", "sharp_objects", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you identified a clear, level area to lay out components before starting the flat-pack and built-in furniture assembly?" },
      { id: "q2", label: "Will you use team lifts or aids for tall or heavy units during the flat-pack and built-in furniture assembly?" },
      { id: "q3", label: "Are you fixing tall items assembled during the flat-pack and built-in furniture assembly back to walls where required to prevent tipping?" },
      { id: "q4", label: "Is packaging being broken down and removed regularly during the flat-pack and built-in furniture assembly to keep routes clear?" },
      { id: "q5", label: "Have you checked for hidden services before drilling in walls during the flat-pack and built-in furniture assembly?" }
    ]
  },

  "Built-in wardrobes and bedroom storage": {
    desc: "Built-in wardrobes and bedroom storage installation involves constructing custom or modular storage systems fitted wall-to-wall or floor-to-ceiling. The work often takes place in confined bedrooms with existing decorations and floor coverings that must be protected. Units may require precise scribing to walls and ceilings and secure fixings to prevent movement. Sliding doors and mirrors introduce additional handling and breakage risks.",
    hazards: ["manual_handling", "sharp_objects", "slips_trips", "power_tools"],
    questions: [
      { id: "q1", label: "Have you protected carpets, flooring and existing decorations before starting the built-in wardrobes and bedroom storage installation?" },
      { id: "q2", label: "Will tall wardrobe carcasses for the built-in wardrobes and bedroom storage be lifted and fixed using safe team handling?" },
      { id: "q3", label: "Have you considered the weight and fixing requirements for any mirrors or glass doors within the built-in wardrobes and bedroom storage?" },
      { id: "q4", label: "Is there a plan to manage dust and noise during the built-in wardrobes and bedroom storage scribing and trimming works?" },
      { id: "q5", label: "Will all units installed as part of the built-in wardrobes and bedroom storage be securely fixed back to walls to prevent tipping?" }
    ]
  },

  "Alcove units and media wall joinery": {
    desc: "Alcove units and media wall joinery consists of bespoke storage and display units built into recesses or around media equipment. The work typically involves framing, cabinet construction, paneling and integration of cable routes and ventilation openings. Accurate coordination with electrical points and AV cabling is required. Finishes are highly visible, so careful handling and protection of materials are essential.",
    hazards: ["manual_handling", "sharp_objects", "power_tools", "dust_fumes"],
    questions: [
      { id: "q1", label: "Have you agreed cable routes, socket positions and ventilation openings before starting the alcove units and media wall joinery?" },
      { id: "q2", label: "Is there sufficient space and protection to assemble panels and carcasses for the alcove units and media wall joinery without damaging finishes?" },
      { id: "q3", label: "Will cutting for the alcove units and media wall joinery be done using appropriate extraction or dust control?" },
      { id: "q4", label: "Have you checked wall construction and fixings for any heavy equipment supported by the alcove units and media wall joinery?" },
      { id: "q5", label: "Is there a plan to label and leave accessible any service access panels incorporated into the alcove units and media wall joinery?" }
    ]
  },

  "Loft hatch installation": {
    desc: "Loft hatch installation involves cutting and forming an opening in a ceiling or modifying an existing opening to fit a purpose-made loft hatch. The work may be carried out on steps, platforms or from within the loft space and requires protection from falling debris below. Checks for services in the ceiling zone are essential before cutting. Edges of the opening must be properly framed and finished to maintain structural integrity and fire performance where required.",
    hazards: ["work_at_height", "dust_fumes", "sharp_objects", "manual_handling"],
    questions: [
      { id: "q1", label: "Have you checked for electrical cables, pipes or other services before cutting during the loft hatch installation?" },
      { id: "q2", label: "Is safe access such as a platform or stable steps provided for the loft hatch installation both below and above the ceiling?" },
      { id: "q3", label: "Will dust sheets and protection be used to protect the area beneath the loft hatch installation from debris?" },
      { id: "q4", label: "Have you ensured that trimmers and framing used in the loft hatch installation maintain structural and fire performance requirements?" },
      { id: "q5", label: "Is the new hatch unit selected for the loft hatch installation suitable for the opening size and insulation thickness?" }
    ]
  },

  "Loft ladder installation": {
    desc: "Loft ladder installation involves fitting a folding or sliding ladder unit to provide safe access into the loft space from below. The work usually includes fixing the ladder to the hatch frame, adjusting lengths and testing operation. Tasks are performed at height from steps or platforms and may require working partly within the loft. Clear fall zones must be maintained around the opening while work is in progress.",
    hazards: ["work_at_height", "manual_handling", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you provided a stable working platform or steps with handhold for the loft ladder installation?" },
      { id: "q2", label: "Is there a clear area beneath the opening to prevent people walking under the work during the loft ladder installation?" },
      { id: "q3", label: "Will you test the loft ladder installation for safe operation, load and locking before handover to the client?" },
      { id: "q4", label: "Have you adjusted and trimmed the ladder correctly during the loft ladder installation to avoid trip edges or unstable footing?" },
      { id: "q5", label: "Are all fixings and brackets used in the loft ladder installation tightened and checked against manufacturers' instructions?" }
    ]
  },

  "Loft boarding for storage": {
    desc: "Loft boarding for storage involves laying timber or panel boards across joists or raised frames to create a usable storage deck. The work is carried out in confined, poorly lit spaces with restricted headroom and possible trip hazards from insulation and joists. Care must be taken not to overload existing structures and to maintain ventilation and insulation performance. Access through the hatch and safe footing between joists are critical considerations.",
    hazards: ["work_at_height", "manual_handling", "slips_trips", "poor_lighting"],
    questions: [
      { id: "q1", label: "Have you assessed the existing structure and loading limits before starting the loft boarding for storage?" },
      { id: "q2", label: "Is adequate temporary lighting provided in the loft space for the loft boarding for storage?" },
      { id: "q3", label: "Will raised platforms or supports be used during the loft boarding for storage to avoid compressing insulation and bridging services?" },
      { id: "q4", label: "Are measures in place to prevent falls through the hatch opening during the loft boarding for storage?" },
      { id: "q5", label: "Have you briefed operatives on safe movement between joists while carrying out the loft boarding for storage?" }
    ]
  },

  "Timber decking installation (ground level)": {
    desc: "Timber decking installation (ground level) covers constructing low-level deck areas using joists and deck boards supported on pads, posts or slabs. Work is undertaken outdoors with variable weather and ground conditions. Accurate setting out and support spacing are required to prevent movement and ponding. Good housekeeping is needed to control slips, offcuts and protruding fixings during construction.",
    hazards: ["manual_handling", "environmental_weather", "slips_trips", "sharp_objects"],
    questions: [
      { id: "q1", label: "Have you checked ground conditions, services and levels before starting the timber decking installation (ground level)?" },
      { id: "q2", label: "Will materials for the timber decking installation (ground level) be stored on firm, level ground to prevent collapse or trip hazards?" },
      { id: "q3", label: "Are suitable weather-resistant fixings and treatments planned for the timber decking installation (ground level)?" },
      { id: "q4", label: "Is there a plan to keep the work area for the timber decking installation (ground level) free from protruding screws, offcuts and nails?" },
      { id: "q5", label: "Have you considered drainage and slip resistance when setting falls and board direction for the timber decking installation (ground level)?" }
    ]
  },

  "Raised timber decking with steps": {
    desc: "Raised timber decking with steps involves building elevated deck platforms and associated access steps or stairs. The work introduces greater fall risks from exposed edges and temporary conditions during construction. Structural posts, handrails and balustrades must be designed and installed to resist loads and provide safe guarding. Controls are required to prevent access beneath unstable areas and to manage weather effects on footing stability.",
    hazards: ["work_at_height", "manual_handling", "slips_trips", "falling_objects"],
    questions: [
      { id: "q1", label: "Have you installed temporary edge protection or barriers during the raised timber decking with steps installation?" },
      { id: "q2", label: "Are post foundations and supports for the raised timber decking with steps adequate for the load and ground conditions?" },
      { id: "q3", label: "Will handrails and balustrades for the raised timber decking with steps be installed to the required height and spacing to prevent falls?" },
      { id: "q4", label: "Is access beneath the structure restricted during the raised timber decking with steps construction to avoid injury from falling objects?" },
      { id: "q5", label: "Have you planned slip-resistant finishes and drainage for treads and landings as part of the raised timber decking with steps?" }
    ]
  },

  "Timber garden fencing and posts": {
    desc: "Timber garden fencing and posts installation involves setting posts in the ground and fixing fence panels or rails between them. The work includes digging or augering post holes, handling heavy panels and working along property boundaries. Ground conditions, underground services and adjacent structures must be considered. Cement or post-mix is frequently used to secure posts, requiring manual handling and safe mixing practices.",
    hazards: ["manual_handling", "excavation", "environmental_weather", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you checked for underground services before digging during the timber garden fencing and posts installation?" },
      { id: "q2", label: "Is there a plan for safe manual handling or mechanical assistance when lifting panels for the timber garden fencing and posts installation?" },
      { id: "q3", label: "Will excavated holes and materials from the timber garden fencing and posts installation be managed to avoid trip and collapse risks?" },
      { id: "q4", label: "Have you considered wind loading and post spacing for the timber garden fencing and posts installation to prevent future failure?" },
      { id: "q5", label: "Are measures in place to keep the work area for the timber garden fencing and posts installation secure from the public during work?" }
    ]
  },

  "Timber gates installation": {
    desc: "Timber gates installation includes fitting pedestrian or driveway gates and their supporting posts, hinges and latches. Gates can be heavy and awkward to hold while alignment is checked. Ground levels, vehicle movements and security needs all influence the design. The work may be carried out adjacent to live roads or shared access routes, requiring coordination to prevent vehicle–worker interface risks.",
    hazards: ["manual_handling", "moving_vehicles", "sharp_objects", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you planned how to support and lift heavy leaves safely during the timber gates installation?" },
      { id: "q2", label: "Is there a traffic management plan where the timber gates installation is taking place near live driveways or roads?" },
      { id: "q3", label: "Will hinges, bolts and locks used in the timber gates installation be suitable for the gate weight and security requirement?" },
      { id: "q4", label: "Have you checked clear opening widths and ground falls before fixing during the timber gates installation?" },
      { id: "q5", label: "Is the work area for the timber gates installation kept tidy with offcuts and packaging removed from access routes?" }
    ]
  },

  "Garden shed / timber outbuilding construction": {
    desc: "Garden shed / timber outbuilding construction involves assembling prefabricated or custom-built timber structures for storage or workspace. The work includes forming bases, erecting wall panels, fitting roofs and installing doors and windows. Manual handling demands can be significant when lifting panels and roofing materials. Safe use of ladders or platforms is required when working at height on the roof or high walls.",
    hazards: ["manual_handling", "work_at_height", "environmental_weather", "power_tools"],
    questions: [
      { id: "q1", label: "Have you confirmed that the base is level and suitable before starting the garden shed / timber outbuilding construction?" },
      { id: "q2", label: "Will team lifting or aids be used for wall and roof panels during the garden shed / timber outbuilding construction?" },
      { id: "q3", label: "Is suitable access equipment provided for fixing roofing materials during the garden shed / timber outbuilding construction?" },
      { id: "q4", label: "Have you planned weather protection or safe stopping points if the garden shed / timber outbuilding construction cannot be completed in one visit?" },
      { id: "q5", label: "Are all power tools used in the garden shed / timber outbuilding construction maintained, guarded and used with appropriate PPE?" }
    ]
  },

  "Timber pergola or gazebo installation": {
    desc: "Timber pergola or gazebo installation covers constructing open or partially enclosed timber structures in gardens or outdoor spaces. The work requires setting out post locations, installing footings or anchors and fixing beams, rafters and bracing above head height. Stability of posts during installation is critical, as is the integrity of fixings exposed to weather. Work is carried out externally with variable ground conditions and weather exposure.",
    hazards: ["work_at_height", "manual_handling", "environmental_weather", "falling_objects"],
    questions: [
      { id: "q1", label: "Have you confirmed footing details and post anchor requirements before starting the timber pergola or gazebo installation?" },
      { id: "q2", label: "Will posts be braced or temporarily supported during the timber pergola or gazebo installation to prevent collapse?" },
      { id: "q3", label: "Is safe access in place for fixing beams and rafters overhead during the timber pergola or gazebo installation?" },
      { id: "q4", label: "Have you considered wind loading and fixings durability for the completed timber pergola or gazebo installation?" },
      { id: "q5", label: "Is the work area for the timber pergola or gazebo installation segregated from members of the public and householders?" }
    ]
  },

  "Timber carport / canopy frame": {
    desc: "Timber carport / canopy frame installation involves building timber-framed shelter structures attached to or adjacent to existing buildings. The work includes setting posts, beams and rafters and coordinating with roof coverings or glazing. Height and proximity to vehicles introduce additional risks during construction. Accurate fixing to existing structures must be achieved without compromising structural integrity or weather tightness.",
    hazards: ["work_at_height", "manual_handling", "moving_vehicles", "environmental_weather"],
    questions: [
      { id: "q1", label: "Has access for vehicles been controlled or restricted during the timber carport / canopy frame installation?" },
      { id: "q2", label: "Are posts, anchors and connections for the timber carport / canopy frame installation designed for expected snow and wind loading?" },
      { id: "q3", label: "Is safe access in place for working at height on beams and rafters during the timber carport / canopy frame installation?" },
      { id: "q4", label: "Have you checked for services where the timber carport / canopy frame installation connects to existing buildings?" },
      { id: "q5", label: "Will temporary supports be used during the timber carport / canopy frame installation to prevent instability before completion?" }
    ]
  },

  "Timber cladding installation (external)": {
    desc: "Timber cladding installation (external) covers fixing timber boards or panels to external walls or facades over battens and membranes. The work is frequently carried out from scaffolds or MEWPs and involves cutting and handling long sections. Detailing around windows, corners and penetrations must maintain weather tightness and ventilation. Fire performance and fixings must follow specification, particularly on multi-storey buildings.",
    hazards: ["work_at_height", "manual_handling", "environmental_weather", "power_tools"],
    questions: [
      { id: "q1", label: "Is suitable scaffold or access equipment in place before starting the timber cladding installation (external)?" },
      { id: "q2", label: "Have you confirmed cavity barriers, fire breaks and membrane details for the timber cladding installation (external)?" },
      { id: "q3", label: "Will cutting stations for the timber cladding installation (external) be set up with dust and noise controls away from the public?" },
      { id: "q4", label: "Are fixings and batten sizing for the timber cladding installation (external) in line with the engineer or manufacturer requirements?" },
      { id: "q5", label: "Have you planned safe material lifting and handling to the workface for the timber cladding installation (external)?" }
    ]
  },

  "Timber cladding installation (internal feature walls)": {
    desc: "Timber cladding installation (internal feature walls) involves fixing decorative timber panels or boards to interior walls and ceilings. The work is often carried out in finished spaces that must be protected from dust and damage. Fixings must be suitable for the substrate and any fire or acoustic requirements. Accurate set-out is required to align patterns with openings, corners and ceilings.",
    hazards: ["manual_handling", "dust_fumes", "sharp_objects", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you put dust sheets and protection in place before starting the timber cladding installation (internal feature walls)?" },
      { id: "q2", label: "Will a suitable extraction or dust control method be used when cutting boards for the timber cladding installation (internal feature walls)?" },
      { id: "q3", label: "Are fixings chosen for the timber cladding installation (internal feature walls) appropriate for the wall construction?" },
      { id: "q4", label: "Have you checked for hidden services behind walls prior to nailing or screwing during the timber cladding installation (internal feature walls)?" },
      { id: "q5", label: "Is waste packaging and offcut material from the timber cladding installation (internal feature walls) being removed regularly to keep floors clear?" }
    ]
  },

  "Floorboard repair and replacement": {
    desc: "Floorboard repair and replacement involves lifting damaged boards, inspecting joists and refitting or replacing boards as required. The work may expose services running below the floor and can leave temporary openings and trip hazards if not managed correctly. Noise and dust can affect occupants in residential properties. Accurate fixing is needed to prevent squeaks and movement under future loads.",
    hazards: ["manual_handling", "slips_trips", "sharp_objects", "poor_lighting"],
    questions: [
      { id: "q1", label: "Have you identified and marked all openings to prevent falls during the floorboard repair and replacement?" },
      { id: "q2", label: "Will you isolate or visibly identify services before cutting or lifting boards during the floorboard repair and replacement?" },
      { id: "q3", label: "Is adequate lighting provided in the work area for the floorboard repair and replacement, especially in voids?" },
      { id: "q4", label: "Are suitable fixings being used to secure boards during the floorboard repair and replacement to prevent future loosening?" },
      { id: "q5", label: "Is waste timber and protruding nails removed promptly during the floorboard repair and replacement to avoid injuries?" }
    ]
  },

  "Timber floor levelling and strengthening": {
    desc: "Timber floor levelling and strengthening involves adding new joists, noggins or overlays to correct slopes and improve structural performance. The work may require partial strip-out of existing finishes and careful assessment of existing supports. Activities can create uneven surfaces and temporary trip hazards while works are in progress. Coordination with other trades is needed where floors support partitions, bathrooms or services.",
    hazards: ["manual_handling", "slips_trips", "dust_fumes", "structural_collapse"],
    questions: [
      { id: "q1", label: "Have you assessed the existing structure and consulted engineering information before starting the timber floor levelling and strengthening?" },
      { id: "q2", label: "Will temporary barriers or signage be used to prevent access across unsafe areas during the timber floor levelling and strengthening?" },
      { id: "q3", label: "Are dust and noise from cutting controlled appropriately during the timber floor levelling and strengthening?" },
      { id: "q4", label: "Have you identified any walls or services that rely on existing floor support before altering them in the timber floor levelling and strengthening?" },
      { id: "q5", label: "Is there a plan for re-instating finishes once the timber floor levelling and strengthening work is complete to remove trip hazards?" }
    ]
  },

  "Staircase installation (new stair)": {
    desc: "Staircase installation (new stair) involves fitting complete stair flights or modular stair components within a void or between floors. The work includes lifting heavy and awkward components, aligning landings and fixing to supports. Open edges and fall risks are significant until guarding is installed. Coordination with structural supports, headroom requirements and finishes is crucial for compliance and safe use.",
    hazards: ["work_at_height", "manual_handling", "falling_objects", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you planned lifting methods and routes for stair flights before starting the staircase installation (new stair)?" },
      { id: "q2", label: "Are temporary guarding or barriers installed around voids during the staircase installation (new stair)?" },
      { id: "q3", label: "Will the staircase installation (new stair) be fixed to suitable structural supports in line with drawings and specifications?" },
      { id: "q4", label: "Have you confirmed headroom, riser heights and going dimensions during the staircase installation (new stair) to meet regulations?" },
      { id: "q5", label: "Is the work area below the staircase installation (new stair) controlled to prevent people passing under while fixing overhead?" }
    ]
  },

  "Stair refurbishment (treads/risers over-clad)": {
    desc: "Stair refurbishment (treads/risers over-clad) involves over-boarding or re-finishing existing stairs with new treads, risers or nosings. The work is carried out in circulation routes used by occupants and can create immediate trip hazards if stairs are left partly complete. Materials must be securely fixed and meet slip resistance requirements. Dust and noise must be controlled, especially in occupied dwellings.",
    hazards: ["slips_trips", "manual_handling", "sharp_objects"],
    questions: [
      { id: "q1", label: "Have you planned how to maintain safe access or agreed alternative routes during the stair refurbishment (treads/risers over-clad)?" },
      { id: "q2", label: "Will treads and nosings used in the stair refurbishment (treads/risers over-clad) provide adequate slip resistance?" },
      { id: "q3", label: "Are all old fixings, nails and staples removed or made safe during the stair refurbishment (treads/risers over-clad)?" },
      { id: "q4", label: "Is dust from cutting and sanding controlled during the stair refurbishment (treads/risers over-clad), particularly in occupied areas?" },
      { id: "q5", label: "Will stairs only be handed back to occupants once the stair refurbishment (treads/risers over-clad) is fully complete and safe?" }
    ]
  },

  "Balustrade and handrail installation": {
    desc: "Balustrade and handrail installation covers fitting guarding and handrails to stairs, landings, decks and balconies. The work is critical for preventing falls from height and must meet spacing, height and loading requirements. Tasks may be carried out at exposed edges using steps or platforms. Components can be heavy and awkward, especially on tight staircases.",
    hazards: ["work_at_height", "manual_handling", "falling_objects", "sharp_objects"],
    questions: [
      { id: "q1", label: "Have you confirmed the required heights and gap dimensions for the balustrade and handrail installation to meet regulations?" },
      { id: "q2", label: "Is safe access in place for working near exposed edges during the balustrade and handrail installation?" },
      { id: "q3", label: "Will components used in the balustrade and handrail installation be securely fixed to suitable substrates?" },
      { id: "q4", label: "Are you controlling the risk of dropped tools or materials to lower levels during the balustrade and handrail installation?" },
      { id: "q5", label: "Have you ensured there are no sharp projections or snagging hazards following the balustrade and handrail installation?" }
    ]
  },

  "Newel post replacement": {
    desc: "Newel post replacement involves removing and replacing structural or semi-structural posts at the ends and junctions of stair balustrades. The work requires careful cutting and fixing to avoid compromising stair stability. Operations often occur on live stairs used by occupants. Temporary guarding or support may be needed while posts are removed.",
    hazards: ["work_at_height", "slips_trips", "sharp_objects", "manual_handling"],
    questions: [
      { id: "q1", label: "Have you assessed the structural role of the existing post before starting the newel post replacement?" },
      { id: "q2", label: "Will temporary support or guarding be installed during the newel post replacement to prevent falls?" },
      { id: "q3", label: "Are cutting and fixing operations for the newel post replacement planned to avoid damaging stairs or finishes?" },
      { id: "q4", label: "Have you agreed access arrangements with the client while the newel post replacement is ongoing?" },
      { id: "q5", label: "Will the newel post replacement be fixed in accordance with manufacturer or design details to restore full stability?" }
    ]
  },

  "Boxing-in of services (pipes/soil stacks)": {
    desc: "Boxing-in of services (pipes/soil stacks) involves constructing timber frameworks and panels to conceal services while allowing for access and ventilation where required. The work includes working in bathrooms, plant areas and circulation spaces with existing finishes and fixtures. Fixings must avoid damaging hidden pipework or cables. Panels may need to be demountable for maintenance.",
    hazards: ["manual_handling", "sharp_objects", "power_tools", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you confirmed the exact route of services before starting the boxing-in of services (pipes/soil stacks)?" },
      { id: "q2", label: "Will fixings for the boxing-in of services (pipes/soil stacks) be located to avoid puncturing pipes or cables?" },
      { id: "q3", label: "Is provision being made for access panels where required as part of the boxing-in of services (pipes/soil stacks)?" },
      { id: "q4", label: "Are you controlling dust and protecting existing sanitaryware and finishes during the boxing-in of services (pipes/soil stacks)?" },
      { id: "q5", label: "Will any boxing installed as part of the boxing-in of services (pipes/soil stacks) be adequately supported and fixed to resist knocks?" }
    ]
  },

  "Pipe and cable boxing to corridors": {
    desc: "Pipe and cable boxing to corridors covers forming long runs of timber and board enclosures to conceal services within circulation routes. The work is carried out in areas used by occupants and must be sequenced to maintain safe passage. Fire stopping and compartmentation requirements must be maintained at penetrations and junctions. Fixings must be robust to resist everyday knocks and impacts.",
    hazards: ["manual_handling", "slips_trips", "fire_explosion", "sharp_objects"],
    questions: [
      { id: "q1", label: "Have you reviewed fire strategy and compartmentation requirements before starting the pipe and cable boxing to corridors?" },
      { id: "q2", label: "Will you maintain adequate corridor width and emergency escape routes during the pipe and cable boxing to corridors?" },
      { id: "q3", label: "Are suitable supports and fixings selected to prevent sagging or collapse of the pipe and cable boxing to corridors?" },
      { id: "q4", label: "Is dust and noise being controlled while cutting materials for the pipe and cable boxing to corridors in occupied buildings?" },
      { id: "q5", label: "Will any fire-stopping disturbed during the pipe and cable boxing to corridors be reinstated to the correct standard?" }
    ]
  },

  "Window frame repair (timber)": {
    desc: "Window frame repair (timber) involves cutting out decayed areas, splicing in new timber or resin repairs and refitting beads and hardware. Work is usually undertaken on external elevations from ladders, towers or scaffolds and may include lead-based paint or glazing putty. Openings must be controlled to avoid falls and protect occupants below from falling debris or glass.",
    hazards: ["work_at_height", "sharp_objects", "dust_fumes", "falling_objects"],
    questions: [
      { id: "q1", label: "Is appropriate access equipment in place before starting the window frame repair (timber) at height?" },
      { id: "q2", label: "Have you planned measures to catch or control debris and glass during the window frame repair (timber)?" },
      { id: "q3", label: "Will suitable respiratory and skin protection be used if old coatings may contain lead during the window frame repair (timber)?" },
      { id: "q4", label: "Are splices and repair materials for the window frame repair (timber) compatible with existing timber and coatings?" },
      { id: "q5", label: "Is the area beneath the work cordoned off while the window frame repair (timber) is in progress?" }
    ]
  },

  "Door and window ironmongery upgrade": {
    desc: "Door and window ironmongery upgrade involves replacing or installing locks, handles, hinges and stays on existing timber doors and windows. The work is carried out in occupied buildings with the need to maintain security and safe egress. Small power tools and sharp hand tools are used for morticing and drilling. Doors and windows may be temporarily inoperable while works are underway.",
    hazards: ["sharp_objects", "power_tools", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you agreed how to maintain security and fire escape routes during the door and window ironmongery upgrade?" },
      { id: "q2", label: "Will drilling and morticing for the door and window ironmongery upgrade be carried out with suitable dust and eye protection?" },
      { id: "q3", label: "Are you checking for concealed services before fixing into frames during the door and window ironmongery upgrade?" },
      { id: "q4", label: "Is the work area for the door and window ironmongery upgrade kept free of loose screws, offcuts and packaging?" },
      { id: "q5", label: "Are all new items fitted during the door and window ironmongery upgrade tested for correct operation before handover?" }
    ]
  },

  "Temporary timber works and propping (non-structural)": {
    desc: "Temporary timber works and propping (non-structural) includes building short-term supports, ramps, platforms or guards to facilitate works on site. These elements are not designed as primary structural supports but must still be stable and safe under anticipated loads. Work is carried out in live construction environments with changing conditions. Good communication with site management is essential to ensure items are removed or adapted as work progresses.",
    hazards: ["manual_handling", "slips_trips", "work_at_height", "structural_collapse"],
    questions: [
      { id: "q1", label: "Have you agreed loadings and intended use for the temporary timber works and propping (non-structural) with site management?" },
      { id: "q2", label: "Will the temporary timber works and propping (non-structural) be checked and signed off before being put into use?" },
      { id: "q3", label: "Are all components for the temporary timber works and propping (non-structural) suitably braced and fixed to prevent movement?" },
      { id: "q4", label: "Is there a plan for regular inspection of the temporary timber works and propping (non-structural) while they remain in place?" },
      { id: "q5", label: "Have you made sure that the temporary timber works and propping (non-structural) do not obstruct emergency routes or access for others?" }
    ]
  },

  "Site hoarding and timber barriers": {
    desc: "Site hoarding and timber barriers installation involves erecting solid timber fencing, gates and screens to secure the perimeter of a construction site or segregate areas within it. The work involves post setting, framing and sheeting often along public footpaths or roads. Structures must be stable under wind loads and impact. Consideration must be given to access for emergency services and visibility for vehicles and pedestrians.",
    hazards: ["manual_handling", "moving_vehicles", "environmental_weather", "excavation"],
    questions: [
      { id: "q1", label: "Has a line and level been agreed and checked for underground services before starting the site hoarding and timber barriers installation?" },
      { id: "q2", label: "Is a traffic and pedestrian management plan in place for the site hoarding and timber barriers installation near public areas?" },
      { id: "q3", label: "Will posts and framing for the site hoarding and timber barriers installation be sized and fixed to withstand expected wind loading?" },
      { id: "q4", label: "Are suitable gates, locks and viewing gaps included to maintain security and visibility in the site hoarding and timber barriers installation?" },
      { id: "q5", label: "Is there a documented inspection regime for the site hoarding and timber barriers installation while it remains in place?" }
    ]
  },

  "Temporary access ramps and steps (timber)": {
    desc: "Temporary access ramps and steps (timber) are built to maintain safe access where levels or routes are disrupted by works. The structures must accommodate anticipated pedestrian or light equipment loads and provide slip-resistant surfaces and handrails where required. Poor design or construction can lead to collapse or falls. Coordination is required to avoid conflict with plant movements and other site activities.",
    hazards: ["work_at_height", "slips_trips", "manual_handling", "structural_collapse"],
    questions: [
      { id: "q1", label: "Have you calculated loadings and gradients before constructing the temporary access ramps and steps (timber)?" },
      { id: "q2", label: "Will the temporary access ramps and steps (timber) include handrails and edge protection where there is a risk of falls?" },
      { id: "q3", label: "Are slip-resistant treads or coverings being used on the temporary access ramps and steps (timber)?" },
      { id: "q4", label: "Is there a plan to inspect and maintain the temporary access ramps and steps (timber) while they are in use?" },
      { id: "q5", label: "Have you ensured that the temporary access ramps and steps (timber) do not obstruct emergency egress routes?" }
    ]
  },

  "Timber formwork for strip foundations": {
    desc: "Timber formwork for strip foundations involves constructing shuttering to contain poured concrete in trenches or ground beams. The work includes setting levels, fixing profiles and working close to open excavations. Stability of the formwork and safe access around trenches are critical. Coordination with concrete placement operations is required to avoid collapse or blow-out.",
    hazards: ["excavation", "manual_handling", "slips_trips", "plant_machinery"],
    questions: [
      { id: "q1", label: "Have trenches been inspected and made safe before starting the timber formwork for strip foundations?" },
      { id: "q2", label: "Will access around the timber formwork for strip foundations be kept clear and protected from falls into excavations?" },
      { id: "q3", label: "Are form ties, stakes and braces for the timber formwork for strip foundations adequate for concrete pressure?" },
      { id: "q4", label: "Is there safe segregation from plant and concrete wagons while working on the timber formwork for strip foundations?" },
      { id: "q5", label: "Have you planned how to safely strike and remove the timber formwork for strip foundations after curing?" }
    ]
  },

  "Timber formwork for slabs and pads": {
    desc: "Timber formwork for slabs and pads involves setting out and fixing edge shutters and profiles to define concrete slabs, pads and ground-bearing bases. Work is often external and involves repeated bending, kneeling and handling of boards and stakes. Accurate levels and lines are important for drainage and slab thickness. Access for concrete wagons, pumps and finishing equipment must be maintained safely.",
    hazards: ["manual_handling", "slips_trips", "plant_machinery", "environmental_weather"],
    questions: [
      { id: "q1", label: "Have you set out lines and levels correctly before fixing the timber formwork for slabs and pads?" },
      { id: "q2", label: "Are edge shutters and stakes for the timber formwork for slabs and pads fixed securely to resist concrete pressure?" },
      { id: "q3", label: "Is safe access maintained for concrete delivery and finishing while the timber formwork for slabs and pads is in place?" },
      { id: "q4", label: "Have you considered the effects of rain, heat or frost on the timber formwork for slabs and pads and the fresh concrete?" },
      { id: "q5", label: "Is there a safe method in place for stripping the timber formwork for slabs and pads without damaging edges?" }
    ]
  },

  "Timber formwork for walls and columns": {
    desc: "Timber formwork for walls and columns involves building vertical shutters to contain concrete in suspended or ground-level wall and column pours. The work may take place at height on scaffolds or platforms and requires strong tying and bracing systems. Failure can lead to sudden releases of concrete, falling materials and structural instability. Coordination with steel fixing and concrete trades is essential.",
    hazards: ["work_at_height", "manual_handling", "plant_machinery", "structural_collapse"],
    questions: [
      { id: "q1", label: "Has the design of the timber formwork for walls and columns been checked for concrete pressures and tie spacing?" },
      { id: "q2", label: "Is safe access such as scaffolding available for constructing and striking the timber formwork for walls and columns?" },
      { id: "q3", label: "Will exclusion zones be maintained during concrete pours associated with the timber formwork for walls and columns?" },
      { id: "q4", label: "Are tie rods, walers and braces for the timber formwork for walls and columns correctly installed and tightened?" },
      { id: "q5", label: "Is there an agreed sequence for striking the timber formwork for walls and columns to avoid destabilising the structure?" }
    ]
  },

  "Timber edge protection to voids (handrails)": {
    desc: "Timber edge protection to voids (handrails) involves installing temporary or semi-permanent rails and toe boards to protect workers from falls at floor edges, stairwells or voids. The work is carried out in live construction environments and often at height. Edge protection must be robust, correctly fixed and regularly inspected. Incorrect installation can give a false sense of security and lead to serious accidents.",
    hazards: ["work_at_height", "slips_trips", "structural_collapse"],
    questions: [
      { id: "q1", label: "Have you confirmed the required heights and loading for the timber edge protection to voids (handrails)?" },
      { id: "q2", label: "Will posts and rails for the timber edge protection to voids (handrails) be securely fixed to suitable structural elements?" },
      { id: "q3", label: "Is there an inspection and sign-off process for the timber edge protection to voids (handrails) before use?" },
      { id: "q4", label: "Are toe boards provided as part of the timber edge protection to voids (handrails) where falling objects are a risk?" },
      { id: "q5", label: "Will defective or altered sections of the timber edge protection to voids (handrails) be removed from service until repaired?" }
    ]
  },

  "Soffit and fascia board replacement (timber)": {
    desc: "Soffit and fascia board replacement (timber) involves removing existing eaves boards and fitting new timber components at roof level. The work is undertaken from ladders, towers or scaffolds and may involve working over conservatories or extensions. Care must be taken with fragile roofing materials and existing gutters. Handling long boards at height introduces stability and manual handling risks.",
    hazards: ["work_at_height", "manual_handling", "falling_objects", "environmental_weather"],
    questions: [
      { id: "q1", label: "Is appropriate access equipment provided before starting the soffit and fascia board replacement (timber)?" },
      { id: "q2", label: "Will long boards used in the soffit and fascia board replacement (timber) be handled by more than one person where necessary?" },
      { id: "q3", label: "Have you checked for fragile roofing elements and planned safe working methods for the soffit and fascia board replacement (timber)?" },
      { id: "q4", label: "Is the area below cordoned off to protect people from falling debris during the soffit and fascia board replacement (timber)?" },
      { id: "q5", label: "Have you allowed for safe removal and reinstatement of gutters during the soffit and fascia board replacement (timber)?" }
    ]
  },

  "Timber bulkheads and ceiling casings": {
    desc: "Timber bulkheads and ceiling casings involve constructing dropped sections of ceiling or boxings to conceal services or create architectural features. The work is done at height from steps or platforms and often in finished interiors. Accurate set-out is required to integrate with lighting, grilles and other services. Dust and noise must be managed where occupants are present below.",
    hazards: ["work_at_height", "manual_handling", "dust_fumes", "slips_trips"],
    questions: [
      { id: "q1", label: "Is stable access equipment provided for the timber bulkheads and ceiling casings installation?" },
      { id: "q2", label: "Have you coordinated with M&E trades on locations of fittings before starting the timber bulkheads and ceiling casings?" },
      { id: "q3", label: "Will cutting and fixing for the timber bulkheads and ceiling casings be carried out with adequate dust control?" },
      { id: "q4", label: "Are fixings and hangers for the timber bulkheads and ceiling casings suitable for the ceiling structure?" },
      { id: "q5", label: "Is the work area under the timber bulkheads and ceiling casings installation protected and segregated from building users?" }
    ]
  },

  "Other (Custom carpenter/joiner)": {
    desc: "",
    hazards: [],
    questions: [
      { id: "q1", label: "Have you identified all specific hazards associated with this custom carpenter/joiner task?" },
      { id: "q2", label: "Do you have the correct tools, fixings and access equipment for this specific carpenter/joiner work?" },
      { id: "q3", label: "Has a dynamic risk assessment been carried out for this custom carpenter/joiner task before starting?" },
      { id: "q4", label: "Are you competent and appropriately supervised to undertake this specific custom carpenter/joiner task?" },
      { id: "q5", label: "Have you agreed the full scope, constraints and handover requirements for this custom carpenter/joiner task with the client?" }
    ]
  }
};

// ==========================================
// 4. JOB CLUSTERS (DRYLINING & CEILINGS)
// ==========================================

const DRYLINING_CEILINGS_CLUSTERS: Record<string, JobCluster> = {
  "Metal stud partition installation": {
    desc: "Metal stud partition installation involves setting out, fixing track and studs, and lining with plasterboard to form internal walls or room divisions. Studwork is fixed to floors, walls and ceilings while maintaining plumb and straight lines. Openings for doors and services are framed with additional support and bracing. All work is carried out in line with manufacturer details and fire/acoustic requirements.",
    hazards: ["manual_handling", "work_at_height", "dust_fumes", "silica_dust", "sharp_objects"],
    questions: [
      { id: "q1", label: "Have you confirmed the setting out for the metal stud partition installation against drawings and structural constraints?" },
      { id: "q2", label: "Are suitable fixings and anchors available for the substrates involved in the metal stud partition installation?" },
      { id: "q3", label: "Will cutting of studs and boards for the metal stud partition installation be carried out using dust-reducing methods where possible?" },
      { id: "q4", label: "Is appropriate access equipment in place for any high-level tasks during the metal stud partition installation?" },
      { id: "q5", label: "Have you checked that door openings and service penetrations are correctly framed within the metal stud partition installation?" }
    ]
  },

  "Timber stud partition installation": {
    desc: "Timber stud partition installation uses timber studs and plates to form internal walls which are then lined with plasterboard or other board materials. Work includes setting out, fixing sole and head plates, installing studs at correct centres and bracing where required. Consideration is given to straightness, fixing into suitable substrates and avoiding clashes with services. Boarding and subsequent finishes rely on the studwork being correctly installed.",
    hazards: ["manual_handling", "work_at_height", "sharp_objects", "dust_fumes"],
    questions: [
      { id: "q1", label: "Has the line and position of the timber stud partition installation been agreed with the client or site manager?" },
      { id: "q2", label: "Are you using straight, undamaged timber suitable for the timber stud partition installation?" },
      { id: "q3", label: "Will fixings for the timber stud partition installation be appropriate for the floor and ceiling substrates?" },
      { id: "q4", label: "Is access clear of trip hazards where the timber stud partition installation is being built?" },
      { id: "q5", label: "Have you allowed for door openings and noggins in the timber stud partition installation before boarding starts?" }
    ]
  },

  "Acoustic partition installation": {
    desc: "Acoustic partition installation focuses on providing enhanced sound reduction between rooms using specific stud arrangements, insulation and board types. The work includes installing studs, acoustic insulation, resilient bars or channels and multi-layer boarding. Care is taken to minimise flanking paths and ensure all joints and junctions are sealed. Manufacturer details and acoustic performance requirements are followed throughout.",
    hazards: ["manual_handling", "dust_fumes", "silica_dust", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you confirmed the acoustic specification and build-up required for the acoustic partition installation?" },
      { id: "q2", label: "Is suitable acoustic insulation on site and stored dry for the acoustic partition installation?" },
      { id: "q3", label: "Will joints and perimeters of the acoustic partition installation be sealed as per manufacturer guidance?" },
      { id: "q4", label: "Have you planned the acoustic partition installation to avoid gaps around sockets and service penetrations?" },
      { id: "q5", label: "Are materials and offcuts from the acoustic partition installation kept tidy to avoid slips and trips?" }
    ]
  },

  "Fire-rated partition installation": {
    desc: "Fire-rated partition installation provides fire compartmentation using tested stud and board systems designed to achieve a specific fire resistance period. The work includes installing studs, fire-rated boards, appropriate fixings and sealing all joints and penetrations. Details at head, base and junctions with other construction are followed precisely. Any deviation from the system can compromise fire performance.",
    hazards: ["manual_handling", "dust_fumes", "silica_dust", "work_at_height", "fire_explosion"],
    questions: [
      { id: "q1", label: "Have you confirmed the required fire rating and system for the fire-rated partition installation?" },
      { id: "q2", label: "Are you using the correct fire-rated boards and fixings specified for the fire-rated partition installation?" },
      { id: "q3", label: "Will all joints, deflection heads and penetrations in the fire-rated partition installation be sealed with approved fire products?" },
      { id: "q4", label: "Is hot work needed near the fire-rated partition installation, and if so, is a permit in place?" },
      { id: "q5", label: "Have you checked that any services routed through the fire-rated partition installation maintain the fire integrity?" }
    ]
  },

  "Shaftwall / riser wall installation": {
    desc: "Shaftwall / riser wall installation involves constructing fire and acoustic rated walls around lift shafts, risers and vertical service routes. Work is often carried out from one side only using proprietary shaftwall systems. Access may be restricted and work can be at height around openings and voids. Particular care is taken with edge protection, fixing into structure and sealing any service penetrations.",
    hazards: ["work_at_height", "falling_objects", "manual_handling", "dust_fumes", "confined_space"],
    questions: [
      { id: "q1", label: "Have you assessed edge protection and fall prevention around openings for the shaftwall / riser wall installation?" },
      { id: "q2", label: "Are you following the specific manufacturer sequence for the shaftwall / riser wall installation?" },
      { id: "q3", label: "Is access into risers or shafts for the shaftwall / riser wall installation controlled and authorised?" },
      { id: "q4", label: "Will all service penetrations in the shaftwall / riser wall installation be sealed with approved fire-stopping materials?" },
      { id: "q5", label: "Have you arranged safe material handling routes for boards and studs used in the shaftwall / riser wall installation?" }
    ]
  },

  "Curved partition installation": {
    desc: "Curved partition installation involves forming non-linear walls using flexible studs, track systems or segmented board techniques. The task requires accurate setting out to achieve the required radius and smooth final finish. Additional care is needed when cutting and fixing boards to avoid cracking and weak spots. Coordination with finishes and door positions is essential.",
    hazards: ["manual_handling", "dust_fumes", "sharp_objects", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you set out the radius and centre points accurately for the curved partition installation?" },
      { id: "q2", label: "Are you using suitable flexible track or methods for achieving the curve in the curved partition installation?" },
      { id: "q3", label: "Is cutting of boards for the curved partition installation planned to minimise waste and awkward offcuts?" },
      { id: "q4", label: "Are walkways kept clear of offcuts and tools during the curved partition installation?" },
      { id: "q5", label: "Have you confirmed with the client any door or opening locations within the curved partition installation?" }
    ]
  },

  "Demountable office partition installation": {
    desc: "Demountable office partition installation uses proprietary glazed or solid panel systems to create office layouts which can later be altered. Work includes setting out, fixing head and floor tracks, installing panels, doors and glazing, and fitting trims and seals. The environment is often live with occupants and existing finishes. Noise, dust and access need to be carefully controlled.",
    hazards: ["manual_handling", "glass_sharps", "public_interface", "slips_trips"],
    questions: [
      { id: "q1", label: "Has the layout for the demountable office partition installation been agreed and marked out on site?" },
      { id: "q2", label: "Are you using appropriate handling methods and PPE for glass panels during the demountable office partition installation?" },
      { id: "q3", label: "Is noise and dust from the demountable office partition installation being controlled in a live office environment?" },
      { id: "q4", label: "Are access routes for staff kept clear during the demountable office partition installation?" },
      { id: "q5", label: "Will fire and acoustic seals be correctly installed around doors and junctions in the demountable office partition installation?" }
    ]
  },

  "Stud wall door set installation": {
    desc: "Stud wall door set installation involves forming openings in stud partitions and installing pre-hung door sets or frames and leaves. The work includes checking structural support around openings, fixing frames plumb and level, and adjusting ironmongery for correct operation. Care is taken to protect finished doors and frames from damage. Fire and acoustic performance must be maintained where applicable.",
    hazards: ["manual_handling", "sharp_objects", "slips_trips"],
    questions: [
      { id: "q1", label: "Has the opening size for the stud wall door set installation been checked against the door set?" },
      { id: "q2", label: "Is the surrounding studwork for the stud wall door set installation adequately framed and fixed?" },
      { id: "q3", label: "Will the door set be protected from impact and damage once the stud wall door set installation is complete?" },
      { id: "q4", label: "Are you maintaining any required fire or acoustic seals as part of the stud wall door set installation?" },
      { id: "q5", label: "Have you checked that floor finishes and thresholds align with the stud wall door set installation?" }
    ]
  },

  "Plasterboard lining to masonry walls": {
    desc: "Plasterboard lining to masonry walls involves fixing boards directly or on battens/metal systems to provide a smooth internal surface. The task may include installing insulation, vapour barriers and noggins for fixings. Fixings must be suitable for the substrate and spaced correctly to avoid board movement. Joints are prepared for tape and jointing or skim plaster finishes.",
    hazards: ["manual_handling", "dust_fumes", "silica_dust", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you checked the masonry substrate is suitable and sound for the plasterboard lining to masonry walls?" },
      { id: "q2", label: "Will any damp or structural issues be addressed before starting the plasterboard lining to masonry walls?" },
      { id: "q3", label: "Are fixings and adhesive for the plasterboard lining to masonry walls appropriate for the wall type?" },
      { id: "q4", label: "Is there a clear plan for installing any insulation behind the plasterboard lining to masonry walls?" },
      { id: "q5", label: "Are work areas kept free of debris and offcuts during the plasterboard lining to masonry walls?" }
    ]
  },

  "Dot and dab plasterboard to blockwork": {
    desc: "Dot and dab plasterboard to blockwork involves fixing boards to masonry using adhesive dabs rather than mechanical fixings. Boards are aligned plumb and level while maintaining adhesive coverage and cavity requirements. Openings, sockets and corners are carefully detailed. The finished surface is prepared for skim plaster or tape and jointing.",
    hazards: ["manual_handling", "dust_fumes", "silica_dust", "cement"],
    questions: [
      { id: "q1", label: "Is the blockwork clean, sound and reasonably flat before starting the dot and dab plasterboard to blockwork?" },
      { id: "q2", label: "Are you using the correct adhesive and mixing methods for the dot and dab plasterboard to blockwork?" },
      { id: "q3", label: "Will you maintain sufficient coverage and dab pattern for the dot and dab plasterboard to blockwork as per guidance?" },
      { id: "q4", label: "Have you allowed for any service runs or insulation behind the dot and dab plasterboard to blockwork?" },
      { id: "q5", label: "Are safe manual handling techniques used when lifting boards during the dot and dab plasterboard to blockwork?" }
    ]
  },

  "MF ceiling installation": {
    desc: "MF ceiling installation uses metal furring components suspended from the structure to create a level framework for plasterboard ceilings. The work includes setting out hangers, primary and secondary channels, and fixing boards with appropriate screws. Ceiling levels, deflection allowances and service coordination are critical. Access equipment and safe working at height controls are essential.",
    hazards: ["work_at_height", "manual_handling", "dust_fumes", "silica_dust", "scaffold_safety"],
    questions: [
      { id: "q1", label: "Have you confirmed fixing centres and suspension points for the MF ceiling installation with reference to the drawings?" },
      { id: "q2", label: "Is suitable access equipment available and inspected before starting the MF ceiling installation?" },
      { id: "q3", label: "Are hangers and fixings for the MF ceiling installation suitable for the soffit or structure being fixed to?" },
      { id: "q4", label: "Will dust from cutting boards during the MF ceiling installation be controlled with extraction or masks?" },
      { id: "q5", label: "Have you planned sequencing with other trades to avoid clashes above and below the MF ceiling installation?" }
    ]
  },

  "Suspended lay-in grid ceiling installation": {
    desc: "Suspended lay-in grid ceiling installation involves fixing a metal grid suspended from the structure and inserting ceiling tiles or panels. The task includes setting out, levelling main runners and cross tees, and cutting tiles around perimeters and services. Work is often carried out in live environments where access control is important. Finished ceilings must remain level and free of damage.",
    hazards: ["work_at_height", "manual_handling", "slips_trips", "plant_machinery"],
    questions: [
      { id: "q1", label: "Has the ceiling height and layout been agreed before starting the suspended lay-in grid ceiling installation?" },
      { id: "q2", label: "Is access equipment for the suspended lay-in grid ceiling installation in good condition and suitable for the floor type?" },
      { id: "q3", label: "Are you coordinating the suspended lay-in grid ceiling installation with M&E services and sprinkler layouts?" },
      { id: "q4", label: "Will offcuts and packaging from the suspended lay-in grid ceiling installation be cleared regularly to reduce trip hazards?" },
      { id: "q5", label: "Have you planned how to protect completed areas of the suspended lay-in grid ceiling installation from damage by others?" }
    ]
  },

  "Plasterboard MF ceiling with access hatches": {
    desc: "Plasterboard MF ceiling with access hatches combines MF framing with board linings and integrated access points for services. Work includes framing, boarding, forming openings and fitting proprietary access panels. Particular attention is given to fire and acoustic performance around hatches. The finished ceiling must be level, with neat joints ready for finishing.",
    hazards: ["work_at_height", "manual_handling", "dust_fumes", "silica_dust"],
    questions: [
      { id: "q1", label: "Have the locations and sizes of access panels been agreed before starting the plasterboard MF ceiling with access hatches?" },
      { id: "q2", label: "Are you using the correct framing and support details around openings in the plasterboard MF ceiling with access hatches?" },
      { id: "q3", label: "Will any fire or acoustic performance be maintained where the plasterboard MF ceiling with access hatches is installed?" },
      { id: "q4", label: "Is safe access available for all areas of the plasterboard MF ceiling with access hatches?" },
      { id: "q5", label: "Have you coordinated with services to avoid clashes with the plasterboard MF ceiling with access hatches?" }
    ]
  },

  "Bulkhead and downstand construction": {
    desc: "Bulkhead and downstand construction involves forming dropped sections of ceiling or wall to conceal services or create architectural features. The work may combine stud partitions, MF framing and board linings. Setting out lines, levels and junctions is critical for a neat finish. These elements are often at height and may require complex access.",
    hazards: ["work_at_height", "manual_handling", "dust_fumes", "sharp_objects"],
    questions: [
      { id: "q1", label: "Have you set out the positions and dimensions needed for the bulkhead and downstand construction?" },
      { id: "q2", label: "Is the bulkhead and downstand construction coordinated with ductwork, pipework and lighting layouts?" },
      { id: "q3", label: "Are suitable fixings being used to support the bulkhead and downstand construction from the structure?" },
      { id: "q4", label: "Is there safe access for the full length of the bulkhead and downstand construction works?" },
      { id: "q5", label: "Have you planned how to finish and joint the bulkhead and downstand construction into adjacent ceilings and walls?" }
    ]
  },

  "Raft / feature ceiling installation": {
    desc: "Raft / feature ceiling installation involves hanging independent decorative ceiling elements below the main structure or ceiling. The work includes setting out, installing hangers or wires, and fixing panels or rafts level and secure. These ceilings often incorporate acoustic materials and integrated lighting. Installation must consider visual alignment and future access for maintenance.",
    hazards: ["work_at_height", "manual_handling", "falling_objects", "plant_machinery"],
    questions: [
      { id: "q1", label: "Have you confirmed loadings and fixing details for the raft / feature ceiling installation with the manufacturer?" },
      { id: "q2", label: "Is access equipment suitable for the height and location of the raft / feature ceiling installation?" },
      { id: "q3", label: "Will all fixings used in the raft / feature ceiling installation be tested or checked before loading panels?" },
      { id: "q4", label: "Are exclusion zones set up below the raft / feature ceiling installation while working overhead?" },
      { id: "q5", label: "Have you coordinated the raft / feature ceiling installation with lighting and sprinkler layouts?" }
    ]
  },

  "Ceiling access hatch installation": {
    desc: "Ceiling access hatch installation provides removable panels within ceilings for access to services, valves and equipment. The task involves cutting openings, installing proprietary frames and doors, and making good surrounding finishes. Fire and acoustic performance must often be maintained. Safe working at height applies for both installation and future use.",
    hazards: ["work_at_height", "manual_handling", "dust_fumes", "sharp_objects"],
    questions: [
      { id: "q1", label: "Have hatch locations been agreed with the client before ceiling access hatch installation starts?" },
      { id: "q2", label: "Is the ceiling structure suitable for forming openings for the ceiling access hatch installation?" },
      { id: "q3", label: "Will you maintain any fire or acoustic rating around the ceiling access hatch installation?" },
      { id: "q4", label: "Are cut edges and offcuts controlled to prevent injury during the ceiling access hatch installation?" },
      { id: "q5", label: "Have you allowed sufficient clear opening for maintenance activities once the ceiling access hatch installation is complete?" }
    ]
  },

  "Ceiling tile replacement / repairs": {
    desc: "Ceiling tile replacement / repairs consists of removing damaged tiles and fitting new ones within existing suspended ceiling grids. The work may be carried out in live, occupied areas with furniture and equipment present. Care is taken to avoid disturbing services above the ceiling and to prevent debris falling on occupants. Replaced tiles must match fire and acoustic performance where required.",
    hazards: ["work_at_height", "slips_trips", "public_interface", "falling_objects"],
    questions: [
      { id: "q1", label: "Have you cordoned off the work area for the ceiling tile replacement / repairs to protect occupants?" },
      { id: "q2", label: "Is access equipment suitable and stable for the ceiling tile replacement / repairs task?" },
      { id: "q3", label: "Will you check for any displaced services or cables when carrying out the ceiling tile replacement / repairs?" },
      { id: "q4", label: "Are replacement tiles for the ceiling tile replacement / repairs compatible with existing fire and acoustic requirements?" },
      { id: "q5", label: "Will you clear all debris and packaging after completing the ceiling tile replacement / repairs?" }
    ]
  },

  "Plasterboard jointing and taping": {
    desc: "Plasterboard jointing and taping involves applying joint tape and compound over board joints, screw heads and corners to create a smooth, finished surface. The work is often carried out on walls and ceilings using steps or stilts. Sanding of dried compound can generate fine dust. The final result is ready to receive paint or other finishes.",
    hazards: ["dust_fumes", "silica_dust", "work_at_height", "slips_trips"],
    questions: [
      { id: "q1", label: "Is adequate ventilation available for the plasterboard jointing and taping area, especially during sanding?" },
      { id: "q2", label: "Are you using suitable respiratory and eye protection during plasterboard jointing and taping?" },
      { id: "q3", label: "Is access equipment such as steps or stilts for plasterboard jointing and taping inspected and used correctly?" },
      { id: "q4", label: "Will floors be kept clear of tools and mixing buckets during plasterboard jointing and taping?" },
      { id: "q5", label: "Have you planned drying times and sequencing for the plasterboard jointing and taping to avoid rework?" }
    ]
  },

  "Skim coat plaster to plasterboard": {
    desc: "Skim coat plaster to plasterboard involves applying a thin coat of finishing plaster to provide a smooth, paint-ready surface. Work includes mixing plaster, trowelling onto walls or ceilings and polishing before set. It can involve extended periods at height on steps or platforms. Moisture, ventilation and temperature must be controlled for proper curing.",
    hazards: ["manual_handling", "work_at_height", "damp_proofing", "slips_trips"],
    questions: [
      { id: "q1", label: "Is the substrate prepared and sealed appropriately before applying skim coat plaster to plasterboard?" },
      { id: "q2", label: "Are you using suitable access equipment for ceiling areas during skim coat plaster to plasterboard work?" },
      { id: "q3", label: "Will mixing and carrying plaster for the skim coat plaster to plasterboard be managed to reduce strain?" },
      { id: "q4", label: "Are floors protected and kept clear of spills during the skim coat plaster to plasterboard?" },
      { id: "q5", label: "Have you considered room temperature and ventilation for proper curing of the skim coat plaster to plasterboard?" }
    ]
  },

  "Drylining to stair cores and landings": {
    desc: "Drylining to stair cores and landings involves installing boards to walls and soffits around staircases, often in restricted spaces and at multiple levels. Work at height over voids is common and may require bespoke access solutions. Fire and escape route requirements are critical. Edges, openings and temporary protection must be carefully managed.",
    hazards: ["work_at_height", "falling_objects", "manual_handling", "slips_trips", "scaffold_safety"],
    questions: [
      { id: "q1", label: "Have you agreed an access and edge protection plan for the drylining to stair cores and landings?" },
      { id: "q2", label: "Is the stairwell protected from falling materials during the drylining to stair cores and landings?" },
      { id: "q3", label: "Are escape routes maintained and kept free from obstruction while drylining to stair cores and landings?" },
      { id: "q4", label: "Will manual handling of boards be planned to suit the restricted spaces for drylining to stair cores and landings?" },
      { id: "q5", label: "Have you checked fire and smoke seal details for the drylining to stair cores and landings?" }
    ]
  },

  "Drylining to corridor walls and soffits": {
    desc: "Drylining to corridor walls and soffits covers long, narrow circulation areas often used as fire escape routes. Work includes installing boards, framing and soffit details while maintaining clear routes. Coordination with services, doors and fire protection is essential. Sequencing is important to minimise disruption to other trades.",
    hazards: ["manual_handling", "slips_trips", "work_at_height", "dust_fumes"],
    questions: [
      { id: "q1", label: "Will escape routes remain usable during the drylining to corridor walls and soffits?" },
      { id: "q2", label: "Is access equipment suitable for the restricted widths involved in drylining to corridor walls and soffits?" },
      { id: "q3", label: "Are services and door frames coordinated before starting drylining to corridor walls and soffits?" },
      { id: "q4", label: "Will dust from cutting and sanding during drylining to corridor walls and soffits be controlled?" },
      { id: "q5", label: "Are materials stored safely without blocking access during drylining to corridor walls and soffits?" }
    ]
  },

  "Insulated plasterboard lining to external walls": {
    desc: "Insulated plasterboard lining to external walls combines insulation and board in a single panel to improve thermal performance. The work includes checking for damp, fixing or adhesive application, and sealing joints to reduce cold bridging. Window reveals and junctions require careful detailing. Fixings must be suitable for the substrate and insulation thickness.",
    hazards: ["manual_handling", "dust_fumes", "silica_dust", "cement"],
    questions: [
      { id: "q1", label: "Have you checked for damp or condensation issues before installing insulated plasterboard lining to external walls?" },
      { id: "q2", label: "Is the correct insulation thickness and board type being used for the insulated plasterboard lining to external walls?" },
      { id: "q3", label: "Will you seal around windows and penetrations when installing insulated plasterboard lining to external walls?" },
      { id: "q4", label: "Are suitable fixings or adhesive methods used for insulated plasterboard lining to external walls?" },
      { id: "q5", label: "Is manual handling of the heavier boards for insulated plasterboard lining to external walls properly planned?" }
    ]
  },

  "Metal furring ceiling to concrete soffit": {
    desc: "Metal furring ceiling to concrete soffit involves fixing channels and hangers onto concrete to level and support plasterboard ceilings. Work is typically overhead and requires drilling, fixing and boarding. Proper anchoring into concrete is essential for safety. The finished ceiling often forms part of fire or acoustic separation.",
    hazards: ["work_at_height", "manual_handling", "dust_fumes", "silica_dust", "falling_objects"],
    questions: [
      { id: "q1", label: "Are approved anchors being used for the metal furring ceiling to concrete soffit?" },
      { id: "q2", label: "Is drilling into the soffit for the metal furring ceiling to concrete soffit checked against services above?" },
      { id: "q3", label: "Is access equipment suitable for continuous overhead work during the metal furring ceiling to concrete soffit?" },
      { id: "q4", label: "Will you control dust and debris when fixing the metal furring ceiling to concrete soffit?" },
      { id: "q5", label: "Have you confirmed any fire or acoustic requirements for the metal furring ceiling to concrete soffit?" }
    ]
  },

  "SFS infill panel installation": {
    desc: "SFS infill panel installation utilises light gauge steel framing to form external wall infill between primary structure elements. Work is often carried out at height from scaffolds or MEWPs. Studs, rails and bracing are installed to engineer's design, followed by sheathing boards and membranes. Accurate fixing and alignment are critical for cladding and drylining that follow.",
    hazards: ["work_at_height", "manual_handling", "scaffold_safety", "plant_machinery", "environmental_weather"],
    questions: [
      { id: "q1", label: "Have you reviewed engineer's drawings for the SFS infill panel installation before starting?" },
      { id: "q2", label: "Is scaffold or MEWP access for the SFS infill panel installation inspected and suitable for the façade?" },
      { id: "q3", label: "Are all fixings and brackets for the SFS infill panel installation correct and available on site?" },
      { id: "q4", label: "Will weather conditions be monitored during the SFS infill panel installation, especially at height?" },
      { id: "q5", label: "Have you planned safe lifting and handling of long studs and rails for the SFS infill panel installation?" }
    ]
  },

  "Deflection head detail installation": {
    desc: "Deflection head detail installation involves forming partition head details that allow for structural movement while maintaining fire and acoustic performance. Work includes fitting head track, deflection channels and sealing systems at the top of partitions. This is typically carried out at height along slab edges or beams. Correct sequencing with drylining and fire stopping is important.",
    hazards: ["work_at_height", "manual_handling", "dust_fumes", "falling_objects"],
    questions: [
      { id: "q1", label: "Have you checked the required movement allowance for the deflection head detail installation?" },
      { id: "q2", label: "Is access safe and continuous along the run for the deflection head detail installation?" },
      { id: "q3", label: "Will fire and acoustic seals be maintained at the deflection head detail installation?" },
      { id: "q4", label: "Are cut metal sections from the deflection head detail installation kept secure and cleared promptly?" },
      { id: "q5", label: "Have you coordinated the deflection head detail installation with services passing near the slab head?" }
    ]
  },

  "Fire stopping to partitions and ceilings": {
    desc: "Fire stopping to partitions and ceilings includes sealing around services, joints and gaps using fire-rated products to maintain compartmentation. Work often involves moving above ceilings, within risers and around penetrations. Only tested systems and approved products are used. Documentation of locations and materials is important for compliance.",
    hazards: ["work_at_height", "dust_fumes", "chemical_coshh", "confined_space"],
    questions: [
      { id: "q1", label: "Are approved fire stopping systems specified for the fire stopping to partitions and ceilings?" },
      { id: "q2", label: "Is access safe to all areas where fire stopping to partitions and ceilings is required?" },
      { id: "q3", label: "Are COSHH assessments in place for any sealants or compounds used in the fire stopping to partitions and ceilings?" },
      { id: "q4", label: "Will all fire stopping to partitions and ceilings be photographed and logged for records?" },
      { id: "q5", label: "Have you checked that services will not be altered after completing the fire stopping to partitions and ceilings?" }
    ]
  },

  "Acoustic sealant and mastic works": {
    desc: "Acoustic sealant and mastic works provide airtight and acoustic seals at perimeters, junctions and service penetrations. The task involves applying sealants neatly to specified gaps and joints. It is often carried out as a finishing activity around drylined partitions and ceilings. Correct product selection and application are essential for performance.",
    hazards: ["chemical_coshh", "manual_handling", "slips_trips"],
    questions: [
      { id: "q1", label: "Are the correct products specified for the acoustic sealant and mastic works?" },
      { id: "q2", label: "Have COSHH requirements been reviewed for materials used in the acoustic sealant and mastic works?" },
      { id: "q3", label: "Is access safe and clear for the lengths involved in the acoustic sealant and mastic works?" },
      { id: "q4", label: "Will waste cartridges and wipes from the acoustic sealant and mastic works be disposed of correctly?" },
      { id: "q5", label: "Have you checked that all required junctions and gaps are included in the scope of the acoustic sealant and mastic works?" }
    ]
  },

  "Boarding out loft spaces": {
    desc: "Boarding out loft spaces involves installing boards over joists or rafters to provide a usable storage deck or access platform. Work is often carried out in confined, dusty spaces with limited headroom. Care must be taken to avoid stepping on weak ceilings or un-supported areas. Existing insulation and services must be protected.",
    hazards: ["work_at_height", "confined_space", "dust_fumes", "manual_handling", "slips_trips"],
    questions: [
      { id: "q1", label: "Is the access and lighting adequate before starting the boarding out loft spaces?" },
      { id: "q2", label: "Have you identified safe zones to step on while boarding out loft spaces?" },
      { id: "q3", label: "Are you protecting existing insulation and services during the boarding out loft spaces?" },
      { id: "q4", label: "Is dust control and ventilation considered when boarding out loft spaces?" },
      { id: "q5", label: "Have you planned safe material handling routes when boarding out loft spaces?" }
    ]
  },

  "Over-boarding existing ceilings": {
    desc: "Over-boarding existing ceilings involves fixing new boards over existing ceiling linings to improve appearance or performance. Work is overhead and can involve working around existing fittings and services. The existing ceiling must be assessed for condition and fixings must be adequate. Joints and perimeters are prepared for finishing.",
    hazards: ["work_at_height", "manual_handling", "dust_fumes", "silica_dust"],
    questions: [
      { id: "q1", label: "Has the existing surface been checked for suitability before over-boarding existing ceilings?" },
      { id: "q2", label: "Is access equipment suitable and stable for the over-boarding existing ceilings task?" },
      { id: "q3", label: "Will lights and services be isolated or protected during over-boarding existing ceilings?" },
      { id: "q4", label: "Are adequate fixings and patterns planned for over-boarding existing ceilings?" },
      { id: "q5", label: "Is dust likely during over-boarding existing ceilings and have controls been arranged?" }
    ]
  },

  "Removal of existing suspended ceilings": {
    desc: "Removal of existing suspended ceilings includes taking down tiles, grid and hangers, and managing waste safely. The work often reveals services, debris and dust above the ceiling. Exclusion zones below the work area are required to protect others. Waste must be segregated and removed promptly.",
    hazards: ["work_at_height", "falling_objects", "dust_fumes", "manual_handling", "public_interface"],
    questions: [
      { id: "q1", label: "Have you set up barriers and signage before starting the removal of existing suspended ceilings?" },
      { id: "q2", label: "Is access equipment suitable for the removal of existing suspended ceilings?" },
      { id: "q3", label: "Will you check for live services or hazards above the ceiling before removal of existing suspended ceilings?" },
      { id: "q4", label: "Are waste skips or containers available close to the removal of existing suspended ceilings area?" },
      { id: "q5", label: "Will dust be controlled during the removal of existing suspended ceilings, especially in occupied buildings?" }
    ]
  },

  "Removal of existing plasterboard partitions": {
    desc: "Removal of existing plasterboard partitions involves stripping out boards, studs and related trims back to structure. Work may expose hidden services, asbestos-containing materials or sharp edges. Noise and dust control are important, particularly in occupied buildings. Materials must be segregated and removed safely.",
    hazards: ["dust_fumes", "manual_handling", "sharp_objects", "asbestos", "noise_vibration"],
    questions: [
      { id: "q1", label: "Have you checked for possible asbestos before the removal of existing plasterboard partitions?" },
      { id: "q2", label: "Is isolation of electrical and other services arranged before the removal of existing plasterboard partitions?" },
      { id: "q3", label: "Will dust and noise be controlled during the removal of existing plasterboard partitions?" },
      { id: "q4", label: "Are you using safe methods and PPE to manage sharp edges in the removal of existing plasterboard partitions?" },
      { id: "q5", label: "Have you planned waste handling and routes for the removal of existing plasterboard partitions?" }
    ]
  },

  "Patch repairs to partitions and ceilings": {
    desc: "Patch repairs to partitions and ceilings involve cutting out damaged areas and installing new sections of board, followed by jointing or plastering. Work may be local but can involve overhead tasks and dust. Matching existing finishes and performance is important. The work is often carried out in live, finished environments.",
    hazards: ["dust_fumes", "sharp_objects", "work_at_height", "slips_trips"],
    questions: [
      { id: "q1", label: "Is the area around the patch repairs to partitions and ceilings protected from dust and debris?" },
      { id: "q2", label: "Are services checked before cutting during patch repairs to partitions and ceilings?" },
      { id: "q3", label: "Is access equipment suitable for overhead patch repairs to partitions and ceilings?" },
      { id: "q4", label: "Will you match fire and acoustic performance where patch repairs to partitions and ceilings are carried out?" },
      { id: "q5", label: "Are offcuts and waste cleared promptly during patch repairs to partitions and ceilings?" }
    ]
  },

  "Installation of pattresses and noggins": {
    desc: "Installation of pattresses and noggins provides local strengthening within stud walls and ceilings to support fixtures, fittings and equipment. Work may involve opening up linings or installing supports before boarding. Accurate positioning is required to align with future fixings. Work is often done at height or within confined wall voids.",
    hazards: ["work_at_height", "manual_handling", "sharp_objects", "dust_fumes"],
    questions: [
      { id: "q1", label: "Have you confirmed locations for the installation of pattresses and noggins against drawings or client requirements?" },
      { id: "q2", label: "Are you using suitable timber or board for the installation of pattresses and noggins?" },
      { id: "q3", label: "Is access safe for ceiling-level installation of pattresses and noggins?" },
      { id: "q4", label: "Will you ensure fixings for the installation of pattresses and noggins are adequate for the intended loads?" },
      { id: "q5", label: "Have you considered future access before closing up linings after the installation of pattresses and noggins?" }
    ]
  },

  "Service bulkhead boxing-in": {
    desc: "Service bulkhead boxing-in involves constructing enclosures around pipes, ducts and cables using framing and board linings. Work often occurs in corridors, plant rooms and washrooms. Access to valves and joints must be maintained. Lines, levels and junctions with existing finishes are carefully managed.",
    hazards: ["manual_handling", "dust_fumes", "work_at_height", "sharp_objects"],
    questions: [
      { id: "q1", label: "Have you agreed routes and dimensions before starting the service bulkhead boxing-in?" },
      { id: "q2", label: "Are access panels allowed for key valves or joints within the service bulkhead boxing-in?" },
      { id: "q3", label: "Is dust and noise from the service bulkhead boxing-in controlled in occupied areas?" },
      { id: "q4", label: "Are you using suitable fixings for substrates involved in the service bulkhead boxing-in?" },
      { id: "q5", label: "Have you checked that fire and acoustic separations are maintained within the service bulkhead boxing-in?" }
    ]
  },

  "Hatch and access panel framing": {
    desc: "Hatch and access panel framing provides structural support around openings for access panels in walls and ceilings. Work includes installing additional studs, noggins or channels and ensuring clearances match manufacturer requirements. This is often carried out before boarding or during remedial work. Correct framing is essential for long-term performance and safe access.",
    hazards: ["work_at_height", "manual_handling", "sharp_objects", "dust_fumes"],
    questions: [
      { id: "q1", label: "Have you confirmed panel sizes and types before hatch and access panel framing begins?" },
      { id: "q2", label: "Is hatch and access panel framing installed in line with manufacturer guidance for loading?" },
      { id: "q3", label: "Is access safe at ceiling level for hatch and access panel framing?" },
      { id: "q4", label: "Will fire and acoustic requirements still be met after hatch and access panel framing is completed?" },
      { id: "q5", label: "Are all cut metal and timber pieces from hatch and access panel framing disposed of safely?" }
    ]
  },

  "Ceiling grid alterations for new services": {
    desc: "Ceiling grid alterations for new services involve adjusting existing suspended ceiling grids to accommodate additional ducts, lights or sprinklers. Work may require cutting and reinforcing grid members and re-routing hangers. Care is taken not to overload or destabilise the existing ceiling. Coordination with M&E trades is essential.",
    hazards: ["work_at_height", "falling_objects", "manual_handling", "public_interface"],
    questions: [
      { id: "q1", label: "Have you agreed the extent of ceiling grid alterations for new services with the M&E trades?" },
      { id: "q2", label: "Is access controlled and safe underneath while ceiling grid alterations for new services are in progress?" },
      { id: "q3", label: "Will any modified grid be re-supported correctly during ceiling grid alterations for new services?" },
      { id: "q4", label: "Are all removed tiles and fittings accounted for during ceiling grid alterations for new services?" },
      { id: "q5", label: "Have you confirmed final layout drawings after completing ceiling grid alterations for new services?" }
    ]
  },

  "Smoke barrier / baffle installation above ceilings": {
    desc: "Smoke barrier / baffle installation above ceilings involves fitting fire or smoke curtains and barriers in concealed spaces to control smoke movement. Work is undertaken above ceiling level, often in cramped, dusty conditions. Barriers are fixed to structure and coordinated around services. Fire integrity and continuity are critical.",
    hazards: ["work_at_height", "dust_fumes", "confined_space", "falling_objects"],
    questions: [
      { id: "q1", label: "Is access above ceilings adequate before starting smoke barrier / baffle installation above ceilings?" },
      { id: "q2", label: "Are specified products being used for the smoke barrier / baffle installation above ceilings?" },
      { id: "q3", label: "Will all gaps at junctions and penetrations be sealed during the smoke barrier / baffle installation above ceilings?" },
      { id: "q4", label: "Are you controlling dust and debris during smoke barrier / baffle installation above ceilings?" },
      { id: "q5", label: "Have you checked compatibility with sprinkler and detection systems during smoke barrier / baffle installation above ceilings?" }
    ]
  },

  "Fire rated ceiling installation": {
    desc: "Fire rated ceiling installation involves constructing ceilings using tested systems to provide a specific fire resistance. Work includes installing framing, fire-rated boards, fixings and joint treatments. Penetrations and access panels must be fire rated and sealed. Strict adherence to system details is essential for certification.",
    hazards: ["work_at_height", "manual_handling", "dust_fumes", "fire_explosion"],
    questions: [
      { id: "q1", label: "Have you confirmed the required fire rating for the fire rated ceiling installation?" },
      { id: "q2", label: "Are correct fire-rated boards and fixings available for the fire rated ceiling installation?" },
      { id: "q3", label: "Will all penetrations and access panels be compatible with the fire rated ceiling installation system?" },
      { id: "q4", label: "Is access safe for all areas involved in the fire rated ceiling installation?" },
      { id: "q5", label: "Have you planned inspection and documentation for the fire rated ceiling installation?" }
    ]
  },

  "Acoustic ceiling installation": {
    desc: "Acoustic ceiling installation uses perforated boards, acoustic tiles or rafts to control reverberation and noise. Work includes installing supporting systems, infill materials and edge trims. Attention is paid to detailing around services and perimeters. The completed system must meet acoustic design criteria.",
    hazards: ["work_at_height", "manual_handling", "dust_fumes", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you confirmed the acoustic performance requirements for the acoustic ceiling installation?" },
      { id: "q2", label: "Are specified acoustic tiles or panels on site and protected before acoustic ceiling installation?" },
      { id: "q3", label: "Is access equipment suitable for the acoustic ceiling installation areas?" },
      { id: "q4", label: "Will you maintain a clean environment to protect finishes during the acoustic ceiling installation?" },
      { id: "q5", label: "Have you coordinated acoustic ceiling installation details with lighting and ventilation layouts?" }
    ]
  },

  "Clean room / hygienic ceiling installation": {
    desc: "Clean room / hygienic ceiling installation involves fitting specialised ceiling systems designed for controlled environments such as labs, food production or healthcare. Work includes installing sealed panels, cleanable surfaces and integrated services. Strict cleanliness, PPE and handling procedures are followed. Any damage or gaps can compromise the environment.",
    hazards: ["work_at_height", "chemical_coshh", "public_interface", "manual_handling"],
    questions: [
      { id: "q1", label: "Are clean room protocols understood before starting the clean room / hygienic ceiling installation?" },
      { id: "q2", label: "Are all components for the clean room / hygienic ceiling installation stored clean and protected?" },
      { id: "q3", label: "Is access and PPE suitable for the controlled environment during the clean room / hygienic ceiling installation?" },
      { id: "q4", label: "Will all joints and penetrations be sealed correctly in the clean room / hygienic ceiling installation?" },
      { id: "q5", label: "Have you planned cleaning and inspection after the clean room / hygienic ceiling installation?" }
    ]
  },

  "Washroom / wet area board installation": {
    desc: "Washroom / wet area board installation uses moisture-resistant or cement-based boards in areas exposed to water such as showers and changing rooms. Work includes fixing boards, sealing joints and detailing around trays, baths and fixtures. Correct product selection is critical to prevent failure. The system must be compatible with tanking and tile finishes.",
    hazards: ["manual_handling", "water_ingress", "dust_fumes", "chemical_coshh"],
    questions: [
      { id: "q1", label: "Are appropriate moisture-resistant boards specified for the washroom / wet area board installation?" },
      { id: "q2", label: "Will you protect adjacent areas from water and debris during the washroom / wet area board installation?" },
      { id: "q3", label: "Are jointing and sealing materials for the washroom / wet area board installation compatible with tanking systems?" },
      { id: "q4", label: "Is manual handling of heavy boards for the washroom / wet area board installation properly planned?" },
      { id: "q5", label: "Have you coordinated with plumbers and tilers for sequencing the washroom / wet area board installation?" }
    ]
  },

  "High bay / atrium ceiling works via tower or MEWP": {
    desc: "High bay / atrium ceiling works via tower or MEWP involve installing or repairing ceilings at significant height, often over open spaces. Work includes access planning, edge protection and careful movement of materials at height. MEWP or tower inspections and operator competence are critical. Exclusion zones below the work are enforced.",
    hazards: ["work_at_height", "scaffold_safety", "plant_machinery", "falling_objects"],
    questions: [
      { id: "q1", label: "Has a full access plan been agreed for the high bay / atrium ceiling works via tower or MEWP?" },
      { id: "q2", label: "Are MEWP operators for the high bay / atrium ceiling works via tower or MEWP trained and authorised?" },
      { id: "q3", label: "Are exclusion zones below the high bay / atrium ceiling works via tower or MEWP clearly marked?" },
      { id: "q4", label: "Have weather and wind conditions been considered for the high bay / atrium ceiling works via tower or MEWP?" },
      { id: "q5", label: "Will tools and materials be secured at height during the high bay / atrium ceiling works via tower or MEWP?" }
    ]
  },

  "Ceiling works in live office environment": {
    desc: "Ceiling works in live office environment involves installing, altering or repairing ceilings while staff and equipment remain in place. Noise, dust and access are tightly controlled. Work may be carried out out-of-hours or in phases. Protection of furniture, IT and occupants is a priority.",
    hazards: ["public_interface", "work_at_height", "dust_fumes", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you agreed working hours and noisy periods for ceiling works in live office environment?" },
      { id: "q2", label: "Is adequate protection in place over desks and equipment for ceiling works in live office environment?" },
      { id: "q3", label: "Are you controlling dust effectively during ceiling works in live office environment?" },
      { id: "q4", label: "Are routes for staff clearly maintained during ceiling works in live office environment?" },
      { id: "q5", label: "Will all work areas be cleaned and made safe at the end of each shift during ceiling works in live office environment?" }
    ]
  },

  "Night shift ceiling works in occupied building": {
    desc: "Night shift ceiling works in occupied building involve undertaking ceiling activities outside normal hours to reduce disruption. Work is carried out under artificial lighting with reduced supervision and support services. Security, noise control and lone working must be considered. The building must be left secure and safe for daytime use.",
    hazards: ["work_at_height", "poor_lighting", "lone_working", "security_risk"],
    questions: [
      { id: "q1", label: "Is there a clear permit or instruction for night shift ceiling works in occupied building?" },
      { id: "q2", label: "Are arrangements in place to manage lone working during night shift ceiling works in occupied building?" },
      { id: "q3", label: "Is lighting adequate and safe for all areas of night shift ceiling works in occupied building?" },
      { id: "q4", label: "Will noise be controlled to avoid disturbing occupants during night shift ceiling works in occupied building?" },
      { id: "q5", label: "Have you confirmed how the building will be secured after night shift ceiling works in occupied building?" }
    ]
  },

  "Drylining works in residential refurb (occupied)": {
    desc: "Drylining works in residential refurb (occupied) covers installing or altering partitions and ceilings in homes while residents remain in place. Work includes dust control, protection of furniture and careful sequencing around daily routines. Communication with occupants is important. Safety of children and vulnerable persons is a key consideration.",
    hazards: ["public_interface", "dust_fumes", "manual_handling", "slips_trips"],
    questions: [
      { id: "q1", label: "Have you agreed working times with residents for drylining works in residential refurb (occupied)?" },
      { id: "q2", label: "Is dust and debris from drylining works in residential refurb (occupied) being controlled and contained?" },
      { id: "q3", label: "Are you keeping tools and materials secure during drylining works in residential refurb (occupied)?" },
      { id: "q4", label: "Are escape routes and stairs kept clear during drylining works in residential refurb (occupied)?" },
      { id: "q5", label: "Will you clean down and remove waste at the end of each day for drylining works in residential refurb (occupied)?" }
    ]
  },

  "Drylining works in new build shell": {
    desc: "Drylining works in new build shell involve large-scale installation of partitions and ceilings in a new structure. Work is co-ordinated with multiple trades on a fast programme. Material handling, sequencing and access routes must be planned. Quality and compliance checks are built into the process.",
    hazards: ["manual_handling", "work_at_height", "slips_trips", "plant_machinery"],
    questions: [
      { id: "q1", label: "Have you agreed floor-by-floor sequencing for drylining works in new build shell?" },
      { id: "q2", label: "Are materials for drylining works in new build shell stored safely and close to work areas?" },
      { id: "q3", label: "Is access coordinated with other trades for drylining works in new build shell?" },
      { id: "q4", label: "Will you follow quality checks and sign-offs during drylining works in new build shell?" },
      { id: "q5", label: "Have you planned waste removal routes for drylining works in new build shell?" }
    ]
  },

  "Builders work in connection for ceiling openings": {
    desc: "Builders work in connection for ceiling openings involves forming holes or trimming structure to allow for ducts, hatches, lights or other fixtures. Work may involve breaking out concrete, cutting boards and adjusting framing. Structural and fire implications must be considered. Edges are prepared for the follow-on trades.",
    hazards: ["dust_fumes", "noise_vibration", "work_at_height", "falling_objects"],
    questions: [
      { id: "q1", label: "Have you confirmed structural limitations before builders work in connection for ceiling openings?" },
      { id: "q2", label: "Are services identified and isolated before builders work in connection for ceiling openings?" },
      { id: "q3", label: "Is dust and noise from builders work in connection for ceiling openings controlled appropriately?" },
      { id: "q4", label: "Are edges protected and safe after builders work in connection for ceiling openings?" },
      { id: "q5", label: "Will fire protection be reinstated after builders work in connection for ceiling openings?" }
    ]
  },

  "Fire encasement to steel beams/columns": {
    desc: "Fire encasement to steel beams/columns uses board systems to provide fire protection to structural steelwork. Work includes framing, board fixing and sealing joints in line with tested systems. Working at height on scaffolds or MEWPs is common. Accurate installation is essential to achieve the required fire rating.",
    hazards: ["work_at_height", "manual_handling", "dust_fumes", "scaffold_safety"],
    questions: [
      { id: "q1", label: "Have you confirmed the required fire rating for the fire encasement to steel beams/columns?" },
      { id: "q2", label: "Is access safe for all steelwork needing fire encasement to steel beams/columns?" },
      { id: "q3", label: "Are you using the correct board type and fixings for the fire encasement to steel beams/columns?" },
      { id: "q4", label: "Will all joints and corners be sealed correctly during fire encasement to steel beams/columns?" },
      { id: "q5", label: "Have you planned inspection and recording for fire encasement to steel beams/columns?" }
    ]
  },

  "Soffit lining in car parks": {
    desc: "Soffit lining in car parks involves fixing boards or panels to exposed soffits to improve appearance, fire performance or durability. Work is often carried out above vehicle routes and in exposed conditions. Fixings must cope with vibration and environment. Traffic management and headroom need careful planning.",
    hazards: ["work_at_height", "moving_vehicles", "environmental_weather", "manual_handling"],
    questions: [
      { id: "q1", label: "Is a traffic management plan in place before starting soffit lining in car parks?" },
      { id: "q2", label: "Is access equipment suitable for the headroom arrangements for soffit lining in car parks?" },
      { id: "q3", label: "Are fixings and boards for soffit lining in car parks suitable for external or semi-exposed conditions?" },
      { id: "q4", label: "Will you manage dust and debris so it does not affect vehicles during soffit lining in car parks?" },
      { id: "q5", label: "Have you considered fire and smoke requirements when specifying soffit lining in car parks?" }
    ]
  },

  "Ceiling survey and access panel installation": {
    desc: "Ceiling survey and access panel installation involves inspecting existing ceilings to locate services, then forming openings and fitting access panels where required. Work is often above occupied areas and may reveal unforeseen issues. Accurate records are made of panel locations. Fire and acoustic properties must be preserved.",
    hazards: ["work_at_height", "dust_fumes", "public_interface", "sharp_objects"],
    questions: [
      { id: "q1", label: "Have you agreed survey scope and locations before ceiling survey and access panel installation?" },
      { id: "q2", label: "Is access safe for all areas of ceiling survey and access panel installation?" },
      { id: "q3", label: "Will you record all panel positions during ceiling survey and access panel installation?" },
      { id: "q4", label: "Are you maintaining fire and acoustic ratings during ceiling survey and access panel installation?" },
      { id: "q5", label: "Have you arranged protection and signage under areas affected by ceiling survey and access panel installation?" }
    ]
  }
};

const GROUNDWORKS_CIVILS_CLUSTERS: Record<string, JobCluster> = {
  // 1
  "Topsoil strip and site clearance": {
    desc: "Topsoil strip and site clearance involves removing vegetation, soft topsoil and surface obstructions to expose a suitable formation for construction. The work is normally carried out with 360° excavators, dumpers and hand tools, with arisings either stockpiled or removed from site. Traffic routes, spoil heaps and working edges must be planned so that the area remains stable and safe for plant and operatives.",
    hazards: ["excavation", "plant_machinery", "heavy_plant", "environmental_weather", "slips_trips", "dust_fumes", "silica_dust"],
    questions: [
      { id: "q1", label: "Has the extent and depth of the topsoil strip and site clearance been agreed with the principal contractor or client?" },
      { id: "q2", label: "Are plant routes, tipping points and exclusion zones for the topsoil strip and site clearance clearly defined?" },
      { id: "q3", label: "Is there a plan to control dust, mud on roads and noise generated by the topsoil strip and site clearance works?" },
      { id: "q4", label: "Are all excavators and dumpers used for the topsoil strip and site clearance operated only by trained and authorised personnel?" },
      { id: "q5", label: "Have spoil heaps from the topsoil strip and site clearance been located away from edges and overhead services?" }
    ]
  },

  // 2
  "Trench excavation for services": {
    desc: "Trench excavation for services involves forming narrow excavations to receive water, electric, gas or data services to the required depth and line. The work typically uses excavators and hand digging, with particular care around existing underground utilities. Support, safe access and spoil placement must be managed to prevent collapse and protect operatives and the public.",
    hazards: ["excavation", "underground_services", "plant_machinery", "heavy_plant", "structural_collapse", "slips_trips", "water_ingress"],
    questions: [
      { id: "q1", label: "Have utility drawings and CAT and Genny scans been completed before trench excavation for services starts?" },
      { id: "q2", label: "Is hand digging specified and understood where trench excavation for services approaches known or suspected utilities?" },
      { id: "q3", label: "Are trench widths, depths and support requirements for the trench excavation for services defined in a safe system of work?" },
      { id: "q4", label: "Is spoil from the trench excavation for services tipped at a safe distance from edges and kept clear of access routes?" },
      { id: "q5", label: "Are daily inspections of the trench excavation for services recorded by a competent person, including after heavy rain?" }
    ]
  },

  // 3
  "Foundations excavation and pour": {
    desc: "Foundations excavation and pour covers forming and concreting foundations to the required size, depth and bearing level. Excavators, lasers and site engineering control the formation, followed by placement of concrete using lorries, pumps or skips. Stability of sides, safe access, correct concrete quality and protection against groundwater are all critical to long-term performance.",
    hazards: ["excavation", "plant_machinery", "heavy_plant", "structural_collapse", "water_ingress", "cement", "manual_handling"],
    questions: [
      { id: "q1", label: "Have founding levels and bearing capacities for the foundations excavation and pour been confirmed by the engineer?" },
      { id: "q2", label: "Is temporary support or battering specified for the foundations excavation and pour where ground conditions are poor?" },
      { id: "q3", label: "Are concrete delivery and discharge routes for the foundations excavation and pour planned to avoid overloading edges?" },
      { id: "q4", label: "Is there a plan to manage groundwater entry during the foundations excavation and pour, such as pumps or sumps?" },
      { id: "q5", label: "Will the foundations excavation and pour be checked for dimensions, cover and finish before backfilling starts?" }
    ]
  },

  // 4
  "Strip footings excavation": {
    desc: "Strip footings excavation involves forming continuous trenches to support walls or linear structures at the specified width and depth. The operation uses mechanical excavation with trimming by hand where required. Correct location, depth and support of sides are essential to prevent movement or collapse and to maintain the designed bearing.",
    hazards: ["excavation", "plant_machinery", "heavy_plant", "structural_collapse", "slips_trips", "water_ingress"],
    questions: [
      { id: "q1", label: "Have setting-out points for the strip footings excavation been checked against current drawings?" },
      { id: "q2", label: "Is a safe system in place for operatives entering the strip footings excavation, including ladders or steps where needed?" },
      { id: "q3", label: "Are plant and spoil heaps kept back from the top of the strip footings excavation to reduce collapse risk?" },
      { id: "q4", label: "Will the strip footings excavation be inspected and signed off by a competent person before concrete is placed?" },
      { id: "q5", label: "Are controls in place to stop water build-up in the strip footings excavation during wet weather?" }
    ]
  },

  // 5
  "Ground beam excavation and pour": {
    desc: "Ground beam excavation and pour covers forming trenches or pits for reinforced concrete ground beams and then concreting them to specification. Works may involve cages, shuttering and coordination with other foundations. Maintaining correct cover, alignment and support until the concrete cures is vital.",
    hazards: ["excavation", "plant_machinery", "heavy_plant", "cement", "manual_handling", "structural_collapse"],
    questions: [
      { id: "q1", label: "Has the reinforcement and formwork design for the ground beam excavation and pour been reviewed and understood?" },
      { id: "q2", label: "Are lifting arrangements in place for cages or shutters used in the ground beam excavation and pour?" },
      { id: "q3", label: "Is there enough working space around the ground beam excavation and pour to place and vibrate concrete safely?" },
      { id: "q4", label: "Will the ground beam excavation and pour be checked for line, level and cover before the concrete sets?" },
      { id: "q5", label: "Are measures in place to prevent collapse or undermining of nearby structures during the ground beam excavation and pour?" }
    ]
  },

  // 6
  "Pile cap excavation and concrete": {
    desc: "Pile cap excavation and concrete involves digging around pile heads to the designed depth and dimensions, then forming and pouring reinforced concrete pile caps. The work must protect piles from damage and avoid disturbing surrounding ground. Formwork, reinforcement and concrete placement must follow the engineer’s design.",
    hazards: ["excavation", "plant_machinery", "heavy_plant", "structural_collapse", "cement", "manual_handling"],
    questions: [
      { id: "q1", label: "Have pile locations and levels for the pile cap excavation and concrete been confirmed by the engineer or surveyor?" },
      { id: "q2", label: "Is the pile cap excavation and concrete sequence planned to avoid undermining adjacent caps or foundations?" },
      { id: "q3", label: "Are reinforcements for the pile cap excavation and concrete stored and lifted safely to minimise manual handling strain?" },
      { id: "q4", label: "Will concrete for the pile cap excavation and concrete be placed and compacted before cold joints can form?" },
      { id: "q5", label: "Is there a clear inspection and sign-off process for the pile cap excavation and concrete before backfilling?" }
    ]
  },

  // 7
  "Basement excavation": {
    desc: "Basement excavation involves deep, often large-scale excavation to create below-ground structures such as basements or plant rooms. It may require staged digging, temporary works, dewatering and close monitoring of nearby structures. The risk profile is high and demands strict control of support, access and plant movements.",
    hazards: ["excavation", "structural_collapse", "water_ingress", "plant_machinery", "heavy_plant", "environmental_weather"],
    questions: [
      { id: "q1", label: "Is there a formal temporary works design in place for the basement excavation, including support and sequencing?" },
      { id: "q2", label: "Are trigger levels and monitoring points set up around the basement excavation to detect movement or settlement?" },
      { id: "q3", label: "Is dewatering for the basement excavation designed and managed to avoid flooding and instability?" },
      { id: "q4", label: "Are exclusion zones around the basement excavation defined to keep non-essential personnel and plant away from edges?" },
      { id: "q5", label: "Are emergency rescue arrangements in place for operatives working at depth in the basement excavation?" }
    ]
  },

  // 8
  "Oversite preparation and hardcore": {
    desc: "Oversite preparation and hardcore involves trimming formation levels, placing a hardcore sub-base and compacting it to specification ahead of slabs or floor construction. The work uses plant such as compactors and telehandlers alongside hand tools. Achieving correct levels and compaction is essential to avoid future settlement.",
    hazards: ["manual_handling", "plant_machinery", "heavy_plant", "slips_trips", "dust_fumes", "silica_dust"],
    questions: [
      { id: "q1", label: "Have formation levels for the oversite preparation and hardcore been checked against drawings and tolerances?" },
      { id: "q2", label: "Is the type and thickness of hardcore for the oversite preparation and hardcore agreed with the engineer?" },
      { id: "q3", label: "Are compaction plant and methods for the oversite preparation and hardcore suitable for the material and thickness?" },
      { id: "q4", label: "Is good housekeeping maintained around the oversite preparation and hardcore to reduce trip hazards and loose debris?" },
      { id: "q5", label: "Will records of compaction and levels for the oversite preparation and hardcore be kept for quality assurance?" }
    ]
  },

  // 9
  "Concrete slab pour (ground floor)": {
    desc: "Concrete slab pour (ground floor) covers placing, levelling and finishing ground-bearing or suspended slabs. It includes coordination with reinforcement, formwork and service penetrations. Concrete supply, access and finishing methods must be planned so that the pour can be completed safely and to specification.",
    hazards: ["manual_handling", "cement", "plant_machinery", "heavy_plant", "slips_trips", "dust_fumes"],
    questions: [
      { id: "q1", label: "Has the pour sequence for the concrete slab pour (ground floor) been agreed, including bay sizes and joints?" },
      { id: "q2", label: "Are suitable access routes available for lorries and pumps involved in the concrete slab pour (ground floor)?" },
      { id: "q3", label: "Is there adequate lighting and edge protection around the concrete slab pour (ground floor) working area?" },
      { id: "q4", label: "Are operatives carrying out the concrete slab pour (ground floor) trained in the use of vibrating equipment and finishes?" },
      { id: "q5", label: "Will curing requirements for the concrete slab pour (ground floor) be followed and documented?" }
    ]
  },

  // 10
  "Reinforcing steel fixing": {
    desc: "Reinforcing steel fixing involves handling, cutting, bending and tying reinforcement to form cages and mats in line with design. The work can involve repetitive handling of heavy bars, working at height around formwork and using powered tools. Accurate placement and secure tying are required to ensure structural performance.",
    hazards: ["manual_handling", "sharp_objects", "power_tools", "slips_trips", "falling_objects"],
    questions: [
      { id: "q1", label: "Are bar schedules and drawings for the reinforcing steel fixing available and understood by the fixing team?" },
      { id: "q2", label: "Are mechanical aids or team lifts used during reinforcing steel fixing for long or heavy bars and cages?" },
      { id: "q3", label: "Is PPE such as gloves, eye protection and safety boots being worn during all reinforcing steel fixing activities?" },
      { id: "q4", label: "Are offcuts and tying wire being cleared regularly to keep reinforcing steel fixing areas tidy?" },
      { id: "q5", label: "Are any elevated work areas for reinforcing steel fixing provided with suitable platforms and edge protection?" }
    ]
  },

  // 11
  "Formwork and shuttering install": {
    desc: "Formwork and shuttering install covers erecting, adjusting and striking formwork for concrete walls, slabs, beams and foundations. This can involve heavy components, temporary supports and working at height. Correct fixing, alignment and propping are essential to prevent collapse and to achieve the required finish.",
    hazards: ["manual_handling", "work_at_height", "falling_objects", "structural_collapse", "power_tools"],
    questions: [
      { id: "q1", label: "Has the formwork and shuttering install method been reviewed against manufacturer or engineer guidance?" },
      { id: "q2", label: "Are safe working platforms and edge protection in place where formwork and shuttering install is carried out above ground level?" },
      { id: "q3", label: "Are lifting points and slinging methods for the formwork and shuttering install clearly identified and used?" },
      { id: "q4", label: "Is there a system to check all bolts, ties and wedges during the formwork and shuttering install before concrete is poured?" },
      { id: "q5", label: "Are strike criteria and timings for the formwork and shuttering install agreed so supports are not removed too early?" }
    ]
  },

  // 12
  "Installation of drainage runs": {
    desc: "Installation of drainage runs involves laying pipes to specified gradients and alignments, usually in prepared trenches, to form foul or surface water systems. The work includes bedding, jointing and connecting into manholes or existing drains. Correct falls, bedding and compaction are vital to prevent future leaks, blockages or settlement.",
    hazards: ["excavation", "confined_space", "water_ingress", "biological", "plant_machinery", "slips_trips"],
    questions: [
      { id: "q1", label: "Have line and level for the installation of drainage runs been checked against approved drawings?" },
      { id: "q2", label: "Are pipe materials and jointing methods for the installation of drainage runs suitable for the ground and loadings?" },
      { id: "q3", label: "Is there a safe system of work to prevent operatives entering deep trenches during the installation of drainage runs without proper support?" },
      { id: "q4", label: "Will the installation of drainage runs be tested (e.g. air or water tests) before backfilling?" },
      { id: "q5", label: "Are arrangements in place to prevent contamination exposure during the installation of drainage runs, including hygiene facilities?" }
    ]
  },

  // 13
  "Manhole and inspection chamber install": {
    desc: "Manhole and inspection chamber install covers constructing pre-cast or in-situ chambers to allow access to drainage systems. Works include benching, cover slabs, ladders and frames. Depth, confined space risk and water ingress must be carefully managed with correct lifting and access equipment.",
    hazards: ["excavation", "confined_space", "water_ingress", "biological", "plant_machinery", "manual_handling"],
    questions: [
      { id: "q1", label: "Has a confined space assessment been carried out for the manhole and inspection chamber install?" },
      { id: "q2", label: "Are lifting accessories and methods for components in the manhole and inspection chamber install suitable and certified?" },
      { id: "q3", label: "Is there a plan to control water ingress during the manhole and inspection chamber install, including pumps and overpumping if required?" },
      { id: "q4", label: "Are access ladders, steps and covers for the manhole and inspection chamber install fitted in accordance with standards?" },
      { id: "q5", label: "Will the manhole and inspection chamber install be inspected and tested before being put into service?" }
    ]
  },

  // 14
  "Soakaway installation": {
    desc: "Soakaway installation involves constructing below-ground structures, often using crates or granular fill, to disperse surface water into the ground. It requires controlled excavation, correct geotextile wrapping and connection to pipework. The location must be suitable for drainage and away from structures and services.",
    hazards: ["excavation", "water_ingress", "plant_machinery", "confined_space", "slips_trips"],
    questions: [
      { id: "q1", label: "Has the siting and size for the soakaway installation been confirmed as suitable by the engineer or designer?" },
      { id: "q2", label: "Is the excavation for the soakaway installation adequately supported or battered back to prevent collapse?" },
      { id: "q3", label: "Are crates or materials used in the soakaway installation handled in a way that avoids damage to geotextiles?" },
      { id: "q4", label: "Will the soakaway installation be protected against silt and debris during the remainder of the project?" },
      { id: "q5", label: "Is there a plan to manage any groundwater that may enter the excavation during the soakaway installation?" }
    ]
  },

  // 15
  "Service duct installation": {
    desc: "Service duct installation involves placing ducts or sleeves to carry future services, either in trenches or built into structures. The route, depth and identification of ducts must be accurate to avoid clashes and allow later access. Coordination with other trades is essential.",
    hazards: ["excavation", "underground_services", "plant_machinery", "manual_handling", "slips_trips"],
    questions: [
      { id: "q1", label: "Have routes and depths for the service duct installation been coordinated with the overall services strategy?" },
      { id: "q2", label: "Are warning tapes and marker posts included as part of the service duct installation where specified?" },
      { id: "q3", label: "Is the service duct installation being recorded on as-built drawings as ducts are installed?" },
      { id: "q4", label: "Are ducts used in the service duct installation properly capped or sealed to prevent water and debris ingress?" },
      { id: "q5", label: "Are manual handling risks from coils or sections in the service duct installation controlled through team lifts or mechanical aids?" }
    ]
  },

  // 16
  "Site hoarding and fencing install": {
    desc: "Site hoarding and fencing install covers putting up perimeter hoarding, mesh fencing or barriers to secure the site and segregate the public. It involves post setting, panel fixing and gates, sometimes near live traffic or footpaths. Stability, line of sight and access for emergency services all need consideration.",
    hazards: ["manual_handling", "work_at_height", "public_interface", "moving_vehicles", "environmental_weather"],
    questions: [
      { id: "q1", label: "Has the line and extent of the site hoarding and fencing install been agreed with the client or principal contractor?" },
      { id: "q2", label: "Are posts and panels in the site hoarding and fencing install designed and fixed to withstand local wind loads?" },
      { id: "q3", label: "Is there a traffic management arrangement in place where the site hoarding and fencing install is close to live roads or footpaths?" },
      { id: "q4", label: "Are gates and access points in the site hoarding and fencing install wide enough for emergency and construction vehicles?" },
      { id: "q5", label: "Is the site hoarding and fencing install being inspected routinely to identify and repair any damage or instability?" }
    ]
  },

  // 17
  "Kerbing and edging install": {
    desc: "Kerbing and edging install involves setting out, bedding and jointing precast kerbs or edgings along roads, footpaths and paved areas. It requires accurate line and level, and careful handling of heavy units. Works are often carried out close to traffic or other trades.",
    hazards: ["manual_handling", "moving_vehicles", "plant_machinery", "slips_trips", "public_interface"],
    questions: [
      { id: "q1", label: "Are lines and levels for the kerbing and edging install clearly set out and agreed with the engineer?" },
      { id: "q2", label: "Are team lifts or mechanical aids used for heavy kerbs during the kerbing and edging install?" },
      { id: "q3", label: "Is traffic and pedestrian movement controlled around the kerbing and edging install area with barriers and signage?" },
      { id: "q4", label: "Are bedding and haunching materials for the kerbing and edging install mixed and placed to the specification?" },
      { id: "q5", label: "Will the kerbing and edging install be checked for alignment, level and stability before opening to traffic?" }
    ]
  },

  // 18
  "Block paving driveway": {
    desc: "Block paving driveway works involve preparing the sub-base, laying blocks to pattern and compacting them to form a finished surface. Edges, drainage falls and levels must be correct to avoid ponding or movement. Cutting blocks and vibrating plates present additional risks.",
    hazards: ["manual_handling", "plant_machinery", "slips_trips", "dust_fumes", "noise_vibration"],
    questions: [
      { id: "q1", label: "Has the sub-base and levels for the block paving driveway been checked and signed off before laying blocks?" },
      { id: "q2", label: "Are block cutting operations for the block paving driveway controlled to manage dust and flying fragments?" },
      { id: "q3", label: "Is the block paving driveway area segregated from vehicle and pedestrian traffic while work is in progress?" },
      { id: "q4", label: "Are vibrating plates and compactors used on the block paving driveway maintained and used by competent operatives?" },
      { id: "q5", label: "Will the completed block paving driveway be inspected for pattern, level and trip hazards before handover?" }
    ]
  },

  // 19
  "Tarmac surfacing (small works)": {
    desc: "Tarmac surfacing (small works) involves laying asphalt to form footpaths, driveways or patch repairs. It covers sub-base preparation, tack coating, laying and compacting hot material. Burn risks, fumes and moving vehicles need particular control.",
    hazards: ["hot_work", "manual_handling", "moving_vehicles", "plant_machinery", "slips_trips", "environmental_weather"],
    questions: [
      { id: "q1", label: "Is the sub-base for the tarmac surfacing (small works) prepared and dry as per specification?" },
      { id: "q2", label: "Are operatives carrying out tarmac surfacing (small works) provided with appropriate heat-resistant PPE?" },
      { id: "q3", label: "Is traffic segregation in place to protect the tarmac surfacing (small works) crew from vehicles and the public?" },
      { id: "q4", label: "Are compaction plant and methods for the tarmac surfacing (small works) suitable for the material and thickness?" },
      { id: "q5", label: "Is there a plan for managing deliveries and storage of hot material for the tarmac surfacing (small works) safely?" }
    ]
  },

  // 20
  "Road formation and sub-base": {
    desc: "Road formation and sub-base works involve cutting to formation level, placing capping or sub-base and compacting to create a stable platform for surfacing. The work uses heavy plant in potentially constrained areas near traffic or the public. Achieving correct levels and compaction is essential for road durability.",
    hazards: ["moving_vehicles", "plant_machinery", "heavy_plant", "slips_trips", "environmental_weather"],
    questions: [
      { id: "q1", label: "Have design levels and crossfalls for the road formation and sub-base been confirmed and set out?" },
      { id: "q2", label: "Is a traffic management plan in place for the road formation and sub-base works in or near live roads?" },
      { id: "q3", label: "Are compaction requirements for the road formation and sub-base clearly communicated to plant operators?" },
      { id: "q4", label: "Is access for emergency vehicles maintained while the road formation and sub-base works are ongoing?" },
      { id: "q5", label: "Are weather conditions monitored so the road formation and sub-base is not left vulnerable to saturation or erosion?" }
    ]
  },

  // 21
  "External steps and ramps in concrete": {
    desc: "External steps and ramps in concrete involve forming, reinforcing and pouring concrete access features, often tied into existing buildings or paths. Accuracy of dimensions, nosings and slip resistance is critical. Temporary barriers and alternative routes must be provided while work is underway.",
    hazards: ["manual_handling", "cement", "slips_trips", "work_at_height", "public_interface"],
    questions: [
      { id: "q1", label: "Have dimensions and gradients for the external steps and ramps in concrete been checked for compliance with standards?" },
      { id: "q2", label: "Is access for building users maintained or diverted safely while external steps and ramps in concrete are constructed?" },
      { id: "q3", label: "Are shuttering and reinforcement for external steps and ramps in concrete fixed securely before pouring?" },
      { id: "q4", label: "Will finishes for external steps and ramps in concrete provide adequate slip resistance in wet conditions?" },
      { id: "q5", label: "Are barriers and signage provided until the external steps and ramps in concrete have cured and are safe to use?" }
    ]
  },

  // 22
  "Reinstatement of footpaths": {
    desc: "Reinstatement of footpaths involves restoring pavements after utility or construction works, matching existing materials and levels. This can include sub-base repair, kerbs, paving or asphalt. The public are often close by, so segregation and temporary walkways are key.",
    hazards: ["public_interface", "moving_vehicles", "manual_handling", "slips_trips", "plant_machinery"],
    questions: [
      { id: "q1", label: "Has the material specification for the reinstatement of footpaths been agreed with the client or local authority?" },
      { id: "q2", label: "Are safe routes provided around the reinstatement of footpaths for pedestrians, including those with reduced mobility?" },
      { id: "q3", label: "Is the reinstatement of footpaths sub-base adequately compacted to prevent future settlement and trip hazards?" },
      { id: "q4", label: "Are deliveries and storage of materials for the reinstatement of footpaths arranged to avoid obstructing public routes?" },
      { id: "q5", label: "Is there a final inspection process for the reinstatement of footpaths to confirm levels and joints are acceptable?" }
    ]
  },

  // 23
  "Land drain installation": {
    desc: "Land drain installation involves laying perforated pipes in trenches to intercept and redirect groundwater. The system usually includes filter media and geotextiles. Correct falls and protection against silt are essential to long-term performance.",
    hazards: ["excavation", "plant_machinery", "water_ingress", "slips_trips"],
    questions: [
      { id: "q1", label: "Has the route and depth for the land drain installation been agreed to avoid undermining structures?" },
      { id: "q2", label: "Are perforated pipes and filter materials for the land drain installation stored and handled to avoid damage?" },
      { id: "q3", label: "Is the trench support or battering for the land drain installation adequate for the soil conditions?" },
      { id: "q4", label: "Will the land drain installation include appropriate outlets and discharge points agreed with the client?" },
      { id: "q5", label: "Are measures in place to prevent silt and debris from blocking the land drain installation during construction?" }
    ]
  },

  // 24
  "Attenuation tank installation": {
    desc: "Attenuation tank installation involves building large underground structures, usually using modular crates or chambers, to store stormwater temporarily. Excavations are often deep and wide, requiring careful support and lifting plans. Correct lining, protection and connection to the drainage system are critical.",
    hazards: ["excavation", "water_ingress", "plant_machinery", "heavy_plant", "confined_space"],
    questions: [
      { id: "q1", label: "Has the excavation and support design for the attenuation tank installation been approved by a competent engineer?" },
      { id: "q2", label: "Are lifting plans in place for delivering and lowering components during the attenuation tank installation?" },
      { id: "q3", label: "Is geotextile wrapping for the attenuation tank installation specified and understood by the site team?" },
      { id: "q4", label: "Will the attenuation tank installation be protected from construction traffic once backfilled?" },
      { id: "q5", label: "Is there a clear testing and sign-off process for the attenuation tank installation before final cover is placed?" }
    ]
  },

  // 25
  "Gabion wall construction": {
    desc: "Gabion wall construction involves assembling wire baskets, filling them with stone and stacking them to form retaining or decorative structures. It requires safe handling of mesh units and rock, control of working platforms and attention to alignment. Adequate bearing and drainage behind the wall are important.",
    hazards: ["manual_handling", "sharp_objects", "slips_trips", "plant_machinery"],
    questions: [
      { id: "q1", label: "Has the bearing and founding level for the gabion wall construction been checked and prepared?" },
      { id: "q2", label: "Are operatives carrying out gabion wall construction provided with gloves and eye protection for handling mesh and stone?" },
      { id: "q3", label: "Is drainage behind the gabion wall construction included where required in the design?" },
      { id: "q4", label: "Are stacking and tying methods for the gabion wall construction agreed to maintain wall stability?" },
      { id: "q5", label: "Will the gabion wall construction be inspected for bulging, misalignment or damage during and after installation?" }
    ]
  },

  // 26
  "Setting out and levels": {
    desc: "Setting out and levels covers survey and engineering tasks to transfer design lines, levels and positions onto the ground. It involves using optical or digital instruments and can be carried out near live plant and traffic. Accurate data handling and clear communication with site teams are essential.",
    hazards: ["slips_trips", "moving_vehicles", "environmental_weather", "lone_working", "poor_lighting"],
    questions: [
      { id: "q1", label: "Are the latest drawings and coordinate files being used for the setting out and levels work?" },
      { id: "q2", label: "Are survey staff carrying out setting out and levels clearly visible to plant and vehicle operators?" },
      { id: "q3", label: "Is there a communication protocol so operatives know when and where setting out and levels activities will take place?" },
      { id: "q4", label: "Have lone-working arrangements for setting out and levels been agreed where staff may work remotely?" },
      { id: "q5", label: "Is survey equipment used for setting out and levels stored and transported securely to avoid damage or loss of calibration?" }
    ]
  },

  // 27
  "Retaining wall excavation and pour": {
    desc: "Retaining wall excavation and pour involves cutting back ground to form the base of a retaining wall and constructing the reinforced concrete or masonry structure. The work often interacts with existing slopes or structures, increasing collapse risk. Drainage and backfill must be correctly detailed.",
    hazards: ["excavation", "structural_collapse", "plant_machinery", "manual_handling", "cement"],
    questions: [
      { id: "q1", label: "Has an assessment been made of the stability of adjacent ground and structures for the retaining wall excavation and pour?" },
      { id: "q2", label: "Is specific temporary works guidance in place for the retaining wall excavation and pour where height is significant?" },
      { id: "q3", label: "Are reinforcement and formwork for the retaining wall excavation and pour designed to resist lateral pressures?" },
      { id: "q4", label: "Is drainage (e.g. weepholes) included as part of the retaining wall excavation and pour to relieve water pressure?" },
      { id: "q5", label: "Will the retaining wall excavation and pour be inspected and signed off before backfilling?" }
    ]
  },

  // 28
  "Concrete upstand and plinth works": {
    desc: "Concrete upstand and plinth works involve casting smaller raised concrete elements to support equipment, walls or barriers. Accuracy of position and level is important so that supported items fit correctly. Works may involve small formwork, reinforcement and tight access.",
    hazards: ["manual_handling", "cement", "slips_trips", "power_tools"],
    questions: [
      { id: "q1", label: "Have the locations and dimensions for the concrete upstand and plinth works been checked against equipment drawings?" },
      { id: "q2", label: "Are formwork and fixings for the concrete upstand and plinth works sufficient for the pour size?" },
      { id: "q3", label: "Is reinforcement for the concrete upstand and plinth works correctly fixed and supported to maintain cover?" },
      { id: "q4", label: "Are mixing, placing and finishing methods for the concrete upstand and plinth works suited to the scale of the task?" },
      { id: "q5", label: "Will the concrete upstand and plinth works be protected from impact or loading until the concrete has cured?" }
    ]
  },

  // 29
  "RC lift pit construction": {
    desc: "RC lift pit construction involves forming a deep reinforced concrete box below floor level to house lift mechanisms. It combines excavation, formwork, reinforcement and confined working spaces. Waterproofing and dimensional accuracy are critical.",
    hazards: ["excavation", "confined_space", "manual_handling", "cement", "structural_collapse"],
    questions: [
      { id: "q1", label: "Has a safe access and egress plan been prepared for the RC lift pit construction area?" },
      { id: "q2", label: "Are temporary works for the RC lift pit construction excavation designed and installed correctly?" },
      { id: "q3", label: "Is reinforcement and formwork for the RC lift pit construction checked for alignment and cover before pouring?" },
      { id: "q4", label: "Are waterproofing and joint details for the RC lift pit construction clearly understood and implemented?" },
      { id: "q5", label: "Is emergency rescue provision considered for operatives working within the RC lift pit construction?" }
    ]
  },

  // 30
  "Temporary works to excavations": {
    desc: "Temporary works to excavations covers the installation, adjustment and removal of proprietary or designed shoring systems. This may include trench boxes, sheets, frames or other supports. Correct sequencing and adherence to the temporary works design are vital.",
    hazards: ["structural_collapse", "excavation", "plant_machinery", "manual_handling", "falling_objects"],
    questions: [
      { id: "q1", label: "Is there an approved temporary works design for the temporary works to excavations activity?" },
      { id: "q2", label: "Are operatives installing temporary works to excavations trained and briefed on the specific system being used?" },
      { id: "q3", label: "Is plant used for the temporary works to excavations positioned so it does not overload excavation edges?" },
      { id: "q4", label: "Are inspections of the temporary works to excavations recorded, especially after changes in loading or weather?" },
      { id: "q5", label: "Is the removal sequence for the temporary works to excavations planned to avoid sudden loss of support?" }
    ]
  },

  // 31
  "Bulk earthworks cut and fill": {
    desc: "Bulk earthworks cut and fill involves moving large volumes of soil to create platforms, embankments or reduced levels across a site. It uses heavy plant including excavators, dozers and dumpers. Stability of slopes, haul routes and traffic interfaces must be tightly controlled.",
    hazards: ["excavation", "plant_machinery", "heavy_plant", "moving_vehicles", "environmental_weather", "slips_trips"],
    questions: [
      { id: "q1", label: "Have the extents and finished levels for the bulk earthworks cut and fill been clearly defined?" },
      { id: "q2", label: "Are haul roads and tipping areas for the bulk earthworks cut and fill designed and inspected for suitability?" },
      { id: "q3", label: "Are plant operators involved in the bulk earthworks cut and fill briefed on exclusion zones and traffic routes?" },
      { id: "q4", label: "Is slope stability and benching for the bulk earthworks cut and fill monitored and recorded?" },
      { id: "q5", label: "Are weather conditions taken into account so the bulk earthworks cut and fill does not create unsafe soft or unstable ground?" }
    ]
  },

  // 32
  "Ground reduction and muck away": {
    desc: "Ground reduction and muck away involves lowering site levels and removing surplus material to off-site facilities. It requires coordination of lorry movements, load checks and waste classification. Interfaces with the public highway must be managed carefully.",
    hazards: ["plant_machinery", "heavy_plant", "moving_vehicles", "dust_fumes", "slips_trips"],
    questions: [
      { id: "q1", label: "Has the waste classification for the ground reduction and muck away arisings been confirmed?" },
      { id: "q2", label: "Are wheel wash or road cleaning arrangements in place for the ground reduction and muck away vehicles?" },
      { id: "q3", label: "Are loading areas for the ground reduction and muck away separated from pedestrian routes?" },
      { id: "q4", label: "Is there a traffic management plan covering lorry movements for the ground reduction and muck away operation?" },
      { id: "q5", label: "Are dust and noise from the ground reduction and muck away controlled to meet local requirements?" }
    ]
  },

  // 33
  "Stabilisation of slopes and embankments": {
    desc: "Stabilisation of slopes and embankments involves reshaping, compacting or reinforcing ground to prevent slips and erosion. Methods may include benching, geogrids, soil nails or revetments. Plant often operates on or near steep gradients.",
    hazards: ["environmental_weather", "plant_machinery", "heavy_plant", "structural_collapse", "slips_trips"],
    questions: [
      { id: "q1", label: "Has an engineer reviewed the method for the stabilisation of slopes and embankments?" },
      { id: "q2", label: "Are plant and access routes for the stabilisation of slopes and embankments safe on the proposed gradients?" },
      { id: "q3", label: "Are operatives involved in the stabilisation of slopes and embankments protected from falls down slopes?" },
      { id: "q4", label: "Are drainage and erosion control measures included within the stabilisation of slopes and embankments design?" },
      { id: "q5", label: "Is the stabilisation of slopes and embankments inspected after heavy rainfall or significant weather events?" }
    ]
  },

  // 34
  "Topsoil spreading and landscaping formation": {
    desc: "Topsoil spreading and landscaping formation involves placing and grading topsoil to form finished contours ready for seeding or planting. It often uses small plant in combination with hand raking. Protection of adjacent structures and control of mud and dust are important.",
    hazards: ["plant_machinery", "manual_handling", "slips_trips", "environmental_weather"],
    questions: [
      { id: "q1", label: "Are finished levels for the topsoil spreading and landscaping formation agreed and set out?" },
      { id: "q2", label: "Is plant used for the topsoil spreading and landscaping formation suitable for ground conditions and gradients?" },
      { id: "q3", label: "Are operatives carrying out topsoil spreading and landscaping formation protected from contact with moving plant?" },
      { id: "q4", label: "Is there a plan to manage mud and debris from the topsoil spreading and landscaping formation at site exits?" },
      { id: "q5", label: "Will soft landscaping areas created by the topsoil spreading and landscaping formation be protected from trafficking?" }
    ]
  },

  // 35
  "Construction of access tracks": {
    desc: "Construction of access tracks involves creating temporary or permanent routes for construction plant and vehicles. It may include geogrid, stone, timber mats or similar systems. Tracks must be designed to carry loads safely and avoid environmental damage.",
    hazards: ["moving_vehicles", "plant_machinery", "heavy_plant", "environmental_weather", "slips_trips"],
    questions: [
      { id: "q1", label: "Has the design and route for the construction of access tracks been agreed with the client and landowner?" },
      { id: "q2", label: "Are bearing capacities and load limits for the construction of access tracks understood by plant operators?" },
      { id: "q3", label: "Is access control in place so only authorised vehicles use the construction of access tracks?" },
      { id: "q4", label: "Are measures in place to protect watercourses and sensitive habitats during the construction of access tracks?" },
      { id: "q5", label: "Will the construction of access tracks be inspected regularly and repaired if rutting or damage occurs?" }
    ]
  },

  // 36
  "Hardstanding and yard construction": {
    desc: "Hardstanding and yard construction involves forming durable surfaced areas for parking, storage or operations, usually with stone and concrete or asphalt. Good drainage, falls and load-bearing capacity are essential. Works often involve interaction with ongoing site logistics.",
    hazards: ["moving_vehicles", "plant_machinery", "manual_handling", "slips_trips"],
    questions: [
      { id: "q1", label: "Have intended use and loadings for the hardstanding and yard construction been confirmed?" },
      { id: "q2", label: "Are falls and drainage for the hardstanding and yard construction designed to avoid ponding and pollution?" },
      { id: "q3", label: "Is traffic management around the hardstanding and yard construction coordinated with site logistics?" },
      { id: "q4", label: "Are materials and plant for the hardstanding and yard construction stored so they do not obstruct emergency routes?" },
      { id: "q5", label: "Will the hardstanding and yard construction be inspected before handover for defects or trip hazards?" }
    ]
  },

  // 37
  "Concrete road slab construction": {
    desc: "Concrete road slab construction involves forming, reinforcing and pouring concrete carriageways or yard slabs designed for heavy traffic. It requires accurate joint layout, reinforcement and curing. Access for vehicles must be managed while slabs gain strength.",
    hazards: ["manual_handling", "plant_machinery", "heavy_plant", "cement", "moving_vehicles"],
    questions: [
      { id: "q1", label: "Has the joint layout and reinforcement for the concrete road slab construction been checked against the design?" },
      { id: "q2", label: "Are concrete delivery and discharge points for the concrete road slab construction planned to avoid congestion and reversing risks?" },
      { id: "q3", label: "Is curing for the concrete road slab construction specified and understood, including protection from early traffic?" },
      { id: "q4", label: "Are expansion joints, dowels and tie bars for the concrete road slab construction installed correctly?" },
      { id: "q5", label: "Will the concrete road slab construction area be effectively barriered until strength is achieved?" }
    ]
  },

  // 38
  "Precast drainage channel installation": {
    desc: "Precast drainage channel installation involves placing linear channels or gullies at finished levels to capture surface water, often in yards or roads. Works require careful line, level and joint sealing. Traffic and other trades may be working nearby.",
    hazards: ["manual_handling", "slips_trips", "plant_machinery"],
    questions: [
      { id: "q1", label: "Are line and level for the precast drainage channel installation set out correctly?" },
      { id: "q2", label: "Are lifting methods for the precast drainage channel installation adequate to control manual handling risks?" },
      { id: "q3", label: "Is bedding and haunching for the precast drainage channel installation mixed and placed as specified?" },
      { id: "q4", label: "Are gratings and covers for the precast drainage channel installation secured to prevent theft or movement?" },
      { id: "q5", label: "Is the precast drainage channel installation protected from traffic until the surrounding material has cured?" }
    ]
  },

  // 39
  "Gully and ACO channel install": {
    desc: "Gully and ACO channel install involves forming local excavations, installing gullies or proprietary channels, and connecting them to the drainage system. It requires accurate positioning at low points and coordination with surfacing levels.",
    hazards: ["excavation", "manual_handling", "slips_trips", "plant_machinery"],
    questions: [
      { id: "q1", label: "Are low points and run lines for the gully and ACO channel install agreed with the engineer?" },
      { id: "q2", label: "Is the excavation for the gully and ACO channel install adequately supported or stepped to allow safe working?" },
      { id: "q3", label: "Are connections for the gully and ACO channel install into existing drainage watertight and tested?" },
      { id: "q4", label: "Are gratings and covers used for the gully and ACO channel install selected for the expected loading class?" },
      { id: "q5", label: "Is the area around the gully and ACO channel install kept tidy to avoid trip hazards?" }
    ]
  },

  // 40
  "S278 minor highway works": {
    desc: "S278 minor highway works cover alterations to existing public highways under a legal agreement, such as new entrances, islands or signals. Works often take place under live traffic management with strict standards and inspection regimes.",
    hazards: ["moving_vehicles", "public_interface", "plant_machinery", "environmental_weather", "slips_trips"],
    questions: [
      { id: "q1", label: "Has the traffic management plan for the S278 minor highway works been agreed with the highway authority?" },
      { id: "q2", label: "Are permits and permissions for the S278 minor highway works in place before work begins?" },
      { id: "q3", label: "Are operatives engaged in S278 minor highway works briefed on working next to live traffic?" },
      { id: "q4", label: "Is signage and lighting for the S278 minor highway works adequate for night and poor visibility conditions?" },
      { id: "q5", label: "Is there an inspection and sign-off process agreed with the authority for completed S278 minor highway works?" }
    ]
  },

  // 41
  "Footpath crossover and dropped kerb": {
    desc: "Footpath crossover and dropped kerb works provide vehicle access from roads to private driveways, requiring kerb adjustments and footpath reconstruction. Works are adjacent to the public and often in restricted spaces.",
    hazards: ["public_interface", "moving_vehicles", "manual_handling", "slips_trips"],
    questions: [
      { id: "q1", label: "Has permission for the footpath crossover and dropped kerb been granted by the relevant authority?" },
      { id: "q2", label: "Is temporary pedestrian diversion in place for the footpath crossover and dropped kerb works?" },
      { id: "q3", label: "Are kerbs for the footpath crossover and dropped kerb handled with suitable lifting methods?" },
      { id: "q4", label: "Does the footpath crossover and dropped kerb design meet visibility and gradient requirements?" },
      { id: "q5", label: "Is the reinstated surface at the footpath crossover and dropped kerb free of trip hazards before reopening?" }
    ]
  },

  // 42
  "Car park formation and surfacing": {
    desc: "Car park formation and surfacing involves preparing sub-base, drainage, kerbs and final surfacing for parking areas. It often requires phasing to keep parts of the area operational. Traffic flow, pedestrian safety and bay layout must all be considered.",
    hazards: ["moving_vehicles", "plant_machinery", "manual_handling", "slips_trips", "environmental_weather"],
    questions: [
      { id: "q1", label: "Has the layout for the car park formation and surfacing, including bays and walkways, been confirmed?" },
      { id: "q2", label: "Is a phasing plan in place so the car park formation and surfacing can proceed while maintaining safe access?" },
      { id: "q3", label: "Are drainage and falls for the car park formation and surfacing designed to prevent ponding?" },
      { id: "q4", label: "Are segregation measures used so the car park formation and surfacing crew are kept apart from live traffic?" },
      { id: "q5", label: "Is there a QA check for line marking and signage after the car park formation and surfacing is complete?" }
    ]
  },

  // 43
  "External concrete yard repairs": {
    desc: "External concrete yard repairs involve breaking out defective sections of slabs, preparing the base and recasting or patching. Works can generate noise, dust and uneven temporary surfaces. Interfaces with ongoing yard operations are critical.",
    hazards: ["dust_fumes", "noise_vibration", "manual_handling", "slips_trips", "plant_machinery"],
    questions: [
      { id: "q1", label: "Has the extent of the external concrete yard repairs been marked out and agreed?" },
      { id: "q2", label: "Are dust and noise from breaking out during external concrete yard repairs controlled suitably?" },
      { id: "q3", label: "Is access around external concrete yard repairs managed so vehicles and pedestrians avoid exposed edges?" },
      { id: "q4", label: "Are concrete mixes and curing for external concrete yard repairs compatible with existing slabs?" },
      { id: "q5", label: "Will external concrete yard repairs be fenced or marked until new concrete reaches adequate strength?" }
    ]
  },

  // 44
  "Trenchless duct installation (mole boring)": {
    desc: "Trenchless duct installation (mole boring) uses impact moles or similar equipment to install ducts beneath obstacles with minimal open trenching. Launch and reception pits are still required. The risk of striking services or causing ground movement must be managed carefully.",
    hazards: ["underground_services", "plant_machinery", "moving_vehicles", "excavation", "structural_collapse"],
    questions: [
      { id: "q1", label: "Has the route for the trenchless duct installation (mole boring) been cleared of services via drawings and trial holes?" },
      { id: "q2", label: "Are launch and reception pits for the trenchless duct installation (mole boring) supported and fenced appropriately?" },
      { id: "q3", label: "Is the mole boring equipment for the trenchless duct installation being used within manufacturer limits for distance and ground type?" },
      { id: "q4", label: "Are checks in place to detect heave or damage during the trenchless duct installation (mole boring) operation?" },
      { id: "q5", label: "Is there an agreed abort procedure if unexpected resistance or deviation is encountered during trenchless duct installation (mole boring)?" }
    ]
  },

  // 45
  "Service trial hole excavation": {
    desc: "Service trial hole excavation involves carefully digging small pits to expose and verify the position and depth of underground services. It often requires hand digging and close control of plant. Accurate recording of findings is essential.",
    hazards: ["excavation", "underground_services", "plant_machinery", "manual_handling"],
    questions: [
      { id: "q1", label: "Are service locations for the service trial hole excavation marked out using drawings and locating devices?" },
      { id: "q2", label: "Is hand digging specified close to anticipated services during the service trial hole excavation?" },
      { id: "q3", label: "Are sides of the service trial hole excavation kept safe for the depth, using battering or support if required?" },
      { id: "q4", label: "Are findings from the service trial hole excavation recorded with photos and measurements?" },
      { id: "q5", label: "Is the service trial hole excavation backfilled and reinstated safely after inspection is completed?" }
    ]
  },

  // 46
  "Headwall and outfall construction": {
    desc: "Headwall and outfall construction involves building concrete or masonry structures at pipe or culvert outlets, often at watercourses. It may include scour protection, gratings and safety rails. Access can be difficult, and water levels and flows must be controlled.",
    hazards: ["water_ingress", "environmental_weather", "manual_handling", "slips_trips", "plant_machinery"],
    questions: [
      { id: "q1", label: "Has permission for the headwall and outfall construction at the watercourse been obtained where required?" },
      { id: "q2", label: "Are measures in place to control water levels and flows during the headwall and outfall construction?" },
      { id: "q3", label: "Is access for the headwall and outfall construction safe, including any work near steep banks?" },
      { id: "q4", label: "Are reinforcing, formwork and precast elements for the headwall and outfall construction handled safely?" },
      { id: "q5", label: "Are environmental controls in place to prevent pollution during the headwall and outfall construction?" }
    ]
  },

  // 47
  "Swale and ditch formation": {
    desc: "Swale and ditch formation involves excavating shallow vegetated channels to manage surface water and improve attenuation. It requires shaping, trimming and managing spoil. Protection of existing ecology and avoidance of steep unstable slopes is important.",
    hazards: ["excavation", "plant_machinery", "environmental_weather", "slips_trips"],
    questions: [
      { id: "q1", label: "Has the alignment and depth for the swale and ditch formation been agreed with the designer?" },
      { id: "q2", label: "Are banks formed during the swale and ditch formation kept to safe gradients for plant and people?" },
      { id: "q3", label: "Are measures in place to prevent silt run-off from the swale and ditch formation into existing watercourses?" },
      { id: "q4", label: "Is the swale and ditch formation protected from vehicle trafficking after completion?" },
      { id: "q5", label: "Will any planting or lining specified for the swale and ditch formation be installed to the correct detail?" }
    ]
  },

  // 48
  "Flood defence bund construction": {
    desc: "Flood defence bund construction involves forming raised earth embankments or bunds to contain or divert flood water. It requires appropriate materials, compaction and protection from erosion. Interfaces with existing structures and watercourses must be carefully managed.",
    hazards: ["plant_machinery", "environmental_weather", "slips_trips", "structural_collapse"],
    questions: [
      { id: "q1", label: "Has the design and alignment for the flood defence bund construction been approved by a competent engineer?" },
      { id: "q2", label: "Are material type and compaction requirements for the flood defence bund construction clearly specified?" },
      { id: "q3", label: "Is access for the flood defence bund construction plant set up to avoid over-steep slopes or unstable ground?" },
      { id: "q4", label: "Are erosion protection and drainage details for the flood defence bund construction included in the works?" },
      { id: "q5", label: "Is the flood defence bund construction subject to inspection after heavy rainfall or high water events?" }
    ]
  },

  // 49
  "Temporary haul road installation": {
    desc: "Temporary haul road installation involves creating short-term heavy-duty routes for construction traffic using stone, mats or similar systems. It must support expected loads without excessive rutting, while protecting the underlying ground and environment.",
    hazards: ["moving_vehicles", "plant_machinery", "heavy_plant", "environmental_weather", "slips_trips"],
    questions: [
      { id: "q1", label: "Has the route and design for the temporary haul road installation been coordinated with overall site logistics?" },
      { id: "q2", label: "Are bearing capacities and loading limits for the temporary haul road installation understood by operators?" },
      { id: "q3", label: "Are edge protection and crossing points for pedestrians addressed in the temporary haul road installation plan?" },
      { id: "q4", label: "Is there a maintenance regime for the temporary haul road installation to repair damage or rutting?" },
      { id: "q5", label: "Are environmental controls in place to prevent contamination from the temporary haul road installation run-off?" }
    ]
  },

  // 50
  "Other (Custom)": {
    desc: "Other (Custom) covers a bespoke or non-standard groundworks or civils activity outside the predefined tasks. The supervisor must define the scope, sequence and risks before work starts. Standard controls for plant, excavations, traffic management and manual handling still apply where relevant.",
    hazards: [],
    questions: [
      { id: "q1", label: "Have you written a clear description of the Other (Custom) task so all operatives understand what is required?" },
      { id: "q2", label: "Have you identified all significant hazards for this Other (Custom) task and documented suitable controls?" },
      { id: "q3", label: "Are only competent and experienced operatives allocated to carry out this Other (Custom) task?" },
      { id: "q4", label: "Have access, egress and emergency arrangements been agreed before starting this Other (Custom) task?" },
      { id: "q5", label: "Will the risk assessment and method statement for this Other (Custom) task be reviewed if site conditions change?" }
    ]
  }
};

// ==========================================
// X. JOB CLUSTERS (DEMOLITION & STRIP-OUT)
// ==========================================

const DEMOLITION_STRIPOUT_CLUSTERS: Record<string, JobCluster> = {
  "Internal soft strip (domestic)": {
    desc: "Internal soft strip (domestic) covers removal of non-structural fittings, fixtures and finishes within occupied or recently vacated houses or flats. Typical items include kitchen units, sanitaryware, internal doors, skirtings, floor coverings and redundant services. Work is planned to protect remaining finishes, isolate services and control dust and noise for neighbours and occupants. Waste streams are segregated and removed in a controlled manner to keep routes clear and safe.",
    hazards: ["manual_handling", "dust_fumes", "slips_trips", "glass_sharps", "poor_lighting"],
    questions: [
      { id: "q1", label: "Have all live services been isolated and verified dead before starting the internal soft strip (domestic)?" },
      { id: "q2", label: "Are clear access and egress routes agreed for the internal soft strip (domestic) to avoid blocking escape routes?" },
      { id: "q3", label: "Is there a plan for dust suppression and ventilation during the internal soft strip (domestic)?" },
      { id: "q4", label: "Are arrangements in place for segregated waste removal for the internal soft strip (domestic)?" },
      { id: "q5", label: "Have fragile items such as glazing and mirrors been identified before the internal soft strip (domestic) begins?" }
    ]
  },

  "Internal soft strip (commercial)": {
    desc: "Internal soft strip (commercial) covers removal of non-structural fittings, fixtures and finishes in offices, shops and other commercial units. Works can include removal of partitions, ceilings, raised floors, furniture and redundant services while maintaining safe access for other occupiers or trades. Noise, dust and vibration are managed to minimise disruption to neighbouring businesses. Sequence and loading of debris are controlled to avoid overloading floors or routes.",
    hazards: ["manual_handling", "dust_fumes", "noise_vibration", "slips_trips", "public_interface"],
    questions: [
      { id: "q1", label: "Has a clear working area been defined and segregated for the internal soft strip (commercial)?" },
      { id: "q2", label: "Are other building users aware of the internal soft strip (commercial) and any restricted zones?" },
      { id: "q3", label: "Is there a plan to manage noise and vibration during the internal soft strip (commercial) to avoid undue disruption?" },
      { id: "q4", label: "Have loading limits on floors been checked before stockpiling waste from the internal soft strip (commercial)?" },
      { id: "q5", label: "Are suitable waste chutes, lifts or routes agreed for debris removal from the internal soft strip (commercial)?" }
    ]
  },

  "Kitchen strip-out": {
    desc: "Kitchen strip-out involves removing existing units, worktops, appliances, splashbacks, floor finishes and associated services ready for refurbishment. Electrical, gas and water services must be correctly isolated and any hazardous materials identified before work begins. Care is taken to protect retained finishes and control dust and noise. All waste is removed safely, leaving a clean and safe shell for new installation works.",
    hazards: ["manual_handling", "dust_fumes", "glass_sharps", "slips_trips", "services_isolation"],
    questions: [
      { id: "q1", label: "Have gas, water and electrical supplies been fully isolated and labelled prior to the kitchen strip-out?" },
      { id: "q2", label: "Is there adequate protection to adjacent finishes and retained items during the kitchen strip-out?" },
      { id: "q3", label: "Are appliances and worktops being lifted using safe manual handling techniques during the kitchen strip-out?" },
      { id: "q4", label: "Is there a plan for safely removing and disposing of glass doors and splashbacks during the kitchen strip-out?" },
      { id: "q5", label: "Has a clear waste removal route been agreed to minimise trips during the kitchen strip-out?" }
    ]
  },

  "Bathroom strip-out": {
    desc: "Bathroom strip-out includes removal of sanitaryware, tiles, enclosures, ceilings, wall linings and floor finishes in preparation for new works. Water and electrical circuits must be isolated and made safe before removals commence. Particular attention is paid to sharp edges, breaking ceramic and slippery wet areas. The work area is kept clean and dry to maintain safe footing throughout.",
    hazards: ["manual_handling", "dust_fumes", "glass_sharps", "slips_trips", "water_ingress"],
    questions: [
      { id: "q1", label: "Have all water feeds and wastes been isolated and drained down before the bathroom strip-out?" },
      { id: "q2", label: "Are electrical circuits serving the bathroom strip-out area isolated and confirmed dead?" },
      { id: "q3", label: "Is there sufficient ventilation or dust extraction in place during tile removal for the bathroom strip-out?" },
      { id: "q4", label: "Are measures in place to manage sharp fragments from broken ceramic during the bathroom strip-out?" },
      { id: "q5", label: "Has the floor surface been kept free of water and debris to control slip risk during the bathroom strip-out?" }
    ]
  },

  "Office strip-out": {
    desc: "Office strip-out covers removal of partitions, ceilings, raised floors, lighting, small power, data, furniture and finishes to return a space to shell or CAT A. Works are sequenced to maintain safe access and fire escape routes at all times. Live services are clearly identified and either isolated or protected. Coordination with building management is critical to manage noise, working hours and waste removal.",
    hazards: ["manual_handling", "dust_fumes", "slips_trips", "public_interface", "noise_vibration"],
    questions: [
      { id: "q1", label: "Have working hours and noisy periods for the office strip-out been agreed with building management?" },
      { id: "q2", label: "Are live landlord services identified and protected before commencing the office strip-out?" },
      { id: "q3", label: "Is there a traffic management plan for moving stripped materials during the office strip-out?" },
      { id: "q4", label: "Are safe access routes and fire exits maintained and signed throughout the office strip-out?" },
      { id: "q5", label: "Is suitable manual handling equipment available for heavy items during the office strip-out?" }
    ]
  },

  "Shop / retail strip-out": {
    desc: "Shop / retail strip-out includes removal of displays, counters, ceilings, services and back-of-house fixtures while controlling disruption in public-facing environments. Works are often done out of hours to minimise risk to the public. The site is securely hoarded or screened from live trading areas and clear segregation is maintained. Waste streams are controlled to avoid obstructing shared malls or pavements.",
    hazards: ["manual_handling", "public_interface", "dust_fumes", "slips_trips", "security_risk"],
    questions: [
      { id: "q1", label: "Has a secure hoarding or barrier system been agreed for the shop / retail strip-out?" },
      { id: "q2", label: "Are out-of-hours working arrangements in place where required for the shop / retail strip-out?" },
      { id: "q3", label: "Is there a plan for controlling dust and noise where the shop / retail strip-out adjoins trading areas?" },
      { id: "q4", label: "Are waste routes for the shop / retail strip-out agreed with centre management to avoid conflict with the public?" },
      { id: "q5", label: "Have security arrangements been agreed to protect tools and materials during the shop / retail strip-out?" }
    ]
  },

  "Restaurant / kitchen strip-out": {
    desc: "Restaurant / kitchen strip-out covers removal of commercial catering equipment, extraction canopies, ductwork, coldrooms, bars and associated services. There is often heavy, greasy contamination and potential fire residues within ductwork and extract paths. Gas, water and electrical feeds must be carefully identified and isolated. Access equipment may be required to dismantle high-level services and canopies safely.",
    hazards: ["manual_handling", "dust_fumes", "fire_explosion", "slips_trips", "work_at_height"],
    questions: [
      { id: "q1", label: "Have all catering gas supplies and isolation valves been positively identified before the restaurant / kitchen strip-out starts?" },
      { id: "q2", label: "Is there a safe method for dismantling and lowering heavy extract canopies during the restaurant / kitchen strip-out?" },
      { id: "q3", label: "Are operatives protected from grease and residues that may affect grip during the restaurant / kitchen strip-out?" },
      { id: "q4", label: "Is suitable access equipment planned for high-level ductwork during the restaurant / kitchen strip-out?" },
      { id: "q5", label: "Has a plan been agreed for disposing of contaminated ductwork and filters from the restaurant / kitchen strip-out?" }
    ]
  },

  "Warehouse strip-out": {
    desc: "Warehouse strip-out covers removal of racking, mezzanines, conveyor systems, services and internal structures within large industrial spaces. Works involve plant use, working at height and significant manual handling of steelwork and decking. Traffic management is critical where forklifts or MEWPs are in use. Loads are controlled to avoid overloading floors and to maintain building stability.",
    hazards: ["work_at_height", "plant_machinery", "manual_handling", "falling_objects", "moving_vehicles"],
    questions: [
      { id: "q1", label: "Is there a written lifting and dismantling sequence for racking during the warehouse strip-out?" },
      { id: "q2", label: "Have exclusion zones been set up under areas where high-level work occurs in the warehouse strip-out?" },
      { id: "q3", label: "Is there a traffic management plan for forklifts and MEWPs during the warehouse strip-out?" },
      { id: "q4", label: "Are operatives briefed on safe techniques for handling long and awkward members in the warehouse strip-out?" },
      { id: "q5", label: "Have anchorage points and fixings been identified before dismantling structures in the warehouse strip-out?" }
    ]
  },

  "Ceiling grid removal": {
    desc: "Ceiling grid removal involves taking down suspended ceilings, tiles and hangers to expose the soffit and services. Work is carried out systematically to avoid uncontrolled collapse and to manage debris. Dust, fibres and possible contamination from above-ceiling voids are controlled using suitable PPE and containment. Any retained services are supported independently before grid elements are removed.",
    hazards: ["work_at_height", "dust_fumes", "falling_objects", "manual_handling", "poor_lighting"],
    questions: [
      { id: "q1", label: "Is the ceiling grid removal planned in sections to prevent large uncontrolled collapse?" },
      { id: "q2", label: "Are services above the ceiling grid removal area identified and supported before hangers are cut?" },
      { id: "q3", label: "Is adequate respiratory and eye protection specified for ceiling grid removal work?" },
      { id: "q4", label: "Have exclusion zones been established under the area of ceiling grid removal?" },
      { id: "q5", label: "Is there sufficient temporary lighting once tiles are removed during the ceiling grid removal?" }
    ]
  },

  "Stud partition removal": {
    desc: "Stud partition removal includes taking down lightweight metal or timber stud walls, linings and doors without affecting structural elements. Checks are made first to confirm that partitions are non-load-bearing and to identify any services concealed within them. Debris is controlled as sections are removed, and adjacent finishes are protected. Openings are made safe with edge protection where necessary.",
    hazards: ["manual_handling", "dust_fumes", "falling_objects", "slips_trips", "services_isolation"],
    questions: [
      { id: "q1", label: "Has it been confirmed that the stud partition removal works do not affect load-bearing or structural walls?" },
      { id: "q2", label: "Have services within or on the walls been identified and isolated before stud partition removal?" },
      { id: "q3", label: "Is demolition of partitions sequenced to avoid pushing large sections into walkways during stud partition removal?" },
      { id: "q4", label: "Are operatives using suitable dust suppression or extraction during stud partition removal?" },
      { id: "q5", label: "Is the floor kept clear of studs and fixings to control slips and trips during stud partition removal?" }
    ]
  },

  "Blockwork wall demolition": {
    desc: "Blockwork wall demolition involves breaking down non-load-bearing masonry walls using hand tools or light mechanical equipment. Before works start, the wall is checked for any structural role, ties or services. Demolition is carried out from the top down in controlled sections, with debris managed to avoid overloading floors. Adequate dust control and noise protection are put in place.",
    hazards: ["manual_handling", "dust_fumes", "silica_dust", "falling_objects", "slips_trips"],
    questions: [
      { id: "q1", label: "Has a competent person confirmed that the blockwork wall demolition does not affect structural stability?" },
      { id: "q2", label: "Is demolition of blockwork carried out from the top down in small sections?" },
      { id: "q3", label: "Are measures in place to control silica dust during blockwork wall demolition?" },
      { id: "q4", label: "Is waste from the blockwork wall demolition being removed regularly to avoid floor overloading?" },
      { id: "q5", label: "Are operatives protected from falling fragments during blockwork wall demolition?" }
    ]
  },

  "Load-bearing wall removal (propped)": {
    desc: "Load-bearing wall removal (propped) involves creating openings or removing masonry that supports other elements of the structure. Temporary works such as needles, props or beams are installed in accordance with an engineer's design before any demolition begins. Works are strictly sequenced to maintain stability at all stages. All operatives are briefed on the temporary works arrangement and exclusion zones are enforced beneath supported elements.",
    hazards: ["structural_collapse", "falling_objects", "manual_handling", "dust_fumes", "silica_dust"],
    questions: [
      { id: "q1", label: "Has a structural engineer provided design and details for the load-bearing wall removal (propped)?" },
      { id: "q2", label: "Are temporary works installed, checked and signed off before starting the load-bearing wall removal (propped)?" },
      { id: "q3", label: "Are exclusion zones in place beneath any props or needles used for the load-bearing wall removal (propped)?" },
      { id: "q4", label: "Is demolition of masonry sequenced to avoid undermining supports during the load-bearing wall removal (propped)?" },
      { id: "q5", label: "Are records kept of inspections to the temporary works during the load-bearing wall removal (propped)?" }
    ]
  },

  "Chimney breast removal": {
    desc: "Chimney breast removal involves dismantling internal chimney projections and associated masonry, often over several storeys. Structural support to remaining masonry and floors is required based on engineered details. Work is carried out carefully to prevent debris falling down flues or into occupied areas. Dust is controlled and flues are sealed where necessary.",
    hazards: ["structural_collapse", "work_at_height", "manual_handling", "dust_fumes", "falling_objects"],
    questions: [
      { id: "q1", label: "Has a structural design been obtained for the chimney breast removal, including any gallows brackets or beams?" },
      { id: "q2", label: "Are upper chimney sections supported or removed in a controlled sequence during chimney breast removal?" },
      { id: "q3", label: "Have flues been sealed and protected to prevent debris spread during chimney breast removal?" },
      { id: "q4", label: "Is work at height for chimney breast removal carried out using suitable access equipment?" },
      { id: "q5", label: "Are waste arisings from chimney breast removal removed regularly to avoid overloading floors?" }
    ]
  },

  "Fireplace removal and make-good": {
    desc: "Fireplace removal and make-good includes taking out surrounds, hearths, lintels and associated finishes, then making the opening safe and ready for infill. Checks are made for any structural reliance on existing lintels. Dust, soot and sharp fragments are controlled using sheeting and PPE. The opening is made safe with suitable support or closure in line with the refurbishment plan.",
    hazards: ["manual_handling", "dust_fumes", "glass_sharps", "slips_trips", "structural_collapse"],
    questions: [
      { id: "q1", label: "Has the structural role of the existing lintel been assessed before fireplace removal and make-good?" },
      { id: "q2", label: "Are soot and dust from fireplace removal and make-good controlled using sheeting and extraction?" },
      { id: "q3", label: "Is there a plan for handling heavy hearth stones safely during fireplace removal and make-good?" },
      { id: "q4", label: "Have sharp tiles and glass been identified and controlled as part of fireplace removal and make-good?" },
      { id: "q5", label: "Will the opening be left in a structurally sound and safe condition after fireplace removal and make-good?" }
    ]
  },

  "Floor covering removal (carpet/vinyl)": {
    desc: "Floor covering removal (carpet/vinyl) involves stripping existing soft or resilient finishes, including adhesive residues where specified. Work is planned to avoid trip hazards from partially removed coverings and to manage dust from scraping activities. Manual handling controls are used for heavy rolls and bundles. Floors are left in a safe, clean condition for follow-on trades.",
    hazards: ["manual_handling", "slips_trips", "dust_fumes", "poor_lighting"],
    questions: [
      { id: "q1", label: "Are floor areas sectioned so that floor covering removal (carpet/vinyl) does not create trip hazards in escape routes?" },
      { id: "q2", label: "Is suitable scraping or stripping equipment available for floor covering removal (carpet/vinyl)?" },
      { id: "q3", label: "Are heavy rolls from floor covering removal (carpet/vinyl) being lifted using correct manual handling techniques?" },
      { id: "q4", label: "Is dust from adhesive removal controlled during floor covering removal (carpet/vinyl)?" },
      { id: "q5", label: "Are floors made level and free of residues after floor covering removal (carpet/vinyl)?" }
    ]
  },

  "Timber floorboard removal": {
    desc: "Timber floorboard removal involves lifting existing boards to access voids, services or for replacement. There is risk of opening large floor holes and exposing uneven joists. Work is sequenced so that edge protection or temporary covers are installed wherever boards are taken up. Nails and fixings are removed or bent over to prevent puncture injuries.",
    hazards: ["slips_trips", "falling_objects", "manual_handling", "sharp_objects", "poor_lighting"],
    questions: [
      { id: "q1", label: "Are areas of timber floorboard removal clearly marked and protected against falls between joists?" },
      { id: "q2", label: "Is there a safe system for collecting nails and fixings during timber floorboard removal?" },
      { id: "q3", label: "Are temporary covers used where floorboard removal exposes voids in traffic routes?" },
      { id: "q4", label: "Is adequate lighting provided in voids revealed by timber floorboard removal?" },
      { id: "q5", label: "Are boards handled and stacked safely following timber floorboard removal?" }
    ]
  },

  "Concrete slab breakout (internal)": {
    desc: "Concrete slab breakout (internal) covers breaking and removal of internal concrete floors or plinths using breakers and small plant. The work generates noise, vibration and dust, which must be controlled. Existing services beneath or within the slab are located before breaking starts. Debris is removed systematically to avoid trip hazards and overloading.",
    hazards: ["silica_dust", "dust_fumes", "noise_vibration", "manual_handling", "slips_trips"],
    questions: [
      { id: "q1", label: "Have all embedded or underlying services been identified before starting concrete slab breakout (internal)?" },
      { id: "q2", label: "Is suitable respiratory protection provided for concrete slab breakout (internal)?" },
      { id: "q3", label: "Are vibration exposure limits controlled for operatives during concrete slab breakout (internal)?" },
      { id: "q4", label: "Is debris from concrete slab breakout (internal) removed regularly to keep walkways clear?" },
      { id: "q5", label: "Have neighbouring occupiers been informed of noise from concrete slab breakout (internal)?" }
    ]
  },

  "Concrete slab breakout (external)": {
    desc: "Concrete slab breakout (external) covers breaking out external pads, yards, steps or hardstandings using breakers and small plant. Works consider buried services, adjacent structures and control of flying debris. Dust and noise are managed with water suppression and PPE. Traffic management controls are used where works adjoin live roads or paths.",
    hazards: ["silica_dust", "dust_fumes", "noise_vibration", "moving_vehicles", "environmental_weather"],
    questions: [
      { id: "q1", label: "Have buried services been traced before external concrete slab breakout starts?" },
      { id: "q2", label: "Is water suppression planned for dust control during concrete slab breakout (external)?" },
      { id: "q3", label: "Is there a barrier or signage system to segregate the public during concrete slab breakout (external)?" },
      { id: "q4", label: "Are weather conditions monitored so concrete slab breakout (external) stops in high winds or heavy rain?" },
      { id: "q5", label: "Are noise levels from concrete slab breakout (external) considered for neighbouring properties?" }
    ]
  },

  "Staircase removal (timber)": {
    desc: "Staircase removal (timber) involves dismantling internal timber stairs, balustrades and associated finishes. Temporary access or alternative routes are established before the existing stair is taken out. The structure is removed from top to bottom, with components lowered carefully to avoid damaging surrounding finishes. Edge protection is installed where openings remain temporarily.",
    hazards: ["work_at_height", "falling_objects", "manual_handling", "slips_trips", "structural_collapse"],
    questions: [
      { id: "q1", label: "Is an alternative safe means of access provided before staircase removal (timber) starts?" },
      { id: "q2", label: "Is staircase removal (timber) sequenced from top down to control falling components?" },
      { id: "q3", label: "Are suitable fall protection measures in place once the staircase removal (timber) is complete?" },
      { id: "q4", label: "Are large timber components from staircase removal (timber) handled safely to avoid strain injuries?" },
      { id: "q5", label: "Has the impact of staircase removal (timber) on fire escape routes been assessed?" }
    ]
  },

  "Staircase removal (concrete/steel)": {
    desc: "Staircase removal (concrete/steel) covers cutting, breaking and dismantling heavier stair structures using mechanical means. Temporary works and alternative access routes are designed prior to removal. Lifting or support equipment may be needed to handle large sections. Work generates significant noise, vibration and dust which must be planned and controlled.",
    hazards: ["structural_collapse", "work_at_height", "noise_vibration", "silica_dust", "manual_handling"],
    questions: [
      { id: "q1", label: "Has a temporary works design been completed for staircase removal (concrete/steel)?" },
      { id: "q2", label: "Is a lifting plan in place for heavy elements during staircase removal (concrete/steel)?" },
      { id: "q3", label: "Are noise and vibration from staircase removal (concrete/steel) managed in line with site controls?" },
      { id: "q4", label: "Is dust extraction or suppression provided during cutting for staircase removal (concrete/steel)?" },
      { id: "q5", label: "Are new or temporary access routes clearly signed before staircase removal (concrete/steel) begins?" }
    ]
  },

  "Garage demolition (single)": {
    desc: "Garage demolition (single) involves dismantling or demolishing a small standalone garage structure, typically brick, block or timber with a lightweight roof. Structural stability and collapse sequence are considered before starting. Asbestos cement roofs and old finishes are assumed until proven otherwise and treated accordingly. The work area is securely fenced and debris removed promptly.",
    hazards: ["structural_collapse", "asbestos", "manual_handling", "moving_vehicles", "falling_objects"],
    questions: [
      { id: "q1", label: "Has the garage demolition (single) been checked for asbestos-containing materials, particularly roof sheets?" },
      { id: "q2", label: "Is there a planned collapse or dismantling sequence for the garage demolition (single)?" },
      { id: "q3", label: "Are exclusion zones and fencing in place around the garage demolition (single)?" },
      { id: "q4", label: "Are manual handling and plant use balanced appropriately for the garage demolition (single)?" },
      { id: "q5", label: "Has waste from the garage demolition (single) been classified and disposal routes confirmed?" }
    ]
  },

  "Outbuilding / shed demolition": {
    desc: "Outbuilding / shed demolition involves removing small timber, metal or lightweight structures in gardens or yards. The structure is checked for services, asbestos and stability before dismantling. Work is sequenced so roof coverings are removed safely before walls are taken down. Ground conditions and access for waste removal are assessed in advance.",
    hazards: ["manual_handling", "asbestos", "environmental_weather", "slips_trips", "falling_objects"],
    questions: [
      { id: "q1", label: "Has the outbuilding / shed demolition been checked for hidden services and asbestos-containing materials?" },
      { id: "q2", label: "Is the outbuilding / shed demolition sequenced to remove roof coverings before wall collapse?" },
      { id: "q3", label: "Are safe access routes established for carrying debris from the outbuilding / shed demolition?" },
      { id: "q4", label: "Are weather conditions monitored to avoid wind-related hazards during outbuilding / shed demolition?" },
      { id: "q5", label: "Is waste from the outbuilding / shed demolition segregated and stored safely pending removal?" }
    ]
  },

  "Conservatory demolition": {
    desc: "Conservatory demolition covers dismantling glazed structures attached to domestic properties, often with lightweight roofs and UPVC or aluminium frames. Glass panes and roof panels are removed carefully before framing is dismantled. Junctions with the main building are managed to avoid damage to retained walls and finishes. Access and protection to garden areas and neighbours are planned.",
    hazards: ["glass_sharps", "work_at_height", "manual_handling", "slips_trips", "public_interface"],
    questions: [
      { id: "q1", label: "Is there a method for safely removing and handling glazing during conservatory demolition?" },
      { id: "q2", label: "Are roof sections lowered in a controlled manner during conservatory demolition?" },
      { id: "q3", label: "Is adjacent property protected from falling debris during conservatory demolition?" },
      { id: "q4", label: "Are garden routes and surfaces assessed for stability when moving waste from conservatory demolition?" },
      { id: "q5", label: "Has the impact on neighbours and boundary lines been considered before conservatory demolition?" }
    ]
  },

  "Brick boundary wall demolition": {
    desc: "Brick boundary wall demolition involves taking down garden or site perimeter walls. Stability, height and condition of the wall are reviewed before starting. Works may involve section-by-section take-down or use of plant depending on environment. Public safety is critical where works adjoin pavements or roads, requiring suitable barriers and signage.",
    hazards: ["structural_collapse", "falling_objects", "public_interface", "manual_handling", "dust_fumes"],
    questions: [
      { id: "q1", label: "Have you agreed a safe working zone and barrier system for brick boundary wall demolition?" },
      { id: "q2", label: "Is brick boundary wall demolition being carried out from the top down in controlled sections?" },
      { id: "q3", label: "Is there a plan to control dust during brick boundary wall demolition?" },
      { id: "q4", label: "Are neighbouring properties and public areas protected from flying debris during brick boundary wall demolition?" },
      { id: "q5", label: "Is waste from brick boundary wall demolition removed regularly to maintain visibility and access?" }
    ]
  },

  "Garden structure removal (pergola/deck)": {
    desc: "Garden structure removal (pergola/deck) includes dismantling timber or lightweight structures, posts and associated fixings. Rot, instability and embedded fixings are assessed before works begin. The work area is managed to protect planting, paving and adjacent property. Posts and framing are removed carefully to avoid sudden collapse.",
    hazards: ["manual_handling", "slips_trips", "sharp_objects", "environmental_weather"],
    questions: [
      { id: "q1", label: "Has the stability of pergolas or decks been assessed before garden structure removal starts?" },
      { id: "q2", label: "Are ground conditions safe for access and waste movement during garden structure removal (pergola/deck)?" },
      { id: "q3", label: "Is there a method for dealing with embedded fixings during garden structure removal (pergola/deck)?" },
      { id: "q4", label: "Are sharp edges and nails controlled during garden structure removal (pergola/deck)?" },
      { id: "q5", label: "Is there adequate lighting if garden structure removal (pergola/deck) takes place at low light levels?" }
    ]
  },

  "Roof strip (tiles/slates)": {
    desc: "Roof strip (tiles/slates) covers removal of pitched roof coverings, battens and felt to expose the structure. Work at height controls are critical, typically using scaffolds, edge protection and debris netting. Materials are stripped in planned sections to avoid unstable areas. Waste is lowered safely to ground level without overloading roofs or scaffolds.",
    hazards: ["work_at_height", "falling_objects", "environmental_weather", "manual_handling", "fragile_surfaces"],
    questions: [
      { id: "q1", label: "Is full perimeter edge protection in place before roof strip (tiles/slates) begins?" },
      { id: "q2", label: "Have fragile areas such as rooflights been identified and protected during roof strip (tiles/slates)?" },
      { id: "q3", label: "Is there a plan for safe lowering of stripped materials during roof strip (tiles/slates)?" },
      { id: "q4", label: "Are weather forecasts reviewed so roof strip (tiles/slates) is halted in high winds or storms?" },
      { id: "q5", label: "Are operatives trained and briefed on safe access and egress for roof strip (tiles/slates)?" }
    ]
  },

  "Flat roof strip (felt/insulation)": {
    desc: "Flat roof strip (felt/insulation) involves removing multi-layer felt systems, insulation boards, ballast and associated components. Hot works may be involved where torched systems or asphalt are present. Roof drainage and temporary weather protection are considered before stripping large areas. Waste and tools are managed to prevent trip hazards on the roof.",
    hazards: ["work_at_height", "hot_work", "environmental_weather", "manual_handling", "slips_trips"],
    questions: [
      { id: "q1", label: "Is edge protection and access equipment in place prior to flat roof strip (felt/insulation)?" },
      { id: "q2", label: "Are hot work permits and controls required for flat roof strip (felt/insulation)?" },
      { id: "q3", label: "Is temporary waterproofing planned if flat roof strip (felt/insulation) cannot be completed in one phase?" },
      { id: "q4", label: "Is the flat roof kept free of tripping hazards during flat roof strip (felt/insulation)?" },
      { id: "q5", label: "Are waste routes and loading points agreed for flat roof strip (felt/insulation)?" }
    ]
  },

  "Non-licensed asbestos cement sheet removal": {
    desc: "Non-licensed asbestos cement sheet removal covers controlled removal of low-risk asbestos cement roofing or cladding by trained operatives under non-licensed conditions. Work follows strict procedures including wetting, minimal breakage, controlled handling and double-wrapping of waste. The area is segregated and warning signage is displayed. Airborne fibre release is minimised through careful technique and housekeeping.",
    hazards: ["asbestos", "work_at_height", "manual_handling", "environmental_weather"],
    questions: [
      { id: "q1", label: "Are operatives trained and briefed in non-licensed asbestos cement sheet removal procedures?" },
      { id: "q2", label: "Is appropriate segregation, signage and notification in place for asbestos cement sheet removal?" },
      { id: "q3", label: "Are sheets removed whole and dampened to reduce breakage during asbestos cement sheet removal?" },
      { id: "q4", label: "Is asbestos waste from asbestos cement sheet removal double-bagged and consigned correctly?" },
      { id: "q5", label: "Are weather conditions suitable to prevent sheet movement during asbestos cement sheet removal?" }
    ]
  },

  "Plant room strip-out": {
    desc: "Plant room strip-out covers removal of pumps, valves, pipework, electrical panels and supports within service spaces. All services are safely isolated and drained or purged as required before dismantling. Heavy components may require lifting plans and equipment. The environment can be confined and noisy, requiring ventilation and coordination with other services.",
    hazards: ["manual_handling", "confined_space", "dust_fumes", "noise_vibration", "services_isolation"],
    questions: [
      { id: "q1", label: "Have all mechanical and electrical services been positively isolated before plant room strip-out?" },
      { id: "q2", label: "Is there a lifting plan for heavy components involved in plant room strip-out?" },
      { id: "q3", label: "Is ventilation provided where plant room strip-out takes place in confined or poorly ventilated areas?" },
      { id: "q4", label: "Are noise levels from plant room strip-out within agreed site limits?" },
      { id: "q5", label: "Is access to plant room strip-out areas controlled to authorised personnel only?" }
    ]
  },

  "Boiler decommission & strip-out": {
    desc: "Boiler decommission & strip-out involves isolating, draining and removing boilers, flues and associated plant. Gas, oil and electrical supplies must be made safe in accordance with regulations. Residual fuels and water are managed to prevent spillage and environmental harm. Flues and chimneys are dismantled safely with consideration for structural ties.",
    hazards: ["gas", "fire_explosion", "manual_handling", "dust_fumes", "services_isolation"],
    questions: [
      { id: "q1", label: "Has a competent Gas Safe or equivalent engineer decommissioned supplies before boiler decommission & strip-out?" },
      { id: "q2", label: "Are residual fuels and water managed safely during boiler decommission & strip-out?" },
      { id: "q3", label: "Is there a safe system for breaking down and removing flues during boiler decommission & strip-out?" },
      { id: "q4", label: "Are ignition sources controlled where combustible residues may be present during boiler decommission & strip-out?" },
      { id: "q5", label: "Is waste from boiler decommission & strip-out disposed of via appropriate routes?" }
    ]
  },

  "Tank and cylinder removal": {
    desc: "Tank and cylinder removal involves draining, cleaning and dismantling hot water cylinders, storage tanks and associated pipework. Structural support for large tanks is assessed before removal. Confined space and contamination risks may arise in roof spaces or plantrooms. Wastewater and residues are managed to avoid damage to finishes and the environment.",
    hazards: ["manual_handling", "confined_space", "water_ingress", "biological"],
    questions: [
      { id: "q1", label: "Has all water been fully drained and isolated before tank and cylinder removal starts?" },
      { id: "q2", label: "Are supports and platforms checked for integrity before tank and cylinder removal?" },
      { id: "q3", label: "Is space and lighting adequate where tank and cylinder removal occurs in lofts or tight plant areas?" },
      { id: "q4", label: "Are potential biological hazards from stagnant water considered during tank and cylinder removal?" },
      { id: "q5", label: "Is there a plan to manage spills and leaks during tank and cylinder removal?" }
    ]
  },

  "Ceiling artex/texture scraping (non-licensed)": {
    desc: "Ceiling artex/texture scraping (non-licensed) involves controlled removal of textured coatings where they fall under non-licensed asbestos work, following appropriate testing and procedures. Surfaces are pre-treated to minimise dust and fibre release. The area is segregated and cleaned using suitable methods. Waste is treated as asbestos-containing where required.",
    hazards: ["asbestos", "dust_fumes", "work_at_height", "poor_lighting"],
    questions: [
      { id: "q1", label: "Has testing confirmed whether textured coatings fall under non-licensed asbestos work before ceiling artex scraping?" },
      { id: "q2", label: "Is segregation and signage in place for ceiling artex/texture scraping (non-licensed)?" },
      { id: "q3", label: "Are damping and scraping methods used to minimise dust during ceiling artex/texture scraping (non-licensed)?" },
      { id: "q4", label: "Is suitable access and lighting provided for ceiling artex/texture scraping (non-licensed)?" },
      { id: "q5", label: "Is waste from ceiling artex/texture scraping (non-licensed) bagged and labelled correctly?" }
    ]
  },

  "Fire-damaged strip-out": {
    desc: "Fire-damaged strip-out involves removal of charred, smoke-damaged and structurally compromised materials after a fire incident. Surfaces may be unstable, contaminated and sharp. Air quality, soot and residues are managed with enhanced PPE and ventilation. Structural assessments are completed before entry and progressive strip-out.",
    hazards: ["fire_explosion", "structural_collapse", "dust_fumes", "biological", "sharp_objects"],
    questions: [
      { id: "q1", label: "Has a competent person confirmed structural stability before fire-damaged strip-out begins?" },
      { id: "q2", label: "Is enhanced PPE specified for soot and contamination during fire-damaged strip-out?" },
      { id: "q3", label: "Are access routes and floor surfaces checked for weakness during fire-damaged strip-out?" },
      { id: "q4", label: "Is waste from fire-damaged strip-out segregated and handled as potentially contaminated material?" },
      { id: "q5", label: "Is ventilation provided to control airborne contaminants during fire-damaged strip-out?" }
    ]
  },

  "Water-damaged strip-out": {
    desc: "Water-damaged strip-out covers removal of saturated finishes, plasterboard, floor coverings and insulation following leaks or flooding. There is risk from mould growth, weakened structures and electrical hazards. Work is sequenced to remove affected materials while maintaining safe access. Dehumidification and drying are coordinated with strip-out activities.",
    hazards: ["water_ingress", "biological", "slips_trips", "manual_handling", "live_electricity"],
    questions: [
      { id: "q1", label: "Have electrical systems been isolated or checked safe prior to water-damaged strip-out?" },
      { id: "q2", label: "Is mould or contamination risk assessed and controlled during water-damaged strip-out?" },
      { id: "q3", label: "Are saturated materials handled using safe manual handling techniques during water-damaged strip-out?" },
      { id: "q4", label: "Are slip hazards from water-damaged strip-out controlled by regular cleaning and matting?" },
      { id: "q5", label: "Is a drying plan in place following water-damaged strip-out?" }
    ]
  },

  "M&E services strip-out (dead)": {
    desc: "M&E services strip-out (dead) involves removal of redundant mechanical and electrical services that have been fully isolated. Works include cable trays, pipework, ductwork, terminal units and plant connections. Verification that all services are dead is critical before cutting or dismantling. High-level works require suitable access and fall protection.",
    hazards: ["services_isolation", "work_at_height", "manual_handling", "plant_machinery"],
    questions: [
      { id: "q1", label: "Has formal confirmation been obtained that all M&E services involved in strip-out are dead?" },
      { id: "q2", label: "Is suitable access equipment used for high-level M&E services strip-out (dead)?" },
      { id: "q3", label: "Are heavy duct and pipe sections lowered in a controlled manner during M&E services strip-out (dead)?" },
      { id: "q4", label: "Are cable and pipe routes clearly identified to avoid removing live services during M&E strip-out (dead)?" },
      { id: "q5", label: "Is waste metal from M&E services strip-out (dead) stored securely before removal?" }
    ]
  },

  "Raised access floor removal": {
    desc: "Raised access floor removal involves lifting floor tiles, pedestals and stringers to expose the structural slab below. Care is taken not to damage underlying services. Openings are protected with barriers or covers to prevent falls. Tiles and pedestals are stacked safely and removed systematically.",
    hazards: ["slips_trips", "manual_handling", "poor_lighting", "services_isolation"],
    questions: [
      { id: "q1", label: "Are void openings protected during raised access floor removal to prevent falls?" },
      { id: "q2", label: "Are services within the floor void identified and protected during raised access floor removal?" },
      { id: "q3", label: "Are tiles and pedestals stacked safely during raised access floor removal?" },
      { id: "q4", label: "Is lighting adequate within void spaces during raised access floor removal?" },
      { id: "q5", label: "Is there a clear plan for waste removal and recycling from raised access floor removal?" }
    ]
  },

  "Toilet block strip-out": {
    desc: "Toilet block strip-out covers removal of cubicles, sanitaryware, IPS panels, ceilings and floor finishes in washroom areas. Water and electrical services are isolated and any concealed services identified before strip-out. Work generates sharp fragments and contamination from old pipework and sanitary fittings. The area is kept hygienic and slip hazards controlled.",
    hazards: ["manual_handling", "water_ingress", "biological", "slips_trips", "dust_fumes"],
    questions: [
      { id: "q1", label: "Have water and power been isolated to all relevant areas before toilet block strip-out?" },
      { id: "q2", label: "Are hygienic controls in place for dealing with old sanitaryware during toilet block strip-out?" },
      { id: "q3", label: "Are sharp edges managed from removed fixtures during toilet block strip-out?" },
      { id: "q4", label: "Is adequate ventilation provided during toilet block strip-out?" },
      { id: "q5", label: "Is the floor kept dry and clear of debris throughout the toilet block strip-out?" }
    ]
  },

  "Lift lobby and car interior strip-out (non-lift removal)": {
    desc: "Lift lobby and car interior strip-out involves removing finishes, ceilings, doors, call stations and car linings without interfering with lift safety systems or machinery. Works are coordinated with lift specialists and building management. The lift is taken out of service where required. Fall and entrapment risks are managed carefully around doorways and shafts.",
    hazards: ["public_interface", "manual_handling", "work_at_height", "services_isolation"],
    questions: [
      { id: "q1", label: "Has the lift company been consulted before lift lobby and car interior strip-out starts?" },
      { id: "q2", label: "Is the lift taken safely out of service for the duration of the strip-out?" },
      { id: "q3", label: "Are controls in place to prevent access to open shafts during lift lobby and car interior strip-out?" },
      { id: "q4", label: "Are decorative panels and doors handled safely during lift lobby and car interior strip-out?" },
      { id: "q5", label: "Is the public kept away from work zones during lift lobby and car interior strip-out?" }
    ]
  },

  "Facade cladding removal (non-structural)": {
    desc: "Facade cladding removal (non-structural) covers taking down rainscreen panels, lightweight cladding and fixings that are not primary structure. Work at height and falling object risks are controlled with scaffolding and netting. Fire and weather performance of the temporary exposed facade are considered in the planning. Waste is lowered via controlled routes.",
    hazards: ["work_at_height", "falling_objects", "environmental_weather", "manual_handling"],
    questions: [
      { id: "q1", label: "Is scaffold and edge protection in place before facade cladding removal (non-structural) begins?" },
      { id: "q2", label: "Are panel removal sequences planned to prevent large areas becoming unstable during facade cladding removal?" },
      { id: "q3", label: "Is debris netting or similar installed to control falling items during facade cladding removal?" },
      { id: "q4", label: "Is temporary weather protection planned once facade cladding removal exposes the building?" },
      { id: "q5", label: "Are manual handling aids available for large panels during facade cladding removal?" }
    ]
  },

  "Window and door removal": {
    desc: "Window and door removal includes taking out frames, sashes, glazing and ironmongery from openings. Glass breakage and falling components are key risks, controlled through removal sequences and PPE. Temporary protection may be required to openings for safety and weatherproofing. Adjacent finishes are protected from damage.",
    hazards: ["glass_sharps", "falling_objects", "work_at_height", "manual_handling"],
    questions: [
      { id: "q1", label: "Is there a method for safely removing glazing during window and door removal?" },
      { id: "q2", label: "Are openings protected against falls after window and door removal?" },
      { id: "q3", label: "Is suitable manual handling equipment available for large frames during window and door removal?" },
      { id: "q4", label: "Are sharp edges controlled and disposed of correctly during window and door removal?" },
      { id: "q5", label: "Is temporary weather protection installed after window and door removal where required?" }
    ]
  },

  "Door frame and lining removal": {
    desc: "Door frame and lining removal involves stripping internal frames, linings and associated architraves without damaging structural openings. Fixings and wedges are removed systematically and frames are split to reduce force on adjacent finishes. The operation is coordinated with follow-on works ready to re-frame or close the opening.",
    hazards: ["manual_handling", "sharp_objects", "slips_trips", "dust_fumes"],
    questions: [
      { id: "q1", label: "Are frames cut and split to ease removal rather than levered out during door frame and lining removal?" },
      { id: "q2", label: "Are sharp fixings controlled during door frame and lining removal?" },
      { id: "q3", label: "Is dust and debris from door frame and lining removal cleaned regularly?" },
      { id: "q4", label: "Are door openings made safe and free of trip hazards after door frame and lining removal?" },
      { id: "q5", label: "Is there a plan for temporary door or barrier provision where required after door frame and lining removal?" }
    ]
  },

  "Balustrade and handrail removal": {
    desc: "Balustrade and handrail removal involves dismantling guarding from stairs, landings and edges. Temporary edge protection or alternative guarding is installed before original barriers are removed. Works are sequenced to maintain protection at all times. Removed components are handled safely to avoid falls from height.",
    hazards: ["work_at_height", "falling_objects", "slips_trips", "manual_handling"],
    questions: [
      { id: "q1", label: "Is temporary guarding installed before balustrade and handrail removal starts?" },
      { id: "q2", label: "Are balustrade components removed in a sequence that maintains edge protection during removal?" },
      { id: "q3", label: "Are removed balustrade and handrail elements secured so they cannot fall from height?" },
      { id: "q4", label: "Is access controlled to areas affected by balustrade and handrail removal?" },
      { id: "q5", label: "Are stairs and landings kept free of debris during balustrade and handrail removal?" }
    ]
  },

  "Ductwork strip-out": {
    desc: "Ductwork strip-out covers removal of sheet metal ducts, insulation and supports from ceiling voids, plantrooms and risers. Work at height is common, using steps, towers or MEWPs. Materials are lowered in manageable sections. Insulation may contain fibres or contaminants, requiring suitable PPE and waste handling.",
    hazards: ["work_at_height", "manual_handling", "dust_fumes", "falling_objects"],
    questions: [
      { id: "q1", label: "Is access equipment suitable and inspected before starting ductwork strip-out?" },
      { id: "q2", label: "Are duct sections cut into manageable pieces before lowering in ductwork strip-out?" },
      { id: "q3", label: "Is insulation from ductwork strip-out treated as potentially hazardous and bagged appropriately?" },
      { id: "q4", label: "Are fixings and hangers removed in a controlled way during ductwork strip-out?" },
      { id: "q5", label: "Is the work area below protected from falling items during ductwork strip-out?" }
    ]
  },

  "Suspended services strip-out (tray/conduit)": {
    desc: "Suspended services strip-out (tray/conduit) involves removing cable trays, trunking and conduits that no longer carry live services. Isolation of any remaining circuits is confirmed before removal. Work is carried out at height and overhead, requiring good access and control of falling items. Cable segregation and identification are reviewed to avoid accidental disruption of live systems.",
    hazards: ["work_at_height", "manual_handling", "falling_objects", "services_isolation"],
    questions: [
      { id: "q1", label: "Have all live circuits been traced and identified before suspended services strip-out (tray/conduit)?" },
      { id: "q2", label: "Is suitable access in place for overhead suspended services strip-out (tray/conduit)?" },
      { id: "q3", label: "Are trays and conduits removed in short sections to control weight during suspended services strip-out (tray/conduit)?" },
      { id: "q4", label: "Are areas below cordoned off during suspended services strip-out (tray/conduit)?" },
      { id: "q5", label: "Is there a process to verify that only redundant services are removed during suspended services strip-out (tray/conduit)?" }
    ]
  },

  "External hardstanding breakout (paths/patio)": {
    desc: "External hardstanding breakout (paths/patio) covers demolition of paved areas, slabs and small retaining features in gardens or yards. Buried services and tree roots are considered before breaking out. Works use hand tools or light plant and must control noise, dust and flying debris. Ground reinstatement or protection is planned for after removal.",
    hazards: ["silica_dust", "dust_fumes", "moving_vehicles", "environmental_weather", "manual_handling"],
    questions: [
      { id: "q1", label: "Have underground services been located before external hardstanding breakout (paths/patio)?" },
      { id: "q2", label: "Is dust suppression in place for external hardstanding breakout (paths/patio)?" },
      { id: "q3", label: "Is the public segregated from the work zone during external hardstanding breakout (paths/patio)?" },
      { id: "q4", label: "Are slabs broken into manageable sizes during external hardstanding breakout (paths/patio)?" },
      { id: "q5", label: "Is the ground made safe and even after external hardstanding breakout (paths/patio)?" }
    ]
  },

  "Kerb and edging removal": {
    desc: "Kerb and edging removal involves lifting precast kerbs, edgings and small retaining elements from pavements and drives. Traffic and pedestrian management is crucial where works adjoin live roads. Breakout is controlled to avoid damage to adjacent surfaces and services. Removed units are stacked safely awaiting reuse or disposal.",
    hazards: ["moving_vehicles", "manual_handling", "slips_trips", "silica_dust"],
    questions: [
      { id: "q1", label: "Is a traffic management plan in place for kerb and edging removal near roads or car parks?" },
      { id: "q2", label: "Are kerbs lifted using suitable tools or plant during kerb and edging removal?" },
      { id: "q3", label: "Is dust controlled when breaking out bedding during kerb and edging removal?" },
      { id: "q4", label: "Are pedestrians segregated from kerb and edging removal works?" },
      { id: "q5", label: "Are removed kerbs stacked safely after kerb and edging removal?" }
    ]
  },

  "Playground equipment removal": {
    desc: "Playground equipment removal includes dismantling swings, frames, slides and safety surfacing in public or school environments. Public access is strictly controlled with fencing and signage. Foundations and fixings are removed or made safe. Surfaces are restored to prevent trip hazards and to prepare for new installations.",
    hazards: ["public_interface", "manual_handling", "plant_machinery", "slips_trips"],
    questions: [
      { id: "q1", label: "Is the playground equipment removal area securely fenced off from children and the public?" },
      { id: "q2", label: "Is there a method for dealing with below-ground foundations during playground equipment removal?" },
      { id: "q3", label: "Are lifting techniques and plant suitable for large play structures in playground equipment removal?" },
      { id: "q4", label: "Is surfacing made level and safe after playground equipment removal?" },
      { id: "q5", label: "Have school or site managers agreed timings and controls for playground equipment removal?" }
    ]
  },

  "Internal demolition for open-plan conversion": {
    desc: "Internal demolition for open-plan conversion involves removal of partitions, ceilings, floor finishes and selected structural elements in preparation for a new layout. Structural design and temporary works plans are in place where load-bearing elements are affected. Dust, noise and vibration are controlled to protect neighbouring areas. Access, fire escape routes and services are carefully managed throughout.",
    hazards: ["structural_collapse", "dust_fumes", "manual_handling", "slips_trips", "public_interface"],
    questions: [
      { id: "q1", label: "Has a structural design and sequence been agreed for internal demolition for open-plan conversion?" },
      { id: "q2", label: "Are temporary works in place where internal demolition for open-plan conversion affects structure?" },
      { id: "q3", label: "Is dust control (e.g. screening, extraction) planned for internal demolition for open-plan conversion?" },
      { id: "q4", label: "Are escape routes maintained while internal demolition for open-plan conversion progresses?" },
      { id: "q5", label: "Are services clearly identified before internal demolition for open-plan conversion begins?" }
    ]
  },

  "Loft clear-out and strip-out": {
    desc: "Loft clear-out and strip-out covers removal of stored items, insulation, obsolete tanks and services from roof spaces. The work is often in confined, poorly lit areas with fragile ceilings below. Access arrangements, crawl boards and fall protection measures are established before entry. Dust, droppings and biological contamination are controlled with suitable PPE.",
    hazards: ["work_at_height", "confined_space", "poor_lighting", "dust_fumes", "fragile_surfaces"],
    questions: [
      { id: "q1", label: "Are safe access and crawl boards installed before loft clear-out and strip-out starts?" },
      { id: "q2", label: "Are ceilings below treated as fragile surfaces during loft clear-out and strip-out?" },
      { id: "q3", label: "Is suitable PPE specified for dust and biological risks during loft clear-out and strip-out?" },
      { id: "q4", label: "Is lighting provided to all working areas for loft clear-out and strip-out?" },
      { id: "q5", label: "Are waste routes and bagging arrangements set up for loft clear-out and strip-out?" }
    ]
  },

  "Site clearance of demolition arisings": {
    desc: "Site clearance of demolition arisings involves collecting, sorting and removing rubble, scrap, timber and waste following demolition or strip-out activities. Plant and vehicles may be used to load skips and containers. Segregation of waste streams is maintained to support recycling. The area is progressively tidied to reduce trip, fire and security risks.",
    hazards: ["plant_machinery", "manual_handling", "slips_trips", "moving_vehicles", "sharp_objects"],
    questions: [
      { id: "q1", label: "Is there a traffic and plant management plan in place for site clearance of demolition arisings?" },
      { id: "q2", label: "Are waste streams segregated during site clearance of demolition arisings?" },
      { id: "q3", label: "Are sharp and protruding materials controlled during site clearance of demolition arisings?" },
      { id: "q4", label: "Are walkways kept clear throughout site clearance of demolition arisings?" },
      { id: "q5", label: "Is plant operated by trained personnel only during site clearance of demolition arisings?" }
    ]
  }
};

// ==========================================
// X. JOB CLUSTERS (HVAC / AIR CONDITIONING)
// ==========================================

const HVAC_AIRCON_CLUSTERS: Record<string, JobCluster> = {
  "Wall-mounted split AC installation (domestic)": {
    desc: "Wall-mounted split AC installation (domestic) involves fitting indoor and outdoor units, installing refrigerant pipework, interconnecting cables and condensate drains. The work typically requires drilling through external walls, fixing brackets securely and pressure testing the system before commissioning. Care is taken to protect finishes, manage noise and position equipment in line with manufacturer guidance and client requirements.",
    hazards: ["work_at_height", "manual_handling", "dust_fumes", "noise_vibration"],
    questions: [
      { id: "q1", label: "Have suitable fixing points been identified for the wall-mounted split AC installation (domestic) to avoid weak substrates and services?" },
      { id: "q2", label: "Is a safe method in place for drilling external walls during the wall-mounted split AC installation (domestic)?" },
      { id: "q3", label: "Will access equipment for the outdoor unit be used in line with work at height requirements for the wall-mounted split AC installation (domestic)?" },
      { id: "q4", label: "Are refrigerant pipe runs for the wall-mounted split AC installation (domestic) planned to avoid damage and trip hazards?" },
      { id: "q5", label: "Will the wall-mounted split AC installation (domestic) be pressure tested and evacuated in accordance with manufacturer and F-gas requirements?" }
    ]
  },

  "Multi-split AC installation (domestic)": {
    desc: "Multi-split AC installation (domestic) covers installing one outdoor condenser feeding multiple indoor units. The work involves routing multiple pipe sets, condensate drains and control cables around the property. Equipment positioning is planned to minimise visual impact, noise and interference with neighbours. System commissioning ensures balanced performance across all indoor units.",
    hazards: ["work_at_height", "manual_handling", "dust_fumes", "noise_vibration"],
    questions: [
      { id: "q1", label: "Has the outdoor unit position for the multi-split AC installation (domestic) been agreed with the client and neighbours where relevant?" },
      { id: "q2", label: "Are pipe routes for the multi-split AC installation (domestic) planned to avoid overloading walls and soffits?" },
      { id: "q3", label: "Is access equipment suitable for all high-level works in the multi-split AC installation (domestic)?" },
      { id: "q4", label: "Will all joints in the multi-split AC installation (domestic) be pressure tested and leak checked before commissioning?" },
      { id: "q5", label: "Are condensate drains from the multi-split AC installation (domestic) routed to safe discharge points?" }
    ]
  },

  "Split AC replacement (like-for-like)": {
    desc: "Split AC replacement (like-for-like) involves removing an existing system and installing a new unit of similar capacity and layout. The task includes safe recovery of refrigerant, disconnection of services, removal of old equipment and fitting the replacement. Pipework and cabling may be reused where suitable, subject to cleaning and testing.",
    hazards: ["manual_handling", "chemical_coshh", "noise_vibration", "work_at_height"],
    questions: [
      { id: "q1", label: "Will refrigerant be safely recovered from the existing unit before split AC replacement (like-for-like) begins?" },
      { id: "q2", label: "Is the existing pipework for split AC replacement (like-for-like) being assessed for suitability and cleanliness?" },
      { id: "q3", label: "Is safe access provided for removal and refitting of outdoor units during split AC replacement (like-for-like)?" },
      { id: "q4", label: "Has a plan been agreed for disposal of redundant split AC equipment and refrigerant?" },
      { id: "q5", label: "Will the new split AC replacement (like-for-like) be commissioned and documented in line with manufacturer and F-gas guidance?" }
    ]
  },

  "Portable AC installation & setup": {
    desc: "Portable AC installation & setup covers delivering, positioning and configuring mobile cooling units in domestic or commercial spaces. Work includes routing exhaust ducts, setting condensate arrangements and advising on electrical supply limitations. Trip hazards and hot exhaust routing are managed carefully to protect occupants.",
    hazards: ["manual_handling", "slips_trips", "environmental_weather"],
    questions: [
      { id: "q1", label: "Are manual handling controls in place for moving portable AC units during installation & setup?" },
      { id: "q2", label: "Is the exhaust routing for portable AC installation & setup planned to avoid overheating or damage?" },
      { id: "q3", label: "Are trip hazards from hoses and leads controlled during portable AC installation & setup?" },
      { id: "q4", label: "Is the electrical supply adequate and correctly fused for the portable AC installation & setup?" },
      { id: "q5", label: "Will users be briefed on safe operation and drainage during portable AC installation & setup?" }
    ]
  },

  "Ceiling cassette AC installation": {
    desc: "Ceiling cassette AC installation involves fitting cassette units into suspended ceilings or structural apertures, routing refrigerant pipework, drains and cabling back to an outdoor unit. The work is predominantly at height, requiring safe access and control of falling objects. Ceiling grids and tiles are supported to prevent collapse.",
    hazards: ["work_at_height", "falling_objects", "manual_handling", "dust_fumes"],
    questions: [
      { id: "q1", label: "Is suitable access equipment in place for ceiling cassette AC installation?" },
      { id: "q2", label: "Have ceiling supports and grid strength been checked before cutting openings for ceiling cassette AC installation?" },
      { id: "q3", label: "Are measures in place to prevent tools and components falling during ceiling cassette AC installation?" },
      { id: "q4", label: "Are condensate drains from ceiling cassette AC installation routed with adequate falls and insulation?" },
      { id: "q5", label: "Will cassette units be commissioned and balanced following ceiling cassette AC installation?" }
    ]
  },

  "Ducted AC system install (domestic)": {
    desc: "Ducted AC system install (domestic) covers installing concealed air handling units, flexible or rigid ductwork and grilles to distribute cooled or heated air. The work often occurs in lofts or ceiling voids with restricted access and fragile ceilings. Duct routes are planned to avoid structural elements and services.",
    hazards: ["work_at_height", "confined_space", "fragile_surfaces", "manual_handling", "dust_fumes"],
    questions: [
      { id: "q1", label: "Are safe crawl boards and access provided for ducted AC system install (domestic) in lofts or voids?" },
      { id: "q2", label: "Have fragile ceilings been identified for ducted AC system install (domestic) and protected appropriately?" },
      { id: "q3", label: "Are duct routes for ducted AC system install (domestic) planned to avoid structural and service clashes?" },
      { id: "q4", label: "Is insulation specified correctly to prevent condensation on ducted AC system install (domestic)?" },
      { id: "q5", label: "Will airflow and noise levels be checked after ducted AC system install (domestic)?" }
    ]
  },

  "VRF/VRV system installation (commercial)": {
    desc: "VRF/VRV system installation (commercial) involves installing multi-branch refrigerant systems serving numerous indoor units from one or more outdoor condensers. Works include large-bore and branch piping, extensive controls cabling and commissioning of sophisticated control strategies. Coordination with other trades and structural design is essential due to weight and routing complexity.",
    hazards: ["manual_handling", "work_at_height", "noise_vibration", "chemical_coshh"],
    questions: [
      { id: "q1", label: "Has a coordinated services drawing been reviewed before VRF/VRV system installation (commercial) starts?" },
      { id: "q2", label: "Are appropriate lifting aids available for VRF/VRV outdoor units and headers?" },
      { id: "q3", label: "Will all refrigerant joints in VRF/VRV system installation (commercial) be pressure tested and nitrogen leak tested?" },
      { id: "q4", label: "Are control and power cabling routes identified clearly for VRF/VRV system installation (commercial)?" },
      { id: "q5", label: "Is manufacturer commissioning support or guidance being followed for VRF/VRV system installation (commercial)?" }
    ]
  },

  "Server room close-control AC install": {
    desc: "Server room close-control AC install provides precise temperature and humidity control for IT spaces. Works include installing high-reliability CRAC/CRAH units, pipework, drains and control interfaces to servers or BMS. Redundancy and resilience are considered in the design and installation, with close coordination on changeover and commissioning.",
    hazards: ["manual_handling", "live_electricity", "water_ingress", "noise_vibration"],
    questions: [
      { id: "q1", label: "Has a changeover plan been agreed for server room close-control AC install to protect live IT equipment?" },
      { id: "q2", label: "Are electrical supplies for server room close-control AC install sized and isolated correctly?" },
      { id: "q3", label: "Is condensate management for server room close-control AC install designed to avoid leaks near IT equipment?" },
      { id: "q4", label: "Are redundancy and alarm functions tested as part of server room close-control AC install?" },
      { id: "q5", label: "Is noise and vibration from server room close-control AC install acceptable for adjacent spaces?" }
    ]
  },

  "AC condensate pump installation": {
    desc: "AC condensate pump installation covers fitting and wiring small pumps to lift condensate where gravity discharge is not possible. The work includes routing discharge pipework, installing anti-vibration supports and connecting to AC unit safeties. Flooding and nuisance tripping risks are managed by correct design and testing.",
    hazards: ["live_electricity", "water_ingress", "manual_handling", "slips_trips"],
    questions: [
      { id: "q1", label: "Is the AC condensate pump installation located to allow safe maintenance access?" },
      { id: "q2", label: "Are electrical connections for AC condensate pump installation made with appropriate isolation and fusing?" },
      { id: "q3", label: "Is discharge pipework from AC condensate pump installation routed with adequate support and falls?" },
      { id: "q4", label: "Will the AC condensate pump installation be function-tested for leak and overflow protection?" },
      { id: "q5", label: "Are slip risks from potential leaks considered for AC condensate pump installation?" }
    ]
  },

  "AC system commissioning & handover": {
    desc: "AC system commissioning & handover focuses on verifying performance, safety and control settings of new or modified systems. The task includes checking refrigerant charge, superheat/subcool, electrical loads, airflow and setpoints. Documentation, labelling and client training are delivered as part of handover.",
    hazards: ["live_electricity", "noise_vibration", "chemical_coshh"],
    questions: [
      { id: "q1", label: "Are commissioning works for AC system commissioning & handover carried out on safely isolated panels wherever possible?" },
      { id: "q2", label: "Is test equipment for AC system commissioning & handover calibrated and suitable for the system?" },
      { id: "q3", label: "Are refrigerant pressures and temperatures monitored safely during AC system commissioning & handover?" },
      { id: "q4", label: "Will all safety devices be proven as part of AC system commissioning & handover?" },
      { id: "q5", label: "Is handover documentation for AC system commissioning & handover prepared and issued to the client?" }
    ]
  },

  "AC fault finding & diagnostics": {
    desc: "AC fault finding & diagnostics involves tracing and rectifying performance or breakdown issues on existing systems. This may include electrical testing, refrigerant pressure checks, leak detection and control system interrogation. Live testing is minimised and only carried out under controlled conditions.",
    hazards: ["live_electricity", "chemical_coshh", "noise_vibration", "lone_working"],
    questions: [
      { id: "q1", label: "Are safe isolation procedures followed wherever possible during AC fault finding & diagnostics?" },
      { id: "q2", label: "Is leak detection for AC fault finding & diagnostics carried out using suitable equipment and ventilation?" },
      { id: "q3", label: "Are manufacturer manuals consulted as part of AC fault finding & diagnostics?" },
      { id: "q4", label: "Is there a lone working arrangement in place where AC fault finding & diagnostics occurs outside normal hours?" },
      { id: "q5", label: "Are findings from AC fault finding & diagnostics recorded and communicated to the client?" }
    ]
  },

  "AC gas leak trace & repair (F-gas)": {
    desc: "AC gas leak trace & repair (F-gas) covers locating and repairing refrigerant leaks in compliance with F-gas regulations. Works include pressure testing with nitrogen, isolating circuits, repairing joints and evacuating/charging systems. Environmental and health risks from refrigerant release are controlled.",
    hazards: ["chemical_coshh", "environmental_weather", "live_electricity", "noise_vibration"],
    questions: [
      { id: "q1", label: "Are F-gas qualifications in place for AC gas leak trace & repair (F-gas)?" },
      { id: "q2", label: "Is refrigerant recovery equipment available for AC gas leak trace & repair (F-gas)?" },
      { id: "q3", label: "Are nitrogen pressure tests for AC gas leak trace & repair (F-gas) carried out with suitable regulators and gauges?" },
      { id: "q4", label: "Is the area ventilated adequately during AC gas leak trace & repair (F-gas)?" },
      { id: "q5", label: "Will records of AC gas leak trace & repair (F-gas) be kept in line with regulatory requirements?" }
    ]
  },

  "AC refrigerant reclaim & recharge": {
    desc: "AC refrigerant reclaim & recharge focuses on recovering refrigerant, evacuating systems and charging to specified weights. The work is typically carried out after repairs or replacements. Cylinders, hoses and manifolds are handled carefully to prevent leaks and manual handling injuries.",
    hazards: ["chemical_coshh", "manual_handling", "live_electricity"],
    questions: [
      { id: "q1", label: "Are recovery cylinders for AC refrigerant reclaim & recharge correctly rated and labelled?" },
      { id: "q2", label: "Is weighing equipment used for AC refrigerant reclaim & recharge to ensure correct charge?" },
      { id: "q3", label: "Are electrical supplies to associated equipment isolated where possible during AC refrigerant reclaim & recharge?" },
      { id: "q4", label: "Are hoses and connections for AC refrigerant reclaim & recharge inspected for damage before use?" },
      { id: "q5", label: "Is refrigerant waste handled and consigned correctly following AC refrigerant reclaim & recharge?" }
    ]
  },

  "AC seasonal service (domestic)": {
    desc: "AC seasonal service (domestic) includes cleaning filters, checking electrical connections, verifying drains and basic function checks on small domestic units. The work is usually done in occupied properties and must minimise disruption and dust. Access to indoor and outdoor units is managed safely.",
    hazards: ["work_at_height", "manual_handling", "dust_fumes"],
    questions: [
      { id: "q1", label: "Have occupants been advised of the AC seasonal service (domestic) schedule and any power interruptions?" },
      { id: "q2", label: "Is access equipment for outdoor units used correctly during AC seasonal service (domestic)?" },
      { id: "q3", label: "Are filters cleaned or replaced using methods that control dust during AC seasonal service (domestic)?" },
      { id: "q4", label: "Are electrical checks for AC seasonal service (domestic) carried out with safe isolation where possible?" },
      { id: "q5", label: "Is condensate drainage verified and tested during AC seasonal service (domestic)?" }
    ]
  },

  "AC PPM visit (commercial)": {
    desc: "AC PPM visit (commercial) covers planned preventive maintenance on multiple units across commercial sites. Tasks include filter changes, coil cleaning, checks on belts, fans, electrics and controls. Work is often at height or in plant areas and must be coordinated with site management.",
    hazards: ["work_at_height", "manual_handling", "dust_fumes", "noise_vibration", "plant_machinery"],
    questions: [
      { id: "q1", label: "Has a permit or access approval been obtained for AC PPM visit (commercial) areas?" },
      { id: "q2", label: "Is safe access in place for roof or plantroom units during AC PPM visit (commercial)?" },
      { id: "q3", label: "Are chemical cleaners for AC PPM visit (commercial) used in line with COSHH guidance?" },
      { id: "q4", label: "Are rotating parts isolated or guarded during AC PPM visit (commercial)?" },
      { id: "q5", label: "Are PPM findings documented and outstanding defects raised following AC PPM visit (commercial)?" }
    ]
  },

  "Heat pump installation (air-to-air)": {
    desc: "Heat pump installation (air-to-air) involves fitting reversible AC systems that provide heating and cooling via indoor fan coil units. The work covers mounting indoor/outdoor units, installing refrigerant circuits, drains and controls. Outdoor siting and noise impact are important considerations.",
    hazards: ["manual_handling", "work_at_height", "noise_vibration", "chemical_coshh"],
    questions: [
      { id: "q1", label: "Is the outdoor location for heat pump installation (air-to-air) suitable for noise and service access?" },
      { id: "q2", label: "Are wall or ground brackets adequate for the weight of the heat pump installation (air-to-air)?" },
      { id: "q3", label: "Will refrigerant pipework for heat pump installation (air-to-air) be pressure tested and evacuated?" },
      { id: "q4", label: "Is electrical protection correctly sized for heat pump installation (air-to-air)?" },
      { id: "q5", label: "Are controls for heat pump installation (air-to-air) located for safe and convenient access?" }
    ]
  },

  "Heat pump installation (air-to-water)": {
    desc: "Heat pump installation (air-to-water) covers installing external units connected to wet heating systems and cylinders. Works include concrete bases or wall brackets, primary pipework, insulation, controls and integration with existing heating circuits. System flushing, filling and commissioning are critical to performance.",
    hazards: ["manual_handling", "environmental_weather", "water_ingress", "live_electricity"],
    questions: [
      { id: "q1", label: "Has a suitable base or bracket been installed for heat pump installation (air-to-water)?" },
      { id: "q2", label: "Are primary pipe routes for heat pump installation (air-to-water) protected and insulated externally?" },
      { id: "q3", label: "Is integration with existing heating circuits clearly designed for heat pump installation (air-to-water)?" },
      { id: "q4", label: "Are filling, flushing and inhibitor procedures in place for heat pump installation (air-to-water)?" },
      { id: "q5", label: "Are electrical supplies and controls commissioned safely for heat pump installation (air-to-water)?" }
    ]
  },

  "Heat pump replacement (like-for-like)": {
    desc: "Heat pump replacement (like-for-like) involves isolating, draining and removing an existing heat pump and installing a similar unit. Refrigerant, water and power connections are managed carefully to avoid leaks and electrical risks. Commissioning confirms correct operation of both heating and cooling modes if applicable.",
    hazards: ["manual_handling", "water_ingress", "chemical_coshh", "live_electricity"],
    questions: [
      { id: "q1", label: "Will refrigerant and system water be safely recovered before heat pump replacement (like-for-like)?" },
      { id: "q2", label: "Is lifting equipment in place for heavy components during heat pump replacement (like-for-like)?" },
      { id: "q3", label: "Are electrical isolations clearly identified during heat pump replacement (like-for-like)?" },
      { id: "q4", label: "Is there a plan for managing water spills during heat pump replacement (like-for-like)?" },
      { id: "q5", label: "Will system controls be reconfigured and tested after heat pump replacement (like-for-like)?" }
    ]
  },

  "Heat pump fault finding & repair": {
    desc: "Heat pump fault finding & repair covers diagnosing performance or breakdown issues on air-source or similar heat pump systems. This may involve refrigerant analysis, electrical testing and interaction with wet heating circuits. Live systems and cold weather operation increase risk and must be managed.",
    hazards: ["live_electricity", "chemical_coshh", "water_ingress", "environmental_weather"],
    questions: [
      { id: "q1", label: "Are live testing risks assessed before heat pump fault finding & repair begins?" },
      { id: "q2", label: "Is F-gas compliance considered where refrigerant work is needed in heat pump fault finding & repair?" },
      { id: "q3", label: "Are heating circuits depressurised or isolated as required during heat pump fault finding & repair?" },
      { id: "q4", label: "Is working in cold or icy conditions during heat pump fault finding & repair assessed for slips and exposure?" },
      { id: "q5", label: "Are remedial works from heat pump fault finding & repair documented for the client?" }
    ]
  },

  "MVHR system installation (domestic)": {
    desc: "MVHR system installation (domestic) involves fitting mechanical ventilation with heat recovery units, ductwork, valves and controls in dwellings. Works often occur in tight roof spaces and ceiling voids. Duct routing, sound and fire-stopping requirements must be considered.",
    hazards: ["confined_space", "work_at_height", "dust_fumes", "manual_handling"],
    questions: [
      { id: "q1", label: "Is safe access arranged for MVHR system installation (domestic) in lofts/voids?" },
      { id: "q2", label: "Are duct penetrations for MVHR system installation (domestic) planned to maintain fire separation?" },
      { id: "q3", label: "Are ducts and valves labelled clearly during MVHR system installation (domestic)?" },
      { id: "q4", label: "Is condensation control considered for MVHR system installation (domestic) ducts?" },
      { id: "q5", label: "Will airflow balancing be completed after MVHR system installation (domestic)?" }
    ]
  },

  "Mechanical extract fan install (bathroom)": {
    desc: "Mechanical extract fan install (bathroom) includes fitting fans, ducting and external grilles to remove moist air from wet rooms. The works require drilling or coring through walls or ceilings, making electrical connections and sealing penetrations against moisture ingress.",
    hazards: ["dust_fumes", "work_at_height", "live_electricity", "water_ingress"],
    questions: [
      { id: "q1", label: "Is safe isolation in place before mechanical extract fan install (bathroom) electrical works?" },
      { id: "q2", label: "Is coring or drilling for mechanical extract fan install (bathroom) planned to avoid services?" },
      { id: "q3", label: "Is there a plan to manage dust from mechanical extract fan install (bathroom) drilling?" },
      { id: "q4", label: "Are external terminations for mechanical extract fan install (bathroom) weatherproof and sealed?" },
      { id: "q5", label: "Are fan controls and timers tested after mechanical extract fan install (bathroom)?" }
    ]
  },

  "Kitchen extract canopy & fan install": {
    desc: "Kitchen extract canopy & fan install covers fitting commercial canopies, ductwork, fans and associated controls over cooking appliances. Grease, heat and fire risks are managed through appropriate materials, fire dampers and clearances. Noise and discharge locations are coordinated with building management.",
    hazards: ["hot_work", "work_at_height", "dust_fumes", "fire_explosion", "manual_handling"],
    questions: [
      { id: "q1", label: "Is a lifting method agreed for heavy canopies during kitchen extract canopy & fan install?" },
      { id: "q2", label: "Are fire and grease control requirements considered in kitchen extract canopy & fan install design?" },
      { id: "q3", label: "Is duct routing for kitchen extract canopy & fan install planned to avoid excessive bends and fire risks?" },
      { id: "q4", label: "Are electrical and control connections for kitchen extract canopy & fan install isolated and tested?" },
      { id: "q5", label: "Is external discharge from kitchen extract canopy & fan install acceptable to neighbours and regulations?" }
    ]
  },

  "Ductwork install (small domestic)": {
    desc: "Ductwork install (small domestic) includes fitting flexible or rigid ducts for small extract or supply systems in houses and flats. Works take place in lofts, ceiling voids and service cupboards. Fire-stopping, insulation and support spacing must be adequate.",
    hazards: ["work_at_height", "confined_space", "dust_fumes", "manual_handling"],
    questions: [
      { id: "q1", label: "Are safe work platforms or crawl boards used for ductwork install (small domestic)?" },
      { id: "q2", label: "Are duct joints for ductwork install (small domestic) sealed and supported correctly?" },
      { id: "q3", label: "Is fire-stopping reinstated after ductwork install (small domestic) penetrations?" },
      { id: "q4", label: "Is insulation specified for ducts where required during ductwork install (small domestic)?" },
      { id: "q5", label: "Are access panels provided to key components after ductwork install (small domestic)?" }
    ]
  },

  "Ductwork install (commercial main runs)": {
    desc: "Ductwork install (commercial main runs) covers installing larger rectangular and circular ducts in commercial buildings, often using plant to lift and support sections. Works are at height within ceiling voids or roof spaces. Coordination with other services and structural elements is critical.",
    hazards: ["work_at_height", "plant_machinery", "manual_handling", "falling_objects", "dust_fumes"],
    questions: [
      { id: "q1", label: "Is a lifting plan agreed for heavy duct sections in ductwork install (commercial main runs)?" },
      { id: "q2", label: "Are hangers and supports for ductwork install (commercial main runs) designed for load and fire requirements?" },
      { id: "q3", label: "Is access coordinated with other trades for ductwork install (commercial main runs)?" },
      { id: "q4", label: "Are joints and seals tested for leakage after ductwork install (commercial main runs)?" },
      { id: "q5", label: "Are areas below cordoned off during overhead ductwork install (commercial main runs)?" }
    ]
  },

  "Fire/smoke damper installation": {
    desc: "Fire/smoke damper installation involves fitting dampers at duct penetrations through fire compartments, connecting to control systems and proving operation. Access provisions are critical for future inspection and testing. Works must comply with fire strategy and manufacturer instructions.",
    hazards: ["work_at_height", "manual_handling", "dust_fumes", "services_isolation"],
    questions: [
      { id: "q1", label: "Are fire compartments identified before fire/smoke damper installation starts?" },
      { id: "q2", label: "Are dampers for fire/smoke damper installation installed in line with tested orientation and details?" },
      { id: "q3", label: "Is access for maintenance considered during fire/smoke damper installation?" },
      { id: "q4", label: "Are control and indication circuits tested after fire/smoke damper installation?" },
      { id: "q5", label: "Is fire-stopping reinstated around fire/smoke damper installation locations?" }
    ]
  },

  "Fire/smoke damper inspection & reset": {
    desc: "Fire/smoke damper inspection & reset covers routine testing of dampers, verifying closure and reopening functions, cleaning and recording results. Work often occurs in tight ceiling voids and risers. Failures are recorded and escalated for repair.",
    hazards: ["work_at_height", "confined_space", "dust_fumes", "poor_lighting"],
    questions: [
      { id: "q1", label: "Is safe access provided for fire/smoke damper inspection & reset in ceiling voids and risers?" },
      { id: "q2", label: "Are test procedures for fire/smoke damper inspection & reset agreed with building management?" },
      { id: "q3", label: "Is adequate lighting provided during fire/smoke damper inspection & reset?" },
      { id: "q4", label: "Are inspection findings from fire/smoke damper inspection & reset recorded and stored?" },
      { id: "q5", label: "Is dust and debris controlled during fire/smoke damper inspection & reset?" }
    ]
  },

  "AHU installation (packaged)": {
    desc: "AHU installation (packaged) involves positioning and connecting air handling units, often on roofs or plant decks. Works include duct, pipe, power and control connections, as well as access platforms and guards. Lifting operations are critical and must be planned.",
    hazards: ["work_at_height", "plant_machinery", "manual_handling", "moving_vehicles"],
    questions: [
      { id: "q1", label: "Is a lifting plan and appropriate crane/plant arranged for AHU installation (packaged)?" },
      { id: "q2", label: "Is edge protection in place where AHU installation (packaged) takes place on roofs?" },
      { id: "q3", label: "Are duct and pipe connections for AHU installation (packaged) coordinated with other services?" },
      { id: "q4", label: "Are electrical isolators and emergency stops accessible after AHU installation (packaged)?" },
      { id: "q5", label: "Is the AHU installation (packaged) commissioned with airflows, temperatures and safeties verified?" }
    ]
  },

  "AHU refurbishment & coil change": {
    desc: "AHU refurbishment & coil change includes replacing coils, fans, sections or controls within existing air handling units. Works take place in plantrooms or roof housings and may involve confined access and heavy components. Isolations for water, steam and power are critical.",
    hazards: ["manual_handling", "confined_space", "live_electricity", "water_ingress"],
    questions: [
      { id: "q1", label: "Have heating/cooling media and power been isolated before AHU refurbishment & coil change?" },
      { id: "q2", label: "Is a manual handling or lifting plan in place for heavy parts during AHU refurbishment & coil change?" },
      { id: "q3", label: "Is access space adequate for AHU refurbishment & coil change works?" },
      { id: "q4", label: "Are potential leaks controlled when breaking into pipework during AHU refurbishment & coil change?" },
      { id: "q5", label: "Are all covers re-secured and guards replaced after AHU refurbishment & coil change?" }
    ]
  },

  "Fan coil unit installation": {
    desc: "Fan coil unit installation involves mounting FCUs, connecting chilled/hot water pipework, condensate drains, power and controls. Units may be concealed in ceilings or exposed. Coordination with ceiling trades and fire stopping is required.",
    hazards: ["work_at_height", "manual_handling", "water_ingress", "dust_fumes"],
    questions: [
      { id: "q1", label: "Is safe access available for fan coil unit installation at height?" },
      { id: "q2", label: "Are hanging supports for fan coil unit installation designed for load and vibration?" },
      { id: "q3", label: "Are pipework connections for fan coil unit installation tested for leaks?" },
      { id: "q4", label: "Is condensate drainage from fan coil unit installation checked and insulated where necessary?" },
      { id: "q5", label: "Are FCU access panels maintained for future maintenance after fan coil unit installation?" }
    ]
  },

  "Fan coil unit service & filter change": {
    desc: "Fan coil unit service & filter change involves opening FCUs, cleaning or replacing filters, checking fans and coils, and verifying operation. Work may disturb dust and fibres and occurs above ceiling level or in occupied spaces.",
    hazards: ["work_at_height", "dust_fumes", "manual_handling"],
    questions: [
      { id: "q1", label: "Is access for fan coil unit service & filter change safe and stable?" },
      { id: "q2", label: "Are dust and debris from fan coil unit service & filter change controlled and cleaned up?" },
      { id: "q3", label: "Are filters and panels handled to avoid strain injuries during fan coil unit service & filter change?" },
      { id: "q4", label: "Are fans isolated where possible during fan coil unit service & filter change?" },
      { id: "q5", label: "Is FCU performance checked after fan coil unit service & filter change?" }
    ]
  },

  "Chiller installation (air-cooled)": {
    desc: "Chiller installation (air-cooled) involves positioning packaged chillers, connecting primary pipework, electrics and BMS, and commissioning the plant. Works often require crane lifts, roof access and coordination with other plant. Noise and air discharge are considered for neighbours.",
    hazards: ["plant_machinery", "work_at_height", "manual_handling", "moving_vehicles"],
    questions: [
      { id: "q1", label: "Is a lift plan agreed with a competent person for chiller installation (air-cooled)?" },
      { id: "q2", label: "Is roof or slab capacity confirmed for chiller installation (air-cooled)?" },
      { id: "q3", label: "Are pipe and power connections for chiller installation (air-cooled) properly supported and labelled?" },
      { id: "q4", label: "Are noise and airflow impacts from chiller installation (air-cooled) reviewed?" },
      { id: "q5", label: "Is commissioning of chiller installation (air-cooled) planned with manufacturer guidance?" }
    ]
  },

  "Chiller decommission & strip-out": {
    desc: "Chiller decommission & strip-out involves recovering refrigerant, isolating and draining circuits, disconnecting power and removing chiller units and associated plant. Heavy lifting operations and environmental controls for refrigerant and glycol are key considerations.",
    hazards: ["chemical_coshh", "plant_machinery", "manual_handling", "moving_vehicles"],
    questions: [
      { id: "q1", label: "Are F-gas and environmental procedures followed for chiller decommission & strip-out?" },
      { id: "q2", label: "Is a lifting plan agreed for all major components during chiller decommission & strip-out?" },
      { id: "q3", label: "Are glycol or other fluids contained and disposed of correctly in chiller decommission & strip-out?" },
      { id: "q4", label: "Are power supplies isolated and proven dead for chiller decommission & strip-out?" },
      { id: "q5", label: "Is plant area left in a safe, tidy state after chiller decommission & strip-out?" }
    ]
  },

  "Cooling tower inspection & clean": {
    desc: "Cooling tower inspection & clean includes physical inspection, cleaning, descaling and disinfection of cooling towers in line with water hygiene plans. Work involves exposure to aerosols, chemicals and working at height. Strict hygiene and safety controls are needed.",
    hazards: ["biological", "chemical_coshh", "work_at_height", "water_ingress"],
    questions: [
      { id: "q1", label: "Are Legionella and water hygiene procedures in place for cooling tower inspection & clean?" },
      { id: "q2", label: "Is suitable PPE and RPE provided for cooling tower inspection & clean?" },
      { id: "q3", label: "Is access to cooling towers for inspection & clean safe and protected against falls?" },
      { id: "q4", label: "Are chemicals for cooling tower inspection & clean handled in line with COSHH?" },
      { id: "q5", label: "Is waste water and sludge from cooling tower inspection & clean disposed of correctly?" }
    ]
  },

  "Plantroom HVAC pipework install": {
    desc: "Plantroom HVAC pipework install covers installation of flow and return pipework, headers, valves and supports around boilers, chillers and pumps. Works are often congested and may require hot works. Coordination with structural supports and access routes is essential.",
    hazards: ["hot_work", "manual_handling", "confined_space", "dust_fumes"],
    questions: [
      { id: "q1", label: "Are hot work permits in place where welding or cutting is used for plantroom HVAC pipework install?" },
      { id: "q2", label: "Are pipe supports for plantroom HVAC pipework install designed for load and expansion?" },
      { id: "q3", label: "Is access for valves and equipment maintained during plantroom HVAC pipework install?" },
      { id: "q4", label: "Are lifting aids used for heavy spools during plantroom HVAC pipework install?" },
      { id: "q5", label: "Is fire-stopping reinstated after plantroom HVAC pipework install penetrations?" }
    ]
  },

  "Plantroom HVAC valve replacement": {
    desc: "Plantroom HVAC valve replacement includes isolating, draining and changing valves on heating or cooling systems in plantrooms. Confined spaces, hot surfaces and pressure hazards must be managed. Correct re-pressurisation and venting are required on completion.",
    hazards: ["water_ingress", "confined_space", "manual_handling", "hot_work"],
    questions: [
      { id: "q1", label: "Are systems safely isolated and depressurised before plantroom HVAC valve replacement?" },
      { id: "q2", label: "Is there a plan to manage hot water or steam during plantroom HVAC valve replacement?" },
      { id: "q3", label: "Is suitable access and lighting in place in the plantroom for HVAC valve replacement?" },
      { id: "q4", label: "Are new valves correctly supported and aligned after plantroom HVAC valve replacement?" },
      { id: "q5", label: "Are systems refilled, vented and tested for leaks after plantroom HVAC valve replacement?" }
    ]
  },

  "BMS controls panel installation (HVAC)": {
    desc: "BMS controls panel installation (HVAC) involves mounting, wiring and labelling building management system panels controlling HVAC plant. Works include power supplies, control circuits and communications. Testing and documentation are essential to future operation.",
    hazards: ["live_electricity", "manual_handling", "dust_fumes"],
    questions: [
      { id: "q1", label: "Is safe isolation in place before BMS controls panel installation (HVAC) wiring begins?" },
      { id: "q2", label: "Is panel mounting for BMS controls panel installation (HVAC) structurally secure?" },
      { id: "q3", label: "Are terminals and cables for BMS controls panel installation (HVAC) labelled clearly?" },
      { id: "q4", label: "Are control circuits tested and proven during BMS controls panel installation (HVAC)?" },
      { id: "q5", label: "Is as-built documentation updated after BMS controls panel installation (HVAC)?" }
    ]
  },

  "Thermostat / room controller install": {
    desc: "Thermostat / room controller install includes fitting room sensors, controllers and associated wiring for HVAC systems. Correct location and wiring are critical to effective temperature control. Work may involve chasing, trunking or wireless commissioning.",
    hazards: ["live_electricity", "dust_fumes", "manual_handling"],
    questions: [
      { id: "q1", label: "Is safe isolation provided before thermostat / room controller install wiring works?" },
      { id: "q2", label: "Are controller positions for thermostat / room controller install chosen to avoid draughts and heat sources?" },
      { id: "q3", label: "Is chasing or drilling for thermostat / room controller install carried out avoiding services?" },
      { id: "q4", label: "Are terminations and polarity checked for thermostat / room controller install?" },
      { id: "q5", label: "Is the thermostat / room controller install commissioned and confirmed with the client?" }
    ]
  },

  "Refrigerant pipework installation (small-bore)": {
    desc: "Refrigerant pipework installation (small-bore) covers installing copper linesets for smaller systems using brazed or flared joints. Works require cleanliness, nitrogen purging and correct support spacing. Route selection avoids damage, kinking and noise issues.",
    hazards: ["hot_work", "chemical_coshh", "manual_handling", "work_at_height"],
    questions: [
      { id: "q1", label: "Is nitrogen purging used during brazing for refrigerant pipework installation (small-bore)?" },
      { id: "q2", label: "Are fire controls in place where hot work is used for refrigerant pipework installation (small-bore)?" },
      { id: "q3", label: "Are supports and bends correctly spaced for refrigerant pipework installation (small-bore)?" },
      { id: "q4", label: "Are pipes pressure tested after refrigerant pipework installation (small-bore)?" },
      { id: "q5", label: "Is access equipment used safely where refrigerant pipework installation (small-bore) is at height?" }
    ]
  },

  "Refrigerant pipework installation (large-bore)": {
    desc: "Refrigerant pipework installation (large-bore) covers installing larger diameter piping for VRF or industrial systems. Components are heavy and may require mechanical lifting and prefabrication. Joints are typically brazed or welded under strict cleanliness and testing regimes.",
    hazards: ["hot_work", "plant_machinery", "manual_handling", "chemical_coshh"],
    questions: [
      { id: "q1", label: "Is a lifting plan in place for refrigerant pipework installation (large-bore) sections?" },
      { id: "q2", label: "Are hot work controls implemented for brazing/welding during refrigerant pipework installation (large-bore)?" },
      { id: "q3", label: "Are joints for refrigerant pipework installation (large-bore) pressure tested and documented?" },
      { id: "q4", label: "Are supports for refrigerant pipework installation (large-bore) designed for expansion and vibration?" },
      { id: "q5", label: "Are safety data sheets available for gases used in refrigerant pipework installation (large-bore)?" }
    ]
  },

  "Lagging/insulation to HVAC services": {
    desc: "Lagging/insulation to HVAC services involves fitting thermal and acoustic insulation to pipework, ductwork and plant. Works may take place at height and in tight spaces. Insulation materials can create dust and fibres requiring appropriate PPE.",
    hazards: ["work_at_height", "dust_fumes", "manual_handling"],
    questions: [
      { id: "q1", label: "Is safe access used for lagging/insulation to HVAC services at height?" },
      { id: "q2", label: "Is suitable PPE worn for handling insulation during lagging/insulation to HVAC services?" },
      { id: "q3", label: "Are vapour barriers and finishes applied correctly for lagging/insulation to HVAC services?" },
      { id: "q4", label: "Are labels and valve identification reinstated after lagging/insulation to HVAC services?" },
      { id: "q5", label: "Is waste insulation from lagging/insulation to HVAC services disposed of correctly?" }
    ]
  },

  "Condensate drain installation & routing": {
    desc: "Condensate drain installation & routing focuses on providing reliable drainage paths from cooling coils and equipment to appropriate discharge points. Falls, trap locations and insulation are important to prevent leaks, smells and freezing. Penetrations through fabric are sealed properly.",
    hazards: ["water_ingress", "slips_trips", "manual_handling"],
    questions: [
      { id: "q1", label: "Are adequate pipe falls provided for condensate drain installation & routing?" },
      { id: "q2", label: "Are traps located correctly for condensate drain installation & routing to prevent air ingress?" },
      { id: "q3", label: "Is insulation specified where condensate drain installation & routing passes through cold areas?" },
      { id: "q4", label: "Are penetrations sealed after condensate drain installation & routing?" },
      { id: "q5", label: "Will drains be flushed and tested after condensate drain installation & routing?" }
    ]
  },

  "Duct cleaning (small commercial)": {
    desc: "Duct cleaning (small commercial) involves cleaning internal surfaces of smaller duct systems using brushes, vacuums and limited access hatches. Works generate dust and may disturb microbial contamination. Access at height and confined spaces are common.",
    hazards: ["dust_fumes", "biological", "work_at_height", "confined_space"],
    questions: [
      { id: "q1", label: "Is suitable RPE and PPE provided for duct cleaning (small commercial)?" },
      { id: "q2", label: "Is safe access in place for high-level duct cleaning (small commercial)?" },
      { id: "q3", label: "Are access panels used safely for duct cleaning (small commercial) to avoid falling items?" },
      { id: "q4", label: "Is waste dust and debris from duct cleaning (small commercial) contained and removed appropriately?" },
      { id: "q5", label: "Is the system shut down and locked off during duct cleaning (small commercial)?" }
    ]
  },

  "Duct cleaning (large system)": {
    desc: "Duct cleaning (large system) covers cleaning extensive duct networks in larger buildings, often with robotic or powered cleaning equipment. Works must manage access, power supplies and contamination over longer runs. Coordination with building management is essential.",
    hazards: ["dust_fumes", "biological", "work_at_height", "plant_machinery"],
    questions: [
      { id: "q1", label: "Is a cleaning plan and sequence agreed for duct cleaning (large system) with building management?" },
      { id: "q2", label: "Are access doors and hatches adequate for duct cleaning (large system) activities?" },
      { id: "q3", label: "Is suitable plant and power management provided for duct cleaning (large system) equipment?" },
      { id: "q4", label: "Are air quality and contamination risks managed during duct cleaning (large system)?" },
      { id: "q5", label: "Is the system reinstated and filters checked after duct cleaning (large system)?" }
    ]
  },

  "Filter change visit (rooftop plant)": {
    desc: "Filter change visit (rooftop plant) involves accessing rooftop AHUs or packaged units to replace air filters. The work is at height and exposed to weather. Filters may be bulky and dusty, requiring manual handling controls and PPE.",
    hazards: ["work_at_height", "environmental_weather", "manual_handling", "dust_fumes"],
    questions: [
      { id: "q1", label: "Is safe roof access and edge protection provided for filter change visit (rooftop plant)?" },
      { id: "q2", label: "Is weather risk assessed before filter change visit (rooftop plant) proceeds?" },
      { id: "q3", label: "Are dust masks and gloves used during filter change visit (rooftop plant)?" },
      { id: "q4", label: "Are old filters bagged and removed safely after filter change visit (rooftop plant)?" },
      { id: "q5", label: "Are AHU doors and guards closed correctly after filter change visit (rooftop plant)?" }
    ]
  },

  "Rooftop package unit installation": {
    desc: "Rooftop package unit installation involves lifting and positioning large packaged HVAC units on building roofs, then connecting ducts, gas (if applicable), power and controls. Lifting, working at height and weather exposure are key risk areas.",
    hazards: ["work_at_height", "plant_machinery", "moving_vehicles", "environmental_weather"],
    questions: [
      { id: "q1", label: "Is a crane and lifting plan agreed for rooftop package unit installation?" },
      { id: "q2", label: "Is roof structure verified as suitable for rooftop package unit installation loads?" },
      { id: "q3", label: "Are edge protection and fall prevention measures in place for rooftop package unit installation?" },
      { id: "q4", label: "Are gas and power connections for rooftop package unit installation installed and tested safely?" },
      { id: "q5", label: "Is weather monitored and rooftop package unit installation suspended in unsafe conditions?" }
    ]
  },

  "Rooftop plant access & maintenance": {
    desc: "Rooftop plant access & maintenance covers routine visits to rooftop equipment for inspection, cleaning, adjustments and small repairs. Safe access routes, edge protection and weather considerations are critical to prevent falls and exposure.",
    hazards: ["work_at_height", "environmental_weather", "slips_trips"],
    questions: [
      { id: "q1", label: "Is permanent safe access provided for rooftop plant access & maintenance?" },
      { id: "q2", label: "Are guardrails or fall arrest systems in place for rooftop plant access & maintenance?" },
      { id: "q3", label: "Is weather risk assessed before rooftop plant access & maintenance is carried out?" },
      { id: "q4", label: "Are walkways kept clear during rooftop plant access & maintenance?" },
      { id: "q5", label: "Is lone working considered and controlled for rooftop plant access & maintenance?" }
    ]
  },

  "Cold room / walk-in chiller install": {
    desc: "Cold room / walk-in chiller install involves erecting insulated panels, fitting doors, installing refrigeration plant, drains and controls. Works must consider vapour barriers, floor finishes and door safety mechanisms. Plant location and noise impact are planned.",
    hazards: ["manual_handling", "dust_fumes", "chemical_coshh", "slips_trips"],
    questions: [
      { id: "q1", label: "Are panels for cold room / walk-in chiller install handled safely and with lifting aids where needed?" },
      { id: "q2", label: "Are vapour barriers and seals installed correctly for cold room / walk-in chiller install?" },
      { id: "q3", label: "Is floor finish for cold room / walk-in chiller install suitable for cleaning and slip resistance?" },
      { id: "q4", label: "Are door safety features and releases tested after cold room / walk-in chiller install?" },
      { id: "q5", label: "Is refrigeration plant for cold room / walk-in chiller install commissioned and documented?" }
    ]
  },

  "Cold room service & repair": {
    desc: "Cold room service & repair covers routine maintenance, defrost checks, door seal repairs and refrigeration fault rectification. Work is carried out in cold environments with limited space. Condensation and ice can cause slips and working time must be managed.",
    hazards: ["cold_stress", "slips_trips", "chemical_coshh", "confined_space"],
    questions: [
      { id: "q1", label: "Is working time in cold room service & repair limited and monitored to prevent cold stress?" },
      { id: "q2", label: "Are slip hazards from ice and water controlled during cold room service & repair?" },
      { id: "q3", label: "Are refrigerant works during cold room service & repair carried out to F-gas standards?" },
      { id: "q4", label: "Is there a means of communication and emergency egress for cold room service & repair?" },
      { id: "q5", label: "Are door heaters and seals checked and repaired as part of cold room service & repair?" }
    ]
  },

  "Pressurisation unit install & commissioning": {
    desc: "Pressurisation unit install & commissioning involves fitting units that maintain system pressure in closed heating and cooling circuits. Works include connecting pipework, electrics and controls, and setting pressure regimes. System cleanliness and expansion arrangements are checked.",
    hazards: ["water_ingress", "manual_handling", "live_electricity"],
    questions: [
      { id: "q1", label: "Are isolation valves and drain points in place before pressurisation unit install & commissioning?" },
      { id: "q2", label: "Is electrical supply for pressurisation unit install & commissioning correctly rated and isolated?" },
      { id: "q3", label: "Are pressure settings and safeties configured during pressurisation unit install & commissioning?" },
      { id: "q4", label: "Is there a plan to manage spills during pressurisation unit install & commissioning?" },
      { id: "q5", label: "Is documentation updated following pressurisation unit install & commissioning?" }
    ]
  },

  "Expansion vessel replacement (HVAC circuit)": {
    desc: "Expansion vessel replacement (HVAC circuit) includes isolating, draining and replacing vessels that accommodate thermal expansion in heating or cooling systems. Vessels may be located at height or in plantrooms. Correct pre-charge and reconnection are essential.",
    hazards: ["manual_handling", "water_ingress", "work_at_height"],
    questions: [
      { id: "q1", label: "Are systems safely isolated and depressurised before expansion vessel replacement (HVAC circuit)?" },
      { id: "q2", label: "Is suitable access in place for expansion vessel replacement (HVAC circuit), especially at height?" },
      { id: "q3", label: "Are lifting aids used where necessary during expansion vessel replacement (HVAC circuit)?" },
      { id: "q4", label: "Is vessel pre-charge set correctly during expansion vessel replacement (HVAC circuit)?" },
      { id: "q5", label: "Are systems refilled, vented and checked for leaks after expansion vessel replacement (HVAC circuit)?" }
    ]
  }
};

// ==========================================
// 4. MASTER TRADE REGISTRY
// ==========================================

export const TRADES = {
  Electrician: {
    jobs: Object.keys(ELECTRICIAN_CLUSTERS).map((name) => ({ name })),
    clusters: ELECTRICIAN_CLUSTERS,
  },

  Plumber: {
    jobs: Object.keys(PLUMBER_CLUSTERS).map((name) => ({ name })),
    clusters: PLUMBER_CLUSTERS,
  },

  Builder: {
    jobs: Object.keys(BUILDER_CLUSTERS).map((name) => ({ name })),
    clusters: BUILDER_CLUSTERS,
  },

  Roofer: {
    jobs: Object.keys(ROOFER_CLUSTERS).map((name) => ({ name })),
    clusters: ROOFER_CLUSTERS,
  },

  "Carpenter / Joiner": {
    jobs: Object.keys(CARPENTER_JOINER_CLUSTERS).map((name) => ({ name })),
    clusters: CARPENTER_JOINER_CLUSTERS,
  },

  "Drylining & Ceilings": {
    jobs: Object.keys(DRYLINING_CEILINGS_CLUSTERS).map((name) => ({ name })),
    clusters: DRYLINING_CEILINGS_CLUSTERS,
  },

  "Groundworks & Civils": {
    jobs: Object.keys(GROUNDWORKS_CIVILS_CLUSTERS).map((name) => ({ name })),
    clusters: GROUNDWORKS_CIVILS_CLUSTERS,
  },

  "Demolition & Strip-Out": {
    jobs: Object.keys(DEMOLITION_STRIPOUT_CLUSTERS).map((name) => ({ name })),
    clusters: DEMOLITION_STRIPOUT_CLUSTERS,
  },

  "HVAC / Air Conditioning": {
    jobs: Object.keys(HVAC_AIRCON_CLUSTERS).map((name) => ({ name })),
    clusters: HVAC_AIRCON_CLUSTERS,
  },
};