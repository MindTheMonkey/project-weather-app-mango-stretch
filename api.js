// Here we put all the code that handles the interaction with the API
// We will use two different API calls ["weather", "forecast"].
// This function takes the parameters city and country and tries to fetch the weather data.
const fetchWeatherReport = (reportType, latitude, longitude) => {
  // Here we set the parameters for our API request.
  const params = {
    // we are grabbing the apiKey from our weatherApp object
    APPID: weatherApp.apiKey,
    lat: latitude,
    lon: longitude,
    units: weatherApp.units
  };
  // We convert our parameters into a string
  const queryString = buildQueryString(params);
  const apiCollection = ["weather","forecast"].includes(reportType) ? reportType : false;
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
      return data;
    })
    .catch((error) => {
      console.error("Fetching data failed", error);
      return false;
    });
};

const getCoordinates = (searchQuery) => {
  const params = {
    APPID: weatherApp.apiKey,
    q: searchQuery,
    limit: 1
  }
  const queryString = buildQueryString(params);
  const url = `https://api.openweathermap.org/geo/1.0/direct?${queryString}`;
   return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log(response);
      return response.json();
    })
    .then((data) => {
      if (data.length === 1) {
        return {
          success: true,
          name: data[0].name,
          latitude: data[0].lat,
          longitude: data[0].lon,
          country: data[0].country,
        }
      } else {
        return {
          success: false,
          error: {
            message: "No location found"
          }
        }
      }
    });
}

const fetchWeatherData = async (latitude, longitude) => {
  // We run both fetch calls concurrently and wait for them to both complete
  const [weatherData, forecastData] = await Promise.all([
    fetchWeatherReport("weather", latitude, longitude),
    fetchWeatherReport("forecast", latitude, longitude)
  ]);

  if (!weatherData || !forecastData) {
    console.error("Failed fetching data");
    return { success: false };
  }

  // once completed we return an object consisting of city, country, current, forecast
  return {
    success: true,
    city: weatherData.name,
    country_code: weatherData.sys.country,
    timezone: weatherData.timezone,
    current: weatherData,
    forecast: forecastData
  }
};

const searchLocation = async (searchQuery) => {
  return getCoordinates(searchQuery)
    .then((searchResult) => {
      if (!searchResult.success) {
        // Set search message not found
        return Promise.reject('Location not found');
      }
      else {
        return fetchWeatherData(searchResult.latitude, searchResult.longitude);
      }
    })
    .catch((error) => {
      console.error("An error occurred:", error);
      searchMessage.innerHTML = `Location "${searchQuery}" not found. Please use format "City, Country"`;
      return Promise.reject(error);
    });
}
