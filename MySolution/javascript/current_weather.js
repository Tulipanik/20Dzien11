import { URL, basic } from "./renderer.js";
import { getAPIRequest } from "./renderer.js";
import { imageNameConstructor, getError } from "./renderer.js";

export async function getCurrentData(locationKey) {
  getCurrentWeather(locationKey);
  getPastWeather(locationKey);
  getAirCondition(locationKey);
}

async function getCurrentWeather(key) {
  const endpointForecast = `${URL}currentconditions/v1/${key}?${basic}`;

  await getAPIRequest(endpointForecast)
    .then((data) => {
      const date = data[0].LocalObservationDateTime.split("T");

      document.getElementById("date").innerHTML = date[0];
      document.getElementById("time").innerHTML = date[1].split("+")[0];
      document.getElementById(
        "weather_icon"
      ).innerHTML = `<img src=${imageNameConstructor(data[0].WeatherIcon)}>`;
      document.getElementById(
        "temperature"
      ).innerHTML = `${data[0].Temperature.Metric.Value}&deg;C`;
    })
    .catch((err) => {
      getError();

      console.error(err);
    });
}

async function getPastWeather(key) {
  const endpoitPastForecast = `${URL}currentconditions/v1/${key}/historical/24?${basic}`;

  await getAPIRequest(endpoitPastForecast)
    .then((data) => {
      document.getElementById(
        "past_image"
      ).innerHTML = `<img src=${imageNameConstructor(data[23].WeatherIcon)}>`;
      document.getElementById(
        "past_temperature"
      ).innerHTML = `${data[23].Temperature.Metric.Value}&deg;C`;
    })
    .catch((err) => {
      getError();
      console.error(err);
    });
}

async function getAirCondition(key) {
  const endpoitPastForecast = `${URL}indices/v1/daily/1day/${key}/-10?${basic}`;

  await getAPIRequest(endpoitPastForecast)
    .then((data) => {
      document.getElementById("air_condition").innerHTML = data[0].Category;
    })
    .catch((err) => {
      getError();
      console.error(err);
    });
}
