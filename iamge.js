document.getElementById("imageUpload").addEventListener("change", handleImage);

function handleImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Process the image to extract lines
            extractLines(ctx, canvas);
        };
    };
    reader.readAsDataURL(file);
}

function extractLines(ctx, canvas) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Convert to grayscale and enhance contrast
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        if (avg > 128) {
            // Set to white
            data[i] = data[i + 1] = data[i + 2] = 255;
        } else {
            // Set to black
            data[i] = data[i + 1] = data[i + 2] = 0;
        }
    }

    // Draw the high-contrast image back onto the canvas
    ctx.putImageData(imageData, 0, 0);

    // Convert the canvas to a data URL
    const processedImageDataURL = canvas.toDataURL();

    // Open a new window with an HTML document containing the processed image
    const newTab = window.open();
    newTab.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head><title>Processed Image</title></head>
        <body>
            <h1>Processed Image</h1>
            <img src="${processedImageDataURL}" alt="Processed Image">
        </body>
        </html>
    `);
    newTab.document.close();
}