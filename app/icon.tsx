import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#7c22d5",
          borderRadius: "6px",
        }}
      >
        <span
          style={{
            color: "#ffffff",
            fontSize: "20px",
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          U
        </span>
      </div>
    ),
    { ...size }
  );
}
