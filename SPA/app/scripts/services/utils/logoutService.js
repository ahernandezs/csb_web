'use strict';

angular.module('spaApp')
  .service('logoutService', ['$rootScope', 'userProvider', 'timerService', '$location',
    function($rootScope, userProvider, timerService, $location) {

      var options = [];

      this.hasError = function() {
        return options.hasError;
      };

      this.displayErrorMessage = function(){
        options.hasError = true;
      };

      this.resetError = function(){
        options.hasError = false;
        options.message = null;
      };

      this.closeSession = function( close ) {
        if ( close ) {
          userProvider.logout().then(
            function() {

            }, function() {
              displayErrorMessage();
          });
          timerService.stop();
          $rootScope.session_token = null;
        }
        $location.path('login');
      };

      this.resetError();

}]);
