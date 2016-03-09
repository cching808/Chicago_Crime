
var count = 0;
var _ = require('underscore');
var data = require('../app/data/2016.json');

var p1 = _.max(data, row => {
    if(row.Latitude === null) count++;
    return parseFloat(row.Latitude) || 0;
});
var p2 = _.max(data, row => (parseFloat(row.Longitude) || 0));

console.log(p1.Latitude);
console.log(p2.Longitude);
console.log(count);
