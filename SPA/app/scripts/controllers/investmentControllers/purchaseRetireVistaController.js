'use strict';

/**
 * The transactions controller. For transactions between own accounts.
 */
angular.module('spaApp').controller('purchaseRetireVistaCtrl', ['$scope', 'transferProvider', 'accountsProvider', 'codeStatusErrors', function ($scope, transferProvider, accountsProvider, codeStatusErrors) {

    $scope.investmentCategory = null;
    initialize();

    $scope.investment.vistaAccount = '';
    $scope.investment.depositAccount = '';

    function initialize(){
        $scope.step = 1;
        $scope.investment = [];
        $scope.investment.vistaAccount = '';
        $scope.investment.depositAccount = '';
        $scope.investmentResult = [];
        resetError();
        $scope.obtenCuentas();
    }

    /**
     * set an error message on the current view
     */
    function setError(message){
        $scope.errorMessage = message;
        $scope.error = true;
    }

    /**
     * reset the error status to null
     */
    function resetError(){
        $scope.error = false;
    }

    /**
     * Goes back one step.
     */
    $scope.goBack = function() {
        $scope.step--;
    };

    /**
     * process a Rest-API onvocation error
     */
    function processServiceError(errorObject){
        var status = errorObject.status;
        var msg = codeStatusErrors.errorMessage(status);
        if (status === 500){
            $scope.setServiceError(msg + errorObject.response.message);
        } else {
            // $scope.setServiceError('Ha ocurrido un problema, favor de contactar al servicio de atención al cliente');
            $scope.setServiceError(msg);
        }
    }

    /**
     * Function to navigate between steps.
	 */
	$scope.gotToConfirmation = function() {
        resetError();
        $scope.step++;
        $scope.today = new Date().getTime();
	 };

    /**
     * Function to navigate between steps.
     */
    $scope.reset = function() {
        initialize();
    };

     /**
      * launch the purchase Vista investment operation
      */
    $scope.purchaseInvestment = function(){
        resetError();
        transferProvider.investVista($scope.investment.depositAccount._account_id, $scope.investment.vistaAccount._account_id, $scope.investment.amount).then(
            function processServiceSuccess(data) {
                $scope.investmentResult = [];
                $scope.investmentResult.account_number = data.account_number;
                $scope.investmentResult.expiration_date = data.expiration_date;
                $scope.step++;
            },
            processServiceError
        );
    }

    /**
      * launch the retire Vista investment operation
      */
    $scope.retireInvestment = function(){
        resetError();
        transferProvider.retireVista($scope.investment.vistaAccount._account_id, $scope.investment.depositAccount._account_id, $scope.investment.amount).then(
            function(data){
                $scope.step++;
            },
            processServiceError
        );
    }

}]);
