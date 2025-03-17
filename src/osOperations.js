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
    : path.join(process.cwd(), filePath);

  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
    const hash = crypto.createHash("sha256");
    const fileStream = fs.createReadStream(fullPath);

    fileStream.on("data", (chunk) => {
      hash.update(chunk);
    });

    fileStream.on("end", () => {
      console.log(`Hash of file ${filePath}: ${hash.digest("hex")}`);
    });
  } else {
    console.log("Operation failed");
  }
};
