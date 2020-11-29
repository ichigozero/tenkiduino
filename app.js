/* eslint-disable require-jsdoc */

const five = require('johnny-five');
const {registerFont} = require('canvas');
const Oled = require('oled-js');

const WeatherLed = require('./lib/led');
const WeatherScraper =require('./lib/scraper');
const OledDisplay = require('./lib/display');

const updateInterval = 60 * 60 * 1000; // milliseconds
const font = 'k8x12';
const fontSize = 12;
const oledHeight = 64;
let isTodayForecast = true;
let isButtonHeld = false;

registerFont('./font/k8x12.ttf', {family: font});

function main() {
  const board = new five.Board();
  const weatherScraper = new WeatherScraper();

  board.on('ready', async () => {
    const opts = {
      width: 128,
      height: oledHeight,
      address: 0x3C,
    };

    const oled = new Oled(board, five, opts);
    const button = new five.Button(2);

    const locationIds = {
      regionId: 3,
      prefectureId: 16,
      subPrefectureId: 4410,
      cityId: 13103,
    };

    const weatherLed = new WeatherLed({
      fine: new five.Led(11),
      cloud: new five.Led(9),
      rain: new five.Led(7),
      snow: new five.Led(5),
    });

    const oledDisplay = new OledDisplay(oled);
    let summary = await weatherScraper.getForecastSummary(locationIds);

    function outputForecast() {
      let forecast = null;

      if (isTodayForecast) {
        forecast = summary.forecasts.today;
      } else {
        forecast = summary.forecasts.tomorrow;
      }

      weatherLed.operateWeatherLeds(forecast.weather);

      oledDisplay.init(
          oledHeight,
          font,
          fontSize,
          text=[
            summary.city,
            summary.updateDateTime,
            forecast.weather,
            forecast.date,
            '最高: ' + forecast.temps.max,
            '最低: ' + forecast.temps.min,
          ],
      );
      oledDisplay.writeText();
    }

    outputForecast();

    setInterval(async () => {
      summary = await weatherScraper.getForecastSummary(locationIds);
      outputForecast();
    }, updateInterval);

    button.on('press', function() {
      oledDisplay.showNextPage();
    });

    button.on('hold', async function() {
      if (!isButtonHeld) {
        isButtonHeld = true;
        isTodayForecast = !isTodayForecast;
        outputForecast();
      }
    });

    button.on('release', function() {
      if (isButtonHeld) isButtonHeld = false;
    });

    board.on('exit', () => {
      weatherLed.turnOffWeatherLeds();
      oled.clearDisplay();
      oled.turnOffDisplay();
    });
  });
}

main();
