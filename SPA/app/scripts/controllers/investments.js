'use strict';

angular.module('spaApp').controller('InvestmentsCtrl', ['$scope',  '$stateParams', 'accountsProvider', '$rootScope', 'codeStatusErrors', function ($scope, $stateParams, accountsProvider, $rootScope, codeStatusErrors) {

    var params = {};
    params.numPage = 0;
    params.size = 100;
    $scope.modify = {};
	$scope.modify.show = false;
    $scope.instructions = [];
    $scope.result = {};
    $scope.searchMessage = 'false';

    $scope.searchParams = {};

	$scope.loadDetail = function() {
		accountsProvider.getAccountDetail($stateParams.accountId).then(
	        function(data) {
	            $scope.investmentHeader = $rootScope.accountDetail.investment;
	            if(typeof $scope.investmentHeader.instruction_investment !== 'undefined'){
	                $scope.instructions = $scope.investmentHeader.instruction_investment;
	                $scope.instruction = $scope.instructions.ins_inv_to_print;
	            }
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

	$scope.loadDetail();

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

    $scope.getTransactions = function(date_start, date_end){
        params.date_end = date_end;
        params.date_start = date_start;
        accountsProvider.getTransactions($scope.selectedAcccountId, params).then(
            function(data){
                $scope.investmentTransactions = $rootScope.transactions;
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
        var fecha;
        if ($scope.searchParams.date_start !== undefined){
            fecha = $scope.searchParams.date_start.split('/');
            startDate = new Date(fecha[2], fecha[1]-1, fecha[0]);
        }
        if ($scope.searchParams.date_end !== undefined){
            fecha = $scope.searchParams.date_end.split('/');
            endDate = new Date(fecha[2], fecha[1]-1, fecha[0]);
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

    /*
     * Assign the new value for the investment instruction.
     */
    $scope.assignInstruction = function( selection, show ) {
		$scope.modify.show = show;
		$scope.result.success = false;
		$scope.result.error = false;
        $scope.instruction = selection;
        if ( $scope.instruction.ins_inv_id == 1 || $scope.instruction.ins_inv_id == 2 )
            $scope.getEjeAccounts();
    };

    $scope.getEjeAccounts = function() {
		if ( typeof $scope.ejeAccount == 'object' )
			return;

        $scope.ejeAccount = {};
        accountsProvider.getAccounts('DEP').then(
            function(data) {
                $scope.ejeAccounts = $rootScope.accounts;
                $scope.ejeAccount = $scope.ejeAccounts[0];
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

    $scope.assignEjeAccount = function( account ) {
        $scope.ejeAccount = account;
    };

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

    $scope.save = function(){
      accountsProvider.updateInstructionInvestment($stateParams.accountId, $scope.instruction.ins_inv_id, $scope.ejeAccount._account_id).then(
        function(data){
          $scope.modify.show = false;
          $scope.result.success = true;
		  $scope.loadDetail();
        },
        function(errorObject) {
          var status = errorObject.status;
          $scope.result.error = true;
          var msg = codeStatusErrors.errorMessage(status);
          if (status === 500)
            $scope.setServiceError(msg + errorObject.response.message);
          else
            $scope.setServiceError(msg);
        }
      );
    };

}]);
