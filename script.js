function getNews(){

    let queryURL = "https://newscatcher.p.rapidapi.com/v1/search?media=True&lang=en&q=albuquerque";
    
    // Object passes paramaters into AJAX call to Newscatcher
    let settings = {
        "async": true,
        "crossDomain": true,
        "url": queryURL,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "newscatcher.p.rapidapi.com",
            "x-rapidapi-key": "e8b4a0ee00msh67c0789ad94f323p1e149djsn74ac17606489"
        }
    }
    $.ajax(settings).done(function (response) {
        const articles = response.articles;

        console.log("News: ", articles);
    });

}


function getWeather(){

    // Hard-coded variables stand-in for JQuery selectors to retrieve values from search on page
    const city = "albuquerque";
    const stateCode = "NM";
    const countryCode = "US";

    // searchTerm format (no curly braces): {city},{state code (optional)},{country code (optional)}
    let searchTerm = "";
    // Block of statements builds searchTerm based on presence of state and country codes; defaults to city only
        if (stateCode && countryCode) {
        searchTerm = city + "," + stateCode + "," + countryCode;
        } else if (stateCode && !countryCode) {
            searchTerm = city + "," + stateCode
        } else if (!stateCode && countryCode) {
            searchTerm = city + "," + countryCode
        } else {
            searchTerm = city
        }

    const apiKey = "a646f545e8cb9250179e0c2cd1a2515f";
    const corsBypassProxy = "https://cors-anywhere.herokuapp.com/";
    const queryURL = corsBypassProxy + "api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&appid=" + apiKey;
    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        const city = response.name;
        const country = response.sys.country;
        const windSpeed = response.wind.speed;
        const windDeg = response.wind.deg;
        const tempCurrent = response.main.temp;
        const tempMinK = response.main.temp_min;
        const tempMaxK = response.main.temp_max;
        const tempMinC = (parseInt(response.main.temp_min)) - 273.15;
        const tempMaxC = (parseInt(response.main.temp_max)) - 273.15;
        const tempMinF = ((response.main.temp_min) * (9 / 5)) + 32;
        const tempMaxF = ((response.main.temp_max) * (9 / 5)) + 32;
        const heatIndex = response.main.feels_like;
        const humidity = response.main.humidity;

        // console.log("Weather: ", response)
        console.log("Weather: ", "City: " + city + " Country: " + country + " Wind Speed: " + windSpeed + " Wind Direction: " + windDeg + " Current Temperature: " + tempCurrent + " High Temperature: " + tempMax + " Low Temperature: " + tempMin + " Feels Like: " + heatIndex + " Humidity: " + humidity);
    })
    
}

getNews();
getWeather(); 


function getRestaurant(){ 
    const apiKey = "c856e1da1a9c81fb77e457de7e16c942";
    const locationURL = "https://developers.zomato.com/api/v2.1/locations?query=phoenix"; 
    //const locationDetailURL = "https://developers.zomato.com/api/v2.1/location_details?entity_id=301&entity_type=city";  

    $.ajax({ 
        url: locationURL, 
        method: "GET" 
    }) 
    .then(function(response){ 
        console.log(locationURL);



    })




}

    