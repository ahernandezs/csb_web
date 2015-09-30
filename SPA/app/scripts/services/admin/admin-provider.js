'use strict';

angular.module('spaApp').factory('adminProvider', ['$rootScope', 'adminService', '$q', function ($rootScope, adminService, $q) {

	return {

	    updatePassword: function(current_pass, new_pass, otp){
			var deferred = $q.defer();
			adminService.updatePassword(current_pass, new_pass, otp).success(function(){
				deferred.resolve();
			}).error(function(data, status){
				var result = {'response' : data, 'status': status};
		        //console.log(data, status);
		        return deferred.reject(result);
			})
			return deferred.promise;
	    },

		updateCommunication: function(phone, e_mail, otp) {
			var deferred = $q.defer();
			adminService.updateCommunication(phone, e_mail, otp).success(function(){
				deferred.resolve();
			}).error(function(data, status){
				var result = {'response' : data, 'status': status};
		        //console.log(data, status);
		        return deferred.reject(result);
			});
			return deferred.promise;
		},

		updateDigitalBankServiceState: function(state, otp){
			var deferred = $q.defer();
			adminService.updateDigitalBankServiceState(state, otp).success(function(){
				deferred.resolve();
			}).error(function(data, status){
				var result = {'response' : data, 'status': status};
		        //console.log(data, status);
		        return deferred.reject(result);
			});
			return deferred.promise;
		},

		getLimits: function(){
			var deferred = $q.defer();
			adminService.getLimits().success(function(data, status, headers){
				$rootScope.limits = data.limits;
				deferred.resolve();
			}).error(function(data, status){
				var result = {'response' : data, 'status': status};
		        //console.log(data, status);
		        return deferred.reject(result);
			});
			return deferred.promise;
		},

		setLimits: function(amount, type, otp){
			var deferred = $q.defer();
			adminService.setLimits(amount, type, otp).success(function(){
				deferred.resolve();
			}).error(function(data, status){
				var result = {'response' : data, 'status': status};
		        //console.log(data, status);
		        return deferred.reject(result);
			});
			return deferred.promise;
		},

    getUserActivity: function() {
      var deferred = $q.defer();
      adminService.getUserActivity().success(function(data, status, headers) {
        deferred.resolve(data);
      }).error(function(data, status) {
        return deferred.reject('Error getting user activity');
      });
      return deferred.promise;
    }
	};

}]);
