"use client";

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <div className="rs-fade-slide-in">
            {children}
        </div>
    );
}
