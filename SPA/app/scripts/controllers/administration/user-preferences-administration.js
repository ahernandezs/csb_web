'use strict';

/**
 * The accounts controller. Gets accounts passing auth parameters
 */
angular.module('spaApp').controller('UserPreferencesAdministrationController', ['$scope', 'securityTokenProvider', function ($scope, securityTokenProvider) {

	/**
	 * the security-token's state
	 */
	var tokenState;

	/**
	 * used for updatedata
	 */
	$scope.updatedata = {};
	$scope.tokenSynchronizationData = {};

	//$scope.userAdministrationStep = 1;

	initialize();

	/**
	 * intiialize the security-token webflow
	 */
	function initialize(){
		//by default, we go on the change password, cancel digital-bank, change phone-number/email page
		$scope.userAdministrationStep = 1;
		// initialize the diabling-token reasons
		$scope.tokenDisableReasons = [
			{ 'value' : 0 , 'label' : 'CANCELADO'},
			{ 'value' : 1 , 'label' : 'VENCIDO'},
			{ 'value' : 2 , 'label' : 'PERDIDO'},
			{ 'value' : 3 , 'label' : 'REPOSICIÓN'},
			{ 'value' : 4 , 'label' : 'ROBADO'},
			{ 'value' : 5 , 'label' : 'TEMPORALMENTE_SUSPENDIDO'},
			{ 'value' : 6 , 'label' : 'NO_ESPECIFICADO'}
		];
		securityTokenProvider.getUserSecurityTokenState().then(
			function(data){
				tokenState = data.security_token_state;
				//$scope.userAdministrationStep = 2;
			},
			function(data){
				$scope.setServiceError('Error en el servicio, intente más tarde');
			}
		);
	}

 	/**
 	 * goto to the user-preference configuration page
 	 */
	$scope.gotoUserPreferencesPage = function(){
		if($scope.userAdministrationStep!=1) $scope.updatedata.otp = '';
		$scope.userAdministrationStep = 1;
		$scope.stage_updatecommunication = 'stage1';
	};

	/**
 	 * check if the user is on the user-preference configuration page
 	 */
	$scope.isUserPreferencesAdministrationPageActivated = function(){
		return $scope.userAdministrationStep == 1;
	};

	/**
 	 * goto to the security-token configuration page
 	 */
	$scope.gotoTokenAdministrationPage = function(){
		$scope.userAdministrationStep = 2;
		resetTokenActivationData();
		resetTokenSynchronizationData();
		resetTokenDisableData();
	};

	/**
	 * return true if the user's security-toke state is NEW
	 */
	$scope.isSecurityTokenNew= function(){
		return tokenState == 0;
	};

	/**
	 * return true if the user's security-toke state is ENABLED
	 */
	$scope.isSecurityTokenEnabled= function(){
		return tokenState == 1;
	};

	/**
	 * return true if the user's security-toke state is LOCKED
	 */
	$scope.isSecurityTokenLocked= function(){
		return tokenState == 2;
	};

	/**
	 * return true if the user's security-toke state is DISABLED
	 */
	$scope.isSecurityTokenDisabled= function(){
		return tokenState == 3;
	};

	/**
	 * return true if the user's security-toke state could not be retrived (ERROR)
	 */
	$scope.isSecurityTokenError= function(){
		return tokenState == 99;
	};

	/**
 	 * check if the user is on the security-token configuration page
 	 */
	$scope.isUserTokenAdministrationPageActivated = function(){
		return $scope.userAdministrationStep == 2;
	};

	/**
 	 * activate the user's security-token
 	 */
	$scope.activateSecurityToken = function(){
		securityTokenProvider.activateSecurityToken($scope.tokenActivationData.tokenId,
													$scope.tokenActivationData.otp1,
													$scope.tokenActivationData.otp2).then(
			function(data){
				$scope.setServiceError('Su token ha sido activado');
				resetTokenActivationData();
				tokenState = 1;
			},
			function(data){
				$scope.setServiceError('No se pudo activar su token');
				resetTokenActivationData();
			}
		);
	};

	/**
	 * reset the values input by the user for the token activation
	 */
	function resetTokenActivationData(){
		$scope.tokenActivationData = {};
	}


	/**
 	 * synchronize the user's security-token
 	 */
	$scope.synchronizeSecurityToken = function(){
		securityTokenProvider.synchronizeSecurityToken($scope.tokenSynchronizationData.otp1,
													$scope.tokenSynchronizationData.otp2).then(
			function(data){
				$scope.setServiceError('Su token ha sido sincronizado');
				resetTokenSynchronizationData();
			},
			function(data){
				$scope.setServiceError('No se pudo sincronizar su token');
				resetTokenSynchronizationData();
			}
		);

	};

	/**
 	 * synchronize the user's security-token
 	 */
	$scope.disableSecurityToken = function(){
		securityTokenProvider.disableSecurityToken($scope.tokenDisableData.reason.value).then(
			function(data){
				$scope.setServiceError('Su token ha sido desactivado temporalmente');
				resetTokenSynchronizationData();
				tokenState = 3;
			},
			function(data){
				$scope.setServiceError('No se pudo desactivar su token');
			}
		);

	};

	/**
 	 * synchronize the user's security-token
 	 */
	$scope.enableSecurityToken = function(){
		securityTokenProvider.enableSecurityToken().then(
			function(data){
				$scope.setServiceError('Su token ha sido reactivado');
				resetTokenSynchronizationData();
				tokenState = 1;
			},
			function(data){
				$scope.setServiceError('No se pudo reactivar su token');
			}
		);

	};

	/**
	 * reset the values input by the user for the token synchronization
	 */
	function resetTokenSynchronizationData(){
		$scope.tokenSynchronizationData = {};
	}

	/**
	 * reset the values input by the user for the token synchronization
	 */
	function resetTokenDisableData(){
		$scope.tokenDisableData = {};
	}

}]);
