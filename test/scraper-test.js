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
  const url = 'https://tenki.jp/forecast/3/16/4410/13103/';
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it('should compose weather page URL given location IDs', function() {
    const locationIds = {
      regionId: 3,
      prefectureId: 16,
      subPrefectureId: 4410,
      cityId: 13103,
    };
    const output = scraper.composeUrl(locationIds);
    expect(output).to.eql(url);
  });

  it('should fetch weather forecast summary', async function() {
    const stub = sandbox.stub(scraper, '_fetchPage').callsFake(() => {
      scraper._$ = cheerio.load(fs.readFileSync(testFilePath));
    });

    const output = await scraper.getForecastSummary(url);
    const expected = {
      'city': '港区',
      'updateDateTime': '17日16:00',
      'forecasts': {
        'today': {
          'date': '今日 11月17日(火)[赤口]',
          'temps': {
            'max': '21℃ [-1]',
            'min': '13℃ [+3]',
          },
          'weather': '晴',
        },
        'tomorrow': {
          'date': '明日 11月18日(水)[先勝]',
          'temps': {
            'max': '20℃ [-1]',
            'min': '10℃ [-3]',
          },
          'weather': '晴時々曇',
        },
      },
    };

    expect(stub).to.have.been.calledWith(url);
    expect(output).to.eql(expected);
  });

  it('should return null if forecast page cannot be fetched', async function() {
    sandbox.stub(scraper, '_fetchPage').callsFake(() => {
      scraper._$ = null;
    });

    expect(await scraper.getForecastSummary(url)).to.equal(null);
  });
});
