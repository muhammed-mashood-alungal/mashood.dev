import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontDir = join(process.cwd(), "src/assets/fonts");
const [regular, medium] = await Promise.all([
  readFile(join(fontDir, "IBMPlexSans-Regular.ttf")),
  readFile(join(fontDir, "IBMPlexSans-Medium.ttf")),
]);

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px 88px",
        background: "#121212",
        color: "#EDEDED",
        fontFamily: "IBM Plex Sans",
      }}
    >
      <div style={{ display: "flex", fontSize: 26, color: "#A1A1A1" }}>
        {site.location.display}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ width: 56, height: 4, background: "#8FBFA0", borderRadius: 2 }} />
        <div
          style={{ marginTop: 36, fontSize: 72, fontWeight: 500, letterSpacing: -1.5 }}
        >
          {site.name}
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 34,
            color: "#A1A1A1",
            lineHeight: 1.4,
            maxWidth: 900,
          }}
        >
          {site.headline}
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 24, color: "#8FBFA0" }}>
        github.com/{site.usernames.github}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "IBM Plex Sans", data: regular, weight: 400, style: "normal" },
        { name: "IBM Plex Sans", data: medium, weight: 500, style: "normal" },
      ],
    },
  );
}
