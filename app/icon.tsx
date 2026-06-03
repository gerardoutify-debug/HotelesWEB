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
          background: "#0a0c0f",
          borderRadius: "6px",
        }}
      >
        <span
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "20px",
            fontWeight: "300",
            color: "#c9a96e",
            lineHeight: 1,
          }}
        >
          H
        </span>
      </div>
    ),
    { width: 32, height: 32 }
  );
}
