(function(){

	var app = angular.module("tiltViewer");

	var ChampionController = function($scope, $location, $log, $routeParams, server){
		
		var onSummonerSearchComplete = function(data){
			$scope.name = data.name;
			$scope.won = data.won;
			$scope.lost = data.lost;
			$scope.winRate = data.won / (data.won + data.lost);
			$scope.tier = data.ranked.tier;
			$scope.division = data.ranked.division;
			$scope.lp = data.ranked.lp;
			$scope.rankedImg = data.ranked.img;
		}

		var onSearchComplete = function(data){
			console.log(data);
			$scope.data = data;
			$scope.champWon = data.won;
			$scope.champLost = data.lost;
			$scope.kills = data.kills;
			$scope.deaths = data.deaths;
			$scope.assists = data.assists;
			$scope.champWinRate = data.winRate;
			$scope.allies = data.ChampStats.allies;
			$scope.enemies = data.ChampStats.enemies;

			for(key in $scope.allies){
				$scope.allies[key].name = key;
			};

			for(key in $scope.enemies){
				$scope.enemies[key].name = key;
			};

			for(key in $scope.allies){
				$scope.allies[key].loseRate = 1 - $scope.allies[key].winRate;
			};

			for(key in $scope.enemies){
				$scope.enemies[key].loseRate = 1 - $scope.enemies[key].winRate;
			};

			for(key in $scope.allies){
				$scope.allies[key].score = ($scope.allies[key].won + (50 / 3)) / ($scope.allies[key].won + $scope.allies[key].lost + 50);
			};

			for(key in $scope.enemies){
				$scope.enemies[key].score = 1 / (($scope.enemies[key].won + (50 / 3)) / ($scope.enemies[key].won + $scope.enemies[key].lost + 50));
			};

		}

		var onImageComplete = function(data){
			$scope.images = data;
		}

		var onError = function(reason){
			$log.info("Error searching: " + reason);
		}

		$scope.search = function(newSummonerID){
			$log.info("Searching for " + newSummonerID);
			$location.path("/summoner/" + newSummonerID);
		}

		$scope.image = "https://www.google.co.in/images/srpr/logo11w.png";

		$scope.summonerID = $routeParams.summonerID;
		$scope.champion = $routeParams.champion;
		$scope.showEnemies = false;
		$scope.sortOrder = 'score';

		server.getSummoner($scope.summonerID).then(onSummonerSearchComplete, onError);
		server.getChampionOfSummoner($scope.summonerID, $scope.champion).then(onSearchComplete, onError);
		server.getImage().then(onImageComplete, onError);
	}

	app.controller("ChampionController", ChampionController);

	app.filter('orderObjectBy', function() {
	  return function(items, field, reverse) {
	    var filtered = [];
	    angular.forEach(items, function(item) {
	      filtered.push(item);
	    });
	    filtered.sort(function (a, b) {
	      return (a[field] > b[field] ? 1 : -1);
	    });
	    if(reverse) filtered.reverse();
	    return filtered;
	  };
	});

}());