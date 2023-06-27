// TODO: have a look at this rule
/* eslint-disable array-callback-return */
import { getFileContent } from "../../helpers/file.js"

const GRID_COLUMNS = 7

const ROCKS = [
  [
    [1, 1, 1, 1]
  ],
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0]
  ],
  [
    [0, 0, 1],
    [0, 0, 1],
    [1, 1, 1]
  ],
  [
    [1],
    [1],
    [1],
    [1]
  ],
  [
    [1, 1],
    [1, 1]
  ]
]

class RockFallingSimulation {
  constructor ({ rocksToFall, jetPattern }) {
    this.fallingRock = null
    this.grid = []
    this.patternPosition = 0
    this.rockTowerHeight = 0
    this.jetPattern = jetPattern
    this.rocksToFall = rocksToFall
  }

  run () {
    let rockCounter = 0

    while (rockCounter + 1 <= this.rocksToFall) {
      for (let i = 0; i < ROCKS.length; i++) {
        rockCounter = rockCounter + 1

        if (rockCounter > this.rocksToFall) break

        const rock = new Rock(ROCKS[i])
        this.fallingRock = rock
        rock.render(this.grid)
        this.moveRock()
      }
    }

    console.log("tower height", this.rockTowerHeight)
    console.log("number of rocks", rockCounter - 1)
  }

  collision (x, y) {
    const xDiff = this.fallingRock.x - x
    const yDiff = this.fallingRock.y - y
    const shape = this.fallingRock.shape
    const rockRows = shape.length
    const rockColumns = shape[0].length

    // out of bounds
    if (y < 0 || (y + rockColumns) > GRID_COLUMNS || (x + rockRows) > this.grid.length) {
      return true
    }

    const hasMovedToLeft = yDiff === 1
    const hasMovedToRight = yDiff === -1
    const hasMovedDown = xDiff === -1

    if (hasMovedToRight) {
      for (let i = 0; i < rockRows; i++) {
        if (this.grid[x + i][y + (rockColumns - 1) - 1] > 0 && this.grid[x + i][y + (rockColumns - 1)] > 0) {
          return true
        }
      }
    }

    if (hasMovedToLeft) {
      for (let i = 0; i < rockRows; i++) {
        if (this.grid[x + i][y + 1] > 0 && this.grid[x + i][y] > 0) {
          return true
        }
      }
    }

    if (hasMovedDown) {
      for (let j = 0; j < rockColumns; j++) {
        if (this.grid[x + (rockRows - 1) - 1][y + j] > 0 && this.grid[x + (rockRows - 1)][y + j] > 0) {
          return true
        }
      }
    }

    return false
  }

  moveRock () {
    if (this.fallingRock === null) return

    const moveSequence = () => {
      const direction = this.jetPattern[this.patternPosition]
      const shouldStartOffPatternAgain = this.patternPosition + 2 > this.jetPattern.length
      this.patternPosition = shouldStartOffPatternAgain ? 0 : this.patternPosition + 1

      if (direction === ">") {
        // move right
        if (!this.collision(this.fallingRock.x, this.fallingRock.y + 1)) {
          this.fallingRock.clear(this.grid)
          this.fallingRock.y = this.fallingRock.y + 1
          this.fallingRock.render(this.grid)
          // this.renderGrid();
        }
      }

      if (direction === "<") {
        // move left
        if (!this.collision(this.fallingRock.x, this.fallingRock.y - 1)) {
          this.fallingRock.clear(this.grid)
          this.fallingRock.y = this.fallingRock.y - 1
          this.fallingRock.render(this.grid)
          // this.renderGrid();
        }
      }

      if (this.collision(this.fallingRock.x + 1, this.fallingRock.y)) {
        const currentRockTowerHeight = this.grid.length - this.fallingRock.x
        if (this.rockTowerHeight < currentRockTowerHeight) {
          this.rockTowerHeight = currentRockTowerHeight
        }

        const rowsToDelete = this.grid.length - this.rockTowerHeight

        for (let i = 0; i < rowsToDelete; i++) {
          this.grid.shift()
        }

        this.fallingRock = null
        return
      }

      this.fallingRock.clear(this.grid)
      this.fallingRock.x = this.fallingRock.x + 1
      this.fallingRock.render(this.grid)
      // this.renderGrid();

      moveSequence()
    }

    moveSequence()
  }

  renderGrid () {
    let row = ""
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        const cell = this.grid[i][j]
        row = `${row} ${cell}`
      }

      console.log(row)
      row = ""
    }
  }
}

class Rock {
  constructor (shape) {
    this.shape = shape
    this.x = 0
    this.y = 2
    this.isFalling = false
  }

  clear (grid) {
    this.shape.map((row, i) => {
      row.map((cell, j) => {
        if (cell > 0) {
          grid[this.x + i][this.y + j] = 0
        }
      })
    })
  }

  render (grid) {
    if (this.isFalling) {
      this.shape.map((row, i) => {
        row.map((cell, j) => {
          if (cell > 0) {
            grid[this.x + i][this.y + j] = 1
          }
        })
      })

      return
    }

    this.isFalling = true

    const DEFAULT_ROWS = 3
    const rockRows = this.shape.length
    const rowsToAdd = DEFAULT_ROWS + rockRows

    for (let i = 1; i <= rowsToAdd; i++) {
      const row = new Array(GRID_COLUMNS)
      row.fill(0)

      grid.unshift(row)
    }

    this.shape.map((row, i) => {
      row.map((cell, j) => {
        if (cell > 0) {
          grid[this.x + i][this.y + j] = 1
        }
      })
    })
  }
}

(async function main () {
  const contents = await getFileContent({
    path: new URL("./puzzle-input.txt", import.meta.url)
  }).catch((error) => console.log(error))

  const puzzleInput = contents.toString()
  const simulation = new RockFallingSimulation({
    rocksToFall: 2022,
    jetPattern: puzzleInput
  })

  simulation.run()
})()
