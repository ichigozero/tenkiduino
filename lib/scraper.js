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
    function getForecastData(sectionTag) {
      return sectionTag.find('p.weather-telop').text().trim();
    }

    const url = (
      `https://tenki.jp/forecast/${regionId}/${prefectureId}/` +
      `${subPrefectureId}/${cityId}/`
    );

    this._fetchPage(url);

    if (this._$) {
      const todaySection = this._$('section.today-weather');
      return getForecastData(todaySection);
    }
    return null;
  }
}

module.exports = WeatherScraper;
