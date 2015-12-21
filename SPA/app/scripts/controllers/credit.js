'use strict';

angular.module('spaApp').controller('creditCtrl', ['$scope', '$stateParams', 'accountsProvider', '$rootScope', 'codeStatusErrors', function ($scope, $stateParams, accountsProvider, $rootScope, codeStatusErrors) {

	var params = {};
	params.numPage = 0;
	params.size = 100;
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

	$scope.searchParams = {};
	$scope.searchMessage = 'false';

	accountsProvider.getAccountDetail($scope.selectedAcccountId).then(
		function(data) {
			$scope.creditsHeader = $rootScope.accountDetail;
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

	accountsProvider.getTransactions($scope.selectedAcccountId, params).then(
		function(data){
			$scope.creditTransactions = $rootScope.transactions;
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

	$scope.getTransactions = function(date_start, date_end){
		params.date_end = date_end;
		params.date_start = date_start;
		accountsProvider.getTransactions($scope.selectedAcccountId, params).then(
			function(data){
				$scope.creditTransactions = $rootScope.transactions;
				$scope.searchMessage = 'true';
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

	$scope.clearMessage = function() {
		$scope.searchMessage = 'false';
	};

	$scope.search = function() {
		var todaysDate = new Date();
		var startDate;
		var endDate;
		if ($scope.searchParams.date_start !== undefined){
			var fecha = $scope.searchParams.date_start.split("/");
			startDate = new Date(fecha[2], fecha[1]-1, fecha[0]);
		}
		if ($scope.searchParams.date_end !== undefined){
			var fecha = $scope.searchParams.date_end.split("/");
			endDate = new Date(fecha[2], fecha[1]-1, fecha[0])
		}
		if($scope.searchParams.date_start && $scope.searchParams.date_end) {
			if (startDate > todaysDate || endDate > todaysDate){
				$scope.setServiceError('Búsqueda no realizada: Fecha Inicial y/o Fecha Final NO pueden ser posteriores a la Fecha de Hoy');
				return;
			}
			if (startDate > endDate) {
				$scope.setServiceError('Búsqueda no realizada: Fecha Inicial debe ser anterior a la Fecha Final');
				return;
			}
			$scope.getTransactions($scope.searchParams.date_start, $scope.searchParams.date_end);
			return;
		}
		if($scope.searchParams.date_start === null && $scope.searchParams.date_end === null) {
			params.date_end = null;
			params.date_start = null;
			accountsProvider.getTransactions($scope.selectedAcccountId, params).then(
				function(data){
					$scope.investmentTransactions = $rootScope.transactions;
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

	$scope.getStatements = function(){
		$scope.statementStatus.showStatement = true;
		accountsProvider.getStates($stateParams.accountId).then(
			function(data) {
				$scope.statements = $rootScope.statements;
			},
			function(errorObject) {
				var status = errorObject.status;
				var msg = codeStatusErrors.errorMessage(status);
				if(status === 500){
					$scope.setServiceError(msg + errorObject.response.message);
				} else {
					$scope.setServiceError(msg);
				}
			}
		);
	};

}]);
