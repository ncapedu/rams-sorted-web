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
  sharp_objects: { label: "Sharp Objects", risk: "Cuts, lacerations.", control: "Kevlar gloves, safe disposal of blades/sharps." },
  poor_lighting: { label: "Poor Lighting", risk: "Trips, mistakes, eye strain.", control: "Temporary task lighting, torch." }
};

export const HAZARD_GROUPS = {
  "High Risk": ["live_electricity", "gas", "work_at_height", "confined_space", "structural_collapse", "fire_explosion", "excavation"],
  "Health": ["dust_fumes", "asbestos", "noise_vibration", "silica_dust", "chemical_coshh", "biological"],
  "Site": ["slips_trips", "moving_vehicles", "public_interface", "lone_working", "environmental_weather", "water_ingress", "falling_objects"],
  "Physical": ["manual_handling", "plant_machinery", "underground_services", "sharp_objects"]
};

// --- LOGIC CLUSTERS (The Brains) ---

const ELECTRICIAN_CLUSTERS = {
  domestic_small: {
    desc: "Standard electrical installation, maintenance, or alteration within domestic premises.",
    hazards: ["live_electricity", "manual_handling", "dust_fumes", "slips_trips", "public_interface"],
    questions: [
      { id: "isolation", label: "Can the main supply be fully isolated?" },
      { id: "occupied", label: "Is the property occupied by residents during work?" },
      { id: "floorboards", label: "Will floorboards need to be lifted?" },
      { id: "rcd", label: "Is there existing RCD protection on circuits?" },
      { id: "bonding", label: "Is main equipotential bonding in place?" },
      { id: "pets", label: "Are there pets/children requiring exclusion zones?" }
    ]
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
    ]
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
    ]
  },
  testing: {
    desc: "Inspection and testing of electrical installations (EICR). Non-intrusive where possible.",
    hazards: ["live_electricity", "slips_trips", "lone_working"],
    questions: [
      { id: "permission", label: "Do you have permission to disconnect circuits?" },
      { id: "defects", label: "Are there known dangerous defects (C1)?" },
      { id: "access", label: "Is there safe access to all accessories?" },
      { id: "live_test", label: "Will live testing (Zs) be performed?" },
      { id: "labels", label: "Are warning labels present on the board?" }
    ]
  },
  ev_pv_battery: {
    desc: "Installation of Green Energy systems (Solar, EV, Battery).",
    hazards: ["live_electricity", "work_at_height", "manual_handling", "fire_explosion", "structural_collapse"],
    questions: [
      { id: "dno", label: "Has DNO approval been submitted?" },
      { id: "dc_iso", label: "Is DC isolation (Solar) accessible?" },
      { id: "roof_loading", label: "Has roof structural load been checked?" },
      { id: "battery_loc", label: "Is the battery location ventilated?" },
      { id: "ev_earth", label: "Is a separate earth rod required?" },
      { id: "scaffold_pv", label: "Is scaffolding erected for panel install?" }
    ]
  }
};

const PLUMBER_CLUSTERS = {
  heating: {
    desc: "Heating systems, gas appliances, and high temperature pipework.",
    hazards: ["gas", "hot_work", "manual_handling", "chemical_coshh"],
    questions: [
      { id: "gas_safe", label: "Is the engineer Gas Safe registered?" },
      { id: "ventilation", label: "Is there adequate ventilation for testing?" },
      { id: "flue_route", label: "Is the flue route clear and compliant?" },
      { id: "hot_work", label: "Will soldering torches be used?" },
      { id: "asbestos", label: "Is there potential asbestos (e.g. old flues)?" },
      { id: "co_alarm", label: "Is a Carbon Monoxide alarm being fitted?" },
      { id: "pressure", label: "Will the system be pressure tested?" }
    ]
  },
  bathroom: {
    desc: "Renovation of bathroom facilities. Includes removal of sanitary ware, pipe alterations, and tiling.",
    hazards: ["manual_handling", "dust_fumes", "water_ingress", "silica_dust"],
    questions: [
      { id: "water_iso", label: "Can water be isolated at the stopcock?" },
      { id: "waste_route", label: "Is the waste pipe route accessible?" },
      { id: "elec_zone", label: "Are electrics within safe zones?" },
      { id: "lifting", label: "Is help available for lifting heavy ceramics?" },
      { id: "sealant", label: "Is the area ventilated for silicone application?" }
    ]
  },
  drainage: {
    desc: "Waste water, soil stacks, and external drainage.",
    hazards: ["biological", "confined_space", "excavation", "underground_services"],
    questions: [
      { id: "gloves", label: "Are heavy duty rubber gloves available?" },
      { id: "vaccine", label: "Are operatives vaccinated (Hep B)?" },
      { id: "services_scan", label: "Have underground services been scanned?" },
      { id: "confined", label: "Is entry into the manhole required?" },
      { id: "wash_down", label: "Are wash-down facilities available?" }
    ]
  },
  specialist: {
    desc: "Specialist water systems (Softeners, Pumps, Unvented).",
    hazards: ["manual_handling", "hot_work", "chemical_coshh"],
    questions: [
      { id: "design_check", label: "Has the design been verified?" },
      { id: "g3_cert", label: "Is the installer G3 Certified (Unvented)?" }
    ]
  }
};

const ROOFER_CLUSTERS = {
  pitched: {
    desc: "Working on sloped roofs (Tiles, Slates).",
    hazards: ["work_at_height", "falling_objects", "environmental_weather", "fragile_surfaces"],
    questions: [
      { id: "scaffold", label: "Is full scaffolding erected?" },
      { id: "edge_prot", label: "Is edge protection (handrails) in place?" },
      { id: "ladder_tie", label: "Is the access ladder tied off?" },
      { id: "weather", label: "Is the forecast clear of high winds/rain?" },
      { id: "public", label: "Is the area below cordoned off?" },
      { id: "asbestos_roof", label: "Are existing tiles suspected asbestos?" }
    ]
  },
  flat: {
    desc: "Working on flat roofs (Felt, GRP, EPDM).",
    hazards: ["work_at_height", "hot_work", "fire_explosion", "chemical_coshh"],
    questions: [
      { id: "torch", label: "Will a propane torch be used?" },
      { id: "fire_ex", label: "Is a fire extinguisher immediately to hand?" },
      { id: "deck_check", label: "Has the deck been checked for stability?" },
      { id: "fumes", label: "Are fumes prevented from entering the building?" },
      { id: "hot_permit", label: "Is a Hot Work Permit required?" }
    ]
  },
  repair: {
    desc: "Minor repairs, gutters, and maintenance.",
    hazards: ["work_at_height", "environmental_weather", "public_interface"],
    questions: [
      { id: "ladder_secure", label: "Can the ladder be secured?" },
      { id: "fragile", label: "Are there fragile skylights nearby?" }
    ]
  }
};

const BUILDER_CLUSTERS = {
  structural: {
    desc: "Major alterations, steelwork, and load bearing walls.",
    hazards: ["structural_collapse", "dust_fumes", "noise_vibration", "plant_machinery"],
    questions: [
      { id: "acrows", label: "Are Acrow props and strongboys on site?" },
      { id: "calcs", label: "Are structural engineer calculations available?" },
      { id: "dust", label: "Is dust extraction fitted to the saw?" },
      { id: "lifting", label: "Is mechanical lifting gear (Genie lift) needed?" },
      { id: "ppe", label: "Are hard hats and steel toe boots mandatory?" }
    ]
  },
  extension: {
    desc: "Building extensions, brickwork, and roofing.",
    hazards: ["excavation", "work_at_height", "manual_handling", "chemical_coshh"],
    questions: [
      { id: "scaffold_ext", label: "Is scaffolding required for brickwork?" },
      { id: "cement_ppe", label: "Are gloves worn for cement work?" }
    ]
  },
  internal: {
    desc: "Internal renovations, plastering, and joinery.",
    hazards: ["manual_handling", "dust_fumes", "sharp_objects"],
    questions: [
      { id: "ventilation", label: "Is there adequate ventilation?" },
      { id: "waste", label: "Is there a skip for waste disposal?" }
    ]
  },
  groundworks: {
    desc: "Digging, foundations, and concrete.",
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

// --- MASTER MAPPING: 200+ JOBS ---
export const TRADES = {
  Electrician: {
    clusters: ELECTRICIAN_CLUSTERS,
    jobs: [
      { name: "Consumer Unit Replacement", cluster: "distribution" },
      { name: "Full House Rewire", cluster: "domestic_small" },
      { name: "Partial Rewire", cluster: "domestic_small" },
      { name: "New Circuit Installation", cluster: "domestic_small" },
      { name: "Additional Sockets Install", cluster: "domestic_small" },
      { name: "Indoor Lighting Upgrade", cluster: "domestic_small" },
      { name: "Outdoor/Garden Lighting", cluster: "external" },
      { name: "Fault Finding", cluster: "domestic_small" },
      { name: "EV Charger Installation", cluster: "ev_pv_battery" },
      { name: "EICR (Domestic)", cluster: "testing" },
      { name: "EICR (Commercial)", cluster: "testing" },
      { name: "Smoke/Heat Alarm Install", cluster: "domestic_small" },
      { name: "Fire Alarm System", cluster: "commercial" },
      { name: "Emergency Lighting", cluster: "commercial" },
      { name: "Data Cabling", cluster: "domestic_small" },
      { name: "CCTV Installation", cluster: "external" },
      { name: "Door Entry/Intercom", cluster: "external" },
      { name: "Solar PV Installation", cluster: "ev_pv_battery" },
      { name: "Battery Storage", cluster: "ev_pv_battery" },
      { name: "Generator Installation", cluster: "distribution" },
      { name: "Temp Site Electrics", cluster: "distribution" },
      { name: "Cooker/Oven Circuit", cluster: "domestic_small" },
      { name: "Electric Shower", cluster: "domestic_small" },
      { name: "Loft Wiring", cluster: "domestic_small" },
      { name: "Garage Electrics", cluster: "external" },
      { name: "Extension First Fix", cluster: "domestic_small" },
      { name: "Extension Second Fix", cluster: "domestic_small" },
      { name: "LED Retrofit", cluster: "domestic_small" },
      { name: "Commercial Lighting", cluster: "commercial" },
      { name: "Warehouse Lighting", cluster: "commercial" },
      { name: "PAT Testing", cluster: "testing" },
      { name: "RCD Upgrade", cluster: "distribution" },
      { name: "Fuse/Breaker Repair", cluster: "domestic_small" },
      { name: "Electric Heating", cluster: "domestic_small" },
      { name: "Underfloor Heating (Elec)", cluster: "domestic_small" },
      { name: "Immersion Heater", cluster: "domestic_small" },
      { name: "Security Lighting", cluster: "external" },
      { name: "Floodlight Install", cluster: "external" },
      { name: "Smart Home System", cluster: "domestic_small" },
      { name: "Thermostat Install", cluster: "domestic_small" },
      { name: "Car Park Lighting", cluster: "external" },
      { name: "Shop Fit-out", cluster: "commercial" },
      { name: "Containment Install", cluster: "commercial" },
      { name: "Cable Management", cluster: "commercial" },
      { name: "Meter Relocation", cluster: "distribution" },
      { name: "Sub-main Install", cluster: "distribution" },
      { name: "Machinery Wiring", cluster: "distribution" },
      { name: "Agricultural Electrics", cluster: "external" },
      { name: "EV Infrastructure", cluster: "ev_pv_battery" },
      { name: "Other (Custom)", cluster: "domestic_small" }
    ]
  },
  Plumber: {
    clusters: PLUMBER_CLUSTERS,
    jobs: [
      { name: "Boiler Installation (Gas)", cluster: "heating" },
      { name: "Combi Boiler Swap", cluster: "heating" },
      { name: "Boiler Service", cluster: "heating" },
      { name: "Boiler Repair", cluster: "heating" },
      { name: "Gas Leak Detection", cluster: "heating" },
      { name: "Gas Pipe Rerouting", cluster: "heating" },
      { name: "Gas Hob Install", cluster: "heating" },
      { name: "Central Heating Install", cluster: "heating" },
      { name: "Radiator Install", cluster: "heating" },
      { name: "Radiator Relocation", cluster: "heating" },
      { name: "Underfloor Heating", cluster: "specialist" },
      { name: "Hot Water Cylinder", cluster: "specialist" },
      { name: "Unvented Cylinder", cluster: "specialist" },
      { name: "Immersion Heater", cluster: "heating" },
      { name: "Bathroom Installation", cluster: "bathroom" },
      { name: "Shower Installation", cluster: "bathroom" },
      { name: "Toilet Repair/Swap", cluster: "bathroom" },
      { name: "Sink/Vanity Install", cluster: "bathroom" },
      { name: "Mixer Tap Swap", cluster: "bathroom" },
      { name: "Thermostatic Valve", cluster: "bathroom" },
      { name: "Burst Pipe Repair", cluster: "heating" },
      { name: "Leak Trace", cluster: "heating" },
      { name: "Drain Unblocking", cluster: "drainage" },
      { name: "Drain CCTV Survey", cluster: "drainage" },
      { name: "Soil Stack Repair", cluster: "drainage" },
      { name: "Guttering Repair", cluster: "drainage" },
      { name: "Kitchen First Fix", cluster: "bathroom" },
      { name: "Kitchen Second Fix", cluster: "bathroom" },
      { name: "Dishwasher Plumb", cluster: "bathroom" },
      { name: "Washing Machine", cluster: "bathroom" },
      { name: "Outdoor Tap", cluster: "heating" },
      { name: "Water Softener", cluster: "specialist" },
      { name: "Rainwater Harvest", cluster: "drainage" },
      { name: "Sump Pump", cluster: "drainage" },
      { name: "Pumped Shower", cluster: "bathroom" },
      { name: "Macerator Toilet", cluster: "bathroom" },
      { name: "Commercial Boiler", cluster: "heating" },
      { name: "Plant Room", cluster: "heating" },
      { name: "Pressurised Test", cluster: "specialist" },
      { name: "Pipe Insulation", cluster: "heating" },
      { name: "Heating Pump", cluster: "heating" },
      { name: "Expansion Vessel", cluster: "heating" },
      { name: "Pipe Rerouting", cluster: "heating" },
      { name: "Wet Room", cluster: "bathroom" },
      { name: "Grey Water System", cluster: "drainage" },
      { name: "Septic Tank", cluster: "drainage" },
      { name: "Manhole Replace", cluster: "drainage" },
      { name: "Bathroom Rip-out", cluster: "bathroom" },
      { name: "Power Flushing", cluster: "heating" },
      { name: "Urinal Install", cluster: "bathroom" },
      { name: "Other (Custom)", cluster: "heating" }
    ]
  },
  Roofer: {
    clusters: ROOFER_CLUSTERS,
    jobs: [
      { name: "Pitched Roof Re-tile", cluster: "pitched" },
      { name: "Slate Roof Install", cluster: "pitched" },
      { name: "Flat Roof (Felt)", cluster: "flat" },
      { name: "Flat Roof (GRP)", cluster: "flat" },
      { name: "Flat Roof (EPDM)", cluster: "flat" },
      { name: "Lead Flashing", cluster: "pitched" },
      { name: "Lead Welding", cluster: "flat" },
      { name: "Gutter Install", cluster: "pitched" },
      { name: "Gutter Repair", cluster: "pitched" },
      { name: "Fascia/Soffit", cluster: "pitched" },
      { name: "Chimney Repoint", cluster: "pitched" },
      { name: "Chimney Rebuild", cluster: "pitched" },
      { name: "Chimney Removal", cluster: "pitched" },
      { name: "Roof Leak Find", cluster: "pitched" },
      { name: "Emergency Patch", cluster: "pitched" },
      { name: "Moss Removal", cluster: "pitched" },
      { name: "Roof Cleaning", cluster: "pitched" },
      { name: "Ridge Repoint", cluster: "pitched" },
      { name: "Valley Replace", cluster: "pitched" },
      { name: "Ventilation Install", cluster: "pitched" },
      { name: "Velux Install", cluster: "pitched" },
      { name: "Dormer Build", cluster: "pitched" },
      { name: "Skylight Replace", cluster: "pitched" },
      { name: "Soffit Vents", cluster: "pitched" },
      { name: "Roof Insulation", cluster: "pitched" },
      { name: "Loft Insulation", cluster: "pitched" },
      { name: "Flat-to-Pitched", cluster: "pitched" },
      { name: "Re-bed Ridge", cluster: "pitched" },
      { name: "Soffit Repair", cluster: "pitched" },
      { name: "Roof Coating", cluster: "flat" },
      { name: "EPDM Patch", cluster: "flat" },
      { name: "GRP Patch", cluster: "flat" },
      { name: "Underlay Replace", cluster: "pitched" },
      { name: "Minor Tile Replace", cluster: "pitched" },
      { name: "Bargeboards", cluster: "pitched" },
      { name: "Verge Repair", cluster: "pitched" },
      { name: "Cowl Install", cluster: "pitched" },
      { name: "Bird Proofing", cluster: "pitched" },
      { name: "Solar Mount Prep", cluster: "pitched" },
      { name: "Solar Removal", cluster: "pitched" },
      { name: "Parapet Repair", cluster: "pitched" },
      { name: "Flashing Upgrade", cluster: "pitched" },
      { name: "Slate Hangers", cluster: "pitched" },
      { name: "Metal Roofing", cluster: "pitched" },
      { name: "Asbestos Removal", cluster: "pitched" },
      { name: "Access System", cluster: "pitched" },
      { name: "Dormer Waterproof", cluster: "flat" },
      { name: "Green Roof", cluster: "flat" },
      { name: "Gutter Guard", cluster: "pitched" },
      { name: "Membrane Install", cluster: "pitched" },
      { name: "Other (Custom)", cluster: "pitched" }
    ]
  },
  Builder: {
    clusters: BUILDER_CLUSTERS,
    jobs: [
      { name: "Structural Knock-through", cluster: "structural" },
      { name: "Single-storey Ext", cluster: "extension" },
      { name: "Double-storey Ext", cluster: "extension" },
      { name: "Loft Conversion", cluster: "structural" },
      { name: "Garage Conversion", cluster: "internal" },
      { name: "Basement Conversion", cluster: "groundworks" },
      { name: "Internal Demo", cluster: "internal" },
      { name: "Bricklaying", cluster: "extension" },
      { name: "Garden Wall", cluster: "groundworks" },
      { name: "Driveway", cluster: "groundworks" },
      { name: "Patio", cluster: "groundworks" },
      { name: "Foundations", cluster: "groundworks" },
      { name: "Concrete Slab", cluster: "groundworks" },
      { name: "Screeding", cluster: "internal" },
      { name: "RSJ Install", cluster: "structural" },
      { name: "Joist Replace", cluster: "structural" },
      { name: "Roof Carpentry", cluster: "extension" },
      { name: "Stud Walls", cluster: "internal" },
      { name: "Drylining", cluster: "internal" },
      { name: "Plastering", cluster: "internal" },
      { name: "Rendering", cluster: "extension" },
      { name: "Tiling", cluster: "internal" },
      { name: "Door Fitting", cluster: "internal" },
      { name: "Window Fitting", cluster: "internal" },
      { name: "Kitchen Install", cluster: "internal" },
      { name: "Bathroom Install", cluster: "internal" },
      { name: "Staircase", cluster: "internal" },
      { name: "Fencing", cluster: "groundworks" },
      { name: "Decking", cluster: "groundworks" },
      { name: "Landscaping", cluster: "groundworks" },
      { name: "Shed Build", cluster: "groundworks" },
      { name: "Conservatory", cluster: "extension" },
      { name: "Chimney Removal", cluster: "structural" },
      { name: "Drainage Works", cluster: "groundworks" },
      { name: "Manhole Install", cluster: "groundworks" },
      { name: "Damp Proofing", cluster: "internal" },
      { name: "Insulation", cluster: "internal" },
      { name: "Cladding", cluster: "extension" },
      { name: "Roof Structure", cluster: "extension" },
      { name: "Underpinning", cluster: "structural" },
      { name: "Wall Removal", cluster: "structural" },
      { name: "Porch Build", cluster: "extension" },
      { name: "Shop Fit-out", cluster: "internal" },
      { name: "Partitioning", cluster: "internal" },
      { name: "Suspended Ceiling", cluster: "internal" },
      { name: "Fire Door", cluster: "internal" },
      { name: "Renovation", cluster: "internal" },
      { name: "Ext Rendering", cluster: "extension" },
      { name: "Site Clearance", cluster: "groundworks" },
      { name: "Garden Room", cluster: "extension" },
      { name: "Other (Custom)", cluster: "internal" }
    ]
  }
};