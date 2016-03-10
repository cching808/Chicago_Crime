'use strict'
let crimes = require('../app/data/2016.json')['1'][1]

var geojson = [{
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [parseFloat(crimes.Latitude), parseFloat(crimes.Longitude)]
    },
    "properties": {
        "title": crimes["Primary Type"],
        "description": crimes.Block,
        "image": "https://farm9.staticflickr.com/8604/15769066303_3e4dcce464_n.jpg",
        "marker-color": "#3ca0d3",
        "marker-size": "large",
    }
}];

console.log(JSON.stringify(geojson,null,2));
