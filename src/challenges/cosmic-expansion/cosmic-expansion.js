import path from "path"
import { fileURLToPath } from "url"
import { run, runChallenge } from "../../helpers/general.js"
import { NEW_LINE } from "../../constants.js"

export default async function init({ star }) {
  return await runChallenge({
    star,
    challenge: "Cosmis Expansion",
    solutions: [fruitOne, fruitTwo],
    directory: path.dirname(fileURLToPath(import.meta.url)),
    opts: (entry) => entry.split(NEW_LINE)
  })
}

function fruitOne(grid) {
  return cosmicExpansion({ grid, EXPANSION_UNIT: 1 })
}

function fruitTwo(grid) {
  return cosmicExpansion({ grid, EXPANSION_UNIT: 1000000 - 1 })
}

function cosmicExpansion({ grid, EXPANSION_UNIT }) {
  let shortestPathTally = 0
  let rowExpansionCounter = 0
  let columnExpasionCounter = 0

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

run(() => init({ star: "both" }))
