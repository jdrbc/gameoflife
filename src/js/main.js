// Initialize global variables
// Grid background color
window.backgroundColor = "#000000";

// Grid line color
window.gridColor = "'#d3d3d3"

// Number of cells in the horizontal rows
window.numCellsX = 50;

// Number of cells in the vertical rows
window.numCellsY = 50;

// Boolean tracking whether the game is paused or not
window.playGame = true;

// Set up and start the game
function init() {
    // Draw the game board
    drawGrid();

    // Initialize the grid with dead/alive cells
    window.grid = [];
    for (var i = 0; i < numCellsX; i++) {
        grid[i] = [];
        for (var j = 0; j < numCellsY; j++) {
            // Assign random alive/dead to the cell
            grid[i][j] = (Math.random() < 0.5);
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


    //while(true) {
    //    if (window.playGame == true) {
    //
    //    }
    //}
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
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Get the padding for the grid
    var padding = getGridPadding();

    // Get the size of cells on the grid
    var cellSize = getCellSize();

    // Set the stroke color to grey
    ctx.strokeStyle = '#d3d3d3';

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
                ctx.fillStyle = "#ffff00";
            } else {
                // If cell is dead color with black
                ctx.fillStyle = "#000000";
            }

            ctx.fillRect(padding.horizontal + (i * cellSize), padding.vertical + (j * cellSize),
                cellSize, cellSize);
        }
    }
}

/**
 * @return {Number} The size of all cells in the grid
 */
function getCellSize() {
    // Get the canvas dimensions
    var canvas = document.getElementById("mainCanvas");

    // Determine the size of the cells
    return Math.min(canvas.width/numCellsX, canvas.height/numCellsY);
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

init();
