// Map view controller module
(function(getCrimeAttribute) {
    'use strict';
    angular.module('chicagoControllers')
        .controller('MapViewCtrl', ['$scope', '$http', MapViewCtrl])

    // Map view controller
    function MapViewCtrl($scope, $http) {
        console.log('--> in MapViewCtrl');

        $scope.addressPoints = [];

        function formatHeatData () {
            $scope.addressPoints = [];
            _.each($scope.$parent.data[$scope.$parent.day], function(obj) {
                if((obj.Latitude != null) && (obj.Longitude != null)) {
                    $scope.addressPoints.push([parseFloat(obj.Latitude), parseFloat(obj.Longitude), 15])
                }
            })
        };

        function createHeatLayer() {
            console.log($scope.$parent.day);
            formatHeatData();
            return L.heatLayer($scope.addressPoints, {radius: 25}).addTo($scope.map);
        }

        // Icon Layer Creation logic
        function createIconLayer() {
            console.log($scope.$parent.day);
            // Requires an input of an array of crimes for a given day/range from the slider
            var geojson = _.map($scope.$parent.data[$scope.$parent.day], function(crime) {
                var lat = parseFloat(crime.Latitude);
                var lon = parseFloat(crime.Longitude);
                var date = moment(crime.Date, 'YYYY-MM-DDTHH:mm:ss').format('MMMM Do YYYY');
                var time = moment(crime.Date, 'YYYY-MM-DDTHH:mm:ss').format('h:mm a');
                var block = crime.Block.substr(crime.Block.indexOf(' '), crime.Block.length);
                block = block.replace(/\w\S*/g, function(txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });
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
                            "description": crime.Description,
                            "info": date+": Reported at " + time,
                            "block": block,
                            "marker-color": attr.color,
                            "marker-size": "medium",
                            "marker-symbol": attr.symbol,
                            "details": crime
                        }
                    };
                } else {
                    return {};
                }
            });



            return L.mapbox
                .featureLayer()
                .on('layeradd', function(e) {
                    var marker = e.layer;
                    var props = marker.feature.properties;
                    var popupContent = '<div style="line-height: 0">' +
                            '<p style="font-size: 15px; margin:0">' +
                                '<b>' + props.title + '   </b>'+
                                '<i style="font-size: 11px">' + props.description + '</i>' +
                            '</p>' +
                            "<p class='marker-block-text'>" +
                                props.block + 
                            "</p>" +
                            '<p style="font-size: 13px">' + props.info + '</p>' +
                        '</div>';

                    // http://leafletjs.com/reference.html#popup
                    marker.bindPopup(popupContent,{
                        closeButton: false,
                        minWidth: 320
                    });
                })
                .setGeoJSON(geojson)
                .addTo($scope.map);
        };

        // Inject the layer creation logic to main controller
        $scope.$parent.createHeatLayer = createHeatLayer;
        $scope.$parent.createIconLayer = createIconLayer;
    }

})(util.getCrimeAttribute);
