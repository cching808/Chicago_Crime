/**
 * Created by coreyching on 3/9/16.
 */
var chicagoApp = angular.module('Chicago', [
    'ngRoute',
    'chicagoControllers'
]);

chicagoApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/', {
            templateUrl: 'app/views/main-view.html',
            controller: 'MainViewCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
}]);