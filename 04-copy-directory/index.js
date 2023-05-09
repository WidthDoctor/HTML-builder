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
    // Проверка наличия целевой папки и удаление ее содержимого, если она уже существует
    try {
      await fs.promises.access(target);
      await fs.promises.rmdir(target, { recursive: true });
    } catch (error) {
      // Целевая папка не существует или не доступна
    }

    // Создание целевой папки
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

