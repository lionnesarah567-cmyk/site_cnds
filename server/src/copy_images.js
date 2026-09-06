import fs from 'fs';
import path from 'path';

const sourceDir = 'C:/Users/DEV/.gemini/antigravity/brain/4fe88361-6a39-4232-8db5-2ed4e5836177/.user_uploaded';
const targetDir = 'e:/Project/site_cnds/client/public/images/bureau';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const mapping = [
  { src: 'media_1788689185938.jpg', dest: 'sylvestre_ntibantunganya.jpg' },
  { src: 'media_1788689186266.jpg', dest: 'celestin_nsavyimana.jpg' },
  { src: 'media_1788689185924.jpg', dest: 'theodore_kamwenubusa.jpg' },
  { src: 'media_1788689186007.jpg', dest: 'emmanuel_ngomirakiza.jpg' },
  { src: 'media_1788689185939.jpg', dest: 'athanase_mbonabuca.jpg' },
  { src: 'media_1788689185939.jpg', dest: 'charles_nduwimana.jpg' },
];

for (const item of mapping) {
  const srcPath = path.join(sourceDir, item.src);
  const destPath = path.join(targetDir, item.dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${item.src} -> ${item.dest}`);
  } else {
    console.warn(`Source file ${srcPath} not found!`);
  }
}

// Copy Logo
const logoSrc = path.join(sourceDir, 'media_1788691452811.jpg');
const logoDest = 'e:/Project/site_cnds/client/public/images/logo-cnds.jpg';
if (fs.existsSync(logoSrc)) {
  fs.copyFileSync(logoSrc, logoDest);
  console.log('Logo copied to client/public/images/logo-cnds.jpg');
}
console.log('All images copied successfully.');
