// read puzzle input
const fs = require("fs/promises");
const path = require("path");

const a_star = {
  init: function(grid) {
    for (let x = 0; grid.length; x++) {
      for (let y = 0; grid[x].length; y++) {
        const node = grid[x][y];
        node.f = null;
        node.g = null;
        node.h = null;
        node.cost = 1;
        node.visited = false;
        node.closed = false;
        node.parent = null;
      }
    }
  },
  search: function({ grid, start, end }) {
    a_star.init(grid);

    const open_list = [];
    const closed_list = [];
    open_list.push(start);

    while (open_list.length > 0) {
      open_list.sort((a, b) => a - b);
      const current_node = open_list.shift();

      if (current_node == end) {
        
      }


    }
  },
  heuristic: function (start, end) {
    const dx = Math.abs(start.x - end.x);
    const dy = Math.abs(start.y - end.y);

    return dx + dy;
  },
  neighbors: function({ grid, node, diagonals_allowed }) {
    let neighbor_nodes;
    const { x, y } = node;

    // west
    if (grid[x - 1] && grid[x - 1][y]) {
      neighbor_nodes.push[grid[x - 1][y]]
    }

    // east
    if (grid[x + 1] && grid[x + 1][y]) {
      neighbor_nodes.push[grid[x + 1][y]]
    }

    // south
    if (grid[x] && grid[x][y - 1]) {
      neighbor_nodes.push[grid[x][y - 1]]
    }

    // north
    if (grid[x] && grid[x][y + 1]) {
      neighbor_nodes.push[grid[x][y + 1]]
    }

    if (diagonals_allowed) {
      // southwest
      if (grid[x - 1] && grid[x - 1][y - 1]) {
        neighbor_nodes.push[grid[x - 1][y - 1]]
      }

      // southeast
      if (grid[x + 1] && grid[x + 1][y - 1]) {
        neighbor_nodes.push[grid[x + 1][y - 1]]
      }

      // northwest
      if (grid[x - 1] && grid[x - 1][y + 1]) {
        neighbor_nodes.push[grid[x - 1][y + 1]]
      }

      // northeast
      if (grid[x + 1] && grid[x + 1][y + 1]) {
        neighbor_nodes.push[grid[x + 1][y + 1]]
      }
    }

    return neighbor_nodes.filter((neighbor) => a_star.isWall({ grid, node, neighbor }));
  },
  isWall: function ({ grid, node, neighbor }) {
    const MAX_ELEVATION_GAP = 1;

    const node_height_ascii = grid[node.x][node.y].charCodeAt(0);
    const neighbor_height_ascii = grid[neighbor.x][neighbor.y].charCodeAt(0);

    return (Math.abs(node_height_ascii - neighbor_height_ascii)) > MAX_ELEVATION_GAP;
  }
}


/*

// define heuristic funtion - Manhattan distance
function heuristic({ state, goal }) {
  const dx = Math.abs(state.x - goal.x);
  const dy = Math.abs(state.y - goal.y);

  return dx + dy;
}

// check if neighbor is an obstacle
function isObstacle(parent, neighbor, grid) {
  const START_POSITION_ID = "S";
  const GOAL_POSITION_ID = "E";

  const parentValue = grid[parent.x][parent.y] == START_POSITION_ID ? "a" : grid[parent.x][parent.y];
  const neighborValue = grid[neighbor.x][neighbor.y] == GOAL_POSITION_ID ? "z" : grid[neighbor.x][neighbor.y];

  return (parentValue.charCodeAt(0) - neighborValue.charCodeAt(0)) > 1;
}

// get neighbors of a node
function getNeighbors(state, grid) {
  const neighbors = [];
  const gridWidth = grid.length;
  const gridHeight = grid[0].length;

  if (state.x > 0) {
    if (!isObstacle(state, { x: state.x - 1, y: state.y }, grid)) {
      neighbors.push({
        state: { x: state.x - 1, y: state.y },
        cost: 1
      })
    }
  }

  if (state.y > 0) {
    if (!isObstacle(state, { x: state.x, y: state.y - 1 }, grid)) {
      neighbors.push({
        state: { x: state.x, y: state.y - 1 },
        cost: 1
      })
    }
  }

  if (state.x < gridWidth) {
    if(!isObstacle(state, { x: state.x + 1, y: state.y }, grid)) {
      neighbors.push({
        state: { x: state.x + 1, y: state.y },
        cost: 1
      })
    }
  }

  if (state.y < gridHeight) {
    if (!isObstacle(state, { x: state.x, y: state.y + 1 }, grid)) {
      neighbors.push({
        state: { x: state.x, y: state.y + 1 },
        cost: 1
      })
    }
  }

  return neighbors;
}

// define A* search function
function aStar(start, goal, grid) {
  const explored = [];
  const beingExplored = [{
    state: start,
    cost: 0,
    estimate: heuristic({ state: start, goal })
  }];

  while(beingExplored.length > 0) {
    beingExplored.sort((a, b) => a.estimate - b.estimate);

    const node = beingExplored.shift();
    explored.push(node);

    if (node.state.x == goal.x && node.state.y == goal.y) {
      return explored;
    }
    
    const neighbors = getNeighbors(node.state, grid);

    for (let i = 0; i < neighbors.length; i++) {
      const step = neighbors[i];
      const cost = node.cost + step.cost;

      const hasBeenExplored = explored.find(e => {
        return e.state.x == step.state.x && e.state.y == step.state.y;
      })

      const isBeingExplored = beingExplored.find(e => {
        return e.state.x == step.state.x && e.state.y == step.state.y;
      })

      if (!hasBeenExplored || !isBeingExplored) {
        const { state } = step;
        beingExplored.push({
          state,
          cost,
          estimate: cost + heuristic({ state, goal })
        })
      }
    }
  }

  return null;
}

// set 2d array to represent grid
function setHeighmap(puzzleInput) {
  let start;
  let goal;
  let grid = [];

  const START_POSITION_ID = "S";
  const GOAL_POSITION_ID = "E"; 

  for (col in puzzleInput[0]) {
    for (let row = 0; row < puzzleInput.length; row++) {
      if (!grid[col]) {
        grid[col] = [];
      }

      const gridPoint = puzzleInput[row][col];
      grid[col].push(gridPoint);

      if (gridPoint == START_POSITION_ID) {
        start = { x: parseInt(col), y: row }
      }

      if (gridPoint == GOAL_POSITION_ID) {
        goal = { x: parseInt(col) , y: row }
      }
    }
  }

  return { start, goal, grid };
}

// main
async function init() {
  try {
    const filePath = path.join(__dirname, "/puzzle-input.txt");
    const data = await fs.readFile(filePath, { encoding: "utf-8" });
    const puzzleInput = data.split("\n");

    const { start, goal, grid } = setHeighmap(puzzleInput);
    const shortestPathToGoal = aStar(start, goal, grid);
    console.log(shortestPathToGoal);
    console.log(shortestPathToGoal.length)
  } catch(error) {
    console.log(error);
  }
}

init();
*/