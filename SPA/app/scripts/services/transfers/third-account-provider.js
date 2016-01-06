'use strict';

angular.module('spaApp')
.factory('thirdAccountProvider', ['$q','thirdAccountService', function ($q, thirdAccountService){
  
  /**
   * the third-accounts-cache
   */
  var thirdAccounts;

  return {

    /**
     * validate a CLABE, account-number, card-number. If it is from Consubanco, the owner's name is returned
     */
    validateThirdAccount: function(account){
      var deferred = $q.defer();
      thirdAccountService.validateThirdAccount(account).then(
        function(response){
          deferred.resolve(response.data);
        }
      ).catch(
        function(response){
          var result = {'response' : response.data, 'status': response.status};
          deferred.reject(result);
        }
      );
      return deferred.promise;
    },

    /**
     * get third-accounts from cache
     */
    getThirdAccounts: function () {
      var deferred = $q.defer();
      if(!thirdAccounts) {
        thirdAccountService.getThirdAcounts().then(
          function(response) {
            thirdAccounts = response.data.third_accounts;
            deferred.resolve(thirdAccounts);
          }
        ).catch(
          function(response) {
            var result = {'response' : response.data, 'status': response.status};
            deferred.reject(result);
          }
        );
      } else {
        deferred.resolve(thirdAccounts);
      }
      return deferred.promise;
    },

    /**
     * register a new third-account. The account-number must be obtained by the validateThirdAccount operation's result
     */
    registerThirdAccount: function(alias, beneficiaryName, e_mail, phone, accountNumber, otp){
      var deferred = $q.defer();
      thirdAccountService.registerThirdAccount(alias, beneficiaryName, e_mail, phone, accountNumber, otp).then(
        function(response){
          return thirdAccountService.getThirdAcounts();
        }
      ).then(
        function(response){
          thirdAccounts = response.data.third_accounts;
          deferred.resolve(thirdAccounts);
        }
      ).catch(
        function(response){
          var result = {'response' : response.data, 'status': response.status};
          deferred.reject(result);
        }
      )
      return deferred.promise;
    },

    /**
     * unregister a third-account
     */
    unregisterThirdAccount:function(thirdAccountID,otp){
      var deferred = $q.defer();
      thirdAccountService.unregisterThirdAccount(thirdAccountID,otp).then(
        function(response){
          return thirdAccountService.getThirdAcounts();
        }
      ).then(
        function(response){
          thirdAccounts = response.data.third_accounts;
          deferred.resolve(thirdAccounts);
        }
      ).catch(function(response){
        var result = {'response' : response.data, 'status': response.status};
        return deferred.reject(result);
      })
      return deferred.promise;
    },

    /**
     * clean the singleton
     */
     clean:function(){
      thirdAccounts = null;
     }
  }
}]);
