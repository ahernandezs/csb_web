angular.module('spaApp').controller('changePasswordController', ['$scope', 'adminProvider', 'codeStatusErrors', function ($scope, adminProvider, codeStatusErrors) {

	$scope.errorMessage = '';
	$scope.showError = false;
	$scope.resultChangePass = false;
	$scope.resultErrorPass = false;

	$scope.verifyNewPass = function () {
		if (passwordIncludesName($scope.change.new)){
			setError('La contraseña no puede contener tu nombre ni apellidos');
		} else if ($scope.change.old === undefined ) {
			setError('Ingresa la contraseña actual');
		} else if ( $scope.change.new === undefined && $scope.change.repeatNew === undefined ) {
			setError('La contraseña debe tener de 8 a 15 caracteres, contar con al menos una mayúscula, una minúscula, y un numérico. NO incluir caracteres especiales');
		} else if ( $scope.change.new !== $scope.change.repeatNew ){
			setError('Las contraseñas no coinciden');
		} else{
			$scope.changeCrtl.changeError = false;
			$scope.changeCrtl.changeStep = 2;
		}
	};

	$scope.modifyPassword = function() {
		adminProvider.updatePassword($scope.change.old, $scope.change.new, $scope.change.otp).then(
			function(){
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
		$scope.changeCrtl.changeStep = 3;
	};

	$scope.validatePassword = function() {
		$scope.changeCrtl.changeError = false;
		$scope.invalidPassword = true;
		var password = $scope.change.new;

		if(password) {
			var pattern = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/g);
			if(!pattern.test(password)) {
				setError('La contraseña debe tener de 8 a 15 caracteres, contar con al menos una mayúscula, una minúscula, y un numérico. NO incluir caracteres especiales');
				return;
			}

			var repeatedChars = /(.)\1{2,}/;
				if(repeatedChars.test(password)) {
				setError('No puede repetir más de tres caracteres iguales como 111 o aaa');
				return;
			}

			if(consecutivePassword(password)) {
				setError('No puede tener secuencia de caracteres como 123 o abc');
				return;
			}
			$scope.invalidPassword = false;
		}
	}

	function setError(errorMessage){
		$scope.changeCrtl.changeError = true;
		$scope.errorMessage = errorMessage;
	};

	function consecutivePassword(password) {
		var isConSeq = false;
		var previousAsciiCode = 0;
		var numSeqcount = 0;
		var asciiCode;

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

	function passwordIncludesName(password){
	    var name= $scope.completeName;
	    var res = name.split(" ");
	    var upper = password.toUpperCase();
	    for(var i=0 ; i<res.length ; i++){
	      if(res[i].length > 2){
	        var separateName=res[i].toUpperCase();
	        if (upper.includes(separateName)) {
	          return true;
	        }
	      }
	    }
	    return false;
	};

}]);
