const fs = require('fs');
const path = require('path');
const COMPONENTS_DIR = path.join(__dirname,'components');
const TEMPLATE_FILE = path.join(__dirname, 'template.html');
const OUTPUT_FILE = path.join(__dirname,'project-dist', 'index.html');
const STYLES_DIR = path.join(__dirname, 'styles');
const OUTPUT_STYLES = path.join(__dirname, 'project-dist', 'style.css');

fs.mkdir(path.join(__dirname, "project-dist"), err =>{
    if(err && err.code !== 'EEXIST') throw err;
    console.log("папка на месте");
});

// !Начало сборки html
async function replaceTags() {
    try {
        const template = await fs.promises.readFile(TEMPLATE_FILE, 'utf8');
        const placeholders = template.match(/{{(\w+)}}/g);

        if (placeholders) {
            const components = await loadComponents(placeholders);
            let output = template;
            placeholders.forEach(placeholder => {
                const componentName = placeholder.slice(2, -2);
                const component = components[componentName];
                output = output.replace(placeholder, component);
            });

            await fs.promises.writeFile(OUTPUT_FILE, output);
            console.log(`Я сделяль ${OUTPUT_FILE}.`);
        } else {
            console.log(`No placeholders found in ${TEMPLATE_FILE}.`);
        }
    } catch (err) {
        console.error(err);
    }
}

async function loadComponents(placeholders) {
    const components = {};
    await Promise.all(placeholders.map(async placeholder => {
        const componentName = placeholder.slice(2, -2);
        const componentFile = path.join(COMPONENTS_DIR, `${componentName}.html`);
        try {
            const component = await fs.promises.readFile(componentFile, 'utf8');
            components[componentName] = component;
        } catch (err) {
            console.log(`Component file ${componentFile} not found.`);
        }
    }));
    return components;
}
replaceTags();
// !конец сборки html

// !todo Начало работы со стилями
async function combineStyles() {
    try {
      const cssFiles = await fs.promises.readdir(STYLES_DIR);
      const cssFileNames = cssFiles.filter(file => path.extname(file) === '.css');

      if (cssFileNames.length) {
        const cssContents = await Promise.all(cssFileNames.map(async file => {
          const filePath = path.join(STYLES_DIR, file);
          const fileContents = await fs.promises.readFile(filePath, 'utf8');
          return fileContents;
        }));
        const output = cssContents.join('\n');

        await fs.promises.writeFile(OUTPUT_STYLES, output);
        console.log(`Я зделяль ${OUTPUT_STYLES}.`);
      } else {
        console.log(`No CSS files found in ${STYLES_DIR}.`);
      }
    } catch (err) {
      console.error(err);
    }
  }

  combineStyles();
// ? конец работы со стилями

// Копирование папки
const sourceFolder = path.join(__dirname, 'assets');
const targetFolder = path.join(__dirname, 'project-dist', 'assets');

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
