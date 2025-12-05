"use client";

import { useState, useEffect } from "react";

interface TypewriterTextProps {
    text: string;
    speed?: number;
    delay?: number;
    className?: string;
    cursor?: boolean;
}

export default function TypewriterText({
    text,
    speed = 30,
    delay = 0,
    className = "",
    cursor = false
}: TypewriterTextProps) {
    const [displayedText, setDisplayedText] = useState("");
    const [started, setStarted] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        setDisplayedText("");
        setStarted(false);
        setIsFinished(false);

        const startTimeout = setTimeout(() => {
            setStarted(true);
        }, delay);

        return () => clearTimeout(startTimeout);
    }, [delay, text]);

    useEffect(() => {
        if (!started) return;

        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex < text.length) {
                // Use slice to ensure we always render the correct substring
                // This avoids issues with double-rendering or state desync
                setDisplayedText(text.slice(0, currentIndex + 1));
                currentIndex++;
            } else {
                setIsFinished(true);
                clearInterval(interval);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [started, text, speed]);

    return (
        <span className={className}>
            {displayedText}
            {cursor && !isFinished && (
                <span className="animate-pulse text-red-500">|</span>
            )}
        </span>
    );
}
