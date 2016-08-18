angular.module('spaApp').controller('PortfolioCtrl', ['$rootScope', '$scope', 'accountsProvider', 'productProvider', '$filter', function ($rootScope, $scope, accountsProvider, productProvider, $filter) {

    $scope.ownAccounts = [];
    $scope.depositAccounts = [];
    $scope.vistaAccounts = [];

    function init(){
      obtenListaProductos();
      $scope.obtenCuentas;
    }

    function obtenListaProductos(){
      productProvider.getProductsList().then(
        function(data) {
            $scope.investmentProducts = data.products;
            if(data.investment_vista_allowed){
              $scope.vistaInvestmentAllowed = true;
              $scope.invType = 'VISTA';
            }else{
              $scope.vistaInvestmentAllowed = false;
            }
            if(data.investment_prlv_allowed){
            	$scope.prlvInvestmentAllowed = true;
              if($scope.invType == null){
                 $scope.invType = 'PRLV';
              }
            }else{
              $scope.prlvInvestmentAllowed = false;
            }
            if(data.investment_cede_allowed){
            	$scope.cedeInvestmentAllowed = true;
              if($scope.invType == null){
                 $scope.invType = 'CEDE';
              }
            }else{
              $scope.cedeInvestmentAllowed = false;
              if($scope.invType == null){
                $scope.setServiceError('Ningún producto disponible');
              }
            }
        },
        function(data) {
            var message = data.response.message;
            $scope.setServiceError(message);
        }
      );
    }

    $scope.obtenCuentas = function(){
      $scope.ownAccounts = [];
      $scope.depositAccounts = [];
      $scope.vistaAccounts = [];

      accountsProvider.getAccounts().then(
          function() {
              $rootScope.accounts.forEach(
                  function (value){

                      switch ( value.account_type ) {
                          case 'DEP':
                              value.displayName = value.name + ' ' + value.masked_account_number + ' - ' + value.currency + ': ' + $filter('currency')(value.current_balance, '$');
                              value.detail = value.name + ' | ' + value.currency + ': ' + $filter('currency')(value.current_balance, '$');
                              $scope.ownAccounts.push( value );
                              $scope.depositAccounts.push(value );
                              break;
                          case 'INV':
                              if ( value.category === 'VISTA' ) {
                                  value.displayName = value.name + ' ' + value.masked_account_number + ' - ' + value.currency + ': ' + $filter('currency')(value.current_balance, '$');
                                  value.detail = value.name + ' | ' + value.currency + ': ' + $filter('currency')(value.current_balance, '$');
                                  $scope.vistaAccounts.push(value);
                              }
                              break;
                          default:
                              break;
                      }
                  }
              );
           },
           function(errorObject) {
               var status = errorObject.status;
               if (status === 406) {
                   $scope.setServiceError('datos inválidos');
               } else if(status === 500) {
                   var message = errorObject.response.message;
                   $scope.setServiceError(message);
               } else {
                   $scope.setServiceError('Error en el servicio, intente más tarde');
               }
           }
      );
    }

    /**
     * Assigns the value to the first view to return to and the investment type.
     */
    $scope.change = function(type) {
        $scope.invType = type;
    };

    init();

}]);
