using System;
using System.Collections.Generic;

namespace P04WeatherForecastAPI.Client.Models
{
	internal class DailyForecast
	{
		public DateTime Date { get; set; }
		public int EpochDate { get; set; }
		public TemperatureRange Temperature { get; set; }
		public List<string> Sources { get; set; }
		public string MobileLink { get; set; }
		public string Link { get; set; }
	}
}
