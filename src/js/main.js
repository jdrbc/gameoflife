// Initialize global variables
// Grid background color
window.backgroundColor = "#000000";

// Grid line color
window.gridColor = "#d3d3d3";

// Live cell color
window.cellColor = "#ffff00";

// Number of cells in the horizontal rows
window.numCellsX = 50;

// Number of cells in the vertical rows
window.numCellsY = 50;

// Boolean tracking whether the game is paused or not
window.playGame = true;

// Boolean tracking whether the mouse is being held down
window.mouseDown = false;

// Object tracking grid coordinates of the last cell clicked or touched by the user
window.lastCellClicked = null;

// Set up and start the game
function init() {
    // Draw the game board
    drawGrid();

    // Initialize the grid with dead/alive cells
    window.grid = [];
    for (var i = 0; i < numCellsX; i++) {
        grid[i] = [];
        for (var j = 0; j < numCellsY; j++) {
            // Assign state to the cell
            grid[i][j] = false; //(Math.random() < 0.5);
        }
    }

    // Draw the cells on the grid
    drawCells();

    // Redraw the grid when the window is resized
    window.addEventListener("resize",
        function() {
            drawGrid();
            drawCells();
        }
    );

    // Add canvas event listener for mouse events
    var canvas = document.getElementById("mainCanvas");
    canvas.addEventListener("mousedown", onCanvasMouseDown, false);
    canvas.addEventListener("mouseup", onCanvasMouseUp, false);
    canvas.addEventListener("mousemove", onCanvasMouseMove, false);

    gameLoop()
}

function gameLoop() {
    if (window.playGame) {
        window.grid = getNextState();
        drawCells();
    }
    setTimeout(function() { gameLoop(); }, 500);
}

/**
 * Size the game board canvas to fill the viewport and draw a grid on the canvas.
 */
function drawGrid() {
    // Create a full screen canvas
    var canvas = document.getElementById("mainCanvas");
    canvas.width = $(window).width();
    canvas.height = $(window).height() - $("#footer").height();

    // Draw a black background
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Get the padding for the grid
    var padding = getGridPadding();

    // Get the size of cells on the grid
    var cellSize = getCellSize();

    // Set the stroke color to grey
    ctx.strokeStyle = gridColor;

    // Draw the vertical lines of the grid
    for (var i = 0; i <= numCellsX; i++) {
        var offset = i * cellSize;
        ctx.beginPath();
        ctx.moveTo(padding.horizontal + offset, padding.vertical);
        ctx.lineTo(padding.horizontal + offset, (canvas.height - padding.vertical));
        ctx.stroke();
    }

    // Draw the horizontal lines of the grid
    for (i = 0; i <= numCellsY; i++) {
        offset = i * cellSize;
        ctx.beginPath();
        ctx.moveTo(padding.horizontal, padding.vertical + offset);
        ctx.lineTo((canvas.width - padding.horizontal), padding.vertical + offset);
        ctx.stroke();
    }
}

/**
 * Draw live cells onto the grid
 */
function drawCells() {
    // Get canvas context
    var canvas = document.getElementById("mainCanvas");
    var ctx = canvas.getContext("2d");

    // Get the grid padding
    var padding = getGridPadding();

    // Get the size of cells in the grid
    var cellSize = getCellSize();

    // Cycle through the grid
    for (var i = 0; i < numCellsX; i++) {
        for (var j = 0; j < numCellsY; j++) {
            // Check if cell is alive or dead
            if (grid[i][j]) {
                ctx.fillStyle = cellColor;
            } else {
                // If cell is dead color with background color
                ctx.fillStyle = backgroundColor;
            }

            ctx.fillRect(padding.horizontal + (i * cellSize), padding.vertical + (j * cellSize),
                cellSize, cellSize);
        }
    }
}

/**
 * Given pixel coordinates on the canvas switch that cell's alive/dead status and update lastCellClicked
 * @param x {Number} the X value of the pixel coordinates on the canvas
 * @param y {Number} the Y value of the pixel coordinates on the canvas
 */
function clickCell(x, y) {
    // Check that the mouse is down
    if (window.mouseDown) {
        // Get the grid coordinates of the cell
        var coords = getCellGridCoordinates(x, y);

        // Return if the coordinates are not on the grid
        if (coords == null) {
            return null;
        }

        // Check that this is not the most recent cell clicked
        if((lastCellClicked == null) || !(lastCellClicked.x == coords.x && lastCellClicked.y == coords.y)) {
            // Switch the cell state
            grid[coords.x][coords.y] = !grid[coords.x][coords.y];

            // Update last cell clicked
            window.lastCellClicked = coords;

            // Update the screen
            drawCells();
        }
    }
}

/**
 * @return {Number} The size of all cells in the grid,
 * @throws exception if the size is zero
 */
function getCellSize() {
    // Get the canvas dimensions
    var canvas = document.getElementById("mainCanvas");

    // TODO throw exception if the cell size is zero (handle it in the rest of the code)

    // Determine the size of the cells
    return Math.min(canvas.width/numCellsX, canvas.height/numCellsY);
}

/**
 * @return {Array} array describing the next game state
 */
function getNextState() {
    var newGrid = [];
    for(var x = 0; x < numCellsX; x++) {
        newGrid[x] = [];
        for(var y = 0; y < numCellsY; y++) {
            var count = countAliveNeighbors(x, y);
            // Check if cell is created, survives, or dies
            if (grid[x][y] && (count == 3 || count == 2)) {
                // Cell survives
                newGrid[x][y] = true;
            } else if (!grid[x][y] && count == 3) {
                // Cell is created
                newGrid[x][y] = true;
            } else {
                // Cell dies
                newGrid[x][y] = false;
            }
        }
    }
    return newGrid
}

/**
 * @param x {Number} X grid coordinate of the cell
 * @param y {Number} Y grid coordinate of the cell
 * @return {Number} number of live neighbors
 */
function countAliveNeighbors(x, y) {
    var rightX = (x + 1) % numCellsX;
    var leftX = (x - 1) < 0 ? numCellsX - 1 : (x - 1);
    var downY = (y + 1) % numCellsY;
    var upY = (y - 1) < 0 ? numCellsY - 1 : (y - 1);

    return grid[rightX][y] + grid[rightX][upY] + grid[rightX][downY] +
            grid[leftX][y] + grid[leftX][upY] + grid[leftX][downY] +
            grid[x][upY] + grid[x][downY];
}

/**
 * Return the vertical and horizontal padding for the grid in an object
 * @return {Object} with 'horizontal' and 'vertical' properties
 */
function getGridPadding() {
    // Get the canvas dimensions
    var canvas = document.getElementById("mainCanvas");

    // Get the size of the cells
    var cellSize = getCellSize();

    // Determine the horizontal or vertical padding (one will be zero)
    return {
        horizontal: (canvas.width - (cellSize * numCellsX)) / 2,
        vertical: (canvas.height - (cellSize * numCellsY)) / 2
    };
}

/**
 * Given pixel coordinates on the canvas return a cell's grid coordinates
 * @param x {Number} the X value of the pixel coordinates on the canvas
 * @param y {Number} the Y value of the pixel coordinates on the canvas
 * @return {Object} the object containing grid coordinates of the cell with x, y properties. Returns null if the given
 * coordinates are not on the grid.
 */
function getCellGridCoordinates(x, y) {
    var canvas = document.getElementById("mainCanvas");
    var padding = getGridPadding();
    var cellSize = getCellSize();

    // If the given coordinates are not on the grid then return null
    if (x < padding.horizontal || y < padding.vertical ||
        x > $(canvas.width - padding.horizontal) ||
        y > $(canvas.height - padding.vertical)) {
        return null;
    }

    // Subtract padding from the coordinates
    x -= padding.horizontal;
    y -= padding.vertical;

    // Determine grid coordinates of the cell
    x = Math.floor(x/cellSize);
    y = Math.floor(y/cellSize);

    return {x: x, y: y};
}

//############## Event Listeners ###############

/**
 * Scale the number of cells in the grid according to the grid's current aspect ratio
 * @param scaleFactor
 */
function onResizeGrid(scaleFactor) {
    // TODO
}

/**
 * Switch the application state from 'play' to 'pause'
 */
function onPlayPauseButtonPressed() {
    if (window.playGame == true) {
        window.playGame = false;
        $("#playPauseButton").text("Play");
    } else {
        window.playGame = true;
        $("#playPauseButton").text("Pause");
    }
}

/**
 * Set the mouseDown variable to true and call the clickCell method
 * @param event
 */
function onCanvasMouseDown(event) {
    window.mouseDown = true;
    clickCell(event.x, event.y);
}

/**
 * Set the mouseDown variable to false and set the last cell clicked variable to null
 */
function onCanvasMouseUp() {
    window.mouseDown = false;
    window.lastCellClicked = null;
}

/**
 * If the mouse is down then call the clickCell method
 * @param event
 */
function onCanvasMouseMove(event) {
    if (window.mouseDown) {
        clickCell(event.x, event.y);
    }
}

init();
