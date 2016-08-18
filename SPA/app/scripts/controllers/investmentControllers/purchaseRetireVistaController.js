/**
 * The transactions controller. For transactions between own accounts.
 */
angular.module('spaApp').controller('purchaseRetireVistaCtrl', ['$scope', 'transferProvider', 'codeStatusErrors', function ($scope, transferProvider, codeStatusErrors) {

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
        $scope.updateProgress(2);
	 };

    /**
     * Function to navigate between steps.
     */
    $scope.reset = function() {
        initialize();
        $scope.updateProgress(1);
    };

     /**
      * launch the purchase Vista investment operation
      */
    $scope.purchaseInvestment = function(){
        resetError();
        transferProvider.investVista($scope.investment.depositAccount._account_id, $scope.investment.vistaAccount._account_id, $scope.investment.amount).then(
            function(data) {
                $scope.investmentResult = [];
                $scope.investmentResult.account_number = data.account_number;
                $scope.investmentResult.expiration_date = data.expiration_date;
                $scope.step++;
            },
            processServiceError
        );
        $scope.updateProgress(3);
    }

    /**
      * launch the retire Vista investment operation
      */
    $scope.retireInvestment = function(){
        resetError();
        transferProvider.retireVista($scope.investment.vistaAccount._account_id, $scope.investment.depositAccount._account_id, $scope.investment.amount).then(
            function(){
                $scope.step++;
            },
            processServiceError
        );
        $scope.updateProgress(3);
    }
    $scope.updateProgress = function(nextStep){
        $scope.currentStep = nextStep;
        var wrapperWidth = document.getElementById("progressWrapper").offsetWidth
        var progressWidth = ((wrapperWidth/3)*nextStep*100)/wrapperWidth
        $scope.stepStyle = {width:progressWidth+"%"}
        //console.log($scope.stepStyle)
    }

}]);
