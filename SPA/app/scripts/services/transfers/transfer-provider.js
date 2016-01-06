
'use strict';

/**
 * api initializer factory
 */

angular.module('spaApp').factory('transferProvider', ['$rootScope', 'transferService', '$q', function ($rootScope, transferService, $q) {
 return {
    transferToOwnAccount: function (sourceAccount, destinationAccount, amount, description) {
      var deferred = $q.defer();
        transferService.transferToOwnAccount(sourceAccount, destinationAccount, amount, description).success(
        function(data, status, headers) {
          deferred.resolve(data);
        }).error(
          function(data, status) {
            var result = {'response' : data, 'status': status};
            return deferred.reject(result);
          }
        );
        return deferred.promise;
    },

    transferThirdAccountSameBank: function (sourceAccount, destinationAccount, amount, description, otp) {
        var deferred = $q.defer();
         transferService.transferThirdAccountSameBank(sourceAccount, destinationAccount, amount, description, otp).success(
       function(data, status, headers) {
          deferred.resolve(data);
      }).error(
       function(data, status) {
          var result = {'response' : data, 'status': status};
          return deferred.reject(result);
       }
      );
        return deferred.promise;
     },

     transferThirdAccountOtherBank: function (sourceAccount, destinationAccount, amount, description, otp, referenceNumber, completionDate) {
        var deferred = $q.defer();
         transferService.transferThirdAccountOtherBank(sourceAccount, destinationAccount, amount, description, otp, referenceNumber, completionDate).success(
       function(data, status, headers) {
          deferred.resolve(data);
      }).error(
       function(data, status) {
          var result = {'response' : data, 'status': status};
          return deferred.reject(result);
       }
      );
        return deferred.promise;
     },

     payOwnCard: function (sourceAccount, cardAccount, amount, description, date) {
        var deferred = $q.defer();
         transferService.payOwnCard(sourceAccount, cardAccount, amount, description, date).success(
       function(data, status, headers) {
          deferred.resolve(data);
      }).error(
       function(data, status) {
          var result = {'response' : data, 'status': status};
          return deferred.reject(result);
       }
      );
        return deferred.promise;
     },

     payThirdCard: function (sourceAccount, cardAccount, amount, description, date, otp) {
        var deferred = $q.defer();
         transferService.payThirdCard(sourceAccount, cardAccount, amount, description, date, otp).success(
       function(data, status, headers) {
          deferred.resolve(data);
      }).error(
       function(data, status) {
          var result = {'response' : data, 'status': status};
          return deferred.reject(result);
       }
      );
        return deferred.promise;
     },

     investVista: function (sourceAccount, destinationVistaAccount, amount) {
        var deferred = $q.defer();
         transferService.investVista(sourceAccount, destinationVistaAccount, amount).success(
       function(data, status, headers) {
          deferred.resolve(data);
      }).error(
       function(data, status) {
          var result = {'response' : data, 'status': status};
          return deferred.reject(result);
       }
      );
        return deferred.promise;
     },

     retireVista: function (sourceVistaAccount, destinationAccount, amount) {
        var deferred = $q.defer();
         transferService.retireVista(sourceVistaAccount, destinationAccount, amount).success(
       function(data, status, headers) {
          deferred.resolve(data);
      }).error(
       function(data, status) {
          var result = {'response' : data, 'status': status};
          return deferred.reject(result);
       }
      );
        return deferred.promise;
     },

     investCEDE: function (sourceAccount, productId, amount, investAgain) {
        var deferred = $q.defer();
         transferService.investCEDE(sourceAccount, productId, amount, investAgain).success(
       function(data, status, headers) {
          deferred.resolve(data);
      }).error(
       function(data, status) {
          var result = {'response' : data, 'status': status};
          return deferred.reject(result);
       }
      );
        return deferred.promise;
     },

     investPRLV: function (sourceAccount, productId, amount, investAgain) {
        var deferred = $q.defer();
         transferService.investPRLV(sourceAccount, productId, amount, investAgain).success(
       function(data, status, headers) {
          deferred.resolve(data);
      }).error(
       function(data, status) {
          var result = {'response' : data, 'status': status};
          return deferred.reject(result);
       }
      );
        return deferred.promise;
     }
 };
}]);
