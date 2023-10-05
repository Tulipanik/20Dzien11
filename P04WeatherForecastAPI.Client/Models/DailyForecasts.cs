using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P04WeatherForecastAPI.Client.Models
{
	// Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
	internal class DailyForecast
	{
		public DateTime Date { get; set; }
		public int EpochDate { get; set; }
		public TemperatureRange Temperature { get; set; }
		public Day Day { get; set; }
		public Night Night { get; set; }
		public List<string> Sources { get; set; }
		public string MobileLink { get; set; }
		public string Link { get; set; }
	}

	internal class Day
	{
		public int Icon { get; set; }
		public string IconPhrase { get; set; }
		public bool HasPrecipitation { get; set; }
	}

	internal class Headline
	{
		public DateTime EffectiveDate { get; set; }
		public int EffectiveEpochDate { get; set; }
		public int Severity { get; set; }
		public string Text { get; set; }
		public string Category { get; set; }
		public DateTime EndDate { get; set; }
		public int EndEpochDate { get; set; }
		public string MobileLink { get; set; }
		public string Link { get; set; }
	}

	internal class Maximum
	{
		public int Value { get; set; }
		public string Unit { get; set; }
		public int UnitType { get; set; }
	}

	internal class Minimum
	{
		public int Value { get; set; }
		public string Unit { get; set; }
		public int UnitType { get; set; }
	}

	internal class Night
	{
		public int Icon { get; set; }
		public string IconPhrase { get; set; }
		public bool HasPrecipitation { get; set; }
	}

	internal class Root
	{
		public Headline Headline { get; set; }
		public List<DailyForecast> DailyForecasts { get; set; }
	}
}
