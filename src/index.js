import fs from "fs";
import path from "path";
import os from "os";
import { createBrotliCompress, createBrotliDecompress } from "zlib";
import readline from "readline";
import { copy, move } from "./fileOperations.js";
import { getEOL, getCPUs, getHomeDir, getSystemUsername, getArchitecture } from "./osOperations.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const username = process.argv[3]?.split("=")[1] || "Guest";
let currentDirectory = os.homedir();  // Start in home directory

const displayCurrentDirectory = () => {
  console.log(`You are currently in ${currentDirectory}`);
};

const goUp = () => {
  const parentDirectory = path.resolve(currentDirectory, "..");
  if (parentDirectory !== currentDirectory) {
    currentDirectory = parentDirectory;
    displayCurrentDirectory();
  } else {
    console.log("Operation failed. You are already at the root directory.");
  }
};

const changeDirectory = (directoryPath) => {
  const newDirectory = path.isAbsolute(directoryPath)
    ? directoryPath
    : path.join(currentDirectory, directoryPath);

  if (fs.existsSync(newDirectory) && fs.statSync(newDirectory).isDirectory()) {
    currentDirectory = newDirectory;
    displayCurrentDirectory();
  } else {
    console.log("Operation failed. Directory not found.");
  }
};

const listDirectory = () => {
  fs.readdir(currentDirectory, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.log("Operation failed. Could not list directory.");
      return;
    }

    const directories = files.filter((file) => file.isDirectory());
    const filesList = files.filter((file) => file.isFile());

    const allFilesAndDirs = [
      ...directories.map((dir) => `${dir.name}/`),
      ...filesList.map((file) => file.name),
    ];

    console.log(allFilesAndDirs.sort().join("\n"));
  });
};

const cat = (filePath) => {
  const resolvedPath = path.isAbsolute(filePath) ? filePath : path.join(currentDirectory, filePath);

  fs.readFile(resolvedPath, "utf8", (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        console.log("Operation failed. File not found.");
      } else {
        console.log("Operation failed. Could not read the file.");
      }
    } else {
      console.log(data);
    }
  });
};

const addFile = (fileName) => {
  const filePath = path.join(currentDirectory, fileName);
  fs.writeFile(filePath, "", (err) => {
    if (err) {
      console.log("Operation failed. Could not create file.");
    } else {
      console.log(`File ${fileName} has been created.`);
    }
  });
};

const renameFile = (oldPath, newFileName) => {
  const oldFilePath = path.isAbsolute(oldPath) ? oldPath : path.join(currentDirectory, oldPath);
  const newFilePath = path.join(path.dirname(oldFilePath), newFileName);

  fs.rename(oldFilePath, newFilePath, (err) => {
    if (err) {
      console.log("Operation failed. Could not rename file.");
    } else {
      console.log(`File has been renamed to ${newFileName}.`);
    }
  });
};

const removeFile = (filePath) => {
  const resolvedPath = path.isAbsolute(filePath) ? filePath : path.join(currentDirectory, filePath);

  fs.unlink(resolvedPath, (err) => {
    if (err) {
      if (err.code === "ENOENT") {
        console.log("Operation failed. File not found.");
      } else {
        console.log("Operation failed. Could not delete the file.");
      }
    } else {
      console.log(`File ${filePath} has been deleted successfully.`);
    }
  });
};

const compressFile = (filePath, destPath) => {
  const inputPath = path.isAbsolute(filePath) ? filePath : path.join(currentDirectory, filePath);
  const outputPath = path.isAbsolute(destPath) ? destPath : path.join(currentDirectory, destPath);

  if (fs.existsSync(inputPath) && fs.statSync(inputPath).isFile()) {
    const readStream = fs.createReadStream(inputPath);
    const writeStream = fs.createWriteStream(outputPath);

    const brotliCompress = createBrotliCompress();
    readStream.pipe(brotliCompress).pipe(writeStream);

    writeStream.on("finish", () => {
      console.log(`File compressed successfully to ${outputPath}`);
    });

    writeStream.on("error", (err) => {
      console.log("Error compressing file:", err.message);
    });
  } else {
    console.log("Operation failed. File not found or invalid path.");
  }
};

const decompressFile = (filePath, destPath) => {
  const inputPath = path.isAbsolute(filePath) ? filePath : path.join(currentDirectory, filePath);
  const outputPath = path.isAbsolute(destPath) ? destPath : path.join(currentDirectory, destPath);

  if (fs.existsSync(inputPath) && fs.statSync(inputPath).isFile()) {
    const readStream = fs.createReadStream(inputPath);
    const writeStream = fs.createWriteStream(outputPath);

    const brotliDecompress = createBrotliDecompress();
    readStream.pipe(brotliDecompress).pipe(writeStream);

    writeStream.on("finish", () => {
      console.log(`File decompressed successfully to ${outputPath}`);
    });

    writeStream.on("error", (err) => {
      console.log("Error decompressing file:", err.message);
    });
  } else {
    console.log("Operation failed. File not found or invalid path.");
  }
};

const getOSInfo = (option) => {
  switch (option) {
    case "--EOL":
      getEOL(); // Вызываем обновлённую функцию
      break;
    case "--cpus":
      getCPUs();
      break;
    case "--homedir":
      getHomeDir();
      break;
    case "--username":
      getSystemUsername();
      break;
    case "--architecture":
      getArchitecture();
      break;
    default:
      console.log("Invalid input.");
  }
};

const getFileHash = (filePath) => {
  const resolvedPath = path.isAbsolute(filePath) ? filePath : path.join(currentDirectory, filePath);
  const hash = require("crypto").createHash("sha256");

  const readStream = fs.createReadStream(resolvedPath);
  readStream.on("data", (chunk) => hash.update(chunk));
  readStream.on("end", () => {
    console.log(`File hash: ${hash.digest("hex")}`);
  });

  readStream.on("error", (err) => {
    console.log("Operation failed. Could not calculate file hash.");
  });
};

const rlListener = () => {
  rl.question("Enter command: ", (input) => {
    const [command, ...args] = input.split(" ");
    
    switch (command) {
      case "up":
        goUp();
        break;
      case "cd":
        if (args.length === 0) {
          console.log("Invalid input. Usage: cd <directory-path>");
        } else {
          changeDirectory(args.join(" "));
        }
        break;
      case "ls":
        listDirectory();
        break;
      case "cat":
        if (args.length === 0) {
          console.log("Invalid input. Usage: cat <file-path>");
        } else {
          cat(args.join(" "));
        }
        break;
      case "add":
        if (args.length === 0) {
          console.log("Invalid input. Usage: add <file-name>");
        } else {
          addFile(args.join(" "));
        }
        break;
      case "rn":
        if (args.length < 2) {
          console.log("Invalid input. Usage: rn <old-file-path> <new-file-name>");
        } else {
          renameFile(args[0], args[1]);
        }
        break;
      case "rm":
        if (args.length === 0) {
          console.log("Invalid input. Usage: rm <file-path>");
        } else {
          removeFile(args.join(" "));
        }
        break;
      case "compress":
        if (args.length < 2) {
          console.log("Invalid input. Usage: compress <file-path> <destination-path>");
        } else {
          compressFile(args[0], args[1]);
        }
        break;
      case "decompress":
        if (args.length < 2) {
          console.log("Invalid input. Usage: decompress <file-path> <destination-path>");
        } else {
          decompressFile(args[0], args[1]);
        }
        break;
      case "hash":
        if (args.length === 0) {
          console.log("Invalid input. Usage: hash <file-path>");
        } else {
          getFileHash(args.join(" "));
        }
        break;
      case "os":
        if (args.length === 0) {
          console.log("Invalid input. Usage: os --<option>");
        } else {
          getOSInfo(args[0]);
        }
        break;
      case "cp":
        if (args.length < 2) {
          console.log("Invalid input. Usage: cp <source-path> <destination-path>");
        } else {
          copy(args[0], args[1]);
        }
        break;
      case "mv":
        if (args.length < 2) {
          console.log("Invalid input. Usage: mv <source-path> <destination-path>");
        } else {
          move(args[0], args[1]);
        }
        break;
      case ".exit":
        console.log(`Thank you for using File Manager, ${username}, goodbye!`);
        rl.close();
        process.exit();
        break;
      default:
        console.log("Invalid input. Unknown command.");
    }

    rlListener();  // Keep the prompt open for next command
  });
};

// Welcome message
console.log(`Welcome to the File Manager, ${username}!`);
displayCurrentDirectory();
rlListener(); // Start listening for commands
