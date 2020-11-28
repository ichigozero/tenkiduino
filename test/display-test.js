const chai = require('chai');
const expect = chai.expect;

const OledDisplay = require('../lib/display');

describe('OledDisplay', function() {
  const oledDisplay = new OledDisplay();

  describe('calculateOledMaxRow()', function() {
    it('should return 0 if OLED height < text height', function() {
      const output = oledDisplay._calculateOledMaxRow(
          oledHeight=16,
          fontHeight=24,
          textRowCount=1,
      );
      expect(output).to.equal(0);
    });

    it('should return 1 if OLED height 1~1.9  text height', function() {
      const output = oledDisplay._calculateOledMaxRow(
          oledHeight=23,
          fontHeight=12,
          textRowCount=1,
      );
      expect(output).to.equal(1);
    });

    it('should return 4 if OLED height 4x text height', function() {
      const output = oledDisplay._calculateOledMaxRow(
          oledHeight=64,
          fontHeight=12,
          textRowCount=4,
      );
      expect(output).to.equal(4);
    });

    it('should reserve 1 row for page number', function() {
      const output = oledDisplay._calculateOledMaxRow(
          oledHeight=64,
          fontHeight=12,
          textRowCount=5,
      );
      expect(output).to.equal(3);
    });
  });

  describe('calculateOledTopMargin()', function() {
    it('should return val which center displayed text', function() {
      const output = oledDisplay._calculateOledTopMargin(
          oledHeight=64,
          fontHeight=12,
          oledMaxRow=4,
      );
      expect(output).to.equal(7);
    });
  });
});
