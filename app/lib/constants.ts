// app/lib/constants.ts

export const HAZARD_DATA: Record<string, { label: string, risk: string, control: string }> = {
  live_electricity: { label: "Live Electricity", risk: "Electrocution, burns, fire, fatal injury.", control: "Safe isolation (LOTO), calibrated voltage indicator, insulated tools, RCD protection." },
  gas: { label: "Gas Supply", risk: "Explosion, asphyxiation, carbon monoxide poisoning.", control: "Gas Safe registered engineer, leak detection fluid, adequate ventilation, isolation." },
  work_at_height: { label: "Working at Height", risk: "Falls from height, falling objects, serious injury.", control: "Scaffold/tower preferred, ladder tied off (3-points of contact), exclusion zones below." },
  manual_handling: { label: "Manual Handling", risk: "Musculoskeletal injury, strains, drops.", control: "Mechanical aids (trolleys), team lifting, load assessment, gloves/boots." },
  dust_fumes: { label: "Dust & Fumes", risk: "Respiratory issues, eye irritation, asthma.", control: "Local exhaust ventilation (LEV), water suppression, FFP3 masks, eye protection." },
  noise_vibration: { label: "Noise & Vibration", risk: "Hearing loss, tinnitus, HAVS.", control: "Ear defenders/plugs, limited trigger time, rotation of tasks, low-vibration tools." },
  hot_work: { label: "Hot Works / Fire", risk: "Ignition of materials, burns, smoke inhalation.", control: "Hot work permit, extinguisher nearby, 1-hour fire watch, removal of combustibles." },
  silica_dust: { label: "Silica Dust", risk: "Silicosis, lung disease, cancer.", control: "On-tool extraction, wet cutting, FFP3 respiratory protection (Face Fit tested)." },
  asbestos: { label: "Asbestos Risk", risk: "Lung disease, asbestosis, mesothelioma.", control: "Asbestos survey review, stop work immediately if suspected, licensed contractor only." },
  chemical_coshh: { label: "Chemicals / COSHH", risk: "Skin burns, dermatitis, inhalation, poisoning.", control: "COSHH assessment read, specific PPE (gloves/goggles), ventilation, spill kit availability." },
  slips_trips: { label: "Slips, Trips & Falls", risk: "Impact injury, fractures, bruising.", control: "Good housekeeping, cable management, adequate lighting, clear walkways." },
  moving_vehicles: { label: "Moving Vehicles", risk: "Crushing, impact, fatal injury.", control: "Traffic management plan, banksman, high-vis clothing, segregated pedestrian routes." },
  public_interface: { label: "Public / Occupants", risk: "Injury to third parties, unauthorized access.", control: "Barriers, signage, tool supervision, safe access routes, exclusion zones." },
  lone_working: { label: "Lone Working", risk: "Unable to summon help, increased vulnerability.", control: "Check-in procedure, charged mobile phone, no high-risk tasks alone." },
  confined_space: { label: "Confined Space", risk: "Asphyxiation, toxic gas, entrapment.", control: "Gas monitoring, top man, rescue plan, permit to work, breathing apparatus." },
  structural_collapse: { label: "Structural Instability", risk: "Crushing, burial, collapse.", control: "Temporary supports (acrows), structural engineer design, method statement." },
  excavation: { label: "Excavation", risk: "Trench collapse, striking services, falling in.", control: "CAT scan, trench support (shoring), barriers, safe access/egress (ladder)." },
  plant_machinery: { label: "Plant & Machinery", risk: "Entanglement, crushing, noise.", control: "Trained operators (CPCS), guards in place, isolation keys removed when unattended." },
  environmental_weather: { label: "Weather / Environment", risk: "Cold/Heat stress, slippery surfaces, wind.", control: "Monitor forecast, appropriate clothing, stop work in high winds." },
  fire_explosion: { label: "Fire & Explosion", risk: "Burns, smoke inhalation, property damage.", control: "Fire extinguishers, clear exit routes, control of ignition sources." },
  biological: { label: "Biological Hazards", risk: "Infection, Weil's disease, sickness.", control: "Good hygiene, gloves, cover wounds, welfare facilities." },
  falling_objects: { label: "Falling Objects", risk: "Head injury, impact.", control: "Hard hats, toe boards, exclusion zones, tool lanyards." },
  underground_services: { label: "Underground Services", risk: "Electrocution, gas strike, explosion.", control: "CAT scan, safe digging practice, review utility plans." },
  water_ingress: { label: "Water Ingress", risk: "Property damage, slips, electrical short.", control: "Temporary sheeting, pump availability, isolation of water." },
  sharp_objects: { label: "Sharp Objects", risk: "Cuts, lacerations.", control: "Kevlar gloves, safe disposal of blades/sharps." }
};

export const HAZARD_GROUPS = {
  "High Risk": ["live_electricity", "gas", "work_at_height", "confined_space", "structural_collapse", "fire_explosion", "excavation"],
  "Health": ["dust_fumes", "asbestos", "noise_vibration", "silica_dust", "chemical_coshh", "biological"],
  "Site": ["slips_trips", "moving_vehicles", "public_interface", "lone_working", "environmental_weather", "water_ingress", "falling_objects"],
  "Physical": ["manual_handling", "plant_machinery", "underground_services", "sharp_objects"]
};

// --- CLUSTER LOGIC (The Brain) ---
// This maps job types to descriptions and specific questions

const ELECTRICIAN_CLUSTERS = {
  domestic_install: {
    desc: "Installation of new electrical circuits, accessories, and containment within a domestic property. Includes routing cables, terminating accessories, and testing.",
    hazards: ["live_electricity", "manual_handling", "dust_fumes", "slips_trips", "public_interface"],
    questions: [
      { id: "isolation", label: "Can the main supply be fully isolated?" },
      { id: "occupied", label: "Is the property occupied by residents?" },
      { id: "floorboards", label: "Will floorboards need to be lifted?" },
      { id: "rcd", label: "Is there existing RCD protection?" },
      { id: "bonding", label: "Is main equipotential bonding in place?" }
    ]
  },
  distribution: {
    desc: "Replacement or upgrade of electrical distribution equipment (Consumer Units/Panel Boards). Involves full isolation, strip out, and commissioning.",
    hazards: ["live_electricity", "manual_handling", "fire_explosion", "public_interface"],
    questions: [
      { id: "lock_off", label: "Do you have a padlock/key for Lock-Out Tag-Out?" },
      { id: "tails_condition", label: "Are the meter tails in good condition?" },
      { id: "ze_check", label: "Has the external loop impedance (Ze) been verified?" },
      { id: "circuits_id", label: "Are all existing circuits identified/labelled?" },
      { id: "metal_unit", label: "Is the new unit non-combustible (Amendment 3)?" }
    ]
  },
  external: {
    desc: "Installation of external electrical equipment (Lighting, EV Chargers, Power). Involves drilling external walls and weatherproofing.",
    hazards: ["live_electricity", "work_at_height", "environmental_weather", "silica_dust"],
    questions: [
      { id: "weather", label: "Is the weather suitable for external work?" },
      { id: "ip_rating", label: "Are all fittings suitably IP rated?" },
      { id: "ladder_footing", label: "Is the ground level/stable for ladders?" },
      { id: "swa_gland", label: "Will armoured cable (SWA) be used?" },
      { id: "drilling", label: "Is dust extraction available for drilling?" }
    ]
  },
  testing: {
    desc: "Inspection and testing of electrical installations (EICR). Non-intrusive where possible, with some live testing required.",
    hazards: ["live_electricity", "slips_trips", "lone_working"],
    questions: [
      { id: "permission", label: "Do you have permission to disconnect circuits?" },
      { id: "defects", label: "Are there known dangerous defects (C1)?" },
      { id: "access", label: "Is there safe access to all accessories?" },
      { id: "live_test", label: "Will live testing (Zs) be performed?" },
      { id: "labels", label: "Are warning labels present on the board?" }
    ]
  }
};

const PLUMBER_CLUSTERS = {
  heating: {
    desc: "Installation or repair of heating systems, including boilers, radiators, and pipework. Involves hot work and gas safety checks.",
    hazards: ["gas", "hot_work", "manual_handling", "chemical_coshh"],
    questions: [
      { id: "gas_safe", label: "Is the engineer Gas Safe registered?" },
      { id: "ventilation", label: "Is there adequate ventilation for testing?" },
      { id: "flue_route", label: "Is the flue route clear and compliant?" },
      { id: "hot_work", label: "Will soldering torches be used?" },
      { id: "asbestos", label: "Is there potential asbestos (e.g. old flues)?" }
    ]
  },
  bathroom: {
    desc: "Renovation of bathroom facilities. Includes removal of sanitary ware, pipe alterations, tiling, and sealing.",
    hazards: ["manual_handling", "dust_fumes", "water_ingress", "silica_dust"],
    questions: [
      { id: "water_iso", label: "Can water be isolated at the stopcock?" },
      { id: "waste_route", label: "Is the waste pipe route accessible?" },
      { id: "elec_zone", label: "Are electrics within safe zones?" },
      { id: "lifting", label: "Is help available for lifting heavy ceramics?" },
      { id: "sealant", label: "Is the area ventilated for silicone application?" }
    ]
  }
};

const ROOFER_CLUSTERS = {
  pitched: {
    desc: "Work on pitched roof structures. Replacement of tiles, slates, or timber battens. Requires strict fall protection.",
    hazards: ["work_at_height", "falling_objects", "environmental_weather", "fragile_surfaces"],
    questions: [
      { id: "scaffold", label: "Is full scaffolding erected?" },
      { id: "edge_prot", label: "Is edge protection (handrails) in place?" },
      { id: "ladder_tie", label: "Is the access ladder tied off?" },
      { id: "weather", label: "Is the forecast clear of high winds/rain?" },
      { id: "public", label: "Is the area below cordoned off?" }
    ]
  },
  flat: {
    desc: "Installation of flat roofing systems (Felt, GRP, EPDM). May involve hot works (torching) and chemical adhesives.",
    hazards: ["work_at_height", "hot_work", "fire_explosion", "chemical_coshh"],
    questions: [
      { id: "torch", label: "Will a propane torch be used?" },
      { id: "fire_ex", label: "Is a fire extinguisher immediately to hand?" },
      { id: "deck_check", label: "Has the deck been checked for stability?" },
      { id: "fumes", label: "Are fumes prevented from entering the building?" },
      { id: "hot_permit", label: "Is a Hot Work Permit required?" }
    ]
  }
};

const BUILDER_CLUSTERS = {
  structural: {
    desc: "Structural alterations involving removal of load-bearing walls and installation of steel beams (RSJ).",
    hazards: ["structural_collapse", "dust_fumes", "noise_vibration", "plant_machinery"],
    questions: [
      { id: "acrows", label: "Are Acrow props and strongboys on site?" },
      { id: "calcs", label: "Are structural engineer calculations available?" },
      { id: "dust", label: "Is dust extraction fitted to the saw?" },
      { id: "lifting", label: "Is mechanical lifting gear (Genie lift) needed?" },
      { id: "ppe", label: "Are hard hats and steel toe boots mandatory?" }
    ]
  },
  groundworks: {
    desc: "Excavation of foundations, trenches, or drainage. Involves heavy manual labor and plant machinery.",
    hazards: ["excavation", "underground_services", "plant_machinery", "biological"],
    questions: [
      { id: "cat_scan", label: "Has the ground been scanned (CAT scan)?" },
      { id: "shoring", label: "Is trench shoring required (>1.2m depth)?" },
      { id: "barriers", label: "Are excavations barriered off overnight?" },
      { id: "spoil", label: "Is spoil stored away from the trench edge?" },
      { id: "drains", label: "Are live drains present (biological risk)?" }
    ]
  }
};

// --- MASTER MAPPING ---
export const TRADES = {
  Electrician: {
    clusters: ELECTRICIAN_CLUSTERS,
    jobs: [
      { name: "Consumer Unit Replacement", cluster: "distribution" },
      { name: "Full House Rewire", cluster: "domestic_install" },
      { name: "Additional Sockets", cluster: "domestic_install" },
      { name: "Lighting Upgrade", cluster: "domestic_install" },
      { name: "EV Charger Install", cluster: "external" },
      { name: "EICR (Testing)", cluster: "testing" },
      { name: "Solar PV Install", cluster: "external" },
      { name: "Outdoor Lighting", cluster: "external" },
      { name: "Emergency Lighting", cluster: "domestic_install" },
      { name: "Data Cabling", cluster: "domestic_install" },
      { name: "CCTV Installation", cluster: "external" },
      { name: "Fire Alarm Install", cluster: "domestic_install" },
      { name: "Smart Home System", cluster: "domestic_install" },
      { name: "Electric Shower", cluster: "domestic_install" },
      { name: "Cooker Circuit", cluster: "domestic_install" },
      { name: "Garage Electrics", cluster: "external" },
      { name: "Loft Wiring", cluster: "domestic_install" },
      { name: "Underfloor Heating", cluster: "domestic_install" },
      { name: "Immersion Heater", cluster: "domestic_install" },
      { name: "PAT Testing", cluster: "testing" },
      { name: "Other (Custom)", cluster: "domestic_install" }
    ]
  },
  Plumber: {
    clusters: PLUMBER_CLUSTERS,
    jobs: [
      { name: "Boiler Install (Gas)", cluster: "heating" },
      { name: "Bathroom Fit-out", cluster: "bathroom" },
      { name: "Radiator Install", cluster: "heating" },
      { name: "Underfloor Heating", cluster: "heating" },
      { name: "Burst Pipe Repair", cluster: "bathroom" },
      { name: "Drain Unblocking", cluster: "drainage" },
      { name: "Toilet Replacement", cluster: "bathroom" },
      { name: "Sink/Tap Install", cluster: "bathroom" },
      { name: "Shower Install", cluster: "bathroom" },
      { name: "Gas Hob Install", cluster: "heating" },
      { name: "Soil Stack Repair", cluster: "drainage" },
      { name: "Other (Custom)", cluster: "bathroom" }
    ]
  },
  Roofer: {
    clusters: ROOFER_CLUSTERS,
    jobs: [
      { name: "Pitched Roof Re-tile", cluster: "pitched" },
      { name: "Flat Roof (Felt)", cluster: "flat" },
      { name: "Lead Flashing", cluster: "pitched" },
      { name: "Guttering Replace", cluster: "pitched" },
      { name: "Chimney Repair", cluster: "pitched" },
      { name: "Roof Window Install", cluster: "pitched" },
      { name: "Emergency Leak Fix", cluster: "pitched" },
      { name: "Other (Custom)", cluster: "pitched" }
    ]
  },
  Builder: {
    clusters: BUILDER_CLUSTERS,
    jobs: [
      { name: "Structural Knock-through", cluster: "structural" },
      { name: "Single Storey Ext", cluster: "groundworks" },
      { name: "Foundation Dig", cluster: "groundworks" },
      { name: "Plastering", cluster: "structural" },
      { name: "Bricklaying", cluster: "structural" },
      { name: "Patio/Driveway", cluster: "groundworks" },
      { name: "Other (Custom)", cluster: "structural" }
    ]
  }
};