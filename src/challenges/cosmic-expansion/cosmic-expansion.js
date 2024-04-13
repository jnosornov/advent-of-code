import chalk from "chalk"
import numeral from "numeral"
import { collectFruits, logFruits, run } from "../../helpers/general.js"
import { getFileContent } from "../../helpers/file.js"
import { NEW_LINE } from "../../constants.js"

function cosmicExpansion({ grid, fruit }) {
  let EXPANSION_UNIT
  let shortestPathTally = 0
  let rowExpansionCounter = 0
  let columnExpasionCounter = 0

  if (fruit === "1") {
    EXPANSION_UNIT = 1
  }

  if (fruit === "2") {
    EXPANSION_UNIT = 1000000 - 1
  }

  const galaxies = new Map()
  const rowCosmicExpansionStatus = []
  const columnCosmicExpansionStatus = []

  for (let row = 0; row <= grid.length - 1; row++) {
    for (let column = 0; column <= grid[0].length - 1; column++) {
      const IS_GALAXY = grid[row][column] === "#"
      const IS_EMPTY_SPACE = grid[row][column] === "."

      if (IS_GALAXY) {
        rowCosmicExpansionStatus[row] = true
        columnCosmicExpansionStatus[column] = true
      }

      if (IS_EMPTY_SPACE) {
        if (!columnCosmicExpansionStatus[column]) {
          columnCosmicExpansionStatus[column] = false
        }

        if (!rowCosmicExpansionStatus[row]) {
          rowCosmicExpansionStatus[row] = false
        }
      }
    }
  }

  for (let row = 0; row <= grid.length - 1; row++) {
    columnExpasionCounter = 0

    if (!rowCosmicExpansionStatus[row]) {
      rowExpansionCounter++
    }

    for (let column = 0; column <= grid[0].length - 1; column++) {
      const IS_GALAXY = grid[row][column] === "#"

      if (!columnCosmicExpansionStatus[column]) {
        columnExpasionCounter++
      }

      if (IS_GALAXY) {
        const nGalaxy = galaxies.size + 1
        const rowsToExpand = rowExpansionCounter * EXPANSION_UNIT
        const columnsToExpand = columnExpasionCounter * EXPANSION_UNIT

        galaxies.set(nGalaxy, { x: row + rowsToExpand, y: column + columnsToExpand })
      }
    }
  }

  for (let i = 1; i <= galaxies.size; i++) {
    for (let j = i + 1; j <= galaxies.size; j++) {
      const galaxyA = galaxies.get(i)
      const galaxyB = galaxies.get(j)

      const galaxyPairTally = Math.abs(galaxyB.x - galaxyA.x) + Math.abs(galaxyB.y - galaxyA.y)
      shortestPathTally = shortestPathTally + galaxyPairTally
    }
  }

  return shortestPathTally
}

export default async function init({ fruit }) {
  const filename = process.env.NODE_ENV === "test"
    ? "./input.sample.txt"
    : "./input.txt"

  const { contents: grid } = await getFileContent({
    path: new URL(filename, import.meta.url),
    opts: (entry) => entry.split(NEW_LINE)
  })

  const fruits = collectFruits({ fruit, callbacks: [() => cosmicExpansion({ grid, fruit: "1" }), () => cosmicExpansion({ grid, fruit: "2" })] })
  const { fruit1, fruit2 } = fruits

  logFruits({
    title: "Cosmic Expansion",
    fruitOne: {
      message: fruit1 ? `The total shortest path length between galaxy pairs is ${chalk.yellow(numeral(fruit1).format("0,0"))}` : null
    },
    fruitTwo: {
      message: fruit2 ? `The total shortest path length between galaxy pairs is ${chalk.yellow(numeral(fruit2).format("0,0"))}` : null
    }
  })

  return fruits
}

run(() => init({ fruit: "both" }))
