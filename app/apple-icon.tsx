import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          borderRadius: "36px",
        }}
      >
        <span
          style={{
            color: "#ffffff",
            fontSize: "110px",
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
