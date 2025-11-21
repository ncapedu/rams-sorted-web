// app/lib/constants.ts

export const TRADES = {
    Electrician: {
      jobs: [
        { name: "Consumer Unit Replacement", desc: "Isolating supply, removing old fuse board, installing new RCBO consumer unit, testing and commissioning circuits.", hazards: ["Live Electricity", "Manual Handling", "Loss of Light"] },
        { name: "Full House Rewire", desc: "Chasing walls, lifting floorboards, running new cabling, installing accessories, first and second fix.", hazards: ["Live Electricity", "Dust/Fumes", "Working at Height", "Manual Handling", "Power Tools"] },
        { name: "EV Charger Install", desc: "Installing external EV charging point, running armoured cable, connecting to distribution board.", hazards: ["Live Electricity", "Working at Height", "Outdoor Work", "Drilling/Vibration"] },
        { name: "EICR / Testing", desc: "Inspection and testing of electrical installation.", hazards: ["Live Electricity", "Access Egress"] },
      ],
      ppe: ["Safety Boots", "Hi-Vis Vest", "Insulated Tools", "Safety Glasses"]
    },
    Plumber: {
      jobs: [
        { name: "Boiler Installation", desc: "Removing old unit, flue installation, pipework adaptation, commissioning.", hazards: ["Gas / Hot Work", "Manual Handling", "Working at Height"] },
        { name: "Bathroom Fit-out", desc: "Removing sanitary ware, piping alterations, tiling, installation of new suite.", hazards: ["Dust/Fumes", "Manual Handling", "Slips/Trips", "Water Leaks"] },
        { name: "Emergency Leak Repair", desc: "Locating leak, isolating water supply, pipe repair.", hazards: ["Slips/Trips", "Biological Hazards", "Confined Spaces"] },
      ],
      ppe: ["Safety Boots", "Hi-Vis Vest", "Gloves", "Knee Pads"]
    },
    Roofer: {
      jobs: [
        { name: "Flat Roof Replacement", desc: "Stripping old felt, boarding, laying new GRP/Felt system.", hazards: ["Working at Height", "Hot Work", "Manual Handling", "Weather Exposure"] },
        { name: "Tile Replacement", desc: "Access via ladder/scaffold, replacing broken tiles, repointing ridge.", hazards: ["Working at Height", "Falling Objects", "Dust/Fumes"] },
      ],
      ppe: ["Safety Boots", "Hard Hat", "Gloves", "Harness"]
    },
    Builder: {
      jobs: [
        { name: "Single Storey Extension", desc: "Foundations, brickwork, roofing, internal fit out.", hazards: ["Working at Height", "Manual Handling", "Dust/Fumes", "Noise", "Heavy Plant"] },
        { name: "Knock-through / Structural", desc: "Installing acrow props, removing load bearing wall, inserting steel beam.", hazards: ["Structural Instability", "Dust/Fumes", "Noise", "Manual Handling"] },
      ],
      ppe: ["Safety Boots", "Hard Hat", "Hi-Vis Vest", "Gloves", "Dust Mask"]
    }
  };
  
  export const HAZARD_GROUPS = {
    "Physical": ["Working at Height", "Manual Handling", "Slips/Trips", "Confined Spaces", "Hot Work"],
    "Health": ["Dust/Fumes", "Asbestos Risk", "Noise", "Vibration"],
    "Site": ["Live Electricity", "Gas Supply", "Moving Vehicles", "Public Interface", "Lone Working"]
  };