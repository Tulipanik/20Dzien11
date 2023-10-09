import { APIKey } from "./api_key.js";
const language = navigator.language;
const URL = "http://dataservice.accuweather.com/";
const basic = `apikey=${APIKey}&language=${language}`;

const form = document.getElementById("form");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  getLocation();
});

async function getAPIRequest(endpoint) {
  return fetch(endpoint).then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error("Bad response");
    }
  });
}

async function getLocation() {
  const location = document.getElementById("location").value;

  const endpoint = `${URL}locations/v1/cities/search?${basic}&q=${location}`;

  await getAPIRequest(endpoint)
    .then((data) => {
      document.getElementById("country").innerHTML =
        data[0].Country.LocalizedName;
      // getCurrentWeather(data[0].Key);
      // getAirCondition(data[0].Key);
      // getCurrentWeather(data[0].Key);
      // getDailyForecast(data[0].Key);
      getPastWeather(data[0].Key);
    })
    .catch((err) => {
      console.error(err);
    });
}

async function getCurrentWeather(key) {
  const endpointForecast = `${URL}currentconditions/v1/${key}?${basic}`;

  await getAPIRequest(endpointForecast)
    .then((data) => {
      const date = data[0].LocalObservationDateTime.split("T");
      document.getElementById("date").innerHTML = date[0];
      document.getElementById("time").innerHTML = date[1].split("+")[0];
      document.getElementById(
        "temperature"
      ).innerHTML = `${data[0].Temperature.Metric.Value}&deg;C`;
    })
    .catch((err) => {
      console.error(err);
    });
}

async function getPastWeather(key) {
  const endpoitPastForecast = `${URL}currentconditions/v1/${key}/historical/24?${basic}`;

  await getAPIRequest(endpoitPastForecast)
    .then((data) => {
      console.log(data);
      document.getElementById(
        "past_image"
      ).innerHTML = `<img src=${imageNameConstructor(data[23].WeatherIcon)}>`;
      document.getElementById(
        "past_temperature"
      ).innerHTML = `${data[23].Temperature.Metric.Value}&deg;C`;
    })
    .catch((err) => {
      console.error(err);
    });
}

async function getHourlyForecast(locationKey) {
  const endpointHourlyForecast = `${URL}forecasts/v1/hourly/12hour/${locationKey}?${basic}`;
  await getAPIRequest(endpointHourlyForecast)
    .then((data) => {
      getDailyForecast(locationKey);
    })
    .catch((err) => {
      console.error(err);
    });
}

async function getDailyForecast(locationKey) {
  const endpointDailyForecast = `${URL}forecasts/v1/daily/5day/${locationKey}?${basic}&metric=${true}`;

  await getAPIRequest(endpointDailyForecast)
    .then((data) => {
      let Headers = "";
      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const days = data.DailyForecasts;
      for (let i = 0; i < days.length; i++) {
        Headers +=
          "\t<td>" + daysOfWeek[new Date(days[i].Date).getDay()] + "</td> \n";
      }

      document.getElementById("week_days").innerHTML = Headers;

      const properties = [
        ["Day", "Icon"],
        ["Temperature", "Maximum", "Value"],
        ["Temperature", "Minimum", "Value"],
      ];

      let tableData = "";
      properties.forEach((property) => {
        tableData += "<tr>";
        for (let i = 0; i < days.length; i++) {
          let concreteData = days[i];
          for (const value of property) {
            concreteData = concreteData[value];
          }
          if (property[1] == "Icon") {
            imageNameConstructor(concreteData);
            tableData += `<td> <img src=${fileName}> </ td>\n`;
          } else {
            tableData += `<td> ${concreteData}&deg;C </ td>`;
          }
        }
        tableData += "</ tr>";
      });

      document.getElementById("temperatures").innerHTML = tableData;
    })
    .catch((err) => {
      console.error(err);
    });
}

function imageNameConstructor(number) {
  number = number < 10 ? `0${number}` : `${number}`;
  let fileName = `./weather_icons/${number}-s.png`;
  return fileName;
}

async function getAirCondition(key) {
  const endpoitPastForecast = `${URL}indices/v1/daily/1day/${key}/-10?${basic}`;

  await getAPIRequest(endpoitPastForecast)
    .then((data) => {
      document.getElementById("air_condition").innerHTML = data[0].Category;
    })
    .catch((err) => {
      console.error(err);
    });
}
