var util = {
    getCrimeAttribute: function(crimeType) {
        if((crimeType === "BATTERY") ||
            (crimeType === "HOMICIDE") ||
            (crimeType === "ASSAULT") ||
            (crimeType === "INTIMIDATION") ||
            (crimeType === "KIDNAPPING") ||
            (crimeType === "OFFENSE INVOLVING CHILDREN")) {
            return {
                symbol : "pitch",
                color : '#dd9787'
            };
        } else if((crimeType === "THEFT") ||
            (crimeType === "ROBBERY") ||
            (crimeType === "MOTOR VEHICLE THEFT") ||
            (crimeType === "CRIMINAL DAMAGE") ||
            (crimeType === "CRIMINAL TRESPASS") ||
            (crimeType === "OBSCENITY") ||
            (crimeType === "BURGLARY")) {
            return {
                symbol : "theatre",
                color : '#822165'
            };
        } else if((crimeType === "CRIM SEXUAL ASSAULT") ||
            (crimeType === "PROSTITUTION") ||
            (crimeType === "STALKING") ||
            (crimeType === "SEX OFFENSE")) {
            return {
                symbol : "school",
                color : '#fbcfb7'
            };
        } else if((crimeType === "PUBLIC PEACE VIOLATION") ||
            (crimeType === "INTERFERENCE WITH PUBLIC OFFICER") ||
            (crimeType === "CONCEALED CARRY LICENSE VIOLATION") ||
            (crimeType === "WEAPONS VIOLATION")) {
            return {
                symbol : "police",
                color : '#337ca0'
            };
        } else if((crimeType === "GAMBLING") ||
            (crimeType === "LIQUOR LAW VIOLATION") ||
            (crimeType === "OTHER NARCOTIC VIOLATION") ||
            (crimeType === "NARCOTICS")) {
            return {
                symbol : "pharmacy",
                color : '#fffc31'
            };
        } else if((crimeType === "DECEPTIVE PRACTICE") ||
            (crimeType === "OTHER OFFENSE") ||
            (crimeType === "NON-CRIMINAL") ||
            (crimeType === "NON - CRIMINAL")) {
            return {
                symbol : "roadblock",
                color : '#3ec300'
            };
        } else if((crimeType === "ARSON")) {
            return {
                symbol : "fire-station",
                color : '#da2c38'
            }
        } else {
            console.log("wtf -_-");
            console.log(crimeType);
            return {
                symbol : "roadblock",
                color : '#3ec300'
            }
        }
    },
    datepickerOptions: {
        "singleDatePicker": true,
        "locale": {
            "format": "MM/DD/YYYY",
            "separator": " - ",
            "applyLabel": "Apply",
            "cancelLabel": "Cancel",
            "fromLabel": "From",
            "toLabel": "To",
            "customRangeLabel": "Custom",
            "daysOfWeek": [
                "Su",
                "Mo",
                "Tu",
                "We",
                "Th",
                "Fr",
                "Sa"
            ],
            "monthNames": [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
            ],
            "firstDay": 1
        },
        "alwaysShowCalendars": true,
        "startDate": "01/01/2016",
        "endDate": "03/11/2016",
        "minDate": "01/01/2016",
        "maxDate": "02/19/2016",
        "opens": "left",
        "drops": "up"
    },
    // Utility function to find the number of crimes within every hour
    getCrimesPerHour: function(data) {
        // Interval array containing tuples of crime data with their index
        var temp = JSON.parse(JSON.stringify(data));
        var interval = [];
        var currentHour = 0;

        for(var i = 0; i < temp.length; i++) {
            var hour = moment(temp[i].Date, 'YYYY-MM-DDTHH:mm:ss').hour();
            
            // For the same hour, push the current crime in the interval for the hour
            if(currentHour === hour) {
                interval.push({ index: i });
            } else {
                // For a new hour, iterate through the interval array to assign "Crimes Within This Hour"
                for(var j = 0; j < interval.length; j++) {
                    temp[interval[j].index]["Crimes Within This Hour"] = interval.length;
                }

                //  Clear the interval array and push the new crime
                interval = [];
                interval.push({ index: i });
            }

            currentHour = hour;
            temp[i].Date = moment(temp[i].Date, 'YYYY-MM-DDTHH:mm:ss').toDate();
        }

        //  Iterate through the interval array to assign "Crimes Within This Hour"
        for(var j = 0; j < interval.length; j++) {
            temp[interval[j].index]["Crimes Within This Hour"] = interval.length;
        }

        return temp;
    }
};
