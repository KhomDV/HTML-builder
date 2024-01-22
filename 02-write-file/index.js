const path = require('path');
const fs = require('fs');
const { stdin, stdout } = require('process');
const readline = require('readline');

let writableStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

let rl = readline.createInterface({
  input: stdin,
  output: stdout,
  crlfDelay: Infinity,
});

stdout.write('Enter a string:\n');
rl.prompt();
rl.on('line', (input) => {
  input = input.toString().trim();
  if (input === 'exit') {
    rl.close();
  } else {
    writableStream.write(input + '\n');
    rl.prompt();
  }
}).on('close', () => {
  stdout.write('Save file "text.txt"...');
  process.exit(0);
});
