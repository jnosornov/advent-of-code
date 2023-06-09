const { stdin, stdout } = process
import * as rdl from "node:readline"
import constants from "./constants.js"

const select = {
  init: async ({ options = [], ChoseOptionEmitter }) => {
    const { NEW_LINE } = constants
    let selectedOptionIdx = 0
    let optionsInitialLocation = 0

    stdout.write(NEW_LINE)
    stdout.write("Choose the challenge to be executed")
    stdout.write(NEW_LINE)
    stdout.write(NEW_LINE)

    const { rows } = await select.getCursorPosition()
    optionsInitialLocation = rows - 1

    for (let i = 0; i < options.length; i++) {
      const item = new Item(options[i])

      if (i === 0) {
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
        showCursor,
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
  },
  keyEvents: ({ listener, ChoseOptionEmitter, selectedOptionIdx, optionsInitialLocation, options, actions }) => {
    const { showCursor } = actions
  
    const enter = async () => {
      const { NEW_LINE } = constants
      const selectedOption = options[selectedOptionIdx]
  
      stdin.off("data", listener)
      stdin.setRawMode(false)
      stdin.pause()
      rdl.cursorTo(stdout, 0, optionsInitialLocation + options.length)
      stdout.write(NEW_LINE)
  
      ChoseOptionEmitter.emit("event", selectedOption)
    }
  
    const ctrlc = () => {
      const { NEW_LINE } = constants
  
      stdin.off("data", listener)
      stdin.setRawMode(false)
      stdin.pause()
      
      stdout.write(NEW_LINE)
      showCursor()
    }
  
    const upArrow = async () => {
      rdl.cursorTo(stdout, 0, optionsInitialLocation + selectedOptionIdx)
      stdout.write(new Item(options[selectedOptionIdx]).assemble().valueOf())
  
      if (selectedOptionIdx === 0) {
        selectedOptionIdx = options.length - 1
      } else {
        selectedOptionIdx--
      }
  
      rdl.cursorTo(stdout, 0, optionsInitialLocation + selectedOptionIdx)
      stdout.write(new Item(options[selectedOptionIdx]).assemble().highlight().valueOf())
    }
  
    const downArrow = () => {
      rdl.cursorTo(stdout, 0, optionsInitialLocation + selectedOptionIdx)
      stdout.write(new Item(options[selectedOptionIdx]).assemble().valueOf())
  
      if ((selectedOptionIdx + 1) === options.length) {
        selectedOptionIdx = 0
      } else {
        selectedOptionIdx++
      }
  
      rdl.cursorTo(stdout, 0, optionsInitialLocation + selectedOptionIdx)
      stdout.write(new Item(options[selectedOptionIdx]).assemble().highlight().valueOf())
    }
  
    return {
      enter,
      ctrlc,
      upArrow,
      downArrow,
    }
  },
  // from https://stackoverflow.com/questions/71246585/nodejs-readlines-cursor-behavior-and-position
  getCursorPosition: () => new Promise((resolve) => {
    const termcodes = { cursorGetPosition: '\u001b[6n' };

    stdin.setEncoding('utf8');
    stdin.setRawMode(true);

    const readfx = function () {
        const buf = stdin.read();
        const str = JSON.stringify(buf); // "\u001b[9;1R"
        const regex = /\[(.*)/g;
        const xy = regex.exec(str)[0].replace(/\[|R"/g, '').split(';');
        const pos = { rows: xy[0], cols: xy[1] };
        stdin.setRawMode(false);
        resolve(pos);
    }

    stdin.once('readable', readfx);
    stdout.write(termcodes.cursorGetPosition);
  })
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