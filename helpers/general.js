import chalk from "chalk";
import { NEW_LINE, FRUIT_POINTER } from "../constants.js";

function run(callback) {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === "test") return;
  callback();
}

function collectFruits({ fruit = "1", callbacks = [] }) {
  if (!callbacks.length) return
  const [cb1, cb2] = callbacks

  if (fruit === "1" && cb1) {
    return {
      fruit1: cb1()
    }
  }

  if (fruit === "2" && cb2) {
    return {
      fruit2: cb2()
    }
  }

  if (fruit === "both" && (cb1 && cb2)) {
    return {
      fruit1: cb1(),
      fruit2: cb2()
    }
  }
}

function logFruits({ title, fruitOne, fruitTwo }) {
  console.log(chalk.bold(title))
  console.log("\r")

  console.log(`${FRUIT_POINTER} ${fruitOne?.message}`)
  console.log(`${FRUIT_POINTER} ${fruitTwo?.message}`)
}

export {
  run,
  collectFruits,
  logFruits
}