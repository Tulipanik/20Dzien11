using System;

namespace P04WeatherForecastAPI.Client.Models
{
	internal class HourlyForecast
	{
		public DateTime DateTime { get; set; }
		public int EpochDateTime { get; set; }
		public int WeatherIcon { get; set; }
		public string IconPhrase { get; set; }
		public bool HasPrecipitation { get; set; }
		public bool IsDaylight { get; set; }
		public TemperatureValue Temperature { get; set; }
		public int PrecipitationProbability { get; set; }
		public string MobileLink { get; set; }
		public string Link { get; set; }
	}
}
