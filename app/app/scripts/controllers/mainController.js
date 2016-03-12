/**
 * Created by coreyching on 3/6/16.
 */

(function() {
    'use strict';
    angular.module('chicagoControllers', []);

    angular.module('chicagoControllers').controller('MainViewCtrl', ['$scope', '$http', function ($scope, $http) {

        $http.get('/data/2016.json').success(function(data) {

            $scope.data = data;
            $scope.addressPoints = [];

            var formatHeatData = function() {
                var temp = [];
                var key = '40';
                _.each($scope.data[key], function(obj) {
                    if((obj.Latitude != null) && (obj.Longitude != null)) {
                        $scope.addressPoints.push([parseFloat(obj.Latitude), parseFloat(obj.Longitude), 10])
                    }
                })
            };

            formatHeatData();

            $scope.createHeatLayer = function() {
                formatHeatData();
                L.heatLayer($scope.addressPoints, {radius: 25}).addTo($scope.map);
            };

            $scope.createIconViewLayer = function () {

                var day = '40';
                // Requires an input of an array of crimes for a given day/range from the slider
                var geojson = _.map($scope.data[day], function(crime) {
                    var lat = parseFloat(crime.Latitude);
                    var lon = parseFloat(crime.Longitude);
                    if(lat && lon) {
                        var symbol = "cross";
                        var color = '#777';
                        console.log(color);
                        if((crime["Primary Type"] === "BATTERY") ||
                            (crime["Primary Type"] === "ASSAULT") ||
                            (crime["Primary Type"] === "KIDNAPPING") ||
                            (crime["Primary Type"] === "OFFENSE INVOLVING CHILDREN")) {
                            symbol = "pitch";
                            color = '#dd9787';
                        } else if((crime["Primary Type"] === "THEFT") ||
                            (crime["Primary Type"] === "ROBBERY") ||
                            (crime["Primary Type"] === "CRIMINAL DAMAGE") ||
                            (crime["Primary Type"] === "CRIMINAL TRESPASS") ||
                            (crime["Primary Type"] === "BURGLARY")) {
                            symbol = "theatre";
                            color = '#822165';
                        } else if((crime["Primary Type"] === "CRIM SEXUAL ASSAULT") ||
                            (crime["Primary Type"] === "PROSTITUTION") ||
                            (crime["Primary Type"] === "SEX OFFENSE")) {
                            symbol = "school";
                            color = '#fbcfb7';
                        } else if((crime["Primary Type"] === "PUBLIC PEACE VIOLATION") ||
                            (crime["Primary Type"] === "INTERFERENCE WITH PUBLIC OFFICER") ||
                            (crime["Primary Type"] === "WEAPONS VIOLATION")) {
                            symbol = "police";
                            color = '#337ca0';
                        } else if((crime["Primary Type"] === "GAMBLING") ||
                            (crime["Primary Type"] === "NARCOTICS")) {
                            symbol = "pharmacy";
                            color = '#fffc31';
                        } else if((crime["Primary Type"] === "DECEPTIVE PRACTICE") ||
                            (crime["Primary Type"] === "OTHER OFFENSE")) {
                            symbol = "roadblock";
                            color = '#3ec300';
                        } else if((crime["Primary Type"] === "ARSON")) {
                            symbol = "fire-station";
                            color = '#da2c38';
                        }
                        // color = '#'+ ('000000' + (Math.random()*0xFFFFFF<<0).toString(16)).slice(-6);

                        return {
                            "type": "Feature",
                            "geometry": {
                                "type": "Point",
                                "coordinates": [lon, lat]
                            },
                            "properties": {
                                "title": crime["Primary Type"],
                                "description": crime.Block,
                                "marker-color": color,
                                "marker-size": "medium",
                                "marker-symbol": symbol
                            }
                        };
                    } else {
                        return {};
                    }
                });

                // console.log(JSON.stringify(geojson,null,2));
                // var iconViewLayer = L.mapbox.featureLayer().setGeoJSON(geojson).addTo($scope.map);
                var iconViewLayer = L.mapbox
                    .featureLayer()
                    .setGeoJSON(geojson)
                    .addTo($scope.map);
            };

            var createMap = function() {
                // Provide your access token
                L.mapbox.accessToken = 'pk.eyJ1IjoiaW1jaGluZ3kiLCJhIjoiY2lsaGF6MTlzMmNobnZubWM1MWUydnpxOCJ9.2yX5ZOI_yyggtJMt86TAQw';

                // Create map bounds
                var southWest = L.latLng(41.44703, -87.32461);
                var northEast = L.latLng(42.22253, -88.11764);
                var bounds = L.latLngBounds(southWest, northEast);

                // Create a map in the div #map
                $scope.map = L.mapbox.map('map', 'mapbox.streets', {
                    fadeAnimation: true,
                    maxBounds: bounds,
                    maxZoom: 19,
                    minZoom: 10
                });

                $scope.createHeatLayer();
                $scope.createIconViewLayer();

            };

            createMap();

            var createSideView  = function() {

            }
        });

    }]);
})();