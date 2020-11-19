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

  _operateLed(led, weather, {definite, later, sometimes}) {
    if (weather.startsWith(definite)) {
      led.on();
    } else if (weather.includes(later)) {
      led.pulse();
    } else if (weather.includes(sometimes)) {
      led.blink(this._blinkInterval);
    } else {
      led.off();
    }
  }
}

module.exports = WeatherLed;
