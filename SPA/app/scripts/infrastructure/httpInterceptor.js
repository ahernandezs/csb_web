angular.module('spaApp').factory('httpInterceptor', ['$q', '$window', '$location', '$rootScope', 'timerService',
    function($q, $window, $location, $rootScope, timerService) {
  return {
    'request': function (request) {
      $rootScope.requestStack.push(1);

      return request;
    },
    'response': function (response) {
      if($rootScope.session_token) {
        timerService.reset();
      }

      $rootScope.requestStack.pop();

      return response;
    },

    'responseError': function (response) {
      $rootScope.requestStack.pop();
      if (!response.status || response.status === 401) {
        if(response.status === 401){
          timerService.setTimeout(true);
        }
        $rootScope.session_token = null;
        if($window.x_session_token) {
          $window.x_session_token = null;
          $window.location.href = '#/login';
        }
        $location.url('/login');
      }
      return $q.reject(response);
    }

  };

}]);
