const fs = require('fs');
const path = require('path');

fs.mkdir(
  path.join(__dirname, 'files-copy'), {recursive: true}, (error) => {
    if (error) throw error;
  });

fs.readdir(
  path.join(__dirname, 'files-copy'),
  (error, files) => {
    if (error) throw error;
    for (const file of files) {
      fs.unlink(
        path.join(__dirname, 'files-copy', `${file}`),
        error => {
          if (error) throw error;
        });
    }
  });

fs.readdir(
  path.join(__dirname, 'files'), (error, files) => {
    if (error) throw error;
    for (const file of files) {
      fs.copyFile(
        path.join(__dirname, 'files', `${file}`),
        path.join(__dirname, 'files-copy', `${file}`), (error) => {
          if (error) throw error;
        });
    }
  }
);