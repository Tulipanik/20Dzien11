using P04WeatherForecastAPI.Client.Models;
using P04WeatherForecastAPI.Client.Services;
using System;
using System.Collections.Generic;
using System.Windows;
using System.Windows.Controls;

namespace P04WeatherForecastAPI.Client
{
	/// <summary>
	/// Interaction logic for MainWindow.xaml
	/// </summary>
	public partial class MainWindow : Window
	{
		AccuWeatherService accuWeatherService;

		private string FrecastHourSelectionLabel = "Temperature in next {0} hour";
		private string FrecastDaySelectionLabel = "Temperature in next {0} day";


		private int currentHour = 0;
		private int currentDay = 0;

		private List<HourlyForecast>? hourlyForecasts;
		private List<DailyForecast>? dailyForecasts;

		private City selectedCity;

		public MainWindow()
		{
			InitializeComponent();
			accuWeatherService = new AccuWeatherService();
			btnNextDay.IsEnabled = false;
			btnNextHour.IsEnabled = false;
		}

		private async void btnSearch_Click(object sender, RoutedEventArgs e)
		{

			City[] cities = await accuWeatherService.GetLocations(txtCity.Text);
			lbData.ItemsSource = cities;
		}

		private async void lbData_SelectionChanged(object sender, SelectionChangedEventArgs e)
		{
			selectedCity = (City)lbData.SelectedItem;
			btnNextDay.IsEnabled = false;
			btnNextHour.IsEnabled = false;
			if (selectedCity != null)
			{
				var weather = await accuWeatherService.GetCurrentConditions(selectedCity.Key);
				lblCityName.Content = selectedCity.LocalizedName;
				double tempValue = weather.Temperature.Metric.Value;
				lblTemperatureValue.Content = Convert.ToString(tempValue);
				resetForecasts();
				var hourlyForecast = await accuWeatherService.GetForecastFor1Hour(selectedCity.Key);
				lblHourlyForecast.Content = string.Format("{0} {1}", hourlyForecast.Temperature.Value, hourlyForecast.Temperature.Unit);
				var dailyForecast = await accuWeatherService.GetForecastFor1Day(selectedCity.Key);
				lblDailyForecast.Content = string.Format("{0}-{1} {2}", dailyForecast.Temperature.Minimum.Value,
					dailyForecast.Temperature.Maximum.Value,
					dailyForecast.Temperature.Maximum.Unit);

				btnNextDay.IsEnabled = true;
				btnNextHour.IsEnabled = true;
			}
		}

		private void resetForecasts()
		{
			currentHour = 0;
			currentDay = 0;
			lblFrecastDaySelectionLabel.Content = string.Format(FrecastDaySelectionLabel, 1);
			lblFrecastHourSelectionLabel.Content = string.Format(FrecastHourSelectionLabel, 1);
			hourlyForecasts = null;
			dailyForecasts = null;
		}

		private async void btnNextDay_Click(object sender, RoutedEventArgs e)
		{
			currentDay++;
			if (currentDay == 5)
			{
				currentDay = 0;
			}
			lblFrecastDaySelectionLabel.Content = string.Format(FrecastDaySelectionLabel, currentDay + 1);

			if (dailyForecasts == null)
			{
				dailyForecasts = new List<DailyForecast>(await accuWeatherService.GetForecastFor5Days(selectedCity.Key));
			}
			lblDailyForecast.Content = string.Format("{0}-{1} {2}", dailyForecasts[currentDay].Temperature.Minimum.Value,
				dailyForecasts[currentDay].Temperature.Maximum.Value,
				dailyForecasts[currentDay].Temperature.Maximum.Unit);
		}

		private async void btnNextHour_Click(object sender, RoutedEventArgs e)
		{
			currentHour++;
			if (currentHour == 12)
			{
				currentHour = 0;
			}
			lblFrecastHourSelectionLabel.Content = string.Format(FrecastHourSelectionLabel, currentHour + 1);

			if (hourlyForecasts == null)
			{
				hourlyForecasts = new List<HourlyForecast>(await accuWeatherService.GetForecastFor12Hours(selectedCity.Key));
			}
			lblHourlyForecast.Content = string.Format("{0} {1}", hourlyForecasts[currentHour].Temperature.Value, hourlyForecasts[currentHour].Temperature.Unit);
		}
	}
}
