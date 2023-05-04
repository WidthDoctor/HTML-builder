const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, (files) => {
  files.forEach((file) => {
      if (stats.isFile()) {
        const fileSizeInBytes = stats.size;
        const fileSizeInKb = fileSizeInBytes / 1024;
        const fileName = path.parse(file).name;
        const fileExtension = path.parse(file).ext.substring(1);
        console.log(`${fileName} - ${fileExtension} - ${fileSizeInKb.toFixed(3)}kb`);
      }
    });
  });
