/* eslint-disable require-jsdoc */

class Scraper {
  constructor() {
    this._$ = null;
  }

  async _fetchPage(url) {
    const cheerio = require('cheerio');
    const got = require('got');

    const response = await got(url)
        .then((response) => response.body)
        .catch((error) => console.log(error));

    if (response) {
      this._$ = cheerio.load(response);
    } else {
      // avoid previous page being scraped more than once
      // if the subsequent fetch failed
      this._$ = null;
    }
  }
}

class WeatherScraper extends Scraper {
  getForecastSummary({regionId, prefectureId, subPrefectureId, cityId}) {
    const url = (
      `https://tenki.jp/forecast/${regionId}/${prefectureId}/` +
      `${subPrefectureId}/${cityId}/`
    );

    this._fetchPage(url);

    if (this._$) {
      const h2 = this._$('section.section-wrap').find('h2');
      const updateDateTime = h2
          .find('time.date-time')
          .text()
          .trim()
          .replace('発表', '');

      const h2Copy = h2.clone();
      h2Copy.find('time').remove();
      const cityName = h2Copy.text().trim().replace('の天気', '');

      const todaySection = this._$('section.today-weather');
      const tomorrowSection = this._$('section.tomorrow-weather');

      return {
        city: cityName,
        updateDateTime: updateDateTime,
        forecasts: {
          today: this._getForecastData(todaySection),
          tomorrow: this._getForecastData(tomorrowSection),
        },
      };
    }
    return null;
  }

  _getForecastData(sectionTag) {
    const date = sectionTag
        .find('h3')
        .text()
        .trim()
        .replace(/[\n  +]/g, '');
    const weather = sectionTag.find('p.weather-telop').text().trim();
    const maxTemp = (() => {
      const temp = sectionTag
          .find('dd.high-temp.temp')
          .text()
          .replace(/[\n\s+]/g, '');
      const diff = sectionTag.find('dd.high-temp.tempdiff').text().trim();

      return `${temp} ${diff}`;
    })();
    const minTemp = (() => {
      const temp = sectionTag
          .find('dd.low-temp.temp')
          .text()
          .replace(/[\n\s+]/g, '');
      const diff = sectionTag.find('dd.low-temp.tempdiff').text().trim();

      return `${temp} ${diff}`;
    })();

    return {
      date: date,
      weather: weather,
      temps: {
        max: maxTemp,
        min: minTemp,
      },
    };
  }
}

module.exports = WeatherScraper;
