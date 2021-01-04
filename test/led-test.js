const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chai = require('chai');
const expect = chai.expect;

chai.use(sinonChai);

const {Led} = require('johnny-five');
const WeatherLed = require('../lib/led');
let weatherLed = null;

describe('WeatherLed', function() {
  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    weatherLed = new WeatherLed({
      fine: sandbox.createStubInstance(Led),
      cloud: sandbox.createStubInstance(Led),
      rain: sandbox.createStubInstance(Led),
      snow: sandbox.createStubInstance(Led),
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('operateFineLed()', function() {
    it('should turn on LED if weather string starts with 晴', function() {
      weatherLed._operateFineLed('晴れ');
      expect(weatherLed._leds.fine.on).to.have.been.calledOnce;
    });

    it('should pulse LED if weather string contains のち晴', function() {
      weatherLed._operateFineLed('雨のち晴');
      expect(weatherLed._leds.fine.pulse).to.have.been.calledOnce;
    });

    it('should blink LED if weather string contains 時々晴', function() {
      weatherLed._operateFineLed('雨時々晴');
      expect(weatherLed._leds.fine.blink)
          .to.have.been.calledOnceWithExactly(weatherLed._blinkInterval);
    });

    it('should turn off LED for other weather string patterns ', function() {
      weatherLed._operateFineLed('雨');
      expect(weatherLed._leds.fine.stop).to.have.been.calledOnce;
      expect(weatherLed._leds.fine.off).to.have.been.calledOnce;
    });
  });

  describe('operateCloudLed()', function() {
    it('should turn on LED if weather string starts with 曇', function() {
      weatherLed._operateCloudLed('曇り');
      expect(weatherLed._leds.cloud.on).to.have.been.calledOnce;
    });

    it('should pulse LED if weather string contains のち曇', function() {
      weatherLed._operateCloudLed('雨のち曇');
      expect(weatherLed._leds.cloud.pulse).to.have.been.calledOnce;
    });

    it('should blink LED if weather string contains 時々曇', function() {
      weatherLed._operateCloudLed('雨時々曇');
      expect(weatherLed._leds.cloud.blink)
          .to.have.been.calledOnceWithExactly(weatherLed._blinkInterval);
    });

    it('should turn off LED for other weather string patterns ', function() {
      weatherLed._operateCloudLed('雨');
      expect(weatherLed._leds.cloud.stop).to.have.been.calledOnce;
      expect(weatherLed._leds.cloud.off).to.have.been.calledOnce;
    });
  });

  describe('operateRainLed()', function() {
    it('should turn on LED if weather string starts with 雨', function() {
      weatherLed._operateRainLed('雨');
      expect(weatherLed._leds.rain.on).to.have.been.calledOnce;
    });

    it('should pulse LED if weather string contains のち雨', function() {
      weatherLed._operateRainLed('晴のち雨');
      expect(weatherLed._leds.rain.pulse).to.have.been.calledOnce;
    });

    it('should blink LED if weather string contains 時々雨', function() {
      weatherLed._operateRainLed('晴時々雨');
      expect(weatherLed._leds.rain.blink)
          .to.have.been.calledOnceWithExactly(weatherLed._blinkInterval);
    });

    it('should turn off LED for other weather string patterns ', function() {
      weatherLed._operateRainLed('晴れ');
      expect(weatherLed._leds.rain.stop).to.have.been.calledOnce;
      expect(weatherLed._leds.rain.off).to.have.been.calledOnce;
    });
  });

  describe('operateSnowLed()', function() {
    it('should turn on LED if weather string starts with 雪', function() {
      weatherLed._operateSnowLed('雪');
      expect(weatherLed._leds.snow.on).to.have.been.calledOnce;
    });

    it('should pulse LED if weather string contains のち雪', function() {
      weatherLed._operateSnowLed('晴のち雪');
      expect(weatherLed._leds.snow.pulse).to.have.been.calledOnce;
    });

    it('should blink LED if weather string contains 時々雪', function() {
      weatherLed._operateSnowLed('晴時々雪');
      expect(weatherLed._leds.snow.blink)
          .to.have.been.calledOnceWithExactly(weatherLed._blinkInterval);
    });

    it('should turn off LED for other weather string patterns ', function() {
      weatherLed._operateSnowLed('晴れ');
      expect(weatherLed._leds.snow.stop).to.have.been.calledOnce;
      expect(weatherLed._leds.snow.off).to.have.been.calledOnce;
    });
  });

  describe('operateWeatherLeds()', function() {
    it('should operate all LEDs', function() {
      const normalizeStub = sandbox.stub(weatherLed, '_normalizeWeatherString');
      const fineLedStub = sandbox.stub(weatherLed, '_operateFineLed');
      const cloudLedStub = sandbox.stub(weatherLed, '_operateCloudLed');
      const rainLedStub = sandbox.stub(weatherLed, '_operateRainLed');
      const snowLedStub = sandbox.stub(weatherLed, '_operateSnowLed');

      weatherLed.operateWeatherLeds('晴れ');

      expect(normalizeStub).to.have.been.calledOnce;
      expect(fineLedStub).to.have.been.calledOnce;
      expect(cloudLedStub).to.have.been.calledOnce;
      expect(rainLedStub).to.have.been.calledOnce;
      expect(snowLedStub).to.have.been.calledOnce;
    });
  });

  describe('turnOffWeatherLeds()', function() {
    it('should turn off all LEDs', function() {
      weatherLed.turnOffWeatherLeds();

      expect(weatherLed._leds.fine.stop).to.have.been.calledOnce;
      expect(weatherLed._leds.cloud.stop).to.have.been.calledOnce;
      expect(weatherLed._leds.rain.stop).to.have.been.calledOnce;
      expect(weatherLed._leds.snow.stop).to.have.been.calledOnce;

      expect(weatherLed._leds.fine.off).to.have.been.calledOnce;
      expect(weatherLed._leds.cloud.off).to.have.been.calledOnce;
      expect(weatherLed._leds.rain.off).to.have.been.calledOnce;
      expect(weatherLed._leds.snow.off).to.have.been.calledOnce;
    });
  });

  describe('_normalizeWeatherString()', function() {
    it('should remove 大 character', function() {
      expect(weatherLed._normalizeWeatherString('大雨')).to.equal('雨');
    });

    it('should remove 暴風 characters', function() {
      expect(weatherLed._normalizeWeatherString('暴風雨')).to.equal('雨');
    });

    it('should remove 雷 characters', function() {
      expect(weatherLed._normalizeWeatherString('晴のち雷雨')).to.equal('晴のち雨');
    });

    it('should replace 一時 with 時々', function() {
      expect(weatherLed._normalizeWeatherString('曇一時雨'))
          .to.equal('曇時々雨');
    });

    it('should replace 雨か雪 with 雨', function() {
      expect(weatherLed._normalizeWeatherString('雨か雪')).to.equal('雨');
    });

    it('should replace 雪か雨 with 雪', function() {
      expect(weatherLed._normalizeWeatherString('雪か雨')).to.equal('雪');
    });
  });
});
