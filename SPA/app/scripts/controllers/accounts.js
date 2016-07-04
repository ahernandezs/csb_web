'use strict';

/**
 * The accounts controller. Gets accounts passing auth parameters
 */
 angular.module('spaApp').controller('AccountsCtrl', ['$rootScope', '$scope', '$location', 'accountsProvider', 'codeStatusErrors',
     'ngDialog', '$http', 'userProvider', 'detectIE', function ( $rootScope, $scope, $location, accountsProvider, codeStatusErrors, ngDialog, $http, userProvider, detectIE) {

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
        $scope.returnData.prevType = accountSelected.account_type;

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

    $scope.ask4Token = function (format, id) {
        var browser = detectIE.detect();
        if(browser.ie && browser.version <= 9){
            var urlDoc = "<div class='contenido'> \
                                <h4>AVISO</h4> \
                                <p>La descarga de estados de cuenta no se encuentra disponible para esta versión de su navegador, favor de actualizarlo.</p> \
                            </div> \
                            <div class='contenido gris'> \
                                <button ng-click='closeThisDialog();' class='w47'>Aceptar</button> \
                            </div>";
            ngDialog.open({ template: urlDoc, showClose: false, plain: true });
        }else{
            ngDialog.openConfirm({ template: 'views/partials/token.html', showClose: false }).then(function(otp){

              var type = format === 'XML'?'application/xml':'application/pdf';
              var filename = format === 'XML'?'EstadodeCuenta.xml':'EstadodeCuenta.pdf';

              $http({
                url: $scope.restAPIBaseUrl+'/files/statement?format='+format+'&id='+id+'&otp='+otp,
                method: "GET",
                headers: {
                  'Content-type': 'application/json'
                },
                responseType: 'blob'
              }).success(function (data, status, headers, config) {
                var objectUrl = URL.createObjectURL(data);
                // IE 10 || IE 11
                if ( window.navigator.msSaveOrOpenBlob )
                    window.navigator.msSaveBlob(objectUrl, filename);
                // NOT IE browsers
                else if ( 'download' in document.createElement('a') ) {
                    var a = document.createElement("a");
                    document.body.appendChild(a);
                    a.href = objectUrl;
                    a.download = filename;
                    a.click();
                    window.open(objectUrl);
                // IE 9
                } else
                    window.document.execCommand('SaveAs', null, objectUrl);
              }).error(function (data, status, headers, config) {
                var decodedString = String.fromCharCode.apply(null, new Uint8Array(data));
                var obj = JSON.parse(decodedString);

                if(status === 403){
                  $scope.manageOtpErrorMessage(obj);
                } else {
                  var msg = codeStatusErrors.errorMessage(status);
                  if (status === 500){
                    $scope.setServiceError(msg + obj.message);
                  } else {
                    $scope.setServiceError(msg);
                  }
                }

              });
            })
        }
    };

    $scope.isCompleteUser = function(){
        return userProvider.isCompleteUser();
    }

}]);
