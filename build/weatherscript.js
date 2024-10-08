let isMetric = true;

document.getElementById('units-toggle').addEventListener('change', function() {
    isMetric = !isMetric;
    const tempElement = document.getElementById('temp');
    if (tempElement) {
        const currentTemp = parseFloat(tempElement.dataset.temp);
        const windElement = document.getElementById('wind');
        if (windElement) {
            const currentWindSpeed = parseFloat(windElement.dataset.speed);

            // Update temperature display based on the unit system
            if (isMetric) {
                tempElement.textContent = `${Math.round(currentTemp)}°C`;
                windElement.textContent = `${currentWindSpeed.toFixed(2)} m/s`;
            } else {
                const tempFahrenheit = (currentTemp * 9/5) + 32;
                tempElement.textContent = `${Math.round(tempFahrenheit)}°F`;

                const windMPH = (currentWindSpeed * 2.23694).toFixed(2);
                windElement.textContent = `${windMPH} mph`;
            }
        } else {
            console.error("'wind' element not found in the DOM.");
        }
    } else {
        console.error("'temp' element not found in the DOM.");
    }
});

document.getElementById('search-bar').addEventListener('submit', function(event) {
    event.preventDefault(); 
    const cityName = document.getElementById('search-input').value.trim();
    if (cityName) {
        document.getElementById('cover-page').style.display = 'none';
        //document.querySelector('.header-bar').style.display = 'block';
        document.querySelector('.content').style.display = 'block';
        getWeather(cityName); 
    } else {
        alert('Please enter a city name.');
    }
});

document.getElementById('weather-title').addEventListener('click', function() {
    document.getElementById('cover-page').style.display = 'flex';
    document.querySelector('.content').style.display = 'none';
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
        if (error.name === 'TypeError') {
            console.error('Network error:', error);
            alert('Network error. Please check your connection and try again.');
        } else {
            console.error('Error fetching weather data:', error);
            alert('Please check the city name and try again.');
        }
    }
}

function updateUI(data) {
    let windDir;

    const tempCelsius = Math.round(data.main.temp);
    const tempElement = document.getElementById('temp');
    if (tempElement) {
        tempElement.dataset.temp = tempCelsius;
    }

    const windSpeedMetric = data.wind.speed;
    const windElement = document.getElementById('wind');
    if (windElement) {
        windElement.dataset.speed = windSpeedMetric;
    }

    if (isMetric) {
        if (tempElement) tempElement.textContent = `${tempCelsius}°C`;
        if (windElement) windElement.textContent = `${windSpeedMetric.toFixed(2)} m/s`;
    } else {
        const tempFahrenheit = (tempCelsius * 9/5) + 32;
        if (tempElement) tempElement.textContent = `${Math.round(tempFahrenheit)}°F`;

        const windMPH = (windSpeedMetric * 2.23694).toFixed(2);
        if (windElement) windElement.textContent = `${windMPH} mph`;
    }

    document.getElementById('city').textContent = data.name;
    document.getElementById('country').textContent = ", " + data.sys.country;
    const condition = data.weather[0].main.toLowerCase();
    document.getElementById('condition').textContent = condition;

    document.getElementById('humidity').textContent = data.main.humidity;
    document.getElementById('rainchk').textContent = data.clouds.all; 

    const sunRiseTime = calculateLocalTime(new Date(data.sys.sunrise * 1000), data.timezone);
    const sunSetTime = calculateLocalTime(new Date(data.sys.sunset * 1000), data.timezone);

    const trueSunRiseTime = sunRiseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const trueSunSetTime = sunSetTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    document.getElementById('sunrise-time').textContent = trueSunRiseTime;
    document.getElementById('sunset-time').textContent = trueSunSetTime;

    const windDeg = data.wind.deg;
    if (windDeg >= 337.5 || windDeg <= 22.5){
        windDir = 'North';
    } else if (windDeg <= 67.5){
        windDir = 'Northeast';
    } else if (windDeg <= 112.5){
        windDir = 'East';
    } else if (windDeg <= 157.5){
        windDir = "Southeast";
    } else if (windDeg <= 202.5){
        windDir = "South";
    } else if (windDeg <= 247.5){
        windDir = "Southwest";
    } else if (windDeg <= 292.5){
        windDir = "West";
    } else if (windDeg < 337.5){
        windDir = "Northwest";
    }
    document.getElementById('wind-dir').textContent = windDir; 

    const currDate = new Date();
    const localTime = calculateLocalTime(currDate, data.timezone);
    document.getElementById('local-time').textContent = localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    updateWeatherIcon(data); 
    updateWindIcon(windDir);
    updateBackground(condition, localTime.getHours()); 
}

function calculateLocalTime(inputDate, timezoneOffset) {
    const inputDateVar = inputDate;
    const localDate = new Date(inputDateVar.getTime() + inputDateVar.getTimezoneOffset()*60000 + timezoneOffset * 1000);
    return localDate;
}

function updateWeatherIcon(data) {
    const weatherIcon = document.getElementById('weather-icon');
    const condition = data.weather[0].main.toLowerCase();
    const weatherDate = new Date();
    const hours = calculateLocalTime(weatherDate, data.timezone).getHours();

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

function updateWindIcon(windDir){
    const windIcon = document.getElementById('wind-dir-img');

    let icon;
    if(windDir === "North"){
        icon = "N.png";
    } else if (windDir === "Northeast"){
        icon = 'NE.png';
    } else if (windDir === "East"){
        icon = 'E.png';
    } else if (windDir === "Southeast"){
        icon = 'SE.png';
    } else if (windDir === "South"){
        icon = 'S.png';
    } else if (windDir === "Southwest"){
        icon = 'SW.png';
    } else if (windDir === "West"){
        icon = 'W.png';
    } else if (windDir === "Northwest"){
        icon = 'NW.png';
    }

    windIcon.src = `assets/${icon}`;
}

document.getElementById('mode-toggle').addEventListener('change', function() {
    const currentMode = document.documentElement.getAttribute('mode');
    if (currentMode === 'light') {
        document.documentElement.removeAttribute('mode');
    } else {
        document.documentElement.setAttribute('mode', 'light');
    }
});

//praytoRNGesus
function updateBackground(condition, hours) {
    let backgroundGradient;
    const isDay = hours >= 6 && hours < 18;

    if (typeof condition !== 'string') {
        console.error('Condition is not a string:', condition);
        return;
    }

    if (condition.includes('clear')) {
        backgroundGradient = isDay 
            ? 'linear-gradient(to bottom, #fff866, #73CEEB)' // Daytime Clear
            : 'linear-gradient(to bottom, #4d1c7a, #0e0ea0)'; // Nighttime Clear
    } else if (condition.includes('clouds')) {
        backgroundGradient = isDay 
            ? 'linear-gradient(to bottom, #A9A9A9, #3c4d48)' // Daytime Clouds
            : 'linear-gradient(to bottom, #475470, #3e3745)'; // Nighttime Clouds
    } else if (condition.includes('rain')) {
        backgroundGradient = isDay 
            ? 'linear-gradient(to bottom, #4682B4, #2F4F4F)' // Daytime Rain
            : 'linear-gradient(to bottom, #000080, #55557f)'; // Nighttime Rain
    } else {
        backgroundGradient = isDay 
            ? 'linear-gradient(to bottom, #fbf571, #ffa1f5)' // Default Daytime
            : 'linear-gradient(to bottom, #5353c5, #040454)'; // Default Nighttime
    }

    const contentBody = document.getElementById('content');

    contentBody.style.background = backgroundGradient;
    contentBody.style.backgroundSize = 'cover'; 
    contentBody.style.backgroundPosition = 'center';
    contentBody.style.backgroundRepeat = 'no-repeat';
}


window.onload = function() {
    updateBackground('clear', new Date().getHours()); 
};

/*function updateBackground(condition, hours) {
    let backgroundImage;
    const isDay = hours >= 6 && hours < 18;

    if (typeof condition !== 'string') {
        console.error('Condition is not a string:', condition);
        return;
    }

    if (condition.includes('clear')) {
        backgroundImage = isDay ? 'url(assets/sun-bg.jpeg)' : 'url(assets/night-bg2.png)';
    } else if (condition.includes('clouds')) {
        backgroundImage = isDay ? 'url(assets/day-cloud-bg.jpg)' : 'url(assets/night-cloud-bg.jpeg)';
    } else if (condition.includes('rain')) {
        backgroundImage = isDay ? 'url(assets/day-rain-bg.jpg)' : 'url(assets/night-rain-bg.jpeg)';
    } else {
        backgroundImage = isDay ? 'url(assets/sun-bg.jpeg)' : 'url(assets/night-bg2.png)';
    }

    document.body.style.backgroundImage = backgroundImage;
    document.body.style.backgroundSize = 'cover'; // Changed from 'fill' to 'cover'
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
}*/
