'use strict';

angular.module('spaApp').controller('updateCommunicationController', ['$scope', 'adminProvider', function ($scope, adminProvider) {

	$scope.stage_updatecommunication = 1;
	$scope.updatedata = {};
	$scope.paso = 0;

	$scope.getCommunication = function(){
		adminProvider.getCommunication().then(
			function(data){
				$scope.updatedata = data; //somehow
			},
			function(errorObject){
				console.err(errorObject);
			}
		);
	}
	//$scope.getCommunication();

	$scope.resetUpdateData = function () {
		$scope.stage_updatecommunication = 1;
	};


	$scope.sendCommunication = function () {
		var prefered = "";
		if($scope.updatedata.mailSelect && $scope.updatedata.phoneSelect){
			prefered = "AMBOS";
		}else if($scope.updatedata.mailSelect){
			prefered = "MAIL";
		}else if($scope.updatedata.phoneSelect){
			prefered = "CELULAR";
		}

		adminProvider.updateCommunication($scope.updatedata.phone, $scope.updatedata.e_mail, $scope.updatedata.otp, prefered).then(
			function (data) {
				$scope.stage_updatecommunication = 3;
			},
			function(errorObject) {
				var status = errorObject.status;
		        if(status === 403){
					$scope.manageOtpErrorMessage(errorObject.response);
			    } else {
			    	var msg = codeStatusErrors.errorMessage(status);
					if (status === 500){
		            	$scope.setServiceError(msg + errorObject.response.message);
		        	} else {
		        		$scope.setServiceError(msg);
		        	}
			    }
			}
		);
	};

}]);
