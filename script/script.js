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

let headerIcon = document.querySelector('#app-header i');
setInterval(() => {
    headerIcon.classList.toggle('fa-spin');
}, 2000);

// Parameters
let appId = '9f517903a592b851b987e2cba3dddd85';
let units = 'metric';
let searchMethod;
let searchedCity;
let rfs;

let weatherContainer = document.getElementById('weather-container');

// search-container ------------->
var cityInput = document.getElementById('city-input');
const submitBtn = document.getElementById('submit-button');

let city = document.getElementById('city');
let submitForm = document.querySelector('.submit-form');

// city-weather-details ------------->
let temperature = document.getElementById('temperature');
let weatherDescription = document.querySelector('#weather-description');
let weatherDescriptionImg = document.querySelector('#weather-description-img');
let feelsLike = document.getElementById('feels-like');

// other-weather-details ------------->
let maxTemp = document.getElementById('max-temp');
let minTemp = document.getElementById('min-temp');
let humidity = document.getElementById('humidity');
let wind = document.getElementById('wind');
let errorMessage = document.getElementById('error-message');
let appHeader = document.getElementById('app-header');

// determine the user's input method with SEARCH METHOD, and put the value in RESULT
// take the output from RESULT and put in SEARCH function.. if there is a searched city, run searchWeather FUNCTION with the argument as searchedCity
// use submit, and click event listeners to initialize and return result

// SEARCH
function search() {
    if(cityInput.value || voiceInput) {
        errorMessage.style.display = 'none';
        appHeader.style.paddingTop = 30 + 'px';

        var voiceInput;
        searchedCity = cityInput.value || voiceInput;
        if(searchedCity) {
            searchWeather(searchedCity);
        }
    } 
    else {
        // alert('Please enter a city or zip code!');
        // errorMessage.innerHTML = `<em>Please enter a city or zip code!</em>`;
        errorMessage.style.display = 'block';
        appHeader.style.paddingTop = 20 + 'px';
    }
};

// SUBMIT
submitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    search();
});

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    search();
});

// SEARCH METHOD
function userSearchMethod(searchedCity) {
    if(searchedCity.length === 5 && Number.parseInt(searchedCity) + '' === searchedCity) {
        searchMethod = 'zip';
    } else {
        searchMethod = 'q';
    }
};

// RESULT
function searchWeather(searchedCity) {
    userSearchMethod(searchedCity);

    fetch(`https://api.openweathermap.org/data/2.5/weather?${searchMethod}=${searchedCity}&APPID=${appId}&units=${units}`)
        .then( result => {
            return result.json();
        }).then( result => {
            init(result);

            // SPEECH SYNTHESIS ------------------->
            if ((result.cod === '404') || !searchedCity) {
                sayThis = new SpeechSynthesisUtterance(`I cannot find the weather for ${searchedCity}`);
                speechSynth.speak(sayThis);
            }else{
                sayThis = new SpeechSynthesisUtterance(         // get city's weather and speak it -------------->
                    `the weather condition in ${result.name} is mostly full of ${result.weather[0].description}. 
                    ${result.name} has a temperature of ${result.main.temp} degrees Celsius, 
                    humidity of ${result.main.humidity} millimeter mercury, 
                    and a wind speed of ${result.wind.speed} meter per second.`
                );
                speechSynth.speak(sayThis);
            }
        }).catch( error => {
            console.log(error);
        });
};

// let weatherArray = [];

function init(resultFromServer) {
    console.log(resultFromServer);
    // weatherArray.push(resultFromServer);
    
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

// $(document).ready(function () {
//     // History
//     $('#hledat').click(function() {
//         addToHistory($('#mesto').val());
//     });
      
//     $('#val').text(getHistory()[0] || ''); // shows latest item
    
//     var getHistory = function() {
//         return JSON.parse(localStorage.getItem("test")) || [];
//     }
    
//     var addToHistory = function addToHistory(value) {
//         var history = getHistory();
//         history.unshift(value);
//         localStorage.setItem('test', JSON.stringify(history.slice(0, 5)));
//     }
//     // History
// });

// SPEECH RECOGNITION (stt) -------------------->
const sttIcon = document.getElementById('stt-icon');
const sttIconSound = document.querySelector('#sound');

window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
if (!('webkitSpeechRecognition' in window)) {
    upgrade();
}
else {
    var recognition = new SpeechRecognition();
    recognition.interimResult = true;
    recognition.lang = 'en-GB';
    recognition.maxAlternatives = 3;

    sttIcon.addEventListener('click', () => {
        sttIconSound.play();
        dictate();
    });

    const dictate = () => {
        recognition.start();

        // recognition.addEventListener('result', (e) => {...};
        recognition.onresult = function(e) {
            var voiceInput = e.results[0][0].transcript;        // Save the result in a variable
            cityInput.value = voiceInput;           // Set it to display in the input text-box... line 44-50 
            console.log(e.results[0][0].confidence);

            if (e.results[0].isFinal) {         // if user has stopped speaking                
                if (voiceInput.includes('what is the time')) {
                    speak(getTime);     // run getTime function and speak time
                };
                if (voiceInput.includes('what is today\'s date')) {
                    speak(getDate);     // run getDate function and speak date
                };
            };
        };
        
        recognition.onend = function() {
            search();
        };
        
        recognition.onerror = function(event) {
            console.log('Error occurred in recognition: ' + event.error);
        };
    }
}

// SPEECH SYNTHESIS (tts) -------------------->
const speechSynth = window.speechSynthesis;         // instantiate speech synthesis
const speak = (action) => {
    sayThis = new SpeechSynthesisUtterance(action());
    speechSynth.speak(sayThis);
};

const getTime = () => {         // get time
    const time = new Date(Date.now());
    return `the time is ${time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`
};
  
const getDate = () => {         // get date
    const time = new Date(Date.now())
    return `today is ${time.toLocaleDateString()}`;
};