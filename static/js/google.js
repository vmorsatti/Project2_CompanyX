

// Create a map object
var myMap = L.map("map", {
    center: [15.5994, -28.6731],
    zoom: 1
  })

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.run-bike-hike",
    accessToken: API_KEY
}).addTo(myMap);

d3.json(`/${source}`).then(data => {
    console.log(data);

    // Verna's new converted code
    data.map(x => {
    
    // Conditionals for countries points
    var color = "";
    if (x.revenue > 1000) {
      color = "#003099"
    }
    else if (x.revenue > 500) {
      color = "#0051ff"

    }
    else if (x.revenue > 100) {
      color = "#80aaff"
    }
    else {
      color = "yellowgreen"
    }
    console.log(x.city)
    console.log(x.lng)
    
    // Add circles to map
    L.circleMarker([x.lat,x.lng], {
        
      fillOpacity: x.revenue / 1000,
      color: "gray",
      fillColor: color,
      weight: .6,
      // Adjust radius
      radius: 12
       }).bindPopup("<h2>" + x.city + "</h2> <hr> <h3>Revenue: " + x.revenue + "</h3> <h3>Transactions: " + x.city_count + "</h3>").addTo(myMap);

      // }).bindPopup("<h2>" + x.count + "</h2> <hr> <h1>" + x.city + "</h1> <hr> <h3>Revenue: " + x.revenue + "</h3>").addTo(myMap);
       
      
      
      
  })


  })

