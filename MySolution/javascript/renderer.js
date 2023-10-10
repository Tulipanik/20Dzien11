import { APIKey } from "./api_key.js";
import { getCurrentData } from "./current_weather.js";
import { getForecasts } from "./forecasts.js";

const language = navigator.language;
export const URL = "http://dataservice.accuweather.com/";
export const basic = `apikey=${APIKey}&language=${language}`;

const form = document.getElementById("form");

export async function getAPIRequest(endpoint) {
  return fetch(endpoint).then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      getError();
      throw new Error("Bad response");
    }
  });
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  document.getElementById("page_content").style.display = "block";
  document.getElementById("error").style.display = "none";
  getLocation();
});

async function getLocation() {
  const location = document.getElementById("location").value;

  const endpoint = `${URL}locations/v1/cities/search?${basic}&q=${location}`;

  await getAPIRequest(endpoint)
    .then((data) => {
      document.getElementById("country").innerHTML =
        data[0].Country.LocalizedName;
      getCurrentData(data[0].Key);
      getForecasts(data[0].Key);
    })
    .catch((err) => {
      getError();
      console.error(err);
    });
}

export function imageNameConstructor(number) {
  number = number < 10 ? `0${number}` : `${number}`;
  let fileName = `./weather_icons/${number}-s.png`;
  return fileName;
}

export function getError(name) {
  document.getElementById("page_content").style.display = "none";
  document.getElementById("error").style.display = "flex";
  if (name != undefined) {
    document.getElementById("error").innerHTML = name;
  } else {
    document.getElementById("error").innerHTML =
      "Too much weather for today user :D";
  }
}
