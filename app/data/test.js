var _ = require('underscore');
var moment = require('moment');
var file = require('./2016.json');

var crimes = file['1'];
crimes.forEach(function(d) {
    console.log(
        moment(d.Date, 'YYYY-MM-DDTHH:mm:ss').minute()
    );
});
