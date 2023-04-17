const COLUMNS = 7;
const ROWS = 3;

class RockFallingSimulation {
  constructor(jetPattern) {
    this.fallingRock = null;
    this.grid = this.setGrid();
    this.jetPattern = jetPattern;
    this.patternPosition = 0;
  }

  setGrid() {
    let grid = [];
    for (let i = 0; i < ROWS; i++) {
      grid.push([]);
      for (let j = 0; j < COLUMNS; j++) {
        grid[grid.length - 1].push(0);
      }
    }

    return grid;
  }

  collision(x, y) {
    const shape = this.fallingRock.shape;
    const rockRows = shape.length;
    const rockColumns = shape[0].length;

    for (let i = 0; i < rockRows; i++) {
      for (let j = 0; j < rockColumns; j++) {
        if (shape[i][j] > 0) {
          let p = x + j;
          let q = y + i;

          if (p >= 0 && p < COLUMNS && q < ROWS) {
            if (this.grid[q][p] > 0) {
              return true;
            }
          } else {
            return true;
          }
        }
      }
    }

    return false;
  }

  moveRock() {
    if (this.fallingRock === null) return;
    moveSequence();

    function moveSequence() {
      let x = this.fallingRock.x;
      let y = this.fallingRock.y;
      const direction = this.jetPattern[this.patternPosition];

      const shouldStartOffPatternAgain = this.patternPosition + 1 === this.jetPattern.length; 
      position = shouldStartOffPatternAgain ? 0 : position + 1;

      if (direction === ">") {
        // move right
        this.patternPosition = this.patternPosition + 1;

        if (!this.collision(x + 1, y)) {
          this.fallingRock.x = this.fallingRock.x + 1;
          // render board and wait some time
        }
      }

      if (direction === "<") {
        // move left
        this.patternPosition = this.patternPosition + 1;

        if (!this.collision(x - 1, y)) {
          this.fallingRock.x = this.fallingRock.x - 1;
          // render board and wait some time
        }
      }

      // move down
      if (this.collision(x, y + 1)) return;

      this.fallingRock.y = this.fallingRock.y + 1;
      // render board and wait some time
      moveSequence();
    }
  }

  renderGridState() {
    let row = "";
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        let cell = this.grid[i][j];
        row = `${row} ${cell}`
      }

      console.log(row);
      row = "";
    }

    if (this.fallingRock !== null) {
      this.fallingRock.render(this.grid)
    }
  }
}

class Rock {
  constructor(shape) {
    this.shape = shape;
    this.y = 0;
    this.x = 2;
  }

  render(grid) {
    const DEFAULT_ROWS = 3;
    const rockRows = this.shape.length;
    const rowsToAdd = DEFAULT_ROWS + rockRows;

    for (let i = 1; i < rowsToAdd; i++) {
      const row = new Array(COLUMNS);
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


const simulation = new RockFallingSimulation()
simulation.renderGridState();