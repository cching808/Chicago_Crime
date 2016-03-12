/**
 * Created by coreyching on 3/6/16.
 */

// Instantiate the application module
var chicagoApp = angular.module('chicagoControllers', []);

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
        $scope.map = createMap();
        $http.get('/data/2016.json').success(function(data) {
            $scope.createHeatLayer(data);
            var iconLayer = $scope.createIconLayer($scope.map, data);
            iconLayer.on('click', function(e) {
                console.log('Clicked a marker :)');
                console.dir(e);
            });
        });
    }

})();
