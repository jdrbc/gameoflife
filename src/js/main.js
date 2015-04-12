function init() {
    // Initialize global variables
    window.numCellsX = 50;
    window.numCellsY = 50;
    window.playGame = true;

    // Draw the game board
    drawGrid();

    // Redraw the grid when the window is resized
    window.addEventListener("resize", drawGrid);
}

/**
 * Resize the game board canvas to fill the viewport and draw a grid in the canvas
 */
function drawGrid() {
    // Get size of the browser viewport minus the footer height
    var windowHeight = $(window).height() - $("#footer").height();
    var windowWidth = $(window).width();

    // Create a full screen canvas
    var canvas = document.getElementById("mainCanvas");
    canvas.width = windowWidth;
    canvas.height = windowHeight;

    // Draw a black background
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,windowWidth,windowHeight);

    // Determine the size of the cells
    var numCellsX = window.numCellsX;
    var numCellsY = window.numCellsY;
    var cellSize = Math.min(windowWidth/numCellsX, windowHeight/numCellsY);

    // Determine the horizontal or vertical padding before the grid is drawn (one will be zero)
    var horizontalPadding = (windowWidth - (cellSize * numCellsX)) / 2;
    var verticalPadding = (windowHeight - (cellSize * numCellsY)) / 2;

    // Draw the vertical lines of the grid
    var verticalLineYStart = verticalPadding;
    var verticalLineYEnd = windowHeight - verticalPadding;
    for (var i = 0; i <= numCellsX; i++) {
        var offset = i * cellSize;
        ctx.beginPath();
        ctx.moveTo(horizontalPadding + offset, verticalLineYStart);
        ctx.lineTo(horizontalPadding + offset, verticalLineYEnd);
        ctx.strokeStyle = '#d3d3d3';
        ctx.stroke();
    }

    // Draw the horizontal lines of the grid
    var horizontalLineXStart = horizontalPadding;
    var horizontalLineXEnd = windowWidth - horizontalPadding;
    for (i = 0; i <= numCellsY; i++) {
        offset = i * cellSize;
        ctx.beginPath();
        ctx.moveTo(horizontalLineXStart, verticalPadding + offset);
        ctx.lineTo(horizontalLineXEnd, verticalPadding + offset);
        ctx.strokeStyle = '#d3d3d3';
        ctx.stroke();
    }
}

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
