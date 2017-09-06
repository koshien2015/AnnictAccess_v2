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
	$scope.chartConfig = {
		options: {
			chart: {
				type: 'column'
			}
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
		}],
		plotOptions: {
			line: {
				events: {
					legendItemClick: function () {
						return false;
					}
				}
			}
		},
		tooltip: {
			shared: true,
			pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y}</b><br/>',
			backgroundColor: '#FFFFFF',
			style: {
				color: '#000000'
			}
		},
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
		var dateArray={};
		for(var i=0;i<$scope.items.programs.length;i++){
			var dt = new Date($scope.items.programs[i].started_at);
			var now = new Date();
			$scope.items.programs[i]['dayDiff']=Math.floor((now-dt)/(1000 * 60 * 60 * 24));
			var date=moment($scope.items.programs[i].started_at).format('YYYY/MM/DD');
			if(dateArray[date]==undefined){
				dateArray[date]=1;
			}else if(dateArray[date]>0){
				dateArray[date]=dateArray[date]+1;
			}
		}
		for (var key in dateArray) {
			$scope.chartConfig.series[0].data.push(dateArray[key]);
			$scope.chartConfig.xAxis[0].categories.push(key);
		}
	})
	.error(function(data, status, headers, config,chart){
		if(status==401){
			alert('認証をやり直してください');
		}else if(status==404){
			alert('通信エラー');
		}
	})
})
.controller('indexCtrl',['$scope',function($scope) {

}])