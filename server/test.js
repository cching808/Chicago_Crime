'use strict'
var fs = require('fs');
var _ = require('underscore');
var moment = require('moment');
var crimes = require('../app/data/2016.json')['1'];

console.log(_.find(crimes, function(d) { return d.Date }));
