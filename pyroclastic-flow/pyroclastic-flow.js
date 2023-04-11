/*
  Tetris game simil
  
  empty cells are represented with dots
  non-empty cells are represented with hashes
  
  represent the board as an array of rows
  rows are array of empty and non-empty cells

  a board is then a two dimensional (2d) array, commonly known as a matrix
*/

const fs = require("fs/promises");
const path = require("path");

const ROCKS = {
  0: [["#", "#", "#", "#"]],
  1: [["·", "#", "·"], ["#", "#", "#"], ["·", "#", "·"]],
  2: [["·", "·", "#"], ["·", "·", "#"], ["#", "#", "#"]],
  3: [["#"], ["#"], ["#"], ["#"]],
  4: [["#", "#"], ["#", "#"]],
}

const rockFallingSimulation = {
  start: function() {
    let chamber = [];
    let rockCounter = 0;
    const ROCKS_TO_SIMULATE = 10;

    while (rockCounter <= ROCKS_TO_SIMULATE) {
      for (let i = 0; i <= Object.keys(ROCKS).length - 1; i++) {
        rockCounter++;
        if (rockCounter > ROCKS_TO_SIMULATE) break;

        rockFallingSimulation.addEmptyRows({ chamber, fallingRock: ROCKS[i] });

        // place rock in chamber
        // move rock in chamber using jet pattern
      }
    } 

    return 0;
  },
  addEmptyRows: function({ chamber, fallingRock }) {
    const EMPTY_ROWS_DEFAULT_QUANTITY = 3;
    const fallingRockRows = fallingRock.length;
    const numberOfRows = EMPTY_ROWS_DEFAULT_QUANTITY + fallingRockRows;

    const EMPTY_ROW = ["·", "·", "·", "·", "·", "·", "·"];

    for (let row = 1; row <= numberOfRows; row++) {
      chamber.unshift(EMPTY_ROW);
    };
  }
};

async function init() {
  // read puzzle input
  try {
    const filePath = path.join(__dirname, "/puzzle-input.txt");
    const data = await fs.readFile(filePath, { encoding: "utf-8" });
    const jetPattern = data.toString();

    const output = rockFallingSimulation.start();
    // console.log(output);
  } catch(error) {
    console.log(error)
  }
}

init();