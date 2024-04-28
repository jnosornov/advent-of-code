import chalk from "chalk"
import * as readline from "node:readline"
import { stdin, stdout } from "node:process"
import { ITEM_POINTER, NEW_LINE } from "./constants.js"

function select({ options, ChoseOptionEmitter }) {
  let selectedOptionIdx

  async function keypressEventListener(str, key) {
    if (key.ctrl && key.name === "c") {
      if (selectedOptionIdx !== options.length - 1) {
        const { rows } = await getCursorPosition()
        readline.cursorTo(stdout, 0, rows + ((options.length - 2) - selectedOptionIdx))
      }

      stdout.write(NEW_LINE)
      stdout.write(NEW_LINE)
      process.exit()
    }

    if (key.name === "return") {
      const selectedOption = options[selectedOptionIdx]

      if (selectedOptionIdx !== options.length - 1) {
        const { rows } = await getCursorPosition()
        readline.cursorTo(stdout, 0, rows + ((options.length - 2) - selectedOptionIdx))
      }

      stdin.off("data", keypressEventListener)
      stdin.setRawMode(false)
      stdin.pause()
      stdout.write(NEW_LINE)
      stdout.write(NEW_LINE)

      ChoseOptionEmitter.emit("event", selectedOption)
    }

    if (key.name === "up") {
      let item

      const { rows } = await getCursorPosition()
      readline.cursorTo(stdout, 0, rows - 1)
      item = `${ITEM_POINTER} ${options[selectedOptionIdx]}`
      stdout.write(item)

      const y = selectedOptionIdx === 0 ? rows + options.length - 2 : rows - 2

      if (selectedOptionIdx === 0) {
        selectedOptionIdx = options.length - 1
      } else {
        selectedOptionIdx--
      }

      readline.cursorTo(stdout, 0, y)
      item = `${ITEM_POINTER} ${options[selectedOptionIdx]}`
      stdout.write(chalk.yellow(item))
    }

    if (key.name === "down") {
      let item

      const { rows } = await getCursorPosition()
      readline.cursorTo(stdout, 0, rows - 1)
      item = `${ITEM_POINTER} ${options[selectedOptionIdx]}`
      stdout.write(item)

      const y = selectedOptionIdx === options.length - 1 ? rows - options.length : rows

      if (selectedOptionIdx + 1 === options.length) {
        selectedOptionIdx = 0
      } else {
        selectedOptionIdx++
      }

      readline.cursorTo(stdout, 0, y)
      item = `${ITEM_POINTER} ${options[selectedOptionIdx]}`
      stdout.write(chalk.yellow(item))
    }
  }

  function getCursorPosition() {
    return new Promise((resolve, reject) => {
      const termcodes = { cursorGetPosition: "\u001b[6n" }

      stdin.once("readable", () => {
        const buffer = stdin.read()
        const str = JSON.stringify(buffer)
        const regex = /\[(.*)/g
        const xy = regex.exec(str)[0].replace(/\[|R"/g, "").split(";")
        const pos = { rows: Number(xy[0]), cols: Number(xy[1]) }
        resolve(pos)
      })

      stdout.write(termcodes.cursorGetPosition)
    })
  }

  async function showOptions() {
    for (let i = 0; i <= options.length - 1; i++) {
      const isFirstItem = i === 0
      const isLastItem = i === options.length - 1
      const item = `${ITEM_POINTER} ${options[i]}${isLastItem ? "" : NEW_LINE}`

      if (isFirstItem) {
        stdout.write(NEW_LINE)
        stdout.write(chalk.yellow(item))
        continue
      }

      stdout.write(item)

      if (isLastItem) {
        const { rows } = await getCursorPosition()
        readline.cursorTo(stdout, 0, rows - options.length)
        selectedOptionIdx = 0
      }
    }
  }

  function init() {
    readline.emitKeypressEvents(stdin)

    stdin.setRawMode(true)
    stdin.resume()
    stdin.setEncoding("utf-8")
    stdin.on("keypress", keypressEventListener)

    stdout.write(`${NEW_LINE}Choose an option${NEW_LINE}`)
    showOptions()
  }

  return {
    init
  }
}

export default select
