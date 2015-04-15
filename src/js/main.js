// Initialize global variables

// Grid containing the game state
window.grid = [];

// Grid background color
window.backgroundColor = '#000000';

// Grid line color
window.gridColor = '#d3d3d3';

// Live cell color
window.cellColor = '#ffff00';

// Number of cells in the horizontal rows
window.numCellsX = 0;

// Number of cells in the vertical rows
window.numCellsY = 0;

// The size of the grid cells in pixels
window.cellSize = 20;

// The size of the grid lines relative to cell size
window.gridLineWidthRatio = 10;

// The minimum size of the grid cells in pixels
window.minCellSize = 3;

// Boolean tracking whether the game is paused or not
window.playGame = true;

// Boolean tracking whether the mouse is being held down
window.mouseDown = false;

// Object tracking grid coordinates of the last cell clicked or touched by the user
window.lastCellClicked = null;

// Number reflecting how quickly the game moves through steps
window.speed = 1;

// Number reflecting the maximum speed the game will evolve at
window.maxSpeed = 64;

// Set up and start the game
$(window).load(init);
function init() {
    // Create a full screen canvas
    var canvas = document.getElementById('mainCanvas');
    canvas.width = $(window).width();
    canvas.height = $(window).height();

    // Determine ideal number of cells to display
    window.numCellsX = Math.floor(canvas.width / window.cellSize);
    window.numCellsY = Math.floor(canvas.height / window.cellSize);

    // Initialize the grid with dead/alive cells
    for (var i = 0; i < window.numCellsX; i++) {
        window.grid[i] = [];
        for (var j = 0; j < window.numCellsY; j++) {
            // Assign state to the cell
            window.grid[i][j] = false;
        }
    }

    // Draw the game board
    drawGrid();

    // Redraw the grid when the window is resized
    window.addEventListener('resize', onWindowResize);

    // Add canvas event listener for mouse events
    canvas.addEventListener('mousedown', onCanvasMouseDown, false);
    canvas.addEventListener('mouseup', onCanvasMouseUp, false);
    canvas.addEventListener('mousemove', onCanvasMouseMove, false);

    gameLoop();
}

function gameLoop() {
    if (window.playGame) {
        window.grid = getNextState();
        drawGrid();
    }
    setTimeout(function() { gameLoop(); }, 1000 / window.speed);
}

/**
 * Draw a grid on the canvas.
 */
function drawGrid() {
    var canvas = document.getElementById('mainCanvas');

    // Draw a black background
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = window.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Get the padding for the grid
    var padding = getGridPadding();

    // Set the stroke color to grey
    ctx.strokeStyle = window.gridColor;

    // Set the stroke size to 1/10th of the cell size
    ctx.lineWidth = window.cellSize / window.gridLineWidthRatio;

    // Draw the vertical lines of the grid
    var offset;
    for (var i = 0; i <= window.numCellsX; i++) {
        offset = i * window.cellSize;
        ctx.beginPath();
        ctx.moveTo(padding.horizontal + offset, padding.vertical);
        ctx.lineTo(padding.horizontal + offset, (canvas.height - padding.vertical));
        ctx.stroke();
    }

    // Draw the horizontal lines of the grid
    for (i = 0; i <= window.numCellsY; i++) {
        offset = i * window.cellSize;
        ctx.beginPath();
        ctx.moveTo(padding.horizontal, padding.vertical + offset);
        ctx.lineTo((canvas.width - padding.horizontal), padding.vertical + offset);
        ctx.stroke();
    }

    // Draw the cells on to the grid
    drawCells();
}

/**
 * Draw live cells onto the grid
 */
function drawCells() {
    // Get canvas context
    var canvas = document.getElementById('mainCanvas');
    var ctx = canvas.getContext('2d');

    // Get the grid padding
    var padding = getGridPadding();

    // Cycle through the grid
    for (var i = 0; i < window.numCellsX; i++) {
        for (var j = 0; j < window.numCellsY; j++) {
            // Check if cell is alive or dead
            if (window.grid[i][j]) {
                // If cell is alive then color with cell color
                ctx.fillStyle = window.cellColor;
            } else {
                // If cell is dead then color with background color
                ctx.fillStyle = window.backgroundColor;
            }

            // Draw the cells
            var halfGridLineWidth = (window.cellSize / window.gridLineWidthRatio) / 2;
            ctx.fillRect(padding.horizontal + (i * window.cellSize) + halfGridLineWidth,
                padding.vertical + (j * window.cellSize) + halfGridLineWidth,
                window.cellSize - halfGridLineWidth, window.cellSize - halfGridLineWidth);
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
        if (coords === null) {
            return null;
        }

        // Check that this is not the most recent cell clicked
        if ((window.lastCellClicked === null) ||
            !(window.lastCellClicked.x === coords.x && window.lastCellClicked.y === coords.y)) {
            // Switch the cell state
            window.grid[coords.x][coords.y] = !window.grid[coords.x][coords.y];

            // Update last cell clicked
            window.lastCellClicked = coords;

            // Update the screen
            drawGrid();
        }
    }
}

/**
 * @return {Array} array describing the next game state
 */
function getNextState() {
    var newGrid = [];
    for (var x = 0; x < window.numCellsX; x++) {
        newGrid[x] = [];
        for (var y = 0; y < window.numCellsY; y++) {
            var count = getAliveNeighborCount(x, y);
            // Check if cell is created, survives, or dies
            if (window.grid[x][y] && (count === 3 || count === 2)) {
                // Cell survives
                newGrid[x][y] = true;
            } else if (!window.grid[x][y] && count === 3) {
                // Cell is created
                newGrid[x][y] = true;
            } else {
                // Cell dies
                newGrid[x][y] = false;
            }
        }
    }
    return newGrid;
}

/**
 * @param x {Number} X grid coordinate of the cell
 * @param y {Number} Y grid coordinate of the cell
 * @return {Number} number of live neighbors
 */
function getAliveNeighborCount(x, y) {
    var rightX = (x + 1) % window.numCellsX;
    var leftX = (x - 1) < 0 ? window.numCellsX - 1 : (x - 1);
    var downY = (y + 1) % window.numCellsY;
    var upY = (y - 1) < 0 ? window.numCellsY - 1 : (y - 1);

    return window.grid[rightX][y] + window.grid[rightX][upY] + window.grid[rightX][downY] +
            window.grid[leftX][y] + window.grid[leftX][upY] + window.grid[leftX][downY] +
            window.grid[x][upY] + window.grid[x][downY];
}

/**
 * Return the vertical and horizontal padding for the grid in an object
 * @return {Object} with 'horizontal' and 'vertical' properties
 */
function getGridPadding() {
    // Get the canvas dimensions
    var canvas = document.getElementById('mainCanvas');

    // Determine the horizontal or vertical padding (one will be zero)
    return {
        horizontal: (canvas.width - (window.cellSize * window.numCellsX)) / 2,
        vertical: (canvas.height - (window.cellSize * window.numCellsY)) / 2
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
    var canvas = document.getElementById('mainCanvas');
    var padding = getGridPadding();

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
    x = Math.floor(x / window.cellSize);
    y = Math.floor(y / window.cellSize);

    return { x: x, y: y };
}

// ############## Event Listeners ###############

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
    if (window.playGame === true) {
        window.playGame = false;
        $('#playPauseButton').text('Play');
    } else {
        window.playGame = true;
        $('#playPauseButton').text('Pause');
    }
}

/**
 * Clear the grid of live cells
 */
function onClearButtonPressed() {
    for (var x = 0; x < window.numCellsX; x++) {
        for (var y = 0; y < window.numCellsY; y++) {
            window.grid[x][y] = false;
        }
    }
    drawGrid();
}

/**
 * Change the speed of the game
 */
function onSpeedButtonPressed() {
    window.speed = window.speed * 2 > window.maxSpeed ? 1 : window.speed * 2;
    $('#speedButton').text('X' + window.speed);
}

/**
 * Set the mouseDown variable to true and call the clickCell method
 * @param event
 */
function onCanvasMouseDown(event) {
    window.mouseDown = true;
    clickCell(event.pageX, event.pageY);
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
        clickCell(event.pageX, event.pageY);
    }
}

/**
 * Resize the canvas and cells so that they fit into the new window size
 */
function onWindowResize() {
    // Resize the canvas
    var canvas = document.getElementById('mainCanvas');
    canvas.width = $(window).width();
    canvas.height = $(window).height();

    // Resize the cells
    window.cellSize = Math.max(3, Math.min($(window).width() / window.numCellsX, $(window).height() / window.numCellsY));

    drawGrid();
}
