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
  const WORD_LENGTH = WORD_TO_SEARCH.length

  for (let row = 0; row <= puzzleInput.length - 1; row++) {
    const rowItem = puzzleInput[row]
    for (let column = 0; column <= rowItem.length - 1; ++column) {
      const letter = puzzleInput[row][column]
      if (letter !== WORD_TO_SEARCH[0]) continue

      // north
      if (puzzleInput[row - (WORD_LENGTH - 1)] && puzzleInput[row - (WORD_LENGTH - 1)][column]) {
        const word = `${puzzleInput[row][column]}${puzzleInput[row - 1][column]}${puzzleInput[row - 2][column]}${puzzleInput[row - 3][column]}`

        if (word === WORD_TO_SEARCH) {
          wordCounter++
        }
      }

      // south
      if (puzzleInput[row + (WORD_LENGTH - 1)] && puzzleInput[row + (WORD_LENGTH - 1)][column]) {
        const word = `${puzzleInput[row][column]}${puzzleInput[row + 1][column]}${puzzleInput[row + 2][column]}${puzzleInput[row + 3][column]}`

        if (word === WORD_TO_SEARCH) {
          wordCounter++
        }
      }

      // east
      if (puzzleInput[row] && puzzleInput[row][column + (WORD_LENGTH - 1)]) {
        const word = `${puzzleInput[row][column]}${puzzleInput[row][column + 1]}${puzzleInput[row][column + 2]}${puzzleInput[row][column + 3]}`

        if (word === WORD_TO_SEARCH) {
          wordCounter++
        }
      }

      // west
      if (puzzleInput[row] && puzzleInput[row][column - (WORD_LENGTH - 1)]) {
        const word = `${puzzleInput[row][column]}${puzzleInput[row][column - 1]}${puzzleInput[row][column - 2]}${puzzleInput[row][column - 3]}`

        if (word === WORD_TO_SEARCH) {
          wordCounter++
        }
      }

      // northeast
      if (puzzleInput[row - (WORD_LENGTH - 1)] && puzzleInput[row - (WORD_LENGTH - 1)][column + (WORD_LENGTH - 1)]) {
        const word = `${puzzleInput[row][column]}${puzzleInput[row - 1][column + 1]}${puzzleInput[row - 2][column + 2]}${puzzleInput[row - 3][column + 3]}`

        if (word === WORD_TO_SEARCH) {
          wordCounter++
        }
      }

      // northwest
      if (puzzleInput[row - (WORD_LENGTH - 1)] && puzzleInput[row - (WORD_LENGTH - 1)][column - (WORD_LENGTH - 1)]) {
        const word = `${puzzleInput[row][column]}${puzzleInput[row - 1][column - 1]}${puzzleInput[row - 2][column - 2]}${puzzleInput[row - 3][column - 3]}`

        if (word === WORD_TO_SEARCH) {
          wordCounter++
        }
      }

      // southeast
      if (puzzleInput[row + (WORD_LENGTH - 1)] && puzzleInput[row + (WORD_LENGTH - 1)][column + (WORD_LENGTH - 1)]) {
        const word = `${puzzleInput[row][column]}${puzzleInput[row + 1][column + 1]}${puzzleInput[row + 2][column + 2]}${puzzleInput[row + 3][column + 3]}`

        if (word === WORD_TO_SEARCH) {
          wordCounter++
        }
      }

      // southwest
      if (puzzleInput[row + (WORD_LENGTH - 1)] && puzzleInput[row + (WORD_LENGTH - 1)][column - (WORD_LENGTH - 1)]) {
        const word = `${puzzleInput[row][column]}${puzzleInput[row + 1][column - 1]}${puzzleInput[row + 2][column - 2]}${puzzleInput[row + 3][column - 3]}`

        if (word === WORD_TO_SEARCH) {
          wordCounter++
        }
      }
    }
  }

  return wordCounter
}

run(() => init({ star: "1" }))
