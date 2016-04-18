'use strict';

angular.module('spaApp')
  .service('logoutService', ['$rootScope', 'userProvider', 'timerService', '$location', '$http', '$window',
    function($rootScope, userProvider, timerService, $location, $http, $window) {

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
        delete $http.defaults.headers.common['X-AUTH-TOKEN'];
        $rootScope.client_name = '';
        $rootScope.last_access_media = '';
        $rootScope.last_access_date = '';
        $location.path('login');
      };

      this.resetError();

}]);
