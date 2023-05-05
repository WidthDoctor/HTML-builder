const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, 'styles');
const distPath = path.join(__dirname, 'project-dist');
const bundleFilename = 'bundle.css';
const bundlePath = path.join(distPath, bundleFilename);

// Функция для рекурсивного чтения файлов из папки и всех подпапок
const readFilesRecursive = async (folderPath, fileCallback) => {
  const files = await fs.promises.readdir(folderPath, { withFileTypes: true });
  await Promise.all(files.map(async (file) => {
    const fullPath = path.join(folderPath, file.name);
    if (file.isFile() && path.extname(fullPath) === '.css') {
      await fileCallback(fullPath);
    } else if (file.isDirectory()) {
      await readFilesRecursive(fullPath, fileCallback);
    }
  }));
};

// Собираем все файлы .css в единый файл bundle.css
const buildStylesBundle = async () => {
  let bundleContent = '';
  await readFilesRecursive(stylesPath, async (filePath) => {
    const fileContent = await fs.promises.readFile(filePath, 'utf-8');
    bundleContent += fileContent + '\n';
  });
  await fs.promises.writeFile(bundlePath, bundleContent);
  console.log(`Styles bundle created at ${bundlePath}`);
};

// Создаем папку project-dist, если она не существует
fs.promises.mkdir(distPath, { recursive: true })
  .then(buildStylesBundle)
  .catch((err) => {
    console.error(`Failed to create directory: ${err.message}`);
  });

// Отслеживание изменений в папке styles и повторное создание bundle.css при необходимости
fs.watch(stylesPath, { recursive: true }, (eventType, filename) => {
  if (path.extname(filename) === '.css') {
    console.log(`Detected ${eventType} event for file ${filename}. Rebuilding styles bundle...`);
    buildStylesBundle();
  }
});
