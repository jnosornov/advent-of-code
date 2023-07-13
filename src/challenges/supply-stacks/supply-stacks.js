import { collectFruits, logFruits, run } from "../../helpers/general.js"
import { getFileContent } from "../../helpers/file.js"
import Stack from "../../structures/stack/stack.js"

export default async function init({ fruit }) {
  const filename = process.env.NODE_ENV === "test" ? "./input.sample.txt" : "./input.txt"

  const { input } = await getFileContent({
    path: new URL(filename, import.meta.url),
    opts: (entry) => entry.split(/\r?\n/)
  })

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

  const { cratesIndex, stacksIndexes, instructionsIndex } = getIndexes(input)
  const stacksOfCrates = fillCrateStacks({ input, startIndex: cratesIndex, stacksIndexes })

  function fruitOne() {
    for (let i = instructionsIndex; i <= input.length - 1; i++) {
      const instruction = input[i]
      const [cratesToMove, from, to] = instruction.match(/\d+/g)

      for (let j = 1; j <= cratesToMove; j++) {
        const crate = stacksOfCrates[from - 1].peek()
        stacksOfCrates[from - 1].pop()
        stacksOfCrates[to - 1].push(crate)
      }
    }

    let topCrates = ""
    for (let i = 0; i <= stacksOfCrates.length - 1; i++) {
      const topElement = stacksOfCrates[i].peek()
      topCrates = `${topCrates}${topElement}`
    }

    return topCrates
  }

  const fruits = collectFruits({ fruit, callbacks: [fruitOne] })
  const { fruit1 } = fruits

  logFruits({
    title: "Supply Stacks",
    fruitOne: {
      message: fruit1 ? `The crates ending at the top of each stack are ${fruit1}` : null
    }
  })

  return fruits
}

run(() => init({ fruit: "1" }))
