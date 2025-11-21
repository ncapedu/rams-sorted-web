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
  "Site": ["slips_trips", "moving_vehicles", "public_interface", "lone_working", "environmental_weather", "water_ingress", "poor_lighting", "fragile_surfaces", "falling_objects"],
  "Physical": ["manual_handling", "plant_machinery", "underground_services", "sharp_objects"]
};

// --- DEFINING THE LOGIC CLUSTERS ---
const ELECTRICIAN_CLUSTERS = {
  domestic_small: { hazards: ["live_electricity", "manual_handling", "dust_fumes", "slips_trips", "public_interface"], questions: [{ id: "isolation", label: "Is the main supply fully isolatable?" }, { id: "occupied", label: "Is the property occupied during work?" }] },
  distribution: { hazards: ["live_electricity", "manual_handling", "fire_explosion", "public_interface"], questions: [{ id: "locked_intake", label: "Is the meter room/intake cupboard locked?" }, { id: "earthing", label: "Is the earthing system verified?" }] },
  testing: { hazards: ["live_electricity", "slips_trips", "lone_working"], questions: [{ id: "live_env", label: "Will testing occur in a live environment?" }] },
  external: { hazards: ["live_electricity", "work_at_height", "environmental_weather", "water_ingress"], questions: [{ id: "ladders", label: "Are ladders or MEWPs being used?" }, { id: "weather", label: "Is weather currently a risk?" }] },
  ev_pv_battery: { hazards: ["live_electricity", "manual_handling", "work_at_height", "fire_explosion"], questions: [{ id: "dno", label: "Has DNO approval been submitted?" }, { id: "dc_work", label: "Will there be DC work above 120V?" }] },
  commercial: { hazards: ["live_electricity", "work_at_height", "dust_fumes", "plant_machinery"], questions: [{ id: "permit", label: "Is a Permit to Work required?" }] }
};

const PLUMBER_CLUSTERS = {
  heating: { hazards: ["gas", "hot_work", "manual_handling", "chemical_coshh"], questions: [{ id: "gas_safe", label: "Is Gas Safe registration valid for this work?" }, { id: "soldering", label: "Will soldering torches be used?" }] },
  bathroom: { hazards: ["manual_handling", "dust_fumes", "water_ingress", "chemical_coshh"], questions: [{ id: "waterproofing", label: "Will waterproofing/tanking be applied?" }] },
  drainage: { hazards: ["biological", "confined_space", "excavation", "underground_services"], questions: [{ id: "excavation_req", label: "Is excavation required?" }, { id: "confined_entry", label: "Is confined space entry required?" }] },
  specialist: { hazards: ["manual_handling", "hot_work", "chemical_coshh"], questions: [{ id: "design_check", label: "Has the design been verified?" }] }
};

const ROOFER_CLUSTERS = {
  pitched: { hazards: ["work_at_height", "falling_objects", "environmental_weather", "fragile_surfaces"], questions: [{ id: "scaffold", label: "Is scaffolding already erected?" }] },
  flat: { hazards: ["work_at_height", "hot_work", "fire_explosion", "dust_fumes"], questions: [{ id: "torch_on", label: "Will torch-on materials be used?" }, { id: "hot_work_permit", label: "Is a hot works permit required?" }] },
  repair: { hazards: ["work_at_height", "environmental_weather", "public_interface"], questions: [{ id: "ladder_secure", label: "Can the ladder be secured?" }] }
};

const BUILDER_CLUSTERS = {
  structural: { hazards: ["structural_collapse", "dust_fumes", "noise_vibration", "plant_machinery"], questions: [{ id: "props", label: "Are temporary supports (props) required?" }] },
  extension: { hazards: ["excavation", "work_at_height", "chemical_coshh", "plant_machinery"], questions: [{ id: "excavation_deep", label: "Is excavation deeper than 1.2 metres?" }] },
  internal: { hazards: ["manual_handling", "dust_fumes", "sharp_objects"], questions: [{ id: "ventilation", label: "Is there adequate ventilation?" }] },
  groundworks: { hazards: ["excavation", "plant_machinery", "underground_services", "biological"], questions: [{ id: "services_scan", label: "Have underground services been scanned?" }] }
};

// --- MASTER LIST: MAPPING 50 JOBS TO CLUSTERS ---
export const TRADES = {
  Electrician: {
    clusters: ELECTRICIAN_CLUSTERS,
    jobs: [
      { name: "Consumer unit/fuse board replacement", cluster: "distribution" },
      { name: "Full house rewire", cluster: "domestic_small" },
      { name: "Partial rewire", cluster: "domestic_small" },
      { name: "New circuit installation", cluster: "domestic_small" },
      { name: "Additional sockets install", cluster: "domestic_small" },
      { name: "Indoor lighting upgrade/replacement", cluster: "domestic_small" },
      { name: "Outdoor/garden lighting install", cluster: "external" },
      { name: "Fault finding & diagnostics", cluster: "domestic_small" },
      { name: "EV charger installation", cluster: "ev_pv_battery" },
      { name: "EICR testing (domestic)", cluster: "testing" },
      { name: "EICR testing (commercial)", cluster: "testing" },
      { name: "Smoke/heat alarm installation", cluster: "domestic_small" },
      { name: "Fire alarm system installation", cluster: "commercial" },
      { name: "Emergency lighting installation", cluster: "commercial" },
      { name: "Data cabling / ethernet", cluster: "commercial" },
      { name: "CCTV system installation", cluster: "external" },
      { name: "Door entry/Intercom system", cluster: "external" },
      { name: "Solar PV installation", cluster: "ev_pv_battery" },
      { name: "Battery storage system installation", cluster: "ev_pv_battery" },
      { name: "Generator installation", cluster: "distribution" },
      { name: "Temporary site electrics", cluster: "distribution" },
      { name: "Cooker/oven/hob wiring", cluster: "domestic_small" },
      { name: "Electric shower circuit installation", cluster: "domestic_small" },
      { name: "Loft wiring install", cluster: "domestic_small" },
      { name: "Garage/outhouse electrics", cluster: "external" },
      { name: "Extension/renovation first fix", cluster: "domestic_small" },
      { name: "Extension/renovation second fix", cluster: "domestic_small" },
      { name: "LED retrofit upgrade", cluster: "domestic_small" },
      { name: "Commercial lighting upgrade", cluster: "commercial" },
      { name: "Warehouse high-bay lighting", cluster: "commercial" },
      { name: "PAT testing", cluster: "testing" },
      { name: "RCD replacement/upgrade", cluster: "distribution" },
      { name: "Electrical heating system installation", cluster: "domestic_small" },
      { name: "Underfloor electric heating install", cluster: "domestic_small" },
      { name: "Immersion heater install/repair", cluster: "domestic_small" },
      { name: "Security lighting installation", cluster: "external" },
      { name: "Car park lighting installation", cluster: "external" },
      { name: "Shop fit-out electrical works", cluster: "commercial" },
      { name: "Electrical containment install", cluster: "commercial" },
      { name: "Meter relocation", cluster: "distribution" },
      { name: "Sub-main installation", cluster: "distribution" },
      { name: "Agricultural electrics", cluster: "external" },
      { name: "Other (Custom)", cluster: "domestic_small" }
    ]
  },
  Plumber: {
    clusters: PLUMBER_CLUSTERS,
    jobs: [
      { name: "Boiler installation (gas)", cluster: "heating" },
      { name: "Combi boiler swap", cluster: "heating" },
      { name: "Boiler service", cluster: "heating" },
      { name: "Gas leak detection", cluster: "heating" },
      { name: "Gas pipe rerouting", cluster: "heating" },
      { name: "Full central heating install", cluster: "heating" },
      { name: "Radiator installation", cluster: "heating" },
      { name: "Underfloor heating installation", cluster: "specialist" },
      { name: "Hot water cylinder (vented) install", cluster: "specialist" },
      { name: "Unvented cylinder install", cluster: "specialist" },
      { name: "Bathroom installation", cluster: "bathroom" },
      { name: "Shower installation", cluster: "bathroom" },
      { name: "Toilet repair/replacement", cluster: "bathroom" },
      { name: "Burst pipe repair", cluster: "heating" },
      { name: "Leak trace & repair", cluster: "heating" },
      { name: "Drain unblocking", cluster: "drainage" },
      { name: "Drain CCTV survey", cluster: "drainage" },
      { name: "Soil stack repair/replacement", cluster: "drainage" },
      { name: "Kitchen plumbing first fix", cluster: "bathroom" },
      { name: "Outdoor tap installation", cluster: "heating" },
      { name: "Water softener installation", cluster: "specialist" },
      { name: "Commercial boiler installation", cluster: "heating" },
      { name: "Plant room works", cluster: "heating" },
      { name: "Power flushing", cluster: "heating" },
      { name: "Other (Custom)", cluster: "heating" }
    ]
  },
  Roofer: {
    clusters: ROOFER_CLUSTERS,
    jobs: [
      { name: "Pitched roof re-tile", cluster: "pitched" },
      { name: "Slate roof installation", cluster: "pitched" },
      { name: "Flat roof (felt) install", cluster: "flat" },
      { name: "Flat roof (GRP) install", cluster: "flat" },
      { name: "Flat roof (EPDM) install", cluster: "flat" },
      { name: "Lead flashing replacement", cluster: "repair" },
      { name: "Lead welding/leadwork", cluster: "flat" },
      { name: "Gutter installation", cluster: "repair" },
      { name: "Fascia & soffit replacement", cluster: "repair" },
      { name: "Chimney repointing", cluster: "repair" },
      { name: "Chimney removal", cluster: "pitched" },
      { name: "Roof leak investigation", cluster: "repair" },
      { name: "Roof window / Velux installation", cluster: "pitched" },
      { name: "Dormer construction", cluster: "pitched" },
      { name: "Roof insulation install", cluster: "pitched" },
      { name: "Asbestos corrugated sheet removal", cluster: "repair" },
      { name: "Other (Custom)", cluster: "repair" }
    ]
  },
  Builder: {
    clusters: BUILDER_CLUSTERS,
    jobs: [
      { name: "Structural knock-through", cluster: "structural" },
      { name: "Single-storey extension", cluster: "extension" },
      { name: "Double-storey extension", cluster: "extension" },
      { name: "Loft conversion", cluster: "structural" },
      { name: "Garage conversion", cluster: "internal" },
      { name: "Internal demolition / rip-out", cluster: "internal" },
      { name: "Bricklaying blockwork", cluster: "extension" },
      { name: "Foundation excavation", cluster: "groundworks" },
      { name: "Concrete slab pouring", cluster: "groundworks" },
      { name: "RSJ/steel beam installation", cluster: "structural" },
      { name: "Roof carpentry", cluster: "extension" },
      { name: "Plastering", cluster: "internal" },
      { name: "Rendering", cluster: "extension" },
      { name: "Kitchen installation", cluster: "internal" },
      { name: "Bathroom installation", cluster: "internal" },
      { name: "Drainage works", cluster: "groundworks" },
      { name: "Underpinning", cluster: "structural" },
      { name: "Other (Custom)", cluster: "internal" }
    ]
  }
};