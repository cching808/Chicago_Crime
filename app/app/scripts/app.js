/**
 * Created by coreyching on 3/9/16.
 */
angular.module('Chicago', [
    'ngRoute',
    'chicagoControllers'
]);

angular.module('Chicago').config(['$routeProvider',
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