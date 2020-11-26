/* eslint-disable require-jsdoc */

const {createCanvas} = require('canvas');

const canvas = createCanvas();
const ctx = canvas.getContext('2d');

ctx.imageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.translate(0.5, 0.5);

function generateOledFont(font, size, text, threshold=150) {
  const wholeFont = {};

  const joinedText = text.join('');
  const chars = Array.from(new Set([...joinedText]));

  ctx.font = size + 'px ' + font;
  const measurement = ctx.measureText(chars.join(''));

  for (let i = 0; i < chars.length; i++) {
    ctx.font = size + 'px ' + font;
    ctx.canvas.width = ctx.measureText(chars[i]).width;
    ctx.canvas.height =
        measurement.actualBoundingBoxAscent +
        measurement.actualBoundingBoxDescent;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.font = size + 'px ' + font;
    ctx.fillStyle = 'white';
    ctx.fillText(chars[i], 0, measurement.actualBoundingBoxAscent);

    const pimage = ctx.getImageData(
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height,
    );

    const pixels = pimage.data;
    const pixelsLen = pixels.length;
    const unpackedBuffer = [];
    const depth = 4;

    // Create a new buffer that will be filled
    // with pixel bytes // (8 bits per) and then returned
    const buffer = new Uint8ClampedArray(
        pimage.width * Math.ceil(pimage.height / 8));

    // filter pixels to create monochrome image data
    for (let j = 0; j < pixelsLen; j += depth) {
      // Take the red value
      let pixelVal = pixels[j + 1] = pixels[j + 2] = pixels[j];

      // Determine on and off pixel vals by threshold
      if (pixelVal > threshold) {
        pixelVal = 1;
      } else {
        pixelVal = 0;
      }

      // Push to unpacked buffer list
      unpackedBuffer[j/depth] = pixelVal;
    }

    // Pack the buffer
    for (let k = 0; k < unpackedBuffer.length; k++) {
      const x = Math.floor(k % pimage.width);
      const y = Math.floor(k / pimage.width);

      // create a new byte, set up page position
      let byte = 0;
      const page = Math.floor(y / 8);
      const pageShift = 0x01 << (Math.floor(y - 8 * page));

      // is the first page? Just assign byte pos to x value,
      // otherwise add rows to it too
      (page === 0) ? byte = x : byte = x + pimage.width * page;

      if (unpackedBuffer[k] === 0) {
        // 'off' pixel
        buffer[byte] &= ~pageShift;
      } else {
        // 'on' pixel
        buffer[byte] |= pageShift;
      }
    }

    wholeFont[chars[i]] = {charBuffer: [], width: ctx.canvas.width};

    for (let q = 0; q < buffer.length; q++) {
      wholeFont[chars[i]].charBuffer.push(buffer[q]);
    }
  }

  return {
    monospace: true,
    height: ctx.canvas.height,
    fontData: wholeFont,
    lookup: chars,
  };
}

module.exports = generateOledFont;
