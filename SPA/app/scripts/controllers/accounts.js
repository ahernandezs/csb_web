'use strict';

/**
 * The accounts controller. Gets accounts passing auth parameters
 */
 angular.module('spaApp').controller('AccountsCtrl', ['$rootScope', '$scope', '$location', 'accountsProvider', 'codeStatusErrors', function ( $rootScope, $scope, $location, accountsProvider, codeStatusErrors) {

    $scope.statementStatus = [];
    $scope.showTDCAccount = false;
    $scope.showInvestmentAccount = false;
    $scope.showSavingAccount = false;
    $scope.showCreditAccount = false;
	  accountsProvider.getAccounts().then(
          function(data) {
            $scope.accounts = $rootScope.accounts;
            $scope.selectNavigatOption('accounts');
            $scope.selectAccount( $scope.accounts[0]);
            verifyExistAccount();
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

    function verifyExistAccount(){
        var length=$scope.accounts.length;
        for(var i=0 ;i < length ; i++){
            switch($scope.accounts[i].account_type){
                case 'TDC' : $scope.showTDCAccount = true;
                break;
                case 'INV' : $scope.showInvestmentAccount = true;
                break;
                case 'DEP' : $scope.showSavingAccount = true;
                break;
                case 'CXN' : $scope.showCreditAccount = true;
                break;
            }
        }
    }


    $scope.selectAccount = function(accountSelected) {

    var accountId = accountSelected._account_id;
    var type = accountSelected.account_type;

    $scope.activeClass = accountId;
    $scope.selectedAcccountId = accountId;
    $scope.selectedAccountType = type;
    $scope.activeAccountName = accountSelected.name + ' ' + accountSelected.masked_account_number;
    $scope.investmetCategory = accountSelected.category;
    $scope.statementStatus.showStatement = false;

    $scope.returnData.prevAccount = accountSelected;
    $scope.returnData.prevId = accountSelected._account_id;
    $scope.returnData.prevType = accountSelected.account_type


    switch (type) {
        case 'TDC':
            //console.log('Tarjeta de Credito');
            $location.path('accounts/'+accountId+'/tdc');//+accountId);
            //console.log($location.path());
            break;
        case 'INV':
            //console.log('Inversiones');
            $location.path('/accounts/'+accountId+'/investment');
            //console.log($location.path());
            break;
        case 'DEP':
            //console.log('Cuentas');
            $location.path('/accounts/'+accountId+'/deposit');
            //console.log($location.path());
            break;
        case 'CXN':
            //console.log('Creditos');
            $location.path('/accounts/'+accountId+'/credit');
            //console.log($location.path());
            break;
        default:
            break;
    }
  };

    $scope.returnData = {};

    $scope.closeStatement = function() {
        //console.log($scope.returnData)

        $scope.activeClass = $scope.returnData.prevId;
        $scope.selectedAcccountId = $scope.returnData.prevId;
        $scope.selectedAccountType = $scope.returnData.prevtType;
        $scope.activeAccountName = $scope.returnData.prevAccount.name + ' ' + $scope.returnData.prevAccount.masked_account_number;
        $scope.investmetCategory = $scope.returnData.prevAccount.category;
        $scope.statementStatus.showStatement = false;

        switch ($scope.returnData.prevType) {
            case 'TDC':
                //console.log('Tarjeta de Credito');
                $location.path('accounts/' + $scope.returnData.prevId + '/tdc'); //+accountId);
                //console.log($location.path());
                break;
            case 'INV':
                //console.log('Inversiones');
                $location.path('/accounts/' + $scope.returnData.prevId + '/investment');
                //console.log($location.path());
                break;
            case 'DEP':
                //console.log('Cuentas');
                $location.path('/accounts/' + $scope.returnData.prevId + '/deposit');
                //console.log($location.path());
                break;
            case 'CXN':
                //console.log('Creditos');
                $location.path('/accounts/' + $scope.returnData.prevId + '/credit');
                //console.log($location.path());
                break;
            default:
                break;
        }
    }

}]);
