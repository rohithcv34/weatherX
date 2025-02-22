import React, { useState } from "react";
import "./WeatherX.css";

export default function WeatherX() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(""); // State for handling errors

  const fetchWeather = async () => {
    if (!city) return;
    
    const apiKey = "1462dc2e031f8e8ba2ad143c433740e7"; 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
   

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setWeather(data);
        setError("");
        console.log("Weather API Response:",data); // Clear error state on success
      } else {
        setWeather(null);
        setError(data.message || "City not found. Try again!");
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("Network error. Please try again.");
      setWeather(null);
     

    }
  };

  return (
    <div className="container">
      <div className="weather-box">
        <h1 className="title">WeatherX</h1>
        <input
          type="text"
          placeholder="Enter city"
          className="city-input"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button className="search-button" onClick={fetchWeather}>
          Get Weather
        </button>

        {error && <p className="error-message">{error}</p>}

        {weather && weather.main && (
          <div className="weather-info">
            <h2 className="city-name">
              {weather.name}, {weather.sys.country}
            </h2>
            <p className="description">{weather.weather[0].description}</p>
            <p className="temperature">{weather.main.temp}°C</p>
          </div>
        )}
      </div>
    </div>
  );
}
