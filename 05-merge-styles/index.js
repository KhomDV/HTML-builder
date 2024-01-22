const path = require('path');
const fs = require('fs');

const styleFolder = path.join(__dirname, 'styles');
const projectFolder = path.join(__dirname, 'project-dist');

let writeableStream = fs.createWriteStream(
  path.join(projectFolder, 'bundle.css'),
);

fs.readdir(styleFolder, (error, files) => {
  if (error) throw error;
  for (let file of files) {
    if (file.split('.')[1].trim() === 'css') {
      let readableStream = fs.createReadStream(
        path.join(styleFolder, file),
        'utf8',
      );
      readableStream.on('data', function (chunk) {
        writeableStream.write(chunk + '\n');
      });
    }
  }
});
