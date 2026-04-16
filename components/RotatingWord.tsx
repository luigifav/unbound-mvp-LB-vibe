"use client";

import { useState, useEffect } from "react";

const WORDS = ["barato", "seguro", "rápido", "fácil"];

export default function RotatingWord() {
  const [index, setIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % WORDS.length);
      setAnimKey((prev) => prev + 1);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      key={animKey}
      className="inline-block relative bg-white text-black px-4 py-0.5 rounded-lg overflow-hidden align-baseline"
      style={{ animation: "rotateWordIn 2.2s linear both" }}
    >
      <span className="inline-block">{WORDS[index]}</span>
    </span>
  );
}
