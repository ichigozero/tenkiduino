# About
Arduino weather station built with Nodejs. This app will pull weather
information from Japanese weather website tenki.jp and display them
with the use of LEDs and OLED display.

# Hardware
- Arduino UNO
- 128x64 I2C OLED display
- 4 LEDs
- 1 push button

# Installation
```bash
$ npm install . \
  && cd node_modules/oled-js \
  && tsc -b
```

# Wiring
See below diagram for wiring reference.

![wiring](/diagram/wiring.png)

# Example
Click below links for actual example.

[today-page-1](/diagram/tenkiduino_today_p1.jpg)\
[today-page-2](/diagram/tenkiduino_today_p2.jpg)\
[tomorrow-page-1](/diagram/tenkiduino_tmr_p1.jpg)\
[tomorrow-page-2](/diagram/tenkiduino_tmr_p2.jpg)

# Usage
## Command
```bash
node app.js URL [OPTIONS]
```

Run the following command to display Minato ward of Tokyo weather information.

```bash
node app.js "https://tenki.jp/forecast/3/16/4410/13103/"
```

## Controlling OLED display

- Display weather information in the next page
    - Press the button
- Display today/tomorrow weather information
    - Hold the button for 5 seconds

## OPTIONS
```
    --version                       Print program version and exit
    -h, --help                      Print this help text and exit
    -R, --refresh                   Refresh interval in minutes.
                                    Default: 60
    -f, --pinFine                   Digital pin number for Fine LED.
                                    Default: 11
    -c, --pinCloud                  Digital pin number for Cloud LED.
                                    Default: 9
    -r, --pinRain                   Digital pin number for Rain LED.
                                    Default: 7
    -s, --pinSnow                   Digital pin number for Snow LED.
                                    Default: 5
    -b, --pinButton                 Digital pin number for push button.
                                    Default: 2
    -a, --oledAddress               OLED I2C Address.
                                    Default: 0x3C
```
