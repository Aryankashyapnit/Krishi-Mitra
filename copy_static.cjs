const fs = require('fs');
const path = require('path');

function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  if (fs.lstatSync(source).isDirectory()) {
    const files = fs.readdirSync(source);
    files.forEach((file) => {
      const curSource = path.join(source, file);
      const curTarget = path.join(target, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, curTarget);
      } else {
        fs.copyFileSync(curSource, curTarget);
      }
    });
  }
}

// Copy static_frontend folder to dist/static_frontend
const src = path.join(__dirname, 'static_frontend');
const dest = path.join(__dirname, 'dist', 'static_frontend');

if (fs.existsSync(src)) {
  copyFolderRecursiveSync(src, dest);
  console.log('Successfully copied static_frontend to dist/static_frontend for Vercel deployment.');
} else {
  console.log('static_frontend directory not found.');
}
