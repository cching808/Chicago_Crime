/**
 * Created by coreyching on 3/6/16.
 */
var chicagoControllers = angular.module('chicagoControllers', []);

chicagoControllers.controller('MainViewCtrl', ['$scope', '$http', function ($scope, $http) {

    //$http.get('/data/2016.json').success(function(data) {
    //    $scope.phones = data;
    //});

    var createMap = function() {
        // Provide your access token
        L.mapbox.accessToken = 'pk.eyJ1IjoiaW1jaGluZ3kiLCJhIjoiY2lsaGF6MTlzMmNobnZubWM1MWUydnpxOCJ9.2yX5ZOI_yyggtJMt86TAQw';

        // Create map bounds
        var southWest = L.latLng(41.44703, -87.32461);
        var northEast = L.latLng(42.22253, -88.11764);
        var bounds = L.latLngBounds(southWest, northEast);

        // Create a map in the div #map
        $scope.map = L.mapbox.map('map', 'mapbox.streets', {
            maxBounds: bounds,
            maxZoom: 19,
            minZoom: 10
        });
    };

    createMap();
    console.log("inside main controller");

    var createHeatLayer = function() {
        var heat = L.heatLayer(addressPoints, {maxZoom: 18}).addTo(map);
        var draw = true;

        // add points on mouse move (except when interacting with the map)
        $scope.map.on({
            movestart: function () { draw = false; },
            moveend:   function () { draw = true; },
            mousemove: function (e) {
                if (draw) {
                    heat.addLatLng(e.latlng);
                }
            }
        })
    };

    //createHeatLayer();

    var createIconViewLayer = function () {

    };

    var createSideView  = function() {

    }

}]);

