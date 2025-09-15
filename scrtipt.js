const API_KEY = "cc20a28eec148c5178bfceb6bc38ba4b";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

    const weatherIcons = {
      "01d": "☀️", "01n": "🌙",
      "02d": "⛅", "02n": "☁️",
      "03d": "☁️", "03n": "☁️",
      "04d": "☁️", "04n": "☁️",
      "09d": "🌧️", "09n": "🌧️",
      "10d": "🌦️", "10n": "🌧️",
      "11d": "⛈️", "11n": "⛈️",
      "13d": "❄️", "13n": "❄️",
      "50d": "🌫️", "50n": "🌫️"
    };

    const weatherBackgrounds = {
        Clear: "url('https://images.unsplash.com/photo-1501973801540-537f08ccae7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
        Clouds: "url('https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
        Rain: "url('https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif')",
        Drizzle: "url('https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif')",
        Thunderstorm: "url('https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif')",
        Snow: "url('https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif')",
        Mist: "url('https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
        Fog: "url('https://images.unsplash.com/photo-1468476775582-6bede20f356f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
        Haze: "url('https://images.unsplash.com/photo-1527766833261-b09c3163a791?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"
    };


    document.getElementById("cityInput").addEventListener("keypress", function(e) {
      if (e.key === "Enter") getWeather();
    });

    async function getWeather() {
      const city = document.getElementById("cityInput").value.trim();
      if (!city) {
        showError("Please enter a city name");
        return;
      }

      showLoading(true);
      hideError();
      hideWeatherData();

      try {
        const currentWeather = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
        if (!currentWeather.ok) throw new Error("City not found");
        const currentData = await currentWeather.json();

        const forecast = await fetch(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`);
        const forecastData = await forecast.json();

        displayCurrentWeather(currentData);
        displayForecast(forecastData);
        showWeatherData();
      } catch (error) {
        showError(error.message === "City not found" ? "City not found. Please check spelling." : "Error fetching weather.");
      } finally {
        showLoading(false);
      }
    }

    function displayCurrentWeather(data) {
      document.getElementById("location").textContent = `${data.name}, ${data.sys.country}`;
      document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`;
      document.getElementById("description").textContent = data.weather[0].description;
      document.getElementById("weatherIcon").textContent = weatherIcons[data.weather[0].icon] || "🌤️";
      document.getElementById("feelsLike").textContent = `${Math.round(data.main.feels_like)}°C`;
      document.getElementById("humidity").textContent = `${data.main.humidity}%`;
      document.getElementById("windSpeed").textContent = `${data.wind.speed} m/s`;
      document.getElementById("pressure").textContent = `${data.main.pressure} hPa`;

    const mainWeather = data.weather[0].main;
      document.body.style.background = weatherBackgrounds[mainWeather] || weatherBackgrounds["Clear"];
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
    }

    function displayForecast(data) {
      const forecastGrid = document.getElementById("forecastGrid");
      forecastGrid.innerHTML = "";
      const dailyForecasts = data.list.filter((item, index) => index % 8 === 0).slice(0, 5);

      dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        const monthDay = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

        const forecastItem = document.createElement("div");
        forecastItem.className = "forecast-item";
        forecastItem.innerHTML = `
          <div class="forecast-date">${dayName}<br>${monthDay}</div>
          <div class="forecast-icon">${weatherIcons[forecast.weather[0].icon] || "🌤️"}</div>
          <div class="forecast-temp">${Math.round(forecast.main.temp)}°C</div>
          <div style="font-size: 12px; color: #636e72; margin-top: 5px;">${forecast.weather[0].main}</div>
        `;
        forecastGrid.appendChild(forecastItem);
      });
    }

    function showLoading(show) {
      document.getElementById("loading").style.display = show ? "block" : "none";
    }

    function showError(message) {
      const errorElement = document.getElementById("errorMessage");
      errorElement.textContent = message;
      errorElement.style.display = "block";
    }

    function hideError() {
      document.getElementById("errorMessage").style.display = "none";
    }

    function showWeatherData() {
      document.getElementById("weatherCard").classList.add("show");
      document.getElementById("forecastContainer").classList.add("show");
    }

    function hideWeatherData() {
      document.getElementById("weatherCard").classList.remove("show");
      document.getElementById("forecastContainer").classList.remove("show");
    }