

// queryURL = "https://api.currentsapi.services/v1/latest-news?language=us&apiKey="
// apiKey = "QV6iMyFujpD8AxaFhTYC2WEehBRq35sZksMjudCZplB6umpn"

// console.log(queryURL + apiKey);

// $.ajax({
//     url: queryURL + apiKey,
//     method: "GET"
// }).then(function(response){
//     console.log(response);
// })

var settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://newscatcher.p.rapidapi.com/v1/search_free?media=True&lang=en&q=toyota",
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "newscatcher.p.rapidapi.com",
		"x-rapidapi-key": "e8b4a0ee00msh67c0789ad94f323p1e149djsn74ac17606489"
	}
}

$.ajax(settings).done(function (response) {
	console.log(response);
});