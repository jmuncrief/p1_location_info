
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
    
    
    let queryURL = "https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/weather?q=albuquerque,NM,US&appid=a646f545e8cb9250179e0c2cd1a2515f"
    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        const city = response.name;
        const country = response.sys.country;
        const windSpeed = response.wind.speed;
        const windDeg = response.wind.deg;
        const tempCurrent = response.main.temp;
        const tempMin = response.main.temp_min;
        const tempMax = response.main.temp_max;
        const heatIndex = response.main.feels_like;
        const humidity = response.main.humidity;

        // console.log("Weather: ", response)
        console.log("Weather: ", "City: " + city + " Country: " + country + " Wind Speed: " + windSpeed + " Wind Direction: " + windDeg + " Current Temperature: " + tempCurrent + " High Temperature: " + tempMax + " Low Temperature: " + tempMin + " Feels Like: " + heatIndex + " Humidity: " + humidity);
    })
    
}

getNews();
getWeather();