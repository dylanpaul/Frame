const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const outputPath = path.join(process.cwd(), 'public', 'image_with_text_canvas.jpg');
const imagePath = path.join(process.cwd(), 'public', 'Receipt.jpg');

console.log(imagePath);
console.log(outputPath);

const text1 = `Order Confirmed!\n201 BlahBlah Drive\nTown\nNY\n20201\nThank you Paul!\n\nOrder sent to your email: dhp21312123@gmail.com`;

async function textOverlay() {
  // Create a canvas
  const canvas = createCanvas();
  const ctx = canvas.getContext('2d');

  // Load the image
  const image = await loadImage(imagePath);
  canvas.width = image.width;
  canvas.height = image.height;

  // Draw the image on the canvas
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  // Set font properties
  ctx.font = '20px Roboto';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Add text to the center of the canvas
  const lines = text1.split('\n');
  const lineHeight = 30;
  const startY = canvas.height / 2 - (lines.length * lineHeight) / 2;
  lines.forEach((line, index) => {
    ctx.fillText(line, canvas.width / 2, startY + index * lineHeight);
  });

  // Save the canvas to an image file
  const out = fs.createWriteStream(outputPath);
  const stream = canvas.createJPEGStream();
  stream.pipe(out);
  out.on('finish', () => console.log('Image with text saved.'));
}

textOverlay();
console.log('Image is processed successfully');
