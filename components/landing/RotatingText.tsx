"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";

interface RotatingTextProps {
  words: string[];
  className?: string;
  interval?: number;
}

export default function RotatingText({
  words,
  className = "",
  interval = 2500,
}: RotatingTextProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const [measuredWidths, setMeasuredWidths] = useState<Record<string, number>>(
    {}
  );
  const measureRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!measureRef.current) return;
    const widths: Record<string, number> = {};
    words.forEach((word) => {
      measureRef.current!.textContent = word;
      widths[word] = measureRef.current!.offsetWidth + 16;
    });
    setMeasuredWidths(widths);
    setActiveIndex(0);
  }, [words]);

  const currentWidth = measuredWidths[words[activeIndex]] || "auto";

  const handleTextRotation = useCallback(() => {
    if (isAnimating || words.length <= 1) return;
    setIsAnimating(true);
    const nextIndex = (activeIndex + 1) % words.length;
    setActiveIndex(nextIndex);
    setTimeout(() => setIsAnimating(false), 500);
  }, [activeIndex, words, isAnimating]);

  useEffect(() => {
    if (words.length <= 1) return;
    const timer = setInterval(handleTextRotation, interval);
    return () => clearInterval(timer);
  }, [handleTextRotation, interval, words.length]);

  return (
    <>
      <span
        ref={measureRef}
        className="absolute opacity-0 pointer-events-none px-2 py-0.5 whitespace-nowrap"
        style={{ font: "inherit" }}
        aria-hidden="true"
      />
      <motion.span
        className={`inline-flex items-center justify-center bg-gray-900 text-white rounded-md px-2 py-1 overflow-hidden ${className}`}
        animate={{ width: currentWidth }}
        transition={{ width: { duration: 0.3, ease: "easeOut" } }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={activeIndex}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="inline-block"
          >
            {words[activeIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </>
  );
}
