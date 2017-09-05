//var app = angular.module('myApp', []);
'use strict';
angular.module('myApp', ['ui.router','angular-loading-bar', 'ngAnimate'])
.config(["$locationProvider", function ($locationProvider) {
}])
// Routes
.config(function($stateProvider){
  $stateProvider.state('/',{
    url: '/',
    controller: 'indexCtrl',
    templateUrl: 'index.html'
  })
})
.config(function($stateProvider){
  $stateProvider.state('auth',{
    url: '/code=:code',
    templateUrl: 'views/annict.html',
    controller: 'authCtrl',
    params:{
    	param: null
    }
  })
})
// Default
.config(function($urlRouterProvider){
  $urlRouterProvider.when('', '/')
})
.controller('authCtrl', function($scope, $stateParams,$http,$rootScope,$location) {
	var host = $location.host();
	var port = $location.port();

	$http({
		method: 'GET',
		headers: {
			'Authorization' : 'Bearer '+$stateParams.code
		},
	    url: 'https://api.annict.com/v1/me/programs?sort_started_at=asc&per_page=40&filter_unwatched=true&accessToken='+$stateParams.code
	})

})
.controller('indexCtrl',['$scope',function($scope) {

}])