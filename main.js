const WINDOW_WIDTH = 400;
const WINDOW_HEIGHT = 400;
const RELOAD_INTERVAL = 5000;

let walker;
let currentTime;
let lastMoveTime = 0; // Track the time of the last move
const MOVE_INTERVAL = 200; // Milliseconds between moves (adjust for speed)

const color = {
  line: { r: 0, g: 255, b: 255 }, // Cyan
  point: { r: 80, g: 255, b: 80 }, // Bright Lime Green
};

class Walker {
  static blockSize = 20;
  static direction = {
    // property for directions
    right: { dx: Walker.blockSize, dy: 0 },
    left: { dx: -Walker.blockSize, dy: 0 },
    down: { dx: 0, dy: Walker.blockSize },
    up: { dx: 0, dy: -Walker.blockSize },
  };

  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.prevX = this.x; // Add previous position tracking
    this.prevY = this.y;
    this.pointSize = floor(Walker.blockSize / 2);

    this.cols = floor(width / Walker.blockSize);
    this.rows = floor(height / Walker.blockSize);
    this.allPossibleMoves = [
      Walker.direction.right,
      Walker.direction.left,
      Walker.direction.down,
      Walker.direction.up,
    ];

    // Initialize arr to track visited cells
    this.arr = this._createGrid(false); // Set all cells to false(unvisited)

    this._setPositionTrue(this.x, this.y); //Set the start position to true

    this._drawPoint(this.x, this.y);
  }

  //------------------
  // Private methods
  //------------------
  _getGridIndices(x, y) {
    let i = floor(y / Walker.blockSize); // rows
    let j = floor(x / Walker.blockSize); // columns

    // Ensure indices are within bounds
    i = constrain(i, 0, this.rows - 1);
    j = constrain(j, 0, this.cols - 1);

    return { i, j }; // Return as an object
  }

  _setPositionTrue(x, y) {
    const { i, j } = this._getGridIndices(x, y);
    // Set arr[i][j] to true
    this.arr[i][j] = true;
  }
  _haveBeenInPosition(x, y) {
    const { i, j } = this._getGridIndices(x, y);
    return this.arr[i][j];
  }

  _createGrid(defaultValue) {
    return Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => defaultValue)
    );
  }

  //Draw a point at (x,y) position
  _drawPoint(x, y) {
    stroke(color.point.r, color.point.g, color.point.b);
    strokeWeight(this.pointSize);
    point(x, y);
  }

  //Draw a line between (this.prevX,this.prevY) and (this.x,this.y)
  _drawLine() {
    const lineWeight = 3;
    //  Draw Line
    stroke(color.line.r, color.line.g, color.line.b);
    strokeWeight(lineWeight);
    line(this.prevX, this.prevY, this.x, this.y);
  }

  //----------------
  // Public Methods
  //----------------
  display() {
    this._drawLine();

    // Draw the point
    this._drawPoint(this.x, this.y);
  }

  move() {
    let currentMoveOptions = [];
    for (let currentOption of this.allPossibleMoves) {
      let newX = this.x + currentOption.dx;
      let newY = this.y + currentOption.dy;
      if (!this._haveBeenInPosition(newX, newY)) {
        currentMoveOptions.push(currentOption);
      }
    }

    // If no valid moves are available, don't move
    if (currentMoveOptions.length === 0) {
      showStuckToast(); // Show Bootstrap Toast
      noLoop();
    } else {
      this.prevX = this.x;
      this.prevY = this.y;

      let direction = random(currentMoveOptions);

      this.x += direction.dx;
      this.y += direction.dy;
      // Constrain x and y to stay within canvas bounds
      this.x = constrain(this.x, 0, width - Walker.blockSize);
      this.y = constrain(this.y, 0, height - Walker.blockSize);
      this._setPositionTrue(this.x, this.y);
    }
  }
}

function resetCanvas() {
  background(0);
  walker = new Walker();
}

function setup() {
  createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
  resetCanvas();
}

function draw() {
  currentTime = millis();
  if (currentTime - lastMoveTime > MOVE_INTERVAL) {
    walker.move();
    walker.display();
    lastMoveTime = currentTime; // Update the time of the last move
  }
}

// Function to show the Bootstrap Toast
function showStuckToast() {
  const toastElement = document.getElementById("stuckToast");
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
}
