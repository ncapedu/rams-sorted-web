"use client";

import React, { useState, useEffect } from "react";

interface TypewriterTextProps {
    messages: string[];
    typingSpeed?: number;
    deletingSpeed?: number;
    pauseDuration?: number;
    loop?: boolean;
    className?: string;
    hideCursorOnComplete?: boolean;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
    messages,
    typingSpeed = 50,
    deletingSpeed = 30,
    pauseDuration = 2000,
    loop = true,
    className = "",
    hideCursorOnComplete = false,
}) => {
    const [currentText, setCurrentText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [delta, setDelta] = useState(typingSpeed);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        // Initialize with random index on mount if looping, else 0
        setCurrentIndex(loop ? Math.floor(Math.random() * messages.length) : 0);
        setIsFinished(false);
    }, [loop, messages.length]);

    useEffect(() => {
        if (isFinished) return;

        let ticker = setTimeout(() => {
            tick();
        }, delta);

        return () => clearTimeout(ticker);
    }, [currentText, isDeleting, currentIndex, delta, loop, isFinished]);

    const tick = () => {
        const fullText = messages[currentIndex];
        const updatedText = isDeleting
            ? fullText.substring(0, currentText.length - 1)
            : fullText.substring(0, currentText.length + 1);

        setCurrentText(updatedText);

        if (isDeleting) {
            setDelta(deletingSpeed);
        } else {
            setDelta(typingSpeed);
        }

        if (!isDeleting && updatedText === fullText) {
            if (!loop) {
                setIsFinished(true);
                return; // Stop here if not looping
            }
            setDelta(pauseDuration);
            setIsDeleting(true);
        } else if (isDeleting && updatedText === "") {
            setIsDeleting(false);
            // Pick a random next index that is different from the current one
            let nextIndex = Math.floor(Math.random() * messages.length);
            if (messages.length > 1) {
                while (nextIndex === currentIndex) {
                    nextIndex = Math.floor(Math.random() * messages.length);
                }
            }
            setCurrentIndex(nextIndex);
            setDelta(500);
        }
    };

    const showCursor = !hideCursorOnComplete || !isFinished;

    return (
        <span className={`inline-block min-h-[1.5em] ${className}`}>
            {currentText}
            {showCursor && (
                <span className="animate-pulse ml-1 text-red-500 font-bold">|</span>
            )}
        </span>
    );
};

export default TypewriterText;
