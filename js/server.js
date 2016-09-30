(function(){

	var server = function($http, $log){

		var getSummoner = function(summonerID){
			return $http.get("/usr/" + summonerID)
						.then(function(response){
							return response.data;
						},function(data){
							$log.info("Error fetching data for summoner: " + summonerID + ". Make sure the file/summoner exists.");
						});
		};

		var getChampionOfSummoner = function(summonerID, champion){
			return $http.get("/usr/" + summonerID)
						.then(function(response){
							console.log("test");
							console.log(response.data.champions);
							console.log(champion);
							return response.data.champions[champion];
						}, function(data){
							$log.info("Error fetching data on " + champion + " for summoner: " + summonerID);
						});
		};

		var getImage = function(){
			return $http.get("/championPics.json")
						.then(function(response){
							return response.data;
						}, function(data){
							$log.info("Error fetching image data");
						});
		};

		return {
			getSummoner: getSummoner,
			getChampionOfSummoner: getChampionOfSummoner,
			getImage: getImage
		};
	};

	var app = angular.module("tiltViewer");
	app.factory("server", server);

}());