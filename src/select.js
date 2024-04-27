import chalk from "chalk"
import * as readline from "node:readline"
import { stdin, stdout } from "node:process"
import { ITEM_POINTER, NEW_LINE } from "./constants.js"

const select = {
  init: ({ options }) => {
    readline.emitKeypressEvents(stdin)

    stdin.setRawMode(true)
    stdin.resume()
    stdin.setEncoding("utf-8")

    stdin.on("keypress", (str, key) => {
      if (key.ctrl && key.name === "c") {
        // go to latest line before shuting down the terminal
        stdout.write(NEW_LINE)
        stdout.write(NEW_LINE)

        process.exit()
      }

      if (key.name === "return") {
        console.log("return key was hit")
      }

      if (key.name === "up") {
        console.log("up arrow was hit")
      }

      if (key.name === "down") {
        console.log("down arrow was hit")
      }
    })

    stdout.write(`${NEW_LINE}Choose an option${NEW_LINE}`)

    for (let i = 0; i <= options.length - 1; i++) {
      const isFirstOption = i === 0
      const isLastOption = i === options.length - 1
      const item = `${ITEM_POINTER} ${options[i]}${isLastOption ? "" : NEW_LINE}`

      if (isFirstOption) {
        stdout.write(NEW_LINE)
        stdout.write(chalk.yellow(item))
        continue
      }

      stdout.write(item)
    }
  }
}

export default select
