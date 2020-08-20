// Global Variables
// 'states' and 'countries' constants prsent in 'lists.js'



function getInitialsByState(state) { 
    for (var initials in states) { 
            if (states[initials] === state.toUpperCase()) 
            return initials; 
    } 
} 

for (var inits in states) {
    // console.log(inits);
}

const input = $("#textarea2");
const searchBtn = $("#search");
const stateBtn = $("#dropdown1");


$(document).ready(function(){
    populateDropdown();
    
    
})
function populateDropdown() {
               for(var prop in states) {
                //    console.log(states[prop]);
                let x = $("<option>").text(states[prop]);
                x.addClass("dropdown-style");
                stateBtn.append(x);
               }
           }




function startSearch() {
    let txt = input.val();
    let state = stateBtn.text();
    console.log(txt);
    console.log(state);

}


function startSearch(state) {
    for (var initials in states) {
        if (states[initials] === state.toUpperCase())
        return initials;
    }
}

function getNews() {
    // API Documentation - https://www.notion.so/API-Documentation-e15cc61b6c1c4b0a904392f034779653



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


function getWeather() {
    // API Documentation - https://openweathermap.org/current

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
    }).then(function (response) {
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
        console.log("Weather: ", "City: " + city + " Country: " + country + " Wind Speed: " + windSpeed + " Wind Direction: " + windDeg + " Current Temperature: " + tempCurrent + " High Temperature: " + tempMaxF + " Low Temperature: " + tempMinF + " Feels Like: " + heatIndex + " Humidity: " + humidity);
    })

}

function getRecd() {
    // API Documentation - https://ridb.recreation.gov/docs

    // Location search hard-coded into locationURL. Will be replaced with reference to HTML element value
    const apiKey = "e6dcb66a-59d5-4821-9331-2a15534c73e0";
    const corsBypassProxy = "https://cors-anywhere.herokuapp.com/";
    const locationURL = "https://ridb.recreation.gov/api/v1/recareaaddresses?query=nevada&limit=5&offset=0&apikey=";
    const idURL1 = "https://ridb.recreation.gov/api/v1/recareas/"
    const idURL2 = "?full=true&apikey="

    // AJAX call retrieves Rec Area IDs from recreation.gov API based on search criteria (state)
    $.ajax({
        url: corsBypassProxy + locationURL + apiKey,
        method: "GET"
    }).then(function(response) {
        // console.log(response);
        let idArr = response.RECDATA;
        // console.log("Rec Areas: ", idArr);

        // Iterates through array of rec area objects
        for (i = 0; i < idArr.length; i++) {
            // console.log(idArr[i].RecAreaID);
            let currentID = idArr[i].RecAreaID
            
            // Nested AJAX call takes IDs from parent call and retrieves data about specific rec areas
            $.ajax({
                url: corsBypassProxy + idURL1 + currentID + idURL2 + apiKey,
                method: "GET"
            }).then(function(response) {
                let recAreaName = response.RecAreaName;
                let recAreaDescription = response.RecAreaDescription;
                let recAreaPhone = response.RecAreaPhone;

                // console.log(response);
                console.log("Rec Area Name:", recAreaName);
                console.log("Description:", recAreaDescription);
                console.log("Phone:", recAreaPhone);
            })
        }
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

// getNews();
getWeather();



// when user searches city name

// return card with city, headlines, crime data, weather

// hide cards till search 

// let searchButton = document.getElementById('search-btn')

// function getNews(){


    
    
//     let queryURL = "https://newscatcher.p.rapidapi.com/v1/search?media=True&lang=en&q=albuquerque";
    
//     // Object passes paramaters into AJAX call to Newscatcher
//     let settings = {
//         "async": true,
//         "crossDomain": true,
//         "url": queryURL,
//         "method": "GET",
//         "headers": {
    //             "x-rapidapi-host": "newscatcher.p.rapidapi.com",
    //             "x-rapidapi-key": "e8b4a0ee00msh67c0789ad94f323p1e149djsn74ac17606489"
    //         }
    //     }
    //     $.ajax(settings).done(function (response) {
        //         const articles = response.articles;
        
        //         console.log("News: ", articles);
        //     });
        
        // }


//   document.addEventListener('DOMContentLoaded', function() {
//     var elems = document.querySelectorAll('.dropdown-trigger');
//     var instances = M.Dropdown.init(elems, options);
//   });

  // Or with jQuery

  $('.dropdown-trigger').dropdown()

  searchBtn.on("click", function(e){
      e.preventDefault
  })
   
