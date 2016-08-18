angular.module('spaApp')
  .directive('timeAccess', ['$interval', 'dateFilter', function($interval, dateFilter) {
    return {
      scope: {
        media: '@',
        date: '@'
      },
      restrict: 'E',
      templateUrl: 'views/directives/time-access.html',
      link: function(scope, element) {
        var timeoutId;
        
        function updateTime() {

          //get this date from server
          var date = new Date();

          scope.last_access_media = scope.media;
          scope.week_day = dateFilter(date,'EEEE');
          scope.day = date.getDate();
          scope.month = dateFilter(date,'MMMM');
          scope.year = date.getFullYear();
          scope.hour = dateFilter(date, 'H:mm:ss');
        }

        element.on('$destroy', function() {
          $interval.cancel(timeoutId);
        });

        timeoutId = $interval(function() {
          updateTime();
        }, 1000);

        updateTime();
    }};
}]);
