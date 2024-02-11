const urlParams = new URLSearchParams(window.location.search)
const selectedCity = urlParams.get("city")


// Fetch forecsst data for the selected city

fetchForecast(selectedCity)
    
    // Function to fetch forecast data for a selected city

    function fetchForecast(city) {
// Linking weather apiKey
const apiKey = "bf637df44b6b446ea2362603ca7c6cca";
// const city = "Lagos";

fetch(`https://api.weatherbit.io/v2.0/current?city=${city}&key=${apiKey}`)
.then(response => {
   if (!response.ok) {
    throw new Error(`Http error! Status: ${response.status}`)
   }
   return response.json();
})
.then(data => {
// Handling Weather Data
const cityNameElement = document.getElementById("city-name");
const temperatureElement = document.getElementById("tempsection");
const description = document.getElementById("description");

cityNameElement.innerHTML = `Weather in ${data.data[0].city_name}`;
temperatureElement.innerHTML = `Temperature: ${data.data[0].temp}\u00B0C`
description.innerHTML = `Condition: ${data.data[0].weather.description}`;

  console.log('API Response:', data)
 updateForecastContent(data)
})
.catch(error => console.error("Error fetching data:", error));
    
    function updateForecastContent(data) {
      const forecastContainer = document.getElementById("container")
    }

// Additional Weather Data (Chance of rain, UV index, wind...)

fetch(`https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${apiKey}`)
.then(response => response.json())
.then(data => {
    // Handling Weather Data
    const rainChanceElement = document.getElementById("rainChance");
    const uvIndexElement = document.getElementById("uvIndex");
    const windElement = document.getElementById("wind");
    const temperatureElement = document.getElementById("temp");

    // Assuming data for the first day (index 0) in the forecast array

    rainChanceElement.innerHTML = `${data.data[0].pop}%`
    uvIndexElement.innerHTML = `${data.data[0].uv}`
    windElement.innerHTML = `${data.data[0].wind_spd} m/s`
    temperatureElement.innerHTML = `${data.data[0].temp}\u00B0C`
})


/*
fetch(`https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${apiKey}`)
.then(response => response.json())
.then(data => {
    // Handling time stamp
    const forecastTimeElement = document.getElementById("minForcast")
    const forecastTimeStamp = data.data[0].ts;
    const forecastTime = new Date(forecastTimeStamp * 1000)
    const formattedForecastTime = forecastTime.toLocaleString();


    forecastTimeElement.innerHTML = `${formattedForecastTime}`
})
.catch(error => console.error('Error fetching forecast data:', error))
*/


// Fetch hourly forecast data for today
fetch(`https://api.weatherbit.io/v2.0/forecast/hourly?city=${city}&key=${apiKey}`)
.then(response => response.json())
.then(data => {
    // Display the time and the forecast that was recorded
    const forecastTimeElements = document.querySelectorAll("#forecast-time")
    const temperatureElements = document.querySelectorAll("#minForcast")

    for(let i = 0; i < 5; i++) {
        // Assuming each data point represent an hour
        const hourData = data.data[i];
        const temperature = hourData.temp;
        const time = new Date(hourData.timestamp_local).toLocaleTimeString([],
            { hour: '2-digit', minute: '2-digit' });

        forecastTimeElements[i].innerHTML = `<span class="aqua">${time}</span>`;        
        temperatureElements[i].innerHTML = `${temperature}\u00b0C`
    }
})
.catch(error => console.error('Error fetching hourly forecast data:', error))

// 7 - Day forecast

const documentDivs = document.querySelectorAll('.historical-day')

const endDate = new Date()
const startDate = new Date()
startDate.setDate(endDate.getDate() - 7)

// Format the date for the API request
const formattedStartDate = formatDate(startDate)
const formattedEndDate = formatDate(endDate)

// Fetch historical weather data for the past 7 days

fetch(`https://api.weatherbit.io/v2.0/history/daily?city=${city}&start_date=
${formattedStartDate}&end_date=${formattedEndDate}&key=${apiKey}`)
.then(response => response.json())
.then(data => {
    // Handle historical weather data here
    data.data.forEach((dayData, index) => {
const dayDiv = documentDivs[index]
const date = new Date(dayData.datetime).toLocaleDateString('en-US', 
{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
dayDiv.innerHTML = `<p><span class="date">${date}</span></p>
<p>Temperature: ${dayData.temp}\u00B0C</p>`
})
   })
.catch(error => console.error('Error fetching historical weather data:', error))
    // Function to format the date in the required format (YYYY-MM-DD)
    function formatDate(date) {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

}

function fetchData(city, apiKey) {
    const apiUrl = `https://api.weatherbit.io/v2.0/current?city=${city}&key=${apiKey}`;

    fetch(apiUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 429) {
                // Implement a backoff mechanism (wait for 5 seconds in this example)
                return new Promise(resolve => setTimeout(() => resolve(fetchData(city, apiKey)), 5000));
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        })
        .then(data => {
            // Handle successful API response
            console.log('API Response:', data);
            // Update your UI with the retrieved data
        })
        .catch(error => {
            // Handle errors
            console.error('Error fetching data:', error);
            // Provide feedback to the user or retry the request
        });
}

let inputElement = document.getElementById("getForecast");
let buttonElement = document.getElementById("btn");
buttonElement.onclick = function () {
      let city = inputElement.value;
      fetchForecast(city);
}

