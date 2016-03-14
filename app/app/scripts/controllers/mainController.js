/**
 * Created by coreyching on 3/6/16.
 */

// Instantiate the application module
angular.module('chicagoControllers', []);

// Main Application Controller Module
(function() {
    'use strict';
    angular.module('chicagoControllers')
        .controller('MainViewCtrl', ['$scope', '$http', MainViewCtrl]);

    // Create a mapbox instance
    function createMap() {
        // Provide your access token
        L.mapbox.accessToken = 'pk.eyJ1IjoiaW1jaGluZ3kiLCJhIjoiY2lsaGF6MTlzMmNobnZubWM1MWUydnpxOCJ9.2yX5ZOI_yyggtJMt86TAQw';

        // Create map bounds
        var southWest = L.latLng(41.44703, -87.32461);
        var northEast = L.latLng(42.22253, -88.11764);
        var bounds = L.latLngBounds(southWest, northEast);

        // Return the instance of a map in the div #map
        return L.mapbox.map('map', 'mapbox.streets', {
            fadeAnimation: true,
            maxBounds: bounds,
            maxZoom: 19,
            minZoom: 10
        });
    };
                
    // Main view controller
    function MainViewCtrl($scope, $http) {

        // Request the data, then create the appropriate layers
        $http.get('/data/2016.json').success(function(data) {
            $scope.data = data;
            $scope.day = '1';
            $scope.iconLayer = "";
            $scope.map = createMap();
            $scope.init();
        });

        $scope.init = function () {
            $scope.heatLayer = $scope.createHeatLayer();
            $scope.initAreaChart();
        };

        $scope.$watch('iconLayer', function(newValue, oldValue) {
            console.log("$scope.iconlayer: " + $scope.iconLayer);
            if($scope.iconLayer) {
                console.log("inside icon layer watcher");
                $scope.iconLayer.on('click', function(e) {
                    console.dir(e);
                    var details = e.layer.feature.properties.details;
                    $scope.updateAreaChart(details["Primary Type"]);
                    $scope.loadStreetMap(e.latlng.lat, e.latlng.lng);
                });
            }
        });

        //$scope.$watch('day', function(newValue, oldValue) {
        //
        //});

        $scope.clearLayers = function() {
            if($scope.map){
                $scope.map.removeLayer($scope.iconLayer);
                $scope.map.removeLayer($scope.heatLayer);

            }
        }
    }

})();
