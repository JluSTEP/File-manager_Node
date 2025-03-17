import os from "os";
import crypto from "crypto";
import fs from "fs";
import path from "path";

// Получить EOL (системный конец строки)
export const getEOL = () => {
  console.log(`EOL: ${os.EOL}`);
};

// Получить информацию о процессорах
export const getCPUs = () => {
  const cpus = os.cpus();
  console.log(`Total CPUs: ${cpus.length}`);
  cpus.forEach((cpu, index) => {
    console.log(`CPU ${index + 1}:`);
    console.log(`Model: ${cpu.model}`);
    console.log(`Speed: ${cpu.speed} MHz`);
  });
};

// Получить домашний каталог
export const getHomeDir = () => {
  console.log(`Home Directory: ${os.homedir()}`);
};

// Получить системное имя пользователя
export const getSystemUsername = () => {
  console.log(`System Username: ${os.userInfo().username}`);
};

// Получить архитектуру процессора
export const getArchitecture = () => {
  console.log(`Architecture: ${os.arch()}`);
};

// Вычисление хэша для файла
export const getFileHash = (filePath) => {
    const fullPath = path.isAbsolute(filePath)
      ? filePath
      : path.join(process.cwd(), filePath); // Если путь относительный, приводим его к абсолютному
  
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      const hash = crypto.createHash('sha256');
      const fileStream = fs.createReadStream(fullPath);
  
      // Чтение файла с потока и обновление хэша
      fileStream.on('data', (chunk) => {
        hash.update(chunk);
      });
  
      fileStream.on('end', () => {
        const fileHash = hash.digest('hex');  // Хэш в формате hex
        console.log(`Hash of file "${filePath}": ${fileHash}`);
      });
      
      fileStream.on('error', (err) => {
        console.log('Error reading file:', err.message);
      });
    } else {
      console.log('Operation failed. File not found or invalid path.');
    }
  };
