'use strict';

angular.module('spaApp')
.factory('checkAccountsProvider', ['$rootScope', 'checksService', '$q',  function($rootScope, checksService, $q){

return {

	getCheckAccounts: function(){
		var deferr = $q.defer();
		if(!$rootScope.check_accounts){
			if(checksService.getCheckAccounts().success(function(data){
				$rootScope.check_accounts = data.check_accounts;
				deferr.resolve();
			}).error(function(data, status){
				data = {'response' : data, 'status': status};
				return deferr.reject('Error obteniendo cuentas de cheques');
			}));
		} else {
			deferr.resolve();
		}
		return deferr.promise;
	}
};

}]);
