import { URL, basic } from "./renderer.js";
import { getAPIRequest } from "./renderer.js";
import { imageNameConstructor, getError } from "./renderer.js";

export async function getForecasts(locationKey) {
  getHourlyForecast(locationKey);
  getDailyForecast(locationKey);
}

async function getHourlyForecast(locationKey) {
  const endpointHourlyForecast = `${URL}forecasts/v1/hourly/12hour/${locationKey}?${basic}&metric=${true}`;

  await getAPIRequest(endpointHourlyForecast)
    .then((data) => {
      let Headers = "";

      for (const hours of data) {
        Headers += `<td>${
          hours.DateTime.split("T")[1].split("+")[0].split(":")[0]
        }:00</ td>\n`;
      }

      document.getElementById("hours").innerHTML = Headers;

      const properties = [["WeatherIcon"], ["Temperature", "Value"]];

      const tableData = createDataTable(data, properties);

      document.getElementById("hours_temperatures").innerHTML = tableData;
    })
    .catch((err) => {
      getError();
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

      const tableData = createDataTable(days, properties);

      document.getElementById("temperatures").innerHTML = tableData;
    })
    .catch((err) => {
      getError();
      console.error(err);
    });
}

function createDataTable(data, properties) {
  let tableData = "";

  properties.forEach((property) => {
    tableData += "<tr>";

    for (let i = 0; i < data.length; i++) {
      let concreteData = data[i];

      for (const value of property) {
        concreteData = concreteData[value];
      }
      const last = property[property.length - 1];

      if (last == "Icon" || last == "WeatherIcon") {
        const fileName = imageNameConstructor(concreteData);
        tableData += `<td> <img src=${fileName}> </ td>\n`;
      } else {
        tableData += `<td> ${concreteData}&deg;C </ td>`;
      }
    }
    tableData += "</ tr>";
  });
  return tableData;
}
