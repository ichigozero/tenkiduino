/* eslint-disable require-jsdoc */

const {Board, Led} = require('johnny-five');

const WeatherLed = require('./lib/led');
const WeatherScraper =require('./lib/scraper');

const updateInterval = 60 * 60 * 1000; // milliseconds

function main() {
  const board = new Board();
  const weatherScraper = new WeatherScraper();

  board.on('ready', async () => {
    const locationIds = {
      regionId: 3,
      prefectureId: 16,
      subPrefectureId: 4410,
      cityId: 13103,
    };

    const weatherLed = new WeatherLed({
      fine: new Led(11),
      cloud: new Led(9),
      rain: new Led(7),
      snow: new Led(5),
    });

    let summary = await weatherScraper.getForecastSummary(locationIds);
    let weather = summary.forecasts.today.weather;

    weatherLed.operateWeatherLeds(weather);

    setInterval(async () => {
      summary = await weatherScraper.getForecastSummary(locationIds);
      weather = summary.forecasts.today.weather;

      weatherLed.operateWeatherLeds(weather);
    }, updateInterval);

    board.on('exit', () => {
      weatherLed.turnOffWeatherLeds();
    });
  });
}

main();
