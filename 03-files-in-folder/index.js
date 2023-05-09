const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }
  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(err);
        return;
      }
      if (stats.isFile()) {
        const fileSizeInBytes = stats.size;
        const fileSizeInKb = fileSizeInBytes / 1024;
        const fileName = path.parse(file).name;
        const fileExtension = path.parse(file).ext.substring(1);
        console.log(`${fileName} - ${fileExtension} - ${fileSizeInKb.toFixed(3)}kb`);
      }
    });
  });
});