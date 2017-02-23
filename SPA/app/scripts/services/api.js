/**
 * api initializer factory
 */

angular.module('spaApp').factory('api', ['$http', '$rootScope', '$window', function ($http, $rootScope, $window) {

  return {
    init: function (token) {

      if($window.x_session_token) {
        $rootScope.session_token = $window.x_session_token;

        $rootScope.last_access_date = $window.last_access_date
        $rootScope.last_access_media = $window.last_client_application_id;
        $rootScope.client_name = $window.client_name;
      }

      // this is the token of the bank
      $http.defaults.headers.common['X-BANK-TOKEN'] = 4;
      $http.defaults.headers.common['X-AUTH-TOKEN'] = token || $rootScope.session_token;
      $http.defaults.headers.common['X-CLIENT-TYPE'] = 'WEB';
      $http.defaults.headers.common['X-CLIENT-VERSION'] = '1.2.78ce612';
    },
    config: function(){
      //$rootScope.restAPIBaseUrl = $("#linkApiRoot").attr("href");
      $rootScope.restAPIBaseUrl = "http://ci.anzen.io/SBD";
      $rootScope.useMocks = false;
    }
  };
}]);
