var userFormEl = document.querySelector("#userForm");
var nameInputEl = document.querySelector("#citySearch");
var searchedCityEl = document.querySelector("#city");
var searchHistoryEl = document.querySelector("#historyList");
var todayTemp = document.querySelector('#currentTemp');
var todayWind = document.querySelector('#currentWind');
var todayHum = document.querySelector('#currentHum');
var todayUV = document.querySelector('#currentUV');

// fetch current day data from api.openweathermap.org/data/2.5/weather?q={city name},{state code}&appid=1a43c0eec6dcda3a7a81a3791424d2bd
var getCurrentDay = function (name) {
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + name + "&appid=1a43c0eec6dcda3a7a81a3791424d2bd&units=imperial";
    fetch(apiURL)
        .then(function (response) {
            response.json().then(function (data) {
                displayCurrent(data);
                uvIndex(data);
                console.log(data);
            })

        });
}

// fetch 5 day data from api.openweathermap.org/data/2.5/forecast?q={city name},{state code},{country code}&appid={your api key}

// display searched city current conditions
var formSubmitHandler = function (event) {
    event.preventDefault();

    var cityName = nameInputEl.value
    // .trim()
    // .toUpperCase();

    if (cityName) {
        getCurrentDay(cityName);

    } else {
        alert("Please enter a valid City")
    }
    // console.log(cityName)
}

var displayCurrent = function (data) {
    // const m = moment();
    var currentCity = data.name;
    var currentTemp = data.main.temp;
    var currentHum = data.main.humidity;
    var currentWind = data.wind.speed;
    var currentIcon = data.weather[0].main
    var iconEl = $("#icon-info");
    // var nowDate = m.format('L');

    // clear current content
    searchedCityEl.textContent = "";

    // display info
    searchedCityEl.textContent = currentCity;
    todayTemp.textContent = currentTemp + " \xB0 F";
    todayHum.textContent = currentHum + "%";
    todayWind.textContent = currentWind + " MPH";
    
    if (currentIcon === "Clear") {
        iconEl.addClass("oi oi-sun")
    } else if (currentIcon === "Clouds") {
        iconEl.addClass("oi oi-cloud")
    } else if (currentIcon === "Rain") {
        iconEl.addClass("oi oi-rain")
    }
}

// Current UV
var uvIndex = function (data) {
    lonItem = data.coord.lon
    latItem = data.coord.lat
    var apiUrl = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + latItem + "&lon=" + lonItem + "&APPID=35d3ddb8208b03fbaf1197e2a757e86e&units=imperial"
    fetch(apiUrl)
        .then(function (response) {
            response.json().then(function (data) {
                var uvIndexCheck = data[0].value;
                todayUV.textContent = uvIndexCheck;
                if (uvIndexCheck >= 6) {
                    $("#currentUV").addClass("bg-danger text-light col-2 rounded")
                } else if (uvIndexCheck < 6 && uvIndexCheck > 3) {
                    $("#currentUV").addClass("bg-warning text-dark col-2 rounded")
                } else if (uvIndexCheck <= 3) {
                    $("#currentUV").addClass("bg-success text-dark col-2 rounded")
                }
            })
        })
}

// display 5 day forcast
// display search history


userFormEl.addEventListener("submit", formSubmitHandler);