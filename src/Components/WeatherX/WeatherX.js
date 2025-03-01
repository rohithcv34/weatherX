
import React, { useState, useEffect } from "react";
import "./WeatherX.css";

export default function WeatherX() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(""); // State for handling errors
  const [locationWeather, setLocationWeather] = useState(null); // State for weather based on location

  const fetchWeather = async () => { // Function to fetch weather based on city
    if (!city) return; // If city is empty, return early

    const apiKey = "80de99660d2381b0ccc158cd03085421";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json(); // Convert received data into JSON

      if (response.ok) { // Handle successful API response
        setWeather(data); // Updates the weather
        setError(""); // Clears previous errors
        console.log("Weather API Response:", data);
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

  useEffect(() => {
    const getLocationWeather = async (lat, lon) => { // Function to fetch weather based on location
      const apiKey = "80de99660d2381b0ccc158cd03085421";
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

      try {
        const response = await fetch(url);
        const data = await response.json(); // Convert received data into JSON

        if (response.ok) { // Handle successful API response
          setLocationWeather(data); // Updates location-based weather
          setError(""); // Clears previous errors
          console.log("Location Weather API Response:", data);
        } else {
          setLocationWeather(null);
          setError(data.message || "Unable to fetch weather. Try again!");
        }
      } catch (error) {
        console.error("Error fetching location-based weather:", error);
        setError("Network error. Please try again.");
        setLocationWeather(null);
      }
    };

    const getLocation = () => { // Function to get the user's location and fetch weather
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getLocationWeather(lat, lon); // Fetch weather based on location
          },
          (error) => {
            console.error("Error getting location:", error);
            setError("Location permission denied or unavailable.");
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
      }
    };

    getLocation(); // Automatically fetch location-based weather on page load
  }, []); // Empty array ensures it runs only once on component mount

  return (
    <div className="container">
      <div className="weather-box">
        <h1 className="title">WeatherX</h1>
        <input
          type="text"
          placeholder="Enter city"
          className="city-input"
          value={city}
          onChange={(e) => setCity(e.target.value)} // Updates city
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

        {locationWeather && locationWeather.main && (
          <div className="weather-info">
            <h2 className="city-name">
              Your Location, {locationWeather.sys.country}
            </h2>
            <p className="description">{locationWeather.weather[0].description}</p>
            <p className="temperature">{locationWeather.main.temp}°C</p>
          </div>
        )}
      </div>
    </div>
  );
}

