'use strict';

angular.module('spaApp').controller('updateCommunicationController', ['$scope', 'adminProvider', 'codeStatusErrors', 'detectIE',  function ($scope, adminProvider, codeStatusErrors, detectIE) {

	$scope.updatedata = {};
	$scope.captureToken = false;

	var focusInputsIE9 = function() {
		$( "#email" ).focus();
		$( "#phone" ).focus();
	};

	$scope.getCommunication = function(){
		$scope.stage_updatecommunication = 1;
		adminProvider.getCommunication().then(
			function(data){
				$scope.updatedata = data;
				$scope.updatedata.mailSelect = $scope.updatedata.prefered_communication_type === 'AMBOS' || $scope.updatedata.prefered_communication_type === 'MAIL' ? true : false;
				$scope.updatedata.phoneSelect = $scope.updatedata.prefered_communication_type === 'AMBOS' || $scope.updatedata.prefered_communication_type === 'CELULAR' ? true : false;
				var isIE = detectIE.detect;
				if ( isIE.version === '10>' )
					focusInputsIE9();
			},
			function(errorObject){
				$scope.setServiceError(errorObject.response);
			}
		);
	}
	$scope.getCommunication();

	$scope.sendCommunication = function () {
		var prefered = $scope.updatedata.mailSelect && $scope.updatedata.phoneSelect ? 'AMBOS' : $scope.updatedata.mailSelect ? 'MAIL' : 'CELULAR';
		adminProvider.updateCommunication($scope.updatedata.phone, $scope.updatedata.e_mail, $scope.updatedata.otp, prefered).then(
			function (data) {
				if(data.status === 'E'){
					$scope.setServiceError(data.response);
				}else{
					$scope.stage_updatecommunication = 3;
				}
			},
			function(errorObject) {
				var msg = codeStatusErrors.errorMessage(errorObject.status);
				$scope.setServiceError(msg);
			}
		);
	};

}]);
