// app/lib/constants.ts

export type HazardKey = 
  | "live_electricity" | "gas" | "work_at_height" | "manual_handling" 
  | "dust_fumes" | "noise_vibration" | "hot_work" | "silica_dust" 
  | "asbestos" | "chemical_coshh" | "slips_trips" | "moving_vehicles" 
  | "public_interface" | "lone_working" | "confined_space" 
  | "structural_collapse" | "excavation" | "plant_machinery" 
  | "environmental_weather" | "fire_explosion" | "biological";

export const HAZARD_DATA: Record<HazardKey, { label: string, risk: string, control: string }> = {
  live_electricity: { label: "Live Electricity", risk: "Electrocution, burns, fire, fatal injury.", control: "Safe isolation (LOTO), calibrated test equipment, insulated tools, RCD protection." },
  gas: { label: "Gas Supply", risk: "Explosion, asphyxiation, carbon monoxide poisoning.", control: "Gas Safe engineer, leak detection fluid, ventilation, isolation." },
  work_at_height: { label: "Working at Height", risk: "Falls from height, falling objects.", control: "Scaffold/tower preferred, ladder tied off (3-points of contact), exclusion zones." },
  manual_handling: { label: "Manual Handling", risk: "Musculoskeletal injury, strains, drops.", control: "Mechanical aids, team lifting, load assessment, PPE (gloves/boots)." },
  dust_fumes: { label: "Dust & Fumes", risk: "Respiratory issues, eye irritation.", control: "Extraction, water suppression, FFP3 masks, ventilation." },
  noise_vibration: { label: "Noise & Vibration", risk: "Hearing loss, HAVS.", control: "Ear defenders, limited trigger time, rotation of tasks." },
  hot_work: { label: "Hot Works / Fire", risk: "Ignition of materials, burns.", control: "Hot work permit, extinguisher nearby, 1-hour fire watch, removal of combustibles." },
  silica_dust: { label: "Silica Dust", risk: "Silicosis, lung disease.", control: "On-tool extraction, wet cutting, FFP3 respiratory protection." },
  asbestos: { label: "Asbestos Risk", risk: "Lung disease, cancer.", control: "Asbestos survey review, stop work immediately if suspected, licensed contractor only." },
  chemical_coshh: { label: "Chemicals / COSHH", risk: "Skin burns, inhalation, poisoning.", control: "COSHH assessment, specific PPE (gloves/goggles), ventilation, spill kit." },
  slips_trips: { label: "Slips, Trips & Falls", risk: "Impact injury, fractures.", control: "Housekeeping, cable management, adequate lighting, clear walkways." },
  moving_vehicles: { label: "Moving Vehicles", risk: "Crushing, impact.", control: "Traffic management plan, banksman, high-vis clothing, segregated routes." },
  public_interface: { label: "Public / Occupants", risk: "Injury to third parties.", control: "Barriers, signage, tool supervision, safe access routes." },
  lone_working: { label: "Lone Working", risk: "Unable to summon help, increased vulnerability.", control: "Check-in procedure, charged mobile phone, no high-risk tasks alone." },
  confined_space: { label: "Confined Space", risk: "Asphyxiation, entrapment.", control: "Gas monitoring, top man, rescue plan, permit to work." },
  structural_collapse: { label: "Structural Instability", risk: "Crushing, burial.", control: "Temporary supports (acrows), structural engineer design, safe demolition method." },
  excavation: { label: "Excavation", risk: "Collapse, striking services.", control: "CAT scan, trench support (shoring), barriers, safe access/egress." },
  plant_machinery: { label: "Plant & Machinery", risk: "Entanglement, crushing, noise.", control: "Trained operators (CPCS), guards in place, isolation keys removed." },
  environmental_weather: { label: "Weather / Environment", risk: "Cold stress, slippery surfaces, wind.", control: "Monitor forecast, appropriate clothing, stop work in high winds." },
  fire_explosion: { label: "Fire & Explosion", risk: "Burns, smoke inhalation.", control: "Fire extinguishers, clear exit routes, control of ignition sources." },
  biological: { label: "Biological Hazards", risk: "Infection, Weil's disease.", control: "Hygiene, gloves, cover wounds, welfare facilities." }
};

// --- TRADE CLUSTERS & MAPPINGS ---

const ELECTRICIAN_CLUSTERS = {
  domestic_small: {
    hazards: ["live_electricity", "manual_handling", "dust_fumes", "slips_trips", "public_interface", "lone_working"],
    method: ["Arrive, sign in, brief client.", "Dynamic risk assessment.", "Set up work area & dust sheets.", "Isolate circuit & prove dead.", "Install/replace accessory.", "Dead & Live testing.", "Re-energise & handover."]
  },
  distribution: {
    hazards: ["live_electricity", "manual_handling", "dust_fumes", "fire_explosion", "public_interface", "slips_trips"],
    method: ["Confirm supply details.", "Safe isolation of main intake.", "Strip out old gear.", "Install new board/containment.", "Terminate circuits.", "Full inspection & testing.", "Commissioning & Certification."]
  },
  testing: {
    hazards: ["live_electricity", "slips_trips", "public_interface", "lone_working"],
    method: ["Agree scope with client.", "Safe isolation for dead tests.", "Live testing precautions.", "Record results.", "Re-instate power.", "Issue Report."]
  },
  external: {
    hazards: ["live_electricity", "work_at_height", "environmental_weather", "manual_handling", "public_interface"],
    method: ["Check weather/ground conditions.", "Establish exclusion zone.", "Install cabling/containment.", "Mount external fittings.", "Waterproof terminations.", "Testing & Commissioning."]
  },
  ev_pv_battery: {
    hazards: ["live_electricity", "manual_handling", "work_at_height", "fire_explosion", "environmental_weather"],
    method: ["Confirm design & structural mount.", "Install mounting system.", "Run DC/AC cabling.", "Install Inverter/Charger/Battery.", "Connection & Testing.", "Client Handover."]
  },
  commercial: {
    hazards: ["live_electricity", "work_at_height", "manual_handling", "dust_fumes", "noise_vibration", "plant_machinery"],
    method: ["Site induction.", "Permit to work.", "Install containment (tray/trunking).", "Pull cables.", "Second fix.", "Testing.", "Handover."]
  }
};

const PLUMBER_CLUSTERS = {
  heating: {
    hazards: ["gas", "hot_work", "manual_handling", "chemical_coshh", "slips_trips"],
    method: ["Check Gas Safe status.", "Isolate gas/water/electric.", "Drain system.", "Remove old unit.", "Install new boiler/rads.", "Flue checks.", "Commissioning."]
  },
  bathroom: {
    hazards: ["manual_handling", "dust_fumes", "slips_trips", "chemical_coshh", "public_interface"],
    method: ["Isolate water.", "Strip out.", "First fix pipework.", "Install sanitaryware.", "Seal & Tile.", "Leak test.", "Handover."]
  },
  drainage: {
    hazards: ["biological", "slips_trips", "confined_space", "excavation", "manual_handling"],
    method: ["Identify drain runs.", "Cordon off area.", "Excavate/Access.", "Clear blockage or replace pipe.", "Water test.", "Disinfect area."]
  },
  specialist: {
    hazards: ["manual_handling", "hot_work", "chemical_coshh", "slips_trips"],
    method: ["Review design.", "Isolate services.", "Install specialist kit (UFH/Pump).", "Pressure test.", "Add inhibitors.", "Commission."]
  }
};

const ROOFER_CLUSTERS = {
  pitched: {
    hazards: ["work_at_height", "manual_handling", "environmental_weather", "falling_objects"],
    method: ["Erect scaffold/access.", "Strip tiles/slate.", "Inspect felt/battens.", "Lay new covering.", "Fix ridge/verge.", "Clear site."]
  },
  flat: {
    hazards: ["work_at_height", "hot_work", "chemical_coshh", "fire_explosion", "fumes"],
    method: ["Secure access.", "Prepare deck.", "Apply primer/adhesive.", "Lay felt/GRP/EPDM.", "Hot work precautions (if torch-on).", "Check seals/upstands."]
  },
  repair: {
    hazards: ["work_at_height", "manual_handling", "environmental_weather", "public_interface"],
    method: ["Ladder safety check.", "Locate defect.", "Remove damaged material.", "Replace/Repair.", "Watertight check.", "Remove access."]
  }
};

const BUILDER_CLUSTERS = {
  structural: {
    hazards: ["structural_collapse", "dust_fumes", "manual_handling", "noise_vibration", "heavy_plant"],
    method: ["Install props/shores.", "Demolish wall.", "Install steel beam.", "Pack & Slate.", "Remove props.", "Make good."]
  },
  extension: {
    hazards: ["excavation", "work_at_height", "manual_handling", "cement", "plant_machinery"],
    method: ["Excavate footings.", "Pour concrete.", "Brick/Blockwork.", "Roof structure.", "First fix.", "Finishes."]
  },
  internal: {
    hazards: ["manual_handling", "dust_fumes", "slips_trips", "noise_vibration"],
    method: ["Protect floors.", "Strip out.", "First fix.", "Plaster/Board.", "Second fix.", "Clean."]
  },
  groundworks: {
    hazards: ["excavation", "plant_machinery", "manual_handling", "underground_services"],
    method: ["CAT scan area.", "Excavate.", "Install drainage/base.", "Backfill/Compact.", "Finish surface."]
  }
};

// --- MASTER TRADE CONFIG ---

export const TRADES = {
  Electrician: {
    clusters: ELECTRICIAN_CLUSTERS,
    jobs: [
      { name: "Additional sockets install", cluster: "domestic_small" },
      { name: "Indoor lighting upgrade", cluster: "domestic_small" },
      { name: "Consumer unit replacement", cluster: "distribution" },
      { name: "Full house rewire", cluster: "domestic_small" }, // Hybrid, map to most relevant
      { name: "New circuit installation", cluster: "domestic_small" },
      { name: "Outdoor lighting install", cluster: "external" },
      { name: "Fault finding", cluster: "domestic_small" },
      { name: "EV charger installation", cluster: "ev_pv_battery" },
      { name: "EICR (Domestic)", cluster: "testing" },
      { name: "EICR (Commercial)", cluster: "testing" },
      { name: "Smoke/Heat Alarm install", cluster: "domestic_small" },
      { name: "Fire Alarm System", cluster: "commercial" },
      { name: "Emergency Lighting", cluster: "commercial" },
      { name: "Data Cabling", cluster: "commercial" },
      { name: "CCTV Installation", cluster: "domestic_small" },
      { name: "Door Entry/Intercom", cluster: "domestic_small" },
      { name: "Solar PV Installation", cluster: "ev_pv_battery" },
      { name: "Battery Storage", cluster: "ev_pv_battery" },
      { name: "Generator Install", cluster: "distribution" },
      { name: "Temp Site Electrics", cluster: "distribution" },
      { name: "Cooker/Oven wiring", cluster: "domestic_small" },
      { name: "Electric Shower", cluster: "domestic_small" },
      { name: "Loft Wiring", cluster: "domestic_small" },
      { name: "Garage Electrics", cluster: "external" },
      { name: "Extension First Fix", cluster: "domestic_small" },
      { name: "Extension Second Fix", cluster: "domestic_small" },
      { name: "LED Retrofit", cluster: "domestic_small" },
      { name: "Commercial Lighting", cluster: "commercial" },
      { name: "Warehouse Lighting", cluster: "commercial" },
      { name: "PAT Testing", cluster: "testing" },
      { name: "Landlord Safety Pack", cluster: "testing" },
      { name: "RCD Upgrade", cluster: "distribution" },
      { name: "Fuse Repair", cluster: "domestic_small" },
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
      { name: "Drain CCTV", cluster: "drainage" },
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
      { name: "Pitched roof re-tile", cluster: "pitched" },
      { name: "Slate roof install", cluster: "pitched" },
      { name: "Flat roof (Felt)", cluster: "flat" },
      { name: "Flat roof (GRP)", cluster: "flat" },
      { name: "Flat roof (EPDM)", cluster: "flat" },
      { name: "Lead flashing", cluster: "repair" },
      { name: "Lead welding", cluster: "flat" }, // hot work
      { name: "Gutter Install", cluster: "repair" },
      { name: "Gutter Repair", cluster: "repair" },
      { name: "Fascia/Soffit", cluster: "repair" },
      { name: "Chimney Repoint", cluster: "repair" },
      { name: "Chimney Rebuild", cluster: "pitched" },
      { name: "Chimney Removal", cluster: "pitched" },
      { name: "Roof Leak Find", cluster: "repair" },
      { name: "Emergency Patch", cluster: "repair" },
      { name: "Moss Removal", cluster: "pitched" },
      { name: "Roof Cleaning", cluster: "pitched" },
      { name: "Ridge Repoint", cluster: "pitched" },
      { name: "Valley Replace", cluster: "pitched" },
      { name: "Ventilation Install", cluster: "pitched" },
      { name: "Velux Install", cluster: "pitched" },
      { name: "Dormer Build", cluster: "pitched" },
      { name: "Skylight Replace", cluster: "pitched" },
      { name: "Soffit Vents", cluster: "repair" },
      { name: "Roof Insulation", cluster: "pitched" },
      { name: "Loft Insulation", cluster: "repair" },
      { name: "Flat to Pitched", cluster: "pitched" },
      { name: "Re-bed Ridge", cluster: "pitched" },
      { name: "Soffit Repair", cluster: "repair" },
      { name: "Roof Coating", cluster: "repair" },
      { name: "EPDM Patch", cluster: "flat" },
      { name: "GRP Patch", cluster: "flat" },
      { name: "Underlay Replace", cluster: "pitched" },
      { name: "Minor Tile Replace", cluster: "repair" },
      { name: "Bargeboards", cluster: "repair" },
      { name: "Verge Repair", cluster: "pitched" },
      { name: "Cowl Install", cluster: "repair" },
      { name: "Bird Proofing", cluster: "repair" },
      { name: "Solar Mount Prep", cluster: "pitched" },
      { name: "Solar Removal", cluster: "pitched" },
      { name: "Parapet Repair", cluster: "repair" },
      { name: "Flashing Upgrade", cluster: "repair" },
      { name: "Slate Hangers", cluster: "pitched" },
      { name: "Metal Roofing", cluster: "pitched" },
      { name: "Asbestos Removal", cluster: "repair" }, // Note: needs specific license
      { name: "Access System", cluster: "repair" },
      { name: "Dormer Waterproof", cluster: "flat" },
      { name: "Green Roof", cluster: "flat" },
      { name: "Gutter Guard", cluster: "repair" },
      { name: "Membrane Install", cluster: "pitched" },
      { name: "Other (Custom)", cluster: "repair" }
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
      { name: "Basement Conversion", cluster: "structural" },
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