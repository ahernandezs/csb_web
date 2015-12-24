'use strict';

angular.module('spaApp')
  .directive('credits', [function() {
    return {
      restrict: 'E',
      templateUrl: 'views/directives/credits.html'
    };
}]);
