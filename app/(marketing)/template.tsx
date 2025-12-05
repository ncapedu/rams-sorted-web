"use client";

import { useEffect } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
    // Ensure scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
            {children}
        </div>
    );
}
