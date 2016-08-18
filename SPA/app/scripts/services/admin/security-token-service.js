angular.module('spaApp').service('securityTokenService', ['$http', '$rootScope', function ($http, $rootScope) {

	this.getUserSecurityTokenState = function () {
		return $http.get($rootScope.restAPIBaseUrl+'/tokens/information');
	};

	this.activateSecurityToken = function(tokenId, otp1, otp2){
		return $http({
			url: $rootScope.restAPIBaseUrl+'/tokens/activate',
			method: 'POST',
			data: JSON.stringify({
				'tokenId':tokenId,
				'otp':otp1,
				'otp2':otp2
			}),
			headers: {'Content-Type': 'application/json','X-AUTH-TOKEN': $http.defaults.headers.common['X-AUTH-TOKEN'] }
		});
	};

	this.synchronizeSecurityToken = function(otp1, otp2){
		return $http({
			url: $rootScope.restAPIBaseUrl+'/tokens/synchronize',
			method: 'POST',
			data: JSON.stringify({
				'otp':otp1,
				'otp2':otp2
			}),
			headers: {'Content-Type': 'application/json','X-AUTH-TOKEN': $http.defaults.headers.common['X-AUTH-TOKEN'] }
		});
	};

	this.disableSecurityToken = function(reasonCode){
		return $http({
			url: $rootScope.restAPIBaseUrl+'/tokens/disable',
			method: 'POST',
			data: JSON.stringify({
				'code':reasonCode
			}),
			headers: {'Content-Type': 'application/json','X-AUTH-TOKEN': $http.defaults.headers.common['X-AUTH-TOKEN'] }
		});
	};

	this.enableSecurityToken = function(){
		return $http({
			url: $rootScope.restAPIBaseUrl+'/tokens/enable',
			method: 'POST',
			data: JSON.stringify({
				'code': 0
			}),
			headers: {'Content-Type': 'application/json','X-AUTH-TOKEN': $http.defaults.headers.common['X-AUTH-TOKEN'] }
		});
	};

}]);
