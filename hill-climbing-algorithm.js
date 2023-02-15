// read puzzle input
const fs = require("fs/promises");
const path = require("path");

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
  } catch(error) {
    console.log(error);
  }
}

init();