/* eslint-disable require-jsdoc */

const five = require('johnny-five');
const {registerFont} = require('canvas');
const Oled = require('oled-js');

const WeatherLed = require('./lib/led');
const WeatherScraper =require('./lib/scraper');
const {generateOledFont} = require('./lib/display');

const updateInterval = 60 * 60 * 1000; // milliseconds
const font = 'k8x12';

registerFont('./font/k8x12.ttf', {family: font});

function main() {
  const board = new five.Board();
  const weatherScraper = new WeatherScraper();

  board.on('ready', async () => {
    const opts = {
      width: 128,
      height: 64,
      address: 0x3C,
    };

    const oled = new Oled(board, five, opts);

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

    async function displayForecast() {
      const summary = await weatherScraper.getForecastSummary(locationIds);
      const weather = summary.forecasts.today.weather;

      weatherLed.operateWeatherLeds(weather);
      oledFont = generateOledFont(font, 12, [weather]);

      oled.setCursor(1, 1);
      oled.writeString(oledFont, 1, weather, 1, true, 2);
      oled.update();
    }

    await displayForecast();

    setInterval(async () => {
      await displayForecast();
    }, updateInterval);

    board.on('exit', () => {
      weatherLed.turnOffWeatherLeds();
      oled.turnOffDisplay();
    });
  });
}

main();
