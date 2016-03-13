'use strict'
var fs = require('fs');
var _ = require('underscore');
var moment = require('moment');

// Requires an input of an array of crimes for a given day/range from the slider 
var day = '1';
var currentHour = 0;
var crimes = require('../app/data/2016.json')[day];

// Interval array containing tuples of crime data with their index
var interval = [];

for(let i = 0; i < crimes.length; i++) {
    var hour = moment(crimes[i].Date, 'YYYY-MM-DDTHH:mm:ss').hour();
    
    // For the same hour, push the current crime in the interval for the hour
    if(currentHour === hour) {
        interval.push({ index: i });
    } else {
        // For a new hour, iterate through the interval array to assign "Crimes Within This Hour"
        for(let j = 0; j < interval.length; j++) {
            crimes[interval[j].index]["Crimes Within This Hour"] = interval.length;
        }

        //  Clear the interval array and push the new crime
        interval = [];
        interval.push({ index: i });
    }

    currentHour = hour;
}

//  Iterate through the interval array to assign "Crimes Within This Hour"
for(let j = 0; j < interval.length; j++) {
    crimes[interval[j].index]["Crimes Within This Hour"] = interval.length;
}

