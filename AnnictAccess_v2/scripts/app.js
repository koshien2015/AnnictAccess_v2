//var app = angular.module('myApp', []);
'use strict';
angular.module('myApp', ['ui.router','angular-loading-bar', 'ngAnimate','highcharts-ng'])
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
	$scope.chartConfig = {
		chart: {
			type: 'column'
		},
		title:{
			text:'アニメ未消化状況'
		},
		xAxis: [{
            categories: []
        }],
        yAxis: {
			title: {
				text: null
			},
				labels: {
					style: {
						color: '#000000'
					}
				},
				floor: 0,
				allowDecimals:true,
				startOnTick: false
		},
		series: [{
			name: '未消化数',
			data: []
		}]
	}
	$http({
		method: 'GET',
		headers: {
			'Authorization' : 'Bearer '+$stateParams.code
		},
	    url: 'https://api.annict.com/v1/me/programs?sort_started_at=asc&per_page=40&filter_unwatched=true&accessToken='+$stateParams.code
	})
	.success(function(data, status, headers, config,chart) {
		$scope.items = data;
		for(var i=0;i<$scope.items.programs.length;i++){
			var dt = new Date($scope.items.programs[i].started_at);
			var now = new Date();
			$scope.items.programs[i]['dayDiff']=Math.floor((now-dt)/(1000 * 60 * 60 * 24));
			//chart.series[0].addPoint($scope.items.programs[i].started_at,true,shift);
			$scope.chartConfig.xAxis[0].categories.push($scope.items.programs[i].started_at);
		}
	})
})
.controller('indexCtrl',['$scope',function($scope) {

}])

function dateFormatString(date,fmt){
	var format = {
			'YYYY': function() { return padding(date.getFullYear(), 4, pad); },
	        'MM': function() { return padding(date.getMonth()+1, 2, pad); },
	        'DD': function() { return padding(date.getDate(), 2, pad); },
	    };
}