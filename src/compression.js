import fs from 'fs';
import path from 'path';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';

/**
 * @param {string} filePath - Путь к файлу, который нужно сжать
 * @param {string} destPath - Путь, куда сохранить сжатый файл
 */
export const compressFile = (filePath, destPath) => {
  const inputPath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
  const outputPath = path.isAbsolute(destPath) ? destPath : path.join(process.cwd(), destPath);

  if (fs.existsSync(inputPath)) {
    if (fs.statSync(inputPath).isDirectory()) {
      console.log("Operation failed. Cannot compress a directory.");
      return;
    }

    if (fs.statSync(inputPath).isFile()) {
      if (fs.existsSync(outputPath) && fs.statSync(outputPath).isDirectory()) {
        console.log("Operation failed. Destination path cannot be a directory.");
        return;
      }

      const readStream = fs.createReadStream(inputPath);
      const writeStream = fs.createWriteStream(outputPath);

      const brotliCompress = createBrotliCompress();
      readStream.pipe(brotliCompress).pipe(writeStream);

      writeStream.on('finish', () => {
        console.log(`File compressed successfully to ${outputPath}`);
      });

      writeStream.on('error', (err) => {
        console.log('Error compressing file:', err.message);
      });
    } else {
      console.log('Operation failed. File not found or invalid path.');
    }
  } else {
    console.log('Operation failed. File not found or invalid path.');
  }
};

/**
 * @param {string} filePath 
 * @param {string} destPath 
 */
export const decompressFile = (filePath, destPath) => {
  const inputPath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
  const outputPath = path.isAbsolute(destPath) ? destPath : path.join(process.cwd(), destPath);

  if (fs.existsSync(inputPath) && fs.statSync(inputPath).isFile()) {
    const readStream = fs.createReadStream(inputPath);
    const writeStream = fs.createWriteStream(outputPath);

    const brotliDecompress = createBrotliDecompress();
    readStream.pipe(brotliDecompress).pipe(writeStream);

    writeStream.on('finish', () => {
      console.log(`File decompressed successfully to ${outputPath}`);
    });

    writeStream.on('error', (err) => {
      console.log('Error decompressing file:', err.message);
    });
  } else {
    console.log('Operation failed. File not found or invalid path.');
  }
};
