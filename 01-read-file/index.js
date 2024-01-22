const path = require('path');
const fs = require('fs');
const { stdout } = require('process');

const stream = new fs.ReadStream(path.join(__dirname, 'text.txt'), {
  encoding: 'utf-8',
});

stream.on('readable', () => {
  let data = stream.read();
  if (data !== null) stdout.write(data);
});

stream.on('error', (err) => {
  if (err.code == 'ENOENT') {
    stdout.write('Файл не найден;');
  } else {
    stdout.write(err);
  }
});
