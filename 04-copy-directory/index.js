const fs = require('fs');
const path = require('path');

fs.stat(path.join(__dirname, 'files-copy'), async (err) => {
  if (err) {
    await fs.mkdir(
      path.join(__dirname, 'files-copy'), {recursive: true}, (error) => {
        if (error) throw error;
      });

    await fs.readdir(
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
  } else {
    await fs.readdir(
      path.join(__dirname, 'files-copy'),
      async (error, files) => {
        if (error) throw error;
        for await (const file of files) {
          await fs.unlink(
            path.join(__dirname, 'files-copy', `${file}`),
            error => {
              if (error) throw error;
            });
        }
      });

    await fs.readdir(
      path.join(__dirname, 'files'), async (error, files) => {
        if (error) throw error;
        for await (const file of files) {
          fs.copyFile(
            path.join(__dirname, 'files', `${file}`),
            path.join(__dirname, 'files-copy', `${file}`), (error) => {
              if (error) throw error;
            });
        }
      }
    );
  }
});