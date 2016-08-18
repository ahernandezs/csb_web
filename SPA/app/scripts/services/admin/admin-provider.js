angular.module('spaApp').factory('adminProvider', ['$rootScope', 'adminService', '$q', function ($rootScope, adminService, $q) {

	return {

	    updatePassword: function(current_pass, new_pass, otp){
			var deferred = $q.defer();
			adminService.updatePassword(current_pass, new_pass, otp).success(function(data){
				deferred.resolve(data);
			}).error(function(data, status){
				var result = {'response' : data, 'status': status};
		        return deferred.reject(result);
			})
			return deferred.promise;
	    },

		updateCommunication: function(phone, e_mail, otp, prefered) {
			var deferred = $q.defer();
			adminService.updateCommunication(phone, e_mail, otp, prefered).success(function(data){
				deferred.resolve(data);
			}).error(function(data, status){
				var result = {'response' : data, 'status': status};
		        return deferred.reject(result);
			});
			return deferred.promise;
		},

		updateDigitalBankServiceState: function(state, otp){
			var deferred = $q.defer();
			adminService.updateDigitalBankServiceState(state, otp).success(function(data){
				deferred.resolve(data);
			}).error(function(data, status){
				var result = {'response' : data, 'status': status};
		        return deferred.reject(result);
			});
			return deferred.promise;
		},

		getLimits: function(){
			var deferred = $q.defer();
			adminService.getLimits().success(function(data){
				$rootScope.limits = data.limits;
				deferred.resolve(data);
			}).error(function(data, status){
				var result = {'response' : data, 'status': status};
		        return deferred.reject(result);
			});
			return deferred.promise;
		},

		setLimits: function(amount, type, otp){
			var deferred = $q.defer();
			adminService.setLimits(amount, type, otp).success(function(data){
				deferred.resolve(data);
			}).error(function(data, status){
				var result = {'response' : data, 'status': status};
		        return deferred.reject(result);
			});
			return deferred.promise;
		},

		getUserActivity: function(page,size) {
			var deferred = $q.defer();
			adminService.getUserActivity(page,size).success(function(data) {
				deferred.resolve(data);
			}).error(function() {
				return deferred.reject('Error getting user activity');
			});
			return deferred.promise;
		},

		getCommunication: function(){
			var deferred = $q.defer();
			adminService.getCommunication().success(function(data){
				deferred.resolve(data);
			}).error(function(data, status){
				var result = {'response' : data, 'status': status};
		        return deferred.reject(result);
			});
			return deferred.promise;
		},

	};

}]);
