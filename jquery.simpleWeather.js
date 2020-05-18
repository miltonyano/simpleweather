/*!
 *  simpleWeather v3.1.0 - http://simpleweatherjs.com
 *  modified by Milton Yano (2019) to satisfy new Yahoo weather api
 * 
 *  
 *  */

(function($) {
  'use strict';

  function getAltTemp(unit, temp) {
    if(unit === 'f') {
      return Math.round((5.0/9.0)*(temp-32.0));
    } else {
      return Math.round((9.0/5.0)*temp+32.0);
    }
  }

  $.extend({
    simpleWeather: function(options){
      options = $.extend({
        location: '',
        woeid: '',
        unit: 'f',
        app_id: '',
        consumer_key: '',
        consumer_secret: '',
        success: function(weather){},
        error: function(message){}
      }, options);

    if (options.app_id === ''){
        options.error('Please insert an app_id');
        return false;
    }
    if (options.consumer_key === ''){
        options.error('Please insert an consumer_key');
        return false;
    }
    if (options.consumer_secret === ''){
        options.error('Please insert an consumer_secret');
        return false;
    }
    
    const units = {
        'f': {
            'temp': 'F',
            'distance': 'mi',
            'speed': 'mph',
            'pressure': 'inHg'
        },
        'c': {
            'temp': 'C',
            'distance': 'km',
            'speed': 'kph',
            'pressure': 'mbar'
        }
    };
    
    const baseUrl = 'https://weather-ydn-yql.media.yahoo.com/forecastrss';
    const method = 'GET';
    const query = {'format': 'json'};
    const concat = '&';
    const oauth = {
        'oauth_consumer_key': options.consumer_key,
        'oauth_nonce': Math.random().toString(36).substring(2),
        'oauth_signature_method': 'HMAC-SHA1',
        'oauth_timestamp': parseInt(new Date().getTime() / 1000).toString(),
        'oauth_version': '1.0'
    };

    if(options.location !== '') {
        /* If latitude/longitude coordinates, need to format a little different. */
        if(/^(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)$/.test(options.location)) {
            const [latitude, longitude] = options.location.split(',');
            query.lat = latitude;
            query.lon = longitude;
        } else {
            query.location = options.location;
        }
        
    } else if(options.woeid !== '') {
        query.woeid = options.woeid;
    } else {
        options.error('Could not retrieve weather due to an invalid location.');
        return false;
    }
    
    if(options.unit !== 'f'){
        query.u = options.unit;
    }
        
    const merged = {}; 
    $.extend(merged, query, oauth);
    // Note the sorting here is required
    const merged_arr = Object.keys(merged).sort().map(function(k) {
      return [k + '=' + encodeURIComponent(merged[k])];
    });
    
    const signature_base_str = method + concat + encodeURIComponent(baseUrl) + concat + encodeURIComponent(merged_arr.join(concat));
    const composite_key = encodeURIComponent(options.consumer_secret) + concat;
    const hash = CryptoJS.HmacSHA1(signature_base_str, composite_key);
    const signature = hash.toString(CryptoJS.enc.Base64);
    
    oauth['oauth_signature'] = signature;
    const auth_header = 'OAuth ' + Object.keys(oauth).map(function(k) {
      return [k + '="' + oauth[k] + '"'];
    }).join(',');
    
    $.ajax({
        url: baseUrl + '?' + $.param(query),
        headers: {
          'Authorization': auth_header,
          'X-Yahoo-App-Id': options.app_id 
        },
        method: 'GET',
        success: function(data){
            if(data !== null && data.error !== null && data.current_observation !== null) {
              const weather = {};
              const compass = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N'];
              const image404 = 'https://s.yimg.com/os/mit/media/m/weather/images/icons/l/44d-100567.png';
          
            weather.title = `${data.location.city}, ${data.location.region}, ${data.location.country}`;
            weather.temp = data.current_observation.condition.temperature;
            weather.code = data.current_observation.condition.code;
            weather.todayCode = data.forecasts[0].code;
            weather.currently = data.current_observation.condition.text;
            weather.high = data.forecasts[0].high;
            weather.low = data.forecasts[0].low;
            weather.text = data.forecasts[0].text;
            weather.humidity = data.current_observation.atmosphere.humidity;
            weather.pressure = data.current_observation.atmosphere.pressure;
            weather.visibility = data.current_observation.atmosphere.visibility;
            weather.sunrise = data.current_observation.astronomy.sunrise;
            weather.sunset = data.current_observation.astronomy.sunset;
            weather.city = data.location.city;
            weather.country = data.location.country;
            weather.region = data.location.region;
            weather.updated = data.current_observation.pubDate; //CONVERT timestamp?
            weather.units = units[options.unit];
            weather.wind = {chill: data.current_observation.wind.chill, direction: compass[Math.round(data.current_observation.wind.direction / 22.5)], speed: data.current_observation.wind.speed};
            
            if(weather.temp < 80 && weather.humidity < 40) {
                weather.heatindex = -42.379+2.04901523*weather.temp+10.14333127*weather.humidity-0.22475541*weather.temp*weather.humidity-6.83783*(Math.pow(10, -3))*(Math.pow(weather.temp, 2))-5.481717*(Math.pow(10, -2))*(Math.pow(weather.humidity, 2))+1.22874*(Math.pow(10, -3))*(Math.pow(weather.temp, 2))*weather.humidity+8.5282*(Math.pow(10, -4))*weather.temp*(Math.pow(weather.humidity, 2))-1.99*(Math.pow(10, -6))*(Math.pow(weather.temp, 2))*(Math.pow(weather.humidity,2));
            } else {
                weather.heatindex = weather.temp;
            }

            if(weather.code == '3200') {
              weather.thumbnail = image404;
              weather.image = image404;
            } else {
              weather.thumbnail = 'https://s.yimg.com/zz/combo?a/i/us/nws/weather/gr/' + weather.code + 'ds.png';
              weather.image = 'https://s.yimg.com/zz/combo?a/i/us/nws/weather/gr/' + weather.code + 'd.png';
            }

            weather.alt = {temp: getAltTemp(options.unit, weather.temp), high: getAltTemp(options.unit, weather.high), low: getAltTemp(options.unit, weather.low)};
            if(options.unit === 'f') {
              weather.alt.unit = 'c';
            } else {
              weather.alt.unit = 'f';
            }

            weather.forecast = [];
            for(let i=0; i < data.forecasts.length; i++) {
              const forecast = data.forecasts[i];
              forecast.alt = {high: getAltTemp(options.unit, forecast.high), low: getAltTemp(options.unit, forecast.low)};

              if(forecast.code == "3200") {
                forecast.thumbnail = image404;
                forecast.image = image404;
              } else {
                forecast.thumbnail = 'https://s.yimg.com/zz/combo?a/i/us/nws/weather/gr/' + forecast.code + 'ds.png';
                forecast.image = 'https://s.yimg.com/zz/combo?a/i/us/nws/weather/gr/' + forecast.code + 'd.png';
              }

              weather.forecast.push(forecast);
            }

            options.success(weather);
            
          } else {
            options.error('There was a problem retrieving the latest weather information.');
          }
          
          
          }
      });
          
    return this;  
      
    }
  });
})(jQuery);