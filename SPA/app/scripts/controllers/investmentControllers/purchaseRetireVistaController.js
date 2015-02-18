'use strict';

/**
 * The transactions controller. For transactions between own accounts.
 */
angular.module('spaApp').controller('purchaseRetireVistaCtrl', ['$rootScope', '$scope', '$location', '$routeParams', 'accountsProvider', 'transferProvider', function ($rootScope, $scope, $location, $routeParams, accountsProvider, transferProvider) {


    $scope.investmentCategory = null;

    initialize();

    function initialize(){
        //TODO: the accounts shoud come from the provider
        $scope.depositAccounts = [];
        $scope.vistaAccounts = [];
        for (var index = 0; index < $rootScope.accounts.length; ++index) {
            var account = $rootScope.accounts[index];
            if(account.account_type === 'DEP'){
                $scope.depositAccounts.push(account);
            }else if( account.account_type === 'INV' && account.category === 'VISTA'){
                $scope.vistaAccounts.push(account);
            }
        }
        $scope.step = 1;
        $scope.investment = [];
        $scope.investmentResult = [];
        resetError();
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
     * process a Rest-API invocation success
     */
    function processServiceSuccess(data) {
        $scope.investmentResult = [];
        $scope.investmentResult.account_number = data.account_number;
        $scope.investmentResult.expiration_date = data.expiration_date;
        if(data.interest != null){
            $scope.investmentResult.interestInfo =[];
            $scope.investmentResult.interestInfo.operation_date = data.interest.operation_date;
            $scope.investmentResult.interestInfo.amount = data.interest.amount;
        }
        $scope.step++;
    }

    /**
     * process a Rest-API onvocation error
     */
    function processServiceError(errorObject){
        var status = errorObject.status;
        if(status === 406){
            setError('invalid input');
        }else if(status === 500){
            setError('El servicio no está disponible. Favor de intentar más tarde');
        }else{
            setError('A occurrido un problema . Favor de intentar más tarde');
        }
        var data = errorObject.data;
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
    $scope.cancel = function() {
        initialize();
    };

     /**
      * launch the investment operation
      */
    $scope.purchaseInvestment = function(){
        resetError();
        transferProvider.investVista($scope.investment.depositAccount._account_id, $scope.investment.vistaAccount._account_id, $scope.investment.amount).then(
            processServiceSuccess,
            processServiceError
        );
    }

}]);
