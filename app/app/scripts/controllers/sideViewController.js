
(function() {
    'use strict';
    angular.module('chicagoControllers')
        .controller('SideViewCtrl', ['$scope', '$http', SideViewCtrl]);

    function createSideView () {
        console.log(':^)');
    }

    function SideViewCtrl($scope, $http) {
        console.log('--> in SideViewCtrl');
        $scope.$parent.createSideView = createSideView;
    }

})();
