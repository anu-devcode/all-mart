import fs from "node:fs";
import path from "node:path";

const outDir = path.join(process.cwd(), "public", "images");
fs.mkdirSync(outDir, { recursive: true });

const products = [
  { file: "banana.png", label: "Banana", bg: "#FFF3D6", accent: "#F5B800" },
  { file: "apple.png", label: "Apple", bg: "#FFE5E5", accent: "#E53935" },
  { file: "oil.png", label: "Oil", bg: "#FFF8E7", accent: "#FFB300" },
  { file: "tide.png", label: "Tide", bg: "#E3F2FD", accent: "#1E88E5" },
  { file: "shampoo.png", label: "Shampoo", bg: "#F3E5F5", accent: "#8E24AA" },
  { file: "juice.png", label: "Juice", bg: "#FFF3E0", accent: "#FB8C00" },
  { file: "soda.png", label: "Soda", bg: "#E8F5E9", accent: "#43A047" },
  { file: "chips.png", label: "Chips", bg: "#FFFDE7", accent: "#F9A825" },
  { file: "chocolate.png", label: "Chocolate", bg: "#EFEBE9", accent: "#6D4C41" },
  { file: "bread.png", label: "Bread", bg: "#FFF8E1", accent: "#D4A017" },
  { file: "margarine.png", label: "Margarine", bg: "#FFFDE7", accent: "#FBC02D" },
  { file: "beans.png", label: "Beans", bg: "#E8F5E9", accent: "#2E7D32" },
];

function svgFor({ label, bg, accent }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bg}"/>
      <stop offset="100%" stop-color="#ffffff"/>
    </linearGradient>
  </defs>
  <rect width="640" height="640" fill="url(#g)"/>
  <circle cx="320" cy="280" r="120" fill="${accent}" opacity="0.9"/>
  <rect x="180" y="430" width="280" height="56" rx="28" fill="#111111" opacity="0.85"/>
  <text x="320" y="468" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" fill="#ffffff">${label}</text>
  <text x="320" y="560" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="600" fill="#FF6A00">ALL MART</text>
</svg>`;
}

for (const p of products) {
  const svgPath = path.join(outDir, p.file.replace(".png", ".svg"));
  fs.writeFileSync(svgPath, svgFor(p), "utf8");
  // Keep .png URLs working by also writing SVG content with .png name
  // is invalid for next/image — instead update mock data to .svg.
  console.log("wrote", path.basename(svgPath));
}

console.log("Done. Update mock imageUrl paths to .svg");
