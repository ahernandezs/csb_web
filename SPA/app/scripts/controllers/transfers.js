'use strict';

/**
 * The transactions controller. For transactions between own accounts.
 */
angular.module('spaApp').controller('TransfersCtrl', ['$rootScope', '$scope', '$location', '$routeParams', 'accountsProvider', 'userProvider', 'thirdAccountProvider', 'transferProvider', '$controller','paymentCreditCardService', '$filter', 'codeStatusErrors', function ($rootScope, $scope, $location, $routeParams, accountsProvider, userProvider, thirdAccountProvider, transferProvider, $controller,paymentCreditCardService, $filter, codeStatusErrors) {

    function init(){
        $scope.section = 'PAY';
        $scope.selection = 1;
        $scope.payment = {};
        $scope.payment.select1 = false;
        $scope.payment.select2 = false;
        $scope.payment.select3 = false;
        $scope.transfer = {};
        $scope.theAccounts = [];
        $scope.today = new Date();
        obtenerCuentasPropias();
        obtenerCuentasTerceros();
    }

    /**
     * Get the own accounts.
     */
    function obtenerCuentasPropias(){
        accountsProvider.getAccounts().then(
            function(data) {
               $rootScope.accounts.forEach(
                    function (value, index, ar) {

                        value.group = 'Cuentas Propias';
                        switch ( value.account_type ) {
                            case 'DEP':
                                value.displayName = value.name + ' ' + value.masked_account_number + ' - ' + value.currency + ': ' + $filter('currency')(value.current_balance, '$');
                                value.detail = value.name + ' | ' + value.currency + ': ' + $filter('currency')(value.current_balance, '$');
                                $scope.theAccounts.push( value );
                                break;
                            case 'TDC':
                                value.displayName = 'Consubanco - ' + value.name + ' ' + value.masked_account_number + ' - ' + value.currency + ': ' + $filter('currency')(value.current_balance, '$');
                                value.detail = value.name + ' | ' + value.currency + ': ' + $filter('currency')(value.current_balance, '$');
                                $scope.theAccounts.push( value );
                                break;
                            default:
                                break;
                        }
                    }
                );
                if(paymentCreditCardService.accountId){
                    var result = $.grep($scope.theAccounts, function(e){ return e._account_id === paymentCreditCardService.accountId });
                    $scope.payment.destiny = result[0];
                    $scope.payment.destiny.account_type = 'TDC';
                    $scope.payment.destiny._account_id = paymentCreditCardService.accountId;
                    $scope.getAccountDetail();
                    //$scope.value = paymentCreditCardService.paymentType;
                    $scope.payment.type = paymentCreditCardService.paymentType;
                    if(paymentCreditCardService.paymentType === 'TOTAL_PAYMENT')
                        $scope.payment.other = paymentCreditCardService.amount;
                    delete paymentCreditCardService.accountId;
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
    }

    /**
     * Get third party accounts.
     */
    function obtenerCuentasTerceros(){
        if(userProvider.isCompleteUser()){
            thirdAccountProvider.getThirdAccounts().then(
                function(data) {
                    if (typeof data !== 'undefined'){
                        data.forEach(
                            function (value, index, ar) {
                                if ( value.account_type === 'TDC_T' || value.account_type === 'DEB_T' ) {
                                    value.group = 'Cuentas Terceros';
                                    value.displayName = value.bank_name + ' - ' + value.name + ' ' + value.masked_account_number + ' - ' + value.short_name;
                                    value.detail = value.bank_name + ' | ' + value.name;
                                    $scope.theAccounts.push( value );
                                }
                            }
                        );
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
        }
    }

    /**
    * Receive the section value from the UI and change the selection to 1.
    */
    $scope.changeSection = function(newSection) {
        $scope.section = newSection;
        $scope.selection = 1;
        $scope.payment = {};
        $scope.transfer = {};
    };

    /**
     * Evaluate if the destiny should be deleted according to the first account selected by the user.
     */
    $scope.evaluateDestiny = function () {
        if ( $scope.transfer.destiny !== undefined && ($scope.transfer.account._account_id === $scope.transfer.destiny._account_id) )
            delete $scope.transfer.destiny;
    };

    /**
     * Function to navigate between steps. If received a second parameter (true) the objects will be created again.
     */
    $scope.goToStep = function(step, reset) {
        $scope.selection = step;
        if (step === 1) {
           $scope.transfer.otp = '';
            if(reset){
                $scope.payment = {};
                $scope.transfer = {};
                $scope.theAccounts = [];
                obtenerCuentasPropias();
                obtenerCuentasTerceros();

            }
        }
        $scope.updateProgress(step);
    };

    /**
     * Get the detail of the selected account (If own account).
     */
    $scope.getAccountDetail = function() {
        if ( $scope.payment.destiny.account_type === 'TDC' )
            accountsProvider.getAccountDetail($scope.payment.destiny._account_id).then(
                function (data) {
                    $scope.transferAccountDetail = $rootScope.accountDetail.credit_card;
                    delete $rootScope.accountDetail;
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
    * To fill progress bar
    */
    $scope.updateProgress = function(nextStep){
        $scope.currentStep = nextStep;
        var wrapperWidth = document.getElementById("progressWrapper").offsetWidth
        var progressWidth = ((wrapperWidth/3)*nextStep*100)/wrapperWidth
        $scope.stepStyle = {width:progressWidth+"%"}
        //console.log($scope.stepStyle)
    }

    /**
     * Assign the type of payment selected by the user.
     */
    $scope.assignValue = function () {
        $scope.payment.otp="";
        if ( $scope.payment.type && $scope.payment.type === 'MIN_PAYMENT' )
            $scope.payment.amount = $scope.transferAccountDetail.minimum_payment;
        else if ( $scope.payment.type && $scope.payment.type === 'WIHTOUT_INTEREST_PAYMENT' )
            $scope.payment.amount = $scope.transferAccountDetail.no_interes_payment_due;
        else if ( $scope.payment.type && $scope.payment.type === 'TOTAL_PAYMENT' )
            $scope.payment.amount = $scope.payment.other;
        $scope.selection++;
        $scope.updateProgress(2);
    };

    /**
     * Send transfer to own account.
     */
    $scope.sendTransfer = function() {
        resetError();
        if ( $scope.transfer.destiny.account_type === 'DEP' )
            transferOwnAccount();
        else if ( $scope.transfer.destiny.account_type === 'DEB_T' && $scope.transfer.destiny.same_bank )
            transferThirdAccount();
        else if ( !$scope.transfer.destiny.same_bank )
            transferThirdOtherAccount();
    };

    /**
     * Send the transfer to an own account (from CSB to CSB).
     */
    function transferOwnAccount() {
        transferProvider.transferToOwnAccount($scope.transfer.account._account_id, $scope.transfer.destiny._account_id,
                                             $scope.transfer.amount, $scope.transfer.concept).then(
            function(data) {
                $scope.transferId = data._transaction_id;
                $scope.selection = 3;
                $scope.updateProgress(3);
            },
            function(data) {
                var status = data.status;
                var msg = codeStatusErrors.errorMessage(status);
                if (status === 500){
                    $scope.setServiceError(msg + data.response.message);
                } else {
                    $scope.setServiceError(msg);
                }
            }
        );
    };

    /**
     * Send the transfer to a third party account of CSB.
     */
    function transferThirdAccount() {
        transferProvider.transferThirdAccountSameBank($scope.transfer.account._account_id,
                                                     $scope.transfer.destiny._account_id,
                                                     $scope.transfer.amount, $scope.transfer.concept,
                                                     $scope.transfer.otp).then(
            function(data) {
                //console.log(data);
                $scope.transferId = data._transaction_id;
                $scope.selection = 3;
                $scope.updateProgress(3);
            },
            function(data) {
                //console.log(data);
                var status = data.status;
                if(status === 403){
                    $scope.manageOtpErrorMessage(data.response);
                } else {
                    var msg = codeStatusErrors.errorMessage(status);
                    if (status === 500){
                        $scope.setServiceError(msg + data.response.message);
                    } else {
                        $scope.setServiceError(msg);
                    }
                }
            }
        );
    };

    /**
     * Send the transfer to a third party account from another bank.
     */
    function transferThirdOtherAccount() {
        transferProvider.transferThirdAccountOtherBank($scope.transfer.account._account_id,
                                                       $scope.transfer.destiny._account_id,
                                                       $scope.transfer.amount, $scope.transfer.concept,
                                                       $scope.transfer.otp, $scope.transfer.reference,
                                                       $scope.transfer.date).then(
            function(data) {
                //console.log(data);
                $scope.transferId = data.tracking_key;
                $scope.selection = 3;
                $scope.updateProgress(3);
            },
            function(data) {
                //console.log(data);
                var status = data.status;
                if(status === 403){
                    $scope.manageOtpErrorMessage(data.response);
                } else {
                    var msg = codeStatusErrors.errorMessage(status);
                    if (status === 500){
                        $scope.setServiceError(msg + data.response.message);
                    } else {
                        $scope.setServiceError(msg);
                    }
                }
            }
        );
    };

    /**
     * Send payment to service (according to the type of credit card).
     */
    $scope.sendPayment = function() {
        if ( $scope.payment.destiny.account_type === 'TDC' ) {
            payOwnCard();
        } else if ( $scope.payment.destiny.account_type === 'TDC_T') {
            payThirdCard();
        } else {
            $scope.setServiceError('Error de tipo de tarjeta');
        }
    };

    /**
     * pay an own card.
     */
    function payOwnCard(){
        transferProvider.payOwnCard($scope.payment.account._account_id,
                                    $scope.payment.destiny._account_id,
                                    $scope.payment.amount).then(
            function(data) {
                $scope.paymentId = data._transaction_id;
                $scope.selection = 3;
                $scope.updateProgress(3);
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
     * pay a third-card
     */
    function payThirdCard(){
        transferProvider.payThirdCard($scope.payment.account._account_id,
                                    $scope.payment.destiny._account_id,
                                    $scope.payment.amount,
                                    null,
                                    $scope.today,
                                    $scope.payment.otp).then(
            function(data) {
                $scope.paymentId = data._transaction_id;
                $scope.selection = 3;
                $scope.updateProgress(3);
            },
            function(errorObject) {
                var status = errorObject.status;
                if(status === 403){
                    $scope.manageOtpErrorMessage(errorObject.response);
                } else {
                    var msg = codeStatusErrors.errorMessage(status);
                    if (status === 500){
                        $scope.setServiceError(msg + errorObject.response.message);
                    } else {
                        $scope.setServiceError(msg);
                    }
                }
            }
        );
    };

    /**
     * set an error on the page
     */
    function setError(message){
        $scope.error = true;
        $scope.errorMessage = message;
    }

    /**
     * reset the error state to false
     */
    function resetError(){
        $scope.error = false;
        $scope.errorMessage = null;
    }

    /**
     * return true if user has full accesses
     */
    $scope.isCompleteUser = function(){
        return userProvider.isCompleteUser();
    }

    init();

}]);
