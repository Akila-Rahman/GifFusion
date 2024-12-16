document.getElementById('imageInput').addEventListener('change', handleImageUpload);
document.getElementById('convertBtn').addEventListener('click', convertToGIF);

let imgElement = new Image();
let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');

let gif = new GIF({
    workers: 2,
    quality: 10,
    width: 300, // Desired width for GIF
    height: 300 // Desired height for GIF
});

// Handle image upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imgElement.onload = function() {
                canvas.width = imgElement.width;
                canvas.height = imgElement.height;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(imgElement, 0, 0);
            };
            imgElement.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please upload a valid image file.');
    }
}

// Convert image to GIF
function convertToGIF() {
    if (!imgElement.src) {
        alert('Please upload an image first.');
        return;
    }

    // Add the frame to the GIF (delay: 500ms between frames)
    gif.addFrame(canvas, { delay: 500, copy: true });

    // Render the GIF and display it
    gif.on('finished', function(blob) {
        const gifUrl = URL.createObjectURL(blob);
        const imgTag = document.createElement('img');
        imgTag.src = gifUrl;

        // Create a download link for the generated GIF
        const downloadLink = document.createElement('a');
        downloadLink.href = gifUrl;
        downloadLink.download = 'converted-image.gif';
        downloadLink.textContent = 'Download GIF';

        const outputDiv = document.getElementById('output');
        outputDiv.innerHTML = ''; // Clear previous output
        outputDiv.appendChild(imgTag); // Append the GIF image
        outputDiv.appendChild(downloadLink); // Append the download link
    });

    // Start the GIF creation process
    gif.render();
}
