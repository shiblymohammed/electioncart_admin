/**
 * PWA Icon Generator
 * Generates all required icon sizes for the PWA
 * 
 * This script creates simple placeholder icons.
 * Replace with actual branded icons for production.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, 'public', 'icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG icon for each size
sizes.forEach(size => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="#0D1117" rx="${size * 0.15}"/>
  
  <!-- Icon Design - Shopping Cart with Checkmark -->
  <g transform="translate(${size * 0.2}, ${size * 0.2})">
    <!-- Cart -->
    <path d="M ${size * 0.1} ${size * 0.15} L ${size * 0.15} ${size * 0.35} L ${size * 0.45} ${size * 0.35} L ${size * 0.5} ${size * 0.15} Z" 
          fill="none" stroke="#58A6FF" stroke-width="${size * 0.03}" stroke-linecap="round" stroke-linejoin="round"/>
    
    <!-- Cart wheels -->
    <circle cx="${size * 0.2}" cy="${size * 0.42}" r="${size * 0.025}" fill="#58A6FF"/>
    <circle cx="${size * 0.4}" cy="${size * 0.42}" r="${size * 0.025}" fill="#58A6FF"/>
    
    <!-- Checkmark -->
    <path d="M ${size * 0.15} ${size * 0.25} L ${size * 0.25} ${size * 0.32} L ${size * 0.42} ${size * 0.18}" 
          fill="none" stroke="#3FB950" stroke-width="${size * 0.04}" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  
  <!-- Text -->
  <text x="${size * 0.5}" y="${size * 0.8}" 
        font-family="Arial, sans-serif" 
        font-size="${size * 0.12}" 
        font-weight="bold" 
        fill="#58A6FF" 
        text-anchor="middle">EC</text>
</svg>`;

  const filename = path.join(iconsDir, `icon-${size}x${size}.png`);
  
  // For now, save as SVG (you can convert to PNG using a tool like sharp or imagemagick)
  const svgFilename = path.join(iconsDir, `icon-${size}x${size}.svg`);
  fs.writeFileSync(svgFilename, svg);
  
  console.log(`Generated: icon-${size}x${size}.svg`);
});

// Generate favicon.ico placeholder (16x16 SVG)
const faviconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#0D1117" rx="4"/>
  <text x="16" y="22" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#58A6FF" text-anchor="middle">EC</text>
</svg>`;

fs.writeFileSync(path.join(__dirname, 'public', 'favicon.svg'), faviconSvg);
console.log('Generated: favicon.svg');

console.log('\n✅ Icon generation complete!');
console.log('\n📝 Note: SVG icons have been generated as placeholders.');
console.log('For production, convert these to PNG using a tool like:');
console.log('  - sharp (npm package)');
console.log('  - imagemagick');
console.log('  - Online converter (e.g., cloudconvert.com)');
console.log('\nOr replace with your branded icons.');
