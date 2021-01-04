/* eslint-disable require-jsdoc */

class WeatherLed {
  constructor({fine, cloud, rain, snow}, blinkInterval=2000) {
    this._leds = {
      fine: fine,
      cloud: cloud,
      rain: rain,
      snow: snow,
    };
    this._blinkInterval = blinkInterval;
  }

  _operateFineLed(weather) {
    const keyword = {
      definite: '晴',
      later: 'のち晴',
      sometimes: '時々晴',
    };

    this._operateLed(this._leds.fine, weather, keyword);
  }

  _operateCloudLed(weather) {
    const keyword = {
      definite: '曇',
      later: 'のち曇',
      sometimes: '時々曇',
    };

    this._operateLed(this._leds.cloud, weather, keyword);
  }

  _operateRainLed(weather) {
    const keyword = {
      definite: '雨',
      later: 'のち雨',
      sometimes: '時々雨',
    };

    this._operateLed(this._leds.rain, weather, keyword);
  }

  _operateSnowLed(weather) {
    const keyword = {
      definite: '雪',
      later: 'のち雪',
      sometimes: '時々雪',
    };

    this._operateLed(this._leds.snow, weather, keyword);
  }

  operateWeatherLeds(weather) {
    const newWeather = this._normalizeWeatherString(weather);

    this._operateFineLed(newWeather);
    this._operateCloudLed(newWeather);
    this._operateRainLed(newWeather);
    this._operateSnowLed(newWeather);
  }

  _normalizeWeatherString(weather) {
    return weather
        .replace(/[大|暴風|雷]/g, '')
        .replace(/一時/g, '時々')
        .replace(/雨か雪/g, '雨')
        .replace(/雪か雨/g, '雪');
  }

  _operateLed(led, weather, {definite, later, sometimes}) {
    if (weather.startsWith(definite)) {
      led.on();
    } else if (weather.includes(later)) {
      led.pulse();
    } else if (weather.includes(sometimes)) {
      led.blink(this._blinkInterval);
    } else {
      led.stop();
      led.off();
    }
  }

  turnOffWeatherLeds() {
    for (const led of Object.values(this._leds)) {
      led.stop();
      led.off();
    }
  }
}

module.exports = WeatherLed;
