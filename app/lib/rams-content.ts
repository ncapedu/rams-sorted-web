
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
    "dust_fumes": [
        { substance: "General Construction Dust", hazard: "Respiratory irritation", control: "Damping down, extraction, FFP3 masks" }
    ],
    "silica_dust": [
        { substance: "Silica Dust", hazard: "Silicosis, lung cancer", control: "On-tool extraction, water suppression, FFP3 masks" }
    ],
    "cement": [
        { substance: "Wet Cement / Concrete", hazard: "Chemical burns, dermatitis", control: "Impervious gloves, barrier cream, washing facilities" }
    ],
    "lead_exposure": [
        { substance: "Lead Paint / Dust", hazard: "Lead poisoning", control: "Specialist removal, hygiene procedures, RPE" }
    ],
    "chemical_coshh": [
        { substance: "Adhesives / Sealants", hazard: "Vapour inhalation, skin irritation", control: "Ventilation, gloves, eye protection" },
        { substance: "Cleaning Chemicals", hazard: "Skin/eye irritation", control: "Gloves, goggles, follow safety data sheet" }
    ]
};
