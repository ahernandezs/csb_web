'use strict';

/**
 * The accounts controller. Gets accounts passing auth parameters
 */
angular.module('spaApp').controller('ContactCtrl', ['$rootScope', '$scope',
  '$location', 'accountsProvider', 'codeStatusErrors', 'timerService', 'logoutService', 'userProvider',
  function ( $rootScope, $scope, $location, accountsProvider, codeStatusErrors, timerService, logoutService, userProvider) {

	$scope.conSesion = $rootScope.session_token ? true : false;

  /**
    Function for logout application
  **/
  $scope.logout = function() {
    userProvider.logout().then(
      function(data) {
        timerService.stop();
        $rootScope.session_token = null;
        $location.path('login');
      },
      function(data){
        logoutService.displayErrorMessage();
        timerService.stop();
        $rootScope.session_token = null;
        $location.path('login');
      });
  };

  $scope.$on('IdleTimeout', function() {
    $scope.showIdleAlert = true;
  });

  $scope.$on('WarningTimeout', function() {
    $scope.logout();
  });

  $scope.$on('IdleReset', function() {
    $scope.showIdleAlert = false;
  });
}]);
