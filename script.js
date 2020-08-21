// Global Variables
// 'states' and 'countries' constants prsent in 'lists.js'
const input = $("#textarea2");
const searchBtn = $("#search");
const stateBtn = $("#dropdown1");

$(document).ready(function () {
    populateDropdown();

    $("select").formSelect();
});

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

                console.log(wData);
                console.log(nData);
                console.log(rData);

                // Build/populate card here
                txt = titleCase(txt);
                $("#card-name").text(txt + ", " + stateInits);
                $("#card-content").append($("<p>").text("Temperature: " + wData.temperature + " | Wind Speed: " + wData.windSpeed + " | Humidity: " + wData.humidity + " |"));
                $("#card-content").append($("<hr>"))
                for (var i = 0; i < nData.titles.length; i++) {
                    $("#card-content").append($("<a>").attr("href", nData.links[i]).text(nData.titles[i]))
                    $("#card-content").append($("<br>"))
                }
                $("#card-content").append($("<hr>"))
                $("#card-content").append($("<p>").text("Recreation Areas Nearby:"))
                  for (var i = 0; i < rData.names.length; i++){  
                    $("#card-content").append($("<p>").text(rData.names[i] + " | " + rData.phones[i] + " |"))
                }

                $("#card-body").attr("style", "display: block");
            });
        }
    );

}

function getInitialsByState(state) {
    for (var initials in states) {
        if (states[initials] === state.toUpperCase()) return initials;
    }
}

function titleCase (word) {
    let firstLetter = word[0];
    let capLetter = firstLetter.toUpperCase();
    let wordEnd = word.slice(1).toLowerCase();
    let capWord = capLetter + wordEnd;

    return(capWord);
}

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
    // console.log("Weather: ", "City: " + city + " Country: " + country + " Wind Speed: " + windSpeed + " Wind Direction: " + windDeg + " Current Temperature: " + tempCurrentF + " High Temperature: " + tempMaxF + " Low Temperature: " + tempMinF + " Feels Like: " + heatIndex + " Humidity: " + humidity);

    let weatherObj = {
        temperature: tempCurrentF,
        windSpeed: windSpeed,
        humidity: humidity,
    };

    return weatherObj;
}


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

function getRestaurant() {
    //API documentation - https://developers.zomato.com/documentation#!/restaurant/restaurant_0
    const apiKey = "c856e1da1a9c81fb77e457de7e16c942";
    const corsBypassProxy = "https://cors-anywhere.herokuapp.com/";
    const locationURL = "https://developers.zomato.com/api/v2.1/cities?q=phoenix";
    const locationDetailURL =
        "https://developers.zomato.com/api/v2.1/location_details?entity_id=301&entity_type=city";

    $.ajax({
        url: corsBypassProxy + locationURL + apiKey,
        method: "GET",
    }).then(function (response) {
        // console.log(locationURL);
    });
}

searchBtn.on("click", function (e) {
    e.preventDefault();
    startSearch();
});

