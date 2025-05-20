import fs from "fs";
import path from "path";
import os from "os";

let currentDir = os.homedir(); // Начальный каталог — домашняя директория

export const printCurrentDir = () => {
  console.log(`\nYou are currently in ${currentDir}`);
};

// Команда "up" (переход на уровень выше)
export const goUp = () => {
  const parentDir = path.dirname(currentDir);
  if (parentDir !== currentDir) {
    currentDir = parentDir;
  }
  printCurrentDir();
};

// Команда "cd path_to_directory" (переход в папку)
export const changeDirectory = (newPath) => {
  const targetPath = path.isAbsolute(newPath)
    ? newPath
    : path.join(currentDir, newPath);

  if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
    currentDir = targetPath;
  } else {
    console.log("Invalid input");
  }
  printCurrentDir();
};

// Команда "ls" (список файлов и папок)
export const listDirectory = () => {
  try {
    const files = fs.readdirSync(currentDir, { withFileTypes: true });

    const folders = files
      .filter((file) => file.isDirectory())
      .map((file) => ({ name: file.name, type: "folder" }));

    const filesList = files
      .filter((file) => file.isFile())
      .map((file) => ({ name: file.name, type: "file" }));

    const sortedList = [...folders, ...filesList].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    console.log("\nContents:");
    console.table(sortedList);
  } catch (error) {
    console.log("Operation failed");
  }
};
