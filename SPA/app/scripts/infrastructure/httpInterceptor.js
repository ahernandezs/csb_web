'use strict';

angular.module('spaApp').factory('httpInterceptor', ['$q', '$window', '$location', '$rootScope', 'timerService',
    function httpInterceptor ($q, $window, $location, $rootScope, timerService) {
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
      // TODO: Seems that in some time we don't get response.status: in this case, the browser sets it to false (or 0)
      //console.log(response);
      $rootScope.requestStack.pop();
      if (!response.status || response.status === 401) {
        //console.log("Response status: "+response.status);
        if(response.status === 401){
          timerService.setTimeout(true);
        }
        $rootScope.session_token = null;
        if($window.x_session_token) {
          $window.x_session_token = null;
          $window.location.href = '#/login';
        }
        // we got a problem here: at this moment, we should clean al the services to remove the user's data
        //the problem is that it is not the correct place to do it (if we import the userProvider here, we have a circular dependency
        // with the $http object). Should we process theses errors in every controller instead of have a unique method in this interceptor ?
         $location.url('/login');
      }
      return $q.reject(response);
    }

  };

}]);
