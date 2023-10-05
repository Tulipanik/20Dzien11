namespace P04WeatherForecastAPI.Client.Models
{
    internal class Temperature
    {
        public TemperatureValue Metric { get; set; }
        public TemperatureValue Imperial { get; set; }
        public int UnitType { get; set; }
	}
}
