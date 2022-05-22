const fs = require('fs');
const path = require('path');

async function build() {

  // make project-dist folder
  await fs.mkdir(
    path.join(__dirname, 'project-dist'),
    {recursive: true},
    async (error) => {
      if (error) throw error;
    });

  // change template & write to index
  await fs.copyFile(
    path.join(__dirname, 'template.html'),
    path.join(__dirname, 'project-dist', 'index.html'), async (error) => {
      if (error) throw error;
    });
  let templateData = '';
  const readTemplate = fs.createReadStream(path.resolve(__dirname, 'project-dist', 'index.html'), 'utf-8');

  await readTemplate.on('data', (data) => {
    templateData = data;
  });
  await readTemplate.on('end', async () => {
    await fs.readdir(path.resolve(__dirname, 'components'),
      {withFileTypes: true},
      async (error, files) => {
        if (error) throw error;
        for await (const file of files) {
          let componentData = '';
          let componentName = file.name.replace(/\.[a-z]+$/, '');
          const readComponent = fs.createReadStream(path.resolve(__dirname, 'components', `${file.name}`), 'utf-8');

          await readComponent.on('data', async (data) => {
            componentData = data;
          });

          await readComponent.on('end', async () => {
            templateData = templateData.replace(`{{${componentName}}}`, componentData);
            const writeIndex = fs.createWriteStream(path.resolve(__dirname, 'project-dist', 'index.html'));
            writeIndex.write(templateData);
          });
        }
      });
  });

  // for style.css
  await fs.readdir(path.join(__dirname, 'styles'),
    {withFileTypes: true},
    async (error, files) => {
      const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
      if (error) throw error;
      for await (const file of files) {
        if (file.isFile() && path.extname(path.join(__dirname,
          'styles',
          `${file.name}`)) === '.css') {
          const pathToFile = path.join(__dirname, 'styles', `${file.name}`);
          const input = fs.createReadStream(pathToFile, 'utf-8');
          await input.pipe(output);
        }
      }
    });
  // for copy assets
  await copyAssets();
}

async function copyAssets() {
  const source = path.resolve(__dirname, 'assets');
  const destination = path.resolve(__dirname, 'project-dist', 'assets');
  async function copyFiles(source, destination) {
    await fs.stat(source, async (error, stats) => {
      if (error) throw error;
      if (stats.isDirectory()) {
        await fs.mkdir(
          destination,
          { recursive: true },
          async (error) => {
            if (error) throw error;
          });
        await fs.readdir(source, async (error, folder) => {
          if (error) throw error;
          for await (const file of folder) {
            await copyFiles(path.join(source, file), path.join(destination, file));
          }
        });
      } else {
        await fs.copyFile(source, destination, (error) => {
          if (error) throw error;
        });
      }
    });
  }
  await copyFiles(source, destination);
}

build();
