/**
 * Created by coreyching on 3/6/16.
 */
(function(app) {
    document.addEventListener('DOMContentLoaded', function() {
        ng.platform.browser.bootstrap(app.AppComponent);
    });

    var createMap = function() {
        // Provide your access token
        L.mapbox.accessToken = 'pk.eyJ1IjoiaW1jaGluZ3kiLCJhIjoiY2lsaGF6MTlzMmNobnZubWM1MWUydnpxOCJ9.2yX5ZOI_yyggtJMt86TAQw';
        // Create a map in the div #map
        L.mapbox.map('map', 'mapbox.streets').setView([40, -74.50], 9);
        console.log("map initalized");
    };
    createMap();
})(window.app || (window.app = {}));