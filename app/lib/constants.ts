export const TRADES = {
    Electrician: {
      jobs: [
        { name: "Consumer Unit Replacement", desc: "Isolation of supply, removal of existing fuse board, installation of new RCBO consumer unit, full circuit testing.", hazards: ["Live Electricity", "Loss of Light", "Manual Handling"] },
        { name: "Full House Rewire", desc: "Chasing walls, lifting floorboards, first fix cabling, second fix accessories, commissioning.", hazards: ["Live Electricity", "Dust/Fumes", "Working at Height", "Vibration"] },
        { name: "EV Charger Installation", desc: "Installation of wall-mounted EV charger, running armoured cable (SWA), connection to main intake.", hazards: ["Live Electricity", "Outdoor Work", "Drilling"] },
        { name: "Solar PV Installation", desc: "Roof mounting of panels, DC cabling, inverter installation, AC connection.", hazards: ["Working at Height", "Live Electricity (DC)", "Lifting"] },
        { name: "EICR / Testing", desc: "Periodic inspection and testing of electrical installations.", hazards: ["Live Electricity", "Access Egress"] }
      ],
      questions: [
        { id: "isolation", label: "Will the supply be fully isolated?", type: "yesno" },
        { id: "occupied", label: "Is the property occupied during works?", type: "yesno" }
      ],
      ppe: ["Safety Boots", "Insulated Tools", "Voltage Indicator", "Safety Glasses"]
    },
    Plumber: {
      jobs: [
        { name: "Boiler Installation (Gas)", desc: "Decommissioning old unit, hanging new boiler, flue installation, gas run, commissioning.", hazards: ["Gas / Hot Work", "Manual Handling", "Working at Height"] },
        { name: "Bathroom Renovation", desc: "Rip out, piping adaptation, tiling, sanitary ware installation.", hazards: ["Dust/Fumes", "Water Leaks", "Silica Dust"] },
        { name: "Unvented Cylinder", desc: "Installation of G3 unvented hot water cylinder and discharge pipework.", hazards: ["Hot Water", "Pressure Vessels", "Manual Handling"] },
        { name: "Underfloor Heating", desc: "Laying insulation, pinning pipes, manifold installation, pressure testing.", hazards: ["Slips/Trips", "Kneeling/Ergonomics"] }
      ],
      questions: [
        { id: "hot_works", label: "Does this involve soldering/torches?", type: "yesno" },
        { id: "asbestos", label: "Is the building pre-2000 (Asbestos risk)?", type: "yesno" }
      ],
      ppe: ["Safety Boots", "Heat Resistant Gloves", "Knee Pads", "Eye Protection"]
    },
    Roofer: {
      jobs: [
        { name: "Pitched Roof Re-tile", desc: "Stripping existing tiles, replacing felt/battens, installing new tiles and ridge.", hazards: ["Working at Height", "Falling Objects", "Weather"] },
        { name: "Flat Roof (Torch-on)", desc: "Applying 3-layer bitumen felt system using propane torch.", hazards: ["Fire / Hot Work", "Working at Height", "Fumes"] },
        { name: "Lead Work / Flashing", desc: "Dressing lead flashings to chimneys and valleys.", hazards: ["Heavy Lifting", "Lead Exposure", "Working at Height"] }
      ],
      questions: [
        { id: "scaffold", label: "Is scaffolding already erected?", type: "yesno" },
        { id: "pitch", label: "Is the roof pitch steep (>30 degrees)?", type: "yesno" }
      ],
      ppe: ["Safety Boots", "Hard Hat", "Harness/Lanyard", "Gripper Gloves"]
    },
    Builder: {
      jobs: [
        { name: "Structural Knock-through", desc: "Installing acrow props, removing load-bearing wall, installing steel beam (RSJ).", hazards: ["Structural Collapse", "Dust/Fumes", "Heavy Lifting", "Noise"] },
        { name: "Single Storey Extension", desc: "Excavation, foundations, brickwork, roof structure.", hazards: ["Excavations", "Working at Height", "Cement Dermatitis"] },
        { name: "Plastering / Rendering", desc: "Mixing materials, applying render/plaster to walls/ceilings.", hazards: ["Dust", "Working at Height", "Repetitive Strain"] }
      ],
      questions: [
        { id: "waste", label: "Is a skip required on public road?", type: "yesno" },
        { id: "dust", label: "Will you be cutting stone/brick (Silica risk)?", type: "yesno" }
      ],
      ppe: ["Safety Boots", "Hard Hat", "Hi-Vis", "FFP3 Mask"]
    }
  };
  
  export const HAZARD_GROUPS = {
    "High Risk": ["Live Electricity", "Gas Supply", "Working at Height", "Confined Spaces", "Structural Collapse"],
    "Health": ["Dust/Fumes", "Asbestos", "Noise", "Vibration", "Silica Dust", "Lead Exposure"],
    "Site": ["Slips/Trips", "Moving Vehicles", "Public Interface", "Lone Working", "Weather"],
    "Manual": ["Heavy Lifting", "Repetitive Strain", "Sharp Edges"]
  };