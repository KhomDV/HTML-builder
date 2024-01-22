const path = require('path');
const fs = require('fs');

const pathFolder = path.join(__dirname, '//secret-folder');

fs.readdir(pathFolder, (err, files) => {
  if (err) throw err;
  files.forEach((e) => {
    fs.stat(path.join(pathFolder, `//${e}`), (err, stats) => {
      if (err) throw err;
      if (stats.isFile()) {
        console.log(
          `${e.split('.')[0]} - ${e.split('.')[1]} - ${stats.size / 1024}kb`,
        );
      }
    });
  });
});
