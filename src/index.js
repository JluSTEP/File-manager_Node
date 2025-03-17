import readline from "readline";
import { goUp, changeDirectory, listDirectory, printCurrentDir } from "./navigation.js";
import { cat, add, renameFile, copy, move, remove } from "./fileOperations.js";

// Получаем имя пользователя
const args = process.argv.slice(2);
const usernameArg = args.find((arg) => arg.startsWith("--username="));
const username = usernameArg ? usernameArg.split("=")[1] : "Guest";

console.log(`Welcome to the File Manager, ${username}!`);
printCurrentDir();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("line", (input) => {
  const [command, ...args] = input.trim().split(" ");

  switch (command) {
    case "up":
      goUp();
      break;
    case "cd":
      if (args.length === 0) {
        console.log("Invalid input");
      } else {
        changeDirectory(args.join(" "));
      }
      break;
    case "ls":
      listDirectory();
      break;
    case "cat":
      if (args.length === 0) {
        console.log("Invalid input");
      } else {
        cat(args.join(" "));
      }
      break;
    case "add":
      if (args.length === 0) {
        console.log("Invalid input");
      } else {
        add(args.join(" "));
      }
      break;
    case "rn":
      if (args.length < 2) {
        console.log("Invalid input");
      } else {
        renameFile(args[0], args[1]);
      }
      break;
    case "cp":
      if (args.length < 2) {
        console.log("Invalid input");
      } else {
        copy(args[0], args[1]);
      }
      break;
    case "mv":
      if (args.length < 2) {
        console.log("Invalid input");
      } else {
        move(args[0], args[1]);
      }
      break;
    case "rm":
      if (args.length === 0) {
        console.log("Invalid input");
      } else {
        remove(args.join(" "));
      }
      break;
    case ".exit":
      console.log(`Thank you for using File Manager, ${username}, goodbye!`);
      rl.close();
      process.exit();
    default:
      console.log("Invalid input");
  }
});

rl.on("close", () => {
  console.log(`\nThank you for using File Manager, ${username}, goodbye!`);
  process.exit();
});
