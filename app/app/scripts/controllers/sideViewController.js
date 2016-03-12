
(function(options) {
    'use strict';
    angular.module('chicagoControllers')
        .controller('SideViewCtrl', ['$scope', '$http', SideViewCtrl]);

    function createSideView () {
        console.log(':^)');
    }

    function SideViewCtrl($scope, $http) {
        console.log('--> in SideViewCtrl');
        $scope.$parent.createSideView = createSideView;

        // Initialize the calendar
        $('input[name="daterange"]').daterangepicker(options, function(start, end, label) {
            console.log("New date range selected: " + start.format("YYYY-MM-DD") + " to " + end.format("YYYY-MM-DD") + " (predefined range: " + label + ")");
        });

        $scope.changeView = function(type) {
            if(type == 'heatmap') {
                $scope.$parent.map.removeLayer($scope.$parent.iconLayer);
                $scope.$parent.map.removeLayer($scope.$parent.heatLayer);
                $scope.$parent.heatLayer = $scope.$parent.createHeatLayer($scope.$parent.data);
            }
            else {
                $scope.$parent.map.removeLayer($scope.$parent.iconLayer);
                $scope.$parent.map.removeLayer($scope.$parent.heatLayer);
                $scope.$parent.iconLayer = $scope.$parent.createIconLayer($scope.$parent.data);
            }
        }
    }

})(datepickerOptions);

var datepickerOptions = {
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
};
