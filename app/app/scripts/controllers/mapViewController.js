// Map view controller module
(function(getCrimeAttribute) {
    'use strict';
    angular.module('chicagoControllers')
        .controller('MapViewCtrl', ['$scope', '$http', MapViewCtrl])

    // Icon Layer Creation logic 
    function createIconLayer(map, data) {
        var day = '40';
        // Requires an input of an array of crimes for a given day/range from the slider
        var geojson = _.map(data[day], function(crime) {
            var lat = parseFloat(crime.Latitude);
            var lon = parseFloat(crime.Longitude);
            if(lat && lon) {
                var color = '#777';
                var symbol = "cross";
                var attr = getCrimeAttribute(crime["Primary Type"]);
                return {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [lon, lat]
                    },
                    "properties": {
                        "title": crime["Primary Type"],
                        "description": crime.Block,
                        "marker-color": attr.color,
                        "marker-size": "medium",
                        "marker-symbol": attr.symbol
                    }
                };
            } else {
                return {};
            }
        });

        return L.mapbox
            .featureLayer()
            .setGeoJSON(geojson)
            .addTo(map);
    };

    // Map view controller
    function MapViewCtrl($scope, $http) {
        console.log('--> in MapViewCtrl');

        $scope.addressPoints = [];

        function formatHeatData (data) {
            var temp = [];
            var key = '40';
            _.each(data[key], function(obj) {
                if((obj.Latitude != null) && (obj.Longitude != null)) {
                    $scope.addressPoints.push([parseFloat(obj.Latitude), parseFloat(obj.Longitude), 10])
                }
            })
        };

        function createHeatLayer(data) {
            formatHeatData(data);
            L.heatLayer($scope.addressPoints, {radius: 25}).addTo($scope.map);
        }

        // Inject the layer creation logic to main controller
        $scope.$parent.createHeatLayer = createHeatLayer;
        $scope.$parent.createIconLayer = createIconLayer;
    }

})(util.getCrimeAttribute);
