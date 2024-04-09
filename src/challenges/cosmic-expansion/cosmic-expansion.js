import { run } from "../../helpers/general.js"
import { getFileContent } from "../../helpers/file.js"
import { NEW_LINE } from "../../constants.js"

export default async function init({ fruit }) {
  const filename = process.env.NODE_ENV !== "test"
    ? "./input.sample.txt"
    : "./input.txt"

  // >> read from file
  const { contents: grid } = await getFileContent({
    path: new URL(filename, import.meta.url),
    opts: (entry) => entry.split(NEW_LINE)
  })

  const universe = []
  const galaxies = []
  const galaxiesMap = new Map()

  // >> store using an adjacency list
  for (let row = 0; row <= grid.length - 1; row++) {
    const ROW_LENGTH = grid[0].length

    for (let column = 0; column <= ROW_LENGTH - 1; column++) {
      const IS_GALAXY = grid[row][column] === "#"

      if (IS_GALAXY) {
        const galaxy = galaxiesMap.size + 1
        galaxies.push(galaxy)
        galaxiesMap.set(galaxy, { x: row, y: column })
      }

      universe.push({ x: row, y: column, neighbors: findNeighbors({ row, column, grid }) })
    }
  }

  const galaxyPairs = getGalaxyPairs(galaxies)

  console.log("GALAXIES")
  console.log(galaxies)

  console.log("GALAXY PAIRS")
  console.log(galaxyPairs.length)

  console.log("GALAXIES MAP")
  console.log(galaxiesMap)

  console.log("UNIVERSE")
  console.log(universe)
}

const findNeighbors = ({ row, column, grid }) => {
  const neighbors = []

  // west
  if (grid[row][column - 1]) {
    const neighborIdx = computeNeighborIdx({ row, column: column - 1, grid })
    neighbors.push(neighborIdx)
  }

  // east
  if (grid[row][column + 1]) {
    const neighborIdx = computeNeighborIdx({ row, column: column + 1, grid })
    neighbors.push(neighborIdx)
  }

  // north
  if (grid[row - 1] && grid[row - 1][column]) {
    const neighborIdx = computeNeighborIdx({ row: row - 1, column, grid })
    neighbors.push(neighborIdx)
  }

  // south
  if (grid[row + 1] && grid[row + 1][row]) {
    const neighborIdx = computeNeighborIdx({ row: row + 1, column, grid })
    neighbors.push(neighborIdx)
  }

  return neighbors
}

const computeNeighborIdx = ({ row, column, grid }) => {
  const ROW_LENGTH = grid[0].length

  const rows = row + 1
  const columns = column + 1

  return (rows * ROW_LENGTH) - (ROW_LENGTH - columns)
}

const getGalaxyPairs = (galaxies) => {
  const pairs = []

  for (let i = 0; i < galaxies.length - 1; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      const galaxy = galaxies[i]
      const galaxyPair = galaxies[j]

      pairs.push([galaxy, galaxyPair])
    }
  }

  return pairs
}

run(() => init({ fruit: "both" }))
