const weatherForm = document.querySelector('#weather-form')
const cityInput = document.querySelector('#city-input')
var unitIsCelsius = true;
var globalForecast = [];

// Maps the APIs icons to the ones from https://erikflowers.github.io/weather-icons/
const weatherIconsMap = {
  "01d": "wi-day-sunny",
  "01n": "wi-night-clear",
  "02d": "wi-day-cloudy",
  "02n": "wi-night-cloudy",
  "03d": "wi-cloud",
  "03n": "wi-cloud",
  "04d": "wi-cloudy",
  "04n": "wi-cloudy",
  "09d": "wi-showers",
  "09n": "wi-showers",
  "10d": "wi-day-hail",
  "10n": "wi-night-hail",
  "11d": "wi-thunderstorm",
  "11n": "wi-thunderstorm",
  "13d": "wi-snow",
  "13n": "wi-snow",
  "50d": "wi-fog",
  "50n": "wi-fog"
};


$(function(){
  getWeatherData('Islamabad')
  startClock();  
});


function startClock(){
  setInterval(function(){
    $("#localTime").text(new Date().toLocaleTimeString());
  }, 1000);
}


// Fetch weather data from API
const getWeatherData = async (city) => {

  const url = `/api?q=${city}`
  const res = await fetch(url)
  const data = await res.json()

  if (data.cod === '404') {
    alert('City not found')
    return
  }

  if (data.cod === 401) {
    alert('Invalid API Key')
    return
  }

  $("#cityName").text(city);
  globalForecast = data;
  updateForecast(data)

}


// Update view values from passed forecast
function updateForecast(forecast){
  $("#tempDescription").text(toCamelCase(forecast.weather[0].description));
  $("#humidity").text(forecast.main.humidity);
  $("#wind").text(forecast.wind.speed);
  $("#localDate").text(getFormattedDate(forecast.dt));
  $("#main-icon").addClass(weatherIconsMap[forecast.weather[0].icon]);
  $("#mainTemperature").text(Math.round(forecast.main.temp));
  $("#mainTempHot").text(Math.round(forecast.main.temp_max));
  $("#mainTempLow").text(Math.round(forecast.main.temp_min));
}


// Refresh button handler
$("#refreshButton").on("click", function(){
  // Starts Refresh button's spinning animation
  $("#refreshButton").html("<i class='fa fa-refresh fa-spin fa-fw'></i>");
  let currentCity = document.querySelector('#cityName')
  getWeatherData(currentCity.innerHTML);
});


// Celsius button handler.
// Converts every shown value to Celsius
$("#celsius").on("click", function(){
  if(!unitIsCelsius){
    $("#fahrenheit").removeClass("active");
    this.className = "active";

    globalForecast.main.temp = toCelsius(globalForecast.main.temp);
    globalForecast.main.temp_max = toCelsius(globalForecast.main.temp_max);
    globalForecast.main.temp_min = toCelsius(globalForecast.main.temp_min);
    
    // update view with updated values
    updateForecast(globalForecast);

    unitIsCelsius = true;
  }
});


// Fahrenheit button handler
// Converts every shown value to Fahrenheit
$("#fahrenheit").on("click", function(){  
  if(unitIsCelsius){
    $("#celsius").removeClass("active");
    this.className = "active";
    
    globalForecast.main.temp = toFahrenheit(globalForecast.main.temp);
    globalForecast.main.temp_max = toFahrenheit(globalForecast.main.temp_max);
    globalForecast.main.temp_min = toFahrenheit(globalForecast.main.temp_min);
    
    // update view with updated values
    updateForecast(globalForecast);
    unitIsCelsius = false;
  }
});


// Applies the following format to date: WeekDay, Month Day, Year
function getFormattedDate(date){
  const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
  return new Date(date * 1000).toLocaleDateString("en-US",options);
}


// Formats the text to CamelCase
function toCamelCase(str) {
  var arr = str.split(" ").map(
    function(sentence){
      return sentence.charAt(0).toUpperCase() + sentence.substring(1);
    }
  );
  return arr.join(" ");
}


// Converts to Celsius
function toCelsius(val){
  return Math.round((val - 32) * (5/9));
}


// Converts to Fahrenheit
function toFahrenheit(val){
  return  Math.round((val * 1.8) + 32);
}


// Event listener for form submission
weatherForm.addEventListener('submit', (e) => {
  e.preventDefault()

  if (cityInput.value === '') {
    alert('Please enter a city')
  } else {
    getWeatherData(cityInput.value)
  }
})