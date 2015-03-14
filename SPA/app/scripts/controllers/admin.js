'use strict';

angular.module('spaApp').controller('AdminCtrl', ['$rootScope', '$scope', 'adminProvider', '$location', 'userProvider', 'thirdAccountProvider', function ($rootScope, $scope, adminProvider, $location, userProvider, thirdAccountProvider) {

	//if the user has full access, the default page is the configuration one. otherwise it is the contract-information page
	if(userProvider.isCompleteUser()){
		$scope.adminOpt = 4;
	}else{
		$scope.adminOpt = 5;
	}

	$scope.selection = 1;
	$scope.action = 1;
	$scope.data = {otp:''}
    $scope.stage = 1;
    $scope.change = {};
    $scope.stage_password = 1;
    $scope.beneficiary = {};
	$scope.stage_updatecommunication = 1;
	$scope.today = new Date();

	loadBeneficiary();

	$scope.selectBeneficiary = function(account){
		$scope.action = 2;
		$scope.stage = 1;
		$scope.selectedAccount = account;
	}

	$scope.siguiente = function(){
		$scope.stage += 1;
	}

	$scope.regresar = function(){
		$scope.action = 1;
		$scope.stage = 1;
	}

	/**
	 * delete a third-account
	 */
	$scope.delete = function(){
		thirdAccountProvider.deleteAccount($scope.selectedAccount._account_id, $scope.delete.otp).then(
			function(data){
				dispatchThirdAccountByType(data);
			},
			function(errorObject) {
				var status = errorObject.status;
		        if(status === 406){
		            $scope.setServiceError('datos inválidos');
		        }else if(status === 500){
		            var message = errorObject.response.message;
		            $scope.setServiceError(message);
		        }else if(status === 403){
					$scope.setServiceError('otp inválido');
			    }else{
			    	$scope.setServiceError('Error en el servicio, intente más tarde');
		        }
			}
		);
	}

	/**
	 * dispatch the third-account by their type (if they are from Consubanco or not)
	 */
	function dispatchThirdAccountByType(data){
		$scope.third_accounts = data;
		var third_accounts_own = [];
		var third_accounts_others = [];
		if (typeof $scope.third_accounts != 'undefined'){
			$scope.third_accounts.forEach(function(acc){
				if(acc.same_bank){
					third_accounts_own.push(acc);
				}else{
					third_accounts_others.push(acc);
				}
			});
		}
		$scope.third_accounts_own = third_accounts_own;
		$scope.third_accounts_others = third_accounts_others;
	}

	/**
	 * get the third-account when initializing the controller.
	 */
	function loadBeneficiary(){
		thirdAccountProvider.getThirdAccounts().then(
			function(data) {
				dispatchThirdAccountByType(data);
			},function(errorObject) {
				var status = errorObject.status;
		        if(status === 406){
		            $scope.setServiceError('datos inválidos');
		        }else if(status === 500){
		            var message = errorObject.response.message;
		            $scope.setServiceError(message);
		        }else{
		            $scope.setServiceError('Error en el servicio, intente más tarde');
		        }
			}
		)
	};

    /**
     * Evaluates if the new passwords are equals.
     */
    $scope.verifyNewPass = function () {
        if ( $scope.change.new !== $scope.change.repeatNew ){
            $scope.errorMessage = "Las contraseñas no coinciden";
            $scope.showError = true;
        }else{
            $scope.stage_password = 2;
        }
    };

	/**
	 * Validate Email from updateCommunication and goes one step forward.
	 */
	$scope.validateEmail = function () {
		$scope.stage_updatecommunication += 1;
	};

	/**
	 * Go back one step in the updateCommunication flow.
	 */
	$scope.goBack = function () {
		$scope.stage_updatecommunication -= 1;
	};

	/**
	 * Update the communication information.
	 */
	$scope.sendCommunication = function () {
		adminProvider.updateCommunication($scope.data.phone, $scope.data.e_mail, $scope.data.otp).then(
			function (data) {
				console.log('Communication data updated successfully');
			}
		);
		$scope.stage_updatecommunication += 1;
	};

    /**
     * Send the new password to the service.
     */
    $scope.modifyPassword = function() {
        adminProvider.updatePassword($scope.change.old, $scope.change.new, $scope.change.otp).then(
        	function(data){
	            console.log('Password modified correctly');
	        },
	        function(errorObject) {
				var status = errorObject.status;
		        if(status === 406){
		            $scope.setServiceError('datos inválidos');
		        }else if(status === 500){
		            var message = errorObject.response.message;
		            $scope.setServiceError(message);
		        }else if(status === 403){
		            $scope.setServiceError('otp inválido');
		        }else{
		            $scope.setServiceError('Error en el servicio, intente más tarde');
		        }
			}
		);
        $scope.stage_password = 3;
    };

    /**
     * return true if user has full accesses
     */
    $scope.isCompleteUser = function(){
        return userProvider.isCompleteUser();
    };


/**********************
Adding a beneficary actions
**********************/

	$scope.addBeneficary = function(){
		$scope.action = 3;
	}

    $scope.completeStep = function(nextStep) {
		$scope.selection = nextStep;
		if (nextStep === 1) {
			$scope.beneficiary = {};
			$scope.payment = {};
			$scope.transfer = {};
		}
	 };

    $scope.validateThirdAccount = function(){
        thirdAccountProvider.validateThirdAccount($scope.beneficiary.account).then(
            function(data) {
                console.log(JSON.stringify(data));
                $scope.beneficiary._account_id = data._account_id;
                $scope.beneficiary.bank_name = data.bank_name;
                $scope.beneficiary.same_bank = data.same_bank;
                if($scope.beneficiary.same_bank){
                    $scope.beneficiary.name = data.client_name;
                }
                $scope.selection = 2;
            },
	        function(errorObject) {
				var status = errorObject.status;
		        if(status === 406){
		            $scope.setServiceError('datos inválidos');
		        }else if(status === 500){
		            var message = errorObject.response.message;
		            $scope.setServiceError(message);
		        }else{
		            $scope.setServiceError('Error en el servicio, intente más tarde');
		        }
			}
        );
    }

    $scope.sendBeneficiary = function() {
        // account = 18 digitos (002123456789012347) y token correcto
        thirdAccountProvider.registerThirdAccount($scope.beneficiary.aka, $scope.beneficiary.name,
                                                 $scope.beneficiary.email, $scope.beneficiary.phone,
                                                 $scope.beneficiary._account_id, $scope.beneficiary.token).then(
            function(data) {
                dispatchThirdAccountByType(data);
                $scope.selection = 4;
            },
	        function(errorObject) {
				var status = errorObject.status;
		        if(status === 406){
		            $scope.setServiceError('datos inválidos');
		        }else if(status === 500){
		            var message = errorObject.response.message;
		            $scope.setServiceError(message);
		        }else if(status === 403){
		            $scope.setServiceError('otp inválido');
		        }else{
		            $scope.setServiceError('Error en el servicio, intente más tarde');
		        }
			}
        );
    };


}]);
