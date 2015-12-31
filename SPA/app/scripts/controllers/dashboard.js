'use strict';

app.value('userData', false);

/**
 * The accounts controller. Gets accounts passing auth parameters
 */
angular.module('spaApp').controller('DashBoardCtrl', ['$rootScope', '$scope', '$location', '$routeParams', '$window',
    'accountsProvider', 'userProvider', 'timerService', 'logoutService', 'userData', function ($rootScope, $scope, $location, $routeParams, $window, accountsProvider, userProvider, timerService, logoutService, userData) {

	/**
	 * Call service to close session
	 */
	$scope.logout = function( close ) {
       logoutService.closeSession( close );
    };

	if(!$rootScope.session_token) {
		$scope.logout( false );
		return;
	}

  $scope.userData = userData;

	//TODO: temporal binding
	$scope.completeName = $rootScope.client_name;
	$scope.date = $rootScope.last_access_date;
	$scope.showAccountHeader = false;

  if($window.x_session_token) {
    $scope.useLogoutForm = true;
  }

  $scope.hideWelcome = function(){
    app.value('userData', true);
    $scope.userData = true;
  };

  $scope.selectNavigatOption = function(selectedOption) {
    if ( $scope.activeNavigationOption === selectedOption ){
      return;
    } else if ( selectedOption === 'map' ){
      $location.path('map');
    } else{
      $('.wrapper .nav li a').each( function() {
        if ( $(this).attr('id') === selectedOption ) {
          $scope.activeNavigationOption = selectedOption;
          $location.path(selectedOption);
        }
      });
    }
  };

  $scope.isActive = function(viewLocation) {
    return $location.path().indexOf(viewLocation) >= 0;
  };

  $scope.$on('IdleTimeout', function() {
    $scope.showIdleAlert = true;
  });

  $scope.$on('WarningTimeout', function() {
    $scope.logout( true );
  });

  $scope.$on('IdleReset', function() {
    $scope.showIdleAlert = false;
  });
}]);
