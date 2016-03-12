/**
 * Created by coreyching on 3/9/16.
 */
(function() {
    'use strict';
    angular.module('Chicago', [
        'ngRoute',
        'chicagoControllers'
    ]);

    angular.module('Chicago').config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
            when('/', {
                templateUrl: 'app/views/main-view.html',
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);
})();
