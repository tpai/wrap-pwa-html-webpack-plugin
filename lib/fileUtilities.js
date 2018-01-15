const fs = require('fs');

const matchFiles = (files, ext) => {
  const regex = new RegExp(`\\.${ext}$`)
  return files.filter(file => {
    return file.match(regex) !== null && file !== 'sw.js';
  });
};

const readFiles = (path, ext) => {
  const files = fs.readdirSync(path);
  return matchFiles(files, ext);
};

module.exports = {
  readFiles,
  matchFiles
};
