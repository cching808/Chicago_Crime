// Process the crimes dataset and partition it into years
'use strict'
var fs = require('fs');
var oboe = require('oboe');

// "name" : "sid",
// "name" : "id",
// "name" : "position",
// "name" : "created_at",
// "name" : "created_meta",
// "name" : "updated_at",
// "name" : "updated_meta",
// "name" : "meta",
// "name" : "ID",
// "name" : "Case Number",
// "name" : "Date",
// "name" : "Block",
// "name" : "IUCR",
// "name" : "Primary Type",
// "name" : "Description",
// "name" : "Location Description",
// "name" : "Arrest",
// "name" : "Domestic",
// "name" : "Beat",
// "name" : "District",
// "name" : "Ward",
// "name" : "Community Area",
// "name" : "FBI Code",
// "name" : "X Coordinate",
// "name" : "Y Coordinate",
// "name" : "Year",
// "name" : "Updated On",
// "name" : "Latitude",
// "name" : "Longitude",
// "name" : "Location",

var crimez = {};

oboe(fs.createReadStream('./crimez.json'))
   .node('data.*', function(data){
        let crime = {
            "sid": data[0],
            "id": data[1],
            "position": data[2],
            "created_at": data[3],
            "created_meta": data[4],
            "updated_at": data[5],
            "updated_meta": data[6],
            "meta": data[7],
            "ID": data[8],
            "Case Number": data[9],
            "Date": data[10],
            "Block": data[11],
            "IUCR": data[12],
            "Primary Type": data[13],
            "Description": data[14],
            "Location Description": data[15],
            "Arrest": data[16],
            "Domestic": data[17],
            "Beat": data[18],
            "District": data[19],
            "Ward": data[20],
            "Community Area": data[21],
            "FBI Code": data[22],
            "X Coordinate": data[23],
            "Y Coordinate": data[24],
            "Year": data[25],
            "Updated On": data[26],
            "Latitude": data[27],
            "Longitude": data[28],
            "Location": data[29]
        };

        if(crimez[crime.Year] === undefined) {
            console.log(`Processing crime data for year ${crime.Year}...`);
            crimez[crime.Year] = [];
        }
        crimez[crime.Year].push(crime);
   })
   .done(function(things){
       console.log("Outputting files...");
       const years = Object.keys(crimez);
       for(let i = 0; i < years.length; i++) {
           fs.writeFile('./data/'+years[i]+'.json', JSON.stringify(crimez[years[i]], null, 2));
       }
   });
