'use strict';

angular.module('spaApp').controller('ContactCtrl', ['$rootScope', '$scope',
  '$location', 'timerService', 'logoutService', 'userProvider',
  function ( $rootScope, $scope, $location, timerService, logoutService, userProvider) {

	$scope.conSesion = $rootScope.session_token ? true : false;

  $scope.logout = function() {
    userProvider.logout().then(
      function() {
        timerService.stop();
        $rootScope.session_token = null;
        $location.path('login');
      },
      function(){
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
