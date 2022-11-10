const sharp = require('../../node_modules/sharp');
const axios = require('../../node_modules/axios');

const download = (url) =>
  axios({
    method: 'get',
    url,
    responseType: 'stream',
  }).then((response) => response.data);


const isNumeric = (n) => !isNaN(parseFloat(n)) && isFinite(n);

// const transform = ({ blur, height, width, quality, format = 'jpg' }) => {
//   const sharpObj = sharp();
//   // Width and height set...
//   if (Number.isInteger(height) && Number.isInteger(width)) {
//     sharpObj.resize(width, height);

//     // Only width set...
//   } else if (isNumeric(width)) {
//     sharpObj.resize(width);

//     // Only height set...
//   } else if (isNumeric(height)) {
//     sharpObj.resize(null, height);
//   }

//   // Blur
//   if (blur && isNumeric(blur)) {
//     // Clamp between 0.3 and 1000
//     sharpObj.blur(Math.min(1000, Math.max(blur, 0.3)));
//   }

//   // JPEG quality
//   if (format === 'jpg') {
//     sharpObj.jpeg({
//       quality: isNumeric(quality) ? Math.max(1, Math.min(100, quality)) : 80,
//     });
//   } else {
//     sharpObj.webp({
//       quality: isNumeric(quality) ? Math.max(1, Math.min(100, quality)) : 80,
//     });
//   }
//   return sharpObj;
// };

const transform = ({ blur, height, width, quality, format = 'jpg' }) => {
  const sharpObj = sharp();
  // Width and height set...
  if (Number.isInteger(height) && Number.isInteger(width)) {
    sharpObj.resize(width, height, {
      fit: sharp.fit.cover,
      position: sharp.strategy.attention,
    });

    // Only width set...
  } else if (isNumeric(width)) {
    sharpObj.resize(width, undefined, {
      fit: sharp.fit.cover,
      position: sharp.strategy.attention,
    });

    // Only height set...
  } else if (isNumeric(height)) {
    sharpObj.resize(null, height, {
      fit: sharp.fit.cover,
      position: sharp.strategy.attention,
    });
  }

  // Blur
  if (blur && isNumeric(blur)) {
    // Clamp between 0.3 and 1000
    sharpObj.blur(Math.min(1000, Math.max(blur, 0.3)));
  }

  // JPEG quality
  if (format === 'jpg') {
    sharpObj.jpeg({
      quality: isNumeric(quality) ? Math.max(1, Math.min(100, quality)) : 80,
    });
  } else {
    sharpObj.webp({
      quality: isNumeric(quality) ? Math.max(1, Math.min(100, quality)) : 80,
    });
  }
  return sharpObj;
};
module.exports={
    download,
    transform
}
