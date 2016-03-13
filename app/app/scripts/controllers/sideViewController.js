
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


})(util.datepickerOptions);

