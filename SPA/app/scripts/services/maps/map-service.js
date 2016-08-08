'use strict';

angular.module('spaApp').service('mapService', ['$http','$rootScope', function ($http, $rootScope) {

	this.getBranches = function(params){
		var query = Object.keys(params).length === 0 ? '' : params.hasOwnProperty('lng') && params.hasOwnProperty('lat') ? 'lng='+params.lng+'&lat='+params.lat : '';
		query += params.hasOwnProperty('rad') ? '&distance='+params.rad : '';
		//console.log('fetching: '+$rootScope.restAPIBaseUrl+'/bankInformation/geolocation?'+query);
		return $http({
			url: $rootScope.restAPIBaseUrl+'/bankInformation/geolocation?'+query,
			method: 'get'
		});
	};

}]);
