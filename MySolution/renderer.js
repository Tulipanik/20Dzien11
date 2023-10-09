import { APIKey } from "./api_key.js";
const language = navigator.language;

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

  const endpoint = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${APIKey}&q=${location}`;

  await getAPIRequest(endpoint)
    .then((data) => {
      document.getElementById("country").innerHTML =
        data[0].Country.LocalizedName;
      getDailyForecast(data[0].Key);
    })
    .catch((err) => {
      console.error(err);
    });
}

async function getCurrentWeather(key) {
  const endpointForecast = `http://dataservice.accuweather.com/currentconditions/v1/${key}?apikey=${APIKey}&language=${language}`;

  await getAPIRequest(endpointForecast)
    .then((data) => {
      document.getElementById("time").innerHTML =
        data[0].LocalObservationDateTime;
      document.getElementById("temperature").innerHTML =
        data[0].Temperature.Metric.Value;
      getPastWeather(key);
    })
    .catch((err) => {
      console.error(err);
    });
}

async function getPastWeather(key) {
  const endpoitPastForecast = `http://dataservice.accuweather.com/currentconditions/v1/${key}?apikey=${APIKey}&language=${language}`;

  await getAPIRequest(endpoitPastForecast)
    .then((data) => {
      getHourlyForecast(key);
    })
    .catch((err) => {
      console.error(err);
    });
}

async function getHourlyForecast(locationKey) {
  const endpointHourlyForecast = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${APIKey}&language=${language}`;
  await getAPIRequest(endpointHourlyForecast)
    .then((data) => {
      getDailyForecast(locationKey);
    })
    .catch((err) => {
      console.error(err);
    });
}

async function getDailyForecast(locationKey) {
  const endpointDailyForecast = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${APIKey}&language=${language}&metric=${true}`;

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
            concreteData =
              concreteData < 10 ? `0${concreteData}` : `${concreteData}`;
            let fileName = `./weather_icons/${concreteData}-s.png`;
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
