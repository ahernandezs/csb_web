'use strict';

angular.module('spaApp')
  .directive('tc', [function() {
    return {
      restrict: 'E',
      templateUrl: 'views/directives/tc.html'
    };
}]);
