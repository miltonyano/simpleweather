# simpleweather

This is the Simple Weather plugin for jQuery which is based on [jQuery.simpleWeather](https://github.com/monkeecreate/jquery.simpleWeather) by [James Fleeting](https://twitter.com/fleetingftw). It updates the original library to satisfy the new version of Yahoo's Weather API. 

## Usage:

- You must create [Create a Yahoo Project](https://developer.yahoo.com/weather/) to get an "App ID", "Client ID (Consumer Key)", and "Client Secret (Consumer Secret)"
- You must use jQuery
- You must use CryptoJS

See a full example inside the `example` folder. Don't forget to insert your `app_id`, `consumer_key` and `consumer_secret` inside the `example.js` file.

```
$.simplerWeather( {
  location: '43.7181557,-79.5181407',
  unit: 'c',
  app_id: 'YOUR_APP_ID',
  consumer_key: 'YOUR_CLIENT_ID',
  consumer_secret: 'YOUR_CLIENT_SECRET',
  success: function( weather ) { ... },
  error: function( error ) { ... }
```

The returning weather object has the following structure:
```
{
  alt: {
    high: 55
    low: 43
    temp: 54
    unit: "f"
  },
  city: "Toronto",
  code: 26,
  country: "Canada",
  currently: "Cloudy",
  forecast: [
    {
      alt: {
        high: 55
        low: 43
      },
      code: 11,
      date: 1589688000,
      day: "Sun",
      high: 13,
      image: "https://s.yimg.com/zz/combo?a/i/us/nws/weather/gr/11d.png",
      low: 6,
      text: "Showers",
      thumbnail: "https://s.yimg.com/zz/combo?a/i/us/nws/weather/gr/11ds.png",
    },
    ...
  ],
  heatindex: 12,
  high: 13,
  humidity: 67,
  image: "https://s.yimg.com/zz/combo?a/i/us/nws/weather/gr/26d.png",
  low: 6,
  pressure: 1004,
  region: " ON",
  sunrise: "5:50 am",
  sunset: "8:40 pm",
  temp: 12,
  text: "Showers",
  thumbnail: "https://s.yimg.com/zz/combo?a/i/us/nws/weather/gr/26ds.png",
  title: "Toronto,  ON, Canada",
  todayCode: 11,
  units: {
    distance: "km",
    pressure: "mbar",
    speed: "kph",
    temp: "C",
  },
  updated: 1589749200,
  visibility: 16.1,
  wind: {
    chill: 11,
    direction: "ENE",
    speed: 20,
  },
}
```

By default `unit` if in US standard (`unit: 'f'`)
```
'f': {
  'distance': 'mi',
  'pressure': 'inHg'
  'speed': 'mph',
  'temp': 'F',
}
```