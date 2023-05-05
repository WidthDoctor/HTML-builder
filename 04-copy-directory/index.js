const fs = require('fs');
const path = require('path');
const sourceFolder = path.join(__dirname, 'files');
const targetFolder = path.join(__dirname, 'files-copy');

// Функция копирования файла
const copyFile = (sourcePath, targetPath) => {
  return new Promise((resolve) => {
    const readStream = fs.createReadStream(sourcePath);
    const writeStream = fs.createWriteStream(targetPath);

    writeStream.on('finish', resolve);
    readStream.pipe(writeStream);
  });
};

// Функция копирования папки
const copyFolder = async (source, target) => {
  try {
    // Создание целевой папки, если ее еще нет
    await fs.promises.mkdir(target, { recursive: true });

    // Получение списка файлов и папок в исходной папке
    const files = await fs.promises.readdir(source, { withFileTypes: true });

    // Рекурсивное копирование каждого файла или папки
    await Promise.all(files.map(async (file) => {
      const sourcePath = path.join(source, file.name);
      const targetPath = path.join(target, file.name);

      if (file.isFile()) {
        await copyFile(sourcePath, targetPath);
      } else if (file.isDirectory()) {
        await copyFolder(sourcePath, targetPath);
      }
    }));
  } catch (err) {
    console.error(err);
  }
};

// Копирование папки в начале программы
copyFolder(sourceFolder, targetFolder);

// Отслеживание изменений в папке и повторное копирование при необходимости
fs.watch(sourceFolder, { recursive: true }, async (eventType, filename) => {
    if (eventType === 'change') {
      console.log(`Detected change in ${filename}. Copying file again...`);
      const sourcePath = path.join(sourceFolder, filename);
      const targetPath = path.join(targetFolder, filename);
      await copyFile(sourcePath, targetPath);
    } else {
      console.log(`Detected ${eventType} event in ${filename}. Copying folder again...`);
      await copyFolder(sourceFolder, targetFolder);
    }
  });

