import React, { useEffect, useState } from "react";
import "./Weather.css";
import search_icon from "../assets/search.png";
import clear_icon from "../assets/clear.png"; 
import cloud_icon from "../assets/cloud.png"; 
import drizzle_icon from "../assets/drizzle.png"; 
import rain_icon from "../assets/rain.png"; 
import snow_icon from "../assets/snow.png"; 
import wind_icon from "../assets/wind.png";
import humidity_icon from "../assets/humidity.png";

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [weatherCondition, setWeatherCondition] = useState("default"); // New State for background

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  const search = async (city) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);

      if (data.cod !== 200) throw new Error("City not found");

      const icon = allIcons[data.weather[0].icon] || clear_icon;

      // Set weather condition for background
      if (data.weather[0].main.includes("Clear")) {
        setWeatherCondition("clear");
      } else if (data.weather[0].main.includes("Cloud")) {
        setWeatherCondition("cloudy");
      } else if (data.weather[0].main.includes("Rain") || data.weather[0].main.includes("Drizzle")) {
        setWeatherCondition("rainy");
      } else if (data.weather[0].main.includes("Snow")) {
        setWeatherCondition("snowy");
      } else {
        setWeatherCondition("default");
      }

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
      });
    } catch (error) {
      console.error("Error fetching weather:", error);
      setWeatherData(null);
    }
  };

  useEffect(() => {
    search("London");
  }, []);

  return (
    <div className={`weather-app ${weatherCondition}`}>
      <div className="weather">
        <div className="search-bar">
          <input type="text" placeholder="Search" id="cityInput" />
          <img
            src={search_icon}
            alt=""
            onClick={() => {
              const city = document.getElementById("cityInput").value;
              if (city) search(city);
            }}
          />
        </div>
        {weatherData ? (
          <>
            <img src={weatherData.icon} alt="" className="weather-icon" />
            <p className="temperature">{weatherData.temperature}°C</p>
            <p className="location">{weatherData.location}</p>
            <div className="weather-data">
              <div className="col">
                <img src={humidity_icon} alt="" />
                <div>
                  <p>{weatherData.humidity}%</p>
                  <span>Humidity</span>
                </div>
              </div>
              <div className="col">
                <img src={wind_icon} alt="" />
                <div>
                  <p>{weatherData.windSpeed} km/h</p>
                  <span>Wind Speed</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="error-message">Enter a valid city name!</p>
        )}
      </div>
    </div>
  );
};

export default Weather;
