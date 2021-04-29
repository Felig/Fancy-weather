const refreshButton = document.querySelector(".refresh");
const enLang = document.querySelector('.en');
const ruLang = document.querySelector('.ru');
const fahrenheitMode = document.querySelector(".fahrenheit");
const celsiusMode = document.querySelector(".celsius");
const cityCountry = document.querySelector(".current_city");
const date = document.querySelector(".current_date");
const time = document.querySelector(".current_time");
const currentTemp = document.querySelector(".temperature_number");
const currentTempIcon = document.querySelector(".details_weather_img");
const currentWeatherDetails = document.querySelector(".details_clouds");
const currentWeatherFeels = document.querySelector(".details_feels");
const currentWeatherWind = document.querySelector(".details_wind");
const currentWeatherHumidity = document.querySelector(".details_humidity");
const weatherForecast1 = document.querySelector(".day_1");
const weatherForecast2 = document.querySelector(".day_2");
const weatherForecast3 = document.querySelector(".day_3");
const forecastTemp1 = document.querySelector(".temp_1");
const forecastTemp2 = document.querySelector(".temp_2");
const forecastTemp3 = document.querySelector(".temp_3");
const forecastIcon1 = document.querySelector(".icon_1");
const forecastIcon2 = document.querySelector(".icon_2");
const forecastIcon3 = document.querySelector(".icon_3");
const searchButton = document.querySelector(".input_submit");
const searchInput = document.querySelector(".input_search");
const positionLat = document.querySelector(".map_lat");
const positionLng = document.querySelector(".map_lng");
const backgroundContainer = document.querySelector(".weather");
let mapObject,
  timezone;

function setDefaultLocalStorageValues() {
  if (localStorage.getItem('lang') === undefined) {
    localStorage.setItem('lang', 'en');
  }

  // else if (localStorage.getItem('lang') === "ru") {
  //   ruLang.classList.add("button_active");
  //   enLang.classList.remove("button_active");
  // }

  if (localStorage.getItem('radioDegree') === undefined) {
    localStorage.setItem('radioDegree', "metric");
  }
}

function renderBackground() {
  fetch(
    "https://api.unsplash.com/photos/random?orientation=landscape&per_page=1&query=sky&client_id=rAIFFde1nMvkLWvDVRuMLonKbXKyZ2H3KTFXJRbcVls"
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let bgImage = data.urls.regular;
      localStorage.setItem('bg', bgImage);
      backgroundContainer.style.backgroundImage = `linear-gradient(
                180deg,
                rgba(8, 15, 26, 0.5) 0%,
                rgba(6, 6, 8, 0.5)
              ), url(${data.urls.regular})`;
    })
    .catch((err) => {
      alert("Something went wrong - renderBackground");
      console.log("err renderBackground")
    });
}

function getUserLocation() {
  return fetch("https://ipinfo.io/json?token=2a0ee799551687")
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      alert("Something went wrong");
      console.log("err getUserLocation")
    });
}

function initUserData() {
  getUserLocation()
    .then((data) => {
      let city = localStorage.getItem("searchValue");
      let lang = localStorage.getItem("lang");
      if (city !== null) {
        return getUserData(city, lang);
      } else {
        const currentCity = data.city;
        let lang = localStorage.getItem("lang");
        return getUserData(currentCity, lang);
      }
    })
    .catch((err) => {
      alert("Something went wrong");
      console.log("err initUserData")
    });
}

function getUserData(locationCity, lang) {
  return fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${locationCity}&language=${lang}&key=bdca322080e3433b9f0e21d216562bea`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      cityCountry.textContent = `${data.results[0].formatted}`;
    })
    .catch((err) => {
      alert("Something went wrong");
      console.log("err getUserData")
    });
}

function getWeather(locationCity, lang) {
  const keyWeather = "faa22b98c4d6f4b1fd451599a62d942f";
  let degree = localStorage.getItem("radioDegree");
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${locationCity}&units=${degree}&lang=${lang}&appid=${keyWeather}`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      //console.log(data);
      mapLatitude = data.city.coord.lat.toFixed(2);
      mapLongitude = data.city.coord.lon.toFixed(2);
      positionLat.innerHTML = `${mapLatitude}`;
      positionLng.innerHTML = `${mapLongitude}`;
      let degree = localStorage.getItem("radioDegree");

      currentTemp.innerHTML = `${Math.round(data.list[0].main.temp)}`;
      currentWeatherFeels.innerHTML = ` ${Math.round(data.list[0].main.feels_like)}&deg`;
      forecastTemp1.innerHTML = `${Math.round(data.list[8].main.temp)}`;
      forecastTemp2.innerHTML = `${Math.round(data.list[16].main.temp)}`;
      forecastTemp3.innerHTML = `${Math.round(data.list[24].main.temp)}`;


      currentTempIcon.innerHTML =
        `<img src="./img/icons/${data.list[0].weather[0].icon}.svg">`;
      currentWeatherDetails.textContent = data.list[0].weather[0].description;
      currentWeatherWind.textContent = `${data.list[0].wind.speed} m/s`;
      currentWeatherHumidity.textContent = `${data.list[0].main.humidity} %`;

      forecastIcon1.innerHTML = `<img src="./img/icons/${data.list[8].weather[0].icon}.svg">`;
      forecastIcon2.innerHTML = `<img src="./img/icons/${data.list[16].weather[0].icon}.svg">`;
      forecastIcon3.innerHTML = `<img src="./img/icons/${data.list[24].weather[0].icon}.svg">`;

      //FORECAST WEEKDAYS//

      let week = [];

      week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
        "Friday", "Saturday",];
      let today = new Date();
      let day = today.getDay();
      day++;
      if (day > week.length - 1) day = 0;
      weatherForecast1.textContent = week[day];
      day++;
      if (day > week.length - 1) day = 0;
      weatherForecast2.textContent = week[day];
      day++;
      if (day > week.length - 1) day = 0;
      weatherForecast3.textContent = week[day];
      if (day > week.length - 1) day = 0;
      day++;
    })

    .catch((err) => {
      alert("Something went wrong");
      console.log("err getWeather")
    });
}

fahrenheitMode.addEventListener("click", () => {
  fahrenheitMode.classList.add("button_active");
  celsiusMode.classList.remove("button_active");
  localStorage.setItem('radioDegree', "imperial");
  initWeather();
});
celsiusMode.addEventListener("click", () => {
  celsiusMode.classList.add("button_active");
  fahrenheitMode.classList.remove("button_active");
  localStorage.setItem('radioDegree', "metric");
  initWeather();
});

function getMap(locationCity, lang) {
  const keyWeather = "faa22b98c4d6f4b1fd451599a62d942f";
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${locationCity}&units=metric&lang=${lang}&appid=${keyWeather}`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      mapboxgl.accessToken = 'pk.eyJ1IjoiZmVsaWcxIiwiYSI6ImNrbmV3eXo3dzI5cHIydW1xdGJjMjN3NmsifQ.jmp6mdD3Lzub-xYT5nWW7Q';
      mapObject = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: [mapLongitude, mapLatitude], // starting position [lng, lat]
        zoom: 9,
      });
      timezone = data.city.timezone;
      //console.log(timezone);       
    })
    .catch((err) => {
      alert("Something went wrong - getMap");
      console.log("err getMap")
    });
}

function initMap() {
  getUserLocation()
    .then((location) => {
      let city = localStorage.getItem("searchValue");
      let currentCity = location.city;
      let lang = localStorage.getItem("lang");

      if (city !== null) {
        return getMap(city, lang);
      } else {
        let lang = localStorage.getItem("lang");
        return getMap(currentCity, lang);
      }
    })
    .catch((err) => {
      alert("Something went wrong - initMap");
      console.log("err initMap")
    });
}

function initWeather() {
  getUserLocation()
    .then((location) => {
      let city = localStorage.getItem("searchValue");
      const currentCity = location.city;
      let lang = localStorage.getItem("lang");

      if (city !== null) {
        return getWeather(city, lang);
      } else {
        let lang = localStorage.getItem("lang");
        return getWeather(currentCity, lang);
      }
    })
    .catch((err) => {
      alert("Something went wrong");
      console.log("err initWeather")
    });
}

function changePosition() {
  let address = searchInput.value;
  let lang = localStorage.getItem("lang");
  const API_KEY = 'e971af27e5c545f690d1e4656fd1945f';
  return fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${address}&language=${lang}&key=${API_KEY}`
  )
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      alert("Something went wrong - changePosition");
      console.log("err changePosition")
    });
}

function initNewUserData() {
  changePosition()
    .then((location) => {
      //console.log(location);
      const newCity = location.results[0].components.city;
      let currentCity = searchInput.value;
      localStorage.setItem("searchValue", currentCity);
      let lang = localStorage.getItem("lang");
      return getUserData(newCity, lang);
    })
    .catch((err) => {
      alert("Ничего не найдено. Уточните запрос.");
      console.log("err initNewUserData");
    });
}

function initNewWeather() {
  changePosition()
    .then((location) => {
      const currentCity = location.results[0].components.city;
      let lang = localStorage.getItem("lang");
      getWeather(currentCity, lang);
      return (location)
    })
    .then((location) => {
      const currentCity = location.results[0].components.city;
      let lang = localStorage.getItem("lang");
      return getMap(currentCity, lang);
    })
    .then((currentWhether) => { })
    .catch((err) => {
      //alert("Something went wrong - initNewWeather");
      console.log("err initNewWeather")
    });
}

function initTime() {
  getUserLocation()
    .then((location) => {
      let city = localStorage.getItem("searchValue");
      const currentCity = location.city;
      let lang = localStorage.getItem("lang");

      if (city !== null) {
        return getTimezone(city, lang);
      } else {
        let lang = localStorage.getItem("lang");
        return getTimezone(currentCity, lang);
      }
    })
    .catch((err) => {
      alert("Something went wrong - initTime");
      console.log("err initTime")
    });
}

function getTimezone(locationCity, lang) {
  const keyWeather = "faa22b98c4d6f4b1fd451599a62d942f";
  let degree = localStorage.getItem("radioDegree");
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${locationCity}&units=${degree}&lang=${lang}&appid=${keyWeather}`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      //console.log(data);
      timezone = data.city.timezone
      //console.log(timezone);
      return timezone;
    })
    .then(() => {
      setInterval(clockDate, 1000);
    })
    .catch((err) => {
      alert("Something went wrong - getTimezone");
      console.log("err getTimezone")
    });
}


function clockDate() {
  let weekday;
  let month;
  let now = new Date();
  //console.log(timezone);
  let offsetMinuts = now.getTimezoneOffset();
  now.setUTCHours(now.getUTCHours() + timezone / 3600 + offsetMinuts / 60);
  let
    hours = now.getHours() < 10 ? "0" + now.getHours() : now.getHours(),
    minutes = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes(),
    seconds = now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();
  time.innerHTML = `${hours}:${minutes}:${seconds}`;
  if (localStorage.getItem('lang') === 'ru') {
    weekday = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
    month = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль",
      "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
  } else {
    weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    month = ["January", "February", "March", "Aplil", "May", "June", "July",
      "August", "Semtembre", "Octobre", "November", "December"];
  }
  date.textContent = `${weekday[now.getDay()]} ${now.getDate()} ${month[now.getMonth()]}`;
}

function changeLanguage() {
  if (localStorage.getItem('lang') === 'ru') {
    searchButton.value = 'ПОИСК';
    searchInput.placeholder = "Название города";
    document.querySelector('.coordinates_lat').innerHTML = 'Широта:';
    document.querySelector('.coordinates_lng').innerHTML = 'Долгота:';
    document.querySelector('.feels_like').textContent = 'ОЩУЩАЕТСЯ:';
    document.querySelector('.wind').textContent = 'ВЕТЕР: ';
    document.querySelector('.humidity').textContent = 'ВЛАЖНОСТЬ: ';
    ruLang.classList.add("button_active");
    enLang.classList.remove("button_active");
  } else {
    searchButton.value = 'SEARCH';
    searchInput.placeholder = "Search city";
    document.querySelector('.coordinates_lat').innerHTML = 'Latitude:';
    document.querySelector('.coordinates_lng').innerHTML = 'Longitude:';
    document.querySelector('.feels_like').textContent = `FEELS LIKE :`;
    document.querySelector('.wind').textContent = 'WIND: ';
    document.querySelector('.humidity').textContent = 'HUMIDITY: ';
  }
}

function dayWeek() {

  if (localStorage.getItem('lang') === 'ru') {

    let week = [];

    week = ['Воскресенье', 'Понедельник', 'Вторник',
      'Среда', 'Четверг', 'Пятница', 'Суббота'];
    let today = new Date();
    let day = today.getDay();
    day++;
    if (day > week.length - 1) day = 0;
    weatherForecast1.textContent = week[day];
    day++;
    if (day > week.length - 1) day = 0;
    weatherForecast2.textContent = week[day];
    day++;
    if (day > week.length - 1) day = 0;
    weatherForecast3.textContent = week[day];
    if (day > week.length - 1) day = 0;
    day++;

  } else {

    let week = [];
    week = ["Sunday", "Monday", "Tuesday", "Wednesday",
      "Thursday", "Friday", "Saturday",];
    let today = new Date();
    let day = today.getDay();
    day++;
    if (day > week.length - 1) day = 0;
    weatherForecast1.textContent = week[day];
    day++;
    if (day > week.length - 1) day = 0;
    weatherForecast2.textContent = week[day];
    day++;
    if (day > week.length - 1) day = 0;
    weatherForecast3.textContent = week[day];
    if (day > week.length - 1) day = 0;
    day++;
  }
}

enLang.addEventListener("click", () => {
  enLang.classList.add("button_active");
  ruLang.classList.remove("button_active");
  localStorage.setItem('lang', 'en');
  initUserData();
  initWeather();
  changeLanguageOfMap();
});

ruLang.addEventListener("click", () => {
  ruLang.classList.add("button_active");
  enLang.classList.remove("button_active");
  localStorage.setItem('lang', 'ru');
  initUserData();
  initWeather();
  changeLanguageOfMap();
});

refreshButton.addEventListener("click", renderBackground);
searchButton.addEventListener("click", initNewWeather);
searchButton.addEventListener("click", initNewUserData);
searchButton.addEventListener("click", function (event) {
  renderBackground();
});

searchInput.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    searchButton.click();
  }
});

function changeLanguageOfMap() {
  mapObject.getStyle().layers.map((each) => {
    if (
      each.hasOwnProperty('layout') &&
      each.layout.hasOwnProperty('text-field')
    ) {
      if (!each.id.includes('road'))
        mapObject.setLayoutProperty(each.id, 'text-field', [
          'get',
          `name_${localStorage.getItem('lang')}`,
        ]);
    }
  });
}

setDefaultLocalStorageValues()
dayWeek();
setInterval(dayWeek, 500);
setInterval(changeLanguage, 500);
//setInterval(clockDate, 1000);
//clockDate();
initTime();
initUserData();
initWeather();
initMap()
