'use strict';

angular.module('spaApp').controller('InvestmentsCtrl', ['$scope',  '$stateParams', 'accountsProvider', '$rootScope', 'codeStatusErrors', function ($scope, $stateParams, accountsProvider, $rootScope, codeStatusErrors) {

    var params = {};
    params.numPage = 0;
    params.size = 100;
    $scope.modify = false;
    $scope.instructions = {"1":"Transferencia a Cuenta Eje","2":"Reinversión de Capital con Pago de interés","3":"Reinversión de Capital e Intereses"}
    $scope.result = {};
    $scope.searchMessage = 'false';

    $scope.searchParams = {};

    accountsProvider.getAccountDetail($stateParams.accountId).then(
        function(data) {
            $scope.investmentHeader = $rootScope.accountDetail.investment;
            $scope.instruction = $scope.investmentHeader.instruction_investment;
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

    /*
     * Assign the new value for the investment instruction.
     */
    $scope.assignInstruction = function( id ) {
      $scope.instruction = id;
    };

    $scope.save = function(){
        accountsProvider.setInstruction($stateParams.accountId, $scope.instruction).then(
            function(data){
                $scope.modify = false;
                $scope.result.success = true;
            },
            function(errorObject) {
                var status = errorObject.status;
                $scope.result.error = true;
                var msg = codeStatusErrors.errorMessage(status);
                if (status === 500){
                    $scope.setServiceError(msg + errorObject.response.message);
                } else {
                    $scope.setServiceError(msg);
                }
            }
        )
    }

}]);
