// read puzzle input
const fs = require("fs/promises");
const path = require("path");

const aStar = {
  init: function(grid) {
    for (let x = 0; x < grid.length; x++) {
      for (let y = 0; y < grid[x].length; y++) {
        const node = grid[x][y];
        node.f = null;
        node.g = null;
        node.h = null;
        node.cost = 1;
        node.visited = false;
        node.closed = false;
        node.isWall = false;
        node.parent = null;
        node.debug = "";
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
      if (node.x == goal.x && node.y == goal.y) {
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
      console.log("NEIGHBOR NODES");
      console.log(neighbors);

 
      for (let i = 0; i <= neighbors.length - 1; i++) {
        const neighbor = neighbors[i];

        if (neighbor.closed || neighbor.isWall) {
          continue;
        }

        console.log("-------------------------------------");
        console.log("node gScore", node.g);
        console.log("neighbor gScore", neighbor.cost);
        const gScore = node.g || 0 + neighbor.cost;
        const beenVisited = neighbor.visited;

        if (!beenVisited || gScore < neighbor.g) {
          console.log("has not been visited", !beenVisited);
          console.log("is node g score less than neighbors", gScore < neighbor.g);
          console.log("g score", gScore);
          neighbor.visited = true;
          neighbor.parent = node;
          neighbor.h = neighbor.h || aStar.heuristic(start, goal);
          neighbor.g = gScore;
          neighbor.f = neighbor.g + neighbor.h;

          console.log("F:" + neighbor.f, "G:" + neighbor.g, "H:" + neighbor.h);

          if (!beenVisited) {
            openHeap.push(neighbor);
          } else {
            openHeap.rescoreElement(neighbor);
          }
        }
      }
      console.log("-------------------------------------");
      console.log("\r")
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
    let neighborNodes = [];
    const { x, y } = node;

    // west
    if (grid[x - 1] && grid[x - 1][y]) {
      neighborNodes.push(grid[x - 1][y]);
    }

    // east
    if (grid[x + 1] && grid[x + 1][y]) {
      neighborNodes.push(grid[x + 1][y]);
    }

    // south
    if (grid[x] && grid[x][y - 1]) {
      neighborNodes.push(grid[x][y - 1]);
    }

    // north
    if (grid[x] && grid[x][y + 1]) {
      neighborNodes.push(grid[x][y + 1]);
    }

    if (diagonals_allowed) {
      // southwest
      if (grid[x - 1] && grid[x - 1][y - 1]) {
        neighborNodes.push(grid[x - 1][y - 1]);
      }

      // southeast
      if (grid[x + 1] && grid[x + 1][y - 1]) {
        neighborNodes.push(grid[x + 1][y - 1]);
      }

      // northwest
      if (grid[x - 1] && grid[x - 1][y + 1]) {
        neighborNodes.push(grid[x - 1][y + 1]);
      }

      // northeast
      if (grid[x + 1] && grid[x + 1][y + 1]) {
        neighborNodes.push(grid[x + 1][y + 1]);
      }
    }

    neighborNodes.forEach((neighbor) => {
      const MAX_ELEVATION_GAP = 1;

      const nodeHeight = node.height.charCodeAt(0);
      const neighborHeight = neighbor.height.charCodeAt(0);
      const isWall = (Math.abs(nodeHeight - neighborHeight)) > MAX_ELEVATION_GAP;
  
      if (!isWall) return;
      neighbor.isWall = true;
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
    const element = this.items[idx];

    while(idx > 0) {
      let parentIdx = Math.floor((idx - 1)/ 2);
      let parent = this.items[parentIdx];

      if (element.f <= parent.f) break;

      this.items[parentIdx] = element;
      this.items[idx] = parent;

      idx = parentIdx;
    }
  }

  pop() {
    const max = this.items[0];
    const end = this.items.pop();

    if (this.items.length > 0) {
      this.items[0] = end;
      this.sinkDown();
    }

    return max;
  }

  sinkDown() {
    let idx = 0;
    const length = this.items.length;
    const element = this.items[0];
    while (true) {
      let leftChildIdx = 2 * idx + 1;
      let rightChildIdx = 2 * idx + 2;
      let leftChild, rightChild;
      let swap = null;
  
      if (leftChildIdx < length) {
        leftChild = this.items[leftChildIdx];
        if (leftChild > element) {
          swap = leftChildIdx;
        }
      }
      if (rightChildIdx < length) {
        rightChild = this.items[rightChildIdx];
        if (
          swap === null && rightChild > element ||
          swap !== null && rightChild > leftChild
        ) {
          swap = rightChildIdx;
        }
      }
  
      if (swap === null) break;
      this.items[idx] = this.items[swap];
      this.items[swap] = element;
      idx = swap;
    }
  }

  size() {
    return this.items.length;
  }
};

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
      grid[col].push({ x: parseInt(col), y: row, height: gridPoint });

      if (gridPoint == START_POSITION_ID) {
        start = { x: parseInt(col), y: row, height: 'a' };
      }

      if (gridPoint == GOAL_POSITION_ID) {
        goal = { x: parseInt(col) , y: row, height: 'z' };
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
    const shortestPathToGoal = aStar.search({ grid, start, goal });
    // console.log(goal);
    // console.log(shortestPathToGoal);
    // console.log(shortestPathToGoal.length)
  } catch(error) {
    console.log(error);
  }
}

init();