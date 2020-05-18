$( document ).ready( function() {
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(loadWeather);
  }
  else { 
    $("#weather").text('Please share your location');
  }

  function loadWeather(position){
    $.simpleWeather({
      location: `${position.coords.latitude},${position.coords.longitude}`,
      unit: 'c',
      app_id: 'YOUR_APP_ID',
      consumer_key: 'YOUR_CLIENT_ID',
      consumer_secret: 'YOUR_CLIENT_SECRET',
      success: function(weather) {
        $("#weather").html(`
          <div>${weather.city}, ${weather.region}, ${weather.country}</div>
          <div><i style="font-size:xxx-large;"  class="icon-${weather.code}"></i></div>
          <div>${weather.currently}</div>
          <div>${weather.temp}&deg;${weather.units.temp}</div>
          <div>Wind: ${weather.wind.direction} ${weather.wind.speed} ${weather.units.speed}</div>
          <div>Visibility: ${weather.visibility} ${weather.units.distance}</div>

        `);
      },
      error: function(error) {
        $("#weather").text('Sorry, the Weather is not available.');
        console.log(error);
      }
    });
  }
});

