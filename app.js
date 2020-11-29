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

    async function displayForecast() {
      const summary = await weatherScraper.getForecastSummary(locationIds);
      const weather = summary.forecasts.today.weather;

      weatherLed.operateWeatherLeds(weather);

      oledDisplay.init(
          oledHeight,
          font,
          fontSize,
          text=[
            summary.city,
            summary.updateDateTime,
            weather,
            summary.forecasts.today.date,
            '最高: ' + summary.forecasts.today.temps.max,
            '最低: ' + summary.forecasts.today.temps.min,
          ],
      );
      oledDisplay.writeText();
    }

    await displayForecast();

    setInterval(async () => {
      await displayForecast();
    }, updateInterval);

    button.on('down', function() {
      oledDisplay.showNextPage();
    });

    board.on('exit', () => {
      weatherLed.turnOffWeatherLeds();
      oled.clearDisplay();
      oled.turnOffDisplay();
    });
  });
}

main();
