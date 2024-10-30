const canvas = document.getElementById("drawingCanvas");
const context = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");

let drawing = false;
let points = [];
let shapeColor = colorPicker.value;

// Update color on color change
colorPicker.addEventListener("input", (event) => {
    shapeColor = event.target.value;
});

// Start drawing on mousedown
canvas.addEventListener("mousedown", (event) => {
    drawing = true;
    points = []; // Clear previous points if any
    points.push({ x: event.offsetX, y: event.offsetY });
});

// Draw as the user moves the mouse
canvas.addEventListener("mousemove", (event) => {
    if (!drawing) return;

    const x = event.offsetX;
    const y = event.offsetY;
    points.push({ x, y });

    // Redraw shape on each move
    redrawShape();
});

// Stop drawing on mouseup
canvas.addEventListener("mouseup", () => {
    drawing = false;
});

// Redraws the irregular shape based on the points array
function redrawShape() {
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before redraw
    context.beginPath();

    context.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        context.lineTo(points[i].x, points[i].y);
    }

    context.strokeStyle = shapeColor; // Use the selected color
    context.lineWidth = 2;
    context.stroke();
}