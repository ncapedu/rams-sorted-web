import { GHS_SVGS, PPE_SVGS } from "./svg-icons";

// Helper for universal base64 encoding
const toBase64 = (str: string) => {
    if (typeof window === "undefined") {
        return Buffer.from(str).toString("base64");
    }
    return window.btoa(str);
};

const svgToDataUri = (svg: string) => `data:image/svg+xml;base64,${toBase64(svg)}`;

export type PpeType =
    | "EyeProtection"
    | "Gloves"
    | "Respirator"
    | "Coveralls"
    | "SafetyFootwear"
    | "HiVis"
    | "HardHat";

export const PPE_ICON_MAP: Record<PpeType, string> = {
    EyeProtection: svgToDataUri(PPE_SVGS.EyeProtection),
    Gloves: svgToDataUri(PPE_SVGS.Gloves),
    Respirator: svgToDataUri(PPE_SVGS.Respirator),
    Coveralls: svgToDataUri(PPE_SVGS.Coveralls),
    SafetyFootwear: svgToDataUri(PPE_SVGS.SafetyFootwear),
    HiVis: svgToDataUri(PPE_SVGS.HiVis),
    HardHat: svgToDataUri(PPE_SVGS.HardHat),
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
    Corrosive: svgToDataUri(GHS_SVGS.Corrosive),
    Flammable: svgToDataUri(GHS_SVGS.Flammable),
    Irritant: svgToDataUri(GHS_SVGS.Irritant),
    HealthHazard: svgToDataUri(GHS_SVGS.HealthHazard),
    Explosive: svgToDataUri(GHS_SVGS.Explosive),
    Oxidising: svgToDataUri(GHS_SVGS.Oxidising),
    GasUnderPressure: svgToDataUri(GHS_SVGS.GasUnderPressure),
    Environmental: svgToDataUri(GHS_SVGS.Environmental),
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
