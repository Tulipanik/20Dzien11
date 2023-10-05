using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P04WeatherForecastAPI.Client.Models
{
	internal class TemperatureRange
	{
		public SingleUnitTemperature Minimum { get; set; }
		public SingleUnitTemperature Maximum { get; set; }
	}
}
