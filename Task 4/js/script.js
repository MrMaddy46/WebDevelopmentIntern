"use strict";


// ======================================
// DOM ELEMENTS
// ======================================

const weatherForm =
    document.getElementById("weather-form");

const cityInput =
    document.getElementById("city-input");

const statusMessage =
    document.getElementById("status-message");

const weatherResult =
    document.getElementById("weather-result");

const cityName =
    document.getElementById("city-name");

const countryName =
    document.getElementById("country-name");

const temperature =
    document.getElementById("temperature");

const humidity =
    document.getElementById("humidity");

const windSpeed =
    document.getElementById("wind-speed");

const updatedTime =
    document.getElementById("updated-time");


// ======================================
// API ENDPOINTS
// ======================================

const GEOCODING_API =
    "https://geocoding-api.open-meteo.com/v1/search";

const WEATHER_API =
    "https://api.open-meteo.com/v1/forecast";


// ======================================
// FORM SUBMISSION
// ======================================

weatherForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const city =
            cityInput.value.trim();

        if (!city) {

            showError(
                "Please enter a city name."
            );

            return;
        }

        await searchWeather(city);

    }
);


// ======================================
// SEARCH WEATHER
// ======================================

async function searchWeather(city) {

    showLoading();

    weatherResult.hidden = true;

    try {

        // ------------------------------
        // STEP 1: Find City Coordinates
        // ------------------------------

        const location =
            await getLocation(city);


        // ------------------------------
        // STEP 2: Fetch Weather
        // ------------------------------

        const weather =
            await getWeather(
                location.latitude,
                location.longitude
            );


        // ------------------------------
        // STEP 3: Render Weather
        // ------------------------------

        displayWeather(
            location,
            weather
        );

    }

    catch (error) {

        console.error(
            "Weather request failed:",
            error
        );

        showError(
            error.message ||
            "Unable to fetch weather data."
        );

    }

}


// ======================================
// GET LOCATION
// ======================================

async function getLocation(city) {

    const url =
        `${GEOCODING_API}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;


    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            "Unable to connect to the location service."
        );

    }


    const data =
        await response.json();


    if (
        !data.results ||
        data.results.length === 0
    ) {

        throw new Error(
            `City "${city}" was not found.`
        );

    }


    return data.results[0];

}


// ======================================
// GET WEATHER
// ======================================

async function getWeather(
    latitude,
    longitude
) {

    const url =
        `${WEATHER_API}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&temperature_unit=celsius&wind_speed_unit=kmh&timezone=auto`;


    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            "Unable to fetch weather data."
        );

    }


    const data =
        await response.json();


    if (!data.current) {

        throw new Error(
            "Weather information is unavailable."
        );

    }


    return data;

}


// ======================================
// DISPLAY WEATHER
// ======================================

function displayWeather(
    location,
    weather
) {

    /*
    The API response contains nested data:

    weather
      └── current
            ├── temperature_2m
            ├── relative_humidity_2m
            └── wind_speed_10m
    */

    const current =
        weather.current;


    cityName.textContent =
        location.name;


    countryName.textContent =
        `${location.admin1 || ""}${
            location.admin1
                ? ", "
                : ""
        }${location.country || ""}`;


    temperature.textContent =
        Math.round(
            current.temperature_2m
        );


    humidity.textContent =
        Math.round(
            current.relative_humidity_2m
        );


    windSpeed.textContent =
        Math.round(
            current.wind_speed_10m
        );


    updatedTime.textContent =
        formatDateTime(
            current.time
        );


    statusMessage.textContent = "";

    statusMessage.classList.remove(
        "error"
    );

    weatherResult.hidden = false;

}


// ======================================
// FORMAT TIME
// ======================================

function formatDateTime(time) {

    if (!time) {

        return "Unavailable";

    }

    const date =
        new Date(time);


    if (Number.isNaN(date.getTime())) {

        return time;

    }


    return date.toLocaleString();

}


// ======================================
// LOADING MESSAGE
// ======================================

function showLoading() {

    statusMessage.textContent =
        "Loading weather data...";

    statusMessage.classList.remove(
        "error"
    );

}


// ======================================
// ERROR MESSAGE
// ======================================

function showError(message) {

    statusMessage.textContent =
        message;

    statusMessage.classList.add(
        "error"
    );

    weatherResult.hidden = true;

}