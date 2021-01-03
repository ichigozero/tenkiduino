# About
Arduino weather station built with Nodejs

# Installation
```bash
$ npm install . \
  && cd node_modules/oled-js \
  && tsc -b
```

# Wiring
See below diagram for wiring reference.

# Usage
```bash
node app.js URL [OPTIONS]
```

Run the following command to display Minato ward of Tokyo weather information.

```bash
node app.js "https://tenki.jp/forecast/3/16/4410/13103/"
```

## OPTIONS
```
    -h, --help                      Print this help text and exit
    --version                       Print program version and exit
    --pinFine, --pf                 Digital pin number for Fine LED.
                                    Default: 11
    --pinCloud, --pc                Digital pin number for Cloud LED.
                                    Default: 9
    --pinRain, --pr                 Digital pin number for Rain LED.
                                    Default: 7
    --pinSnow, --ps                 Digital pin number for Snow LED.
                                    Default: 5
    --pinButton, --pb               Digital pin number for push button.
                                    Default: 2
    --oledAddress, --oa             OLED I2C Address.
                                    Default: 0x3C
```
