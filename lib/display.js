/* eslint-disable require-jsdoc */

const {createCanvas} = require('canvas');

class OledDisplay {
  constructor() {
    const canvas = createCanvas();
    this._ctx = canvas.getContext('2d');

    this._ctx.imageSmoothingEnabled = false;
    this._ctx.mozImageSmoothingEnabled = false;
    this._ctx.webkitImageSmoothingEnabled = false;
    this._ctx.translate(0.5, 0.5);

    this._font = null;
    this._text = null;
    this._maxRow = 0;
    this._topMargin = 0;
    this._currentPage = 1;
    this._totalPage = 1;
    this._ready = false;
  }

  init(oledHeight, font, size, text, threshold=150) {
    this._text = text;
    this._font = this._generateOledFont(font, size, text, threshold);
    this._maxRow = this._calculateMaxRow(
        oledHeight,
        this._font.height,
        text.length,
    );
    this._totalPage = this._calculateTotalPage(text.length, this._maxRow);

    if (this._maxRow > 1) {
      this._topMargin = this._calculateTopMargin(
          oledHeight,
          this._font.height,
          this._maxRow,
      );
    }

    this._ready = true;
  }

  writeText(oled) {
    if (!this._ready) return;

    const textToDisplay = this._text.slice(
        this._currentPage - 1,
        this._maxRow,
    );

    textToDisplay.forEach((item, index) => {
      const x = 1;
      const y = this._topMargin + ((index * this._font.height) + 1);

      oled.setCursor(x, y);
      oled.writeString(this._font, 1, item, 1, true, 2);
    });

    oled.update();
  }

  _generateOledFont(font, size, text, threshold=150) {
    const wholeFont = {};

    const joinedText = text.join('');
    const chars = Array.from(new Set([...joinedText]));

    this._ctx.font = size + 'px ' + font;
    const measurement = this._ctx.measureText(chars.join(''));

    for (let i = 0; i < chars.length; i++) {
      this._ctx.font = size + 'px ' + font;
      this._ctx.canvas.width = this._ctx.measureText(chars[i]).width;
      this._ctx.canvas.height =
          measurement.actualBoundingBoxAscent +
          measurement.actualBoundingBoxDescent;

      this._ctx.fillStyle = 'black';
      this._ctx.fillRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);

      this._ctx.font = size + 'px ' + font;
      this._ctx.fillStyle = 'white';
      this._ctx.fillText(chars[i], 0, measurement.actualBoundingBoxAscent);

      const pimage = this._ctx.getImageData(
          0,
          0,
          this._ctx.canvas.width,
          this._ctx.canvas.height,
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

      wholeFont[chars[i]] = {charBuffer: [], width: this._ctx.canvas.width};

      for (let q = 0; q < buffer.length; q++) {
        wholeFont[chars[i]].charBuffer.push(buffer[q]);
      }
    }

    return {
      monospace: true,
      height: this._ctx.canvas.height,
      fontData: wholeFont,
      lookup: chars,
    };
  }

  _calculateMaxRow(oledHeight, fontHeight, textRowCount) {
    // 1 pixel is reserved for row spacing
    let maxRow = Math.floor(oledHeight / (fontHeight + 1));

    if (maxRow > 1) {
      if (textRowCount > maxRow) {
        maxRow -= 1; // Reserve 1 row for page number
      }
    }
    return maxRow;
  }

  _calculateTotalPage(textRowCount, oledMaxRow) {
    return Math.ceil(textRowCount / oledMaxRow);
  }

  _calculateTopMargin(oledHeight, fontHeight, oledMaxRow) {
    // 1 pixel is reserve for row spacing
    const usedHeight = oledMaxRow * (fontHeight + 1);

    return ((oledHeight - usedHeight) / 2) + 1;
  }
}

module.exports = OledDisplay;
