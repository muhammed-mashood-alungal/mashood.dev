// Renders scripts/icon.svg into the PNG/ICO favicon set.
// Run with `npm run icons` after editing the SVG.
import { readFile, writeFile, copyFile } from "node:fs/promises";
import sharp from "sharp";

const svg = await readFile(new URL("./icon.svg", import.meta.url));
const png = (size) =>
  sharp(svg, { density: 72 * (size / 32) * 2 })
    .resize(size, size)
    .png()
    .toBuffer();

// ICO container holding PNG-encoded images (supported by all modern browsers).
function toIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const entries = [];
  let offset = 6 + 16 * images.length;
  for (const { size, data } of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(entry);
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

const ico = toIco([
  { size: 16, data: await png(16) },
  { size: 32, data: await png(32) },
  { size: 48, data: await png(48) },
]);

// Apple touch icon: no rounded corners (iOS applies its own mask).
const appleSvg = Buffer.from(svg.toString().replace('rx="7"', 'rx="0"'));
const apple = await sharp(appleSvg, { density: 72 * (180 / 32) * 2 })
  .resize(180, 180)
  .png()
  .toBuffer();

await Promise.all([
  writeFile("src/app/favicon.ico", ico),
  writeFile("src/app/apple-icon.png", apple),
  writeFile("public/icon-192.png", await png(192)),
  writeFile("public/icon-512.png", await png(512)),
  copyFile(new URL("./icon.svg", import.meta.url), "src/app/icon.svg"),
]);
console.log("Icons written.");
