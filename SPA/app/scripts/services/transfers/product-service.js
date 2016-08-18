angular.module('spaApp')
.service('productService', ['$http','$rootScope',function ($http, $rootScope) {
	
	/**
	 * get the product-list
	 */
	this.getProductsList = function(){
		return $http({
			url: $rootScope.restAPIBaseUrl+'/products',
			method: 'GET',
			headers: {'Content-Type': 'application/json','X-AUTH-TOKEN': $http.defaults.headers.common['X-AUTH-TOKEN'] }
		});
	},

	/**
	 * get the product rate and duration depending on the amount invested
	 */
	this.getProductDetail = function(productId, amount){
		return $http({
			url: $rootScope.restAPIBaseUrl+'/products/'+productId+'?amount='+amount,
			method: 'GET',
			headers: {'Content-Type': 'application/json','X-AUTH-TOKEN': $http.defaults.headers.common['X-AUTH-TOKEN'] }
		});
	}

}]);
