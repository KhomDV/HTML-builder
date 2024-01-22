const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

const distFolder = path.join(__dirname, 'project-dist');
const assetsFolder = path.join(__dirname, 'assets');
const distAssetsFolder = path.join(distFolder, 'assets');
const styleFolder = path.join(__dirname, 'styles');
const componentsFolder = path.join(__dirname, 'components');

async function clearFolder(folder) {
  try {
    let files = await fsPromises.readdir(folder);
    for (let file of files) {
      let pathFile = path.join(folder, file);
      let statFile = await fsPromises.stat(pathFile);
      if (statFile.isFile()) {
        await fsPromises.unlink(pathFile);
      } else {
        await clearFolder(pathFile);
        await fsPromises.rmdir(pathFile);
      }
    }
  } catch (error) {
    console.error(`Unable to empty folder: ${error}`);
  }
}

async function copyDir(copyFolder, newFolder) {
  try {
    await fsPromises.mkdir(newFolder, { recursive: true });
    let files = await fsPromises.readdir(copyFolder);
    for (let file of files) {
      let pathFile = path.join(copyFolder, file);
      let statFile = await fsPromises.stat(pathFile);
      if (statFile.isFile()) {
        await fsPromises.copyFile(
          path.join(copyFolder, file),
          path.join(newFolder, file),
        );
      } else {
        await copyDir(path.join(copyFolder, file), path.join(newFolder, file));
      }
    }
  } catch (error) {
    console.error(`Unable to copy folder: ${error}`);
  }
}

async function buildPage() {
  try {
    await fsPromises.mkdir(distFolder, { recursive: true });
    await clearFolder(distFolder);

    await copyDir(assetsFolder, distAssetsFolder);

    let writeableStreamCSS = fs.createWriteStream(
      path.join(distFolder, 'style.css'),
    );
    let filesCSS = await fsPromises.readdir(styleFolder);
    for (let file of filesCSS) {
      if (file.split('.')[1].trim() === 'css') {
        let readableStream = fs.createReadStream(
          path.join(styleFolder, file),
          'utf8',
        );
        readableStream.on('data', function (chunk) {
          writeableStreamCSS.write(chunk + '\n');
        });
      }
    }

    await fsPromises.copyFile(
      path.join(__dirname, 'template.html'),
      path.join(distFolder, 'index.html'),
    );

    let textHTML = await fsPromises.readFile(
      path.join(distFolder, 'index.html'),
      'utf8',
    );
    let filesHTML = await fsPromises.readdir(componentsFolder);
    for (let file of filesHTML) {
      if (file.split('.')[1].trim() === 'html') {
        let readableStream = fs.createReadStream(
          path.join(componentsFolder, file),
          'utf8',
        );
        readableStream.on('data', function (chunk) {
          let repl = '{{' + file.split('.')[0].trim() + '}}';
          textHTML = textHTML.replace(repl, chunk);
          let writeableStreamHTML = fs.createWriteStream(
            path.join(distFolder, 'index.html'),
          );
          writeableStreamHTML.write(textHTML);
        });
      }
    }
  } catch (error) {
    console.error(`Unable to create page: ${error}`);
  }
}

buildPage();
