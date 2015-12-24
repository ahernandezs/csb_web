'use strict';

angular.module('spaApp').service('checksService', ['$http', function($http){
	this.getCheckAccounts = function(){
		return $http.get('/fixtures/check_accounts.js');
	};
}]);
