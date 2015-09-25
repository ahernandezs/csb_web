'use strict';

app.value('userData', false);

/**
 * The accounts controller. Gets accounts passing auth parameters
 */
angular.module('spaApp').controller('DashBoardCtrl', ['$rootScope', '$scope', '$location', '$routeParams', '$window',
    'accountsProvider', 'userProvider', 'timerService', 'logoutService', 'userData', function ($rootScope, $scope, $location, $routeParams, $window, accountsProvider, userProvider, timerService, logoutService, userData) {

  if(!$rootScope.session_token) {
    //console.log("Redirecting to login");
    $location.path('login');
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
  }

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


  $scope.selectNavigatOption = function(selectedOption) {
    if ( $scope.activeNavigationOption === selectedOption )
      return;
    else if ( selectedOption === 'map' )
      $location.path('map');
    else
      $('.wrapper .nav li a').each( function(index) {
        if ( $(this).attr('id') === selectedOption ) {
          $scope.activeNavigationOption = selectedOption;
          $location.path(selectedOption);
        }
      });
  };

  $scope.isActive = function(viewLocation) {
    return $location.path().indexOf(viewLocation) >= 0;
  }

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
