var _ = require('underscore');
var file = require('./2016.json');

console.log("right edge");
console.log(_.max(file, function(row) {
	return parseFloat(row.Latitude);
	}).Latitude);

console.log("bottom edge");
console.log(_.max(file, function(row)  {
	return parseFloat(row.Longitude);
}).Longitude);

console.log("left edge");
console.log(_.min(file, function(row) {
	if(parseFloat(row.Latitude) != null){
		return parseFloat(row.Latitude);
	}
	else
		return;
}).Latitude);

console.log("top edge");
console.log(_.min(file, function(row) {
	if(parseFloat(row.Longitude) != null){
		return parseFloat(row.Longitude);
	}
	return;
}).Longitude);
