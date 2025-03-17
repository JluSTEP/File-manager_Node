import readline from "readline";
import { goUp, changeDirectory, listDirectory, printCurrentDir } from "./navigation.js";

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
