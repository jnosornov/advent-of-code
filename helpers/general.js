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
  const { stdout } = process

  stdout.write(chalk.bold(title))
  stdout.write(`${NEW_LINE}`)
  stdout.write(`${NEW_LINE}`)

  stdout.write(`${FRUIT_POINTER} ${fruitOne.message}`)
  stdout.write(`${NEW_LINE}`)
  stdout.write(`${FRUIT_POINTER} ${fruitTwo.message}`)
  stdout.write(`${NEW_LINE}`)
  stdout.write(`${NEW_LINE}`)
}

export {
  run,
  collectFruits,
  logFruits
}