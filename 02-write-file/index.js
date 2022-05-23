const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');

process.on('exit', () => stdout.write('\nSee you later\n'));
process.on('SIGINT', () => {
  process.exit();
});
fs.writeFile(
  path.join(__dirname, 'text.txt'), '', (error) => {
    if (error) throw error;
    stdout.write('File created\n');
  }
);
stdin.on('data', data => {
  if (data.toString().trim() === 'exit') process.exit();
  fs.appendFile(
    path.join(__dirname, 'text.txt'), `${data}`, (error) => {
      if (error) throw error;
      stdout.write('Content added\n');
    }
  );
});
