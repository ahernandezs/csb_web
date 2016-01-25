'use strict';

angular.module('spaApp')
	.service('userService', ['$http','$rootScope',function ($http, $rootScope) {
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
			// detect IE
			var IEversion = detectIE();

			if (IEversion !== false)
				return $http( { cache: false, url: $rootScope.restAPIBaseUrl+'/logout', method: 'GET', params: { 'time': new Date().getTime() } } );
			else
				return $http( { cache: false, url: $rootScope.restAPIBaseUrl+'/logout', method: 'GET' } );

			/**
			 * detect IE
			 * returns version of IE or false, if browser is not Internet Explorer
			 */
			function detectIE() {
				var ua = window.navigator.userAgent;

				var msie = ua.indexOf('MSIE ');
				// IE 10 or older => return version number
				if (msie > 0)
					return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);

				var trident = ua.indexOf('Trident/');
				// IE 11 => return version number
				if (trident > 0) {
					var rv = ua.indexOf('rv:');
					return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
				}

				var edge = ua.indexOf('Edge/');
				// Edge (IE 12+) => return version number
				if (edge > 0)
					return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);

				// other browser
				return false;
			};
		};

}]);
