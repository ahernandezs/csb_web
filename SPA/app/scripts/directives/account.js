angular.module('spaApp')
  .directive('account', [function() {
    return {
      restrict: 'E',
      templateUrl: 'views/directives/account.html'
    }
}]);
