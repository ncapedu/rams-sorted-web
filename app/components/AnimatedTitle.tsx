"use client";

import React from "react";

export default function AnimatedTitle({ text }: { text: string }) {
    const isRS = text.startsWith("RS");

    return (
        <span className="font-[family-name:var(--font-archivo-black)] flex items-baseline">
            {text.split("").map((char, i) => {
                // Special styling for the 'S' in "RS"
                const isS = isRS && i === 1;

                return (
                    <span
                        key={i}
                        style={{
                            animation: "colorCycle 3s infinite",
                            animationDelay: `${i * 0.1}s`,
                            // Apply special styling if it's the 'S'
                            fontSize: isS ? "0.65em" : undefined,
                            transform: isS ? "translateY(0.15em)" : undefined,
                            display: isS ? "inline-block" : undefined,
                            marginLeft: isS ? "1px" : undefined,
                        }}
                    >
                        {char === " " ? "\u00A0" : char}
                    </span>
                );
            })}
        </span>
    );
}
