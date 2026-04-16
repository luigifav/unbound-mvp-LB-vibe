"use client";

import { useState } from "react";

const C = {
  purple:      "#9523ef",
  purpleHover: "#7a1bc9",
  white:       "#ffffff",
};

const font = "'Red Hat Display', -apple-system, BlinkMacSystemFont, sans-serif";

interface LoadingButtonProps {
  label: string;
  loadingLabel: string;
  isLoading: boolean;
  onClick: () => void;
  fullWidth?: boolean;
}

export default function LoadingButton({
  label,
  loadingLabel,
  isLoading,
  onClick,
  fullWidth = false,
}: LoadingButtonProps) {
  const [hovered, setHovered] = useState(false);

  const bgColor = isLoading
    ? "rgba(149,35,239,0.5)"
    : hovered
    ? C.purpleHover
    : C.purple;

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:       "relative",
        width:          fullWidth ? "100%" : "auto",
        padding:        "14px 28px",
        background:     bgColor,
        border:         "none",
        borderRadius:   "10px",
        color:          C.white,
        fontFamily:     font,
        fontWeight:     900,
        fontSize:       "14px",
        letterSpacing:  "0.02em",
        cursor:         isLoading ? "not-allowed" : "pointer",
        display:        "inline-flex",
        alignItems:     "center",
        justifyContent: "center",
        gap:            "8px",
        transition:     "background 0.2s",
        overflow:       "hidden",
      }}
    >
      {/* Shimmer effect */}
      {!isLoading && (
        <span
          style={{
            position:    "absolute",
            top:         0,
            left:        0,
            width:       "60%",
            height:      "100%",
            background:  "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
            animation:   "shimmerSlide 3s linear infinite",
            pointerEvents: "none",
          }}
        />
      )}
      {isLoading ? (
        <>
          <div style={{
            width:        "14px",
            height:       "14px",
            border:       "2px solid rgba(255,255,255,0.3)",
            borderTopColor: "#fff",
            borderRadius: "50%",
            animation:    "spin 0.7s linear infinite",
            flexShrink:   0,
          }} />
          {loadingLabel}
        </>
      ) : (
        label
      )}
    </button>
  );
}
