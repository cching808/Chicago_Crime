'use strict'
const fs = require('fs');
const moment = require('moment');

const data = require('../app/data/2016.json');
let days = {};
let saveDate = -1;
let counter = 0;

for(let i = 0; i < data.length - 1; i++) {
    var dayNum = moment(data[i].Date, 'YYYY-MM-DDTHH:mm:ss').date();

    // Initialize
    if(dayNum !== saveDate) {
        saveDate = dayNum;
        counter++;
        days[counter] = [];
    }
    days[counter].push(data[i]);
}

fs.writeFileSync('./data/2016.json', JSON.stringify(days, null, 2));
