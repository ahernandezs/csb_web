angular.module('spaApp')
.service('thirdAccountService', ['$http','$rootScope',function ($http, $rootScope) {

	this.validateThirdAccount = function(account){
		return $http({
			url: $rootScope.restAPIBaseUrl+'/externalaccounts/validate?account_number='+account,
			method: 'GET',
			headers: {'Content-Type': 'application/json','X-AUTH-TOKEN': $http.defaults.headers.common['X-AUTH-TOKEN'] }
		});
	}

	this.getThirdAcounts = function(){
		return $http({
			url: $rootScope.restAPIBaseUrl+'/externalaccounts',
			method: 'GET',
			headers: {'Content-Type': 'application/json','X-AUTH-TOKEN': $http.defaults.headers.common['X-AUTH-TOKEN'] }
		});
	},

	this.registerThirdAccount = function(alias, beneficiaryName, e_mail, phone, accountNumber, otp){
		return $http({
			url: $rootScope.restAPIBaseUrl+'/externalaccounts',
			method: 'POST',
			data: JSON.stringify({
				'alias':alias,
				'beneficiary':{
					'beneficiary_name': beneficiaryName,
					'e_mail': e_mail,
					'phone': phone
				},
				'_account_id':accountNumber,
				'otp':otp
			}),
			headers: {'Content-Type': 'application/json','X-AUTH-TOKEN': $http.defaults.headers.common['X-AUTH-TOKEN'] }
		});
	},

	this.unregisterThirdAccount = function(thirdAccountID,otp){
		return $http({
			url: $rootScope.restAPIBaseUrl+'/externalaccounts/'+thirdAccountID+'/destroy',
			method: 'POST',
			data: JSON.stringify({
				'otp':otp
			}),
			headers: {'Content-Type': 'application/json','X-AUTH-TOKEN': $http.defaults.headers.common['X-AUTH-TOKEN'] }
		});
	}
}]);
