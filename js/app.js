angular.module('app',['ui.router','ui.minicalendar'])
    .config(["$stateProvider", "$urlRouterProvider",function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/home");

        $stateProvider
            .state('home', {
                url: "/home"

            });
    }])
    .controller('appCtrl',['$scope','$timeout',function($scope,$timeout){

    }])
    .run([function(){

    }])
;