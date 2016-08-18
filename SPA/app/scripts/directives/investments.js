angular.module('spaApp')
  .directive('investments', [function() {
    return {
      restrict: 'E',
      templateUrl: 'views/directives/investments.html'
    }
}]);
