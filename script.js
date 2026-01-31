const API_KEY = '48cdea066c8936f274c3293059e9583e';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        searchWeather();
    }
}

function showError(message) {
    const errorEl = document.getElementById('error');
    errorEl.textContent = message;
    errorEl.classList.add('show');
    setTimeout(() => errorEl.classList.remove('show'), 5000);
}

function showLoading(show) {
    const loadingEl = document.getElementById('loading');
    if (show) {
        loadingEl.classList.add('show');
    } else {
        loadingEl.classList.remove('show');
    }
}

function getWeatherIcon(code) {
    const icons = {
        '01d': '☀️', '01n': '🌙',
        '02d': '⛅', '02n': '☁️',
        '03d': '☁️', '03n': '☁️',
        '04d': '☁️', '04n': '☁️',
        '09d': '🌧️', '09n': '🌧️',
        '10d': '🌦️', '10n': '🌧️',
        '11d': '⛈️', '11n': '⛈️',
        '13d': '❄️', '13n': '❄️',
        '50d': '🌫️', '50n': '🌫️'
    };
    return icons[code] || '🌤️';
}

function displayWeather(data) {
    const weatherInfo = document.getElementById('weatherInfo');
    const date = new Date();
    
    document.getElementById('location').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('date').textContent = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('weatherIcon').textContent = getWeatherIcon(data.weather[0].icon);
    document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}°C`;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${data.wind.speed} m/s`;
    document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;

    weatherInfo.classList.add('show');
    showLoading(false);
}

async function fetchWeather(url) {
    try {
        showLoading(true);
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('City not found or API error');
        }
        
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        showLoading(false);
        showError('Unable to fetch weather data. Please check the city name or try again later.');
        console.error('Weather fetch error:', error);
    }
}

function searchWeather() {
    const city = document.getElementById('cityInput').value.trim();
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }

    const url = `${API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    fetchWeather(url);
}

function searchCity(cityName) {
    document.getElementById('cityInput').value = cityName;
    searchWeather();
}

function getLocationWeather() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }

    showLoading(true);
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            const url = `${API_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
            fetchWeather(url);
        },
        (error) => {
            showLoading(false);
            showError('Unable to retrieve your location. Please enter a city manually.');
            console.error('Geolocation error:', error);
        }
    );
}

// Load weather for a default city on page load
window.onload = () => {
    const defaultCity = 'London';
    document.getElementById('cityInput').value = defaultCity;
    searchWeather();
};