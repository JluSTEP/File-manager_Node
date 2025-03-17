import fs from "fs";
import path from "path";
import { printCurrentDir } from "./navigation.js";

// Чтение файла
export const cat = (filePath) => {
  const fullPath = path.isAbsolute(filePath)
    ? filePath
    : path.join(process.cwd(), filePath);

  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
    const readStream = fs.createReadStream(fullPath, "utf-8");
    readStream.pipe(process.stdout);
  } else {
    console.log("Operation failed");
  }
};

// Создание нового файла
export const add = (fileName) => {
  const fullPath = path.join(process.cwd(), fileName);

  if (fs.existsSync(fullPath)) {
    console.log("File already exists");
  } else {
    fs.writeFileSync(fullPath, "", "utf-8");
    console.log(`File ${fileName} created`);
  }
};

// Переименование файла
export const renameFile = (oldPath, newFileName) => {
  const fullOldPath = path.isAbsolute(oldPath)
    ? oldPath
    : path.join(process.cwd(), oldPath);
  const newFullPath = path.isAbsolute(newFileName)
    ? newFileName
    : path.join(process.cwd(), newFileName);

  if (fs.existsSync(fullOldPath) && fs.statSync(fullOldPath).isFile()) {
    fs.renameSync(fullOldPath, newFullPath);
    console.log(`File renamed to ${newFileName}`);
  } else {
    console.log("Operation failed");
  }
};

// Копирование файла
export const copy = (srcPath, destPath) => {
  const fullSrcPath = path.isAbsolute(srcPath)
    ? srcPath
    : path.join(process.cwd(), srcPath);
  const fullDestPath = path.isAbsolute(destPath)
    ? destPath
    : path.join(process.cwd(), destPath);

  if (fs.existsSync(fullSrcPath) && fs.statSync(fullSrcPath).isFile()) {
    const readStream = fs.createReadStream(fullSrcPath);
    const writeStream = fs.createWriteStream(fullDestPath);
    readStream.pipe(writeStream);
    console.log(`File copied to ${fullDestPath}`);
  } else {
    console.log("Operation failed");
  }
};

// Перемещение файла
export const move = (srcPath, destPath) => {
  const fullSrcPath = path.isAbsolute(srcPath)
    ? srcPath
    : path.join(process.cwd(), srcPath);
  const fullDestPath = path.isAbsolute(destPath)
    ? destPath
    : path.join(process.cwd(), destPath);

  if (fs.existsSync(fullSrcPath) && fs.statSync(fullSrcPath).isFile()) {
    fs.renameSync(fullSrcPath, fullDestPath);
    console.log(`File moved to ${fullDestPath}`);
  } else {
    console.log("Operation failed");
  }
};

// Удаление файла
export const remove = (filePath) => {
  const fullPath = path.isAbsolute(filePath)
    ? filePath
    : path.join(process.cwd(), filePath);

  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
    fs.unlinkSync(fullPath);
    console.log(`File ${filePath} deleted`);
  } else {
    console.log("Operation failed");
  }
};
