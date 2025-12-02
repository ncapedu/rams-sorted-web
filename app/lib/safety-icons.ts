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

    // 1. Fire / Explosion / Gas
    if (lower.includes("explosive") || lower.includes("explosion")) return "Explosive";
    if (lower.includes("flammable") || lower.includes("fire") || lower.includes("hot work") || lower.includes("ignition")) return "Flammable";
    if (lower.includes("oxidising") || lower.includes("oxidizer")) return "Oxidising";
    if (lower.includes("gas") || lower.includes("pressure")) return "GasUnderPressure";

    // 2. Health / Long-term / Toxic
    if (lower.includes("health") || lower.includes("toxic") || lower.includes("carcinogen") || lower.includes("cancer")) return "HealthHazard";
    if (lower.includes("asbestos") || lower.includes("silica") || lower.includes("dust") || lower.includes("fume") || lower.includes("lead")) return "HealthHazard";
    if (lower.includes("biological") || lower.includes("bacteria") || lower.includes("virus")) return "HealthHazard";
    if (lower.includes("noise") || lower.includes("vibration") || lower.includes("havs")) return "HealthHazard";
    if (lower.includes("cement") || lower.includes("damp")) return "Corrosive"; // Cement is corrosive

    // 3. Corrosive
    if (lower.includes("corrosive") || lower.includes("burns") || lower.includes("acid")) return "Corrosive";

    // 4. Environmental
    if (lower.includes("environment") || lower.includes("aquatic") || lower.includes("water") || lower.includes("weather")) return "Environmental";

    // 5. Physical / General Warning (Map to Irritant/Exclamation)
    // Electricity, Heights, Slips, Manual Handling, Machinery, etc.
    if (lower.includes("irritant") || lower.includes("irritation")) return "Irritant";
    if (lower.includes("electric") || lower.includes("voltage") || lower.includes("live")) return "Irritant";
    if (lower.includes("height") || lower.includes("fall") || lower.includes("ladder") || lower.includes("scaffold") || lower.includes("fragile")) return "Irritant";
    if (lower.includes("manual") || lower.includes("lifting") || lower.includes("handling")) return "Irritant";
    if (lower.includes("slip") || lower.includes("trip")) return "Irritant";
    if (lower.includes("vehicle") || lower.includes("traffic") || lower.includes("plant") || lower.includes("machinery") || lower.includes("crane") || lower.includes("mewp")) return "Irritant";
    if (lower.includes("sharp") || lower.includes("cut") || lower.includes("glass")) return "Irritant";
    if (lower.includes("confined")) return "Irritant"; // Or HealthHazard? Irritant implies "Warning"
    if (lower.includes("structural") || lower.includes("collapse") || lower.includes("excavation")) return "Irritant";
    if (lower.includes("lone") || lower.includes("security") || lower.includes("public")) return "Irritant";
    if (lower.includes("stored energy") || lower.includes("isolation")) return "Irritant";
    if (lower.includes("tool")) return "Irritant";

    return "Irritant"; // Default fallback to Exclamation Mark for any identified hazard
}

// Helper to convert SVG data URI to PNG data URI (Client-side only)
export function svgToPngDataUri(svgDataUri: string, width: number = 64, height: number = 64): Promise<string> {
    return new Promise((resolve, reject) => {
        if (typeof window === "undefined") {
            // Server-side fallback: return original SVG (Word/PDF might fail but won't crash)
            resolve(svgDataUri);
            return;
        }

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                reject(new Error("Failed to get canvas context"));
                return;
            }
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL("image/png"));
        };
        img.onerror = (err) => {
            console.error("Failed to load SVG for conversion", err);
            // Fallback to original SVG if conversion fails
            resolve(svgDataUri);
        };
        img.src = svgDataUri;
    });
}
