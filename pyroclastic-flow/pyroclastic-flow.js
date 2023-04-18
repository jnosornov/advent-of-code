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

        if (rockCounter < 2) {
          const rock = new Rock(ROCKS[i]);
          this.fallingRock = rock;
          rock.place(this.grid)
          this.renderGrid();
          this.moveRock();
        }
      }
    }
  }

  collision(x, y) {
    const shape = this.fallingRock.shape;
    const rockRows = shape.length;
    const rockColumns = shape[0].length;
  
    for (let i = 0; i < rockRows; i++) {
      for (let j = 0; j < rockColumns; j++) {
        if (shape[i][j] > 0) {
          let p = y + j;
          let q = x + i;

          if (p >= 0 && p < GRID_COLUMNS && q < this.grid.length) {
            // in bounds
            console.log("debugging collisions here...");
            if (this.grid[q][p] > 0) {
              return true;
            }
          } else {
            // is not in bounds, rock collision with walls
            return true;
          }
        }
      }
    }

    return false;
  }

  moveRock() {
    if (this.fallingRock === null) return;
  
    const moveSequence = () => {
      let x = this.fallingRock.x;
      let y = this.fallingRock.y;
      const direction = this.jetPattern[this.patternPosition];

      const shouldStartOffPatternAgain = this.patternPosition + 1 > this.jetPattern.length; 
      this.patternPosition = shouldStartOffPatternAgain ? 0 : this.patternPosition + 1;

      if (direction === ">") {
        // move right
        if (!this.collision(x, y + 1)) {
          this.fallingRock.x = this.fallingRock.x + 1;
          // render board and wait some time
          this.fallingRock.render(this.grid);
          this.renderGrid();
        }
      }

      if (direction === "<") {
        // move left
        if (!this.collision(x, y - 1)) {
          this.fallingRock.x = this.fallingRock.x - 1;
          // render board and wait some time
          this.fallingRock.render(this.grid);
          this.renderGrid();
        }
      }

      // move down
      /*
        if (this.collision(x, y + 1)) {
          this.rockTowerHeight = this.grid.length - this.fallingRock.y;
          this.fallingRock = null;
          return;
        }

        this.fallingRock.y = this.fallingRock.y + 1;
        this.fallingRock.render(this.grid);
        this.renderGrid();
      */
      // render board and wait some time
      // moveSequence();
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
  }

  place(grid) {
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