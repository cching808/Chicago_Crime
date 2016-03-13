var _ = require('underscore');
var d3 = require('d3');
var moment = require('moment');
var file = require('./2016.json');

var crimes = file['1'];
var parseDate = d3.time.format("%d-%b-%y-").parse;

crimes.forEach(function(d) {
    console.log(
        // moment(d.Date, 'YYYY-MM-DDTHH:mm:ss').minute()
        moment(d.Date, 'YYYY-MM-DDTHH:mm:ss').format().toString()
    );

});
