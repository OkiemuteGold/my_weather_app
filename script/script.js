// service worker
if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js', {scope: './'})
        .then( (reg) => {
            console.log('Service Worker Registration Successful. Scope is ' + reg.scope);
        }).catch(error => {
            console.log('Service Worker Registration Failed with ' + error);
        });
};

// http://api.openweathermap.org/data/2.5/weather?id={city id}&{your api key}&units;

// Parameters
let appId = '9f517903a592b851b987e2cba3dddd85';
let units = 'metric';
let searchMethod;
let searchedCity;
let rfs;

let weatherContainer = document.getElementById('weatherContainer');

// searchContainer ------------->
const cityInput = document.getElementById('cityInput');
const submitBtn = document.getElementById('submitBtn');

let city = document.getElementById('city');
let submitForm = document.querySelector('.submitForm');

// cityWeatherDetails ------------->
let temperature = document.getElementById('temperature');
let weatherDescription = document.querySelector('#weatherDescription');
let weatherDescriptionImg = document.querySelector('#weatherDescriptionImg');
let feelsLike = document.getElementById('feelsLike');

// otherWeatherDetails ------------->
let maxTemp = document.getElementById('maxTemp');
let minTemp = document.getElementById('minTemp');
let humidity = document.getElementById('humidity');
let wind = document.getElementById('wind');
let errorMessage = document.getElementById('error-message');
let appHeader = document.getElementById('appHeader');


function search() {
    if(cityInput.value) {
        errorMessage.style.display = 'none';
        appHeader.style.paddingTop = 40 + 'px';
        searchedCity = cityInput.value;
        if(searchedCity) {
            searchWeather(searchedCity);
        }
    } else {
        // alert('Please enter a city or zip code!');
        // errorMessage.innerHTML = `<em>Please enter a city or zip code!</em>`;
        errorMessage.style.display = 'block';
        appHeader.style.paddingTop = 20 + 'px';
    }
};

// Submit media
submitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    search();
});

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    search();
});


// Search Method
function userSearchMethod(searchedCity) {
    if(searchedCity.length === 5 && Number.parseInt(searchedCity) + '' === searchedCity) {
        searchMethod = 'zip';
    } else {
        searchMethod = 'q';
    }
};

// Result
function searchWeather(searchedCity) {
    userSearchMethod(searchedCity);

    fetch(`https://api.openweathermap.org/data/2.5/weather?${searchMethod}=${searchedCity}&APPID=${appId}&units=${units}`)
        .then( result => {
            return result.json();
        }).then( result => {
            init(result);
        }).catch( error => {
            console.log(error);
        });
};

function init(resultFromServer) {
    console.log(resultFromServer);
    switch (resultFromServer.weather[0].main) {
        case 'Clear':
            document.body.style.backgroundImage = 'url("/images/clear.jpg")';
            break;
    
        case 'Clouds':
            document.body.style.backgroundImage = 'url("/images/cloud.jpg")';
            break;
    
        case 'Rain':
        case 'Drizzle':
            document.body.style.backgroundImage = 'url("/images/rain.jpg")';
            break;

        case 'Atmosphere':
            document.body.style.backgroundImage = 'url("/images/mist.jpg")';
            break;

        case 'Tornado':
            document.body.style.backgroundImage = 'url("/images/tornado.jpg")';
            break;
    
        case 'Thunderstorm':
            document.body.style.backgroundImage = 'url("/images/storm.jpg")';
            break;
    
        case 'Snow':
            document.body.style.backgroundImage = 'url("/images/snow.jpg")';
            break;
    
        default:
            break;
    };

    rfs = resultFromServer;

    city.innerHTML = rfs.name;
    temperature.innerHTML = Math.round(rfs.main.temp) + '&deg;' + 'C';
    weatherDescription.textContent = (rfs.weather[0].description).charAt(0).toUpperCase() + rfs.weather[0].description.slice(1);
    weatherDescriptionImg.src = 'https://openweathermap.org/img/wn/' + rfs.weather[0].icon + '@2x.png';
    
    feelsLike.innerHTML = 'Feels like: ' + Math.round(rfs.main.feels_like) + '&deg;' + 'C';
    
    maxTemp.innerHTML = Math.round(rfs.main.temp_max) + '&deg;' + 'C';
    minTemp.innerHTML = Math.round(rfs.main.temp_min) + '&deg;' + 'C';

    humidity.innerHTML = 'Humidity: ' + rfs.main.humidity + '%';
    wind.innerHTML = 'Wind: ' + Math.round(rfs.wind.speed) + 'm/s';

    weatherContainer.style.visibility = 'visible';
};