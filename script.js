
// when user searches city name

// return card with city, headlines, crime data, weather

// hide cards till search 

let searchButton = document.getElementById('search-btn')

let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=phoenix&appid=45995aa4ec1c9bdc0b3f524be926f233"
let response = queryURL





$.ajax({
    url: queryURL,
    method: "GET"

})
    .then(function (response) {
        console.log(response)
    })

$("#random").on("click", function(){
    console.log(response)
})