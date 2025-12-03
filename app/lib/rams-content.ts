
export const METHOD_STATEMENTS: Record<string, Record<string, string[]>> = {
    Electrician: {
        "Consumer unit/fuse board replacement": [
            "Arrive on site and induct with client/site manager.",
            "Inspect existing installation and identify all circuits.",
            "Isolate main supply and prove dead using approved voltage indicator.",
            "Lock off isolation point and display warning signs.",
            "Remove existing consumer unit and label all conductors.",
            "Install new consumer unit backplate/enclosure securely.",
            "Re-terminate all circuits, ensuring correct polarity and torque settings.",
            "Install and connect main protective bonding conductors.",
            "Energise and carry out full sequence of dead and live tests.",
            "Complete Electrical Installation Certificate (EIC).",
            "Label all circuits and hand over to client."
        ],
        "Full house rewire": [
            "Agree routing and accessory positions with client.",
            "Isolate existing circuits and strip out redundant wiring.",
            "Chase walls and install containment/capping where required.",
            "First fix: Install new cables to all points.",
            "Second fix: Install accessories (sockets, switches, lights).",
            "Install and terminate new consumer unit.",
            "Perform dead testing (Continuity, Insulation Resistance).",
            "Energise and perform live testing (Polarity, Zs, RCD).",
            "Make good chases (if agreed) and clear waste.",
            "Issue EIC and Building Control notification."
        ],
        "New circuit installation": [
            "Isolate relevant section of distribution board.",
            "Prove dead and lock off.",
            "Install cable route (trunking, conduit, or clipped).",
            "Install accessories and back boxes.",
            "Terminate cables at accessory and distribution board.",
            "Verify circuit protective conductor continuity.",
            "Perform insulation resistance test.",
            "Energise and test for earth fault loop impedance and RCD operation.",
            "Issue Minor Works Certificate or EIC."
        ],
        "Fault finding & diagnostics": [
            "Discuss fault symptoms with client.",
            "Carry out visual inspection of affected equipment.",
            "Isolate supply and lock off if safe to do so.",
            "Perform dead tests to locate fault (insulation resistance, continuity).",
            "If live testing required, use GS38 compliant probes and PPE.",
            "Identify fault and propose rectification.",
            "Repair fault or replace defective component.",
            "Re-test circuit to confirm safety and operation.",
            "Issue report or certificate."
        ],
        "EV charger installation": [
            "Assess existing supply capacity and earthing arrangement.",
            "Install dedicated circuit from distribution board to charger location.",
            "Mount EV charger unit securely.",
            "Terminate supply cables and data cables (if applicable).",
            "Configure load management settings.",
            "Test EV charger functionality using specialist tester.",
            "Demonstrate operation to client and hand over documentation."
        ],
        "EICR testing (domestic)": [
            "Agree extent of testing and limitations with client.",
            "Perform visual inspection of installation.",
            "Isolate circuits sequentially to minimise disruption.",
            "Perform dead tests: Continuity of CPC, Ring Final Circuit, Insulation Resistance.",
            "Perform live tests: Polarity, Earth Loop Impedance, RCD trip times.",
            "Record all results and observations.",
            "Re-energise and verify all circuits are operational.",
            "Compile and issue EICR report."
        ],
        // Default fallback for other electrician jobs
        "default": [
            "Arrive on site and assess work area.",
            "Isolate electrical supply and prove dead.",
            "Lock off and post warning signs.",
            "Carry out installation/maintenance work as per specification.",
            "Ensure all connections are tight and secure.",
            "Perform necessary electrical tests.",
            "Re-energise and check operation.",
            "Clear away waste and tools.",
            "Hand over to client."
        ]
    },
    // Generic fallback for other trades
    "default": {
        "default": [
            "Arrive on site and report to site manager.",
            "Review risk assessment and method statement.",
            "Set up safe work area and exclusion zones.",
            "Carry out works in accordance with specification.",
            "Maintain a clean and tidy work area.",
            "Dispose of waste in designated skips.",
            "Final inspection and handover."
        ]
    }
};

export const PPE_DEFINITIONS: Record<string, { item: string; reason: string }> = {
    "live_electricity": { item: "Insulated Gloves / Tools", reason: "Protection against electric shock" },
    "work_at_height": { item: "Safety Harness / Restraint", reason: "Fall prevention" },
    "dust_fumes": { item: "FFP3 Dust Mask", reason: "Respiratory protection against particulates" },
    "noise_vibration": { item: "Ear Defenders / Plugs", reason: "Hearing protection" },
    "manual_handling": { item: "Safety Boots & Gloves", reason: "Foot and hand protection" },
    "eye_protection": { item: "Safety Glasses / Goggles", reason: "Protection against flying debris" },
    "head_protection": { item: "Hard Hat", reason: "Protection against falling objects" },
    "hi_vis": { item: "Hi-Vis Vest / Jacket", reason: "Visibility to others and plant" }
};

export const COSHH_LIBRARY: Record<string, { substance: string; hazard: string; control: string }[]> = {
    "cleaning": [
        { substance: "Multi-purpose cleaner (neutral detergent)", hazard: "Skin/eye irritation", control: "Gloves, eye protection if splashing likely" },
        { substance: "Heavy-duty degreaser (alkaline)", hazard: "Skin burns, eye damage", control: "Chemical resistant gloves, goggles" },
        { substance: "Caustic soda solution (sodium hydroxide)", hazard: "Severe skin burns, eye damage", control: "Face shield, chemical gloves, apron" },
        { substance: "Oven cleaner (strong caustic formulation)", hazard: "Severe burns, respiratory irritation", control: "Gloves, goggles, ventilation" },
        { substance: "Bleach (sodium hypochlorite)", hazard: "Skin/eye irritation, toxic gas if mixed", control: "Gloves, goggles, do not mix with acids" },
        { substance: "Thick bleach / toilet bleach", hazard: "Skin/eye irritation", control: "Gloves, eye protection" },
        { substance: "Disinfectant (quaternary ammonium compound)", hazard: "Skin irritation", control: "Gloves, wash hands after use" },
        { substance: "Chlorine-based disinfectant", hazard: "Respiratory irritation, skin irritation", control: "Ventilation, gloves" },
        { substance: "Peroxide-based disinfectant / cleaner", hazard: "Eye damage, skin irritation", control: "Goggles, gloves" },
        { substance: "Alcohol-based surface sanitiser", hazard: "Flammable, eye irritation", control: "Keep away from heat, avoid eye contact" },
        { substance: "Glass cleaner (ammonia/alcohol blend)", hazard: "Eye irritation", control: "Avoid inhaling mist, eye protection" },
        { substance: "Bathroom cleaner (acidic)", hazard: "Skin/eye irritation", control: "Gloves, eye protection" },
        { substance: "Limescale remover / descaler (phosphoric acid)", hazard: "Skin burns, eye damage", control: "Gloves, goggles" },
        { substance: "Brick & patio cleaner (hydrochloric acid)", hazard: "Severe burns, respiratory irritation", control: "Acid-resistant gloves, goggles, face shield" },
        { substance: "Cement remover (acid blend)", hazard: "Skin burns, eye damage", control: "Gloves, goggles" },
        { substance: "Toilet descaler (strong acid)", hazard: "Corrosive, eye damage", control: "Gloves, goggles" },
        { substance: "Floor stripper (polish remover)", hazard: "Skin irritation, vapour inhalation", control: "Ventilation, gloves, eye protection" },
        { substance: "Polish / spray polish (aerosol)", hazard: "Flammable, inhalation", control: "Ventilation, keep away from heat" },
        { substance: "Stainless steel cleaner (solvent based)", hazard: "Flammable, skin irritation", control: "Gloves, ventilation" },
        { substance: "Carpet shampoo / extraction chemical", hazard: "Skin irritation", control: "Gloves" },
        { substance: "Upholstery cleaner", hazard: "Skin/eye irritation", control: "Gloves, eye protection" },
        { substance: "Chewing gum remover (solvent aerosol)", hazard: "Extremely flammable", control: "No hot works nearby, ventilation" },
        { substance: "Graffiti remover (strong solvent)", hazard: "Skin irritation, inhalation, flammable", control: "Chemical gloves, goggles, ventilation" },
        { substance: "Tar & glue remover", hazard: "Flammable, skin irritation", control: "Gloves, ventilation" },
        { substance: "Odour neutraliser / air freshener (aerosol)", hazard: "Flammable", control: "Keep away from heat sources" },
        { substance: "Hand wash (industrial)", hazard: "Eye irritation", control: "Rinse with water if in eyes" },
        { substance: "Antibacterial hand rub (alcohol gel)", hazard: "Flammable, eye irritation", control: "Keep away from heat" },
        { substance: "Hand scrub with abrasives", hazard: "Skin abrasion/irritation", control: "Rinse thoroughly" }
    ],
    "construction_materials": [
        { substance: "Portland cement (dry)", hazard: "Skin burns, respiratory irritation, eye damage", control: "Gloves, goggles, FFP3 mask if dusty" },
        { substance: "Ready-mix concrete", hazard: "Skin burns (wet cement)", control: "Waterproof gloves, long sleeves, boots" },
        { substance: "Cement mortar / sand & cement", hazard: "Skin burns, dermatitis", control: "Gloves, barrier cream, washing facilities" },
        { substance: "Concrete repair mortar", hazard: "Skin/eye irritation", control: "Gloves, goggles" },
        { substance: "Self-levelling compound", hazard: "Dust inhalation, skin irritation", control: "FFP3 mask during mixing, gloves" },
        { substance: "Tile adhesive (cement-based)", hazard: "Skin irritation, dust inhalation", control: "Gloves, mask during mixing" },
        { substance: "Tile grout (cement-based)", hazard: "Skin irritation, dust inhalation", control: "Gloves, mask" },
        { substance: "Gypsum plaster", hazard: "Dust inhalation", control: "Ventilation, mask if sanding" },
        { substance: "Jointing compound / drywall filler", hazard: "Dust inhalation (sanding)", control: "FFP3 mask, vacuum extraction" },
        { substance: "Ready-mixed lightweight filler", hazard: "Dust inhalation", control: "Mask if sanding" },
        { substance: "Sand (silica-containing)", hazard: "Silica dust inhalation", control: "Damping down, FFP3 mask" },
        { substance: "Stone dust (silica-containing)", hazard: "Respirable Crystalline Silica (RCS)", control: "Water suppression, on-tool extraction, FFP3" },
        { substance: "Brick / block dust", hazard: "RCS exposure", control: "Water suppression, extraction, FFP3" },
        { substance: "Concrete dust (cutting/chasing)", hazard: "RCS exposure", control: "Water suppression, extraction, FFP3" },
        { substance: "Masonry cutting dust", hazard: "RCS exposure", control: "Water suppression, extraction, FFP3" },
        { substance: "Quartz / crystalline silica dust", hazard: "Silicosis, lung cancer", control: "Strict dust control, FFP3, health surveillance" },
        { substance: "Hardwood dust (e.g. oak, beech)", hazard: "Carcinogenic (nasal), asthma", control: "Extraction, FFP3 mask" },
        { substance: "Softwood dust", hazard: "Asthma, respiratory irritation", control: "Extraction, FFP3 mask" },
        { substance: "MDF dust", hazard: "Formaldehyde, respiratory irritation", control: "Extraction, FFP3 mask" },
        { substance: "OSB/plywood dust", hazard: "Respiratory irritation", control: "Extraction, mask" },
        { substance: "Glass / mineral wool fibres", hazard: "Skin/eye/respiratory irritation", control: "Coveralls, gloves, FFP3 mask" },
        { substance: "Rockwool / stone wool fibres", hazard: "Skin/respiratory irritation", control: "Coveralls, gloves, mask" },
        { substance: "Expanded polystyrene dust", hazard: "Nuisance dust", control: "Ventilation, mask" },
        { substance: "Insulation board dust", hazard: "Dust inhalation", control: "Ventilation, mask" },
        { substance: "Asbestos-containing materials (ACMs)", hazard: "Mesothelioma, asbestosis, lung cancer", control: "DO NOT DISTURB. Specialist licensed removal only." },
        { substance: "Bitumen / Asphalt (hot)", hazard: "Thermal burns, fumes", control: "Heat resistant gloves, coveralls, ventilation" },
        { substance: "Cold-lay Macadam", hazard: "Skin irritation, solvent fumes", control: "Gloves, barrier cream" },
        { substance: "Resin-bound stone mix", hazard: "Sensitisation, skin irritation", control: "Gloves, goggles, ventilation" }
    ],
    "paints_solvents_adhesives": [
        { substance: "Water-based emulsion paint", hazard: "Low hazard", control: "Ventilation, wash off skin" },
        { substance: "Solvent-based undercoat", hazard: "Flammable, vapour inhalation", control: "Ventilation, no naked flames" },
        { substance: "Solvent-based gloss / satin", hazard: "Flammable, vapour inhalation", control: "Ventilation, gloves" },
        { substance: "Metal primer (zinc phosphate)", hazard: "Flammable, aquatic toxicity", control: "Gloves, ventilation, disposal control" },
        { substance: "Epoxy floor coating (two-pack)", hazard: "Sensitisation, skin/eye irritation", control: "Gloves, goggles, ventilation" },
        { substance: "Two-pack polyurethane coating", hazard: "Isocyanates (asthma), eye damage", control: "Air-fed mask (spraying) or ventilation, gloves" },
        { substance: "White Spirit", hazard: "Flammable, aspiration hazard, skin dryness", control: "Gloves, ventilation" },
        { substance: "Acetone", hazard: "Highly flammable, eye irritation, drowsiness", control: "Ventilation, eye protection, no ignition sources" },
        { substance: "Methylated Spirits", hazard: "Highly flammable", control: "Keep container closed, no flames" },
        { substance: "Cellulose Thinners", hazard: "Highly flammable, harmful inhalation", control: "Ventilation, organic vapour mask, gloves" },
        { substance: "Xylene / Xylol", hazard: "Flammable, harmful by inhalation/skin", control: "Gloves, ventilation, mask" },
        { substance: "Contact Adhesive", hazard: "Highly flammable, vapour inhalation", control: "Ventilation, no ignition sources, gloves" },
        { substance: "Super Glue (Cyanoacrylate)", hazard: "Bonds skin instantly, eye irritant", control: "Gloves, goggles" },
        { substance: "Epoxy Resin (Two-part)", hazard: "Skin sensitisation, eye irritation", control: "Nitrile gloves, eye protection" },
        { substance: "Expanding PU Foam", hazard: "Isocyanates, sticks to skin", control: "Gloves, goggles, ventilation" },
        { substance: "Silicone Sealant", hazard: "Low hazard (some release acetic acid)", control: "Ventilation, gloves" },
        { substance: "PVC Pipe Cement", hazard: "Highly flammable, fumes", control: "Ventilation, gloves" },
        { substance: "Gripfill / Grab Adhesive", hazard: "Flammable (solvent based)", control: "Ventilation, gloves" }
    ],
    "fuels_oils_gases": [
        { substance: "Diesel Fuel", hazard: "Carcinogenic, skin irritation, environmental", control: "Gloves, spill kit" },
        { substance: "Petrol / Gasoline", hazard: "Highly flammable, carcinogenic", control: "No ignition sources, ventilation" },
        { substance: "Kerosene / Heating Oil", hazard: "Flammable, skin irritation", control: "Gloves, ventilation" },
        { substance: "Engine Oil (New)", hazard: "Low hazard", control: "Gloves" },
        { substance: "Used Engine Oil", hazard: "Carcinogenic, skin irritation", control: "Nitrile gloves, wash hands" },
        { substance: "Hydraulic Oil", hazard: "High pressure injection injury, skin irritation", control: "Gloves, eye protection" },
        { substance: "Grease", hazard: "Skin irritation", control: "Gloves" },
        { substance: "Propane (LPG)", hazard: "Extremely flammable, asphyxiant", control: "Ventilation, no leaks, upright storage" },
        { substance: "Butane", hazard: "Extremely flammable", control: "Ventilation, no leaks" },
        { substance: "Acetylene", hazard: "Extremely flammable, explosive", control: "Flashback arrestors, upright storage" },
        { substance: "Oxygen", hazard: "Oxidiser (increases fire risk)", control: "Keep away from oil/grease" },
        { substance: "Argon / Shielding Gas", hazard: "Asphyxiant", control: "Ventilation" },
        { substance: "Refrigerant Gas (e.g. R410A, R32)", hazard: "Asphyxiant, cold burns", control: "Ventilation, gloves, goggles" },
        { substance: "Aerosol Spray Paint", hazard: "Extremely flammable, inhalation", control: "Ventilation, mask" },
        { substance: "WD-40 / Penetrating Oil", hazard: "Flammable aerosol", control: "Ventilation" }
    ],
    "welding_plumbing_specialist": [
        { substance: "Mild steel welding fume", hazard: "Respiratory irritation, metal fume fever", control: "Extraction, RPE (air fed or FFP3)" },
        { substance: "Stainless steel fume", hazard: "Hexavalent chromium (carcinogen)", control: "Local exhaust ventilation (LEV), air-fed mask" },
        { substance: "Soldering Flux", hazard: "Corrosive fumes, skin burns", control: "Gloves, ventilation/extraction" },
        { substance: "Lead Solder", hazard: "Lead exposure (ingestion/fumes)", control: "Wash hands, do not eat/smoke, ventilation" },
        { substance: "Drain Cleaner (Sulfuric Acid)", hazard: "Severe burns, toxic fumes", control: "Face shield, heavy duty gloves, ventilation" },
        { substance: "Glyphosate (Weedkiller)", hazard: "Eye/skin irritation", control: "Gloves, coveralls, face shield" },
        { substance: "Rat Poison (Rodenticide)", hazard: "Toxic if ingested", control: "Secure bait boxes, gloves" },
        { substance: "Lead-Acid Battery", hazard: "Sulfuric acid burns, hydrogen gas", control: "Gloves, goggles, ventilation" }
    ]
};
