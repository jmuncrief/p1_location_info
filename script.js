
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
        console.log("News: ", response);
    });

}

getNews();

function getWeather(){

    
    let queryURL = "https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/weather?q=phoenix,AZ,US&appid=a646f545e8cb9250179e0c2cd1a2515f"
    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log("Weather: ", response)
    })

}
