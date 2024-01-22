const path = require('path');
const fs = require('fs/promises');

const copyFolder = path.join(__dirname, 'files');
const newFolder = path.join(__dirname, 'files-copy');

async function clearFolder(folder) {
  try {
    let files = await fs.readdir(folder);
    for (let file of files) {
      let pathFile = path.join(folder, file);
      let statFile = await fs.stat(pathFile);
      if (statFile.isFile()) {
        await fs.unlink(pathFile);
      } else {
        await clearFolder(pathFile);
        await fs.rmdir(pathFile);
      }
    }
  } catch (error) {
    console.error(`Unable to empty folder: ${error}`);
  }
}

async function copyDir(copyFolder, newFolder) {
  try {
    await fs.mkdir(newFolder, { recursive: true });
    await clearFolder(newFolder);

    let files = await fs.readdir(copyFolder);
    for (let file of files) {
      let pathFile = path.join(copyFolder, file);
      let statFile = await fs.stat(pathFile);
      if (statFile.isFile()) {
        await fs.copyFile(
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

copyDir(copyFolder, newFolder);
