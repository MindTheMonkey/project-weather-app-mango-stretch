// Here we put all the code that renders the frontend
const displayWeather = (weatherData) => {
  // Check if the weatherData passed is actually valid data.
  if (!weatherData || !weatherData.current) {
    console.error("Invalid weather data");
    return;
  }
  // We connect weatherContainer to the DomObject the weather container.
  const timezoneOffset = weatherData.timezone;
  const weatherContainer = document.getElementById("weather");
  const sunriseTime = convertTimestampToTime(weatherData.current.sys.sunrise, timezoneOffset);
  const sunsetTime = convertTimestampToTime(weatherData.current.sys.sunset, timezoneOffset);
  const temperatureCelsius = Math.round(weatherData.current.main.temp);
  const weatherStatus = weatherData.current.weather[0].main.toLowerCase();

  // Example data just to render something
  weatherContainer.innerHTML = `
    <div class="overview"
      <p>Sunrise is at ${sunriseTime}</p>
      <p>Sunset is at ${sunsetTime}</p>
      <p>It is ${weatherStatus} outside today!</p>
      <p> The temperature is ${temperatureCelsius} °C</p>
    </div>
    <div class="header">
      <h1>Welcome to ${weatherData.city}. Here's what the weather will be like this week:</h1>
    </div>
    <div id="forecast">
    </div>
    <div class="search">
    </div>
  `;
}

const displayforecast = (forecastData) => {
  // Check if the forecastData passed is actually valid data.
  if (!forecastData || !forecastData.list) {
    console.error("Invalid forecast data");
    return;
  }

  const forecastContainer = document.getElementById("forecast");

  // We grab the timezone offset from the data and declare a const
  const timezoneOffset = forecastData.city.timezone;

  const getWeekdayShort = (timestamp) => {
    const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const day = new Date(timestamp);
    return weekday[day.getUTCDay()];
  }

  const isToday = (timestamp, timezoneOffset) => {
    const currentTime = new Date().getTime();
    const today = new Date(currentTime + (timezoneOffset * 1000));
    const date = new Date(timestamp);

    return (date.getUTCDate() === today.getUTCDate()) && (date.getUTCMonth() === today.getUTCMonth()) && (date.getUTCFullYear() === today.getUTCFullYear());
  }

  // Clear any existing content in the forecast container.
  forecastContainer.innerHTML = "";

  // We only want to grab the weather forcast closest to midday every day
  const filteredForecast = forecastData.list.filter((item) => {
    // We grab the timestamp for the forecast and offset it with the timezone
    const fcDate = new Date((item.dt + timezoneOffset) * 1000);
    // We convert the date object into minutes from midnight
    const minutes = (fcDate.getUTCHours() * 60) + fcDate.getUTCMinutes()
    // We filter for any forecast that has timestamp between 10:31 and 13:30 local time.
    // Since the forecasts comes in 3h blocks only one block per day can match
    return ((minutes > (10.5 * 60)) && (minutes <= (13.5 * 60)))
  })

  // Iterate through the forecast data and display each forecast item.
  filteredForecast.forEach((forecast) => {
    const timestamp = (forecast.dt + timezoneOffset) * 1000;
    if(isToday(timestamp, timezoneOffset)) return;
    const day = getWeekdayShort(timestamp);
    const temperature = Math.round(forecast.main.temp);

    const forecastRow = document.createElement("div");
    const forecastWeekday = document.createElement("p");
    const forecastTemperature = document.createElement("p");

    forecastRow.classList.add("forecast-row");
    forecastTemperature.classList.add("forecast-temperature");
    forecastWeekday.classList.add("forecast-weekday");

    forecastTemperature.innerHTML = `${temperature} ${weatherApp.units === "metric" ? "°C" : "°F" }`;
    forecastWeekday.innerHTML = day;

    forecastRow.appendChild(forecastWeekday);
    forecastRow.appendChild(forecastTemperature);

    forecastContainer.appendChild(forecastRow);
  });
}