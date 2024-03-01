// const fs = require('fs');
// const path = require('path');
// const outputPath = path.join(process.cwd(), 'public', 'image_with_text.jpeg');
// const imagePath = path.join(process.cwd(), 'public', 'Receipt.jpeg');

// console.log(imagePath);
// console.log(outputPath);
// console.log(
//   'Contents of the public directory:',
//   fs.readdirSync(path.join(process.cwd(), 'public')),
// );
// const text1 = `Order Confirmed!\n201 BlahBlah Drive\nTown\nNY\n20201\nThank you Paul!\n\nOrder sent to your email: dhp21312123@gmail.com`;
// const Jimp = require('jimp');

// async function textOverlay() {
//   // Reading image
//   const image = await Jimp.read(imagePath);
//   //   const fontPath = path.join(process.cwd(), 'public', 'fonts', 'open-sans-16-black.fnt');
//   const fontPath = path.resolve('public/fonts/open-sans-16-black.fnt');
//   console.log(fontPath);
//   // Defining the text font
//   const font = await new Promise((resolve) => {
//     Jimp.loadFont(fontPath, (err: any, loadedFont: unknown) => {
//       if (err) {
//         console.error('Error loading font:', err);
//         resolve(null);
//       } else {
//         resolve(loadedFont);
//       }
//     });
//   });
//   const overlayWidth = 800;
//   const overlayHeight = 800;

//   const xCoordinate = (image.getWidth() - overlayWidth) / 2;
//   const yCoordinate = (image.getHeight() - overlayHeight) / 2;

//   image.print(
//     font,
//     xCoordinate,
//     yCoordinate,
//     {
//       text: text1,
//       alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
//       alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
//     },
//     overlayWidth,
//     overlayHeight,
//   ); // Writing image after processing
//   //   await image.writeAsync(outputPath);
//   await image.writeAsync(path.join(outputPath));
// }

// textOverlay();
// console.log('Image is processed succesfully');
