const fs = require('fs');
const path = require('path');
const output = fs.createWriteStream(path.join(__dirname,'project-dist', 'bundle.css'));

fs.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}, async (error, files) => {
  if (error) throw error;
  for await (const file of files) {
    if (file.isFile() && path.extname(path.join(__dirname, 'styles', `${file.name}`)) === '.css') {
      const pathToFile= path.join(__dirname, 'styles', `${file.name}`);
      const input = fs.createReadStream(pathToFile, 'utf-8');
      input.pipe(output);
    }
  }
});
