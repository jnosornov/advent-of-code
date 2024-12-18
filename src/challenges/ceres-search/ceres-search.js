import path from "path"
import { fileURLToPath } from "url"
import { run, runChallenge } from "../../helpers/general.js"
import { splitByEndOfLine } from "../../helpers/tools.js"

export default async function init({ star }) {
  return await runChallenge({
    star,
    challenge: "Ceres Search",
    solutions: [starOne],
    directory: path.dirname(fileURLToPath(import.meta.url)),
    opts: (puzzleInput) => splitByEndOfLine(puzzleInput)
  })
}

function starOne(puzzleInput) {
  let wordCounter = 0
  const WORD_TO_SEARCH = "XMAS"

  for (let x = 0; x <= puzzleInput.length - 1; x++) {
    const rowItem = puzzleInput[x]
    for (let y = 0; y <= rowItem.length - 1; y) {
      const letter = puzzleInput[x][y]
      if (letter !== WORD_TO_SEARCH[0]) return

      const neighbors = getNeighbors({ grid: puzzleInput, node: { x, y }, withOrdinalPoints: true })
      wordCounter = wordCounter + (neighbors.filter((word) => word !== WORD_TO_SEARCH)?.length || 0)
    }
  }
}

function getNeighbors({ grid, node, withOrdinalPoints = false }) {
  const neighbors = []
  const { x, y } = node

  // north
  if (grid[x] && grid[x][y + 1]) {
    neighbors.push(grid[x][y + 1])
  }

  // east
  if (grid[x + 1] && grid[x + 1][y]) {
    neighbors.push(grid[x + 1][y])
  }

  // south
  if (grid[x] && grid[x][y - 1]) {
    neighbors.push(grid[x][y + 1])
  }

  // west
  if (grid[x - 1] && grid[x - 1][y]) {
    neighbors.push(grid[x - 1][y])
  }

  if (withOrdinalPoints) {
    // northeast
    if (grid[x + 1] && grid[x + 1][y + 1]) {
      neighbors.push(grid[x + 1][y + 1])
    }

    // southeast
    if (grid[x + 1] && grid[x + 1][y - 1]) {
      neighbors.push(grid[x + 1][y - 1])
    }

    // southwest
    if (grid[x - 1] && grid[x - 1][y - 1]) {
      neighbors.push(grid[x - 1][y - 1])
    }

    if (grid[x - 1] && grid[x - 1][y + 1]) {
      neighbors.push(grid[x - 1][y + 1])
    }
  }

  return neighbors
}

run(() => init({ star: "1" }))
