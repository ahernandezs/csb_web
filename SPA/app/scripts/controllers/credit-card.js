'use strict';

/**
 * The credit card controller.
 */
angular.module('spaApp').controller('creditCardCtrl', ['$scope', '$location', '$stateParams', 'accountsProvider', '$rootScope', '$http','paymentCreditCardService', 'codeStatusErrors', function ($scope, $location, $stateParams, accountsProvider, $rootScope, $http, paymentCreditCardService, codeStatusErrors) {

	var params = {};
	params.numPage = 0;
	params.size = 100;
	$scope.statementStatus.showStatement = false;
	$scope.previousPeriod = false;
	$scope.years = [
		{ label: '2014', value: 2014 },
		{ label: '2013', value: 2013 },
		{ label: '2012', value: 2012 }
	];
	$scope.months = [
		{ label: 'Enero', value: 1 },
		{ label: 'Febrero', value: 2 },
		{ label: 'Marzo', value: 3 },
		{ label: 'Abril', value: 4 },
		{ label: 'Mayo', value: 5 },
		{ label: 'Junio', value: 6 },
		{ label: 'Julio', value: 7 },
		{ label: 'Agosto', value: 8 },
		{ label: 'Septiembre', value: 9 },
		{ label: 'Octubre', value: 10 },
		{ label: 'Noviembre', value: 11 },
		{ label: 'Diciembre', value: 12 }
	];
	$scope.year = $scope.years[0];
	$scope.searchMessage = 'false';

	accountsProvider.getAccountDetail($stateParams.accountId).then(
		function(data) {
			$scope.creditsHeader = $rootScope.accountDetail.credit_card;
		},
		function(errorObject) {
			var status = errorObject.status;
	        var msg = codeStatusErrors.errorMessage(status);
			if (status === 500){
            	$scope.setServiceError(msg + errorObject.response.message);
        	} else {
        		$scope.setServiceError(msg);
        	}
		}
	);

	accountsProvider.getTransactions($scope.selectedAcccountId == null ? $stateParams.accountId : $scope.selectedAcccountId, params).then(
		function(data){
			$scope.creditCardTransactions = $rootScope.transactions;
		},
		function(errorObject) {
			var status = errorObject.status;
	        var msg = codeStatusErrors.errorMessage(status);
			if (status === 500){
            	$scope.setServiceError(msg + errorObject.response.message);
        	} else {
        		$scope.setServiceError(msg);
        	}
		}
	);

	$scope.getStatements = function(){
		$scope.statementStatus.showStatement = true
		accountsProvider.getStates($stateParams.accountId).then(
			function(data) {
				$scope.statements = $rootScope.statements;
			},
			function(errorObject) {
				var status = errorObject.status;
		        var msg = codeStatusErrors.errorMessage(status);
				if (status === 500){
	            	$scope.setServiceError(msg + errorObject.response.message);
	        	} else {
	        		$scope.setServiceError(msg);
	        	}
			}
		);
	};

	/**
     * Display the search message.
     */
    $scope.displayMessage = function() {
        $scope.searchMessage = 'true';
    };

	/**
     * Hide the search message.
     */
    $scope.clearMessage = function() {
        $scope.searchMessage = 'false';
    };

	$scope.back = function(){
		$scope.statementStatus.showStatement = true;
	};

	$scope.getTransactions = function(previousPeriod){
		if($scope.previousPeriod !== previousPeriod) {
			$scope.previousPeriod = previousPeriod;
			params.previousPeriod = previousPeriod;
			accountsProvider.getTransactions($scope.selectedAcccountId, params).then(
				function(data){
					$scope.creditCardTransactions = $rootScope.transactions;
				},
				function(errorObject) {
					var status = errorObject.status;
			        var msg = codeStatusErrors.errorMessage(status);
					if (status === 500){
		            	$scope.setServiceError(msg + errorObject.response.message);
		        	} else {
		        		$scope.setServiceError(msg);
		        	}
				}
			);
		}
	};

	/**
	Function for invoke payment flow  and set navigation bar .
	**/
	$scope.doPaymentFlow = function(type,minPayment){
		$scope.selectNavigatOption('transfers');
        paymentCreditCardService.prepForShared({ accountId:$stateParams.accountId , amount:minPayment, paymentType: type  });
	};
}]);

/**
* Service for share information between controllers .
**/
angular.module('spaApp').factory('paymentCreditCardService', function() {
    var account = {};
    account.accountId;
    account.amount;
    account.paymentType;

    account.prepForShared = function(msg) {
        this.accountId = msg.accountId;
        this.amount = msg.amount;
        this.paymentType = msg.paymentType;
    };

    return account;
});
