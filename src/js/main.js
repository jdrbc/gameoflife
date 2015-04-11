function init() {
    window.numCellsX = 200;
    window.numCellsY = 100;
    drawGrid();
}

function drawGrid() {
    // Get size of the browser viewport
    var windowHeight = $(window).height();
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
    var vertLineYStart = verticalPadding;
    var vertLineYEnd = windowHeight - verticalPadding;

    for (var i = 0; i <= numCellsX; i++) {
        var offset = i * cellSize;
        ctx.beginPath();
        ctx.moveTo(horizontalPadding + offset, vertLineYStart);
        ctx.lineTo(horizontalPadding + offset, vertLineYEnd);
        ctx.strokeStyle = '#ff0000';
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
        ctx.strokeStyle = '#ff0000';
        ctx.stroke();
    }

}

init();
