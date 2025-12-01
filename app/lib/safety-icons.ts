export type PpeType =
    | "EyeProtection"
    | "Gloves"
    | "Respirator"
    | "Coveralls"
    | "SafetyFootwear"
    | "HiVis"
    | "HardHat";

export const PPE_ICON_MAP: Record<PpeType, string> = {
    EyeProtection: "/icons/ppe/ppe-eye-protection.svg",
    Gloves: "/icons/ppe/ppe-gloves.svg",
    Respirator: "/icons/ppe/ppe-respirator.svg",
    Coveralls: "/icons/ppe/ppe-coveralls.svg",
    SafetyFootwear: "/icons/ppe/ppe-safety-footwear.svg",
    HiVis: "/icons/ppe/ppe-hi-vis.svg",
    HardHat: "/icons/ppe/ppe-hard-hat.svg",
};

export type HazardClass =
    | "Corrosive"
    | "Flammable"
    | "Irritant"
    | "HealthHazard"
    | "Explosive"
    | "Oxidising"
    | "GasUnderPressure"
    | "Environmental";

export const GHS_ICON_MAP: Record<HazardClass, string> = {
    Corrosive: "/icons/ghs/ghs-corrosive.svg",
    Flammable: "/icons/ghs/ghs-flammable.svg",
    Irritant: "/icons/ghs/ghs-exclamation.svg",
    HealthHazard: "/icons/ghs/ghs-health-hazard.svg",
    Explosive: "/icons/ghs/ghs-explosive.svg",
    Oxidising: "/icons/ghs/ghs-oxidising.svg",
    GasUnderPressure: "/icons/ghs/ghs-gas-cylinder.svg",
    Environmental: "/icons/ghs/ghs-environment.svg",
};

// Fuzzy matching helpers
export function mapStringToPpeType(input: string): PpeType | null {
    const lower = input.toLowerCase();
    if (lower.includes("eye") || lower.includes("glasses") || lower.includes("goggles")) return "EyeProtection";
    if (lower.includes("glove") || lower.includes("hand")) return "Gloves";
    if (lower.includes("mask") || lower.includes("respirator") || lower.includes("ffp3")) return "Respirator";
    if (lower.includes("coverall") || lower.includes("overall") || lower.includes("suit")) return "Coveralls";
    if (lower.includes("boot") || lower.includes("shoe") || lower.includes("foot")) return "SafetyFootwear";
    if (lower.includes("hi-vis") || lower.includes("vest") || lower.includes("jacket")) return "HiVis";
    if (lower.includes("hat") || lower.includes("helmet")) return "HardHat";
    return null;
}

export function mapStringToHazardClass(input: string): HazardClass | null {
    const lower = input.toLowerCase();
    if (lower.includes("corrosive") || lower.includes("burns")) return "Corrosive";
    if (lower.includes("flammable") || lower.includes("fire")) return "Flammable";
    if (lower.includes("irritant") || lower.includes("irritation")) return "Irritant";
    if (lower.includes("health") || lower.includes("toxic") || lower.includes("carcinogen")) return "HealthHazard";
    if (lower.includes("explosive") || lower.includes("explosion")) return "Explosive";
    if (lower.includes("oxidising") || lower.includes("oxidizer")) return "Oxidising";
    if (lower.includes("gas") || lower.includes("pressure")) return "GasUnderPressure";
    if (lower.includes("environment") || lower.includes("aquatic")) return "Environmental";
    return null;
}
