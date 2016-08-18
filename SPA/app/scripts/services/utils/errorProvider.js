angular.module('spaApp')
  .factory('errorProvider', ['errorService', '$q', function (errorService, $q) {

    return {
      getErrors: function(){
        var deferred = $q.defer();
        errorService.getErrors().success(function(data) {
          return deferred.resolve(data);
        }).error(function(data, status) {
          var result = {'response' : data, 'status': status};
          return deferred.reject(result);
        });
        return deferred.promise;
      }
    };

}]);
