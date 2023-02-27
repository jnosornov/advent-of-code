// read puzzle input
const fs = require("fs/promises");
const path = require("path");

const aStar = {
  init: function(grid) {
    for (let x = 0; grid.length; x++) {
      for (let y = 0; grid[x].length; y++) {
        const node = grid[x][y];
        node.f = null;
        node.g = null;
        node.h = null;
        node.cost = 1;
        node.height = node;
        node.visited = false;
        node.closed = false;
        node.isWall = false;
        node.parent = null;
      }
    }
  },
  search: function({ grid, start, goal }) {
    aStar.init(grid);

    const openHeap = aStar.heap();
    openHeap.push(start);

    while (openHeap.size() > 0) {
      // find lowest f in open list.
      const node = openHeap.pop();

      // result has been found, return the traced path.
      if (node === goal) {
        const curr = node;
        const path = [];

        while (curr.parent) {
          path.push(curr);
          curr = curr.parent();
        }

        return path.reverse();
      }

      // push node to closed list, remove from open list.
      node.closed = true;
      const neighbors = aStar.neighbors({ grid, node });

      for (let i = 0; i <= neighbors.length; i++) {
        const neighbor = neighbors[i];

        if (neighbor.closed || neighbor.isWall) {
          continue;
        }

        const gScore = node.g + neighbor.cost;
        const beenVisited = neighbor.visited;

        if (!beenVisited || gScore < neighbor.g) {
          neighbor.visited = true;
          neighbor.parent = node;
          neighbor.h = neighbor.h || aStar.heuristic(start, goal);
          neighbor.g = gScore;
          neighbor.f = neighbor.g + neighbor.h;

          if (!beenVisited) {
            openHeap.push(neighbor);
          } else {
            openHeap.rescoreElement(neighbor);
          }
        }
      }
    }

    // failure to find path
    return [];
  },
  heuristic: function (start, end) {
    const dx = Math.abs(start.x - end.x);
    const dy = Math.abs(start.y - end.y);

    return dx + dy;
  },
  neighbors: function({ grid, node, diagonals_allowed = false }) {
    let neighborNodes;
    const { x, y } = node;

    // west
    if (grid[x - 1] && grid[x - 1][y]) {
      neighborNodes.push[grid[x - 1][y]]
    }

    // east
    if (grid[x + 1] && grid[x + 1][y]) {
      neighborNodes.push[grid[x + 1][y]]
    }

    // south
    if (grid[x] && grid[x][y - 1]) {
      neighborNodes.push[grid[x][y - 1]]
    }

    // north
    if (grid[x] && grid[x][y + 1]) {
      neighborNodes.push[grid[x][y + 1]]
    }

    if (diagonals_allowed) {
      // southwest
      if (grid[x - 1] && grid[x - 1][y - 1]) {
        neighborNodes.push[grid[x - 1][y - 1]]
      }

      // southeast
      if (grid[x + 1] && grid[x + 1][y - 1]) {
        neighborNodes.push[grid[x + 1][y - 1]]
      }

      // northwest
      if (grid[x - 1] && grid[x - 1][y + 1]) {
        neighborNodes.push[grid[x - 1][y + 1]]
      }

      // northeast
      if (grid[x + 1] && grid[x + 1][y + 1]) {
        neighborNodes.push[grid[x + 1][y + 1]]
      }
    }

    neighborNodes.forEach((neighbor) => {
      const MAX_ELEVATION_GAP = 1;

      const nodeHeight = node.height.charCodeAt(0);
      const neighborHeight = neighbor.height.charCodeAt(0);
      const isWall = (Math.abs(nodeHeight - neighborHeight)) > MAX_ELEVATION_GAP;
  
      if (!isWall) return;
      neighbor.height = true;
    });

    return neighborNodes;
  },
  heap: function() {
    return new PriorityQueue();
  }
}

class PriorityQueue {
  constructor() {
    this.items = [];
  }

  push(item) {
    this.items.push(item);
    this.bubbleUp();
  }

  bubbleUp() {
    let idx = this.items.length - 1;
    const element = this.values[idx];

    while(idx > 0) {
      let parentIdx = Math.floor((idx - 1)/ 2);
      let parent = this.values[parentIdx];

      if (element.f <= parent.f) break;

      this.values[parentIdx] = element;
      this.values[idx] = parent;

      idx = parentIdx;
    }
  }

  pop() {
    
  }
};

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