(function(){

	var app = angular.module("tiltViewer");

	var SummonerController = function($scope, $location, $routeParams, $log, $timeout, server){
		var onSearchComplete = function(data){
			$scope.data = data;
			$scope.name = data.name;
			$scope.won = data.won;
			$scope.lost = data.lost;
			$scope.winRate = data.won / (data.won + data.lost);
			$scope.tier = data.ranked.tier;
			$scope.division = data.ranked.division;
			$scope.lp = data.ranked.lp;
			$scope.rankedImg = data.ranked.img;
			$scope.champions = data.champions;

			for(key in $scope.champions){
				$scope.champions[key].name = key;
			};

			for(key in $scope.champions){
				$scope.champions[key].loseRate = 1 - $scope.champions[key].winRate;
			};

			for(key in $scope.champions){
				$scope.champions[key].score = ($scope.champions[key].won + (50 / 3)) / ($scope.champions[key].won + $scope.champions[key].lost + 50);
			};

		}

		var onImageComplete = function(data){
			$scope.images = data;
		}

		var onError = function(reason){
			$log.info("Error searching: " + reason);
		}

		$scope.ChampionDetail = function(champion){
			$log.info("Searching for details on " + champion + " for summoner: " + $scope.summonerID);
			$location.path("/champion/" + $scope.summonerID + "/" + champion);
		}

		$scope.search = function(newSummonerID){
			$log.info("Searching for " + newSummonerID);
			$location.path("/summoner/" + newSummonerID);
		}

		$scope.sortOrder = "winRate";
		$scope.summonerID = $routeParams.summonerID;
		$scope.sortOrder = 'score';
		server.getSummoner($scope.summonerID).then(onSearchComplete, onError);
		server.getImage().then(onImageComplete, onError);
	}

	app.controller("SummonerController", SummonerController);

	app.directive("wrVisual", function($timeout){
		var height = 180, width = 180;

		return {
			restrict: "E",
			scope: {
				winrate: '='
			},
			link: function(scope, element, attrs){
				var svg = d3.select(element[0]).append("svg").attr("width", width)
															 .attr("height", height);
				var tau = 2 * Math.PI;
				var arc = d3.svg.arc().innerRadius(58)
									  .outerRadius(85)
									  .startAngle(0);

				var g = svg.append("g").attr("transform", "translate(" + width / 2 + ","
												+ height / 2 + ")");

				var background = g.append("path").datum({endAngle: tau})
												 .style("fill","#cd817c")
												 .attr("d", arc);

				var foreground = g.append("path").datum({endAngle: 0})
												 .style("fill", "#64aedf")
												 .attr("d", arc);

				$timeout(function(){
					foreground.transition().duration(1250).attrTween("d", arcTween(attrs.ngWinrate * tau));
				}, 500);

				function arcTween(newAngle) {
				  return function(d) {
				    var interpolate = d3.interpolate(d.endAngle, newAngle);
				    return function(t) {
				      d.endAngle = interpolate(t);
				      return arc(d);
				    };
				  };
				};

			}
		}
	});
}());