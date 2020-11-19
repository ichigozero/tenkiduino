const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chai = require('chai');
const expect = chai.expect;

chai.use(sinonChai);

const {Led} = require('johnny-five');
const WeatherLed = require('../lib/led');

describe('WeatherLed', function() {
  const weatherLed = new WeatherLed({
    fine: sinon.createStubInstance(Led),
    cloud: sinon.createStubInstance(Led),
    rain: sinon.createStubInstance(Led),
    snow: sinon.createStubInstance(Led),
  });

  describe('operateFineLed()', function() {
    it('should turn on LED if weather string starts with 晴', function() {
      weatherLed.operateFineLed('晴れ');
      expect(weatherLed._leds.fine.on).to.have.been.calledOnce;
    });

    it('should pulse LED if weather string contains のち晴', function() {
      weatherLed.operateFineLed('雨のち晴');
      expect(weatherLed._leds.fine.pulse).to.have.been.calledOnce;
    });

    it('should blink LED if weather string contains 時々晴', function() {
      weatherLed.operateFineLed('雨時々晴');
      expect(weatherLed._leds.fine.blink)
          .to.have.been.calledOnceWithExactly(weatherLed._blinkInterval);
    });

    it('should turn off LED for other weather string patterns ', function() {
      weatherLed.operateFineLed('雨');
      expect(weatherLed._leds.fine.off).to.have.been.calledOnce;
    });
  });

  describe('operateCloudLed()', function() {
    it('should turn on LED if weather string starts with 曇', function() {
      weatherLed.operateCloudLed('曇り');
      expect(weatherLed._leds.cloud.on).to.have.been.calledOnce;
    });

    it('should pulse LED if weather string contains のち曇', function() {
      weatherLed.operateCloudLed('雨のち曇');
      expect(weatherLed._leds.cloud.pulse).to.have.been.calledOnce;
    });

    it('should blink LED if weather string contains 時々曇', function() {
      weatherLed.operateCloudLed('雨時々曇');
      expect(weatherLed._leds.cloud.blink)
          .to.have.been.calledOnceWithExactly(weatherLed._blinkInterval);
    });

    it('should turn off LED for other weather string patterns ', function() {
      weatherLed.operateCloudLed('雨');
      expect(weatherLed._leds.cloud.off).to.have.been.calledOnce;
    });
  });

  describe('operateRainLed()', function() {
    it('should turn on LED if weather string starts with 雨', function() {
      weatherLed.operateRainLed('雨');
      expect(weatherLed._leds.rain.on).to.have.been.calledOnce;
    });

    it('should pulse LED if weather string contains のち雨', function() {
      weatherLed.operateRainLed('晴のち雨');
      expect(weatherLed._leds.rain.pulse).to.have.been.calledOnce;
    });

    it('should blink LED if weather string contains 時々雨', function() {
      weatherLed.operateRainLed('晴時々雨');
      expect(weatherLed._leds.rain.blink)
          .to.have.been.calledOnceWithExactly(weatherLed._blinkInterval);
    });

    it('should turn off LED for other weather string patterns ', function() {
      weatherLed.operateRainLed('晴れ');
      expect(weatherLed._leds.rain.off).to.have.been.calledOnce;
    });
  });

  describe('operateSnowLed()', function() {
    it('should turn on LED if weather string starts with 雪', function() {
      weatherLed.operateSnowLed('雪');
      expect(weatherLed._leds.snow.on).to.have.been.calledOnce;
    });

    it('should pulse LED if weather string contains のち雪', function() {
      weatherLed.operateSnowLed('晴のち雪');
      expect(weatherLed._leds.snow.pulse).to.have.been.calledOnce;
    });

    it('should blink LED if weather string contains 時々雪', function() {
      weatherLed.operateSnowLed('晴時々雪');
      expect(weatherLed._leds.snow.blink)
          .to.have.been.calledOnceWithExactly(weatherLed._blinkInterval);
    });

    it('should turn off LED for other weather string patterns ', function() {
      weatherLed.operateSnowLed('晴れ');
      expect(weatherLed._leds.snow.off).to.have.been.calledOnce;
    });
  });
});
