const GRID_COLUMNS = 7;
const GRID_ROWS = 0;

const ROCKS = [
  [
    [1, 1, 1, 1]
  ],
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
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
  constructor({ rocksToFall, jetPattern }) {
    this.fallingRock = null;
    this.grid = [];
    this.patternPosition = 0;
    this.rockTowerHeight = 0;
    this.jetPattern = jetPattern;
    this.rocksToFall = rocksToFall;
  }

  run() {
    console.log("rocks will start falling...");
    let rockCounter = 0;

    while (rockCounter + 1 <= this.rocksToFall) {
      for (let i = 0; i < ROCKS.length; i++) {
        rockCounter = rockCounter + 1;

        if (rockCounter > this.rocksToFall) break;

        if (rockCounter < 3) {
          const rock = new Rock(ROCKS[i]);
          this.fallingRock = rock;
          rock.render(this.grid)
          this.renderGrid();
          this.moveRock();
        }
      }
    }
  }

  collision(x, y) {
    const xDiff = this.fallingRock.x - x;
    const yDiff = this.fallingRock.y - y;
    const shape = this.fallingRock.shape;
    const rockRows = shape.length;
    const rockColumns = shape[0].length;

    // out of bounds
    if (y < 0 || y + rockColumns > GRID_COLUMNS || x > this.grid.length - 1) {
      return true;
    }

    const hasMovedToLeft = yDiff === 1;
    const hasMovedToRight = yDiff === -1;
    const hasMovedDown = xDiff === -1;

    if (hasMovedToRight) {
      for (let i = 0; i < rockRows; i++) {
        if (this.grid[x + i][y + (rockColumns - 1) - 1] > 0 && this.grid[x + i][y + (rockColumns - 1)] > 0) {
          return true;
        }
      }
    }

    if (hasMovedToLeft) {
      for (let i = 0; i < rockRows; i++) {
        if (this.grid[x + i][y + 1] > 0 && this.grid[x + i][y] > 0) {
          return true;
        }
      }
    }

    if (hasMovedDown) {
      for (let j = 0; j < rockColumns; j++) {
        if (this.grid[x + (rockRows - 1) - 1][y + j] > 0 && this.grid[x + (rockRows - 1)][y + j] > 0) {
          return true;
        }
      }
    }

    return false;
  }

  moveRock() {
    if (this.fallingRock === null) return;
  
    const moveSequence = () => {
      const direction = this.jetPattern[this.patternPosition];
      const shouldStartOffPatternAgain = this.patternPosition + 1 > this.jetPattern.length; 
      this.patternPosition = shouldStartOffPatternAgain ? 0 : this.patternPosition + 1;

      if (direction === ">") {
        // move right
        console.log("moving rock...to the right");
        if (!this.collision(this.fallingRock.x, this.fallingRock.y + 1)) {
          this.fallingRock.clear(this.grid);
          this.fallingRock.y = this.fallingRock.y + 1;
          this.fallingRock.render(this.grid);
          this.renderGrid();
        }
      }

      if (direction === "<") {
        // move left
        console.log("moving rock...to the left");
        if (!this.collision(this.fallingRock.x, this.fallingRock.y - 1)) {
          this.fallingRock.clear(this.grid);
          this.fallingRock.y = this.fallingRock.y - 1;
          this.fallingRock.render(this.grid);
          this.renderGrid();
        }
      }

      if (this.collision(this.fallingRock.x + 1, this.fallingRock.y)) {
        console.log("collision with floor");
        this.rockTowerHeight = this.grid.length - this.fallingRock.y;
        this.fallingRock = null;
        return;
      }

      console.log("moving rock...down");
      this.fallingRock.clear(this.grid);
      this.fallingRock.x = this.fallingRock.x + 1;
      this.fallingRock.render(this.grid);
      this.renderGrid();

      moveSequence();
    }

    moveSequence();
  }

  renderGrid() {
    let row = "";
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        let cell = this.grid[i][j];
        row = `${row} ${cell}`
      }

      console.log(row);
      row = "";
    }
  }
}

class Rock {
  constructor(shape) {
    this.shape = shape;
    this.x = 0;
    this.y = 2;
    this.isFalling = false;
  }

  clear(grid) {
    this.shape.map((row, i) => {
      row.map((cell, j) => {
        if (cell > 0) {
          grid[this.x + i][this.y + j] = 0;
        }
      })
    })
  }

  render(grid) {
    if (this.isFalling) {
      this.shape.map((row, i) => {
        row.map((cell, j) => {
          if (cell > 0) {
            grid[this.x + i][this.y + j] = 1;
          }
        })
      })

      return;
    }

    this.isFalling = true;

    const DEFAULT_ROWS = 3;
    const rockRows = this.shape.length;
    const rowsToAdd = DEFAULT_ROWS + rockRows;

    for (let i = 1; i <= rowsToAdd; i++) {
      const row = new Array(GRID_COLUMNS);
      row.fill(0);

      grid.unshift(row);
    }

    this.shape.map((row, i) => {
      row.map((cell, j) => {
        if (cell > 0) {
          grid[this.x + i][this.y + j] = 1;
        }
      })
    })
  }
}

(function main() {
  const simulation = new RockFallingSimulation({
    rocksToFall: 10,
    jetPattern: ">>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>",
  });

  simulation.run();
})();