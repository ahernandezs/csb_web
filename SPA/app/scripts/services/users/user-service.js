'use strict';

angular.module('spaApp')
	.service('userService', ['$http', '$rootScope', 'detectIE', function ($http, $rootScope, detectIE) {
		this.preRegisterUser = function(clientId, folioId){
			return $http({
					url: $rootScope.restAPIBaseUrl+'/preregister',
					method: 'POST',
					data: JSON.stringify({
						'client_id': clientId,
						'folio_id': folioId,
						'client_application_id': 'PROSA-DIG'
					}),
					headers: {'Content-Type': 'application/json'}
			});
		}

		this.registerUser = function(registrationToken, params){
			return $http({
					url: $rootScope.restAPIBaseUrl+'/register',
					method: 'POST',
					data: JSON.stringify(params),
					headers: {'X-REGISTER-TOKEN': registrationToken}
			});
		}

		this.unlockUserPreRequest = function(clientId, folioId) {
			return $http({
				url: $rootScope.restAPIBaseUrl+'/unlockPasswordPrerequest',
				method: 'POST',
				data: JSON.stringify({
					'user_login': clientId,
					'folio_id': folioId,
					'client_application_id': 'PROSA-DIG'
				}),
				headers: {'Content-Type': 'application/json'}
			});
		};

		this.unlockUserRequest = function(clientId, folioId, password, imageId) {
			return $http({
				url: $rootScope.restAPIBaseUrl+'/unlockPasswordRequest',
				method: 'POST',
				data: JSON.stringify({
					'user_login': clientId,
					'folio_id': folioId,
					'client_application_id': 'PROSA-DIG',
					'password': password,
					'image_id': imageId
				}),
				headers: {'Content-Type': 'application/json'}
			});
		};

		this.logout = function() {
			if ( detectIE.isIE() )
				return $http( { cache: false, url: $rootScope.restAPIBaseUrl+'/logout', method: 'GET', params: { 'time': new Date().getTime() } } );
			else
				return $http( { cache: false, url: $rootScope.restAPIBaseUrl+'/logout', method: 'GET' } );
		};

}]);
