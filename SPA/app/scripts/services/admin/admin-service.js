angular.module('spaApp').service('adminService', ['$http','$rootScope', function ($http, $rootScope) {

	this.getThirdAccounts = function () {
		return $http.get($rootScope.restAPIBaseUrl+'/externalaccounts');
	};

	this.deleteAccount = function(id, otp){
		return $http({
			url: $rootScope.restAPIBaseUrl+'/externalaccounts/'+id,
			method: 'POST',
			data: JSON.stringify({
				'otp':otp
			}),
			headers: {'Content-Type': 'application/json','X-AUTH-TOKEN': $http.defaults.headers.common['X-AUTH-TOKEN'] }
		});
	};

	this.updatePassword = function(current_pass, new_pass, otp){
		return $http({
			url: $rootScope.restAPIBaseUrl+'/userInformation/password',
			method: 'POST',
			data: JSON.stringify({
				"current": current_pass,
				"password": new_pass,
				"otp": otp
			}),
			headers: {'Content-Type': 'application/json','X-AUTH-TOKEN': $http.defaults.headers.common['X-AUTH-TOKEN'] }
		});
	};

	this.updateCommunication = function(phone, e_mail, otp, prefered) {
		return $http({
			url: $rootScope.restAPIBaseUrl+'/userInformation/communication',
			method: 'POST',
			data: JSON.stringify({
				'phone': phone,
				'e_mail': e_mail,
				'otp': otp,
				'prefered_communication_type': prefered
			})
		});
	};

	this.updateDigitalBankServiceState = function(state, otp){
		return $http({
			url: $rootScope.restAPIBaseUrl+'/userInformation/digitalBankServices',
			method: 'POST',
			data: JSON.stringify({
				'state': state,
				'otp': otp
			})
		});
	};

	this.getLimits = function(){
		return $http.get($rootScope.restAPIBaseUrl+'/accounts/limits');
	};

	this.setLimits = function(amount, type, otp){
		return $http({
			url: $rootScope.restAPIBaseUrl+'/accounts/limits',
			method: 'POST',
			data: JSON.stringify({
				"limit":{
					"amount": amount,
					"type": type

				},"otp": otp
			})
		});
	};

  this.getUserActivity = function(page,size) {
    return $http.get($rootScope.restAPIBaseUrl + '/useractivity?page='+page+'&size='+size);
  };

  this.getCommunication = function(){
    return $http.get($rootScope.restAPIBaseUrl + '/userInformation/communication');
  }

}]);
