angular.module('spaApp')
.factory('productProvider', ['$q', 'productService', function ($q, productService) {

    var investmentProducts = null;

    return {
      /**
       * get the investment product-list
       */
      getProductsList: function () {
        var deferred = $q.defer();
        if(! investmentProducts) {
          productService.getProductsList().success(function(data) {
            investmentProducts = data;
            deferred.resolve(data);
          }).error(function(data, status) {
            var result = {'response' : data, 'status': status};
            return deferred.reject(result);
          });
        } else {
          deferred.resolve(investmentProducts);
        }
        return deferred.promise;
      },

      /**
       * get a product rate and duration from its identifier and the amount
       */
      getProductDetail: function(productId, amount){
        var deferred = $q.defer();
        productService.getProductDetail(productId, amount).success(function(data){
            data.amount = amount;
            deferred.resolve(data);
        }).error(function(data, status){
            var result = {'response' : data, 'status': status};
            return deferred.reject(result);
        })
        return deferred.promise;
      },

      /**
       * clean the singleton
       */
      clean:function(){
        investmentProducts = null;
      }

    }
  }]);
