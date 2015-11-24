'use strict';

angular.module('spaApp').controller('updateServicesController', ['$scope', 'adminProvider', function ($scope, adminProvider) {

	$scope.actionUpdateState = 1;
	$scope.updateDigitalBankServiceState = [];
	$scope.result = {};
	$scope.result.success = false;
	$scope.result.error = false;

	$scope.updateService = function(action, state){
		$scope.actionUpdateState = action;
		$scope.updateDigitalBankServiceState.state = state;
		if(action == 1){
			$scope.updateDigitalBankServiceState.otp = '';
		}
	}

	$scope.updateDigitalBankServiceState = function(){
		adminProvider.updateDigitalBankServiceState($scope.updateDigitalBankServiceState.state, $scope.updateDigitalBankServiceState.otp).then(
			function(data){
				$scope.exception = false;
				$scope.actionUpdateState = 3;
				$scope.updateDigitalBankServiceState.otp = '';
				$scope.result.success = true;
			},
			function(errorObject){
				$scope.exception = true;
				$scope.actionUpdateState = 3;
				$scope.updateDigitalBankServiceState.otp = '';
				var status = errorObject.status;
				$scope.result.error = true;
			}
		);
	}

}]);
