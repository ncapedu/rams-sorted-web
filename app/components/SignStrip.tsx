import React from "react";

interface SignStripProps {
    icons: string[];
    label?: string;
    className?: string;
}

export function SignStrip({ icons, label, className }: SignStripProps) {
    if (!icons || icons.length === 0) return null;

    // Remove duplicates
    const uniqueIcons = Array.from(new Set(icons));

    return (
        <div className={`mt-3 ${className || ""}`}>
            {label && (
                <div className="text-xs font-medium text-slate-600 mb-1">
                    {label}
                </div>
            )}
            <div className="flex flex-wrap gap-2 max-w-full">
                {uniqueIcons.map((src) => (
                    <div
                        key={src}
                        className="h-8 w-8 md:h-9 md:w-9 flex items-center justify-center rounded bg-white border border-slate-200 shadow-sm overflow-hidden flex-shrink-0"
                    >
                        <img
                            src={src}
                            alt=""
                            className="max-h-full max-w-full object-contain"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
