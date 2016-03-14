'use strict'
const fs = require('fs');
const moment = require('moment');

const data = require('./2016.json');
let days = {};
let saveDate = -1;
let counter = 0;

data.reverse();
for(let i = 0; i < data.length - 1; i++) {
    var dayNum = moment(data[i].Date, 'YYYY-MM-DDTHH:mm:ss').date();
    console.log(counter);

    // Initialize
    if(dayNum !== saveDate) {
        saveDate = dayNum;
        counter++;
        days[counter] = [];
    }
    days[counter].push(data[i]);
}

fs.writeFileSync('test.json', JSON.stringify(days, null, 2));
