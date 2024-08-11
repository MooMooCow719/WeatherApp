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

/*function updateUI(data) {
    document.getElementById('temp').textContent = `${Math.round(data.main.temp)}°C`;

    document.getElementById('city').textContent = data.name;
    const condition = data.weather[0].main.toLowerCase();
    //document.getElementById('condition').textContent = data.weather[0].description;
    document.getElementById('condition').textContent = condition;

    document.getElementById('humidity').textContent = data.main.humidity;

    document.getElementById('rainchk').textContent = data.clouds.all; 

    document.getElementById('wind').textContent = `${data.wind.speed} m/s`;

    // pray to god this one works
    document.getElementById('vis').textContent = data.visibility; 

    const localTime = calculateLocalTime(data.timezone);
    document.getElementById('local-time').textContent = localTime;

    const cityHours = new Date(localTime).getHours();
    updateBackground(condition, cityHours);
    updateWeatherIcon(data);

    //updateWeatherIcon(data);
    //updateBackground(data.weather[0].main.toLowerCase(), new Date().getHours());
    //updateBackground(condition, new Date().getHours());
}*/

function updateUI(data) {
    document.getElementById('temp').textContent = `${Math.round(data.main.temp)}°C`;

    document.getElementById('city').textContent = data.name;
    const condition = data.weather[0].main.toLowerCase();
    document.getElementById('condition').textContent = condition;

    document.getElementById('humidity').textContent = data.main.humidity;
    document.getElementById('rainchk').textContent = data.clouds.all; 
    document.getElementById('wind').textContent = `${data.wind.speed} m/s`;
    document.getElementById('vis').textContent = data.visibility; 

    const localTime = calculateLocalTime(data.timezone);
    document.getElementById('local-time').textContent = localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    updateWeatherIcon(data); 
    updateBackground(condition, localTime.getHours()); 
}


function calculateLocalTime(timezoneOffset) {
    const utcDate = new Date();
    const localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000 + timezoneOffset * 1000);
    return localDate;
}

function updateWeatherIcon(data) {
    const weatherIcon = document.getElementById('weather-icon');
    const condition = data.weather[0].main.toLowerCase();
    const hours = localTime.getHours();

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

document.getElementById('mode-toggle').addEventListener('change', function() {
    const currentMode = document.documentElement.getAttribute('mode');
    if (currentMode === 'light') {
        document.documentElement.removeAttribute('mode');
    } else {
        document.documentElement.setAttribute('mode', 'light');
    }
});

const backgroundImages = {
    'clear': {
        day: 'assets/sun-bg.jpeg',
        night: 'assets/moon-bg.png'
    },
    'clouds': {
        day: 'assets/day-cloud-bg.jpg',
        night: 'assets/night-cloud-bg.jpeg'
    },
    'rain': {
        day: 'assets/day-rain-bg.jpg',
        night: 'assets/night-rain-bg.jpeg'
    },
};

function updateBackground(condition, hours) {
    let backgroundImage;
    const isDay = hours >= 6 && hours < 18;

    if (typeof condition !== 'string') {
        console.error('Condition is not a string:', condition);
        return;
    }

    if (condition.includes('clear')) {
        backgroundImage = isDay ? 'url(assets/sun-bg.jpeg)' : 'url(assets/moon-bg.png)';
    } else if (condition.includes('clouds')) {
        backgroundImage = isDay ? 'url(assets/day-cloud-bg.jpg)' : 'url(assets/night-cloud-bg.jpeg)';
    } else if (condition.includes('rain')) {
        backgroundImage = isDay ? 'url(assets/day-rain-bg.jpg)' : 'url(assets/night-rain-bg.jpeg)';
    } else {
        backgroundImage = isDay ? 'url(assets/sun-bg.jpeg)' : 'url(assets/moon-bg.png)';
    }

    document.body.style.backgroundImage = backgroundImage;
    document.body.style.backgroundSize = 'contain';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
}

window.onload = function() {
    updateBackground('clear', new Date().getHours()); 
};