const { stdin, stdout } = process
import * as rdl from "node:readline"
import constants from "./constants.js"

const select = {
  init: ({ options = [], ChoseOptionEmitter }) => {
    let cursorLocation = { x: 0, y: 0 }

    for (let i = 0; i < options.length; i++) {
      const item = new Item(options[i])

      if (i === options.length - 1) {
        const output = item
          .assemble()
          .highlight()
          .valueOf()

        stdout.write(output)
      } else {
        const output = item
          .assemble()
          .valueOf()
        
        stdout.write(output);
      }

      cursorLocation.y = i + 1
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
    } = keyEvents({
      listener,
      ChoseOptionEmitter,
      cursorLocation,
      options,
      actions: {
        hideCursor,
        showCursor,
        cleanUp
      }
    })

    function listener(c) {
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

    function hideCursor() {
      stdout.write("\x1B[?25l")
    }

    function showCursor() {
      stdout.write("\x1B[?25h")
    }

    function cleanUp() {
      // unicode to avoid octal literals not allowed in strict mode
      stdout.write("\u033c")
    }
  }
}

function keyEvents({ listener, ChoseOptionEmitter, cursorLocation, options, actions }) {
  const { showCursor, cleanUp } = actions;

  const enter = async () => {
    const selected = options[cursorLocation.y - 1]

    stdin.off("data", listener)
    stdin.setRawMode(false)
    stdin.pause()
    cleanUp()

    ChoseOptionEmitter.emit("event", selected)
  }

  const ctrlc = () => {
    stdin.off("data", listener)
    stdin.setRawMode(false)
    stdin.pause()
    cleanUp()
    showCursor()
  }

  const upArrow = () => {
    let y = cursorLocation.y
    rdl.cursorTo(stdout, 0, y)
    stdout.write(new Item(options[y - 1]).assemble().valueOf())

    if (cursorLocation.y === 1) {
      cursorLocation.y = options.length
    } else {
      cursorLocation.y--
    }

    y = cursorLocation.y
    rdl.cursorTo(stdout, 0, y)
    stdout.write(new Item(options[y - 1]).assemble().highlight().valueOf())
  }

  const downArrow = () => {
    let output
    let y = cursorLocation.y
    rdl.cursorTo(stdout, 0, y)

    output = new Item(options[y - 1])
      .assemble()
      .valueOf()
    stdout.write(output)

    if (cursorLocation.y === options.length) {
      cursorLocation.y = 1
    } else {
      cursorLocation.y++
    }

    y = cursorLocation.y
    rdl.cursorTo(stdout, 0, y)

    output = new Item(options[y - 1])
      .assemble()
      .highlight()
      .valueOf()
    stdout.write(output)
  }

  return {
    enter,
    ctrlc,
    upArrow,
    downArrow,
  }
}

function Item(value, color = "yellow") {
  let item = String(value)

  this.assemble = function() {
    const { ITEM_POINTER, NEW_LINE } = constants
    item = `${ITEM_POINTER} ${value}${NEW_LINE}`

    return this
  }

  this.highlight = function() {
    const { COLORS } = constants
    const _color = COLORS[color];
    const prefix = `${"\x1b["}${_color[0]}${"m"}`
    const suffix = `${"\x1b["}${_color[1]}${"m\x1b[0m"}`
  
    item = `${prefix}${item}${suffix}`
    return this
  }

  this.valueOf = function() {
    return item
  }
}

export default select