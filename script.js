// Here we put all the code that executes all the different functiontions and views
const forecastContainer = document.getElementById ("forecast");
const weatherContainer = document.getElementById("weather");
const iconElement = document.getElementById ("icon");
const sunriseElement = document.getElementById ("sunrise");
const sunsetElement = document.getElementById ("sunset");
const todaysDescription = document.getElementById ("todaysDescription");
const statusElement = document.getElementById ("status");
const temperatureElement = document.getElementById ("temperature");
const body = document.getElementById("body");
const searchForm = document.getElementById("searchForm");
const searchText = document.getElementById("searchText");
const searchMessage = document.getElementById("searchMessage");
const locationButton = document.getElementById("locationButton");

// We save our config settings in the weatherApp object
const weatherApp = {
  apiKey: "b519b073de061051721cf997e13c4842",
  apiUrl: "https://api.openweathermap.org/data/2.5/",
  units: "metric",
  // we use this to store our weatherData globally for testing
  data: {}
};

const displayUserLocation = (position) => {
  const { latitude, longitude } = position.coords;
  fetchWeatherData(latitude, longitude)
  .then((data) => {
    if (data.success) {
      weatherApp.data = data;
      displayWeather(data);
      displayforecast(data.forecast); // Display the forecast data
    }
  });
}

const getUserLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(displayUserLocation);
  } else {
    console.log("Cant get user location");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Lets load default place
  searchLocation("Oslo, Norway")
    .then((data) => {
      if (data.success) {
        weatherApp.data = data;
        displayWeather(data);
        displayforecast(data.forecast); // Display the forecast data
      }
    });
});

locationButton.addEventListener("click", function () {
  // Lets try and get user location and display that
  getUserLocation();
});

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  searchLocation(searchText.value)
    .then((data) => {
      if (data.success) {
        weatherApp.data = data;
        displayWeather(data);
        displayforecast(data.forecast); // Display the forecast data
      }
    });
});


