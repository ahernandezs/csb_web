'use strict';

angular.module('spaApp')
  .service('logoutService', ['$rootScope', 'userProvider', 'timerService', '$location', '$http',
    function($rootScope, userProvider, timerService, $location, $http) {

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
              options.hasError = true;
          });
          timerService.stop();
          $rootScope.session_token = null;
        }
        $rootScope = "";
        $http.defaults.headers.common = "";
        $location.path('login');
      };

      this.resetError();

}]);
