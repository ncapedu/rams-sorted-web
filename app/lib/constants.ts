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

// --- CLUSTER LOGIC WITH 5+ QUESTIONS PER TYPE ---

const ELECTRICIAN_CLUSTERS = {
  domestic_small: {
    desc: "Standard electrical installation/maintenance within domestic premises.",
    hazards: ["live_electricity", "manual_handling", "dust_fumes", "slips_trips", "public_interface"],
    questions: [
      { id: "isolation", label: "Can the main supply be fully isolated?" },
      { id: "occupied", label: "Is the property occupied by residents?" },
      { id: "floorboards", label: "Will floorboards need to be lifted?" },
      { id: "rcd", label: "Is there existing RCD protection?" },
      { id: "bonding", label: "Is main equipotential bonding in place?" },
      { id: "pets", label: "Are there pets/children requiring exclusion?" }
    ]
  },
  distribution: {
    desc: "Heavy electrical distribution work, consumer units, or sub-mains.",
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
    desc: "Outdoor electrical work, lighting, or power supplies.",
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
    desc: "Inspection and testing. Non-intrusive where possible.",
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
      { id: "ev_earth", label: "Is a separate earth rod required?" }
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
      { id: "co_alarm", label: "Is a Carbon Monoxide alarm being fitted?" }
    ]
  },
  bathroom: {
    desc: "Sanitary ware, tiling, and general water pipework.",
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

// --- THE 200 JOB LIST MAPPED TO CLUSTERS ---
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
      { name: "Floodlight installation", cluster: "external" },
      { name: "Smart home automation system", cluster: "domestic_small" },
      { name: "Thermostat installation", cluster: "domestic_small" },
      { name: "Car park lighting installation", cluster: "external" },
      { name: "Shop fit-out electrical works", cluster: "commercial" },
      { name: "Electrical containment install", cluster: "commercial" },
      { name: "Meter relocation", cluster: "distribution" },
      { name: "Sub-main installation", cluster: "distribution" },
      { name: "Agricultural electrics", cluster: "external" },
      { name: "EV infrastructure (multi-bay)", cluster: "ev_pv_battery" },
      { name: "Cable Management Upgrade", cluster: "commercial" },
      { name: "Fuse/Breaker Repair", cluster: "domestic_small" },
      { name: "Other (Custom)", cluster: "domestic_small" }
    ]
  },
  Plumber: {
    clusters: PLUMBER_CLUSTERS,
    jobs: [
      { name: "Boiler installation (gas)", cluster: "heating" },
      { name: "Combi boiler swap", cluster: "heating" },
      { name: "Boiler service", cluster: "heating" },
      { name: "Boiler repair", cluster: "heating" },
      { name: "Gas leak detection", cluster: "heating" },
      { name: "Gas pipe rerouting", cluster: "heating" },
      { name: "Gas hob/cooker install", cluster: "heating" },
      { name: "Full central heating install", cluster: "heating" },
      { name: "Radiator installation", cluster: "heating" },
      { name: "Radiator relocation", cluster: "heating" },
      { name: "Underfloor heating installation", cluster: "heating" },
      { name: "Hot water cylinder (vented) install", cluster: "heating" },
      { name: "Unvented cylinder install", cluster: "heating" },
      { name: "Immersion heater repair", cluster: "heating" },
      { name: "Bathroom installation", cluster: "bathroom" },
      { name: "Shower installation", cluster: "bathroom" },
      { name: "Toilet repair/replacement", cluster: "bathroom" },
      { name: "Sink/vanity install", cluster: "bathroom" },
      { name: "Mixer tap replacement", cluster: "bathroom" },
      { name: "Thermostatic valve install", cluster: "bathroom" },
      { name: "Burst pipe repair", cluster: "heating" },
      { name: "Leak trace & repair", cluster: "heating" },
      { name: "Drain unblocking", cluster: "drainage" },
      { name: "Drain CCTV survey", cluster: "drainage" },
      { name: "Soil stack repair/replacement", cluster: "drainage" },
      { name: "Guttering/downpipe repair", cluster: "drainage" },
      { name: "Kitchen plumbing first fix", cluster: "bathroom" },
      { name: "Kitchen plumbing second fix", cluster: "bathroom" },
      { name: "Dishwasher plumbing", cluster: "bathroom" },
      { name: "Washing machine plumbing", cluster: "bathroom" },
      { name: "Outdoor tap installation", cluster: "heating" },
      { name: "Water softener installation", cluster: "heating" },
      { name: "Rainwater harvesting setup", cluster: "drainage" },
      { name: "Sump pump installation", cluster: "drainage" },
      { name: "Pumped shower installation", cluster: "bathroom" },
      { name: "Macerator toilet installation", cluster: "bathroom" },
      { name: "Commercial boiler installation", cluster: "heating" },
      { name: "Plant room works", cluster: "heating" },
      { name: "Pressurised system testing", cluster: "heating" },
      { name: "Pipe insulation installation", cluster: "heating" },
      { name: "Heating pump replacement", cluster: "heating" },
      { name: "Expansion vessel replacement", cluster: "heating" },
      { name: "Hot & cold pipe rerouting", cluster: "heating" },
      { name: "Wet room plumbing install", cluster: "bathroom" },
      { name: "Grey water system installation", cluster: "drainage" },
      { name: "Septic tank connection work", cluster: "drainage" },
      { name: "Manhole replacement", cluster: "drainage" },
      { name: "Bathroom rip-out & refit", cluster: "bathroom" },
      { name: "Radiator power flushing", cluster: "heating" },
      { name: "Commercial toilet/urinal install", cluster: "bathroom" },
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
      { name: "Lead flashing replacement", cluster: "pitched" },
      { name: "Lead welding/leadwork", cluster: "flat" },
      { name: "Gutter installation", cluster: "pitched" },
      { name: "Gutter repair", cluster: "pitched" },
      { name: "Fascia & soffit replacement", cluster: "pitched" },
      { name: "Chimney repointing", cluster: "pitched" },
      { name: "Chimney rebuild", cluster: "pitched" },
      { name: "Chimney removal", cluster: "pitched" },
      { name: "Roof leak investigation", cluster: "pitched" },
      { name: "Emergency leak repair", cluster: "pitched" },
      { name: "Moss removal", cluster: "pitched" },
      { name: "Roof cleaning", cluster: "pitched" },
      { name: "Ridge tile repointing", cluster: "pitched" },
      { name: "Valley replacement", cluster: "pitched" },
      { name: "Roof ventilation installation", cluster: "pitched" },
      { name: "Roof window / Velux installation", cluster: "pitched" },
      { name: "Dormer construction", cluster: "pitched" },
      { name: "Skylight replacement", cluster: "pitched" },
      { name: "Soffit ventilation upgrade", cluster: "pitched" },
      { name: "Roof insulation install", cluster: "pitched" },
      { name: "Loft insulation", cluster: "pitched" },
      { name: "Flat-to-pitched roof conversion", cluster: "pitched" },
      { name: "Re-bedding ridge tiles", cluster: "pitched" },
      { name: "Soffit repair", cluster: "pitched" },
      { name: "Roof coating/sealant", cluster: "flat" },
      { name: "EPDM patch repair", cluster: "flat" },
      { name: "GRP patch repair", cluster: "flat" },
      { name: "Pitched roof underlay replacement", cluster: "pitched" },
      { name: "Tile/Slate replacement (minor)", cluster: "pitched" },
      { name: "Roofline repair (bargeboards)", cluster: "pitched" },
      { name: "Verge repair/reconstruction", cluster: "pitched" },
      { name: "Chimney cowl installation", cluster: "pitched" },
      { name: "Bird proofing work", cluster: "pitched" },
      { name: "Solar panel roof mounting prep", cluster: "pitched" },
      { name: "Solar panel removal & reinstatement", cluster: "pitched" },
      { name: "Parapet wall repair", cluster: "pitched" },
      { name: "Flashing upgrade for roof windows", cluster: "pitched" },
      { name: "Slate hangers installation", cluster: "pitched" },
      { name: "Metal roofing installation", cluster: "pitched" },
      { name: "Asbestos corrugated sheet removal", cluster: "pitched" },
      { name: "Roof access system installation", cluster: "pitched" },
      { name: "Dormer roof waterproofing", cluster: "flat" },
      { name: "Green roof installation", cluster: "flat" },
      { name: "Gutter guard installation", cluster: "pitched" },
      { name: "Roof membrane installation", cluster: "pitched" },
      { name: "Other (Custom)", cluster: "pitched" }
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
      { name: "Basement conversion", cluster: "groundworks" },
      { name: "Internal demolition / rip-out", cluster: "internal" },
      { name: "Bricklaying blockwork", cluster: "extension" },
      { name: "Garden wall construction", cluster: "groundworks" },
      { name: "Driveway installation", cluster: "groundworks" },
      { name: "Patio installation", cluster: "groundworks" },
      { name: "Foundation excavation", cluster: "groundworks" },
      { name: "Concrete slab pouring", cluster: "groundworks" },
      { name: "Screeding", cluster: "internal" },
      { name: "RSJ/steel beam installation", cluster: "structural" },
      { name: "Floor joist replacement", cluster: "structural" },
      { name: "Roof carpentry (rafters/trusses)", cluster: "extension" },
      { name: "Timber stud wall installation", cluster: "internal" },
      { name: "Drylining / plasterboard fitting", cluster: "internal" },
      { name: "Plastering", cluster: "internal" },
      { name: "Rendering", cluster: "extension" },
      { name: "Tiling (kitchen/bathroom)", cluster: "internal" },
      { name: "Door fitting", cluster: "internal" },
      { name: "Window fitting", cluster: "internal" },
      { name: "Kitchen installation", cluster: "internal" },
      { name: "Bathroom installation", cluster: "internal" },
      { name: "Staircase installation", cluster: "internal" },
      { name: "Fencing installation", cluster: "groundworks" },
      { name: "Decking installation", cluster: "groundworks" },
      { name: "Garden landscaping", cluster: "groundworks" },
      { name: "Shed/base construction", cluster: "groundworks" },
      { name: "Conservatory base/shell build", cluster: "extension" },
      { name: "Chimney breast removal", cluster: "structural" },
      { name: "Drainage works", cluster: "groundworks" },
      { name: "Manhole installation", cluster: "groundworks" },
      { name: "DPC injection/damp proofing", cluster: "internal" },
      { name: "Insulation installation", cluster: "internal" },
      { name: "Cladding installation", cluster: "extension" },
      { name: "Roof structure changes", cluster: "extension" },
      { name: "Underpinning", cluster: "structural" },
      { name: "Load-bearing wall removal", cluster: "structural" },
      { name: "Porch construction", cluster: "extension" },
      { name: "Shop fit-out", cluster: "internal" },
      { name: "Commercial partitioning", cluster: "internal" },
      { name: "Suspended ceiling installation", cluster: "internal" },
      { name: "Fire door installation", cluster: "internal" },
      { name: "Renovation/refurbishment", cluster: "internal" },
      { name: "External rendering/pebble dash", cluster: "extension" },
      { name: "Site clearance", cluster: "groundworks" },
      { name: "Garden room/outbuilding construction", cluster: "extension" },
      { name: "Other (Custom)", cluster: "internal" }
    ]
  }
};