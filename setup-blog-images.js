const fs = require('fs');
const path = require('path');

// Create necessary directories
const publicDir = path.join(__dirname, 'public');
const imagesDir = path.join(publicDir, 'images');

// Ensure directories exist
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
  console.log(`Created directory: ${imagesDir}`);
}

// Create an empty SVG with a gold gradient background and pattern
function createGoldSVG(width, height, filename, text, pattern) {
  const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f5d760" />
      <stop offset="50%" stop-color="#e6b422" />
      <stop offset="100%" stop-color="#d4af37" />
    </linearGradient>
    
    <pattern id="pattern-${pattern}" patternUnits="userSpaceOnUse" width="50" height="50" patternTransform="scale(2) rotate(0)">
      <rect width="100%" height="100%" fill="url(#gold-gradient)"/>
      ${getPattern(pattern)}
    </pattern>
    
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#000" flood-opacity="0.5"/>
    </filter>
  </defs>
  
  <rect width="${width}" height="${height}" fill="url(#pattern-${pattern})" />
  
  <rect x="0" y="0" width="${width}" height="${height}" fill="rgba(0,0,0,0.4)" />
  
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle" filter="url(#shadow)">${text}</text>
</svg>
  `.trim();

  // Save directly to public/images directory
  const outputPath = path.join(imagesDir, filename);
  fs.writeFileSync(outputPath, svg);
  console.log(`Created ${outputPath}`);
}

// Get different pattern for each image
function getPattern(type) {
  switch(type) {
    case 'bars':
      return `
        <rect width="100%" height="4" y="0" fill="#f0c419" opacity="0.3" />
        <rect width="100%" height="4" y="16" fill="#f0c419" opacity="0.3" />
        <rect width="100%" height="4" y="32" fill="#f0c419" opacity="0.3" />
        <rect width="100%" height="4" y="48" fill="#f0c419" opacity="0.3" />
      `;
    case 'dots':
      return `
        <circle cx="12" cy="12" r="6" fill="#f0c419" opacity="0.3" />
        <circle cx="36" cy="12" r="6" fill="#f0c419" opacity="0.3" />
        <circle cx="12" cy="36" r="6" fill="#f0c419" opacity="0.3" />
        <circle cx="36" cy="36" r="6" fill="#f0c419" opacity="0.3" />
      `;
    case 'waves':
      return `
        <path d="M0,10 C15,0 35,20 50,10 C65,0 85,20 100,10 L100,50 L0,50 Z" fill="#f0c419" opacity="0.2" />
      `;
    case 'coins':
    default:
      return `
        <circle cx="25" cy="25" r="20" fill="#f0c419" opacity="0.3" />
        <circle cx="25" cy="25" r="15" fill="#d4af37" opacity="0.2" />
      `;
  }
}

// Define image templates to be created
const images = [
  { width: 1200, height: 600, filename: 'gold-hero.svg', text: 'طلا در بازار جهانی', pattern: 'bars' },
  { width: 600, height: 400, filename: 'gold-news1.svg', text: 'افزایش تقاضای طلا', pattern: 'dots' },
  { width: 600, height: 400, filename: 'gold-news2.svg', text: 'تحلیل بازار طلا', pattern: 'coins' },
  { width: 600, height: 400, filename: 'gold-news3.svg', text: 'سرمایه‌گذاری در طلا', pattern: 'waves' },
  { width: 600, height: 400, filename: 'gold-news4.svg', text: 'آموزش طلا', pattern: 'bars' },
  { width: 600, height: 400, filename: 'gold-news5.svg', text: 'قیمت جهانی طلا', pattern: 'dots' }
];

// Create each image
images.forEach(image => {
  createGoldSVG(image.width, image.height, image.filename, image.text, image.pattern);
});

console.log('Blog images setup complete!');
console.log('Images are now available in the public/images directory');
console.log('Use them via: /images/[filename]'); 