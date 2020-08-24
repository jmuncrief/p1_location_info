// Global Variables
// 'states' and 'countries' constants prsent in 'lists.js'
const input = $("#textarea2");
const searchBtn = $("#search");
const stateBtn = $("#dropdown1");
const clearBtn = $("#clear");

$(document).ready(function () {
    populateDropdown();

    $("select").formSelect();
});

// Fills select menu with state names from lists.js on page load
function populateDropdown() {
    for (var prop in states) {
        let x = $("<option>").text(states[prop]);
        x.addClass("dropdown-style");
        x.attr("value", states[prop]);
        stateBtn.append(x);
    }
}

function startSearch() {
    let txt = input.val();
    let state = stateBtn.val();
    let stateInits = getInitialsByState(state);

    // Clears current search when starting new search
    $("#card-body").attr("style", "display: none");
    $("#card-name").empty();
    $("#card-content").empty();

    $.when(genWeatherAjax(txt, state), genNewsAjax(txt), genRecAjax(state)).then(
        function (weather, news, rec) {
            // Using spread operator to pass in arguments "...args"
            $.when(
                ...rec[0].RECDATA.map((item) => genRecChildAjax(item.RecAreaID))
            ).then(function (...response) {
                // rest operator "...recData"
                // Rec Data
                const recData = response.map((item) => item[0]);
                // We now have access to all the data we need from this point forward
                let wData = processWeatherData(weather[0]);
                let nData = processNewsData(news[0]);
                let rData = processRecData(recData);

                // Build/populate card here
                txt = titleCase(txt);
                $("#card-name").text(txt + ", " + stateInits);
                $("#card-content").append($("<p>").text("Local Weather:"))
                $("#card-content").append($("<p>").text("Temperature: " + wData.temperature + " | Wind Speed: " + wData.windSpeed + " | Humidity: " + wData.humidity + " |"));
                $("#card-content").append($("<hr>"))
                $("#card-content").append($("<p>").text("Relevant News:"))
                for (var i = 0; i < nData.titles.length; i++) {
                    $("#card-content").append($("<a>").attr("href", nData.links[i]).text(nData.titles[i]))
                    $("#card-content").append($("<br>"))
                }
                $("#card-content").append($("<hr>"))
                $("#card-content").append($("<p>").text("Nearby Recreation Areas:"))
                  for (var i = 0; i < rData.names.length; i++){  
                    $("#card-content").append($("<p>").text(rData.names[i] + " | " + rData.phones[i] + " |"))
                }

                $("#card-body").attr("style", "display: block");
            });
        }
    );

}

// Retrives initials (i.e. AZ, NM) for input from "State" field
function getInitialsByState(state) {
    for (var initials in states) {
        if (states[initials] === state.toUpperCase()) return initials;
    }
}

// Ensures first letter of input-word is capitelized, and rest are lower-case
function titleCase (word) {
    let firstLetter = word[0];
    let capLetter = firstLetter.toUpperCase();
    let wordEnd = word.slice(1).toLowerCase();
    let capWord = capLetter + wordEnd;

    return(capWord);
}

// AJAX call to news API, returns AJAX response
function genNewsAjax(city) {
    // API Documentation - https://www.notion.so/API-Documentation-e15cc61b6c1c4b0a904392f034779653

    let queryURL =
        "https://newscatcher.p.rapidapi.com/v1/search?media=True&lang=en&q=" + city;


    // Object passes paramaters into AJAX call to Newscatcher
    let settings = {
        async: true,
        crossDomain: true,
        url: queryURL,
        method: "GET",
        headers: {
            "x-rapidapi-host": "newscatcher.p.rapidapi.com",
            "x-rapidapi-key": "e8b4a0ee00msh67c0789ad94f323p1e149djsn74ac17606489",
        },
    };
    return $.ajax(settings);
}

// Extracts useful data from news API response
function processNewsData(response) {
    const articles = response.articles;

    let titleArr = [];
    let linkArr = [];

    for (let i = 0; i < articles.length; i++) {
        let articleTitle = articles[i].title;
        let articleLink = articles[i].link;

        titleArr.push(articleTitle);
        linkArr.push(articleLink);
    }
    let newsObj = {
        titles: titleArr,
        links: linkArr
    }

    return (newsObj);

}

// AJAX call to weather API, returns AJAX response
function genWeatherAjax(cityIn, state) {

    // API Documentation - https://openweathermap.org/current

    // Hard-coded variables stand-in for JQuery selectors to retrieve values from search on page
    const city = cityIn;
    const stateCode = getInitialsByState(state);
    const countryCode = "US";

    // searchTerm format (no curly braces): {city},{state code (optional)},{country code (optional)}
    let searchTerm = "";
    // Block of statements builds searchTerm based on presence of state and country codes; defaults to city only
    if (stateCode && countryCode) {
        searchTerm = city + "," + stateCode + "," + countryCode;
    } else if (stateCode && !countryCode) {
        searchTerm = city + "," + stateCode;
    } else if (!stateCode && countryCode) {
        searchTerm = city + "," + countryCode;
    } else {
        searchTerm = city;
    }

    const apiKey = "a646f545e8cb9250179e0c2cd1a2515f";
    const corsBypassProxy = "https://cors-anywhere.herokuapp.com/";
    const queryURL =
        corsBypassProxy +
        "api.openweathermap.org/data/2.5/weather?q=" +
        searchTerm +
        "&appid=" +
        apiKey;

    return $.ajax({
        url: queryURL,
        method: "GET",
    });
}

// Extracts useful data from weather API response
function processWeatherData(response) {
    const city = response.name;
    const country = response.sys.country;
    const windSpeed = response.wind.speed;
    const windDeg = response.wind.deg;
    const tempCurrentK = response.main.temp;
    const tempMinK = response.main.temp_min;
    const tempMaxK = response.main.temp_max;
    const tempCurrentC = parseInt(tempCurrentK) - 273.15;
    const tempMinC = parseInt(tempMinK) - 273.15;
    const tempMaxC = parseInt(tempMaxK) - 273.15;
    const tempCurrentF = (tempCurrentC * 1.8 + 32).toFixed(0);
    const tempMinF = (tempMinC * 1.8 + 32).toFixed(0);
    const tempMaxF = (tempMaxC * 1.8 + 32).toFixed(0);
    const heatIndex = response.main.feels_like;
    const humidity = response.main.humidity;

    // console.log("Weather: ", response)
    //console.log("Weather: ", "City: " + city + " Country: " + country + " Wind Speed: " + windSpeed + " Wind Direction: " + windDeg + " Current Temperature: " + tempCurrentF + " High Temperature: " + tempMaxF + " Low Temperature: " + tempMinF + " Feels Like: " + heatIndex + " Humidity: " + humidity);

    let weatherObj = {
        temperature: tempCurrentF,
        windSpeed: windSpeed,
        humidity: humidity,
    };

    return weatherObj;
}

// 1st AJAX call to recreation.gov API, returns AJAX response of rec area IDs
function genRecAjax(searchTerm) {

    // API Documentation - https://ridb.recreation.gov/docs

    // Location search hard-coded into locationURL. Will be replaced with reference to HTML element value
    const apiKey = "e6dcb66a-59d5-4821-9331-2a15534c73e0";
    const corsBypassProxy = "https://cors-anywhere.herokuapp.com/";
    const locationURL =
        "https://ridb.recreation.gov/api/v1/recareaaddresses?query=" +
        searchTerm +
        "&limit=5&offset=0&apikey=";


    // AJAX call retrieves Rec Area IDs from recreation.gov API based on search criteria (state)
    return $.ajax({
        url: corsBypassProxy + locationURL + apiKey,
        method: "GET",
    });
}

// Rec area IDs passed into 2nd AJAX call to different end point to return useful data
function genRecChildAjax(id) {
    const corsBypassProxy = "https://cors-anywhere.herokuapp.com/";
    const idURL1 = "https://ridb.recreation.gov/api/v1/recareas/";
    const idURL2 = "?full=true&apikey=";
    const apiKey = "e6dcb66a-59d5-4821-9331-2a15534c73e0";

    return $.ajax({
        url: corsBypassProxy + idURL1 + id + idURL2 + apiKey,
        method: "GET",
    });
}

// Useful data extraced from 2nd AJAX call to recreation.gov API
function processRecData(response) {

    let recNameArr = [];
    let recDescArr = [];
    let recPhoneArr = [];

    for (var i = 0; i < response.length; i++) {
        recNameArr.push(response[i].RecAreaName);
        recDescArr.push(response[i].RecAreaDescription);
        recPhoneArr.push(response[i].RecAreaPhone);
    }

    let recObj = {
        names: recNameArr,
        descriptions: recDescArr,
        phones: recPhoneArr
    }

    return (recObj);

}

// Runs search on click
searchBtn.on("click", function (e) {
    e.preventDefault();
    startSearch(); 
}); 

// Clears search results on click
clearBtn.on("click", function (e) {
    e.preventDefault();
    $("#card-body").attr("style", "display: none");
    $("#card-name").empty();
    $("#card-content").empty();
});

