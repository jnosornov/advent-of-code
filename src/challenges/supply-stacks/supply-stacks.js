import path from "path"
import { fileURLToPath } from "url"
import { run, runChallenge } from "../../helpers/general.js"
import Stack from "../../structures/stack/stack.js"

export default async function init({ star }) {
  return await runChallenge({
    star,
    challenge: "Supply Stacks",
    solutions: [fruitOne, fruitTwo],
    directory: path.dirname(fileURLToPath(import.meta.url)),
    opts: (entry) => entry.split(/\r?\n/)
  })
}

function fruitOne(input) {
  const { cratesIndex, stacksIndexes, instructionsIndex } = getIndexes(input)
  const stacksOfCrates = fillCrateStacks({ input, startIndex: cratesIndex, stacksIndexes })

  for (let i = instructionsIndex; i <= input.length - 1; i++) {
    const instruction = input[i]
    const [cratesToMove, from, to] = instruction.match(/\d+/g)

    for (let j = 1; j <= cratesToMove; j++) {
      const crate = stacksOfCrates[from - 1].peek()
      stacksOfCrates[from - 1].pop()
      stacksOfCrates[to - 1].push(crate)
    }
  }

  return getTopCrates(stacksOfCrates)
}

function fruitTwo(input) {
  const { cratesIndex, stacksIndexes, instructionsIndex } = getIndexes(input)
  const stacksOfCrates = fillCrateStacks({ input, startIndex: cratesIndex, stacksIndexes })

  for (let i = instructionsIndex; i <= input.length - 1; i++) {
    let currentCratesToBeMoved
    const instruction = input[i]
    const [cratesToMove, from, to] = instruction.match(/\d+/g)

    for (let j = 1; j <= cratesToMove; j++) {
      const crate = stacksOfCrates[from - 1].peek()
      stacksOfCrates[from - 1].pop()

      currentCratesToBeMoved = `${crate}${currentCratesToBeMoved || ""}`
    }

    for (let k = 0; k <= currentCratesToBeMoved.length - 1; k++) {
      const crate = currentCratesToBeMoved[k]
      stacksOfCrates[to - 1].push(crate)
    }
  }

  return getTopCrates(stacksOfCrates)
}

function getIndexes(input) {
  const createIndexesRegex = new RegExp(/^\s\d+(?:\s{3}\d+)*\s$/)

  return input.reduce((accum, row, index) => {
    const isCrateStackIndexes = createIndexesRegex.test(row)

    if (!isCrateStackIndexes) return accum

    const indexes = []
    for (const i in row) {
      if (row[i] === " ") continue
      indexes.push(parseInt(i))
    }

    return {
      cratesIndex: index - 1,
      stacksIndexes: indexes,
      instructionsIndex: index + 2
    }
  }, {})
}

function fillCrateStacks({ input, startIndex, stacksIndexes }) {
  const crateStacks = []

  for (let i = startIndex; i >= 0; i--) {
    const cratesRow = stacksIndexes.reduce((accum, curr, index) => {
      const isCrate = input[i][curr] !== " "
      if (!isCrate) return [...accum]

      return [...accum, { stackIndex: index, crate: input[i][curr] }]
    }, [])

    if (i === startIndex) {
      for (let k = 0; k <= cratesRow.length - 1; k++) {
        crateStacks.push(new Stack())
      }
    }

    for (let j = 0; j <= cratesRow.length - 1; j++) {
      const { stackIndex, crate } = cratesRow[j]
      crateStacks[stackIndex].push(crate)
    }
  }

  return crateStacks
}

function getTopCrates(stacks) {
  let topCrates = ""
  for (let i = 0; i <= stacks.length - 1; i++) {
    const topElement = stacks[i].peek()
    topCrates = `${topCrates}${topElement}`
  }

  return topCrates
}

run(() => init({ star: "both" }))
