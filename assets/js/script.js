var userFormEl = document.querySelector("#userForm");
var nameInputEl = document.querySelector("#citySearch");
var searchedCityEl = document.querySelector("#city");
var searchHistoryEl = document.querySelector("#historyList");
var todayTemp = document.querySelector('#currentTemp');
var todayWind = document.querySelector('#currentWind');
var todayHum = document.querySelector('#currentHum');
var todayUV = document.querySelector('#currentUV');
var list = JSON.parse(localStorage.getItem('weatherStorage')) || [];

// fetch current day data from api.openweathermap.org/data/2.5/weather?q={city name},{state code}&appid=1a43c0eec6dcda3a7a81a3791424d2bd
var getCurrentDay = function (name) {
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + name + "&appid=1a43c0eec6dcda3a7a81a3791424d2bd&units=imperial";
    fetch(apiURL)
        .then(function (response) {
            response.json().then(function (data) {
                displayCurrent(data);
                uvIndex(data);
                // console.log(data);
            })

        });
}

// fetch 5 day data from api.openweathermap.org/data/2.5/forecast?q={city name},{state code},{country code}&appid={your api key}

// display searched city current conditions
var formSubmitHandler = function (event) {
    event.preventDefault();

    var cityName = nameInputEl.value
    .trim()
    .toUpperCase();

    formSubmitFiveDay(cityName);
    
    if (cityName) {
        getCurrentDay(cityName);

    } else {
        alert("Please enter a valid City")
    }
    // console.log(cityName)
}

var displayCurrent = function (data) {
    const m = moment();
    var currentCity = data.name;
    var currentTemp = data.main.temp;
    var currentHum = data.main.humidity;
    var currentWind = data.wind.speed;
    var currentIcon = data.weather[0].main
    var iconEl = $("#icon-info");
    var nowDate = m.format('L');

    // clear current content
    searchedCityEl.textContent = "";

    // display info
    searchedCityEl.textContent = currentCity + ' (' + nowDate + ')';
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
    fiveDayDate(m);
}

// Current UV
var uvIndex = function (data) {
    lonItem = data.coord.lon
    latItem = data.coord.lat
    var apiUrl = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + latItem + "&lon=" + lonItem + "&appid=1a43c0eec6dcda3a7a81a3791424d2bd&units=imperial"
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
var fiveDayDate = function (m) {
    for (var i = 2; i < 7; i++) {
        var dateStartEl = $("#date-" + i);
        var dateIncrement = m.add(1, 'days');
        dateStartEl[0].textContent = dateIncrement.format('L')
    }
};

var formSubmitFiveDay = function (name) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + name + "&appid=1a43c0eec6dcda3a7a81a3791424d2bd&units=imperial"
    fetch(apiUrl)
        .then(function (response) {
            response.json().then(function (data) {
                fiveDayTemp(data);
            })
        })
       
};

var fiveDayTemp = function (data) {
    var tempArray = [];
    var humidArray = [];
    var iconArray = [];
    for (i = 0; i < data.list.length; i++) {
        var timeVerify = (data.list[i].dt_txt);
        var timeSplit = timeVerify.split(" ");
        var finalTest = (timeSplit[1]);
        var tempIncrement = data.list[i].main.temp;
        var humidIncrement = data.list[i].main.humidity;
        var iconIncrement = data.list[i].weather[0].main;
        if (finalTest === "00:00:00") {
            tempArray.push(tempIncrement)
            humidArray.push(humidIncrement)
            iconArray.push(iconIncrement)
        }
    }
    tempArrayContent(tempArray, humidArray, iconArray)
     console.log(tempArray)
}


var tempArrayContent = function (temp, humid, icon) {
    for (i = 0; i < temp.length; i++) {
        var tempDayOverall = $("#temp-" + (i + 2));
        var humidDayOverall = $("#humid-" + (i + 2));
        var iconDayOverall = $("#icon-" + (i + 2));
        tempDayOverall[0].textContent = "Temp: " + temp[i] + " \xB0 F";
        humidDayOverall[0].textContent = "Humidity: " + humid[i] + "%";
        if (icon[i] === "Clear") {
            iconDayOverall.addClass("oi oi-cloud")
        } else if (icon[i] === "Clouds") {
            iconDayOverall.addClass("oi oi-sun")
        } else if (icon[i] === "Rain") {
            iconDayOverall.addClass("oi oi-rain")
        }

    }
}
// display search history


userFormEl.addEventListener("submit", formSubmitHandler);