// Store our API endpoint inside queryUrl
// Past 7 days of all earthquakes
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  console.log(data),
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer : pointToLayer
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

// Set colors for circles and legend
function getColor(m) {
  if(m >= 5) {
      return "#FF4500"
  } else if (m >= 4 ) {
      return "#FF8600"
  } else if (m >= 3) {
      return "#FFA500" 
  } else if (m >= 2) {
      return "#FFD700" 
  } else if (m >= 1) {
      return "#FFFF00"       
  } else {
    return "#9ACD32"
  }
}

// Create Circles with a light gray circumferance line!
function pointToLayer(feature,latlng) {
    return new L.circle(latlng, {
        stroke: true,
        color: "gray",
        weight: .4,
        fillOpacity: .6,
        fillColor: getColor(feature.properties.mag),
        radius:  feature.properties.mag * 34000
    })
}

function createMap(earthquakes) {

  // Retain functionality for light and dark map visualization - EXTRA as a personal choice
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  //var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, \
    <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 15,
    id: "mapbox.light",
    accessToken: API_KEY
  });
  
  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, \
    <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 15,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Add legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (myMap) {

  var div = L.DomUtil.create('div', 'info legend'),
    grades = [0,1,2,3,4,5],
    labels = [];
    
      // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i]) + '"></i>' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + "   " + '<br>' : '+');
        }
        return div;
  };
    
  legend.addTo(myMap);
};  

// "There is no better productivity than when people are inclusive, and treat each other equally." - Verna Orsatti"

