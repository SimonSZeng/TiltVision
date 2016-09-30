(function(){
	
	var app = angular.module("tiltViewer", ['ngRoute']);

	app.config(function($routeProvider){
		$routeProvider
			.when("/index.html", {
				templateUrl: "main.html",
				controller: "MainController"
			})
			.when("/summoner/:summonerID", {
				templateUrl: "summoner.html",
				controller: "SummonerController"
			})
			.when("/champion/:summonerID/:champion", {
				templateUrl: "champion.html",
				controller: "ChampionController"
			})
			.otherwise({redirectTo: "index.html"});
	});

}());