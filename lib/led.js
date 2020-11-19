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

  operateFineLed(weather) {
    const keyword = {
      definite: '晴',
      later: 'のち晴',
      sometimes: '時々晴',
    };

    this._operateLed(this._leds.fine, weather, keyword);
  }

  operateCloudLed(weather) {
    const keyword = {
      definite: '曇',
      later: 'のち曇',
      sometimes: '時々曇',
    };

    this._operateLed(this._leds.cloud, weather, keyword);
  }

  operateRainLed(weather) {
    const keyword = {
      definite: '雨',
      later: 'のち雨',
      sometimes: '時々雨',
    };

    this._operateLed(this._leds.rain, weather, keyword);
  }

  operateSnowLed(weather) {
    const keyword = {
      definite: '雪',
      later: 'のち雪',
      sometimes: '時々雪',
    };

    this._operateLed(this._leds.snow, weather, keyword);
  }

  _operateLed(led, weather, {definite, later, sometimes}) {
    const newWeather = this._normalizeWeatherString(weather);

    if (newWeather.startsWith(definite)) {
      led.on();
    } else if (newWeather.includes(later)) {
      led.pulse();
    } else if (newWeather.includes(sometimes)) {
      led.blink(this._blinkInterval);
    } else {
      led.off();
    }
  }

  _normalizeWeatherString(weather) {
    return weather
        .replace(/[大|暴風|雷]/g, '')
        .replace(/一時/g, '時々')
        .replace(/雨か雪/g, '雨')
        .replace(/雪か雨/g, '雪');
  }
}

module.exports = WeatherLed;
