const outputPath = 'public/image_with_text.jpeg';
const imagePath = 'public/Receipt.jpeg';


const text1 = `Order Confirmed!\n201 BlahBlah Drive\nTown\nNY\n20201\nThank you Adi!\n\nOrder sent to your email: dhp21312123@gmail.com`;
const Jimp = require('jimp');

async function textOverlay() {
  // Reading image
  const image = await Jimp.read(imagePath);
  // Defining the text font
  const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
  const overlayWidth = 800;
  const overlayHeight = 800;

  const xCoordinate = (image.getWidth() - overlayWidth) / 2;
  const yCoordinate = (image.getHeight() - overlayHeight) / 2;

  image.print(
    font,
    xCoordinate,
    yCoordinate,
    {
      text: text1,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    },
    overlayWidth,
    overlayHeight
  );  // Writing image after processing
  await image.writeAsync(outputPath);
}

textOverlay();
console.log('Image is processed succesfully');

