// app/lib/constants.ts

export type HazardKey = string;

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
  fragile_surfaces: { label: "Fragile Surfaces", risk: "Falls through roof/skylights.", control: "Crawling boards, fall arrest nets, harness." },
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

// --- GRANULAR JOB CLUSTERS (5 Questions Each) ---

const ELECTRICIAN_CLUSTERS = {
  rewire: {
    hazards: ["live_electricity", "manual_handling", "dust_fumes", "slips_trips", "public_interface", "asbestos"],
    questions: [
      { id: "floor_voids", label: "Will floorboards need to be lifted?" },
      { id: "chasing", label: "Will walls be chased (creating dust)?" },
      { id: "temp_power", label: "Will temporary power be provided for the client?" },
      { id: "occupied", label: "Is the property occupied during the rewire?" },
      { id: "bonding", label: "Is the main earth bonding to Gas/Water verified?" }
    ]
  },
  consumer_unit: {
    hazards: ["live_electricity", "manual_handling", "fire_explosion", "public_interface"],
    questions: [
      { id: "iso_tails", label: "Can the meter tails be isolated?" },
      { id: "ze_reading", label: "Has the external Ze reading been verified?" },
      { id: "labelling", label: "Are all circuits identified and labelled?" },
      { id: "metal_cu", label: "Is the new unit Amendment 3 (Non-combustible)?" },
      { id: "lock_off", label: "Do you have a LOTO kit for the main switch?" }
    ]
  },
  ev_solar: {
    hazards: ["live_electricity", "work_at_height", "manual_handling", "fire_explosion", "environmental_weather"],
    questions: [
      { id: "dno", label: "Has the DNO been notified/approved?" },
      { id: "roof_access", label: "Is scaffold required for roof access?" },
      { id: "dc_iso", label: "Is there a DC isolator for the array?" },
      { id: "cable_route", label: "Does the cable route require trenching?" },
      { id: "battery_vent", label: "Is the battery storage area ventilated?" }
    ]
  },
  testing: {
    hazards: ["live_electricity", "slips_trips", "lone_working"],
    questions: [
      { id: "permission", label: "Do you have permission to isolate circuits?" },
      { id: "defects", label: "Are there known C1 (Danger Present) defects?" },
      { id: "access", label: "Is access to high-level fittings safe?" },
      { id: "live_test", label: "Will live testing be conducted?" },
      { id: "labels", label: "Are warning labels (e.g., Dual Supply) needed?" }
    ]
  },
  small_power: {
    hazards: ["live_electricity", "manual_handling", "dust_fumes"],
    questions: [
      { id: "circuit_iso", label: "Can the specific circuit be locked off?" },
      { id: "rcd_prot", label: "Is the circuit RCD protected?" },
      { id: "buried_cables", label: "Are cable zones verified?" },
      { id: "making_good", label: "Does the work require plastering/making good?" },
      { id: "acc_access", label: "Is the work area clear of furniture?" }
    ]
  },
  commercial_install: {
    hazards: ["live_electricity", "work_at_height", "plant_machinery", "dust_fumes"],
    questions: [
      { id: "permit", label: "Is a Permit to Work required?" },
      { id: "containment", label: "Does the job involve cutting metal tray/trunking?" },
      { id: "mewp", label: "Is a scissor lift/cherry picker required?" },
      { id: "site_rules", label: "Have you attended the site induction?" },
      { id: "other_trades", label: "Are you working alongside other trades?" }
    ]
  }
};

const PLUMBER_CLUSTERS = {
  boiler_gas: {
    hazards: ["gas", "hot_work", "manual_handling", "chemical_coshh", "fumes"],
    questions: [
      { id: "gas_safe", label: "Are all operatives Gas Safe registered?" },
      { id: "flue_access", label: "Is the flue route accessible?" },
      { id: "hot_works", label: "Will soldering be required?" },
      { id: "ventilation", label: "Is the area ventilated?" },
      { id: "co_alarm", label: "Will a CO alarm be installed/tested?" }
    ]
  },
  bathroom_wet: {
    hazards: ["manual_handling", "dust_fumes", "water_ingress", "silica_dust", "biological"],
    questions: [
      { id: "iso_water", label: "Can water be isolated locally?" },
      { id: "waste_pipe", label: "Is the soil stack accessible?" },
      { id: "silicone", label: "Is there ventilation for silicone fumes?" },
      { id: "heavy_lift", label: "Is it a two-person lift for the bath/screen?" },
      { id: "elec_safety", label: "Are electrics (fans/lights) isolated?" }
    ]
  },
  drainage_ground: {
    hazards: ["biological", "confined_space", "excavation", "underground_services", "slips_trips"],
    questions: [
      { id: "confined", label: "Is entry into a manhole required?" },
      { id: "bio_ppe", label: "Are rubber gloves and sanitizer available?" },
      { id: "jetting", label: "Will high-pressure jetting be used?" },
      { id: "excavation", label: "Will you be digging deeper than 1.2m?" },
      { id: "services", label: "Have underground services been scanned?" }
    ]
  },
  pipes_rads: {
    hazards: ["manual_handling", "hot_work", "water_ingress", "slips_trips"],
    questions: [
      { id: "floor_up", label: "Do floorboards need lifting?" },
      { id: "drain_down", label: "Can the system be drained easily?" },
      { id: "inhibitor", label: "Will chemical inhibitors be added?" },
      { id: "hot_pipe", label: "Are pipes hot (burn risk)?" },
      { id: "leak_check", label: "Is the system pressure tested?" }
    ]
  }
};

const ROOFER_CLUSTERS = {
  pitched: {
    hazards: ["work_at_height", "falling_objects", "environmental_weather", "fragile_surfaces"],
    questions: [
      { id: "scaffold", label: "Is a full scaffold required?" },
      { id: "edge_prot", label: "Is edge protection (handrails) in place?" },
      { id: "ladder_tie", label: "Is the access ladder tied off?" },
      { id: "falling_obj", label: "Is there an exclusion zone below?" },
      { id: "asbestos_tiles", label: "Are existing tiles suspected asbestos?" }
    ]
  },
  flat: {
    hazards: ["work_at_height", "hot_work", "fire_explosion", "chemical_coshh", "fumes"],
    questions: [
      { id: "torch_on", label: "Will a propane torch be used?" },
      { id: "fire_ex", label: "Is a fire extinguisher immediately to hand?" },
      { id: "deck_check", label: "Has the deck structure been checked?" },
      { id: "permit", label: "Is a Hot Work Permit required?" },
      { id: "fumes", label: "Are air intakes covered to prevent fume entry?" }
    ]
  },
  repair_minor: {
    hazards: ["work_at_height", "environmental_weather", "public_interface"],
    questions: [
      { id: "ladder_use", label: "Is the work short duration (Ladder only)?" },
      { id: "weather", label: "Is the weather forecast clear?" },
      { id: "fragile", label: "Are there fragile skylights nearby?" },
      { id: "gutters", label: "Is the guttering secure for ladder rest?" },
      { id: "public", label: "Is the public protected from falling debris?" }
    ]
  }
};

const BUILDER_CLUSTERS = {
  structural: {
    hazards: ["structural_collapse", "dust_fumes", "noise_vibration", "plant_machinery", "manual_handling"],
    questions: [
      { id: "engineer", label: "Are structural engineer calcs available?" },
      { id: "props", label: "Are Acrow props and Strongboys on site?" },
      { id: "dust_ext", label: "Is dust extraction fitted to the cut-off saw?" },
      { id: "load_bearing", label: "Is the wall definitely load-bearing?" },
      { id: "heavy_lift", label: "Is a Genie lift required for the beam?" }
    ]
  },
  groundworks: {
    hazards: ["excavation", "underground_services", "plant_machinery", "biological", "manual_handling"],
    questions: [
      { id: "cat_scan", label: "Has the ground been CAT scanned?" },
      { id: "shoring", label: "Is shoring needed (Depth > 1.2m)?" },
      { id: "barriers", label: "Are excavations barriered off?" },
      { id: "digger", label: "Is the machine operator CPCS qualified?" },
      { id: "spoil", label: "Is spoil stored away from the edge?" }
    ]
  },
  general_build: {
    hazards: ["manual_handling", "dust_fumes", "work_at_height", "chemical_coshh"],
    questions: [
      { id: "scaffold", label: "Is scaffolding required?" },
      { id: "cement", label: "Are gloves worn for cement/mortar?" },
      { id: "site_secure", label: "Is the site secure at night?" },
      { id: "waste", label: "Is a skip provided for waste?" },
      { id: "ppe", label: "Is full PPE mandatory on site?" }
    ]
  }
};

export const TRADES = {
  Electrician: {
    clusters: ELECTRICIAN_CLUSTERS,
    jobs: [
      { name: "Consumer Unit Replacement", cluster: "consumer_unit" },
      { name: "Full House Rewire", cluster: "rewire" },
      { name: "Partial Rewire", cluster: "rewire" },
      { name: "New Circuit Installation", cluster: "small_power" },
      { name: "Additional Sockets", cluster: "small_power" },
      { name: "Indoor Lighting Upgrade", cluster: "small_power" },
      { name: "Outdoor/Garden Lighting", cluster: "external" },
      { name: "EV Charger Installation", cluster: "ev_solar" },
      { name: "Solar PV Installation", cluster: "ev_solar" },
      { name: "Battery Storage", cluster: "ev_solar" },
      { name: "EICR (Domestic)", cluster: "testing" },
      { name: "EICR (Commercial)", cluster: "testing" },
      { name: "PAT Testing", cluster: "testing" },
      { name: "Fault Finding", cluster: "testing" },
      { name: "Fire Alarm Install", cluster: "commercial_install" },
      { name: "Emergency Lighting", cluster: "commercial_install" },
      { name: "Data Cabling", cluster: "commercial_install" },
      { name: "CCTV Installation", cluster: "external" },
      { name: "Electric Shower", cluster: "small_power" },
      { name: "Cooker Circuit", cluster: "small_power" },
      { name: "Loft Wiring", cluster: "small_power" },
      { name: "Garage Electrics", cluster: "external" },
      { name: "Extension First Fix", cluster: "rewire" },
      { name: "Extension Second Fix", cluster: "small_power" },
      { name: "Commercial Lighting", cluster: "commercial_install" },
      { name: "Warehouse Lighting", cluster: "commercial_install" },
      { name: "RCD Upgrade", cluster: "consumer_unit" },
      { name: "Underfloor Heating (Elec)", cluster: "small_power" },
      { name: "Immersion Heater", cluster: "small_power" },
      { name: "Security Lighting", cluster: "external" },
      { name: "Floodlight Install", cluster: "external" },
      { name: "Car Park Lighting", cluster: "external" },
      { name: "Shop Fit-out", cluster: "commercial_install" },
      { name: "Containment Install", cluster: "commercial_install" },
      { name: "Sub-main Install", cluster: "consumer_unit" },
      { name: "Machinery Wiring", cluster: "commercial_install" },
      { name: "Agricultural Electrics", cluster: "external" },
      { name: "Door Entry System", cluster: "external" },
      { name: "Smoke Alarm Install", cluster: "small_power" },
      { name: "Smart Home System", cluster: "small_power" },
      { name: "Thermostat Install", cluster: "small_power" },
      { name: "Fuse Repair", cluster: "small_power" },
      { name: "Cable Management", cluster: "commercial_install" },
      { name: "Meter Relocation", cluster: "consumer_unit" },
      { name: "Generator Install", cluster: "consumer_unit" },
      { name: "Temp Site Electrics", cluster: "consumer_unit" },
      { name: "LED Retrofit", cluster: "small_power" },
      { name: "Electric Heating", cluster: "small_power" },
      { name: "EV Infrastructure", cluster: "ev_solar" },
      { name: "Other (Custom)", cluster: "small_power" }
    ]
  },
  Plumber: {
    clusters: PLUMBER_CLUSTERS,
    jobs: [
      { name: "Boiler Install (Gas)", cluster: "boiler_gas" },
      { name: "Combi Boiler Swap", cluster: "boiler_gas" },
      { name: "Boiler Service", cluster: "boiler_gas" },
      { name: "Gas Leak Detection", cluster: "boiler_gas" },
      { name: "Gas Pipe Rerouting", cluster: "boiler_gas" },
      { name: "Gas Hob Install", cluster: "boiler_gas" },
      { name: "Bathroom Installation", cluster: "bathroom_wet" },
      { name: "Shower Installation", cluster: "bathroom_wet" },
      { name: "Wet Room Install", cluster: "bathroom_wet" },
      { name: "Toilet Replacement", cluster: "bathroom_wet" },
      { name: "Sink/Tap Install", cluster: "bathroom_wet" },
      { name: "Radiator Install", cluster: "pipes_rads" },
      { name: "Underfloor Heating", cluster: "pipes_rads" },
      { name: "Burst Pipe Repair", cluster: "pipes_rads" },
      { name: "Drain Unblocking", cluster: "drainage_ground" },
      { name: "Soil Stack Repair", cluster: "drainage_ground" },
      { name: "Manhole Replacement", cluster: "drainage_ground" },
      { name: "Septic Tank Work", cluster: "drainage_ground" },
      { name: "Kitchen First Fix", cluster: "pipes_rads" },
      { name: "Washing Machine Plumb", cluster: "pipes_rads" },
      { name: "Dishwasher Plumb", cluster: "pipes_rads" },
      { name: "Outdoor Tap", cluster: "pipes_rads" },
      { name: "Hot Water Cylinder", cluster: "pipes_rads" },
      { name: "Unvented Cylinder", cluster: "pipes_rads" },
      { name: "Immersion Heater", cluster: "pipes_rads" },
      { name: "Water Softener", cluster: "pipes_rads" },
      { name: "Leak Trace", cluster: "pipes_rads" },
      { name: "Drain CCTV Survey", cluster: "drainage_ground" },
      { name: "Guttering Repair", cluster: "drainage_ground" },
      { name: "Rainwater Harvesting", cluster: "drainage_ground" },
      { name: "Sump Pump", cluster: "drainage_ground" },
      { name: "Pumped Shower", cluster: "bathroom_wet" },
      { name: "Macerator Toilet", cluster: "bathroom_wet" },
      { name: "Commercial Boiler", cluster: "boiler_gas" },
      { name: "Plant Room Works", cluster: "boiler_gas" },
      { name: "Pipe Insulation", cluster: "pipes_rads" },
      { name: "Heating Pump", cluster: "pipes_rads" },
      { name: "Expansion Vessel", cluster: "pipes_rads" },
      { name: "Grey Water System", cluster: "drainage_ground" },
      { name: "Power Flushing", cluster: "pipes_rads" },
      { name: "Urinal Install", cluster: "bathroom_wet" },
      { name: "Commercial Toilet", cluster: "bathroom_wet" },
      { name: "Lead Pipe Replace", cluster: "pipes_rads" },
      { name: "Stopcock Replace", cluster: "pipes_rads" },
      { name: "Thermostatic Valve", cluster: "pipes_rads" },
      { name: "Bathroom Rip-out", cluster: "bathroom_wet" },
      { name: "Mixer Tap Swap", cluster: "bathroom_wet" },
      { name: "Boiler Repair", cluster: "boiler_gas" },
      { name: "Central Heating", cluster: "pipes_rads" },
      { name: "Other (Custom)", cluster: "pipes_rads" }
    ]
  },
  Roofer: {
    clusters: ROOFER_CLUSTERS,
    jobs: [
      { name: "Pitched Roof Re-tile", cluster: "pitched" },
      { name: "Slate Roof Install", cluster: "pitched" },
      { name: "Ridge Tile Repoint", cluster: "pitched" },
      { name: "Chimney Repair", cluster: "pitched" },
      { name: "Chimney Removal", cluster: "pitched" },
      { name: "Lead Flashing", cluster: "pitched" },
      { name: "Roof Window Install", cluster: "pitched" },
      { name: "Flat Roof (Felt)", cluster: "flat" },
      { name: "Flat Roof (GRP)", cluster: "flat" },
      { name: "Flat Roof (EPDM)", cluster: "flat" },
      { name: "Lead Welding", cluster: "flat" },
      { name: "Green Roof Install", cluster: "flat" },
      { name: "Roof Coating", cluster: "flat" },
      { name: "Gutter Installation", cluster: "repair_minor" },
      { name: "Gutter Repair", cluster: "repair_minor" },
      { name: "Fascia & Soffit", cluster: "repair_minor" },
      { name: "Emergency Leak Fix", cluster: "repair_minor" },
      { name: "Moss Removal", cluster: "pitched" },
      { name: "Roof Cleaning", cluster: "pitched" },
      { name: "Valley Replacement", cluster: "pitched" },
      { name: "Ventilation Install", cluster: "pitched" },
      { name: "Dormer Construction", cluster: "pitched" },
      { name: "Skylight Replace", cluster: "pitched" },
      { name: "Soffit Vents", cluster: "repair_minor" },
      { name: "Roof Insulation", cluster: "pitched" },
      { name: "Flat-to-Pitched", cluster: "pitched" },
      { name: "Soffit Repair", cluster: "repair_minor" },
      { name: "EPDM Patch", cluster: "flat" },
      { name: "GRP Patch", cluster: "flat" },
      { name: "Underlay Replace", cluster: "pitched" },
      { name: "Minor Tile Replace", cluster: "repair_minor" },
      { name: "Bargeboards", cluster: "repair_minor" },
      { name: "Verge Repair", cluster: "pitched" },
      { name: "Cowl Install", cluster: "repair_minor" },
      { name: "Bird Proofing", cluster: "repair_minor" },
      { name: "Solar Mount Prep", cluster: "pitched" },
      { name: "Solar Removal", cluster: "pitched" },
      { name: "Parapet Repair", cluster: "pitched" },
      { name: "Flashing Upgrade", cluster: "pitched" },
      { name: "Slate Hangers", cluster: "pitched" },
      { name: "Metal Roofing", cluster: "pitched" },
      { name: "Asbestos Removal", cluster: "pitched" },
      { name: "Access System", cluster: "pitched" },
      { name: "Dormer Waterproof", cluster: "flat" },
      { name: "Gutter Guard", cluster: "repair_minor" },
      { name: "Membrane Install", cluster: "pitched" },
      { name: "Loft Insulation", cluster: "pitched" },
      { name: "Re-bedding Ridge", cluster: "pitched" },
      { name: "Other (Custom)", cluster: "repair_minor" }
    ]
  },
  Builder: {
    clusters: BUILDER_CLUSTERS,
    jobs: [
      { name: "Structural Knock-through", cluster: "structural" },
      { name: "RSJ Installation", cluster: "structural" },
      { name: "Chimney Removal", cluster: "structural" },
      { name: "Underpinning", cluster: "structural" },
      { name: "Load-bearing Wall", cluster: "structural" },
      { name: "Loft Conversion", cluster: "structural" },
      { name: "Basement Conversion", cluster: "groundworks" },
      { name: "Foundation Excavation", cluster: "groundworks" },
      { name: "Concrete Slab", cluster: "groundworks" },
      { name: "Drainage Works", cluster: "groundworks" },
      { name: "Manhole Installation", cluster: "groundworks" },
      { name: "Site Clearance", cluster: "groundworks" },
      { name: "Driveway Install", cluster: "groundworks" },
      { name: "Patio Install", cluster: "groundworks" },
      { name: "Fencing", cluster: "groundworks" },
      { name: "Decking", cluster: "groundworks" },
      { name: "Landscaping", cluster: "groundworks" },
      { name: "Shed Base", cluster: "groundworks" },
      { name: "Single Storey Ext", cluster: "extension" },
      { name: "Double Storey Ext", cluster: "extension" },
      { name: "Bricklaying", cluster: "extension" },
      { name: "Blockwork", cluster: "extension" },
      { name: "Roof Carpentry", cluster: "extension" },
      { name: "Cladding", cluster: "extension" },
      { name: "Rendering", cluster: "extension" },
      { name: "Porch Build", cluster: "extension" },
      { name: "Conservatory", cluster: "extension" },
      { name: "Garden Room", cluster: "extension" },
      { name: "Ext Rendering", cluster: "extension" },
      { name: "Roof Structure", cluster: "extension" },
      { name: "Internal Demo", cluster: "internal" },
      { name: "Plastering", cluster: "internal" },
      { name: "Drylining", cluster: "internal" },
      { name: "Stud Walls", cluster: "internal" },
      { name: "Tiling", cluster: "internal" },
      { name: "Kitchen Install", cluster: "internal" },
      { name: "Bathroom Install", cluster: "internal" },
      { name: "Door Fitting", cluster: "internal" },
      { name: "Window Fitting", cluster: "internal" },
      { name: "Staircase", cluster: "internal" },
      { name: "Screeding", cluster: "internal" },
      { name: "Damp Proofing", cluster: "internal" },
      { name: "Insulation", cluster: "internal" },
      { name: "Garage Conversion", cluster: "internal" },
      { name: "Shop Fit-out", cluster: "internal" },
      { name: "Partitioning", cluster: "internal" },
      { name: "Suspended Ceiling", cluster: "internal" },
      { name: "Fire Door", cluster: "internal" },
      { name: "Renovation", cluster: "internal" },
      { name: "Other (Custom)", cluster: "internal" }
    ]
  }
};