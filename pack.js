const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Running npm run build...');
execSync('npm run build', { stdio: 'inherit' });

console.log('Copying static files...');
const standalonePath = path.join(__dirname, '.next', 'standalone');
const staticPath = path.join(__dirname, '.next', 'static');
const publicPath = path.join(__dirname, 'public');

// Copy public directory
if (fs.existsSync(publicPath)) {
  execSync(`xcopy /E /I /Y "public" ".next\\standalone\\public"`);
}

// Copy static directory
if (fs.existsSync(staticPath)) {
  execSync(`xcopy /E /I /Y ".next\\static" ".next\\standalone\\.next\\static"`);
}

console.log('Creating deploy.tar.gz...');
// Use tar command which is available in modern Windows 10/11
execSync('tar -czf deploy.tar.gz -C .next/standalone .', { stdio: 'inherit' });

console.log('deploy.tar.gz has been created successfully!');
