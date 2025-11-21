export const TRADES = {
    Electrician: {
      jobs: [
        "Consumer Unit Replacement", "Full House Rewire", "EV Charger Installation", 
        "Solar PV Installation", "EICR / Testing", "Emergency Lighting", "Data Cabling", "Other"
      ]
    },
    Plumber: {
      jobs: [
        "Boiler Installation", "Bathroom Renovation", "Emergency Leak Repair", 
        "Underfloor Heating", "Unvented Cylinder", "Drainage Works", "Gas Safety Check", "Other"
      ]
    },
    Roofer: {
      jobs: [
        "Pitched Roof Re-tile", "Flat Roof (Torch-on)", "Lead Work / Flashing", 
        "Guttering & Fascias", "Chimney Repair", "Roof Window Install", "Other"
      ]
    },
    Builder: {
      jobs: [
        "Structural Knock-through", "Single Storey Extension", "Plastering / Rendering", 
        "Groundworks / Foundations", "Brickwork", "Carpentry / Joinery", "Painting & Decorating", "Other"
      ]
    }
  };
  
  export const HAZARD_GROUPS = {
    "High Risk Activities": ["Live Electricity", "Gas Supply", "Working at Height", "Confined Spaces", "Structural Works", "Hot Works (Fire Risk)"],
    "Health Hazards": ["Dust / Silica", "Asbestos Risk", "High Noise Levels", "Hand-Arm Vibration", "Lead Exposure", "Solvents / Glues"],
    "Site Environment": ["Slips, Trips & Falls", "Moving Vehicles", "Public Interface", "Lone Working", "Adverse Weather", "Poor Lighting"],
    "Physical Strain": ["Manual Handling (Heavy)", "Repetitive Strain", "Sharp Edges", "Kneeling / Crawling"]
  };