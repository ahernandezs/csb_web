'use strict';

angular.module('spaApp').controller('changePasswordController', ['$scope', 'adminProvider', function ($scope, adminProvider) {

	$scope.stage_password = 1;
	$scope.change = {};
	$scope.errorMessage = '';
	$scope.showError = false;
	$scope.resultChangePass = false;
	$scope.resultErrorPass = false;

	$scope.verifyNewPass = function () {
		if ($scope.change.old === undefined ) {
			$scope.errorMessage = "Ingresa la contraseña actual";
			$scope.error = true;
		} else if ( $scope.change.new === undefined && $scope.change.repeatNew === undefined ) {
			$scope.errorMessage = "La contraseña debe tener de 8 a 10 caracteres, \
					contar con al menos una mayúscula, una minúscula, y un numérico. NO incluir caracteres especiales";
            $scope.error = true;
		} else if ( $scope.change.new !== $scope.change.repeatNew ){
			$scope.errorMessage = "Las contraseñas no coinciden";
            $scope.error = true;
        }else{
			$scope.error = false;
            $scope.stage_password = 2;
        }
    };

	$scope.modifyPassword = function() {
		adminProvider.updatePassword($scope.change.old, $scope.change.new, $scope.change.otp).then(
			function(data){
				$scope.resultChangePass = true;
			},
			function(errorObject) {
				$scope.resultErrorPass = true;
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
		$scope.stage_password = 3;
	};

	$scope.validatePassword = function() {
		$scope.error = false;
		$scope.invalidPassword = true;
		var password = $scope.change.new;

		if(password) {
			var pattern = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/g);
			if(!pattern.test(password)) {
				setError("La contraseña debe tener de 8 a 10 caracteres, \
            contar con al menos una mayúscula, una minúscula, y un numérico. NO incluir caracteres especiales");
				return;
			}

			var repeatedChars = /(.)\1{2,}/;
				if(repeatedChars.test(password)) {
				setError("No puede repetir más de tres caracteres iguales como 111 o aaa");
				return;
			}

			if(consecutivePassword(password)) {
				setError("No puede tener secuencia de caracteres como 123 o abc");
				return;
			}
			$scope.invalidPassword = false;
		}
	}

	$scope.reset = function(){
		$scope.stage_password = 1;
		$scope.change = {};
		$scope.errorMessage = '';
		$scope.showError = false;
		$scope.resultChangePass = false;
		$scope.resultErrorPass = false;
	}

	function setError(errorMessage){
		$scope.error = true;
		$scope.errorMessage = errorMessage;
	};

	function consecutivePassword(password) {
		var charArray = password.split('');

		var isConSeq = false;
		var asciiCode = 0;
		var previousAsciiCode = 0;
		var numSeqcount = 0;

		for(var i = 0; i < password.length; i++) {
			asciiCode = password.charCodeAt(i);
			if((previousAsciiCode + 1) === asciiCode) {
				numSeqcount++;
				if(numSeqcount >= 2) {
					isConSeq = true;
					break;
				}
			} else {
				numSeqcount = 0;
			}
			previousAsciiCode = asciiCode;
		}

		return isConSeq;
	};

}]);
