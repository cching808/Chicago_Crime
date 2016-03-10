'use strict'
var _ = require('underscore');

// Requires an input of an array of crimes for a given day/range from the slider 
var day = '1';
var crimes = require('../app/data/2016.json')[day];

var geojson = _.map(crimes, function(crime) {
    var lat = parseFloat(crime.Latitude);
    var lon = parseFloat(crime.Longitude);
    return {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [lon, lat]
        },
        "properties": {
            "title": crime["Primary Type"],
            "description": crime.Block,
            "marker-color": "#3ca0d3",
            "marker-size": "large",
            "marker-symbol": "police"
        }
    };
});

console.log(geojson);
