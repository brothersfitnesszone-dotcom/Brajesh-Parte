"use client";

import { useEffect, useRef, useState } from "react";

interface TextScrambleProps {
    children: string;
    className?: string;
    speed?: number; // Speed in ms per character swap
}

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

export default function TextScramble({ children, className = "", speed = 30 }: TextScrambleProps) {
    const [displayText, setDisplayText] = useState(children);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const scramble = () => {
        let iteration = 0;

        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            setDisplayText((prev) =>
                children
                    .split("")
                    .map((char, index) => {
                        if (index < iteration) {
                            return children[index];
                        }
                        return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
                    })
                    .join("")
            );

            if (iteration >= children.length) {
                if (intervalRef.current) clearInterval(intervalRef.current);
            }

            iteration += 1 / 3; // Slow down the reveal
        }, speed);
    };

    return (
        <span
            className={`inline-block cursor-pointer ${className}`}
            onMouseEnter={scramble}
        >
            {displayText}
        </span>
    );
}
