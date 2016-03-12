'use strict'
var _ = require('underscore');

// Requires an input of an array of crimes for a given day/range from the slider 
var day = '1';
var crimes = require('../app/data/2016.json')[day];
var result = _.uniq(crimes, (crime) => crime["Primary Type"]);

_.each(result, crime => console.log(crime["Primary Type"]));
