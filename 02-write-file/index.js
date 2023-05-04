const readline = require('readline');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Введите текст. Для выхода наберите "exit" или нажмите Ctrl+C');

rl.on('line', (input) => {
  if (input === 'exit') {
    console.log('Завершение работы.');
    rl.close();
  } else {
    fs.appendFile(filePath, input + '\n', (err) => {
      if (err) throw err;
      console.log('Текст добавлен в файл.');
    });
  }
});

rl.on('close', () => {
  console.log('Работа завершена.');
});