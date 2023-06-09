const grid1 = [[1, 1, 1], [0, 0, 0], [0, 0, 0]];
const grid2 = [[0, 0, 0], [1, 1, 1], [0, 0, 0]];
const grid3 = [[0, 0, 0], [0, 0, 0], [1, 1, 1]];

function renderGrid(grid) {
  let row = "";
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      let cell = grid[i][j];
      row = `${row} ${cell}`
    }

    console.log(row);
    row = "";
  }
}

let i = 0;
function renderBoard() {
  if (i === 0) {
    renderGrid(grid1);
  } else if (i === 1) {
    console.clear();
    renderGrid(grid2);
  } else if (i === 2) {
    console.clear();
    renderGrid(grid3);
  } else {
    return;
  }
    
  i = i + 1;
  setTimeout(renderBoard, 1000);
}

renderBoard();