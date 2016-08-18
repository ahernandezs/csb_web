angular.module('spaApp').factory('mapProvider', ['$rootScope', 'mapService', '$q', function ($rootScope, mapService, $q) {

	return {

	    getBranches: function(params){
			var deferred = $q.defer();
			mapService.getBranches(params).success(function(data) {
				$rootScope.branches = data.geolocations;
				deferred.resolve();
			}).error(function(data, status) {
				var result = {'response' : data, 'status': status};
		        return deferred.reject(result);
			});
			return deferred.promise;
	    },

	};

}]);
