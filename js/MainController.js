(function(){

	var app = angular.module("tiltViewer");

	var MainController = function($scope, $location, $log){

		$scope.search = function(summonerID){
			$log.info("Searching for " + summonerID);
			$location.path("/summoner/" + summonerID);
		}
	}

	app.controller("MainController", MainController);

}());