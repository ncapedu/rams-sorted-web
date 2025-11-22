// app/lib/constants.ts

// ==========================================
// 1. TYPE DEFINITIONS & TYPESCRIPT INTERFACES
// ==========================================

export type HazardKey = string;

export interface HazardDef {
  label: string;
  risk: string;
  control: string;
  initial_score: string; // e.g., "High (15)"
  residual_score: string; // e.g., "Low (4)"
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
// 2. MASTER HAZARD DATABASE (UK HSE COMPLIANT)
// ==========================================

export const HAZARD_DATA: Record<string, HazardDef> = {
  // --- ELECTRICAL ---
  live_electricity: { 
    label: "Live Electricity / Arc Flash", 
    risk: "Electric shock, severe burns, ventricular fibrillation, fatality, fire, arc flash explosion.", 
    control: "Strict adherence to EAWR 1989. Safe Isolation Procedure (Lock-Out Tag-Out). Use of GS38 approved voltage indicators. Proving unit to verify tester. Insulated tools (VDE approved). Barriers and signage posted.",
    initial_score: "High (20)",
    residual_score: "Low (4)"
  },
  stored_energy: {
    label: "Stored Energy (Capacitors/DC)",
    risk: "Electric shock from residual charge, DC arc burns.",
    control: "Discharge time allowance observed. DC Isolation verified. Shorting straps used where appropriate.",
    initial_score: "High (15)",
    residual_score: "Low (3)"
  },
  
  // --- GAS & HEAT ---
  gas: { 
    label: "Gas Supply (Natural/LPG)", 
    risk: "Explosion, fire, asphyxiation, carbon monoxide poisoning.", 
    control: "Work strictly by Gas Safe registered engineer. Soundness testing before/after work. Ventilation maintained. ECV located and accessible. LDF (Leak Detection Fluid) used.",
    initial_score: "High (25)",
    residual_score: "Low (5)"
  },
  hot_work: { 
    label: "Hot Works (Soldering/Welding)", 
    risk: "Ignition of combustible materials, burns, smoke inhalation.", 
    control: "Hot Work Permit issued. 1-hour fire watch post-completion. Class ABC Fire Extinguisher immediately to hand. Heat mats used to protect fabric.",
    initial_score: "High (16)",
    residual_score: "Medium (8)"
  },
  
  // --- HEIGHT & ACCESS ---
  work_at_height: { 
    label: "Working at Height", 
    risk: "Falls from height leading to major injury or death. Dropped objects.", 
    control: "Hierarchy of control applied. Scaffold or Tower preferred. Ladders for short duration only, secured/tied off. 3-points of contact maintained. Exclusion zone below.",
    initial_score: "High (20)",
    residual_score: "Low (5)"
  },
  fragile_surfaces: {
    label: "Fragile Roof Surfaces",
    risk: "Falling through roof lights or weakened boards.",
    control: "Crawling boards/stagings used. Harness and running line system. Warning signage posted. Do not step on skylights.",
    initial_score: "High (25)",
    residual_score: "Medium (10)"
  },
  falling_objects: {
    label: "Falling Objects",
    risk: "Head injuries to operatives or public below.",
    control: "Toe boards on scaffold. Tool lanyards used. Hard hats mandatory (EN397). Exclusion zone (barrier tape) established below work area.",
    initial_score: "High (15)",
    residual_score: "Low (3)"
  },

  // --- HEALTH & SUBSTANCES ---
  dust_fumes: { 
    label: "General Dust & Fumes", 
    risk: "Respiratory sensitization, asthma, eye irritation, coughing.", 
    control: "Work area well ventilated. Local Exhaust Ventilation (LEV) on power tools. Damp down dust where possible. P3/FFP3 Masks worn.",
    initial_score: "Medium (12)",
    residual_score: "Low (4)"
  },
  silica_dust: { 
    label: "Respirable Crystalline Silica (RCS)", 
    risk: "Silicosis, lung cancer, COPD, permanent lung damage.", 
    control: "Strict dust suppression (water). On-tool extraction (M-Class vacuum). FFP3 Face Fit tested masks mandatory. Limit exposure time.",
    initial_score: "High (20)",
    residual_score: "Low (5)"
  },
  asbestos: { 
    label: "Asbestos Containing Materials (ACM)", 
    risk: "Mesothelioma, asbestosis, lung cancer (fatal long term).", 
    control: "Refurbishment/Demolition survey reviewed. If suspected, STOP WORK immediately. Specialist licensed contractor required for removal.",
    initial_score: "High (25)",
    residual_score: "Low (5)"
  },
  chemical_coshh: { 
    label: "Hazardous Substances (COSHH)", 
    risk: "Chemical burns, dermatitis, poisoning, inhalation.", 
    control: "Safety Data Sheets (SDS) available. Specific PPE (Nitrile gloves, goggles EN166). Wash station nearby. Spill kit available.",
    initial_score: "Medium (12)",
    residual_score: "Low (4)"
  },
  biological: { 
    label: "Biological Hazards (Sewage/Rodents)", 
    risk: "Weil's disease (Leptospirosis), Hepatitis, E.Coli infection.", 
    control: "Waterproof gloves. Cover all open wounds. No eating/drinking in work area. Anti-bacterial wipes used. Welfare facilities provided.",
    initial_score: "High (15)",
    residual_score: "Low (5)"
  },
  lead_exposure: {
    label: "Lead Exposure",
    risk: "Lead poisoning (ingestion/inhalation), headaches, fatigue.",
    control: "Gloves worn when handling lead sheet. Hand washing before eating. Cold cutting methods preferred to prevent fumes.",
    initial_score: "Medium (10)",
    residual_score: "Low (3)"
  },

  // --- PHYSICAL & MANUAL ---
  manual_handling: { 
    label: "Manual Handling", 
    risk: "Musculoskeletal disorders, back injury, hernia, dropped loads.", 
    control: "Mechanical aids (trolley/lift) used where possible. TILE assessment (Task, Individual, Load, Environment). Team lifting for heavy items.",
    initial_score: "Medium (12)",
    residual_score: "Low (4)"
  },
  noise_vibration: { 
    label: "Noise & Vibration", 
    risk: "Tinnitus, hearing loss, Hand-Arm Vibration Syndrome (HAVS).", 
    control: "Hearing protection (Ear defenders/plugs) in designated zones. Exposure time monitoring. Use of anti-vibration gloves and modern tools.",
    initial_score: "Medium (12)",
    residual_score: "Low (4)"
  },
  sharp_objects: {
    label: "Sharp Objects / Blades",
    risk: "Lacerations, puncture wounds, infection.",
    control: "Retractable blades used. Kevlar cut-resistant gloves (EN388 Level 3-5). Safe disposal of used blades in sharps box.",
    initial_score: "Medium (9)",
    residual_score: "Low (3)"
  },
  confined_space: { 
    label: "Confined Space", 
    risk: "Asphyxiation, toxic gas accumulation, heat stress, entrapment.", 
    control: "Confined Space training. Gas monitor (4-gas). Tripod and winch. Top man present. Emergency rescue plan in place.",
    initial_score: "High (25)",
    residual_score: "Medium (10)"
  },

  // --- SITE & ENVIRONMENT ---
  slips_trips: { 
    label: "Slips, Trips & Falls", 
    risk: "Fractures, bruising, head injury.", 
    control: "Good housekeeping. Trailing leads managed/taped. Walkways kept clear. Adequate task lighting installed.",
    initial_score: "Medium (9)",
    residual_score: "Low (3)"
  },
  public_interface: { 
    label: "Public / Occupants", 
    risk: "Injury to third parties, unauthorized access, claims.", 
    control: "Work area segregated with physical barriers. Warning signage posted. Tools never left unattended. Access routes protected.",
    initial_score: "High (15)",
    residual_score: "Low (5)"
  },
  lone_working: { 
    label: "Lone Working", 
    risk: "Inability to summon help, medical emergency escalation.", 
    control: "Hourly check-in procedure. Mobile phone fully charged. No high-risk tasks (live working/height) to be undertaken alone.",
    initial_score: "Medium (12)",
    residual_score: "Low (6)"
  },
  environmental_weather: { 
    label: "Adverse Weather", 
    risk: "Hypothermia, heat stress, slips on ice, high winds affecting stability.", 
    control: "Monitor forecast daily. Stop work policy for high winds/lightning. Appropriate clothing/PPE provided. Hydration.",
    initial_score: "Medium (10)",
    residual_score: "Low (4)"
  },
  water_ingress: {
    label: "Water Ingress / Flooding",
    risk: "Property damage, electrical short circuits, slips.",
    control: "Isolation valves located. Wet vac and spill kits available. Temporary sheeting/protection in place.",
    initial_score: "Medium (9)",
    residual_score: "Low (3)"
  },
  poor_lighting: {
    label: "Poor Lighting",
    risk: "Trips, mistakes, eye strain.",
    control: "Temporary task lighting provided. Torches carried by operatives.",
    initial_score: "Medium (8)",
    residual_score: "Low (3)"
  },
  
  // --- STRUCTURAL & CIVIL ---
  structural_collapse: { 
    label: "Structural Instability", 
    risk: "Crushing, burial, fatal injury from collapse.", 
    control: "Temporary supports (Acrows/Strongboys) installed per engineer design. Method statement followed strictly. Stop work if movement detected.",
    initial_score: "High (25)",
    residual_score: "Low (5)"
  },
  excavation: { 
    label: "Excavation / Groundworks", 
    risk: "Trench collapse, burial, striking underground services.", 
    control: "Trench support (shoring) for depths >1.2m. Batter back sides. Stop blocks for plant. Ladder access. CAT Scan performed.",
    initial_score: "High (20)",
    residual_score: "Low (5)"
  },
  underground_services: {
    label: "Underground Services",
    risk: "Electrocution, gas explosion, water jet injury.",
    control: "Desktop utility search. CAT and Genny scan. Hand dig trial holes. Insulated digging tools.",
    initial_score: "High (25)",
    residual_score: "Low (5)"
  },
  plant_machinery: { 
    label: "Plant & Machinery", 
    risk: "Entanglement, crushing, impact, overturning.", 
    control: "Operators CPCS/NPORS trained. Banksman used for reversing. Flashing beacons active. Keys removed when unattended.",
    initial_score: "High (20)",
    residual_score: "Low (5)"
  },
  fire_explosion: { 
    label: "Fire & Explosion", 
    risk: "Burns, smoke inhalation, property damage.", 
    control: "Fire extinguishers, clear exit routes, control of ignition sources.",
    initial_score: "High (20)",
    residual_score: "Medium (8)"
  }
};

export const HAZARD_GROUPS = {
  "High Risk": ["live_electricity", "gas", "work_at_height", "confined_space", "structural_collapse", "fire_explosion", "excavation", "asbestos"],
  "Health": ["dust_fumes", "silica_dust", "noise_vibration", "chemical_coshh", "biological", "lead_exposure"],
  "Site Environment": ["slips_trips", "public_interface", "lone_working", "environmental_weather", "water_ingress", "poor_lighting", "fragile_surfaces", "falling_objects"],
  "Physical & Tools": ["manual_handling", "plant_machinery", "underground_services", "sharp_objects"]
};

// ==========================================
// 3. TRADE CLUSTERS (THE LOGIC ENGINE)
// ==========================================

// --- ELECTRICIAN LOGIC ---
const ELECTRICIAN_CLUSTERS = {
  domestic_small: {
    desc: "Standard electrical installation, maintenance, or alteration within domestic premises.",
    hazards: ["live_electricity", "manual_handling", "dust_fumes", "slips_trips", "public_interface"],
    questions: [
      { id: "isolation", label: "Can the main supply be fully isolated?" },
      { id: "occupied", label: "Is the property occupied by residents?" },
      { id: "floorboards", label: "Will floorboards need to be lifted?" },
      { id: "rcd", label: "Is there existing RCD protection on circuits?" },
      { id: "bonding", label: "Is main equipotential bonding in place?" },
      { id: "pets", label: "Are there pets/children requiring exclusion zones?" }
    ],
    ppe: ["Safety Boots (EN20345)", "Hi-Vis Vest", "Light Eye Protection"]
  },
  distribution: {
    desc: "Replacement or upgrade of electrical distribution equipment (Consumer Units/Panel Boards).",
    hazards: ["live_electricity", "manual_handling", "fire_explosion", "public_interface"],
    questions: [
      { id: "lock_off", label: "Do you have a padlock/key for Lock-Out Tag-Out?" },
      { id: "tails_condition", label: "Are the meter tails in good condition?" },
      { id: "ze_check", label: "Has the external loop impedance (Ze) been verified?" },
      { id: "circuits_id", label: "Are all existing circuits identified/labelled?" },
      { id: "metal_unit", label: "Is the new unit non-combustible (Amendment 3)?" },
      { id: "seals", label: "Are the main fuse seals intact?" }
    ],
    ppe: ["Safety Boots", "Arc Flash Visor (if commercial)", "Insulated Gloves"]
  },
  external: {
    desc: "Installation of external electrical equipment (Lighting, EV Chargers, Power).",
    hazards: ["live_electricity", "work_at_height", "environmental_weather", "silica_dust", "water_ingress"],
    questions: [
      { id: "weather", label: "Is the weather suitable for external work?" },
      { id: "ip_rating", label: "Are all fittings suitably IP rated?" },
      { id: "ladder_footing", label: "Is the ground level/stable for ladders?" },
      { id: "swa_gland", label: "Will armoured cable (SWA) be used?" },
      { id: "drilling", label: "Is dust extraction available for drilling?" },
      { id: "rcd_ext", label: "Is the external supply RCD protected?" }
    ],
    ppe: ["Safety Boots", "Hard Hat (if overhead work)", "Gloves"]
  },
  testing: {
    desc: "Inspection and testing of electrical installations (EICR). Non-intrusive where possible.",
    hazards: ["live_electricity", "slips_trips", "lone_working"],
    questions: [
      { id: "permission", label: "Do you have permission to disconnect circuits?" },
      { id: "defects", label: "Are there known dangerous defects (C1)?" },
      { id: "access", label: "Is there safe access to all accessories?" },
      { id: "live_test", label: "Will live testing (Zs) be performed?" },
      { id: "labels", label: "Are warning labels present on the board?" },
      { id: "gs38", label: "Are test leads GS38 compliant?" }
    ],
    ppe: ["Safety Boots", "Safety Glasses"]
  },
  ev_pv_battery: {
    desc: "Installation of Green Energy systems (Solar, EV, Battery).",
    hazards: ["live_electricity", "work_at_height", "manual_handling", "fire_explosion", "structural_collapse", "stored_energy"],
    questions: [
      { id: "dno", label: "Has DNO approval been submitted?" },
      { id: "dc_iso", label: "Is DC isolation (Solar) accessible?" },
      { id: "roof_loading", label: "Has roof structural load been checked?" },
      { id: "battery_vent", label: "Is the battery storage area ventilated?" },
      { id: "ev_earth", label: "Is a separate earth rod required?" },
      { id: "scaffold_pv", label: "Is scaffolding erected for panel install?" }
    ],
    ppe: ["Safety Boots", "Harness (for roof)", "Hard Hat"]
  },
  commercial: {
    desc: "Tray, trunking, and commercial fit-outs.",
    hazards: ["live_electricity", "work_at_height", "noise_vibration", "plant_machinery", "dust_fumes"],
    questions: [
      { id: "permit", label: "Is a Permit to Work needed?" },
      { id: "mewp", label: "Is a MEWP/Scissor lift required?" },
      { id: "containment", label: "Does the job involve cutting metal tray/trunking?" },
      { id: "ppe", label: "Is site-specific PPE (Hard hat) mandatory?" },
      { id: "coord", label: "Are you working around other trades?" },
      { id: "induct", label: "Has site induction been completed?" }
    ],
    ppe: ["Safety Boots", "Hard Hat", "Hi-Vis", "Ear Defenders"]
  }
};

// --- PLUMBER LOGIC ---
const PLUMBER_CLUSTERS = {
  gas_work: {
    desc: "Boilers, hobs, and gas pipework.",
    hazards: ["gas", "hot_work", "manual_handling", "dust_fumes", "chemical_coshh"],
    questions: [
      { id: "gassafe", label: "Are all operatives Gas Safe registered?" },
      { id: "flue", label: "Is the flue route accessible and compliant?" },
      { id: "vent", label: "Is ventilation adequate for testing?" },
      { id: "co", label: "Is a Carbon Monoxide alarm being installed?" },
      { id: "leak", label: "Will a tightness test be performed?" },
      { id: "analyser", label: "Is the flue gas analyser calibrated?" }
    ],
    ppe: ["Safety Boots", "Heat Resistant Gloves", "Knee Pads"]
  },
  wet_plumbing: {
    desc: "Bathrooms, showers, and sinks.",
    hazards: ["water_ingress", "manual_handling", "slips_trips", "silica_dust", "biological"],
    questions: [
      { id: "iso", label: "Can water be isolated locally?" },
      { id: "waste", label: "Is the waste pipe route accessible?" },
      { id: "tile", label: "Will tiles be cut (Dust risk)?" },
      { id: "seal", label: "Is ventilation available for silicone application?" },
      { id: "lift", label: "Is help available for heavy lifting (Baths)?" },
      { id: "elec", label: "Are electrics isolated in the wet zone?" }
    ],
    ppe: ["Safety Boots", "Gloves", "Eye Protection"]
  },
  drainage: {
    desc: "Soil stacks, drains, and blockages.",
    hazards: ["biological", "confined_space", "excavation", "underground_services", "slips_trips"],
    questions: [
      { id: "gloves", label: "Are heavy duty rubber gloves available?" },
      { id: "vaccine", label: "Are operatives vaccinated (Hep B)?" },
      { id: "deep", label: "Is excavation deeper than 1.2m?" },
      { id: "confined", label: "Is entry into a manhole required?" },
      { id: "wash", label: "Are wash-down facilities nearby?" },
      { id: "rat", label: "Is there evidence of rodent activity?" }
    ],
    ppe: ["Rubber Gloves", "Face Shield", "Disposable Overalls"]
  },
  heating_systems: {
    desc: "Radiators, UFH, and cylinders.",
    hazards: ["hot_work", "manual_handling", "slips_trips", "water_ingress", "chemical_coshh"],
    questions: [
      { id: "drain", label: "Can the system be drained easily?" },
      { id: "hot", label: "Are pipes hot (Burn risk)?" },
      { id: "chem", label: "Will inhibitors be used (COSHH)?" },
      { id: "floor", label: "Do floorboards need lifting?" },
      { id: "press", label: "Will the system be pressure tested?" },
      { id: "g3", label: "Is the installer G3 qualified (Unvented)?" }
    ],
    ppe: ["Safety Boots", "Knee Pads", "Gloves"]
  }
};

// --- ROOFER LOGIC ---
const ROOFER_CLUSTERS = {
  pitched: {
    desc: "Working on sloped roofs (Tiles, Slates).",
    hazards: ["work_at_height", "falling_objects", "environmental_weather", "fragile_surfaces"],
    questions: [
      { id: "scaf", label: "Is full scaffolding erected?" },
      { id: "edge", label: "Is edge protection (handrails) in place?" },
      { id: "ladder", label: "Is the access ladder tied off?" },
      { id: "weather", label: "Is the weather forecast clear?" },
      { id: "zone", label: "Is the area below cordoned off?" },
      { id: "asbestos", label: "Are existing tiles suspected asbestos?" }
    ],
    ppe: ["Safety Boots (Non-slip)", "Hard Hat", "Gloves"]
  },
  flat_hot: {
    desc: "Torch-on felt and hot works.",
    hazards: ["work_at_height", "hot_work", "fire_explosion", "chemical_coshh", "dust_fumes"],
    questions: [
      { id: "torch", label: "Will a propane torch be used?" },
      { id: "ext", label: "Is a fire extinguisher immediately to hand?" },
      { id: "deck", label: "Is the deck structurally sound?" },
      { id: "permit", label: "Is a Hot Work Permit required?" },
      { id: "fumes", label: "Are air intakes covered?" },
      { id: "cool", label: "Is a 1-hour fire watch planned?" }
    ],
    ppe: ["Safety Boots", "Fire Retardant Overalls", "Gloves"]
  },
  flat_cold: {
    desc: "EPDM, GRP, and liquid systems.",
    hazards: ["work_at_height", "chemical_coshh", "dust_fumes", "slips_trips"],
    questions: [
      { id: "resin", label: "Are resins/hardeners used?" },
      { id: "ppe_chem", label: "Are chemical gloves/goggles worn?" },
      { id: "weather", label: "Is the deck dry?" },
      { id: "edge", label: "Is edge protection in place?" },
      { id: "waste", label: "Is there a disposal bag for empty tins?" }
    ],
    ppe: ["Chemical Resistant Gloves", "Safety Glasses", "Safety Boots"]
  },
  repair_access: {
    desc: "Guttering, cleaning, and minor repairs.",
    hazards: ["work_at_height", "environmental_weather", "public_interface"],
    questions: [
      { id: "short", label: "Is the work short duration (<30 mins)?" },
      { id: "ladder", label: "Can the ladder be secured/footed?" },
      { id: "public", label: "Is the public protected below?" },
      { id: "fragile", label: "Are there fragile skylights nearby?" },
      { id: "reach", label: "Can work be done without overreaching?" }
    ],
    ppe: ["Safety Boots", "Hard Hat", "Gloves"]
  }
};

// --- BUILDER LOGIC ---
const BUILDER_CLUSTERS = {
  structural: {
    desc: "Major alterations, steelwork, and load bearing walls.",
    hazards: ["structural_collapse", "dust_fumes", "noise_vibration", "plant_machinery", "manual_handling"],
    questions: [
      { id: "eng", label: "Are structural calcs available?" },
      { id: "props", label: "Are Acrows/Strongboys on site?" },
      { id: "dust", label: "Is dust extraction used on saws?" },
      { id: "load", label: "Is the wall definitely load-bearing?" },
      { id: "lift", label: "Is a Genie lift needed for the beam?" },
      { id: "padstones", label: "Are padstones cured and ready?" }
    ],
    ppe: ["Safety Boots (Steel Midsole)", "Hard Hat", "Gloves", "Ear Defenders"]
  },
  groundworks: {
    desc: "Digging, foundations, and concrete.",
    hazards: ["excavation", "underground_services", "plant_machinery", "biological", "manual_handling"],
    questions: [
      { id: "cat", label: "Has a CAT scan been done?" },
      { id: "shore", label: "Is trench shoring needed (>1.2m)?" },
      { id: "barrier", label: "Are excavations barriered off?" },
      { id: "cpcs", label: "Is the digger driver CPCS qualified?" },
      { id: "spoil", label: "Is spoil stored safely away from edge?" },
      { id: "water", label: "Is a pump needed for ground water?" }
    ],
    ppe: ["Safety Boots", "Hi-Vis", "Hard Hat"]
  },
  finishes: {
    desc: "Plastering, painting, and decorating.",
    hazards: ["slips_trips", "work_at_height", "dust_fumes", "manual_handling", "chemical_coshh"],
    questions: [
      { id: "hopup", label: "Are hop-ups/platforms stable?" },
      { id: "mix", label: "Is mixing done in a ventilated area?" },
      { id: "protect", label: "Are floors protected?" },
      { id: "water", label: "Is water available for mixing?" },
      { id: "waste", label: "Is waste disposal arranged?" }
    ],
    ppe: ["Safety Boots", "Dust Mask", "Gloves"]
  },
  carpentry: {
    desc: "Joists, roofing, stud walls, and doors.",
    hazards: ["sharp_objects", "dust_fumes", "noise_vibration", "manual_handling", "work_at_height"],
    questions: [
      { id: "saw", label: "Are saw guards in place?" },
      { id: "dust", label: "Is extraction fitted to saws?" },
      { id: "nails", label: "Are old nails removed/flattened?" },
      { id: "manual", label: "Is help available for long timbers?" },
      { id: "access", label: "Is the work area clear of trip hazards?" }
    ],
    ppe: ["Safety Boots", "Eye Protection", "Cut Resistant Gloves"]
  }
};

// --- MASTER MAPPING (200+ JOBS) ---
export const TRADES = {
  Electrician: {
    clusters: ELECTRICIAN_CLUSTERS,
    jobs: [
      { name: "Consumer Unit Replacement", cluster: "distribution" },
      { name: "Full House Rewire", cluster: "heavy_install" },
      { name: "Partial Rewire", cluster: "heavy_install" },
      { name: "New Circuit Installation", cluster: "basic_install" },
      { name: "Additional Sockets", cluster: "basic_install" },
      { name: "Indoor Lighting Upgrade", cluster: "basic_install" },
      { name: "Outdoor/Garden Lighting", cluster: "outdoor_power" },
      { name: "Fault Finding", cluster: "testing" },
      { name: "EV Charger Installation", cluster: "ev_pv_battery" },
      { name: "EICR (Domestic)", cluster: "testing" },
      { name: "EICR (Commercial)", cluster: "testing" },
      { name: "Smoke/Heat Alarm Install", cluster: "basic_install" },
      { name: "Fire Alarm System", cluster: "commercial" },
      { name: "Emergency Lighting", cluster: "commercial" },
      { name: "Data Cabling", cluster: "commercial" },
      { name: "CCTV Installation", cluster: "outdoor_power" },
      { name: "Door Entry/Intercom", cluster: "outdoor_power" },
      { name: "Solar PV Installation", cluster: "ev_pv_battery" },
      { name: "Battery Storage", cluster: "ev_pv_battery" },
      { name: "Generator Installation", cluster: "distribution" },
      { name: "Temporary Site Electrics", cluster: "distribution" },
      { name: "Cooker/Oven Circuit", cluster: "basic_install" },
      { name: "Electric Shower", cluster: "basic_install" },
      { name: "Loft Wiring", cluster: "basic_install" },
      { name: "Garage Electrics", cluster: "outdoor_power" },
      { name: "Extension First Fix", cluster: "heavy_install" },
      { name: "Extension Second Fix", cluster: "basic_install" },
      { name: "LED Retrofit", cluster: "basic_install" },
      { name: "Commercial Lighting", cluster: "commercial" },
      { name: "Warehouse Lighting", cluster: "commercial" },
      { name: "PAT Testing", cluster: "testing" },
      { name: "RCD Upgrade", cluster: "distribution" },
      { name: "Fuse/Breaker Repair", cluster: "basic_install" },
      { name: "Electric Heating", cluster: "basic_install" },
      { name: "Underfloor Heating (Elec)", cluster: "basic_install" },
      { name: "Immersion Heater", cluster: "basic_install" },
      { name: "Security Lighting", cluster: "outdoor_power" },
      { name: "Floodlight Install", cluster: "outdoor_power" },
      { name: "Smart Home System", cluster: "basic_install" },
      { name: "Thermostat Install", cluster: "basic_install" },
      { name: "Car Park Lighting", cluster: "outdoor_power" },
      { name: "Shop Fit-out", cluster: "commercial" },
      { name: "Containment Install", cluster: "commercial" },
      { name: "Cable Management", cluster: "commercial" },
      { name: "Meter Relocation", cluster: "distribution" },
      { name: "Sub-main Install", cluster: "distribution" },
      { name: "Machinery Wiring", cluster: "commercial" },
      { name: "Agricultural Electrics", cluster: "outdoor_power" },
      { name: "EV Infrastructure", cluster: "ev_pv_battery" },
      { name: "Other (Custom)", cluster: "basic_install" }
    ]
  },
  Plumber: {
    clusters: PLUMBER_CLUSTERS,
    jobs: [
      { name: "Boiler Install (Gas)", cluster: "gas_work" },
      { name: "Combi Boiler Swap", cluster: "gas_work" },
      { name: "Boiler Service", cluster: "gas_work" },
      { name: "Boiler Repair", cluster: "gas_work" },
      { name: "Gas Leak Detection", cluster: "gas_work" },
      { name: "Gas Pipe Rerouting", cluster: "gas_work" },
      { name: "Gas Hob Install", cluster: "gas_work" },
      { name: "Central Heating Install", cluster: "heating_systems" },
      { name: "Radiator Install", cluster: "heating_systems" },
      { name: "Radiator Relocation", cluster: "heating_systems" },
      { name: "Underfloor Heating", cluster: "heating_systems" },
      { name: "Hot Water Cylinder", cluster: "heating_systems" },
      { name: "Unvented Cylinder", cluster: "heating_systems" },
      { name: "Immersion Heater", cluster: "heating_systems" },
      { name: "Bathroom Installation", cluster: "wet_plumbing" },
      { name: "Shower Installation", cluster: "wet_plumbing" },
      { name: "Toilet Repair/Swap", cluster: "wet_plumbing" },
      { name: "Sink/Vanity Install", cluster: "wet_plumbing" },
      { name: "Mixer Tap Swap", cluster: "wet_plumbing" },
      { name: "Thermostatic Valve", cluster: "wet_plumbing" },
      { name: "Burst Pipe Repair", cluster: "wet_plumbing" },
      { name: "Leak Trace", cluster: "wet_plumbing" },
      { name: "Drain Unblocking", cluster: "drainage" },
      { name: "Drain CCTV Survey", cluster: "drainage" },
      { name: "Soil Stack Repair", cluster: "drainage" },
      { name: "Guttering Repair", cluster: "drainage" },
      { name: "Kitchen First Fix", cluster: "wet_plumbing" },
      { name: "Kitchen Second Fix", cluster: "wet_plumbing" },
      { name: "Dishwasher Plumb", cluster: "wet_plumbing" },
      { name: "Washing Machine", cluster: "wet_plumbing" },
      { name: "Outdoor Tap", cluster: "wet_plumbing" },
      { name: "Water Softener", cluster: "heating_systems" },
      { name: "Rainwater Harvest", cluster: "drainage" },
      { name: "Sump Pump", cluster: "drainage" },
      { name: "Pumped Shower", cluster: "wet_plumbing" },
      { name: "Macerator Toilet", cluster: "wet_plumbing" },
      { name: "Commercial Boiler", cluster: "gas_work" },
      { name: "Plant Room Works", cluster: "gas_work" },
      { name: "Pressurised Test", cluster: "heating_systems" },
      { name: "Pipe Insulation", cluster: "heating_systems" },
      { name: "Heating Pump", cluster: "heating_systems" },
      { name: "Expansion Vessel", cluster: "heating_systems" },
      { name: "Hot & Cold Pipework", cluster: "heating_systems" },
      { name: "Wet Room", cluster: "wet_plumbing" },
      { name: "Grey Water System", cluster: "drainage" },
      { name: "Septic Tank", cluster: "drainage" },
      { name: "Manhole Replace", cluster: "drainage" },
      { name: "Bathroom Rip-out", cluster: "wet_plumbing" },
      { name: "Power Flushing", cluster: "heating_systems" },
      { name: "Urinal Install", cluster: "wet_plumbing" },
      { name: "Other (Custom)", cluster: "wet_plumbing" }
    ]
  },
  Roofer: {
    clusters: ROOFER_CLUSTERS,
    jobs: [
      { name: "Pitched Roof Re-tile", cluster: "pitched" },
      { name: "Slate Roof Install", cluster: "pitched" },
      { name: "Flat Roof (Felt)", cluster: "flat_hot" },
      { name: "Flat Roof (GRP)", cluster: "flat_cold" },
      { name: "Flat Roof (EPDM)", cluster: "flat_cold" },
      { name: "Lead Flashing", cluster: "pitched" },
      { name: "Lead Welding", cluster: "flat_hot" },
      { name: "Gutter Install", cluster: "repair_access" },
      { name: "Gutter Repair", cluster: "repair_access" },
      { name: "Fascia & Soffit", cluster: "repair_access" },
      { name: "Chimney Repoint", cluster: "repair_access" },
      { name: "Chimney Rebuild", cluster: "pitched" },
      { name: "Chimney Removal", cluster: "pitched" },
      { name: "Roof Leak Find", cluster: "repair_access" },
      { name: "Emergency Leak Fix", cluster: "repair_access" },
      { name: "Moss Removal", cluster: "pitched" },
      { name: "Roof Cleaning", cluster: "pitched" },
      { name: "Ridge Repoint", cluster: "pitched" },
      { name: "Valley Replace", cluster: "pitched" },
      { name: "Ventilation Install", cluster: "pitched" },
      { name: "Velux Install", cluster: "pitched" },
      { name: "Dormer Build", cluster: "pitched" },
      { name: "Skylight Replace", cluster: "pitched" },
      { name: "Soffit Vents", cluster: "repair_access" },
      { name: "Roof Insulation", cluster: "pitched" },
      { name: "Loft Insulation", cluster: "repair_access" },
      { name: "Flat-to-Pitched", cluster: "pitched" },
      { name: "Re-bed Ridge", cluster: "pitched" },
      { name: "Soffit Repair", cluster: "repair_access" },
      { name: "Roof Coating", cluster: "flat_cold" },
      { name: "EPDM Patch", cluster: "flat_cold" },
      { name: "GRP Patch", cluster: "flat_cold" },
      { name: "Underlay Replace", cluster: "pitched" },
      { name: "Minor Tile Replace", cluster: "repair_access" },
      { name: "Bargeboards", cluster: "repair_access" },
      { name: "Verge Repair", cluster: "pitched" },
      { name: "Cowl Install", cluster: "repair_access" },
      { name: "Bird Proofing", cluster: "repair_access" },
      { name: "Solar Mount Prep", cluster: "pitched" },
      { name: "Solar Removal", cluster: "pitched" },
      { name: "Parapet Repair", cluster: "pitched" },
      { name: "Flashing Upgrade", cluster: "pitched" },
      { name: "Slate Hangers", cluster: "pitched" },
      { name: "Metal Roofing", cluster: "pitched" },
      { name: "Asbestos Removal", cluster: "pitched" },
      { name: "Access System", cluster: "repair_access" },
      { name: "Dormer Waterproof", cluster: "flat_cold" },
      { name: "Green Roof", cluster: "flat_cold" },
      { name: "Gutter Guard", cluster: "repair_access" },
      { name: "Membrane Install", cluster: "pitched" },
      { name: "Other (Custom)", cluster: "repair_access" }
    ]
  },
  Builder: {
    clusters: BUILDER_CLUSTERS,
    jobs: [
      { name: "Structural Knock-through", cluster: "structural" },
      { name: "Single Storey Ext", cluster: "groundworks" },
      { name: "Double Storey Ext", cluster: "groundworks" },
      { name: "Loft Conversion", cluster: "structural" },
      { name: "Garage Conversion", cluster: "finishes" },
      { name: "Basement Conversion", cluster: "groundworks" },
      { name: "Internal Demo", cluster: "structural" },
      { name: "Bricklaying", cluster: "structural" },
      { name: "Garden Wall", cluster: "groundworks" },
      { name: "Driveway Install", cluster: "groundworks" },
      { name: "Patio Install", cluster: "groundworks" },
      { name: "Foundations", cluster: "groundworks" },
      { name: "Concrete Slab", cluster: "groundworks" },
      { name: "Screeding", cluster: "finishes" },
      { name: "RSJ Install", cluster: "structural" },
      { name: "Joist Replace", cluster: "structural" },
      { name: "Roof Carpentry", cluster: "carpentry" },
      { name: "Stud Walls", cluster: "carpentry" },
      { name: "Drylining", cluster: "finishes" },
      { name: "Plastering", cluster: "finishes" },
      { name: "Rendering", cluster: "finishes" },
      { name: "Tiling", cluster: "finishes" },
      { name: "Door Fitting", cluster: "carpentry" },
      { name: "Window Fitting", cluster: "carpentry" },
      { name: "Kitchen Install", cluster: "carpentry" },
      { name: "Bathroom Install", cluster: "finishes" },
      { name: "Staircase", cluster: "carpentry" },
      { name: "Fencing", cluster: "groundworks" },
      { name: "Decking", cluster: "groundworks" },
      { name: "Landscaping", cluster: "groundworks" },
      { name: "Shed Base", cluster: "groundworks" },
      { name: "Conservatory", cluster: "groundworks" },
      { name: "Chimney Removal", cluster: "structural" },
      { name: "Drainage Works", cluster: "groundworks" },
      { name: "Manhole Install", cluster: "groundworks" },
      { name: "Damp Proofing", cluster: "finishes" },
      { name: "Insulation", cluster: "finishes" },
      { name: "Cladding", cluster: "carpentry" },
      { name: "Roof Structure", cluster: "carpentry" },
      { name: "Underpinning", cluster: "structural" },
      { name: "Wall Removal", cluster: "structural" },
      { name: "Porch Build", cluster: "groundworks" },
      { name: "Shop Fit-out", cluster: "finishes" },
      { name: "Partitioning", cluster: "carpentry" },
      { name: "Suspended Ceiling", cluster: "finishes" },
      { name: "Fire Door", cluster: "carpentry" },
      { name: "Renovation", cluster: "finishes" },
      { name: "Ext Rendering", cluster: "finishes" },
      { name: "Site Clearance", cluster: "groundworks" },
      { name: "Garden Room", cluster: "groundworks" },
      { name: "Other (Custom)", cluster: "finishes" }
    ]
  }
};