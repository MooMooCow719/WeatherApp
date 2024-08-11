document.getElementById('search-bar').addEventListener('submit', function(event) {
    event.preventDefault(); 
    //console.log('Form submitted');
    const cityName = document.getElementById('search-input').value.trim();
    if (cityName) {
        getWeather(cityName); 
    } else {
        alert('B-baka! You have to enter something in the search field!');
    }
});

async function getWeather(city) {
    const apiKey = '24524e3076d9fba4d6e1b9238868c410';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();
        updateUI(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Uhmm...gomenasai! P-please check that your city exists and retry...');
    }
}

function updateUI(data) {
    document.getElementById('temp').textContent = `${Math.round(data.main.temp)}°C`;

    document.getElementById('city').textContent = data.name;

    document.getElementById('condition').textContent = data.weather[0].description;

    document.getElementById('humidity').textContent = data.main.humidity;

    document.getElementById('rainchk').textContent = data.clouds.all; 

    document.getElementById('wind').textContent = `${data.wind.speed} m/s`;

    // pray to god this one works
    document.getElementById('vis').textContent = data.visibility; 

    const localTime = calculateLocalTime(data.timezone);
    document.getElementById('local-time').textContent = localTime;

    updateWeatherIcon(data);
}

function calculateLocalTime(timezoneOffset) {
    const utcDate = new Date();
    const localDate = new Date(utcDate.getTime() + (timezoneOffset * 1000));
    return localDate.toLocaleTimeString();
}

function updateWeatherIcon(data) {
    const weatherIcon = document.getElementById('weather-icon');
    const condition = data.weather[0].main.toLowerCase();
    const hours = new Date().getHours();

    let icon;
    if (hours >= 18 || hours < 6) {
        if (condition.includes('clear')) {
            icon = 'moon.png';
        } else if (condition.includes('clouds')) {
            icon = 'night-cloud.png';
        } else if (condition.includes('rain')) {
            icon = 'night-rain.png';
        }
    } else { 
        if (condition.includes('clear')) {
            icon = 'sun.png';
        } else if (condition.includes('clouds')) {
            icon = 'day-cloud.png';
        } else if (condition.includes('rain')) {
            icon = 'day-rain.png';
        }
    }

    weatherIcon.src = `assets/${icon}`;
}
