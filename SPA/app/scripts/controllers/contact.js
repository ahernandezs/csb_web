angular.module('spaApp').controller('ContactCtrl', ['$rootScope', '$scope', 'logoutService',
  function ( $rootScope, $scope, logoutService) {

	$scope.conSesion = $rootScope.session_token ? true : false;

	$scope.logout = function() {
		logoutService.closeSession( true );
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
