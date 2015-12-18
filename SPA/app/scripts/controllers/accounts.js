'use strict';

/**
 * The accounts controller. Gets accounts passing auth parameters
 */
 angular.module('spaApp').controller('AccountsCtrl', ['$rootScope', '$scope', '$location', 'accountsProvider', 'codeStatusErrors', 'ngDialog', function ( $rootScope, $scope, $location, accountsProvider, codeStatusErrors, ngDialog) {

    $scope.statementStatus = [];
    $scope.showTDCAccount = false;
    $scope.showInvestmentAccount = false;
    $scope.showSavingAccount = false;
    $scope.showCreditAccount = false;
    $scope.statementData = {};    

    function getAccounts(){
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
    }
    getAccounts();

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
                $location.path('/accounts/'+accountId+'/tdc');//+accountId);
                break;
            case 'INV':
                $location.path('/accounts/'+accountId+'/investment');
                break;
            case 'DEP':
                $location.path('/accounts/'+accountId+'/deposit');
                break;
            case 'CXN':
                $location.path('/accounts/'+accountId+'/credit');
                break;
            default:
                break;
        }
    };

    $scope.returnData = {};

    $scope.closeStatement = function() {
        $scope.activeClass = $scope.returnData.prevId;
        $scope.selectedAcccountId = $scope.returnData.prevId;
        $scope.selectedAccountType = $scope.returnData.prevtType;
        $scope.activeAccountName = $scope.returnData.prevAccount.name + ' ' + $scope.returnData.prevAccount.masked_account_number;
        $scope.investmetCategory = $scope.returnData.prevAccount.category;
        $scope.statementStatus.showStatement = false;

        switch ($scope.returnData.prevType) {
            case 'TDC':
                $location.path('/accounts/' + $scope.returnData.prevId + '/tdc'); //+accountId);
                break;
            case 'INV':
                $location.path('/accounts/' + $scope.returnData.prevId + '/investment');
                break;
            case 'DEP':
                $location.path('/accounts/' + $scope.returnData.prevId + '/deposit');
                break;
            case 'CXN':
                $location.path('/accounts/' + $scope.returnData.prevId + '/credit');
                break;
            default:
                break;
        }
    }

    $scope.ask4Token = function () {
        ngDialog.open({ template: 'views/partials/token.html' });
    };

}]);
