export const TRADES = {
    Electrician: {
      jobs: [
        { name: "Consumer Unit Replacement", desc: "Isolation of supply, removal of existing fuse board, installation of new RCBO consumer unit, full circuit testing.", hazards: ["Live Electricity", "Manual Handling", "Loss of Light"] },
        { name: "Full House Rewire", desc: "Chasing walls, lifting floorboards, first fix cabling, second fix accessories, commissioning.", hazards: ["Live Electricity", "Dust/Fumes", "Working at Height", "Manual Handling", "Power Tools"] },
        { name: "EV Charger Installation", desc: "Installation of wall-mounted EV charger, running armoured cable (SWA), connection to main intake.", hazards: ["Live Electricity", "Outdoor Work", "Drilling/Vibration"] },
        { name: "EICR / Testing", desc: "Periodic inspection and testing of electrical installations.", hazards: ["Live Electricity", "Access Egress"] }
      ]
    },
    Plumber: {
      jobs: [
        { name: "Boiler Installation (Gas)", desc: "Decommissioning old unit, hanging new boiler, flue installation, gas run, commissioning.", hazards: ["Gas / Hot Work", "Manual Handling", "Working at Height"] },
        { name: "Bathroom Renovation", desc: "Rip out, piping adaptation, tiling, sanitary ware installation.", hazards: ["Dust/Fumes", "Water Leaks", "Silica Dust"] },
        { name: "Emergency Leak Repair", desc: "Locating leak, isolating water supply, pipe repair.", hazards: ["Slips/Trips", "Biological Hazards", "Confined Spaces"] }
      ]
    },
    Roofer: {
      jobs: [
        { name: "Pitched Roof Re-tile", desc: "Stripping existing tiles, replacing felt/battens, installing new tiles and ridge.", hazards: ["Working at Height", "Falling Objects", "Weather Exposure"] },
        { name: "Flat Roof (Torch-on)", desc: "Applying 3-layer bitumen felt system using propane torch.", hazards: ["Fire / Hot Work", "Working at Height", "Fumes"] }
      ]
    },
    Builder: {
      jobs: [
        { name: "Structural Knock-through", desc: "Installing acrow props, removing load-bearing wall, installing steel beam (RSJ).", hazards: ["Structural Collapse", "Dust/Fumes", "Heavy Lifting", "Noise"] },
        { name: "Single Storey Extension", desc: "Excavation, foundations, brickwork, roof structure.", hazards: ["Excavations", "Working at Height", "Cement Dermatitis"] }
      ]
    }
  };
  
  export const HAZARD_GROUPS = {
    "High Risk": ["Live Electricity", "Gas Supply", "Working at Height", "Confined Spaces", "Structural Collapse"],
    "Health": ["Dust/Fumes", "Asbestos Risk", "Noise", "Vibration", "Silica Dust", "Lead Exposure"],
    "Site": ["Slips/Trips", "Moving Vehicles", "Public Interface", "Lone Working", "Weather Exposure"],
    "Manual": ["Heavy Lifting", "Repetitive Strain", "Sharp Edges"]
  };