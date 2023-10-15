// Here we put all the code that handles the interaction with the API
// We will use two different API calls ["weather", "forecast"].
// This function takes the parameters city and country and tries to fetch the weather data.
const fetchWeatherReport = (reportType, city, country) => {
  // Here we set the parameters for our API request.
  const params = {
    // we are grabbing the apiKey from our weatherApp object
    APPID: weatherApp.apiKey,
    q: `${city},${country}`,
    units: weatherApp.units
  }
  // We convert our parameters into a string
  const queryString = buildQueryString(params)
  const apiCollection = ["weather","forecast"].includes(reportType) ? reportType : false
  if (!apiCollection) {
    console.log("Incorrect report type");
    return Promise.reject("Incorrect report type");
  }

  // We put together the apiUrl, the apiCollection and the queryString to form the complete fetch url
  const url = `${weatherApp.apiUrl}${apiCollection}?${queryString}`;

  // We return the fetch call. By doing this fetchWeather will first return a promise and later the data.

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      return data
    })
    .catch((error) => {
      console.error("Fetching data failed", error);
      return false;
    });
}

const fetchWeatherData = async (city, country) => {
  // We run both fetch calls concurrently and wait for them to both complete
  const [weatherData, forecastData] = await Promise.all([
    fetchWeatherReport("weather", city, country),
    fetchWeatherReport("forecast", city, country)
  ]);

  if (!weatherData || !forecastData) {
    console.error("Failed fetching data");
    return false;
  }

  // once completed we return an object consisting of city, country, current, forecast
  return {
    city: city,
    country: country,
    timezone: weatherData.timezone,
    current: weatherData,
    forecast: forecastData
  }
};