export const GHS_SVGS = {
    Corrosive: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <path d="M50 5 L95 50 L50 95 L5 50 Z" fill="white" stroke="#d22630" stroke-width="4"/>
  <path d="M30 60 H40 V40 H30 Z M60 60 H70 V40 H60 Z" fill="black"/>
  <path d="M35 30 V40 M65 30 V40" stroke="black" stroke-width="2"/>
  <path d="M25 70 H45 M55 70 H75" stroke="black" stroke-width="2"/>
</svg>`,
    Environmental: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <path d="M50 5 L95 50 L50 95 L5 50 Z" fill="white" stroke="#d22630" stroke-width="4"/>
  <path d="M30 60 Q40 50 50 60 Q60 50 70 60" stroke="black" stroke-width="2" fill="none"/>
  <path d="M50 40 V60 M40 50 L50 40 L60 50" stroke="black" stroke-width="2" fill="none"/>
  <path d="M30 70 H70" stroke="black" stroke-width="2"/>
</svg>`,
    Irritant: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <path d="M50 5 L95 50 L50 95 L5 50 Z" fill="white" stroke="#d22630" stroke-width="4"/>
  <path d="M50 30 V60" stroke="black" stroke-width="8" stroke-linecap="round"/>
  <circle cx="50" cy="75" r="5" fill="black"/>
</svg>`,
    Explosive: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <path d="M50 5 L95 50 L50 95 L5 50 Z" fill="white" stroke="#d22630" stroke-width="4"/>
  <circle cx="50" cy="50" r="10" fill="black"/>
  <path d="M50 30 V40 M50 60 V70 M30 50 H40 M60 50 H70" stroke="black" stroke-width="2"/>
  <path d="M35 35 L42 42 M65 35 L58 42 M35 65 L42 58 M65 65 L58 58" stroke="black" stroke-width="2"/>
</svg>`,
    Flammable: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <path d="M50 5 L95 50 L50 95 L5 50 Z" fill="white" stroke="#d22630" stroke-width="4"/>
  <path d="M50 75 Q30 60 50 30 Q70 60 50 75" fill="black"/>
  <path d="M50 75 V80" stroke="black" stroke-width="2"/>
</svg>`,
    GasUnderPressure: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <path d="M50 5 L95 50 L50 95 L5 50 Z" fill="white" stroke="#d22630" stroke-width="4"/>
  <path d="M40 30 H60 V40 H40 Z" fill="black"/>
  <path d="M35 40 H65 V80 H35 Z" fill="black"/>
</svg>`,
    HealthHazard: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <path d="M50 5 L95 50 L50 95 L5 50 Z" fill="white" stroke="#d22630" stroke-width="4"/>
  <path d="M50 35 L60 45 L50 55 L40 45 Z" fill="black"/>
  <path d="M50 55 V75 M40 45 H25 M60 45 H75" stroke="black" stroke-width="4" stroke-linecap="round"/>
</svg>`,
    Oxidising: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <path d="M50 5 L95 50 L50 95 L5 50 Z" fill="white" stroke="#d22630" stroke-width="4"/>
  <circle cx="50" cy="55" r="10" stroke="black" stroke-width="4" fill="none"/>
  <path d="M50 30 V45" stroke="black" stroke-width="4"/>
  <path d="M30 65 H70" stroke="black" stroke-width="2"/>
</svg>`
};

export const PPE_SVGS = {
    Coveralls: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <circle cx="50" cy="50" r="48" fill="#005eb8"/>
  <path d="M35 30 H65 V45 L75 55 V80 H60 V60 H40 V80 H25 V55 L35 45 V30 Z" stroke="white" stroke-width="4" fill="none" stroke-linejoin="round"/>
  <path d="M50 30 V60" stroke="white" stroke-width="2"/>
</svg>`,
    EyeProtection: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <circle cx="50" cy="50" r="48" fill="#005eb8"/>
  <path d="M25 50 Q35 40 50 50 Q65 40 75 50" stroke="white" stroke-width="6" fill="none" stroke-linecap="round"/>
  <circle cx="35" cy="50" r="12" stroke="white" stroke-width="4" fill="none"/>
  <circle cx="65" cy="50" r="12" stroke="white" stroke-width="4" fill="none"/>
  <path d="M15 45 L23 50 M85 45 L77 50" stroke="white" stroke-width="4" stroke-linecap="round"/>
</svg>`,
    Gloves: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <circle cx="50" cy="50" r="48" fill="#005eb8"/>
  <path d="M35 75 V45 Q35 35 45 35 Q55 35 55 45 V65 M55 45 V40 Q55 30 65 30 Q75 30 75 40 V75" stroke="white" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M35 75 H75" stroke="white" stroke-width="6" stroke-linecap="round"/>
</svg>`,
    HardHat: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <circle cx="50" cy="50" r="48" fill="#005eb8"/>
  <path d="M20 60 H80 M25 60 Q25 30 50 30 Q75 30 75 60" stroke="white" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M45 30 V60" stroke="white" stroke-width="2"/>
</svg>`,
    HiVis: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <circle cx="50" cy="50" r="48" fill="#005eb8"/>
  <path d="M30 30 H70 V80 H30 Z" stroke="white" stroke-width="4" fill="none" stroke-linejoin="round"/>
  <path d="M30 45 H70 M45 30 V80 M55 30 V80" stroke="white" stroke-width="2"/>
</svg>`,
    Respirator: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <circle cx="50" cy="50" r="48" fill="#005eb8"/>
  <path d="M30 45 Q50 25 70 45 V65 Q50 80 30 65 Z" stroke="white" stroke-width="4" fill="none" stroke-linejoin="round"/>
  <path d="M35 50 H65 M40 60 H60" stroke="white" stroke-width="4" stroke-linecap="round"/>
  <circle cx="35" cy="60" r="3" fill="white"/>
  <circle cx="65" cy="60" r="3" fill="white"/>
</svg>`,
    SafetyFootwear: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <circle cx="50" cy="50" r="48" fill="#005eb8"/>
  <path d="M25 65 L25 45 Q25 35 45 35 H65 Q75 35 75 55 V75 H25 Z" stroke="white" stroke-width="4" fill="none" stroke-linejoin="round"/>
  <path d="M25 75 H75" stroke="white" stroke-width="4" stroke-linecap="round"/>
  <path d="M65 35 V75" stroke="white" stroke-width="2"/>
</svg>`
};
