/**
 * Convert SVG icons to PNG format
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, 'public', 'icons');

async function convertIcons() {
  console.log('Converting SVG icons to PNG...\n');
  
  for (const size of sizes) {
    const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
    const pngPath = path.join(iconsDir, `icon-${size}x${size}.png`);
    
    try {
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(pngPath);
      
      console.log(`✅ Converted: icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`❌ Error converting icon-${size}x${size}:`, error.message);
    }
  }
  
  // Convert favicon
  const faviconSvgPath = path.join(__dirname, 'public', 'favicon.svg');
  const faviconIcoPath = path.join(__dirname, 'public', 'favicon.ico');
  
  try {
    await sharp(faviconSvgPath)
      .resize(32, 32)
      .png()
      .toFile(faviconIcoPath);
    
    console.log('✅ Converted: favicon.ico');
  } catch (error) {
    console.error('❌ Error converting favicon:', error.message);
  }
  
  console.log('\n✅ All icons converted successfully!');
}

convertIcons().catch(console.error);
