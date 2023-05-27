const { stdin, stdout } = process
const rdl = require("readline")
const constants = require("./constants");

const select = {
  init: (items = []) => {
    let cursorLocation = { x: 0, y: 0 }

    for (let i = 0; i < items.length; i++) {
      const item = new Item(items[i])

      if (i === items.length - 1) {
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
      ctrlc,
      upArrow,
      downArrow
    } = keyEvents({
      listener,
      cursorLocation,
      items,
      actions: {
        hideCursor,
        showCursor
      }
    })

    function listener(c) {
      switch (c) {
        case '\u0003':
          return ctrlc()
        case '\u001b[A':
          return upArrow()
        case '\u001b[B':
          return downArrow()
      }
    }

    function hideCursor() {
      stdout.write("\x1B[?25l")
    }

    function showCursor() {
      stdout.write("\x1B[?25h")
    }
  }
}

function keyEvents({ listener, cursorLocation, items, actions }) {
  const { showCursor } = actions;

  const enter = () => {
    stdin.off("data", listener)
    stdin.setRawMode(false)
    stdin.pause()
  }

  const ctrlc = () => {
    stdin.off("data", listener)
    stdin.setRawMode(false)
    stdin.pause()
    showCursor()
  }

  const upArrow = () => {
    let y = cursorLocation.y
    rdl.cursorTo(stdout, 0, y)
    stdout.write(new Item(items[y - 1]).assemble().valueOf())

    if (cursorLocation.y === 1) {
      cursorLocation.y = items.length
    } else {
      cursorLocation.y--
    }

    y = cursorLocation.y
    rdl.cursorTo(stdout, 0, y)
    stdout.write(new Item(items[y - 1]).assemble().highlight().valueOf())
  }

  const downArrow = () => {
    let output
    let y = cursorLocation.y
    rdl.cursorTo(stdout, 0, y)

    output = new Item(items[y - 1])
      .assemble()
      .valueOf()
    stdout.write(output)

    if (cursorLocation.y === items.length) {
      cursorLocation.y = 1
    } else {
      cursorLocation.y++
    }

    y = cursorLocation.y
    rdl.cursorTo(stdout, 0, y)

    output = new Item(items[y - 1])
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

module.exports = select