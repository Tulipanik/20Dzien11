using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using P04WeatherForecastAPI.Client.Models;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace P04WeatherForecastAPI.Client.Services
{
    internal class AccuWeatherService
    {
        private const string base_url = "http://dataservice.accuweather.com";
        private const string autocomplete_endpoint = "locations/v1/cities/autocomplete?apikey={0}&q={1}&language{2}";
		private const string current_conditions_endpoint = "currentconditions/v1/{0}?apikey={1}&language{2}";
		private const string weather_forecast_1d_endpoint = "/forecasts/v1/daily/1day/{0}?apikey={1}&language{2}";
		private const string weather_forecast_5d_endpoint = "/forecasts/v1/daily/5day/{0}?apikey={1}&language{2}";
		private const string weather_forecast_1h_endpoint = "/forecasts/v1/hourly/1hour/{0}?apikey={1}&language{2}";
		private const string weather_forecast_12h_endpoint = "/forecasts/v1/hourly/12hour/{0}?apikey={1}&language{2}";


		// private const string api_key = "5hFl75dja3ZuKSLpXFxUzSc9vXdtnwG5";
		string api_key;
        //private const string language = "pl";
        string language;

        public AccuWeatherService()
        {
            var builder = new ConfigurationBuilder()
                .AddUserSecrets<App>()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsetings.json"); 

            var configuration = builder.Build();
            api_key = configuration["api_key"];
            language = configuration["default_language"];
        }


        public async Task<City[]> GetLocations(string locationName)
        {
            string uri = base_url + "/" + string.Format(autocomplete_endpoint, api_key, locationName, language);
            using (HttpClient client = new HttpClient())
            {
                var response = await client.GetAsync(uri);
                string json = await response.Content.ReadAsStringAsync();
                City[] cities = JsonConvert.DeserializeObject<City[]>(json);
                return cities;
            }
        }

        public async Task<Weather> GetCurrentConditions(string cityKey)
        {
            string uri = base_url + "/" + string.Format(current_conditions_endpoint, cityKey, api_key,language);
            using (HttpClient client = new HttpClient())
            {
                var response = await client.GetAsync(uri);
                string json = await response.Content.ReadAsStringAsync();
                Weather[] weathers= JsonConvert.DeserializeObject<Weather[]>(json);
                return weathers.FirstOrDefault();
            }
        }

        public async Task<DailyForecast> GetForecastFor1Day(string cityKey)
        {
            string url = base_url + "/" + string.Format(weather_forecast_1d_endpoint, cityKey, api_key,language);
            using ( HttpClient client = new HttpClient())
            {
                var response = await client.GetAsync(url);
                string json = await response.Content.ReadAsStringAsync();
                DailyForecast[] dailyForecast = JsonConvert.DeserializeAnonymousType(json, new {DailyForecasts = new DailyForecast[1]}).DailyForecasts;
                return dailyForecast.FirstOrDefault();
            }
        }

		public async Task<DailyForecast[]> GetForecastFor5Days(string cityKey)
		{
			string url = base_url + "/" + string.Format(weather_forecast_5d_endpoint, cityKey, api_key, language);
			using (HttpClient client = new HttpClient())
			{
				var response = await client.GetAsync(url);
				string json = await response.Content.ReadAsStringAsync();
				DailyForecast[] dailyForecast = JsonConvert.DeserializeAnonymousType(json, new { DailyForecasts = new DailyForecast[5] }).DailyForecasts;
				return dailyForecast;
			}
		}

		public async Task<HourlyForecast> GetForecastFor1Hour(string cityKey)
		{
			string url = base_url + "/" + string.Format(weather_forecast_1h_endpoint, cityKey, api_key, language);
			return (await GetDataFromAPI<HourlyForecast>(url)).FirstOrDefault();
		}

		public async Task<HourlyForecast[]> GetForecastFor12Hours(string cityKey)
		{
			string url = base_url + "/" + string.Format(weather_forecast_12h_endpoint, cityKey, api_key, language);
            return await GetDataFromAPI<HourlyForecast>(url);
		}

        private async Task<T[]> GetDataFromAPI<T>(string url)
        {
			using (HttpClient client = new HttpClient())
			{
				var response = await client.GetAsync(url);
				string json = await response.Content.ReadAsStringAsync();
				T[] data = JsonConvert.DeserializeObject<T[]>(json);
				return data;
			}
		}
	}
}
