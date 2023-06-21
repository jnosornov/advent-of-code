import chalk from "chalk"
import * as rdl from "node:readline"
import { NEW_LINE, ITEM_POINTER } from "./constants.js"

const { stdin, stdout } = process

const select = {
  init: async ({ options = [], ChoseOptionEmitter }) => {
    const selectedOptionIdx = 0
    let optionsInitialLocation = 0

    stdout.write(NEW_LINE)
    stdout.write(chalk.bold("Choose the challenge to be executed"))
    stdout.write(NEW_LINE)
    stdout.write(NEW_LINE)

    const { rows } = await select.getCursorPosition()
    optionsInitialLocation = rows - 1

    for (let i = 0; i < options.length; i++) {
      const item = `${ITEM_POINTER} ${options[i]}${NEW_LINE}`

      if (i === 0) {
        stdout.write(chalk.yellow(item))
      } else {
        stdout.write(item)
      }
    }

    stdin.setRawMode(true)
    stdin.resume()
    stdin.setEncoding("utf-8")
    hideCursor()
    stdin.on("data", listener)

    const {
      enter,
      ctrlc,
      upArrow,
      downArrow
    } = select.keyEvents({
      listener,
      ChoseOptionEmitter,
      selectedOptionIdx,
      optionsInitialLocation,
      options,
      actions: {
        showCursor
      }
    })

    function listener (c) {
      switch (c) {
        case "\r":
          return enter()
        case "\u0003":
          return ctrlc()
        case "\u001b[A":
          return upArrow()
        case "\u001b[B":
          return downArrow()
      }
    }

    function hideCursor () {
      stdout.write("\x1B[?25l")
    }

    function showCursor () {
      stdout.write("\x1B[?25h")
    }
  },
  keyEvents: ({ listener, ChoseOptionEmitter, selectedOptionIdx, optionsInitialLocation, options, actions }) => {
    const { showCursor } = actions

    const enter = async () => {
      const selectedOption = options[selectedOptionIdx]

      stdin.off("data", listener)
      stdin.setRawMode(false)
      stdin.pause()
      rdl.cursorTo(stdout, 0, optionsInitialLocation + options.length)
      stdout.write(NEW_LINE)

      ChoseOptionEmitter.emit("event", selectedOption)
    }

    const ctrlc = () => {
      stdin.off("data", listener)
      stdin.setRawMode(false)
      stdin.pause()

      stdout.write(NEW_LINE)
      showCursor()
    }

    const upArrow = async () => {
      let item

      rdl.cursorTo(stdout, 0, optionsInitialLocation + selectedOptionIdx)
      item = `${ITEM_POINTER} ${options[selectedOptionIdx]}${NEW_LINE}`
      stdout.write(item)

      if (selectedOptionIdx === 0) {
        selectedOptionIdx = options.length - 1
      } else {
        selectedOptionIdx--
      }

      rdl.cursorTo(stdout, 0, optionsInitialLocation + selectedOptionIdx)
      item = `${ITEM_POINTER} ${options[selectedOptionIdx]}${NEW_LINE}`
      stdout.write(chalk.yellow(item))
    }

    const downArrow = () => {
      let item

      rdl.cursorTo(stdout, 0, optionsInitialLocation + selectedOptionIdx)
      item = `${ITEM_POINTER} ${options[selectedOptionIdx]}${NEW_LINE}`
      stdout.write(item)

      if ((selectedOptionIdx + 1) === options.length) {
        selectedOptionIdx = 0
      } else {
        selectedOptionIdx++
      }

      rdl.cursorTo(stdout, 0, optionsInitialLocation + selectedOptionIdx)
      item = `${ITEM_POINTER} ${options[selectedOptionIdx]}${NEW_LINE}`
      stdout.write(chalk.yellow(item))
    }

    return {
      enter,
      ctrlc,
      upArrow,
      downArrow
    }
  },
  // from https://stackoverflow.com/questions/71246585/nodejs-readlines-cursor-behavior-and-position
  getCursorPosition: () => new Promise((resolve) => {
    const termcodes = { cursorGetPosition: "\u001b[6n" }

    stdin.setEncoding("utf8")
    stdin.setRawMode(true)

    const readfx = function () {
      const buf = stdin.read()
      const str = JSON.stringify(buf) // "\u001b[9;1R"
      const regex = /\[(.*)/g
      const xy = regex.exec(str)[0].replace(/\[|R"/g, "").split(";")
      const pos = { rows: xy[0], cols: xy[1] }
      stdin.setRawMode(false)
      resolve(pos)
    }

    stdin.once("readable", readfx)
    stdout.write(termcodes.cursorGetPosition)
  })
}

export default select
