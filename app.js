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
let isTodayForecast = true;
let isButtonHeld = false;

registerFont('./font/k8x12.ttf', {family: font});

function main(yargs) {
  const board = new five.Board();
  const weatherScraper = new WeatherScraper();

  board.on('ready', async () => {
    const opts = {
      width: 128,
      height: 64,
      address: yargs.oledAddress,
    };

    const oled = new Oled(board, five, opts);
    const button = new five.Button(yargs.buttonPin);
    const weatherLed = new WeatherLed({
      fine: new five.Led(yargs.pinFine),
      cloud: new five.Led(yargs.pinCloud),
      rain: new five.Led(yargs.pinRain),
      snow: new five.Led(yargs.pinSnow),
    });

    const oledDisplay = new OledDisplay(oled);
    let summary = await weatherScraper.getForecastSummary(yargs.url);

    function outputForecast() {
      let forecast = null;

      if (isTodayForecast) {
        forecast = summary.forecasts.today;
      } else {
        forecast = summary.forecasts.tomorrow;
      }

      weatherLed.operateWeatherLeds(forecast.weather);

      oledDisplay.init(
          font,
          fontSize,
          text=[
            summary.city,
            summary.updateDateTime,
            forecast.date,
            forecast.weather,
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

const yargs = require('yargs/yargs')(process.argv.slice(2))
    .usage('Usage: $0 <command> [options]')
    .command('url', 'tenki.jp weather page URL')
    .example(
        '$0 https://tenki.jp/forecast/3/16/4410/13103/',
        'Display Minato ward of Tokyo weather information',
    )
    .demandCommand(1)
    .options({
      'pinFine': {
        description: 'Digital pin number for Fine LED',
        default: 11,
        alias: 'pf',
      },
      'pinCloud': {
        description: 'Digital pin number for Cloud LED',
        default: 9,
        alias: 'pc',
      },
      'pinRain': {
        description: 'Digital pin number for Rain LED',
        default: 7,
        alias: 'pr',
      },
      'pinSnow': {
        description: 'Digital pin number for Snow LED',
        default: 5,
        alias: 'ps',
      },
      'pinButton': {
        description: 'Digital pin number for push button',
        default: 2,
        alias: 'pb',
      },
      'oledAddress': {
        description: 'OLED I2C Address',
        default: 0x3C,
        alias: 'oa',
      },
    })
    .help('h')
    .alias('h', 'help')
    .argv;

main(yargs).catch(console.dir);
