"use client";

import { useState, useEffect, useRef } from "react";

interface TypewriterTextProps {
    text: string;
    speed?: number;
    delay?: number;
    className?: string;
    cursor?: boolean;
    startWhenVisible?: boolean;
    onComplete?: () => void;
}

export default function TypewriterText({
    text,
    speed = 30,
    delay = 0,
    className = "",
    cursor = false,
    startWhenVisible = false,
    onComplete
}: TypewriterTextProps) {
    const [displayedText, setDisplayedText] = useState("");
    const [started, setStarted] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const elementRef = useRef<HTMLSpanElement>(null);
    const hasStartedRef = useRef(false);
    const onCompleteRef = useRef(onComplete);

    // Keep onComplete ref up to date
    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        if (!startWhenVisible) {
            const startTimeout = setTimeout(() => {
                setStarted(true);
            }, delay);
            return () => clearTimeout(startTimeout);
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasStartedRef.current) {
                    hasStartedRef.current = true;
                    // Apply delay even when triggered by visibility
                    setTimeout(() => {
                        setStarted(true);
                    }, delay);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, [delay, startWhenVisible]);

    useEffect(() => {
        if (!started) return;

        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex < text.length) {
                setDisplayedText(text.slice(0, currentIndex + 1));
                currentIndex++;
            } else {
                setIsFinished(true);
                clearInterval(interval);
                if (onCompleteRef.current) onCompleteRef.current();
            }
        }, speed);

        return () => clearInterval(interval);
    }, [started, text, speed]); // Removed onComplete from dependencies

    return (
        <span ref={elementRef} className={className}>
            {displayedText}
            {cursor && !isFinished && (
                <span className="animate-pulse text-red-500">|</span>
            )}
        </span>
    );
}
