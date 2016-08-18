angular.module('spaApp')
  .service('errorService', ['$http', function($http){

    this.getErrors = function(){
      return $http.get('/scripts/msj.json');
    };

}]);
