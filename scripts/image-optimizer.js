#!/usr/bin/env node

/**
 * Image Optimization Script for CILG Website
 * This script helps optimize images for web use
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const ASSETS_DIR = path.join(__dirname, '../src/assets');
const PUBLIC_DIR = path.join(__dirname, '../public/lovable-uploads');

// Image size recommendations
const SIZE_RECOMMENDATIONS = {
  'hero-image.jpg': { maxSize: '500KB', dimensions: '1920x1080' },
  'academic-building.jpg': { maxSize: '200KB', dimensions: '800x600' },
  'law-books.jpg': { maxSize: '200KB', dimensions: '600x400' }
};

function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return stats.size;
}

function formatFileSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

function checkImageOptimization() {
  console.log('🔍 Checking image optimization...\n');

  // Check assets directory
  if (fs.existsSync(ASSETS_DIR)) {
    console.log('📁 Checking src/assets/ directory:');
    const assetFiles = fs.readdirSync(ASSETS_DIR);
    
    assetFiles.forEach(file => {
      if (file.match(/\.(jpg|jpeg|png|gif|svg)$/i)) {
        const filePath = path.join(ASSETS_DIR, file);
        const size = getFileSize(filePath);
        const recommendation = SIZE_RECOMMENDATIONS[file];
        
        console.log(`  📸 ${file}:`);
        console.log(`     Size: ${formatFileSize(size)}`);
        
        if (recommendation) {
          console.log(`     Recommended: ${recommendation.maxSize}, ${recommendation.dimensions}`);
          if (size > parseFloat(recommendation.maxSize) * 1024) {
            console.log(`     ⚠️  File is larger than recommended size`);
          }
        }
        console.log('');
      }
    });
  }

  // Check public directory
  if (fs.existsSync(PUBLIC_DIR)) {
    console.log('📁 Checking public/lovable-uploads/ directory:');
    const publicFiles = fs.readdirSync(PUBLIC_DIR);
    
    publicFiles.forEach(file => {
      if (file.match(/\.(jpg|jpeg|png|gif|svg)$/i)) {
        const filePath = path.join(PUBLIC_DIR, file);
        const size = getFileSize(filePath);
        
        console.log(`  📸 ${file}:`);
        console.log(`     Size: ${formatFileSize(size)}`);
        
        if (size > 500 * 1024) { // 500KB
          console.log(`     ⚠️  File is larger than 500KB - consider optimizing`);
        }
        console.log('');
      }
    });
  }
}

function generateImageReport() {
  console.log('📊 Generating image report...\n');
  
  const report = {
    totalImages: 0,
    totalSize: 0,
    oversizedImages: [],
    recommendations: []
  };

  // Scan assets directory
  if (fs.existsSync(ASSETS_DIR)) {
    const assetFiles = fs.readdirSync(ASSETS_DIR);
    assetFiles.forEach(file => {
      if (file.match(/\.(jpg|jpeg|png|gif|svg)$/i)) {
        const filePath = path.join(ASSETS_DIR, file);
        const size = getFileSize(filePath);
        
        report.totalImages++;
        report.totalSize += size;
        
        const recommendation = SIZE_RECOMMENDATIONS[file];
        if (recommendation && size > parseFloat(recommendation.maxSize) * 1024) {
          report.oversizedImages.push({
            file: `src/assets/${file}`,
            size: formatFileSize(size),
            recommended: recommendation.maxSize
          });
        }
      }
    });
  }

  // Scan public directory
  if (fs.existsSync(PUBLIC_DIR)) {
    const publicFiles = fs.readdirSync(PUBLIC_DIR);
    publicFiles.forEach(file => {
      if (file.match(/\.(jpg|jpeg|png|gif|svg)$/i)) {
        const filePath = path.join(PUBLIC_DIR, file);
        const size = getFileSize(filePath);
        
        report.totalImages++;
        report.totalSize += size;
        
        if (size > 500 * 1024) {
          report.oversizedImages.push({
            file: `public/lovable-uploads/${file}`,
            size: formatFileSize(size),
            recommended: '500KB'
          });
        }
      }
    });
  }

  // Print report
  console.log(`📈 Image Report:`);
  console.log(`   Total Images: ${report.totalImages}`);
  console.log(`   Total Size: ${formatFileSize(report.totalSize)}`);
  console.log(`   Oversized Images: ${report.oversizedImages.length}`);
  
  if (report.oversizedImages.length > 0) {
    console.log('\n⚠️  Oversized Images:');
    report.oversizedImages.forEach(img => {
      console.log(`   - ${img.file}: ${img.size} (recommended: ${img.recommended})`);
    });
  }

  console.log('\n💡 Recommendations:');
  console.log('   1. Use online tools like TinyPNG or Squoosh to compress images');
  console.log('   2. Convert images to WebP format for better compression');
  console.log('   3. Use appropriate image dimensions for their display size');
  console.log('   4. Consider implementing lazy loading for better performance');
}

function showHelp() {
  console.log(`
🖼️  CILG Website Image Management Script

Usage:
  node scripts/image-optimizer.js [command]

Commands:
  check     - Check image optimization status
  report    - Generate detailed image report
  help      - Show this help message

Examples:
  node scripts/image-optimizer.js check
  node scripts/image-optimizer.js report
  node scripts/image-optimizer.js help
`);
}

// Main execution
const command = process.argv[2] || 'help';

switch (command) {
  case 'check':
    checkImageOptimization();
    break;
  case 'report':
    generateImageReport();
    break;
  case 'help':
  default:
    showHelp();
    break;
} 