const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chai = require('chai');
const expect = chai.expect;

chai.use(sinonChai);

const WeatherScraper = require('../lib/scraper');

describe('WeatherScraper', function() {
  const scraper = new WeatherScraper();
  const testFilePath = path.join(
      __dirname,
      'scraperTestFiles/forecastSummary.html',
  );

  it('should fetch weather forecast summary', function() {
    const stub = sinon.stub(scraper, '_fetchPage').callsFake(() => {
      scraper._$ = cheerio.load(fs.readFileSync(testFilePath));
    });

    const locationIds = {
      regionId: 3,
      prefectureId: 16,
      subPrefectureId: 4410,
      cityId: 13103,
    };

    const url = 'https://tenki.jp/forecast/3/16/4410/13103/';
    const forecastSummary = scraper.getForecastSummary(locationIds);

    expect(stub).to.have.been.calledWith(url);
    expect(forecastSummary).to.equal('晴');
  });
});
