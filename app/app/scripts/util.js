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
        "ranges": {
            "Today": [
                "2016-03-12T06:09:20.085Z",
                "2016-03-12T06:09:20.085Z"
            ],
            "Yesterday": [
                "2016-03-11T06:09:20.085Z",
                "2016-03-11T06:09:20.085Z"
            ],
            "Last 7 Days": [
                "2016-03-06T06:09:20.085Z",
                "2016-03-12T06:09:20.085Z"
            ],
            "Last 30 Days": [
                "2016-02-12T06:09:20.085Z",
                "2016-03-12T06:09:20.085Z"
            ],
            "This Month": [
                "2016-03-01T08:00:00.000Z",
                "2016-04-01T06:59:59.999Z"
            ],
            "Last Month": [
                "2016-02-01T08:00:00.000Z",
                "2016-03-01T07:59:59.999Z"
            ]
        },
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
        "startDate": "03/05/2016",
        "endDate": "03/11/2016",
        "minDate": "01/01/2016",
        "maxDate": "02/19/2016",
        "opens": "left",
        "drops": "up"
    }
};
